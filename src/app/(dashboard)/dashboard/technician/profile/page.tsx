import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function TechnicianProfilePage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Profile"
        description="Update your personal and professional information."
      />

      <SectionCard title="Profile Details" description="Edit your technician profile">
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Full name" />
          <Input placeholder="Email address" />
          <Input placeholder="Phone number" />
          <Input placeholder="Experience" />
          <Input placeholder="Skill / Specialty" />
          <Input placeholder="Hourly Rate" />
        </div>

        <Textarea className="mt-4" placeholder="Write a short bio..." />
        <Button className="mt-4">Save Changes</Button>
      </SectionCard>
    </div>
  );
}