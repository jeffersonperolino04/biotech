# Jefferson T. Perolino — Portfolio

A personal academic portfolio for Jefferson T. Perolino, a BS Biology (Biotechnology) student and DOST-SEI Scholar at West Visayas State University.

## Run & Operate

- `pnpm --filter @workspace/portfolio run dev` — run the portfolio (port 21113, served at `/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, served at `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, plain CSS (no Tailwind utility classes — custom CSS vars)
- Fonts: Cormorant Garamond (serif/display) + DM Sans (body)
- API: Express 5 (for future use)

## Where things live

- Portfolio page: `artifacts/portfolio/src/pages/Portfolio.tsx`
- All styles: `artifacts/portfolio/src/index.css`
- App entry: `artifacts/portfolio/src/App.tsx`

## Architecture decisions

- Desktop: `position: fixed` sidebar (272px) with its own `overflow-y: auto` scroll, main content uses `margin-left: 272px`
- Mobile: Full-screen hero section (100svh) on load → compact sticky header fades in with `opacity` + `translateY` transition (0.6s cubic-bezier) once user scrolls past the hero
- Responsive breakpoint at 860px — sidebar hidden on mobile, mobile hero shown instead
- All sizing uses `clamp()` with `vw` units for fluid responsiveness on any phone screen
- Particle canvas, typewriter, scroll-reveal, and counter animations are all pure JS (no library dependency)

## Product

- Static portfolio site: hero/typewriter, about + stats counters, research areas grid, lab skills pills, projects grid, awards timeline, contact form
- Desktop: fixed sidebar profile panel + scrollable main content
- Mobile: full-screen hero intro → smooth fade+slide sticky header on scroll, all sections accessible below

## User preferences

- Desktop sidebar: fixed/static left panel with its own scrollbar
- Mobile: full-screen hero with photo, description, nav links → elegant fade+slide-down sticky header on scroll past hero
- Responsive using relative/clamp units
- No abrupt transitions — everything slow and smooth

## Gotchas

- The `index.css` uses raw CSS custom properties (`--primary`, `--accent`, etc.) from the original design — not Tailwind tokens
- Mobile sticky header uses `pointer-events: none` when hidden so it doesn't intercept touches
- `100svh` used for mobile hero to avoid address-bar jumping on iOS
