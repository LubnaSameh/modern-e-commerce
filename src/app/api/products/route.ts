import { NextResponse } from "next/server";
import { mockProducts } from "@/lib/mockData";

// GET - Fetch products with pagination, search, and filtering
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("q") || "";
        const categoryId = searchParams.get("categoryId") || "";
        const categoryName = searchParams.get("category") || "";
        const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice") || "0") : undefined;
        const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice") || "0") : undefined;

        // Log request parameters for debugging
        console.log("API Request - GET /api/products:", {
            page, limit, search, categoryId, categoryName, minPrice, maxPrice
        });

        // Filter the mock products based on search criteria
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

        if (categoryName) {
            filteredProducts = filteredProducts.filter(product =>
                product.category.name.toLowerCase() === categoryName.toLowerCase()
            );
        }

        if (minPrice !== undefined) {
            filteredProducts = filteredProducts.filter(product =>
                product.price >= minPrice
            );
        }

        if (maxPrice !== undefined) {
            filteredProducts = filteredProducts.filter(product =>
                product.price <= maxPrice
            );
        }

        // Get total for pagination
        const total = filteredProducts.length;

        // Apply pagination
        const skip = (page - 1) * limit;
        const paginatedProducts = filteredProducts.slice(skip, skip + limit);

        console.log(`Products API - Found ${paginatedProducts.length} products`);

        return NextResponse.json({
            products: paginatedProducts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Error fetching products", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 