import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const categoryId = params.id;

        // التحقق من وجود التصنيف
        const category = await db.category.findUnique({
            where: { id: categoryId },
            include: {
                products: {
                    include: {
                        discount: true,
                        productImages: true,
                    },
                },
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: 'لم يتم العثور على التصنيف' },
                { status: 404 }
            );
        }

        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        console.error('Error fetching category details:', error);
        return NextResponse.json(
            { error: 'حدث خطأ أثناء جلب تفاصيل التصنيف' },
            { status: 500 }
        );
    }
} 