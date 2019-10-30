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
            <span>持续运行时长</span>
            <span>{{secondToTime(centerData.operat.GATEWAY)}}</span>
          </div>

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
                  <span>{{convert(regNum[0].num_of_calls)?convert(regNum[0].num_of_calls):0}}</span>
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
                  <span>{{convert(regNum[1].num_of_calls)?convert(regNum[1].num_of_calls):0}}</span>
                  <!-- <span>{{regNum[1]['num_of_calls']}}</span> -->
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
                      <span>应用命中率</span>
                      <span>{{mean==NaN || mean==null || mean=="NaN"?0+"%":(mean+"%")}}</span>
                    </div>
                    <div>
                      <span>内存使用率</span>
                      <span>{{memoryMean==NaN ||memoryMean==null || memoryMean=="NaN"?0+"%":(memoryMean+"%")}}</span>
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
  props: ["platMirc"],
  data() {
    return {
      ReqTimeOuts: {
        RunTimeOuts: null,
        TimeOutMethitems: null
      },
      centerData: this.platMirc,
      microSer: [],
      memoryMean: null,
      mean: null,
      Microservicesr: [], //中间微服务请求次数
      regNum: [{ num_of_calls: 0 }, { num_of_calls: 0 }],
      sumApi: null //api 请求次数
    };
  },
  watch: {
    platMirc: function(newVal, oldVal) {
      this.centerData = newVal;
    }
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
          runtime: item.running
        }
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
    //       console.log(err);
    //     });
    // },
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

          // console.log("micr", micr);
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
          //         // console.log(arr[0].app_nos)
          //         for(let j = 0;j<micr.length;j++){
          //           if(micr[j].app_no === req1.condition[0].value){
          //             this.$set(micr[j],['ask_num'],res1.data.data[0].num_of_calls)
          //             // micr[j]['ask_num']= res1.data.data[0].num_of_calls;
          //             let appName = micr[j].app_no.toUpperCase();
          //             // console.log(appName)
          //             // micr[j].running = this.operat[appName];
          //             this.$set(micr[j],'running',this.operat[appName])
          //             // console.log('micr[j].ask_num--------',micr[j].ask_num,res1.data.data[0].num_of_calls,micr[j].running)
          //           }
          //         }
          //       }
          //     })
          //     .catch(err => {
          //       console.log(err);
          //     });
          // }
          // console.error("微服务中心总请求次数",this.Microservicesr)
          for (let j = 0; j < micr.length; j++) {
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
          }
          this.microSer = micr;
          // console.log('micr=>2',this.microSer,this.microSer.app_name)
        })
        .catch(err => {
          console.log(err);
        });
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
            type: "by"
          },
          {
            colName: "num_of_calls",
            type: "sum"
          }
        ]
      };
      // this.axios.post(path,req).then(res=>{
      let res = await self.axios.post(path, req);

      // console.error("--------------发送请求--------------res",res);z
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
        console.log("--regNum----", this.regNum[0].num_of_calls);
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }

      // })
    },

    async methitem() {
      let self = this; // 缓存管理
      let path = this.getServiceUrl("", "redis", "monitor");
      let res = await self.axios.get(path);
      if (res.status === 200) {
        let space = null; //命中总数
        let miss = null; //未命中总数
        let mean = null; //命中率

        let memory = null; //已使用内存
        let totalMemory = null; //未使用内存
        let memoryMean = null; //内存使用率
        // console.log(typeof )
        let resa = res.data.data;
        for (var i = 0; i < res.data.data.length; i++) {
          space += Number(resa[i].itemsVos[0].val);
          miss += Number(resa[i].itemsVos[1].val);
          memory += Number(resa[i].itemsVos[2].val);
          totalMemory += Number(resa[i].itemsVos[3].val);
        }

        this.mean = mean = (space / (space + miss)).toFixed(2) * 100;
        this.memoryMean = memoryMean =
          (memory / 1024 / 1024 / (totalMemory / 1024 / 1024)).toFixed(2) * 100;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // this.axios.get(path).then(res=>{
      // console.log(res)

      //  console.log(memory,totalMemory)

      // }).catch(err=>{
      //   console.log(err);
      // })
    },

    //查询总请求次---数定时刷新
    RunTimeOuts() {
      let self = this;
      this.ReqTimeOuts.RunTimeOuts = new this.timeOut(30, 0, self.edmiens);
      this.ReqTimeOuts.RunTimeOuts.reqFun();
      this.ReqTimeOuts.RunTimeOuts.startTime();
    },

    TimeOutMethitems() {
      let self = this;
      self.ReqTimeOuts.TimeOutMethitems = new this.timeOut(
        30,
        0,
        self.methitem
      );
      self.ReqTimeOuts.TimeOutMethitems.reqFun();
      self.ReqTimeOuts.TimeOutMethitems.startTime();
    }
  },
  created() {
    // this.edmiens()
  },
  mounted() {
    this.RunTimeOuts();
    this.TimeOutMethitems();
  },
  destroyed() {
    this.ReqTimeOuts.RunTimeOuts.endTime();
    this.ReqTimeOuts.TimeOutMethitems.endTime();
  }
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
