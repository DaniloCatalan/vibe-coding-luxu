const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ribyjdpwthkdulcxfxcw.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYnlqZHB3dGhrZHVsY3hmeGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNDE1NjIsImV4cCI6MjA4OTYxNzU2Mn0.mEEPQyhFrwWmqFgNbW0M2Wb7YgUNMeM5vD_Qzi4J_0I";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const generateSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const allAmenities = ["Swimming Pool", "Gym", "Parking", "Air Conditioning", "High-speed Wifi", "Patio / Terrace"];
const propertyTypes = ["House", "Apartment", "Condo", "Townhouse", "Villa", "Penthouse"];

const getRandomAmenities = () => {
  const count = Math.floor(Math.random() * 4) + 2; // 2 to 5 amenities
  const shuffled = allAmenities.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const properties = [
  {
    title: "Modern Glass Villa with Ocean Views",
    location: "Malibu, CA",
    price: "$4,200,000",
    raw_price: 4200000,
    beds: 5,
    baths: 4.5,
    sqm: 450,
    type: "sale",
    category: "new_in_market",
    is_featured: true,
    lat: 34.0259,
    lng: -118.7798,
    property_type: "Villa",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687931-cece5ce21448?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
    ]
  },
  {
    title: "Penthouse Overlooking Central Park",
    location: "New York, NY",
    price: "$8,500,000",
    raw_price: 8500000,
    beds: 3,
    baths: 3.5,
    sqm: 320,
    type: "sale",
    category: "featured",
    is_featured: true,
    lat: 40.7812,
    lng: -73.9665,
    property_type: "Penthouse",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
    ]
  },
  {
    title: "Architectural Masterpiece in the Hills",
    location: "Hollywood Hills, CA",
    price: "$3,750,000",
    raw_price: 3750000,
    beds: 4,
    baths: 4,
    sqm: 380,
    type: "sale",
    category: "new_in_market",
    is_featured: false,
    lat: 34.1102,
    lng: -118.3533,
    property_type: "House",
    images: [
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18efc2291?w=800&q=80"
    ]
  },
  {
    title: "Luxury Condo with Skyline Views",
    location: "Miami, FL",
    price: "$1,850,000",
    raw_price: 1850000,
    beds: 2,
    baths: 2.5,
    sqm: 190,
    type: "sale",
    category: "new_in_market",
    is_featured: true,
    lat: 25.7617,
    lng: -80.1918,
    property_type: "Condo",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80"
    ]
  },
  {
    title: "Lakefront Smart Home",
    location: "Austin, TX",
    price: "$2,300,000",
    raw_price: 2300000,
    beds: 4,
    baths: 3,
    sqm: 310,
    type: "sale",
    category: "new_in_market",
    is_featured: false,
    lat: 30.2672,
    lng: -97.7431,
    property_type: "House",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687931-cece5ce21448?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
    ]
  },
  {
    title: "Historic Townhouse Remodel",
    location: "Boston, MA",
    price: "$1,950,000",
    raw_price: 1950000,
    beds: 3,
    baths: 2.5,
    sqm: 210,
    type: "sale",
    category: "featured",
    is_featured: true,
    lat: 42.3601,
    lng: -71.0589,
    property_type: "Townhouse",
    images: [
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?w=800&q=80"
    ]
  },
  {
    title: "Chic Loft in Downtown",
    location: "Chicago, IL",
    price: "$1,100,000",
    raw_price: 1100000,
    beds: 2,
    baths: 2,
    sqm: 160,
    type: "sale",
    category: "new_in_market",
    is_featured: false,
    lat: 41.8781,
    lng: -87.6298,
    property_type: "Apartment",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
    ]
  },
  {
    title: "Desert Oasis Estate",
    location: "Scottsdale, AZ",
    price: "$2,900,000",
    raw_price: 2900000,
    beds: 5,
    baths: 4.5,
    sqm: 420,
    type: "sale",
    category: "featured",
    is_featured: true,
    lat: 33.4942,
    lng: -111.9261,
    property_type: "House",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18efc2291?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687931-cece5ce21448?w=800&q=80"
    ]
  },
  {
    title: "Oceanfront Condo with Wrap-around Balcony",
    location: "San Diego, CA",
    price: "$2,100,000",
    raw_price: 2100000,
    beds: 3,
    baths: 2,
    sqm: 180,
    type: "sale",
    category: "new_in_market",
    is_featured: false,
    lat: 32.7157,
    lng: -117.1611,
    property_type: "Condo",
    images: [
      "https://images.unsplash.com/photo-1512918361407-6b4df9d36357?w=800&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
    ]
  },
  {
    title: "Mountain Retreat Chalet",
    location: "Aspen, CO",
    price: "$5,400,000",
    raw_price: 5400000,
    beds: 4,
    baths: 4.5,
    sqm: 360,
    type: "sale",
    category: "featured",
    is_featured: true,
    lat: 39.1911,
    lng: -106.8175,
    property_type: "Villa",
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800&q=80"
    ]
  },
  {
    title: "Elegant Georgian Manor",
    location: "Atlanta, GA",
    price: "$3,100,000",
    raw_price: 3100000,
    beds: 6,
    baths: 5.5,
    sqm: 550,
    type: "sale",
    category: "new_in_market",
    is_featured: false,
    lat: 33.7490,
    lng: -84.3880,
    property_type: "House",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687931-cece5ce21448?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
    ]
  },
  {
    title: "Modernist Home in the Woods",
    location: "Portland, OR",
    price: "$1,650,000",
    raw_price: 1650000,
    beds: 3,
    baths: 3,
    sqm: 240,
    type: "sale",
    category: "new_in_market",
    is_featured: false,
    lat: 45.5152,
    lng: -122.6784,
    property_type: "House",
    images: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18efc2291?w=800&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800&q=80"
    ]
  },
  {
    title: "Beachfront Villa with Infinity Pool",
    location: "Honolulu, HI",
    price: "$7,200,000",
    raw_price: 7200000,
    beds: 5,
    baths: 5,
    sqm: 480,
    type: "sale",
    category: "featured",
    is_featured: true,
    lat: 21.3069,
    lng: -157.8583,
    property_type: "Villa",
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687931-cece5ce21448?w=800&q=80"
    ]
  },
  {
    title: "Contemporary Apartment",
    location: "Seattle, WA",
    price: "$950,000",
    raw_price: 950000,
    beds: 2,
    baths: 1.5,
    sqm: 130,
    type: "sale",
    category: "new_in_market",
    is_featured: false,
    lat: 47.6062,
    lng: -122.3321,
    property_type: "Apartment",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1c24240938?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80"
    ]
  },
  {
    title: "Luxury Estate with Vineyard",
    location: "Napa Valley, CA",
    price: "$6,800,000",
    raw_price: 6800000,
    beds: 6,
    baths: 6.5,
    sqm: 600,
    type: "sale",
    category: "featured",
    is_featured: true,
    lat: 38.2975,
    lng: -122.2869,
    property_type: "House",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?w=800&q=80"
    ]
  },
  {
    title: "High-Rise Studio with View",
    location: "San Francisco, CA",
    price: "$750,000",
    raw_price: 750000,
    beds: 1,
    baths: 1,
    sqm: 80,
    type: "sale",
    category: "new_in_market",
    is_featured: false,
    lat: 37.7749,
    lng: -122.4194,
    property_type: "Apartment",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1c24240938?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
    ]
  },
  {
    title: "Spacious Suburb Family Home",
    location: "Dallas, TX",
    price: "$1,200,000",
    raw_price: 1200000,
    beds: 5,
    baths: 4,
    sqm: 350,
    type: "sale",
    category: "new_in_market",
    is_featured: false,
    lat: 32.7767,
    lng: -96.7970,
    property_type: "House",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687931-cece5ce21448?w=800&q=80"
    ]
  },
  {
    title: "Corner Townhouse with Garden",
    location: "Washington, DC",
    price: "$1,450,000",
    raw_price: 1450000,
    beds: 3,
    baths: 3.5,
    sqm: 220,
    type: "sale",
    category: "new_in_market",
    is_featured: false,
    lat: 38.9072,
    lng: -77.0369,
    property_type: "Townhouse",
    images: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?w=800&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800&q=80"
    ]
  },
  {
    title: "Downtown Posh Condominium",
    location: "Denver, CO",
    price: "$1,350,000",
    raw_price: 1350000,
    beds: 2,
    baths: 2,
    sqm: 170,
    type: "sale",
    category: "new_in_market",
    is_featured: false,
    lat: 39.7392,
    lng: -104.9903,
    property_type: "Condo",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      "https://images.unsplash.com/photo-1512918361407-6b4df9d36357?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
    ]
  },
  {
    title: "Luxury Duplex with Terrace",
    location: "Philadelphia, PA",
    price: "$1,550,000",
    raw_price: 1550000,
    beds: 4,
    baths: 3,
    sqm: 260,
    type: "sale",
    category: "new_in_market",
    is_featured: true,
    lat: 39.9526,
    lng: -75.1652,
    property_type: "Apartment",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1c24240938?w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
    ]
  }
].map(p => ({
  ...p,
  slug: generateSlug(p.title),
  amenities: getRandomAmenities()
}));

async function seed() {
  console.log(`Inserting ${properties.length} properties...`);
  const { data, error } = await supabase.from("properties").insert(properties);
  
  if (error) {
    console.error("Error seeding properties:", error);
  } else {
    console.log("Successfully seeded properties!");
  }
}

seed();
