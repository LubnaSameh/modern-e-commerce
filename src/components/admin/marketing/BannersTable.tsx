"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Banner = {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
    active: boolean;
    createdAt: Date;
};

// Sample data - in a real app this would come from your API
const sampleBanners: Banner[] = [
    {
        id: "1",
        title: "Summer Sale",
        description: "Get up to 50% off on summer collection",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=400&fit=crop",
        link: "/shop/summer-sale",
        active: true,
        createdAt: new Date(2023, 4, 15),
    },
    {
        id: "2",
        title: "New Arrivals",
        description: "Check out our latest products",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
        link: "/shop/new-arrivals",
        active: true,
        createdAt: new Date(2023, 4, 10),
    },
    {
        id: "3",
        title: "Special Offer",
        description: "Limited time offer on selected items",
        image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&h=400&fit=crop",
        link: "/shop/special-offers",
        active: false,
        createdAt: new Date(2023, 3, 25),
    },
];

export function BannersTable() {
    const [banners, setBanners] = useState<Banner[]>(sampleBanners);

    // Toggle banner active status
    const toggleActive = (id: string) => {
        setBanners(
            banners.map((banner) =>
                banner.id === id ? { ...banner, active: !banner.active } : banner
            )
        );
    };

    // Delete banner
    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            setBanners(banners.filter((banner) => banner.id !== id));
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Banner
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Link
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Created
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {banners.length > 0 ? (
                            banners.map((banner) => (
                                <tr key={banner.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-16 w-24 flex-shrink-0 rounded-md overflow-hidden">
                                                <Image
                                                    src={banner.image}
                                                    alt={banner.title}
                                                    width={96}
                                                    height={64}
                                                    className="h-16 w-24 object-cover"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {banner.title}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                    {banner.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <a
                                            href={banner.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            {banner.link}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleActive(banner.id)}
                                            className="inline-flex items-center"
                                        >
                                            {banner.active ? (
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(banner.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end items-center space-x-3">
                                            <Link
                                                href={`/admin/marketing/banners/${banner.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </Link>
                                            <Link
                                                href={`/admin/marketing/banners/edit/${banner.id}`}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(banner.id)}
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
                                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No banners found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 