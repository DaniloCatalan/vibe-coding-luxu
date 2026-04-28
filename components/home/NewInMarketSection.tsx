"use client";

import { Property } from "@/lib/properties";
import { StandardPropertyCard } from "../ui/PropertyCard";
import Pagination from "./Pagination";
import { Suspense } from "react";
import { useTranslation } from "@/lib/i18n/TranslationContext";

interface NewInMarketSectionProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
}

export default function NewInMarketSection({
  properties,
  currentPage,
  totalPages,
}: NewInMarketSectionProps) {
  const { t } = useTranslation();

  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">
            {t('new_in_market.title')}
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            {t('new_in_market.subtitle')}
          </p>
        </div>
        <div className="hidden md:flex bg-white p-1 rounded-lg">
          <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">
            {t('new_in_market.all')}
          </button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">
            {t('new_in_market.buy')}
          </button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">
            {t('new_in_market.rent')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <StandardPropertyCard
            key={property.id}
            property={property}
            hiddenClass=""
          />
        ))}
      </div>

      <Suspense fallback={null}>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </section>
  );
}
