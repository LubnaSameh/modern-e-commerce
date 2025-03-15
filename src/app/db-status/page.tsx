'use client';

import { useState, useEffect } from 'react';

export default function DbStatusPage() {
    const [dbStatus, setDbStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Function to check MongoDB connection
    const checkDbConnection = async () => {
        setLoading(true);
        setError(null);

        try {
            const endpoints = [
                { name: 'DB Check', url: '/api/db-check' },
                { name: 'Vercel DB Health', url: '/api/vercel-db-health' }
            ];

            const results = await Promise.all(
                endpoints.map(async (endpoint) => {
                    try {
                        const response = await fetch(endpoint.url);
                        const data = await response.json();
                        return {
                            name: endpoint.name,
                            url: endpoint.url,
                            success: response.ok,
                            status: response.status,
                            data
                        };
                    } catch (err) {
                        return {
                            name: endpoint.name,
                            url: endpoint.url,
                            success: false,
                            error: err instanceof Error ? err.message : String(err)
                        };
                    }
                })
            );

            setDbStatus(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    // Check connection on page load
    useEffect(() => {
        checkDbConnection();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">MongoDB Connection Status</h1>

            <div className="mb-4">
                <button
                    onClick={checkDbConnection}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Checking...' : 'Refresh Status'}
                </button>
            </div>

            {error && (
                <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            )}

            {dbStatus && (
                <div className="grid grid-cols-1 gap-6">
                    {dbStatus.map((result: any, index: number) => (
                        <div
                            key={index}
                            className={`p-4 border rounded ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                        >
                            <h2 className="text-xl font-semibold mb-2">{result.name} ({result.url})</h2>

                            {result.success ? (
                                <>
                                    <p className="text-green-600 font-semibold mb-2">
                                        ✅ Connection Successful (Status: {result.status})
                                    </p>

                                    <div className="mt-4">
                                        <h3 className="font-semibold mb-1">Response Data:</h3>
                                        <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-80 text-sm">
                                            {JSON.stringify(result.data, null, 2)}
                                        </pre>
                                    </div>
                                </>
                            ) : (
                                <p className="text-red-600 font-semibold">
                                    ❌ Connection Failed: {result.error || `Status: ${result.status}`}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded">
                <h2 className="text-xl font-semibold mb-2">Environment Information</h2>
                <p><strong>Page URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side rendering'}</p>
                <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side rendering'}</p>
                <p><strong>Next.js Version:</strong> 15.2.1</p>
                <p><strong>Deployment Timestamp:</strong> {new Date().toISOString()}</p>
            </div>
        </div>
    );
} 