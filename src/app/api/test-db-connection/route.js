import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
    try {
        console.log("🧪 Testing MongoDB Atlas connection...");

        // Get the connection string from environment variables
        const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
        const dbName = process.env.MONGODB_DB_NAME || "e-commerce";

        if (!uri) {
            throw new Error("MongoDB connection string (MONGODB_ATLAS_URI or MONGODB_URI) is missing");
        }

        console.log(`🔌 Connecting to MongoDB Atlas - URI: ${uri.substring(0, 20)}...`);

        // Connection options
        const options = {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 50,
            minPoolSize: 5
        };

        // Create direct client connection (not using the cached connection)
        const client = await MongoClient.connect(uri, options);
        console.log("✅ MongoDB connection established successfully");

        // Get database reference
        const db = client.db(dbName);

        // Test by getting collection list
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        // Check if the products collection exists
        const hasProductsCollection = collectionNames.includes("products");

        // If products collection exists, count documents
        let productCount = 0;
        if (hasProductsCollection) {
            productCount = await db.collection("products").countDocuments();
        }

        // Close the connection
        await client.close();
        console.log("🔒 MongoDB connection closed");

        // Return success response
        return NextResponse.json({
            success: true,
            message: "MongoDB Atlas connection test successful",
            databaseInfo: {
                name: dbName,
                collections: collectionNames,
                totalCollections: collectionNames.length
            },
            productsInfo: {
                hasProductsCollection,
                productCount
            },
            connectionDetails: {
                uri: uri.substring(0, 20) + "..." // Only show beginning for security
            }
        });
    } catch (error) {
        console.error("❌ MongoDB connection test failed:", error);

        // Create detailed error response
        return NextResponse.json({
            success: false,
            message: "MongoDB Atlas connection test failed",
            error: {
                name: error.name,
                message: error.message,
                code: error.code
            },
            troubleshooting: {
                checkIpWhitelist: "Make sure your IP address is whitelisted in MongoDB Atlas",
                checkCredentials: "Verify username and password in connection string",
                checkNetwork: "Check network connectivity to MongoDB Atlas",
                atlasStatus: "Check MongoDB Atlas status at https://status.mongodb.com/"
            }
        }, { status: 500 });
    }
} 