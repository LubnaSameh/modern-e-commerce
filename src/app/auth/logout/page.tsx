'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function LogoutPage() {
    const { status } = useSession();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleLogout = async () => {
            if (status === 'authenticated' && !isLoggingOut) {
                setIsLoggingOut(true);

                try {
                    // Disable redirect in signOut to handle it manually
                    await signOut({ 
                        redirect: false
                    });
                    
                    // Clear any session-related data from localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('user-logged-in');
                        localStorage.removeItem('user-email');
                        // Add any other items that might be storing user state
                        
                        toast.success('You have been successfully logged out');
                        
                        // Add a small delay before reloading
                        setTimeout(() => {
                            // Reload the current page instead of redirecting to a new URL
                            window.location.reload();
                        }, 100);
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                    setError('There was a problem logging out');
                    toast.error('There was a problem logging out. Please try again.');
                    
                    // Simply reload the current page on error
                    if (typeof window !== 'undefined') {
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500); // Give time for the error message to be seen
                    }
                }
            } else if (status === 'unauthenticated') {
                // If already logged out, reload the current page
                if (typeof window !== 'undefined') {
                    window.location.reload();
                }
            }
        };

        handleLogout();
    }, [status, isLoggingOut, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-blue-600 dark:text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        {error ? 'Logout Error' : 'Logging Out'}
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {error ? error : 'Please wait while we securely log you out...'}
                    </p>
                    {error ? (
                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        window.location.href = window.location.origin;
                                    } else {
                                        router.push('/');
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Return to Home
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 