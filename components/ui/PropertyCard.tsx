import Image from "next/image";
import { Property } from "@/lib/properties";

export function FeaturedPropertyCard({ property }: { property: Property }) {
  return (
    <div className="group relative rounded-xl overflow-hidden shadow-soft bg-white cursor-pointer">
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {property.badge && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-nordic-dark">
            {property.badge}
          </div>
        )}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-nordic-dark hover:bg-mosque hover:text-white transition-all">
          <span className="material-icons text-xl">favorite_border</span>
        </button>
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
      </div>
      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-medium text-nordic-dark group-hover:text-mosque transition-colors">
              {property.title}
            </h3>
            <p className="text-nordic-muted text-sm flex items-center gap-1 mt-1">
              <span className="material-icons text-sm">place</span> {property.location}
            </p>
          </div>
          <span className="text-xl font-semibold text-mosque">
            {property.price}{property.period}
          </span>
        </div>
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic-dark/5">
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg">king_bed</span> {property.beds} Beds
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg">bathtub</span> {property.baths} Baths
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg">square_foot</span> {property.sqm.toLocaleString()} m²
          </div>
        </div>
      </div>
    </div>
  );
}

export function StandardPropertyCard({ property, hiddenClass = "" }: { property: Property; hiddenClass?: string }) {
  return (
    <article
      className={`bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col ${hiddenClass}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-mosque hover:text-white transition-colors text-nordic-dark">
          <span className="material-icons text-lg">favorite_border</span>
        </button>
        {property.badge && (
          <div
            className={`absolute bottom-3 left-3 text-white text-xs font-bold px-2 py-1 rounded ${
              property.badge === "FOR SALE" ? "bg-nordic-dark/90" : "bg-mosque/90"
            }`}
          >
            {property.badge}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-nordic-dark">
            {property.price}
            {property.period && (
              <span className="text-sm font-normal text-nordic-muted">{property.period}</span>
            )}
          </h3>
        </div>
        <h4 className="text-nordic-dark font-medium truncate mb-1">
          {property.title}
        </h4>
        <p className="text-nordic-muted text-xs mb-4">{property.location}</p>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">king_bed</span> {property.beds}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">bathtub</span> {property.baths}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">square_foot</span> {property.sqm.toLocaleString()}m²
          </div>
        </div>
      </div>
    </article>
  );
}
