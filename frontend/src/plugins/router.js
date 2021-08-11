import { getAuthToken } from '@/api/httpClient.api';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/pages/Home.vue';
import Login from '@/pages/Login.vue';
import NotFoundPage from '@/pages/404.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: 'Home', noAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { title: 'Login' },
  },
  {
    path: '*',
    name: 'page-not-found',
    component: NotFoundPage,
    meta: { title: 'Page Not Found', noAuth: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  redirect: '/',
  routes,
});

router.beforeEach((to, _from, next) => {
  // Change the document title
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);
  if (nearestWithTitle) document.title = `${nearestWithTitle.meta.title} | LEMAC`;
  else document.title = 'LEMAC';

  if (to.matched.some((record) => !record.meta.noAuth) && !getAuthToken()) {
    next({
      path: '/',
      params: { nextUrl: to.fullPath },
    });
    return;
  }

  next();
});

export default router;
