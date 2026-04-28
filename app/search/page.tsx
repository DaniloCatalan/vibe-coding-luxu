import { searchProperties, SearchFilters } from "@/lib/properties";
import { StandardPropertyCard } from "@/components/ui/PropertyCard";
import Link from "next/link";
import { getLocale, getDictionary } from "@/lib/i18n/server";

const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path;
};

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = (key: string) => getNestedValue(dict, key);

  const filters: SearchFilters = {
    location: typeof params.location === "string" ? params.location : undefined,
    minPrice: params.minPrice ? parseInt(params.minPrice as string, 10) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice as string, 10) : undefined,
    propertyType: typeof params.propertyType === "string" ? params.propertyType : undefined,
    beds: params.beds ? parseInt(params.beds as string, 10) : undefined,
    baths: params.baths ? parseInt(params.baths as string, 10) : undefined,
    amenities: typeof params.amenities === "string" ? params.amenities.split(",") : undefined,
  };

  const properties = await searchProperties(filters);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center text-sm text-nordic-muted mb-4">
          <Link href="/" className="hover:text-mosque transition-colors">{t('search.home')}</Link>
          <span className="mx-2 material-icons text-[14px]">chevron_right</span>
          <span className="text-nordic-dark font-medium">{t('search.search_results')}</span>
        </div>
        
        <h1 className="text-3xl font-light text-nordic-dark">
          {properties.length} {properties.length === 1 ? t('search.property_found') : t('search.properties_found')}
        </h1>
        <p className="text-nordic-muted mt-2">
          {t('search.based_on_filters')}
        </p>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <StandardPropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-nordic-dark/5">
          <span className="material-icons text-4xl text-nordic-muted/50 mb-4">search_off</span>
          <h3 className="text-xl font-medium text-nordic-dark mb-2">{t('search.no_properties_found')}</h3>
          <p className="text-nordic-muted max-w-md mx-auto">
            {t('search.try_adjusting_filters')}
          </p>
          <Link 
            href="/"
            className="inline-block mt-6 px-6 py-2.5 bg-mosque text-white font-medium rounded-lg hover:bg-mosque/90 transition-colors"
          >
            {t('search.back_to_home')}
          </Link>
        </div>
      )}
    </main>
  );
}
