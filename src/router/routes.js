
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
        path: 'record-visit/:patient',
        component: () => import('pages/RecordVisit.vue'),
        name: 'record-visit',
        meta: {
          requiresAuth: true
        }
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
        name: 'registerPatient',
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
        path: 'item',
        component: () => import('pages/ItemPage.vue'),
        name: 'item',
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
      }
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
