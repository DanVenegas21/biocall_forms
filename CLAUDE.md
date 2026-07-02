# CLAUDE.md

Guidance for working on the Bio Call module in this monorepo.

## What this is

**BioCall Forms** is the capture module for the Manuel Solis legal office: a six-section web form for client personal and case background data, with server-side Zod validation, optional PostgreSQL persistence, and PDF generation.

Authentication, post-save editing, and AI autocomplete are **out of scope** for this module — they are handled or will be handled by the parent NOVA app and other teams.

`GUIDELINES.md` is the NOVA design reference (colors, glass/solid surfaces, accessibility). Apply its visual and a11y rules to frontend work.

## Commands

From the monorepo root:

```bash
npm run dev              # Next.js frontend on http://localhost:3000
npm run dev:backend      # Express API on http://localhost:4000
npm run build            # Build shared, database, pdf, frontend, backend
npm run typecheck        # TypeScript across workspaces
npm run lint             # ESLint across workspaces
```

Frontend only: `npm run dev --workspace @biocall/frontend`

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 3 |
| Backend | Express, TypeScript (ESM) |
| Shared | `@biocall/shared` — Zod schemas, validation, section metadata |
| Database | `@biocall/database` — Prisma + PostgreSQL |
| PDF | `@biocall/pdf` — PDFKit (`generateBioCallPdf`, template v1.9+) |

UI: Framer Motion (minimal), Lucide icons, Radix Tooltip, react-hot-toast. Language: **Spanish** (`lang="es"`).

## Architecture

```
apps/frontend/src/app/page.tsx  →  BioCallForm
apps/frontend/src/components/bio-call/
  BioCallForm.tsx               →  orchestrates 6 sections + save/PDF
  sections/                     →  PersonalData, Contact, Address, Documents, Family, Case
packages/shared                 →  bioCallSchema, BIO_CALL_SECTIONS, INADMISSIBILITY_QUESTIONS
packages/database               →  saveBioCall / getBioCall
packages/pdf                    →  generateBioCallPdf
apps/backend                    →  POST/GET /api/bio-calls, PDF download
```

Section ids (anchors + sidebar): `datos-personales`, `contacto`, `domicilio`, `documentos`, `familia`, `caso`.

**Integrators:** import section metadata from `@biocall/shared` (`BIO_CALL_SECTIONS`), not from `GET /api/bio-calls/sections`.

## Form state

- Empty shape: `createEmptyFormData()` in `BioCallForm.tsx` (must stay aligned with `bioCallSchema`)
- Draft: `localStorage` via `src/lib/formDraft.ts`
- Save: `POST /api/bio-calls` with `validateBioCallSave` + `normalizeBioCallPayload`
- Bio Call ID: legible slug en `bio_calls.id`, ej. `vega-morales-roberto-20250702`; colisiones mismo dia → `-02`, `-03`. UUID solo en metadatos internos de PDFs generados.
- PDF: `GET /api/bio-calls/:id/pdf` after successful save
- PDF naming: `buildBioCallPdfNames()` — Storage `bio-calls/{id}/biocall-{id}.pdf`, download `BioCall-{Name}-{YYYY-MM-DD}.pdf`; `download_filename` en `bio_call_generated_pdfs`

## Design system

- **Glass:** `src/components/glass/` — `GlassSurface`, `GlassButton` (header, CTAs)
- **Solid:** `src/components/ui/` — `SectionPanel`, `SolidCard` (form panels)
- **Semantic classes:** `src/app/globals.css` — `.page-container`, `.input-glass`, `.label-caps`, etc.
- Path alias: `@/*` → `src/*`

## Conventions

- Accessibility: skip link, visible focus, `aria-*` on errors, `prefers-reduced-motion` support
- Pill buttons (`rounded-full`); panels `rounded-2xl`; inputs `rounded-xl`
- Do not add colors outside `tailwind.config.js`
- User-facing copy in Spanish
- Any form field change must update `packages/shared/src/schemas.ts` and database mappers if persisted
