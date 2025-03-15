import { NextResponse } from 'next/server';
// إزالة استيراد الاتصال بقاعدة البيانات لأننا لن نستخدمه
// import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        // إرجاع مصفوفة فارغة مباشرة بدلاً من جلب البيانات من قاعدة البيانات
        return NextResponse.json([], { status: 200 });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Error fetching categories', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
} 