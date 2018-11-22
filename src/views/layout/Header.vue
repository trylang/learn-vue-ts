<template>
  <section class="menubox">
    <div>
      <div class="head">
        <div class="grid-content header-left bg-purple-dark left-info">
            <img src="../../assets/imgs/logo.png" class="logo-img" alt="">
        </div>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="list">
                <router-link :to="{path:'/photo/list'}">
                    小票审核
                </router-link>
            </el-menu-item>
            <el-menu-item index="rule">
                <router-link :to="{path:'/photo/rule'}">
                    规则说明
                </router-link>
            </el-menu-item>
            <el-menu-item index="statistics">
                <router-link :to="{path:'/photo/statistics'}">
                    数据统计
                </router-link>
            </el-menu-item>
        </el-menu>
      </div>
      <el-breadcrumb style="margin: 1rem 3rem;" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in breadList" :key="index" :to="item.path">{{item.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Watch, Vue, Model } from "vue-property-decorator";

@Component({})
export default class Header extends Vue {
  public activeIndex: string = "list";
  public breadList: any = [];
  // 监听路由变化
  @Watch("$route")
  public onRouteChanged(route: any, oldRoute: any) {
    this.activeIndex = route.path.replace("/photo/", "");
    this.breadList = route.matched;
  }

  public created() {
    this.activeIndex = this.$route.path.replace("/photo/", "");
    this.breadList = this.$route.matched;

  }
}
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
body {
  background: #f2f2f2;
}
.left-info {
  width: 210px;
  height: 93px;
  margin-left: 72px;
  display: flex;
}
.head {
  width: 1200px;
  height: 93px;
  display: flex;
  position: relative;
  margin: 0 auto;
}
.menubox {
  width: 100%;
  height: 93px;
  background: #284567;
  position: relative;
  display: flex;
}
.logo-img {
  height: 56px;
  margin-top: 18px;
}
.el-menu {
  flex: 1;
  background: #284567;
  display: flex;
}

.el-menu--horizontal .el-menu-item {
  color: #fff;
  background: #284567;
  font-size: 16px;
  line-height: 44px;
  margin: 0 20px;
  margin-top: 22px;
}
.el-menu--horizontal > .el-menu-item:hover {
  background: #284567;
  border-bottom: 3px solid #ff7633;
}
.el-menu--horizontal > .el-menu-item.is-active {
  background: #284567;
  border-bottom: 3px solid #ff7633;
  color: #fff;
}

.menu-item:not(.is-disabled):focus,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: transparent;
  color: #fff;
}
.el-dropdown-menu__item--divided:before,
.el-menu,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: transparent;
  color: #fff;
}
</style>
