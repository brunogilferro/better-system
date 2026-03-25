---
name: database-to-feature
description: Generates the full backend layer (model, validator, transformer, service, controller, route) for a table that already exists in the database. Does NOT create migrations. Use when the user says "database-to-feature", "a tabela já existe", "gera o backend para a tabela existente", or provides a db:pull output.
---

# Database to Feature

> Use this skill when the **table already exists** in the database.
> No migration will be created.

---

## When the user invokes this skill

They will provide one of:
- A **table name** (e.g. "products") → you will read the schema to infer fields
- A **`db:pull` generated model** → you will use it directly
- A **`CREATE TABLE` SQL dump** → you will parse the fields from it

**Before starting, always confirm with the user:**
1. Should all CRUD routes be generated, or only specific ones?
2. Which routes require authentication?
3. Are there relationships with other tables?

---

## Step 1 — Prepare the database schema

Ask the user to run this command and share the output (or attach the file):

```bash
cd apps/backend
node ace db:pull
```

This generates models in `app/models/` based on the actual database schema.

If the user already ran `db:pull`, read the generated model file directly.

---

## Step 2 — Load project context

Read all of these before proceeding:

- `AGENTS.md`
- `apps/backend/database/schema.ts` — auto-generated schema types (CRITICAL — source of truth)
- `apps/backend/start/routes.ts` — existing routes (to avoid conflicts)
- `apps/backend/app/models/` — all existing models (for relationships)
- `apps/backend/app/transformers/` — existing transformers (for naming consistency)

---

## Step 3 — Schema Plan (MANDATORY — no code before this)

Output this section before any code:

### Schema Plan

#### Source
- Table name: `<table_name>`
- Fields inferred from: `db:pull` / `schema.ts` / SQL dump

#### Fields confirmed
| Column | Type | Nullable | Expose in API? |
|--------|------|----------|----------------|
| id | number | no | yes |
| name | string | no | yes |
| password | string | no | **NO** |
| ... | ... | ... | ... |

> Flag any sensitive fields (passwords, tokens, internal flags) as NOT exposed.

#### Relationships detected
- List any foreign keys found (e.g. `user_id → users.id`)
- Define as `belongsTo`, `hasMany`, or `manyToMany`

#### Routes to generate
```
GET    /api/v1/<resource>        → index
POST   /api/v1/<resource>        → store
GET    /api/v1/<resource>/:id    → show
PUT    /api/v1/<resource>/:id    → update
DELETE /api/v1/<resource>/:id    → destroy
```
Remove routes the user doesn't need.

#### What will NOT be created
- ❌ Migration (table already exists)

---

## Step 4 — Implementation

Generate files in this exact order:

### 0. Naming — ALWAYS English

Before writing any code, translate all identifiers to English:

| What | Rule | Example |
|------|------|---------|
| File name | `snake_case` English, reflecting DB hierarchy | `project_table.ts`, `project_table_participant.ts` |
| Class name | `PascalCase` English, reflecting DB hierarchy | `class ProjectTable`, `class ProjectTableParticipant` |
| Property names | `camelCase` English | `declare projectId: number` |
| JSON response keys | `camelCase` English | `{ projectId, tableName }` |
| DB column names | Keep as-is in `columnName` only | `columnName: 'CodigoProjeto'` |
| Lookup/enum values | Map to English in API layer | `lider_projeto` → `project_leader` |

> **Portuguese (or any non-English) is only allowed inside `columnName` strings.**

**Entity naming must mirror the DB table hierarchy.** DB table names encode parent-child relationships through prefixes — translate each segment to English and keep the full prefix chain:

| DB table | File | Class | Raw query type |
|---|---|---|---|
| `Projetos` | `project.ts` | `Project` | `Projects` / `Project` |
| `Projetos_Mesas` | `project_table.ts` | `ProjectTable` | `ProjectTables` |
| `Projetos_Mesas_Participantes` | `project_table_participant.ts` | `ProjectTableParticipant` | `ProjectTableParticipants` |
| `Projetos_Mesas_Maos` | `project_table_hand.ts` | `ProjectTableHand` | `ProjectTableHands` |

Never abbreviate or drop the parent context from the name.

**Avoid redundant suffixes** — if removing the suffix still leaves a clear name, remove it:

| ❌ Verbose | ✅ Concise |
|---|---|
| `listForUser(userId)` | `list(userId)` |
| `findForUser(id, userId)` | `find(id, userId)` |
| `ProjectListRow` | `Projects` |
| `ProjectDetailRow` | `Project` |
| `TableContext` | `TableEntry` |
| `globalRolesRows` | `rolesResult` |

### 1. Model (review or create)

If `db:pull` already generated the model:
- Read it
- Add relationships (`belongsTo`, `hasMany`, etc.)
- Add computed properties if useful
- Do NOT recreate from scratch — enhance what's there
- Rename any non-English property names to English (keeping `columnName`)

If model doesn't exist yet:
- Create `apps/backend/app/models/<entity>.ts`
- Extend from the generated schema (`#database/schema`)

### 2. Validator

- Location: `apps/backend/app/validators/<entity>.ts`
- Use VineJS syntax
- `store` validator: required fields based on schema (nullable columns → optional)
- `update` validator: all fields optional

### 3. Transformer

- Location: `apps/backend/app/transformers/<entity>_transformer.ts`
- Only expose safe fields (confirmed in Schema Plan)
- Never expose: passwords, tokens, internal flags
- Include serialized relationship data if needed

### 4. Service

- Location: `apps/backend/app/services/<entity>_service.ts`
- Methods: `index`, `show`, `store`, `update`, `destroy`
- No HTTP logic — pure business logic only

**rawQuery vs Lucid in services:**

Use Lucid ORM by default. Only use `db.rawQuery` when the query requires:
- Role derivation via FK boolean checks (`(p."CodigoLider" = ?) AS is_leader`)
- `COUNT DISTINCT` with `GROUP BY`
- `EXISTS` subqueries for access checks
- Complex `OR` conditions across multiple joined tables

When using rawQuery:
- Add a JSDoc comment explaining why Lucid is insufficient
- Extract repeated SQL fragments as named string constants
- Type the result with `QueryResult<T>` from `#types/raw_query`
- Convert snake_case rows to camelCase inside `.map()` immediately after the query

### 5. Controller

- Location: `apps/backend/app/controllers/<entity>_controller.ts`
- Thin — delegates to service
- Uses validators for input
- Uses transformers for output
- All responses via `ctx.serialize()`

### 6. Routes

- Add to `apps/backend/start/routes.ts`
- Group under `/api/v1/<resource>`
- Apply `middleware.auth()` where required

---

## Step 5 — Validation checklist

- [ ] No migration was created (table already exists)
- [ ] Fields match what's in `schema.ts` exactly (no invented columns)
- [ ] Sensitive fields are excluded from transformer
- [ ] Relationships match foreign keys in the actual schema
- [ ] `store` validator aligns with DB constraints (nullable → optional)
- [ ] Routes added without conflicting with existing ones
- [ ] Controller is thin — no business logic
- [ ] All identifiers (file, class, properties, JSON keys) are in English
- [ ] Non-English DB column names are only inside `columnName` strings
- [ ] Non-English enum/lookup values are mapped to English before leaving the API

---

## Step 6 — Next step (frontend integration)

After the backend is generated, always inform the user:

---

**Backend for `<entity>` is ready.**

To connect the frontend, choose one of:

**Option A — You have a Figma design:**
```
figma-to-next-screen: [Figma link for this screen]
```
The skill will generate types, service (using `lib/api.ts`), hook, components, and page — fully integrated with the backend just created.

**Option B — No Figma yet:**
```
new-feature: frontend for <entity> listing/detail (backend already exists)
```
The skill will generate a functional UI with shadcn components, connected to the backend.

**Before running either option, make sure the backend is running** so Tuyau can generate the updated API types:
```bash
pnpm dev:backend
```

---

## Batch usage (multiple tables)

If the project has many existing tables, process them one at a time:

```
# Round 1
database-to-feature: tabela products
# → then do the frontend for products

# Round 2
database-to-feature: tabela orders
# → then do the frontend for orders
```

Do not try to generate all tables at once — context window will overflow and quality will drop.
