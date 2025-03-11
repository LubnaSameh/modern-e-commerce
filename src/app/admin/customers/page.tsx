import { PageTitle } from "@/components/admin/PageTitle";
import { CustomersTable } from "@/components/admin/customers/CustomersTable";

export const metadata = {
    title: "Manage Customers | Admin Dashboard",
    description: "Manage your store's customers",
};

export default function CustomersPage() {
    return (
        <div>
            <PageTitle
                title="Customers"
                description="Manage your store users and customer data"
            />

            <div className="mt-6">
                <CustomersTable />
            </div>
        </div>
    );
} 