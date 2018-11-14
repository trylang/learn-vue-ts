import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store';
import * as ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './registerServiceWorker';
import httpServer from '@/utils/http.ts';
Vue.config.productionTip = false;
Vue.prototype.$api = httpServer;
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
