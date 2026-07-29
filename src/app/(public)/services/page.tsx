import ServiceCard from "@/components/service/service-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    id: 1,
    title: "Plumbing Repair",
    image: "/services/plumbing.jpg",
    location: "Dhaka",
    rating: 4.8,
    price: 25,
    technician: "Rahim Uddin",
  },
  {
    id: 2,
    title: "AC Installation",
    image: "/services/ac.jpg",
    location: "Chattogram",
    rating: 4.9,
    price: 45,
    technician: "Aminul Islam",
  },
  {
    id: 3,
    title: "Electrical Fixing",
    image: "/services/electrical.jpg",
    location: "Sylhet",
    rating: 4.7,
    price: 30,
    technician: "Jannat Ara",
  },
  {
    id: 4,
    title: "Home Cleaning",
    image: "/services/cleaning.jpg",
    location: "Rajshahi",
    rating: 4.6,
    price: 20,
    technician: "Sadia Khan",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <Badge variant="secondary" className="mb-3">
            Browse Services
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Find the right service for your home
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Search, filter, and compare trusted technicians before you book.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-4 rounded-2xl border bg-card p-4 shadow-sm md:grid-cols-4">
          <Input placeholder="Search service or location..." className="md:col-span-2" />
          <Button variant="outline">Filter: Category</Button>
          <Button>Search</Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">All</Button>
          <Button variant="outline" size="sm">Plumbing</Button>
          <Button variant="outline" size="sm">Electrical</Button>
          <Button variant="outline" size="sm">Cleaning</Button>
          <Button variant="outline" size="sm">AC Repair</Button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </section>
    </main>
  );
}