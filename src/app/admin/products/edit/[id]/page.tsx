'use client';

import { PageTitle } from "@/components/admin/PageTitle";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    mainImage: string;
    stock: number;
    categoryId: string;
};

// Sample data for development (same as in ProductsTable)
const sampleProducts = [
    {
        id: "sample-1",
        name: "Wireless Bluetooth Earbuds",
        description: "High-quality sound with noise cancellation",
        price: 89.99,
        mainImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
        stock: 45,
        categoryId: "", // No category ID for sample products
        createdAt: new Date(2023, 2, 15).toISOString(),
        category: { name: "Electronics", id: "" }
    },
    {
        id: "sample-2",
        name: "Smart Watch Series 5",
        description: "Track your fitness and receive notifications",
        price: 199.99,
        mainImage: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
        stock: 30,
        categoryId: "",
        createdAt: new Date(2023, 1, 25).toISOString(),
        category: { name: "Electronics", id: "" }
    },
    {
        id: "sample-3",
        name: "Leather Wallet",
        description: "Genuine leather wallet with multiple card slots",
        price: 49.99,
        mainImage: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=400&h=400&fit=crop",
        stock: 100,
        categoryId: "",
        createdAt: new Date(2023, 3, 5).toISOString(),
        category: { name: "Accessories", id: "" }
    },
    {
        id: "sample-4",
        name: "Cotton T-Shirt",
        description: "Comfortable 100% cotton t-shirt",
        price: 29.99,
        mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        stock: 78,
        categoryId: "",
        createdAt: new Date(2023, 2, 10).toISOString(),
        category: { name: "Clothing", id: "" }
    },
    {
        id: "sample-5",
        name: "Coffee Mug",
        description: "Ceramic coffee mug with modern design",
        price: 19.99,
        mainImage: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=400&fit=crop",
        stock: 120,
        categoryId: "",
        createdAt: new Date(2023, 3, 18).toISOString(),
        category: { name: "Home & Kitchen", id: "" }
    },
];

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                // Check if this is a sample product
                if (id.startsWith('sample-')) {
                    const sampleProduct = sampleProducts.find(p => p.id === id);
                    if (sampleProduct) {
                        // Convert sample product to match Product type
                        setProduct({
                            id: sampleProduct.id,
                            name: sampleProduct.name,
                            description: sampleProduct.description,
                            price: sampleProduct.price,
                            mainImage: sampleProduct.mainImage,
                            stock: sampleProduct.stock,
                            categoryId: sampleProduct.categoryId
                        });
                        return;
                    } else {
                        throw new Error('Sample product not found');
                    }
                }

                // If not a sample product, fetch from API
                const response = await fetch(`/api/admin/products/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch product data');
                }

                const data = await response.json();
                setProduct(data);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center text-red-500 py-8">
                {error || 'Product not found'}
                <div className="mt-4">
                    <button
                        onClick={() => router.push('/admin/products')}
                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-800"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageTitle
                title="Edit Product"
                description={`Editing product: ${product.name}`}
            />

            <div className="mt-6">
                <ProductForm
                    initialData={product}
                    isEditing={true}
                />
            </div>
        </div>
    );
} 