import { PageTitle } from "@/components/admin/PageTitle";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";

export const metadata = {
    title: "Manage Orders | Admin Dashboard",
    description: "Manage your store's orders and track order status",
};

export default function OrdersPage() {
    return (
        <div>
            <PageTitle
                title="Orders"
                description="Manage and process customer orders"
            />

            <div className="mt-6">
                <OrdersTable />
            </div>
        </div>
    );
} 