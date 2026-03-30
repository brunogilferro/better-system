# Frontend Rules

## Framework

- Next.js with App Router (`app/` directory)
- React 19
- Tailwind CSS v4
- TypeScript strict mode

## Component Rules

- Prefer Server Components by default
- Use `'use client'` only for: interactivity, React hooks, browser APIs
- Never use Pages Router patterns (`getServerSideProps`, `getStaticProps`)

## Folder Responsibilities

| Folder | Purpose |
|--------|---------|
| `app/` | Routes, layouts, pages (Next.js App Router) |
| `components/ui/` | shadcn/ui installed components |
| `components/` | Custom components built on top of shadcn |
| `hooks/` | Client-side data and state hooks |
| `services/` | API communication functions |
| `types/` | TypeScript domain types |
| `lib/` | Utilities, helpers, constants |

## shadcn/ui Rules

- Always use shadcn as the base — never build from scratch what shadcn provides
- Install components via CLI: `npx shadcn@latest add <component>`
- Components live in `components/ui/` — never modify structure, only styles via tokens
- Customize appearance through CSS variables in `globals.css`, not inline overrides
- Check `docs/components-registry.md` before creating any new component

## Styling Rules

- Use Tailwind classes only — no inline styles
- No arbitrary values (e.g. `w-[312px]`)
- Colors must use tokens from `docs/figma-design-rules.md`

## Data Fetching

- Server components: call services directly
- Client components: use hooks that call services
- Never fetch inside components — use the service layer

## Icons

- Use `lucide-react` exclusively (already included with shadcn)
- Default size: 16px or 20px

## Anti-patterns (FORBIDDEN)

- Creating a component that shadcn already provides
- Hardcoding colors inside component files
- Using another component library alongside shadcn
- Overriding shadcn component structure

---

## Accessibility Rules

Every UI component must meet basic accessibility standards. Accessibility is part of the definition of done.

- Every input MUST have a `<label>` with `htmlFor` matching the input `id`
- Error messages MUST be linked via `aria-describedby`
- Required fields MUST have `aria-required="true"` or `required`
- Icon-only buttons MUST have `aria-label`
- Buttons with async actions MUST have `disabled` + `aria-busy` during loading
- All images MUST have `alt` (descriptive or `""` if decorative)
- Never remove focus rings — use `focus-visible:` variants
- Never convey information with color alone
- Dynamic errors: use `role="alert"` or `aria-live`
