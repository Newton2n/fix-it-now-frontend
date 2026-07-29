import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Plumbing", count: 24 },
  { name: "Electrical", count: 18 },
  { name: "Cleaning", count: 31 },
  { name: "AC Repair", count: 14 },
  { name: "Painting", count: 12 },
  { name: "Appliance Repair", count: 16 },
];

export default function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Browse Categories</h2>
        <p className="text-sm text-muted-foreground">
          Choose from the most popular home service categories.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.name} href="/services">
            <Card className="transition hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} services</p>
                </div>
                <span className="text-sm text-primary">View</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}