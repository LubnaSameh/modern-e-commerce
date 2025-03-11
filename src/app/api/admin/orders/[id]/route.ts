import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Fetch a single order by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "غير مصرح لك بالوصول" },
                { status: 403 }
            );
        }

        const id = params.id;

        // Get order with all related data
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: "لم يتم العثور على الطلب" },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب الطلب" },
            { status: 500 }
        );
    }
}

// PATCH - Update order status
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "غير مصرح لك بالوصول" },
                { status: 403 }
            );
        }

        const id = params.id;
        const { status } = await request.json();

        if (!status) {
            return NextResponse.json(
                { error: "حالة الطلب مطلوبة" },
                { status: 400 }
            );
        }

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                user: true,
                items: {
                    include: {
                        product: true,
                    },
                },
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