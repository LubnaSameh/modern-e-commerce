"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Save,
    Upload,
    Trash,
    Loader2
} from "lucide-react";
import { toast } from "react-toastify";

type ProductFormData = {
    id?: string;
    name: string;
    description: string;
    price: number;
    mainImage: string;
    stock: number;
    categoryId: string;
};

type Category = {
    id: string;
    name: string;
};

interface ProductFormProps {
    initialData?: ProductFormData;
    isEditing?: boolean;
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.mainImage || null);
    const [formData, setFormData] = useState<ProductFormData>(
        initialData || {
            name: "",
            description: "",
            price: 0,
            mainImage: "",
            stock: 0,
            categoryId: "",
        }
    );

    // Load categories from API instead of using dummy data
    const [categories, setCategories] = useState<Category[]>([]);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "price" || name === "stock") {
            setFormData({
                ...formData,
                [name]: parseFloat(value) || 0,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create a local preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
            };
            reader.readAsDataURL(file);

            try {
                // Upload the file to the server
                const imageFormData = new FormData();
                imageFormData.append('file', file);

                const response = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: imageFormData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to upload image');
                }

                const data = await response.json();

                // Update the form data with the image URL
                setFormData(prevFormData => ({
                    ...prevFormData,
                    mainImage: data.url,
                }));
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Handle sample products differently
            if (initialData && initialData.id && initialData.id.startsWith('sample-')) {
                // For sample products, just show a success message
                toast.success(isEditing ? "Sample product would be updated!" : "Sample product would be created!");

                // Redirect back to products page after 1 second
                setTimeout(() => {
                    router.push("/admin/products");
                    router.refresh();
                }, 1000);
                return;
            }

            const endpoint = isEditing
                ? `/api/admin/products/${initialData?.id}`
                : '/api/admin/products';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An error occurred');
            }

            // Show success message
            toast.success(isEditing ? "Product updated successfully!" : "Product created successfully!");

            // Redirect back to products page after successful submission
            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error("Error submitting product:", error);
            toast.error(`Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Image */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Product Image
                        </label>
                        <div className="flex items-center">
                            <div className="h-32 w-32 relative overflow-hidden rounded-md border border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                {imagePreview ? (
                                    <Image
                                        src={imagePreview}
                                        alt="Product preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400 dark:text-gray-500 text-sm">No image</span>
                                )}
                            </div>
                            <div className="ml-5">
                                <label htmlFor="image-upload" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Image
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setFormData({ ...formData, mainImage: "" });
                                        }}
                                        className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-red-600 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            JPG, PNG or GIF. Max size: 2MB.
                        </p>
                    </div>

                    {/* Product Name */}
                    <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Product Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                            required
                            placeholder="Enter product name"
                        />
                    </div>

                    {/* Product Description */}
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="Enter product description"
                        ></textarea>
                    </div>

                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Price
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="block w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                                required
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Stock */}
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Stock Quantity
                        </label>
                        <input
                            type="number"
                            min="0"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                            required
                            placeholder="0"
                        />
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                        <label htmlFor="categoryId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="mt-1 text-sm text-blue-600 dark:text-blue-400 font-medium">
                            مهم جداً: يجب اختيار فئة للمنتج حتى يظهر في قسم &quot;You may also like&quot; مع المنتجات المشابهة
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex items-center justify-end">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/products")}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {isEditing ? "Update Product" : "Save Product"}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
} 