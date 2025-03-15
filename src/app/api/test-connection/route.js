import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
    try {
        // الحصول على معلومات الاتصال
        const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
        const dbName = process.env.MONGODB_DB_NAME || 'e-commerce';

        if (!uri) {
            return NextResponse.json({
                success: false,
                error: "رابط الاتصال بقاعدة البيانات غير موجود"
            }, { status: 500 });
        }

        // خيارات الاتصال المبسطة
        const options = {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            ssl: true
        };

        // محاولة الاتصال
        console.log("جاري الاتصال بقاعدة البيانات...");
        const client = await MongoClient.connect(uri, options);
        const db = client.db(dbName);

        // اختبار بسيط
        const ping = await db.command({ ping: 1 });

        // إغلاق الاتصال
        await client.close();

        // إرجاع النتائج
        return NextResponse.json({
            success: true,
            message: "تم الاتصال بنجاح",
            database: dbName,
            ping: ping.ok === 1 ? "ناجح" : "فاشل"
        });
    } catch (error) {
        console.error("خطأ في الاتصال:", error);

        return NextResponse.json({
            success: false,
            error: error.message,
            errorType: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
} 