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
            '/api/products?limit=1',
            '/api/diagnostic'
        ];

        // اختيار نقطة وصول عشوائية للاستدعاء
        const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
        const pingUrl = `${SITE_URL}${randomEndpoint}`;

        // إضافة طابع زمني لتجنب التخزين المؤقت
        const timestamp = Date.now();
        const url = `${pingUrl}?keepAlive=true&t=${timestamp}`;

        // إرسال طلب بأولوية منخفضة لتجنب التأثير على الأداء
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // تقليل المهلة إلى 20 ثانية

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

        // محاولة إرسال ping بطريقة أخرى في حالة الفشل
        try {
            // استخدام طريقة GET بدلاً من HEAD
            const timestamp = Date.now();
            const backupUrl = `${SITE_URL}/api/diagnostic?minimal=true&t=${timestamp}`;

            await fetch(backupUrl, {
                method: 'GET',
                cache: 'no-store',
                mode: 'cors',
                credentials: 'same-origin'
            });

            console.log('Backup keep-alive ping sent successfully');
            return true;
        } catch (backupError) {
            console.log('Both keep-alive attempts failed:', backupError);
            return false;
        }
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

    // إرسال 3-4 محاولات بفاصل زمني قصير
    await sendKeepAlivePing();

    // إرسال محاولة ثانية بعد 1 ثانية
    setTimeout(async () => {
        await sendKeepAlivePing();
    }, 1000);

    // إرسال محاولة ثالثة بعد 3 ثوانٍ
    setTimeout(async () => {
        await sendKeepAlivePing();
    }, 3000);

    // إرسال محاولة رابعة بعد 10 ثوانٍ
    setTimeout(async () => {
        await sendKeepAlivePing();
    }, 10000);
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

        // محاولة تقليل فترة الخمول - إرسال ping كل 2 دقيقة بدلاً من 5 دقائق
        const interval = setInterval(() => {
            sendKeepAlivePing();
        }, 2 * 60 * 1000); // 2 دقيقة

        // إضافة محاولات متعددة كل 10 دقائق للتأكيد بدلاً من 15 دقيقة
        const bulkInterval = setInterval(() => {
            sendMultiplePings();
        }, 10 * 60 * 1000); // 10 دقائق

        // تنفيذ محاولة إضافية عند تغيير حالة التطبيق مثل فقدان التركيز واستعادته
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // إرسال ping عند العودة للصفحة
                sendKeepAlivePing();
            }
        });

        // التنظيف عند تفكيك المكون
        return () => {
            clearInterval(interval);
            clearInterval(bulkInterval);
            // لا حاجة لإزالة مستمع الحدث لأن المكون سيكون قد تم تفكيكه بالفعل
        };
    }

    return null;
} 