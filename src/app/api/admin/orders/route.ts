import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";

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

        // اتصال بقاعدة البيانات MongoDB
        const { db } = await connectToDatabase();
        const ordersCollection = db.collection('orders');
        const usersCollection = db.collection('users');
        const orderItemsCollection = db.collection('orderItems');

        // Build the query for filtering
        const query: any = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        // Handle search - we'll need to do this in multiple steps with MongoDB
        let userIds: string[] = [];
        if (search) {
            // First search for users matching the search term
            const matchingUsers = await usersCollection.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).toArray();

            userIds = matchingUsers.map(user => user._id.toString());

            // Then build our query to include either matching order numbers or user IDs
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } }
            ];

            if (userIds.length > 0) {
                query.$or.push({ userId: { $in: userIds } });
            }
        }

        // Get total count for pagination
        const total = await ordersCollection.countDocuments(query);

        // Get orders
        const orders = await ordersCollection.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        // Fetch users and order items for these orders
        const orderIds = orders.map(order => order._id.toString());

        // Get all order items for these orders
        const orderItems = await orderItemsCollection.find({
            orderId: { $in: orderIds }
        }).toArray();

        // Group order items by order ID
        const orderItemsMap = orderItems.reduce((map, item) => {
            if (!map[item.orderId]) {
                map[item.orderId] = [];
            }
            map[item.orderId].push(item);
            return map;
        }, {});

        // Get all users for these orders
        const orderUserIds = orders.map(order => order.userId).filter(Boolean);
        const users = await usersCollection.find({
            _id: { $in: orderUserIds.map(id => new ObjectId(id)) }
        }).toArray();

        // Create a map of users by ID
        const usersMap = users.reduce((map, user) => {
            map[user._id.toString()] = user;
            return map;
        }, {});

        // Combine all data
        const ordersWithDetails = orders.map(order => ({
            ...order,
            items: orderItemsMap[order._id.toString()] || [],
            user: order.userId ? usersMap[order.userId] || null : null
        }));

        return NextResponse.json({
            orders: ordersWithDetails,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب الطلبات", details: error instanceof Error ? error.message : String(error) },
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

        // اتصال بقاعدة البيانات MongoDB
        const { db } = await connectToDatabase();
        const ordersCollection = db.collection('orders');
        const usersCollection = db.collection('users');
        const orderItemsCollection = db.collection('orderItems');

        // Convert string ID to ObjectId
        let orderId;
        try {
            orderId = new ObjectId(id);
        } catch (error) {
            return NextResponse.json(
                { error: "معرف الطلب غير صالح" },
                { status: 400 }
            );
        }

        // Update order status
        await ordersCollection.updateOne(
            { _id: orderId },
            { $set: { status, updatedAt: new Date() } }
        );

        // Get updated order with all related data
        const updatedOrder = await ordersCollection.findOne({ _id: orderId });

        if (!updatedOrder) {
            return NextResponse.json(
                { error: "لم يتم العثور على الطلب" },
                { status: 404 }
            );
        }

        // Get user information
        let user = null;
        if (updatedOrder.userId) {
            user = await usersCollection.findOne({ _id: new ObjectId(updatedOrder.userId) });
        }

        // Get order items
        const items = await orderItemsCollection.find({ orderId: id }).toArray();

        // Combine all data
        const orderWithDetails = {
            ...updatedOrder,
            user,
            items
        };

        return NextResponse.json(orderWithDetails);
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء تحديث حالة الطلب", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
} 