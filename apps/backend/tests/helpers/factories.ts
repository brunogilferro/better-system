import User from '#models/user'

/**
 * Test factories — create minimal valid DB records for use in tests.
 *
 * Rules:
 * - Each factory sets only required fields; use overrides for optional ones.
 * - Use a sequential counter (seq) for unique string fields (email, name).
 * - For tables with composite PKs (no Lucid support), use db.rawQuery() or
 *   db.table().insert() directly instead of a model.
 * - For manyToMany pivot inserts, prefer db.rawQuery() over model.related().attach()
 *   when testing inside withGlobalTransaction() — see note in account_service.spec.ts.
 */

let seq = 0
const next = () => ++seq

// ─── User ────────────────────────────────────────────────────────────────────

type UserOverrides = Partial<{
  fullName: string
  email: string
}>

export async function makeUser(overrides: UserOverrides = {}) {
  const n = next()
  return User.create({
    fullName: overrides.fullName ?? `User ${n}`,
    email: overrides.email ?? `user${n}@test.com`,
    password: 'Test@12345',
  })
}
