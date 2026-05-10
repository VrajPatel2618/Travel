"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api, type SessionResponse } from "@/services/api-client";
import { useAuthStore } from "@/stores/auth-store";

export function useAuthActions() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const onSession = (data: SessionResponse) => {
    setSession({
      user: data.user,
      accessToken: data.session.accessToken
    });
    queryClient.invalidateQueries();
    return data;
  };

  const login = useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      api.post<SessionResponse>("/auth/login", input),
    onSuccess: onSession
  });

  const signup = useMutation({
    mutationFn: (input: { name: string; email: string; password: string }) =>
      api.post<SessionResponse>("/auth/signup", input),
    onSuccess: onSession
  });

  const logout = useMutation({
    mutationFn: () => api.post<null>("/auth/logout"),
    onSettled: () => {
      clearSession();
      queryClient.clear();
    }
  });

  return {
    login: login.mutateAsync,
    signup: signup.mutateAsync,
    logout: logout.mutateAsync,
    isLoading: login.isPending || signup.isPending || logout.isPending,
    error: login.error ?? signup.error ?? logout.error
  };
}
