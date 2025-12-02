# Codex Context — GNI Basel Project

**Status:** shipping immediately. Any further errors are unacceptable.  
**Stack:** Next.js 15.1 (app router), TypeScript, React.  
**Goal of this file:** give Codex a single, complete brief: what’s broken, what to change, and the broader product vision so implementation stays aligned while moving fast.

---

## 1) What’s broken right now (facts)

### Build/runtime errors observed
1. **Missing CSV module**
   - Error examples:
     - `Module not found: Can't resolve '@/data/events.csv'`
     - `Module not found: Can't resolve '@/data/events.csv.ts'`
     - `Module not found: Can't resolve '../data/events.csv.ts'`
2. **`papaparse` missing (previously)**
   - Resolved by `npm i papaparse`, but make sure dependency stays in `package.json`.
3. **Duplicate imports / corrupted file**
   - `Module parse failed: Identifier 'Papa' has already been declared`
   - Indicates `src/lib/events.ts` got duplicated/concatenated accidentally. Needs clean overwrite.
4. **Alias vs relative paths confusion**
   - `@/data/...` alias may not resolve if `tsconfig.json` or `next.config` isn’t aligned.
   - But simplest fix: ensure correct file exists at the path, and import using the alias already used elsewhere (`@/data/eventsCsv` etc.), not random extensions.

### Current files that exist
- `src/components/HomeClient.tsx`
- `src/components/EventCard.tsx`
- `src/components/Filters.tsx`
- `src/components/RouteCards.tsx`
- `src/lib/events.ts` (needs **fresh overwrite**)
- `src/data/events.csv.ts` (should exist and export `EVENTS_CSV`)

We also have a raw CSV the user supplied (177 rows). That CSV must live ONLY inside `src/data/events.csv.ts` as a template string export.

---

## 2) Required end state (zero-error, one-pass)

### Two-file model only
There should be exactly **two relevant files** for the data pipeline:

1. `src/data/events.csv.ts`
   - Exports a single constant:
     ```ts
     export const EVENTS_CSV = `...full csv...`;
     ```
   - **No default export needed.**
   - **Do not change the header row** unless parser changes too.
   - Must contain **all 177 rows**.

2. `src/lib/events.ts`
   - Imports `EVENTS_CSV` from `src/data/events.csv.ts`.
   - Parses CSV to `Event[]`.
   - Exports helper functions used by HomeClient:
     - `parseEvents`
     - `getOptions`
     - `filterEvents`

### Import path requirement
- In `events.ts`, use:
  ```ts
  import { EVENTS_CSV } from "@/data/events.csv";
  ```
  **OR**
  ```ts
  import { EVENTS_CSV } from "@/data/events.csv.ts";
  ```
  depending on how Next resolves extensions in this repo.
- Preferred: create a barrel alias so imports are clean:
  - Rename file to `src/data/eventsCsv.ts`
  - Export `EVENTS_CSV` there
  - Import with:
    ```ts
    import { EVENTS_CSV } from "@/data/eventsCsv";
    ```
- Codex should pick **one** and make sure path + filename match exactly.

### Overwrite strategy
- **Hard overwrite** `src/lib/events.ts` to remove duplicated code.
- **Hard overwrite** `src/data/events.csv.ts` to be the canonical data source.

---

## 3) Parser contract (must not drift)

### CSV header currently expected by parser
The parser we intend to use maps from **human columns**:

- `Name`
- `Date range`
- `Time`
- `Neighborhood`
- `Location (venue + address)`
- `Type`
- `Producer/curator`
- `Sponsors/partners`
- `Access (public / RSVP / VIP)`
- `Cost (free / ticketed + notes)`
- `RSVP / ticket link`
- `Info / article link`
- `Official event page`
- `Notes`

But the **real CSV header** supplied is:

`title,category,category_norm,notes,invite_only,rsvp_required,ticket_required,cardmembers_only,members_only,location_revealed_to_ticket_holders,date_start,date_end,time_start_24h,time_end_24h,price,currency,price_min,price_max,is_free,area,area_norm,venue,address,city,state,zip,venue_address,date,time`

So Codex must do one of these (choose fastest correct):
1. **Update parser to match real header.**  
   Map fields from `title`, `category`, `area`, `venue_address`, `date`, `time`, etc.
2. **OR update CSV header to legacy names.**  
   This is riskier because you must rename header and all usage.

**Preferred**: update parser to the supplied header.

Minimal mapping:
- `name` ← `title`
- `type` ← `category` (or `category_norm`)
- `neighborhood` ← `area` (or `area_norm`)
- `location` ← `venue_address` if present else combine `venue + address`
- `dateRange` ← `date` (fallback: format from `date_start`–`date_end`)
- `time` ← `time` (fallback: build from `_24h` fields)
- `notes` ← `notes`
- links: `link` column can map to `officialLink` or `infoLink`.

**Slugify IDs** from `title`.

---

## 4) One-shot task list for Codex

1. **Check alias config**
   - `tsconfig.json` should have:
     ```json
     {
       "compilerOptions": {
         "baseUrl": ".",
         "paths": { "@/*": ["src/*"] }
       }
     }
     ```
   - If not, either add it or use relative imports consistently.

2. **Overwrite `src/data/events.csv.ts`**
   - Ensure file is at `src/data/events.csv.ts`
   - Export exactly `EVENTS_CSV`.
   - Paste/full include all 177 CSV rows.

3. **Overwrite `src/lib/events.ts`**
   - Remove any duplicate imports.
   - Parse with Papa.
   - Match real CSV header.
   - Export `parseEvents`, `getOptions`, `filterEvents`.

4. **Run**
   - `npm run dev` then `npm run build`
   - Fix any residual TS type errors inline (no new files unless truly missing).

---

## 5) Product vision / scope (north star)

Even while moving fast, this build is not a throwaway. It’s a first shippable slice of a larger product:

### The north-star product
**GNI Picks** is a highly curated, living guide for Basel/Art Week-style city takeovers:
- Think *personal concierge meets city-wide programming map*.
- Users should feel: *“I can trust this to tell me what’s actually worth my time tonight.”*

### Core experience pillars
1. **Curated discovery**
   - A single home feed with fast filters (type, neighborhood, “tonight picks”).
   - Editorial highlighting: tonight-featured items bubble to top.
   - Minimal friction to scan and decide.

2. **Personal planning**
   - “My Week” (or “My List”) is the user’s saved itinerary.
   - Save/unsave events from anywhere.
   - LocalStorage now; later a simple account sync.

3. **Routes / guided flows**
   - Curated routes like:
     - “Best of Wynwood in 3 hours”
     - “Collector-grade fairs”
     - “Late-night party run”
   - Route cards are effectively themed itineraries.
   - Users can add a whole route to My Week in one click.

4. **Trust & quality**
   - Data is clean, consistent, and feels editorial.
   - The app doesn’t try to be exhaustive like a generic calendar; it tries to be *right*.

### What this MVP must include
- Home feed renders from CSV.
- Search + basic filters work.
- Tonight picks feature flag works.
- Event cards show essential info.
- Save to “My Week” works.
- No crashes, no missing modules, deployable.

### What is intentionally deferred (not for today)
- Auth / backend database.
- Full map view.
- Real-time updates, push notifications.
- Multi-city support (but keep code ready for it).
- Rich editorial CMS.

### Design/UX tone
- Clean, fast, editorial.
- Minimal UI chrome; focus on scannability.
- Emphasize “Tonight” and “Top picks” without yelling.

---

## 6) Guardrails for Codex
- Do not introduce new dependencies unless required for a build fix.
- Do not add new files unless a module is truly missing.
- Avoid refactors that risk breakage; prefer surgical edits.
- Keep naming consistent (`EVENTS_CSV`, `parseEvents`, `Event` type).
- Ensure the app builds successfully with Next 15.1.

---

## 7) Acceptance criteria
- `npm run dev` shows home with events list.
- Filters/search update the list with no console errors.
- `npm run build` passes.
- `My Week` page loads saved events.
- CSV contains all 177 events and parser reads them correctly.

---

End of context.
