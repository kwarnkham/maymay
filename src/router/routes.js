
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'index',
      },
      {
        path: 'logout',
        component: () => import('pages/LogoutPage.vue'),
        name: 'logout',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'patients',
        component: () => import('pages/PatientsPage.vue'),
        name: 'patients',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'register-patient',
        component: () => import('pages/RegisterPatient.vue'),
        name: 'register-patient',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'visits',
        component: () => import('pages/VisitsPage.vue'),
        name: 'visits',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'visits/:visit',
        component: () => import('pages/VisitDetails.vue'),
        name: 'visit-details',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'items',
        component: () => import('pages/ItemPage.vue'),
        name: 'items',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'item/:item',
        component: () => import('pages/ItemDetails.vue'),
        name: 'item-details',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'products',
        component: () => import('pages/ProductPage.vue'),
        name: 'products',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'product/:product',
        component: () => import('pages/ProductDetails.vue'),
        name: 'product-details',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'change-password',
        component: () => import('pages/ChangePassword.vue'),
        name: 'change-password',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'users',
        component: () => import('pages/UserPage.vue'),
        name: 'users',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'printer-setting',
        component: () => import('pages/PrinterSetting.vue'),
        name: 'printer-setting',
        meta: {
          requiresAuth: true
        }
      },
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
