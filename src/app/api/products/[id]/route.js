import { NextResponse } from 'next/server';
import {
    getProductById,
    updateProduct,
    deleteProduct
} from '@/models/Product';

// Helper function to ensure consistent product structure
function normalizeProduct(product) {
    if (!product) return null;

    // Ensure categoryId is lowercase if it exists
    const categoryId = product.categoryId ? String(product.categoryId).toLowerCase() : undefined;

    // Determine the category name to use
    let categoryName;
    if (product.category && product.category.name) {
        categoryName = product.category.name;
    } else if (product.category && typeof product.category === 'string') {
        categoryName = product.category;
    } else if (categoryId) {
        categoryName = categoryId; // Use the lowercase categoryId as the name if no explicit name exists
    } else {
        categoryName = 'Uncategorized';
    }

    return {
        ...product,
        // Normalize the categoryId to lowercase
        categoryId: categoryId,
        // Ensure category is in the right format
        category: {
            name: categoryName
        }
    };
}

// الحصول على منتج معين باستخدام ID
export async function GET(request, { params }) {
    try {
        // Extract ID properly
        const id = params?.id;

        if (!id) {
            return NextResponse.json(
                { error: 'المنتج غير موجود - معرف مفقود' },
                { status: 404 }
            );
        }

        const product = await getProductById(id);

        if (!product) {
            return NextResponse.json(
                { error: 'المنتج غير موجود' },
                { status: 404 }
            );
        }

        // Normalize the product data before returning
        const normalizedProduct = normalizeProduct(product);

        return NextResponse.json({ product: normalizedProduct });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'حدث خطأ أثناء الحصول على المنتج' },
            { status: 500 }
        );
    }
}

// تحديث منتج
export async function PUT(request, { params }) {
    try {
        // Extract ID properly
        const id = params?.id;

        if (!id) {
            return NextResponse.json(
                { error: 'المنتج غير موجود - معرف مفقود' },
                { status: 404 }
            );
        }

        const body = await request.json();
        const result = await updateProduct(id, body);

        if (!result) {
            return NextResponse.json(
                { error: 'فشل في تحديث المنتج أو المنتج غير موجود' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, product: result });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'حدث خطأ أثناء تحديث المنتج' },
            { status: 500 }
        );
    }
}

// حذف منتج
export async function DELETE(request, { params }) {
    try {
        // Extract ID properly
        const id = params?.id;

        if (!id) {
            return NextResponse.json(
                { error: 'المنتج غير موجود - معرف مفقود' },
                { status: 404 }
            );
        }

        const success = await deleteProduct(id);

        if (!success) {
            return NextResponse.json(
                { error: 'فشل في حذف المنتج أو المنتج غير موجود' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'حدث خطأ أثناء حذف المنتج' },
            { status: 500 }
        );
    }
} 