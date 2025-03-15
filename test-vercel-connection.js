// Test script for diagnosing MongoDB connection issues in Vercel
require('dotenv').config({ path: '.env.production' });
const { MongoClient } = require('mongodb');

// Get connection string from environment
const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'e-commerce';

// Log environment info
console.log('Environment Information:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- Database Name: ${dbName}`);
console.log(`- Connection URI (first 20 chars): ${uri ? uri.substring(0, 20) + '...' : 'undefined'}`);

// Connection options optimized for Vercel
const options = {
    serverSelectionTimeoutMS: 60000,  // Increased timeout for Vercel
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000,
    maxPoolSize: 10,  // Reduced for Vercel's serverless environment
    minPoolSize: 0,
    ssl: true,
    retryWrites: true,
    w: 'majority'
};

async function testConnection() {
    console.log('Starting MongoDB connection test...');
    let client = null;

    try {
        console.log('Attempting to connect...');
        client = await MongoClient.connect(uri, options);
        console.log('✅ Successfully connected to MongoDB Atlas!');

        const db = client.db(dbName);
        console.log(`✅ Connected to database: ${db.databaseName}`);

        // Test collections access
        const collections = await db.listCollections().toArray();
        console.log(`Found ${collections.length} collections:`);
        collections.forEach((collection, i) => {
            console.log(`   ${i + 1}. ${collection.name}`);
        });

        // Check for products collection
        const hasProducts = collections.some(c => c.name === 'products');
        if (hasProducts) {
            const productsCount = await db.collection('products').countDocuments();
            console.log(`✅ Products collection has ${productsCount} documents`);
        } else {
            console.log('⚠️ Products collection does not exist!');
        }

        return true;
    } catch (error) {
        console.error('❌ Connection failed:', error);
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);

        if (error.name === 'MongoServerSelectionError') {
            console.error('This may be due to IP restrictions or network issues.');
            console.error('Check if your current IP is whitelisted in MongoDB Atlas.');
        }

        return false;
    } finally {
        if (client) {
            await client.close();
            console.log('Connection closed');
        }
    }
}

// Run the test
testConnection()
    .then(success => {
        console.log(`Test ${success ? 'PASSED' : 'FAILED'}`);
        process.exit(success ? 0 : 1);
    })
    .catch(err => {
        console.error('Unexpected error:', err);
        process.exit(1);
    }); 