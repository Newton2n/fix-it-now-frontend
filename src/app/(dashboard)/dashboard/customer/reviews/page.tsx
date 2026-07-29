import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const completedJobs = ["Plumbing Repair", "Home Cleaning"];

export default function CustomerReviewsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Reviews"
        description="Leave feedback after your service is completed."
      />

      <SectionCard title="Write a Review" description="Select a completed job and submit your feedback">
        <div className="space-y-4">
          <div className="rounded-xl border p-4">
            <p className="text-sm font-medium">Completed Jobs</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {completedJobs.map((job) => (
                <li key={job}>• {job}</li>
              ))}
            </ul>
          </div>

          <Textarea placeholder="Write your review..." />
          <Button>Submit Review</Button>
        </div>
      </SectionCard>
    </div>
  );
}