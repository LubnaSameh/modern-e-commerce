'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useTheme } from 'next-themes';

export default function RegisterPage() {
    // State variables for form fields and UI state
    // متغيرات الحالة لحقول النموذج وحالة واجهة المستخدم 
    const router = useRouter();
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [googleAuthAvailable, setGoogleAuthAvailable] = useState(false);

    // Only run client-side to prevent hydration errors
    // تنفيذ على جانب العميل فقط لمنع أخطاء التوافق
    useEffect(() => {
        setMounted(true);

        // Check if Google Auth is available
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

    // Handle form submission
    // معالجة تقديم النموذج
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        // التحقق من صحة البيانات
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            toast.error('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        try {
            // Register the user
            // تسجيل المستخدم
            console.log("Attempting to register:", email);

            // Add timeout to prevent hanging requests
            const response = await axios.post('/api/auth/register', {
                name,
                email,
                password,
            }, {
                timeout: 15000  // 15 second timeout
            });

            console.log("Registration successful:", response.data);
            toast.success('Registration successful! Please log in with your credentials.');
            
            // Redirect to login page after successful registration
            setTimeout(() => {
                router.push('/auth/login');
            }, 1000);
            
        } catch (err: any) {
            console.error("Registration error:", err);
            console.error("Full error object:", JSON.stringify(err, null, 2));

            // Display more detailed error messages
            let errorMessage = 'An error occurred during registration. Please try again.';

            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;

                // Include details if available
                if (err.response.data.details) {
                    console.error("Error details from server:", err.response.data.details);
                    errorMessage += ` (${err.response.data.details})`;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            // Special handling for network errors
            if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
                errorMessage = 'The request timed out. Please check your connection and try again.';
            }

            console.log("Error details:", errorMessage);
            setError(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    // If not mounted yet, return empty div to prevent hydration errors
    // إذا لم يتم التحميل بعد، أعد div فارغًا لمنع أخطاء التوافق
    if (!mounted) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"></div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700">
                        <h1 className="text-2xl font-bold text-white text-center">Create Account</h1>
                        <p className="text-blue-100 text-center mt-2">Join our community today</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200 text-sm">
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Password
                                    </label>
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
                                        At least 8 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 
                                              hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                                              text-white font-semibold rounded-lg shadow-md transition duration-200 ${loading ? 'opacity-80' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>
                        </form>

                        {/* Google Authentication section */}
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
                            Already have an account?{' '}
                            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 