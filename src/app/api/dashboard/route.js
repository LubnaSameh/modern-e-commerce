import { NextResponse } from "next/server";
import { connectToDatabase, getCollection } from "@/lib/mongodb";
import { PRODUCTS_COLLECTION } from "@/models/Product";

export async function GET() {
    try {
        console.log("📊 جاري تحميل بيانات لوحة التحكم...");

        // الاتصال بقاعدة البيانات
        const { db } = await connectToDatabase();

        // الحصول على قوائم المجموعات المختلفة
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        // إحصائيات المنتجات
        const productsCollection = await getCollection(PRODUCTS_COLLECTION);
        const productsCount = await productsCollection.countDocuments();

        // الحصول على أحدث 5 منتجات
        const latestProducts = await productsCollection
            .find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        return NextResponse.json({
            databaseStatus: "متصل",
            provider: "MongoDB Atlas",
            collections: collectionNames,
            stats: {
                productsCount
            },
            latestProducts: latestProducts.map(p => ({
                id: p._id,
                name: p.name,
                price: p.price,
                createdAt: p.createdAt
            }))
        });
    } catch (error) {
        console.error("❌ حدث خطأ في استرداد بيانات لوحة التحكم:", error);

        return NextResponse.json({
            databaseStatus: "غير متصل",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
} 