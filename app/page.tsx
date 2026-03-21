import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import NewInMarketSection from "@/components/home/NewInMarketSection";
import {
  getNewInMarketProperties,
  getFeaturedProperties,
} from "@/lib/properties";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const [{ properties, totalPages }, featuredProperties] = await Promise.all([
    getNewInMarketProperties(currentPage),
    getFeaturedProperties(),
  ]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <HeroSection />
        <FeaturedCollections properties={featuredProperties} />
        <NewInMarketSection
          properties={properties}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </main>
    </>
  );
}
