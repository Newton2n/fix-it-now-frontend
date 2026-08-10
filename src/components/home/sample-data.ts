import type { FeaturedService, ServiceCategory, Technician } from "./types";
// import plumbingImg from "@/assets/service-plumbing.jpg";
// import electricalImg from "@/assets/service-electrical.jpg";
// import cleaningImg from "@/assets/service-cleaning.jpg";
// import acImg from "@/assets/service-ac.jpg";

/** PLACEHOLDER props — replace with real FixItNow data. No ratings/reviews are faked. */
export const sampleCategories: ServiceCategory[] = [
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Leaks, blocked drains, taps, pipes and bathroom fittings.",
    icon: "plumbing",
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Wiring, sockets, lighting and safety inspections.",
    icon: "electrical",
  },
  {
    id: "cleaning",
    name: "Cleaning",
    description: "Deep cleans, move-out cleaning and regular upkeep.",
    icon: "cleaning",
  },
  {
    id: "ac",
    name: "AC & Appliance Repair",
    description: "Servicing and repair for cooling units and home appliances.",
    icon: "ac",
  },
  {
    id: "painting",
    name: "Painting",
    description: "Interior and exterior painting, touch-ups and finishes.",
    icon: "painting",
  },
  {
    id: "carpentry",
    name: "Carpentry",
    description: "Doors, cabinets, shelving and custom woodwork.",
    icon: "carpentry",
  },
  {
    id: "maintenance",
    name: "Home Maintenance",
    description: "Small fixes, mounting, assembly and seasonal checks.",
    icon: "maintenance",
  },
];

export const sampleServices: FeaturedService[] = [
  {
    id: "svc-leak",
    title: "Leak detection & pipe repair",
    description: "Diagnosis and repair for dripping taps, joints and hidden leaks.",
    category: "Plumbing",
    image: "/assets/service-plumbing.jpg",
    imageAlt: "Illustration of a plumber repairing a sink pipe with a wrench",
    serviceArea: "City centre & suburbs",
  },
  {
    id: "svc-light",
    title: "Lighting & fixture installation",
    description: "Ceiling lights, switches and safe fixture replacement.",
    category: "Electrical",
    image: "/assets/service-electrical.jpg",
    imageAlt: "Illustration of an electrician installing a ceiling light",
    serviceArea: "Metro area",
  },
  {
    id: "svc-clean",
    title: "Full home deep clean",
    description: "Room-by-room cleaning with supplies included on request.",
    category: "Cleaning",
    image: "/assets/service-cleaning.jpg",
    imageAlt: "Illustration of a cleaning professional mopping a living room",
    serviceArea: "All districts",
  },
  {
    id: "svc-ac",
    title: "AC service & tune-up",
    description: "Filter cleaning, gas check and performance inspection.",
    category: "AC & Appliance Repair",
    image: "/assets/service-ac.jpg",
    imageAlt: "Illustration of a technician servicing a wall-mounted air conditioner",
    serviceArea: "Within 20 km",
  },
];

export const sampleTechnicians: Technician[] = [
  {
    id: "tech-1",
    name: "Technician profile",
    headline: "Licensed plumber",
    skills: ["Pipe repair", "Bathroom fitting", "Drainage"],
    yearsOfExperience: 8,
    serviceArea: "North district",
    availability: "available",
  },
  {
    id: "tech-2",
    name: "Technician profile",
    headline: "Certified electrician",
    skills: ["Wiring", "Lighting", "Safety checks"],
    yearsOfExperience: 12,
    serviceArea: "City centre",
    availability: "limited",
  },
  {
    id: "tech-3",
    name: "Technician profile",
    headline: "Carpenter & fitter",
    skills: ["Cabinets", "Doors", "Shelving"],
    yearsOfExperience: 6,
    serviceArea: "East & south suburbs",
    availability: "available",
  },
  {
    id: "tech-4",
    name: "Technician profile",
    headline: "Appliance specialist",
    skills: ["AC service", "Washer repair", "Diagnostics"],
    yearsOfExperience: 9,
    serviceArea: "Within 20 km",
    availability: "unavailable",
  },
];