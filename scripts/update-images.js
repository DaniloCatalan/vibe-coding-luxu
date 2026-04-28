const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ribyjdpwthkdulcxfxcw.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYnlqZHB3dGhrZHVsY3hmeGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNDE1NjIsImV4cCI6MjA4OTYxNzU2Mn0.mEEPQyhFrwWmqFgNbW0M2Wb7YgUNMeM5vD_Qzi4J_0I";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateImages() {
  const { data: properties, error: fetchError } = await supabase.from("properties").select("id, slug");
  
  if (fetchError) {
    console.error("Error fetching properties:", fetchError);
    return;
  }

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    const images = [
      `https://picsum.photos/seed/${prop.slug}-1/800/600`,
      `https://picsum.photos/seed/${prop.slug}-2/800/600`,
      `https://picsum.photos/seed/${prop.slug}-3/800/600`
    ];

    const { error: updateError } = await supabase
      .from("properties")
      .update({ images })
      .eq("id", prop.id);

    if (updateError) {
      console.error(`Error updating property ${prop.slug}:`, updateError);
    } else {
      console.log(`Updated images for property ${prop.slug}`);
    }
  }
  
  console.log("Finished updating images.");
}

updateImages();
