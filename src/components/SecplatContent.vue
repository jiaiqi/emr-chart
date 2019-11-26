<template>
  <div class="Cont_wrap">
    <div class="Cont_left_bar">
      <dv-border-box-10>
        <div>
          <div class="bar_title">
            <span style="margin:8px 0 10px 0;">微服务服务请求次数</span>
          </div>
          <div v-if="dataBaseTop" class="bar_content">
            <ve-histogram
              :data="chartData"
              height="60vh"
              :legend="legend"
              :textStyle="legend.textStyle"
              :extend="chartExtendLine"
              :settings="chartSettings"
              :log="true"
            ></ve-histogram>
            <!-- :textStyle="legend.textStyle" -->
            <!-- :legend="legend" -->
          </div>
        </div>
        <div v-if="dataBaseBar">
          <p style="text-align:center; line-height:58.3vh">暂无数据！</p>
        </div>
      </dv-border-box-10>
      <!-- <li
        @click="timeCycle(item.key,index)"
        :class="{time:index==CurrAct}"
        v-for="(item,index) in dateLine"
        :key="index"
      >{{item.value}}</li>-->
    </div>
    <div class="Cont_right_pie">
      <dv-border-box-10>
        <div class="pie_title">
          <span style="margin:8px 0;">服务请求分布</span>
        </div>
        <div class="pie_content">
          <div class="pie_content_top">
            <dv-border-box-8 style>
              <!-- <div class="main_left_cen_right"> -->
              <div v-if="dataBaseTop">
                <ve-pie
                  :legend-visible="false"
                  height="32vh"
                  class="etlPos"
                  :extend="chartExtendPie"
                  width="100%"
                  :data="RigPieData"
                  :textStyle="legend.textStyle"
                  :settings="pieSetting"
                ></ve-pie>
              </div>

              <!-- </div> -->
              <div>
                <p v-if="dataBaseBar" style="text-align:center;line-height:32vh">暂无数据！</p>
              </div>
            </dv-border-box-8>
          </div>
          <!-- :legend-visible="false"  -->

          <bot-norm></bot-norm>
        </div>
      </dv-border-box-10>
    </div>
    <!-- <div class="main_view">
      <div class="main_left">
        <dv-border-box-10>
          <div class="main_left_top">
            <p>微服务服务请求次数</p>
          </div>
          <div class="main_left_cen">
            <ve-histogram
              :extend="chartExtendLine"
              height="58vh"
              :textStyle="legend.textStyle"
              :legend="legend"
              :data="chartData"
              :settings="chartSettings"
              :log="true"
            ></ve-histogram>
          </div>
        </dv-border-box-10>
      </div>
      <div class="main_right">
        <dv-border-box-10>
          <div class="main_left_top">
            <p>服务请求分布</p>
          </div>
          <div class="main_right_top">
            <dv-border-box-8 style>
              <div class="main_left_cen_right">
                <ve-pie
                  :legend-visible="false"
                  height="30vh"
                  :extend="chartExtendPie"
                  width="100%"
                  :data="RigPieData"
                  :textStyle="legend.textStyle"
                  :settings="pieSetting"
                ></ve-pie>
              </div>
            </dv-border-box-8>
          </div>

          <div class="main_right_bot">
            <dv-border-box-8 style="height:6rem">
              <div class="main_right_word">
                <div class="main_right_count">
                  <p>累计请求次数</p>
                  <p>{{converts(askNum)}}</p>
                </div>
                <div class="main_right_count">
                  <p>累计运行时间</p>
                  <p>{{periods(runtime)?periods(runtime):0}}</p>
                </div>
              </div>
            </dv-border-box-8>
          </div>
        </dv-border-box-10>
      </div>
    </div>-->
  </div>
</template>

<script>
let moment = require("moment");
import BotNorm from "../components/BotNorm";
export default {
  name: "SecplatContent",
  data() {
    (this.pieSetting = { limitShowNum: 5 }),
      (this.chartExtendPie = {
        legend: {
          type: "scroll",
          selectedMode: false,
          textStyle: {
            color: "#fff"
          },
          pageTextStyle: {
            color: "#fff"
          },
          pageIconColor: "#3399ff"
        },
        series: {
          type: "pie",
          center: ["50%", "40%"],
          radius: [0, "30%"],
          avoidLabelOverlap: true,
          label: {
            normal: {
              show: true,
              // formatter: "{b}:{d}%"
              formatter: params => {
                let length = params.name.length;
                if (length < 6) {
                  // params.name = params.name.slice(0, 16) + params.name.slice(4)
                  params.name = params.name;
                } else if (length > 6) {
                  params.name = params.name.slice(0, 6) + "...";
                }
                return (
                  "{c|" + params.percent + "%}" + "{b| " + params.name + "}"
                );
              },
              rich: {
                c: {
                  color: "rgb(241,246,104)",
                  fontSize: 10
                  // fontWeight: 'bold',
                  // lineHeight: 10
                },
                b: {
                  color: "rgb(98,137,169)",
                  fontSize: 12
                  // height: 20
                }
              }
            }
          },
          labelLine: {
            length: 8,
            length2: 4
          }
        }
      });
    return {
      ReqTimeOut: {
        RunTimeOut: null
      },
      chartExtendLine: {
        grid: {
          top: "20%",
          bottom: "0",
          height: "auto"
        },
        yAxis: {
          interval: 200
        },
        CurrAct: 0,
        series: [
          {
            type: "bar",
            center: ["50%", "55%"]
          },
          {
            type: "line",
            center: ["50%", "55%"]
          }
        ]
      },
      legend: {
        textStyle: {
          color: "#fff"
        },
        padding: [15, 0, 0, 0] //可
      },
      legendCake: {
        textStyle: {
          color: "#fff"
        },
        // orient: 'vertical',
        top: 30
      },

      chartData: {
        columns: ["时间"],
        rows: []
      },
      srvKeyArr: [],

      RigPieData: {
        columns: ["服务", "请求次数"],
        rows: []
      },
      chartSettings: {
        stack: { 服务: ["服务1", "服务2", "服务3", "服务4", "服务5"] },
        showLine: [],
        itemStyle: {
          normal: {
            label: {
              show: false,

              formatter: function(c) {
                return JSON.stringify(parseInt(c.value));
              }
            }
          }
        },

        axisSite: { right: [] },
        yAxisType: ["normal", "normal"],
        yAxisName: ["请求次数", "平均时延/ms"],
        max: [1300, 2600]
      },
      appNo: this.$route.query.appNo,
      dateLine: this.secplatdata == "" ? "day" : this.secplatdata,
      dataBaseBar: false,
      dataBaseTop: true
    };
  },
  components: {
    BotNorm
  },
  watch: {
    secplatdata: function(newdata, olddata) {
      this.dateLine = newdata;
    },
    dateLine: function(newdatas, olddatas) {
      this.getLegend();
    }
  },
  props: ["secplatdata"],
  methods: {
    //获取图例
    async getLegend() {
      // this.dateLine=JSON.stringify(this.secplatdata)
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

      let res = await this.axios.post(path, req);
      // console.error(res)
      // this.axios
      if (res.status === 200) {
        let NewCharData = res.data.data;
        // console.log('NewCharData',this.chartData)
        let srvUrlName = NewCharData.map(item => item.srv_url);
        self.srvKeyArr = NewCharData.map(item => {
          let srvKeys = {};
          srvKeys["keyr"] = item.srv_url;
          srvKeys["text"] = item.srv_name;
          return srvKeys;
        });
        srvUrlName = Array.from(new Set(srvUrlName));
        self.srvUrlName = srvUrlName.join(","); // 转为‘，’分割的字符串 图例service Name
        let srvName = NewCharData.map(item => item.srv_name);
        self.srvName = Array.from(new Set(srvName)); // 图例中文名数组
        let srvArgName = srvName.map(item => item + "-");
        self.chartData.columns = ["时间"]; //
        self.chartData.columns = self.chartData.columns.concat(srvName); // 合并图例的columns
        self.chartData.columns = self.chartData.columns.concat(srvArgName); // 合并图例的columns
        this.chartSettings.showLine = srvName.map(item => item + "-");
        this.chartSettings.axisSite.right = srvName.map(item => item + "-");
        self.legendData(self.srvUrlName, self.srvName, self.dateLine);
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      //   .post(path, req)
      //   .then(res => {
      // console.log( res)

      // console.log(self.dateLine[0].key)
      // console.log(self.dateLine.key)
      // })
      // .catch(err => {
      //   console.log(err);
      // });
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
          let _this2 = this;

          let arr = res1.data.data;
          let currRow = [];
          this.getCountData(arr, type);
          // console.error('arr',arr)
          if (res1.data.data.length == 0) {
            this.dataBaseBar = true;
            this.dataBaseTop = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
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
      if (type == "day") {
        let hours = [];
        for (let i = 1; i <= 23; i++) {
          hours.push(
            moment()
              .subtract(23 - i, "hours")
              .format("HH")
          );
        }
        xVal = hours;
      } else if (type == "week") {
        let week = [];
        for (let i = 1; i < 8; i++) {
          week.push(
            moment(this.timeHorizon.today)
              .subtract(7 - i, "days")
              .format("YYYY-MM-DD")
          );
        }
        xVal = week;
      } else if (type == "month") {
        let days = [];
        for (let i = 1; i < 31; i++) {
          days.push(
            moment(this.timeHorizon.today)
              .subtract(30 - i, "days")
              .format("YYYY-MM-DD")
          );
        }
        xVal = days;
      } else if (type == "year") {
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
        if (itemData["时间"]) {
          allChartData.push(itemData);
        }
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
        let theMod = ops.maxbar / ops.interval;
        if (theMod < 4) {
          ops.interval = ops.interval / 2;
        } else if (theMod > 10 && theMod <= 20) {
          ops.interval = ops.interval * parseInt(theMod / 4);
        } else if (theMod > 20 && theMod <= 50) {
          ops.interval = ops.interval * parseInt(theMod / 5);
        } else if (theMod >= 50 && theMod < 100) {
          ops.interval = ops.interval * parseInt(theMod / 6);
        } else if (theMod >= 100) {
          ops.interval = ops.interval * parseInt(theMod / 9);
        }
        // else if (ops.maxbar / ops.interval > 60) {
        //   ops.interval = ops.interval * 24;
        // }
      } else {
        ops.interval = ops.maxbar;
        ops.maxline = Math.ceil(ops.maxline / ops.interval) * ops.interval;
        // if (ops.maxline / ops.interval < 4) {
        //   ops.interval = ops.interval / 2;
        // } else if (ops.maxline / ops.interval > 60) {
        //   ops.interval = ops.interval * 24;
        // }
        let theModT = ops.maxline / ops.interval;
        if (theModT < 4) {
          ops.interval = ops.interval / 2;
        } else if (theModT > 10 && theModT <= 20) {
          ops.interval = ops.interval * parseInt(theModT / 4);
        } else if (theModT > 20 && theModT <= 50) {
          ops.interval = ops.interval * parseInt(theModT / 5);
        } else if (theModT >= 50 && theModT < 100) {
          ops.interval = ops.interval * parseInt(theModT / 6);
        } else if (theModT >= 100) {
          ops.interval = ops.interval * parseInt(theModT / 9);
        }
      }

      //赋值
      this.chartExtendLine.yAxis.interval = ops.interval;
      if (ops.maxbar > ops.interval) {
        if (ops.maxbar % ops.interval !== 0) {
          let mod = Math.trunc(ops.maxbar / ops.interval) + 1;
          ops.maxbar = mod * ops.interval;
        }
      } else {
        if (ops.maxline % ops.interval !== 0) {
          let mod = Math.trunc(ops.maxline / ops.interval) + 1;
          ops.maxline = mod * ops.interval;
        }
      }
      this.chartSettings.max[0] = ops.maxbar;
      this.chartSettings.max[1] = ops.maxline;

      console.log("ops", e, r, ops);
      return ops;
    },
    RunTimeOut() {
      let self = this;
      self.ReqTimeOut.RunTimeOut = new this.timeOut(30, 0, self.getLegend);
      self.ReqTimeOut.RunTimeOut.reqFun();
      self.ReqTimeOut.RunTimeOut.startTime();
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
    // this.getLegend()
    //  this.$cookie.set('appNo', this.appNo);
    //  console.log("________"+this.$route.params.appNo)
  },
  mounted() {
    this.RunTimeOut();
  },
  beforeDestroy() {
    this.ReqTimeOut.RunTimeOut.endTime();
  }
};
</script>

<style scoped lang="scss">
.main_left_cen_right {
  // margin: 1rem!important;
  // box-sizing: border-box
  // width: 90% !important;
  // height: 55%;
  // margin: 0 auto;
  // padding: 1rem;
}
.Cont_wrap {
  width: 95%;
  //  height: calc(100% - 10rem /* 140/16 */);
  margin: 0 auto;
  display: flex;
  margin-top: 3rem;
  // box-sizing: border-box;
  .Cont_left_bar {
    flex: 6;
    margin-right: 1rem;
    .bar_title {
      display: flex;
      justify-content: center;
    }
  }
  .Cont_right_pie {
    flex: 3.5;
    .pie_title {
      display: flex;
      justify-content: center;
    }
    .pie_content {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .pie_content_top {
        margin: 2rem;
        margin-bottom: 3rem;
      }
    }
  }
}

@media screen and (max-width: 1367px) {
  .pie_content_top {
    margin-bottom: 6rem !important;
  }
}
// .wrap {
//   width: 100%;
//   height: 100%;
//   // background: url("../assets/images/wrapper-bg01.png");
//   background-size: 100% 100%;
//   .content-view {
//     width: 95%;
//     margin: 0 auto;
//     color: white;
//     .content_top {
//       display: flex;
//       height: 50px;
//       justify-content: space-between;
//       padding-top: 2rem;
//       .content_title {
//         width: 20%;
//         display: flex;
//         span {
//           margin-left: 20%;
//           font-size: 1.6rem;
//           line-height: 2.6rem;
//           color: rgb(61, 192, 253);
//         }
//       }

//       .content_cen_right {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         margin-right: 25px;
//         span {
//           padding: 5px 10px;
//         }
//       }
//     }
//     @media screen and (max-width: 1366px) {
//       .content_top {
//         height: 30px;
//         .content_title {
//           span {
//             font-size: 1.4rem;
//             margin-left: 15%;
//             line-height: 2rem;
//           }
//         }
//       }
//     }
//     .content_cen {
//       display: flex;
//       justify-content: space-between;
//       // overflow: hidden;
//       margin: 0% 0 0 2%;
//       .content_cen_left {
//         width: 100%;
//         display: flex;
//         p {
//           flex: 1;
//           display: flex;
//           flex-direction: row;
//           justify-content: center;
//           align-items: center;
//           :first-child {
//             font-size: 14px;
//           }
//           :last-child {
//             font-size: 18px;
//           }
//           span {
//             &:last-child {
//               color: rgb(201, 201, 45);
//               font-weight: bold;
//             }
//           }
//         }
//         @media screen and (max-width: 1366px) {
//           p {
//             flex: none;
//             width: 25%;
//             &:last-child {
//               font-size: 16px;
//             }
//           }
//         }
//       }
//     }
//     @media screen and (max-width: 1366px) {
//       .content_cen {
//         height: 40px;
//       }
//     }
//     .content_bot_s {
//       ul {
//         overflow: hidden;
//         list-style: none;
//         margin: 0;
//         margin-left: 1%;

//         li {
//           float: left;
//           padding: 0 20px;
//           border-right: 1px solid white;
//           font-size: 14px;
//           cursor: pointer;
//         }
//         & :hover {
//           background-color: rgba(0, 119, 255, 0.986);
//         }
//         :last-child {
//           border-right: none;
//         }
//       }
//       @media screen and (max-width: 1366px) {
//         ul {
//           margin: 10px;
//         }
//       }
//     }
//     .time {
//       background-color: rgba(0, 119, 255, 0.986);
//     }
//   }
//   .main_view {
//     width: 95%;
//     // height: 724px;
//     padding-bottom: 4.3%;
//     margin: 1% auto 0;
//     // overflow: hidden;
//     display: flex;
//     justify-content: space-around;
//     .main_left {
//       width: 65%;
//       height: 90%;
//       // background: url("../assets/images/panel-l-t.png");
//       background-size: 100% 100%;
//       float: left;
//       .main_left_top {
//         color: white;
//         // background: url("../assets/images/title-bg.png");
//         background-size: 100% 100%;
//         text-align: center;
//         p {
//           margin: 0 2%;
//         }
//       }
//       .main_left_cen {
//         margin: 15px 0;
//       }
//       .main_left_cen_right {
//         padding: 1rem;
//       }
//     }
//     @media screen and (max-width: 1366px) {
//       .main_left {
//         height: 65vh;
//       }
//     }
//     .main_right {
//       width: 30%;
//       // height: 90%;
//       display: flex;
//       flex-direction: column;
//       div /deep/ .border-box-content {
//         display: flex;
//         flex-direction: column;
//         justify-content: space-around;
//         box-sizing: border-box;
//         .main_left_cen_right {
//         }
//       }
//       .main_left_top {
//         // margin-top: -8px;
//         // margin-bottom: 12px;
//         text-align: center;
//         p {
//           margin: 0 2%;
//           color: white;
//         }
//       }
//       .main_right_top {
//         width: 90%;
//         height: 55%;
//         margin: 0 auto;
//         padding: 1rem;
//       }
//       .main_right_bot {
//         width: 90%;
//         height: 20%;
//         margin: 0 auto;
//         color: white;
//         display: flex;
//         align-items: center;
//         .main_right_word {
//           width: 90%;
//           margin: 0 auto;
//           display: flex;
//           justify-content: space-between;
//           .main_right_count {
//             width: 45%;
//             :first-child {
//               text-align: center;
//               font-size: 14px;
//             }
//             :last-child {
//               text-align: center;
//               font-size: 22px;
//               font-weight: 700;
//             }
//           }
//           :first-child {
//             :last-child {
//               font-size: 22px;
//             }
//           }
//           @media screen and (max-width: 1366px) {
//             :first-child {
//               :last-child {
//                 font-size: 18px;
//               }
//             }
//           }
//         }
//       }
//     }
//     @media screen and (max-width: 1366px) {
//       .main_right {
//         .main_left_top {
//           margin-top: 5px;
//           margin-bottom: 8px;
//         }
//         .main_right_top {
//           height: 65%;
//           padding-top: 0;
//         }
//         .main_right_bot {
//           height: 100%;
//         }
//         .main_left_cen_right {
//           padding-top: 10px;
//         }
//       }
//     }
//   }
// }
.etlPos {
  top: 40px;
}
</style>
