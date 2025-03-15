import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// This is a public endpoint that doesn't require authentication
export async function GET() {
    const startTime = Date.now();
    const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV;
    const isProduction = process.env.NODE_ENV === 'production';

    try {
        console.log("🔵 Public MongoDB Test");

        // Get connection details
        const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
        const dbName = process.env.MONGODB_DB_NAME || "e-commerce";

        if (!uri) {
            throw new Error("MongoDB connection string missing");
        }

        // Vercel-optimized connection options
        const options = {
            serverSelectionTimeoutMS: 60000,
            connectTimeoutMS: 60000,
            socketTimeoutMS: 60000,
            maxPoolSize: 10,
            minPoolSize: 0,
            ssl: true,
            retryWrites: true,
            w: 'majority'
        };

        // Connect directly
        const client = await MongoClient.connect(uri, options);
        const db = client.db(dbName);

        // Get basic collection info
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        await client.close();

        // Return successful response
        return NextResponse.json({
            ok: true,
            time: Date.now() - startTime,
            env: isProduction ? 'production' : 'development',
            vercel: isVercel,
            collections: collectionNames
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
        });
    } catch (error) {
        console.error("❌ MongoDB connection test failed:", error);

        return NextResponse.json({
            ok: false,
            error: error.message,
            time: Date.now() - startTime
        }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
        });
    }
} 