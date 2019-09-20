/* eslint-disable */
<template>
  <div class="wrap_view">
    <div class="header">
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
    </div>
    <div class="main">
      <div class="main_top">
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
      </div>
      <component :is="showComponent"></component>
      <!-- <plat-mirc></plat-mirc> -->
      <!-- <plat-serve></plat-serve> -->
    </div>
  </div>
</template>
<script>
let moment = require("moment");

import platMirc from "../components/platformMirc";
import platServe from "../components/platformServe";
export default {
  name: "platform",
  components: { platMirc, platServe },
  data() {
    return {
      date: null,
      showComponent: platMirc,
      tabsShow: 1,
      user: {
        user_no: ""
      },
      list_useno: "",
      regNum: ""

      // microSer: [
      //   {
      //     staLabel: "实例状态:",
      //     begLabel: "请求:",
      //     name: "一卡通就诊",
      //     status: "6/5",
      //     beg: "23586"
      //   },
      //   { staLabel: "", begLabel: "", name: "电子病历", status: "", beg: "" },
      //   { staLabel: "", begLabel: "", name: "微服务1", status: "", beg: "" },
      //   { staLabel: "", begLabel: "", name: "微服务2", status: "", beg: "" },
      //   { staLabel: "", begLabel: "", name: "微服务3", status: "", beg: "" },
      //   { staLabel: "", begLabel: "", name: "微服务4", status: "", beg: "" },
      //   { staLabel: "", begLabel: "", name: "微服务5", status: "", beg: "" },
      //   { staLabel: "", begLabel: "", name: "微服务6", status: "", beg: "" },
      //   { staLabel: "", begLabel: "", name: "微服务7", status: "", beg: "" },
      //   { staLabel: "", begLabel: "", name: "微服务8", status: "", beg: "" },
      //   { staLabel: "", begLabel: "", name: "微服务9", status: "", beg: "" },
      //   { staLabel: "", begLabel: "", name: "更多", status: "", beg: "" }
      // ]
    };
  },
  mounted() {
    this.init(),
      // this.autoChangeTab(10000)
      setInterval(() => {
        this.date = moment().format("YYYY-MM-DD  HH:mm:ss");
      }, 1000);
  },
  methods: {
    //转换数字
    convert(num) {
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
    period(num) {
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
    toIndex(num) {
      if (num === "1") {
        sessionStorage.clear();
        window.location.href = "/main/login_pages/login-fw.html";
        // this.$router.push({ name: "login" });
      }
      if (num === "2") {
        this.$router.push({ name: "navs" });
      }
    },
    init() { },
    changeTab(num) {
      this.tabsShow = num;
      if (this.tabsShow == 1) {
        this.showComponent = platMirc;
      } else if (this.tabsShow == 2) {
        this.showComponent = platServe;
      }
    },
    autoChangeTab(interval) {
      setInterval(() => {
        if (this.tabsShow >= 2) {
          this.tabsShow = 1;
          this.tabsShow++;
        } else {
          this.tabsShow++;
        }
        this.changeTab(this.tabsShow);
      }, interval);
    },
    toManangerment() {
      let str = window.location.href;
      let num = str.indexOf("?");
      str = str.substr(num + 1);
      // console.log(str);
      window.location.href = "../../main/index.html?" + str;
    },
    // toSecplat() {
    //   this.$router.push("/secplat");
    // }

    //当前用户数
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
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {},
  created() {
    let user = sessionStorage.getItem("current_login_user");
    this.user = JSON.parse(user);
    // this.user = top.user.user_no;
    // this.getData_userno();
    // this.CurrRegNum();
  }
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