import * as React from "react";

import { cn } from "@/lib/utils";

function GlassPanel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/14 bg-white/10 shadow-premium backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.07]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function Surface({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-card/80 shadow-premium backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { GlassPanel, Surface };
