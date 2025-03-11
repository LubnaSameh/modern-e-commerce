import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch products with pagination, search, and filtering
export async function GET(request: Request) {
    try {
        // Temporarily disable authentication check for development
        /*
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 403 }
            );
        }
        */

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("q") || "";
        const categoryId = searchParams.get("categoryId") || "";

        const skip = (page - 1) * limit;

        // Build the where clause for filtering
        const where: Prisma.ProductWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        // Get total count for pagination
        const total = await prisma.product.count({ where });

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
            { error: "Error fetching products" },
            { status: 500 }
        );
    }
}

// POST - Create a new product
export async function POST(request: Request) {
    try {
        // Temporarily disable authentication check for development
        /*
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 403 }
            );
        }
        */

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

        // Create the product
        const product = await prisma.product.create({
            data: {
                name,
                description: description || "",
                price: typeof price === 'string' ? parseFloat(price) : price,
                stock: typeof stock === 'string' ? parseInt(stock) : stock,
                categoryId: categoryId || null,
                mainImage: mainImage || "",
            },
        });

        // Add additional images if provided
        if (additionalImages && additionalImages.length > 0) {
            await prisma.productImage.createMany({
                data: additionalImages.map((url: string) => ({
                    url,
                    productId: product.id,
                })),
            });
        }

        // Add discount if enabled
        if (hasDiscount && discountPercent) {
            await prisma.discount.create({
                data: {
                    productId: product.id,
                    name: `${discountPercent}% off`,
                    discountPercent,
                    active: true,
                    startDate: discountStartDate ? new Date(discountStartDate) : null,
                    endDate: discountEndDate ? new Date(discountEndDate) : null,
                },
            });
        }

        console.log("Product created successfully:", product);
        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Error creating product", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
} 