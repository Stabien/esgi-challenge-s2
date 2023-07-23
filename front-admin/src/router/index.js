import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { transition: 'slide-left' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { transition: 'slide-left' }
    },
    {
      path: '/join',
      name: 'join',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/make-a-demand',
      name: 'make-a-demand',
      component: () => import('@/views/DemandView.vue')
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
