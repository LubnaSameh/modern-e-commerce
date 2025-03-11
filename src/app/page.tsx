'use client';

import { Suspense, lazy, useEffect } from 'react';
import SessionHandler from "@/components/auth/SessionHandler";
import { useRouter } from 'next/navigation';

// Lazy load components
const HeroSlider = lazy(() => import("@/components/home/HeroSlider"));
const FeaturedProducts = lazy(() => import("@/components/home/FeaturedProducts"));
const PromoBanner = lazy(() => import("@/components/home/PromoBanner"));
const TestimonialSection = lazy(() => import("@/components/home/TestimonialSection"));
const NewsletterSection = lazy(() => import("@/components/home/NewsletterSection"));

// Loading fallbacks
const SliderFallback = () => <div className="h-[500px] bg-gray-100 dark:bg-gray-800 animate-pulse"></div>;
const SectionFallback = () => <div className="h-[400px] bg-gray-50 dark:bg-gray-900 animate-pulse"></div>;

export default function HomePage() {
  const router = useRouter();

  // Prefetch common navigation paths when user is idle
  useEffect(() => {
    // Wait for initial render and main content to load
    const timer = setTimeout(() => {
      // Prefetch common paths
      router.prefetch('/shop');
      router.prefetch('/categories');
      router.prefetch('/about');
      router.prefetch('/contact');
    }, 2000); // Wait 2 seconds after page load

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="bg-white dark:bg-gray-950">
      <SessionHandler />
      
      <Suspense fallback={<SliderFallback />}>
        <HeroSlider />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <FeaturedProducts />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <PromoBanner />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <TestimonialSection />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <NewsletterSection />
      </Suspense>
    </main>
  );
}
