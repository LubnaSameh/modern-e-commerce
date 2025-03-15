'use client';

import { useState } from 'react';

export default function TestConnectionPage() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const testConnection = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/test-connection');
            const data = await response.json();

            setResult(data);
            setLoading(false);
        } catch (err) {
            console.error('Error testing connection:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">اختبار اتصال MongoDB</h1>

                <div className="mb-6">
                    <button
                        onClick={testConnection}
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    >
                        {loading ? 'جاري الاختبار...' : 'اختبار الاتصال'}
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <p className="font-bold">خطأ!</p>
                        <p>{error}</p>
                    </div>
                )}

                {result && (
                    <div className="p-4 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">نتيجة الاختبار</h2>

                        <div className="mb-4">
                            <p className="font-medium">الحالة:</p>
                            {result.success ? (
                                <p className="text-green-600 font-bold">ناجح ✅</p>
                            ) : (
                                <p className="text-red-600 font-bold">فاشل ❌</p>
                            )}
                        </div>

                        {result.success ? (
                            <>
                                <div className="mb-4">
                                    <p className="font-medium">الرسالة:</p>
                                    <p>{result.message}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-medium">قاعدة البيانات:</p>
                                    <p>{result.database}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-medium">اختبار Ping:</p>
                                    <p>{result.ping}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <p className="font-medium">نوع الخطأ:</p>
                                    <p className="text-red-600">{result.errorType}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-medium">رسالة الخطأ:</p>
                                    <p className="text-red-600">{result.error}</p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 