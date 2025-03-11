import { PageTitle } from "@/components/admin/PageTitle";
import { StoreSettings } from "@/components/admin/settings/StoreSettings";

export const metadata = {
    title: "Store Settings | Admin Dashboard",
    description: "Configure your store settings",
};

export default function SettingsPage() {
    return (
        <div>
            <PageTitle
                title="Settings"
                description="Configure your store settings and preferences"
            />

            <div className="mt-6">
                <StoreSettings />
            </div>
        </div>
    );
} 