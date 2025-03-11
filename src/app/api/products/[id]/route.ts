import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch a single product by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log(`API Request - GET /api/products/${params.id}`);
        
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
                category: true,
                productImages: true,
                discount: true,
            },
        });

        if (!product) {
            console.log(`Product not found with ID: ${params.id}`);
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        console.log(`Found product: ${product.name}, Category: ${product.category?.name || 'None'}`);
        console.log(`Product images: ${product.productImages?.length || 0}, Main image: ${product.mainImage ? 'Yes' : 'No'}`);
        
        return NextResponse.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Error fetching product", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 