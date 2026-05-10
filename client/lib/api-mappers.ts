import { activities, destinations, journalEntries } from "./data";

export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiCity = {
  id: string;
  name: string;
  country: string;
  region?: string | null;
  imageUrl?: string | null;
  popularityScore?: number | null;
  costIndex?: number | null;
  weatherSummary?: string | null;
  bestMonths?: string[];
  description?: string | null;
};

export type ApiTripActivity = {
  id: string;
  title: string;
  category: string;
  scheduledDate?: string;
  startTime?: string | null;
  durationMinutes?: number | null;
  estimatedCost?: number | string | null;
  notes?: string | null;
};

export type ApiTripDestination = {
  id: string;
  position: number;
  startDate: string;
  endDate: string;
  stayNights: number;
  transportMode?: string | null;
  city: ApiCity;
  tripActivities?: ApiTripActivity[];
};

export type ApiBudgetItem = {
  id: string;
  category: string;
  name: string;
  amount: number | string;
  plannedDate?: string | null;
  isPaid?: boolean;
};

export type ApiBudget = {
  id: string;
  currency?: string;
  totalLimit?: number | string | null;
  spentAmount?: number | string | null;
  items?: ApiBudgetItem[];
  trip?: { title?: string; budgetAmount?: number | string | null };
};

export type ApiPackingItem = {
  id: string;
  category: string;
  name: string;
  quantity: number;
  isPacked: boolean;
};

export type ApiPackingList = {
  id: string;
  title: string;
  items: ApiPackingItem[];
};

export type ApiTrip = {
  id: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  startDate: string;
  endDate: string;
  budgetAmount?: number | string | null;
  currency?: string | null;
  status?: string;
  aiSummary?: string | null;
  destinations?: ApiTripDestination[];
  budget?: ApiBudget | null;
  packingList?: ApiPackingList | null;
  sharedTrip?: { slug: string; isPublic: boolean; viewCount?: number } | null;
  _count?: { notes?: number };
};

export type ApiActivity = {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  price?: number | string | null;
  rating?: number | string | null;
  description?: string | null;
  imageUrl?: string | null;
  city?: ApiCity | null;
};

export type ApiJournalNote = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  dayIndex?: number | null;
  type?: string;
  images?: unknown;
  trip?: { title?: string } | null;
  tripDestination?: { city?: ApiCity | null } | null;
};

export type DashboardAnalytics = {
  activeTrips: number;
  savedCities: number;
  budgetExposure: number | string;
  upcomingTrips: ApiTrip[];
  notifications: { id: string; title: string; body: string }[];
  recommendations: { title: string; body: string; type: string }[];
};

export type AdminAnalytics = {
  metrics: {
    totalUsers: number;
    totalTrips: number;
    sharedTrips: number;
    activities: number;
  };
  popularCities: Array<ApiCity & { _count?: { tripDestinations?: number; savedBy?: number } }>;
  recentUsers: Array<{ id: string; name: string; email: string; role: string; createdAt: string }>;
  tripsByStatus: Array<{ status: string; _count: { status: number } }>;
};

export type BudgetResponse = {
  budget: ApiBudget | null;
  analytics: {
    total: number;
    limit: number;
    remaining: number;
    utilization: number;
    byCategory: Record<string, number>;
    insights: string[];
  };
};

export type SharedTripResponse = {
  id: string;
  slug: string;
  viewCount: number;
  trip: ApiTrip & {
    user?: { name: string; avatarUrl?: string | null };
    notes?: ApiJournalNote[];
  };
};

export type TripCardModel = {
  id: string;
  title: string;
  dates: string;
  image: string;
  cities: string[];
  budget: string;
  progress: number;
};

export type DestinationCardModel = {
  id: string;
  city: string;
  country: string;
  image: string;
  weather: string;
  cost: string;
  popularity: number;
  vibe: string;
  route: string;
};

export type ActivityCardModel = {
  id: string;
  city: string;
  title: string;
  category: string;
  rating: string;
  duration: string;
  price: string;
  image: string;
};

export type BudgetBreakdownModel = {
  name: string;
  value: number;
  fill: string;
};

export type PackingGroupModel = {
  title: string;
  items: Array<{ id: string; name: string; quantity: number; isPacked: boolean }>;
};

export type JournalEntryModel = {
  id: string;
  date: string;
  title: string;
  text: string;
  image: string;
};

const fallbackTripImage = destinations[1]?.image ?? "/placeholder.jpg";
const fallbackActivityImage = activities[0]?.image ?? fallbackTripImage;
const fallbackJournalImage = journalEntries[0]?.image ?? fallbackTripImage;
const categoryColors = ["#2563eb", "#06b6d4", "#f97316", "#8b5cf6", "#22c55e", "#f43f5e"];

export function numberFrom(value: number | string | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function formatCurrency(value: number | string | null | undefined, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(numberFrom(value));
}

export function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameYear = start.getFullYear() === end.getFullYear();
  const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  const withYear = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Dates pending";
  }

  return sameYear
    ? `${short.format(start)} - ${withYear.format(end)}`
    : `${withYear.format(start)} - ${withYear.format(end)}`;
}

export function mapTripProgress(status?: string) {
  const statusProgress: Record<string, number> = {
    DRAFT: 15,
    PLANNING: 72,
    BOOKED: 88,
    ACTIVE: 95,
    COMPLETED: 100,
    ARCHIVED: 100
  };

  return statusProgress[status ?? ""] ?? 40;
}

export function mapTripToCard(trip: ApiTrip): TripCardModel {
  const cities = trip.destinations?.map((destination) => destination.city.name).filter(Boolean) ?? [];

  return {
    id: trip.id,
    title: trip.title,
    dates: formatDateRange(trip.startDate, trip.endDate),
    image: trip.coverImageUrl ?? trip.destinations?.[0]?.city.imageUrl ?? fallbackTripImage,
    cities: cities.length ? cities : ["Route pending"],
    budget: formatCurrency(trip.budgetAmount ?? trip.budget?.totalLimit, trip.currency ?? trip.budget?.currency ?? "USD"),
    progress: mapTripProgress(trip.status)
  };
}

export function mapCityToDestination(city: ApiCity): DestinationCardModel {
  const costIndex = city.costIndex ?? 50;
  const cost = costIndex >= 82 ? "$$$$" : costIndex >= 68 ? "$$$" : costIndex >= 45 ? "$$" : "$";
  const route = city.bestMonths?.length ? city.bestMonths.slice(0, 2).join(" / ") : "Anytime";

  return {
    id: city.id,
    city: city.name,
    country: city.country,
    image: city.imageUrl ?? fallbackTripImage,
    weather: city.weatherSummary ?? "Weather pending",
    cost,
    popularity: city.popularityScore ?? 70,
    vibe: city.description ?? city.region ?? "Curated city signal",
    route
  };
}

export function mapActivityToCard(activity: ApiActivity): ActivityCardModel {
  return {
    id: activity.id,
    city: activity.city ? `${activity.city.name}, ${activity.city.country}` : "Flexible city",
    title: activity.title,
    category: titleCase(activity.category),
    rating: numberFrom(activity.rating).toFixed(1),
    duration: `${Math.max(1, Math.round(activity.durationMinutes / 30) / 2)}h`,
    price: formatCurrency(activity.price, "USD"),
    image: activity.imageUrl ?? fallbackActivityImage
  };
}

export function mapBudgetBreakdown(byCategory: Record<string, number> = {}): BudgetBreakdownModel[] {
  const entries = Object.entries(byCategory);
  if (!entries.length) return [];

  return entries.map(([name, value], index) => ({
    name: titleCase(name),
    value,
    fill: categoryColors[index % categoryColors.length]
  }));
}

export function groupPackingItems(items: ApiPackingItem[] = []): PackingGroupModel[] {
  const groups = new Map<string, PackingGroupModel>();

  for (const item of items) {
    const title = titleCase(item.category);
    const group = groups.get(title) ?? { title, items: [] };
    group.items.push({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      isPacked: item.isPacked
    });
    groups.set(title, group);
  }

  return Array.from(groups.values());
}

export function mapNoteToJournalEntry(note: ApiJournalNote): JournalEntryModel {
  return {
    id: note.id,
    date: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
      new Date(note.createdAt)
    ),
    title: note.title,
    text: note.content,
    image: fallbackJournalImage
  };
}
