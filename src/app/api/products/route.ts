import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

        const skip = (page - 1) * limit;

        // Build the where clause for filtering
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }
        
        // Filter by category name if provided
        if (categoryName) {
            where.category = {
                name: {
                    equals: categoryName
                }
            };
        }
        
        // Filter by price range if provided
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            
            if (minPrice !== undefined) {
                where.price.gte = minPrice;
            }
            
            if (maxPrice !== undefined) {
                where.price.lte = maxPrice;
            }
        }
        
        // Log the constructed where clause for debugging
        console.log("Products API - Where clause:", JSON.stringify(where));

        // Get total count for pagination
        const total = await prisma.product.count({ where });
        console.log(`Products API - Total count: ${total}`);

        // Get products
        const products = await prisma.product.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        });
        
        console.log(`Products API - Found ${products.length} products`);
        
        // Log first product for debugging (if exists)
        if (products.length > 0) {
            console.log("Products API - First product sample:", {
                id: products[0].id,
                name: products[0].name,
                category: products[0].category?.name || null,
                createdAt: products[0].createdAt // Log creation date for debugging
            });
        }

        // Ensure each product has a category property, even if it's null
        const safeProducts = products.map(product => ({
            ...product,
            category: product.category || null,
        }));

        return NextResponse.json({
            products: safeProducts,
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