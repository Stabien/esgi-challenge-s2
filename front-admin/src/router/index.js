import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/login-admin',
      name: 'login-admin',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/join',
      name: 'join',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/graph',
      name: 'graph',
      component: () => import('@/views/GraphView.vue')
    },
    {
      path: '/request/:uid',
      name: 'request',
      component: () => import('@/views/RequestView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      meta: {
        layout: 'none' // Utilisez une méta pour identifier les routes sans layout
      },
      component: () => import('@/views/404.vue')
    },
    {
      path: '/tags',
      name: 'chooseTags',
      component: () => import('@/components/GraphView/FormTagView.vue')
      // ==================================================================   ce qu'on a ajouté
    }
  ]
});

export default router;
