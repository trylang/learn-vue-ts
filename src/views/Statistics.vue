<template>
  <div style="margin-bottom: 30px;">
    <smallTitle title="数据统计"></smallTitle>
    <div class="select-condition">
      
      <el-date-picker
        style="margin-right: 27px;"
        v-model="param.date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        type="daterange"
        @change="getStatics"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-select v-model="param.state" @change="getStatics" placeholder="统计类型">
        <el-option
          v-for="item in [{id: 0, label: '待审核'}, {id: 1, label: '审核通过'}, {id: 2, label: '驳回'}]"
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
import * as echarts from "echarts/src/echarts.js";

// 引入饼图。
import "echarts/src/chart/bar";
@Component({
  components: {
    smallTitle
  }
})
export default class List extends Vue {
  public myChart = null;
  private param: any = {};
  private list: any = [];

  public handleDownload() {
    let param = {
      method: 'POST',
      url: 'wxapp-bill-integral/b/bill/statics/export',
      responseType: 'blob',
      params: {
        portalId: this.$store.state.userInfo.portalId
      }
    };
    this.$api(param).then(res => {
      var href = window.URL.createObjectURL(res);
      var eleLink = document.createElement("a");
      eleLink.download = `数据统计.xls`;
      eleLink.href = href;
      eleLink.click();
    })
  }

  private format(data) {
    let list = data.sort(function(a, b) {
      return Date.parse(a.day) - Date.parse(b.day);
    });
    let xAxis = list.map(item => item.day);
    let series = list.map(item => item.total);
    return {
      xAxis,
      series
    };
  }

  // 绘制图表
  public initOptions(data) {
    let formate = this.format(data);

    this.myChart = echarts.init(this.$refs.echart);
    let option = {
      tooltip: {
        trigger: "axis",
        // axisPointer: {
        //   // 坐标轴指示器，坐标轴触发有效
        //   type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        // }
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
    console.log(JSON.stringify(option))
    this.myChart.setOption(option);
  }

  public getStatics() {
    let param = {
      method: "POST",
      url: "wxapp-bill-integral/b/bill/statics",
      params: {
        portalId: 290 || this.$store.state.userInfo.portalId,
        state: this.param.state,
        startDate: this.param.date ? this.param.date[0]: "2010-05-01",
        endDate: this.param.date ? this.param.date[1]: "2018-11-13"
      }
    };

    this.$api(param).then(res => {
      if (res.status == 200) {
        this.initOptions(res.data);
      }
    });
  }

  mounted() {
    this.getStatics();
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


