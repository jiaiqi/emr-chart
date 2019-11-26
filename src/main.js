import Vue from "vue";
import axios from "axios";
import VCharts from "v-charts";
import VueAwesomeSwiper from "vue-awesome-swiper";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueInit from "@/assets/dev_config/vue_init";
import VueUtil from "@/assets/dev_config/vue_util";
import DataUtil from "@/assets/common/data_util";
import { vChartInfo } from "@/assets/common/common";
import elementUI from "element-ui";
import echarts from "echarts";
import dataV from "@jiaminghi/data-view";
import "font-awesome/css/font-awesome.css";
import "element-ui/lib/theme-chalk/index.css";
// import cookie from "vue-cookie";

Vue.config.productionTip = false;

Vue.use(VueAwesomeSwiper);
Vue.use(elementUI);
Vue.use(VCharts);
Vue.use(dataV);
VueInit();
VueUtil();
DataUtil();

// Vue.prototype.$cookie = cookie; //cookie
Vue.prototype.$echarts = echarts; //将echarts存到Vue原型中
Vue.prototype.vChartInfo = vChartInfo; // 挂载 vChartInfo 到vue.proto对象上原型属性
// 封装axios
Vue.prototype.axios = axios; // 将axios挂载到vue原型
axios.defaults.retry = 3; // 设置请求超时后重新发起请求的次数
axios.defaults.retryDelay = 5000; // 设置超时时间（毫秒）
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    let bx_auth_ticket = sessionStorage.getItem("bx_auth_ticket");
    if (bx_auth_ticket) {
      config.headers["bx_auth_ticket"] = bx_auth_ticket;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    // let self  =this
    // 对响应数据做处理
    if (response.data.state == "FAILURE") {
      if (response.data.resultCode == "0011") {
        sessionStorage.setItem("need_login_flag", "need_login");
        sessionStorage.setItem("isLogin", "false");

        // 需要登录访问
        // if (sessionStorage.getItem("need_login_flag") != "need_login") {
        //   sessionStorage.setItem("need_login_flag", "need_login");
        //   sessionStorage.setItem("isLogin", "false");
        //   this.$message({
        //     message: res.data.resultMessage,
        //     center: true,
        //     type: "error"
        //   });
        //   // 跳转到登录页面
        // }
        window.location.href = "/main/login_pages/login-fw.html";
      } else if (response.data.resultCode == "0000") {
        if (sessionStorage.getItem("need_login_flag") != "need_login") {
          this.$message({
            message: res.data.resultMessage,
            center: true,
            type: "error"
          });
        }
      } else {
        if (sessionStorage.getItem("need_login_flag") != "need_login") {
          this.$message({
            message: res.data.resultMessage,
            center: true,
            type: "error"
          });
        }
      }
    }
    return response;
  },
  error => {
    // 对响应错误做处理
    let config = error.config;
    // 判断是否配置了重试
    if (!config || !config.retry) return Promise.reject(error);
    if (!config.shouldRetry || typeof config.shouldRetry != "function") {
      return Promise.reject(error);
    }
    //判断是否满足重试条件
    if (!config.shouldRetry(error)) {
      return Promise.reject(error);
    }
    // 设置重置次数，默认为0
    config.__retryCount = config.__retryCount || 0;
    // 判断是否超过了重试次数
    if (config.__retryCount >= config.retry) {
      return Promise.reject(error);
    }
    //重试次数自增
    config.__retryCount += 1;
    //延时处理
    let backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, config.retryDelay || 1);
    });
    //重新发起axios请求
    return backoff.then(function() {
      return axios(config);
    });
  }
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
