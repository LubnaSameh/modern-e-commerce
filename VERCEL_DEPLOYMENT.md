# دليل النشر على Vercel

هذا الدليل يشرح كيفية نشر المشروع على منصة Vercel بشكل صحيح والتأكد من اتصاله بقاعدة بيانات MongoDB Atlas.

## الخطوات

### 1. التأكد من إعداد MongoDB Atlas

1. تسجيل الدخول إلى حساب [MongoDB Atlas](https://cloud.mongodb.com/)
2. الذهاب إلى قائمة "Network Access" في إعدادات المشروع
3. إضافة العنوان `0.0.0.0/0` إلى قائمة السماح للسماح بالاتصال من أي مكان (وهذا يشمل خوادم Vercel)
4. التأكد من أن حساب المستخدم الخاص بقاعدة البيانات لديه صلاحيات القراءة والكتابة

### 2. رفع المشروع إلى GitHub

```bash
# إنشاء مستودع جديد في GitHub ثم تنفيذ الأوامر التالية
git add .
git commit -m "إعداد المشروع للنشر على Vercel"
git remote add origin https://github.com/your-username/e-commerce.git
git push -u origin main
```

### 3. النشر على Vercel

1. تسجيل الدخول إلى [Vercel](https://vercel.com)
2. انقر على "Add New" ثم "Project"
3. اختر المستودع الذي قمت برفعه
4. قم بإعداد المتغيرات البيئية:

```
MONGODB_ATLAS_URI=mongodb+srv://e-commerce:MtJfO44EPiiZnOCk@e-commerce-cluster.4p2fq.mongodb.net/e-commerce?retryWrites=true&w=majority
MONGODB_DB_NAME=e-commerce
NEXTAUTH_SECRET=zRNIhHHvzA6YehTvL4MrNj8vYpLhQMPCHy4qvjGTMnO+DcfDCB3m+Xg7VfZAQdsL
NEXTAUTH_URL=https://your-vercel-deployment-url.vercel.app
NODE_ENV=production
```

5. اترك الإعدادات الأخرى كما هي وانقر على "Deploy"

### 4. بعد النشر

1. انتظر حتى يكتمل النشر
2. سيوفر لك Vercel رابطاً للموقع المنشور (مثال: `https://your-project.vercel.app`)
3. قم بتحديث إعدادات `NEXTAUTH_URL` في Vercel بالرابط الحقيقي للموقع المنشور
4. اختبر الموقع المنشور للتأكد من أنه يعمل بشكل صحيح

### 5. استكشاف الأخطاء وإصلاحها

إذا واجهت مشاكل في الاتصال بقاعدة البيانات بعد النشر:

1. تحقق من سجل وحدة التحكم في Vercel للبحث عن أي أخطاء
2. تأكد من صحة رابط الاتصال بـ MongoDB Atlas
3. تأكد من أن قائمة السماح في MongoDB Atlas تسمح بالاتصال من IP الخاص بـ Vercel (أو استخدم `0.0.0.0/0`)
4. تأكد من أن كل المتغيرات البيئية الضرورية موجودة في إعدادات المشروع في Vercel

### 6. الحفاظ على أمان المشروع

1. لا ترفع ملفات `.env` أو `.env.local` أو غيرها من الملفات التي تحتوي على معلومات حساسة إلى GitHub
2. بعد النشر الناجح، قم بتغيير كلمة مرور قاعدة البيانات وتحديث المتغيرات البيئية في Vercel

## موارد إضافية

- [توثيق Vercel للنشر](https://vercel.com/docs/deployments/overview)
- [توثيق Next.js للنشر](https://nextjs.org/docs/pages/building-your-application/deploying)
- [قواعد أمان MongoDB Atlas](https://www.mongodb.com/docs/atlas/security/) 