import ServiceCard from "@/components/service/service-card";

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

export default function FeaturedServices() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Featured Services</h2>
        <p className="text-sm text-muted-foreground">
          Explore some of our most requested home services.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </section>
  );
}