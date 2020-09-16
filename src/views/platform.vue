/* eslint-disable */
<template>
  <div class="wrap_view">
    <!-- <div class="header">
      <div class="header_left">
        <div>
          <span>当前用户数:</span>
          <span>{{regNum}}</span>
        </div>
        <div>
          <span>注册用户数:</span>
          <span>{{list_useno}}</span>
        </div>
      </div>
      <div class="header_cen">
        <h3>业务协同标准化服务平台</h3>
      </div>
      <div class="header_system">
        <div class="header_rig">
          <div>{{ date }}</div>
        </div>
        <div class="currentId">
          <span>当前账号:</span>
          <span>{{ user !== null && user.user_no !== null ? user.user_no:'-' }}</span>
        </div>

        <div class="enter">
          <span @click="toManangerment">管理入口</span>
        </div>
        <div class="back">
          <span @click="toIndex('1')">注销</span>
        </div>
        <div class="back">
          <span @click="toIndex('2')">返回</span>
        </div>
      </div>
    </div>-->
    <view-title
      :titleViewData="titleViewData"
      :currpage="titleViewData"
    ></view-title>
    <div class="main">
      <view-tabs v-on:viewtabs="viewtabs" :tabsData="tabsData"></view-tabs>
      <!-- <div class="main_top">
        <div
          class="top_header_item tabbtn"
          :class="{tabactive:tabsShow==1}"
          @click="changeTab(1)"
        >微服务</div>
        <div
          class="top_header_item tabbtn"
          :class="{tabactive:tabsShow==2}"
          @click="changeTab(2)"
        >服务器资源</div>
      </div>-->

      <plat-mirc
        :platMirc="platMircData"
        v-if="contentData.currentPage === 'platMirc'"
      ></plat-mirc>
      <!-- <plat-mirc :operat="operat"  v-if="contentData.currentPage === 'platMirc'"></plat-mirc> -->

      <plat-serve v-if="contentData.currentPage === 'platService'"></plat-serve>
    </div>
  </div>
</template>
<script>
let moment = require("moment");
import ViewTitle from "@/components/ViewTitle";
import ViewTabs from "@/components/ViewTabs";

import platMirc from "../components/platformMirc";
import platServe from "../components/platformServe";
export default {
  name: "platform",
  components: { platMirc, platServe, ViewTitle, ViewTabs },
  data () {
    return {
      platMircData: {
        listwg: "",
        listpz: "",
        list_userno: "",
        list_rw: "",
        regNum: [ { num_of_calls: "" }, { num_of_calls: "" } ],
        list_sj: "",
        logNum: "",
        list_cs: "",
        list_cssx: "",
        list_kfgd: "",
        list_kfcl: "",
        list_zcyy: "",
        list_jkyygs: "",
        operat: {},
      },

      // date: null,
      // showComponent: platMirc,
      // tabsShow: 1,
      // user: {
      //   user_no: ""
      // },
      // list_useno: "",
      // regNum: "",
      titleViewData: {
        title: "业务协同标准化服务平台",
        date: "",
        currentPage: "platform",
        // request: {
        //   registerNum: {
        //     req: {
        //       serviceName: "srvsso_online_user_select",
        //       colNames: ["*"],
        //       condition: []
        //     },
        //     api: "sso",
        //     way: "select"
        //   },
        //   currRegNum: {
        //     req: {
        //       serviceName: "srvsso_user_select",
        //       colNames: ["*"],
        //       condition: []
        //     },
        //     api: "sso",
        //     way: "select"
        //   }
        // }
      },
      tabsData: {
        tabs: [
          {
            key: "platMirc",
            value: "微服务",
          },
          {
            key: "platService",
            value: "服务器资源",
          },
        ],
        runTime: "",
      },
      contentData: {
        currentPage: "platMirc",
        firstBar: {
          title: "",
          data: {
            columns: [],
            rows: [],
          },
        },
        secondBar: {
          title: "",
          data: {},
        },
        firstPie: {
          title: "",
          data: {},
        },
        secondPie: {
          title: "",
        },
        platMirc: {
          operation: {},
        },
      },
      ReqTimeOut: {
        RunTimeOut: null,
        dataSizeTimeOut: null,
        dataThree: null,
        dataFour: null,
        dataFive: null,
        dataSix: null,
        dataSeven: null,
        dataEight: null,
        dataNine: null,
        dataTen: null,
        dataEleven: null,
      },
    };
  },
  created () {
    let str = window.location.href;
    let num = str.indexOf("=");
    str = str.substr(num + 1);
    this.titleViewData.currentPage = str;
    this.contentData.currentPage = str;
  },
  mounted () { },
  methods: {
    //测试中心 测试应用数量
    async getData_six () {
      let self = this;
      let req = {
        serviceName: "srvapprc_application_apply_dev_select",
        colNames: [ "*" ],
        condition: [],
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_application_apply_dev_select",
        "apprc"
      );
      let res = await self.axios.post(path, req);
      // this.axios
      if (res.status === 200) {
        this.platMircData.list_cs = res.data.data.length;
        //  this.platMircData.list_sj = res.data.data.length;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },
    //测试中心 上线应用数量
    async getData_seven () {
      let self = this;
      let req = {
        serviceName: "srvapprc_online_apply_dev_select",
        colNames: [ "*" ],
        condition: [
          {
            colName: "proc_status",
            ruleType: "eq",
            value: "完成",
          },
        ],
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_online_apply_dev_select",
        "apprc"
      );
      // this.axios
      let res = await self.axios.post(path, req);
      // this.axios
      if (res.status === 200) {
        this.platMircData.list_cssx = res.data.data.length;

        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },
    //开发中心 工单个数
    async getData_eight () {
      let self = this;
      let req = {
        serviceName: "srvapprc_issue_info_select",
        colNames: [ "*" ],
        condition: [],
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_issue_info_select",
        "apprc"
      );
      // this.axios
      //   .post(path, req)
      //   .then(res => {
      let res = await self.axios.post(path, req);
      if (res.status === 200) {
        this.platMircData.list_kfgd = res.data.data.length;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },
    //开发中心 处理工单个数
    async getData_nine () {
      let self = this;
      let req = {
        serviceName: "srvapprc_issue_info_select",
        colNames: [ "*" ],
        condition: [
          {
            colName: "handle_status",
            ruleType: "eq",
            value: "已完成",
          },
        ],
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_issue_info_select",
        "apprc"
      );
      // this.axios
      //   .post(path, req)
      let res = await self.axios.post(path, req);
      if (res.status === 200) {
        this.platMircData.list_kfcl = res.data.data.length;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },
    //注册中心 应用总数量
    async getData_ten () {
      let self = this;
      let req = {
        serviceName: "srvapprc_issue_info_select",
        colNames: [ "*" ],
        condition: [],
      };
      let path = "http://192.168.0.192:8101/monitor/applications";
      // this.axios
      //   .get(path, req)
      //   .then(res => {
      let res = await self.axios.get(path, req);

      if (res.status === 200) {
        this.platMircData.list_zcyy = res.data.length;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },
    //监控中心 监控应用个数
    async getData_eleven () {
      let self = this;
      let path = "http://192.168.0.192:8101/monitor/applications";
      // this.axios
      //   .get(path)
      let res = await self.axios.get(path);
      if (res.status === 200) {
        this.platMircData.list_jkyygs = res.data.length;

        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },
    //查询APP运行时长
    async operation () {
      let self = this;

      let req = {
        serviceName: "srvlog_apps_onlie_time_select",
        colNames: [ "*" ],
        condition: [],
      };
      let path = this.getServiceUrl(
        "select",
        "srvlog_apps_onlie_time_select",
        "monitor"
      );
      let res = await self.axios.post(path, req);

      if (res.status === 200) {
        let operat1 = res.data.data;
        operat1 = Object.assign(...operat1);
        this.platMircData.operat = operat1;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },

    viewtabs (pageName) {
      this.contentData.currentPage = pageName.key;
    },

    /**定时刷新 */
    dataSizeTimeOut () {
      //查询APP运行时长
      let self = this;
      self.ReqTimeOut.dataSizeTimeOut = new this.timeOut(
        300,
        0,
        self.operation
      );
      self.ReqTimeOut.dataSizeTimeOut.reqFun();
      self.ReqTimeOut.dataSizeTimeOut.startTime();
    },
    dataSix () {
      //测试中心 测试应用数量
      let self = this;
      self.ReqTimeOut.dataSix = new this.timeOut(300, 0, self.getData_six);
      self.ReqTimeOut.dataSix.reqFun();
      self.ReqTimeOut.dataSix.startTime();
    },
    dataSeven () {
      //测试中心 上线应用数量
      let self = this;
      self.ReqTimeOut.dataSeven = new this.timeOut(300, 0, self.getData_seven);
      self.ReqTimeOut.dataSeven.reqFun();
      self.ReqTimeOut.dataSeven.startTime();
    },
    dataEight () {
      //开发中心 工单个数
      let self = this;
      self.ReqTimeOut.dataEight = new this.timeOut(300, 0, self.getData_eight);
      self.ReqTimeOut.dataEight.reqFun();
      self.ReqTimeOut.dataEight.startTime();
    },
    dataNine () {
      //开发中心 处理工单个数
      let self = this;
      self.ReqTimeOut.dataNine = new this.timeOut(300, 0, self.getData_nine);
      self.ReqTimeOut.dataNine.reqFun();
      self.ReqTimeOut.dataNine.startTime();
    },
    dataTen () {
      //注册中心 应用总数量
      let self = this;
      self.ReqTimeOut.dataTen = new this.timeOut(300, 0, self.getData_ten);
      self.ReqTimeOut.dataTen.reqFun();
      self.ReqTimeOut.dataTen.startTime();
    },
    dataEleven () {
      //监控中心 监控应用个数
      let self = this;
      self.ReqTimeOut.dataEleven = new this.timeOut(
        300,
        0,
        self.getData_eleven
      );
      self.ReqTimeOut.dataEleven.reqFun();
      self.ReqTimeOut.dataEleven.startTime();
    },
  },
  created () { },
  mounted () {
    this.dataSizeTimeOut();
    this.dataSix();
    this.dataSeven();
    this.dataEight();
    this.dataNine();
    this.dataTen();
    this.dataEleven();
  },
  destroyed () {
    this.ReqTimeOut.dataSizeTimeOut.endTime();
    this.ReqTimeOut.dataSix.endTime();
    this.ReqTimeOut.dataSeven.endTime();
    this.ReqTimeOut.dataEight.endTime();
    this.ReqTimeOut.dataNine.endTime();
    this.ReqTimeOut.dataTen.endTime();
    this.ReqTimeOut.dataEleven.endTime();
  },
};
</script>

<style scoped lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}
.wrap_view {
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
        min-width: 150px;
        font-weight: 600;
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
        margin-right: 5px;
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
      height: 25px;
      .header_cen {
        font-size: 20px;
        margin-right: 0%;
        line-height: 25px;
        h3 {
          font-weight: 100;
        }
      }
      .header_system {
        width: 34%;
        justify-content: flex-end;
        line-height: 25px;
        .currentId {
          margin: 0 0.6rem;
        }
      }
    }
  }
  .main {
    height: 100%;
    background: url("../assets/images/wrapper-bg01.png");
    background-size: 100% 100%;
    .main_top {
      display: flex;
      width: 30%;
      margin: 0 50px;
      .top_header_item {
        color: white;
        text-align: center;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        text-align: left;
        margin: 10px 25px 0 0;
      }
      .tabbtn {
        color: #0084ff;
        cursor: pointer;
      }
      .tabactive {
        border-bottom: 3px solid #007aff;
      }
    }
  }
  @media screen and (max-width: 1366px) {
    .main {
      padding-bottom: 15px;
    }
  }
}
</style>