"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, ChevronDown, Eye, Edit, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Customer = {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: "USER" | "ADMIN";
    orders: number;
    createdAt: Date;
    lastOrder?: Date;
};

// Sample data - in a real app this would come from your API
const sampleCustomers: Customer[] = [
    {
        id: "CUS-1",
        name: "John Doe",
        email: "john@example.com",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        role: "USER",
        orders: 5,
        createdAt: new Date(2023, 1, 15),
        lastOrder: new Date(2023, 3, 20),
    },
    {
        id: "CUS-2",
        name: "Jane Smith",
        email: "jane@example.com",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        role: "USER",
        orders: 3,
        createdAt: new Date(2023, 2, 5),
        lastOrder: new Date(2023, 4, 2),
    },
    {
        id: "CUS-3",
        name: "Michael Johnson",
        email: "michael@example.com",
        image: "https://randomuser.me/api/portraits/men/59.jpg",
        role: "USER",
        orders: 8,
        createdAt: new Date(2023, 0, 22),
        lastOrder: new Date(2023, 4, 10),
    },
    {
        id: "CUS-4",
        name: "Robert Williams",
        email: "robert@example.com",
        role: "USER",
        orders: 2,
        createdAt: new Date(2023, 3, 8),
        lastOrder: new Date(2023, 4, 5),
    },
    {
        id: "CUS-5",
        name: "Emma Wilson",
        email: "emma@example.com",
        image: "https://randomuser.me/api/portraits/women/63.jpg",
        role: "USER",
        orders: 0,
        createdAt: new Date(2023, 4, 1),
    },
    {
        id: "CUS-6",
        name: "Admin User",
        email: "admin@example.com",
        image: "https://randomuser.me/api/portraits/women/28.jpg",
        role: "ADMIN",
        orders: 0,
        createdAt: new Date(2023, 0, 1),
    },
];

export function CustomersTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [customers] = useState<Customer[]>(sampleCustomers);

    // Filter customers based on search term and filter
    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filter === "All" ||
            (filter === "With Orders" && customer.orders > 0) ||
            (filter === "No Orders" && customer.orders === 0) ||
            (filter === "Admin" && customer.role === "ADMIN");

        return matchesSearch && matchesFilter;
    });

    // Filter options
    const filterOptions = ["All", "With Orders", "No Orders", "Admin"];

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
                            placeholder="Search by name, email or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <div className="flex">
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                                id="customer-filter-menu"
                                aria-expanded="true"
                                aria-haspopup="true"
                                onClick={() => document.getElementById("customer-filter-dropdown")?.classList.toggle("hidden")}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                {filter}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </button>
                        </div>
                        <div
                            id="customer-filter-dropdown"
                            className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10"
                        >
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="customer-filter-menu">
                                {filterOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setFilter(option);
                                            document.getElementById("customer-filter-dropdown")?.classList.add("hidden");
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm ${filter === option
                                            ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                            }`}
                                        role="menuitem"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Customer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Orders
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Joined
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Last Order
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                                {customer.image ? (
                                                    <Image
                                                        src={customer.image}
                                                        alt={customer.name}
                                                        width={40}
                                                        height={40}
                                                        className="h-10 w-10 object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-500">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {customer.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {customer.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.role === "ADMIN"
                                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                            }`}>
                                            {customer.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {customer.orders}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(customer.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {customer.lastOrder ? formatDate(customer.lastOrder) : "No orders yet"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end items-center space-x-3">
                                            <Link
                                                href={`/admin/customers/${customer.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </Link>
                                            <Link
                                                href={`/admin/customers/edit/${customer.id}`}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </Link>
                                            <a
                                                href={`mailto:${customer.email}`}
                                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                            >
                                                <Mail className="h-5 w-5" />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No customers found
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
                        Showing {filteredCustomers.length} of {customers.length} customers
                    </div>
                    {/* Pagination controls would go here */}
                </div>
            </div>
        </div>
    );
} 