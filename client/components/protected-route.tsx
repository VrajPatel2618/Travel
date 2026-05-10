"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/panel";
import { useAuthStore } from "@/stores/auth-store";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.accessToken);

  if (!token) {
    return (
      <div className="grid min-h-screen place-items-center bg-mesh-light p-6 dark:bg-app-gradient">
        <Surface className="max-w-md p-8 text-center">
          <h1 className="text-2xl font-black tracking-normal">Sign in to continue</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Protected Traveloop workspaces require a valid access token.
          </p>
          <Button asChild className="mt-6">
            <Link href="/login">Log in</Link>
          </Button>
        </Surface>
      </div>
    );
  }

  return <>{children}</>;
}
