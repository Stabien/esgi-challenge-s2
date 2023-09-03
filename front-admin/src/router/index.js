import { createRouter, createWebHistory } from 'vue-router';
import { getConnectionProviderValue } from '@/utils';
import { userStatusWebmaster, userStatusAdmin } from '@/utils/userConstant';

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
      path: '/heatmap',
      name: 'heatmap',
      component: () => import('@/views/HeatmapView.vue')
    },
    {
      path: '/heatmapPath/:path',
      name: 'heatmapPath',
      component: () => import('@/views/HeatmapPathView.vue')
    },
    {
      path: '/user-heatmap/:uuid',
      name: 'user-heatmap',
      component: () => import('@/views/HeatmapView.vue')
    },
    {
      path: '/user-heatmapPath/:uuid/:path',
      name: 'user-heatmapPath',
      props: true,
      component: () => import('@/views/HeatmapPathView.vue')
    },
    {
      path: '/request/:uid',
      name: 'request',
      component: () => import('@/views/UserView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue')
    },
    {
      path: '/user-view/:uuid',
      name: 'user-view',
      component: () => import('@/views/GraphView.vue')
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: () => import('@/views/AlertsView.vue')
    },
    {
      path: '/alerts-view/:uuid',
      name: 'alerts-view',
      component: () => import('@/views/AlertsView.vue')
    },
    {
      path: '/account-settings',
      name: 'account-settings',
      component: () => import('@/views/UserView.vue')
    },
    {
      path: '/admin-user/:uid',
      name: 'admin-user',
      component: () => import('@/views/UserView.vue')
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

router.beforeEach(async (to) => {
  const user = getConnectionProviderValue();
  const publicPages = ['login', 'join'];
  const privatePages = ['account-settings', 'graph', 'admin', 'heatmap', 'heatmapPath'];
  const webMasterPages = ['graph'];
  const adminPages = ['admin'];

  if (user.isLogged && publicPages.includes(to.name)) return '/';

  if (!user.isLogged && webMasterPages.includes(to.name) && user.status !== userStatusWebmaster)
    return '/404';
  if (adminPages.includes(to.name) && user.status !== userStatusAdmin) return '/404';
  if (!user.isLogged && privatePages.includes(to.name)) return '/404';
  // if (user.status !== userStatusWebmaster) console.log('not webmaster');
});

export default router;
