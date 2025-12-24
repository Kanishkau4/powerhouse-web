import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import AIDemo from "@/components/landing/AIDemo";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main>
      {/* 
        To add your own phone screenshot:
        1. Place your image in the /public folder (e.g., /public/app-screenshot.png)
        2. Pass the path to the Hero component like this:
        
        <Hero phoneImage="/app-screenshot.png" />
        
        For now, it shows a placeholder.
      */}
      <Hero phoneImage="/assets/app-screenshot.png" />

      <Features />
      <AIDemo />
      <Stats />
      <Testimonials />
      <Footer />
    </main>
  );
}