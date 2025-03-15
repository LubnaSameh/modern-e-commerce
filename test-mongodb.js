const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// استخدام رابط الاتصال المباشر بدلاً من SRV
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "e-commerce";

console.log('🧪 بدء اختبار الاتصال بـ MongoDB Atlas...');
console.log(`🔌 استخدام رابط الاتصال: ${uri ? uri.substring(0, 30) + '...' : 'undefined'}`);
console.log(`📦 قاعدة البيانات: ${dbName}`);

// خيارات الاتصال المحسنة للتوافق مع Windows
const options = {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 1,
    ssl: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true
};

async function testConnection() {
    let client = null;

    try {
        console.log('🔄 محاولة الاتصال...');
        client = await MongoClient.connect(uri, options);
        console.log('✅ تم الاتصال بنجاح بـ MongoDB Atlas!');

        const db = client.db(dbName);
        console.log(`📊 تم الاتصال بقاعدة البيانات: ${db.databaseName}`);

        // اختبار الوصول للمجموعات
        const collections = await db.listCollections().toArray();
        console.log(`📚 قائمة المجموعات (${collections.length}):`);
        collections.forEach((collection, i) => {
            console.log(`   ${i + 1}. ${collection.name}`);
        });

        // التحقق من وجود مجموعة المنتجات
        const hasProducts = collections.some(c => c.name === 'products');
        if (hasProducts) {
            const productsCount = await db.collection('products').countDocuments();
            console.log(`🛍️ عدد المنتجات: ${productsCount}`);
        } else {
            console.log('⚠️ مجموعة المنتجات غير موجودة!');
        }

        return true;
    } catch (error) {
        console.error('❌ فشل الاتصال بـ MongoDB Atlas:', error);
        console.error('🔍 نوع الخطأ:', error.name);
        console.error('📝 رسالة الخطأ:', error.message);

        if (error.name === 'MongoServerSelectionError') {
            console.error(`
            ⚠️ نصائح:
            1. تأكد من أن عنوان IP الخاص بك مسموح به في قائمة MongoDB Atlas
            2. تأكد من صحة اسم المستخدم وكلمة المرور
            3. جرب تمكين خيار "السماح بالوصول من أي مكان" في Atlas
            4. تأكد من أن لديك اتصال بالإنترنت
            `);
        }

        return false;
    } finally {
        // إغلاق الاتصال إذا كان مفتوحاً
        if (client) {
            await client.close();
            console.log('🔒 تم إغلاق الاتصال');
        }
    }
}

// تنفيذ الاختبار
testConnection().then(success => {
    if (success) {
        console.log('✅ اكتمل اختبار الاتصال بنجاح!');
    } else {
        console.log('❌ فشل اختبار الاتصال.');
    }
    process.exit(0);
}).catch(err => {
    console.error('💥 حدث خطأ غير متوقع:', err);
    process.exit(1);
}); 