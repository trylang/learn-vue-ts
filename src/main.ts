import Vue from 'vue';
import App from './App.vue';
import 'viewerjs/dist/viewer.css';
import router from './router/router';
import store from './store';
import * as ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './registerServiceWorker';
import httpServer from '@/utils/http.ts';
Vue.config.productionTip = false;

Vue.prototype.$api = httpServer;
Vue.prototype.global_token = '';
Vue.use(ElementUI);
// console.log(Viewer);
// debugger;
// Viewer.setDefaults({
//   Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
// });
// Vue.use(Viewer);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
