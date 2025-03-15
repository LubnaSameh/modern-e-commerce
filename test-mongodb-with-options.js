const { MongoClient } = require('mongodb');

// استخدام نفس رابط الاتصال لكن بدون معاملات TLS
const uri = "mongodb+srv://e-commerce:MtJfO44EPiiZnOCk@e-commerce-cluster.4p2fq.mongodb.net/e-commerce";

const options = {
    // مجموعة خيارات TLS مختلفة للتغلب على مشكلة SSL
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    // إزالة directConnection لأنه غير متوافق مع SRV URI
    minPoolSize: 5,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 30000, // زيادة المهلة لاختيار الخادم
    connectTimeoutMS: 30000 // زيادة مهلة الاتصال
};

async function testConnection() {
    console.log('🔄 جاري محاولة الاتصال باستخدام خيارات TLS مخصصة...');

    try {
        console.log('خيارات الاتصال:', JSON.stringify(options, null, 2));
        const client = await MongoClient.connect(uri, options);
        console.log('✅ تم الاتصال بنجاح!');

        const db = client.db('e-commerce');
        const collections = await db.listCollections().toArray();

        console.log(`📚 قائمة المجموعات (${collections.length}):`);
        collections.forEach((collection, index) => {
            console.log(`${index + 1}. ${collection.name}`);
        });

        await client.close();
        console.log('🔒 تم إغلاق الاتصال');

        return true;
    } catch (error) {
        console.error('❌ فشل الاتصال (الخيار الثاني):', error);
        console.error('نوع الخطأ:', error.name);
        console.error('رسالة الخطأ:', error.message);
        if (error.cause) console.error('السبب:', error.cause);
        return false;
    }
}

// تنفيذ الاختبار
testConnection()
    .then(result => {
        console.log(`النتيجة النهائية: ${result ? '✅ نجاح' : '❌ فشل'}`);
        process.exit(result ? 0 : 1);
    }); 