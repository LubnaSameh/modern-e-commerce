// Script to replace all products with featured products from the home page

const { MongoClient } = require('mongodb');
require('dotenv').config();

// Featured products from home page component
const featuredProducts = [
    {
        name: "Wireless Bluetooth Earbuds",
        price: 89.99,
        mainImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        categoryId: null, // Will be updated with the Electronics category ID
        description: "High-quality sound with noise cancellation",
        stock: 45,
        createdAt: new Date("2023-03-15"),
        updatedAt: new Date()
    },
    {
        name: "Smart Watch Series 5",
        price: 199.99,
        mainImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        categoryId: null, // Will be updated with the Electronics category ID
        description: "Track your fitness and receive notifications",
        stock: 30,
        createdAt: new Date("2023-02-25"),
        updatedAt: new Date()
    },
    {
        name: "Leather Wallet",
        price: 49.99,
        mainImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
        categoryId: null, // Will be updated with the Accessories category ID
        description: "Genuine leather wallet with multiple compartments",
        stock: 100,
        createdAt: new Date("2023-04-05"),
        updatedAt: new Date()
    },
    {
        name: "Cotton T-Shirt",
        price: 29.99,
        mainImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80",
        categoryId: null, // Will be updated with the Clothing category ID
        description: "Comfortable 100% cotton t-shirt for everyday wear",
        stock: 78,
        createdAt: new Date("2023-03-10"),
        updatedAt: new Date()
    },
    {
        name: "Coffee Mug",
        price: 19.99,
        mainImage: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80",
        categoryId: null, // Will be updated with the Home & Kitchen category ID
        description: "Ceramic coffee mug with modern design",
        stock: 120,
        createdAt: new Date("2023-04-18"),
        updatedAt: new Date()
    },
    {
        name: "Modern Coffee Table",
        price: 199.99,
        mainImage: "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?w=800&auto=format&fit=crop&q=80",
        categoryId: null, // Will be updated with the Furniture category ID
        description: "Contemporary design coffee table for your living room",
        stock: 15,
        createdAt: new Date("2023-05-20"),
        updatedAt: new Date()
    },
    {
        name: "Wireless Headphones",
        price: 149.99,
        mainImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        categoryId: null, // Will be updated with the Electronics category ID
        description: "Premium wireless headphones with noise cancellation",
        stock: 25,
        createdAt: new Date("2023-03-25"),
        updatedAt: new Date()
    },
    {
        name: "Leather Backpack",
        price: 89.99,
        mainImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
        categoryId: null, // Will be updated with the Accessories category ID
        description: "Stylish leather backpack for daily use",
        stock: 40,
        createdAt: new Date("2023-04-10"),
        updatedAt: new Date()
    }
];

// Categories to be created
const categories = [
    { name: "Electronics", description: "Electronic devices and gadgets" },
    { name: "Accessories", description: "Fashion accessories and add-ons" },
    { name: "Clothing", description: "Apparel and fashion items" },
    { name: "Home & Kitchen", description: "Items for your home and kitchen" },
    { name: "Furniture", description: "Furniture for your home and office" }
];

// Map each product to its category
const productCategoryMap = {
    "Wireless Bluetooth Earbuds": "Electronics",
    "Smart Watch Series 5": "Electronics",
    "Leather Wallet": "Accessories",
    "Cotton T-Shirt": "Clothing",
    "Coffee Mug": "Home & Kitchen",
    "Modern Coffee Table": "Furniture",
    "Wireless Headphones": "Electronics",
    "Leather Backpack": "Accessories"
};

async function main() {
    // Connection URI
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("MONGODB_URI not found in environment variables");
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(process.env.MONGODB_DB);
        const productsCollection = db.collection('products');
        const categoriesCollection = db.collection('categories');

        // Clear existing data
        console.log("Clearing existing products...");
        await productsCollection.deleteMany({});
        console.log("Clearing existing categories...");
        await categoriesCollection.deleteMany({});

        // Insert categories
        console.log("Adding categories...");
        const categoryResult = await categoriesCollection.insertMany(categories);
        console.log(`${categoryResult.insertedCount} categories inserted`);

        // Create a mapping of category names to their IDs
        const categoryMap = {};
        const allCategories = await categoriesCollection.find({}).toArray();
        allCategories.forEach(category => {
            categoryMap[category.name] = category._id.toString();
        });

        // Update products with category IDs
        const productsWithCategories = featuredProducts.map(product => {
            const categoryName = productCategoryMap[product.name];
            if (categoryName && categoryMap[categoryName]) {
                product.categoryId = categoryMap[categoryName];
            }
            return product;
        });

        // Insert products
        console.log("Adding products...");
        const productResult = await productsCollection.insertMany(productsWithCategories);
        console.log(`${productResult.insertedCount} products inserted`);

        console.log("Data migration completed successfully");
    } catch (error) {
        console.error("Error during migration:", error);
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }
}

main().catch(console.error); 