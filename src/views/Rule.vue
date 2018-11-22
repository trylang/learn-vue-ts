<template>
  <div>
    <small-title title="规则说明"></small-title>
    <div class="editor">
      <editor :initial-value="EditorContent" @onChange="onChangeHandler" id="tinyMce" :init="editorInit"></editor>
      <el-button class="btn btn-submit" @click="onSubmit">确认积分</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import smallTitle from '@/components/SmallTitle.vue';
// import tinyMce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/themes/modern/index.js';
import httpServer from '@/utils/http.ts';

import {
  State,
} from 'vuex-class';
interface jifen {
  name?: string;
  date1?: string;
  radio?: '通过';
}

@Component({
  components: {
    smallTitle,
    Editor
  }
})
export default class EditorCon extends Vue {
  @State userInfo: any;
  public EditorContent: any = '';
  public initialVal: any = '';
  public editorInit: any = {
    language_url: './static/zh_CN.js',
    language: 'zh_CN',
    selector: 'textarea',
    skin_url: './static/skins/lightgray',
    height: 300,
    // width:600,
    images_upload_url:
      'https://api.uat.iyuedian.com/iyd-imall-manage/imall/v1/upload',
    plugins:
      'link lists image code table colorpicker textcolor wordcount contextmenu',
    toolbar:
      'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
    images_upload_handle(blobInfo: any, success: any, failure: any) {
      let xhr: any, formData: any;
      xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      // xhr.open('POST', this.$store.state.imgUrl);
      xhr.onload = function() {
        if (xhr.status < 200 || xhr.status >= 300) {
          failure(xhr.status);
          return;
        }
        const json = JSON.parse(xhr.responseText);
        if (json.code === 0) {
          success(json.data[0].newFileName);
        } else {
          failure('HTTP Error: ' + json.msg);
        }
      };
      formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());
      xhr.send(formData);
    }
    // images_upload_url: 'https://api.iyuedian.com/iyd-imall-manage/imall/v1/upload'
  };
  private rule: string = '';
  private initRule: any = {};
  private userRouter: any = JSON.parse(sessionStorage.getItem('userRouter') || '');

  // 监听路由变化
  @Watch('$route')
  public onRouteChanged(route: any, oldRoute: any) {
    this.$forceUpdate();
  }
  /**
   * 富文本内容变化时事件
   */
  public onChangeHandler(res: any, index: any, tag: any) {
    // width height小程序不支持这个把这个替换了
    let html = res.level.content.replace('width', 'xxx');
    html = html.replace('height', 'yyy');
    this.initRule.rule = html;
    this.$emit('update:EditorContent', html);
  }

  public onSubmit() {
    const param = {
      method: 'POST',
      url: `wxapp-bill-integral/b/bill/rule/${
        this.initRule.id ? 'edit' : 'add'
      }`,
      params: {
        portalId: this.userRouter.portalId || this.userInfo.portalId,
        rule: this.initRule.rule,
        id: null
      }
    };
    if (this.initRule.id) {
      param.params.id = this.initRule.id
    }
    httpServer(param).then((res: any) => {
      this.$message({
        message: '规则录入成功',
        type: 'success'
      });
      this.$router.push('list');
    });
  }

  public getRule() {
    const param = {
      method: 'POST',
      url: 'wxapp-bill-integral/b/bill/rule/get',
      params: {
        portalId: this.userRouter.portalId || this.userInfo.portalId
      }
    };
    httpServer(param).then((res: any) => {
      if (res.data) {
        this.EditorContent = res.data.rule;
        this.$emit('update:EditorContent', res.data.rule);
        this.initRule = res.data;
      }
    });
  }
  public created() {
    this.getRule();
  }
}
</script>

<style lang="scss" scoped>
.editor {
  margin-top: 2rem;
  .btn {
    margin-top: 15px;
    margin-bottom: 30px;
    width: 160px;
    height: 48px;
    border-radius: 24px;
    font-size: 18px;
    font-weight: bold;
  }
  .btn-submit {
    color: #fff;
    background: rgba(255, 118, 51, 1);
  }
}
</style>

