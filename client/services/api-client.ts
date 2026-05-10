"use client";

import { useAuthStore, type SessionUser } from "@/stores/auth-store";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type SessionResponse = {
  user: SessionUser;
  session: {
    accessToken: string;
    refreshToken?: string;
  };
  emailVerificationToken?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class TraveloopApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function parseResponse<T>(response: Response) {
  const json = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !json?.success) {
    throw new TraveloopApiError(
      response.status,
      json?.message ?? "Traveloop API request failed",
      "details" in (json ?? {}) ? (json as { details?: unknown }).details : undefined
    );
  }

  return json.data;
}

async function refreshSession() {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  const data = await parseResponse<SessionResponse>(response);
  useAuthStore.getState().setSession({
    user: data.user,
    accessToken: data.session.accessToken
  });
  return data.session.accessToken;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  retry = true
): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store"
  });

  if (response.status === 401 && retry) {
    try {
      const nextToken = await refreshSession();
      headers.set("Authorization", `Bearer ${nextToken}`);
      return apiRequest<T>(path, { ...init, headers }, false);
    } catch {
      useAuthStore.getState().clearSession();
    }
  }

  return parseResponse<T>(response);
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => apiRequest<T>(path, { method: "DELETE" })
};
