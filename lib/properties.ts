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
  imageUrl: string;
  badge?: "Exclusive" | "New Arrival" | "FOR SALE" | "FOR RENT";
  type: "sale" | "rent";
  period?: "/mo";
  category: "featured" | "new_in_market";
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
    imageUrl: row.image_url,
    badge: row.badge ?? undefined,
    type: row.type,
    period: row.period ?? undefined,
    category: row.category,
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
    .eq("category", "featured")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }

  return (data ?? []).map(mapRow);
}
