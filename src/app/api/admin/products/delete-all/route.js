import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { PRODUCTS_COLLECTION } from '@/models/Product';

// API endpoint to delete all products
export async function DELETE(request) {
    try {
        const collection = await getCollection(PRODUCTS_COLLECTION);

        // Delete all documents from the products collection
        const result = await collection.deleteMany({});

        return NextResponse.json({
            message: `All products have been deleted successfully. Deleted count: ${result.deletedCount}`,
            deletedCount: result.deletedCount
        }, { status: 200 });
    } catch (error) {
        console.error('Error deleting all products:', error);
        return NextResponse.json(
            { error: 'An error occurred while deleting all products', details: error.message },
            { status: 500 }
        );
    }
} 