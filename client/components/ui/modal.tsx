"use client";

import { X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className
}: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-navy-950/70 p-4 backdrop-blur-lg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={cn(
          "w-full max-w-xl rounded-3xl border border-white/15 bg-background p-6 shadow-glow",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="modal-title" className="text-xl font-bold">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <Button
            aria-label="Close modal"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X />
          </Button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
