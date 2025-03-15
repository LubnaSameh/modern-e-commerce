import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { MongoClient } from "mongodb";

// Added version to track deployment
export const VERSION = "1.0.1";

export async function GET() {
    const startTime = Date.now();
    const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV;
    const environment = {
        isVercel,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV || 'Not set',
        vercelRegion: process.env.VERCEL_REGION || 'Not set',
        vercelUrl: process.env.VERCEL_URL || 'Not set',
        version: VERSION
    };

    console.log("🔍 VERCEL DB HEALTH CHECK INITIATED - v" + VERSION);
    console.log(`Environment: ${JSON.stringify(environment)}`);

    // Test results object
    const results = {
        timestamp: new Date().toISOString(),
        success: false,
        environment,
        version: VERSION,
        dbDetails: {},
        connectionTests: [],
        errors: [],
        totalTime: 0
    };

    try {
        // Step 1: Test the connection through our connectToDatabase function
        console.log("Step 1: Testing database connection through standard utility");

        try {
            const connectionStart = Date.now();
            const { db } = await connectToDatabase();
            const connectionTime = Date.now() - connectionStart;

            results.connectionTests.push({
                name: "Standard connection",
                success: true,
                time: `${connectionTime}ms`
            });

            console.log(`✅ Connected to database: ${db.databaseName} in ${connectionTime}ms`);

            // Get database info
            const collections = await db.listCollections().toArray();
            const collectionNames = collections.map(c => c.name);

            results.dbDetails = {
                name: db.databaseName,
                collections: collectionNames,
                totalCollections: collectionNames.length
            };

            // Test ping command
            const pingStart = Date.now();
            await db.command({ ping: 1 });
            const pingTime = Date.now() - pingStart;

            results.connectionTests.push({
                name: "Database ping",
                success: true,
                time: `${pingTime}ms`
            });

            console.log(`✅ Database ping successful in ${pingTime}ms`);

            // Test products collection
            if (collectionNames.includes("products")) {
                const productsStart = Date.now();
                const products = await db.collection("products").countDocuments();
                const productsTime = Date.now() - productsStart;

                results.connectionTests.push({
                    name: "Products collection access",
                    success: true,
                    time: `${productsTime}ms`,
                    count: products
                });

                results.dbDetails.productCount = products;
                console.log(`✅ Found ${products} products in ${productsTime}ms`);
            } else {
                results.connectionTests.push({
                    name: "Products collection access",
                    success: false,
                    error: "Products collection not found"
                });

                results.errors.push("Products collection not found in database");
                console.warn("⚠️ Products collection not found");
            }

            // Success!
            results.success = true;

        } catch (error) {
            console.error("❌ Standard connection test failed:", error);

            results.connectionTests.push({
                name: "Standard connection",
                success: false,
                error: error.message
            });

            results.errors.push({
                phase: "Standard connection",
                type: error.name,
                message: error.message,
                stack: error.stack
            });

            // Don't throw here, continue with direct test
        }

        // Step 2: Try a direct connection as fallback if the first one failed
        if (!results.success) {
            console.log("Step 2: Attempting direct MongoDB connection");

            try {
                const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
                const dbName = process.env.MONGODB_DB_NAME || 'e-commerce';

                if (!uri) {
                    throw new Error("MongoDB connection string is missing");
                }

                // Connection options optimized for Vercel
                const options = {
                    serverSelectionTimeoutMS: 90000,
                    connectTimeoutMS: 90000,
                    socketTimeoutMS: 90000,
                    maxPoolSize: 5,
                    minPoolSize: 0,
                    ssl: true,
                    retryWrites: true,
                    w: 'majority',
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                };

                const directStart = Date.now();
                const client = await MongoClient.connect(uri, options);
                const db = client.db(dbName);
                const directTime = Date.now() - directStart;

                results.connectionTests.push({
                    name: "Direct connection",
                    success: true,
                    time: `${directTime}ms`
                });

                // Only gather this info if we don't have it yet
                if (!results.dbDetails.name) {
                    const collections = await db.listCollections().toArray();
                    const collectionNames = collections.map(c => c.name);

                    results.dbDetails = {
                        name: db.databaseName,
                        collections: collectionNames,
                        totalCollections: collectionNames.length
                    };
                }

                await client.close();
                console.log(`✅ Direct connection successful in ${directTime}ms`);

                // If we got here, at least this connection worked
                results.success = true;

            } catch (error) {
                console.error("❌ Direct connection test also failed:", error);

                results.connectionTests.push({
                    name: "Direct connection",
                    success: false,
                    error: error.message
                });

                results.errors.push({
                    phase: "Direct connection",
                    type: error.name,
                    message: error.message,
                    stack: error.stack
                });
            }
        }

        // Calculate total time
        results.totalTime = `${Date.now() - startTime}ms`;

        // Add diagnostic info
        results.diagnostics = {
            connectionString: process.env.MONGODB_URI ?
                `${process.env.MONGODB_URI.substring(0, 20)}...` :
                'Not available',
            ipAddress: await getIpAddress(),
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(results);

    } catch (error) {
        console.error("❌ DB Health check failed with critical error:", error);

        // Calculate total time even for failures
        results.totalTime = `${Date.now() - startTime}ms`;

        results.errors.push({
            phase: "Main health check",
            type: error.name,
            message: error.message,
            stack: error.stack
        });

        return NextResponse.json(results, { status: 500 });
    }
}

// Helper to get the current IP address
async function getIpAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Error getting IP address:", error);
        return "Error getting IP";
    }
} 