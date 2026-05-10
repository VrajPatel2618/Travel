"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Copy,
  GripVertical,
  Heart,
  ImagePlus,
  Landmark,
  ListChecks,
  LocateFixed,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquareText,
  Minus,
  Mountain,
  Music2,
  Navigation,
  Plus,
  Route,
  Search,
  Send,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Ticket,
  Timer,
  TrendingUp,
  Umbrella,
  User,
  WalletCards
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

import { AppShell, BrandMark, PageHeader } from "@/components/app-shell";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { GlassPanel, Surface } from "@/components/ui/panel";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuthActions } from "@/hooks/use-auth";
import {
  useActivities,
  useAdminAnalytics,
  useCities,
  useCreateJournal,
  useCreateTrip,
  useDashboardAnalytics,
  useJournals,
  usePackingList,
  useSharedTrip,
  useTogglePackingItem,
  useTripBudget,
  useTrips
} from "@/hooks/use-trips";
import {
  activities,
  adminMetrics,
  budgetBreakdown,
  cityFlow,
  cityPopularity,
  destinations,
  engagementTrend,
  heroDestinations,
  journalEntries,
  packingGroups,
  spendingTrend,
  timelineDays,
  upcomingTrips
} from "@/lib/data";
import {
  formatCurrency,
  groupPackingItems,
  mapActivityToCard,
  mapBudgetBreakdown,
  mapCityToDestination,
  mapNoteToJournalEntry,
  mapTripToCard,
  numberFrom,
  titleCase,
  type ActivityCardModel,
  type BudgetBreakdownModel,
  type DestinationCardModel,
  type JournalEntryModel,
  type PackingGroupModel,
  type TripCardModel
} from "@/lib/api-mappers";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" }
};

const demoTripCards: TripCardModel[] = upcomingTrips.map((trip) => ({
  id: trip.title,
  ...trip
}));

const demoDestinationCards: DestinationCardModel[] = destinations.map((destination) => ({
  id: destination.city,
  ...destination
}));

const demoActivityCards = activities.map((activity) => ({
  id: activity.title,
  ...activity
}));

const demoJournalCards: JournalEntryModel[] = journalEntries.map((entry) => ({
  id: entry.title,
  date: entry.date,
  title: entry.title,
  text: entry.text,
  image: entry.image
}));

function SectionIntro({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {eyebrow ? (
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-balance text-3xl font-black tracking-normal text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-white/68">{description}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Surface className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-normal">{value}</p>
        </div>
        <span className="grid size-11 place-items-center rounded-2xl bg-cyan-400/12 text-cyan-500">
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{detail}</p>
    </Surface>
  );
}

function TripCard({
  trip,
  compact = false
}: {
  trip: TripCardModel;
  compact?: boolean;
}) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="overflow-hidden rounded-3xl border border-border bg-card/82 shadow-premium backdrop-blur-xl"
    >
      <div className={cn("relative", compact ? "h-36" : "h-44")}>
        <img
          src={trip.image}
          alt={`${trip.title} destination`}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/78 to-transparent" />
        <Badge className="absolute left-4 top-4" variant="glass">
          {trip.dates}
        </Badge>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black tracking-normal">{trip.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {trip.cities.join(" -> ")}
            </p>
          </div>
          <Button aria-label={`Open ${trip.title}`} size="icon" variant="outline">
            <ChevronRight />
          </Button>
        </div>
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="font-semibold">{trip.budget}</span>
          <span className="text-muted-foreground">{trip.progress}% planned</span>
        </div>
        <Progress value={trip.progress} className="mt-3" />
        {trip.progress > 50 ? (
          <Button className="mt-5 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">
            Book Trip Now
          </Button>
        ) : (
          <Button variant="outline" className="mt-5 w-full">
            Continue Planning
          </Button>
        )}
      </div>
    </motion.article>
  );
}

function DestinationCard({
  destination,
  large = false
}: {
  destination: DestinationCardModel;
  large?: boolean;
}) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      className={cn(
        "group overflow-hidden rounded-3xl border border-white/12 bg-white/10 shadow-premium backdrop-blur-2xl",
        large && "md:col-span-2"
      )}
    >
      <div className={cn("relative", large ? "h-72" : "h-56")}>
        <img
          src={destination.image}
          alt={`${destination.city}, ${destination.country}`}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
          <Badge variant="glass">{destination.route}</Badge>
          <Button size="icon" variant="glass" aria-label={`Save ${destination.city}`}>
            <Heart />
          </Button>
        </div>
        <div className="absolute inset-x-5 bottom-5">
          <p className="text-sm font-semibold text-cyan-200">
            {destination.country}
          </p>
          <h3 className="mt-1 text-2xl font-black tracking-normal text-white">
            {destination.city}
          </h3>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-white/78">
            <span>{destination.weather}</span>
            <span>{destination.cost}</span>
            <span>{destination.popularity}% fit</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ActivityCard({ activity }: { activity: ActivityCardModel | (typeof demoActivityCards)[number] }) {
  const categoryIcons: Record<string, LucideIcon> = {
    Adventure: Mountain,
    Beaches: Umbrella,
    Culture: Landmark,
    Food: Ticket,
    Hiking: Mountain,
    Museums: Building2,
    Nightlife: Music2,
    Shopping: WalletCards,
    Transit: Navigation,
    Wellness: Heart
  };
  const Icon = "icon" in activity ? activity.icon : categoryIcons[activity.category] ?? Camera;
  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="overflow-hidden rounded-3xl border border-border bg-card/82 shadow-premium backdrop-blur-xl"
    >
      <div className="relative h-48">
        <img
          src={activity.image}
          alt={activity.title}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/72 to-transparent" />
        <Badge className="absolute left-4 top-4" variant="glass">
          <Icon className="mr-1 size-3" />
          {activity.category}
        </Badge>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{activity.city}</p>
            <h3 className="mt-1 text-lg font-black tracking-normal">
              {activity.title}
            </h3>
          </div>
          <Button aria-label={`Add ${activity.title}`} size="icon">
            <Plus />
          </Button>
        </div>
        <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {activity.rating}
          </span>
          <span className="flex items-center gap-1">
            <Timer className="size-4" />
            {activity.duration}
          </span>
          <span className="font-semibold text-foreground">{activity.price}</span>
        </div>
      </div>
    </motion.article>
  );
}

function MiniCalendar() {
  const days = Array.from({ length: 14 }, (_, index) => index + 1);
  return (
    <Surface className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-muted-foreground">April 2026</p>
          <h3 className="text-xl font-black tracking-normal">Trip calendar</h3>
        </div>
        <CalendarDays className="size-5 text-cyan-500" />
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-2">
        {days.map((day) => (
          <button
            key={day}
            className={cn(
              "aspect-square rounded-2xl text-sm font-bold transition-all hover:bg-muted",
              [2, 5, 9, 11].includes(day) &&
              "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/20"
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </Surface>
  );
}

function BudgetCharts({
  breakdown = budgetBreakdown,
  totalLabel = "$5,680 total"
}: {
  breakdown?: BudgetBreakdownModel[];
  totalLabel?: string;
}) {
  const chartBreakdown = breakdown.length ? breakdown : budgetBreakdown;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <Surface className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Breakdown</p>
            <h3 className="text-xl font-black tracking-normal">Trip budget</h3>
          </div>
          <Badge variant="coral">{totalLabel}</Badge>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={68}
                outerRadius={108}
                paddingAngle={4}
              >
                {chartBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.25)"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Surface>
      <Surface className="p-6">
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground">
            Planned vs actual
          </p>
          <h3 className="text-xl font-black tracking-normal">Spending trend</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendingTrend}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.22} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.25)"
                }}
              />
              <Bar dataKey="planned" fill="#2563eb" radius={[10, 10, 0, 0]} />
              <Bar dataKey="actual" fill="#f97316" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Surface>
    </div>
  );
}

function AdminCharts() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Surface className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Engagement</p>
            <h3 className="text-xl font-black tracking-normal">
              Users and trip creation
            </h3>
          </div>
          <Badge variant="outline">Last 6 months</Badge>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={engagementTrend}>
              <defs>
                <linearGradient id="users" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="trips" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.22} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.25)"
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#06b6d4"
                fill="url(#users)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="trips"
                stroke="#8b5cf6"
                fill="url(#trips)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Surface>
      <Surface className="p-6">
        <div className="mb-5">
          <p className="text-sm font-medium text-muted-foreground">Popular cities</p>
          <h3 className="text-xl font-black tracking-normal">Trip demand</h3>
        </div>
        <div className="space-y-4">
          {cityPopularity.map((city, index) => (
            <div key={city.city}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">{city.city}</span>
                <span className="text-muted-foreground">{city.trips.toLocaleString()}</span>
              </div>
              <Progress value={92 - index * 9} />
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-app-gradient text-white">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-navy-950/42 backdrop-blur-2xl">
        <div className="container flex h-20 items-center justify-between">
          <BrandMark />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-white/70 md:flex">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#showcase" className="hover:text-white">
              Destinations
            </a>
            <a href="#stories" className="hover:text-white">
              Stories
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="glass" className="hidden sm:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Start planning</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative min-h-[88vh] pt-28">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=85"
            alt="Mountain lake travel route"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/72 to-navy-950/20" />
          <div className="absolute inset-0 travel-grid opacity-40" />
        </div>
        <div className="container relative grid min-h-[calc(88vh-7rem)] items-center gap-12 pb-16 lg:grid-cols-[1fr_0.85fr]">
          <motion.div {...fadeUp} className="max-w-3xl">
            <Badge variant="glass">
              <Sparkles className="mr-1 size-3.5" />
              AI routes, budgets, packing, and public sharing
            </Badge>
            <h1 className="mt-6 text-balance text-5xl font-black tracking-normal sm:text-7xl lg:text-8xl">
              Plan Smarter. Travel Better.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76 sm:text-xl">
              Traveloop turns messy trip ideas into beautiful multi-city plans with
              live budgets, smart recommendations, packing workflows, and shareable
              itineraries.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Open demo dashboard
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="glass">
                <Link href="/itinerary-builder">Explore builder</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative hidden min-h-[560px] lg:block"
          >
            {heroDestinations.map((destination, index) => (
              <motion.div
                key={destination.city}
                animate={{ y: [0, -14, 0] }}
                transition={{
                  duration: 5 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.35
                }}
                className={cn(
                  "absolute w-72 overflow-hidden rounded-3xl border border-white/15 bg-white/12 shadow-glow backdrop-blur-2xl",
                  index === 0 && "right-12 top-10",
                  index === 1 && "left-0 top-56",
                  index === 2 && "right-0 bottom-0"
                )}
              >
                <div className="h-40">
                  <img
                    src={destination.image}
                    alt={`${destination.city} preview`}
                    className="size-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-cyan-200">
                        {destination.country}
                      </p>
                      <h3 className="text-xl font-black tracking-normal">
                        {destination.city}
                      </h3>
                    </div>
                    <span className="rounded-full bg-coral-500 px-3 py-1 text-xs font-bold">
                      {destination.score}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-white/66">{destination.tag}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="relative border-t border-white/10 py-20">
        <div className="container">
          <SectionIntro
            eyebrow="Travel operations"
            title="Everything that usually fragments a trip now flows together."
            description="Plan the route, book the activity, monitor the budget, pack the bag, and publish the story from one calm workspace."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {(
              [
                {
                  title: "AI trip canvas",
                  text: "Generate city order, activity windows, route gaps, and stay length suggestions.",
                  icon: Sparkles
                },
                {
                  title: "Live budget guardrails",
                  text: "Track categories, split spending, and receive alerts before overruns become painful.",
                  icon: WalletCards
                },
                {
                  title: "Public itinerary stories",
                  text: "Turn any private plan into a polished share page with gallery, route, and copy flow.",
                  icon: Share2
                },
                {
                  title: "Notion-style travel memory",
                  text: "Capture notes, photos, reminders, and moments as the trip unfolds.",
                  icon: MessageSquareText
                }
              ] satisfies { title: string; text: string; icon: LucideIcon }[]
            ).map(({ title, text, icon: Icon }) => (
              <GlassPanel key={title} className="p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-cyan-400/14 text-cyan-200">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-6 text-xl font-black tracking-normal">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/66">{text}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      <section id="showcase" className="py-20">
        <div className="container">
          <SectionIntro
            eyebrow="Destination intelligence"
            title="Search less. Sense the right place faster."
            description="Traveloop blends cost, weather, popularity, seasonality, and your saved tastes into a travel discovery surface."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {demoDestinationCards.slice(0, 5).map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                large={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="border-t border-white/10 py-20">
        <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Badge variant="glass">Loved by planners</Badge>
            <h2 className="mt-5 text-balance text-4xl font-black tracking-normal sm:text-5xl">
              Built for people who want the trip to feel designed.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/70">
              From family logistics to creative solo trips, Traveloop keeps the
              moving pieces visible without turning travel into project management
              homework.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["I replaced seven tabs and three spreadsheets before lunch.", "Amelia R.", "Design founder"],
              ["The route builder finally made our multi-city honeymoon sane.", "Noah K.", "Product lead"],
              ["Public itinerary sharing looks polished enough to send clients.", "Priya S.", "Travel curator"],
              ["Budget alerts caught the sneaky Paris overspend early.", "Marcus L.", "Finance team"]
            ].map(([quote, name, role]) => (
              <GlassPanel key={name} className="p-5">
                <p className="text-sm leading-6 text-white/76">&quot;{quote}&quot;</p>
                <p className="mt-5 font-bold">{name}</p>
                <p className="text-sm text-white/50">{role}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [showForgot, setShowForgot] = React.useState(false);
  const [name, setName] = React.useState("Maya Chen");
  const [email, setEmail] = React.useState("maya@traveloop.ai");
  const [password, setPassword] = React.useState("Traveloop123!");
  const [status, setStatus] = React.useState<string | null>(null);
  const auth = useAuthActions();

  const submitAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    try {
      if (isSignup) {
        await auth.signup({ name, email, password });
        setStatus("Account created. Redirecting to dashboard...");
        window.location.href = "/dashboard";
      } else {
        await auth.login({ email, password });
        setStatus("Logged in. Redirecting to dashboard...");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-mesh-light dark:bg-app-gradient">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden p-8 text-white lg:block">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=85"
            alt="Open road travel"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950/92 via-navy-950/58 to-transparent" />
          <div className="relative flex h-full flex-col justify-between">
            <BrandMark />
            <div className="max-w-xl pb-10">
              <Badge variant="glass">Private beta workspace</Badge>
              <h1 className="mt-5 text-balance text-5xl font-black tracking-normal">
                Your next trip deserves a better operating system.
              </h1>
              <p className="mt-5 text-lg leading-8 text-white/72">
                Create AI-first itineraries, coordinate budgets, and keep every
                memory in a calm travel workspace.
              </p>
            </div>
          </div>
        </section>
        <main className="flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <BrandMark />
              <ThemeToggle />
            </div>
            <Surface className="p-6 sm:p-8">
              <div>
                <Badge variant="coral">{isSignup ? "Create account" : "Welcome back"}</Badge>
                <h2 className="mt-4 text-3xl font-black tracking-normal">
                  {isSignup ? "Start planning with Traveloop" : "Log in to your trips"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {isSignup
                    ? "Join the workspace and generate your first multi-city plan."
                    : "Pick up your itinerary, budget, notes, and packing flow."}
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button variant="outline" className="w-full">
                  <Mail className="size-4" />
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <User className="size-4" />
                  Apple
                </Button>
              </div>
              <form className="mt-6 space-y-4" onSubmit={submitAuth}>
                {isSignup ? (
                  <label className="block text-sm font-semibold">
                    Full name
                    <Input
                      className="mt-2"
                      placeholder="Maya Chen"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  </label>
                ) : null}
                <label className="block text-sm font-semibold">
                  Email address
                  <Input
                    className="mt-2"
                    type="email"
                    placeholder="maya@traveloop.ai"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Password
                  <Input
                    className="mt-2"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={8}
                  />
                </label>
                {isSignup ? (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-500">
                    <ShieldCheck className="mr-2 inline size-4" />
                    Strong password pattern detected.
                  </div>
                ) : (
                  <button
                    type="button"
                    className="text-sm font-semibold text-cyan-500 hover:underline"
                    onClick={() => setShowForgot(true)}
                  >
                    Forgot password?
                  </button>
                )}
                {status ? (
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-500">
                    {status}
                  </div>
                ) : null}
                <Button className="w-full" type="submit" size="lg" disabled={auth.isLoading}>
                  {auth.isLoading ? "Working..." : isSignup ? "Create workspace" : "Log in"}
                  <ArrowRight />
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {isSignup ? "Already have an account?" : "New to Traveloop?"}{" "}
                <Link
                  href={isSignup ? "/login" : "/signup"}
                  className="font-bold text-cyan-500"
                >
                  {isSignup ? "Log in" : "Create one"}
                </Link>
              </p>
            </Surface>
          </div>
        </main>
      </div>
      <Modal
        open={showForgot}
        onOpenChange={setShowForgot}
        title="Reset your password"
        description="Enter your email and Traveloop will send a secure reset link."
      >
        <div className="space-y-4">
          <Input type="email" placeholder="maya@traveloop.ai" />
          <Button className="w-full">
            Send reset link
            <Send />
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export function DashboardPage() {
  const dashboard = useDashboardAnalytics();
  const cities = useCities({ limit: 3 });
  const liveTrips = dashboard.data?.upcomingTrips?.map(mapTripToCard) ?? demoTripCards;
  const liveDestinations = cities.data?.cities.map(mapCityToDestination) ?? demoDestinationCards.slice(0, 3);
  const recommendation = dashboard.data?.recommendations?.[0];
  const budgetExposure = numberFrom(dashboard.data?.budgetExposure);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Good morning"
        title={
          liveTrips[0]
            ? `${liveTrips[0].title} is ${liveTrips[0].progress}% planned and getting sharper.`
            : "Your trips are ready for a sharper planning pass."
        }
        description={
          recommendation?.body ??
          "Traveloop found route improvements, budget context, and weather-friendly activity swaps for the next planning session."
        }
        action={
          <Button asChild>
            <Link href="/create-trip">
              <Plus />
              New trip
            </Link>
          </Button>
        }
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Trips active"
          value={String(dashboard.data?.activeTrips ?? liveTrips.length)}
          detail={dashboard.isLoading ? "Refreshing from your workspace." : "Planning, booked, and active itineraries."}
          icon={Route}
        />
        <MetricCard
          label="Budget health"
          value={budgetExposure ? formatCurrency(budgetExposure) : "Ready"}
          detail="Current planned trip exposure across upcoming routes."
          icon={CircleDollarSign}
        />
        <MetricCard
          label="Saved cities"
          value={String(dashboard.data?.savedCities ?? 0)}
          detail="Destinations saved for upcoming planning sessions."
          icon={Ticket}
        />
        <MetricCard
          label="AI suggestions"
          value={String(dashboard.data?.recommendations?.length ?? 2)}
          detail="Route, timing, packing, and spend ideas."
          icon={Sparkles}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Surface className="p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Upcoming itineraries
              </p>
              <h2 className="text-2xl font-black tracking-normal">Trips in motion</h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/trips">View all</Link>
            </Button>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {liveTrips.slice(0, 3).map((trip) => (
              <TripCard key={trip.id} trip={trip} compact />
            ))}
          </div>
        </Surface>

        <div className="space-y-6">
          <GlassPanel className="bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white">
            <Badge variant="glass">AI recommendation</Badge>
            <h3 className="mt-5 text-2xl font-black tracking-normal">
              {recommendation?.title ?? "Swap Osaka day 2 and Kyoto day 4."}
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/72">
              {recommendation?.body ??
                "Rain probability drops by 31%, and the Dotonbori dinner window becomes easier to reserve."}
            </p>
            <Button className="mt-6" variant="glass">
              Apply route update
            </Button>
          </GlassPanel>
          <Surface className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-normal">Workspace status</h3>
              <Badge variant="outline">{dashboard.isLoading ? "Syncing" : "Live"}</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {dashboard.isLoading ? (
                <>
                  <Skeleton className="h-14" />
                  <Skeleton className="h-14 w-10/12" />
                  <Skeleton className="h-14 w-8/12" />
                </>
              ) : (
                (dashboard.data?.notifications.length ? dashboard.data.notifications : [
                  { id: "fallback-1", title: "Demo mode", body: "Log in to sync live trips, budgets, and reminders." }
                ]).map((notification) => (
                  <div key={notification.id} className="rounded-2xl border border-border bg-background/62 p-4">
                    <p className="font-bold">{notification.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
                  </div>
                ))
              )}
            </div>
          </Surface>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Surface className="p-6">
          <div className="mb-5">
            <p className="text-sm font-medium text-muted-foreground">Quick actions</p>
            <h2 className="text-2xl font-black tracking-normal">Command center</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { label: "Build itinerary", href: "/itinerary-builder", icon: Route },
                { label: "Track budget", href: "/budget", icon: WalletCards },
                { label: "Pack faster", href: "/packing", icon: ListChecks },
                { label: "Share trip", href: "/share/japan-loop", icon: Share2 }
              ] satisfies { label: string; href: string; icon: LucideIcon }[]
            ).map(({ label, href, icon: Icon }) => (
              <Button
                key={label}
                asChild
                variant="outline"
                className="h-16 justify-start"
              >
                <Link href={href}>
                  <Icon className="size-4" />
                  {label}
                </Link>
              </Button>
            ))}
          </div>
        </Surface>
        <Surface className="overflow-hidden p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Popular now
              </p>
              <h2 className="text-2xl font-black tracking-normal">
                Destination signals
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/cities">Discover</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {liveDestinations.map((destination) => (
              <div key={destination.id} className="overflow-hidden rounded-3xl">
                <div className="h-32">
                  <img
                    src={destination.image}
                    alt={destination.city}
                    className="size-full object-cover"
                  />
                </div>
                <div className="bg-muted/60 p-4">
                  <p className="font-bold">{destination.city}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {destination.vibe}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </AppShell>
  );
}

export function CreateTripPage() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("Spring in Japan");
  const [description, setDescription] = React.useState(
    "Tokyo, Kyoto, Osaka, food markets, museums, quiet stays..."
  );
  const [startDate, setStartDate] = React.useState("2026-04-02");
  const [endDate, setEndDate] = React.useState("2026-04-13");
  const [budget, setBudget] = React.useState("5500");
  const [status, setStatus] = React.useState<string | null>(null);
  const createTrip = useCreateTrip();

  const submitTrip = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    try {
      await createTrip.mutateAsync({
        title,
        description,
        startDate,
        endDate,
        budgetAmount: numberFrom(budget),
        currency: "USD"
      });
      setStatus("Trip created and synced to your workspace.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create trip");
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Trip studio"
        title="Create a trip from a sentence, then refine it like a pro."
        description="Start with dates, people, budget, and trip style. Traveloop turns it into a multi-city draft with smart defaults."
        action={
          <Button onClick={() => setOpen(true)}>
            <Sparkles />
            Generate with AI
          </Button>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Surface className="p-6">
          <form className="space-y-5" onSubmit={submitTrip}>
            <label className="block text-sm font-semibold">
              Trip name
              <Input
                className="mt-2"
                placeholder="Spring in Japan"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                Start date
                <Input
                  className="mt-2"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-semibold">
                End date
                <Input
                  className="mt-2"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  required
                />
              </label>
            </div>
            <label className="block text-sm font-semibold">
              Destination ideas
              <Textarea
                className="mt-2"
                placeholder="Tokyo, Kyoto, Osaka, food markets, museums, quiet stays..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                Budget
                <Input
                  className="mt-2"
                  inputMode="numeric"
                  placeholder="$5,500"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                />
              </label>
              <label className="block text-sm font-semibold">
                Travelers
                <Input className="mt-2" placeholder="2 adults" />
              </label>
            </div>
            <div>
              <p className="text-sm font-semibold">Trip style</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Food", "Culture", "Design", "Quiet mornings", "Nightlife"].map((tag) => (
                  <Badge key={tag} variant="outline" className="cursor-pointer px-4 py-2">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-coral-500/20 bg-coral-500/10 p-4 text-sm text-coral-500">
              Kyoto hotel prices are trending 14% above your target for Apr 5 - Apr 9.
            </div>
            {status ? (
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-500">
                {status}
              </div>
            ) : null}
            <Button className="w-full" size="lg" type="submit" disabled={createTrip.isPending}>
              {createTrip.isPending ? "Creating..." : "Create trip"}
              <ArrowRight />
            </Button>
          </form>
        </Surface>
        <div className="space-y-6">
          <GlassPanel className="bg-gradient-to-br from-navy-950 to-blue-900 p-6 text-white">
            <div className="flex items-center justify-between">
              <Badge variant="glass">AI draft preview</Badge>
              <Route className="size-5 text-cyan-200" />
            </div>
            <div className="mt-8 space-y-5">
              {cityFlow.slice(0, 3).map((city, index) => (
                <div key={city.id} className="flex gap-4">
                  <span className="mt-1 grid size-9 place-items-center rounded-full bg-cyan-400 text-sm font-black text-navy-950">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-black">{city.city}</p>
                    <p className="mt-1 text-sm text-white/62">
                      {city.stay} - {city.transfer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
          <Surface className="p-6">
            <h3 className="text-xl font-black tracking-normal">Template shortcuts</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Family city break", "Remote work loop", "Food-first weekend", "Outdoor route"].map((template) => (
                <Button key={template} variant="outline" className="justify-start">
                  <MapPin />
                  {template}
                </Button>
              ))}
            </div>
          </Surface>
        </div>
      </div>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Describe your ideal trip"
        description="Traveloop will propose cities, stay lengths, activities, and budget ranges."
      >
        <div className="space-y-4">
          <Textarea placeholder="Two weeks in Japan with food, design shops, quiet hotels, and one art island." />
          <Button className="w-full">
            Generate route
            <Sparkles />
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}

export function MyTripsPage() {
  const trips = useTrips();
  const tripCards = trips.data?.trips.map(mapTripToCard) ?? demoTripCards;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Trip library"
        title="Every planned, active, and shared trip in one calm grid."
        description="Filter by destination, collaborators, budget health, or public sharing status."
        action={<Dropdown label="Sort: upcoming" items={["Upcoming", "Recently edited", "Budget risk", "Shared"]} />}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {trips.isLoading
          ? Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="min-h-[360px]" />)
          : tripCards.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        <Surface className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
          <span className="grid size-14 place-items-center rounded-3xl bg-cyan-400/12 text-cyan-500">
            <Plus className="size-6" />
          </span>
          <h3 className="mt-5 text-xl font-black tracking-normal">Plan another route</h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Empty states should still feel useful. Start a template or ask AI to
            generate a route from saved ideas.
          </p>
          <Button asChild className="mt-6">
            <Link href="/create-trip">Create trip</Link>
          </Button>
        </Surface>
      </div>
    </AppShell>
  );
}

export function ItineraryBuilderPage() {
  const [cities, setCities] = React.useState(cityFlow);
  const [selected, setSelected] = React.useState(cityFlow[1]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Multi-city builder"
        title="Drag the route, tune the days, and let AI clean up the gaps."
        description="A timeline-first planning canvas for city order, transfers, day-by-day activity planning, and smart route recommendations."
        action={
          <Button>
            <Sparkles />
            Optimize route
          </Button>
        }
      />
      <div className="grid gap-6 2xl:grid-cols-[0.72fr_1.28fr]">
        <Surface className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Route ordering
              </p>
              <h2 className="text-2xl font-black tracking-normal">Japan loop</h2>
            </div>
            <Badge variant="coral">11 days</Badge>
          </div>
          <Reorder.Group
            axis="y"
            values={cities}
            onReorder={setCities}
            className="space-y-4"
          >
            {cities.map((city, index) => (
              <Reorder.Item
                key={city.id}
                value={city}
                onClick={() => setSelected(city)}
                className="relative"
              >
                {index < cities.length - 1 ? (
                  <span className="absolute left-7 top-20 h-12 w-px bg-gradient-to-b from-cyan-400 to-violet-500" />
                ) : null}
                <motion.div
                  layout
                  className={cn(
                    "flex cursor-grab gap-4 rounded-3xl border border-border bg-background/76 p-4 shadow-sm backdrop-blur-xl active:cursor-grabbing",
                    selected.id === city.id && "border-cyan-400/60 shadow-glow"
                  )}
                >
                  <span className="mt-1 grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl">
                    <img
                      src={city.image}
                      alt={city.city}
                      className="size-full object-cover"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-500">
                          Stop {index + 1} - {city.date}
                        </p>
                        <h3 className="mt-1 text-xl font-black tracking-normal">
                          {city.city}
                        </h3>
                      </div>
                      <GripVertical className="size-5 text-muted-foreground" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline">{city.stay}</Badge>
                      <Badge variant="outline">{city.transfer}</Badge>
                    </div>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </Surface>

        <div className="space-y-6">
          <GlassPanel className="overflow-hidden bg-gradient-to-br from-navy-950 to-blue-900 text-white">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-72">
                <img
                  src={selected.image}
                  alt={selected.city}
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/36 to-transparent" />
                <div className="absolute inset-x-6 bottom-6">
                  <Badge variant="glass">Selected city</Badge>
                  <h2 className="mt-4 text-4xl font-black tracking-normal">
                    {selected.city}
                  </h2>
                  <p className="mt-2 text-white/66">{selected.transfer}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/58">
                      Day-wise activity plan
                    </p>
                    <h3 className="text-2xl font-black tracking-normal">
                      {selected.stay}
                    </h3>
                  </div>
                  <Button variant="glass">
                    <Plus />
                    Add activity
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {selected.activities.map((activity, index) => (
                    <motion.div
                      key={activity}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="flex items-center gap-4 rounded-3xl border border-white/12 bg-white/10 p-4"
                    >
                      <span className="grid size-10 place-items-center rounded-2xl bg-coral-500 text-sm font-black">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-bold">{activity}</p>
                        <p className="mt-1 text-sm text-white/58">
                          AI-fit slot - light walking - reservation friendly
                        </p>
                      </div>
                      <Clock3 className="size-4 text-cyan-200" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </GlassPanel>

          <div className="grid gap-6 xl:grid-cols-3">
            {(
              [
                {
                  label: "Transfer risk",
                  value: "Low",
                  text: "All city changes are under 3h 30m except Naoshima.",
                  icon: Navigation
                },
                {
                  label: "Weather fit",
                  value: "86%",
                  text: "Outdoor activities avoid rainy windows.",
                  icon: LocateFixed
                },
                {
                  label: "AI ideas",
                  value: "12",
                  text: "Food, culture, and quiet morning suggestions.",
                  icon: Sparkles
                }
              ] satisfies { label: string; value: string; text: string; icon: LucideIcon }[]
            ).map(({ label, value, text, icon: Icon }) => (
              <Surface key={label} className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  <Icon className="size-5 text-cyan-500" />
                </div>
                <p className="mt-3 text-3xl font-black tracking-normal">{value}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
              </Surface>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function TimelinePage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Timeline"
        title="Calendar and route view for every day of the trip."
        description="Activities are grouped by city with time, cost, duration, category, and travel context."
        action={
          <Button variant="outline">
            <CalendarDays />
            Calendar sync
          </Button>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-6">
          <MiniCalendar />
          <Surface className="p-5">
            <h3 className="text-xl font-black tracking-normal">Route map</h3>
            <div className="mt-5 rounded-3xl border border-border bg-gradient-to-br from-blue-600/12 via-cyan-400/10 to-coral-500/10 p-5">
              {cityFlow.map((city, index) => (
                <div key={city.id} className="flex items-center gap-3 py-3">
                  <span className="grid size-9 place-items-center rounded-full bg-cyan-400 text-sm font-black text-navy-950">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold">{city.city}</p>
                    <p className="text-sm text-muted-foreground">{city.transfer}</p>
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </div>
        <div className="space-y-6">
          {timelineDays.map((day) => (
            <Surface key={`${day.city}-${day.day}`} className="p-6">
              <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Badge variant="outline">{day.city}</Badge>
                  <h2 className="mt-3 text-2xl font-black tracking-normal">
                    {day.day} - {day.date}
                  </h2>
                </div>
                <Button variant="outline">
                  <Plus />
                  Add event
                </Button>
              </div>
              <div className="mt-6 space-y-4">
                {day.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="grid gap-4 rounded-3xl border border-border bg-background/62 p-4 sm:grid-cols-[92px_1fr_auto]"
                    >
                      <div>
                        <p className="font-black">{item.time}</p>
                        <p className="text-xs text-muted-foreground">{item.duration}</p>
                      </div>
                      <div className="flex gap-4">
                        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-cyan-400/12 text-cyan-500">
                          <Icon className="size-5" />
                        </span>
                        <div>
                          <h3 className="font-black">{item.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.category}
                          </p>
                        </div>
                      </div>
                      <Badge variant="coral">{item.cost}</Badge>
                    </div>
                  );
                })}
              </div>
            </Surface>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export function CityDiscoveryPage() {
  const [search, setSearch] = React.useState("");
  const [country, setCountry] = React.useState<string | undefined>();
  const cities = useCities({ search, country, limit: 12 });
  const cityCards = cities.data?.cities.map(mapCityToDestination) ?? demoDestinationCards;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Discover cities"
        title="Global destination search with cost, weather, and popularity context."
        description="Explore cities by country, season, estimated cost index, and travel style."
        action={
          <Button variant="outline">
            <SlidersHorizontal />
            Filters
          </Button>
        }
      />
      <Surface className="mb-6 p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-11"
              placeholder="Search Tokyo, Lisbon, Bali, or a vibe like food and beaches"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Dropdown
            label={country ?? "Country"}
            items={["Japan", "Portugal", "France", "Mexico", "Iceland"]}
            onSelect={setCountry}
          />
          <Dropdown label="Cost index" items={["Budget", "Balanced", "Premium", "Luxury"]} />
        </div>
      </Surface>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cities.isLoading
          ? Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-56" />)
          : cityCards.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
      </div>
    </AppShell>
  );
}

export function ActivityDiscoveryPage() {
  const categories = ["Adventure", "Food", "Beaches", "Hiking", "Museums", "Culture", "Nightlife"];
  const [active, setActive] = React.useState("Food");
  const liveActivities = useActivities({ category: active.toUpperCase(), limit: 12 });
  const activityCards = liveActivities.data?.activities.map(mapActivityToCard) ?? demoActivityCards;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Activity marketplace"
        title="Bookable experiences with ratings, timing, price, and AI fit."
        description="Browse curated activities and add them directly into city-day plans."
        action={
          <Button>
            <MapPin />
            Near itinerary
          </Button>
        }
      />
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={cn(
              "rounded-2xl border border-border px-4 py-2 text-sm font-bold transition-all",
              active === category
                ? "bg-coral-500 text-white shadow-lg shadow-coral-500/20"
                : "bg-background/72 text-muted-foreground hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {liveActivities.isLoading
          ? Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-80" />)
          : activityCards.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
      </div>
    </AppShell>
  );
}

export function BudgetAnalyticsPage() {
  const trips = useTrips();
  const selectedTrip = trips.data?.trips[0];
  const budget = useTripBudget(selectedTrip?.id);
  const liveBreakdown = mapBudgetBreakdown(budget.data?.analytics.byCategory);
  const ledger = budget.data?.budget?.items ?? [];
  const totalPlanned = budget.data?.analytics.total ?? budgetBreakdown.reduce((sum, item) => sum + item.value, 0);
  const limit = budget.data?.analytics.limit ?? 6000;
  const remaining = budget.data?.analytics.remaining ?? Math.max(0, limit - totalPlanned);
  const insight = budget.data?.analytics.insights?.[0];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Budget analytics"
        title="Fintech-style travel spend tracking before and during the trip."
        description="See category breakdowns, planned-versus-actual trends, and AI warnings tied to itinerary choices."
        action={
          <Button variant="outline">
            <WalletCards />
            Export report
          </Button>
        }
      />
      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <MetricCard
          label="Total planned"
          value={formatCurrency(totalPlanned)}
          detail={`${formatCurrency(remaining)} remaining against the selected trip limit.`}
          icon={BadgeDollarSign}
        />
        <MetricCard
          label="Daily average"
          value={formatCurrency(totalPlanned / 11)}
          detail={selectedTrip ? `Based on ${selectedTrip.title}.` : "Based on demo trip data."}
          icon={TrendingUp}
        />
        <Surface className="border-coral-500/20 bg-coral-500/10 p-5">
          <Badge variant="coral">AI budget alert</Badge>
          <h3 className="mt-4 text-xl font-black tracking-normal">
            {budget.data?.analytics.utilization
              ? `${budget.data.analytics.utilization}% of trip budget allocated.`
              : "You are exceeding your Paris budget by 18%."}
          </h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {insight ??
              "Shift one dinner reservation or pick the Montmartre hotel alternative to recover $210."}
          </p>
        </Surface>
      </div>
      <BudgetCharts breakdown={liveBreakdown} totalLabel={`${formatCurrency(totalPlanned)} total`} />
      <Surface className="mt-6 p-6">
        <h3 className="text-xl font-black tracking-normal">Category ledger</h3>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="pb-3">Category / item</th>
                <th className="pb-3">Planned</th>
                <th className="pb-3">Actual</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(ledger.length
                ? ledger.map((item) => ({
                  name: item.name,
                  planned: numberFrom(item.amount),
                  actual: numberFrom(item.amount),
                  status: item.isPaid ? "Paid" : "Planned",
                  category: titleCase(item.category)
                }))
                : budgetBreakdown.map((item, index) => ({
                  name: item.name,
                  planned: item.value,
                  actual: item.value + index * 42,
                  status: index === 2 ? "Watch" : "Healthy",
                  category: item.name
                }))
              ).map((item) => (
                <tr key={`${item.category}-${item.name}`} className="border-t border-border">
                  <td className="py-4">
                    <p className="font-bold">{item.category}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.name}</p>
                  </td>
                  <td className="py-4">{formatCurrency(item.planned)}</td>
                  <td className="py-4">{formatCurrency(item.actual)}</td>
                  <td className="py-4">
                    <Badge variant={item.status === "Watch" ? "coral" : "outline"}>{item.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </AppShell>
  );
}

export function PackingChecklistPage() {
  const initial = packingGroups.flatMap((group) =>
    group.items.map((item, index) => ({
      id: `${group.title}-${item}`,
      group: group.title,
      item,
      done: index % 2 === 0
    }))
  );
  const [items, setItems] = React.useState(initial);
  const trips = useTrips();
  const selectedTrip = trips.data?.trips[0];
  const packingList = usePackingList(selectedTrip?.id);
  const togglePacking = useTogglePackingItem(selectedTrip?.id);
  const liveGroups = groupPackingItems(packingList.data?.items);
  const usingLivePacking = liveGroups.length > 0;
  const displayedGroups: PackingGroupModel[] = usingLivePacking
    ? liveGroups
    : packingGroups.map((group) => ({
      title: group.title,
      items: items
        .filter((item) => item.group === group.title)
        .map((item) => ({
          id: item.id,
          name: item.item,
          quantity: 1,
          isPacked: item.done
        }))
    }));
  const displayedItems = displayedGroups.flatMap((group) => group.items);
  const done = displayedItems.filter((item) => item.isPacked).length;
  const progress = displayedItems.length ? Math.round((done / displayedItems.length) * 100) : 0;

  const toggleItem = (entry: PackingGroupModel["items"][number]) => {
    if (usingLivePacking) {
      togglePacking.mutate({ itemId: entry.id, isPacked: !entry.isPacked });
      return;
    }

    setItems((current) =>
      current.map((item) => (item.id === entry.id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Packing checklist"
        title="A focused productivity flow for everything that has to make the bag."
        description="Group essentials, add last-minute items, and watch packing progress move as you check items off."
        action={
          <Button>
            <Plus />
            Add item
          </Button>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <Surface className="p-6">
          <Badge variant="outline">{selectedTrip?.title ?? "Japan loop"}</Badge>
          <p className="mt-5 text-5xl font-black tracking-normal">{progress}%</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {done} of {displayedItems.length} items packed
          </p>
          <Progress value={progress} className="mt-5" />
          <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="font-bold text-cyan-500">AI reminder</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Kyoto forecast suggests adding a compact umbrella and water-resistant
              shoes.
            </p>
          </div>
        </Surface>
        <div className="space-y-5">
          {displayedGroups.map((group) => (
            <Surface key={group.title} className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black tracking-normal">{group.title}</h2>
                <Button size="icon" variant="outline" aria-label={`Add ${group.title} item`}>
                  <Plus />
                </Button>
              </div>
              <div className="mt-5 space-y-3">
                {group.items
                  .map((entry) => (
                    <motion.button
                      key={entry.id}
                      layout
                      className="flex w-full items-center gap-4 rounded-2xl border border-border bg-background/62 p-4 text-left transition-all hover:bg-muted/70"
                      onClick={() => toggleItem(entry)}
                    >
                      <span
                        className={cn(
                          "grid size-7 place-items-center rounded-xl border transition-all",
                          entry.isPacked
                            ? "border-cyan-500 bg-cyan-500 text-white"
                            : "border-border"
                        )}
                      >
                        <AnimatePresence>
                          {entry.isPacked ? (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Check className="size-4" />
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </span>
                      <span className={cn("font-semibold", entry.isPacked && "text-muted-foreground line-through")}>
                        {entry.name}
                        {entry.quantity > 1 ? ` x${entry.quantity}` : ""}
                      </span>
                      <Minus className="ml-auto size-4 text-muted-foreground" />
                    </motion.button>
                  ))}
              </div>
            </Surface>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export function JournalPage() {
  const trips = useTrips();
  const selectedTrip = trips.data?.trips[0];
  const journals = useJournals(selectedTrip?.id);
  const createJournal = useCreateJournal();
  const [title, setTitle] = React.useState("Kyoto shifted the pace");
  const [content, setContent] = React.useState(
    "Moved the bamboo grove to sunrise and added a quiet tea house AI found two streets away. Need to add the ceramics shop to the public itinerary."
  );
  const [status, setStatus] = React.useState<string | null>(null);
  const liveEntries = journals.data?.notes.map(mapNoteToJournalEntry) ?? demoJournalCards;

  const submitJournal = async () => {
    setStatus(null);

    try {
      await createJournal.mutateAsync({
        tripId: selectedTrip?.id,
        title,
        content
      });
      setStatus("Entry saved to your journal.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save entry");
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Trip journal"
        title="A minimalist travel diary for notes, reminders, and image memories."
        description="Write rich notes while Traveloop keeps them attached to cities, days, and shareable moments."
        action={
          <Button>
            <ImagePlus />
            New entry
          </Button>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[0.76fr_1.24fr]">
        <Surface className="p-6">
          <h2 className="text-2xl font-black tracking-normal">Today&apos;s note</h2>
          <Input
            className="mt-5"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Textarea
            className="mt-4 min-h-64"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          {status ? (
            <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-500">
              {status}
            </div>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button variant="outline">
              <MapPin />
              Attach place
            </Button>
            <Button onClick={submitJournal} disabled={createJournal.isPending}>
              {createJournal.isPending ? "Saving..." : "Save entry"}
              <Check />
            </Button>
          </div>
        </Surface>
        <div className="space-y-5">
          {journals.isLoading
            ? Array.from({ length: 2 }, (_, index) => <Skeleton key={index} className="h-64" />)
            : liveEntries.map((entry) => (
              <Surface key={entry.id} className="overflow-hidden">
                <div className="grid gap-0 md:grid-cols-[240px_1fr]">
                  <img
                    src={entry.image}
                    alt={entry.title}
                    className="h-56 w-full object-cover md:h-full"
                  />
                  <div className="p-6">
                    <Badge variant="outline">{entry.date}</Badge>
                    <h3 className="mt-4 text-2xl font-black tracking-normal">{entry.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{entry.text}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Badge variant="coral">Reminder</Badge>
                      <Badge variant="outline">Photo attached</Badge>
                      <Badge variant="outline">Public-ready</Badge>
                    </div>
                  </div>
                </div>
              </Surface>
            ))}
        </div>
      </div>
    </AppShell>
  );
}

export function SharedItineraryPage({ slug = "japan-loop" }: { slug?: string }) {
  const shared = useSharedTrip(slug);
  const trip = shared.data?.trip;
  const tripCard = trip ? mapTripToCard(trip) : demoTripCards[0];
  const sharedDays =
    trip?.destinations?.map((destination, index) => ({
      city: destination.city.name,
      day: `Stop ${index + 1}`,
      items:
        destination.tripActivities?.map((activity) => ({
          time: activity.startTime ?? "Flexible",
          title: activity.title,
          duration: `${activity.durationMinutes ?? 60} min`,
          cost: formatCurrency(activity.estimatedCost)
        })) ?? []
    })) ?? timelineDays;
  const galleryImages =
    trip?.destinations
      ?.map((destination) => destination.city.imageUrl)
      .filter((image): image is string => Boolean(image)) ?? journalEntries.map((entry) => entry.image);
  const durationDays =
    trip && !Number.isNaN(new Date(trip.endDate).getTime())
      ? Math.max(1, Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86_400_000))
      : 11;

  return (
    <div className="min-h-screen bg-mesh-light text-foreground dark:bg-app-gradient">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-navy-950/45 backdrop-blur-2xl">
        <div className="container flex h-20 items-center justify-between text-white">
          <BrandMark />
          <div className="flex items-center gap-2">
            <Button variant="glass">
              <Copy />
              Copy trip
            </Button>
            <Button>
              <Share2 />
              Share
            </Button>
          </div>
        </div>
      </header>
      <section className="relative min-h-[78vh] pt-24 text-white">
        <img
          src={tripCard.image}
          alt={`${tripCard.title} public itinerary`}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/54 to-navy-950/20" />
        <div className="container relative flex min-h-[calc(78vh-6rem)] items-end pb-12">
          <div className="max-w-4xl">
            <Badge variant="glass">Public itinerary</Badge>
            <h1 className="mt-5 text-balance text-5xl font-black tracking-normal sm:text-7xl">
              {tripCard.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
              {trip?.description ??
                "An 11-day route with food markets, quiet hotels, art islands, and a polished itinerary you can copy into your own Traveloop workspace."}
            </p>
          </div>
        </div>
      </section>
      <main className="container py-16">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <Surface className="p-6">
            <h2 className="text-2xl font-black tracking-normal">Trip snapshot</h2>
            <div className="mt-6 space-y-4">
              {[
                ["Duration", `${durationDays} days`],
                ["Cities", tripCard.cities.join(", ")],
                ["Budget", tripCard.budget],
                ["Travel style", trip?.aiSummary ?? "Food, culture, design"]
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-border pb-3">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-bold">{value}</span>
                </div>
              ))}
            </div>
          </Surface>
          <Surface className="p-6">
            <h2 className="text-2xl font-black tracking-normal">Itinerary story</h2>
            <div className="mt-6 space-y-5">
              {sharedDays.map((day) => (
                <div key={day.day} className="rounded-3xl border border-border p-5">
                  <Badge variant="outline">
                    {day.city} - {day.day}
                  </Badge>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {day.items.map((item) => (
                      <div key={item.title} className="rounded-2xl bg-muted/60 p-4">
                        <p className="text-sm font-bold text-cyan-500">{item.time}</p>
                        <p className="mt-2 font-black">{item.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.duration} - {item.cost}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {galleryImages.slice(0, 4).map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`${tripCard.title} gallery ${index + 1}`}
              className="h-72 rounded-3xl object-cover shadow-premium"
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export function SettingsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="User settings"
        title="Control your profile, preferences, privacy, and AI planning defaults."
        description="A quiet settings surface with the account controls a serious travel product needs."
        action={
          <Button>
            <Check />
            Save changes
          </Button>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <Surface className="p-6">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xl font-black text-white">
              MC
            </div>
            <div>
              <h2 className="text-xl font-black tracking-normal">Maya Chen</h2>
              <p className="text-sm text-muted-foreground">maya@traveloop.ai</p>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {["Profile", "Planning defaults", "Notifications", "Privacy", "Billing"].map((item, index) => (
              <button
                key={item}
                className={cn(
                  "w-full rounded-2xl px-4 py-3 text-left text-sm font-bold transition-all",
                  index === 0 ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </Surface>
        <Surface className="p-6">
          <h2 className="text-2xl font-black tracking-normal">Profile details</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Name
              <Input className="mt-2" defaultValue="Maya Chen" />
            </label>
            <label className="block text-sm font-semibold">
              Email
              <Input className="mt-2" defaultValue="maya@traveloop.ai" />
            </label>
            <label className="block text-sm font-semibold">
              Home airport
              <Input className="mt-2" defaultValue="SFO" />
            </label>
            <label className="block text-sm font-semibold">
              Currency
              <Input className="mt-2" defaultValue="USD" />
            </label>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ["AI planning memory", "Use previous trips to tune future suggestions."],
              ["Budget alerts", "Notify when any city exceeds planned spend."],
              ["Public sharing", "Allow itinerary pages to be copied by viewers."],
              ["Email digests", "Weekly route and fare updates."]
            ].map(([title, text], index) => (
              <label
                key={title}
                className="flex cursor-pointer items-start gap-4 rounded-3xl border border-border p-4"
              >
                <input
                  type="checkbox"
                  defaultChecked={index !== 3}
                  className="mt-1 size-5 rounded border-border accent-cyan-500"
                />
                <span>
                  <span className="block font-bold">{title}</span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    {text}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </Surface>
      </div>
    </AppShell>
  );
}

export function AdminDashboardPage() {
  const admin = useAdminAnalytics();
  const metrics = admin.data
    ? [
      { label: "Users", value: admin.data.metrics.totalUsers.toLocaleString(), delta: "Live" },
      { label: "Trips", value: admin.data.metrics.totalTrips.toLocaleString(), delta: "Live" },
      { label: "Public shares", value: admin.data.metrics.sharedTrips.toLocaleString(), delta: "Live" },
      { label: "Activities", value: admin.data.metrics.activities.toLocaleString(), delta: "Live" }
    ]
    : adminMetrics;
  const popularActivities = demoActivityCards.slice(0, 5);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Admin analytics"
        title="SaaS metrics for growth, activity trends, and destination demand."
        description="Operational analytics for Traveloop usage, itinerary creation, city popularity, and engagement."
        action={
          <Button variant="outline">
            <LockKeyhole />
            Admin controls
          </Button>
        }
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Surface key={metric.label} className="p-5">
            <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-3xl font-black tracking-normal">{metric.value}</p>
              <Badge variant="coral">{metric.delta}</Badge>
            </div>
          </Surface>
        ))}
      </div>
      <div className="mt-6">
        <AdminCharts />
      </div>
      <Surface className="mt-6 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-black tracking-normal">Activity trends</h3>
          <Badge variant="outline">Marketplace</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="pb-3">Category</th>
                <th className="pb-3">Bookings</th>
                <th className="pb-3">Avg. rating</th>
                <th className="pb-3">Momentum</th>
              </tr>
            </thead>
            <tbody>
              {popularActivities.map((activity, index) => (
                <tr key={activity.title} className="border-t border-border">
                  <td className="py-4 font-bold">{activity.category}</td>
                  <td className="py-4">{(12800 - index * 980).toLocaleString()}</td>
                  <td className="py-4">{activity.rating}</td>
                  <td className="py-4">
                    <Badge variant="outline">+{18 - index * 2}%</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </AppShell>
  );
}
