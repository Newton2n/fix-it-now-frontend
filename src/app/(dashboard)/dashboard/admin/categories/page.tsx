import { getAllCategory } from "@/actions/admin.action";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type CategoryResponse = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: Category[];
};

export default async function AdminCategoriesPage() {
  const response = await getAllCategory();
  console.log("response category", response);
  const categories = response?.data.result.data;
  const meta = response?.data.result.meta;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Categories"
        description="Create and manage service categories."
      />

      <SectionCard
        title="Add Category"
        description="Create a new service category"
      >
        <div className="grid gap-3 md:grid-cols-[1fr_1.2fr_auto]">
          <Input placeholder="Category name" className="h-11" />
          <Input placeholder="Description" className="h-11" />
          <Button className="h-11 px-6">Create Category</Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Category List"
        description={`Page ${meta?.currentPage} of ${meta?.totalPage} • ${meta?.totalRow} total categories`}
      >
        {categories?.length > 0 ? (
          <div className="space-y-4">
            {categories.map((category: Category) => (
              <div
                key={category.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Category
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">
                        {category.name}
                      </h3>
                    </div>

                    <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                      {category.description}
                    </p>

                    <div className="grid gap-2 md:grid-cols-2">
                      <Info label="Category ID" value={category.id} />
                      <Info
                        label="Created At"
                        value={formatDateTime(category.createdAt)}
                      />
                      <Info
                        label="Updated At"
                        value={formatDateTime(category.updatedAt)}
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <Badge variant="secondary" className="rounded-full px-3">
                      Active
                    </Badge>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              No categories found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no categories available right now.
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-medium leading-6 text-foreground">
        {value}
      </p>
    </div>
  );
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}
