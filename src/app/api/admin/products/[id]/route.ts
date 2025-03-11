import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Fetch a single product by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Temporarily disable authentication check for development
        /*
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "غير مصرح لك بالوصول" },
                { status: 403 }
            );
        }
        */

        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
                category: true,
                productImages: true,
                discount: true,
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: "المنتج غير موجود" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
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
        // Temporarily disable authentication check for development
        /*
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "غير مصرح لك بالوصول" },
                { status: 403 }
            );
        }
        */

        const body = await request.json();

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
        const existingProduct = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
                productImages: true,
                discount: true,
            },
        });

        if (!existingProduct) {
            return NextResponse.json(
                { error: "المنتج غير موجود" },
                { status: 404 }
            );
        }

        // Update the product
        const updatedProduct = await prisma.product.update({
            where: { id: params.id },
            data: {
                name,
                description,
                price,
                stock,
                categoryId,
                mainImage,
            },
        });

        // Handle additional images
        if (additionalImages) {
            // Delete existing images
            await prisma.productImage.deleteMany({
                where: { productId: params.id },
            });

            // Add new images
            if (additionalImages.length > 0) {
                await prisma.productImage.createMany({
                    data: additionalImages.map((url: string) => ({
                        url,
                        productId: params.id,
                    })),
                });
            }
        }

        // Handle discount
        if (hasDiscount && discountPercent) {
            // Update or create discount
            if (existingProduct.discount) {
                await prisma.discount.update({
                    where: { productId: params.id },
                    data: {
                        name: `${discountPercent}% off`,
                        discountPercent,
                        active: true,
                        startDate: discountStartDate ? new Date(discountStartDate) : null,
                        endDate: discountEndDate ? new Date(discountEndDate) : null,
                    },
                });
            } else {
                await prisma.discount.create({
                    data: {
                        productId: params.id,
                        name: `${discountPercent}% off`,
                        discountPercent,
                        active: true,
                        startDate: discountStartDate ? new Date(discountStartDate) : null,
                        endDate: discountEndDate ? new Date(discountEndDate) : null,
                    },
                });
            }
        } else if (!hasDiscount && existingProduct.discount) {
            // Remove discount if it exists and is disabled
            await prisma.discount.delete({
                where: { productId: params.id },
            });
        }

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
        // Temporarily disable authentication check for development
        /*
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "غير مصرح لك بالوصول" },
                { status: 403 }
            );
        }
        */

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: params.id },
        });

        if (!product) {
            return NextResponse.json(
                { error: "المنتج غير موجود" },
                { status: 404 }
            );
        }

        // Delete related records first
        await prisma.productImage.deleteMany({
            where: { productId: params.id },
        });

        await prisma.discount.deleteMany({
            where: { productId: params.id },
        });

        // Delete the product
        await prisma.product.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء حذف المنتج" },
            { status: 500 }
        );
    }
} 