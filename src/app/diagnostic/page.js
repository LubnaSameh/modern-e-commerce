'use client';

import { useState, useEffect } from 'react';

export default function DiagnosticPage() {
    const [diagnosticData, setDiagnosticData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        async function fetchDiagnosticData() {
            try {
                setLoading(true);
                setError(null);

                const timestamp = new Date().getTime();
                const response = await fetch(`/api/diagnostic?t=${timestamp}`);

                if (!response.ok) {
                    throw new Error(`خطأ في الاستجابة: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setDiagnosticData(data);
            } catch (err) {
                console.error('خطأ في جلب بيانات التشخيص:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDiagnosticData();
    }, [refreshCount]);

    const handleRefresh = () => {
        setRefreshCount(prev => prev + 1);
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-4">صفحة تشخيص الاتصال بقاعدة البيانات</h1>

            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">هذه الصفحة تساعدك على تشخيص مشاكل الاتصال بقاعدة البيانات وفحص إعدادات البيئة.</p>
                <button
                    onClick={handleRefresh}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
                    disabled={loading}
                >
                    {loading ? 'جاري التحديث...' : 'تحديث'}
                </button>
            </div>

            {loading && (
                <div className="text-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4">جاري اختبار الاتصال...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    <h2 className="font-bold">حدث خطأ في جلب بيانات التشخيص:</h2>
                    <p>{error}</p>
                </div>
            )}

            {!loading && diagnosticData && (
                <div className="space-y-6">
                    {/* حالة الاتصال */}
                    <div className="rounded-lg shadow overflow-hidden">
                        <div className={`p-4 ${diagnosticData.connection_status === 'success'
                            ? 'bg-green-100'
                            : diagnosticData.connection_status === 'failed'
                                ? 'bg-red-100'
                                : 'bg-yellow-100'
                            }`}>
                            <h2 className="text-xl font-semibold">
                                حالة الاتصال: {' '}
                                {diagnosticData.connection_status === 'success'
                                    ? '✅ ناجح'
                                    : diagnosticData.connection_status === 'failed'
                                        ? '❌ فشل'
                                        : '⏳ قيد الانتظار'}
                            </h2>
                            {diagnosticData.connection_time_ms && (
                                <p className="text-sm">وقت الاتصال: {diagnosticData.connection_time_ms} مللي ثانية</p>
                            )}
                        </div>

                        {/* مشكلات محتملة */}
                        {diagnosticData.possible_issues && diagnosticData.possible_issues.length > 0 && (
                            <div className="p-4 bg-yellow-50">
                                <h3 className="font-semibold mb-2">مشكلات محتملة:</h3>
                                <ul className="list-disc list-inside">
                                    {diagnosticData.possible_issues.map((issue, index) => (
                                        <li key={index} className="text-red-600">{issue}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* متغيرات البيئة */}
                    <div className="rounded-lg shadow overflow-hidden">
                        <div className="bg-gray-100 p-4">
                            <h2 className="text-lg font-semibold mb-1">متغيرات البيئة:</h2>
                        </div>
                        <div className="p-4">
                            <table className="w-full">
                                <tbody>
                                    <tr className="border-b">
                                        <td className="py-2 font-medium">البيئة:</td>
                                        <td className="py-2">{diagnosticData.environment}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 font-medium">MONGODB_URI:</td>
                                        <td className="py-2">
                                            {diagnosticData.env_variables.mongodb_uri_exists ? '✅ موجود' : '❌ غير موجود'}
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 font-medium">MONGODB_ATLAS_URI:</td>
                                        <td className="py-2">
                                            {diagnosticData.env_variables.mongodb_atlas_uri_exists ? '✅ موجود' : '❌ غير موجود'}
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 font-medium">MONGODB_DB_NAME:</td>
                                        <td className="py-2">
                                            {diagnosticData.env_variables.mongodb_db_name_exists ? '✅ موجود' : '❌ غير موجود'}
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 font-medium">NEXTAUTH_URL:</td>
                                        <td className="py-2">{diagnosticData.env_variables.nextauth_url || 'غير محدد'}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-medium">NEXT_PUBLIC_SITE_URL:</td>
                                        <td className="py-2">{diagnosticData.env_variables.site_url || 'غير محدد'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* خطوات التشخيص */}
                    <div className="rounded-lg shadow overflow-hidden">
                        <div className="bg-gray-100 p-4">
                            <h2 className="text-lg font-semibold mb-1">خطوات التشخيص:</h2>
                        </div>
                        <div className="p-4">
                            <ol className="list-decimal list-inside">
                                {diagnosticData.steps.map((step, index) => (
                                    <li key={index} className="py-1">{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* تفاصيل الخطأ - في حالة وجود خطأ */}
                    {diagnosticData.error && (
                        <div className="rounded-lg shadow overflow-hidden">
                            <div className="bg-red-100 p-4">
                                <h2 className="text-lg font-semibold mb-1">تفاصيل الخطأ:</h2>
                            </div>
                            <div className="p-4">
                                <p className="font-semibold">رسالة الخطأ:</p>
                                <p className="p-2 bg-gray-100 rounded mb-4 overflow-x-auto">{diagnosticData.error}</p>

                                {diagnosticData.details && (
                                    <>
                                        <p className="font-semibold">نوع الخطأ:</p>
                                        <p className="p-2 bg-gray-100 rounded mb-4">{diagnosticData.details.name} {diagnosticData.details.code ? `(${diagnosticData.details.code})` : ''}</p>

                                        {diagnosticData.details.stack && (
                                            <>
                                                <p className="font-semibold">تتبع الخطأ:</p>
                                                <pre className="p-2 bg-gray-100 rounded overflow-x-auto text-xs">
                                                    {diagnosticData.details.stack}
                                                </pre>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* معلومات قاعدة البيانات - في حالة نجاح الاتصال */}
                    {diagnosticData.connection_status === 'success' && (
                        <>
                            <div className="rounded-lg shadow overflow-hidden">
                                <div className="bg-green-100 p-4">
                                    <h2 className="text-lg font-semibold mb-1">معلومات قاعدة البيانات:</h2>
                                </div>
                                <div className="p-4">
                                    <p className="font-semibold">إصدار MongoDB:</p>
                                    <p className="p-2 bg-gray-100 rounded mb-4">{diagnosticData.server_info.version}</p>

                                    {diagnosticData.collections && (
                                        <>
                                            <p className="font-semibold">المجموعات الموجودة:</p>
                                            <ul className="list-disc list-inside p-2 bg-gray-100 rounded">
                                                {diagnosticData.collections.map((collection, index) => (
                                                    <li key={index}>{collection}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* وقت التشخيص */}
                    <div className="text-sm text-gray-600 text-left mt-4">
                        تم الفحص في: {new Date(diagnosticData.timestamp).toLocaleString()}
                    </div>
                </div>
            )}
        </div>
    );
} 