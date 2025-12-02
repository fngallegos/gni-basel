"use client";
import { useEffect, useMemo, useState } from "react";
import { parseEvents, filterEvents, getOptions } from "@/lib/events";
import type { Event } from "@/types/event";
import EventCard from "./EventCard";
import Filters from "./Filters";
import RouteCards from "./RouteCards";

const LS_KEY = "gni_saved_events_v1";

export default function HomeClient() {
  const events = useMemo(() => parseEvents(), []);

  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [tonightOnly, setTonightOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [conciergePayload, setConciergePayload] = useState<
    { mode: "event" | "route"; title: string; ids: string[] } | null
  >(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setSavedIds(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const byId = useMemo(
    () => Object.fromEntries(events.map(e => [e.id, e])),
    [events]
  );

  const { types, neighborhoods } = useMemo(() => getOptions(events), [events]);

  const list = useMemo(
    () => filterEvents(events, q, type, neighborhood, tonightOnly),
    [events, q, type, neighborhood, tonightOnly]
  );

  function resetFilters() {
    setQ("");
    setType("");
    setNeighborhood("");
    setTonightOnly(false);
  }

  function toggleSave(id: string) {
    setSavedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function addRoute(ids: string[]) {
    setSavedIds(prev => Array.from(new Set([...prev, ...ids])));
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 space-y-4">
        <div className="text-sm uppercase tracking-[0.4em] text-white/60">GNI PICKS</div>
        <div>
          <h1 className="text-4xl font-semibold">Tonight — Basel takeover</h1>
          <p className="mt-2 text-white/70">
            Inside line for collectors, patrons, and the crew you trust. Save stops, add
            curated routes, or tap concierge for white-glove backup.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <button
            onClick={() =>
              setConciergePayload({
                mode: "route",
                title: "Custom concierge brief",
                ids: savedIds,
              })
            }
            className="rounded-full bg-white px-4 py-2 font-semibold text-black"
          >
            Message concierge
          </button>
          <a
            href="/my-week"
            className="rounded-full border border-white/30 px-4 py-2 text-white/80 hover:border-white/60"
          >
            View My Week
          </a>
          <a
            href="https://buy.stripe.com/your-lite-tonight-link"
            target="_blank"
            className="rounded-full border border-white/20 px-4 py-2 text-white/80 hover:border-white/60"
          >
            Lite Tonight Pass
          </a>
        </div>
      </header>

      <section className="mb-6">
        <RouteCards
          byId={byId}
          onAddRoute={addRoute}
          onConciergeRoute={(title: string, ids: string[]) =>
            setConciergePayload({ mode: "route", title, ids })
          }
        />
      </section>

      <section className="mb-6">
        <Filters
          q={q} setQ={setQ}
          type={type} setType={setType}
          neighborhood={neighborhood} setNeighborhood={setNeighborhood}
          tonightOnly={tonightOnly}
          setTonightOnly={setTonightOnly}
          onReset={resetFilters}
          types={types}
          neighborhoods={neighborhoods}
        />
      </section>

      <section className="space-y-3">
        {list.map(e => (
          <EventCard
            key={e.id}
            e={e}
            saved={savedIds.includes(e.id)}
            onToggleSave={toggleSave}
            onConcierge={(ev: Event) =>
              setConciergePayload({ mode: "event", title: ev.name, ids: [ev.id] })
            }
          />
        ))}
        {list.length === 0 && (
          <div className="rounded-2xl border border-white/10 p-6 text-white/70">
            No matches. Try a different vibe.
          </div>
        )}
      </section>

      {conciergePayload && (
        <ConciergeModal
          payload={conciergePayload}
          onClose={() => setConciergePayload(null)}
        />
      )}
    </main>
  );
}

function ConciergeModal({
  payload,
  onClose
}: {
  payload: { mode: "event" | "route"; title: string; ids: string[] };
  onClose: () => void;
}) {
  const [partySize, setPartySize] = useState(2);
  const [budget, setBudget] = useState("mid");
  const [vibe, setVibe] = useState("art-first");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  async function submit() {
    setSent(false);
    try {
      await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: payload.mode,
          title: payload.title,
          eventIds: payload.ids,
          partySize,
          budget,
          vibe,
          notes
        })
      });
      setSent(true);
    } catch (err) {
      console.error("Concierge request failed", err);
      setSent(false);
    }
  }

  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-black p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/60">
              Concierge Request
            </div>
            <h2 className="mt-1 text-xl font-semibold">{payload.title}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-sm">
            Party size
            <input
              type="number"
              min={1}
              value={partySize}
              onChange={e => setPartySize(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2"
            />
          </label>

          <label className="text-sm">
            Budget
            <select
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2"
            >
              <option value="mid">Mid</option>
              <option value="high">High</option>
              <option value="nolimit">No-limit</option>
            </select>
          </label>

          <label className="text-sm col-span-2">
            Vibe
            <select
              value={vibe}
              onChange={e => setVibe(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2"
            >
              <option value="art-first">Art-first & social</option>
              <option value="high-energy">High-energy party</option>
              <option value="underground">Underground / after-hours</option>
              <option value="celebrity-adjacent">Celebrity-adjacent</option>
            </select>
          </label>

          <label className="text-sm col-span-2">
            Notes
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2"
              placeholder="Guestlist, tables, driver, special access…"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={submit}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
          >
            Submit request
          </button>

          <a
            href="https://buy.stripe.com/your-lite-tonight-link"
            target="_blank"
            className="rounded-full border border-white/30 px-4 py-2 text-sm hover:bg-white/10"
          >
            GNI Lite Tonight Pass
          </a>

          <a
            href="https://buy.stripe.com/your-whiteglove-deposit-link"
            target="_blank"
            className="rounded-full border border-white/30 px-4 py-2 text-sm hover:bg-white/10"
          >
            White-Glove Deposit
          </a>
        </div>

        {sent && (
          <p className="mt-3 text-sm text-white/80">
            Request sent. You’ll hear back shortly.
          </p>
        )}
      </div>
    </div>
  );
}
