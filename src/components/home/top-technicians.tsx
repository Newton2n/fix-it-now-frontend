import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const technicians = [
  {
    id: 1,
    name: "Rahim Uddin",
    skill: "Plumbing Expert",
    rating: 4.9,
    image: "/technicians/t1.jpg",
  },
  {
    id: 2,
    name: "Aminul Islam",
    skill: "AC Specialist",
    rating: 4.8,
    image: "/technicians/t2.jpg",
  },
  {
    id: 3,
    name: "Jannat Ara",
    skill: "Electrical Technician",
    rating: 4.7,
    image: "/technicians/t3.jpg",
  },
  {
    id: 4,
    name: "Sadia Khan",
    skill: "Cleaning Pro",
    rating: 4.6,
    image: "/technicians/t4.jpg",
  },
];

export default function TopTechnicians() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Top Technicians
        </h2>

        <p className="text-sm text-muted-foreground">
          Highly rated professionals near you.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {technicians.map((tech) => (
          <Card key={tech.id} className="overflow-hidden">
            <div className="relative h-52 w-full">
              <Image
                src={tech.image}
                alt={tech.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>

            <CardContent className="space-y-2 p-5">
              <h3 className="font-semibold text-foreground">
                {tech.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {tech.skill}
              </p>

              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>{tech.rating}</span>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
              <Button className="w-full" asChild>
                <Link href={`/technicians/${tech.id}`}>
                  View Profile
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}