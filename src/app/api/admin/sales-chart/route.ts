import { NextResponse } from "next/server";
import prisma, { prisma as prismaNamed } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        console.log("🔄 Sales chart API route called");
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

        // Get the last 7 days
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        console.log("📅 Date range for sales data:", {
            from: sevenDaysAgo.toISOString(),
            to: today.toISOString()
        });

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

        // Get orders for the last 7 days
        console.log("🔍 Querying orders from database...");
        const orders = await prismaClient.order.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            },
            select: {
                createdAt: true,
                total: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        console.log(`📦 Found ${orders.length} orders in the last 7 days`);

        // Group orders by day
        const salesByDay = orders.reduce((acc, order) => {
            const date = new Date(order.createdAt);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const dateKey = `${day}/${month}`;

            if (!acc[dateKey]) {
                acc[dateKey] = {
                    sales: 0,
                    orders: 0
                };
            }

            acc[dateKey].sales += order.total;
            acc[dateKey].orders += 1;

            return acc;
        }, {} as Record<string, { sales: number; orders: number }>);

        // Fill in missing days
        const result = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const dateKey = `${day}/${month}`;

            result.unshift({
                date: dateKey,
                sales: salesByDay[dateKey]?.sales || 0,
                orders: salesByDay[dateKey]?.orders || 0
            });
        }

        console.log("✅ Sales chart data processed successfully");
        return NextResponse.json(result);
    } catch (error) {
        console.error("❌ Error fetching sales chart data:", error);
        return NextResponse.json(
            {
                error: "حدث خطأ أثناء جلب بيانات المبيعات",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 