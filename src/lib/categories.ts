// Featured product categories from home page
export const FEATURED_CATEGORIES = [
    { id: "furniture", name: "Furniture" },
    { id: "electronics", name: "Electronics" },
    { id: "clothing", name: "Clothing" },
    { id: "accessories", name: "Accessories" },
    { id: "home-decor", name: "Home Decor" },
    { id: "kitchen", name: "Kitchen" },
    { id: "sports", name: "Sports" }
];

// Get the category names array for display in components
export const getFeaturedCategoryNames = () => {
    return FEATURED_CATEGORIES.map(cat => cat.name);
};

// Find a category ID by name
export const getCategoryIdByName = (name: string) => {
    const category = FEATURED_CATEGORIES.find(
        cat => cat.name.toLowerCase() === name.toLowerCase()
    );
    return category ? category.id : null;
};

// Find a category name by ID
export const getCategoryNameById = (id: string) => {
    // Normalize the ID to lowercase for case-insensitive comparison
    const normalizedId = id.toLowerCase();
    const category = FEATURED_CATEGORIES.find(
        cat => cat.id.toLowerCase() === normalizedId
    );
    return category ? category.name : null;
}; 