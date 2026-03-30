# Better System — Claude Instructions

You are a senior fullstack engineer working in the Better System monorepo.

## Architecture

- Frontend: `apps/frontend` (Next.js, App Router)
- Backend: `apps/backend` (AdonisJS v7)
- Node.js 24+ required

## Before generating any code

Always read:
- `docs/design-system.md` — structural rules (spacing, layout, typography scale)
- `docs/figma-design-rules.md` — project visual identity (colors, fonts)
- `docs/components-registry.md` — available components
- `docs/data-pattern.md` — data flow rules

## Non-negotiable rules

- Never hardcode colors — use tokens from `figma-design-rules.md`
- Never create a component that already exists in the registry
- Never call APIs directly in components — use services + hooks
- Never invent new patterns — follow existing ones
- Never use arbitrary Tailwind values (e.g. `mt-[18px]`)

## Consistency over creativity

When in doubt, follow the closest existing pattern.

---

## Commit Convention

All commits MUST follow Conventional Commits format.

```
<type>(<scope>): <short description>
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change without feature or fix |
| `style` | UI/CSS changes |
| `docs` | Documentation |
| `test` | Tests |
| `chore` | Build, dependencies, config |
| `perf` | Performance improvement |

### Scopes

`frontend` · `backend` · `auth` · `ui` · `api` · `db` · `config` · `docs`

### Rules

- Lowercase, English, imperative mood ("add", "fix", "update")
- Max 72 chars on first line
- No period at the end

---

## Skills

When the user invokes one of the skills below, read the corresponding file for full instructions before proceeding. Never start coding without reading the skill file first.

| Skill | Triggers | File |
|-------|----------|------|
| `new-feature` | "cria a feature de", "implementa o módulo de" | `.claude/skills/new-feature/SKILL.md` |
| `backend-from-schema` | "cria o backend para", "gera o CRUD de" | `.claude/skills/backend-from-schema/SKILL.md` |
| `database-to-feature` | "a tabela já existe", "gera o backend para a tabela existente" | `.claude/skills/database-to-feature/SKILL.md` |
| `frontend-from-route` | "conecta o frontend ao backend de", "cria o frontend para a rota" | `.claude/skills/frontend-from-route/SKILL.md` |
| `figma-to-next-screen` | "tela do Figma", "implementar design", Figma link | `.claude/skills/figma-to-next-screen/SKILL.md` |
| `create-component` | "cria o componente", "cria um componente de" | `.claude/skills/create-component/SKILL.md` |
| `write-tests` | "escreve testes para", "cria os testes de" | `.claude/skills/write-tests/SKILL.md` |
| `review-file` | "revisa esse arquivo", "esse código segue o padrão?" | `.claude/skills/review-file/SKILL.md` |
| `refactor` | "refatora", "ajusta esse código para o padrão" | `.claude/skills/refactor/SKILL.md` |
| `a11y-review` | "verifica acessibilidade", "esse componente está acessível?" | `.claude/skills/a11y-review/SKILL.md` |
