import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
    try {
        console.log("🧪 اختبار الاتصال بقاعدة البيانات MongoDB...");

        // اختبار الاتصال بقاعدة البيانات MongoDB
        const { client, db } = await connectToDatabase();

        // الحصول على قائمة المجموعات للتأكد من الاتصال
        const collections = await db.listCollections().toArray();

        return NextResponse.json({
            success: true,
            message: "تم الاتصال بنجاح بقاعدة البيانات!",
            dbName: db.databaseName,
            collections: collections.map(c => c.name)
        });
    } catch (error) {
        console.error("❌ فشل الاتصال بقاعدة البيانات:", error);

        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
            code: error.code || "UNKNOWN_ERROR"
        }, { status: 500 });
    }
} 