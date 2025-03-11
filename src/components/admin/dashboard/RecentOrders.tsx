"use client";

import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";

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

// Fixed mock data for display purposes
const mockOrders: Order[] = [
    {
        id: "ORD-001",
        customer: {
            name: "John Smith",
            email: "john@example.com"
        },
        status: "DELIVERED",
        total: 128.50,
        date: new Date(2023, 8, 15)
    },
    {
        id: "ORD-002",
        customer: {
            name: "Sarah Johnson",
            email: "sarah@example.com"
        },
        status: "PROCESSING",
        total: 295.75,
        date: new Date(2023, 8, 18)
    },
    {
        id: "ORD-003",
        customer: {
            name: "Michael Brown",
            email: "michael@example.com"
        },
        status: "SHIPPED",
        total: 79.99,
        date: new Date(2023, 8, 20)
    },
    {
        id: "ORD-004",
        customer: {
            name: "Emma Wilson",
            email: "emma@example.com"
        },
        status: "PENDING",
        total: 149.99,
        date: new Date(2023, 8, 22)
    },
    {
        id: "ORD-005",
        customer: {
            name: "David Lee",
            email: "david@example.com"
        },
        status: "CANCELED",
        total: 64.50,
        date: new Date(2023, 8, 23)
    }
];

const getStatusColor = (status: Order['status']) => {
    switch (status) {
        case "PENDING":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500";
        case "PROCESSING":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500";
        case "SHIPPED":
            return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500";
        case "DELIVERED":
            return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
        case "CANCELED":
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500";
    }
};

function RecentOrders() {
    const orders = mockOrders;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <th className="px-4 py-2">Order</th>
                        <th className="px-4 py-2">Customer</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Total</th>
                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map((order) => (
                        <tr key={order.id} className="text-sm">
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                {order.id}
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                <div>{order.customer.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{order.customer.email}</div>
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                {formatDate(order.date)}
                            </td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                {formatCurrency(order.total)}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <Link
                                    href={`/admin/orders/${order.id}`}
                                    className="text-primary hover:text-primary-dark"
                                    aria-label={`View details for order ${order.id}`}
                                >
                                    <Eye className="h-4 w-4" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Export as default for dynamic import
export default RecentOrders;
// Also keep named export for backwards compatibility
export { RecentOrders }; 