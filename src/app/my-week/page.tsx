"use client";
import { useEffect, useMemo, useState } from "react";
import { parseEvents } from "@/lib/events";

const LS_KEY = "gni_saved_events_v1";

export default function MyWeek() {
  const events = useMemo(() => parseEvents(), []);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setSavedIds(JSON.parse(raw));
    } catch {}
  }, []);

  const saved = useMemo(
    () => events.filter(e => savedIds.includes(e.id)),
    [events, savedIds]
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-3xl font-semibold">My Week</h1>
      <p className="mt-2 text-white/70">Your saved GNI route.</p>

      <div className="mt-5 space-y-3">
        {saved.map(e => (
          <div key={e.id} className="rounded-2xl border border-white/10 p-4">
            <div className="text-xs uppercase text-white/60">{e.type}</div>
            <div className="text-lg font-medium">{e.name}</div>
            <div className="text-sm text-white/70">{e.time}</div>
            <div className="text-sm text-white/60">{e.location}</div>
          </div>
        ))}

        {saved.length === 0 && (
          <div className="rounded-2xl border border-white/10 p-6 text-white/70">
            Nothing saved yet. Add a Tonight Route.
          </div>
        )}
      </div>
    </main>
  );
}
