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

## Layout Shift Prevention (SSR)

Client-side preferences that affect layout (e.g. sidebar collapsed state) MUST be handled with **cookie-based SSR** to avoid hydration mismatches and visual flashes.

### Pattern: Cookie-based SSR state

1. **Dual persistence** — When persisting a client preference, write to BOTH `localStorage` AND a cookie:
   ```ts
   function persistPreference(key: string, value: string) {
     localStorage.setItem(key, value)
     document.cookie = `${key}=${value}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
   }
   ```

2. **Server reads cookie** — The layout Server Component reads the cookie via `cookies()` from `next/headers` and passes it as a prop to the client component:
   ```tsx
   // app/(app)/layout.tsx — Server Component
   const cookieStore = await cookies()
   const collapsed = cookieStore.get('sidebar_collapsed')?.value === 'true'
   return <AppSidebar initialCollapsed={collapsed} />
   ```

3. **Client initializes from prop** — The client component uses the server-provided value as `useState` initial value. No `useEffect` to read localStorage on mount:
   ```tsx
   // Client Component
   export function AppSidebar({ initialCollapsed }: { initialCollapsed: boolean }) {
     const [collapsed, setCollapsed] = useState(initialCollapsed)
   ```

4. **Legacy migration only** — Use `useLayoutEffect` ONLY to migrate old localStorage-only preferences to the dual cookie+localStorage format. Never use it to read initial state.

### Pattern: Skeleton placeholders for async-dependent UI

When UI depends on async data (e.g. user roles for navigation items), show skeleton placeholders while loading. NEVER render a "guess" that will change after data loads:
```tsx
{isPending ? <NavSkeleton /> : <NavItems roles={roles} />}
```

### Pattern: Animation-dependent visibility

When content should only appear after a CSS transition completes (e.g. sidebar items after width animation), use `onTransitionEnd` — never `setTimeout`:
```tsx
const [transitioning, setTransitioning] = useState(false)
// Set transitioning=true when toggling, set false on onTransitionEnd
<aside onTransitionEnd={(e) => {
  if (e.propertyName === 'width') setTransitioning(false)
}}>
  {!transitioning && <SidebarContent />}
</aside>
```

### Rules

- NEVER use `useEffect`/`useLayoutEffect` to read localStorage and call `setState` for layout-affecting values — this causes flash
- NEVER use `dynamic(() => ..., { ssr: false })` to work around layout hydration issues — it's not allowed in Server Components
- ALWAYS persist layout-affecting preferences to cookies so the server can read them
- ALWAYS show skeletons while async data that changes visible UI is loading
- ALWAYS use `onTransitionEnd` (not `setTimeout`) for animation-gated visibility

---

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
