import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        status: "success",
        message: "API test endpoint is working",
        timestamp: new Date().toISOString(),
        environment: {
            NODE_ENV: process.env.NODE_ENV,
            VERCEL_ENV: process.env.VERCEL_ENV || 'Not set',
            VERCEL_REGION: process.env.VERCEL_REGION || 'Not set'
        }
    });
} 