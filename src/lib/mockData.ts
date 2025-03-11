// Mock data for products and categories to be shared between API endpoints
export const mockProducts = [
    {
        id: "1",
        name: "Modern Office Chair",
        description: "Ergonomic design with premium materials for all-day comfort",
        price: 199.99,
        stock: 45,
        mainImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500",
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500",
            "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?q=80&w=500"
        ],
        categoryId: "1",
        category: {
            id: "1",
            name: "Furniture"
        },
        productImages: [
            { id: "1", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500", productId: "1" },
            { id: "2", url: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?q=80&w=500", productId: "1" }
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
        mainImage: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=500",
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=500",
        images: [
            "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=500",
            "https://images.unsplash.com/photo-1467293622093-9f15c96be70f?q=80&w=500"
        ],
        categoryId: "2",
        category: {
            id: "2",
            name: "Electronics"
        },
        productImages: [
            { id: "3", url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=500", productId: "2" },
            { id: "4", url: "https://images.unsplash.com/photo-1467293622093-9f15c96be70f?q=80&w=500", productId: "2" }
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
        mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500",
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500",
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=500"
        ],
        categoryId: "3",
        category: {
            id: "3",
            name: "Clothing"
        },
        productImages: [
            { id: "5", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500", productId: "3" },
            { id: "6", url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=500", productId: "3" }
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
        mainImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500",
        images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500"],
        categoryId: "4",
        category: {
            id: "4",
            name: "Accessories"
        },
        productImages: [
            { id: "7", url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500", productId: "4" }
        ],
        discount: null,
        createdAt: new Date(),
        updatedAt: new Date()
    },


    {
        id: "7",
        name: "Wireless Bluetooth Earbuds",
        description: "High-quality sound with long battery life",
        price: 89.99,
        stock: 45,
        mainImage: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=500",
        image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=500",
        images: ["https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=500"],
        categoryId: "2",
        category: {
            id: "2",
            name: "Electronics"
        },
        productImages: [
            { id: "10", url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=500", productId: "7" }
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
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "2",
        name: "Electronics",
        description: "Latest electronic gadgets and devices",
        image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=500",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "3",
        name: "Clothing",
        description: "Fashion for men, women, and children",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=500",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "4",
        name: "Accessories",
        description: "Stylish accessories to complement your look",
        image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=500",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "5",
        name: "Home Decor",
        description: "Beautiful decorations for your home",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=500",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "6",
        name: "Kitchen",
        description: "Quality tools for your kitchen",
        image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=500",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "7",
        name: "Sports",
        description: "Equipment for various sports and outdoor activities",
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=500",
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