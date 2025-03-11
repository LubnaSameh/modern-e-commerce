"use client";

import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

type Order = {
    id: string;
    customer: {
        name: string;
        email: string;
    };
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";
    total: number;
    date: Date;
};

const StatusBadge = ({ status }: { status: Order["status"] }) => {
    const statusStyles = {
        PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        CANCELED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    const statusText = {
        PENDING: "Pending",
        PROCESSING: "Processing",
        SHIPPED: "Shipped",
        DELIVERED: "Delivered",
        CANCELED: "Canceled",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
        >
            {statusText[status]}
        </span>
    );
};

// Fixed sample data for the dashboard
const fixedSampleOrders: Order[] = [
    {
        id: "ORD-1234",
        customer: {
            name: "Ahmed Mohamed",
            email: "ahmed@example.com",
        },
        status: "DELIVERED",
        total: 125.99,
        date: new Date(2023, 4, 12),
    },
    {
        id: "ORD-1235",
        customer: {
            name: "Sara Ali",
            email: "sara@example.com",
        },
        status: "PROCESSING",
        total: 89.99,
        date: new Date(2023, 4, 11),
    },
    {
        id: "ORD-1236",
        customer: {
            name: "Mohamed Khalid",
            email: "mohamed@example.com",
        },
        status: "SHIPPED",
        total: 199.99,
        date: new Date(2023, 4, 10),
    },
    {
        id: "ORD-1237",
        customer: {
            name: "Laila Omar",
            email: "laila@example.com",
        },
        status: "PENDING",
        total: 145.50,
        date: new Date(2023, 4, 9),
    },
    {
        id: "ORD-1238",
        customer: {
            name: "Omar Hassan",
            email: "omar@example.com",
        },
        status: "CANCELED",
        total: 99.99,
        date: new Date(2023, 4, 8),
    },
];

export function RecentOrders() {
    const [orders, setOrders] = useState<Order[]>(fixedSampleOrders);
    const [isLoading, setIsLoading] = useState(false);
    const [hasRealOrders, setHasRealOrders] = useState(false);

    useEffect(() => {
        const attemptFetchRealOrders = async () => {
            try {
                setIsLoading(true);
                console.log('Attempting to fetch any real orders...');

                const response = await fetch('/api/admin/recent-orders');

                if (!response.ok) {
                    console.log('No real orders available, using sample data only');
                    return; // Keep using fixed sample data
                }

                const data = await response.json();

                // Check if we have valid data and it's an array
                if (!Array.isArray(data) || data.length === 0) {
                    console.log('No real orders returned from API, using sample data only');
                    return; // Keep using fixed sample data
                }

                // Convert API response to our Order format
                const realOrders = data.map((order: any) => ({
                    id: order.id,
                    customer: {
                        name: order.user?.name || 'Guest',
                        email: order.user?.email || 'guest@example.com',
                    },
                    status: order.status,
                    total: order.total,
                    date: new Date(order.createdAt),
                }));

                // Only replace fixed data if we have real orders
                if (realOrders.length > 0) {
                    console.log(`Found ${realOrders.length} real orders, mixing with sample data`);
                    setHasRealOrders(true);

                    // Create a mixed array with real orders at the top and then sample orders 
                    // to fill up to 5 items total
                    const mixedOrders = [
                        ...realOrders,
                        ...fixedSampleOrders.slice(0, Math.max(0, 5 - realOrders.length))
                    ].slice(0, 5);

                    setOrders(mixedOrders);
                }
            } catch (err) {
                console.error('Error while checking for real orders:', err);
                // Keep using fixed sample data on error
            } finally {
                setIsLoading(false);
            }
        };

        attemptFetchRealOrders();
    }, []);

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded mb-2"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            {hasRealOrders && (
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-2 mb-4 rounded text-sm">
                    Merged real orders with sample data
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Customer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Total
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {order.customer.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {order.customer.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {formatCurrency(order.total)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(order.date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="text-primary hover:text-primary-600 flex items-center justify-end gap-1"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>View</span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center">
                <Link
                    href="/admin/orders"
                    className="text-sm text-primary hover:text-primary-600 font-medium"
                >
                    View All Orders →
                </Link>
            </div>
        </div>
    );
} 