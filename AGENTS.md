# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` uses the Next.js App Router; `layout.tsx` supplies global metadata/providers and `page.tsx` is the seed landing flow—keep new concierge, route, or pass experiences inside this tree using route groups for neighborhoods.
- Global styling lives in `src/app/globals.css`; extend the quiet-lux black/white palette here and avoid ad-hoc colors in components.
- Static assets belong in `public/` (e.g., icons, partner marks) and are referenced with `/asset-name.svg` so Next can optimize them.
- Central configuration files (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`) should be the only place you tune build, TypeScript, or lint behavior.

## Build, Test, and Development Commands
- `npm run dev` starts the Next dev server on `http://localhost:3000` with hot reload for files in `src/app`.
- `npm run build` compiles the production bundle into `.next`; run locally before shipping infrastructure changes.
- `npm run start` serves the last production build and is the closest approximation to Vercel.
- `npm run lint` executes ESLint with the Next + Core Web Vitals ruleset; resolve warnings before committing.

## Coding Style & Naming Conventions
- Use TypeScript-first React components (`export default function Example()`), 2-space indentation, trailing commas, and double quotes in JSX to match existing files.
- Components and files are PascalCase when exporting UI (e.g., `HeroSection.tsx`), while utilities/hooks use camelCase (`useViewport.ts`). Assets remain kebab-case.
- Tailwind utility classes are preferred; group layout → spacing → color utilities, keep typography restrained, and always include concierge call-to-action buttons/links inside card sections.

## Testing Guidelines
- Automated tests are not scaffolded yet; new suites should live under `src/__tests__` or `src/(segment)/__tests__` with filenames like `component-name.test.tsx` using React Testing Library plus Jest or Vitest.
- Until the runner lands, pair every feature PR with reproducible manual QA notes (viewport, browser, steps) and ensure `npm run lint` passes.
- Aim for smoke tests covering route components, shared hooks, and data transforms before merging major refactors.

## Commit & Pull Request Guidelines
- There is no git history yet, so start clean with Conventional Commits (`feat: hero layout polish`, `fix: correct dark mode contrast`) to keep changelog automation viable.
- Link related tickets or issues in the commit body and enumerate verification commands inside the PR description (`npm run build`, `npm run lint`).
- Screenshots or screen recordings are required for visual tweaks; include before/after when modifying `src/app/page.tsx` or other UI-heavy files.
- Keep PRs focused on one change, ensure reviewers can reproduce results locally, and request review only after lint/build succeed.

## Experience Principles & Monetization
- Lead every route or event module with “GNI Picks” cards—3–4 stops clustered by neighborhood, written with concise insider copy and zero hype adjectives.
- Concierge is core: each card, modal, or detail page must surface a quiet but obvious concierge CTA (button, link, or inline phone) adjacent to metadata.
- Monetization flows should reference the Lite Pass, White-Glove deposit, or affiliate URLs; design them as premium upsells near the CTA stack, never as pop-ups.
- Maintain the quiet-lux black/white UI: high contrast text, minimal animations, no gratuitous gradients, and keep dependencies limited to Next, React, and Tailwind.
