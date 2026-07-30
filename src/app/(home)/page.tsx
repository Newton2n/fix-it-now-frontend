import Hero from "@/components/home/hero";
import FeaturedServices from "@/components/home/featured-section";
import TopTechnicians from "@/components/home/top-technicians";
import HowItWorks from "@/components/home/how-it-work";
import CTASection from "@/components/home/cta-section";
import CategoriesPage from "../(public)/categories/page";


export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesPage/>
      <FeaturedServices />
      <TopTechnicians />
      <HowItWorks />
      <CTASection />
    </>
  );
}
