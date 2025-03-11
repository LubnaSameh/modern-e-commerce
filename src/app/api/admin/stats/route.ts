import { NextResponse } from "next/server";
import prisma, { prisma as prismaNamed } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        console.log("🔄 Admin stats API route called");
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

        // Get total orders
        console.log("🔍 Querying total orders...");
        const totalOrders = await prismaClient.order.count();

        // Get total users
        console.log("🔍 Querying total users...");
        const totalUsers = await prismaClient.user.count();

        // Get total products
        console.log("🔍 Querying total products...");
        const totalProducts = await prismaClient.product.count();

        // Get total revenue
        console.log("🔍 Querying revenue data...");
        const orders = await prismaClient.order.findMany({
            where: {
                status: {
                    in: ["DELIVERED", "SHIPPED"]
                }
            },
            select: {
                total: true
            }
        });

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

        console.log("📊 Stats collected successfully:", {
            totalOrders,
            totalUsers,
            totalProducts,
            totalRevenue
        });

        return NextResponse.json({
            totalOrders,
            totalUsers,
            totalProducts,
            totalRevenue
        });
    } catch (error) {
        console.error("❌ Error fetching admin stats:", error);
        return NextResponse.json(
            {
                error: "Error fetching statistics",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 