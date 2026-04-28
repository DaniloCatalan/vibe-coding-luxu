export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  rawPrice: number;
  beds: number;
  baths: number;
  sqm: number;
  images: string[];
  badge?: "Exclusive" | "New Arrival" | "FOR SALE" | "FOR RENT";
  type: "sale" | "rent";
  period?: "/mo";
}

export const featuredCollections: Property[] = [
  {
    id: "f1",
    title: "The Glass Pavilion",
    location: "Beverly Hills, California",
    price: "$5,250,000",
    rawPrice: 5250000,
    beds: 5,
    baths: 4.5,
    sqm: 4200,
    images: [
      "https://picsum.photos/seed/f1-1/800/600",
      "https://picsum.photos/seed/f1-2/800/600",
      "https://picsum.photos/seed/f1-3/800/600",
      "https://picsum.photos/seed/f1-4/800/600"
    ],
    badge: "Exclusive",
    type: "sale",
  },
  {
    id: "f2",
    title: "Azure Heights Penthouse",
    location: "Downtown, Vancouver",
    price: "$3,800,000",
    rawPrice: 3800000,
    beds: 3,
    baths: 3,
    sqm: 2100,
    images: [
      "https://picsum.photos/seed/f2-1/800/600",
      "https://picsum.photos/seed/f2-2/800/600",
      "https://picsum.photos/seed/f2-3/800/600",
      "https://picsum.photos/seed/f2-4/800/600"
    ],
    badge: "New Arrival",
    type: "sale",
  },
];

export const newInMarket: Property[] = [
  {
    id: "n1",
    title: "Modern Family Home",
    location: "123 Pine St, Seattle",
    price: "$850,000",
    rawPrice: 850000,
    beds: 3,
    baths: 2,
    sqm: 120,
    images: [
      "https://picsum.photos/seed/n1-1/800/600",
      "https://picsum.photos/seed/n1-2/800/600",
      "https://picsum.photos/seed/n1-3/800/600",
      "https://picsum.photos/seed/n1-4/800/600"
    ],
    badge: "FOR SALE",
    type: "sale",
  },
  {
    id: "n2",
    title: "Urban Loft",
    location: "456 Elm Ave, Portland",
    price: "$3,200",
    rawPrice: 3200,
    period: "/mo",
    beds: 1,
    baths: 1,
    sqm: 85,
    images: [
      "https://picsum.photos/seed/n2-1/800/600",
      "https://picsum.photos/seed/n2-2/800/600",
      "https://picsum.photos/seed/n2-3/800/600",
      "https://picsum.photos/seed/n2-4/800/600"
    ],
    badge: "FOR RENT",
    type: "rent",
  },
  {
    id: "n3",
    title: "Highland Retreat",
    location: "789 Mountain Rd, Bend",
    price: "$620,000",
    rawPrice: 620000,
    beds: 2,
    baths: 2,
    sqm: 98,
    images: [
      "https://picsum.photos/seed/n3-1/800/600",
      "https://picsum.photos/seed/n3-2/800/600",
      "https://picsum.photos/seed/n3-3/800/600",
      "https://picsum.photos/seed/n3-4/800/600"
    ],
    badge: "FOR SALE",
    type: "sale",
  },
  {
    id: "n4",
    title: "Sea View Penthouse",
    location: "321 Ocean Dr, Miami",
    price: "$4,500",
    rawPrice: 4500,
    period: "/mo",
    beds: 3,
    baths: 3,
    sqm: 180,
    images: [
      "https://picsum.photos/seed/n4-1/800/600",
      "https://picsum.photos/seed/n4-2/800/600",
      "https://picsum.photos/seed/n4-3/800/600",
      "https://picsum.photos/seed/n4-4/800/600"
    ],
    badge: "FOR RENT",
    type: "rent",
  },
  {
    id: "n5",
    title: "Central Studio",
    location: "555 Main St, Chicago",
    price: "$550,000",
    rawPrice: 550000,
    beds: 1,
    baths: 1,
    sqm: 50,
    images: [
      "https://picsum.photos/seed/n5-1/800/600",
      "https://picsum.photos/seed/n5-2/800/600",
      "https://picsum.photos/seed/n5-3/800/600",
      "https://picsum.photos/seed/n5-4/800/600"
    ],
    badge: "FOR SALE",
    type: "sale",
  },
  {
    id: "n6",
    title: "Garden Villa",
    location: "999 Oak Ln, Austin",
    price: "$2,800",
    rawPrice: 2800,
    period: "/mo",
    beds: 2,
    baths: 2,
    sqm: 110,
    images: [
      "https://picsum.photos/seed/n6-1/800/600",
      "https://picsum.photos/seed/n6-2/800/600",
      "https://picsum.photos/seed/n6-3/800/600",
      "https://picsum.photos/seed/n6-4/800/600"
    ],
    badge: "FOR RENT",
    type: "rent",
  },
  {
    id: "n7",
    title: "Lakeside Cabin",
    location: "Tahoe, Nevada",
    price: "$450,000",
    rawPrice: 450000,
    beds: 3,
    baths: 2,
    sqm: 140,
    images: [
      "https://picsum.photos/seed/n7-1/800/600",
      "https://picsum.photos/seed/n7-2/800/600",
      "https://picsum.photos/seed/n7-3/800/600",
      "https://picsum.photos/seed/n7-4/800/600"
    ],
    badge: "FOR SALE",
    type: "sale",
  },
  {
    id: "n8",
    title: "Metropolitan Condominium",
    location: "New York City, NY",
    price: "$1,200,000",
    rawPrice: 1200000,
    beds: 2,
    baths: 2,
    sqm: 100,
    images: [
      "https://picsum.photos/seed/n8-1/800/600",
      "https://picsum.photos/seed/n8-2/800/600",
      "https://picsum.photos/seed/n8-3/800/600",
      "https://picsum.photos/seed/n8-4/800/600"
    ],
    badge: "New Arrival",
    type: "sale",
  },
  {
    id: "n9",
    title: "Desert Oasis",
    location: "Scottsdale, Arizona",
    price: "$2,100,000",
    rawPrice: 2100000,
    beds: 4,
    baths: 3,
    sqm: 350,
    images: [
      "https://picsum.photos/seed/n9-1/800/600",
      "https://picsum.photos/seed/n9-2/800/600",
      "https://picsum.photos/seed/n9-3/800/600",
      "https://picsum.photos/seed/n9-4/800/600"
    ],
    badge: "Exclusive",
    type: "sale",
  },
  {
    id: "n10",
    title: "Historic Townhouse",
    location: "Boston, Massachusetts",
    price: "$1,850,000",
    rawPrice: 1850000,
    beds: 3,
    baths: 2.5,
    sqm: 220,
    images: [
      "https://picsum.photos/seed/n10-1/800/600",
      "https://picsum.photos/seed/n10-2/800/600",
      "https://picsum.photos/seed/n10-3/800/600",
      "https://picsum.photos/seed/n10-4/800/600"
    ],
    badge: "FOR SALE",
    type: "sale",
  },
  {
    id: "n11",
    title: "Countryside Estate",
    location: "Nashville, Tennessee",
    price: "$3,500,000",
    rawPrice: 3500000,
    beds: 6,
    baths: 5,
    sqm: 600,
    images: [
      "https://picsum.photos/seed/n11-1/800/600",
      "https://picsum.photos/seed/n11-2/800/600",
      "https://picsum.photos/seed/n11-3/800/600",
      "https://picsum.photos/seed/n11-4/800/600"
    ],
    badge: "Exclusive",
    type: "sale",
  },
  {
    id: "n12",
    title: "Beachfront Villa",
    location: "Malibu, California",
    price: "$8,900,000",
    rawPrice: 8900000,
    beds: 5,
    baths: 6,
    sqm: 550,
    images: [
      "https://picsum.photos/seed/n12-1/800/600",
      "https://picsum.photos/seed/n12-2/800/600",
      "https://picsum.photos/seed/n12-3/800/600",
      "https://picsum.photos/seed/n12-4/800/600"
    ],
    badge: "FOR SALE",
    type: "sale",
  },
  {
    id: "n13",
    title: "Ski Chalet",
    location: "Aspen, Colorado",
    price: "$5,400,000",
    rawPrice: 5400000,
    beds: 4,
    baths: 4.5,
    sqm: 400,
    images: [
      "https://picsum.photos/seed/n13-1/800/600",
      "https://picsum.photos/seed/n13-2/800/600",
      "https://picsum.photos/seed/n13-3/800/600",
      "https://picsum.photos/seed/n13-4/800/600"
    ],
    badge: "New Arrival",
    type: "sale",
  },
  {
    id: "n14",
    title: "Modern Eco-Home",
    location: "Portland, Oregon",
    price: "$920,000",
    rawPrice: 920000,
    beds: 3,
    baths: 2,
    sqm: 180,
    images: [
      "https://picsum.photos/seed/n14-1/800/600",
      "https://picsum.photos/seed/n14-2/800/600",
      "https://picsum.photos/seed/n14-3/800/600",
      "https://picsum.photos/seed/n14-4/800/600"
    ],
    badge: "FOR SALE",
    type: "sale",
  },
  {
    id: "n15",
    title: "Suburban Ranch",
    location: "Dallas, Texas",
    price: "$650,000",
    rawPrice: 650000,
    beds: 4,
    baths: 3,
    sqm: 280,
    images: [
      "https://picsum.photos/seed/n15-1/800/600",
      "https://picsum.photos/seed/n15-2/800/600",
      "https://picsum.photos/seed/n15-3/800/600",
      "https://picsum.photos/seed/n15-4/800/600"
    ],
    badge: "FOR SALE",
    type: "sale",
  },
  {
    id: "n16",
    title: "Downtown Loft",
    location: "Austin, Texas",
    price: "$4,100",
    rawPrice: 4100,
    period: "/mo",
    beds: 1,
    baths: 1.5,
    sqm: 110,
    images: [
      "https://picsum.photos/seed/n16-1/800/600",
      "https://picsum.photos/seed/n16-2/800/600",
      "https://picsum.photos/seed/n16-3/800/600",
      "https://picsum.photos/seed/n16-4/800/600"
    ],
    badge: "FOR RENT",
    type: "rent",
  },
];
