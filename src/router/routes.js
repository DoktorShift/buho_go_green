const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Main routes
      {path: '', component: () => import('pages/IndexPage.vue')},
      {path: 'wallet', component: () => import('pages/Wallet.vue')},
      {path: 'settings', component: () => import('pages/Settings.vue')},
      {path: 'transaction/:id', component: () => import('pages/TransactionDetails.vue'), name: 'transaction-details'},

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
