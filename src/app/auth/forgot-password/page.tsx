'use client';

import { useState } from 'react';
// إزالة الاستيرادات غير المستخدمة
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import axios from 'axios';
import { toast } from 'react-toastify';
// import { useTheme } from 'next-themes';

export default function ForgotPasswordPage() {
    // State variables for form field and UI state
    // متغيرات الحالة لحقول النموذج وحالة واجهة المستخدم
    // const router = useRouter();
    // const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle form submission
    // معالجة تقديم النموذج
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // For demo purposes, we're just showing a success message
            // لأغراض العرض فقط، نظهر رسالة نجاح

            // In a real implementation, this would call an API:
            // await axios.post('/api/auth/forgot-password', { email });

            // Show success state
            setIsSubmitted(true);
            toast.success('If an account exists with this email, password reset instructions will be sent.');
        } catch (err) {
            setError('An error occurred. Please try again.');
            toast.error('Failed to process your request. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // If the form has been submitted, show a confirmation message
    // إذا تم تقديم النموذج، أظهر رسالة تأكيد
    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700">
                            <h1 className="text-2xl font-bold text-white text-center">Check Your Email</h1>
                        </div>

                        <div className="p-8">
                            <div className="flex justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>

                            <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
                                If an account exists with the email <br />
                                <span className="font-medium">{email}</span>, <br />
                                we&apos;ve sent instructions to reset your password.
                            </p>

                            <div className="text-center">
                                <Link
                                    href="/auth/login"
                                    className="w-full inline-block py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 
                                            hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                                >
                                    Return to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show the forgot password form
    // عرض نموذج نسيت كلمة المرور
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700">
                        <h1 className="text-2xl font-bold text-white text-center">Reset Your Password</h1>
                        <p className="text-blue-100 text-center mt-2">We&apos;ll send you instructions by email</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200 text-sm">
                                <span>{error}</span>
                            </div>
                        )}

                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Enter your email address and we&apos;ll send you instructions to reset your password.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5">
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

                                <button
                                    type="submit"
                                    className={`w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 
                                              hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                              text-white font-semibold rounded-lg shadow-md transition duration-200 ${loading ? 'opacity-80' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 