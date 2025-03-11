// Mock data for products and categories to be shared between API endpoints
export const mockProducts = [
    {
        id: "1",
        name: "Modern Office Chair",
        description: "Ergonomic design with premium materials for all-day comfort",
        price: 199.99,
        stock: 45,
        mainImage: "/products/chair1.jpg",
        image: "/products/chair1.jpg", // Compatible with both formats
        images: ["/products/chair1.jpg", "/products/chair2.jpg"],
        categoryId: "1",
        category: {
            id: "1",
            name: "Furniture"
        },
        productImages: [
            { id: "1", url: "/products/chair1.jpg", productId: "1" },
            { id: "2", url: "/products/chair2.jpg", productId: "1" }
        ],
        discount: null,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "2",
        name: "Smart 4K Television",
        description: "Stunning 4K resolution with smart features and voice control",
        price: 799.99,
        stock: 20,
        mainImage: "/products/tv1.jpg",
        image: "/products/tv1.jpg",
        images: ["/products/tv1.jpg", "/products/tv2.jpg"],
        categoryId: "2",
        category: {
            id: "2",
            name: "Electronics"
        },
        productImages: [
            { id: "3", url: "/products/tv1.jpg", productId: "2" },
            { id: "4", url: "/products/tv2.jpg", productId: "2" }
        ],
        discount: null,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "3",
        name: "Premium Cotton T-Shirt",
        description: "Ultra-soft 100% cotton t-shirt with modern fit",
        price: 29.99,
        stock: 100,
        mainImage: "/products/tshirt1.jpg",
        image: "/products/tshirt1.jpg",
        images: ["/products/tshirt1.jpg", "/products/tshirt2.jpg"],
        categoryId: "3",
        category: {
            id: "3",
            name: "Clothing"
        },
        productImages: [
            { id: "5", url: "/products/tshirt1.jpg", productId: "3" },
            { id: "6", url: "/products/tshirt2.jpg", productId: "3" }
        ],
        discount: null,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "4",
        name: "Designer Sunglasses",
        description: "Stylish sunglasses with UV protection",
        price: 129.99,
        stock: 30,
        mainImage: "/products/sunglasses1.jpg",
        image: "/products/sunglasses1.jpg",
        images: ["/products/sunglasses1.jpg"],
        categoryId: "4",
        category: {
            id: "4",
            name: "Accessories"
        },
        productImages: [
            { id: "7", url: "/products/sunglasses1.jpg", productId: "4" }
        ],
        discount: null,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "5",
        name: "Modern Wall Clock",
        description: "Minimalist design that complements any interior",
        price: 49.99,
        stock: 25,
        mainImage: "/products/clock1.jpg",
        image: "/products/clock1.jpg",
        images: ["/products/clock1.jpg"],
        categoryId: "5",
        category: {
            id: "5",
            name: "Home Decor"
        },
        productImages: [
            { id: "8", url: "/products/clock1.jpg", productId: "5" }
        ],
        discount: null,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "6",
        name: "Chef's Knife Set",
        description: "Professional-grade knives for home cooking enthusiasts",
        price: 149.99,
        stock: 15,
        mainImage: "/products/knives1.jpg",
        image: "/products/knives1.jpg",
        images: ["/products/knives1.jpg"],
        categoryId: "6",
        category: {
            id: "6",
            name: "Kitchen"
        },
        productImages: [
            { id: "9", url: "/products/knives1.jpg", productId: "6" }
        ],
        discount: null,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

export const mockCategories = [
    {
        id: "1",
        name: "Furniture",
        description: "Modern furniture for home and office",
        image: "/products/furniture.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "2",
        name: "Electronics",
        description: "Latest electronic gadgets and devices",
        image: "/products/electronics.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "3",
        name: "Clothing",
        description: "Fashion for men, women, and children",
        image: "/products/clothing.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "4",
        name: "Accessories",
        description: "Stylish accessories to complement your look",
        image: "/products/accessories.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "5",
        name: "Home Decor",
        description: "Beautiful decorations for your home",
        image: "/products/homedecor.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "6",
        name: "Kitchen",
        description: "Quality tools for your kitchen",
        image: "/products/kitchen.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "7",
        name: "Sports",
        description: "Equipment for various sports and outdoor activities",
        image: "/products/sports.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Mock user data for authentication
export const mockUsers = [
    {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        password: "$2b$10$zQv/93SNDllV3WASn5Sv2OT1V9FX8bak2j6Y4B6KMbmK4zH1CrQSW", // "password123"
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
        cart: { id: "cart-1", items: [] }
    },
    {
        id: "2",
        name: "Test User",
        email: "user@example.com",
        password: "$2b$10$zQv/93SNDllV3WASn5Sv2OT1V9FX8bak2j6Y4B6KMbmK4zH1CrQSW", // "password123"
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
        cart: { id: "cart-2", items: [] }
    }
]; 