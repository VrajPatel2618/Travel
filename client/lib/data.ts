import {
  BadgeDollarSign,
  Building2,
  Camera,
  Compass,
  ForkKnife,
  Landmark,
  MapPin,
  Mountain,
  Music2,
  Plane,
  ShipWheel,
  Sparkles,
  TentTree,
  Umbrella
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Compass },
  { href: "/create-trip", label: "Create trip", icon: Sparkles },
  { href: "/trips", label: "My trips", icon: Plane },
  { href: "/itinerary-builder", label: "Builder", icon: MapPin },
  { href: "/timeline", label: "Timeline", icon: ShipWheel },
  { href: "/cities", label: "Cities", icon: Building2 },
  { href: "/activities", label: "Activities", icon: Camera },
  { href: "/budget", label: "Budget", icon: BadgeDollarSign },
  { href: "/packing", label: "Packing", icon: TentTree },
  { href: "/journal", label: "Journal", icon: Landmark },
  { href: "/settings", label: "Settings", icon: Sparkles },
  { href: "/admin", label: "Admin", icon: Building2 }
];

export const heroDestinations = [
  {
    city: "Kyoto",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=80",
    tag: "Culture loop",
    score: 94
  },
  {
    city: "Lisbon",
    country: "Portugal",
    image:
      "https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?auto=format&fit=crop&w=900&q=80",
    tag: "Food + coast",
    score: 89
  },
  {
    city: "Bali",
    country: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
    tag: "Slow travel",
    score: 92
  }
];

export const destinations = [
  {
    city: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
    weather: "19 C, clear",
    cost: "$$$",
    popularity: 98,
    vibe: "Art, food, design",
    route: "6 days"
  },
  {
    city: "Tokyo",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
    weather: "21 C, cloudy",
    cost: "$$$",
    popularity: 96,
    vibe: "Night markets, tech",
    route: "8 days"
  },
  {
    city: "Cape Town",
    country: "South Africa",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=80",
    weather: "24 C, breezy",
    cost: "$$",
    popularity: 91,
    vibe: "Coast, hikes, wine",
    route: "7 days"
  },
  {
    city: "Reykjavik",
    country: "Iceland",
    image:
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=80",
    weather: "7 C, crisp",
    cost: "$$$$",
    popularity: 88,
    vibe: "Glaciers, lagoons",
    route: "5 days"
  },
  {
    city: "Mexico City",
    country: "Mexico",
    image:
      "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=900&q=80",
    weather: "22 C, sunny",
    cost: "$$",
    popularity: 93,
    vibe: "Food, museums",
    route: "4 days"
  },
  {
    city: "Patagonia",
    country: "Argentina",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
    weather: "10 C, wild",
    cost: "$$$",
    popularity: 86,
    vibe: "Trekking, lakes",
    route: "10 days"
  }
];

export const upcomingTrips = [
  {
    title: "Spring in Japan",
    dates: "Apr 2 - Apr 13",
    image:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=80",
    cities: ["Tokyo", "Kyoto", "Osaka"],
    budget: "$4,280",
    progress: 72
  },
  {
    title: "Mediterranean workcation",
    dates: "Jun 8 - Jun 20",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=80",
    cities: ["Barcelona", "Nice", "Rome"],
    budget: "$3,940",
    progress: 46
  },
  {
    title: "Iceland ring road",
    dates: "Sep 4 - Sep 11",
    image:
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=80",
    cities: ["Reykjavik", "Vik", "Akureyri"],
    budget: "$5,120",
    progress: 31
  }
];

export const cityFlow = [
  {
    id: "tokyo",
    city: "Tokyo",
    stay: "3 nights",
    date: "Apr 2",
    transfer: "Arrive HND",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=500&q=80",
    activities: ["Tsukiji breakfast walk", "Daikanyama design crawl", "Shibuya sky"]
  },
  {
    id: "kyoto",
    city: "Kyoto",
    stay: "4 nights",
    date: "Apr 5",
    transfer: "Shinkansen 2h 14m",
    image:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=500&q=80",
    activities: ["Fushimi Inari sunrise", "Tea ceremony", "Gion dinner route"]
  },
  {
    id: "osaka",
    city: "Osaka",
    stay: "2 nights",
    date: "Apr 9",
    transfer: "Rapid train 29m",
    image:
      "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=500&q=80",
    activities: ["Dotonbori food loop", "Castle gardens", "Jazz bar crawl"]
  },
  {
    id: "naoshima",
    city: "Naoshima",
    stay: "2 nights",
    date: "Apr 11",
    transfer: "Train + ferry 3h 30m",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80",
    activities: ["Benesse House", "Art island cycle", "Sunset ferry"]
  }
];

export const timelineDays = [
  {
    city: "Tokyo",
    day: "Day 1",
    date: "Apr 2",
    items: [
      { time: "09:40", title: "Land at Haneda", cost: "$0", duration: "45m", category: "Transit", icon: Plane },
      { time: "12:00", title: "Ramen lunch in Shinjuku", cost: "$18", duration: "1h", category: "Food", icon: ForkKnife },
      { time: "16:30", title: "Meiji Shrine walk", cost: "$0", duration: "90m", category: "Culture", icon: Landmark }
    ]
  },
  {
    city: "Kyoto",
    day: "Day 4",
    date: "Apr 5",
    items: [
      { time: "08:20", title: "Shinkansen to Kyoto", cost: "$96", duration: "2h 14m", category: "Transit", icon: Plane },
      { time: "13:00", title: "Nishiki Market tasting", cost: "$34", duration: "2h", category: "Food", icon: ForkKnife },
      { time: "18:30", title: "Gion lantern route", cost: "$12", duration: "75m", category: "Culture", icon: Landmark }
    ]
  },
  {
    city: "Osaka",
    day: "Day 8",
    date: "Apr 9",
    items: [
      { time: "10:00", title: "Rapid train to Osaka", cost: "$8", duration: "29m", category: "Transit", icon: Plane },
      { time: "15:00", title: "Castle garden loop", cost: "$7", duration: "90m", category: "History", icon: Landmark },
      { time: "20:00", title: "Dotonbori street food", cost: "$42", duration: "2h", category: "Food", icon: ForkKnife }
    ]
  }
];

export const activities = [
  {
    title: "Sunrise volcano hike",
    category: "Adventure",
    city: "Bali",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    duration: "5h",
    price: "$74",
    icon: Mountain
  },
  {
    title: "Chef-led market tasting",
    category: "Food",
    city: "Lisbon",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    duration: "3h",
    price: "$58",
    icon: ForkKnife
  },
  {
    title: "Hidden beach sailing",
    category: "Beaches",
    city: "Mallorca",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
    rating: 4.7,
    duration: "4h",
    price: "$112",
    icon: Umbrella
  },
  {
    title: "Alpine ridge trek",
    category: "Hiking",
    city: "Zermatt",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    duration: "6h",
    price: "$96",
    icon: Mountain
  },
  {
    title: "After-hours museum route",
    category: "Museums",
    city: "Paris",
    image:
      "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    duration: "2h",
    price: "$45",
    icon: Landmark
  },
  {
    title: "Night market crawl",
    category: "Nightlife",
    city: "Bangkok",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=700&q=80",
    rating: 4.6,
    duration: "3h",
    price: "$39",
    icon: Music2
  }
];

export const budgetBreakdown = [
  { name: "Flights", value: 1640, fill: "#2563eb" },
  { name: "Stays", value: 2180, fill: "#8b5cf6" },
  { name: "Food", value: 760, fill: "#f97316" },
  { name: "Activities", value: 680, fill: "#06b6d4" },
  { name: "Transit", value: 420, fill: "#10b981" }
];

export const spendingTrend = [
  { day: "Mon", planned: 420, actual: 380 },
  { day: "Tue", planned: 520, actual: 610 },
  { day: "Wed", planned: 480, actual: 455 },
  { day: "Thu", planned: 620, actual: 735 },
  { day: "Fri", planned: 700, actual: 812 },
  { day: "Sat", planned: 860, actual: 920 },
  { day: "Sun", planned: 540, actual: 490 }
];

export const packingGroups = [
  {
    title: "Documents",
    items: ["Passport", "JR rail pass", "Travel insurance", "Hotel confirmations"]
  },
  {
    title: "Wardrobe",
    items: ["Rain shell", "Walking shoes", "Dinner outfit", "Light layers"]
  },
  {
    title: "Tech",
    items: ["Universal adapter", "Camera battery", "Power bank", "Noise-canceling headphones"]
  }
];

export const journalEntries = [
  {
    date: "Apr 2",
    title: "First night in Tokyo",
    text:
      "Jet lag turned into a neon walk through Shinjuku. Saved a tiny ramen counter for the public itinerary.",
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80"
  },
  {
    date: "Apr 5",
    title: "Kyoto shifted the pace",
    text:
      "Moved the bamboo grove to sunrise and added a quiet tea house AI found two streets away.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80"
  }
];

export const adminMetrics = [
  { label: "Total users", value: "128.4K", delta: "+18.2%" },
  { label: "Trips created", value: "412K", delta: "+24.8%" },
  { label: "Shared itineraries", value: "38.7K", delta: "+11.5%" },
  { label: "AI plans generated", value: "1.8M", delta: "+31.9%" }
];

export const cityPopularity = [
  { city: "Tokyo", trips: 12800 },
  { city: "Paris", trips: 11100 },
  { city: "Lisbon", trips: 9400 },
  { city: "Bali", trips: 9100 },
  { city: "Cape Town", trips: 7200 }
];

export const engagementTrend = [
  { month: "Jan", users: 48, trips: 92 },
  { month: "Feb", users: 57, trips: 104 },
  { month: "Mar", users: 63, trips: 132 },
  { month: "Apr", users: 78, trips: 161 },
  { month: "May", users: 91, trips: 188 },
  { month: "Jun", users: 113, trips: 234 }
];
