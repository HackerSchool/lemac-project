import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/pages/Home.vue';
import Login from '@/pages/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  redirect: '/',
  routes,
});

export default router;
