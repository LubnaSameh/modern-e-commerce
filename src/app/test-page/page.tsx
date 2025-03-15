'use client';

import { useState } from 'react';

// Define result type for better type safety
interface ApiTestResult {
    status?: string;
    message?: string;
    timestamp?: string;
    environment?: {
        NODE_ENV?: string;
        VERCEL_ENV?: string;
        VERCEL_REGION?: string;
    };
    [key: string]: any; // Allow for additional properties
}

export default function TestPage() {
    const [testResult, setTestResult] = useState<ApiTestResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testApi = async () => {
        setLoading(true);
        setError(null);

        try {
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/api/test`);

            if (!response.ok) {
                throw new Error(`API test failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setTestResult(data);
        } catch (err) {
            console.error('Test failed:', err);
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Vercel Deployment Test Page</h1>

            <p className="mb-4">
                This is a simple test page to verify that page routing is working correctly in the Vercel deployment.
            </p>

            <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={testApi}
                disabled={loading}
            >
                {loading ? 'Testing...' : 'Test API Route'}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            )}

            {testResult && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    <h2 className="text-xl font-bold mb-2">API Test Result:</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-80">
                        {JSON.stringify(testResult, null, 2)}
                    </pre>
                </div>
            )}

            <div className="mt-8 p-4 bg-gray-100 rounded">
                <h2 className="text-xl font-bold mb-2">Browser Environment:</h2>
                <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
                <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side'}</p>
            </div>
        </div>
    );
} 