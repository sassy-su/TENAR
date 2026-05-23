"use client";

import { Clock2, History } from "lucide-react";

type SearchHistoryItem = {
  subject_name: string;
  country: string | null;
  status: string;
  created_at: string;
};

export function SearchHistorySidebar({ items }: { items: SearchHistoryItem[] }) {
  return (
    <aside className="panel sidebar-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Search history</p>
          <h2>Recent checks</h2>
        </div>
        <History size={18} />
      </div>
      {items.length === 0 ? (
        <p className="empty">No recent searches yet. Run a screening to populate history.</p>
      ) : (
        <div className="history-list">
          {items.map((item, index) => (
            <article className="history-item" key={`${item.subject_name}-${index}`}>
              <div>
                <strong>{item.subject_name}</strong>
                <span>{item.country ?? "Global"}</span>
              </div>
              <div className="history-meta">
                <Clock2 size={14} />
                <span>
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "short",
                    timeStyle: "short"
                  }).format(new Date(item.created_at))}
                </span>
              </div>
              <span className={`badge ${item.status}`}>{item.status}</span>
            </article>
          ))}
        </div>
      )}
    </aside>
  );
}
