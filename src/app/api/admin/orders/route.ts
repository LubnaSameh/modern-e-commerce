import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// GET - Fetch orders with pagination, search, and filtering
export async function GET(request: Request) {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "غير مصرح لك بالوصول" },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("q") || "";
        const status = searchParams.get("status") || "";

        const skip = (page - 1) * limit;

        // Build the where clause for filtering
        const where: Prisma.OrderWhereInput = {};

        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { user: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }

        if (status && status !== 'all') {
            where.status = status;
        }

        // Get total count for pagination
        const total = await prisma.order.count({ where });

        // Get orders
        const orders = await prisma.order.findMany({
            where,
            include: {
                user: true,
                items: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        });

        return NextResponse.json({
            orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب الطلبات" },
            { status: 500 }
        );
    }
}

// PATCH - Update order status
export async function PATCH(request: Request) {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "غير مصرح لك بالوصول" },
                { status: 403 }
            );
        }

        const { id, status } = await request.json();

        if (!id || !status) {
            return NextResponse.json(
                { error: "معرف الطلب والحالة مطلوبان" },
                { status: 400 }
            );
        }

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                user: true,
                items: true,
            },
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء تحديث حالة الطلب" },
            { status: 500 }
        );
    }
} 