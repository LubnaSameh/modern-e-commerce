import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        console.log("🔄 Sales chart API route called");

        // Get the session but don't require it
        const session = await getServerSession(authOptions);
        console.log("📊 Session status:", session ? "authenticated" : "not authenticated");

        // Get the last 7 days
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        console.log("📅 Date range for sales data:", {
            from: sevenDaysAgo.toISOString(),
            to: today.toISOString()
        });

        // اتصال بقاعدة البيانات MongoDB
        const { db } = await connectToDatabase();

        // Get orders for the last 7 days
        console.log("🔍 Querying orders from database...");
        const orders = await db.collection('orders').find({
            createdAt: { $gte: sevenDaysAgo, $lte: today }
        }).toArray();

        console.log(`📦 Found ${orders.length} orders in the last 7 days`);

        // Group orders by day
        const salesByDay = {};

        // Initialize all days with 0
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            salesByDay[dateString] = 0;
        }

        // Sum up sales by day
        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const dateString = orderDate.toISOString().split('T')[0];
            salesByDay[dateString] = (salesByDay[dateString] || 0) + (order.total || 0);
        });

        // Convert to array for chart
        const chartData = Object.entries(salesByDay)
            .map(([date, total]) => ({
                date,
                total
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        console.log("📊 Sales chart data prepared:", chartData);
        return NextResponse.json(chartData);
    } catch (error) {
        console.error("❌ Error generating sales chart data:", error);
        return NextResponse.json(
            {
                error: "Error generating sales chart data",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 