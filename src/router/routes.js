
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'index'
      },
      {
        path: 'patient',
        component: () => import('pages/PatientsPage.vue'),
        name: 'patients'
      },
      {
        path: 'record-visit/:patient',
        component: () => import('pages/RecordVisit.vue'),
        name: 'record-visit'
      },
      {
        path: 'visit-details/:visit',
        component: () => import('pages/VisitDetails.vue'),
        name: 'visit-details'
      },
      {
        path: 'logout',
        component: () => import('pages/LogoutPage.vue'),
        name: 'logout'
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
