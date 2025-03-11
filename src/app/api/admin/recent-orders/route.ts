import { NextResponse } from "next/server";
import prisma, { prisma as prismaNamed } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        console.log("🔄 Recent orders API route called");
        // Use either import style that works
        const prismaClient = prisma || prismaNamed;

        // Get the session but don't require it
        const session = await getServerSession(authOptions);
        console.log("📊 Session status:", session ? "authenticated" : "not authenticated");

        // Comment out authentication check to allow public access
        // if (!session || session.user.role !== "ADMIN") {
        //     return NextResponse.json(
        //         { error: "غير مصرح لك بالوصول" },
        //         { status: 403 }
        //     );
        // }

        // Test database connection first
        try {
            await prismaClient.$queryRaw`SELECT 1+1 as result`;
            console.log("✅ Database connection successful");
        } catch (dbError) {
            console.error("❌ Database connection test failed:", dbError);
            return NextResponse.json(
                { error: "Database connection failed", details: String(dbError) },
                { status: 500 }
            );
        }

        // Get the 5 most recent orders
        console.log("🔍 Querying recent orders...");
        const recentOrders = await prismaClient.order.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        console.log(`📦 Found ${recentOrders.length} recent orders`);
        return NextResponse.json(recentOrders);
    } catch (error) {
        console.error("❌ Error fetching recent orders:", error);
        return NextResponse.json(
            {
                error: "Error fetching recent orders",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 