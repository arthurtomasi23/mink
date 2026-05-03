import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { ForArtists } from "@/components/ForArtists";
import { Pricing } from "@/components/Pricing";
import { Waitlist } from "@/components/Waitlist";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ForArtists />
        <Pricing />
        <Waitlist />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
