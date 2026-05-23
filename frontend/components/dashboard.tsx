"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, CheckCircle2, FileSearch, Moon, ShieldCheck, Sun } from "lucide-react";
import { ScreeningForm } from "./screening-form";
import { ComplianceAssistant } from "./compliance-assistant";
import { getMonitoringQueue, getScreenings, loginUser, logoutUser } from "@/lib/api";
import type { Screening } from "@/lib/api";
import { SearchHistorySidebar } from "./search-history-sidebar";

type SearchHistoryItem = {
  subject_name: string;
  country: string | null;
  status: string;
  created_at: string;
};

const SEARCH_HISTORY_KEY = "tenar_search_history";
const THEME_KEY = "tenar_theme";

export function Dashboard() {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [monitoring, setMonitoring] = useState<Screening[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [token, setToken] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      const [screeningsData, monitoringData] = await Promise.all([getScreenings(), getMonitoringQueue()]);
      setScreenings(screeningsData);
      setMonitoring(monitoringData);
      setIsLoading(false);
    }

    loadDashboard();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = window.localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
    }

    const savedHistory = window.localStorage.getItem(SEARCH_HISTORY_KEY);
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory) as SearchHistoryItem[]);
    }

    const savedToken = window.localStorage.getItem("tenar_access_token");
    const savedUser = window.localStorage.getItem("tenar_username");

    if (savedToken) {
      setToken(savedToken);
      setAuthUser(savedUser);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function handleThemeToggle() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError(null);

    try {
      await loginUser({ username: usernameInput, password: passwordInput });
      setToken(window.localStorage.getItem("tenar_access_token"));
      setAuthUser(window.localStorage.getItem("tenar_username"));
      setUsernameInput("");
      setPasswordInput("");
    } catch (error) {
      setAuthError("Login failed. Check credentials and try again.");
    }
  }

  function handleLogout() {
    logoutUser();
    setToken(null);
    setAuthUser(null);
  }

  function addSearchHistory(item: SearchHistoryItem) {
    setSearchHistory((current) => {
      const next = [item, ...current.filter((entry) => entry.subject_name !== item.subject_name)].slice(0, 10);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
      }
      return next;
    });
  }

  function handleResult(result: Screening) {
    setScreenings((current) => [result, ...current]);
    setMonitoring((current) =>
      result.status === "review" || result.status === "blocked" ? [result, ...current] : current
    );
    addSearchHistory({
      subject_name: result.subject_name,
      country: result.country,
      status: result.status,
      created_at: result.created_at
    });
  }

  const blocked = useMemo(() => screenings.filter((item) => item.status === "blocked").length, [screenings]);
  const review = useMemo(() => screenings.filter((item) => item.status === "review").length, [screenings]);
  const clear = useMemo(() => screenings.filter((item) => item.status === "clear").length, [screenings]);
  const averageRisk = useMemo(() => {
    if (!screenings.length) return 0;
    return Math.round((screenings.reduce((sum, item) => sum + item.risk_score, 0) / screenings.length) * 100);
  }, [screenings]);

  const auditEvents = useMemo(
    () =>
      screenings.slice(0, 5).map((screening) => ({
        id: screening.id,
        title: `${screening.subject_name} ${
          screening.status === "clear" ? "cleared" : screening.status === "blocked" ? "blocked" : "flagged for review"
        }`,
        subtitle: new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(
          new Date(screening.created_at)
        ),
        status: screening.status
      })),
    [screenings]
  );

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Export compliance command center</p>
          <h1>TENAR</h1>
        </div>
        <div className="topbar-actions">
          <button className="theme-toggle" type="button" onClick={handleThemeToggle} aria-label="Toggle dark mode">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <Link href="/login" className="nav-link">
            Login
          </Link>
          <Link href="/register" className="nav-link">
            Register
          </Link>
          <span className="status-pill">
            <Activity size={16} />
            Live monitoring
          </span>
        </div>
      </header>

      {!token ? (
        <section className="panel auth-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">User authentication</p>
              <h2>Sign in to screen</h2>
            </div>
          </div>
          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              Username
              <input
                value={usernameInput}
                onChange={(event) => setUsernameInput(event.target.value)}
                placeholder="admin"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
                placeholder="••••••••"
                required
              />
            </label>
            <button className="primary-button" type="submit">
              Sign in
            </button>
            {authError ? <p className="form-message">{authError}</p> : null}
          </form>
        </section>
      ) : (
        <section className="panel auth-status">
          <div>
            <p className="eyebrow">Signed in as</p>
            <strong>{authUser ?? "authenticated user"}</strong>
          </div>
          <button className="icon-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        </section>
      )}

      <section className="metrics" aria-label="Compliance metrics">
        <Metric icon={<FileSearch size={20} />} label="Screenings" value={screenings.length.toString()} />
        <Metric icon={<AlertTriangle size={20} />} label="Needs review" value={review.toString()} tone="amber" />
        <Metric icon={<ShieldCheck size={20} />} label="Blocked" value={blocked.toString()} tone="red" />
        <Metric icon={<CheckCircle2 size={20} />} label="Avg risk" value={`${averageRisk}%`} tone="green" />
      </section>

      <section className="workspace dashboard-grid">
        <SearchHistorySidebar items={searchHistory} />

        <div className="main-stack">
          <ScreeningForm onResult={handleResult} isAuthenticated={Boolean(token)} />

          <ComplianceAssistant
            totalScreenings={screenings.length}
            reviewCount={review}
            blockedCount={blocked}
            averageRisk={averageRisk}
          />

          <div className="panel compliance-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Compliance overview</p>
                <h2>AI risk dashboard</h2>
              </div>
              <span>{monitoring.length} active alerts</span>
            </div>

            <div className="dashboard-summary">
              <div>
                <strong>{review + blocked}</strong>
                <span>Pending remediation</span>
              </div>
              <div>
                <strong>{clear}</strong>
                <span>Recent clearances</span>
              </div>
              <div>
                <strong>{averageRisk}%</strong>
                <span>Portfolio risk score</span>
              </div>
            </div>

            <div className="dashboard-chart-placeholder">
              <div />
              <div />
              <div />
              <div />
            </div>

            <div className="panel-heading">
              <div>
                <p className="eyebrow">Recent activity</p>
                <h2>Audit logs</h2>
              </div>
            </div>
            <div className="audit-log">
              {auditEvents.length === 0 ? (
                <p className="empty">No audit events recorded yet.</p>
              ) : (
                auditEvents.map((event) => (
                  <article className="audit-event" key={event.id}>
                    <div>
                      <strong>{event.title}</strong>
                      <span>{event.subtitle}</span>
                    </div>
                    <span className={`badge ${event.status}`}>{event.status}</span>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="panel queue-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Queue</p>
              <h2>Monitoring</h2>
            </div>
            <span>{monitoring.length} open</span>
          </div>

          {monitoring.length === 0 ? (
            <p className="empty">No open review items.</p>
          ) : (
            <div className="queue">
              {monitoring.map((item) => (
                <article className="queue-item" key={item.id}>
                  <div>
                    <strong>{item.subject_name}</strong>
                    <p>{item.rationale}</p>
                  </div>
                  <span className={`badge ${item.status}`}>{item.status}</span>
                </article>
              ))}
            </div>
          )}

          <div className="panel-heading">
            <div>
              <p className="eyebrow">Screening history</p>
              <h2>Audit trail</h2>
            </div>
            <span>{screenings.length} checks</span>
          </div>

          <div className="table">
            <div className="table-row table-head">
              <span>Subject</span>
              <span>Country</span>
              <span>Status</span>
              <span>Risk</span>
            </div>
            {screenings.map((item) => (
              <div className="table-row" key={item.id}>
                <span>{item.subject_name}</span>
                <span>{item.country ?? "NA"}</span>
                <span className={`badge ${item.status}`}>{item.status}</span>
                <span>{Math.round(item.risk_score * 100)}%</span>
              </div>
            ))}
            {screenings.length === 0 ? <p className="empty table-empty">No screenings yet.</p> : null}
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <span>Loading compliance data...</span>
        </div>
      ) : null}
    </main>
  );
}

function Metric({ icon, label, value, tone = "blue" }: { icon: React.ReactNode; label: string; value: string; tone?: "blue" | "amber" | "red" | "green" }) {
  return (
    <article className={`metric ${tone}`}>
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
