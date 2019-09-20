import Vue from 'vue';
import axios from 'axios';
import VCharts from 'v-charts';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import App from './App.vue';
import router from './router';
import store from './store';
import VueInit from '@/assets/dev_config/vue_init';
import VueUtil from '@/assets/dev_config/vue_util';
import elementUI from 'element-ui';
import dataV from '@jiaminghi/data-view'
import 'font-awesome/css/font-awesome.css'
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false;

Vue.use(VueAwesomeSwiper);
Vue.use(elementUI)
Vue.use(VCharts);
Vue.use(dataV)
VueInit();
VueUtil();

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

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');