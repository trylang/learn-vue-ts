<template>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import {
  State,
  Getter,
  Action,
  Mutation,
  namespace
} from 'vuex-class';

@Component({})
export default class Index extends Vue {
  @Action updateUserInfo: any;
  public create() {
    this.updateUserInfo(this.$route.query);
    // this.$store.commit('updateUserInfo', this.$route.query);
    this.$router.push('/photo/list');
  }
}
</script>


<style lang="scss" scoped>
</style>
