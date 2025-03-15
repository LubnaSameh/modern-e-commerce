import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // اتصال بقاعدة البيانات MongoDB
        const { db } = await connectToDatabase();
        const categoriesCollection = db.collection('categories');
        const productsCollection = db.collection('products');

        // Convert string ID to ObjectId
        let categoryId;
        try {
            categoryId = new ObjectId(id);
        } catch (error) {
            return NextResponse.json(
                { error: "التصنيف غير موجود - معرف غير صالح" },
                { status: 404 }
            );
        }

        // Find the category
        const category = await categoriesCollection.findOne({ _id: categoryId });

        if (!category) {
            return NextResponse.json(
                { error: 'التصنيف غير موجود' },
                { status: 404 }
            );
        }

        // Count products in this category
        const productCount = await productsCollection.countDocuments({
            categoryId: id
        });

        // Add product count to category
        const categoryWithCount = {
            ...category,
            _count: {
                products: productCount
            }
        };

        return NextResponse.json(categoryWithCount);
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { error: 'حدث خطأ أثناء جلب التصنيف', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
} 