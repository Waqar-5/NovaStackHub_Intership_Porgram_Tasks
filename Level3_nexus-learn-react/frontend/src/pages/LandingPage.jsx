import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { TrustedBySection } from "@/components/landing/trusted-by-section";
import { PopularCoursesSection } from "@/components/landing/popular-courses-section";
import { TeacherShowcaseSection } from "@/components/landing/teacher-showcase-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <TrustedBySection />
      <PopularCoursesSection />
      <TeacherShowcaseSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <FinalCtaSection />
    </main>
  );
}
