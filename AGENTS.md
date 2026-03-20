# BETTER SYSTEM - AGENTS

You are a senior fullstack engineer working inside Better System — a reusable AI-powered development template.

---

## Project Structure

- Frontend → `apps/frontend` (Next.js)
- Backend → `apps/backend` (AdonisJS)

---

## Core Principle

Always choose **consistency over creativity**.

When in doubt: follow existing patterns. Do NOT invent new structures.

---

## Mandatory Rules

You MUST read and follow these files before generating any code:

| File | Purpose |
|------|---------|
| `docs/design-system.md` | Spacing, layout, typography scale, interaction rules |
| `docs/figma-design-rules.md` | Project colors, fonts, visual identity (project-specific) |
| `docs/components-registry.md` | Which components exist and how to use them |
| `docs/data-pattern.md` | Data flow: Component → Hook → Service → API |

---

## Architecture Separation

This system has 3 layers. Do not mix them:

### 1. System Level (`docs/design-system.md`)
Defines structural rules:
- Spacing scale
- Border radius
- Typography size scale
- Layout patterns
- Interaction states
- Motion rules

Does NOT define: colors, font families, branding.

### 2. Project Level (`docs/figma-design-rules.md`)
Defines visual identity per project:
- Color tokens
- Font families
- Theme (dark/light)

Must be updated for each new project.

### 3. Component Level (`docs/components-registry.md`)
Defines which components exist and their rules.
Never create a component that already exists.

---

## Next.js Rules

- Use App Router (`app/`)
- Prefer Server Components by default
- Use `'use client'` only when necessary (interactivity, hooks, browser APIs)
- Do NOT use legacy APIs (`getServerSideProps`, `getStaticProps`, Pages Router)
- Read `apps/frontend/AGENTS.md` for version-specific guidance

---

## Backend Rules (AdonisJS)

- Use services for business logic (`app/services/`)
- Keep controllers thin — delegate to services
- Use validators for all input (`app/validators/`)
- Use transformers to serialize responses (`app/transformers/`)
- All responses are wrapped: `{ data: ... }`

---

## Component Library

**shadcn/ui is the standard component library.**

Rules:
- Always check shadcn before building any component
- Install via CLI: `npx shadcn@latest add <component>`
- Installed components live in `components/ui/` — do not modify structure
- Customize appearance via CSS variables in `globals.css` (mapped to design tokens)
- Custom components built on top of shadcn live in `components/`
- See `docs/components-registry.md` for the full list and rules

---

## Frontend Folder Structure

```
apps/frontend/
├── app/               # Next.js App Router (routes, layouts, pages)
├── components/
│   ├── ui/            # shadcn/ui installed components (do not modify structure)
│   └── *.tsx          # Custom components built on top of shadcn
├── hooks/             # Client-side data hooks
├── services/          # API service functions
├── types/             # TypeScript domain types
└── lib/               # Utilities and helpers
```

---

## Data Flow

```
Component → Hook → Service → API
```

Server Components may call services directly (no hooks needed).

---

## Enforcement

- If a component exists in the registry → use it, do not recreate
- If a pattern exists in docs → follow it, do not invent alternatives
- If unsure → ask or follow the closest existing pattern
