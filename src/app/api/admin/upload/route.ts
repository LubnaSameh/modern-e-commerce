import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// قائمة ثابتة من صور Unsplash للاستخدام في الرفع الوهمي
const unsplashImages = [
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=500",
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=500",
    "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=500",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=500",
    "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?q=80&w=500",
    "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=500",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500"
];

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // التحقق من حجم الملف (بحد أقصى 5 ميجابايت)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "حجم الملف كبير جدًا. الحد الأقصى هو 5 ميجابايت" },
                { status: 400 }
            );
        }

        // التحقق من نوع الملف
        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "يرجى تحميل ملف صورة صالح" },
                { status: 400 }
            );
        }

        try {
            // اختيار صورة عشوائية من قائمة Unsplash
            const randomImage = unsplashImages[Math.floor(Math.random() * unsplashImages.length)];

            console.log(`Using random image from Unsplash: ${randomImage}`);

            // إرجاع عنوان URL للصورة
            return NextResponse.json({ url: randomImage });

        } catch (error) {
            console.error("Error processing upload:", error);
            return NextResponse.json(
                { error: "Error processing upload", details: error instanceof Error ? error.message : 'Unknown error' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error processing upload:", error);
        return NextResponse.json(
            { error: "Error processing upload", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// للاستخدام في API أخرى
export function getUploadedImageUrl(fileName: string): string | undefined {
    return uploadedImages.get(fileName);
} 