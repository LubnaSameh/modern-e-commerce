import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { mockProducts, mockCategories } from "@/lib/mockData";

// GET - Get all products (for admin)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("q") || "";
        const categoryId = searchParams.get("categoryId") || "";

        // Filter the products
        let filteredProducts = [...mockProducts];

        if (search) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (categoryId) {
            filteredProducts = filteredProducts.filter(product =>
                product.categoryId === categoryId
            );
        }

        // Get total for pagination
        const total = filteredProducts.length;

        // Apply pagination
        const skip = (page - 1) * limit;
        const paginatedProducts = filteredProducts.slice(skip, skip + limit);

        console.log(`Admin Products API - Found ${paginatedProducts.length} products`);

        return NextResponse.json({
            products: paginatedProducts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching admin products:", error);
        return NextResponse.json(
            { error: "Error fetching products", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// POST - Create a new product
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.price || !body.categoryId) {
            return NextResponse.json(
                { error: "Name, price, and category are required" },
                { status: 400 }
            );
        }

        // Check if category exists
        const categoryExists = mockCategories.some(cat => cat.id === body.categoryId);
        if (!categoryExists) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 400 }
            );
        }

        // Create new product ID
        const newId = uuidv4();

        // Get the category for the product
        const category = mockCategories.find(cat => cat.id === body.categoryId);

        // Create the new product
        const newProduct = {
            id: newId,
            name: body.name,
            description: body.description || "",
            price: parseFloat(body.price),
            stock: parseInt(body.stock || "0"),
            mainImage: body.mainImage || "/products/placeholder.jpg",
            image: body.mainImage || "/products/placeholder.jpg",
            images: body.images || [body.mainImage || "/products/placeholder.jpg"],
            categoryId: body.categoryId,
            category: category,
            productImages: body.images
                ? body.images.map((img: string, i: number) => ({
                    id: `${newId}-img-${i}`,
                    url: img,
                    productId: newId
                }))
                : [{
                    id: `${newId}-img-0`,
                    url: body.mainImage || "/products/placeholder.jpg",
                    productId: newId
                }],
            discount: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Add to our mock products
        mockProducts.push(newProduct);

        console.log(`Created new product: ${newProduct.name} (ID: ${newProduct.id})`);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Error creating product", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 