import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CustomerProfilePage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Profile"
        description="Update your personal information."
      />

      <SectionCard title="Profile Details" description="Edit your customer account info">
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Full name" />
          <Input placeholder="Email address" />
          <Input placeholder="Phone number" />
          <Input placeholder="Address" />
        </div>

        <Button className="mt-4">Save Changes</Button>
      </SectionCard>
    </div>
  );
}