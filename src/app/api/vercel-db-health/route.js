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
        }

        // Calculate total time
        results.totalTime = `${Date.now() - startTime}ms`;

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