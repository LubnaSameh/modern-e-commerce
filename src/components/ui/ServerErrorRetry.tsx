'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ServerErrorRetryProps {
    message?: string;
    onRetry?: () => Promise<boolean | void> | boolean | void;
    autoRetry?: boolean;
    maxRetries?: number;
}

const DEFAULT_MESSAGE = 'We encountered a problem connecting to the server, attempting to reconnect...';

export default function ServerErrorRetry({
    message = DEFAULT_MESSAGE,
    onRetry,
    autoRetry = true,
    maxRetries = 3
}: ServerErrorRetryProps) {
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [retryTimer, setRetryTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (autoRetry && retryCount < maxRetries) {
            // Start countdown
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleRetry();
                        return 5; // Reset countdown
                    }
                    return prev - 1;
                });
            }, 1000);

            setRetryTimer(timer);

            return () => {
                if (timer) clearInterval(timer);
            };
        }
    }, [retryCount, autoRetry, maxRetries]);

    const handleRetry = async () => {
        if (isRetrying) return;

        setIsRetrying(true);

        try {
            if (onRetry) {
                await onRetry();
            }
            // If retry is successful, content will load and this component won't be shown
        } catch (err) {
            console.error('Retry failed:', err);
            setRetryCount(prev => prev + 1);
        } finally {
            setIsRetrying(false);
        }
    };

    const progressPercentage = ((5 - countdown) / 5) * 100;

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md max-w-lg mx-auto my-8">
            <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />

            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Sorry, an error occurred
            </h3>

            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                {message}
            </p>

            {autoRetry && retryCount < maxRetries ? (
                <div className="w-full max-w-xs">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Retrying automatically</span>
                        <span>in {countdown} seconds</span>
                    </div>

                    <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all duration-1000 ease-linear"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            ) : (
                <p className="text-red-500 dark:text-red-400 text-sm mb-4">
                    {retryCount >= maxRetries ?
                        'Maximum reconnection attempts exceeded. Please try again later.' :
                        'Failed to connect to the server.'
                    }
                </p>
            )}

            <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="mt-4 px-6 py-2 bg-primary hover:bg-primary-700 text-white rounded-full flex items-center justify-center focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isRetrying ? (
                    <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Trying...
                    </>
                ) : (
                    <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                    </>
                )}
            </button>
        </div>
    );
} 