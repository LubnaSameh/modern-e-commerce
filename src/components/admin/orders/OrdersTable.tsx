"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, ChevronDown, Eye, ArrowUpDown } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";

type Order = {
    id: string;
    customer: {
        name: string;
        email: string;
        id: string;
    };
    status: OrderStatus;
    total: number;
    paymentMethod: string;
    items: number;
    date: Date;
};

// Sample data - in a real app this would come from your API
const sampleOrders: Order[] = [
    {
        id: "ORD-1234",
        customer: {
            name: "John Doe",
            email: "john@example.com",
            id: "CUS-1",
        },
        status: "DELIVERED",
        total: 125.99,
        paymentMethod: "STRIPE",
        items: 3,
        date: new Date(2023, 4, 12),
    },
    {
        id: "ORD-1235",
        customer: {
            name: "Jane Smith",
            email: "jane@example.com",
            id: "CUS-2",
        },
        status: "PROCESSING",
        total: 89.99,
        paymentMethod: "STRIPE",
        items: 2,
        date: new Date(2023, 4, 11),
    },
    {
        id: "ORD-1236",
        customer: {
            name: "Michael Johnson",
            email: "michael@example.com",
            id: "CUS-3",
        },
        status: "SHIPPED",
        total: 199.99,
        paymentMethod: "COD",
        items: 4,
        date: new Date(2023, 4, 10),
    },
    {
        id: "ORD-1237",
        customer: {
            name: "Robert Williams",
            email: "robert@example.com",
            id: "CUS-4",
        },
        status: "PENDING",
        total: 145.50,
        paymentMethod: "MANUAL",
        items: 2,
        date: new Date(2023, 4, 9),
    },
    {
        id: "ORD-1238",
        customer: {
            name: "Emma Wilson",
            email: "emma@example.com",
            id: "CUS-5",
        },
        status: "CANCELED",
        total: 99.99,
        paymentMethod: "STRIPE",
        items: 1,
        date: new Date(2023, 4, 8),
    },
    {
        id: "ORD-1239",
        customer: {
            name: "David Brown",
            email: "david@example.com",
            id: "CUS-6",
        },
        status: "DELIVERED",
        total: 299.99,
        paymentMethod: "COD",
        items: 5,
        date: new Date(2023, 4, 7),
    },
    {
        id: "ORD-1240",
        customer: {
            name: "Sophia Martinez",
            email: "sophia@example.com",
            id: "CUS-7",
        },
        status: "PROCESSING",
        total: 67.50,
        paymentMethod: "STRIPE",
        items: 2,
        date: new Date(2023, 4, 6),
    },
];

const StatusBadge = ({ status }: { status: OrderStatus }) => {
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

type SortField = "date" | "total" | "status";
type SortOrder = "asc" | "desc";

export function OrdersTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
    const [sortField, setSortField] = useState<SortField>("date");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [orders, setOrders] = useState<Order[]>(sampleOrders);

    // Filter orders based on search term and status filter
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort orders based on sort field and order
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (sortField === "date") {
            return sortOrder === "asc"
                ? a.date.getTime() - b.date.getTime()
                : b.date.getTime() - a.date.getTime();
        }

        if (sortField === "total") {
            return sortOrder === "asc" ? a.total - b.total : b.total - a.total;
        }

        if (sortField === "status") {
            return sortOrder === "asc"
                ? a.status.localeCompare(b.status)
                : b.status.localeCompare(a.status);
        }

        return 0;
    });

    // Handle sort click
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // If already sorting by this field, toggle order
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            // If sorting by a new field, set it and default to desc
            setSortField(field);
            setSortOrder("desc");
        }
    };

    // Get sort icon for the column
    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
        }

        return sortOrder === "asc" ? (
            <ArrowUpDown className="ml-1 h-4 w-4 text-primary transform rotate-180" />
        ) : (
            <ArrowUpDown className="ml-1 h-4 w-4 text-primary" />
        );
    };

    // Status options for filter
    const statusOptions: Array<"ALL" | OrderStatus> = [
        "ALL",
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELED",
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="Search by order ID, customer name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <div className="flex">
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                                id="status-filter-menu"
                                aria-expanded="true"
                                aria-haspopup="true"
                                onClick={() => document.getElementById("status-dropdown")?.classList.toggle("hidden")}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                {statusFilter === "ALL" ? "All Status" : statusFilter}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </button>
                        </div>
                        <div
                            id="status-dropdown"
                            className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10"
                        >
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="status-filter-menu">
                                {statusOptions.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setStatusFilter(status);
                                            document.getElementById("status-dropdown")?.classList.add("hidden");
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm ${statusFilter === status
                                                ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                            }`}
                                        role="menuitem"
                                    >
                                        {status === "ALL" ? "All Status" : status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Customer
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("status")}
                            >
                                <div className="flex items-center">
                                    Status
                                    {getSortIcon("status")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("total")}
                            >
                                <div className="flex items-center">
                                    Total
                                    {getSortIcon("total")}
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Payment
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("date")}
                            >
                                <div className="flex items-center">
                                    Date
                                    {getSortIcon("date")}
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedOrders.length > 0 ? (
                            sortedOrders.map((order) => (
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
                                        <div className="text-xs text-gray-400 dark:text-gray-500">
                                            {order.items} {order.items === 1 ? "item" : "items"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {order.paymentMethod === "STRIPE" && "Credit Card"}
                                        {order.paymentMethod === "COD" && "Cash on Delivery"}
                                        {order.paymentMethod === "MANUAL" && "Manual Transfer"}
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination - could be added here */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {sortedOrders.length} of {orders.length} orders
                    </div>
                    {/* Pagination controls would go here */}
                </div>
            </div>
        </div>
    );
} 