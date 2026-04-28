"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchFiltersModal({ isOpen, onClose }: SearchFiltersModalProps) {
  const router = useRouter();

  const [location, setLocation] = useState("San Francisco, CA");
  const [minPrice, setMinPrice] = useState("1,200,000");
  const [maxPrice, setMaxPrice] = useState("4,500,000");
  const [propertyType, setPropertyType] = useState("Any Type");
  const [beds, setBeds] = useState(3);
  const [baths, setBaths] = useState(2);
  const [amenities, setAmenities] = useState<string[]>(["Swimming Pool", "High-speed Wifi"]);

  if (!isOpen) return null;

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice.replace(/,/g, ""));
    if (maxPrice) params.set("maxPrice", maxPrice.replace(/,/g, ""));
    if (propertyType && propertyType !== "Any Type") params.set("propertyType", propertyType);
    params.set("beds", beds.toString());
    params.set("baths", baths.toString());
    if (amenities.length > 0) params.set("amenities", amenities.join(","));

    router.push(`/search?${params.toString()}`);
    onClose();
  };

  const handleClear = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setPropertyType("Any Type");
    setBeds(1);
    setBaths(1);
    setAmenities([]);
  };

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Main Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <main className="pointer-events-auto relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <header className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-30">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Filters</h1>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
            >
              <span className="material-icons">close</span>
            </button>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
            {/* Section 1: Location */}
            <section>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Location</label>
              <div className="relative group">
                <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque transition-colors">location_on</span>
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-nordic-light dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-mosque focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm" 
                  placeholder="City, neighborhood, or address" 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </section>

            {/* Section 2: Price Range */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price Range</label>
                <span className="text-sm font-medium text-mosque">${minPrice} – ${maxPrice}</span>
              </div>
              
              <div className="relative h-12 flex items-center mb-6 px-2">
                {/* Custom Fake Slider Visual */}
                <div className="absolute w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-mosque w-1/3 ml-[20%]"></div>
                </div>
                {/* Handles (Visual only for mock) */}
                <div className="absolute left-[20%] w-6 h-6 bg-white border-2 border-mosque rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform -ml-3 z-10"></div>
                <div className="absolute left-[53%] w-6 h-6 bg-white border-2 border-mosque rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform -ml-3 z-10"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-nordic-light dark:bg-gray-800 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                  <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Min Price</label>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-1">$</span>
                    <input 
                      className="w-full bg-transparent border-0 p-0 text-gray-900 dark:text-white font-medium focus:ring-0 text-sm" 
                      type="text" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="bg-nordic-light dark:bg-gray-800 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                  <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Max Price</label>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-1">$</span>
                    <input 
                      className="w-full bg-transparent border-0 p-0 text-gray-900 dark:text-white font-medium focus:ring-0 text-sm" 
                      type="text" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Property Details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Property Type */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property Type</label>
                <div className="relative">
                  <select 
                    className="w-full bg-nordic-light dark:bg-gray-800 border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-mosque cursor-pointer"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option>Any Type</option>
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Condo</option>
                    <option>Townhouse</option>
                    <option>Villa</option>
                    <option>Penthouse</option>
                  </select>
                  <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Rooms */}
              <div className="space-y-4">
                {/* Beds */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Bedrooms</span>
                  <div className="flex items-center space-x-3 bg-nordic-light dark:bg-gray-800 rounded-full p-1">
                    <button 
                      onClick={() => setBeds(Math.max(1, beds - 1))}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-50 transition-colors"
                    >
                      <span className="material-icons text-base">remove</span>
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{beds}+</span>
                    <button 
                      onClick={() => setBeds(beds + 1)}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                    >
                      <span className="material-icons text-base">add</span>
                    </button>
                  </div>
                </div>

                {/* Baths */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Bathrooms</span>
                  <div className="flex items-center space-x-3 bg-nordic-light dark:bg-gray-800 rounded-full p-1">
                    <button 
                      onClick={() => setBaths(Math.max(1, baths - 1))}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque transition-colors"
                    >
                      <span className="material-icons text-base">remove</span>
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{baths}+</span>
                    <button 
                      onClick={() => setBaths(baths + 1)}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                    >
                      <span className="material-icons text-base">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Amenities */}
            <section>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Amenities & Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: "Swimming Pool", icon: "pool" },
                  { name: "Gym", icon: "fitness_center" },
                  { name: "Parking", icon: "local_parking" },
                  { name: "Air Conditioning", icon: "ac_unit" },
                  { name: "High-speed Wifi", icon: "wifi" },
                  { name: "Patio / Terrace", icon: "deck" },
                ].map((amenity) => {
                  const isActive = amenities.includes(amenity.name);
                  return (
                    <label key={amenity.name} className="cursor-pointer group relative">
                      <input 
                        className="peer sr-only" 
                        type="checkbox" 
                        checked={isActive}
                        onChange={() => toggleAmenity(amenity.name)}
                      />
                      <div className={`h-full px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                        isActive 
                          ? 'border-mosque bg-mosque/5 dark:bg-mosque/20 text-mosque font-medium hover:bg-mosque/10' 
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}>
                        <span className={`material-icons text-lg ${isActive ? '' : 'text-gray-400 group-hover:text-gray-500'}`}>
                          {amenity.icon}
                        </span>
                        {amenity.name}
                      </div>
                      {isActive && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full opacity-100 transition-opacity"></div>
                      )}
                    </label>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
            <button 
              onClick={handleClear}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors underline decoration-gray-300 underline-offset-4"
            >
              Clear all filters
            </button>
            <button 
              onClick={handleSearch}
              className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 transform active:scale-95"
            >
              Search Homes
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </footer>
        </main>
      </div>
    </>
  );
}
