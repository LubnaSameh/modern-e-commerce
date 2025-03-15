/**
 * آلية Keep-Alive لمنع توقف خوادم Vercel في الباقة المجانية
 * يتم استدعاء هذا في المكونات الرئيسية على الواجهة الأمامية
 */

// عنوان API الخاص بموقعك - استخدام الخادم المحلي عند التطوير
const isDevelopment = process.env.NODE_ENV === 'development';
const SITE_URL = isDevelopment
    ? 'http://localhost:3003' // استخدم localhost في بيئة التطوير
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://e-commerce-lubnasameh-lubna-sameh-mohameds-projects.vercel.app';

/**
 * وظيفة تقوم بإرسال طلب ping للحفاظ على استمرارية تشغيل API
 * يتم استدعاؤها من جانب العميل فقط
 */
export async function sendKeepAlivePing() {
    // تخطي إرسال الـpings في بيئة التطوير المحلية
    if (isDevelopment) {
        console.log('Skipping keep-alive ping in development mode');
        return true;
    }

    try {
        // زيادة عدد نقاط النهاية لتنويع الطلبات
        const endpoints = [
            '/api/categories',
            '/api/products',
            '/api/test-db',
            '/api/admin/stats?simple=true',
            '/api/products?limit=1'
        ];

        // اختيار نقطة وصول عشوائية للاستدعاء
        const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
        const pingUrl = `${SITE_URL}${randomEndpoint}`;

        // إضافة طابع زمني لتجنب التخزين المؤقت
        const timestamp = Date.now();
        const url = `${pingUrl}?keepAlive=true&t=${timestamp}`;

        // إرسال طلب بأولوية منخفضة لتجنب التأثير على الأداء
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // زيادة مهلة الانتظار إلى 30 ثانية بدلاً من 8 ثوانٍ

        await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            priority: 'low' as any,
            cache: 'no-store',
            mode: 'cors', // تحديد وضع CORS بوضوح
            credentials: 'same-origin' // إضافة خيار الاعتماد لحل مشاكل الاستيثاق
        });

        clearTimeout(timeoutId);
        console.log(`Keep-alive ping sent to ${randomEndpoint}`);
        return true;
    } catch (error) {
        // تجاهل أخطاء الاتصال - فقط سجل في وحدة التحكم للتصحيح
        console.log('Keep-alive error (can be ignored):', error);
        return false;
    }
}

/**
 * دالة مساعدة لإرسال عدة محاولات ping على التوالي
 * لزيادة احتمالية المحافظة على السيرفر نشطًا
 */
export async function sendMultiplePings() {
    if (isDevelopment) {
        console.log('Skipping keep-alive pings in development mode');
        return;
    }

    // إرسال 2-3 محاولات بفاصل زمني قصير
    await sendKeepAlivePing();

    // إرسال محاولة ثانية بعد 1 ثانية
    setTimeout(async () => {
        await sendKeepAlivePing();
    }, 1000);

    // إرسال محاولة ثالثة بعد 3 ثوانٍ
    setTimeout(async () => {
        await sendKeepAlivePing();
    }, 3000);
}

/**
 * مكون React لاستدعاء آلية keep-alive تلقائياً
 */
export function useKeepAlive() {
    // تنفيذ فقط على جانب العميل
    if (typeof window !== 'undefined') {
        // تجاهل في بيئة التطوير - تعطيل كامل في بيئة التطوير
        if (isDevelopment) {
            console.log('Keep-alive disabled in development mode');
            return null;
        }

        // إرسال عدة محاولات ping فورية عند تحميل الصفحة
        setTimeout(() => sendMultiplePings(), 1000);

        // محاولة تقليل فترة الخمول - إرسال ping كل 5 دقائق بدلاً من دقيقة واحدة
        const interval = setInterval(() => {
            sendKeepAlivePing();
        }, 5 * 60 * 1000); // 5 دقائق

        // إضافة محاولات متعددة كل 15 دقيقة للتأكيد بدلاً من 5 دقائق
        const bulkInterval = setInterval(() => {
            sendMultiplePings();
        }, 15 * 60 * 1000); // 15 دقيقة

        // التنظيف عند تفكيك المكون
        return () => {
            clearInterval(interval);
            clearInterval(bulkInterval);
        };
    }

    return null;
} 