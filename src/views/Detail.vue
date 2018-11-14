<template>
  <div>
    <small-title title="审核详情"></small-title>
    <div class="content">

      <div class="left">
        <el-carousel :autoplay="false" indicator-position="outside" trigger="click">
          <el-carousel-item v-for="item in detail.receiptPhotos" :key="item">
            <img :src="item" alt="">
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="right" >
        <header v-if="auditType=='view'">
          <p>审核时间：<span>{{detail.shoppingTime}}</span></p>
          <p>审核人：<span>步步高新天地信息部</span></p>
          <p v-if="detail.reason">驳回理由：<span>{{detail.reason}}</span></p>
          <img v-if="detail.state == 1" src="../assets/imgs/pass.png" alt="">
          <img v-if="detail.state == 2" src="../assets/imgs/reject.png" alt="">
        </header>

        <h5>会员信息</h5>
        <div class="detail">
          <div class="item">
            <!-- <p>注册时间：<span>2018.09.28</span></p> -->
            <p>会员ID：<span>{{detail.vipCard}}</span></p>
            <p>手机号：<span>{{detail.mobile}}</span></p>

          </div>
          <div class="item">
            <p>Cid<span>{{detail.cid}}</span></p>
          </div>
  
        </div>

        <div class="line"></div>

        <div class="detail">
          <div class="item">
            <p>订单号：<span>{{detail.id}}</span></p>
            <p>消费商户：<span>{{detail.storeName}}</span></p>
          </div>
          <div class="item">
            <p>消费日期：<span>{{detail.shoppingTime}}</span></p>
            <p>消费积分：<span style="color: #FF6C07;">+{{detail.integral}}</span></p>
          </div>
  
        </div>


        <div class="content" v-if="auditType=='audit'">
          <p>为验证订单信息属实，请准确填写图中相关信息并完成排重认证</p>
          <el-form class="form" :model="detail" label-width="100px">
            <el-form-item label="订单号：">
              <el-input placeholder="请填写完整订单号" v-model="detail.id"></el-input>
            </el-form-item>
            <el-form-item label="消费日期：">
              <el-date-picker type="date" placeholder="请选择消费日期" v-model="detail.shoppingTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>

            <el-form-item class="store" label="消费商户：">
              <el-select v-model="detail.storeId" placeholder="请选择">
                <el-option
                  v-for="item in stores"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <div>
                <span class="verify" @click="verify">排重验证</span>
                <span v-if="ifverify > 0" style="color: #71B900;position: absolute; width: 20%; padding-left: 1rem;"><i class="el-icon-circle-check"></i>成功认证</span>
                <span v-if="ifverify == 0" style="color: #FF7633;position: absolute; width: 20%; padding-left: 1rem;"><i class="el-icon-circle-close"></i>重复订单</span>
              </div>              
            </el-form-item>


            <div class="line"></div>

            <el-form-item label="审核结果：">
              <el-radio-group style="margin-left: -9rem;" v-model="detail.state" size="mini">
                <el-radio-button border label="1">通过</el-radio-button>
                <el-radio-button border label="2">驳回</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="消费金额：">
              <el-input placeholder="请填写当前小票消费金额" v-model="detail.shoppingFee"></el-input>
            </el-form-item>
            <el-form-item label="本次积分：">
              <el-input placeholder="请填写积分数额" v-model="detail.integral"></el-input>
            </el-form-item>
            <el-form-item v-if="detail.state == 2" label="驳回理由：">
              <el-input placeholder="请填写积分数额" type="textarea" :rows="2" v-model="detail.reason"></el-input>
            </el-form-item>
            <el-form-item style="width: 38rem; margin-left: -100px;margin-top；1rem;">
              <el-button class="btn btn-cancel" @click="onSubmit">审核小票</el-button>
              <el-button class="btn btn-submit" @click="onSubmit('next')">审核小票并继续</el-button>
              <el-button class="btn btn-cancel">返回列表</el-button>
            </el-form-item>
          </el-form>
        </div>

      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import smallTitle from "@/components/SmallTitle.vue";

@Component({
  components: {
    smallTitle
  }
})
export default class List extends Vue {

  private ifverify: number = -1;
  private detail: any = {};
  private stores: any = [];
  public auditType: string;

  public onSubmit() {
    if (!this.detail.receiptNumber || !this.detail.storeId) {
      this.$message('请填写完成信息');
      return;
    }
    if (this.detail.state == 0) {
      this.$message('请选择审核结果');
      return;
    }
    let store = this.stores.find(item => item.id == this.detail.storeId);
    let param = {
      method: 'POST',
      url: 'wxapp-bill-integral/b/bill/audit',
      params: {
        portalId: this.$store.state.userInfo.portalId,
        userId: this.$store.state.userInfo.userId,
        id: this.detail.id,       
        receiptNumber: this.detail.receiptNumber,
        shoppingTime: this.detail.shoppingTime,
        reason: this.detail.reason,
        storeName: store ? store.name : '',
        integral: this.detail.integral * 100,
        state: this.detail.state,
        storeId: this.detail.storeId,
      }
    };
    let that = this;
    this.$api(param).then(res => {
      this.$message({
        message: '审核完成',
        type: 'success'
      });
      that.$router.push("list");
    })
    
  }

  public verify() { // 验重
    if (!this.detail.receiptNumber || !this.detail.storeId) {
      this.$message('请填写完成信息');
      return;
    }
    let param = {
      method: 'POST',
      url: 'wxapp-bill-integral/b/bill/check',
      params: {
        portalId: this.$store.state.userInfo.portalId,
        receiptNumber: this.detail.receiptNumber,
        storeId: this.detail.storeId,
      }
    };
    let that = this;
    this.$api(param).then(res => {
      this.ifverify = res.data;
    }) 
  }

  private getStores() {
    let param = {
      method: 'POST',
      url: 'wxapp-bill-integral/common/bill/store/list',
      params: {
        portalId: this.$store.state.userInfo.portalId,
        keyWords: ''
      }
    };
    this.$api(param).then(res => {
      if (res.status == 200) {
        this.stores = res.data;
      }
    })
  }

  //监听路由变化
  @Watch('$route')
  onRouteChanged(route: any, oldRoute: any) :void {
    this.auditType = route.query.type;
  }

  created() {
    this.getStores();
    let detail = sessionStorage.getItem('detail') ? JSON.parse(sessionStorage.getItem('detail')) : {};
    detail.receiptPhotos = JSON.parse(detail.receiptPhotos);
    detail.shoppingFee = detail.shoppingFee * 0.01;
    this.detail = detail;
    this.auditType = this.$route.query.type;
    console.log(this.detail)
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  padding-top: 2rem;
  .left {
    flex: 1;
    .el-carousel__container {
      height: 650px;
      margin-left: 2rem;
    }
    .el-carousel {
      overflow: -webkit-paged-x;
    }
    .el-carousel__item {
      width: 337px;
      height: 628px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .right {
    flex: 2;
    header {
      background: #f6f6f6;
      opacity: .5;
      height: 80px;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      padding-left: 1rem;
      p {
        flex: 1;
        text-align: left;
        color: #999;
        opacity: 1;
        span {
          color: #666;
        }
      }
      img {
        display: block;
        padding-right: 2rem;
      }
    }
    h5 {
      color: #284567;
      font-size: 18px;
      font-weight: 500;
      text-align: left;
      margin-bottom: 1.5rem;
    }
    .detail {
      .item {
        display: flex;
        justify-content: flex-start;
        p {
          flex: 1;
          text-align: left;
          color: #999999;
          font-size: 14px;
          span {
            color: #666666;
            font-weight: 500;
          }
        }
      }
    }
    .content {
      flex-direction: column;
      p {
        color: #999;
        font-size: 14px;
        font-weight: bold;
        text-align: left;
      }
      .form {
        padding-top: 1.5rem;
        width: 22rem;
        display: inline-block;
        text-align: center;
        .verify {
          color: #ff7633;
          font-size: 14px;
          cursor: pointer;
        }
        p {
          margin-bottom: 2rem;
        }
        .btn {
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
        .btn-cancel {
          color: #ff7633;
          border: 1px solid;
        }
      }
    }
    .line {
      height: 2px;
      background: #eee;
      margin-top: 2rem;
      margin-bottom: 2rem;
    }
  }
}

.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: #284567;
  background-color: #fff;
  border-color: #284567;
}
</style>

