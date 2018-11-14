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
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import smallTitle from "@/components/SmallTitle.vue";
import tinyMce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/themes/modern/index.js';


interface jifen {
  name?: string;
  date1?: string;
  radio?: "通过";
}

@Component({
  components: {
    smallTitle,
    Editor
  }
})
export default class EditorCon extends Vue {
  public EditorContent:any='';
  public initialVal:any = '';
  private rule: string = '';
  private initRule: any = {};
  public editorInit:any = {
      language_url: './static/zh_CN.js',
      language: 'zh_CN',
      selector: 'textarea',
      skin_url: './static/skins/lightgray',
      height: 300,
      // width:600,
      images_upload_url: 'https://api.uat.iyuedian.com/iyd-imall-manage/imall/v1/upload',
      plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
      toolbar: 'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
      images_upload_handler: function (blobInfo:any, success:any, failure:any) {
          let xhr:any, formData:any;
          xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open('POST', this.$store.state.imgUrl);
          xhr.onload = function() {
              if(xhr.status<200||xhr.status>=300){
                  failure(xhr.status);
                  return;
              }
              let json = JSON.parse(xhr.responseText);
              if(json.code==0){
                  success(json.data[0].newFileName);
              } else {
                  failure('HTTP Error: ' + json.msg);
              }
          };
          formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());
          xhr.send(formData);
      },
      // images_upload_url: 'https://api.iyuedian.com/iyd-imall-manage/imall/v1/upload'
  }

  //监听路由变化
  @Watch('$route')
  onRouteChanged(route: any, oldRoute: any) :void {
      this.$forceUpdate()
  }
  /**
   * 富文本内容变化时事件
   */
  public onChangeHandler(res:any,index:any,tag:any){
      //width height小程序不支持这个把这个替换了
      let html = res.level.content.replace("width","xxx")
      html = html.replace("height","yyy")
      this.initRule.rule = html;
      this.$emit('update:EditorContent',html)
  }

  public onSubmit() {
    let param = {
      method: 'POST',
      url: `wxapp-bill-integral/b/bill/rule/${this.initRule.id ? 'edit': 'add'}`,
      params: {
        portalId: this.$store.state.userInfo.portalId,
        rule: this.initRule.rule
      }
    };
    if (this.initRule.id) {
      param.params.id = this.initRule.id; 
    }
    this.$api(param).then(res => {
      this.$message({
        message: '规则录入成功',
        type: 'success'
      });
      this.$router.push("list");
    })
  }
  created() {
    let param = {
      method: 'POST',
      url: 'wxapp-bill-integral/b/bill/rule/get',
      params: {
        portalId: this.$store.state.userInfo.portalId,
      }
    };
    this.$api(param).then(res => {
      if (res.data){
        this.EditorContent = res.data.rule;
        this.initRule = res.data;
      } 
    })
  }
}
</script>

<style lang="scss" scoped>
.editor {
  margin-top: 2rem;
  .btn {
    margin-top: 15px;
    margin-bottom: 30px;
    width:160px;
    height:48px;
    border-radius:24px;
    font-size: 18px;
    font-weight: bold;
  } 
  .btn-submit {
    color: #fff;
    background:rgba(255,118,51,1);
  }
}
</style>

