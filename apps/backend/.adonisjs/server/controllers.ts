export const controllers = {
  Auth: () => import('#controllers/auth_controller'),
  Account: () => import('#controllers/account_controller'),
  NewAccount: () => import('#controllers/new_account_controller'),
}
