// src/lib/events.ts
import Papa from "papaparse";
import { EVENTS_CSV } from "@/data/events.csv";
import type { Event } from "@/types/event";

function slugify(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

function formatDateRange(a?: string, b?: string) {
  if (!a && !b) return "";
  if (a && !b) return dateFormatter.format(new Date(a));
  if (!a && b) return dateFormatter.format(new Date(b));
  if (!a || !b) return "";
  if (a === b) return dateFormatter.format(new Date(a));
  return `${dateFormatter.format(new Date(a))} – ${dateFormatter.format(new Date(b))}`;
}

function toTwelveHour(time24?: string) {
  if (!time24) return "";
  const [hRaw, mRaw] = time24.split(":");
  const h = Number(hRaw);
  if (Number.isNaN(h)) return "";
  const hours = ((h + 11) % 12) + 1;
  const minutes = mRaw ? Number(mRaw) : 0;
  const suffix = h >= 12 ? "PM" : "AM";
  return `${hours}${minutes ? `:${String(minutes).padStart(2, "0")}` : ""}${suffix}`;
}

function formatTimeRange(from?: string, to?: string) {
  if (!from && !to) return "";
  const start = toTwelveHour(from);
  const end = toTwelveHour(to);
  if (start && end) return `${start} – ${end}`;
  return start || end || "";
}

export function parseEvents(): Event[] {
  const parsed = Papa.parse<Record<string, string>>(EVENTS_CSV, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = (parsed.data || []).filter(Boolean);

  const mapped: Event[] = rows.map((r) => {
    const name = (r["title"] ?? r["Name"] ?? "").trim() || "Untitled";
    const dateRange =
      r["date"] ||
      r["Date range"] ||
      formatDateRange(r["date_start"], r["date_end"]);
    const time =
      r["time"] ||
      r["Time"] ||
      formatTimeRange(r["time_start_24h"], r["time_end_24h"]);
    const location =
      r["venue_address"] ||
      [r["venue"], r["address"]]
        .filter(Boolean)
        .join(", ") ||
      r["Location (venue + address)"] ||
      "";
    const type = r["category"] || r["Type"] || "Other";
    const neighborhood = r["area"] || r["area_norm"] || r["Neighborhood"] || "";

    return {
      id: slugify(name),
      name,
      dateRange,
      time,
      neighborhood,
      location,
      type,
      producer: r["Producer/curator"] ?? "",
      sponsors: r["Sponsors/partners"] ?? "",
      access: r["Access (public / RSVP / VIP)"] ?? "",
      cost: r["price"] ?? r["Cost (free / ticketed + notes)"] ?? "",
      rsvpLink: r["rsvp_link"] ?? r["RSVP / ticket link"] ?? "",
      infoLink: r["info_link"] ?? r["Info / article link"] ?? "",
      officialLink: r["official_link"] ?? r["Official event page"] ?? "",
      notes: r["notes"] ?? r["Notes"] ?? "",

      tonightFeatured: false,
      curatorPickScore: 0,
    };
  });

  const tonightIds = new Set<string>([
    "art-miami",
    "context-art-miami",
    "wynwood-walls-museum-only-human",
    "miami-art-week-at-faena-library-of-us-reading-room-tracing-time-tropical-stomping-grounds",
    "superblue-miami-immersive-art",
    "nada-miami",
  ]);

  mapped.forEach((e) => {
    if (tonightIds.has(e.id)) {
      e.tonightFeatured = true;
      e.curatorPickScore = 95;
    }
  });

  return mapped.sort((a, b) => {
    const af = a.tonightFeatured ? 1 : 0;
    const bf = b.tonightFeatured ? 1 : 0;
    if (af !== bf) return bf - af;
    return (b.curatorPickScore ?? 0) - (a.curatorPickScore ?? 0);
  });
}

export function getOptions(list: Event[]) {
  const types = Array.from(new Set(list.map((e) => e.type))).sort();
  const neighborhoods = Array.from(
    new Set(list.map((e) => e.neighborhood).filter(Boolean))
  ).sort() as string[];

  return { types, neighborhoods };
}

export function filterEvents(
  list: Event[],
  q: string | null | undefined,
  type: string | null | undefined,
  neighborhood: string | null | undefined,
  tonightOnly?: boolean
) {
  let out = Array.from(list);

  if (type) {
    const t = type.toLowerCase();
    out = out.filter((e) => (e.type || "").toLowerCase() === t);
  }

  if (neighborhood) {
    const n = neighborhood.toLowerCase();
    out = out.filter((e) => (e.neighborhood || "").toLowerCase() === n);
  }

  if (tonightOnly) {
    out = out.filter((e) => e.tonightFeatured);
  }

  if (q) {
    const tokens = String(q).toLowerCase().split(/\s+/).filter(Boolean);
    out = out.filter((e) => {
      const hay = [e.name, e.notes, e.location, e.producer, e.sponsors, e.type, e.dateRange]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }

  return out.sort((a, b) => {
    const af = a.tonightFeatured ? 1 : 0;
    const bf = b.tonightFeatured ? 1 : 0;
    if (af !== bf) return bf - af;
    const asc = (b.curatorPickScore ?? 0) - (a.curatorPickScore ?? 0);
    if (asc !== 0) return asc;
    return a.name.localeCompare(b.name);
  });
}
