import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import NewInMarketSection from "@/components/home/NewInMarketSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <HeroSection />
        <FeaturedCollections />
        <NewInMarketSection />
      </main>
    </>
  );
}
