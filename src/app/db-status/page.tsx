'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DatabaseStatusPage() {
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [testResults, setTestResults] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        checkDatabaseStatus();
    }, []);

    const checkDatabaseStatus = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Checking database status...');
            const response = await fetch('/api/vercel-db-health', {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error(`Error checking database status: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Database status:', data);

            setStatus(data);
            setTestResults(prev => [...prev, {
                timestamp: new Date().toISOString(),
                success: data.success,
                tests: data.connectionTests,
                errors: data.errors,
                totalTime: data.totalTime
            }]);

        } catch (error) {
            console.error('Error checking database status:', error);
            setError(error instanceof Error ? error.message : String(error));

            setTestResults(prev => [...prev, {
                timestamp: new Date().toISOString(),
                success: false,
                error: error instanceof Error ? error.message : String(error)
            }]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString();
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Database Connection Status</h1>

            <div className="mb-6">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4"
                    onClick={checkDatabaseStatus}
                    disabled={loading}
                >
                    {loading ? 'Checking...' : 'Check Database Status'}
                </button>

                <button
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => router.push('/')}
                >
                    Back to Home
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            )}

            {status && (
                <div className={`bg-${status.success ? 'green' : 'red'}-100 border border-${status.success ? 'green' : 'red'}-400 text-${status.success ? 'green' : 'red'}-700 px-4 py-3 rounded mb-6`}>
                    <h2 className="text-xl font-bold">Current Status: {status.success ? 'Connected' : 'Failed'}</h2>
                    <p><strong>Time:</strong> {formatDate(status.timestamp)}</p>
                    <p><strong>Total Time:</strong> {status.totalTime}</p>

                    {status.environment && (
                        <div className="mt-4">
                            <h3 className="font-bold">Environment:</h3>
                            <ul className="list-disc list-inside">
                                <li>Node Env: {status.environment.nodeEnv}</li>
                                <li>Vercel: {status.environment.isVercel ? 'Yes' : 'No'}</li>
                                {status.environment.isVercel && (
                                    <>
                                        <li>Vercel Env: {status.environment.vercelEnv}</li>
                                        <li>Vercel Region: {status.environment.vercelRegion}</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    )}

                    {status.dbDetails && Object.keys(status.dbDetails).length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-bold">Database Details:</h3>
                            <ul className="list-disc list-inside">
                                <li>Database: {status.dbDetails.name}</li>
                                <li>Collections: {status.dbDetails.totalCollections}</li>
                                {status.dbDetails.productCount !== undefined && (
                                    <li>Products: {status.dbDetails.productCount}</li>
                                )}
                            </ul>
                        </div>
                    )}

                    {status.connectionTests && status.connectionTests.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-bold">Connection Tests:</h3>
                            <ul className="list-disc list-inside">
                                {status.connectionTests.map((test: any, i: number) => (
                                    <li key={i} className={test.success ? 'text-green-600' : 'text-red-600'}>
                                        {test.name}: {test.success ? 'Success' : 'Failed'}
                                        {test.time && ` (${test.time})`}
                                        {test.error && ` - ${test.error}`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {status.errors && status.errors.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-bold text-red-600">Errors:</h3>
                            <ul className="list-disc list-inside">
                                {status.errors.map((err: any, i: number) => (
                                    <li key={i} className="text-red-600">
                                        {typeof err === 'string' ? err : (
                                            <>
                                                <strong>{err.phase}:</strong> {err.message}
                                                {err.type && ` (${err.type})`}
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Test History</h2>
                {testResults.length === 0 ? (
                    <p>No tests have been run yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {testResults.map((result, i) => (
                            <li key={i} className={`border rounded p-4 ${result.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                                <p><strong>Time:</strong> {formatDate(result.timestamp)}</p>
                                <p><strong>Status:</strong> {result.success ? 'Success' : 'Failed'}</p>
                                {result.totalTime && <p><strong>Duration:</strong> {result.totalTime}</p>}
                                {result.error && <p><strong>Error:</strong> {result.error}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
} 