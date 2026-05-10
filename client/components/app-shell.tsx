"use client";

import {
  Bell,
  Command,
  Menu,
  PlaneTakeoff,
  Search,
  Sparkles,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Traveloop home">
      <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-violet-500 text-white shadow-glow">
        <PlaneTakeoff className="size-5" />
      </span>
      {!compact ? (
        <span>
          <span className="block text-lg font-black tracking-normal">Traveloop</span>
          <span className="block text-xs font-medium text-muted-foreground">
            AI travel OS
          </span>
        </span>
      ) : null}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-mesh-light text-foreground dark:bg-app-gradient">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-background/82 px-4 py-5 shadow-premium backdrop-blur-2xl transition-transform dark:bg-navy-950/72 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <BrandMark />
          <Button
            aria-label="Close navigation"
            className="lg:hidden"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </div>
        <nav className="mt-8 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
                  active &&
                    "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/20 hover:text-white"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 dark:bg-cyan-400/8">
          <div className="flex items-center gap-2 text-sm font-bold text-cyan-500">
            <Sparkles className="size-4" />
            AI routing active
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Traveloop is watching fare shifts, weather, and overbooked activity windows.
          </p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-2xl dark:bg-navy-950/58">
          <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Button
              aria-label="Open navigation"
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </Button>
            <div className="relative hidden flex-1 md:block">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-12 max-w-2xl pl-11"
                placeholder="Search trips, cities, notes, bookings..."
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden md:inline-flex">
                <Command className="size-4" />
                AI command
              </Button>
              <ThemeToggle />
              <Button aria-label="Notifications" variant="outline" size="icon">
                <Bell />
              </Button>
              <Dropdown
                label="Maya"
                items={["Profile", "Billing", "Team workspace", "Sign out"]}
              />
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-cyan-500">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-balance text-3xl font-black tracking-normal sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
