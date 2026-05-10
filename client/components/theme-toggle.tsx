"use client";

import { Moon, Sun } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("traveloop-theme", next ? "dark" : "light");
  };

  return (
    <Button
      aria-label="Toggle theme"
      variant="outline"
      size="icon"
      onClick={toggle}
      className="bg-background/70"
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
