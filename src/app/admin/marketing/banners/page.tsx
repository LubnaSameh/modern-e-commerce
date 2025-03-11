import { PageTitle } from "@/components/admin/PageTitle";
import Link from "next/link";
import { Plus } from "lucide-react";
import { BannersTable } from "@/components/admin/marketing/BannersTable";

export const metadata = {
    title: "Manage Banners | Admin Dashboard",
    description: "Manage your store's promotional banners",
};

export default function BannersPage() {
    return (
        <div>
            <PageTitle
                title="Banners"
                description="Manage promotional banners for your store"
                action={
                    <Link
                        href="/admin/marketing/banners/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Banner
                    </Link>
                }
            />

            <div className="mt-6">
                <BannersTable />
            </div>
        </div>
    );
} 