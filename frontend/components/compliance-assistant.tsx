"use client";

import { useMemo, useState } from "react";

type AssistantMessage = {
  role: "user" | "assistant";
  text: string;
};

type ComplianceAssistantProps = {
  totalScreenings: number;
  reviewCount: number;
  blockedCount: number;
  averageRisk: number;
};

const fallbackResponses: Record<string, string> = {
  risk: "The current portfolio risk is derived from AI scoring across screenings. If many records are flagged for review or blocked, your compliance risk is higher and should be investigated.",
  review: "Review items are typically those with ambiguous matches or elevated risk. You should check these cases manually and confirm whether the subject is blocked or can be cleared.",
  blocked: "Blocked cases indicate strong sanctions or denied-party hits. These records should not move forward in the export chain until resolved.",
  sanctions: "Sanctions list matches are captured as hits on the screening result card. Confirm the source, matched name, and confidence score before taking action.",
  audit: "Audit logs track the latest compliance events. Maintain a clear trail of screenings and decisions for internal review and regulatory purposes.",
  default: "Ask me about screening risk, sanctions integration, audit readiness, or monitoring queue recommendations. I can help summarize current compliance posture."
};

export function ComplianceAssistant({ totalScreenings, reviewCount, blockedCount, averageRisk }: ComplianceAssistantProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { role: "assistant", text: "Hi, I’m your AI compliance assistant. Ask anything about risk, screening results, sanctions, or audit history." }
  ]);

  const summary = useMemo(
    () => `Current surveillance: ${totalScreenings} screenings, ${reviewCount} review needs, ${blockedCount} blocked. Average AI risk is ${averageRisk}%.`,
    [totalScreenings, reviewCount, blockedCount, averageRisk]
  );

  function getResponse(prompt: string) {
    const normalized = prompt.toLowerCase();
    if (normalized.includes("risk")) return fallbackResponses.risk;
    if (normalized.includes("review")) return fallbackResponses.review;
    if (normalized.includes("blocked") || normalized.includes("block")) return fallbackResponses.blocked;
    if (normalized.includes("sanction") || normalized.includes("watchlist") || normalized.includes("hit")) return fallbackResponses.sanctions;
    if (normalized.includes("audit") || normalized.includes("history")) return fallbackResponses.audit;
    return fallbackResponses.default;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;

    const userMessage: AssistantMessage = { role: "user", text: query.trim() };
    const assistantMessage: AssistantMessage = { role: "assistant", text: `${getResponse(query)} ${summary}` };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setQuery("");
  }

  return (
    <section className="panel assistant-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">AI helper</p>
          <h2>Compliance assistant</h2>
        </div>
      </div>

      <div className="assistant-summary">
        <p>{summary}</p>
      </div>

      <div className="assistant-chat">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`assistant-message ${message.role}`}>
            <span>{message.role === "assistant" ? "Assistant" : "You"}</span>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <form className="assistant-input" onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask about risk, sanctions, or audit posture..."
          aria-label="Ask AI compliance assistant"
        />
        <button className="primary-button" type="submit">
          Ask
        </button>
      </form>
    </section>
  );
}
