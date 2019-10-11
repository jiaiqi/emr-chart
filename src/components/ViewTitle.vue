<template>
  <div class="view_title">
    <div class="title_left">
      <div v-if="titleViewData.currentPage === 'platform'||'secplat'" class="header_left">
        <div class="platform_title">
          <span>当前用户数:</span>
          <span>{{list_useno}}</span>
        </div>
        <div>
          <span>注册用户数:</span>
          <span>{{regNum}}</span>
        </div>
      </div>
    </div>
    <div class="title_center">{{titleViewData.title}}</div>
    <div class="title_right">
      <div class="date_time">{{ date }}</div>
      <div class="account_info">
        <span>当前帐号:</span>
        <span class="user_no">{{user !== null && user.user_no !== null ? user.user_no:'-'}}</span>
      </div>
      <div class="btn_logout long_btn" @click="toManangerment">管理入口</div>
      <div @click="toIndex('1')" class="btn_logout">注销</div>
      <div @click="toIndex('2')" class="btn_logout">返回</div>
    </div>
  </div>
</template>

<script>
let moment = require("moment");
export default {
  name: "ViewTitle",
  props: {
    titleViewData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      key: "",
      regNum: "",
      date: "",
      list_useno: "",
      user: {
        user_no: ""
      },
      regNumTimeOut: null,
      usernoTimeOut: null
    };
  },
  methods: {
    name() { },
    toIndex(num) {
      if (num === "1") {
        sessionStorage.clear();
        window.location.href = "/main/login_pages/login-fw.html";
        // this.$router.push({ name: "login" });
      }
      if (num === "2") {
        if (this.titleViewData.currentPage === "secplat") {
          this.$router.push({ name: "platform" });
        } else {
          this.$router.push({ name: "navs" });
        }
      }
    },
    toManangerment() {
      let str = window.location.href;
      let num = str.indexOf("?");
      str = str.substr(num + 1);
      window.location.href = "../../main/index.html?" + str;
    },
    async RegNum() {
      let self = this;
      let req = {
        serviceName: "srvsso_online_user_select",
        colNames: ["*"],
        condition: []
      };
      let path = self.getServiceUrl(
        "select",
        "srvsso_online_user_select",
        "sso"
      );
      let res = await self.axios.post(path, req);
      if (res.status === 200) {
        self.regNum = res.data.data[0].number_of_online_users;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // self.axios
      //   .post(path, req)
      //   .then(res => {
      //     console.log(res)
      //     self.regNum = res.data.data[0].number_of_online_users;
      //     self.getData_userno();
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    async getData_userno() {
      let self = this;
      let req = {
        serviceName: "srvsso_user_select",
        colNames: ["*"],
        condition: []
      };
      let path = self.getServiceUrl("select", "srvsso_user_select", "sso");
      let res = await self.axios.post(path, req);
      if (res.status === 200) {
        self.list_useno = res.data.data.length;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      self.axios
        .post(path, req)
        .then(res => {
          self.list_useno = res.data.data.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    regNumTimeOuts() {
      let self = this;
      self.regNumTimeOut = new this.timeOut(30, 0, self.RegNum);
      self.regNumTimeOut.reqFun();
      self.regNumTimeOut.startTime();
    },
    usernoTimeOuts() {
      let self = this;
      self.usernoTimeOut = new this.timeOut(30, 0, self.getData_userno);
      self.usernoTimeOut.reqFun();
      self.usernoTimeOut.startTime();
    }
  },
  mounted() {
    this.regNumTimeOuts();
    this.usernoTimeOuts();
    setInterval(() => {
      this.date = moment().format("YYYY-MM-DD  HH:mm:ss");
    }, 1000);
    sessionStorage.setItem("title", this.titleViewData.title);
  },
  created() {
    let user = sessionStorage.getItem("current_login_user");
    this.user = JSON.parse(user);
    if (this.titleViewData.currentPage === "platform" || "secplat") {
      this.RegNum();
    }
  },
  watch: {
    // titleViewData: {
    //   handler: function(newValue, oldValue) {
    //     // console.log("TitleData:", newValue)
    //     return newValue;
    //   },
    //   deep: true //对象内部的属性监听，即深度监听
    // }
  }
};
</script>

<style lang="scss" scoped>
// 字体大小长度宽度均用rem
// 1080p下html的font-size为16px,768p下html的font-size为12px
.view_title {
  width: 95%;
  margin: 0 auto;
  height: 2.5rem /* 40/16 */;
  display: flex;
  .title_left {
    flex: 1.3;
    display: flex;
    align-items: center;
    .header_left {
      display: flex;
      flex: 0.4;
      align-items: center;
      justify-content: space-between;
    }
  }
  .title_center {
    flex: 1;
    text-align: center;
    color: #007aff;
    font-size: 1.5rem; /* 24/16 */
    line-height: 2.5rem; /* 40/16 */
  }
  .title_right {
    flex: 1.3;
    display: flex;
    justify-content: flex-end;
    line-height: 2.5rem; /* 40/16 */
    .date_time {
      min-width: 200px;
      text-align: center;
    }
    .account_info {
      .user_no {
        display: inline-block;
        min-width: 5rem; /* 80/16 */
      }
      @media screen and (max-width: 1366px) {
        min-width: 3rem;
      }
    }
    .btn_logout {
      // min-width: 3.75rem /* 60/16 */;
      padding: 0 0.625rem; /* 10/16 */
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: #0063b1;
      }
    }
  }
  @media screen and (max-width: 1366px) {
    .title_right {
      .date_time {
        min-width: 150px;
      }
    }
  }
}
@media screen and (max-width: 1366px) {
}
</style>