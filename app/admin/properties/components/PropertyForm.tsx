"use client";

import { useState, useRef, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { createProperty, updateProperty, uploadPropertyImage } from "../actions";

const AMENITIES_LIST = [
  "Swimming Pool",
  "Garden",
  "Air Conditioning",
  "Smart Home",
  "Gym",
  "Security System",
  "Elevator",
  "Parking Garage",
  "Terrace",
  "Sea View",
];

interface PropertyData {
  id?: string;
  title?: string;
  price?: string;
  raw_price?: number;
  status?: string;
  property_type?: string;
  is_featured?: boolean;
  description?: string;
  location?: string;
  sqm?: number;
  year_built?: number;
  beds?: number;
  baths?: number;
  parking?: number;
  amenities?: string[];
  images?: string[];
  lat?: number;
  lng?: number;
}

export default function PropertyForm({ property }: { property?: PropertyData }) {
  const isEdit = Boolean(property?.id);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(property?.title ?? "");
  const [rawPrice, setRawPrice] = useState(property?.raw_price ?? 0);
  const [status, setStatus] = useState(property?.status ?? "for-sale");
  const [propertyType, setPropertyType] = useState(property?.property_type ?? "apartment");
  const [isFeatured, setIsFeatured] = useState(property?.is_featured ?? false);
  const [description, setDescription] = useState(property?.description ?? "");
  const [location, setLocation] = useState(property?.location ?? "");
  const [sqm, setSqm] = useState(property?.sqm ?? 0);
  const [yearBuilt, setYearBuilt] = useState(property?.year_built ?? 0);
  const [beds, setBeds] = useState(property?.beds ?? 1);
  const [baths, setBaths] = useState(property?.baths ?? 1);
  const [parking, setParking] = useState(property?.parking ?? 0);
  const [lat, setLat] = useState(property?.lat ?? 0);
  const [lng, setLng] = useState(property?.lng ?? 0);
  const [amenities, setAmenities] = useState<string[]>(property?.amenities ?? []);
  const [images, setImages] = useState<string[]>(property?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleAmenity = (a: string) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadPropertyImage(fd);
      if (result.success && result.url) newUrls.push(result.url);
    }
    setImages((prev) => [...prev, ...newUrls]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.append("title", title);
    fd.append("raw_price", String(rawPrice));
    fd.append("status", status);
    fd.append("property_type", propertyType);
    fd.append("is_featured", String(isFeatured));
    fd.append("description", description);
    fd.append("location", location);
    fd.append("sqm", String(sqm));
    fd.append("year_built", String(yearBuilt));
    fd.append("beds", String(beds));
    fd.append("baths", String(baths));
    fd.append("parking", String(parking));
    if (lat) fd.append("lat", String(lat));
    if (lng) fd.append("lng", String(lng));
    amenities.forEach((a) => fd.append("amenities", a));
    images.forEach((img) => fd.append("images", img));

    startTransition(async () => {
      try {
        if (isEdit && property?.id) {
          await updateProperty(property.id, fd);
        } else {
          await createProperty(fd);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        if (!msg.includes("NEXT_REDIRECT")) setError(msg);
      }
    });
  };

  return (
    <div className="bg-clear-day text-nordic min-h-screen selection:bg-hint-green selection:text-nordic">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div className="space-y-4">
            <nav aria-label="Breadcrumb" className="flex">
              <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium font-sf-pro">
                <li>
                  <Link href="/admin/dashboard?tab=properties" className="hover:text-mosque transition-colors">
                    Properties
                  </Link>
                </li>
                <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
                <li aria-current="page" className="text-nordic">
                  {isEdit ? "Edit Property" : "Add New"}
                </li>
              </ol>
            </nav>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-nordic tracking-tight mb-2">
                {isEdit ? "Edit Property" : "Add New Property"}
              </h1>
              <p className="text-base text-gray-500 max-w-2xl font-normal font-sf-pro">
                Fill in the details below to {isEdit ? "update" : "create"} a listing. Fields marked with * are mandatory.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard?tab=properties"
              className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-nordic hover:bg-gray-50 transition-colors font-medium font-sf-pro text-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              form="property-form"
              disabled={isPending || uploading}
              className="px-5 py-2.5 rounded-lg bg-mosque hover:bg-nordic text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-sf-pro text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-icons text-sm">save</span>
              {isPending ? "Saving…" : isEdit ? "Update Property" : "Save Property"}
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-sf-pro">
            {error}
          </div>
        )}

        <form id="property-form" onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* ── Left Column ── */}
          <div className="xl:col-span-8 space-y-8">

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">info</span>
                </div>
                <h2 className="text-xl font-bold text-nordic">Basic Information</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="title">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Modern Penthouse with Ocean View"
                    className="w-full text-base px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="price">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sf-pro text-sm">$</span>
                      <input
                        id="price"
                        type="number"
                        required
                        min={0}
                        value={rawPrice || ""}
                        onChange={(e) => setRawPrice(Number(e.target.value))}
                        placeholder="0"
                        className="w-full pl-7 pr-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium font-sf-pro outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer outline-none"
                    >
                      <option value="for-sale">For Sale</option>
                      <option value="for-rent">For Rent</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="property_type">
                      Property Type
                    </label>
                    <select
                      id="property_type"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer outline-none"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="townhouse">Townhouse</option>
                    </select>
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFeatured((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFeatured ? "bg-mosque" : "bg-gray-200"}`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${isFeatured ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <label className="text-sm font-medium text-nordic font-sf-pro cursor-pointer" onClick={() => setIsFeatured((v) => !v)}>
                    Featured Property
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">description</span>
                </div>
                <h2 className="text-xl font-bold text-nordic">Description</h2>
              </div>
              <div className="p-8">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the property features, neighborhood, and unique selling points..."
                  className="w-full px-4 py-3 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro leading-relaxed resize-y min-h-[200px] outline-none"
                  maxLength={2000}
                />
                <div className="mt-2 text-right text-xs text-gray-400 font-sf-pro">
                  {description.length} / 2000 characters
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 flex justify-between items-center bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                    <span className="material-icons text-lg">image</span>
                  </div>
                  <h2 className="text-xl font-bold text-nordic">Gallery</h2>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded font-sf-pro">JPG, PNG, WEBP</span>
              </div>
              <div className="p-8">
                {/* Drop zone */}
                <label className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-hint-green/10 hover:border-mosque/40 transition-colors cursor-pointer group flex flex-col items-center justify-center space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mosque group-hover:scale-110 transition-transform duration-300">
                    <span className="material-icons text-2xl">{uploading ? "hourglass_empty" : "cloud_upload"}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-nordic font-sf-pro">
                      {uploading ? "Uploading…" : "Click or drag images here"}
                    </p>
                    <p className="text-xs text-gray-400 font-sf-pro">Max file size 5MB per image</p>
                  </div>
                </label>

                {/* Image grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {images.map((url, idx) => (
                      <div key={`${url}-${idx}`} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm">
                        <Image
                          src={url}
                          alt={`Property image ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-nordic/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                          >
                            <span className="material-icons text-sm">delete</span>
                          </button>
                        </div>
                        {idx === 0 && (
                          <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="xl:col-span-4 space-y-8">

            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">place</span>
                </div>
                <h2 className="text-lg font-bold text-nordic">Location</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="location">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="location"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Street Address, City, Zip"
                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="lat">
                      Latitude
                    </label>
                    <input
                      id="lat"
                      type="number"
                      step="any"
                      value={lat || ""}
                      onChange={(e) => setLat(Number(e.target.value))}
                      placeholder="e.g. 40.7128"
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="lng">
                      Longitude
                    </label>
                    <input
                      id="lng"
                      type="number"
                      step="any"
                      value={lng || ""}
                      onChange={(e) => setLng(Number(e.target.value))}
                      placeholder="e.g. -74.0060"
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">straighten</span>
                </div>
                <h2 className="text-lg font-bold text-nordic">Details</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="sqm">
                      Area (m²)
                    </label>
                    <input
                      id="sqm"
                      type="number"
                      min={0}
                      value={sqm || ""}
                      onChange={(e) => setSqm(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="year_built">
                      Year Built
                    </label>
                    <input
                      id="year_built"
                      type="number"
                      min={1800}
                      max={new Date().getFullYear()}
                      value={yearBuilt || ""}
                      onChange={(e) => setYearBuilt(Number(e.target.value))}
                      placeholder="YYYY"
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro text-sm outline-none"
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div className="space-y-4">
                  {/* Bedrooms */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                      <span className="material-icons text-gray-400 text-sm">bed</span> Bedrooms
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                      <button type="button" onClick={() => setBeds((v) => Math.max(0, v - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                      <span className="w-10 text-center text-nordic text-sm font-medium font-sf-pro">{beds}</span>
                      <button type="button" onClick={() => setBeds((v) => v + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                    </div>
                  </div>
                  {/* Bathrooms */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                      <span className="material-icons text-gray-400 text-sm">shower</span> Bathrooms
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                      <button type="button" onClick={() => setBaths((v) => Math.max(0, v - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                      <span className="w-10 text-center text-nordic text-sm font-medium font-sf-pro">{baths}</span>
                      <button type="button" onClick={() => setBaths((v) => v + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                    </div>
                  </div>
                  {/* Parking */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                      <span className="material-icons text-gray-400 text-sm">directions_car</span> Parking
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                      <button type="button" onClick={() => setParking((v) => Math.max(0, v - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                      <span className="w-10 text-center text-nordic text-sm font-medium font-sf-pro">{parking}</span>
                      <button type="button" onClick={() => setParking((v) => v + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Amenities */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 mb-3 font-sf-pro uppercase tracking-wider">Amenities</h3>
                  <div className="space-y-2">
                    {AMENITIES_LIST.map((a) => (
                      <label key={a} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={amenities.includes(a)}
                          onChange={() => toggleAmenity(a)}
                          className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque"
                        />
                        <span className="text-sm text-gray-700 font-sf-pro group-hover:text-nordic transition-colors">{a}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile sticky bottom bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl md:hidden z-40 flex gap-3">
            <Link href="/admin/dashboard?tab=properties" className="flex-1 py-3 rounded-lg border border-gray-300 bg-white text-nordic font-medium font-sf-pro text-center">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending || uploading}
              className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium font-sf-pro flex justify-center items-center gap-2 disabled:opacity-60"
            >
              {isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
