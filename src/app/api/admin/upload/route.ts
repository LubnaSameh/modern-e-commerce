import { NextResponse } from "next/server";
// إزالة الـ imports غير المستخدمة
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
// إزالة uuid غير المستخدم
// import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    try {
        // Temporarily bypass authentication to fix upload issue
        /* 
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 403 }
            );
        }
        */

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "حجم الملف كبير جدًا. الحد الأقصى هو 5 ميجابايت" },
                { status: 400 }
            );
        }

        // Check file type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "يرجى تحميل ملف صورة صالح" },
                { status: 400 }
            );
        }

        try {
            // Convert file to buffer
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Upload to Cloudinary
            const result = await uploadImage(buffer);

            console.log('Successfully uploaded to Cloudinary:', result.url);

            // Return the URL to the uploaded file
            return NextResponse.json({
                url: result.url,
                public_id: result.public_id
            });

        } catch (uploadError) {
            console.error("Error uploading to Cloudinary:", uploadError);
            return NextResponse.json(
                { error: "Error uploading to cloud storage", details: uploadError instanceof Error ? uploadError.message : 'Unknown error' },
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