import { MongoClient } from 'mongodb';

// اوبجكت للتخزين المؤقت لمنع إنشاء اتصالات متعددة
const globalForMongo = global;

// نضمن أن لدينا كائن globalmongodb في النطاق العالمي
globalForMongo.mongodb = globalForMongo.mongodb || {};

// اختيار رابط قاعدة البيانات حسب بيئة التشغيل
const isProduction = process.env.NODE_ENV === 'production';
console.log(`🌐 Current environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);

// في بيئة الإنتاج، استخدم MongoDB Atlas. في التطوير، استخدم إما Atlas أو قاعدة البيانات المحلية
const url = isProduction
    ? process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI  // استخدم Atlas في الإنتاج
    : process.env.MONGODB_URI;  // استخدم المحدد في ملف .env للتطوير

console.log(`🔌 MongoDB URL type: ${url && url.startsWith('mongodb+srv') ? 'Atlas SRV' : url && url.startsWith('mongodb://') ? 'Standard' : 'Unknown'}`);

const dbName = process.env.MONGODB_DB_NAME || 'e-commerce';
console.log(`📦 Database name: ${dbName}`);

// حفظ الاتصال للاستخدام المستقبلي - استخدام globalForMongo لمشاركة الاتصال بين جميع الطلبات
let cachedClient = globalForMongo.mongodb.client;
let cachedDb = globalForMongo.mongodb.db;

if (!url) {
    const errorMessage = 'برجاء إضافة رابط الاتصال بقاعدة البيانات MONGODB_URI أو MONGODB_ATLAS_URI في ملف .env';
    console.error(`❌ ${errorMessage}`);
    throw new Error(errorMessage);
}

export async function connectToDatabase() {
    // إذا كان الاتصال موجود بالفعل، استخدمه
    if (cachedClient && cachedDb) {
        console.log('♻️ Using cached database connection');
        return { client: cachedClient, db: cachedDb };
    }

    // تعيين متغير للتأكد من أننا لا نحاول الاتصال مرتين في نفس الوقت
    if (globalForMongo.mongodb.isConnecting) {
        console.log('🔄 Waiting for an existing connection attempt...');
        // انتظار حتى يكتمل الاتصال الحالي
        await new Promise(resolve => setTimeout(resolve, 1000));
        return connectToDatabase();
    }

    // إنشاء اتصال جديد
    try {
        globalForMongo.mongodb.isConnecting = true;
        console.log(`🔌 Attempting to connect to database (${isProduction ? 'production' : 'development'})...`);

        // التحقق إذا كان الرابط يستخدم تنسيق SRV
        const isSrvFormat = url.startsWith('mongodb+srv://');
        console.log(`🌐 Connection format: ${isSrvFormat ? 'SRV (mongodb+srv://)' : 'Standard (mongodb://)'}`);

        // إعدادات الاتصال المحسنة لـ MongoDB Atlas مع مراعاة التوافق مع Windows
        const options = {
            // إعدادات أساسية
            serverSelectionTimeoutMS: 30000,  // مهلة اختيار الخادم بالمللي ثانية
            connectTimeoutMS: 30000,          // مهلة الاتصال بالمللي ثانية
            socketTimeoutMS: 45000,           // مهلة السوكت بالمللي ثانية
            maxPoolSize: 50,                  // الحد الأقصى لعدد الاتصالات المتزامنة
            minPoolSize: 5,                   // الحد الأدنى لعدد الاتصالات المفتوحة

            // إعدادات SSL/TLS إضافية للتوافق مع Windows
            ssl: true,                        // تمكين SSL للاتصالات مع Atlas

            // خيارات متساهلة للتوافق - إزالتها في الإنتاج
            ...(process.env.NODE_ENV !== 'production' ? {
                tlsAllowInvalidCertificates: true,  // تجاهل مشاكل الشهادات غير الصالحة
                tlsAllowInvalidHostnames: true      // تجاهل مشاكل أسماء المضيفين غير المتطابقة
            } : {})
        };

        // محاولة الاتصال
        console.log('🔌 Connecting to MongoDB with URI:', url.substring(0, 20) + '...');
        console.log('🔧 Using connection options:', JSON.stringify(options, null, 2));

        // Vercel-specific logging
        if (isProduction) {
            console.log('📊 Vercel Deployment Info:');
            console.log(`- VERCEL_ENV: ${process.env.VERCEL_ENV || 'Not set'}`);
            console.log(`- VERCEL_REGION: ${process.env.VERCEL_REGION || 'Not set'}`);
        }

        const client = await MongoClient.connect(url, options);

        const db = client.db(dbName);
        console.log(`✅ Successfully connected to database! (${db.databaseName})`);

        // تخزين الاتصال للاستخدام المستقبلي - في النطاق العالمي
        cachedClient = client;
        cachedDb = db;
        globalForMongo.mongodb.client = client;
        globalForMongo.mongodb.db = db;
        globalForMongo.mongodb.isConnecting = false;

        // إضافة معالج لإغلاق الاتصال عند إيقاف الخادم
        process.on('SIGINT', () => {
            console.log('🔌 Closing MongoDB connection before shutdown');
            client.close();
            process.exit(0);
        });

        return { client, db };
    } catch (error) {
        console.error('❌ Error connecting to database:', error);
        globalForMongo.mongodb.isConnecting = false;

        // تفاصيل أكثر عن الخطأ
        console.error(`
        🔍 Connection Error Details:
        - Error Type: ${error.name}
        - Error Message: ${error.message}
        - MongoDB URI (first part): ${url ? url.substring(0, 30) + '...' : 'undefined'}
        - Database Name: ${dbName}
        - Environment: ${isProduction ? 'Production' : 'Development'}
        - Vercel: ${process.env.VERCEL === '1' ? 'Yes' : 'No'}
        `);

        // نصائح محددة لحل الخطأ
        if (error.name === 'MongoServerSelectionError') {
            console.error(`
            ⚠️ لم يتمكن من الاتصال بخادم MongoDB.
            👉 يرجى التحقق من:
            - التأكد من إضافة عنوان IP الخاص بك إلى قائمة السماح في MongoDB Atlas
            - تفعيل "السماح بالوصول من أي مكان" (0.0.0.0/0) في إعدادات Atlas
            - التأكد من صحة اسم المستخدم وكلمة المرور
            - التأكد من وجود اتصال بالإنترنت
            `);
        }

        throw error;
    }
}

// تصدير دالة للوصول السريع للـ collections
export async function getCollection(collectionName) {
    try {
        const { db } = await connectToDatabase();
        return db.collection(collectionName);
    } catch (error) {
        console.error(`❌ Error accessing collection ${collectionName}:`, error);
        throw new Error(`Database connection failed: ${error.message}`);
    }
}

// دالة مساعدة للحصول على عنوان IP الحالي
async function getIpAddress() {
    try {
        return "Check your current IP address";
    } catch (error) {
        return "Unknown";
    }
} 