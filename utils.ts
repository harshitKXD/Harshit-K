import HeroSection from "@/sections/HeroSection";
import MarqueeSection from "@/sections/MarqueeSection";
import FeaturedSection from "@/sections/FeaturedSection";
import PhilosophySection from "@/sections/PhilosophySection";
import FooterSection from "@/sections/FooterSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <MarqueeSection />
      <FeaturedSection />
      <PhilosophySection />
      <FooterSection />
    </main>
  );
}
