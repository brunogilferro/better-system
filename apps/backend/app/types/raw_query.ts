/**
 * Generic wrapper for results from db.rawQuery().
 *
 * Use this when Lucid's query builder can't handle the complexity
 * (e.g. PascalCase table names, CASE WHEN role derivation, COUNT DISTINCT).
 *
 * Pattern:
 *   const result = await db.rawQuery<RawQueryResult<MyRow>>(sql, bindings)
 *   return result.rows
 */
export type RawQueryResult<T> = { rows: T[] }
