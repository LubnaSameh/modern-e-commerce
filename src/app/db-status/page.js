'use client';

import { useState, useEffect } from 'react';

export default function DbStatusPage() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function checkDbStatus() {
            try {
                setLoading(true);
                const response = await fetch('/api/db-status');
                const data = await response.json();
                setStatus(data);
                setLoading(false);
            } catch (err) {
                console.error('Error checking DB status:', err);
                setError(err.message);
                setLoading(false);
            }
        }

        checkDbStatus();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">حالة قاعدة البيانات</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p className="font-bold">خطأ!</p>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div>
                        <div className="mb-6 p-4 rounded-lg bg-gray-50">
                            <h2 className="text-xl font-semibold mb-2">معلومات عامة</h2>
                            <p className="mb-1">
                                <span className="font-medium">الحالة:</span>{' '}
                                {status?.success ? (
                                    <span className="text-green-600 font-bold">متصل ✅</span>
                                ) : (
                                    <span className="text-red-600 font-bold">غير متصل ❌</span>
                                )}
                            </p>
                            <p className="mb-1">
                                <span className="font-medium">وقت الاستجابة:</span> {status?.totalTime}
                            </p>
                            <p className="mb-1">
                                <span className="font-medium">التاريخ:</span> {new Date(status?.timestamp).toLocaleString()}
                            </p>
                        </div>

                        {status?.success && (
                            <>
                                <div className="mb-6 p-4 rounded-lg bg-gray-50">
                                    <h2 className="text-xl font-semibold mb-2">معلومات قاعدة البيانات</h2>
                                    <p className="mb-1">
                                        <span className="font-medium">الاسم:</span> {status.dbDetails.name}
                                    </p>
                                    <p className="mb-1">
                                        <span className="font-medium">عدد المجموعات:</span> {status.dbDetails.totalCollections}
                                    </p>
                                    {status.dbDetails.productCount !== undefined && (
                                        <p className="mb-1">
                                            <span className="font-medium">عدد المنتجات:</span> {status.dbDetails.productCount}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-6 p-4 rounded-lg bg-gray-50">
                                    <h2 className="text-xl font-semibold mb-2">المجموعات</h2>
                                    <ul className="list-disc list-inside">
                                        {status.dbDetails.collections.map((collection) => (
                                            <li key={collection} className="mb-1">
                                                {collection}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}

                        <div className="mb-6 p-4 rounded-lg bg-gray-50">
                            <h2 className="text-xl font-semibold mb-2">معلومات البيئة</h2>
                            <p className="mb-1">
                                <span className="font-medium">بيئة Node:</span> {status?.environment.nodeEnv}
                            </p>
                            <p className="mb-1">
                                <span className="font-medium">Vercel:</span> {status?.environment.isVercel ? 'نعم' : 'لا'}
                            </p>
                            {status?.environment.isVercel && (
                                <>
                                    <p className="mb-1">
                                        <span className="font-medium">بيئة Vercel:</span> {status?.environment.vercelEnv}
                                    </p>
                                    <p className="mb-1">
                                        <span className="font-medium">منطقة Vercel:</span> {status?.environment.vercelRegion}
                                    </p>
                                </>
                            )}
                        </div>

                        {status?.errors.length > 0 && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                                <h2 className="text-xl font-semibold mb-2 text-red-700">الأخطاء</h2>
                                {status.errors.map((err, index) => (
                                    <div key={index} className="mb-3">
                                        <p className="font-medium text-red-700">{err.type}</p>
                                        <p className="text-red-600">{err.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 