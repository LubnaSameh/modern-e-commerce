import { PageTitle } from "@/components/admin/PageTitle";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CouponsTable } from "@/components/admin/marketing/CouponsTable";

export const metadata = {
    title: "Manage Coupons | Admin Dashboard",
    description: "Manage your store's discount coupons",
};

export default function CouponsPage() {
    return (
        <div>
            <PageTitle
                title="Coupons"
                description="Manage discount coupons for your store"
                action={
                    <Link
                        href="/admin/marketing/coupons/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Coupon
                    </Link>
                }
            />

            <div className="mt-6">
                <CouponsTable />
            </div>
        </div>
    );
} 