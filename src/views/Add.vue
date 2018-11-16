<template>
  <div>
    <small-title title="手动积分"></small-title>
    <div class="content">
      <p>为验证订单信息属实，请准确填写图中相关信息并完成排重认证</p>
      <el-form class="form" :model="form" label-width="100px">
        <el-form-item label="订单号：">
          <el-input placeholder="请填写完整订单号" v-model="form.receiptNumber"></el-input>
        </el-form-item>
        <el-form-item label="消费日期：">
          <el-date-picker type="date" placeholder="请选择消费日期" value-format="yyyy-MM-dd" v-model="form.shoppingTime" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item class="store" label="消费商户：">
          <el-select class="select" v-model="form.storeId" placeholder="请选择">
            <el-option
              v-for="item in stores"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <div class="verify-content">
            <span class="verify" @click="verify">排重验证</span>
            <span v-if="ifverify > 0" style="color: #71B900;position: absolute; width: 40%; padding-left: 1rem;"><i class="el-icon-circle-check"></i>成功认证</span>
            <span v-if="ifverify == 0" style="color: #FF7633;position: absolute; width: 40%; padding-left: 1rem;"><i class="el-icon-circle-close"></i>重复订单</span>
          </div>
          
        </el-form-item>

        <div class="line"></div>
        <p v-if="ifverify > 0">请填写积分事项</p>

        <el-form-item class="number-input" v-if="ifverify == 0" label="手机号：">
          <el-input-number placeholder="请填写会员手机号" controls-position="right" :min="0" :max="19999999999" v-model="form.mobile"></el-input-number>
        </el-form-item>
        <el-form-item class="store number-input" style="width: 70%;" v-if="ifverify == 0" label="消费金额：">
          <el-input-number placeholder="请填写当前小票消费金额" controls-position="right"  :min="0" :max="999999" v-model="form.shoppingFee"></el-input-number>
          <span style="display: block; margin-left: 10px; width: 100px; color: #FF7633; cursor: pointer;" @click="search(form.shoppingFee)">查询积分</span>
        </el-form-item>
        <el-form-item class="number-input" v-if="ifverify == 0" label="本次积分：">
          <el-input-number placeholder="请填写积分数额" v-model="form.integral" :step="1" controls-position="right" :min="0" :max="999999"></el-input-number>
        </el-form-item>

        <el-form-item style="margin-top: 2.5rem;">
          <el-button class="btn btn-submit" @click="onSubmit">确认积分</el-button>
          <el-button class="btn btn-cancel" @click="form={}; ifverify=-1;">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import smallTitle from '@/components/SmallTitle.vue';
import httpServer from '@/utils/http.ts';
import {
  State,
} from 'vuex-class';

interface Jifen {
  mobile?: string;
  shoppingTime?: string;
  shoppingFee?: number;
  storeId?: string;
  storeName?: string;
  receiptNumber?: number;
  integral?: number;
}

@Component({
  components: {
    smallTitle,
  },
})
export default class Add extends Vue {
  @State userInfo: any;
  public form: Jifen = {};
  private stores: any = [];
  private ifverify: number = -1; // 没有校验状态

  public verify() {
    // 验重
    if (!this.form.receiptNumber || !this.form.storeId) {
      this.$message('请填写完成信息');
      return;
    }
    const param = {
      method: 'POST',
      url: 'wxapp-bill-integral/b/bill/check',
      params: {
        portalId: this.userInfo.portalId,
        receiptNumber: this.form.receiptNumber,
        storeId: this.form.storeId,
      },
    };
    const that = this;
    httpServer(param).then((res: any) => {
      this.ifverify = res.data;
    });
  }

  public search(fee: number) {
    if (!fee || !this.form.storeId || !this.form.mobile) {
      this.$message('请填写完成信息');
      return;
    }
    if (fee === 0) {
      this.$message('消费金额需大于0');
      return;
    }
    const param = {
      method: 'POST',
      url: 'wxapp-bill-integral/b/bill/rule/crm/info',
      params: {
        portalId: this.userInfo.portalId,
        portalType: this.userInfo.subjectType,
        mobile: this.form.mobile,
        storeId: this.form.storeId,
      },
    };
    const that = this;
    httpServer(param).then((res: any) => {
      if (!res.data || res.data.perComsum <= 0) {
        this.$message('没有此积分规则');
        return;
      }
      const num = ((fee * 100) / res.data.perComsum).toFixed(2);
      const rComsum = parseInt(num, 0);
      this.form.integral = rComsum;
    });
  }

  public onSubmit() {
    const form = this.form;
    if (Object.keys(form).length === 0 || !form.storeId) {
      this.$message('请填写完成信息');
      return;
    }

    const param = {
      method: 'POST',
      url: 'wxapp-bill-integral/b/bill/add',
      params: {
        portalId: this.userInfo.portalId,
        mobile: form.mobile,
        receiptNumber: form.receiptNumber,
        shoppingTime: form.shoppingTime,
        shoppingFee: form.shoppingFee ? form.shoppingFee * 100 : 0,
        storeId: form.storeId,
        storeName: this.stores.find((item: any) => item.id === form.storeId).name
      }
    };
    httpServer(param).then((res: any) => {
      this.$message({
        showClose: true,
        message: '添加成功',
        type: 'success',
      });
      this.$router.push('list');
    });
  }

  public create() {
    this.getStores();
  }

  private getStores() {
    const param = {
      method: 'POST',
      url: 'wxapp-bill-integral/common/bill/store/list',
      params: {
        portalId: this.userInfo.portalId,
        keyWords: '',
      },
    };

    httpServer(param).then((res: any) => {
      if (res.status === 200) {
        this.stores = res.data;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.content {
  p {
    color: #999;
    font-size: 14px;
    font-weight: bold;
  }
  .form {
    padding-top: 1.5rem;
    width: 30rem;
    display: inline-block;
    text-align: center;
    .select {
      width: 500px;
      display: flex;
    }
    .verify-content {
      width: 230px;
      .verify {
        color: #ff7633;
        font-size: 14px;
        cursor: pointer;
      }
    }

    .line {
      width: 240%;
      height: 2px;
      background: #eee;
      margin-left: -70%;
      margin-top: 1rem;
      margin-bottom: 2rem;
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

.el-button:focus,
.el-button:hover {
  background-color: #fff;
}
.el-button:active {
  border-color: #ff7633;
}
</style>


