'use client';

import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">متجر إلكتروني</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
                        <h2 className="text-2xl font-bold mb-4">مرحباً بك في المتجر الإلكتروني</h2>
                        <p className="mb-4">
                            هذا هو المشروع الخاص بالمتجر الإلكتروني. يمكنك استخدام الروابط أدناه للتنقل في التطبيق.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold mb-3">روابط المتجر</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="/products" className="text-blue-600 hover:text-blue-800 hover:underline">
                                            تصفح المنتجات
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/categories" className="text-blue-600 hover:text-blue-800 hover:underline">
                                            التصنيفات
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/cart" className="text-blue-600 hover:text-blue-800 hover:underline">
                                            سلة التسوق
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold mb-3">أدوات التشخيص</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="/db-status" className="text-blue-600 hover:text-blue-800 hover:underline">
                                            حالة قاعدة البيانات
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/test-connection" className="text-blue-600 hover:text-blue-800 hover:underline">
                                            اختبار اتصال MongoDB
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white shadow-inner mt-8">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500">
                        &copy; {new Date().getFullYear()} المتجر الإلكتروني - جميع الحقوق محفوظة
                    </p>
                </div>
            </footer>
        </div>
    );
} 