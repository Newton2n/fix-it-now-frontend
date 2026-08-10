import { TooltipProvider } from "@/components/ui/tooltip";
import { HeroSection } from "./HeroSection";
import { ServiceCategories } from "./ServiceCategories";
import { FeaturedServices } from "./FeaturedServices";
import { HowItWorks } from "./HowItWorks";
import { WhyFixItNow } from "./WhyFixItNow";
import { TechnicianSpotlight } from "./TechnicianSpotlight";
import { BookingExperience } from "./BookingExperience";
import { TrustSection } from "./TrustSection";
import { TechnicianCTA } from "./TechnicianCTA";
import { FAQSection } from "./FAQSection";
import { FinalCTA } from "./FinalCTA";

import { ApplicationStatsSection } from "./application-stats-section";
import { FeaturedService, ServiceCategory, Technician } from "@/types/home";
import { Review } from "@/types/review";
import { AppStats } from "@/types/stats";

export type FixItNowHomeProps = {
  categories?: ServiceCategory[];
  services?: FeaturedService[];
  technicians?: Technician[];
  reviews?: Review[];
  stats?: AppStats;
};

export function FixItNowHome({
  categories,
  services,
  technicians,
}: FixItNowHomeProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
        <main className="flex-1">
          <HeroSection />
          <ApplicationStatsSection />
          {categories ? <ServiceCategories /> : <ServiceCategories />}
          {services ? <FeaturedServices /> : <FeaturedServices />}
          <HowItWorks />
          <WhyFixItNow />
          {technicians ? <TechnicianSpotlight /> : <TechnicianSpotlight />}
          <BookingExperience />
          <TrustSection />
          <TechnicianCTA />
          <FAQSection />
          <FinalCTA />
        </main>
      </div>
    </TooltipProvider>
  );
}
