import { NextResponse } from 'next/server';
import {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByCategory
} from '@/models/Product';

// Helper function to ensure consistent product structure
function normalizeProduct(product) {
    // Ensure categoryId is lowercase if it exists
    const categoryId = product.categoryId ? String(product.categoryId).toLowerCase() : undefined;

    // Determine the category name to use
    let categoryName;
    if (product.category && product.category.name) {
        categoryName = product.category.name;
    } else if (product.category && typeof product.category === 'string') {
        categoryName = product.category;
    } else if (categoryId) {
        // Map common category IDs to proper names
        const categoryMap = {
            'home-decor': 'Home Decor',
            'electronics': 'Electronics',
            'clothing': 'Clothing',
            'accessories': 'Accessories',
            'furniture': 'Furniture',
            'kitchen': 'Kitchen',
            'sports': 'Sports'
        };
        categoryName = categoryMap[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    } else {
        categoryName = 'Uncategorized';
    }

    return {
        ...product,
        // Normalize the categoryId to lowercase
        categoryId: categoryId,
        // Ensure category is in the right format
        category: product.category && typeof product.category === 'object' ? {
            ...product.category,
            name: product.category.name // Keep existing name
        } : {
            name: categoryName
        }
    };
}

// دعم طريقة HEAD للـ keep-alive
export async function HEAD(request) {
    // ببساطة ترجع استجابة فارغة بحالة 200 OK
    return new NextResponse(null, {
        status: 200, headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}

// دعم طريقة OPTIONS للـ CORS
export async function OPTIONS(request) {
    return new NextResponse(null, {
        status: 200, headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}

// الحصول على كل المنتجات أو البحث بينهم
export async function GET(request) {
    try {
        // Get search query if present
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const categoryId = searchParams.get('category');
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : null;

        // إذا كان هذا طلب keepAlive، أرجع استجابة فارغة بحالة 200
        const keepAlive = searchParams.get('keepAlive');
        if (keepAlive === 'true') {
            return new NextResponse(null, {
                status: 200, headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                }
            });
        }

        let products;

        // If there's a search query, filter products by it
        if (query) {
            products = await searchProducts(query);
        }
        // If there's a category filter, get products by category
        else if (categoryId) {
            // Normalize the categoryId to lowercase for consistent filtering
            const normalizedCategoryId = categoryId.toLowerCase();
            products = await getProductsByCategory(normalizedCategoryId);
        }
        // Otherwise, get all products
        else {
            products = await getAllProducts();
        }

        // Normalize all products to ensure consistent structure
        let normalizedProducts = products.map(normalizeProduct);

        // Apply limit if specified
        if (limit && normalizedProducts.length > limit) {
            normalizedProducts = normalizedProducts.slice(0, limit);
        }

        return NextResponse.json({ products: normalizedProducts }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'حدث خطأ أثناء الحصول على المنتجات', details: error.message },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                }
            }
        );
    }
}

// إنشاء منتج جديد
export async function POST(request) {
    try {
        const productData = await request.json();

        // التحقق من البيانات الأساسية المطلوبة
        if (!productData.name || !productData.price) {
            return NextResponse.json(
                { error: 'اسم المنتج والسعر مطلوبان' },
                {
                    status: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                    }
                }
            );
        }

        const newProduct = await createProduct(productData);
        const normalizedProduct = normalizeProduct(newProduct);

        return NextResponse.json(
            { message: 'تم إنشاء المنتج بنجاح', product: normalizedProduct },
            {
                status: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                }
            }
        );
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'حدث خطأ أثناء إنشاء المنتج' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                }
            }
        );
    }
}

