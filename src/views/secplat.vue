
<template>
  <div class="wrap_t">
    <view-title :titleViewData="titleViewData"></view-title>
    <div class="wrap">
      <top-indicator :current="titleViewData.currentPage"></top-indicator>
      <time-type></time-type>
      <secplat-content></secplat-content>
    </div>
  </div>
</template>
<script>
let moment = require("moment");
import ViewTitle from "@/components/ViewTitle";
import TimeType from "@/components/TimeType";
import SecplatContent from "../components/SecplatContent";
import TopIndicator from "../components/TopIndicator";
export default {
  name: "secplat",
  components: {
    ViewTitle,
    TimeType,
    SecplatContent,
    TopIndicator
  },
  data() {
    (this.pieSetting = {}),
      (this.chartExtendPie = {
        grid: {
          top: "10",
          bottom: "20",
          height: "200"
        },
        series: {
          center: ["50%", "50%"],
          radius: ["0%", "50%"]
        }
      });
    return {
      titleViewData: {
        title: "",
        date: "",
        currentPage: "secplat"
      }
      //   chartExtendLine: {
      //     grid: {
      //       top: '20%',
      //       bottom: "0",
      //       height: "auto"
      //     },
      //     yAxis: {
      //       // min: 0,
      //       // max: 5000,
      //       // splitNumber:5
      //       interval: 200,
      //     },
      //     // [,
      //     // {
      //     //   min: 0,
      //     //   max: '2000',
      //     //   splitNumber:5
      //     //   // interval: 25,
      //     //   // axisLabel: {
      //     //   //   formatter: '{value} %'
      //     //   // }
      //     // }],
      //     series: [{
      //       type: 'bar',
      //       center: ["50%", "55%"]
      //     }, {
      //       type: 'line',
      //       center: ["50%", "55%"]
      //     }]
      //   },
      //   chartSettings: {
      //     stack: { '服务': ['服务1', '服务2', '服务3', '服务4', '服务5'] },
      //     showLine: [],
      //     axisSite: { right: [] },
      //     yAxisType: ['normal', 'normal'],
      //     yAxisName: ['请求次数', '平均时延/ms'],
      //     max: [1300, 2600]
      //   },
      //   date: null,
      //   CurrAct: 0,
      //   timeHorizon: {},
      //   user: {
      //     user_no: ''
      //   },
      //   title: this.$route.params.title,
      //   askNum: this.$route.params.askNum,
      //   appNo: this.$route.params.appNo,
      //   runtime: this.$route.params.runtime,
      //   list_useno: "",
      //   regNum: "",
      //   NewCharData: [],
      //   legend: {
      //     textStyle: {
      //       color: '#fff'
      //     },
      //   },
      //   legendCake: {
      //     textStyle: {
      //       color: '#fff'
      //     },
      //     // orient: 'vertical',
      //     top: 30,
      //   },
      //   grand: null,
      //   chartData: {
      //     columns: ['时间'],
      //     rows: []
      //   },
      //   RigPieData: {
      //     columns: ['服务', '请求次数'],
      //     rows: []
      //   },
      //   oldColums: [],
      //   DateDatum:
      //   {
      //     day: {
      //       columns: ['时间', '服务1', '服务2', '服务3', '服务4', '服务5'],
      //       moreColg: [
      //         { '时间': '00:00', '服务1': 1393, '服务2': 1093, '服务3': 1723, '服务4': 2763, '服务5': 3573 },
      //         { '时间': '01:00', '服务1': 3530, '服务2': 3230, '服务3': 2923, '服务4': 4513, '服务5': 1093 },
      //         { '时间': '02:00', '服务1': 2923, '服务2': 2623, '服务3': 5293, '服务4': 6763, '服务5': 4523 },
      //         { '时间': '03:00', '服务1': 1723, '服务2': 1423, '服务3': 3573, '服务4': 5873, '服务5': 1298 },
      //         { '时间': '04:00', '服务1': 3792, '服务2': 3492, '服务3': 1533, '服务4': 2623, '服务5': 3792 },
      //         { '时间': '05:00', '服务1': 5293, '服务2': 2512, '服务3': 2512, '服务4': 7923, '服务5': 3583 },
      //         { '时间': '06:00', '服务1': 4593, '服务2': 3523, '服务3': 1298, '服务4': 2123, '服务5': 2553 },
      //         { '时间': '07:00', '服务1': 3683, '服务2': 5863, '服务3': 1977, '服务4': 1723, '服务5': 3343 },
      //         { '时间': '08:00', '服务1': 2273, '服务2': 1723, '服务3': 1393, '服务4': 2923, '服务5': 1723 },
      //         { '时间': '09:00', '服务1': 5903, '服务2': 1423, '服务3': 6443, '服务4': 3653, '服务5': 3523 },
      //         { '时间': '10:00', '服务1': 3573, '服务2': 6443, '服务3': 3792, '服务4': 5593, '服务5': 5623 },
      //         { '时间': '11:00', '服务1': 1523, '服务2': 3792, '服务3': 3583, '服务4': 2693, '服务5': 3792 },
      //         { '时间': '12:00', '服务1': 4523, '服务2': 3523, '服务3': 3343, '服务4': 4763, '服务5': 5863 },
      //         { '时间': '13:00', '服务1': 6443, '服务2': 1093, '服务3': 2553, '服务4': 7624, '服务5': 2763 },
      //         { '时间': '14:00', '服务1': 2553, '服务2': 1298, '服务3': 4523, '服务4': 3523, '服务5': 1523 },
      //         { '时间': '15:00', '服务1': 1533, '服务2': 3792, '服务3': 1523, '服务4': 2823, '服务5': 1298 },
      //         { '时间': '16:00', '服务1': 3583, '服务2': 1977, '服务3': 5293, '服务4': 6523, '服务5': 3683 },
      //         { '时间': '06:00', '服务1': 4593, '服务2': 4523, '服务3': 1298, '服务4': 1023, '服务5': 1723 },
      //         { '时间': '17:00', '服务1': 2763, '服务2': 3530, '服务3': 1723, '服务4': 3456, '服务5': 1533 },
      //         { '时间': '18:00', '服务1': 3572, '服务2': 4293, '服务3': 3530, '服务4': 5623, '服务5': 1423 },
      //         { '时间': '19:00', '服务1': 2512, '服务2': 1298, '服务3': 1977, '服务4': 6543, '服务5': 5903 },
      //         { '时间': '20:00', '服务1': 1977, '服务2': 3456, '服务3': 4593, '服务4': 2215, '服务5': 1723 },
      //         { '时间': '21:00', '服务1': 3343, '服务2': 2215, '服务3': 2512, '服务4': 5863, '服务5': 6443 },
      //         { '时间': '22:00', '服务1': 1298, '服务2': 1568, '服务3': 3572, '服务4': 1568, '服务5': 4593 },
      //         { '时间': '23:00', '服务1': 4593, '服务2': 4293, '服务3': 2763, '服务4': 2990, '服务5': 3792 },
      //       ]
      //     },
      //     week: {
      //       columns: ['时间', '服务1', '服务2', '服务3', '服务4', '服务5'],
      //       moreColg: [
      //         { '时间': '周一', '服务1': 2393, '服务2': 2093, '服务3': 2723, '服务4': 4763, '服务5': 5573 },
      //         { '时间': '周二', '服务1': 4530, '服务2': 4230, '服务3': 3923, '服务4': 5513, '服务5': 2093 },
      //         { '时间': '周三', '服务1': 3923, '服务2': 3623, '服务3': 6293, '服务4': 7763, '服务5': 5523 },
      //         { '时间': '周四', '服务1': 2723, '服务2': 2423, '服务3': 4573, '服务4': 6873, '服务5': 1298 },
      //         { '时间': '周五', '服务1': 4792, '服务2': 4492, '服务3': 2533, '服务4': 3623, '服务5': 4792 },
      //         { '时间': '周六', '服务1': 6293, '服务2': 3512, '服务3': 3512, '服务4': 8923, '服务5': 4583 },
      //         { '时间': '周日', '服务1': 5593, '服务2': 4523, '服务3': 2298, '服务4': 3123, '服务5': 3553 },
      //       ]
      //     },
      //     month: {
      //       columns: ['时间', '服务1', '服务2', '服务3', '服务4', '服务5'],
      //       moreColg: [
      //         { '时间': '1号', '服务1': 3393, '服务2': 3093, '服务3': 3723, '服务4': 5763, '服务5': 6573 },
      //         { '时间': '2号', '服务1': 5530, '服务2': 5230, '服务3': 4923, '服务4': 6513, '服务5': 3093 },
      //         { '时间': '3号', '服务1': 4923, '服务2': 4623, '服务3': 4293, '服务4': 8763, '服务5': 4523 },
      //         { '时间': '4号', '服务1': 3523, '服务2': 3423, '服务3': 5573, '服务4': 7873, '服务5': 2298 },
      //         { '时间': '5号', '服务1': 5692, '服务2': 5492, '服务3': 3533, '服务4': 4623, '服务5': 5792 },
      //         { '时间': '6号', '服务1': 7293, '服务2': 1512, '服务3': 4512, '服务4': 9923, '服务5': 5583 },
      //         { '时间': '7号', '服务1': 6593, '服务2': 4523, '服务3': 3298, '服务4': 4123, '服务5': 4553 },
      //         { '时间': '8号', '服务1': 5683, '服务2': 5863, '服务3': 3277, '服务4': 3723, '服务5': 5343 },
      //         { '时间': '9号', '服务1': 4273, '服务2': 6723, '服务3': 3393, '服务4': 2923, '服务5': 3723 },
      //         { '时间': '10号', '服务1': 7903, '服务2': 2423, '服务3': 8443, '服务4': 5653, '服务5': 5523 },
      //         { '时间': '11号', '服务1': 5573, '服务2': 4443, '服务3': 5792, '服务4': 7593, '服务5': 7623 },
      //         { '时间': '12号', '服务1': 3523, '服务2': 8792, '服务3': 5583, '服务4': 4693, '服务5': 5792 },
      //         { '时间': '13号', '服务1': 6523, '服务2': 5523, '服务3': 5343, '服务4': 6763, '服务5': 7863 },
      //         { '时间': '14号', '服务1': 8443, '服务2': 4093, '服务3': 4553, '服务4': 9624, '服务5': 4763 },
      //         { '时间': '15号', '服务1': 4553, '服务2': 3298, '服务3': 6523, '服务4': 5523, '服务5': 3523 },
      //         { '时间': '16号', '服务1': 1533, '服务2': 5792, '服务3': 3523, '服务4': 4823, '服务5': 3298 },
      //         { '时间': '17号', '服务1': 6583, '服务2': 4977, '服务3': 7293, '服务4': 8523, '服务5': 5683 },
      //         { '时间': '18号', '服务1': 5593, '服务2': 6523, '服务3': 3298, '服务4': 3023, '服务5': 3723 },
      //         { '时间': '19号', '服务1': 5763, '服务2': 5530, '服务3': 3723, '服务4': 5456, '服务5': 3533 },
      //         { '时间': '20号', '服务1': 9572, '服务2': 4293, '服务3': 5530, '服务4': 7623, '服务5': 3423 },
      //         { '时间': '21号', '服务1': 4512, '服务2': 3298, '服务3': 3977, '服务4': 8543, '服务5': 7903 },
      //         { '时间': '22号', '服务1': 3977, '服务2': 5456, '服务3': 6593, '服务4': 2215, '服务5': 3723 },
      //         { '时间': '23号', '服务1': 2343, '服务2': 4215, '服务3': 5512, '服务4': 7863, '服务5': 8443 },
      //         { '时间': '24号', '服务1': 8298, '服务2': 3568, '服务3': 6572, '服务4': 3568, '服务5': 6593 },
      //         { '时间': '25号', '服务1': 6593, '服务2': 6293, '服务3': 4763, '服务4': 4990, '服务5': 5792 },
      //         { '时间': '26号', '服务1': 5593, '服务2': 6593, '服务3': 5763, '服务4': 5850, '服务5': 6792 },
      //         { '时间': '27号', '服务1': 6593, '服务2': 7293, '服务3': 6763, '服务4': 6790, '服务5': 5812 },
      //         { '时间': '28号', '服务1': 8593, '服务2': 8293, '服务3': 5563, '服务4': 5790, '服务5': 2892 },
      //         { '时间': '29号', '服务1': 5423, '服务2': 7293, '服务3': 2563, '服务4': 3290, '服务5': 2492 },
      //         { '时间': '30号', '服务1': 7563, '服务2': 5293, '服务3': 4763, '服务4': 2190, '服务5': 3692 },
      //       ]
      //     },
      //     year: {
      //       columns: ['时间', '服务1', '服务2', '服务3', '服务4', '服务5'],
      //       moreColg: [
      //         { '时间': '1月', '服务1': 4393, '服务2': 2093, '服务3': 4723, '服务4': 6763, '服务5': 7573 },
      //         { '时间': '2月', '服务1': 6530, '服务2': 5230, '服务3': 5923, '服务4': 7513, '服务5': 4093 },
      //         { '时间': '3月', '服务1': 5923, '服务2': 5623, '服务3': 5293, '服务4': 9763, '服务5': 5523 },
      //         { '时间': '4月', '服务1': 4523, '服务2': 4523, '服务3': 6573, '服务4': 8873, '服务5': 3298 },
      //         { '时间': '5月', '服务1': 6692, '服务2': 6492, '服务3': 4533, '服务4': 5623, '服务5': 6792 },
      //         { '时间': '6月', '服务1': 6693, '服务2': 2512, '服务3': 5512, '服务4': 5923, '服务5': 6583 },
      //         { '时间': '7月', '服务1': 5593, '服务2': 5523, '服务3': 4298, '服务4': 5523, '服务5': 5553 },
      //         { '时间': '8月', '服务1': 4683, '服务2': 6863, '服务3': 4277, '服务4': 4723, '服务5': 6343 },
      //         { '时间': '9月', '服务1': 5273, '服务2': 7723, '服务3': 4393, '服务4': 3923, '服务5': 4723 },
      //         { '时间': '10月', '服务1': 8903, '服务2': 3423, '服务3': 9443, '服务4': 6653, '服务5': 6523 },
      //         { '时间': '11月', '服务1': 6573, '服务2': 5443, '服务3': 6792, '服务4': 8593, '服务5': 8623 },
      //         { '时间': '12月', '服务1': 4523, '服务2': 9792, '服务3': 6583, '服务4': 5693, '服务5': 6792 }
      //       ]
      //     }
      //   },
      //   RigDate: {
      //     day: {
      //       columns: ['服务', '请求次数'],
      //       pieNum: [
      //         { '服务': '服务1', '请求次数': 1393 },
      //         { '服务': '服务2', '请求次数': 3530 },
      //         { '服务': '服务3', '请求次数': 2923 },
      //         { '服务': '服务4', '请求次数': 1723 },
      //         { '服务': '服务5', '请求次数': 3792 },
      //         // { '服务': '服务6', '请求次数': 4593},
      //         // { '服务': '服务7', '请求次数': 8593},
      //         // { '服务': '服务8', '请求次数': 6592},
      //         // { '服务': '服务9', '请求次数': 2963},
      //         // { '服务': '服务10', '请求次数': 3993}
      //       ]
      //     },
      //     week: {
      //       columns: ['服务', '请求次数'],
      //       pieNum: [
      //         { '服务': '服务1', '请求次数': 2393 },
      //         { '服务': '服务2', '请求次数': 4530 },
      //         { '服务': '服务3', '请求次数': 3923 },
      //         { '服务': '服务4', '请求次数': 2723 },
      //         { '服务': '服务5', '请求次数': 4792 },
      //         // { '服务': '服务6', '请求次数': 5593},
      //         // { '服务': '服务7', '请求次数': 7593},
      //         // { '服务': '服务8', '请求次数': 7592},
      //         // { '服务': '服务9', '请求次数': 3963},
      //         // { '服务': '服务10', '请求次数': 4993}
      //       ]
      //     },
      //     month: {
      //       columns: ['服务', '请求次数'],
      //       pieNum: [
      //         { '服务': '服务1', '请求次数': 3393 },
      //         { '服务': '服务2', '请求次数': 5530 },
      //         { '服务': '服务3', '请求次数': 4923 },
      //         { '服务': '服务4', '请求次数': 3723 },
      //         { '服务': '服务5', '请求次数': 5792 },
      //         // { '服务': '服务6', '请求次数': 6593},
      //         // { '服务': '服务7', '请求次数': 8593},
      //         // { '服务': '服务8', '请求次数': 8592},
      //         // { '服务': '服务9', '请求次数': 4963},
      //         // { '服务': '服务10', '请求次数': 5993}
      //       ]
      //     },
      //     year: {
      //       columns: ['服务', '请求次数'],
      //       pieNum: [
      //         { '服务': '服务1', '请求次数': 4393 },
      //         { '服务': '服务2', '请求次数': 6530 },
      //         { '服务': '服务3', '请求次数': 5923 },
      //         { '服务': '服务4', '请求次数': 4723 },
      //         { '服务': '服务5', '请求次数': 6792 },
      //         // { '服务': '服务6', '请求次数': 7593},
      //         // { '服务': '服务7', '请求次数': 9593},
      //         // { '服务': '服务8', '请求次数': 9592},
      //         // { '服务': '服务9', '请求次数': 5963},
      //         // { '服务': '服务10', '请求次数': 6993}
      //       ]
      //     }
      //   },
      //   AllCol: {
      //     day: {
      //       columns: ['时间', '请求次数'],
      //       moreColg: [
      //         { '时间': '00:00', '请求次数': 1393, },
      //         { '时间': '01:00', '请求次数': 3530, },
      //         { '时间': '02:00', '请求次数': 2923, },
      //         { '时间': '03:00', '请求次数': 1723, },
      //         { '时间': '04:00', '请求次数': 3792, },
      //         { '时间': '05:00', '请求次数': 5293, },
      //         { '时间': '06:00', '请求次数': 4593, },
      //         { '时间': '07:00', '请求次数': 3683, },
      //         { '时间': '08:00', '请求次数': 2273, },
      //         { '时间': '09:00', '请求次数': 5903, },
      //         { '时间': '10:00', '请求次数': 3573, },
      //         { '时间': '11:00', '请求次数': 1523, },
      //         { '时间': '12:00', '请求次数': 4523, },
      //         { '时间': '13:00', '请求次数': 6443, },
      //         { '时间': '14:00', '请求次数': 2553, },
      //         { '时间': '15:00', '请求次数': 1533, },
      //         { '时间': '16:00', '请求次数': 3583, },
      //         { '时间': '17:00', '请求次数': 2763, },
      //         { '时间': '18:00', '请求次数': 3572, },
      //         { '时间': '19:00', '请求次数': 2512, },
      //         { '时间': '20:00', '请求次数': 1977, },
      //         { '时间': '21:00', '请求次数': 3343, },
      //         { '时间': '22:00', '请求次数': 1298, },
      //         { '时间': '23:00', '请求次数': 4593, },
      //       ],
      //       moreColg1: [
      //         { '时间': '00:00', '请求次数': 1093, },
      //         { '时间': '01:00', '请求次数': 3230, },
      //         { '时间': '02:00', '请求次数': 2623, },
      //         { '时间': '03:00', '请求次数': 1423, },
      //         { '时间': '04:00', '请求次数': 3492, },
      //         { '时间': '05:00', '请求次数': 2512, },
      //         { '时间': '06:00', '请求次数': 3523, },
      //         { '时间': '07:00', '请求次数': 5863, },
      //         { '时间': '08:00', '请求次数': 1723, },
      //         { '时间': '09:00', '请求次数': 1423, },
      //         { '时间': '10:00', '请求次数': 6443, },
      //         { '时间': '11:00', '请求次数': 3792, },
      //         { '时间': '12:00', '请求次数': 3523, },
      //         { '时间': '13:00', '请求次数': 1093, },
      //         { '时间': '14:00', '请求次数': 1298, },
      //         { '时间': '15:00', '请求次数': 3792, },
      //         { '时间': '16:00', '请求次数': 1977, },
      //         { '时间': '17:00', '请求次数': 3530, },
      //         { '时间': '18:00', '请求次数': 4293, },
      //         { '时间': '19:00', '请求次数': 1298, },
      //         { '时间': '20:00', '请求次数': 3456, },
      //         { '时间': '21:00', '请求次数': 2215, },
      //         { '时间': '22:00', '请求次数': 1568, },
      //         { '时间': '23:00', '请求次数': 4293, },
      //       ],
      //       moreColg2: [
      //         { '时间': '00:00', '请求次数': 1723, },
      //         { '时间': '01:00', '请求次数': 2923, },
      //         { '时间': '02:00', '请求次数': 5293, },
      //         { '时间': '03:00', '请求次数': 3573, },
      //         { '时间': '04:00', '请求次数': 1533, },
      //         { '时间': '05:00', '请求次数': 2512, },
      //         { '时间': '06:00', '请求次数': 1298, },
      //         { '时间': '07:00', '请求次数': 1977, },
      //         { '时间': '08:00', '请求次数': 1393, },
      //         { '时间': '09:00', '请求次数': 6443, },
      //         { '时间': '10:00', '请求次数': 3792, },
      //         { '时间': '11:00', '请求次数': 3583, },
      //         { '时间': '12:00', '请求次数': 3343, },
      //         { '时间': '13:00', '请求次数': 2553, },
      //         { '时间': '14:00', '请求次数': 4523, },
      //         { '时间': '15:00', '请求次数': 1523, },
      //         { '时间': '16:00', '请求次数': 5293, },
      //         { '时间': '17:00', '请求次数': 1723, },
      //         { '时间': '18:00', '请求次数': 3530, },
      //         { '时间': '19:00', '请求次数': 1977, },
      //         { '时间': '20:00', '请求次数': 4593, },
      //         { '时间': '21:00', '请求次数': 2512, },
      //         { '时间': '22:00', '请求次数': 3572, },
      //         { '时间': '23:00', '请求次数': 2763, },
      //       ]
      //     },
      //     week: {
      //       columns: ['时间', '请求次数'],
      //       moreColg: [
      //         { '时间': '周一', '请求次数': 2393, },
      //         { '时间': '周二', '请求次数': 4530, },
      //         { '时间': '周三', '请求次数': 3923, },
      //         { '时间': '周四', '请求次数': 2723, },
      //         { '时间': '周五', '请求次数': 4792, },
      //         { '时间': '周六', '请求次数': 6293, },
      //         { '时间': '周日', '请求次数': 5593, },
      //       ],
      //       moreColg1: [
      //         { '时间': '周一', '请求次数': 2093, },
      //         { '时间': '周二', '请求次数': 4230, },
      //         { '时间': '周三', '请求次数': 3623, },
      //         { '时间': '周四', '请求次数': 2423, },
      //         { '时间': '周五', '请求次数': 4492, },
      //         { '时间': '周六', '请求次数': 3512, },
      //         { '时间': '周日', '请求次数': 4523, },
      //       ],
      //       moreColg2: [
      //         { '时间': '周一', '请求次数': 2723 },
      //         { '时间': '周二', '请求次数': 3923, },
      //         { '时间': '周三', '请求次数': 6293, },
      //         { '时间': '周四', '请求次数': 4573, },
      //         { '时间': '周五', '请求次数': 2533, },
      //         { '时间': '周六', '请求次数': 3512, },
      //         { '时间': '周日', '请求次数': 2298, },
      //       ]
      //     },
      //     month: {
      //       columns: ['时间', '请求次数'],
      //       moreColg: [
      //         { '时间': '1号', '请求次数': 3393, },
      //         { '时间': '2号', '请求次数': 5530, },
      //         { '时间': '3号', '请求次数': 4923, },
      //         { '时间': '4号', '请求次数': 3523, },
      //         { '时间': '5号', '请求次数': 5692, },
      //         { '时间': '6号', '请求次数': 7293, },
      //         { '时间': '7号', '请求次数': 6593, },
      //         { '时间': '8号', '请求次数': 5683, },
      //         { '时间': '9号', '请求次数': 4273, },
      //         { '时间': '10号', '请求次数': 7903, },
      //         { '时间': '11号', '请求次数': 5573, },
      //         { '时间': '12号', '请求次数': 3523, },
      //         { '时间': '13号', '请求次数': 6523, },
      //         { '时间': '14号', '请求次数': 8443, },
      //         { '时间': '15号', '请求次数': 4553, },
      //         { '时间': '16号', '请求次数': 1533, },
      //         { '时间': '17号', '请求次数': 6583, },
      //         { '时间': '18号', '请求次数': 5593, },
      //         { '时间': '19号', '请求次数': 5763, },
      //         { '时间': '20号', '请求次数': 9572, },
      //         { '时间': '21号', '请求次数': 4512, },
      //         { '时间': '22号', '请求次数': 3977, },
      //         { '时间': '23号', '请求次数': 2343, },
      //         { '时间': '24号', '请求次数': 8298, },
      //         { '时间': '25号', '请求次数': 6593, },
      //         { '时间': '26号', '请求次数': 5593, },
      //         { '时间': '27号', '请求次数': 6593, },
      //         { '时间': '28号', '请求次数': 8593, },
      //         { '时间': '29号', '请求次数': 5423, },
      //         { '时间': '30号', '请求次数': 7563, },
      //       ],
      //       moreColg1: [
      //         { '时间': '1号', '请求次数': 3093, },
      //         { '时间': '2号', '请求次数': 5230, },
      //         { '时间': '3号', '请求次数': 4623, },
      //         { '时间': '4号', '请求次数': 3423, },
      //         { '时间': '5号', '请求次数': 5492, },
      //         { '时间': '6号', '请求次数': 1512, },
      //         { '时间': '7号', '请求次数': 4523, },
      //         { '时间': '8号', '请求次数': 5863, },
      //         { '时间': '9号', '请求次数': 6723, },
      //         { '时间': '10号', '请求次数': 2423, },
      //         { '时间': '11号', '请求次数': 4443, },
      //         { '时间': '12号', '请求次数': 8792, },
      //         { '时间': '13号', '请求次数': 5523, },
      //         { '时间': '14号', '请求次数': 4093, },
      //         { '时间': '15号', '请求次数': 3298, },
      //         { '时间': '16号', '请求次数': 5792, },
      //         { '时间': '17号', '请求次数': 4977, },
      //         { '时间': '18号', '请求次数': 6523, },
      //         { '时间': '19号', '请求次数': 5530, },
      //         { '时间': '20号', '请求次数': 4293, },
      //         { '时间': '21号', '请求次数': 3298, },
      //         { '时间': '22号', '请求次数': 5456, },
      //         { '时间': '23号', '请求次数': 4215, },
      //         { '时间': '24号', '请求次数': 3568, },
      //         { '时间': '25号', '请求次数': 6293, },
      //         { '时间': '26号', '请求次数': 6593, },
      //         { '时间': '27号', '请求次数': 7293, },
      //         { '时间': '28号', '请求次数': 8293, },
      //         { '时间': '29号', '请求次数': 7293, },
      //         { '时间': '30号', '请求次数': 5293, },
      //       ],
      //       moreColg2: [
      //         { '时间': '1号', '请求次数': 3723, },
      //         { '时间': '2号', '请求次数': 4923, },
      //         { '时间': '3号', '请求次数': 4293, },
      //         { '时间': '4号', '请求次数': 5573, },
      //         { '时间': '5号', '请求次数': 3533, },
      //         { '时间': '6号', '请求次数': 4512, },
      //         { '时间': '7号', '请求次数': 3298, },
      //         { '时间': '8号', '请求次数': 3277, },
      //         { '时间': '9号', '请求次数': 3393, },
      //         { '时间': '10号', '请求次数': 8443, },
      //         { '时间': '11号', '请求次数': 5792, },
      //         { '时间': '12号', '请求次数': 5583, },
      //         { '时间': '13号', '请求次数': 5343, },
      //         { '时间': '14号', '请求次数': 4553, },
      //         { '时间': '15号', '请求次数': 6523, },
      //         { '时间': '16号', '请求次数': 3523, },
      //         { '时间': '17号', '请求次数': 7293, },
      //         { '时间': '18号', '请求次数': 3298, },
      //         { '时间': '19号', '请求次数': 3723, },
      //         { '时间': '20号', '请求次数': 5530, },
      //         { '时间': '21号', '请求次数': 3977, },
      //         { '时间': '22号', '请求次数': 6593, },
      //         { '时间': '23号', '请求次数': 5512, },
      //         { '时间': '24号', '请求次数': 6572, },
      //         { '时间': '25号', '请求次数': 4763, },
      //         { '时间': '26号', '请求次数': 5763, },
      //         { '时间': '27号', '请求次数': 6763, },
      //         { '时间': '28号', '请求次数': 5563, },
      //         { '时间': '29号', '请求次数': 2563, },
      //         { '时间': '30号', '请求次数': 4763, },
      //       ]
      //     },
      //     year: {
      //       columns: ['时间', '请求次数'],
      //       moreColg: [
      //         { '时间': '1月', '请求次数': 4393, },
      //         { '时间': '2月', '请求次数': 6530, },
      //         { '时间': '3月', '请求次数': 5923, },
      //         { '时间': '4月', '请求次数': 4523, },
      //         { '时间': '5月', '请求次数': 6692, },
      //         { '时间': '6月', '请求次数': 6693, },
      //         { '时间': '7月', '请求次数': 5593, },
      //         { '时间': '8月', '请求次数': 4683, },
      //         { '时间': '9月', '请求次数': 5273, },
      //         { '时间': '10月', '请求次数': 8903, },
      //         { '时间': '11月', '请求次数': 6573, },
      //         { '时间': '12月', '请求次数': 4523, }
      //       ],
      //       moreColg1: [
      //         { '时间': '1月', '请求次数': 2093, },
      //         { '时间': '2月', '请求次数': 5230, },
      //         { '时间': '3月', '请求次数': 5623, },
      //         { '时间': '4月', '请求次数': 4523, },
      //         { '时间': '5月', '请求次数': 6492, },
      //         { '时间': '6月', '请求次数': 2512, },
      //         { '时间': '7月', '请求次数': 5523, },
      //         { '时间': '8月', '请求次数': 6863, },
      //         { '时间': '9月', '请求次数': 7723, },
      //         { '时间': '10月', '请求次数': 3423, },
      //         { '时间': '11月', '请求次数': 5443, },
      //         { '时间': '12月', '请求次数': 9792, }
      //       ],
      //       moreColg2: [
      //         { '时间': '1月', '请求次数': 4723 },
      //         { '时间': '2月', '请求次数': 5923, },
      //         { '时间': '3月', '请求次数': 5293, },
      //         { '时间': '4月', '请求次数': 6573, },
      //         { '时间': '5月', '请求次数': 4533, },
      //         { '时间': '6月', '请求次数': 5512, },
      //         { '时间': '7月', '请求次数': 4298, },
      //         { '时间': '8月', '请求次数': 4277, },
      //         { '时间': '9月', '请求次数': 4393, },
      //         { '时间': '10月', '请求次数': 9443, },
      //         { '时间': '11月', '请求次数': 6792, },
      //         { '时间': '12月', '请求次数': 6583, }
      //       ]
      //     }
      //   },
      //   swiperOption: {
      //     watchSlidesProgress: true,
      //     watchSlidesVisibility: true,
      //     autoplay: {
      //       delay: 3000,
      //       disableOnInteraction: false,
      //     },
      //     loopedSlides: 3,
      //     pagination: {
      //       el: '.swiper-pagination',
      //       clickable: true,
      //       renderBullet: function (index, className) {
      //         let label = ['实例1', '实例2', '实例3']
      //         return '<span class="' + className + '">' + label[index] + '</span>';
      //       }
      //     }
      //   },
      //   // dateLine: ['近一天', '近一周', '近一月', '近一年', '自定义时间段']
      //   dateLine: [{
      //     key: 'day',
      //     value: '近24小时'
      //   }, {
      //     key: 'week',
      //     value: '近一周'
      //   }, {
      //     key: 'month',
      //     value: '近一月'
      //   }, {
      //     key: 'year',
      //     value: '近一年'
      //   }],
      //   selectedTab: '',
      //   srvUrlName: '',
      //   srvName: [],
      //   srvKeyArr: []
      // }
    };
  },
  mounted() {},

  methods: {
    //转换数字
    converts(num) {
      let nums = parseInt(num);
      if (nums > 10000) {
        if (nums % 10000 == 0) {
          nums = num / 10000 + "万";
        } else {
          nums = Math.round((num / 10000) * 10) / 10 + "万";
        }
      } else {
        nums = num;
      }
      return nums;
    },
    // 持续运行时长转换
    periods(num) {
      let nums = parseInt(num) / 60 / 60;
      if (nums < 24) {
        if (nums % parseInt(nums) == 0) {
          nums = nums;
        } else {
          nums = Math.round(nums * 10) / 10 + "h";
        }
      } else {
        nums = Math.round((nums / 24) * 10) / 10 + "天";
      }
      return nums;
    },
    getData_userno() {
      let req = {
        serviceName: "srvsso_online_user_select",
        colNames: ["*"],
        condition: []
      };
      let path = this.getServiceUrl(
        "select",
        "srvsso_online_user_select",
        "sso"
      );
      this.axios
        .post(path, req)
        .then(res => {
          this.list_useno = res.data.data[0].number_of_online_users;
          console.log("111", res.data.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //注册用户数
    CurrRegNum() {
      let req = {
        serviceName: "srvsso_user_select",
        colNames: ["*"],
        condition: []
      };
      let path = this.getServiceUrl("select", "srvsso_user_select", "sso");
      this.axios
        .post(path, req)
        .then(res => {
          // this.list_useno = res.data.data[0].number_of_online_users;
          this.regNum = res.data.data.length;
          console.log("111", res.data.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取图例
    getLegend() {
      let self = this;
      let req = {
        serviceName: "srvlog_srv_indicator_cfg_select",
        colNames: ["*"],
        condition: [
          {
            colName: "application",
            ruleType: "eq",
            value: this.appNo
          }
        ]
      };
      let path = this.getServiceUrl(
        "select",
        "srvlog_srv_indicator_cfg_select",
        "log"
      );
      this.axios
        .post(path, req)
        .then(res => {
          // this.list_useno = res.data.data[0].number_of_online_users;
          // this.regNum = res.data.data.length;
          // this.chartData.push(res.data.data.srv_name)
          let NewCharData = res.data.data;
          console.log("NewCharData", this.chartData);
          let srvUrlName = NewCharData.map(item => item.srv_url);
          self.srvKeyArr = NewCharData.map(item => {
            let srvKeys = {};
            srvKeys["keyr"] = item.srv_url;
            srvKeys["text"] = item.srv_name;
            return srvKeys;
          });
          // console.error('self.srvKeyArr',self.srvKeyArr)
          srvUrlName = Array.from(new Set(srvUrlName));
          self.srvUrlName = srvUrlName.join(","); // 转为‘，’分割的字符串 图例service Name
          let srvName = NewCharData.map(item => item.srv_name);
          self.srvName = Array.from(new Set(srvName)); // 图例中文名数组
          let srvArgName = srvName.map(item => item + "-");
          self.chartData.columns = ["时间"]; //
          self.chartData.columns = self.chartData.columns.concat(srvName); // 合并图例的columns
          self.chartData.columns = self.chartData.columns.concat(srvArgName); // 合并图例的columns
          // self.chartData.columns = Array.from(new Set(self.chartData.columns))
          this.chartSettings.showLine = srvName.map(item => item + "-");
          this.chartSettings.axisSite.right = srvName.map(item => item + "-");
          self.legendData(
            self.srvUrlName,
            self.srvName,
            self.dateLine[self.CurrAct].key
          );
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取图例对应的数据
    legendData(srvName, legendName, type) {
      let req = {
        serviceName: "srvlog_call_statistics_select",
        colNames: ["*"],
        condition: [
          {
            colName: "application",
            ruleType: "eq",
            value: this.appNo
          },
          {
            colName: "service_name",
            ruleType: "in",
            value: srvName
          }
        ],
        group: [
          {
            colName: "num_of_calls",
            type: "sum"
          },
          {
            colName: "statistics_time",
            type: "by_date"
          },
          {
            colName: "service_name",
            type: "by"
          },
          {
            colName: "total_duration",
            type: "sum"
          }
        ]
      };
      // req -------------------------------------------------------------------------------------------
      if (type === "day") {
        req.condition = req.condition.concat([
          {
            colName: "statistics_time",
            value: moment()
              .add(1, "hours")
              .format("YYYY-MM-DD HH"), // 小于当前时间的下一个小时
            ruleType: "le"
          },
          {
            colName: "statistics_time",
            value: moment()
              .subtract(23, "hours")
              .format("YYYY-MM-DD HH"), // 大于当前时间往前推23个小时
            ruleType: "ge"
          }
        ]);
        req.group = [
          {
            colName: "num_of_calls",
            type: "sum"
          },
          {
            colName: "statistics_time",
            type: "by_hour"
          },
          {
            colName: "service_name",
            type: "by"
          },
          {
            colName: "total_duration",
            type: "sum"
          }
        ];
      } else if (type === "week") {
        req.condition = req.condition.concat([
          {
            colName: "statistics_time",
            value: moment()
              .subtract(6, "days")
              .format("YYYY-MM-DD"), // 六天前,
            ruleType: "ge"
          },
          {
            colName: "statistics_time",
            value: moment()
              .add(1, "days")
              .format("YYYY-MM-DD"), // 今晚0点,
            ruleType: "le"
          }
        ]);
      } else if (type === "month") {
        req.condition = req.condition.concat([
          {
            colName: "statistics_time",
            value: moment()
              .subtract(30, "days")
              .format("YYYY-MM-DD"), // 30天前
            ruleType: "ge"
          },
          {
            colName: "statistics_time",
            value: moment()
              .add(1, "days")
              .format("YYYY-MM-DD"), // 今晚0点,
            ruleType: "le"
          }
        ]);
      } else if (type === "year") {
        req.condition = req.condition.concat([
          {
            colName: "statistics_time",
            value: moment()
              .subtract(11, "month")
              .format("YYYY-MM-DD"), // 十一个月之前
            ruleType: "ge"
          },
          {
            colName: "statistics_time",
            value: moment()
              .add(1, "days")
              .format("YYYY-MM-DD"), // 今晚0点,
            ruleType: "le"
          }
        ]);
        req.group = [
          {
            colName: "num_of_calls",
            type: "sum"
          },
          {
            colName: "statistics_time",
            type: "by_month_of_year"
          },
          {
            colName: "service_name",
            type: "by"
          },
          {
            colName: "total_duration",
            type: "sum"
          }
        ];
      }
      // req ------------------------------------------------------------------------------end
      let path = this.getServiceUrl(
        "select",
        "srvlog_call_statistics_select",
        "log"
      );
      this.axios
        .post(path, req)
        .then(res1 => {
          let arr = res1.data.data;
          let currRow = [];
          this.getCountData(arr, type);
          // console.error('arr',arr)
        })
        .catch(err => {
          console.log(err);
        });
    },
    toIndex(num) {
      if (num === "1") {
        sessionStorage.clear();
        window.location.href = "/main/login_pages/login-fw.html";
      }
      if (num === "2") {
        this.$router.push({ name: "platform" });
      }
    },
    getCountData(data, type) {
      let datas = data || [
        {
          num_of_calls: 6,
          statistics_time: 20,
          service_name: "DI_ADI_REGISTER_INFO_select"
        },
        {
          num_of_calls: 6,
          statistics_time: 20,
          service_name: "DI_HDI_INRECORD_INFO_select"
        },
        {
          num_of_calls: 4,
          statistics_time: 20,
          service_name: "DI_HDI_LAREXA_INFO_select"
        }
      ];
      let xVal = [];
      if (type === "day") {
        let hours = [];
        for (let i = 1; i <= 23; i++) {
          hours.push(
            moment()
              .subtract(23 - i, "hours")
              .format("HH")
          );
        }
        xVal = hours;
      } else if (type === "week") {
        let week = [];
        for (let i = 1; i < 8; i++) {
          week.push(
            moment(this.timeHorizon.today)
              .subtract(7 - i, "days")
              .format("YYYY-MM-DD")
          );
        }
        xVal = week;
      } else if (type === "month") {
        let days = [];
        for (let i = 1; i < 31; i++) {
          days.push(
            moment(this.timeHorizon.today)
              .subtract(30 - i, "days")
              .format("YYYY-MM-DD")
          );
        }
        xVal = days;
      } else if (type === "year") {
        let month = [];
        for (let i = 1; i <= 12; i++) {
          month.push(
            moment()
              .subtract(12 - i, "month")
              .format("YYYY-MM")
          );
        }
        xVal = month;
      }
      type = type || "day";

      let srvKeys = this.srvKeyArr;
      let yljgmcName = datas.map(item => item.service_name);
      yljgmcName = Array.from(new Set(yljgmcName));

      // let ywfssjTime = xVal
      let ywfssjTime = datas.map(item => item.statistics_time);
      ywfssjTime = Array.from(new Set(ywfssjTime));
      ywfssjTime = xVal; // 覆盖横轴数组
      // let ArgTime = datas.map(item => item.total_duration)
      // ArgTime = Array.from(new Set(ArgTime))
      // console.log("ArgTime",ArgTime)
      let allChartData = [];
      function getDataCount(yljgmcName, time, data, chartType) {
        let count = 0;
        for (let r = 0; r < data.length; r++) {
          let srvName = data[r];
          if (chartType === "pie") {
            if (srvName.service_name === yljgmcName) {
              count += srvName.num_of_calls;
            }
          } else if (chartType === "line") {
            if (
              srvName.service_name === yljgmcName &&
              srvName.statistics_time == time
            ) {
              count += srvName.num_of_calls;
            }
          }
        }
        barGraph.push(count);
        return count;
      }
      function getTimeCount(yljgmcName, time, data, chartType) {
        let counts = 0;
        for (let r = 0; r < data.length; r++) {
          let srvName = data[r];
          if (chartType === "pie") {
            if (srvName.service_name === yljgmcName) {
              counts += srvName.num_of_calls;
            }
          } else if (chartType === "line") {
            if (
              srvName.service_name === yljgmcName &&
              srvName.statistics_time == time
            ) {
              counts += srvName.total_duration;
            }
          }
        }
        return counts;
      }
      // this.chartSettings['showLine'] = []
      let barGraph = [];
      let lineGraph = [];
      for (let j = 0; j < ywfssjTime.length; j++) {
        let itemData = {};
        let srvText = "";
        for (let q = 0; q < yljgmcName.length; q++) {
          for (let n = 0; n < srvKeys.length; n++) {
            if (yljgmcName[q] === srvKeys[n]["keyr"]) {
              itemData[srvKeys[n].text] = getDataCount(
                yljgmcName[q],
                ywfssjTime[j],
                datas,
                "line"
              );
              let ArgNum =
                getTimeCount(yljgmcName[q], ywfssjTime[j], datas, "line") /
                getDataCount(yljgmcName[q], ywfssjTime[j], datas, "line");
              if (!ArgNum) {
                ArgNum = 0;
              }
              lineGraph.push(ArgNum);

              itemData[srvKeys[n].text + "-"] = ArgNum;

              srvText = srvKeys[n].text + "-";

              itemData["时间"] = ywfssjTime[j];
              if (type === "day") {
                itemData["时间"] = ywfssjTime[j] + "点";
              }
            }
          }
          // this.chartSettings['showLine'].push(srvText)
        }
        allChartData.push(itemData);
        // console.log(barGraph.Math(...barGraph))
      }
      if (barGraph.length > 0 && lineGraph.length > 0) {
        let maxNum = Math.max.apply(null, barGraph);
        let ArgMax = Math.max.apply(null, lineGraph);
        this.getMaxNum(maxNum, ArgMax);
      }

      this.chartData.rows = allChartData;
      let pieAllData = [];
      for (let q = 0; q < yljgmcName.length; q++) {
        let PieData = {};
        for (let n = 0; n < srvKeys.length; n++) {
          if (yljgmcName[q] === srvKeys[n]["keyr"]) {
            PieData["请求次数"] = getDataCount(yljgmcName[q], "", datas, "pie");
            PieData["服务"] = srvKeys[n].text;
            console.log("itemData", PieData);
          }
        }
        pieAllData.push(PieData);
      }
      this.RigPieData.rows = pieAllData;
    },
    getMaxNum(e, r) {
      let ops = { maxbar: 0, maxline: 0, interval: 0 };
      let n = 1;
      ops.interval = n * 100;
      if (Math.ceil(r / ops.interval) % 2 !== 0) {
        ops.maxline = Math.ceil(r / ops.interval) + 1;
        ops.maxline = ops.maxline * ops.interval;
      } else {
        ops.maxline = Math.ceil(r / ops.interval);
        ops.maxline = ops.maxline * ops.interval;
      }
      if (Math.ceil(e / ops.interval) % 2 !== 0) {
        ops.maxbar = Math.ceil(e / ops.interval) + 1;
        ops.maxbar = ops.maxbar * ops.interval;
      } else {
        ops.maxbar = Math.ceil(e / ops.interval);
        ops.maxbar = ops.maxbar * ops.interval;
      }
      if (ops.maxbar > ops.maxline) {
        ops.interval = ops.maxline;
        ops.maxbar = Math.ceil(ops.maxbar / ops.interval) * ops.interval;
        if (ops.maxbar / ops.interval < 4) {
          ops.interval = ops.interval / 2;
        } else if (ops.maxbar / ops.interval > 8) {
          ops.interval = ops.interval * 2;
        }
      } else {
        ops.interval = ops.maxbar;
        ops.maxline = Math.ceil(ops.maxline / ops.interval) * ops.interval;
        if (ops.maxline / ops.interval < 4) {
          ops.interval = ops.interval / 2;
        } else if (ops.maxline / ops.interval > 8) {
          ops.interval = ops.interval * 2;
        }
      }

      this.chartExtendLine.yAxis.interval = ops.interval;
      this.chartSettings.max[0] = ops.maxbar;
      this.chartSettings.max[1] = ops.maxline;

      console.log("ops", e, r, ops);
      return ops;
    },
    timeCycle(e, index = 0) {
      this.CurrAct = index;
      console.log(index, this.CurrAct);
      this.legendData(this.srvUrlName, this.srvName, e);
    },
    // FilData(All){
    //   this.srvKeyArr.forEach(item=>{
    //       All.filter(art=>{
    //         if(item.text === art.){}
    //       })
    //   })
    // },
    init() {},

    callback() {},
    toManangerment() {
      let str = window.location.href;
      let num = str.indexOf("?");
      str = str.substr(num + 1);
      console.log(str);
      window.location.href = "../../main/index.html?" + str;
    },

    //累计运行次数
    sustain() {
      let req = {
        serviceName: "srvlog_call_statistics_select",
        colNames: ["*"],
        condition: [
          {
            colName: "application",
            value: "emr",
            ruleType: "eq"
          }
        ],
        group: [
          {
            colName: "num_of_calls",
            type: "sum"
          }
        ]
      };
      let path = this.getServiceUrl(
        "select",
        "srvlog_call_statistics_select",
        "log"
      );
      this.axios
        .post(path, req)
        .then(res => {
          // let operat1 = res.data.data;
          // operat1 = Object.assign(...operat1);
          if (res.data.data.length > 0) {
            this.grand = res.data.data[0].num_of_calls;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  created() {
    let user = sessionStorage.getItem("current_login_user");
    this.user = JSON.parse(user);
    setInterval(() => {
      this.date = moment().format("YYYY-MM-DD  HH:mm:ss");
    }, 1000);

    let date = "2018-8-31";
    let today = moment().format("YYYY-MM-DD"); // moment获取本日日期
    let day_of_week = moment(today, "YYYY-MM-DD").format("E"); // 计算指定日期是这周第几天
    // let week_start = moment(today).subtract(day_of_week - 1, 'days').format('YYYY-MM-DD'); // 周一日期
    let week_start = moment(today)
      .subtract(6, "days")
      .format("YYYY-MM-DD"); // 六天前
    let week_end = today; // 今天
    // let week_end = moment(today).add(7 - day_of_week, 'days').format('YYYY-MM-DD'); // 周日日期
    let month_start = moment(today)
      .subtract(30, "days")
      .format("YYYY-MM-DD"); // 30天前
    // let month_start = moment(today).startOf('month').format('YYYY-MM-DD'); // 本月第一天
    let month_end = moment(today)
      .endOf("month")
      .format("YYYY-MM-DD"); // 本月最后一天
    let day_count = parseInt(
      moment(today)
        .endOf("month")
        .format("DD")
    ); // 本月天数
    let year_start = moment(today)
      .subtract(11, "month")
      .format("YYYY-MM-DD"); // 11个月之前
    this.timeHorizon = {
      date: date,
      today: today,
      day_count: day_count,
      day_of_week: day_of_week,
      week_start: week_start,
      week_end: week_end,
      month_start: month_start,
      month_end: month_end,
      year_start: year_start
    };
    // this.timeCycle('近一天')

    // this.getLegend()
    // this.CurrRegNum()
    // this.getData_userno()
    // this.sustain()
    // this.accRun()
  },
  mounted() {
    setInterval(() => {
      // this.CurrRegNum()
      // this.getLegend()
      // this.sustain()
    }, 30000);
  }
};
</script>
<style lang='scss' scoped>
body {
  margin: 0;
}
.wrap_t {
  width: 100%;
  overflow: hidden;
  height: calc(100vh - 40px);
  background-color: #0b0f34;
  padding-bottom: 40px;
  .header {
    color: white;
    width: 100%;
    overflow: hidden;
    height: 40px;
    display: flex;
    justify-content: space-between;
    .header_left {
      display: flex;
      text-align: center;
      float: left;
      line-height: 40px;
      margin-left: 2%;
      flex: 1;
      div {
        margin-right: 3rem;
        justify-content: center;
        align-items: center;
        display: flex;
      }
    }
    .header_cen {
      text-align: center;
      float: left;
      line-height: 42px;
      font-size: 22px;
      flex: 1;
      margin-right: 9%;
      h3 {
        margin: 0;
      }
    }
    .header_system {
      width: 25%;
      display: flex;

      justify-content: space-around;
      line-height: 40px;
      .header_rig {
        text-align: center;
        float: right;
      }
      .enter {
        cursor: pointer;
        padding: 0 5px;
        &:hover {
          background: rgba(0, 119, 255, 0.986);
        }
      }

      .back {
        cursor: pointer;
        padding: 0 5px;

        &:hover {
          background: rgba(0, 119, 255, 0.986);
        }
      }
      .login {
        cursor: pointer;
      }
    }
  }
  @media screen and (max-width: 1366px) {
    .header {
      font-size: 14px;
      .header_cen {
        font-size: 20px;
        margin-right: 0%;
      }
      .header_system {
        width: 34%;
        justify-content: flex-end;
        .currentId {
          margin: 0 0.6rem;
        }
      }
    }
  }
}
.wrap {
  width: 100%;
  height: 100%;
  background: url("../assets/images/wrapper-bg01.png");
  background-size: 100% 100%;
  .content-view {
    width: 95%;
    margin: 0 auto;
    color: white;
    .content_top {
      display: flex;
      height: 50px;
      justify-content: space-between;
      padding-top: 2rem;
      .content_title {
        width: 20%;
        display: flex;
        span {
          margin-left: 20%;
          font-size: 1.6rem;
          line-height: 2.6rem;
          color: rgb(61, 192, 253);
        }
      }

      .content_cen_right {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 25px;
        span {
          padding: 5px 10px;
        }
      }
    }
    @media screen and (max-width: 1366px) {
      .content_top {
        height: 30px;
        .content_title {
          span {
            font-size: 1.4rem;
            margin-left: 15%;
            line-height: 2rem;
          }
        }
      }
    }
    .content_cen {
      display: flex;
      justify-content: space-between;
      // overflow: hidden;
      margin: 0% 0 0 2%;
      .content_cen_left {
        width: 100%;
        display: flex;
        p {
          flex: 1;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          :first-child {
            font-size: 14px;
          }
          :last-child {
            font-size: 18px;
          }
          span {
            &:last-child {
              color: rgb(201, 201, 45);
              font-weight: bold;
            }
          }
        }
        @media screen and (max-width: 1366px) {
          p {
            flex: none;
            width: 25%;
            &:last-child {
              font-size: 16px;
            }
          }
        }
      }
    }
    @media screen and (max-width: 1366px) {
      .content_cen {
        height: 40px;
      }
    }
    .content_bot_s {
      ul {
        overflow: hidden;
        list-style: none;
        margin: 0;
        margin-left: 1%;

        li {
          float: left;
          padding: 0 20px;
          border-right: 1px solid white;
          font-size: 14px;
          cursor: pointer;
        }
        & :hover {
          background-color: rgba(0, 119, 255, 0.986);
        }
        :last-child {
          border-right: none;
        }
      }
      @media screen and (max-width: 1366px) {
        ul {
          margin: 10px;
        }
      }
    }
    .time {
      background-color: rgba(0, 119, 255, 0.986);
    }
  }
  .main_view {
    width: 95%;
    // height: 724px;
    padding-bottom: 4.3%;
    margin: 1% auto 0;
    // overflow: hidden;
    display: flex;
    justify-content: space-around;
    .main_left {
      width: 65%;
      height: 90%;
      // background: url("../assets/images/panel-l-t.png");
      background-size: 100% 100%;
      float: left;
      .main_left_top {
        color: white;
        // background: url("../assets/images/title-bg.png");
        background-size: 100% 100%;
        text-align: center;
        p {
          margin: 0 2%;
        }
      }
      .main_left_cen {
        margin: 15px 0;
      }
      .main_left_cen_right {
        padding: 1rem;
      }
    }
    @media screen and (max-width: 1366px) {
      .main_left {
        height: 65vh;
      }
    }
    .main_right {
      width: 30%;
      // height: 90%;
      display: flex;
      flex-direction: column;
      div /deep/ .border-box-content {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        box-sizing: border-box;
        .main_left_cen_right {
        }
      }
      .main_left_top {
        // margin-top: -8px;
        // margin-bottom: 12px;
        text-align: center;
        p {
          margin: 0 2%;
          color: white;
        }
      }
      .main_right_top {
        width: 90%;
        height: 55%;
        margin: 0 auto;
        padding: 1rem;
      }
      .main_right_bot {
        width: 90%;
        height: 20%;
        margin: 0 auto;
        color: white;
        display: flex;
        align-items: center;
        .main_right_word {
          width: 90%;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          .main_right_count {
            width: 45%;
            :first-child {
              text-align: center;
              font-size: 14px;
            }
            :last-child {
              text-align: center;
              font-size: 22px;
              font-weight: 700;
            }
          }
          :first-child {
            :last-child {
              font-size: 22px;
            }
          }
          @media screen and (max-width: 1366px) {
            :first-child {
              :last-child {
                font-size: 18px;
              }
            }
          }
        }
      }
    }
    @media screen and (max-width: 1366px) {
      .main_right {
        .main_left_top {
          margin-top: 5px;
          margin-bottom: 8px;
        }
        .main_right_top {
          height: 65%;
          padding-top: 0;
        }
        .main_right_bot {
          height: 100%;
        }
        .main_left_cen_right {
          padding-top: 10px;
        }
      }
    }
  }
}
</style>