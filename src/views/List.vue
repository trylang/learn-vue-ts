<template>
  <div>
    <header>
      <small-title title="小票审核列表"></small-title>
      <div class="select-condition">
			  <el-input 
	        v-model="vipCard" 
	        placeholder="请输入会员卡号">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="handleIconClick">
          </i>
        </el-input>
        <el-input 
	        v-model="mobile" 
	        placeholder="请输入会员手机号">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="handleIconClick">
          </i>
        </el-input>
        <el-date-picker
          style="margin-right: 15px;"
          v-model="dateRange"
          @change='getActivityList'
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-select v-model="state" @change="handleIconClick" placeholder="状态">
        <el-option
          v-for="item in [{id: -1, label: '全部'}, {id: 0, label: '待审核'}, {id: 1, label: '审核通过'}, {id: 2, label: '驳回'}]"
          :key="item.id"
          :label="item.label"
          :value="item.id">
        </el-option>
      </el-select>
      </div>
    </header>
    <div class="content">
      <div class="recode-size">
        <div class="page-total">
          <span class="total">共{{total}}条记录</span>
          <span>每页显示:</span>
          <span v-for='item in sizeList' :key='item' :class="size==item?'size-item size-active':'size-item'" @click='handleGetSize(item)'>{{item}}条</span>
        </div>
        <div>
          <button class="create-activity" @click='handleCreated'>手动积分</button>
          <i style="font-size: 24px; cursor: pointer;" @click="handleDownload" class="el-icon-download"></i>
        </div>
        
      </div>
      <el-table
        :data="list"
        stripe
        v-loading="loading"
        :header-cell-style="getRowClass"
        style="width: 100%;margin-top:13px;">
          <el-table-column
            align="center"
            label="申请时间">
            <template slot-scope="scope">{{scope.row.createTime }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="会员卡号"
            width="100">
            <template slot-scope="scope">{{ scope.row.vipCard}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="手机号">
            <template slot-scope="scope">{{ scope.row.mobile }}</template>
          </el-table-column>
          
          <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">{{ scope.row.state==0?'待审核': (scope.row.state==1? '审核通过': '驳回') }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="消费时间">
            <template slot-scope="scope">{{ scope.row.shoppingTime }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="商户名称">
            <template slot-scope="scope">{{ scope.row.storeName }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="订单号">
            <template slot-scope="scope">{{ scope.row.receiptNumber }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="金额（元）">
            <template slot-scope="scope">{{ scope.row.shoppingFee * 0.01 }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="积分">
            <template slot-scope="scope">{{ scope.row.integral }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <span v-if="scope.row.state==0" class="option-item" @click='handleLinkMod(scope.$index,scope.row)'>审核</span>
              <span v-else class="option-item" @click='handleLinkCompute(scope.$index,scope.row)'>查看</span>
            </template>
          </el-table-column>
      </el-table>
      <div class="block page-current">
        <el-pagination
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="size"
          @current-change="handleCurrentChange"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import smallTitle from '@/components/SmallTitle.vue';
import httpServer from '@/utils/http.ts';

import { timestampToTime } from '@/utils/index.ts';
import {
  State,
} from 'vuex-class';
@Component({
  components: {
    smallTitle
  }
})

export default class List extends Vue {
  @State userInfo: any;
  private activityName: string = '';
  private vipCard: string = '';
  private mobile: string = '';
  private state: string = '';
  private dateRange: any = [];
  private total: number = 1;
  private size: number = 10;
  private loading: boolean = false;
  private currentPage: number = 1;
  private sizeList: number[] = [10, 20, 30];
  private list: any = [];
  private userRouter: any = JSON.parse(sessionStorage.getItem('userRouter') || '');
  public getRowClass({ row, column, rowIndex, columnIndex }: any) {
    if (rowIndex === 0) {
      return 'background:#284567;color:#fff;text-align:center;height:44px;';
    } else {
      return '';
    }
  }
  public handleCreated() {
    this.$router.push('add');
  }

  public handleDownload() {
    const param = {
      method: 'POST',
      url: 'wxapp-bill-integral/b/bill/export',
      responseType: 'blob',
      params: {
        mobile: this.mobile,
        vipCard: this.vipCard,
        state: this.state,
        portalId: this.userRouter.portalId || this.userInfo.portalId,
        page: this.currentPage || 1,
        pageSize: this.size,
        startDate: this.dateRange ? this.dateRange[0] : '',
        endDate: this.dateRange ? this.dateRange[1] : '',
      },
    };
    if (!this.dateRange) {
      delete param.params.startDate;
      delete param.params.endDate;
    }
    if (this.state == '-1') {
      delete param.params.state;
    }
    httpServer(param).then((res: any) => {
      let href = window.URL.createObjectURL(res);
      let eleLink = document.createElement('a');
      eleLink.download = `订单列表.xls`;
      eleLink.href = href;
      eleLink.click();
    });
  }
  public handleLinkMod(index: number, row: any) {
    // 审核
    sessionStorage.setItem('detail', JSON.stringify(row));
    this.$router.push({ path: 'detail', query: { type: 'audit' } });
  }

  public handleLinkCompute(index: number, row: any) {
    // 查看
    sessionStorage.setItem('detail', JSON.stringify(row));
    this.$router.push({ path: 'detail', query: { type: 'view' } });
  }

  public handleIconClick() {
    this.getActivityList();
  }
  public handleGetSize(size: any) {
    this.size = size;
    this.currentPage = 1;
    this.getActivityList();
  }

  public handleCurrentChange(val: any) {
    this.currentPage = val;
    this.getActivityList();
  }

  public getActivityList() {
    const param = {
      method: 'POST',
      url: 'wxapp-bill-integral/b/bill/list',
      params: {
        mobile: this.mobile,
        vipCard: this.vipCard,
        state: this.state,
        portalId: this.userRouter.portalId || this.userInfo.portalId,
        page: this.currentPage || 1,
        pageSize: this.size,
        startDate: this.dateRange ? this.dateRange[0] : '',
        endDate: this.dateRange ? this.dateRange[1] : '',
      }
    };
    if (!this.dateRange) {
      delete param.params.startDate;
      delete param.params.endDate;
    }
    if (this.state == '-1') {
      delete param.params.state;
    }
    httpServer(param).then((res: any) => {
      if (res.status === 200) {
        res.data.list.forEach((item: any) => {
          item.createTime = timestampToTime(item.createTime);
          // item.shoppingTime = timestampToTime(item.shoppingTime);
        });
        this.total = res.data.total;
        this.list = res.data.list;
      }
    });
  }

  public created() {
    this.getActivityList();
  }
}
</script>

<style lang="scss" scoped>
.select-condition {
  padding-bottom: 17px;
  text-align: left;
  margin-top: 18px;
  display: flex;
  .el-input {
    line-height: 1;
    width: 254px;
    // border: none;
    margin-right: 15px;
    .el-input__inner {
      padding-bottom: 5px;
      border: none;
      border-bottom: 1px solid #ccc;
      font-size: 14px;
      height: auto;
      border-radius: 0;
      padding: 0;
    }
  }
  .el-date-editor .el-range__close-icon {
    margin-top: -20px;
  }
  .el-input__inner {
    // border: none;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
  }
}

.content {
  padding: 1.5rem;
  padding-top: 0;
  .create-activity {
    width: 88px;
    height: 26px;
    line-height: 26px;
    margin-right: 20px;
    text-align: center;
    background: #ff7633;
    color: #fff;
    border: none;
    border-radius: 13px;
  }
  .option-item {
    font-size: 14px;
    line-height: 40px;
    color: #ff7633;
    padding: 5px;
    cursor: pointer;
  }
  .select-condition {
    padding-bottom: 17px;
    text-align: left;
    margin-top: 18px;
    .el-input {
      line-height: 1;
      width: 254px;
      // border: none;
      margin-right: 15px;
      .el-input__inner {
        padding-bottom: 5px;
        // border: none;
        border-bottom: 1px solid #ccc;
        font-size: 14px;
        height: auto;
        border-radius: 0;
        padding: 0;
      }
    }
    .el-date-editor .el-range__close-icon {
      margin-top: -20px;
    }
    .el-input__inner {
      // border: none;
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
    }
  }
  .page-total {
    font-size: 14px;
    color: #999999;
  }
  .total {
    padding-right: 13px;
  }
  .size-item {
    margin: 0 5px;
    cursor: pointer;
    font-weight: bold;
  }
  .size-active {
    color: #284567;
    border-bottom: 1px solid #284567;
  }
  .page-current {
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
  .recode-size {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .down-load {
    font-weight: bold;
    cursor: pointer;
  }
}
</style>

