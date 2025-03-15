/**
 * Utility functions for handling products across different pages
 */

// Shared sample products for both Home and Shop pages
export const FEATURED_SAMPLE_PRODUCTS = [
    {
        id: "sample-1",
        name: "Wireless Bluetooth Earbuds",
        price: 89.99,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
        mainImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
        stock: 45,
        category: "Electronics",
        categoryId: "electronics",
        categoryObj: { name: "Electronics" }
    },
    {
        id: "sample-2",
        name: "Smart Watch Series 5",
        price: 199.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
        mainImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        stock: 30,
        category: "Electronics",
        categoryId: "electronics",
        categoryObj: { name: "Electronics" }
    },
    {
        id: "sample-3",
        name: "Leather Wallet",
        price: 49.99,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=400&h=400&fit=crop",
        mainImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
        stock: 100,
        category: "Accessories",
        categoryId: "accessories",
        categoryObj: { name: "Accessories" }
    },
    {
        id: "sample-4",
        name: "Cotton T-Shirt",
        price: 29.99,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        mainImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80",
        stock: 78,
        category: "Clothing",
        categoryId: "clothing",
        categoryObj: { name: "Clothing" }
    },
    {
        id: "sample-5",
        name: "Coffee Mug",
        price: 19.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=400&fit=crop",
        mainImage: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80",
        stock: 120,
        category: "Home & Kitchen",
        categoryId: "kitchen",
        categoryObj: { name: "Kitchen" }
    },
    {
        id: "sample-6",
        name: "Modern Coffee Table",
        price: 199.99,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?w=400&h=400&fit=crop",
        mainImage: "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?w=800&auto=format&fit=crop&q=80",
        stock: 15,
        category: "Furniture",
        categoryId: "furniture",
        categoryObj: { name: "Furniture" }
    },
    {
        id: "sample-7",
        name: "Stainless Steel Water Bottle",
        price: 19.99,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
        mainImage: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
        stock: 40,
        category: "Kitchen",
        categoryId: "kitchen",
        categoryObj: { name: "Kitchen" }
    },
    {
        id: "sample-8",
        name: "Yoga Mat",
        price: 39.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1599447292180-45fd84092ef4?w=400&h=400&fit=crop",
        mainImage: "https://images.unsplash.com/photo-1599447292180-45fd84092ef4?w=800&auto=format&fit=crop&q=80",
        stock: 60,
        category: "Sports",
        categoryId: "sports",
        categoryObj: { name: "Sports" }
    },
    {
        id: "sample-9",
        name: "Decorative Wall Art",
        price: 59.99,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop",
        mainImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80",
        stock: 25,
        category: "Home Decor",
        categoryId: "home-decor",
        categoryObj: { name: "Home Decor" }
    }
];

// Convert API product to home format
export function convertToHomeFormat(product: any) {
    // Handle image paths properly
    let imageUrl = product.mainImage || '';
    if (imageUrl && !imageUrl.startsWith('http')) {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        imageUrl = `${baseUrl}${imageUrl}`;
    }

    return {
        id: product._id || product.id || '',
        name: product.name || '',
        price: product.price || 0,
        mainImage: imageUrl,
        category: { name: product.category?.name || product.categoryId || 'Uncategorized' }
    };
}

// Convert API product to shop format
export function convertToShopFormat(product: any) {
    // Handle image paths properly
    let imageUrl = product.mainImage || '';
    if (imageUrl && !imageUrl.startsWith('http')) {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        imageUrl = `${baseUrl}${imageUrl}`;
    }

    // Ensure categoryId is lowercase for consistent filtering
    const categoryId = product.categoryId ? String(product.categoryId).toLowerCase() : undefined;

    return {
        id: product._id || product.id || '',
        name: product.name || '',
        price: product.price || 0,
        rating: 4.5, // Default rating
        image: imageUrl,
        stock: product.stock || 0,
        category: product.category?.name || categoryId || 'Uncategorized',
        categoryId: categoryId
    };
}

// Get sample products for home page
export function getSampleProductsForHome() {
    return FEATURED_SAMPLE_PRODUCTS.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        mainImage: product.mainImage,
        category: product.categoryObj
    }));
}

// Get sample products for shop page
export function getSampleProductsForShop() {
    return FEATURED_SAMPLE_PRODUCTS.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        rating: product.rating,
        image: product.image,
        stock: product.stock,
        category: product.category,
        categoryId: product.categoryId
    }));
}

/**
 * Combine API products with sample products consistently across the application
 * @param apiProducts - Products fetched from the API
 * @param sampleProducts - Sample products to use if needed
 * @param targetCount - Minimum number of products to return
 * @returns Combined products with prioritized API products
 */
export function combineProductsConsistently<T extends { name: string }>(
    apiProducts: T[],
    sampleProducts: T[],
    targetCount: number = 6
): T[] {
    if (apiProducts.length === 0) {
        return sampleProducts;
    }

    // Start with real API products
    let combinedProducts = [...apiProducts];

    // Only add sample products if we don't have enough real ones
    if (apiProducts.length < targetCount) {
        // Filter out sample products that have the same name as API products
        const sampleWithoutDuplicates = sampleProducts.filter(sample =>
            !apiProducts.some(api =>
                api.name.toLowerCase() === sample.name.toLowerCase()
            )
        );

        const neededCount = targetCount - apiProducts.length;
        // Add additional samples to reach the target count
        const additionalSamples = sampleWithoutDuplicates.slice(0, neededCount);
        combinedProducts = [...apiProducts, ...additionalSamples];
    }

    return combinedProducts;
} 