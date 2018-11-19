<template>
  <div class="samll-title">{{title}}</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
@Component({})
export default class SmallTitle extends Vue {
  @Prop({})
  title?: string;
}
</script>

<style lang="scss" scoped>
.samll-title {
  font-size: 18px;
  line-height: 18px;
  padding-left: 6px;
  line-height: 1;
  text-align: left;
  color: #35485f;
  font-weight: bold;
  border-left: 3px solid #35485f;
}
</style>

