import Vue from 'vue'
import Router from 'vue-router'
import photoRoute from './photo'
import Layout from '@/views/layout'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/photo/index',
    },
    {
      path: '/photo',
      component: Layout,
      redirect: "/photo/list",
      children: photoRoute,
    }
  ],
});
