"use client";
import React from "react";
import type { Event } from "@/types/event";

export default function EventCard({
  e,
  saved,
  onToggleSave,
  onConcierge
}: {
  e: Event;
  saved: boolean;
  onToggleSave: (id: string) => void;
  onConcierge: (e: Event) => void;
}) {
  const schedule = [e.time, e.dateRange].filter(Boolean).join(" · ");
  const locale = [e.location, e.neighborhood].filter(Boolean).join(" · ");

  return (
    <article className="rounded-3xl border border-white/10 bg-black/40 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-white/60">
            <span>{e.type}</span>
            {e.tonightFeatured && (
              <span className="rounded-full border border-white/30 px-2 py-0.5 text-[10px] text-white/80">
                Tonight pick
              </span>
            )}
          </div>
          <h3 className="mt-1 text-2xl font-semibold">{e.name}</h3>
          {schedule && <div className="text-sm text-white/70">{schedule}</div>}
          {locale && <div className="text-sm text-white/60">{locale}</div>}
          {e.notes && <p className="mt-2 text-sm text-white/70">{e.notes}</p>}
        </div>

        <div className="flex flex-col items-end gap-2">
          {e.cost && (
            <div className="text-xs uppercase tracking-widest text-white/60">{e.cost}</div>
          )}
          <button
            onClick={() => onToggleSave(e.id)}
            className={`rounded-full px-4 py-2 text-sm ${
              saved ? "bg-white text-black" : "border border-white/30 text-white"
            }`}
          >
            {saved ? "Saved" : "Save to My Week"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {e.rsvpLink && (
          <a
            href={e.rsvpLink}
            target="_blank"
            className="rounded-full border border-white/30 px-4 py-2 hover:border-white"
          >
            RSVP / Ticket
          </a>
        )}
        {e.infoLink && (
          <a
            href={e.infoLink}
            target="_blank"
            className="rounded-full border border-white/30 px-4 py-2 hover:border-white"
          >
            Editorial brief
          </a>
        )}
        {e.officialLink && (
          <a
            href={e.officialLink}
            target="_blank"
            className="rounded-full border border-white/30 px-4 py-2 hover:border-white"
          >
            Official site
          </a>
        )}
        <button
          onClick={() => onConcierge(e)}
          className="rounded-full bg-white px-4 py-2 font-semibold text-black"
        >
          Concierge assist
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-white/50">
        <span>Need guaranteed entry?</span>
        <a
          href="https://buy.stripe.com/your-lite-tonight-link"
          target="_blank"
          className="underline"
        >
          Lite Pass
        </a>
        <span>•</span>
        <a
          href="https://buy.stripe.com/your-whiteglove-deposit-link"
          target="_blank"
          className="underline"
        >
          White-Glove deposit
        </a>
      </div>
    </article>
  );
}
