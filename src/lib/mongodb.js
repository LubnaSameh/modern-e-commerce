import { MongoClient } from 'mongodb';

// Cache object for global scope to prevent multiple connections
const globalForMongo = global;

// Ensure we have a mongodb object in the global scope
globalForMongo.mongodb = globalForMongo.mongodb || {};

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV;
console.log(`🌐 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} | Vercel: ${isVercel ? 'YES' : 'NO'}`);

// Get DB connection info
let url;
let dbName;

// Choose connection based on environment
if (isProduction) {
    url = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
    dbName = process.env.MONGODB_DB_NAME || 'e-commerce';
    console.log(`Using production MongoDB connection: ${url ? url.substring(0, 20) + '...' : 'undefined'}`);
} else {
    url = process.env.MONGODB_URI;
    dbName = process.env.MONGODB_DB_NAME || 'e-commerce';
    console.log(`Using development MongoDB connection: ${url ? url.substring(0, 20) + '...' : 'undefined'}`);
}

// Store cached connection for reuse
let cachedClient = globalForMongo.mongodb.client;
let cachedDb = globalForMongo.mongodb.db;

if (!url) {
    const errorMessage = 'Missing MongoDB connection string (MONGODB_URI or MONGODB_ATLAS_URI). Check your environment variables.';
    console.error(`❌ ${errorMessage}`);
    throw new Error(errorMessage);
}

let connectionRetryCount = 0;
const MAX_RETRY_COUNT = 3;

export async function connectToDatabase() {
    // Return existing connection if available
    if (cachedClient && cachedDb) {
        console.log('♻️ Using cached database connection');
        return { client: cachedClient, db: cachedDb };
    }

    // Prevent multiple simultaneous connection attempts
    if (globalForMongo.mongodb.isConnecting) {
        console.log('🔄 Waiting for existing connection attempt...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return connectToDatabase();
    }

    // Create new connection
    try {
        globalForMongo.mongodb.isConnecting = true;
        console.log(`🔌 Connecting to database (${isProduction ? 'production' : 'development'})...`);

        // Connection options optimized for Vercel
        const options = {
            // Core settings - increased timeouts for Vercel
            serverSelectionTimeoutMS: 90000, // Increased timeout for Vercel
            connectTimeoutMS: 90000, // Increased from 60000
            socketTimeoutMS: 90000, // Increased from 60000
            // Connection pool settings - smaller for serverless
            maxPoolSize: isVercel ? 5 : 50, // Reduced pool size for Vercel
            minPoolSize: 0,
            // SSL settings
            ssl: true,
            // Production-optimized settings
            retryWrites: true,
            w: 'majority',
            // Added for improved reliability
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        console.log(`🔌 Connecting with options: ${JSON.stringify(options, null, 2)}`);

        // Vercel-specific logging
        if (isVercel) {
            console.log('📊 Vercel Deployment Info:');
            console.log(`- VERCEL_ENV: ${process.env.VERCEL_ENV || 'Not set'}`);
            console.log(`- VERCEL_REGION: ${process.env.VERCEL_REGION || 'Not set'}`);
        }

        // Add connection retry logic
        let client;
        try {
            // Connect with optimized options
            client = await MongoClient.connect(url, options);
        } catch (initialError) {
            console.error('❌ Initial connection attempt failed:', initialError);

            // Try one more time with a direct connection string
            if (connectionRetryCount < MAX_RETRY_COUNT) {
                connectionRetryCount++;
                console.log(`Retrying connection (attempt ${connectionRetryCount}/${MAX_RETRY_COUNT})...`);

                // Short delay before retry
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Try again with the same options
                client = await MongoClient.connect(url, options);
            } else {
                throw initialError;
            }
        }

        const db = client.db(dbName);
        console.log(`✅ Connected to database: ${db.databaseName}`);

        // Reset retry count on successful connection
        connectionRetryCount = 0;

        // Cache the connection globally
        cachedClient = client;
        cachedDb = db;
        globalForMongo.mongodb.client = client;
        globalForMongo.mongodb.db = db;
        globalForMongo.mongodb.isConnecting = false;

        // Add shutdown handler for graceful close
        if (!isVercel) { // Skip in Vercel serverless - not needed
            process.on('SIGINT', () => {
                console.log('🔌 Closing MongoDB connection before shutdown');
                client.close();
                process.exit(0);
            });
        }

        return { client, db };
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        globalForMongo.mongodb.isConnecting = false;

        // Enhanced error logging
        console.error(`
    🔍 Connection Error Details:
    - Error Type: ${error.name}
    - Error Message: ${error.message}
    - MongoDB URI (first part): ${url ? url.substring(0, 20) + '...' : 'undefined'}
    - Database Name: ${dbName}
    - Environment: ${isProduction ? 'Production' : 'Development'}
    - Vercel: ${isVercel ? 'Yes' : 'No'}
    - Retry Count: ${connectionRetryCount}/${MAX_RETRY_COUNT}
    `);

        // Specific error handling advice
        if (error.name === 'MongoServerSelectionError') {
            console.error(`
      ⚠️ Server Selection Error - Most common causes:
      1. IP Address not whitelisted in MongoDB Atlas
      2. Network connectivity issues
      3. MongoDB Atlas username/password incorrect
      
      👉 For Vercel deployments:
      - Add 0.0.0.0/0 to the IP whitelist in MongoDB Atlas
      - Verify that environment variables are set correctly in Vercel
      - Check MongoDB Atlas status at https://status.mongodb.com/
      `);
        }

        throw error;
    }
}

// Helper function to access collections
export async function getCollection(collectionName) {
    try {
        console.log(`🔍 Attempting to get collection: ${collectionName}`);

        const startTime = Date.now();
        const { db } = await connectToDatabase();
        const endTime = Date.now();

        console.log(`✅ Successfully accessed collection ${collectionName} in ${endTime - startTime}ms`);
        return db.collection(collectionName);
    } catch (error) {
        // Enhanced error reporting for Vercel
        console.error(`❌ Error accessing collection ${collectionName}:`, error);
        console.error(`💡 Collection Error Details - Type: ${error.name}, Message: ${error.message}`);

        if (isVercel) {
            console.error(`
            🔴 Vercel Collection Access Error:
            - Collection: ${collectionName}
            - Error Type: ${error.name}
            - Error Message: ${error.message}
            - Stack: ${error.stack}
            - Environment: ${process.env.VERCEL_ENV || 'Unknown'}
            - Region: ${process.env.VERCEL_REGION || 'Unknown'}
            - IP Whitelist: Check if 0.0.0.0/0 is allowed in MongoDB Atlas
            `);
        }

        throw new Error(`Database connection failed: ${error.message}`);
    }
}

// Helper function to get current IP address
async function getIpAddress() {
    try {
        return "Check your current IP address";
    } catch (error) {
        return "Unknown";
    }
} 