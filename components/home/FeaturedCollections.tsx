"use client";

import { Property } from "@/lib/properties";
import { FeaturedPropertyCard } from "../ui/PropertyCard";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/TranslationContext";

interface FeaturedCollectionsProps {
  properties: Property[];
}

export default function FeaturedCollections({ properties }: FeaturedCollectionsProps) {
  const { t } = useTranslation();

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">
            {t('featured.title')}
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            {t('featured.subtitle')}
          </p>
        </div>
        <Link
          href="#"
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
        >
          {t('featured.view_all')} <span className="material-icons text-sm">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {properties.map((property) => (
          <FeaturedPropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
