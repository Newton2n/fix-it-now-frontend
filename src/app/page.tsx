import Hero from "@/components/home/hero";
import CategorySection from "@/components/home/category";
import FeaturedServices from "@/components/home/featured-section";
import TopTechnicians from "@/components/home/top-technicians";
import HowItWorks from "@/components/home/how-it-work";
import CTASection from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedServices />
      <TopTechnicians />
      <HowItWorks />
      <CTASection />
    </>
  );
}