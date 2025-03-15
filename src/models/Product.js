import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';

export const PRODUCTS_COLLECTION = 'products';

// دالة للحصول على كل المنتجات
export async function getAllProducts() {
    const collection = await getCollection(PRODUCTS_COLLECTION);
    return collection.find({}).toArray();
}

// دالة للحصول على منتج باستخدام الـ ID
export async function getProductById(id) {
    const collection = await getCollection(PRODUCTS_COLLECTION);

    try {
        // محاولة تحويل الـ ID إلى ObjectId (تنسيق MongoDB)
        const _id = new ObjectId(id);
        return collection.findOne({ _id });
    } catch (error) {
        // في حالة كان الـ ID ليس بتنسيق صحيح
        console.error('Invalid ObjectId format:', error);
        return null;
    }
}

// دالة لإنشاء منتج جديد
export async function createProduct(productData) {
    const collection = await getCollection(PRODUCTS_COLLECTION);

    // إضافة تاريخ الإنشاء والتحديث
    const product = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await collection.insertOne(product);
    return { id: result.insertedId, ...product };
}

// دالة لتحديث منتج موجود
export async function updateProduct(id, productData) {
    const collection = await getCollection(PRODUCTS_COLLECTION);

    try {
        const _id = new ObjectId(id);

        // تحديث تاريخ التعديل
        const updatedProduct = {
            ...productData,
            updatedAt: new Date()
        };

        const result = await collection.updateOne(
            { _id },
            { $set: updatedProduct }
        );

        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error updating product:', error);
        return false;
    }
}

// دالة لحذف منتج
export async function deleteProduct(id) {
    const collection = await getCollection(PRODUCTS_COLLECTION);

    try {
        const _id = new ObjectId(id);
        const result = await collection.deleteOne({ _id });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

// دالة للبحث عن منتجات
export async function searchProducts(query) {
    const collection = await getCollection(PRODUCTS_COLLECTION);

    // بحث في اسم المنتج والوصف
    return collection.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ]
    }).toArray();
}

// دالة للحصول على المنتجات حسب التصنيف
export async function getProductsByCategory(categoryId) {
    const collection = await getCollection(PRODUCTS_COLLECTION);

    // Normalize the categoryId to lowercase for consistent querying
    const normalizedCategoryId = categoryId ? categoryId.toLowerCase() : categoryId;

    return collection.find({ categoryId: normalizedCategoryId }).toArray();
} 