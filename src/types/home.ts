export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
};

export type FeaturedService = {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  imageAlt?: string;
  rating?: { average: number; count: number };
  provider?: { name: string; avatarUrl?: string };
  serviceArea?: string;
};

export type Technician = {
  id: string;
  name: string;
  headline: string;
  avatarUrl?: string;
  skills: string[];
  yearsOfExperience: number;
  serviceArea: string;
  availability: "available" | "limited" | "unavailable";
  rating?: { average: number; count: number };
};

export type PlatformStats = {
  customers?: number;
  technicians?: number;
  bookings?: number;
  services?: number;
};
