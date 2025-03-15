import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        console.log("🔄 Recent orders API route called");

        // Get the session but don't require it
        const session = await getServerSession(authOptions);
        console.log("📊 Session status:", session ? "authenticated" : "not authenticated");

        // اتصال بقاعدة البيانات MongoDB
        const { db } = await connectToDatabase();
        const ordersCollection = db.collection('orders');

        // Get the 5 most recent orders
        console.log("🔍 Querying recent orders...");
        const recentOrders = await ordersCollection.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        // إضافة معلومات المستخدم لكل طلب
        const ordersWithUserInfo = await Promise.all(
            recentOrders.map(async (order) => {
                if (order.userId) {
                    const usersCollection = db.collection('users');
                    const user = await usersCollection.findOne(
                        { _id: order.userId },
                        { projection: { name: 1, email: 1 } }
                    );

                    return {
                        ...order,
                        user: user ? { name: user.name, email: user.email } : null
                    };
                }
                return order;
            })
        );

        console.log(`📦 Found ${ordersWithUserInfo.length} recent orders`);
        return NextResponse.json(ordersWithUserInfo);
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