import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Featured product categories from the app - must match the ones in ProductForm
const featuredCategories = [
    { id: "furniture", name: "Furniture" },
    { id: "electronics", name: "Electronics" },
    { id: "clothing", name: "Clothing" },
    { id: "accessories", name: "Accessories" },
    { id: "home-decor", name: "Home Decor" },
    { id: "kitchen", name: "Kitchen" },
    { id: "sports", name: "Sports" }
];

// GET - Fetch products with pagination, search, and filtering
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("q") || "";
        const categoryId = searchParams.get("categoryId") || "";

        // Normalize categoryId to lowercase for querying
        const normalizedCategoryId = categoryId.toLowerCase();

        const skip = (page - 1) * limit;

        // اتصال بقاعدة البيانات MongoDB
        const { db } = await connectToDatabase();
        const productsCollection = db.collection('products');
        const categoriesCollection = db.collection('categories');

        // Build the query for filtering
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (normalizedCategoryId) {
            query.categoryId = normalizedCategoryId;
        }

        // Get total count for pagination
        const total = await productsCollection.countDocuments(query);

        // Get products
        const products = await productsCollection.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        // Log products to understand the categoryId format
        console.log("Products with categoryIds:", products.map(p => ({
            id: p._id,
            name: p.name,
            categoryId: p.categoryId
        })));

        // Fetch categories from the database
        const dbCategories = await categoriesCollection.find({}).toArray();

        // Create a map of ALL categories (both from DB and featured)
        const categoriesMap = {};

        // Add database categories to the map
        dbCategories.forEach(category => {
            if (category._id) {
                categoriesMap[category._id.toString()] = category;
            }
            if (category.id) {
                categoriesMap[category.id] = category;
            }
        });

        // Add featured categories to the map
        featuredCategories.forEach(category => {
            categoriesMap[category.id] = category;
        });

        // Ensure each product has a category property
        const safeProducts = products.map(product => {
            let category = null;

            if (product.categoryId) {
                // For MongoDB ObjectId
                if (typeof product.categoryId === 'object' && product.categoryId._id) {
                    category = categoriesMap[product.categoryId.toString()];
                }
                // For string ID - try direct lookup
                else if (typeof product.categoryId === 'string') {
                    // Try to find in the categoriesMap
                    category = categoriesMap[product.categoryId];

                    // If not found and it's a featured category ID, create it
                    if (!category) {
                        const featuredCategory = featuredCategories.find(c => c.id === product.categoryId);
                        if (featuredCategory) {
                            category = featuredCategory;
                        }
                    }
                }
            }

            return {
                ...product,
                id: product._id.toString(),
                category: category || null
            };
        });

        return NextResponse.json({
            products: safeProducts,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Error fetching products", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

// POST - Create a new product
export async function POST(request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.price) {
            return NextResponse.json(
                { error: "Name and price are required fields" },
                { status: 400 }
            );
        }

        const {
            name,
            description,
            price,
            stock = 0,
            categoryId,
            mainImage,
            additionalImages,
            hasDiscount,
            discountPercent,
            discountStartDate,
            discountEndDate,
        } = body;

        // اتصال بقاعدة البيانات MongoDB
        const { db } = await connectToDatabase();
        const productsCollection = db.collection('products');
        const productImagesCollection = db.collection('productImages');
        const discountsCollection = db.collection('discounts');

        // Process the categoryId - convert to ObjectId if valid, otherwise ensure it's lowercase
        let processedCategoryId = null;
        if (categoryId) {
            try {
                if (ObjectId.isValid(categoryId)) {
                    processedCategoryId = new ObjectId(categoryId);
                } else {
                    // Keep as string for non-MongoDB IDs (like featured categories)
                    // Ensure it's lowercase for consistency
                    processedCategoryId = String(categoryId).toLowerCase();
                }
            } catch (error) {
                console.warn("Could not convert categoryId to ObjectId, using as lowercase string:", error);
                processedCategoryId = String(categoryId).toLowerCase();
            }
        }

        // Create the product
        const productData = {
            name,
            description: description || "",
            price: typeof price === 'string' ? parseFloat(price) : price,
            stock: typeof stock === 'string' ? parseInt(stock) : stock,
            categoryId: processedCategoryId,
            mainImage: mainImage || "",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await productsCollection.insertOne(productData);
        const productId = result.insertedId;

        // Add additional images if provided
        if (additionalImages && additionalImages.length > 0) {
            const imageDocuments = additionalImages.map(url => ({
                url,
                productId: productId.toString(),
                createdAt: new Date()
            }));

            await productImagesCollection.insertMany(imageDocuments);
        }

        // Add discount if enabled
        if (hasDiscount && discountPercent) {
            const discountData = {
                productId: productId.toString(),
                name: `${discountPercent}% off`,
                discountPercent: parseFloat(discountPercent),
                active: true,
                startDate: discountStartDate ? new Date(discountStartDate) : null,
                endDate: discountEndDate ? new Date(discountEndDate) : null,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await discountsCollection.insertOne(discountData);
        }

        console.log("Product created successfully:", productData);
        return NextResponse.json({
            success: true,
            product: {
                _id: productId,
                ...productData
            }
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Error creating product", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
} 