<template>
  <div class="content-view">
    <div class="enter_wrap">
      <div class="enter">
        <span></span>
      </div>
    </div>

    <div class="main">
      <div class="main_top">
        <div class="main_top_p">
          <div class="plan-view">
            <span>累计运行时长</span>
            <span>{{menuData.gateway && secondToTime(menuData.gateway.total_time)}}</span>
          </div>
          <!-- <div class="plan-view">
            <span>持续运行时长</span>
            <span>{{secondToTime(centerData.operat.GATEWAY)}}</span>
          </div>-->

          <div>API网关</div>
          <div class="plan-view">
            <span>请求次数</span>
            <span>{{sumApi?convert(sumApi):0}}</span>
          </div>
        </div>
      </div>
      <div class="main_cen">
        <div class="main_cen_left">
          <dv-border-box-10>
            <ul>
              <li>
                <div>用户中心</div>
                <div>
                  <span>在线用户:</span>
                  <span>{{menuData.sso && menuData.sso.online_user_num?convert(menuData.sso.online_user_num):0}}</span>
                  <!-- <span>持续运行时长:</span> -->
                  <!-- <span>{{secondToTime(centerData.operat.SSO)}}</span> -->
                </div>
                <div>
                  <span>用户总数:</span>
                  <!-- <span>{{centerData.list_userno?convert(centerData.list_userno):0}}</span> -->
                  <span>{{menuData.sso && menuData.sso.total_user_num?convert(menuData.sso.total_user_num):0}}</span>
                </div>
              </li>
              <li>
                <div>授权中心</div>
                <div>
                  <span>累计请求次数:</span>
                  <!-- <span>{{secondToTime(centerData.operat.AUTH)}}</span> -->
                  <span>{{menuData.auth && menuData.auth.total_times?convert(menuData.auth.total_times):0}}</span>
                </div>
                <div>
                  <span>当日请求次数:</span>
                  <!-- <span>{{convert(regNum[0].num_of_calls)?convert(regNum[0].num_of_calls):0}}</span> -->
                  <span>{{menuData.auth && menuData.auth.today_times?convert(menuData.auth.today_times):0}}</span>
                  <!-- convert(centerData.regNum[0].num_of_calls) -->
                </div>
              </li>

              <li>
                <div>注册中心</div>
                <div>
                  <span>应用总数量:</span>
                  <span>{{centerData.list_zcyy?convert(centerData.list_zcyy):0}}</span>
                  <!-- <span>{{menuData.accredit.label_one_value}}</span> -->
                </div>
              </li>

              <li>
                <div>配置中心</div>
                <div>
                  <span>累计请求次数:</span>
                  <span>{{menuData.config && menuData.config.total_times?convert(menuData.config.total_times):0}}</span>
                </div>
                <div>
                  <span>当日请求次数:</span>
                  <!-- <span>{{convert(regNum[1].num_of_calls)?convert(regNum[1].num_of_calls):0}}</span> -->
                  <span>{{menuData.config && menuData.config.today_times?convert(menuData.config.today_times):0}}</span>
                </div>
              </li>
            </ul>
          </dv-border-box-10>
        </div>
        <div class="main_cen_cen">
          <div class="main_cen_cen_top">
            <ul>
              <li @click="toSecplat(item)" v-for="(item,index) in microSer" :key="index">
                <p class="title">{{item ? item.app_name:0 }}</p>
                <div>
                  <span>累计运行时长</span>
                  <span>{{ secondToTime(item.grand_time)}}</span>
                </div>
                <div>
                  <span>请求次数</span>
                  <span>{{convert(item.ask_num)}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="main_bot">
            <dv-border-box-10>
              <ul>
                <li>
                  <div class="task">
                    <span>任务管理</span>
                  </div>
                  <div>
                    <div>
                      <span>执行任务次数</span>
                      <!-- <span>{{secondToTime(centerData.operat.TASK)}}</span> -->
                      <span>{{menuData.task && menuData.task.exe_num?convert(menuData.task.exe_num):0}}</span>
                    </div>
                    <div>
                      <span>任务个数</span>
                      <!-- <span>{{centerData.list_rw?convert(centerData.list_rw):0}}</span> -->
                      <span>{{menuData.task && menuData.task.total_num?convert(menuData.task.total_num):0}}</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="task">
                    <span>事件管理</span>
                  </div>
                  <div>
                    <div>
                      <span>事件注册数</span>
                      <!-- <span>{{secondToTime(centerData.operat.EVENT)}}</span> -->
                      <span>{{menuData.event && menuData.event.reg_num?convert(menuData.event.reg_num):0}}</span>
                    </div>
                    <div>
                      <span>事件订阅数</span>
                      <!-- <span>{{centerData.list_sj?convert(centerData.list_sj):0}}</span> -->
                      <span>{{menuData.event && menuData.event.sub_num?convert(menuData.event.sub_num):0}}</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="task">
                    <span>文件管理</span>
                  </div>
                  <div>
                    <div>
                      <span>文件总容量</span>
                      <!-- <span>{{secondToTime(centerData.operat.FILE)}}</span> -->
                      <span>{{menuData.file && menuData.file.file_size?capacity(menuData.file.file_size):0}}</span>
                    </div>
                    <div>
                      <span>文件总数量</span>
                      <!-- <span>{{centerData.listpz?convert(centerData.listpz):0}}</span> -->
                      <span>{{menuData.file && menuData.file.file_num?convert(menuData.file.file_num):0}}</span>
                    </div>
                  </div>
                </li>

                <!-- <li>
                  <div class="task">
                    <span>缓存管理</span>
                  </div>
                  <div>
                    <div>
                      <span>应用命中率</span>
                      <span>{{mean==NaN || mean==null || mean=="NaN"?(0+"%"):( mean.toFixed(1) +"%")}}</span>
                    </div>
                    <div>
                      <span>内存使用率</span>
                      <span>{{memoryMean==NaN ||memoryMean==null || memoryMean=="NaN"?(0+"%"):(memoryMean.toFixed(1)+"%")}}</span>
                    </div>
                  </div>
                </li>-->
              </ul>
            </dv-border-box-10>
          </div>
        </div>
        <div class="main_cen_left">
          <dv-border-box-10>
            <ul>
              <!--  -->
              <li>
                <div>监控中心</div>
                <div>
                  <span>异常应用个数:</span>
                  <span>{{0}}</span>
                  <!-- <span>{{menuData.supervisory.label_one_value}}</span> -->
                </div>
                <div>
                  <span>监控应用个数:</span>
                  <span>{{centerData.list_jkyygs?convert(centerData.list_jkyygs):0}}</span>
                  <!-- <span>{{menuData.supervisory.label_two_value}}</span> -->
                </div>
              </li>
              <li>
                <div>开发中心</div>
                <div>
                  <span>工单个数:</span>
                  <span>{{centerData.list_kfgd?convert(centerData.list_kfgd):0}}</span>
                  <!-- <span>{{menuData.exploit.label_one_value}}</span> -->
                </div>
                <div>
                  <span>处理工单数量:</span>
                  <span>{{centerData.list_kfcl? convert(centerData.list_kfcl) :0}}</span>
                  <!-- <span>{{menuData.exploit.label_two_value}}</span> -->
                </div>
              </li>

              <li>
                <div>测试中心</div>
                <div>
                  <span>测试应用数量:</span>
                  <span>{{centerData.list_cs?convert(centerData.list_cs):0}}</span>
                  <!-- <span>{{menuData.measure.label_one_value}}</span> -->
                </div>
                <div>
                  <span>上线应用数量:</span>
                  <span>{{centerData.list_cssx ?convert(centerData.list_cssx) :0}}</span>
                  <!-- <span>{{menuData.measure.label_two_value}}</span> -->
                </div>
              </li>

              <li>
                <div>日志中心</div>
                <div>
                  <span>日志总数:</span>
                  <!-- <span>{{secondToTime(centerData.operat.LOG)}}</span> -->
                  <span>{{menuData.log && menuData.log.total_times?convert(menuData.log.total_times):0}}</span>
                </div>
                <div>
                  <span>当日日志数:</span>
                  <!-- <span>{{centerData.logNum?secondToTime(centerData.logNum):0}}</span> -->
                  <span>{{menuData.log && menuData.log.today_times?convert(menuData.log.today_times):0}}</span>
                </div>
              </li>
              <!--  -->
            </ul>
          </dv-border-box-10>
        </div>
      </div>
    </div>
  </div>
</template> 

<script>
import { setInterval } from "timers";
let moment = require("moment");
export default {
  props: ["platMirc"],
  data() {
    return {
      ReqTimeOuts: {
        RunTimeOuts: null,
        TimeOutMethitems: null,
        RunTimeOutsSer: null,
      },
      menuData: {
        // 用户
        // users: {
        //   label_one_value: "11",
        //   label_two_value: "17",
        // },
        // accredit: {
        //   // 授权
        //   label_one_value: "1111",
        //   label_two_value: "100",
        // },
        // reg: {
        //   // 注册
        //   label_one_value: "15",
        // },
        // config: {
        //   // 配置
        //   label_one_value: "150",
        //   label_two_value: "100",
        // },
        // supervisory: {
        //   //监控
        //   label_one_value: "30",
        //   label_two_value: "15",
        // },
        // exploit: {
        //   //开发
        //   label_one_value: "9",
        //   label_two_value: "1",
        // },
        // measure: {
        //   // 测试
        //   label_one_value: "5",
        //   label_two_value: "2",
        // },
        // journal: {
        //   // 日志
        //   label_one_value: "10",
        //   label_two_value: "5",
        // },
        // task: {
        //   // 任务
        //   label_one_value: "1000",
        //   label_two_value: "15",
        // },
        // affair: {
        //   // 事件
        //   label_one_value: "100",
        //   label_two_value: "25",
        // },
        // paper: {
        //   // 文件
        //   label_one_value: "100",
        //   label_two_value: "25",
        // },
      },
      centerData: this.platMirc,
      microSer: [],
      memoryMean: null,
      mean: null,
      Microservicesr: [], //中间微服务请求次数
      regNum: [{ num_of_calls: 0 }, { num_of_calls: 0 }],
      sumApi: null, //api 请求次数
    };
  },
  watch: {
    platMirc: function (newVal, oldVal) {
      this.centerData = newVal;
    },
  },
  components: {},
  methods: {
    // getdata(method = "post", app, condition, operate) {
    //   const path = this.getServiceUrl("operate", bxReq.serviceName, "sso");
    // },

    toSecplat(item) {
      this.$router.push({
        path: "/secplat",
        query: {
          title: item.app_name,
          askNum: item.ask_num,
          appNo: item.app_no,
          runtime: item.grand_time,
        },
      });
      // this.$router.push({
      //   name:"BotNorm",
      //   params:{
      //     runtime: item.running,
      //     askNum: item.ask_num,
      //   }
      // })

      // this.$router.push({
      //   name: "BotNorm",
      //   params: {
      //     title: item.app_name,
      //     askNum: item.ask_num,
      //     appNo: item.app_no,
      //     runtime: item.running
      //   },
      // });
    },

    // converts(num) {
    //   let nums = parseInt(num);
    //   if (nums > 10000) {
    //     if (nums % 10000 == 0) {
    //       nums = num / 10000 + "万";
    //     } else {
    //       nums = Math.round((num / 10000) * 10) / 10 + "万";
    //     }
    //   } else {
    //     nums = num;
    //   }
    //   return nums;
    // },
    // // 持续运行时长转换
    // periods(num) {
    //   let nums = parseInt(num) / 60 / 60;
    //   if (nums < 24) {
    //     if (nums % parseInt(nums) == 0) {
    //       nums = nums;
    //     } else {
    //       nums = Math.round(nums * 10) / 10 + "h";
    //     }
    //   } else {
    //     nums = Math.round((nums / 24) * 10) / 10 + "天";
    //   }
    //   return nums;
    // },
    //查询APP运行时长
    // operation() {
    //   let req = {
    //     serviceName: "srvlog_apps_onlie_time_select",
    //     colNames: ["*"],
    //     condition: []
    //   };
    //   let path = this.getServiceUrl(
    //     "select",
    //     "srvlog_apps_onlie_time_select",
    //     "monitor"
    //   );
    //   this.axios
    //     .post(path, req)
    //     .then(res => {
    //       let operat1 = res.data.data;
    //       operat1 = Object.assign(...operat1);
    //       this.operat = operat1;
    //     })
    //     .catch(err => {

    //     });
    // },
    //查询中间微服务

    //  relation_condition: {
    // 	relation: "OR",
    // 	data: [{
    // 		relation: "AND",
    // 		data: [{
    // 			colName: "app_class",
    // 			value: "platform",
    // 			ruleType: "ne"
    // 		}]
    // 	},
    // 	{
    // 		relation: "AND",
    // 		data: [{
    // 			colName: "app_no",
    // 			value: "hr",
    // 			ruleType: "eq"
    // 		}]
    // 	}]
    // },
    // fhz

    CenTiny() {
      let self = this;
      let req = {
        serviceName: "srvconfig_app_list_select",
        colNames: ["*"],

        relation_condition: {
          relation: "OR",
          data: [
            {
              relation: "AND",
              data: [
                {
                  colName: "app_class",
                  value: "platform",
                  ruleType: "ne",
                },
              ],
            },
            {
              relation: "AND",
              data: [
                {
                  colName: "app_no",
                  value: "hr",
                  ruleType: "eq",
                },
              ],
            },
          ],
        },

        order: [
          {
            colName: "app_seq",
            orderType: "asc",
          },
        ],
        page: {
          pageNo: 1,
          rownumber: 11,
        },
      };
      let path = this.getServiceUrl(
        "select",
        "srvconfig_app_list_select",
        "config"
      );
      this.axios
        .post(path, req)
        .then((res) => {
          // this.microSer[3].beg = res.data.data[0].num_of_calls;
          let micr = res.data.data;
          console.log("应用----", micr);
          // this.microSer = [];
          //   for( let i=0; i<micr.length;i++){
          //   let req1 = {
          //     serviceName: "srvlog_call_statistics_select",
          //     colNames: ["*"],
          //     condition: [
          //       {
          //         colName: "application",
          //         ruleType: "eq",
          //         value: micr[i].app_no
          //       }
          //     ],
          //     group: [
          //       {
          //         colName: "num_of_calls",
          //         type: "sum"
          //       }
          //     ]
          //   };
          //   let path1 = this.getServiceUrl(
          //     "select",
          //     "srvlog_call_statistics_select",
          //     "log"
          //   );
          //   this.axios
          //     .post(path1, req1)
          //     .then(res1 => {
          //       if (res1.data.data.length > 0) {

          //         for(let j = 0;j<micr.length;j++){
          //           if(micr[j].app_no === req1.condition[0].value){
          //             this.$set(micr[j],['ask_num'],res1.data.data[0].num_of_calls)
          //             // micr[j]['ask_num']= res1.data.data[0].num_of_calls;
          //             let appName = micr[j].app_no.toUpperCase();

          //             // micr[j].running = this.operat[appName];
          //             this.$set(micr[j],'running',this.operat[appName])

          //           }
          //         }
          //       }
          //     })
          //     .catch(err => {

          //     });
          // }
          //
          let nowDate = moment().format("YYYY-MM-DD  HH:mm:ss");
          let m1 = moment(nowDate);
          for (let j = 0; j < micr.length; j++) {
            if (micr[j].onlie_start_time) {
              let endDate = moment(micr[j].onlie_start_time);
              let diffDate = m1.diff(endDate, "seconds");
              console.log("diffDate", diffDate);
              this.$set(micr[j], "grand_time", diffDate);
            }
            let appName = micr[j].app_no.toUpperCase();
            this.$set(micr[j], "running", this.platMirc.operat[appName]);
            for (let i = 0; i < this.Microservicesr.length; i++) {
              // let appName = micr[j].app_no.toUpperCase();
              // this.$set(micr[j],'running',this.operat[appName])
              if (micr[j].app_no == this.Microservicesr[i].application) {
                this.$set(
                  micr[j],
                  ["ask_num"],
                  this.Microservicesr[i].num_of_calls
                );
              }
            }
            this.microSer = micr;
          }
        })
        .catch((err) => {});
    },

    //查询总请求次数
    async edmiens() {
      let self = this;
      let path = this.getServiceUrl(
        "select",
        "srvlog_call_statistics_select",
        "log"
      );
      let req = {
        serviceName: "srvlog_call_statistics_select",
        colNames: ["*"],
        condition: [],
        group: [
          {
            colName: "application",
            type: "by",
          },
          {
            colName: "num_of_calls",
            type: "sum",
          },
        ],
      };
      // this.axios.post(path,req).then(res=>{
      let res = await self.axios.post(path, req);

      if (res.status === 200) {
        this.Microservicesr = res.data.data;
        let asd = res.data.data;
        this.regNum[0].num_of_calls = asd[1].num_of_calls;
        this.regNum[1].num_of_calls = asd[2].num_of_calls;
        let sum = null;
        for (let k = 0; k < res.data.data.length; k++) {
          sum += res.data.data[k].num_of_calls;
        }
        this.sumApi = sum;
        this.CenTiny();

        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }

      // })
    },
    // 查询服务请求次数及个别数据
    async selectServeNum() {
      let self = this;
      let path = this.getServiceUrl(
        "select",
        "srvconfig_app_monitor_data_select",
        "config"
      );
      let req = {
        serviceName: "srvconfig_app_monitor_data_select",
        colNames: ["*"],
        condition: [],
      };
      // this.axios.post(path,req).then(res=>{
      let res = await self.axios.post(path, req);
      if (res.status === 200) {
        this.menuData = res.data.data[0];
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
    },
    //查询总请求次---数定时刷新
    RunTimeOuts() {
      let self = this;
      this.ReqTimeOuts.RunTimeOuts = new this.timeOut(300, 0, self.edmiens);
      this.ReqTimeOuts.RunTimeOuts.reqFun();
      this.ReqTimeOuts.RunTimeOuts.startTime();
    },
    // 查询服务label数据---定时刷新
    RunTimeOutsServe() {
      let self = this;
      this.ReqTimeOuts.RunTimeOutsSer = new this.timeOut(
        300,
        0,
        self.selectServeNum
      );
      this.ReqTimeOuts.RunTimeOutsSer.reqFun();
      this.ReqTimeOuts.RunTimeOutsSer.startTime();
    },
  },
  created() {
    // this.selectServeNum();
    // this.edmiens()
  },
  mounted() {
    this.RunTimeOuts();
    this.RunTimeOutsServe();
  },
  destroyed() {
    this.ReqTimeOuts.RunTimeOuts.endTime();
    this.ReqTimeOuts.RunTimeOutsSer.endTime();
  },
};
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
html,
body {
  margin: 0;
  padding: 0;
}
.content-view {
  height: 100%;
  //   background: url("../assets/images/wrapper-bg1.png");
  //   background-size: 100% 100%;
}
.enter_wrap {
  // overflow: hidden;
  .enter {
    width: 15%;
    float: right;
    margin-top: 20px;
    font-size: 16px;
    font-weight: 700;
    & span {
      padding: 10px 15px;
      display: block;
      width: 23%;
      // background: url("../assets/images/panel-c-b.png");
      background-size: 100% 100%;
      color: white;
    }
  }
}

.main {
  width: 95%;
  margin: 0 auto;
  height: 80%;
  margin-top: 3%;
  .main_top {
    width: 51%;
    margin: 20px auto;
    text-align: center;
    .main_top_p {
      width: 100%;
      background-image: linear-gradient(to top, #3f81f6, #022e79);
      margin: 0 auto;
      color: white;
      font-size: 14px;
      // background: url("../assets/images/panel-c-b.png");
      background-size: 100% 100%;
      padding: 5px 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      cursor: default;
      div {
        color: #ffffff;
        font-size: 1.8rem;
        margin: 2px 0 0 0;
        &:first-child {
          font-size: 16px;
        }
      }
      @media screen and (max-width: 1366px) {
        div {
          font-size: 1.6rem;
        }
      }
      div.plan-view {
        display: flex;
        flex-direction: column;
        padding: 0.3rem 0;
        text-align: center;
        justify-content: center;
        align-items: center;
        span {
          font-size: 0.8rem;
          font-weight: normal;
          text-align: center;

          line-height: 1rem;
          &:first-child {
            color: white;
            margin-bottom: 0.6rem;
            //   min-width: 2rem;
            text-align: left;
          }
          &:last-child {
            color: rgb(240, 255, 36);
            //   min-width: 4rem;
            font-size: 1.6rem;
            line-height: 1.4rem;
            text-align: right;
          }
        }
      }
      @media screen and (max-width: 1366px) {
        div.plan-view {
          span {
            &:last-child {
              font-size: 1.4rem;
            }
          }
        }
      }
    }
  }
  .main_cen {
    width: 95%;
    margin: 0 auto;
    overflow: hidden;
    height: 85%;
    display: flex;
    justify-content: center;
    align-items: stretch;
    .main_cen_left {
      width: 20%;
      height: 90%;
      cursor: default;
      ul {
        width: 100%;
        height: 100%;
        list-style: none;
        // margin: 10px auto;
        text-align: center;
        overflow: hidden;
        list-style: none;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        // justify-content: space-between;
        li {
          cursor: default !important;
          width: 70%;
          color: white;
          margin: 0 auto 15%;
          background-image: linear-gradient(to top, #026ed3, #0089eb);
          // box-shadow: 7px 2px 5px;
          font-size: 14px;
          // background: url("../assets/images/panel-r-b.png");
          background-size: 100% 100%;
          display: flex;
          flex-direction: column;
          margin-bottom: 0.2rem;
          border: 1px solid #024988;
          border-radius: 10px;
          background-color: #06347428;
          font-weight: bold;
          // margin-left: 5%;
          padding: 5px 10px;
          cursor: pointer;
          &:last-child {
            margin-bottom: 0;
          }
          div {
            display: flex;
            flex-direction: row;
            padding: 0.3rem 0;
            text-align: center;
            justify-content: space-between;
            &:first-child {
              justify-content: left;
              font-size: 1.2rem;
              color: rgb(254, 255, 255);
              border-bottom: 1px solid rgba(14, 101, 214, 0.93);
            }
            span {
              font-size: 0.8rem;
              font-weight: normal;
              &:first-child {
                color: rgb(8, 8, 8);

                font-size: 1rem;
                min-width: 2rem;
                text-align: left;
              }
              &:last-child {
                color: rgb(240, 255, 36);
                min-width: 4rem;
                font-size: 1.4rem;
                line-height: 1.6rem;
                text-align: right;
              }
            }
          }
          @media screen and (max-width: 1366px) {
            div {
              padding: 0;
              &:first-child {
                padding-bottom: 2px;
                font-size: 1rem;
              }
              span {
                &:first-child {
                  font-size: 0.7rem;
                }
                &:last-child {
                  font-size: 1.1rem;
                  line-height: 1.4rem;
                }
              }
            }
          }
          .title {
            color: rgb(71, 187, 255);
            font-size: 1rem;
            margin-bottom: 5%;
          }
          &:first-child {
            font-size: 16px;
            line-height: 20px;
          }
        }
      }
    }
    @media screen and (max-width: 1366px) {
      .main_cen_left {
        ul {
          li {
            padding: 3px 10px;
          }
        }
      }
    }
    .main_cen_cen {
      width: 55%;
      margin: 0 2%;
      height: 90%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .main_cen_cen_top {
        // margin-bottom: 10%;
        ul {
          list-style: none;
          width: 100%;
          text-align: left;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          margin-left: 2%;
          // justify-content: space-between;
          li {
            display: flex;
            width: 21%;
            flex-direction: column;
            justify-content: space-between;
            margin-bottom: 1rem;
            border: 1px solid #024988;
            border-radius: 10px;
            background-color: #06347428;
            color: white;
            float: left;
            font-size: 18px;
            min-height: 82px;
            // margin-left: 5%;
            padding: 5px 10px;
            color: #dfeb4c;
            cursor: pointer;
            margin: 10px 2%;
            box-sizing: border-box;
            &:nth-child(4n + 1) {
              margin-left: 0;
            }
            div {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              span {
                font-size: 0.8rem;
                &:first-child {
                  color: white;
                  min-width: 2rem;
                  text-align: left;
                }
                &:last-child {
                  color: rgb(240, 255, 36);
                  min-width: 4rem;
                  font-size: 1.2rem;
                  line-height: 1.4rem;
                  text-align: right;
                }
              }
            }

            .title {
              color: rgb(71, 187, 255);
              font-size: 1rem;
              margin-bottom: 5%;
            }
            @media screen and (max-width: 1366px) {
              div {
                span {
                  font-size: 0.5rem;
                  &:last-child {
                    min-width: 2rem;
                    font-size: 1rem;
                    line-height: 1rem;
                  }
                }
              }
              .title {
                margin-bottom: 0;
                font-size: 0.8rem;
              }
            }
          }
          @media screen and (max-width: 1366px) {
            li {
              min-height: 60px;
              margin-left: 0.9rem;
            }
          }
          .last {
            display: flex;
            align-items: center;
            justify-content: center;
            p {
              display: flex;
              justify-content: center;
              align-items: center;
              color: #47bbff;
              margin: 0;
              text-align: center;
            }
            @media screen and (max-width: 1366px) {
              font-size: 0.8rem;
            }
          }
        }
      }
    }
  }
  .main_bot {
    width: 100%;
    // margin-top: 20px;
    // background: url("../assets/images/panel-r-t.png");
    background-size: 100% 100%;
    ul {
      list-style: none;
      padding: 1rem;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        background-image: linear-gradient(to top, #032661, #0242b1);
        display: flex;
        width: 32%;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        cursor: default;
        // :first-child {
        //   font-size: 16px;
        // }
        & > div {
          display: flex;
          flex-direction: column;
          padding: 0.3rem 0;
          color: #e2f7ff;
          font-size: 1.3rem;
          justify-content: space-around;
          div {
            display: flex;
            flex-direction: row;
            padding: 0.3rem 0;
            text-align: center;
            justify-content: space-between;
            align-items: center;
            span {
              font-size: 0.8rem;
              font-weight: normal;
              text-align: center;
              &:first-child {
                color: white;
                margin-left: 0.5rem;
                //   min-width: 2rem;
                text-align: left;
              }
              &:last-child {
                color: rgb(240, 255, 36);
                //   min-width: 4rem;
                font-size: 1.6rem;
                line-height: 1.4rem;
                text-align: right;
                margin-right: 0.5rem;
              }
            }
          }
        }
        .task {
          display: flex;
          justify-content: left;
          span {
            margin-left: 0.5rem;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1366px) {
    .main_bot {
      ul {
        padding: 0.7rem;
        li {
          & > div {
            padding: 0.1rem 0;
            font-size: 1rem;
            div {
              span {
                font-size: 0.5rem;
                &:last-child {
                  font-size: 1.2rem;
                  line-height: 1.2rem;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
