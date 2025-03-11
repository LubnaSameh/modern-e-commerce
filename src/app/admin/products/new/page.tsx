import { PageTitle } from "@/components/admin/PageTitle";
import { ProductForm } from "@/components/admin/products/ProductForm";

export const metadata = {
    title: "Add New Product | Admin Dashboard",
    description: "Add a new product to your store",
};

export default function NewProductPage() {
    return (
        <div>
            <PageTitle
                title="Add New Product"
                description="Create a new product for your store"
            />

            <div className="mt-6">
                <ProductForm />
            </div>
        </div>
    );
} 