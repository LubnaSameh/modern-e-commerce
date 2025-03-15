'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import SessionHandler from "@/components/auth/SessionHandler";
import { useRouter } from 'next/navigation';
import PageLoading from '@/components/ui/PageLoading';

// Lazy load components
const HeroSlider = lazy(() => import("@/components/home/HeroSlider"));
const FeaturedProducts = lazy(() => import("@/components/home/FeaturedProducts-new"));
const PromoBanner = lazy(() => import("@/components/home/PromoBanner"));
const TestimonialSection = lazy(() => import("@/components/home/TestimonialSection"));
const NewsletterSection = lazy(() => import("@/components/home/NewsletterSection"));

// Loading fallbacks
const SliderFallback = () => <div className="h-[500px] bg-gray-100 dark:bg-gray-800 animate-pulse"></div>;
const SectionFallback = () => <div className="h-[400px] bg-gray-50 dark:bg-gray-900 animate-pulse"></div>;

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Show loading for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Prefetch common navigation paths when user is idle
  useEffect(() => {
    // Wait for initial render and main content to load
    const timer = setTimeout(() => {
      // Prefetch common paths
      router.prefetch('/shop');
      router.prefetch('/categories');
      router.prefetch('/about');
      router.prefetch('/contact');
    }, 3000); // Wait 3 seconds after page load

    return () => clearTimeout(timer);
  }, [router]);

  // Show loading screen if page is still loading
  if (isLoading) {
    return <PageLoading />;
  }

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
