"use client";
import { useAuth } from "./auth/context/AuthContext";
import AuthModal from "./auth/components/AuthModal";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import FeaturesGrid from "./components/FeaturesGrid";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import EnhancedFooter from "./components/EnhancedFooter";

function HomeContent() {
  const { isModalOpen, modalMode, closeModal } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Features Grid Section */}
      <FeaturesGrid />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />

      {/* Enhanced Footer */}
      <EnhancedFooter />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialMode={modalMode}
      />
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
