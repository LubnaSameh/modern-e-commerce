import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Define error type
interface MongoError extends Error {
    name: string;
    message: string;
    stack?: string;
}

export async function GET() {
    const startTime = Date.now();
    const result = {
        timestamp: new Date().toISOString(),
        success: false,
        message: "",
        details: {},
        timeTaken: 0,
        environment: {
            NODE_ENV: process.env.NODE_ENV,
            VERCEL_ENV: process.env.VERCEL_ENV || 'Not set',
            VERCEL_REGION: process.env.VERCEL_REGION || 'Not set'
        }
    };

    try {
        // Get MongoDB connection string
        const uri = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI;
        const dbName = process.env.MONGODB_DB_NAME || 'e-commerce';

        if (!uri) {
            throw new Error('MongoDB connection string not found in environment variables');
        }

        console.log(`Attempting to connect to MongoDB: ${uri.substring(0, 20)}...`);

        // Connection options
        const options = {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000
        };

        // Connect directly (no cached connection)
        const client = await MongoClient.connect(uri, options);
        const db = client.db(dbName);

        // Test with a simple command
        await db.command({ ping: 1 });

        // Get collection information
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        // Close connection
        await client.close();

        // Update result with success info
        result.success = true;
        result.message = "Successfully connected to MongoDB";
        result.details = {
            database: dbName,
            collections: collectionNames,
            collectionCount: collectionNames.length
        };
    } catch (error: unknown) {
        console.error('MongoDB connection error:', error);

        const mongoError = error as MongoError;

        result.success = false;
        result.message = "Failed to connect to MongoDB";
        result.details = {
            errorType: mongoError.name,
            errorMessage: mongoError.message,
            stack: mongoError.stack
        };
    }

    // Calculate time taken
    result.timeTaken = Date.now() - startTime;

    return NextResponse.json(result);
} 