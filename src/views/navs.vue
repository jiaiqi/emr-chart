<template>
  <div class="nav">
    <div class="header">
      <div class="left"></div>
      <div class="right">
        欢迎您:{{
          userInfo !== null &&
          userInfo !== undefined &&
          userInfo.user_disp !== undefined &&
          userInfo.user_disp !== null
            ? userInfo.user_disp
            : "未登录"
        }}
      </div>
    </div>
    <div class="header-title" v-if="classObjects.length > 0">
      延安市社保医疗一体化服务平台
    </div>

    <div class="carousel-view">
      <div class="slide-view">
        <div
          :class="
            item.isShow
              ? 'carousel-3d-slide  none-show'
              : 'carousel-3d-slide none-show'
          "
          v-for="(item, index) in classObjects"
          :key="index"
          @click.stop="mainforward(item.class_no, item.url, item.isShow)"
        >
          <!-- <dv-loading v-if="!item.isShow">加载中...</dv-loading> -->
          <img class="app-icon" :src="item.app_icon" alt />
          <div class="title-text">{{ item.class_name }}</div>
        </div>
      </div>

      <dv-decoration-9
        style="width:100%;height:100px;z-index:1;"
        v-if="classObjects.length > 0"
      ></dv-decoration-9>
    </div>
    <div class="footer">
      <div id="clock">
        <div class="date">{{ date }}</div>
        <div class="time">{{ time }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import platform from "../assets/images/xietongbangong.png";
import onecard from "../assets/images/yikatong.png";
import datacenter from "../assets/images/shujuzhongxin.png";

export default {
  name: "Navs",
  data() {
    return {
      time: "",
      date: "",
      userInfo: Object,
      saveAccount: false,
      message: "页面加载于 " + new Date().toLocaleString(),
      classObject: [
        {
          class_name: "协同平台",
          app_icon: platform,
          guide_page: 1,
          class_no: "platform",
          url: "/chart/#/platform",
          isShow: false
        },
        {
          class_name: "一卡通就诊",
          app_icon: onecard,
          guide_page: 2,
          class_no: "onecard",
          url: "/chart/#/onecard",
          isShow: false
        },
        {
          class_name: "数据中心",
          app_icon: datacenter,
          guide_page: 3,
          class_no: "datacenter",
          url: "/chart/#/datacenter",
          isShow: false
        }
      ],
      classObjects: [],
      menuData: [
        {
          app_name: "用户中心",
          app_icon: "images/appicon/menhu.png",
          app_seq: 1,
          guide_page: "/emr/#/platform",
          app_no: "sso",
          class_no: "platform",
          class_name: "协同平台"
        },
        {
          app_name: "授权中心",
          app_icon: "images/appicon/peixun.png",
          app_seq: 2,
          guide_page: "/emr/#/platform",
          app_no: "auth",
          class_no: "platform",
          class_name: "协同平台"
        },
        {
          app_name: "一卡通",
          app_icon: "images/appicon/caiwu.png",
          app_seq: 3,
          guide_page: "/chart/#/onecard",
          app_no: "cvs",
          class_no: "onecard",
          class_name: "一卡通"
        },
        {
          app_name: "任务调度",
          app_icon: "images/appicon/peixun.png",
          app_seq: 3,
          guide_page: "/emr/#/platform",
          app_no: "task",
          class_no: "platform",
          class_name: "协同平台"
        }
      ]
    };
  },
  created() {
    this.gopages();
    let user = sessionStorage.getItem("current_login_user");
    top.user = JSON.parse(user);
    console.log("top.user", top.user);
    this.userInfo = top.user;
    console.log("top.window.user", top.window.user);
  },
  updated() {},
  mounted() {
    let self = this;
    let account = localStorage.getItem("account");
    if (account) {
      account = JSON.parse(account);
      console.log(account);
      if (account.userName && account.pwd) {
        this.userName = account.userName;
        this.pwd = account.pwd;
      }
    }
    self.clock = setInterval(self.updateTime, 1000);
    this.updateClock();
  },
  methods: {
    gopages: function() {
      var path = this.getServiceUrl(
        "select",
        "srvauth_user_app_menu_select",
        "auth"
      );
      var bxReq = {};
      bxReq.serviceName = "srvauth_user_app_menu_select";
      bxReq.colNames = ["*"];
      axios.post(path, bxReq).then(res => {
        console.log(res);
        if (res.data.data != undefined && res.data.data.length > 0) {
          let valData = res.data.data;
          console.log("console: updated -> valData", valData);
          this.getMenuData(valData);
        } else {
          // this.getMenuData(this.menuData)
          // alert("无权限访问");
          if (top.pathConfig) {
            window.location.href = "/main/login_pages/login-fw.html";
          }
          // else {
          //   this.$router.push({ name: 'login' })
          // }
        }
      });
      // 	TODO: 添加 bx_auth_ticket header
      function mainforward(appclass, guide_page) {
        window.location.href = guide_page + "?app_class=" + appclass;
      }
    },
    getMenuData(e) {
      let data = e;
      console.log(data);
      let cl = this.classObject;
      for (let i = 0; i < cl.length; i++) {
        let menuList = [];
        for (let j = 0; j < data.length; j++) {
          if (cl[i].class_no === data[j].class_no) {
            menuList.push(data[j]);
            cl[i].url = data[j].guide_page;
          } else {
          }
        }
        if (menuList.length > 0) {
          cl[i].isShow = true;
        } else {
          cl[i].isShow = false;
          cl[i].class_name = "无权限";
        }
      }
      this.classObjects = cl;
      // this.classObject = cl;
      console.log(cl);
      sessionStorage.setItem("app_menu_class", cl);
      return this.classObject;
    },

    mainforward(appclass, guide_page, isShow) {
      let login_flag = sessionStorage.getItem("need_login_flag");
      if (login_flag === "need_login" && top.pathConfig) {
        window.location.href = "/main/login_pages/login-fw.html";
      } else {
        if (isShow) {
          window.location.href = guide_page + "?app_class=" + appclass;
        } else {
          alert("您无权访问");
        }
      }
    },
    getClassAuth(classNo) {
      let list = this.menuData;
    },
    updateTime() {
      function zeroPadding(num, digit) {
        var zero = "";
        for (var i = 0; i < digit; i++) {
          zero += "0";
        }
        return (zero + num).slice(-digit);
      }
      var cd = new Date();
      var week = [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      this.time =
        zeroPadding(cd.getHours(), 2) +
        ":" +
        zeroPadding(cd.getMinutes(), 2) +
        ":" +
        zeroPadding(cd.getSeconds(), 2);
      this.date =
        zeroPadding(cd.getFullYear(), 4) +
        "-" +
        zeroPadding(cd.getMonth() + 1, 2) +
        "-" +
        zeroPadding(cd.getDate(), 2) +
        " " +
        week[cd.getDay()];
    },
    updateClock() {}
  }
};
</script>

<style lang="scss" scoped>
html,
body {
  height: 100%;
  margin: 0;
  /* padding: 2rem; */
}
.nav {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-image: url("../assets/images/bg1.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
.carousel-view {
  display: flex;
  width: 60%;
  // height: calc(100% - 400px);
  flex-direction: column;
  // flex-direction: column;
  // padding-bottom: 5rem;
  justify-content: center;
  .slide-view {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding-bottom: 4rem;
    justify-content: space-between;
    align-items: center;
    /* background-image: url('./images/bg1.png'); */
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    // .none-show{
    //   ba
    // }
    perspective: 1000px;
    -webkit-perspective: 1000px;
    .carousel-3d-slide.none-show {
      width: 22rem;
      height: 28.5vh;
      border: 1px solid rgb(4, 116, 180);
      background-color: rgb(12, 165, 253);
      /* margin: 200px 500px; */
      // transform-style: preserve-3d;
      // transition: all 0.5s ease;
      // -webkit-transform-style: preserve-3d;
      // -webkit-transition: all 0.5s ease;

      -webkit-box-reflect: below 10px -webkit-linear-gradient(top, rgba(
              0,
              0,
              0,
              0
            )
            50%, rgba(0, 0, 0, 0.5) 100%);
      display: flex;
      flex-direction: column;
      /* align-content: flex-end ; */
      justify-content: center;
      padding: 0.5rem;
      .title-text {
        font-size: 1.5rem;
        color: aqua;
        text-align: center;
      }
      &:last-child {
        width: 25rem;
        height: 29vh;
        transform-origin: left;
        margin-left: 1rem;
        // transform-style: preserve-3d;
        -webkit-transform: scale3d(1.9, 0, 0); /*兼容谷歌浏览器*/
        transform: rotateY(-50deg);
        -webkit-transform: rotateY(-50deg); /* Safari 和 Chrome */
        -moz-transform: rotateY(-50deg); /* Firefox */
      }
      &:first-child {
        height: 29vh;
        width: 25rem;
        transform-origin: right;
        margin-right: 1rem;
        // transform-style: preserve-3d;
        -webkit-transform: scale3d(1.9, 0, 0); /*兼容谷歌浏览器*/
        transform: rotateY(50deg);
        -webkit-transform: rotateY(50deg); /* Safari 和 Chrome */
        -moz-transform: rotateY(50deg); /* Firefox */
      }
      &:hover {
        // transform-style: preserve-3d;
        // transition: all 0.1s ease;
        // -webkit-transform-style: preserve-3d;
        // -webkit-transition: all 0.1s ease;
        background-color: #27c8fd;
        // border: 2px solid #fff;
        .title-text {
          font-size: 1.7rem;
          color: rgb(255, 255, 255);
        }
      }
      .app-icon {
        padding-bottom: 1rem;
        width: 10vw;
        height: auto;
        margin: 0 auto;
        // object-fit: fill;
        // height: 13rem;
        /* box-shadow: 10px 10px 5px #016cb3; */
      }
    }
  }
}
.header {
  color: #fff;
  background-color: rgba(10, 135, 252, 0.3);
  display: flex;
  line-height: 2rem;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  .left {
  }
  .right {
    margin-right: 2rem;
  }
}
.header-title {
  font-size: 2.2rem;
  color: rgb(127, 197, 255);
  &:hover {
    color: #fff;
    -webkit-animation: Glow 1.5s ease infinite alternate;
    animation: Glow 1.5s ease infinite alternate;
  }
}
.footer {
  // line-height: 2rem;
  height: 4rem;
  color: #fff;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  .left {
  }
  .right {
  }
  #clock {
    color: #ffffff;
    text-align: center;
    position: absolute;
    left: 50%;
    bottom: 0;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    color: #daf6ff;
    text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
  }
  #clock .time {
    letter-spacing: 0.05em;
    font-size: 1.2rem;
    padding: 5px 0;
  }
  #clock .date {
    letter-spacing: 0.1em;
    font-size: 1rem;
    line-height: 1rem;
  }
  #clock .text {
    letter-spacing: 0.1em;
    font-size: 1rem;
    padding: 2px 0 0;
  }
}
</style>
