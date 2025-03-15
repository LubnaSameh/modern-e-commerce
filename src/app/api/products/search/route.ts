import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        // Get search term from request using both 'q' and 'term' for compatibility
        const searchParams = new URL(request.url).searchParams;
        const searchTerm = searchParams.get("q") || searchParams.get("term") || "";

        // For logging
        console.log(`Searching for: "${searchTerm}"`);

        // Initialize database results array
        let dbResults: any[] = [];

        // Return empty results if search term is empty
        if (!searchTerm || searchTerm.trim() === '') {
            return NextResponse.json([]);
        }

        // Try to get results from database
        try {
            // Connect to MongoDB database
            const { db } = await connectToDatabase();
            const productsCollection = db.collection('products');
            const categoriesCollection = db.collection('categories');

            // Find products matching the search term
            const products = await productsCollection.find({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } }
                ]
            })
                .limit(10)
                .toArray();

            // Get category information for these products
            const productIds = products.map(product => product.categoryId).filter(Boolean);
            const categories = productIds.length > 0
                ? await categoriesCollection.find({ _id: { $in: productIds } }).toArray()
                : [];

            // Map categories to products
            const categoriesMap = categories.reduce((map, category) => {
                map[category._id.toString()] = category;
                return map;
            }, {});

            // Format the database results
            dbResults = products.map(product => {
                const category = product.categoryId ? categoriesMap[product.categoryId] : null;
                return {
                    id: product._id.toString(),
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    image: product.mainImage || '',
                    category: category?.name || ''
                };
            });

            console.log(`Found ${dbResults.length} products in database for "${searchTerm}"`);
        } catch (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json([]);
        }

        // Limit to 10 results
        const limitedResults = dbResults.slice(0, 10);

        return NextResponse.json(limitedResults);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Failed to search products: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
} 