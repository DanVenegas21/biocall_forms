# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

BioCall_Form is the **shell ("cascarón") for a Bio Call data-capture page** for the Manuel Solis legal office — a single-page React form to capture client personal information. It is intentionally incomplete: the layout, design system, and section scaffolding exist, but the actual form fields are not yet implemented (see `src/pages/BioCallForm.tsx`, where each section renders an `EmptyState` reading "Sección pendiente de implementar"). The next contributor's job is to fill in the capture fields.

This project reuses the **NOVA design system** (the office's larger "Control de expedientes legales" app). `GUIDELINES.md` is the authoritative NOVA design reference — read it before building any new screen or component. Note it describes the full NOVA app (with a `frontend/` dir, dashboards, RAG, etc.); much of that does not exist here yet, but the visual tokens, component conventions, and accessibility rules apply directly.

## Commands

```bash
npm run dev       # Vite dev server on http://localhost:5173 (auto-opens browser)
npm run build     # Type-check (tsc -b) then production build to dist/
npm run preview   # Serve the production build locally
npm run lint      # eslint .  — NOTE: no eslint config exists yet; this will fail until one is added
```

There is no test setup. The UI is in **Spanish** (`lang="es"`, `color-scheme: light`); keep all user-facing copy in Spanish.

## Stack

React 18 + TypeScript (strict) + Vite 5 + Tailwind CSS 3. Animations via Framer Motion, icons via Lucide React, toasts via react-hot-toast, tooltips via Radix UI. Path alias `@/*` → `src/*` (configured in both `vite.config.ts` and `tsconfig.json`).

## Architecture

The app is a single static page — no router, no data fetching, no state management. Render tree (`src/App.tsx`):

```
TooltipProvider          → global Radix tooltip context (200ms delay)
  SkipLink               → accessibility "skip to #main-content"
  AppHeader              → fixed header, nova-horizon gradient
  BioCallForm            → the page (src/pages/) — sections + sticky section index
  AppFooter
  Toaster                → react-hot-toast, top-right
```

`BioCallForm.tsx` drives everything from a `SECTIONS` array (datos-personales, contacto, domicilio, documentos, familia, caso). It maps that array twice: once for the sticky sidebar nav, once for the section panels. **To add real form fields, replace the `EmptyState` inside each mapped `<section>`** — the section ids double as anchor targets for the sidebar links.

### Design system (two layers)

1. **Tailwind tokens** (`tailwind.config.js`): brand color scale `brand-50..900` (deep blue), accent scale `accent-50..900` (gold, used for AI/progress), `nova-*` brand tokens, custom gradients (`bg-nova-horizon`, `bg-glow-gold`, `bg-glass-gradient`), shadows (`shadow-glass`, `shadow-nova`, `shadow-gold`), and keyframe animations.
2. **Component classes** (`src/index.css`, under `@layer components`): reusable semantic classes like `.page-container`, `.page-title`, `.label-caps`, `.solid-panel`, `.input-glass`, `.cta-primary`, `.nav-tab`. Prefer these over ad-hoc utility soup or inline styles. CSS custom properties (e.g. `--app-header-height: 64px`, `--focus-ring`) live in `:root`.

### Glass vs Solid surfaces

The visual language has two container families:
- **Glass** (`src/components/glass/`: `GlassSurface`, `GlassCard`, `GlassButton`) — translucent. `GlassSurface` detects `backdrop-filter` support via `supportsLiquidGlass()` (`src/lib/liquid-glass/`) and falls back to the `.glass-fallback` class when unsupported. Use for header, floating/highlighted elements.
- **Solid** (`src/components/ui/`: `SolidCard`, `SectionPanel`, etc.) — opaque-ish white panels. Use for forms and work surfaces.

`GlassButton` is the standard pill button: variants `primary | secondary | ghost | danger | ai`, sizes `xs | sm | md | lg`, plus `loading`, `iconOnly`, `fullWidth`, `isActive`. The `ai` variant gets an animated shine.

`src/lib/cn.ts` is a dependency-free `classNames` helper (filter + join) — use it for conditional classes, not `clsx`/`tailwind-merge` (not installed).

## Conventions

- **Accessibility is non-negotiable** (see GUIDELINES.md §8): skip link, visible focus, `role="dialog"`/`aria-modal` on modals, `aria-hidden` on decorative icons, `sr-only` on loading states, and a `prefers-reduced-motion` block that neutralizes animations (`src/index.css` bottom). Any new animation must degrade gracefully under reduced motion (use `motion-reduce:animate-none`).
- **Pill buttons (`rounded-full`) are the norm**; cards/panels are `rounded-2xl`, inputs `rounded-xl`.
- Don't introduce new colors outside `tailwind.config.js`; don't use dark backgrounds for main content (only header/overlays).
- Source comments in the existing code are in Spanish and unaccented in places — match the surrounding style.
