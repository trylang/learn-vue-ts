<template>
  <div>
    <small-title title="审核详情"></small-title>
    <div class="content">
      <div class="left" ref="imagesList">
        <el-carousel :autoplay="false" indicator-position="outside" trigger="click">
          <el-carousel-item v-for="item in detail.receiptPhotos" :key="item">
            <img :src="item" alt @click="clickImg($event)">
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="right">
        <header v-if="auditType=='view'">
          <p>审核时间：
            <span>{{detail.optionTime}}</span>
          </p>
          <!-- <p>审核人：<span>步步高新天地信息部</span></p> -->
          <p v-if="detail.state==2">驳回理由：
            <span>{{detail.reason}}</span>
          </p>
          <img v-if="detail.state == 1" src="../assets/imgs/pass.png" alt>
          <img v-if="detail.state == 2" src="../assets/imgs/reject.png" alt>
        </header>

        <h5>会员信息</h5>
        <div class="detail">
          <div class="item">
            <!-- <p>注册时间：<span>2018.09.28</span></p> -->
            <p>会员ID：
              <span>{{detail.vipCard}}</span>
            </p>
            <p>手机号：
              <span>{{detail.mobile}}</span>
            </p>
          </div>
          <div class="item">
            <p>CID：
              <span>{{detail.cid}}</span>
            </p>
          </div>
        </div>

        <div class="line"></div>

        <div class="detail">
          <div class="item">
            <p>订单号：
              <span>{{detail.receiptNumber}}</span>
            </p>
            <p>消费商户：
              <span>{{detail.storeName}}</span>
            </p>
          </div>
          <div class="item">
            <p>消费日期：
              <span>{{detail.shoppingTime}}</span>
            </p>
            <p>消费积分：
              <span style="color: #FF6C07;">+{{detail.integral}}</span>
            </p>
          </div>
        </div>

        <div class="content" v-if="auditType=='audit'">
          <p>为验证订单信息属实，请准确填写图中相关信息并完成排重认证</p>
          <el-form class="form" :model="detail" label-width="100px">
            <el-form-item label="订单号：">
              <el-input
                placeholder="请填写完整订单号"
                @change="ifverify=-1;"
                v-model="detail.receiptNumber"
              ></el-input>
            </el-form-item>
            <el-form-item label="消费日期：">
              <el-date-picker
                type="datetime"
                placeholder="请选择消费日期"
                @change="ifverify=-1;"
                v-model="detail.shoppingTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>

            <el-form-item class="store" label="消费商户：">
              <el-select
                v-model="detail.storeId"
                @change="ifverify=-1;"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in stores"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <div style="width: 37%; margin-left: .5rem;">
                <span class="verify" @click="verify">排重验证</span>
                <span
                  v-if="ifverify >= 0 && ifverify<=1"
                  style="color: #71B900;position: absolute; width: 40%; padding-left: 1rem;"
                >
                  <i class="el-icon-circle-check"></i>成功认证
                </span>
                <span
                  v-if="ifverify > 1"
                  style="color: #FF7633;position: absolute; width: 40%; padding-left: 1rem;"
                >
                  <i class="el-icon-circle-close"></i>重复订单
                </span>
              </div>
            </el-form-item>

            <div class="line"></div>

            <el-form-item label="审核结果：">
              <el-radio-group style="margin-left: -9rem;" v-model="detail.state" size="mini">
                <el-radio-button border label="1">通过</el-radio-button>
                <el-radio-button border label="2">驳回</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="detail.state == 1"
              style="width: 70%; height: 40px;"
              class="number-input"
              label="消费金额："
            >
              <el-input-number placeholder="请填写当前小票消费金额" v-model="detail.shoppingFee"></el-input-number>
              <!-- <span
                style=" position: relative; top: -2.5rem; left: 9rem; display: block; margin-left: 10px; width: 100px; color: #FF7633; cursor: pointer;"
                @click="search(detail.shoppingFee)"
              >查询积分</span> -->
            </el-form-item>
            <!-- <el-form-item v-if="detail.state == 1" class="number-input" label="本次积分：">
              <el-input-number placeholder="请填写积分数额" :step="1" :min="0" v-model="detail.integral"></el-input-number>
            </el-form-item> -->
            <el-form-item v-if="detail.state == 2" label="驳回理由：">
              <el-input
                placeholder="请填写驳回理由"
                type="textarea"
                :rows="2"
                :maxlength="30"
                v-model="detail.reason"
              ></el-input>
              <span>{{detail.reason ? detail.reason.length : 0}} / 30</span>
            </el-form-item>
            <el-form-item style="width: 38rem; margin-left: -100px;margin-top；1rem;">
              <el-button class="btn btn-cancel" @click="onSubmit">审核小票</el-button>
              <el-button
                v-if="this.list.length > 0"
                class="btn btn-submit"
                @click="onSubmit('next')"
              >审核小票并继续</el-button>
              <el-button class="btn btn-cancel" @click="link()">返回列表</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img> -->
    <!-- <transition name="fade">
      <section ref="imagesList" class="bgSection" v-if="showImg" @click="viewImg">
        <el-carousel :autoplay="false" height="450px" indicator-position="outside" trigger="click">
          <el-carousel-item v-for="item in detail.receiptPhotos" :key="item">
            <img
              style="width: 96%; height: 100%; object-fit: contain; cursor:pointer；"
              :src="item"
              alt
            >
          </el-carousel-item>
        </el-carousel>
      </section>
    </transition> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import smallTitle from "@/components/SmallTitle.vue";
import bigImg from "@/components/ShowImg.vue";
import { timestampToTime } from "@/utils/index.ts";
import httpServer from "@/utils/http.ts";
import { State } from "vuex-class";
import Viewer from "viewerjs";

@Component({
  components: {
    smallTitle,
    bigImg
  }
})
export default class List extends Vue {
  @State
  userInfo: any;
  public auditType: string = "";
  private ifverify: number = -1;
  private imgSrc: string = "";
  private showImg: boolean = false;
  private detail: any = {};
  private stores: any = [];
  private list: any = [];
  private userRouter: any = JSON.parse(
    sessionStorage.getItem("userRouter") || ""
  );

  $refs!: {
    imagesList: HTMLBaseElement
  }

  public clickImg(e: any) {
    this.showImg = true;
    // 获取当前图片地址
    this.imgSrc = e.currentTarget.src;
    this.$nextTick(() => {
      let ref = this.$refs.imagesList;
      const gallery = new Viewer(ref, {
        viewed() {
          gallery.zoomTo(0.8);
        }
      });
      console.log(gallery)
    });
  }
  public viewImg() {
    this.showImg = false;
  }

  public link() {
    this.$router.push("list");
  }

  public search(fee: number) {
    if (!fee || !this.detail.storeId || !this.detail.mobile) {
      this.$message("请填写完成信息");
      return;
    }
    if (fee === 0) {
      this.$message("消费金额需大于0");
      return;
    }
    const param = {
      method: "POST",
      url: "wxapp-bill-integral/b/bill/rule/crm/info",
      params: {
        portalId: this.userRouter.portalId || this.userInfo.portalId,
        portalType:
          this.userRouter.subjectType || this.userInfo.subjectType || 1,
        mobile: this.detail.mobile,
        storeId: this.detail.storeId
      }
    };
    const that = this;
    httpServer(param).then((res: any) => {
      if (!res.data || res.data.perComsum <= 0) {
        this.$message("没有此积分规则");
        return;
      }
      const num = ((fee * 100) / res.data.perComsum).toFixed(2);
      const rComsum = parseInt(num, 0);
      this.detail.integral = rComsum;
    });
  }

  public onSubmit(type: string) {
    if (!this.detail.receiptNumber || !this.detail.storeId) {
      this.$message("请填写完成信息");
      return;
    }
    if (this.detail.state === 0) {
      this.$message("请选择审核结果");
      return;
    }
    if (this.ifverify == -1) {
      this.$message("请您先做排重验证");
      return;
    }
    if (this.ifverify > 1 && this.detail.state == 1) {
      this.$message("目前有重复订单，请重新填入");
      return;
    }
    const store = this.stores.find(
      (item: any) => item.id === this.detail.storeId
    );
    const param = {
      method: "POST",
      url: "wxapp-bill-integral/b/bill/audit",
      params: {
        portalId: this.userRouter.portalId || this.userInfo.portalId,
        userId: this.userRouter.userId || this.userInfo.userId,
        id: this.detail.id,
        receiptNumber: this.detail.receiptNumber,
        shoppingTime: this.detail.shoppingTime,
        reason: this.detail.reason,
        storeName: store ? store.name : "",
        // integral: this.detail.integral,
        state: this.detail.state,
        storeId: this.detail.storeId
      }
    };
    const that = this;
    httpServer(param).then((res: any) => {
      this.$message({
        message: "审核完成",
        type: "success"
      });
      if (type === "next") {
        if (this.list.length == 2) {
          sessionStorage.setItem("detail", JSON.stringify(this.list[1]));
          window.history.go(0);
        } else {
          this.$message({
            message: "已没有可审核订单",
            type: "info"
          });
        }
      } else {
        that.$router.push("list");
      }
    });
  }

  public verify() {
    // 验重
    if (!this.detail.receiptNumber || !this.detail.storeId) {
      this.$message("请填写完成信息");
      return;
    }
    const param = {
      method: "POST",
      url: "wxapp-bill-integral/b/bill/check",
      params: {
        portalId: this.userRouter.portalId || this.userInfo.portalId,
        receiptNumber: this.detail.receiptNumber,
        shoppingTime: this.detail.shoppingTime,
        storeId: this.detail.storeId
      }
    };
    const that = this;
    httpServer(param).then((res: any) => {
      this.ifverify = res.data;
    });
  }

  public getActivityList() {
    const param = {
      method: "POST",
      url: "wxapp-bill-integral/b/bill/list",
      params: {
        portalId: this.userRouter.portalId || this.userInfo.portalId,
        state: 0,
        page: 1,
        pageSize: 2
      }
    };
    httpServer(param).then((res: any) => {
      if (res.status === 200) {
        res.data.list.forEach((item: any) => {
          item.createTime = timestampToTime(item.createTime);
          // item.shoppingTime = timestampToTime(item.shoppingTime);
        });
        this.list = res.data.list;
      }
    });
  }

  private getStores() {
    const param = {
      method: "POST",
      url: "wxapp-bill-integral/common/bill/store/list",
      params: {
        portalId: this.userRouter.portalId || this.userInfo.portalId,
        keyWords: ""
      }
    };
    httpServer(param).then((res: any) => {
      if (res.status === 200) {
        this.stores = res.data;
      }
    });
  }

  //监听路由变化
  @Watch("$route")
  public onRouteChanged(route: any, oldRoute: any): void {
    this.auditType = route.query.type;
  }

  public created() {
    this.getStores();
    this.getActivityList();
    const sessionDetail = sessionStorage.getItem("detail");
    const detail = sessionDetail ? JSON.parse(sessionDetail) : {};
    detail.receiptPhotos = JSON.parse(detail.receiptPhotos);
    detail.shoppingFee = detail.shoppingFee * 0.01;
    // detail.shoppingTime = detail.shoppingTime.split(" ")[0];
    detail.optionTime = timestampToTime(detail.optionTime);
    this.detail = detail;
    this.auditType = this.$route.query.type;
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  padding-top: 2rem;
  .left {
    z-index: 0;
    flex: 1;
    .el-carousel__container {
      height: 650px;
      margin-left: 2rem;
    }
    .el-carousel {
      margin-left: 32px;
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
    margin-left: 32px;
    header {
      background: hsl(0, 0%, 96%);
      opacity: 0.5;
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

.bgSection {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-top: 5rem;
  background: rgba(0, 0, 0, 0.7);
}

/*动画*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  // transition: all 0.5s linear;
  // transform: translate3D(0, 0, 0);
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  // transform: translate3D(100%, 0, 0);
}
</style>

