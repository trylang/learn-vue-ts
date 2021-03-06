
// // iview 全局方法
// declare module 'vue/types/vue' {
//   interface Vue {
//     $Message: any,
//     $Modal: any,
//     $api:any
//   }
// }

import Vue from 'vue'
import VueRouter from 'vue-router'
import {Route} from 'vue-router'
declare module "*.vue" {
  import Vue from "vue"
  export default Vue
}
// 扩充
declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter,
    $route: Route,
    $Message: any,
    $Modal: any,
    $api:any,
  }
}