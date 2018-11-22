<template>
  <div style="margin-bottom: 30px;">
    <smallTitle title="数据统计"></smallTitle>
    <div class="select-condition">
      <!-- <el-date-picker
            v-model="param.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            :picker-options="pickerOptions0">
      </el-date-picker>
      <el-date-picker
            v-model="param.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            @change="getStatics"
            placeholder="结束日期"
            :picker-options="pickerOptions1">
      </el-date-picker> -->

      <el-date-picker
        style="margin-right: 27px;"
        v-model="param.date"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        @change="getStatics"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-select v-model="param.state" @change="getStatics" placeholder="统计类型">
        <el-option
          v-for="item in [{id: -1, label: '提交数'}, {id: 0, label: '待审核'}, {id: 1, label: '审核通过'}, {id: 2, label: '驳回'}]"
          :key="item.id"
          :label="item.label"
          :value="item.id">
        </el-option>
      </el-select>

      <i style=" float: right; margin-right: 30px; font-size: 24px; cursor: pointer;" class="el-icon-download" @click="handleDownload"></i>
    </div>

    <div id="echart" ref="echart" style="height:400px;"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import smallTitle from "@/components/SmallTitle.vue";
import { timestampToTime } from "@/utils/index";
import httpServer from '@/utils/http.ts';
import {
  State,
} from 'vuex-class';
// import * as echarts from "echarts/src/echarts.js";

// 引入饼图。
// import "echarts/src/chart/bar";
import echarts from "echarts";
// declare module 'echarts';
@Component({
  components: {
    smallTitle
  }
})
export default class List extends Vue {
  @State userInfo: any;
  public myChart: any = {};
  private param: any = {
    data: [timestampToTime(new Date().valueOf() - 31 * 24 * 3600 * 1000, "ymd"), timestampToTime(new Date().valueOf(), "ymd")],
    startDate: timestampToTime(new Date().valueOf() - 31 * 24 * 3600 * 1000, "ymd"),
    endDate: timestampToTime(new Date().valueOf(), "ymd")
  };
  private userRouter: any = JSON.parse(sessionStorage.getItem('userRouter') || '');
  private list: any = [];
  private pickerOptions0: any = {
    disabledDate: (time: any) => {
      let endDate = this.param.endDate;
      if (endDate! = ""  || endDate != null) {
        let oneMonth = 31 * 24 * 3600 * 1000;
        let oneMonthNum = (new Date(endDate)).getTime() - oneMonth;
        return time.getTime() < oneMonthNum;
      }
    }
  };

  private pickerOptions1: any = {
    disabledDate: (time: any) => {
      let startDate = this.param.startDate;
      if (this.param.startDate! = "" || this.param.startDate != null) {
        const startVal = new Date(startDate).getTime();
        const oneMonth = 31 * 24 * 3600 * 1000;
        const oneMonthNum = startVal + oneMonth;

        if (oneMonthNum > oneMonth) {
          return time.getTime() > oneMonthNum;
        }
      }
    }
  };
  public handleDownload() {
    const param = {
      method: "POST",
      url: "wxapp-bill-integral/b/bill/statics/export",
      responseType: "blob",
      params: {
        portalId: this.userRouter.portalId || this.userInfo.portalId,
        state: this.param.state,
        startDate: this.param.date ? this.param.date[0]: '',
        endDate: this.param.date ? this.param.date[1]: ''
      }
    };
    if (!this.param.date) {
      delete param.params.startDate;
      delete param.params.endDate;
    }
    if (this.param.state == -1) {
      delete param.params.state;
    }
    httpServer(param).then((res: any) => {
      let href = window.URL.createObjectURL(res);
      let eleLink = document.createElement("a");
      eleLink.download = `数据统计.xls`;
      eleLink.href = href;
      eleLink.click();
    });
  }

  // 绘制图表
  public initOptions(data: any) {
    const formate = this.format(data);
    let dom:any = this.$refs.echart; 
    this.myChart = echarts.init(dom);
    const option = {
      color: ["#BBD8E0", "#C1E5D6", "#E5E5C1", "#BBC1E0", "#E0BBE0", "#E0BBBD"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        data: formate.xAxis
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          barWidth: "60%",
          data: formate.series
        }
      ]
    };
    this.myChart.setOption(option);
  }

  public getStatics() {
    const param = {
      method: "POST",
      url: "wxapp-bill-integral/b/bill/statics",
      params: {
        portalId: this.userRouter.portalId || this.userInfo.portalId,
        state: this.param.state,
        startDate: this.param.date ? this.param.date[0]: '',
        endDate: this.param.date ? this.param.date[1]: ''
      }
    };

    if (!this.param.date) {
      delete param.params.startDate;
      delete param.params.endDate;
    }
    if (this.param.state == -1) {
      delete param.params.state;
    }
    httpServer(param).then((res: any) => {
      if (res.status === 200) {
        this.initOptions(res.data);
      }
    });
  }

  public mounted() {
    this.getStatics();
  }

  private format(data: any) {
    const list = data.sort(function(a: any, b: any) {
      return Date.parse(a.day) - Date.parse(b.day);
    });
    const xAxis = list.map((item: any) => item.day);
    const series = list.map((item: any) => item.total);
    return {
      xAxis,
      series
    };
  }
}
</script>

<style lang="scss" scoped>
.select-condition {
  padding-bottom: 17px;
  text-align: left;
  margin-top: 18px;
  .el-input {
    line-height: 1;
    width: 254px;
    // border: none;
    margin-right: 27px;
    .el-input__inner {
      margin-right: 27px;
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
  .el-select,
  .select-condition .el-input__inner {
    margin-right: 27px;
  }
}
</style>


