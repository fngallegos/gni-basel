"use client";
import React from "react";
import type { Event } from "@/types/event";

const ROUTES: {
  title: string;
  copy: string;
  ids: string[];
  badge?: string;
}[] = [
  {
    title: "Basel Beach arrivals",
    copy: "Ease in with the quiet collector preview before sliding into Faena and the Scope opening terrace.",
    ids: [
      "no-vacancy-miami-beach",
      "faena-art",
      "scope-miami-beach-opening-night"
    ],
    badge: "Miami Beach",
  },
  {
    title: "North Beach collector warm-up",
    copy: "Cadillac's Riviera show, Eden's invite list, and Untitled's VIP walkthrough in one arc.",
    ids: [
      "art-exhibition-in-the-riveria-at-cadillac-hotel-beach-club",
      "eden-gallery",
      "untitled-art-miami-beach-vip-press-preview"
    ],
    badge: "Collector",
  },
  {
    title: "Wynwood night run",
    copy: "Dense gallery crawl that keeps you within a few blocks of the best late energy.",
    ids: ["miami-art-week", "photomiami", "nada-miami-art-fair"],
    badge: "Wynwood",
  },
];

export default function RouteCards({
  byId,
  onAddRoute,
  onConciergeRoute
}: {
  byId: Record<string, Event>;
  onAddRoute: (ids: string[]) => void;
  onConciergeRoute: (title: string, ids: string[]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5 md:grid-cols-3">
      {ROUTES.map(route => {
        const stops = route.ids.map(id => byId[id]).filter(Boolean);
        if (stops.length === 0) return null;

        return (
          <article key={route.title} className="flex flex-col rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="text-xs uppercase tracking-[0.3em] text-white/50">
              {route.badge || "Route"}
            </div>
            <h3 className="mt-2 text-xl font-semibold">{route.title}</h3>
            <p className="mt-2 text-sm text-white/70">{route.copy}</p>

            <ol className="mt-3 space-y-2 text-sm text-white/80">
              {stops.map((stop, idx) => (
                <li key={stop.id} className="flex gap-2">
                  <span className="text-white/40">{idx + 1}.</span>
                  <div>
                    <div className="font-medium">{stop.name}</div>
                    <div className="text-xs text-white/60">
                      {[stop.time, stop.neighborhood].filter(Boolean).join(" • ")}
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <button
                onClick={() => onAddRoute(stops.map(s => s.id))}
                className="rounded-full border border-white/30 px-4 py-2"
              >
                Add route
              </button>
              <button
                onClick={() => onConciergeRoute(route.title, stops.map(s => s.id))}
                className="rounded-full bg-white px-4 py-2 font-semibold text-black"
              >
                Concierge assist
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
