// Script to initialize the database with featured products
// Run with: node scripts/init-featured-products.js

require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const { FEATURED_SAMPLE_PRODUCTS } = require('../dist/lib/product-utils');

// Connection URL
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'e-commerce';

// Categories to ensure exist in the database
const CATEGORIES = [
    { id: "furniture", name: "Furniture", description: "Furniture for your home and office" },
    { id: "electronics", name: "Electronics", description: "Electronic devices and gadgets" },
    { id: "clothing", name: "Clothing", description: "Apparel and fashion items" },
    { id: "accessories", name: "Accessories", description: "Fashion accessories and add-ons" },
    { id: "home-decor", name: "Home Decor", description: "Decorate your home with style" },
    { id: "kitchen", name: "Kitchen", description: "Kitchen appliances and tools" },
    { id: "sports", name: "Sports", description: "Sports and outdoor equipment" }
];

async function run() {
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);
        const productsCollection = db.collection('products');
        const categoriesCollection = db.collection('categories');

        // First ensure categories exist
        console.log("Ensuring categories exist...");
        for (const category of CATEGORIES) {
            const existingCategory = await categoriesCollection.findOne({ id: category.id });
            if (!existingCategory) {
                await categoriesCollection.insertOne({
                    ...category,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`Created category: ${category.name}`);
            } else {
                console.log(`Category already exists: ${category.name}`);
            }
        }

        // Then add featured products
        console.log("\nAdding featured products...");
        let addedCount = 0;

        for (const product of FEATURED_SAMPLE_PRODUCTS) {
            // Check if product already exists by name
            const existingProduct = await productsCollection.findOne({ name: product.name });

            if (!existingProduct) {
                // Format the product for database storage
                const categoryId = product.categoryObj.name.toLowerCase().replace(/\s+/g, '-');

                const newProduct = {
                    name: product.name,
                    description: `Description for ${product.name}`,
                    price: product.price,
                    stock: product.stock,
                    mainImage: product.mainImage,
                    categoryId: categoryId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                await productsCollection.insertOne(newProduct);
                console.log(`Added product: ${product.name}`);
                addedCount++;
            } else {
                console.log(`Product already exists: ${product.name}`);
            }
        }

        console.log(`\nInitialization complete. Added ${addedCount} new products.`);
        console.log(`Total products in database: ${await productsCollection.countDocuments()}`);
        console.log(`Total categories in database: ${await categoriesCollection.countDocuments()}`);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
        console.log("Disconnected from MongoDB");
    }
}

run().catch(console.error); 