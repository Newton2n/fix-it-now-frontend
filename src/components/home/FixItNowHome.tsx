import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { ServiceCategories } from "./ServiceCategories";
import { FeaturedServices } from "./FeaturedServices";
import { HowItWorks } from "./HowItWorks";
import { WhyFixItNow } from "./WhyFixItNow";
import { TechnicianSpotlight } from "./TechnicianSpotlight";
import { BookingExperience } from "./BookingExperience";
import { TrustSection } from "./TrustSection";
import { PlatformStats } from "./PlatformStats";
import { TechnicianCTA } from "./TechnicianCTA";
import { FAQSection } from "./FAQSection";
import { FinalCTA } from "./FinalCTA";
import { Footer } from "./Footer";
import type { FeaturedService, PlatformStats as Stats, Review, ServiceCategory, Technician } from "./types";

export type FixItNowHomeProps = {
  categories?: ServiceCategory[];
  services?: FeaturedService[];
  technicians?: Technician[];
  reviews?: Review[];
  stats?: Stats;
};

export function FixItNowHome({ categories, services, technicians, reviews, stats }: FixItNowHomeProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
        {/* <Navbar /> */}
        <main className="flex-1">
          <HeroSection />
          {categories ? <ServiceCategories categories={categories} /> : <ServiceCategories />}
          {services ? <FeaturedServices services={services} /> : <FeaturedServices />}
          <HowItWorks />
          <WhyFixItNow />
          {technicians ? <TechnicianSpotlight technicians={technicians} /> : <TechnicianSpotlight />}
          <BookingExperience />
          <TrustSection reviews={reviews ?? []} />
          <PlatformStats stats={stats ?? {}} />
          <TechnicianCTA />
          <FAQSection />
          <FinalCTA />
        </main>
        {/* <Footer /> */}
      </div>
    </TooltipProvider>
  );
}