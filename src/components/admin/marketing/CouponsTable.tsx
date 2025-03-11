"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash, Eye, ToggleLeft, ToggleRight, Copy } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

type Coupon = {
    id: string;
    code: string;
    amount: number;
    type: "percentage" | "fixed";
    minPurchase?: number;
    maxUses?: number;
    usesCount: number;
    active: boolean;
    startDate?: Date;
    endDate?: Date;
    createdAt: Date;
};

// Sample data - in a real app this would come from your API
const sampleCoupons: Coupon[] = [
    {
        id: "1",
        code: "SUMMER20",
        amount: 20,
        type: "percentage",
        minPurchase: 50,
        maxUses: 100,
        usesCount: 45,
        active: true,
        startDate: new Date(2023, 4, 1),
        endDate: new Date(2023, 7, 31),
        createdAt: new Date(2023, 3, 15),
    },
    {
        id: "2",
        code: "WELCOME10",
        amount: 10,
        type: "fixed",
        minPurchase: 30,
        usesCount: 78,
        active: true,
        createdAt: new Date(2023, 2, 10),
    },
    {
        id: "3",
        code: "FLASH25",
        amount: 25,
        type: "percentage",
        minPurchase: 100,
        maxUses: 50,
        usesCount: 50,
        active: false,
        startDate: new Date(2023, 3, 1),
        endDate: new Date(2023, 3, 15),
        createdAt: new Date(2023, 2, 25),
    },
];

export function CouponsTable() {
    const [coupons, setCoupons] = useState<Coupon[]>(sampleCoupons);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // Toggle coupon active status
    const toggleActive = (id: string) => {
        setCoupons(
            coupons.map((coupon) =>
                coupon.id === id ? { ...coupon, active: !coupon.active } : coupon
            )
        );
    };

    // Delete coupon
    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            setCoupons(coupons.filter((coupon) => coupon.id !== id));
        }
    };

    // Copy coupon code to clipboard
    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Code
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Discount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Usage / Limits
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Validity
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {coupons.length > 0 ? (
                            coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {coupon.code}
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(coupon.code)}
                                                className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                title="Copy code"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            {copiedCode === coupon.code && (
                                                <span className="ml-2 text-xs text-green-600">Copied!</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {coupon.type === "percentage" ? (
                                            <span>{coupon.amount}% off</span>
                                        ) : (
                                            <span>{formatCurrency(coupon.amount)} off</span>
                                        )}
                                        {coupon.minPurchase && (
                                            <div className="text-xs text-gray-400 dark:text-gray-500">
                                                Min. purchase: {formatCurrency(coupon.minPurchase)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div>
                                            {coupon.usesCount} uses
                                            {coupon.maxUses && ` / ${coupon.maxUses} max`}
                                        </div>
                                        {coupon.maxUses && (
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1.5">
                                                <div
                                                    className="bg-primary h-1.5 rounded-full"
                                                    style={{ width: `${Math.min(100, (coupon.usesCount / coupon.maxUses) * 100)}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {coupon.startDate && coupon.endDate ? (
                                            <div>
                                                <div>{formatDate(coupon.startDate)}</div>
                                                <div>to {formatDate(coupon.endDate)}</div>
                                            </div>
                                        ) : (
                                            <span>No expiration</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleActive(coupon.id)}
                                            className="inline-flex items-center"
                                        >
                                            {coupon.active ? (
                                                <>
                                                    <ToggleRight className="h-5 w-5 text-green-600 mr-1.5" />
                                                    <span className="text-sm text-green-600">Active</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ToggleLeft className="h-5 w-5 text-gray-400 mr-1.5" />
                                                    <span className="text-sm text-gray-500">Inactive</span>
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end items-center space-x-3">
                                            <Link
                                                href={`/admin/marketing/coupons/${coupon.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </Link>
                                            <Link
                                                href={`/admin/marketing/coupons/edit/${coupon.id}`}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(coupon.id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <Trash className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No coupons found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 