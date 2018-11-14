<template>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

@Component({})
export default class Index extends Vue {
  created () {
    this.$store.commit('updateUserInfo', this.$route.query);
    this.$router.push('/photo/list');
  }
}

</script>


<style lang="scss" scoped>
</style>
