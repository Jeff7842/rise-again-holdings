// data/listings.ts
export const listings = [
  // ================= RESIDENTIAL LISTINGS (KENYA – PRIMARY INVENTORY) =================

  {
    id: "4br-flat-roof-ruiru-mugutha",
    title: "Modern 4-Bedroom Flat Roof Maisonette",
    price: "KES 14.5M",
    country: "Kenya",
    location: "Mugutha, Ruiru – Near St. Paul Catholic Church, off Thika Road",
    description:
      "A brand-new, architecturally modern 4-bedroom flat-roof maisonette located in a highly developed and secure gated community of only three units. The home is approximately 2km from Thika Superhighway and just 200 meters from tarmac, offering both accessibility and serenity. Key highlights include a spacious sunken lounge, all bedrooms ensuite with fitted wardrobes, an open-plan kitchen with pantry, guest cloakroom, solar hot water system, biodigester (no septic), electric fence with alarm system, perimeter wall, sliding gate, manicured front garden, and ample parking for up to five vehicles. The property sits on a plot slightly larger than 40x80ft and comes with a ready title deed.",
    coordinates: { lat: -1.1453, lng: 36.9647 },
    bedrooms: 4,
    bathrooms: 4,
    washrooms: 1,
    buildingArea: "Approx. 2800 sq ft",
    landSize: "40x80+ ft",
    images: [
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.47%20(1).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.47%20(2).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.47%20(3).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.47%20(4).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.47.jpeg",

  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.48%20(1).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.48%20(2).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.48%20(3).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.48%20(4).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.48.jpeg",

  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.49%20(1).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.49%20(2).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.49%20(3).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.49%20(4).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.49.jpeg",

  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.50%20(1).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.50%20(2).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.50%20(3).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.50%20(4).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.50.jpeg",

  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/4br-flat-roof-ruiru-mugutha/WhatsApp%20Image%202026-02-08%20at%2021.09.51.jpeg",
]

  },

  {
    id: "5br-luxury-home-kamakis",
    title: "Luxury 5-Bedroom All-Ensuite Home with DSQ",
    price: "KES 27M (Negotiable)",
    country: "Kenya",
    location: "Kamakis, Ruiru – Off Eastern Bypass near Thika Superhighway",
    description:
      "A newly built luxury 5-bedroom all-ensuite residence situated in a secure gated estate in Kamakis, one of Ruiru’s fastest-growing high-end residential zones. The property features a grand living room with expansive windows and modern lighting, a stylish fitted kitchen with granite countertops, pantry and breakfast area, a family TV/entertainment room, and a detached servant quarters (DSQ) with private access. Finished with premium porcelain tiles, gypsum ceilings, and high-quality fittings throughout. The home sits on a 50x100ft plot with cabro-paved parking, landscaped compound, and a clean freehold title deed.",
    coordinates: { lat: -1.1249, lng: 37.0124 },
    bedrooms: 5,
    bathrooms: 5,
    washrooms: 1,
    buildingArea: "Approx. 4200 sq ft",
    landSize: "50x100 ft",
    images: [
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/NEWLY%20BUILT%205%20BEDROOM%20HOUSE%20FOR%20SALE%20%20KAMAKIS,%20RUIRU/WhatsApp%20Image%202026-02-08%20at%2020.48.07%20(1).jpeg",
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/NEWLY%20BUILT%205%20BEDROOM%20HOUSE%20FOR%20SALE%20%20KAMAKIS,%20RUIRU/WhatsApp%20Image%202026-02-08%20at%2020.48.07%20(2).jpeg",
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/NEWLY%20BUILT%205%20BEDROOM%20HOUSE%20FOR%20SALE%20%20KAMAKIS,%20RUIRU/WhatsApp%20Image%202026-02-08%20at%2020.48.07%20(3).jpeg",
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/NEWLY%20BUILT%205%20BEDROOM%20HOUSE%20FOR%20SALE%20%20KAMAKIS,%20RUIRU/WhatsApp%20Image%202026-02-08%20at%2020.48.07%20(4).jpeg",
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/NEWLY%20BUILT%205%20BEDROOM%20HOUSE%20FOR%20SALE%20%20KAMAKIS,%20RUIRU/WhatsApp%20Image%202026-02-08%20at%2020.48.07.jpeg",
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/NEWLY%20BUILT%205%20BEDROOM%20HOUSE%20FOR%20SALE%20%20KAMAKIS,%20RUIRU/WhatsApp%20Image%202026-02-08%20at%2020.48.08%20(1).jpeg",
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/NEWLY%20BUILT%205%20BEDROOM%20HOUSE%20FOR%20SALE%20%20KAMAKIS,%20RUIRU/WhatsApp%20Image%202026-02-08%20at%2020.48.08%20(2).jpeg",
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/NEWLY%20BUILT%205%20BEDROOM%20HOUSE%20FOR%20SALE%20%20KAMAKIS,%20RUIRU/WhatsApp%20Image%202026-02-08%20at%2020.48.08%20(3).jpeg",
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/NEWLY%20BUILT%205%20BEDROOM%20HOUSE%20FOR%20SALE%20%20KAMAKIS,%20RUIRU/WhatsApp%20Image%202026-02-08%20at%2020.48.08%20(4).jpeg",
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/NEWLY%20BUILT%205%20BEDROOM%20HOUSE%20FOR%20SALE%20%20KAMAKIS,%20RUIRU/WhatsApp%20Image%202026-02-08%20at%2020.48.10%20(2).jpeg",
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/NEWLY%20BUILT%205%20BEDROOM%20HOUSE%20FOR%20SALE%20%20KAMAKIS,%20RUIRU/WhatsApp%20Image%202026-02-08%20at%2020.48.09%20(2).jpeg",
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/NEWLY%20BUILT%205%20BEDROOM%20HOUSE%20FOR%20SALE%20%20KAMAKIS,%20RUIRU/WhatsApp%20Image%202026-02-08%20at%2020.48.09%20(1).jpeg",
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/NEWLY%20BUILT%205%20BEDROOM%20HOUSE%20FOR%20SALE%20%20KAMAKIS,%20RUIRU/Bedroom%20House%20For%20Sale.mp4",
    ],
  },

  {
    id: "4br-maisonette-kenyatta-road",
    title: "Contemporary 4-Bedroom Maisonette with Prayer Room",
    price: "KES 15M",
    country: "Kenya",
    location: "Kenyatta Road, Juja – 5km off Thika Road",
    description:
      "A modern and well-planned 4-bedroom maisonette located within a secure gated community along Kenyatta Road, Juja. The ground floor features a bright and spacious living room, separate dining area, guest bedroom ensuite, and an open-plan kitchen with granite countertops and pantry. The first floor hosts a master bedroom ensuite with a private balcony and two additional ensuite bedrooms. The second floor includes a dedicated prayer room. Externally, the property offers cabro-paved parking and sits on a standard 40x80ft plot, making it ideal for family living.",
    coordinates: { lat: -1.1056, lng: 37.0019 },
    bedrooms: 4,
    bathrooms: 4,
    washrooms: 1,
    buildingArea: "Approx. 3000 sq ft",
    landSize: "40x80 ft",
    images: [
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.00%20(5).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.00.jpeg",

  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.01%20(1).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.01%20(2).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.01%20(3).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.01%20(4).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.01.jpeg",

  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.02%20(1).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.02%20(2).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.02%20(3).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.02%20(4).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.02.jpeg",

  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.03%20(1).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.03%20(2).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.03.jpeg",

  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.04%20(1).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.04%20(2).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.04%20(3).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.04%20(4).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.04.jpeg",

  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.05%20(1).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.05%20(2).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.05%20(3).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.05.jpeg",

  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.06%20(1).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.06%20(2).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.06%20(3).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.06%20(4).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.06.jpeg",

  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.07%20(1).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.07%20(2).jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Image%202026-02-08%20at%2020.44.07.jpeg",
  "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Kenyatta-road-4-Bedroom/WhatsApp%20Video%202026-02-08%20at%2020.38.40.mp4",
]

  },

  {
    id: "thome-estate-mixed-development",
    title: "Prime Residential Compound – Thome Estate",
    price: "KES 100M",
    country: "Kenya",
    location: "Thome Estate – Less than 1km from Thika Road (Roasters)",
    description:
      "A rare prime residential compound in Thome Estate comprising a 5-bedroom all-ensuite maisonette plus an additional 4-bedroom maisonette, both finished to high standards. The property sits on approximately three-quarters of an acre and features wooden flooring, closed-plan kitchens with gypsum ceilings, cabro-paved compound, green recreational area, and reliable council water supply. Located less than 1km from Thika Road, this asset is ideal for executive residential use, embassy housing, or high-end redevelopment.",
    coordinates: { lat: -1.2196, lng: 36.8843 },
    bedrooms: 9,
    bathrooms: 9,
    washrooms: 2,
    buildingArea: "Multiple Units",
    landSize: "¾ Acre",
    images: [
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Listings%20Images/Thome/thome.mp4",]
  },
];
