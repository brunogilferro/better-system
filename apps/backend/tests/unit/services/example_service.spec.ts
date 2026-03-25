import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
// import ExampleService from '#services/example_service'
// import { makeUser } from '../../helpers/factories.js'

/**
 * Service test template.
 *
 * Isolation strategy:
 * - Use withGlobalTransaction() for most tests — wraps each test in a DB
 *   transaction that is rolled back after, leaving the DB clean.
 * - Exception: manyToMany preload() opens a secondary DB connection that is
 *   NOT covered by withGlobalTransaction(). For those tests, commit the data
 *   and clean up manually in group.each.teardown().
 *
 * Run: node ace test unit
 */

// const service = new ExampleService()

test.group('ExampleService', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('example test', async ({ assert }) => {
    assert.isTrue(true)
  })
})
