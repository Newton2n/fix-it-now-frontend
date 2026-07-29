import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TechnicianAvailabilityPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Availability"
        description="Set your working hours and block out unavailable times."
        action={<Button>Save Schedule</Button>}
      />

      <SectionCard title="Weekly Schedule" description="Update your availability">
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Monday: 9:00 AM - 5:00 PM" />
          <Input placeholder="Tuesday: 9:00 AM - 5:00 PM" />
          <Input placeholder="Wednesday: 9:00 AM - 5:00 PM" />
          <Input placeholder="Thursday: 9:00 AM - 5:00 PM" />
          <Input placeholder="Friday: 9:00 AM - 5:00 PM" />
          <Input placeholder="Saturday: Off" />
        </div>
      </SectionCard>
    </div>
  );
}