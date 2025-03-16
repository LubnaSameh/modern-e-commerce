import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// دالة لتتبع خطوات التشخيص
function log(message) {
    console.log(`[DIAGNOSTIC] ${message}`);
    return message;
}

export async function GET(request) {
    // معلومات التشخيص
    const diagnosticInfo = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        connection_status: 'pending',
        env_variables: {
            mongodb_uri_exists: !!process.env.MONGODB_URI,
            mongodb_atlas_uri_exists: !!process.env.MONGODB_ATLAS_URI,
            mongodb_db_name_exists: !!process.env.MONGODB_DB_NAME,
            nextauth_url: process.env.NEXTAUTH_URL,
            site_url: process.env.NEXT_PUBLIC_SITE_URL,
            node_env: process.env.NODE_ENV
        },
        error: null,
        details: null,
        steps: [],
        connection_time_ms: null,
        possible_issues: [],
        server_info: {}
    };

    const uri = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI;
    const dbName = process.env.MONGODB_DB_NAME;

    // التحقق من وجود متغيرات البيئة المطلوبة
    diagnosticInfo.steps.push(log('فحص متغيرات البيئة'));

    if (!uri) {
        diagnosticInfo.possible_issues.push('MONGODB_URI و MONGODB_ATLAS_URI غير موجودين في متغيرات البيئة');
    }

    if (!dbName) {
        diagnosticInfo.possible_issues.push('MONGODB_DB_NAME غير موجود في متغيرات البيئة');
    }

    // مقارنة روابط الموقع
    if (process.env.NEXTAUTH_URL !== process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXTAUTH_URL && process.env.NEXT_PUBLIC_SITE_URL) {
        diagnosticInfo.possible_issues.push(`NEXTAUTH_URL (${process.env.NEXTAUTH_URL}) لا يتطابق مع NEXT_PUBLIC_SITE_URL (${process.env.NEXT_PUBLIC_SITE_URL})`);
    }

    // اختبار الاتصال بقاعدة البيانات
    let client = null;

    try {
        if (!uri || !dbName) {
            throw new Error('متغيرات البيئة المطلوبة غير متوفرة');
        }

        diagnosticInfo.steps.push(log('بدء اختبار الاتصال بقاعدة البيانات'));

        // إنشاء اتصال مع إعدادات مهلة مناسبة
        client = new MongoClient(uri, {
            connectTimeoutMS: 10000,
            socketTimeoutMS: 15000,
            serverSelectionTimeoutMS: 10000
        });

        diagnosticInfo.steps.push(log('تم إنشاء عميل MongoDB، جاري محاولة الاتصال'));

        // قياس وقت الاتصال
        const startTime = Date.now();
        await client.connect();
        const connectionTime = Date.now() - startTime;

        diagnosticInfo.connection_time_ms = connectionTime;
        diagnosticInfo.steps.push(log(`تم الاتصال بقاعدة البيانات بنجاح في ${connectionTime}ms`));

        // الحصول على معلومات عن السيرفر
        const admin = client.db('admin').admin();
        const serverInfo = await admin.serverInfo();
        diagnosticInfo.server_info = {
            version: serverInfo.version,
            gitVersion: serverInfo.gitVersion
        };

        // اختبار الوصول إلى قاعدة البيانات المحددة
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();

        diagnosticInfo.collections = collections.map(c => c.name);
        diagnosticInfo.steps.push(log(`تم الوصول لقاعدة البيانات ${dbName} بنجاح وقراءة ${collections.length} مجموعة`));

        diagnosticInfo.connection_status = 'success';

    } catch (error) {
        diagnosticInfo.connection_status = 'failed';
        diagnosticInfo.error = error.message;
        diagnosticInfo.steps.push(log(`فشل الاتصال: ${error.message}`));

        // تحليل الخطأ وتقديم اقتراحات
        if (error.name === 'MongoServerSelectionError') {
            diagnosticInfo.possible_issues.push('فشل في الاتصال بخادم MongoDB - تحقق من عنوان السيرفر وإعدادات الجدار الناري');
        }

        if (error.message.includes('Authentication failed')) {
            diagnosticInfo.possible_issues.push('فشل المصادقة - تحقق من اسم المستخدم وكلمة المرور');
        }

        if (error.message.includes('timed out')) {
            diagnosticInfo.possible_issues.push('انتهت مهلة الاتصال - تحقق من عنوان السيرفر وقائمة IP المسموح بها في MongoDB Atlas');
        }

        diagnosticInfo.details = {
            name: error.name,
            code: error.code,
            stack: error.stack?.split('\n').slice(0, 5).join('\n') // خمسة اسطر فقط من التتبع
        };
    } finally {
        // إغلاق الاتصال إذا كان مفتوحًا
        if (client) {
            try {
                await client.close();
                diagnosticInfo.steps.push(log('تم إغلاق الاتصال'));
            } catch (closeError) {
                diagnosticInfo.steps.push(log(`حدث خطأ أثناء إغلاق الاتصال: ${closeError.message}`));
            }
        }
    }

    // إرجاع نتائج التشخيص
    return NextResponse.json(diagnosticInfo, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}

// دعم طلبات HEAD و OPTIONS
export async function HEAD() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
} 