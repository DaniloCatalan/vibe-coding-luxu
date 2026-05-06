import { supabase } from "./supabase";

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  rawPrice: number;
  beds: number;
  baths: number;
  sqm: number;
  badge?: "Exclusive" | "New Arrival" | "FOR SALE" | "FOR RENT";
  type: "sale" | "rent";
  period?: "/mo";
  category: "featured" | "new_in_market";
  isFeatured?: boolean;
  slug: string;
  images: string[];
  lat?: number;
  lng?: number;
  property_type?: string;
  amenities?: string[];
  is_active?: boolean;
}

// Map snake_case DB rows → camelCase Property
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Property {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    price: row.price,
    rawPrice: Number(row.raw_price),
    beds: Number(row.beds),
    baths: Number(row.baths),
    sqm: Number(row.sqm),
    badge: row.badge ?? undefined,
    type: row.type,
    period: row.period ?? undefined,
    category: row.category,
    isFeatured: row.is_featured ?? false,
    slug: row.slug,
    images: row.images ?? [],
    lat: row.lat ? Number(row.lat) : undefined,
    lng: row.lng ? Number(row.lng) : undefined,
    property_type: row.property_type ?? undefined,
    amenities: row.amenities ?? [],
    is_active: row.is_active ?? true,
  };
}

const ITEMS_PER_PAGE = 8;

export async function getNewInMarketProperties(page: number = 1): Promise<{
  properties: Property[];
  total: number;
  totalPages: number;
  currentPage: number;
}> {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data, error, count } = await supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("category", "new_in_market")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching new in market properties:", error);
    return { properties: [], total: 0, totalPages: 0, currentPage: page };
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return {
    properties: (data ?? []).map(mapRow),
    total,
    totalPages,
    currentPage: page,
  };
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(2);

  if (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }

  return (data ?? []).map(mapRow);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    console.error("Error fetching property by slug:", error);
    return null;
  }

  return mapRow(data);
}

export interface SearchFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  beds?: number;
  baths?: number;
  amenities?: string[];
}

export async function searchProperties(filters: SearchFilters): Promise<Property[]> {
  let query = supabase.from("properties").select("*").eq("is_active", true);

  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }
  if (filters.minPrice !== undefined) {
    query = query.gte("raw_price", filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte("raw_price", filters.maxPrice);
  }
  if (filters.propertyType && filters.propertyType !== "Any Type") {
    query = query.eq("property_type", filters.propertyType);
  }
  if (filters.beds !== undefined) {
    query = query.gte("beds", filters.beds);
  }
  if (filters.baths !== undefined) {
    query = query.gte("baths", filters.baths);
  }
  if (filters.amenities && filters.amenities.length > 0) {
    query = query.contains("amenities", filters.amenities);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching properties by search filters:", error);
    return [];
  }

  return (data ?? []).map(mapRow);
}
