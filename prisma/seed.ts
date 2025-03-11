const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // Instead of deleting existing data, we'll update or create new categories
    // This avoids foreign key constraint issues with products referencing categories
    
    // Create categories
    const categories = [
        {
            name: 'Electronics',
            description: 'Latest gadgets and tech innovations',
            image: '/images/categories/electronics.jpg'
        },
        {
            name: 'Fashion',
            description: 'Trendy clothes for all seasons',
            image: '/images/categories/fashion.jpg'
        },
        {
            name: 'Home & Garden',
            description: 'Furniture and accessories for your space',
            image: '/images/categories/home-garden.jpg'
        },
        {
            name: 'Health & Beauty',
            description: 'Personal care products and supplements',
            image: '/images/categories/health-beauty.jpg'
        },
        {
            name: 'Sports & Outdoors',
            description: 'Equipment for all your activities',
            image: '/images/categories/sports-outdoors.jpg'
        },
        {
            name: 'Books & Media',
            description: 'Bestsellers and entertainment',
            image: '/images/categories/books-media.jpg'
        }
    ];

    console.log('Updating or creating categories...');
    for (const category of categories) {
        // Use upsert to update if exists or create if not
        await prisma.category.upsert({
            where: { name: category.name },
            update: {
                description: category.description,
                image: category.image
            },
            create: category,
        });
    }

    // Check for old categories to update (Clothing -> Fashion, etc.)
    const oldCategories = [
        { oldName: 'Clothing', newName: 'Fashion' },
        { oldName: 'Furniture', newName: 'Home & Garden' },
        { oldName: 'Household', newName: 'Home & Garden' },
        { oldName: 'Beauty', newName: 'Health & Beauty' }
    ];

    for (const { oldName, newName } of oldCategories) {
        // Find category with old name
        const oldCategory = await prisma.category.findUnique({
            where: { name: oldName },
            include: { products: true }
        });

        if (oldCategory) {
            console.log(`Updating products from category '${oldName}' to '${newName}'`);
            
            // Find the new category
            const newCategory = await prisma.category.findUnique({
                where: { name: newName }
            });

            if (newCategory) {
                // Update all products from old category to new category
                await prisma.product.updateMany({
                    where: { categoryId: oldCategory.id },
                    data: { categoryId: newCategory.id }
                });
                
                // Delete the old category after moving all products
                await prisma.category.delete({
                    where: { id: oldCategory.id }
                });
            }
        }
    }

    const createdCategories = await prisma.category.findMany();
    console.log(`Successfully updated! Total categories: ${createdCategories.length}`);
    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 