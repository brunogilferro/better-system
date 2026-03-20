# DATA PATTERN

## Core Principle

Data access must be separated from UI.

Components must never handle API logic directly.

---

## Data Flow

```
Component → Hook → Service → API
```

---

## Structure

### Services (API layer)

- Location: `services/`
- Responsibility:
  - Handle API calls
  - Transform raw responses if needed
  - No UI logic

Naming: `<entity>.service.ts` → e.g. `project.service.ts`

---

### Hooks (Data layer)

- Location: `hooks/`
- Responsibility:
  - Fetch data using services
  - Manage loading, error, and state
  - Prepare data for UI

Naming: `use<EntityPlural>.ts` → e.g. `useProjects.ts`

---

### Types (Domain layer)

- Location: `types/`
- Responsibility:
  - Define domain models
  - Define API response types

Naming: `<entity>.ts` → e.g. `project.ts`

---

## Rules

- NEVER call APIs directly inside components
- ALWAYS use services for API communication
- ALWAYS use hooks for data fetching and state
- Services MUST be pure (no side effects outside API calls)
- Hooks MUST handle: loading state, error state, data state

---

## Server Components Exception

In server components:

- You MAY call services directly
- DO NOT use client hooks (`use client` not needed)

---

## Anti-patterns (FORBIDDEN)

- ❌ `fetch`/`axios` inside components
- ❌ Business logic inside UI
- ❌ Duplicating API calls across components
- ❌ Calling services without hooks (unless server component)

---

## Example Flow

```ts
// types/project.ts
export type Project = {
  id: string
  name: string
}

// services/project.service.ts
export async function getProjects(): Promise<Project[]> {
  return api.get('/projects')
}

// hooks/useProjects.ts
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })
}

// component (client)
const { data, isLoading, error } = useProjects()

// component (server)
const projects = await getProjects()
```
