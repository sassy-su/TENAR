"use client";

import { type FormEvent, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { createScreening, type Screening } from "@/lib/api";

type ScreeningFormProps = {
  onResult?: (result: Screening) => void;
  isAuthenticated?: boolean;
};

export function ScreeningForm({ onResult, isAuthenticated = false }: ScreeningFormProps) {
  const [subjectName, setSubjectName] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [latestResult, setLatestResult] = useState<Screening | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClear() {
    setSubjectName("");
    setCountry("");
    setMessage("");
    setLatestResult(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      try {
        const result = await createScreening({
          subject_name: String(formData.get("subjectName") ?? ""),
          country: String(formData.get("country") ?? "") || null
        });
        setLatestResult(result);
        onResult?.(result);
        setSubjectName("");
        setCountry("");
        setMessage(`${result.subject_name} screened as ${result.status}.`);
      } catch (error) {
        if (error instanceof Error && error.message.includes("401")) {
          setMessage("Authentication required. Please sign in and try again.");
        } else {
          setMessage("Backend API is unavailable. Start the backend, then try again.");
        }
      }
    });
  }

  return (
    <form className="panel screening-form" onSubmit={handleSubmit}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Denied party screening</p>
          <h2>New Check</h2>
        </div>
        <button className="icon-button" type="submit" disabled={isPending} aria-label="Run screening">
          <Search size={18} />
        </button>
      </div>

      <label>
        Subject name
        <input
          name="subjectName"
          value={subjectName}
          onChange={(event) => setSubjectName(event.target.value)}
          placeholder="Acme Restricted Trading"
          required
        />
      </label>

      <label>
        Country
        <input
          name="country"
          value={country}
          onChange={(event) => setCountry(event.target.value.toUpperCase())}
          placeholder="US"
          maxLength={2}
        />
      </label>

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={isPending || !isAuthenticated}>
          {isPending ? "Screening..." : isAuthenticated ? "Run Screening" : "Sign in to screen"}
        </button>
        <button className="secondary-button" type="button" onClick={handleClear} disabled={isPending}>
          Clear
        </button>
      </div>

      {!isAuthenticated ? (
        <p className="form-message">Please sign in before submitting a screening.</p>
      ) : null}
      {message ? <p className="form-message">{message}</p> : null}

      {latestResult ? (
        <section className={`result-card ${latestResult.status}`}>
          <div className="result-card-header">
            <div>
              <p className="eyebrow">Screening result</p>
              <h2>{latestResult.subject_name}</h2>
            </div>
            <span className={`badge ${latestResult.status}`}>{latestResult.status}</span>
          </div>

          <div className="result-metrics">
            <div>
              <span>AI risk score</span>
              <strong>{Math.round(latestResult.risk_score * 100)}%</strong>
            </div>
            <div>
              <span>Country</span>
              <strong>{latestResult.country ?? "Global"}</strong>
            </div>
            <div>
              <span>Rationale</span>
              <strong>{latestResult.rationale}</strong>
            </div>
          </div>

          <div className="match-table">
            <div className="match-row match-table-header">
              <span>Source</span>
              <span>Matched party</span>
              <span>Confidence</span>
              <span>Notes</span>
            </div>
            {latestResult.hits.length > 0 ? (
              latestResult.hits.map((hit, index) => (
                <div className="match-row" key={`${hit.source}-${index}`}>
                  <span>{hit.source}</span>
                  <span>{hit.matched_name}</span>
                  <span>{Math.round(hit.score * 100)}%</span>
                  <span>{hit.notes}</span>
                </div>
              ))
            ) : (
              <div className="no-hits">No sanctions list hits were identified in this search.</div>
            )}
          </div>
        </section>
      ) : null}
    </form>
  );
}
