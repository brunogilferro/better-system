---
name: backend-from-schema
description: Generates a complete AdonisJS backend feature (migration, model, validator, service, controller, route, transformer) from a schema description or entity name. Use when the user says "cria o backend para", "gera o CRUD de", "backend-from-schema", or describes a new entity/resource they want to implement.
---

# Backend from Schema

## Critical Rule

You MUST NOT start coding immediately.

You MUST follow this exact sequence:

1. Schema Plan
2. Implementation
3. Validation

If you skip the Schema Plan, the response is INVALID.

---

## When the user invokes this skill

They will provide either:
- An **entity name** (e.g. "Product", "Course", "Enrollment")
- A **field description** (e.g. "Product with name, price, stock, and category")
- A **schema** (TypeScript type or JSON structure)

If fields are not provided, ask before proceeding.

---

## Step 1 — Load project context

Read these before proceeding:
- `AGENTS.md` — project architecture and rules
- `apps/backend/database/schema_rules.ts` — any custom schema type rules
- `apps/backend/start/routes.ts` — existing routes (to avoid conflicts)
- `apps/backend/app/models/` — existing models (to check for relationships)

---

## Step 2 — Schema Plan (MANDATORY — no code before this)

Output this section before any code:

### Schema Plan

#### Entity
- Name (singular PascalCase): e.g. `Product`
- Table name (snake_case plural): e.g. `products`

#### Fields
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | increments | no | auto |
| name | string | no | |
| ... | ... | ... | |
| created_at | timestamp | auto | |
| updated_at | timestamp | auto | |

#### Relationships
- List any `belongsTo`, `hasMany`, `manyToMany` relationships

#### Routes to be created
```
GET    /api/v1/<resource>          → index
POST   /api/v1/<resource>          → store
GET    /api/v1/<resource>/:id      → show
PUT    /api/v1/<resource>/:id      → update
DELETE /api/v1/<resource>/:id      → destroy
```

#### Auth required?
- Which routes are protected by `middleware.auth()`

---

## Step 3 — Implementation

Generate files in this exact order:

### 1. Migration
- Location: `apps/backend/database/migrations/<timestamp>_create_<table>_table.ts`
- Use Lucid migration syntax
- Include all columns and indexes
- Add foreign keys if relationships exist

### 2. Model
- Location: `apps/backend/app/models/<entity>.ts`
- Extend from the generated schema (`#database/schema`)
- Add computed properties if useful
- Define relationships

### 3. Validator
- Location: `apps/backend/app/validators/<entity>.ts`
- Use VineJS syntax
- Create validators for `store` and `update` actions separately
- Update validator should use `.optional()` on fields

### 4. Transformer
- Location: `apps/backend/app/transformers/<entity>_transformer.ts`
- Only expose safe fields (never expose passwords, internal flags)
- Include relationship data if needed

### 5. Service
- Location: `apps/backend/app/services/<entity>_service.ts`
- Contains all business logic
- Methods: `index`, `show`, `store`, `update`, `destroy`
- No HTTP logic — pure business logic only

### 6. Controller
- Location: `apps/backend/app/controllers/<entity>_controller.ts`
- Thin — delegates everything to the service
- Uses validators for input
- Uses transformers for output
- Wraps responses in `{ data: ... }` via `ctx.serialize()`

### 7. Routes
- Add to `apps/backend/start/routes.ts`
- Group under `/api/v1/<resource>`
- Apply `middleware.auth()` where appropriate

---

## Naming Conventions

| Layer | Pattern | Example |
|-------|---------|---------|
| Migration | `<timestamp>_create_<table>_table.ts` | `1234_create_products_table.ts` |
| Model | `<Entity>.ts` (singular PascalCase) | `Product.ts` |
| Validator | `<entity>.ts` | `product.ts` |
| Transformer | `<entity>_transformer.ts` | `product_transformer.ts` |
| Service | `<entity>_service.ts` | `product_service.ts` |
| Controller | `<entity>_controller.ts` | `product_controller.ts` |
| Route prefix | `/<entities>` (plural kebab-case) | `/products` |

---

## Rules

- Controllers must be thin — no business logic
- Services must be pure — no HTTP or response logic
- Always use validators for `store` and `update`
- Always use transformers to serialize responses
- Never expose sensitive fields in transformers
- All responses go through `ctx.serialize()` (wraps in `{ data: ... }`)
- Use the existing `middleware.auth()` and `middleware.silentAuth()` from `#start/kernel`

---

## Code patterns to follow

### Controller pattern
```ts
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ProductService from '#services/product_service'
import { storeProductValidator, updateProductValidator } from '#validators/product'

@inject()
export default class ProductController {
  constructor(private productService: ProductService) {}

  async index({ response }: HttpContext) {
    const products = await this.productService.index()
    return response.ok(products)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(storeProductValidator)
    const product = await this.productService.store(data)
    return response.created(product)
  }
}
```

### Service pattern
```ts
export default class ProductService {
  async index() {
    return Product.all()
  }

  async store(data: StoreProductData) {
    return Product.create(data)
  }
}
```

### Transformer pattern
```ts
export function productTransformer(product: Product) {
  return {
    id: product.id,
    name: product.name,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}
```

---

## Step 4 — Validation checklist

- [ ] Migration uses correct Lucid column types
- [ ] Model defines all relationships
- [ ] `store` validator requires all mandatory fields
- [ ] `update` validator makes all fields optional
- [ ] Transformer excludes sensitive fields
- [ ] Controller is thin (delegates to service)
- [ ] Routes added to `start/routes.ts`
- [ ] Auth middleware applied where required
