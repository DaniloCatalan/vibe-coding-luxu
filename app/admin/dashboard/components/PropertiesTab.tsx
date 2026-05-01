import { supabase } from "@/lib/supabase";
import Image from "next/image";

import Link from "next/link";

export default async function PropertiesTab({ page = 1 }: { page?: number }) {
  const ITEMS_PER_PAGE = 10;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data: properties, count, error } = await supabase
    .from("properties")
    .select("*", { count: 'exact' })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching properties:", error);
    return <div className="p-4 text-red-500">Error loading properties</div>;
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Listings</p>
            <p className="text-2xl font-bold text-nordic dark:text-white mt-1">{properties?.length || 0}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-icons">apartment</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Properties</p>
            <p className="text-2xl font-bold text-nordic dark:text-white mt-1">{properties?.length || 0}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-hint-green flex items-center justify-center text-primary">
            <span className="material-icons">check_circle</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Sale</p>
            <p className="text-2xl font-bold text-nordic dark:text-white mt-1">0</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <span className="material-icons">pending</span>
          </div>
        </div>
      </div>

      {/* Property List Container */}
      <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-200 dark:border-primary/20 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 dark:bg-primary/5 border-b border-gray-100 dark:border-primary/10 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div className="col-span-6">Property Details</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* List Items */}
        {properties?.map((property) => (
          <div key={property.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 dark:border-primary/10 hover:bg-background-light dark:hover:bg-primary/5 transition-colors items-center">
            {/* Property Details */}
            <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
              <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                <Image 
                  alt={property.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400'} 
                  fill
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-nordic dark:text-white group-hover:text-primary transition-colors cursor-pointer">{property.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{property.location}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bed</span> {property.beds} Beds</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bathtub</span> {property.baths} Baths</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{property.sqm} sqm</span>
                </div>
              </div>
            </div>
            
            {/* Price */}
            <div className="col-span-6 md:col-span-2">
              <div className="text-base font-semibold text-nordic dark:text-gray-200">{property.price}</div>
              <div className="text-xs text-gray-400">{property.type === 'rent' ? 'For Rent' : 'For Sale'}</div>
            </div>
            
            {/* Status */}
            <div className="col-span-6 md:col-span-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-hint-green text-primary border border-primary/10">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span>
                Active
              </span>
            </div>
            
            {/* Actions */}
            <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
              <button className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-hint-green/30 transition-all tooltip-trigger" title="Edit Property">
                <span className="material-icons text-xl">edit</span>
              </button>
              <button className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all tooltip-trigger" title="Delete Property">
                <span className="material-icons text-xl">delete_outline</span>
              </button>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-primary/5">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-nordic dark:text-white">{count === 0 ? 0 : from + 1}</span> to <span className="font-medium text-nordic dark:text-white">{Math.min(to + 1, count || 0)}</span> of <span className="font-medium text-nordic dark:text-white">{count || 0}</span> results
          </div>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link 
                href={`/admin/dashboard?tab=properties&page=${page - 1}`}
                className="px-3 py-1 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20"
              >
                Previous
              </Link>
            ) : (
              <button disabled className="px-3 py-1 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-400 dark:text-gray-600 opacity-50 cursor-not-allowed">Previous</button>
            )}
            
            {page < totalPages ? (
              <Link 
                href={`/admin/dashboard?tab=properties&page=${page + 1}`}
                className="px-3 py-1 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20"
              >
                Next
              </Link>
            ) : (
              <button disabled className="px-3 py-1 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-400 dark:text-gray-600 opacity-50 cursor-not-allowed">Next</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
