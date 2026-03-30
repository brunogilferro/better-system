# Backend Rules

## Framework

- AdonisJS v7
- Lucid ORM (database)
- VineJS (validation)
- Tuyau (type-safe API client generation)

## Architecture Layers

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Routes | `start/routes.ts` | URL → controller mapping |
| Controllers | `app/controllers/` | Receive request, call service, return response |
| Services | `app/services/` | Business logic |
| Models | `app/models/` | Database entities (Lucid) |
| Validators | `app/validators/` | Input validation (VineJS) |
| Transformers | `app/transformers/` | Response serialization |

## Rules

- Controllers must be thin — delegate all logic to services
- Never put business logic in controllers
- Always validate input with validators
- Always serialize responses with transformers
- All responses are wrapped: `{ data: ... }` (via ApiSerializer in `providers/api_provider.ts`)
- Use migrations for all schema changes

## Naming Conventions

- Controllers: `<entity>_controller.ts` (snake_case)
- Services: `<entity>_service.ts`
- Models: `<entity>.ts` (singular)
- Validators: `<entity>.ts`
- Migrations: `<timestamp>_create_<table>_table.ts`

## Auth

- Token-based auth via `@adonisjs/auth` with `DbAccessTokensProvider`
- Custom scrypt auth: `senhahash bytea + senhasalt bytea` (no `withAuthFinder`)
- Protect routes with `auth` middleware
- Optional auth: `silentAuth` middleware

## API Versioning

- Routes under `/api/v1/`

## Database

- PostgreSQL, all table and column names lowercase
- PK columns use `GENERATED ALWAYS AS IDENTITY`
- bigint PKs need `consume: (v) => Number(v)` on `@column` to avoid manyToMany preload issues
