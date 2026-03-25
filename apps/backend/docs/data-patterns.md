# Backend Data Patterns

## rawQuery vs Lucid ORM

Use **Lucid ORM** by default.

Only use `db.rawQuery` when the query requires one or more of:

| Condition | Example |
|---|---|
| Role derivation via FK boolean checks | `(p."CodigoLiderProjeto" = ?) AS is_leader` |
| `COUNT DISTINCT` with `GROUP BY` | participant count per table |
| `EXISTS` subqueries for access checks | user has any participation in project |
| Complex `OR` conditions across multiple joined tables | leader OR table_leader OR dealer OR participant |

---

## The `QueryResult<T>` pattern

`db.rawQuery` returns `{ rows: T[] }`. We use a generic alias to avoid repeating that wrapper inline on every call.

**Type files:** `app/types/db_rows/`

```
app/types/db_rows/
└── shared.ts     → QueryResult<T>
```

Domain-specific row types live in their own file following the DB hierarchy naming:

```
app/types/db_rows/
├── shared.ts              → QueryResult<T>
├── project.ts             → Projects, Project, ProjectTables
└── account.ts             → AccountContext
```

**Usage:**

```ts
import db from '@adonisjs/lucid/services/db'
import type { Projects } from '#types/db_rows/project'
import type { QueryResult } from '#types/db_rows/shared'

const result = await db.rawQuery<QueryResult<Projects>>(sql, [userId])
result.rows.map((row) => row.project_id)
```

**Rules when adding a new entity:**
- Create `app/types/db_rows/<entity>.ts` following the DB hierarchy naming
- `Projetos_Mesas_Maos` → `project_table_hand.ts` → types `ProjectTableHands`, `ProjectTableHand`
- Add a JSDoc comment in the service explaining why Lucid is insufficient
- Extract repeated SQL fragments as named string constants
- Always convert snake_case rows to camelCase inside `.map()` immediately after the query

---

## Lookup value mapping

DB lookup tables store codes in the source language (e.g. `ativo`, `finalizado`).
The API layer maps these to English before returning the response.

Pattern — constant map at the top of the service:

```ts
const STATUS_MAP: Record<string, string> = {
  ativo: 'active',
  finalizado: 'finished',
  pausado: 'paused',
}

// In the mapper:
status: STATUS_MAP[row.status] ?? row.status,
```

The `?? row.status` fallback ensures unknown codes pass through instead of silently dropping data.
