import { PageTitle } from "@/components/admin/PageTitle";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = {
    title: "Manage Products | Admin Dashboard",
    description: "Manage your store's products",
};

export default function ProductsPage() {
    return (
        <div>
            <PageTitle
                title="Products"
                description="Manage your store products and inventory"
                action={
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Link>
                }
            />

            <div className="mt-6">
                <ProductsTable />
            </div>
        </div>
    );
} 