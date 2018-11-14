<template>
  <div class="samll-title">{{title}}</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
  @Component
  export default class BeforeUpload extends Vue {
    @Prop(String) title: string
  }
</script>

<style lang="scss" scoped>
.samll-title{
		font-size: 18px;
		line-height: 18px;
		padding-left: 6px;
		line-height: 1;
		text-align: left;
		color: #35485F;
		font-weight: bold;
		border-left: 3px solid #35485F;
	}
</style>

