import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // Public endpoints that should bypass authentication
    const publicEndpoints = [
        '/api/public-db-test',
        '/api/test-db-connection',
        '/api/vercel-db-test'
    ];

    // Skip middleware for public endpoints
    if (publicEndpoints.some(endpoint => request.nextUrl.pathname.startsWith(endpoint))) {
        console.log('MIDDLEWARE: Bypassing auth for public endpoint', request.nextUrl.pathname);
        return NextResponse.next();
    }

    // Get token with explicit secret to ensure it works
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    });

    const isAuthenticated = !!token;
    const url = request.nextUrl.clone();

    // Check for auth pages (login and register)
    const isAuthPage =
        url.pathname.startsWith('/auth/login') ||
        url.pathname.startsWith('/auth/register');

    // Check for callback loop by examining URL parameters
    const params = url.searchParams;
    const hasCallbackLoop = params.has('callbackUrl') &&
        params.get('callbackUrl')?.includes('/auth/login');

    console.log('MIDDLEWARE:', {
        path: url.pathname,
        isAuthenticated,
        isAuthPage,
        hasToken: !!token,
        hasCallbackLoop
    });

    // Handle callback loops by redirecting to home
    if (hasCallbackLoop) {
        console.log('Detected callback loop, redirecting to clean URL');
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If authenticated user tries to access auth pages, redirect to home
    if (isAuthenticated && isAuthPage) {
        console.log('Authenticated user trying to access auth page - redirecting to home');
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Handle protected routes - removing admin so it's publicly accessible
    const isProtectedRoute =
        // url.pathname.startsWith('/admin') || // Removing admin from protected routes
        url.pathname.startsWith('/dashboard') ||
        url.pathname.startsWith('/profile');
    // url.pathname.startsWith('/checkout'); // Removing checkout from protected routes to allow guest checkout

    // If user tries to access protected pages without being authenticated, redirect to login
    // But strip any potentially problematic callback parameters
    if (!isAuthenticated && isProtectedRoute) {
        console.log('Unauthenticated user trying to access protected page - redirecting to login');
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Only check for admin role if the user is accessing admin-specific functionality
    // but still allow basic dashboard access without login
    if (isAuthenticated &&
        url.pathname.startsWith('/admin') &&
        url.pathname.includes('/admin/actions') && // Only protect admin actions
        token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow users to access other pages
    const response = NextResponse.next();

    // تحقق مما إذا كان الطلب موجهاً إلى مسار API
    const isApiRoute = request.nextUrl.pathname.startsWith('/api/');

    if (isApiRoute) {
        // إضافة رؤوس CORS
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // معالجة طلبات OPTIONS لـ preflight
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 204,
                headers: response.headers,
            });
        }
    }

    return response;
}

// Only run middleware on these paths, but remove admin from the matcher to allow public access
export const config = {
    matcher: [
        // '/admin/:path*', // Remove this line to allow access without authentication
        '/dashboard/:path*',  // Add dashboard path pattern
        '/auth/:path*',  // Run on all auth paths
        // '/checkout/:path*', // Remove checkout from matcher to allow guest checkout
        '/profile/:path*',
        // كل مسارات API
        '/api/:path*',
        // استثناء مسارات API معينة
        '/((?!api/public-db-test|api/test-db-connection|api/vercel-db-test).*)',
    ],
}; 