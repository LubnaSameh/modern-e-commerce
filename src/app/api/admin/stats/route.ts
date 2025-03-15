import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        console.log("🔄 Admin stats API route called");

        // Get the session but don't require it
        const session = await getServerSession(authOptions);
        console.log("📊 Session status:", session ? "authenticated" : "not authenticated");

        // اتصال بقاعدة البيانات MongoDB
        const { db } = await connectToDatabase();

        // Get total orders
        console.log("🔍 Querying total orders...");
        const totalOrders = await db.collection('orders').countDocuments();

        // Get total users
        console.log("🔍 Querying total users...");
        const totalUsers = await db.collection('users').countDocuments();

        // Get total products
        console.log("🔍 Querying total products...");
        const totalProducts = await db.collection('products').countDocuments();

        // Get total revenue
        console.log("🔍 Querying revenue data...");
        const orders = await db.collection('orders').find({
            status: { $in: ["DELIVERED", "SHIPPED"] }
        }).toArray();

        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

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