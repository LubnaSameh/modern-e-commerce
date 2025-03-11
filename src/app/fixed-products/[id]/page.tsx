"use client";

import { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fixedProducts } from '@/lib/fixedData';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import Image from 'next/image';

interface ProductPageProps {
  params: {
    id: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  mainImage: string;
  images?: string[];
  category?: string;
  stock?: number;
  rating?: number;
  reviews?: number;
}

export default function FixedProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  // Get cart and wishlist functions
  const addToCart = useCartStore(state => state.addItem);
  const addToWishlist = useWishlistStore(state => state.addItem);

  useEffect(() => {
    // Find the product from fixed data
    const foundProduct = fixedProducts.find(p => p.id === id);

    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // Product not found
      console.error("Product not found");
    }

    setLoading(false);
  }, [id]);

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.mainImage,
        quantity
      });
    }
  };

  // Add to wishlist handler
  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.mainImage
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded"></div>
            <div className="w-full md:w-1/2">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-20 bg-gray-200 rounded mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you are looking for does not exist or has been removed.</p>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb and Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </button>
        <div className="text-sm text-gray-500 dark:text-gray-400 ml-4">
          <span className="mx-2">/</span>
          <span className="text-gray-600 dark:text-gray-300">Fixed Products</span>
          <span className="mx-2">/</span>
          <span className="text-blue-600">{product.name}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square relative">
            <Image
              src={product.mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {product.category}
            </span>
          </div>

          <div className="mb-6">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
            <p>{product.description}</p>
          </div>

          {/* Quantity Input */}
          <div className="flex items-center mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors w-full"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </button>

            <button
              onClick={handleAddToWishlist}
              className="flex items-center justify-center py-3 px-6 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 font-medium transition-colors w-full"
            >
              <Heart className="mr-2 h-5 w-5" />
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 