"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";

import { apiRequest, type SessionResponse } from "@/services/api-client";
import { useAuthStore } from "@/stores/auth-store";

function SessionBootstrap() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  React.useEffect(() => {
    if (accessToken) return;

    let active = true;

    apiRequest<SessionResponse>(
      "/auth/refresh",
      { method: "POST", body: JSON.stringify({}) },
      false
    )
      .then((data) => {
        if (!active) return;
        setSession({
          user: data.user,
          accessToken: data.session.accessToken
        });
      })
      .catch(() => {
        if (active) clearSession();
      });

    return () => {
      active = false;
    };
  }, [accessToken, clearSession, setSession]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1
          },
          mutations: {
            retry: 0
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrap />
      {children}
    </QueryClientProvider>
  );
}
