import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { transition: 'slide-left' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { transition: 'slide-left' }
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
})

export default router
