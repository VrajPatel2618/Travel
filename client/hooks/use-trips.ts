"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/services/api-client";
import { useAuthStore } from "@/stores/auth-store";
import type {
  AdminAnalytics,
  ApiActivity,
  ApiCity,
  ApiJournalNote,
  ApiMeta,
  ApiPackingList,
  ApiTrip,
  BudgetResponse,
  DashboardAnalytics,
  SharedTripResponse
} from "@/lib/api-mappers";

export type TripPayload = {
  title: string;
  description?: string;
  coverImageUrl?: string;
  startDate: string;
  endDate: string;
  budgetAmount?: number;
  currency?: string;
  destinationIds?: string[];
};

function queryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });

  const value = search.toString();
  return value ? `?${value}` : "";
}

export function useTrips() {
  const token = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["trips"],
    queryFn: () => api.get<{ trips: ApiTrip[]; meta: ApiMeta }>("/trips"),
    enabled: Boolean(token)
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TripPayload) => api.post("/trips", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips"] })
  });
}

export function useDashboardAnalytics() {
  const token = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: () => api.get<DashboardAnalytics>("/analytics/dashboard"),
    enabled: Boolean(token)
  });
}

export function useCities(params: { search?: string; country?: string; limit?: number } = {}) {
  return useQuery({
    queryKey: ["cities", params],
    queryFn: () =>
      api.get<{ cities: ApiCity[]; meta: ApiMeta }>(
        `/cities${queryString({ search: params.search, country: params.country, limit: params.limit ?? 12 })}`
      )
  });
}

export function useActivities(params: { search?: string; category?: string; limit?: number } = {}) {
  return useQuery({
    queryKey: ["activities", params],
    queryFn: () =>
      api.get<{ activities: ApiActivity[]; meta: ApiMeta }>(
        `/activities${queryString({
          search: params.search,
          category: params.category,
          limit: params.limit ?? 12
        })}`
      )
  });
}

export function useTripBudget(tripId?: string) {
  const token = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["budget", tripId],
    queryFn: () => api.get<BudgetResponse>(`/budgets/trips/${tripId}`),
    enabled: Boolean(token && tripId)
  });
}

export function usePackingList(tripId?: string) {
  const token = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["packing", tripId],
    queryFn: () => api.get<ApiPackingList>(`/packing/trips/${tripId}`),
    enabled: Boolean(token && tripId)
  });
}

export function useTogglePackingItem(tripId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { itemId: string; isPacked: boolean }) =>
      api.patch(`/packing/trips/${tripId}/items/${input.itemId}`, { isPacked: input.isPacked }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["packing", tripId] })
  });
}

export function useJournals(tripId?: string) {
  const token = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["journals", tripId],
    queryFn: () =>
      api.get<{ notes: ApiJournalNote[]; meta: ApiMeta }>(
        `/journals${queryString({ tripId, limit: 12 })}`
      ),
    enabled: Boolean(token)
  });
}

export function useCreateJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { tripId?: string; title: string; content: string; type?: string }) =>
      api.post("/journals", { ...input, type: input.type ?? "JOURNAL" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journals"] })
  });
}

export function useSharedTrip(slug?: string) {
  return useQuery({
    queryKey: ["sharing", slug],
    queryFn: () => api.get<SharedTripResponse>(`/sharing/public/${slug}`),
    enabled: Boolean(slug)
  });
}

export function useAdminAnalytics() {
  const token = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["analytics", "admin"],
    queryFn: () => api.get<AdminAnalytics>("/analytics/admin"),
    enabled: Boolean(token && user?.role === "ADMIN")
  });
}
