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

// GET - Fetch a single product by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Extract the ID properly
        const productIdString = params.id;

        if (!productIdString) {
            return NextResponse.json(
                { error: "المنتج غير موجود - معرف مفقود" },
                { status: 404 }
            );
        }

        const { db } = await connectToDatabase();
        const productsCollection = db.collection('products');
        const categoriesCollection = db.collection('categories');
        const productImagesCollection = db.collection('productImages');
        const discountsCollection = db.collection('discounts');

        // Convert string ID to ObjectId
        let productId;
        try {
            productId = new ObjectId(productIdString);
        } catch (error) {
            return NextResponse.json(
                { error: "المنتج غير موجود - معرف غير صالح" },
                { status: 404 }
            );
        }

        // Find the product
        const product = await productsCollection.findOne({ _id: productId });

        if (!product) {
            return NextResponse.json(
                { error: "المنتج غير موجود" },
                { status: 404 }
            );
        }

        // Get category if exists - check both DB and featured categories
        let category = null;
        if (product.categoryId) {
            // First try to find in DB
            try {
                // Check if categoryId is a valid ObjectId
                if (typeof product.categoryId === 'object' ||
                    (typeof product.categoryId === 'string' && ObjectId.isValid(product.categoryId))) {
                    category = await categoriesCollection.findOne({
                        _id: typeof product.categoryId === 'object' ?
                            product.categoryId : new ObjectId(product.categoryId)
                    });
                }

                // If not found as ObjectId, try as string ID
                if (!category && typeof product.categoryId === 'string') {
                    // Try to find in database by string ID
                    category = await categoriesCollection.findOne({
                        id: product.categoryId
                    });

                    // If still not found, check featured categories
                    if (!category) {
                        category = featuredCategories.find(c => c.id === product.categoryId);
                    }
                }
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        }

        // Get product images
        const productImages = await productImagesCollection.find({
            productId: productIdString
        }).toArray();

        // Get discount if exists
        const discount = await discountsCollection.findOne({
            productId: productIdString
        });

        // Format product data for the response
        // Convert MongoDB _id to id for frontend compatibility
        const formattedProduct = {
            id: product._id.toString(),
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            mainImage: product.mainImage,
            categoryId: product.categoryId,
            // Include other relevant fields
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            category,
            productImages,
            discount
        };

        return NextResponse.json(formattedProduct);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب المنتج" },
            { status: 500 }
        );
    }
}

// PUT - Update a product
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Extract the ID properly
        const productIdString = params.id;

        if (!productIdString) {
            return NextResponse.json(
                { error: "المنتج غير موجود - معرف مفقود" },
                { status: 404 }
            );
        }

        const { db } = await connectToDatabase();
        const productsCollection = db.collection('products');
        const productImagesCollection = db.collection('productImages');
        const discountsCollection = db.collection('discounts');

        // Convert string ID to ObjectId
        let productId;
        try {
            productId = new ObjectId(productIdString);
        } catch (error) {
            return NextResponse.json(
                { error: "المنتج غير موجود - معرف غير صالح" },
                { status: 404 }
            );
        }

        const body = await request.json();
        console.log("Received product update data:", body);

        const {
            name,
            description,
            price,
            stock,
            categoryId,
            mainImage,
            additionalImages,
            hasDiscount,
            discountPercent,
            discountStartDate,
            discountEndDate,
        } = body;

        // Check if product exists
        const existingProduct = await productsCollection.findOne({ _id: productId });

        if (!existingProduct) {
            return NextResponse.json(
                { error: "المنتج غير موجود" },
                { status: 404 }
            );
        }

        console.log("Existing product:", existingProduct);
        console.log("Updating mainImage from:", existingProduct.mainImage, "to:", mainImage);

        // Get existing discount
        const existingDiscount = await discountsCollection.findOne({
            productId: productIdString
        });

        // Process the categoryId - convert to ObjectId if valid
        let processedCategoryId = null;
        if (categoryId) {
            try {
                if (ObjectId.isValid(categoryId)) {
                    processedCategoryId = new ObjectId(categoryId);
                } else {
                    // Keep as string for non-MongoDB IDs (like featured categories)
                    processedCategoryId = categoryId;
                }
            } catch (error) {
                console.warn("Could not convert categoryId to ObjectId, using as string:", error);
                processedCategoryId = categoryId;
            }
        }

        // Update the product
        const updateData = {
            name,
            description,
            price: typeof price === 'string' ? parseFloat(price) : price,
            stock: typeof stock === 'string' ? parseInt(stock) : stock,
            categoryId: processedCategoryId,
            mainImage,
            updatedAt: new Date()
        };

        console.log("Update data being applied:", updateData);

        await productsCollection.updateOne(
            { _id: productId },
            { $set: updateData }
        );

        // Handle additional images
        if (additionalImages) {
            // Delete existing images
            await productImagesCollection.deleteMany({
                productId: productIdString
            });

            // Add new images
            if (additionalImages.length > 0) {
                const imageDocuments = additionalImages.map(url => ({
                    url,
                    productId: productIdString,
                    createdAt: new Date()
                }));

                await productImagesCollection.insertMany(imageDocuments);
            }
        }

        // Handle discount
        if (hasDiscount && discountPercent) {
            const discountData = {
                name: `${discountPercent}% off`,
                discountPercent: parseFloat(discountPercent),
                active: true,
                startDate: discountStartDate ? new Date(discountStartDate) : null,
                endDate: discountEndDate ? new Date(discountEndDate) : null,
                updatedAt: new Date()
            };

            // Update or create discount
            if (existingDiscount) {
                await discountsCollection.updateOne(
                    { productId: productIdString },
                    { $set: discountData }
                );
            } else {
                await discountsCollection.insertOne({
                    ...discountData,
                    productId: productIdString,
                    createdAt: new Date()
                });
            }
        } else if (!hasDiscount && existingDiscount) {
            // Remove discount if it exists and is disabled
            await discountsCollection.deleteOne({
                productId: productIdString
            });
        }

        // Get updated product
        const updatedProduct = await productsCollection.findOne({ _id: productId });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء تحديث المنتج" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a product
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Ensure params.id is properly extracted
        const productIdString = params.id;

        if (!productIdString) {
            return NextResponse.json(
                { error: "المنتج غير موجود - معرف مفقود" },
                { status: 404 }
            );
        }

        // Convert string ID to ObjectId
        let productId;
        try {
            productId = new ObjectId(productIdString);
        } catch (error) {
            return NextResponse.json(
                { error: "المنتج غير موجود - معرف غير صالح" },
                { status: 404 }
            );
        }

        const { db } = await connectToDatabase();
        const productsCollection = db.collection('products');
        const productImagesCollection = db.collection('productImages');
        const discountsCollection = db.collection('discounts');

        // Check if product exists first
        const existingProduct = await productsCollection.findOne({ _id: productId });
        if (!existingProduct) {
            return NextResponse.json(
                { error: "المنتج غير موجود" },
                { status: 404 }
            );
        }

        // Delete related records first
        await productImagesCollection.deleteMany({
            productId: productIdString
        });

        await discountsCollection.deleteMany({
            productId: productIdString
        });

        // Delete the product
        await productsCollection.deleteOne({ _id: productId });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء حذف المنتج" },
            { status: 500 }
        );
    }
} 