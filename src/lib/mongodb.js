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
            // Core settings
            serverSelectionTimeoutMS: isVercel ? 60000 : 30000, // Longer timeout for Vercel
            connectTimeoutMS: isVercel ? 60000 : 30000,
            socketTimeoutMS: isVercel ? 60000 : 45000,
            // Connection pool settings - smaller for serverless
            maxPoolSize: isVercel ? 10 : 50,
            minPoolSize: isVercel ? 0 : 5,
            // SSL settings
            ssl: true,
            // Production-optimized settings
            retryWrites: true,
            w: 'majority'
        };

        console.log(`🔌 Connecting with options: ${JSON.stringify(options, null, 2)}`);

        // Vercel-specific logging
        if (isVercel) {
            console.log('📊 Vercel Deployment Info:');
            console.log(`- VERCEL_ENV: ${process.env.VERCEL_ENV || 'Not set'}`);
            console.log(`- VERCEL_REGION: ${process.env.VERCEL_REGION || 'Not set'}`);
        }

        // Connect with optimized options
        const client = await MongoClient.connect(url, options);
        const db = client.db(dbName);
        console.log(`✅ Connected to database: ${db.databaseName}`);

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
        const { db } = await connectToDatabase();
        return db.collection(collectionName);
    } catch (error) {
        console.error(`❌ Error accessing collection ${collectionName}:`, error);
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