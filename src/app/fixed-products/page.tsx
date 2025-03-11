"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fixedProducts } from '@/lib/fixedData';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FixedProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load fixed products
    setProducts(fixedProducts);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
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
          <span className="text-blue-600">Fixed Products</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Fixed Products Collection
      </h1>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {fixedProducts.map((product) => (
          <Link href={`/fixed-products/${product.id}`} key={product.id}>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                    {product.category}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                  {product.description}
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 