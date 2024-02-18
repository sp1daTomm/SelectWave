import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/WebLayout.vue'),
    children: [
      {
        path: '',
        name: 'HomeDefault',
        component: () => import('../views/HomeView.vue'),
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('../views/AboutView.vue'),
      },
      {
        path: '/privacy',
        name: 'Privacy',
        component: () => import('../views/PrivacyView.vue'),
      },
      {
        path: '/terms',
        name: 'Terms',
        component: () => import('../views/TermsView.vue'),
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/NotFoundView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
  {
    path: '/pullInfo',
    name: 'PullInfo',
    component: () => import('../views/pullInfo.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes,
});

export default router;
