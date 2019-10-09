import Vue from 'vue';
import axios from 'axios';
import VCharts from 'v-charts';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import App from './App.vue';
import router from './router';
import store from './store';
import VueInit from '@/assets/dev_config/vue_init';
import VueUtil from '@/assets/dev_config/vue_util';
import DataUtil from '@/assets/common/data_util'
import {vChartInfo} from '@/assets/common/common';
import elementUI from 'element-ui';
import dataV from '@jiaminghi/data-view'
import 'font-awesome/css/font-awesome.css'
import 'element-ui/lib/theme-chalk/index.css';
import cookie from 'vue-cookie'
Vue.config.productionTip = false;

Vue.use(VueAwesomeSwiper);
Vue.use(elementUI)
Vue.use(VCharts);
Vue.use(dataV)
VueInit();
VueUtil();
DataUtil()

Vue.prototype.$cookie = cookie;  //cookie
Vue.prototype.vChartInfo = vChartInfo; // 挂载 vChartInfo 到vue.proto对象上原型属性
Vue.prototype.axios = axios; // 挂载axios到vue.proto对象上原型属性
axios.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  let bx_auth_ticket = sessionStorage.getItem("bx_auth_ticket");
  if (bx_auth_ticket) {
    config.headers["bx_auth_ticket"] = bx_auth_ticket;
  }
  return config;
}, error => {
  // 对请求错误做些什么
  Promise.reject(error)
});
axios.interceptors.response.use(response => {
  // Do something before response is sent
  if (response.data.state == "FAILURE") {
    if (response.data.resultCode == '0011') {
      if (sessionStorage.getItem("need_login_flag") != "need_login") {
        sessionStorage.setItem("need_login_flag", "need_login");
        window.location.href = "/main/login_pages/login-fw.html"
      }
    } else if (response.data.resultCode == '0000') {
      if (sessionStorage.getItem("need_login_flag") != "need_login") {
        alert(response.data.resultMessage);
      }
    } else {
      if (sessionStorage.getItem("need_login_flag") != "need_login") {
        alert(response.data.resultMessage);
      }
    }
  } else if (response.data.state == "SUCCESS") {
    if (response.data.response) {
      let resp = response.data.response[0]
      let bx_auth_ticket = response.data.response[0].response.bx_auth_ticket
      sessionStorage.setItem("bx_auth_ticket", bx_auth_ticket)
      let current_login_user = resp.response.login_user_info;
      sessionStorage.setItem("current_login_user", JSON.stringify(current_login_user))
      top.user = current_login_user;
    }
  }
  return response;
}, error => {
  // Do something with response error
  return Promise.reject(error);
});

/**
 * 定时重复发送请求
 * @params t: 时间间隔
 * @params out: 倒计时
 * @params fun:请求数据的函数，必须是一个返回true/false的函数
 */
Vue.prototype.timeOut =  function(t,out,fun){
  fun()
  this.time = t   // 定时间隔 秒
  this.nTime = out  // 计时 秒
  this.isLoad = false   // 请求是否成功有效
  this.eNum = 0 // 请求失败次数
  this.reqFun = function(e){
    let s = fun
    let http = s(e)
    // fun() 请求方法 处理数据和业务逻辑
    // $http 处理 发请求机制，多久发，
    if(http){
      this.isLoad = true
      this.nTime = 0
      this.eNum = 0
      this.startTime()
      // this.timeOut(10,0)
    }else{
      this.isLoad = false
      if(this.eNum < 3){
      this.nTime = 0
        this.eNum++
        this.startTime()
      }
    }
  }
  this.startTime = function(){
    if(this.eNum < 3 && this.nTime === this.time) {
      this.reqFun(this.nTime)
    }else if(this.eNum === 3){
      return false
    }else{
      let bTimeout = setTimeout(()=>{
        this.nTime ++
        console.log('---------',this.nTime)
        this.startTime()
      },1000)
    }
  }
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');