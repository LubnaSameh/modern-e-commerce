import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';

export const USERS_COLLECTION = 'users';

// دالة للحصول على كل المستخدمين
export async function getAllUsers() {
    const collection = await getCollection(USERS_COLLECTION);
    return collection.find({}).toArray();
}

// دالة للحصول على مستخدم بواسطة الـ ID
export async function getUserById(id) {
    const collection = await getCollection(USERS_COLLECTION);

    try {
        const _id = new ObjectId(id);
        return collection.findOne({ _id });
    } catch (error) {
        console.error('Invalid ObjectId format:', error);
        return null;
    }
}

// دالة للحصول على مستخدم بواسطة البريد الإلكتروني
export async function getUserByEmail(email) {
    const collection = await getCollection(USERS_COLLECTION);
    return collection.findOne({ email });
}

// دالة لإنشاء مستخدم جديد
export async function createUser(userData) {
    const collection = await getCollection(USERS_COLLECTION);

    const user = {
        ...userData,
        role: userData.role || 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await collection.insertOne(user);
    return { id: result.insertedId, ...user };
}

// دالة لتحديث مستخدم
export async function updateUser(id, userData) {
    const collection = await getCollection(USERS_COLLECTION);

    try {
        const _id = new ObjectId(id);

        const updatedUser = {
            ...userData,
            updatedAt: new Date()
        };

        const result = await collection.updateOne(
            { _id },
            { $set: updatedUser }
        );

        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error updating user:', error);
        return false;
    }
}

// دالة لحذف مستخدم
export async function deleteUser(id) {
    const collection = await getCollection(USERS_COLLECTION);

    try {
        const _id = new ObjectId(id);
        const result = await collection.deleteOne({ _id });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting user:', error);
        return false;
    }
} 