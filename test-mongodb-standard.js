const { MongoClient } = require('mongodb');

// استخدام رابط اتصال مباشر لأحد الخوادم بدلاً من SRV
const uri = "mongodb://e-commerce:MtJfO44EPiiZnOCk@e-commerce-cluster-shard-00-00.4p2fq.mongodb.net:27017,e-commerce-cluster-shard-00-01.4p2fq.mongodb.net:27017,e-commerce-cluster-shard-00-02.4p2fq.mongodb.net:27017/e-commerce?replicaSet=atlas-ljvpbi-shard-0&ssl=true&authSource=admin";

const options = {
    ssl: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    serverSelectionTimeoutMS: 30000
};

async function testConnection() {
    console.log('🔄 جاري محاولة الاتصال باستخدام رابط تقليدي...');

    try {
        console.log('الرابط:', uri);
        console.log('الخيارات:', JSON.stringify(options, null, 2));

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
        console.error('❌ فشل الاتصال الثالث:', error);
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