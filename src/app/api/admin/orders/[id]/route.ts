import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";

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

        // اتصال بقاعدة البيانات MongoDB
        const { db } = await connectToDatabase();
        const ordersCollection = db.collection('orders');
        const usersCollection = db.collection('users');
        const orderItemsCollection = db.collection('orderItems');
        const productsCollection = db.collection('products');

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

        // Get order
        const order = await ordersCollection.findOne({ _id: orderId });

        if (!order) {
            return NextResponse.json(
                { error: "لم يتم العثور على الطلب" },
                { status: 404 }
            );
        }

        // Get user information
        let user = null;
        if (order.userId) {
            user = await usersCollection.findOne({ _id: new ObjectId(order.userId) });
        }

        // Get order items
        const items = await orderItemsCollection.find({ orderId: id }).toArray();

        // Get products for each order item
        const productIds = items.map(item => item.productId).filter(Boolean);
        const products = productIds.length > 0
            ? await productsCollection.find({
                _id: {
                    $in: productIds.map(id => {
                        try { return new ObjectId(id); } catch { return null; }
                    }).filter(Boolean)
                }
            }).toArray()
            : [];

        // Create a map of products by ID
        const productsMap = products.reduce((map, product) => {
            map[product._id.toString()] = product;
            return map;
        }, {});

        // Add product details to each order item
        const itemsWithProducts = items.map(item => ({
            ...item,
            product: item.productId ? productsMap[item.productId] || null : null
        }));

        // Combine all data
        const orderWithDetails = {
            ...order,
            user,
            items: itemsWithProducts
        };

        return NextResponse.json(orderWithDetails);
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب الطلب", details: error instanceof Error ? error.message : String(error) },
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

        // اتصال بقاعدة البيانات MongoDB
        const { db } = await connectToDatabase();
        const ordersCollection = db.collection('orders');
        const usersCollection = db.collection('users');
        const orderItemsCollection = db.collection('orderItems');
        const productsCollection = db.collection('products');

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

        // Get updated order
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

        // Get products for each order item
        const productIds = items.map(item => item.productId).filter(Boolean);
        const products = productIds.length > 0
            ? await productsCollection.find({
                _id: {
                    $in: productIds.map(id => {
                        try { return new ObjectId(id); } catch { return null; }
                    }).filter(Boolean)
                }
            }).toArray()
            : [];

        // Create a map of products by ID
        const productsMap = products.reduce((map, product) => {
            map[product._id.toString()] = product;
            return map;
        }, {});

        // Add product details to each order item
        const itemsWithProducts = items.map(item => ({
            ...item,
            product: item.productId ? productsMap[item.productId] || null : null
        }));

        // Combine all data
        const orderWithDetails = {
            ...updatedOrder,
            user,
            items: itemsWithProducts
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