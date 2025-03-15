# E-Commerce Website

مشروع متجر إلكتروني مبني باستخدام Next.js و MongoDB Atlas و Tailwind CSS.

## المميزات

* واجهة مستخدم عصرية وسهلة الاستخدام
* اتصال بقاعدة بيانات MongoDB Atlas
* إدارة المنتجات والتصنيفات 
* نظام المصادقة وإدارة المستخدمين
* سلة التسوق والمفضلة

## متطلبات التشغيل

* Node.js 16.8.0 أو أحدث
* حساب MongoDB Atlas (للإنتاج)
* npm أو yarn

## طريقة الإعداد المحلي

1. قم بنسخ المشروع:
```bash
git clone https://github.com/your-username/e-commerce.git
cd e-commerce
```

2. تثبيت التبعيات:
```bash
npm install
```

3. إنشاء ملف `.env.local` وإضافة متغيرات البيئة:
```
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=e-commerce
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3003
```

4. تشغيل المشروع في بيئة التطوير:
```bash
npm run dev
```

## النشر على Vercel

1. قم برفع المشروع إلى GitHub.

2. سجل دخول إلى [Vercel](https://vercel.com) وانقر على "New Project".

3. اختر المستودع من GitHub.

4. أضف متغيرات البيئة التالية:
   - `MONGODB_ATLAS_URI`: رابط الاتصال بـ MongoDB Atlas
   - `MONGODB_DB_NAME`: اسم قاعدة البيانات
   - `NEXTAUTH_SECRET`: مفتاح التشفير لـ NextAuth.js
   - `NEXTAUTH_URL`: رابط موقعك (مثال: https://your-project.vercel.app)

5. انقر على "Deploy" وانتظر اكتمال عملية النشر.

## ملاحظات هامة للنشر

* تأكد من إضافة عنوان `0.0.0.0/0` إلى قائمة السماح في MongoDB Atlas للسماح بالاتصال من Vercel.
* إذا كنت تستخدم المصادقة، تأكد من تحديث رابط `NEXTAUTH_URL` ليتوافق مع رابط النشر.

## تنبيه أمان

* تأكد من عدم رفع أي ملفات `.env` تحتوي على معلومات حساسة إلى GitHub.
* استخدم متغيرات البيئة في Vercel بدلاً من ذلك.

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.
