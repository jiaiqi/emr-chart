<template>
  <!-- 协同平台 -->
  <div class="content_right_box">
    <div class="content_header">
      <div class="icon-view">
        <div
          @click="homeHref(item.title)"
          id="currey"
          :class="item.classStyle"
          v-for="(item,index) in lineOne"
          :key="index"
        >
          <div class="content_header_divo">
            <i :class="item.icon"></i>
          </div>
          <div class="content_header_divt">
            <span>{{item.title}}</span>
            <span>{{(item.value === null) || (item.value === "NaN") ? '0' : (item.value>10000)? Math.ceil(item.value/10000)+'万':item.value}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content_two_title">
      <span>应用开发中心</span>
    </div>
    <div class="content_two">
      <div
        @click="development(item.title)"
        id="currey"
        class="content_two_box"
        v-for="(item,index) in lineTwo"
        :key="index"
      >
        <div class="content_two_boxone">
          <span>{{item.title}}</span>
        </div>
        <div class="content_two_boxtwo">
          <span>{{(item.value === null) || (item.value === "NaN")  ? '0' : (item.value>10000)? Math.ceil(item.value)+'万':item.value}}</span>
        </div>
      </div>
    </div>
    <div class="content_three_title">服务请求次数</div>
    <div class="content_three">
      <div class="content_three_box">
        <ve-line :data="chartData" class="ve_lineitem"></ve-line>
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
    return {
      ReqTimeOut: {
        dataone: null,
        datatwo: null,
        dataThree: null,
        dataFour: null,
        dataFive: null,
        dataSix: null,
        dataSeven: null,
        dataEight: null,
        dataNine: null
      },
      sData1: "", //当前计算时间
      sData2: "", //计算后时间-24小时
      lineOne: [
        {
          title: "用户数",
          value: 0,
          icon: "fa fa-user-circle",
          classStyle: "icon-view-item icon-view-item-orange"
        },
        {
          title: "应用个数",
          value: 0,
          icon: "fa fa-address-book-o",
          classStyle: "icon-view-item icon-view-item-green"
        },
        {
          title: "服务器个数",
          value: 0,
          icon: "fa fa-list-ol",
          classStyle: "icon-view-item icon-view-item-blue"
        },
        {
          title: "累计服务次数",
          value: 0,
          icon: "fa fa-calendar-check-o",
          classStyle: "icon-view-item icon-view-item-lGreen"
        }
      ],
      lineTwo: [
        {
          title: "工单个数",
          value: 0
        },
        {
          title: "文档个数",
          value: 0
        },
        {
          title: "开发包个数",
          value: 0
        },
        {
          title: "申请中应用个数",
          value: 0
        },
        {
          title: "上线应用个数",
          value: 0
        }
      ],
      chartData: {
        columns: ["时间", "请求次数"],
        rows: [
          // { '时间': '00：00', '请求次数': 123 },
          // { '时间': '04：00', '请求次数': 1223 },
          // { '时间': '08：00', '请求次数': 2123 },
          // { '时间': '12：00', '请求次数': 4123 },
          // { '时间': '16：00', '请求次数': 3123 },
          // { '时间': '20：00', '请求次数': 7123 }
        ],
        grid: {
          top: "120",
          bottom: "0",
          height: "auto"
        }
      }
    };
  },
  methods: {
    homeHref(item) {
      if (item == "用户数") {
        let page = {
          title: item,
          url: "/vpages/index.html#/list/srvsso_user_select?srvApp=sso",
          icon: ""
        };
        window.top.tab.addTab(page);
      } else if (item == "应用个数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/list/srvconfig_app_list_select?srvApp=config",
          icon: ""
        };
        window.top.tab.addTab(page);
      } else if (item == "累计服务次数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/list/srvlog_call_statistics_select?srvApp=log",
          icon: ""
        };
        window.top.tab.addTab(page);
      }
    },
    development(item) {
      if (item == "工单个数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/list/srvapprc_issue_info_select?srvApp=apprc",
          icon: ""
        };
        window.top.tab.addTab(page);
      } else if (item == "文档个数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/list/srvfile_attachment_select?srvApp=file",
          icon: ""
        };
        window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/list/srvfile_attachment_select'
      } else if (item == "开发包个数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/treegrid/srvapprc_kit_components_select?srvApp=apprc",
          icon: ""
        };
        window.top.tab.addTab(page);
        //  window.location.href = '/vpages/index.html#/treegrid/srvapprc_kit_components_select'
      } else if (item == "申请中应用个数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/listproc/srvapprc_application_apply_select?srvApp=apprc",
          icon: ""
        };
        window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/listproc/srvapprc_application_apply_select'
      } else if (item == "上线应用个数") {
        let page = {
          title: item,
          url:
            "/vpages/index.html#/listproc/srvapprc_online_apply_select?srvApp=apprc",
          icon: ""
        };
        window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/listproc/srvapprc_online_apply_select'
      }
    },
    serverNum() {
      let req10 = {
        serviceName: "srvlog_call_statistics_select",
        colNames: ["*"],
        condition: [
          {
            colName: "application",
            value: "apprc",
            ruleType: "eq"
          },
          {
            colName: "statistics_time",
            value: this.sData1, //（当前时间，需要前端自己定义变量）
            ruleType: "lt"
          },
          {
            colName: "statistics_time",
            value: this.sData2, //（开始计算的时间，是根据上个条件减去一个周期时间得到）
            ruleType: "gt"
          }
        ],
        group: [
          {
            colName: "statistics_time",
            type: "by"
          },
          {
            colName: "statistics_time",
            type: "by_hour"
          },
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
      axios
        .post(path, req10)
        .then(res => {
          // console.log(res.data.data)

          let yVal = "";
          // let rows = []
          // if (type === 'day') {
          let hours = [];
          for (let i = 1; i <= 24; i++) {
            hours.push(
              moment()
                .subtract(24 - i, "hours")
                .format("HH")
            );
          }

          yVal = hours;
          console.warn(yVal);
          // }

          let rowsArr = [];
          let rowsJson = "";
          let datas = res.data.data;
          for (let j = 0; j < yVal.length; j++) {
            if (yVal[j] < 10) {
              yVal[j] = yVal[j].slice(1, 2);
            } else {
              yVal[j] = yVal[j];
            }

            rowsJson = {
              时间: yVal[j],
              请求次数: 0
            };
            for (let i = 0; i < datas.length; i++) {
              if (datas[i].statistics_time == rowsJson.时间) {
                rowsJson.请求次数 = datas[i].num_of_calls;
              }
            }
            rowsJson.时间 = rowsJson.时间 + "点";
            rowsArr.push(rowsJson);
          }
          // console.log(rowsArr)
          this.chartData.rows = rowsArr;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //当前时间计算
    nowTime() {
      var currentTime = //修改数据date
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate() +
        " " +
        new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ":" +
        new Date().getSeconds();
      this.sData1 = currentTime;
      // console.log( this.sData1)

      // console.log((new Date(new Date().getTime() - 24 * 60 * 60 * 1000)))
      // console.log("哈哈"+new Data())
    },
    nowTimeMinus() {
      //当前时间减去24小时
      var nowDataMinus = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
      //  console.log(nowDataMinus)
      this.sData2 =
        nowDataMinus.getFullYear() +
        "-" +
        (nowDataMinus.getMonth() + 1) +
        "-" +
        nowDataMinus.getDate() +
        " " +
        nowDataMinus.getHours() +
        ":" +
        nowDataMinus.getMinutes() +
        ":" +
        nowDataMinus.getSeconds();
      // console.log( this.sData2)
    },
    //用户数
    async getData_one() {
      let self = this;
      let req1 = {
        serviceName: "srvsso_user_select",
        colNames: ["user_no"],
        condition: [],
        group: [{ colName: "user_no", type: "count" }]
      };
      let path = this.getServiceUrl("select", "srvsso_user_select", "sso");
      // axios.post(
      //   path, req1,
      let res = await self.axios.post(path, req1);

      if (res.status === 200) {
        this.lineOne[0].value = res.data.data[0].user_no;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // ).then(res => {
      // console.log('11111111',res.data.data[0].birth_date)
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    //应用个数
    async getData_two() {
      let self = this;
      let req2 = {
        serviceName: "srvconfig_app_list_select",
        colNames: ["*"],
        condition: [],
        group: [{ colName: "app_class", type: "count" }]
      };
      let path = this.getServiceUrl(
        "select",
        "srvconfig_app_list_select",
        "config"
      );
      // axios.post(
      //   path, req2,
      let res = await self.axios.post(path, req2);

      if (res.status === 200) {
        this.lineOne[1].value = res.data.data[0].app_class;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // ).then(res => {
      // console.log('2222',res.data.data[0].app_class  )
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    //服务器个数
    async getData_three() {
      let self = this;
      let req3 = {
        serviceName: "srvapprc_env_apply_select",
        colNames: ["*"],
        condition: [],
        group: [{ colName: "id", type: "count" }]
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_env_apply_select",
        "apprc"
      );
      // axios.post(
      //   path, req3,
      let res = await self.axios.post(path, req3);

      if (res.status === 200) {
        this.lineOne[2].value = res.data.data[0].id;

        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // ).then(res => {
      // console.log('3333',res.data.data[0].id)
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    //累计服务次数
    async getData_four() {
      let self = this;
      let req4 = {
        serviceName: "srvlog_call_statistics_select",
        colNames: ["*"],
        condition: [
          {
            colName: "application",
            value: "apprc",
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
      // axios.post(
      //   path, req4,
      let res = await self.axios.post(path, req4);

      if (res.status === 200) {
        this.lineOne[3].value = res.data.data[0].num_of_calls;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },

    //工单个数
    async getData_five() {
      let self = this;
      let req5 = {
        serviceName: "srvapprc_issue_info_select",
        colNames: ["*"],
        condition: [],
        group: [{ colName: "id", type: "count" }]
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_issue_info_select",
        "apprc"
      );
      // axios.post(
      //   path, req5,
      let res = await self.axios.post(path, req5);

      if (res.status === 200) {
        this.lineTwo[0].value = res.data.data[0].id;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // ).then(res => {
      // console.log('555555',res.data.data[0].id)
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    //文档个数
    async getData_six() {
      let self = this;
      let req6 = {
        serviceName: "srvapprc_dev_wendang_select",
        colNames: ["*"],
        condition: [],
        group: [{ colName: "id", type: "count" }]
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_dev_wendang_select",
        "apprc"
      );
      // axios.post(
      //   path, req6,
      let res = await self.axios.post(path, req6);

      if (res.status === 200) {
        this.lineTwo[1].value = res.data.data[0].id;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // ).then(res => {
      // console.log('666666',res.data.data[0].id)
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    //开发包个数
    async getData_seven() {
      let self = this;
      let req7 = {
        serviceName: "srvapprc_kit_components_select",
        colNames: ["*"],
        condition: [],
        group: [{ colName: "no", type: "count" }]
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_kit_components_select",
        "apprc"
      );
      // axios.post(
      //   path, req7,
      let res = await self.axios.post(path, req7);

      if (res.status === 200) {
        this.lineTwo[2].value = res.data.data[0].no;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // ).then(res => {
      // console.log('777',res.data.data[0].no)
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    //申请中应用
    async getData_eight() {
      let self = this;
      let req8 = {
        serviceName: "srvapprc_application_apply_select",
        colNames: ["*"],
        condition: [],
        group: [{ colName: "appid", type: "count" }]
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_application_apply_select",
        "apprc"
      );
      // axios.post(
      //   path, req8,
      let res = await self.axios.post(path, req8);

      if (res.status === 200) {
        this.lineTwo[3].value = res.data.data[0].appid;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // ).then(res => {
      // console.log('88888',res.data.data[0].appid)
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    //上线应用个数
    async getData_nine() {
      let self = this;
      let req9 = {
        serviceName: "srvapprc_online_apply_select",
        colNames: ["*"],
        condition: [],
        group: [
          {
            colName: "appid",
            type: "count"
          }
        ]
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_online_apply_select",
        "apprc"
      );
      // axios.post(
      //   path, req9,
      // ).then(res => {
      // this.Automatically()
      let res = await self.axios.post(path, req9);

      if (res.status === 200) {
        this.lineTwo[4].value = res.data.data[0].appid;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // console.log('999999',res.data.data)
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    //5s自动刷新
    Automatically() {
      setInterval(() => {
        // this.nowTime()
        // this.getData_one()
        // this.getData_two()
        // this.getData_three()
        // this.getData_four()
        // this.getData_five()
        // this.getData_six()
        // this.getData_seven()
        // this.getData_eight()
        // this.getData_nine()
        // this.nowTimeMinus()
        // this.serverNum()
      }, 100000);
    },
    dataone() {
      let self = this;
      self.ReqTimeOut.dataone = new this.timeOut(60, 0, self.getData_one);
      self.ReqTimeOut.dataone.reqFun();
      self.ReqTimeOut.dataone.startTime();
    },
    /**定时刷新 */
    datatwo() {
      let self = this;
      self.ReqTimeOut.datatwo = new this.timeOut(60, 0, self.getData_two);
      self.ReqTimeOut.datatwo.reqFun();
      self.ReqTimeOut.datatwo.startTime();
    },
    dataThree() {
      let self = this;
      self.ReqTimeOut.dataThree = new this.timeOut(60, 0, self.getData_three);
      self.ReqTimeOut.dataThree.reqFun();
      self.ReqTimeOut.dataThree.startTime();
    },
    dataFour() {
      let self = this;
      self.ReqTimeOut.dataFour = new this.timeOut(60, 0, self.getData_four);
      self.ReqTimeOut.dataFour.reqFun();
      self.ReqTimeOut.dataFour.startTime();
    },
    dataFive() {
      let self = this;
      self.ReqTimeOut.dataFive = new this.timeOut(60, 0, self.getData_five);
      self.ReqTimeOut.dataFive.reqFun();
      self.ReqTimeOut.dataFive.startTime();
    },
    dataSix() {
      let self = this;
      self.ReqTimeOut.dataSix = new this.timeOut(60, 0, self.getData_six);
      self.ReqTimeOut.dataSix.reqFun();
      self.ReqTimeOut.dataSix.startTime();
    },
    dataSeven() {
      let self = this;
      self.ReqTimeOut.dataSeven = new this.timeOut(60, 0, self.getData_seven);
      self.ReqTimeOut.dataSeven.reqFun();
      self.ReqTimeOut.dataSeven.startTime();
    },
    dataEight() {
      let self = this;
      self.ReqTimeOut.dataEight = new this.timeOut(60, 0, self.getData_eight);
      self.ReqTimeOut.dataEight.reqFun();
      self.ReqTimeOut.dataEight.startTime();
    },
    dataNine() {
      let self = this;
      self.ReqTimeOut.dataNine = new this.timeOut(60, 0, self.getData_nine);
      self.ReqTimeOut.dataNine.reqFun();
      self.ReqTimeOut.dataNine.startTime();
    }
  },

  created() {
    this.nowTime();

    // this.getData_one()
    // this.getData_two()
    // this.getData_three()
    // this.getData_four()
    // this.getData_five()
    // this.getData_six()
    // this.getData_seven()
    // this.getData_eight()
    // this.getData_nine()

    this.nowTimeMinus();
    this.serverNum();
  },
  mounted() {
    this.dataone();
    this.datatwo();
    this.dataThree();
    this.dataFour();
    this.dataFive();
    this.dataSix();
    this.dataSeven();
    this.dataEight();
    this.dataNine();
  },
  components: { VeLine },
  destroyed() {
    // clearInterval(this.Automatically);
    this.ReqTimeOut.dataone.endTime();
    this.ReqTimeOut.datatwo.endTime();
    this.ReqTimeOut.dataThree.endTime();
    this.ReqTimeOut.dataFour.endTime();
    this.ReqTimeOut.dataFive.endTime();
    this.ReqTimeOut.dataSix.endTime();
    this.ReqTimeOut.dataSeven.endTime();
    this.ReqTimeOut.dataEight.endTime();
    this.ReqTimeOut.dataNine.endTime();
  }
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
#currey {
  cursor: pointer;
  color: black;
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
    padding-top: 10px;
    color: #fff;
  }
  .content_header_divo > span {
    width: 100%;
  }
  .content_header_divo > i {
    font-size: 60px;
    color: #fff;
  }
  .content_header_divt > span {
    display: block;
    text-align: center;
  }
  .content_header_divt > span:nth-of-type(2) {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 30px;
  }
  /* content_two */
  .content_two {
    width: 100%;
    /* margin-top: 20px; */
    display: flex;
  }
  .content_two_box {
    margin-top: 5px;
    width: 20%;
  }
  .content_two_boxone {
    width: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: baseline;
    margin-bottom: 5px;
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
    margin-bottom: 20px;
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
  }
  .content_three_box {
    width: 100%;
    height: 300px;
  }
}
</style>
