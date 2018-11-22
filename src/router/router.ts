import Vue from 'vue';
import Router from 'vue-router';
import photoRoute from './photo';
import Layout from '@/views/layout/index.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      name: '拍照积分',
      redirect: '/photo/index',
    },
    {
      path: '/photo',
      component: Layout,
      name: '拍照积分',
      redirect: '/photo/list',
      children: photoRoute,
    },
  ],
});
