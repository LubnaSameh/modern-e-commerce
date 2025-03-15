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
let url = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
let dbName = process.env.MONGODB_DB_NAME || 'e-commerce';

console.log(`Using MongoDB connection: ${url ? url.substring(0, 20) + '...' : 'undefined'}`);

// Store cached connection for reuse
let cachedClient = globalForMongo.mongodb.client;
let cachedDb = globalForMongo.mongodb.db;

if (!url) {
    const errorMessage = 'Missing MongoDB connection string. Check your environment variables.';
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
        console.log(`🔌 Connecting to database...`);

        // Simplified connection options
        const options = {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: isVercel ? 5 : 50,
            minPoolSize: 0,
            ssl: true
        };

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

        throw error;
    }
}

// Helper function to access collections
export async function getCollection(collectionName) {
    try {
        console.log(`🔍 Getting collection: ${collectionName}`);
        const { db } = await connectToDatabase();
        return db.collection(collectionName);
    } catch (error) {
        console.error(`❌ Error accessing collection ${collectionName}:`, error);
        throw new Error(`Database connection failed: ${error.message}`);
    }
} 