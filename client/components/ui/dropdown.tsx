"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DropdownProps = {
  label: string;
  items: string[];
  onSelect?: (item: string) => void;
  className?: string;
};

export function Dropdown({ label, items, onSelect, className }: DropdownProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <ChevronDown className={cn("transition-transform", open && "rotate-180")} />
      </Button>
      {open ? (
        <div className="absolute right-0 z-30 mt-2 min-w-48 rounded-2xl border border-border bg-background/95 p-2 shadow-premium backdrop-blur-xl">
          {items.map((item) => (
            <button
              key={item}
              className="w-full rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
              onClick={() => {
                onSelect?.(item);
                setOpen(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
