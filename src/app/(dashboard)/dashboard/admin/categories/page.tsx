import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  { id: 1, name: "Plumbing", status: "Active" },
  { id: 2, name: "Electrical", status: "Active" },
  { id: 3, name: "Cleaning", status: "Active" },
];

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Categories"
        description="Create and manage service categories."
      />

      <SectionCard title="Add Category" description="Create a new service category">
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Category name" />
          <Input placeholder="Description" />
          <Button>Create Category</Button>
        </div>
      </SectionCard>

      <SectionCard title="Category List" description="Existing categories">
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-sm text-muted-foreground">Category ID: {category.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{category.status}</Badge>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}