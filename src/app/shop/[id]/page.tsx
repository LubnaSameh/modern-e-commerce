"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import ProductGallery from "@/components/shop/ProductDetails/ProductGallery";
import ProductInfo from "@/components/shop/ProductDetails/ProductInfo";
import ProductTabs from "@/components/shop/ProductDetails/ProductTabs";
import RelatedProducts from "@/components/shop/ProductDetails/RelatedProducts";

// Sample products data (same as in ProductGrid and ProductsTable)
const sampleProducts = [
    {
        id: "sample-1",
        name: "Wireless Bluetooth Earbuds",
        price: 89.99,
        description: "High-quality sound with noise cancellation. Experience premium audio with these comfortable, long-lasting earbuds.",
        rating: 4.5,
        reviewCount: 85,
        images: [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500&auto=format&fit=crop&q=60"
        ],
        stock: 45,
        category: "Electronics",
        isNew: true,
        features: [
            "Active Noise Cancellation",
            "Bluetooth 5.0 connectivity",
            "8-hour battery life",
            "Touch controls",
            "Water resistant"
        ],
        specifications: {
            "Brand": "AudioTech",
            "Model": "BT-500",
            "Connectivity": "Bluetooth 5.0",
            "Battery Life": "8 hours (30 with case)",
            "Water Resistance": "IPX4",
            "Charging": "USB-C"
        }
    },
    {
        id: "sample-2",
        name: "Smart Watch Series 5",
        price: 199.99,
        description: "Track your fitness and receive notifications. This smart watch features health monitoring and smart notifications.",
        rating: 4.8,
        reviewCount: 110,
        images: [
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=60"
        ],
        stock: 30,
        category: "Electronics",
        isNew: true,
        isFeatured: true,
        colors: ["black", "silver", "blue"],
        features: [
            "Heart rate monitoring",
            "Sleep tracking",
            "GPS",
            "5-day battery life",
            "Water resistant to 50m"
        ],
        specifications: {
            "Brand": "TechFit",
            "Model": "Watch Pro 5",
            "Display": "1.4 inch AMOLED",
            "Battery Life": "5 days",
            "Water Resistance": "50m",
            "Sensors": "Heart rate, Accelerometer, GPS"
        }
    },
    {
        id: "sample-3",
        name: "Leather Wallet",
        price: 49.99,
        description: "Genuine leather wallet with multiple card slots. Elegant, durable, and practical for everyday use.",
        rating: 4.3,
        reviewCount: 58,
        images: [
            "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60"
        ],
        stock: 100,
        category: "Accessories",
        features: [
            "Genuine leather",
            "Multiple card slots",
            "Cash compartment",
            "ID window",
            "Slim design"
        ],
        specifications: {
            "Material": "Genuine Leather",
            "Dimensions": "4.5 x 3.5 inches",
            "Card Slots": "8",
            "Color": "Brown"
        }
    },
    {
        id: "sample-4",
        name: "Cotton T-Shirt",
        price: 29.99,
        description: "Comfortable 100% cotton t-shirt. Soft, breathable, and perfect for daily wear in any season.",
        rating: 4.6,
        reviewCount: 42,
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1622445275576-721325763afe?w=500&auto=format&fit=crop&q=60"
        ],
        stock: 78,
        category: "Clothing",
        colors: ["white", "black", "gray", "blue"],
        features: [
            "100% cotton material",
            "Crew neck",
            "Short sleeves",
            "Machine washable",
            "Pre-shrunk"
        ],
        specifications: {
            "Material": "100% Cotton",
            "Fit": "Regular",
            "Care": "Machine wash cold"
        }
    },
    {
        id: "sample-5",
        name: "Coffee Mug",
        price: 19.99,
        description: "Ceramic coffee mug with modern design. The perfect addition to your morning routine.",
        rating: 4.7,
        reviewCount: 36,
        images: [
            "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1577937927133-66e5281c4f56?w=500&auto=format&fit=crop&q=60"
        ],
        stock: 120,
        category: "Home & Kitchen",
        features: [
            "Ceramic material",
            "12oz capacity",
            "Microwave safe",
            "Dishwasher safe",
            "Comfortable handle"
        ],
        specifications: {
            "Material": "Ceramic",
            "Capacity": "12 oz",
            "Dimensions": "4.5 inches tall",
            "Care": "Dishwasher and microwave safe"
        }
    },
    // Add more clothing products to have more options in the "You may also like" section
    {
        id: "sample-13",
        name: "Casual Hoodie",
        price: 49.99,
        description: "Comfortable cotton blend hoodie perfect for casual wear",
        rating: 4.4,
        reviewCount: 38,
        images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03d?w=500&auto=format&fit=crop&q=60"
        ],
        stock: 65,
        category: "Clothing",
        colors: ["black", "gray", "navy"],
        features: [
            "Cotton-polyester blend",
            "Front kangaroo pocket",
            "Drawstring hood",
            "Ribbed cuffs and hem"
        ],
        specifications: {
            "Material": "80% Cotton, 20% Polyester",
            "Fit": "Regular",
            "Care": "Machine wash cold"
        }
    },
    {
        id: "sample-14",
        name: "Summer Dress",
        price: 59.99,
        description: "Stylish floral summer dress perfect for warm weather",
        rating: 4.7,
        reviewCount: 52,
        images: [
            "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1596783074918-c84cb1bd5d44?w=500&auto=format&fit=crop&q=60"
        ],
        stock: 40,
        category: "Clothing",
        colors: ["floral", "blue", "pink"],
        features: [
            "Lightweight material",
            "V-neck design",
            "Adjustable straps",
            "Flowy fit"
        ],
        specifications: {
            "Material": "Rayon",
            "Fit": "Regular",
            "Care": "Hand wash cold"
        }
    },
    {
        id: "sample-15",
        name: "Slim Fit Jeans",
        price: 69.99,
        description: "Classic slim fit jeans with stretch for all-day comfort",
        rating: 4.5,
        reviewCount: 86,
        images: [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=500&auto=format&fit=crop&q=60"
        ],
        stock: 55,
        category: "Clothing",
        colors: ["blue", "black", "gray"],
        features: [
            "Stretch denim",
            "Five-pocket styling",
            "Slim fit through hip and thigh",
            "Mid-rise waist"
        ],
        specifications: {
            "Material": "98% Cotton, 2% Elastane",
            "Fit": "Slim",
            "Care": "Machine wash cold"
        }
    }
];

// Get similar products based on category
const getSimilarProducts = (productId: string, category: string) => {
    return sampleProducts
        .filter(p => p.id !== productId && p.category === category)
        .slice(0, 4);
};

// Add interface for product structure
interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    rating?: number;
    reviewCount?: number;
    images: string[];
    stock: number;
    category: string;
    isNew: boolean;
    features: string[];
    specifications: Record<string, string>;
    mainImage?: string;
    productImages?: Array<{ url: string }>;
    createdAt?: string;
}

interface APIProduct {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    category?: {
        name: string;
    };
    mainImage?: string;
    productImages?: Array<{ url: string }>;
    createdAt: string;
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                // Check if this is a sample product
                if (productId.startsWith('sample-')) {
                    const sampleProduct = sampleProducts.find(p => p.id === productId);
                    if (sampleProduct) {
                        setProduct(sampleProduct);
                        const similar = getSimilarProducts(productId, sampleProduct.category);
                        setRelatedProducts(similar);
                    } else {
                        setError('Sample product not found');
                    }
                    setLoading(false);
                    return;
                }

                // Fetch product from API
                const response = await fetch(`/api/products/${productId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Product not found');
                    } else {
                        setError('Failed to fetch product data');
                    }
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                console.log('Product data from API:', data);

                // Handle image URL properly - convert relative URLs to absolute
                let mainImageUrl = 'https://via.placeholder.com/400';
                if (data.mainImage) {
                    // Check if it's already a full URL or a relative path
                    if (data.mainImage.startsWith('http')) {
                        mainImageUrl = data.mainImage;
                    } else {
                        // Convert relative path to full URL based on the current origin
                        const baseUrl = window.location.origin;
                        mainImageUrl = `${baseUrl}${data.mainImage}`;
                    }
                }

                // Process additional images if available
                const additionalImages = (data.productImages || []).map((img: { url: string }) => {
                    if (!img.url) return null;

                    if (img.url.startsWith('http')) {
                        return img.url;
                    } else {
                        const baseUrl = window.location.origin;
                        return `${baseUrl}${img.url}`;
                    }
                }).filter(Boolean);

                // Convert API product to the format expected by the UI
                const formattedProduct = {
                    id: data.id,
                    name: data.name,
                    price: data.price,
                    description: data.description,
                    rating: 4.5, // Default rating
                    reviewCount: Math.floor(Math.random() * 100) + 10, // Random review count
                    images: [
                        mainImageUrl,
                        // Add additional images if available
                        ...additionalImages
                    ],
                    stock: data.stock,
                    category: data.category?.name || 'Other',
                    isNew: new Date(data.createdAt).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000), // Consider "new" if less than 30 days old
                    features: [
                        'Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'
                    ],
                    specifications: {
                        "Category": data.category?.name || 'Other',
                        "Stock": data.stock.toString(),
                        "ID": data.id
                    }
                };

                setProduct(formattedProduct);

                // Fetch related products from the same category
                try {
                    const categoryName = data.category?.name;
                    console.log('Attempting to fetch related products for category:', categoryName);
                    console.log('Full category data:', data.category);

                    if (categoryName) {
                        // First try to get real products from the same category, without any limit to get ALL products
                        // This ensures we see all database products added from the dashboard
                        const relatedUrl = `/api/products?category=${encodeURIComponent(categoryName)}`;
                        console.log('Fetching related products from:', relatedUrl);

                        const relatedResponse = await fetch(relatedUrl);

                        if (relatedResponse.ok) {
                            const relatedData = await relatedResponse.json();
                            console.log('Related products API response:', relatedData);

                            const relatedApiProducts = relatedData.products || [];
                            console.log('Total products returned:', relatedApiProducts.length);

                            // Filter out the current product
                            const otherProducts = relatedApiProducts.filter((p: APIProduct) => p.id !== productId);

                            // Log the number of actual database products found for debugging
                            console.log(`Found ${otherProducts.length} actual database products in category ${categoryName}`);

                            if (otherProducts.length > 0) {
                                // Sort products by newest (createdAt) first to prioritize newly added products
                                const sortedProducts = otherProducts.sort((a: APIProduct, b: APIProduct) => {
                                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                                });

                                // Format ONLY the API products (actual database products from dashboard)
                                const formattedApiProducts = sortedProducts.map((p: APIProduct) => {
                                    // Handle image URL properly
                                    let imageUrl = 'https://via.placeholder.com/400';
                                    if (p.mainImage) {
                                        if (p.mainImage.startsWith('http')) {
                                            imageUrl = p.mainImage;
                                        } else {
                                            const baseUrl = window.location.origin;
                                            imageUrl = `${baseUrl}${p.mainImage}`;
                                        }
                                    }

                                    return {
                                        id: p.id,
                                        name: p.name,
                                        price: p.price,
                                        rating: p.rating || 4.5,
                                        image: imageUrl,
                                        stock: p.stock || 10,
                                        category: p.category?.name || 'Other',
                                        // Add a flag to identify these are real products from DB
                                        isRealProduct: true
                                    };
                                });

                                // If we have enough real products (at least 2), only show them
                                if (formattedApiProducts.length >= 1) {
                                    // Take only up to 4 related products from the database
                                    const limitedProducts = formattedApiProducts.slice(0, 4);
                                    console.log(`Showing ${limitedProducts.length} real database products from dashboard`);
                                    setRelatedProducts(limitedProducts);
                                }
                                // Otherwise, add sample products to fill in only if needed
                                // Only use sample products if absolutely necessary
                                else if (formattedApiProducts.length > 0) {
                                    // Filter sample products by category
                                    const sampleCategoryProducts = sampleProducts
                                        .filter(p =>
                                            p.category.toLowerCase() === categoryName.toLowerCase() &&
                                            !formattedApiProducts.some((lp: { name: string }) => lp.name === p.name)
                                        )
                                        .slice(0, 4 - formattedApiProducts.length);

                                    console.log(`Showing ${formattedApiProducts.length} real database products and ${sampleCategoryProducts.length} sample products`);
                                    setRelatedProducts([...formattedApiProducts, ...sampleCategoryProducts]);
                                }
                            } else {
                                // Fallback to sample products ONLY if no real products are found
                                const categoryForSamples = data.category?.name || '';
                                console.log(`No real products found. Fallback to sample products in category ${categoryForSamples}`);

                                const sampleRelatedProducts = categoryForSamples ?
                                    sampleProducts
                                        .filter(p => p.category.toLowerCase() === categoryForSamples.toLowerCase())
                                        .slice(0, 4) :
                                    sampleProducts.slice(0, 4);

                                setRelatedProducts(sampleRelatedProducts);
                            }
                        }
                    }
                } catch (relatedError) {
                    console.error("Error fetching related products:", relatedError);
                    // Fallback to sample data
                    const categoryForSamples = data.category?.name || '';
                    const sampleRelatedProducts = categoryForSamples ?
                        sampleProducts.filter(p => p.category === categoryForSamples).slice(0, 4) :
                        sampleProducts.slice(0, 4);

                    setRelatedProducts(sampleRelatedProducts);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product data');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    // Loading state
    if (loading) {
        return (
            <div className="container mx-auto max-w-7xl py-16 px-4">
                <div className="flex items-center justify-center min-h-[300px]">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                </div>
            </div>
        );
    }

    // Error state
    if (error || !product) {
        return (
            <div className="container mx-auto max-w-7xl py-16 px-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {error || 'Product Not Found'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The product you are looking for does not exist or has been removed.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Go Back
                        </button>
                        <Link
                            href="/shop"
                            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                        >
                            Browse Shop
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-950 pb-16">
            {/* Breadcrumbs */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto max-w-7xl px-4 py-4">
                    <nav className="flex text-sm">
                        <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4 mx-2 text-gray-400 self-center" />
                        <Link href="/shop" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            Shop
                        </Link>
                        <ChevronRight className="h-4 w-4 mx-2 text-gray-400 self-center" />
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                            {product.name}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Product Details */}
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Gallery */}
                    <ProductGallery
                        images={product.images}
                        productName={product.name}
                    />

                    {/* Product Info */}
                    <ProductInfo
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        rating={product.rating}
                        reviewCount={product.reviewCount}
                        description={product.description}
                        stock={product.stock}
                        colors={product.colors}
                        isNew={product.isNew}
                    />
                </div>

                {/* Product Tabs */}
                <ProductTabs
                    features={product.features}
                    specifications={product.specifications}
                    reviewCount={product.reviewCount}
                    rating={product.rating}
                />

                {/* Related Products */}
                {/* Add debug info to see if relatedProducts array exists and has items */}
                <div className="mt-8 text-gray-500 dark:text-gray-400">
                    <p>Debug: Found {relatedProducts.length} related products</p>
                </div>

                {/* Render RelatedProducts even if empty, for debugging */}
                <RelatedProducts
                    title="You may also like"
                    products={relatedProducts}
                />
            </div>
        </div>
    );
} 