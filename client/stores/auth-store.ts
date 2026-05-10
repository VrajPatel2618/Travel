"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: "USER" | "ADMIN";
  emailVerifiedAt?: string | null;
};

type AuthState = {
  user: SessionUser | null;
  accessToken: string | null;
  setSession: (session: { user: SessionUser; accessToken: string }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: (session) => set({ user: session.user, accessToken: session.accessToken }),
      clearSession: () => set({ user: null, accessToken: null })
    }),
    {
      name: "traveloop-session",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken
      })
    }
  )
);
