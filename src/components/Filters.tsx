"use client";
import React from "react";

export default function Filters({
  q,
  setQ,
  type,
  setType,
  neighborhood,
  setNeighborhood,
  tonightOnly,
  setTonightOnly,
  onReset,
  types,
  neighborhoods
}: {
  q: string;
  setQ: (s: string) => void;
  type: string;
  setType: (s: string) => void;
  neighborhood: string;
  setNeighborhood: (s: string) => void;
  tonightOnly: boolean;
  setTonightOnly: (v: boolean) => void;
  onReset: () => void;
  types: string[];
  neighborhoods: string[];
}) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <label className="flex-1 text-sm text-white/70">
        Search
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Artists, venues, notes..."
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-base text-white placeholder:text-white/30"
        />
      </label>

      <label className="text-sm text-white/70">
        Type
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 min-w-[180px] rounded-xl border border-white/15 bg-black/40 px-3 py-2"
        >
          <option value="">All</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm text-white/70">
        Neighborhood
        <select
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          className="mt-1 min-w-[180px] rounded-xl border border-white/15 bg-black/40 px-3 py-2"
        >
          <option value="">All</option>
          {neighborhoods.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/70">
        <input
          type="checkbox"
          checked={tonightOnly}
          onChange={(e) => setTonightOnly(e.target.checked)}
          className="h-4 w-4 rounded border-white/40 bg-black"
        />
        Tonight picks only
      </label>

      <button
        type="button"
        onClick={onReset}
        className="ml-auto rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:border-white"
      >
        Reset
      </button>
    </div>
  );
}
