"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function createSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll();
        },
        async setAll(cookiesToSet) {
          const store = await cookieStore;
          cookiesToSet.forEach(({ name, value, options }) =>
            store.set(name, value, options)
          );
        },
      },
    }
  );
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    + "-" + Date.now();
}

function formatPrice(rawPrice: number, type: string): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rawPrice);
  return type === "rent" ? formatted : formatted;
}

export async function createProperty(formData: FormData) {
  const supabase = createSupabaseClient();

  const title = formData.get("title") as string;
  const rawPrice = Number(formData.get("raw_price") || 0);
  const status = formData.get("status") as string; // for-sale | for-rent | sold
  const propertyType = formData.get("property_type") as string;
  const isFeatured = formData.get("is_featured") === "true";
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const sqm = Number(formData.get("sqm") || 0);
  const yearBuilt = Number(formData.get("year_built") || 0);
  const beds = Number(formData.get("beds") || 0);
  const baths = Number(formData.get("baths") || 0);
  const parking = Number(formData.get("parking") || 0);
  const amenities = formData.getAll("amenities") as string[];
  const images = formData.getAll("images") as string[];

  const type = status === "for-rent" ? "rent" : "sale";
  const badge =
    status === "for-sale"
      ? "FOR SALE"
      : status === "for-rent"
      ? "FOR RENT"
      : "Sold";
  const period = type === "rent" ? "/mo" : undefined;
  const priceDisplay = formatPrice(rawPrice, type);
  const slug = generateSlug(title);

  const { error } = await supabase.from("properties").insert({
    id: crypto.randomUUID(),
    title,
    price: priceDisplay,
    raw_price: rawPrice,
    status,
    badge,
    type,
    period: period ?? null,
    property_type: propertyType,
    is_featured: isFeatured,
    description,
    location,
    sqm,
    year_built: yearBuilt || null,
    beds,
    baths,
    parking,
    amenities,
    images,
    slug,
    category: isFeatured ? "featured" : "new_in_market",
  });

  if (error) {
    console.error("Error creating property:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard?tab=properties");
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = createSupabaseClient();

  const title = formData.get("title") as string;
  const rawPrice = Number(formData.get("raw_price") || 0);
  const status = formData.get("status") as string;
  const propertyType = formData.get("property_type") as string;
  const isFeatured = formData.get("is_featured") === "true";
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const sqm = Number(formData.get("sqm") || 0);
  const yearBuilt = Number(formData.get("year_built") || 0);
  const beds = Number(formData.get("beds") || 0);
  const baths = Number(formData.get("baths") || 0);
  const parking = Number(formData.get("parking") || 0);
  const amenities = formData.getAll("amenities") as string[];
  const images = formData.getAll("images") as string[];

  const type = status === "for-rent" ? "rent" : "sale";
  const badge =
    status === "for-sale"
      ? "FOR SALE"
      : status === "for-rent"
      ? "FOR RENT"
      : "Sold";
  const period = type === "rent" ? "/mo" : undefined;
  const priceDisplay = formatPrice(rawPrice, type);

  const { error } = await supabase
    .from("properties")
    .update({
      title,
      price: priceDisplay,
      raw_price: rawPrice,
      status,
      badge,
      type,
      period: period ?? null,
      property_type: propertyType,
      is_featured: isFeatured,
      description,
      location,
      sqm,
      year_built: yearBuilt || null,
      beds,
      baths,
      parking,
      amenities,
      images,
      category: isFeatured ? "featured" : "new_in_market",
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating property:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard?tab=properties");
}

export async function deleteProperty(id: string) {
  const supabase = createSupabaseClient();

  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) {
    console.error("Error deleting property:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  return { success: true };
}

export async function uploadPropertyImage(formData: FormData) {
  const supabase = createSupabaseClient();
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { success: false, error: "No file provided" };
  }

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("property-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from("property-images")
    .getPublicUrl(fileName);

  return { success: true, url: urlData.publicUrl };
}
