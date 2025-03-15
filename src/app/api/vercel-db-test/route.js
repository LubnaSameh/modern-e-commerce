import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
    const startTime = Date.now();
    const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV;
    const isProduction = process.env.NODE_ENV === 'production';

    try {
        console.log("🧪 Vercel MongoDB Connection Test");
        console.log(`Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} | Vercel: ${isVercel ? 'YES' : 'NO'}`);

        // Get connection details from environment
        const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
        const dbName = process.env.MONGODB_DB_NAME || "e-commerce";

        if (!uri) {
            throw new Error("MongoDB connection string missing - check environment variables");
        }

        console.log(`- Database Name: ${dbName}`);
        console.log(`- Connection URI (masked): ${uri.substring(0, 15)}...${uri.substring(uri.length - 5)}`);

        // Vercel-optimized connection options
        const options = {
            serverSelectionTimeoutMS: 60000,  // Extended timeout
            connectTimeoutMS: 60000,
            socketTimeoutMS: 60000,
            maxPoolSize: 10,  // Reduced for serverless
            minPoolSize: 0,
            ssl: true,
            retryWrites: true,
            w: 'majority'
        };

        // Create direct connection (no caching)
        console.log("Attempting direct connection to MongoDB...");
        const client = await MongoClient.connect(uri, options);
        console.log("✅ MongoDB connection established!");

        // Access database
        const db = client.db(dbName);
        console.log(`✅ Connected to database: ${db.databaseName}`);

        // Get collection information
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        // Check for products collection
        const hasProductsCollection = collectionNames.includes("products");
        let productCount = 0;

        if (hasProductsCollection) {
            productCount = await db.collection("products").countDocuments();
            console.log(`✅ Products collection found with ${productCount} documents`);
        } else {
            console.log("⚠️ Products collection not found!");
        }

        // Close connection gracefully
        await client.close();
        console.log("Connection closed properly");

        // Create response with connection details
        const connectionTime = Date.now() - startTime;

        return NextResponse.json({
            success: true,
            message: "MongoDB connection test successful",
            environment: {
                isProduction,
                isVercel,
                nodeEnv: process.env.NODE_ENV,
                vercelEnv: process.env.VERCEL_ENV || 'Not set',
                vercelRegion: process.env.VERCEL_REGION || 'Not set'
            },
            connection: {
                time: `${connectionTime}ms`,
                database: dbName,
                collectionsCount: collectionNames.length,
                collections: collectionNames
            },
            products: {
                collectionExists: hasProductsCollection,
                count: productCount
            }
        });
    } catch (error) {
        console.error("❌ MongoDB connection test failed:", error);

        // Detailed error response
        return NextResponse.json({
            success: false,
            message: "MongoDB connection test failed",
            environment: {
                isProduction,
                isVercel,
                nodeEnv: process.env.NODE_ENV,
                vercelEnv: process.env.VERCEL_ENV || 'Not set',
                vercelRegion: process.env.VERCEL_REGION || 'Not set'
            },
            error: {
                name: error.name,
                message: error.message,
                code: error.code || 'Unknown'
            },
            troubleshooting: {
                ipWhitelist: "Ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas",
                credentials: "Verify MongoDB username and password are correct",
                vercelEnv: "Check that all environment variables are set in Vercel dashboard",
                connectionString: "Verify the connection string format is correct"
            },
            timeTaken: `${Date.now() - startTime}ms`
        }, { status: 500 });
    }
} 