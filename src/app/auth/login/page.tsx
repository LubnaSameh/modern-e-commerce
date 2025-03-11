'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function LoginPage() {
    // const router = useRouter(); // Uncomment if needed in the future
    // const { theme } = useTheme(); // Uncomment if needed in the future
    const { data: /* session, */ status } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [googleAuthAvailable, setGoogleAuthAvailable] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        setMounted(true);

        if (status === 'authenticated') {
            console.log("User is authenticated, redirecting to home page");
            // Check if we're in a callback loop
            if (mounted && typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                if (params.has('callbackUrl') && params.get('callbackUrl')?.includes('login')) {
                    console.log("Detected callback loop, forcing clean redirect");
                    window.location.href = '/';
                } else {
                    // Normal redirect
                    window.location.href = '/';
                }
            }
        }
    }, [status, mounted]);

    useEffect(() => {
        const checkProviders = async () => {
            try {
                const response = await fetch('/api/auth/providers');
                if (!response.ok) {
                    throw new Error('Failed to fetch providers');
                }
                const data = await response.json();
                setGoogleAuthAvailable(!!data?.google);
            } catch (err) {
                console.error("Failed to fetch auth providers:", err);
                setGoogleAuthAvailable(false);
            }
        };

        checkProviders();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log("Checking if user exists:", email);

            // First check if the user exists by making a request to a new API endpoint
            const checkUserResponse = await fetch(`/api/auth/check-user?email=${encodeURIComponent(email)}`);
            const { exists } = await checkUserResponse.json();

            if (!exists) {
                setError('This email is not registered. Please register first before attempting to log in.');
                toast.error('Account not found. Please register first.');
                setLoading(false);
                return;
            }

            console.log("User exists, proceeding with login");

            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            console.log("Login result:", result);

            if (result?.error) {
                console.error("Login error:", result.error);
                setError('Invalid email or password. Please try again.');
                toast.error('Login failed. Please check your credentials.');
                setLoading(false);
                return;
            }

            toast.success('Login successful! Redirecting...');

            // Set localStorage flags immediately to ensure we can detect login state
            if (typeof window !== 'undefined') {
                try {
                    // Set multiple localStorage values to ensure login detection works
                    window.localStorage.setItem('user-logged-in', 'true');
                    window.localStorage.setItem('user-email', email);

                    // Extract and save username from email (e.g., user@example.com → user)
                    if (email && email.includes('@')) {
                        const extractedName = email.split('@')[0];
                        // Capitalize first letter for better presentation
                        const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
                        window.localStorage.setItem('user-name', formattedName);

                        // Additional debug to confirm name is set
                        console.log('Saved user name to localStorage:', formattedName);
                    }

                    // Ensure session has time to initialize
                    setTimeout(() => {
                        // Double-check login status before redirect
                        console.log("Login complete, checking final status before redirect");
                        console.log("localStorage login status:", window.localStorage.getItem('user-logged-in'));

                        // Force a hard reload to ensure clean session state and the navbar picks up the changes
                        (window as Window).location.href = `/?reload=${new Date().getTime()}`;
                    }, 1000); // Increased delay to ensure localStorage and session are both set
                } catch (error) {
                    console.error('Error saving to localStorage:', error);
                    // Fallback redirect
                    if (typeof window !== 'undefined') {
                        (window as Window).location.href = `/?reload=${new Date().getTime()}`;
                    }
                }
            } else {
                // Fallback if localStorage not available
                if (typeof window !== 'undefined') {
                    (window as Window).location.href = `/?reload=${new Date().getTime()}`;
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            setError('An error occurred. Please try again.');
            toast.error('Login failed. Please try again later.');
            setLoading(false);
        }
    };

    // Don't render if checking session or already authenticated
    if (status === 'loading' || status === 'authenticated' || !mounted) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700">
                        <h1 className="text-2xl font-bold text-white text-center">Welcome Back</h1>
                        <p className="text-blue-100 text-center mt-2">Sign in to your account</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200 text-sm">
                                <span>{error}</span>
                            </div>
                        )}

                        {error && (
                            <div className="mt-2 text-red-500 text-sm">
                                {error}
                                {error.includes('not registered') && (
                                    <div className="mt-2">
                                        <Link href="/auth/register" className="text-blue-500 hover:underline font-medium">
                                            Click here to register now
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="admin@example.com"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Try: admin@example.com (Admin) or user@example.com (User)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Password
                                        </label>
                                        <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Password: password123
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 
                                              hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                              text-white font-semibold rounded-lg shadow-md transition duration-200 ${loading ? 'opacity-80' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </div>
                        </form>

                        {mounted && googleAuthAvailable && (
                            <>
                                <div className="mt-6 flex items-center justify-between">
                                    <hr className="w-full border-gray-300 dark:border-gray-700" />
                                    <span className="px-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">OR</span>
                                    <hr className="w-full border-gray-300 dark:border-gray-700" />
                                </div>

                                <button
                                    onClick={() => {
                                        toast.info('Redirecting to Google...');
                                        // Force direct redirect with no callback parameters to prevent loops
                                        signIn('google', {
                                            callbackUrl: window.location.origin,
                                            redirect: true
                                        });
                                    }}
                                    className="mt-4 w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 
                                            dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 
                                            dark:hover:bg-gray-750 transition-colors duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>
                            </>
                        )}

                        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            Don&apos;t have an account?{' '}
                            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 