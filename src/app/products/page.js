'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// صفحة بسيطة للتوجيه من /products إلى /shop
export default function ProductsRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // توجيه المستخدم إلى صفحة المتجر
    router.push('/shop');
  }, [router]);
  
  // عرض شاشة تحميل أثناء التوجيه
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg">جاري توجيهك إلى صفحة المنتجات...</p>
      </div>
    </div>
  );
} 