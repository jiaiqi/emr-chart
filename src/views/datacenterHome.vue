<template>
  <!-- 数据中心 -->
  <div class="home">
    <div class="content_right_box">
      <div class="content_header">
        <div class="icon-view">
          <div
            id="currey"
            @click="homeHref(item.title)"
            :class="item.classStyle"
            v-for="(item,index) in lineOne"
            :key="index"
          >
            <div class="content_header_divo">
              <i :class="item.icon"></i>
            </div>
            <div class="content_header_divt">
              <span>{{item.title}}</span>
              <span>{{item.value === null || item.value === "NaN" ? '0' : (item.value)>10000?(Math.round((item.value)/10000)+'万'):(item.value)}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="content_two_title">
        <span>ETL统计</span>
      </div>
      <div class="content_two">
        <div
          id="currey"
          @click="development(item.title)"
          class="content_two_box"
          v-for="(item,index) in lineTwo"
          :key="index"
        >
          <div class="content_two_boxone">
            <span>{{item.title}}</span>
          </div>
          <div class="content_two_boxtwo">
            <span>{{item.value === null || item.value === "NaN" ? '0' : (item.value)>10000?(Math.round((item.value)/10000)+'万'):(item.value)}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content_three_title">总共享次数</div>
    <div class="content_three">
      <div class="content_three_box">
        <ve-line :data="chartData" :settings="chartSettings"></ve-line>
      </div>
    </div>
  </div>
</template>
<script>
let moment = require("moment");
import axios from "axios";
import VeLine from "v-charts/lib/line";

export default {
  data() {
    this.chartSettings = {
      metrics: ["总共享次数", "时间"],
      dimension: ["时间"],
    };
    return {
      ReqTimeOutys: {
        dataoneys: null,
        datatwoys: null,
        dataThreeys: null,
        dataFourys: null,
        dataFiveys: null,
        dataSixys: null,
        dataSevenys: null,
        dataEightys: null,
        dataNineys: null,
        dataTenys: null,
        dataElevenys: null,
      },
      lineOne: [
        {
          title: "数据库个数",
          value: 0,
          icon: "fa fa-calculator",
          classStyle: "icon-view-item icon-view-item-orange",
        },
        {
          title: "表个数",
          value: 0,
          icon: "fa fa-file-word-o",
          classStyle: "icon-view-item icon-view-item-green",
        },
        {
          title: "记录数",
          value: 0,
          icon: "fa fa-calendar",
          classStyle: "icon-view-item icon-view-item-blue",
        },
        {
          title: "共享表个数",
          value: 0,
          icon: "fa fa-file-pdf-o",
          classStyle: "icon-view-item icon-view-item-lGreen",
        },
      ],
      lineTwo: [
        {
          title: "作业数",
          value: 0,
        },
        {
          title: "执行次数",
          value: 0,
        },
        {
          title: "抽取记录数",
          value: 0,
        },
        {
          title: "加载表次数",
          value: 0,
        },
        {
          title: "加载记录数",
          value: 0,
        },
      ],
      chartData: {
        columns: ["时间", "总共享次数"],
        rows: [
          {
            总共享次数: 100,
            时间: "17点",
          },
        ],
      },
    };
  },
  methods: {
    getCollectData(timeData, type) {
      let yVal = "";
      let rows = [];
      if (type === "day") {
        let hours = [];
        for (let i = 1; i <= 24; i++) {
          hours.push(
            moment()
              .subtract(24 - i, "hours")
              .format("HH")
          );
        }
        yVal = hours;
      }

      let hosiptalArr = ["时间", "总共享次数"];
      yVal.map((hour) => {
        let dataMap = {
          时间: 0,
          总共享次数: 0,
        };
        if (type === "day") {
          if (hour < 10) {
            dataMap.时间 = hour.slice(1, 2) + "点";
          } else {
            dataMap.时间 = hour + "点";
          }
          hosiptalArr.map((hospital) => {
            let count = 0;
            timeData.map((dataItem) => {
              if (hospital == "总共享次数" && dataItem.create_time == hour) {
                count += dataItem.share_row_count;

                dataMap[hospital] = count;
              }
            });
          });
        }
        rows.push(dataMap);
      });
      // this.hospitaldata.rows = rows
      return rows;
    },

    homeHref(item) {
      if (item == "数据库个数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/list/srvdc_rc_db_select?srvApp=datacenter&menuapp=datacenter",
          icon: "",
        };
        window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/list/srvdc_rc_db_select?menuapp=datacenter'
      } else if (item == "表个数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/list/srvdc_rc_db_table_select?srvApp=datacenter&menuapp=datacenter",
          icon: "",
        };
        window.top.tab.addTab(page);
        //  window.location.href = '/vpages/index.html#/list/srvdc_rc_db_table_select?menuapp=datacenter'
      } else if (item == "记录数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/list/srvdc_rc_db_table_select?srvApp=datacenter&menuapp=datacenter",
          icon: "",
        };
        window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/list/srvdc_rc_db_table_select?menuapp=datacenter'
      } else if (item == "共享表个数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/list/srvdc_share_shared_table_select?srvApp=datashare&menuapp=datacenter",
          icon: "",
        };
        window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/list/srvdc_rc_db_table_select?menuapp=datacenter'
      }
    },
    development(item) {
      if (item == "作业数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/list/srvetl_job_select?srvApp=etl&menuapp=etl",
          icon: "",
        };
        window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/list/srvetl_job_select?menuapp=etl'
      } else if (item == "执行次数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/list/srvetl_job_history_select?srvApp=etl&menuapp=etl",
          icon: "",
        };
        window.top.tab.addTab(page);
        //  window.location.href = '/vpages/index.html#/list/srvetl_job_history_select?menuapp=etl'
      } else if (item == "抽取记录数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/list/srvetl_processor_history_select?srvApp=etl&menuapp=etl",
          icon: "",
        };
        window.top.tab.addTab(page);
        //  window.location.href = '/vpages/index.html#/list/srvetl_processor_history_select?menuapp=etl'
      } else if (item == "加载表个数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/list/srvetl_processor_history_select?srvApp=etl&menuapp=etl",
          icon: "",
        };
        window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/list/srvetl_processor_history_select?menuapp=etl'
      } else if (item == "加载记录数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/list/srvetl_processor_history_select?srvApp=etl&menuapp=etl",
          icon: "",
        };
        window.top.tab.addTab(page);
        //  window.location.href = '/vpages/index.html#/list/srvetl_processor_history_select?menuapp=etl'
      }
    },
    //数据库个数
    async getData_one() {
      let self = this;
      let req1 = {
        serviceName: "srvdc_rc_db_select",
        colNames: ["*"],
        condition: [],
        group: [{ colName: "id", type: "count" }],
      };
      let path = this.getServiceUrl(
        "select",
        "srvdc_rc_db_select",
        "datacenter"
      );
      // axios.post(
      //     path, req1,
      let res = await self.axios.post(path, req1);
      // ).then(res => {
      if (res.status === 200) {
        this.lineOne[0].value = res.data.data[0].id;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }

      // }).catch(err => {

      // })
    },
    //表个数
    async getData_two() {
      let self = this;
      let req2 = {
        serviceName: "srvdc_rc_db_table_select",
        colNames: ["*"],
        condition: [],
        group: [{ colName: "id", type: "count" }],
      };
      let path = this.getServiceUrl(
        "select",
        "srvdc_rc_db_table_select",
        "datacenter"
      );
      // axios.post(
      let res = await self.axios.post(path, req2);

      if (res.status === 200) {
        this.lineOne[1].value = res.data.data[0].id;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // ).then(res => {

      // }).catch(err => {

      // })
    },
    //记录数
    async getData_three() {
      let self = this;
      let req3 = {
        serviceName: "srvdc_rc_db_table_select",
        colNames: ["*"],
        condition: [],
        group: [
          {
            colName: "row_count",
            type: "sum",
          },
        ],
      };
      let path = this.getServiceUrl(
        "select",
        "srvdc_rc_db_table_select",
        "datacenter"
      );
      // axios.post(
      //     path, req3,
      let res = await self.axios.post(path, req3);

      if (res.status === 200) {
        this.lineOne[2].value = res.data.data[0].row_count;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // ).then(res => {

      // }).catch(err => {

      // })
    },
    //共享表个数
    async getData_four() {
      let self = this;
      let req4 = {
        serviceName: "srvdc_share_serve_summary_select",
        colNames: ["*"],
        condition: [],
        group: [
          {
            colName: "id",
            type: "count",
          },
        ],
      };
      let path = this.getServiceUrl(
        "select",
        "srvdc_share_serve_summary_select",
        "datashare"
      );
      // axios.post(
      //     path, req4,
      let res = await self.axios.post(path, req4);

      if (res.status === 200) {
        this.lineOne[3].value = res.data.data[0].id;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // ).then(res => {

      // }).catch(err => {

      // })
    },
    //作业数
    async getData_five() {
      let self = this;
      let req5 = {
        serviceName: "srvetl_job_select",
        colNames: ["*"],
        condition: [],
        group: [{ colName: "state", type: "count" }],
      };
      let path = this.getServiceUrl("select", "srvetl_job_select", "etl");
      // axios.post(
      //     path, req5,
      let res = await self.axios.post(path, req5);

      if (res.status === 200) {
        this.lineTwo[0].value = res.data.data[0].state;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },
    //执行次数
    async getData_six() {
      let self = this;
      let req6 = {
        serviceName: "srvetl_job_history_select",
        colNames: ["*"],
        condition: [],
        group: [{ colName: "id", type: "count" }],
      };
      let path = this.getServiceUrl(
        "select",
        "srvetl_job_history_select",
        "etl"
      );
      // axios.post(
      //     path, req6,
      let res = await self.axios.post(path, req6);

      if (res.status === 200) {
        this.lineTwo[1].value = res.data.data[0].id;

        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },
    //抽取记录数
    async getData_seven() {
      let self = this;
      let req7 = {
        serviceName: "srvetl_processor_history_select",
        colNames: ["*"],
        condition: [
          {
            colName: "Processor_type",
            ruleType: "eq",
            value: "extractor-db",
          },
        ],
        group: [
          {
            colName: "ok_records_count",
            type: "sum",
          },
        ],
      };
      let path = this.getServiceUrl(
        "select",
        "srvetl_processor_history_select",
        "etl"
      );
      // axios.post(
      //     path, req7,
      let res = await self.axios.post(path, req7);

      if (res.status === 200) {
        this.lineTwo[2].value = res.data.data[0].ok_records_count;

        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },
    //加载表个数
    async getData_eight() {
      let self = this;
      let req8 = {
        serviceName: "srvetl_processor_history_select",
        colNames: ["*"],
        condition: [
          {
            colName: "Processor_type",
            ruleType: "eq",
            value: "loader-db",
          },
        ],
        group: [
          {
            colName: "dst_table_name",
            type: "count",
          },
        ],
      };
      let path = this.getServiceUrl(
        "select",
        "srvetl_processor_history_select",
        "etl"
      );
      // axios.post(
      //     path, req8,
      let res = await self.axios.post(path, req8);

      if (res.status === 200) {
        this.lineTwo[3].value = res.data.data[0].dst_table_name;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },
    //加载记录数
    async getData_nine() {
      let self = this;
      let req9 = {
        serviceName: "srvetl_processor_history_select",
        colNames: ["*"],
        condition: [
          {
            colName: "Processor_type",
            ruleType: "eq",
            value: "loader-db",
          },
        ],
        group: [
          {
            colName: "ok_records_count",
            type: "sum",
          },
        ],
      };
      let path = this.getServiceUrl(
        "select",
        "srvetl_processor_history_select",
        "etl"
      );
      // axios.post(
      //     path, req9,
      let res = await self.axios.post(path, req9);

      if (res.status === 200) {
        this.lineTwo[4].value = res.data.data[0].ok_records_count;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },
    //总共享次数
    async getData_ten() {
      let self = this;
      let dates = new Date();
      let time = moment().format("YYYY-MM-DD");

      let req = {
        serviceName: "srvdc_share_serve_summary_record_select",
        colNames: ["*"],
        condition: [
          {
            colName: "create_time",
            // "value": this.timeHorizon.today,
            value: moment().format("YYYY-MM-DD HH:mm:ss"),
            ruleType: "le",
          },
          {
            colName: "create_time",
            // "value": this.timeHorizon.today,
            value: moment().subtract(23, "hours").format("YYYY-MM-DD HH:mm:ss"),
            ruleType: "ge",
          },
        ],
        group: [
          {
            colName: "share_row_count",
            type: "count",
          },
          {
            colName: "create_time",
            type: "by_hour",
          },
        ],
      };
      let path = this.getServiceUrl(
        "select",
        "srvdc_share_serve_summary_record_select",
        "datashare"
      );
      // axios.post(
      //     path, req,
      let res = await self.axios.post(path, req);

      if (res.status === 200) {
        this.chartData.rows = this.getCollectData(res.data.data, "day");
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },

    dataoneys() {
      let self = this;
      self.ReqTimeOutys.dataoneys = new this.timeOut(60, 0, self.getData_one);
      self.ReqTimeOutys.dataoneys.reqFun();
      self.ReqTimeOutys.dataoneys.startTime();
    },
    /**定时刷新 */
    datatwoys() {
      let self = this;
      self.ReqTimeOutys.datatwoys = new this.timeOut(60, 0, self.getData_two);
      self.ReqTimeOutys.datatwoys.reqFun();
      self.ReqTimeOutys.datatwoys.startTime();
    },
    dataThreeys() {
      let self = this;
      self.ReqTimeOutys.dataThreeys = new this.timeOut(
        60,
        0,
        self.getData_three
      );
      self.ReqTimeOutys.dataThreeys.reqFun();
      self.ReqTimeOutys.dataThreeys.startTime();
    },
    dataFourys() {
      let self = this;
      self.ReqTimeOutys.dataFourys = new this.timeOut(60, 0, self.getData_four);
      self.ReqTimeOutys.dataFourys.reqFun();
      self.ReqTimeOutys.dataFourys.startTime();
    },
    dataFiveys() {
      let self = this;
      self.ReqTimeOutys.dataFiveys = new this.timeOut(60, 0, self.getData_five);
      self.ReqTimeOutys.dataFiveys.reqFun();
      self.ReqTimeOutys.dataFiveys.startTime();
    },
    dataSixys() {
      let self = this;
      self.ReqTimeOutys.dataSixys = new this.timeOut(60, 0, self.getData_six);
      self.ReqTimeOutys.dataSixys.reqFun();
      self.ReqTimeOutys.dataSixys.startTime();
    },
    dataSevenys() {
      let self = this;
      self.ReqTimeOutys.dataSevenys = new this.timeOut(
        60,
        0,
        self.getData_seven
      );
      self.ReqTimeOutys.dataSevenys.reqFun();
      self.ReqTimeOutys.dataSevenys.startTime();
    },
    dataEightys() {
      let self = this;
      self.ReqTimeOutys.dataEightys = new this.timeOut(
        60,
        0,
        self.getData_eight
      );
      self.ReqTimeOutys.dataEightys.reqFun();
      self.ReqTimeOutys.dataEightys.startTime();
    },
    dataNineys() {
      let self = this;
      self.ReqTimeOutys.dataNineys = new this.timeOut(60, 0, self.getData_nine);
      self.ReqTimeOutys.dataNineys.reqFun();
      self.ReqTimeOutys.dataNineys.startTime();
    },
    dataTenys() {
      let self = this;
      self.ReqTimeOutys.dataTenys = new this.timeOut(60, 0, self.getData_ten);
      self.ReqTimeOutys.dataTenys.reqFun();
      self.ReqTimeOutys.dataTenys.startTime();
    },
  },
  created() {
    // this.getData_one()
    // this.getData_two()
    // this.getData_three()
    // this.getData_four()
    // this.getData_five()
    // this.getData_six()
    // this.getData_seven()
    // this.getData_eight()
    // this.getData_nine()
    // this.getData_ten()
    // this.Automatically()
  },
  mounted() {
    this.dataoneys();
    this.datatwoys();
    this.dataThreeys();
    this.dataFourys();
    this.dataFiveys();
    this.dataSixys();
    this.dataSevenys();
    this.dataEightys();
    this.dataNineys();
    this.dataTenys();
  },
  destroyed() {
    this.ReqTimeOut.dataoneys.endTime();
    this.ReqTimeOut.datatwoys.endTime();
    this.ReqTimeOut.dataThreeys.endTime();
    this.ReqTimeOut.dataFourys.endTime();
    this.ReqTimeOut.dataFiveys.endTime();
    this.ReqTimeOut.dataSixys.endTime();
    this.ReqTimeOut.dataSevenys.endTime();
    this.ReqTimeOut.dataEightys.endTime();
    this.ReqTimeOut.dataNineys.endTime();
    this.ReqTimeOut.dataTenys.endTime();
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
#currey {
  cursor: pointer;
}
.content_two_title,
.content_three_title {
  width: 100%;
  height: 1.5rem;
  text-indent: 10px;
  line-height: 1.5rem;
  margin-top: 10px;
  padding-bottom: 10px;
  padding-top: 10px;
  font-weight: bolder;
  background-color: rgb(78, 194, 248);
  color: white;
}
.content_three_title {
  margin-top: 20px;
  margin-bottom: 10px;
}
.icon-view {
  list-style: none;
}
.content_right_box {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
}
.content_header {
  width: 100%;
}
.content_header > .icon-view {
  width: 100%;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content_header > .icon-view > .icon-view-item {
  width: 23%;
  display: flex;
  align-items: center;
  /* margin-right:1rem; */
  justify-content: space-around;
  border-radius: 10px;
}
.content_header > .icon-view > .icon-view-item-green {
  background-color: rgb(55, 221, 91);
}
.content_header > .icon-view > .icon-view-item-blue {
  background-color: rgb(11, 148, 240);
}
.content_header > .icon-view > .icon-view-item-orange {
  background-color: rgb(228, 209, 40);
}
.content_header > .icon-view > .icon-view-item-lGreen {
  background-color: rgb(137, 44, 243);
}
.content_header_divo {
  width: 50%;
  text-align: center;
}
.content_header_divt {
  width: 50%;
  padding-top: 20px;
  color: #fff;
}
.content_header_divo > span {
  width: 100%;
}
.content_header_divo > i {
  font-size: 80px;
  color: #fff;
}
.content_header_divt > span {
  display: block;
  text-align: center;
}
.content_header_divt > span:nth-of-type(2) {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 40px;
}
/* content_two */
.content_two {
  width: 100%;
  /* margin-top: 20px; */
  display: flex;
}
.content_two_box {
  margin-top: 10px;
  color: black !important;
  width: 20%;
}
.content_two_boxone {
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: baseline;
  margin-bottom: 20px;
}
.content_two_boxone > span {
  width: 100%;
  display: inline-block;
  text-align: center;
}
.content_two_boxtwo {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: baseline;
  font-size: 40px;
  /* margin-top:20px; */
  margin-bottom: 30px;
}
.content_two_boxtwo > span {
  width: 100%;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  border-right: 1px solid #cccccc;
}
.content_two_box:last-child .content_two_boxtwo > span {
  border-right-width: 0;
}
.content_two_boxtwo > span:nth-of-type(5) {
  border-right: none !important;
}
/* content_three */
.content_three {
  width: 100%;
  /* margin-top: 20px; */
}
.content_three > p {
  width: 100%;
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #cccccc;
  font-weight: bolder;
}
.content_three_box {
  width: 100%;
  height: 280px;
}

/* 1366*769 */
@media screen and (max-width: 1366px) {
  .content_two_title,
  .content_three_title {
    width: 100%;
    height: 1rem;
    text-indent: 10px;
    line-height: 1rem;
    /* margin-top: 10px; */
    padding-bottom: 5px;
    padding-top: 5px;
    font-weight: bolder;
    background-color: rgb(78, 194, 248);
    color: white;
    margin-top: 5px;
  }
  .content_three_title {
    margin-bottom: 5px;
  }
  .icon-view {
    list-style: none;
  }
  .content_right_box {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
  }
  .content_header {
    width: 100%;
  }
  .content_header > .icon-view {
    width: 100%;
    padding: 5px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content_header > .icon-view > .icon-view-item {
    width: 23%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
  }
  .content_header > .icon-view > .icon-view-item-green {
    background-color: rgb(55, 221, 91);
  }
  .content_header > .icon-view > .icon-view-item-blue {
    background-color: rgb(11, 148, 240);
  }
  .content_header > .icon-view > .icon-view-item-orange {
    background-color: rgb(219, 206, 83);
  }
  .content_header > .icon-view > .icon-view-item-lGreen {
    background-color: rgb(137, 44, 243);
  }
  .content_header_divo {
    width: 50%;
    text-align: center;
  }
  .content_header_divt {
    width: 50%;
    padding-top: 20px;
    color: #fff;
  }
  .content_header_divo > span {
    width: 100%;
  }
  .content_header_divo > i {
    font-size: 70px;
    color: #fff;
  }
  .content_header_divt > span {
    display: block;
    text-align: center;
  }
  .content_header_divt > span:nth-of-type(2) {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 30px;
  }
  /* content_two */
  .content_two {
    width: 100%;
    /* margin-top: 20px; */
    display: flex;
  }
  .content_two_box {
    margin-top: 10px;
    width: 20%;
  }
  .content_two_boxone {
    width: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: baseline;
    margin-bottom: 10px;
  }
  .content_two_boxone > span {
    width: 100%;
    display: inline-block;
    text-align: center;
  }
  .content_two_boxtwo {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: baseline;
    font-size: 30px;
    /* margin-top:20px; */
    margin-bottom: 30px;
  }
  .content_two_boxtwo > span {
    width: 100%;
    text-align: center;
    padding-top: 20px;
    padding-bottom: 20px;
    border-right: 1px solid rgb(235, 232, 232);
  }
  .content_two_box:last-child .content_two_boxtwo > span {
    border-right-width: 0;
  }
  .content_two_boxtwo > span:nth-of-type(5) {
    border-right: none !important;
  }
  /* content_three */
  .content_three {
    width: 100%;
    /* margin-top: 20px; */
  }
  .content_three > p {
    width: 100%;
    margin-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #cccccc;
    font-weight: bolder;
  }
  .content_three_box {
    width: 100%;
    height: 280px;
  }
}
</style>