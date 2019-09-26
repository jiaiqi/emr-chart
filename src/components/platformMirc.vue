<template>
  <div class="content-view">
    <div class="enter_wrap">
      <div class="enter">
        <span></span>
      </div>
    </div>

    <div class="main">
      <div   class="main_top">
        <div class="main_top_p">
          <div class="plan-view">
            <span>持续运行时长</span>
            <span>{{secondToTime(centerData.operat.GATEWAY)}}</span>
          </div>

          <div>API网关</div>
          <div class="plan-view">
            <span>请求次数</span>
            <span>{{centerData.listwg?convert(centerData.listwg):0}}</span>
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
                  <span>持续运行时长:</span>
                  <span>{{secondToTime(centerData.operat.SSO)}}</span>
                </div>
                <div>
                  <span>用户总数:</span>
                  <span>{{centerData.list_userno?convert(centerData.list_userno):0}}</span>
                </div>
              </li>
              <li>
                <div>授权中心</div>
                <div>
                  <span>持续运行时长:</span>
                  <span>{{secondToTime(centerData.operat.AUTH)}}</span>
                </div>
                <div>
                  <span>请求次数:</span>
                  <span>{{convert(centerData.regNum[0].num_of_calls)}}</span>
                  <!-- convert(centerData.regNum[0].num_of_calls) -->
                </div>
              </li>

              <li>
                <div>注册中心</div>
                <div>
                  <span>持续运行时长:</span>
                  <span>{{secondToTime(centerData.operat.SSO)}}</span>
                </div>
                <div>
                  <span>应用总数量:</span>
                  <span>{{centerData.list_zcyy?convert(centerData.list_zcyy):0}}</span>
                </div>
              </li>

              <li>
                <div>配置中心</div>
                <div>
                  <span>持续运行时长:</span>
                  <span>{{secondToTime(centerData.operat.CONFIG)}}</span>
                </div>
                <div>
                  <span>请求次数:</span>
                  <span>{{convert(centerData.regNum[1].num_of_calls)}}</span>
                  <!-- convert(centerData.regNum[1].num_of_calls) -->
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
                  <span>持续运行时长</span>
                  <span>{{ secondToTime(item.running)}}</span>
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
                      <span>持续运行时长</span>
                      <span>{{secondToTime(centerData.operat.TASK)}}</span>
                    </div>
                    <div>
                      <span>总任务个数</span>
                      <span>{{centerData.list_rw?convert(centerData.list_rw):0}}</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="task">
                    <span>事件管理</span>
                  </div>
                  <div>
                    <div>
                      <span>持续运行时长</span>
                      <span>{{secondToTime(centerData.operat.EVENT)}}</span>
                    </div>
                    <div>
                      <span>事件总数量</span>
                      <span>{{centerData.list_sj?convert(centerData.list_sj):0}}</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="task">
                    <span>文件管理</span>
                  </div>
                  <div>
                    <div>
                      <span>持续运行时长</span>
                      <span>{{secondToTime(centerData.operat.FILE)}}</span>
                    </div>
                    <div>
                      <span>文档总数量</span>
                      <span>{{centerData.listpz?convert(centerData.listpz):0}}</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="task">
                    <span>缓存管理</span>
                  </div>
                  <div>
                    <div>
                      <span>应用命中个数</span>
                      <span>12%</span>
                    </div>
                    <div>
                      <span>内存使用率</span>
                      <span>5%</span>
                    </div>
                  </div>
                </li>
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
                  <span>持续运行时长:</span>
                  <span>{{secondToTime(centerData.operat.CONFIG)}}</span>
                </div>
                <div>
                  <span>监控应用个数:</span>
                  <span>{{centerData.list_jkyygs?convert(centerData.list_jkyygs):0}}</span>
                </div>
              </li>
              <li>
                <div>开发中心</div>
                <div>
                  <span>工单个数:</span>
                  <span>{{centerData.list_kfgd?convert(centerData.list_kfgd):0}}</span>
                </div>
                <div>
                  <span>处理工单数量:</span>
                  <span>{{centerData.list_kfcl? convert(centerData.list_kfcl) :0}}</span>
                </div>
              </li>

              <li>
                <div>测试中心</div>
                <div>
                  <span>测试应用数量:</span>
                  <span>{{centerData.list_cs?convert(centerData.list_cs):0}}</span>
                </div>
                <div>
                  <span>上线应用数量:</span>
                  <span>{{centerData.list_cssx ?convert(centerData.list_cssx) :0}}</span>
                </div>
              </li>

              <li>
                <div>日志中心</div>
                <div>
                  <span>持续运行时长:</span>
                  <span>{{secondToTime(centerData.operat.LOG)}}</span>
                </div>
                <div>
                  <span>日志记录数:</span>
                  <span>{{centerData.logNum?secondToTime(centerData.logNum):0}}</span>
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
export default {
  props:["platMirc"],
  data() {
    return {
      centerData: this.platMirc,
      microSer: [],
      // recoerOne:'',
      // recoerTwo:''
      // listwg: "",
      // listpz: "",
      // list_userno: "",
      // list_rw: "",
      // list_sj: "",
      // list_cs: "",
      // list_cssx: "",
      // list_kfgd: "",
      // list_kfcl: "",
      // list_zcyy: "",
      // list_jkyygs: "",
      // list_pzqq: "",
      // list_rzzx: "",
      // list_sqzx: "",
      // logNum: "",
      // operat: {},
      // regNum: [],
      // ApiNum: null
      // list_ykt:'',
      // list_dzbl:'',
      // list_sjgl:'',
      // list_sjgx: '',
      // list_sjfxzs:'',
      // list_yxjk:'',
    };
  },
  watch:{
    platMirc:function(newVal,oldVal){
       this.centerData=newVal
    }
  },
  components: {},
  methods: {
    // getdata(method = "post", app, condition, operate) {
    //   const path = this.getServiceUrl("operate", bxReq.serviceName, "sso");
    // },
   
    toSecplat(item) {
      this.$router.push({
        name: "secplat",
        params: {
          title: item.app_name,
          askNum: item.ask_num,
          appNo: item.app_no,
          runtime: item.running
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
      // console.log(item.app_name)

    },
    //api网关 请求次数
    getData_one() {
      console.log(this.centerData)
      // console.log(this.centerData[1].list_cssx)
      let req = {
        serviceName: "srvlog_call_statistics_select",
        colNames: ["*"],
        condition: [],
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
      this.axios
        .post(path, req)
        .then(res => {
          // console.log(res)
          this.listwg = res.data.data[0].num_of_calls;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //文档管理 文档总数
    getData_two() {
      let req = {
        serviceName: "srvapprc_dev_wendang_select",
        colNames: ["*"],
        condition: []
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_dev_wendang_select",
        "apprc"
      );
      this.axios
        .post(path, req)
        .then(res => {
          // console.log("222", res);
          this.listpz = res.data.data.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getLog() {
      let req = {
        serviceName: "srvlog_operate_record_select",
        colNames: ["*"],
        condition: [],
        group: [
          {
            colName: "id",
            type: "count"
          }
        ],
        page: {
          pageNo: 1,
          rownumber: 1
        }
      };
      let path = this.getServiceUrl(
        "select",
        "srvlog_operate_record_select",
        "log"
      );
      this.axios
        .post(path, req)
        .then(res => {
          this.logNum = res.data.page.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //用户中心 用户总数
    getData_three() {
      let req = {
        serviceName: "srvsso_user_select",
        colNames: ["*"],
        condition: []
      };
      let path = this.getServiceUrl("select", "srvsso_user_select", "sso");
      this.axios
        .post(path, req)
        .then(res => {
          this.list_userno = res.data.data.length;
          // console.log('333',res)
        })
        .catch(err => {
          console.log(err);
        });
    },
    //任务管理 总任务数
    getData_four() {
      let req = {
        serviceName: "srvtask_shedule_cfg_select",
        colNames: ["*"],
        condition: []
      };
      let path = this.getServiceUrl(
        "select",
        "srvtask_shedule_cfg_select",
        "task"
      );
      this.axios
        .post(path, req)
        .then(res => {
          this.list_rw = res.data.data.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 授权 请求次数
    getRegNum() {
      let req = {
        serviceName: "srvlog_call_statistics_select",
        colNames: ["*"],
        condition: [
          {
            colName: "application",
            ruleType: "in",
            value: "sso,config,log,auth"
          }
        ],
        group: [
          {
            colName: "application",
            type: "by"
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
      this.axios
        .post(path, req)
        .then(res => {
          this.regNum = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //事件管理 事件总数
    getData_five() {
      let req = {
        serviceName: "srvevent_reg_select",
        colNames: ["*"],
        condition: []
      };
      let path = this.getServiceUrl("select", "srvevent_reg_select", "event");
      this.axios
        .post(path, req)
        .then(res => {
          this.list_sj = res.data.data.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //测试中心 测试应用数量
    getData_six() {
      let req = {
        serviceName: "srvapprc_application_apply_dev_select",
        colNames: ["*"],
        condition: []
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_application_apply_dev_select",
        "apprc"
      );
      this.axios
        .post(path, req)
        .then(res => {
          this.list_cs = res.data.data.length;
          // console.log('555',res)
        })
        .catch(err => {
          console.log(err);
        });
    },
    //测试中心 上线应用数量
    getData_seven() {
      let req = {
        serviceName: "srvapprc_online_apply_dev_select",
        colNames: ["*"],
        condition: [
          {
            colName: "proc_status",
            ruleType: "eq",
            value: "完成"
          }
        ]
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_online_apply_dev_select",
        "apprc"
      );
      this.axios
        .post(path, req)
        .then(res => {
          this.list_cssx = res.data.data.length;
          // console.log('555',res)
        })
        .catch(err => {
          console.log(err);
        });
    },
    //开发中心 工单个数
    getData_eight() {
      let req = {
        serviceName: "srvapprc_issue_info_select",
        colNames: ["*"],
        condition: []
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_issue_info_select",
        "apprc"
      );
      this.axios
        .post(path, req)
        .then(res => {
          this.list_kfgd = res.data.data.length;
          // console.log('888',res)
        })
        .catch(err => {
          console.log(err);
        });
    },
    //开发中心 处理工单个数
    getData_nine() {
      let req = {
        serviceName: "srvapprc_issue_info_select",
        colNames: ["*"],
        condition: [
          {
            colName: "handle_status",
            ruleType: "eq",
            value: "已完成"
          }
        ]
      };
      let path = this.getServiceUrl(
        "select",
        "srvapprc_issue_info_select",
        "apprc"
      );
      this.axios
        .post(path, req)
        .then(res => {
          this.list_kfcl = res.data.data.length;
          // console.log('999',res)
        })
        .catch(err => {
          console.log(err);
        });
    },
    //注册中心 应用总数量
    getData_ten() {
      let req = {
        serviceName: "srvapprc_issue_info_select",
        colNames: ["*"],
        condition: []
      };
      let path = "http://192.168.0.192:8101/monitor/applications";
      this.axios
        .get(path, req)
        .then(res => {
          this.list_zcyy = res.data.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //监控中心 监控应用个数
    getData_eleven() {
      let path = "http://192.168.0.192:8101/monitor/applications";
      this.axios
        .get(path)
        .then(res => {
          this.list_jkyygs = res.data.length;
          // console.log('aaa',res.data.length)
        })
        .catch(err => {
          console.log(err);
        });
    },
    converts(num) {
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
    periods(num) {
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
    //查询APP运行时长
    operation() {
      let req = {
        serviceName: "srvlog_apps_onlie_time_select",
        colNames: ["*"],
        condition: []
      };
      let path = this.getServiceUrl(
        "select",
        "srvlog_apps_onlie_time_select",
        "monitor"
      );
      this.axios
        .post(path, req)
        .then(res => {
          let operat1 = res.data.data;
          operat1 = Object.assign(...operat1);
          this.operat = operat1;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //查询中间微服务
   CenTiny() {
      let req = {
        serviceName: "srvconfig_app_list_select",
        colNames: ["*"],
        condition: [
          {
            colName: "app_class",
            value: "platform",
            ruleType: "ne"
          }
        ],
        order: [
          {
            colName: "app_seq",
            orderType: "asc"
          }
        ],
        page: {
          pageNo: 1,
          rownumber: 11
        }
      };
      let path = this.getServiceUrl(
        "select",
        "srvconfig_app_list_select",
        "config"
      );
      this.axios
        .post(path, req)
        .then(res => {
          // this.microSer[3].beg = res.data.data[0].num_of_calls;
          let micr = res.data.data;
          console.log("micr", micr);
          // this.microSer
          this.microSer = [];
          micr.forEach(item => {
            let req1 = {
              serviceName: "srvlog_call_statistics_select",
              colNames: ["*"],
              condition: [
                {
                  colName: "application",
                  ruleType: "eq",
                  value: item.app_no
                }
              ],
              group: [
                {
                  colName: "num_of_calls",
                  type: "sum"
                }
              ]
            };
            let path1 = this.getServiceUrl(
              "select",
              "srvlog_call_statistics_select",
              "log"
            );
            this.axios
              .post(path1, req1)
              .then(res1 => {
                // console.log(res1)
                if (res1.data.data.length > 0) {
                  item["ask_num"] = res1.data.data[0].num_of_calls;
                  this.microSer.push(item);
                }
              })
              .catch(err => {
                console.log(err);
              });

            let appName = item.app_no.toUpperCase();
            // console.log(appName)
            item.running = this.centerData.operat[appName];
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    // this.getRegNum();
    // this.getLog();
    // this.getData_one();
    // this.getData_two();
    // this.getData_three();
    // this.getData_four();
    // this.getData_five();
    // this.getData_six();
    // this.getData_seven();
    // this.getData_eight();
    // this.getData_nine();
    // this.getData_ten();
    // this.getData_eleven();
    // this.operation();
    this.CenTiny();
  },
  mounted() {
    // setInterval(() => {
    //   this.getRegNum();
    //   this.getLog();
    //   this.getData_one();
    //   this.getData_two();
    //   this.getData_three();
    //   this.getData_four();
    //   this.getData_five();
    //   this.getData_six();
    //   this.getData_seven();
    //   this.getData_eight();
    //   this.getData_nine();
    //   this.getData_ten();
    //   this.getData_eleven();
    //   this.operation();
    //   this.CenTiny();
    // }, 30000);
  }
}
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
      cursor: pointer;
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
          // justify-content: space-between;
          li {
            display: flex;
            width: 20%;
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
            margin-left: 2.1rem;
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
        width: 24%;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        cursor: pointer;
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
