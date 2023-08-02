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
      path: '/account-settings',
      name: 'account-settings',
      component: () => import('@/views/RequestView.vue')
    },
    {
      path: '/admin-user/:uid',
      name: 'admin-user',
      component: () => import('@/views/RequestView.vue')
    },
    {
      path: '/tuto',
      name: 'tuto',
      component: () => import('@/views/TutoView.vue')
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('@/views/LogoutView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      meta: {
        layout: 'none' // Utilisez une méta pour identifier les routes sans layout
      },
      component: () => import('@/views/404.vue')
    }
  ]
});

export default router;
