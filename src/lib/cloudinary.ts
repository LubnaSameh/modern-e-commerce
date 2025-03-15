import { v2 as cloudinary } from 'cloudinary';

// تهيئة Cloudinary بمعلومات الحساب
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

/**
 * دالة لرفع صورة إلى Cloudinary
 * @param file الملف المراد رفعه
 * @param folder المجلد الذي سيتم التخزين فيه (اختياري)
 * @returns وعد يحتوي على معلومات الصورة المرفوعة
 */
export async function uploadImage(fileBuffer: Buffer, folderName: string = 'e-commerce'): Promise<{ url: string, public_id: string }> {
    return new Promise((resolve, reject) => {
        // رفع الصورة باستخدام تدفق بيانات
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folderName,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve({
                    url: result?.secure_url || '',
                    public_id: result?.public_id || '',
                });
            }
        );

        // دفع البيانات إلى تدفق الرفع
        uploadStream.end(fileBuffer);
    });
}

/**
 * دالة لحذف صورة من Cloudinary
 * @param publicId معرف الصورة الفريد
 * @returns وعد بنتيجة العملية
 */
export async function deleteImage(publicId: string): Promise<{ result: string }> {
    return cloudinary.uploader.destroy(publicId);
}

export default cloudinary; 