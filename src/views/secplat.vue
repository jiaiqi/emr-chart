
<template>
  <div class="wrap_t">
    <view-title :titleViewData="titleViewData"></view-title>
    <div class="wrap">
      <top-indicator :current="titleViewData"></top-indicator>
      <div class="timeType">
        <time-type v-on:showTimeType="showTimeType"></time-type>
      </div>
      <secplat-content :secplatdata="secplatdata"></secplat-content>
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
  data () {
    (this.pieSetting = {}),
      (this.chartExtendPie = {
        grid: {
          top: "10",
          bottom: "20",
          height: "200"
        },
        series: {
          center: [ "50%", "50%" ],
          radius: [ "0%", "50%" ]
        }
      });
    return {
      titleViewData: {
        title: this.$route.query.title,
        appNo: this.$route.query.appNo,
        date: "",
        currentPage: "secplat"
      },
      secplatdata: ""
    };
  },
  computed: {},
  mounted () { },

  methods: {
    showTimeType (item) {
      this.secplatdata = item;
      // this.

    },

    //转换数字
    converts (num) {
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
    periods (num) {
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
    getData_userno () {
      let req = {
        serviceName: "srvsso_online_user_select",
        colNames: [ "*" ],
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
          this.list_useno = res.data.data[ 0 ].number_of_online_users;

        })
        .catch(err => {

        });
    },
    //注册用户数
    CurrRegNum () {
      let req = {
        serviceName: "srvsso_user_select",
        colNames: [ "*" ],
        condition: []
      };
      let path = this.getServiceUrl("select", "srvsso_user_select", "sso");
      this.axios
        .post(path, req)
        .then(res => {
          // this.list_useno = res.data.data[0].number_of_online_users;
          this.regNum = res.data.data.length;

        })
        .catch(err => {

        });
    },
    //获取图例
    getLegend () {
      let self = this;
      let req = {
        serviceName: "srvlog_srv_indicator_cfg_select",
        colNames: [ "*" ],
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
          let a = vChartInfo.getVchartColums(NewCharData, "srv_name", true);

          let srvUrlName = NewCharData.map(item => item.srv_url);
          self.srvKeyArr = NewCharData.map(item => {
            let srvKeys = {};
            srvKeys[ "keyr" ] = item.srv_url;
            srvKeys[ "text" ] = item.srv_name;
            return srvKeys;
          });

          srvUrlName = Array.from(new Set(srvUrlName));
          self.srvUrlName = srvUrlName.join(","); // 转为‘，’分割的字符串 图例service Name
          let srvName = NewCharData.map(item => item.srv_name);
          self.srvName = Array.from(new Set(srvName)); // 图例中文名数组
          let srvArgName = srvName.map(item => item + "-");
          self.chartData.columns = [ "时间" ]; //
          self.chartData.columns = self.chartData.columns.concat(srvName); // 合并图例的columns
          self.chartData.columns = self.chartData.columns.concat(srvArgName); // 合并图例的columns
          // self.chartData.columns = Array.from(new Set(self.chartData.columns))
          this.chartSettings.showLine = srvName.map(item => item + "-");
          this.chartSettings.axisSite.right = srvName.map(item => item + "-");
          self.legendData(
            self.srvUrlName,
            self.srvName,
            self.dateLine[ self.CurrAct ].key
          );
        })
        .catch(err => {

        });
    },
    //获取图例对应的数据
    legendData (srvName, legendName, type) {
      let req = {
        serviceName: "srvlog_call_statistics_select",
        colNames: [ "*" ],
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

        })
        .catch(err => {

        });
    },
    toIndex (num) {
      if (num === "1") {
        sessionStorage.clear();
        window.top.location.href = "/main/login_pages/login-fw.html";
      }
      if (num === "2") {
        this.$router.push({ name: "platform" });
      }
    },
    getCountData (data, type) {
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

      let allChartData = [];
      function getDataCount (yljgmcName, time, data, chartType) {
        let count = 0;
        for (let r = 0; r < data.length; r++) {
          let srvName = data[ r ];
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
      function getTimeCount (yljgmcName, time, data, chartType) {
        let counts = 0;
        for (let r = 0; r < data.length; r++) {
          let srvName = data[ r ];
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
            if (yljgmcName[ q ] === srvKeys[ n ][ "keyr" ]) {
              itemData[ srvKeys[ n ].text ] = getDataCount(
                yljgmcName[ q ],
                ywfssjTime[ j ],
                datas,
                "line"
              );
              let ArgNum =
                getTimeCount(yljgmcName[ q ], ywfssjTime[ j ], datas, "line") /
                getDataCount(yljgmcName[ q ], ywfssjTime[ j ], datas, "line");
              if (!ArgNum) {
                ArgNum = 0;
              }
              lineGraph.push(ArgNum);

              itemData[ srvKeys[ n ].text + "-" ] = ArgNum;

              srvText = srvKeys[ n ].text + "-";

              itemData[ "时间" ] = ywfssjTime[ j ];
              if (type === "day") {
                itemData[ "时间" ] = ywfssjTime[ j ] + "点";
              }
            }
          }
          // this.chartSettings['showLine'].push(srvText)
        }
        allChartData.push(itemData);

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
          if (yljgmcName[ q ] === srvKeys[ n ][ "keyr" ]) {
            PieData[ "请求次数" ] = getDataCount(yljgmcName[ q ], "", datas, "pie");
            PieData[ "服务" ] = srvKeys[ n ].text;

          }
        }
        pieAllData.push(PieData);
      }
      this.RigPieData.rows = pieAllData;
    },
    getMaxNum (e, r) {
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
      this.chartSettings.max[ 0 ] = ops.maxbar;
      this.chartSettings.max[ 1 ] = ops.maxline;


      return ops;
    },
    timeCycle (e, index = 0) {
      this.CurrAct = index;

      this.legendData(this.srvUrlName, this.srvName, e);
    },
    // FilData(All){
    //   this.srvKeyArr.forEach(item=>{
    //       All.filter(art=>{
    //         if(item.text === art.){}
    //       })
    //   })
    // },
    init () { },

    callback () { },
    toManangerment () {
      let str = window.location.href;
      let num = str.indexOf("?");
      str = str.substr(num + 1);

      window.location.href = "../../main/index.html?" + str;
    },

    //累计运行次数
    sustain () {
      let req = {
        serviceName: "srvlog_call_statistics_select",
        colNames: [ "*" ],
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
            this.grand = res.data.data[ 0 ].num_of_calls;
          }
        })
        .catch(err => {

        });
    }
  },

  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper;
    }
  },
  created () {
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

    // this.$router.push({
    //   name:"",
    //   params:{
    //     title:this.$route.params.title,
    //      appNo:this.$route.params.runtime,
    //   }
    // })
    // this.getLegend()
    // this.CurrRegNum()
    // this.getData_userno()
    // this.sustain()

    // this.accRun()
  },
  mounted () {
    setInterval(() => {
      // this.CurrRegNum()
      // this.getLegend()
      // this.sustain()
    }, 30000);
    sessionStorage.setItem("title", this.$route.params.title);
  },
  watch: {
    showTimeType: function (newdata, olddata) {
      this.secplatdata.items = newdata;
    }
  }
};
</script>
<style lang='scss' scoped>
body {
  margin: 0;
}
.timeType {
  // margin-top: 1.5rem;
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