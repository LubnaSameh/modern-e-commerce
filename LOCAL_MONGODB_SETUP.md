# إعداد MongoDB المحلية للتطوير

## المشكلة
نواجه مشكلة في الاتصال بـ MongoDB Atlas بسبب مشاكل SSL/TLS بين Node.js على Windows وخوادم MongoDB Atlas. هذه مشكلة معروفة في بعض البيئات.

## الحل: استخدام MongoDB محلية للتطوير

### الخطوة 1: تثبيت MongoDB Community Edition
1. قم بتنزيل MongoDB Community Server من [الموقع الرسمي](https://www.mongodb.com/try/download/community)
2. اتبع [دليل التثبيت لنظام Windows](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)
3. يمكنك اختيار تثبيته كخدمة (service) لتشغيله تلقائياً

### الخطوة 2: إنشاء مجلد البيانات
```
mkdir C:\data\db
```

### الخطوة 3: تشغيل خادم MongoDB
إذا لم تقم بتثبيته كخدمة:
```
"C:\Program Files\MongoDB\Server\{اصدارك}\bin\mongod.exe" --dbpath="C:\data\db"
```

### الخطوة 4: اختبار الاتصال
1. تأكد أن الخادم المحلي يعمل (افتراضيًا على المنفذ 27017)
2. شغل تطبيق Next.js الخاص بنا باستخدام `npm run dev`
3. افتح http://localhost:3003/api/test-db للتحقق من نجاح الاتصال

### خيار بديل: استخدام MongoDB Compass
1. قم بتنزيل وتثبيت [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. استخدمه للتعامل مع قاعدة البيانات بواجهة رسومية

### ملاحظات هامة:
- هذا الحل للتطوير المحلي فقط
- لإنتاج التطبيق، عليك استخدام MongoDB Atlas أو أي حل استضافة آخر
- تأكد من عدم تخزين بيانات حساسة في قاعدة البيانات المحلية 