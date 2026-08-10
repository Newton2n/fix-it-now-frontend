/**
 * Data contracts for the FixItNow homepage.
 * Every section accepts data through props so real platform data can be
 * wired in later. Sample props live in `sample-data.ts` and are clearly
 * marked as placeholders — nothing here should be presented as real metrics.
 */

export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  icon: "plumbing" | "electrical" | "cleaning" | "ac" | "painting" | "carpentry" | "maintenance";
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

export type Review = {
  id: string;
  author: string;
  avatarUrl?: string;
  rating: number;
  body: string;
  service: string;
};

export type PlatformStats = {
  customers?: number;
  technicians?: number;
  bookings?: number;
  services?: number;
};