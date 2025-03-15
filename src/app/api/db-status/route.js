import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
    const startTime = Date.now();

    // معلومات البيئة
    const environment = {
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL || !!process.env.VERCEL_ENV,
        vercelEnv: process.env.VERCEL_ENV || 'Not set',
        vercelRegion: process.env.VERCEL_REGION || 'Not set'
    };

    console.log("🔍 فحص حالة قاعدة البيانات...");
    console.log(`البيئة: ${JSON.stringify(environment)}`);

    // نتائج الاختبار
    const results = {
        timestamp: new Date().toISOString(),
        success: false,
        environment,
        dbDetails: {},
        connectionTest: {},
        errors: [],
        totalTime: 0
    };

    try {
        // الحصول على معلومات الاتصال
        const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
        const dbName = process.env.MONGODB_DB_NAME || 'e-commerce';

        if (!uri) {
            throw new Error("رابط الاتصال بقاعدة البيانات غير موجود");
        }

        // خيارات الاتصال المحسنة
        const options = {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 1,
            ssl: true
        };

        // محاولة الاتصال
        console.log("🔄 جاري الاتصال بقاعدة البيانات...");
        const connectionStart = Date.now();
        const client = await MongoClient.connect(uri, options);
        const db = client.db(dbName);
        const connectionTime = Date.now() - connectionStart;

        console.log(`✅ تم الاتصال بقاعدة البيانات: ${db.databaseName} في ${connectionTime}ms`);

        // الحصول على معلومات قاعدة البيانات
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        results.dbDetails = {
            name: db.databaseName,
            collections: collectionNames,
            totalCollections: collectionNames.length
        };

        results.connectionTest = {
            success: true,
            time: `${connectionTime}ms`
        };

        // اختبار مجموعة المنتجات
        if (collectionNames.includes("products")) {
            const productsCount = await db.collection("products").countDocuments();
            results.dbDetails.productCount = productsCount;
            console.log(`✅ تم العثور على ${productsCount} منتج`);
        }

        // إغلاق الاتصال
        await client.close();
        console.log("🔒 تم إغلاق الاتصال");

        // نجاح!
        results.success = true;
    } catch (error) {
        console.error("❌ فشل الاتصال بقاعدة البيانات:", error);

        results.connectionTest = {
            success: false,
            error: error.message
        };

        results.errors.push({
            type: error.name,
            message: error.message,
            stack: error.stack
        });
    }

    // حساب الوقت الإجمالي
    results.totalTime = `${Date.now() - startTime}ms`;

    // إرجاع النتائج
    return NextResponse.json(results);
} 