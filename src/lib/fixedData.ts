// Fixed product data for search functionality
export const fixedProducts = [
  {
    id: 'fixed-1',
    name: 'Premium Headphones',
    price: 129.99,
    description: 'High-quality wireless headphones with noise cancellation',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    category: 'Electronics'
  },
  {
    id: 'fixed-2',
    name: 'Smart Watch',
    price: 199.99,
    description: 'Fitness tracker with heart rate monitoring and sleep analysis',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    category: 'Electronics'
  },
  {
    id: 'fixed-3',
    name: 'Cotton T-Shirt',
    price: 24.99,
    description: 'Comfortable 100% cotton t-shirt in various colors',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    category: 'Clothing'
  },
  {
    id: 'fixed-4',
    name: 'Leather Wallet',
    price: 49.99,
    description: 'Genuine leather wallet with multiple card slots',
    image: 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d',
    category: 'Accessories'
  },
  {
    id: 'fixed-5',
    name: 'Smartphone Case',
    price: 19.99,
    description: 'Protective case for various smartphone models',
    image: 'https://images.unsplash.com/photo-1601784551569-20c9e0750eba',
    category: 'Electronics'
  }
];

// Helper function to search fixed products
export function searchFixedProducts(query: string) {
  const lowerCaseQuery = query.toLowerCase();
  
  return fixedProducts.filter(product => 
    product.name.toLowerCase().includes(lowerCaseQuery) || 
    product.description.toLowerCase().includes(lowerCaseQuery) ||
    product.category.toLowerCase().includes(lowerCaseQuery)
  );
} 