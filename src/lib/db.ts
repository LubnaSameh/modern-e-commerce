import { connectToDatabase, getCollection } from "./mongodb";

// This file is being kept for backwards compatibility
// It now provides a more stable interface to the database connection

// معلومات عن حالة الاتصال الحالية
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// دالة للتعامل مع محاولات إعادة الاتصال
const handleConnection = async () => {
    try {
        connectionAttempts++;
        return await connectToDatabase();
    } catch (error) {
        console.error(`❌ فشل محاولة الاتصال رقم ${connectionAttempts}:`, error);

        if (connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
            console.log(`⏱️ محاولة إعادة الاتصال بعد ${connectionAttempts * 2} ثواني...`);
            await new Promise(resolve => setTimeout(resolve, connectionAttempts * 2000));
            return handleConnection();
        } else {
            console.error('❌❌ فشلت جميع محاولات الاتصال');
            throw new Error(`فشلت جميع محاولات الاتصال بقاعدة البيانات (${MAX_RECONNECT_ATTEMPTS} محاولات)`);
        }
    }
};

// واجهة مستقرة لاتصال قاعدة البيانات
export const db = {
    connect: handleConnection,
    collection: getCollection
};

export default db; 