const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.API_INTERNAL_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
    : process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type ScreeningStatus = "clear" | "review" | "blocked";

export type Screening = {
  id: number;
  subject_name: string;
  country: string | null;
  status: ScreeningStatus;
  risk_score: number;
  rationale: string;
  created_at: string;
  hits: {
    source: string;
    matched_name: string;
    score: number;
    notes: string;
  }[];
};

export async function getScreenings(): Promise<Screening[]> {
  return fetchList<Screening>("/api/screenings");
}

export async function getMonitoringQueue(): Promise<Screening[]> {
  return fetchList<Screening>("/api/monitoring");
}

export async function createScreening(payload: {
  subject_name: string;
  country: string | null;
}): Promise<Screening> {
  return fetchJson<Screening>("/api/screenings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function loginUser(payload: { username: string; password: string }) {
  const token = await fetchJson<{ access_token: string; token_type: string }>("/api/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: payload.username, password: payload.password })
  });

  if (typeof window !== "undefined") {
    window.localStorage.setItem("tenar_access_token", token.access_token);
    window.localStorage.setItem("tenar_username", payload.username);
  }

  return token;
}

export async function registerUser(payload: {
  username: string;
  password: string;
  full_name?: string;
}) {
  return fetchJson<{
    id: number;
    username: string;
    full_name: string | null;
    is_active: boolean;
  }>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("tenar_access_token");
    window.localStorage.removeItem("tenar_username");
  }
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("tenar_access_token");
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    ...(init?.headers as HeadersInit),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`TENAR API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchList<T>(path: string): Promise<T[]> {
  try {
    return await fetchJson<T[]>(path, { next: { revalidate: 0 } });
  } catch (error) {
    console.warn(`TENAR API unavailable for ${path}`, error);
    return [];
  }
}
