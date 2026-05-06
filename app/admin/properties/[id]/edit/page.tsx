import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PropertyForm from "../../components/PropertyForm";

export const metadata = {
  title: "Edit Property | Estates Admin",
};

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) {
    notFound();
  }

  // Map DB row to form-friendly shape
  const formData = {
    id: property.id,
    title: property.title,
    price: property.price,
    raw_price: Number(property.raw_price ?? 0),
    status: property.status ?? (property.type === "rent" ? "for-rent" : "for-sale"),
    property_type: property.property_type ?? "apartment",
    is_featured: property.is_featured ?? false,
    description: property.description ?? "",
    location: property.location ?? "",
    sqm: Number(property.sqm ?? 0),
    year_built: Number(property.year_built ?? 0),
    beds: Number(property.beds ?? 0),
    baths: Number(property.baths ?? 0),
    parking: Number(property.parking ?? 0),
    amenities: property.amenities ?? [],
    images: property.images ?? [],
    lat: property.lat ? Number(property.lat) : undefined,
    lng: property.lng ? Number(property.lng) : undefined,
  };

  return <PropertyForm property={formData} />;
}
