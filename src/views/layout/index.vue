<template>
  <div class="body">
    <p-header></p-header>
    <div class="content">
      <router-view/>
    </div>
    <footer><span>Coryright 2018 RTMAP</span></footer>
  </div>
</template>

<script lang="ts">
import pHeader from './Header.vue';
import { Component, Vue, Model } from 'vue-property-decorator';

@Component({
  components: {
    pHeader,
  }
})
export default class Layout extends Vue {}
</script>

<style lang="scss" scoped>
.body {
  width: 100%;
  height: 100%;
  background: #EEEEEE;
  .content {
    margin: 3rem;
    margin-bottom: 0;
    background: #fff;
    border-radius: 8px;
    padding: 1.5rem;
  }
  footer {
    z-index: 0;
    position: fixed;
    bottom: 0;
    height: 60px;
    line-height: 60px;
    color: #999999;
    font-size: 14px;
    left: 50%;
    margin-left: -70px;
  }
}
</style>

