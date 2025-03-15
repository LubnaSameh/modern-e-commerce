import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
    try {
        console.log("🔍 جاري اختبار الاتصال بقاعدة البيانات...");

        // الاتصال بالقاعدة واختبار البيانات الأساسية
        const { client, db } = await connectToDatabase();

        // استخدام ping للتأكد من وجود اتصال ناجح
        await db.command({ ping: 1 });

        // محاولة الوصول إلى المجموعات الموجودة في قاعدة البيانات
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        return NextResponse.json({
            message: "تم الاتصال بقاعدة البيانات بنجاح",
            provider: "MongoDB Atlas",
            dbInfo: {
                databaseName: db.databaseName,
                collections: collectionNames
            },
            status: "SUCCESS"
        });
    } catch (error) {
        console.error("❌ فشل الاتصال بقاعدة البيانات:", error);

        return NextResponse.json({
            message: "فشل الاتصال بقاعدة البيانات",
            provider: "MongoDB Atlas",
            error: error instanceof Error ? error.message : String(error),
            status: "ERROR"
        }, { status: 500 });
    }
} 