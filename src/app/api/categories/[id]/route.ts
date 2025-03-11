import { NextRequest, NextResponse } from 'next/server';
import { mockCategories, mockProducts } from '@/lib/mockData';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const categoryId = params.id;

        // البحث عن الفئة المطلوبة
        const category = mockCategories.find(cat => cat.id === categoryId);

        if (!category) {
            return NextResponse.json(
                { error: 'لم يتم العثور على التصنيف' },
                { status: 404 }
            );
        }

        // الحصول على منتجات هذه الفئة
        const categoryProducts = mockProducts.filter(product => product.categoryId === categoryId);

        // إضافة المنتجات إلى الفئة
        const categoryWithProducts = {
            ...category,
            products: categoryProducts
        };

        return NextResponse.json(categoryWithProducts, { status: 200 });
    } catch (error) {
        console.error('Error fetching category details:', error);
        return NextResponse.json(
            { error: 'حدث خطأ أثناء جلب تفاصيل التصنيف' },
            { status: 500 }
        );
    }
} 