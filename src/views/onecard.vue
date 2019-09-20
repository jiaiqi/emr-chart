<template>
  <div class="wrap">
    <view-title :titleViewData="titleViewData"></view-title>
    <!-- <div class="title">
      <div class="title_left"></div>
      <div class="title_title">社保医疗一卡通融合平台</div>
      <div class="title_right">
        <div class="nowdate">{{ date }}</div>
        <div class="accountInfo">
          当前帐号:
          <span>{{user.user_no}}</span>
        </div>
        <span class="btn_logout" @click="toManangerment">管理入口</span>
        <span class="btn_logout" @click="loginOut">注销</span>
        <span class="btn_logout" @click="toNav">返回</span>
      </div>
    </div>
    <div class="main">
      <header class="header">
        <div class="top">
          <div class="top_left">
            <div class="page_name" :class="{tabactive:tabsShow==1}" @click="changeTab(1)">一卡通就诊</div>
            <div class="page_name" :class="{tabactive:tabsShow==2}" @click="changeTab(2)">电子病历共享</div>
            <div class="page_name" :class="{tabactive:tabsShow==3}" @click="changeTab(3)">电子病历采集</div>
          </div>
          <div class="top_header">
            <div class="top_header_item"></div>
            <div class="top_header_item">
              <span>累计运行时间：</span>
              <span class="all_number" v-if="showComponent == 'InTreatment' ">{{runTime.cvs}}</span>
              <span class="all_number" v-else>{{runTime.emr}}</span>
            </div>
          </div>
        </div>
        <div class="time_horizon">
          <div
            class="time_horizon_item btn"
            @click="checkTimeHorizon('day')"
            :class="{ active: checkDataType === 'day' }"
          >近24小时</div>
          <div
            class="time_horizon_item btn"
            @click="checkTimeHorizon('week')"
            :class="{ active: checkDataType === 'week' }"
          >近一周</div>
          <div
            class="time_horizon_item btn"
            @click="checkTimeHorizon('month')"
            :class="{ active: checkDataType === 'month' }"
          >近一月</div>
          <div
            class="time_horizon_item btn"
            @click="checkTimeHorizon('year')"
            :class="{ active: checkDataType === 'year' }"
          >近一年</div>
        </div>
      </header>
      <component :is="showComponent"></component>
    </div>-->
  </div>
</template>

<script>
let moment = require('moment');
import ViewTitle from '@/components/ViewTitle'
import EmrCollect from '@/components/EmrCollect' // 电子病历采集
import EmrShare from '@/components/EmrShare' // 电子病历共享
import InTreatment from '@/components/InTreatment' // 一卡通就诊
import InTreatmentVue from '../components/InTreatment.vue';
export default {
  components: { EmrCollect, EmrShare, InTreatment, ViewTitle },
  methods: {
    loginOut() {
      sessionStorage.clear();
      window.location.href = "/main/login_pages/login-fw.html"
    },
    changeTab(num) {
      this.tabsShow = num;
      if (this.tabsShow == 1) {
        this.showComponent = InTreatment
        this.getAllData('day', this.tabsShow)
      } else if (this.tabsShow == 2) {
        this.showComponent = EmrShare
        this.getAllData('day', this.tabsShow)
      } else if (this.tabsShow == 3) {
        this.showComponent = EmrCollect
        this.getAllData('day', this.tabsShow)
      }
    },
    toNav() {
      this.$router.push({ name: "navs", query: { from: "onecard" } })
    },
    getRunTime() {
      /**
       *  获取累计运行时间
       */
      let runTime = {}
      let req = { serviceName: "srvlog_apps_onlie_time_select" }
      let url = this.getServiceUrl("select", req.serviceName, "monitor")
      this.axios.post(url, req)
        .then(res => {
          let data = res.data.data
          runTime = Object.assign(...data)
          this.runTime = runTime
          this.runTime.cvs = this.secondToTime(runTime.CVS)
          this.runTime.emr = this.secondToTime(runTime.EMR)
        })
        .catch(err => {
          console.error(err);
        })
    },
    getAllData(type = "day", tabsShow = this.tabsShow) {
      let data = {}
      if (tabsShow == 1) {
        let req = {
          "serviceName": "srvcvs_medical_records_select",
          "colNames": ["*"],
          "group": [
            {
              "colName": "yljgmc", // 医院名
              "type": "by"
            },
            {
              "colName": "card_type", // 卡类型
              "type": "by"
            },
            {
              "colName": "ywfssj", // 业务发生时间
              "type": "by_date"
            },
            {
              "colName": "cmd", // 就诊类型
              "type": "by"
            },
            {
              "colName": "create_time",
              "type": "count"
            }
          ]
        }
        let url = this.getServiceUrl("select", req.serviceName, "cvs")
        if (type === 'day') {
          req.condition = [
            {
              "colName": "ywfssj",
              "value": moment().add(1, 'hours').format("YYYY-MM-DD HH"), // 小于当前时间的下一个小时
              "ruleType": "le"
            },
            {
              "colName": "ywfssj",
              "value": moment().subtract(23, 'hours').format("YYYY-MM-DD HH"), // 大于当前时间往前推23个小时
              "ruleType": "ge"
            }
          ]
          req.group[2] = {
            "colName": "ywfssj", // 业务发生时间
            "type": "by_hour"
          }

        } else if (type === 'week') {
          req.condition = [
            {
              "colName": "ywfssj",
              "value": moment().subtract(6, 'days').format('YYYY-MM-DD'), // 六天前,
              "ruleType": "ge"
            },
            {
              "colName": "ywfssj",
              "value": moment().add(1, 'days').format('YYYY-MM-DD'), // 今晚0点,
              "ruleType": "le"
            }
          ]
        } else if (type === 'month') {
          req.condition = [
            {
              "colName": "ywfssj",
              "value": moment().subtract(30, 'days').format('YYYY-MM-DD'), // 30天前
              "ruleType": "ge"
            },
            {
              "colName": "ywfssj",
              "value": moment().add(1, 'days').format('YYYY-MM-DD'), // 今晚0点,
              "ruleType": "le"
            }
          ]
        } else if (type === 'year') {
          req.condition = [
            {
              "colName": "ywfssj",
              "value": moment().subtract(11, 'month').format('YYYY-MM-DD'), // 十一个月之前
              "ruleType": "ge"
            },
            {
              "colName": "ywfssj",
              "value": moment().add(1, 'days').format('YYYY-MM-DD'), // 今晚0点,
              "ruleType": "le"
            }
          ]
          req.group = [
            {
              "colName": "yljgmc",
              "type": "by"
            }, {
              "colName": "ywfssj",
              "type": "by_month_of_year"
            }, {
              "colName": "create_time",
              "type": "count"
            },
            {
              "colName": "card_type",
              "type": "by"
            },
            {
              "colName": "cmd", // 就诊类型
              "type": "by"
            },
          ]
        }
        this.axios({ method: "POST", url: url, data: req })
          .then(res => {
            data = res.data.data
            console.log("aaaaaaadddddddd", data)
            this.getCountData(data, type, tabsShow)
            // this.handleAllData(data, type, tabsShow)
          }).catch(err => {
            console.log(err)
          })
      } else if (tabsShow == 2) {
        let serviceNames = [
          "DI_ADI_REGISTER_INFO_select",//门诊诊疗挂号记录
          "DI_ADI_DRUREC_INFO_select",//门急诊诊疗医嘱
          "DI_ADI_LAREXA_INFO_select",// 门急诊诊疗检查报告
          "DI_HDI_INRECORD_INFO_select",// 住院诊疗入院记录
          "DI_HDI_DRUREC_INFO_select", // 住院诊疗医嘱信息
          "DI_HDI_LAREXA_INFO_select",// 住院诊疗检验报告
        ]
        let cond = [
          {
            "colName": "service_name",
            "value": "DI_ADI_REGISTER_INFO_select",
            "ruleType": "eq"
          },
          {
            "colName": "service_name",
            "value": "DI_ADI_DRUREC_INFO_select",
            "ruleType": "eq"
          },
          {
            "colName": "service_name",
            "value": "DI_ADI_LAREXA_INFO_select",
            "ruleType": "eq"
          },
          {
            "colName": "service_name",
            "value": "DI_HDI_INRECORD_INFO_select",
            "ruleType": "eq"
          },
          {
            "colName": "service_name",
            "value": "DI_HDI_DRUREC_INFO_select",
            "ruleType": "eq"
          },
          {
            "colName": "service_name",
            "value": "DI_HDI_LAREXA_INFO_select",
            "ruleType": "eq"
          }
        ]
        let req = {
          "serviceName": "srvlog_call_statistics_select",
          "colNames": ["*"],
          "group": [
            {
              "colName": "service_name",
              "type": "by"
            },
            {
              "colName": "num_of_calls",
              "type": "sum"
            }, {
              "colName": "statistics_time",
              "type": "by_date"
            }
          ]
        }
        let req2 = {
          "serviceName": "srvemr_req_cert_select",
          "colNames": ["*"],
          "condition": [],
          "group": [
            {
              "colName": "card_type",
              "type": "by"
            },
            {
              "colName": "cert_no",
              "type": "count"
            },
          ]
        }
        if (type == "day") {
          req["group"] = [
            {
              "colName": "service_name",
              "type": "by"
            },
            {
              "colName": "num_of_calls",
              "type": "sum"
            }, {
              "colName": "statistics_time",
              "type": "by_hour"
            }
          ]
          req["relation_condition"] = {
            "relation": "AND",
            "data": [
              {
                "relation": "or",
                "data": cond
              },
              {
                "relation": "AND",
                "data": [
                  {
                    "colName": "statistics_time",
                    "value": moment().subtract(23, 'hours').format("YYYY-MM-DD HH"),
                    "ruleType": "ge"
                  },
                  {
                    "colName": "statistics_time",
                    "value": moment().format("YYYY-MM-DD HH"),
                    "ruleType": "le"
                  }
                ]
              }
            ]
          }
          req2.condition = [
            {
              "colName": "cert_time",
              "value": moment().subtract(23, 'hours').format("YYYY-MM-DD HH"),
              "ruleType": "ge"
            },
            {
              "colName": "cert_time",
              "value": moment().format("YYYY-MM-DD HH"),
              "ruleType": "le"
            }
          ]
        } else if (type == "week") {
          req["relation_condition"] = {
            "relation": "AND",
            "data": [
              {
                "relation": "or",
                "data": cond
              },
              {
                "relation": "AND",
                "data": [
                  {
                    "colName": "statistics_time",
                    "value": moment().subtract(6, 'days').format('YYYY-MM-DD'),
                    "ruleType": "ge"
                  },
                  {
                    "colName": "statistics_time",
                    "value": moment().add(1, 'days').format('YYYY-MM-DD'),
                    "ruleType": "le"
                  }
                ]
              }
            ]
          }
          req2.condition = [
            {
              "colName": "cert_time",
              "value": moment().subtract(6, 'days').format('YYYY-MM-DD'),
              "ruleType": "ge"
            },
            {
              "colName": "cert_time",
              "value": moment().add(1, 'days').format('YYYY-MM-DD'),
              "ruleType": "le"
            }
          ]
        } else if (type == "month") {
          req["relation_condition"] = {
            "relation": "AND",
            "data": [
              {
                "relation": "or",
                "data": cond
              },
              {
                "relation": "AND",
                "data": [
                  {
                    "colName": "statistics_time",
                    "value": moment().subtract(30, 'days').format('YYYY-MM-DD'),
                    "ruleType": "ge"
                  },
                  {
                    "colName": "statistics_time",
                    "value": moment().add(1, 'days').format('YYYY-MM-DD'),
                    "ruleType": "le"
                  }
                ]
              }
            ]
          }
          req2.condition = [
            {
              "colName": "cert_time",
              "value": moment().subtract(30, 'days').format('YYYY-MM-DD'),
              "ruleType": "ge"
            },
            {
              "colName": "cert_time",
              "value": moment().add(1, 'days').format('YYYY-MM-DD'),
              "ruleType": "le"
            }
          ]
        } else if (type == "year") {
          req["group"] = [
            {
              "colName": "service_name",
              "type": "by"
            },
            {
              "colName": "num_of_calls",
              "type": "sum"
            }, {
              "colName": "statistics_time",
              "type": "by_month_of_year"
            }
          ]
          req["relation_condition"] = {
            "relation": "AND",
            "data": [
              {
                "relation": "or",
                "data": cond
              },
              {
                "relation": "AND",
                "data": [
                  {
                    "colName": "statistics_time",
                    "value": moment().subtract(11, 'month').format('YYYY-MM-DD'),
                    "ruleType": "ge"
                  },
                  {
                    "colName": "statistics_time",
                    "value": moment().add(1, 'days').format('YYYY-MM-DD'),
                    "ruleType": "le"
                  }
                ]
              }
            ]
          }
          req2.condition = [
            {
              "colName": "cert_time",
              "value": moment().subtract(11, 'month').format('YYYY-MM-DD'),
              "ruleType": "ge"
            },
            {
              "colName": "cert_time",
              "value": moment().add(1, 'days').format('YYYY-MM-DD'),
              "ruleType": "le"
            }
          ]
        }
        let url = this.getServiceUrl("select", req.serviceName, "log")
        this.axios({ method: "POST", url: url, data: req })
          .then(res => {
            let data = res.data.data
            data.map(datas => {
              if (datas.service_name == "DI_ADI_REGISTER_INFO_select") {
                datas.name = "门诊诊疗挂号记录"
              } else if (datas.service_name == "DI_ADI_DRUREC_INFO_select") {
                datas.name = "门急诊诊疗医嘱"
              } else if (datas.service_name == "DI_ADI_LAREXA_INFO_select") {
                datas.name = "门急诊诊疗检查报告"
              } else if (datas.service_name == "DI_HDI_INRECORD_INFO_select") {
                datas.name = "住院诊疗入院记录"
              } else if (datas.service_name == "DI_HDI_DRUREC_INFO_select") {
                datas.name = "住院诊疗医嘱信息"
              } else if (datas.service_name == "DI_HDI_LAREXA_INFO_select") {
                datas.name = "住院诊疗检验报告"
              }
            })
            this.getCountData(data, type, tabsShow)
          }).catch(err => { console.log(err) })
        let url2 = this.getServiceUrl("select", req2.serviceName, "emr")
        this.axios({ method: "POST", url: url2, data: req2 }).then(res => {
          let data = res.data.data
          console.log("验证次数：", res.data.data)
          this.getCountData(data, type, tabsShow, "verify_count")
        }).catch(err => { console.log(err) })
      } else if (tabsShow == 3) { // 电子病历采集电子病历采集
        let cond = [
          {
            "colName": "record_type",
            "value": "门诊诊疗挂号记录",
            "ruleType": "eq"
          },
          {
            "colName": "record_type",
            "value": "门急诊诊疗医嘱",
            "ruleType": "eq"
          },
          {
            "colName": "record_type",
            "value": "门急诊诊疗检查报告",
            "ruleType": "eq"
          },
          {
            "colName": "record_type",
            "value": "住院诊疗入院记录",
            "ruleType": "eq"
          },
          {
            "colName": "record_type",
            "value": "住院诊疗医嘱信息",
            "ruleType": "eq"
          },
          {
            "colName": "record_type",
            "value": "住院诊疗检验报告",
            "ruleType": "eq"
          }
        ]
        let req = {
          "serviceName": "srvemr_record_count_by_hour_select",
          "colNames": ["*"],
          "group": [
            {
              "colName": "record_type",
              "type": "by"
            },
            {
              "colName": "hospital",
              "type": "by"
            }, {
              "colName": "amount",
              "type": "sum"
            }, {
              "colName": "count_hour",
              "type": "by_hour"
            }
          ],
        }
        let url = this.getServiceUrl("select", req.serviceName, "emr")
        if (type == "day") {
          req["relation_condition"] = {
            "relation": "AND",
            "data": [
              {
                "relation": "or",
                "data": cond
              },
              {
                "relation": "AND",
                "data": [
                  {
                    "colName": "count_hour",
                    "value": moment().subtract(23, 'hours').format("YYYY-MM-DD HH"),
                    "ruleType": "ge"
                  },
                  {
                    "colName": "count_hour",
                    "value": moment().format("YYYY-MM-DD HH"),
                    "ruleType": "le"
                  }
                ]
              }
            ]
          }

        } else if (type == "week") {
          req["relation_condition"] = {
            "relation": "AND",
            "data": [
              {
                "relation": "or",
                "data": cond
              },
              {
                "relation": "AND",
                "data": [
                  {
                    "colName": "count_hour",
                    "value": moment().subtract(6, 'days').format('YYYY-MM-DD'),
                    "ruleType": "ge"
                  },
                  {
                    "colName": "count_hour",
                    "value": moment().add(1, 'days').format('YYYY-MM-DD'),
                    "ruleType": "le"
                  }
                ]
              }
            ]
          }
          req["group"][3] = {
            "colName": "count_hour",
            "type": "by_date"
          }
        } else if (type == "month") {
          req["group"][3] = {
            "colName": "count_hour",
            "type": "by_date"
          }
          req["relation_condition"] = {
            "relation": "AND",
            "data": [
              {
                "relation": "or",
                "data": cond
              },
              {
                "relation": "AND",
                "data": [
                  {
                    "colName": "count_hour",
                    "value": moment().subtract(30, 'days').format('YYYY-MM-DD'),
                    "ruleType": "ge"
                  },
                  {
                    "colName": "count_hour",
                    "value": moment().add(1, 'days').format('YYYY-MM-DD'),
                    "ruleType": "le"
                  }
                ]
              }
            ]
          }
        } else if (type == "year") {
          req["group"][3] = {
            "colName": "count_hour",
            "type": "by_month_of_year"
          }
          req["relation_condition"] = {
            "relation": "AND",
            "data": [
              {
                "relation": "or",
                "data": cond
              },
              {
                "relation": "AND",
                "data": [
                  {
                    "colName": "count_hour",
                    "value": moment().subtract(11, 'month').format('YYYY-MM-DD'),
                    "ruleType": "ge"
                  },
                  {
                    "colName": "count_hour",
                    "value": moment().add(1, 'days').format('YYYY-MM-DD'),
                    "ruleType": "le"
                  }
                ]
              }
            ]
          }
        }
        this.axios({ method: "POST", url: url, data: req }).then(res => {
          let data = res.data.data
          console.log("tabsShow-703:", data)
          this.getCountData(data, type, tabsShow)

        }).catch(err => {
          console.log(err);
        })
      }
    },
    getCountData(data, type, tabsShow, dataType) {
      let datas = data
      let xVal = []
      let rows = []
      if (type === 'day') {
        let hours = []
        for (let i = 1; i <= 24; i++) {
          hours.push(moment().subtract(23 - i, 'hours').format("HH"))
        }
        xVal = hours
      } else if (type === 'week') {
        let week = []
        for (let i = 1; i < 8; i++) {
          week.push(moment(this.timeHorizon.today).subtract(7 - i, 'days').format('YYYY-MM-DD'))
        }
        xVal = week
      } else if (type === 'month') {
        let days = []
        for (let i = 1; i < 31; i++) {
          days.push(moment(this.timeHorizon.today).subtract(30 - i, 'days').format('YYYY-MM-DD'))
        }
        xVal = days
      } else if (type === 'year') {
        let month = []
        for (let i = 1; i <= 12; i++) {
          month.push(moment().subtract(12 - i, 'month').format("YYYY-MM"))
        }
        xVal = month
      }
      type = type || 'day'
      if (tabsShow == 1) {
        let types = datas.map(item => item.cmd)
        types = Array.from(new Set(types))
        /**
         * 一卡通就诊次数
         * 左侧柱状图不分医院
         */
        xVal.map(hour => {
          let dataMap = {
            "住院": 0,
            "门诊": 0,
            "时间": ""
          }
          rows.push(dataMap)
          if (type === 'day') {
            if (hour < 10) {
              dataMap.时间 = hour.slice(1, 2) + "点"
            } else {
              dataMap.时间 = hour + "点"
            }
            // hospitals.map(hos => {
            types.map(item => {
              let count = 0
              datas.map(dataItem => {
                let dateHour = dataItem.ywfssj
                if (dateHour == hour && dataItem.cmd == item) {
                  count++
                }
                dataMap[item] = count
              })
            })
          } else if (type === 'week' || type === "month" || type === 'year') {
            dataMap.时间 = hour
            types.map(item => {
              let count = 0
              datas.map(dataItem => {
                let dateHour = dataItem.ywfssj
                if (dateHour == hour && dataItem.cmd == item) {
                  count++
                }
                dataMap[item] = count
              })
            })
          }
        })
        let bra1Data = {
          columns: ['时间', "门诊", "住院"],
          rows: rows
        }
        this.chartData01 = bra1Data
        /**
         *  各医院就诊分布
         * 
         */
        let pieHos = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼保健院", "宝塔区医院"]
        let pie1Data = {
          columns: ['医院', '就诊次数'],
          rows: []
        }
        pieHos.map(hos => { // 遍历医院
          let pieDataItem = {
            "医院": "",
            "就诊次数": 0
          }
          pie1Data.rows.push(pieDataItem)
          let pie1Count = 0
          for (let i = 0; i < datas.length; i++) {
            if (hos === datas[i].yljgmc) {
              pie1Count += datas[i].create_time
            }
          }
          pieDataItem.医院 = hos
          pieDataItem.就诊次数 = pie1Count
        })
        this.pieData1.hospital = pie1Data
        /**
         * 就诊刷卡类型分布
         */
        let cardType = datas.map(item => item.card_type)
        cardType = Array.from(new Set(cardType))
        let pie2Data = {
          columns: ['卡类型', '就诊次数'],
          rows: []
        }
        cardType.map(ct => {
          let pieDataItem = {
            "卡类型": '',
            "就诊次数": 0
          }
          let pie2Count = 0
          for (let i = 0; i < datas.length; i++) {
            if (ct === datas[i].card_type) {
              pie2Count += data[i].create_time
            }
          }
          pieDataItem.卡类型 = ct
          pieDataItem.就诊次数 = pie2Count
          pie2Data.rows.push(pieDataItem)
        })
        console.log('aaaaaaa', pie2Data)
        this.card1 = pie2Data
        /** 
         *  右侧柱状图分医院
         */
        let yljgmcName = datas.map(item => item.yljgmc)
        yljgmcName = Array.from(new Set(yljgmcName))
        yljgmcName = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼保健院", "宝塔区医院"]
        let ywfssjTime = datas.map(item => item.ywfssj)
        ywfssjTime = Array.from(new Set(ywfssjTime))
        ywfssjTime = xVal
        let cmdType = datas.map(item => item.cmd)
        cmdType = Array.from(new Set(cmdType))
        let cardTypes = datas.map(item => item.card_type)
        cardTypes = Array.from(new Set(cardTypes))
        // cardTypes = ["身份证", "社保卡", "就诊卡"]
        // console.error('cardTypes', cardTypes)
        let allChartData = {}
        let pieData = {}
        function getDataCount(yljgmcName, time, type, data, chartType) {
          let count = 0
          if (chartType === 'line') {

            for (let i = 0; i < data.length; i++) {
              if (data[i].yljgmc === yljgmcName && data[i].ywfssj == time && data[i].cmd === type)
                count += data[i].create_time
            }
          } else if (chartType === 'pie') {
            for (let i = 0; i < data.length; i++) {
              if (data[i].yljgmc === yljgmcName && data[i].card_type === type) {
                count += data[i].create_time
              }
            }
          } else if (chartType === 'pieb') {

            for (let i = 0; i < data.length; i++) {
              if (data[i].card_type === type)
                count += data[i].create_time
            }
          }
          return count
        }
        if (type === 'day') {
          for (let i = 0; i < yljgmcName.length; i++) {
            allChartData[yljgmcName[i]] = {}
            allChartData[yljgmcName[i]].columns = ['时间', "门诊", "住院"]
            allChartData[yljgmcName[i]].rows = []
            for (let j = 0; j < ywfssjTime.length; j++) {
              let itemData = {}
              for (let n = 0; n < cmdType.length; n++) {
                itemData[cmdType[n]] = getDataCount(yljgmcName[i], ywfssjTime[j], cmdType[n], datas, 'line')
                itemData['时间'] = ywfssjTime[j] + "点"
              }
              // allChartData[yljgmcName[i]].rows.push(itemData)
              if (itemData && itemData.门诊) {
                allChartData[yljgmcName[i]].rows.push(itemData)
              }
            }
          }
        } else if (type === 'week' || type === 'month' || type === 'year') {
          for (let i = 0; i < yljgmcName.length; i++) {
            allChartData[yljgmcName[i]] = {}
            allChartData[yljgmcName[i]].columns = ['时间', "门诊", "住院"]
            allChartData[yljgmcName[i]].rows = []
            for (let j = 0; j < ywfssjTime.length; j++) {
              let itemLineData = {}
              let itemPieData = {}
              for (let n = 0; n < cmdType.length; n++) {
                itemLineData[cmdType[n]] = getDataCount(yljgmcName[i], ywfssjTime[j], cmdType[n], datas, 'line')
                itemLineData['时间'] = ywfssjTime[j]
              }
              if (itemLineData) {
                allChartData[yljgmcName[i]].rows.push(itemLineData)
              }
            }
          }
        }

        for (let w = 0; w < yljgmcName.length; w++) {
          pieData[yljgmcName[w]] = {}
          pieData[yljgmcName[w]]['rows'] = []
          pieData[yljgmcName[w]].columns = ["卡类型", '就诊次数']
          for (let m = 0; m < cardTypes.length; m++) {
            let itemPieData = {}
            itemPieData["卡类型"] = cardTypes[m]
            itemPieData["就诊次数"] = getDataCount(yljgmcName[w], '', cardTypes[m], datas, 'pie')

            pieData[yljgmcName[w]].rows.push(itemPieData)
          }
          // pieData[yljgmcName[w]].rows.push(itemPieData)
        }
        this.hosData = allChartData
        console.log("allllll", allChartData)
        this.pieData = pieData
        /**
         * 右侧门诊、住院次数
         */
        let allCount = {}
        let hospital = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼保健院", "宝塔区医院"]
        hospital.map(hos => {
          allCount[hos] = {}
          allCount[hos]["门诊"] = 0
          allCount[hos]["住院"] = 0
          datas.map(data => {
            if (data.cmd == "门诊" && hos == data.yljgmc) {
              allCount[hos]["门诊"] += data.create_time
            } else if (data.cmd == "住院" && hos == data.yljgmc) {
              allCount[hos]["住院"] += data.create_time
            }
          })
        })
        this.countData = allCount
        /**
         * 右侧就诊刷卡类型分布
         * 
         * */
        let pie3Data = {}
        pieHos.map(hos => { // 遍历医院
          pie3Data[hos] = {}
          pie3Data[hos].columns = ['卡类型', '就诊次数']
          pie3Data[hos].rows = []
          // 遍历卡类型
          cardType.map(card => {
            let pie3Count = 0
            let rowsItem = {
              "卡类型": '',
              "就诊次数": 0
            }
            for (let i = 0; i < datas.length; i++) {
              if (card == datas[i].card_type) {
                pie3Count += data[i].create_time
              }
            }
            rowsItem.卡类型 = card
            rowsItem.就诊次数 = pie3Count
            pie3Data[hos].rows.push(rowsItem)
          })
        })
        // console.log("pie3Data", pie3Data)
      } else if (tabsShow == 2) {
        if (dataType && dataType == "verify_count") {
          let cardTypes = datas.map(item => item.card_type)
          cardTypes = Array.from(new Set(cardTypes))
          let verify_data = {
            columns: ["卡类型", "次数"],
            rows: []
          }
          // let allCount = 0
          cardTypes.map(ct => {
            let typeData = {
              "卡类型": '',
              "次数": 0
            }
            let cardCount = 0

            for (let i = 0; i < datas.length; i++) {
              if (ct === datas[i].card_type) {
                cardCount += data[i].cert_no
              }
              // allCount += data[i].cert_no
            }
            typeData.卡类型 = ct
            typeData.次数 = cardCount
            verify_data.rows.push(typeData)
          })

          console.log("verify_data", verify_data)
          this.sharePie2Data = verify_data
          // this.shareAllCount = allCount
        } else {
          let types = datas.map(item => item.name)
          types = Array.from(new Set(types))
          // emr-share左侧柱状图数据
          xVal.map(hour => {
            let dataMap = {
              "门急诊诊疗医嘱": 0,
              "门急诊诊疗检查报告": 0,
              "门诊诊疗挂号记录": 0,
              "住院诊疗医嘱信息": 0,
              "住院诊疗入院记录": 0,
              "住院诊疗检验报告": 0
            }
            rows.push(dataMap)
            if (type === "day") {
              if (hour < 10) {
                dataMap.时间 = hour.slice(1, 2) + "点"
              } else {
                dataMap.时间 = hour + "点"
              }
              types.map(item => {
                let count = 0
                datas.map(dataItem => {
                  let dateHour = dataItem.statistics_time
                  if (dateHour == hour && dataItem.name == item) {
                    count++
                  }
                  dataMap[item] = count
                })
              })
            } if (type === "week" || type === "month" || type === 'year') {
              dataMap.时间 = hour
              types.map(item => {
                let count = 0
                datas.map(dataItem => {
                  let dateHour = dataItem.statistics_time
                  if (dateHour == hour && dataItem.name == item) {
                    count++
                  }
                  dataMap[item] = count
                })
              })
            }
          })
          let bra1Data = {
            columns: ["时间", "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告",],
            rows: rows
          }
          this.shareBar1Data = bra1Data
          // emr-share 左上饼图
          let InTypes = datas.map(item => item.name) //就诊类型
          InTypes = Array.from(new Set(InTypes))
          let pie1Data = {
            columns: ["就诊记录", "就诊次数"],
            rows: []
          }
          InTypes.map(its => {
            let pieDataItem = {
              "就诊记录": "",
              "就诊次数": 0
            }
            pie1Data.rows.push(pieDataItem)
            let pie1Count = 0
            for (let i = 0; i < datas.length; i++) {
              if (its === datas[i].name) {
                pie1Count += data[i].num_of_calls
              }
            }
            pieDataItem.就诊记录 = its
            pieDataItem.就诊次数 = pie1Count
          })
          this.sharePie1Data = pie1Data
          // emr-share 左下下饼图 身份验证卡类型分布：（新表，新接口）

          // emr-share 右上柱状图  表里无医院这个字段 查出来的数据给中医医院
          let shareBar2Data = [{}, {}, {}, {}, {}, {}]
          // console.log("shareBar2Data", shareBar2Data);
          shareBar2Data[2] = {
            columns: ["时间", "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告",],
            rows: rows
          }
          console.log("shareBar2Data", shareBar2Data)
          this.shareBar2Data = shareBar2Data
        }
      } else if (tabsShow == 3) {
        console.log(data, type)
        let types = datas.map(item => item.record_type)
        types = Array.from(new Set(types))
        /**
         * 电子病历采集 左侧柱状图
         */
        xVal.map(hour => {
          let dataMap = {
            "门急诊诊疗医嘱": 0,
            "门急诊诊疗检查报告": 0,
            "门诊诊疗挂号记录": 0,
            "住院诊疗医嘱信息": 0,
            "住院诊疗入院记录": 0,
            "住院诊疗检验报告": 0
          }
          rows.push(dataMap)
          if (type === 'day') {
            if (hour < 10) {
              dataMap.时间 = hour.slice(1, 2) + "点"
            } else {
              dataMap.时间 = hour + "点"
            }
            types.map(item => {
              let count = 0
              datas.map(dataItem => {
                let dateHour = dataItem.count_hour
                if (dateHour == hour && dataItem.record_type == item) {
                  count += dataItem.amount
                }
                dataMap[item] = count
              })
            })
          } else if (type === 'week' || type === "month" || type === 'year') {
            dataMap.时间 = hour
            types.map(item => {
              let count = 0
              datas.map(dataItem => {
                let dateHour = dataItem.count_hour
                if (dateHour == hour && dataItem.record_type == item) {
                  count += dataItem.amount
                }
                dataMap[item] = count
              })
            })
          }
        })
        let bra1Data = {
          columns: ["时间", "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告",],
          rows: rows
        }
        this.collectBar1Data = bra1Data
        /**
         * 电子病历采集 左侧上方饼图
         */
        let pieHos = datas.map((item) => {
          return (item.hospital === 'fyyy' ? '市妇幼保健院' : item.hospital === 'rmyy' ? '市人民医院' : item.hospital === 'zyy' ? '市中医医院' : item.hospital === 'bayy' ? '博爱医院' : '-')

        })
        pieHos = Array.from(new Set(pieHos))
        let pie1Data = {
          columns: ['医院', '采集次数'],
          rows: []
        }
        pieHos.map(hos => { // 遍历医院
          let pieDataItem = {
            "医院": "",
            "采集次数": 0
          }

          let pie1Count = 0
          for (let i = 0; i < datas.length; i++) {
            if (hos === datas[i].hospital) {
              pie1Count += datas[i].amount
            }
          }
          pieDataItem.医院 = hos
          pieDataItem.采集次数 = pie1Count
          pie1Data.rows.push(pieDataItem)
        })
        this.collectPie1Data = pie1Data
        /**
         * 电子病历采集 左侧上方饼图
         */
        let recordTypes = datas.map(item => item.record_type) //就诊类型
        recordTypes = Array.from(new Set(recordTypes))
        let pie2Datas = {
          'columns': [],
          'rows': []
        }
        pie2Datas.columns = ['记录名', '记录次数']
        recordTypes.map(item => {
          let count = 0
          let dataPie = {
            '记录名': '',
            '记录次数': 0
          }
          datas.map(dataItem => {
            if (dataItem.record_type == item) {
              dataPie['记录名'] = item
              dataPie['记录次数'] += dataItem.amount
            }
            // dataPie[item] = count
          })
          pie2Datas.rows.push(dataPie)
        })
        // console.log("dataPie", dataPie)
        this.collectPie2Data = pie2Datas
        /** 
         *  右侧柱状图分医院
         */
        let hospitalName = datas.map((item) => {
          return item.hospital
        })
        hospitalName = Array.from(new Set(hospitalName))
        // hospitalName = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼保健院", "宝塔区医院"]
        let times = datas.map(item => item.count_hour)
        times = Array.from(new Set(times))
        times = xVal
        let recordType = datas.map(item => item.record_type)
        recordType = Array.from(new Set(recordType))
        // cardTypes = ["身份证", "社保卡", "就诊卡"]
        // console.error('cardTypes', cardTypes)
        let allChartData = {}
        let pieData = {}
        function getDataCount(yljgmcName, time, type, data, chartType) {
          let count = 0
          if (chartType === 'line') {

            for (let i = 0; i < data.length; i++) {
              if (data[i].hospital === yljgmcName && data[i].count_hour == time && data[i].record_type === type)
                count += data[i].amount
            }
          } else if (chartType === 'pie') {
            for (let i = 0; i < data.length; i++) {
              if (data[i].hospital === yljgmcName && data[i].record_type === type) {
                count += data[i].amount
              }
            }
          } else if (chartType === 'pieb') {

            for (let i = 0; i < data.length; i++) {
              if (data[i].record_type === type)
                count += data[i].amount
            }
          }
          return count
        }
        if (type === 'day') {
          for (let i = 0; i < hospitalName.length; i++) {
            allChartData[(hospitalName[i] === 'fyyy' ? '市妇幼保健院' : hospitalName[i] === 'rmyy' ? '市人民医院' : hospitalName[i] === 'zyy' ? '市中医医院' : hospitalName[i] === 'bayy' ? '博爱医院' : '-')] = {}
            allChartData[(hospitalName[i] === 'fyyy' ? '市妇幼保健院' : hospitalName[i] === 'rmyy' ? '市人民医院' : hospitalName[i] === 'zyy' ? '市中医医院' : hospitalName[i] === 'bayy' ? '博爱医院' : '-')].columns = ["时间", "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告",]
            allChartData[(hospitalName[i] === 'fyyy' ? '市妇幼保健院' : hospitalName[i] === 'rmyy' ? '市人民医院' : hospitalName[i] === 'zyy' ? '市中医医院' : hospitalName[i] === 'bayy' ? '博爱医院' : '-')].rows = []
            for (let j = 0; j < times.length; j++) {
              let itemData = {}
              for (let n = 0; n < recordType.length; n++) {
                itemData[recordType[n]] = getDataCount(hospitalName[i], times[j], recordType[n], datas, 'line')
                itemData['时间'] = times[j] + "点"
              }
              allChartData[(hospitalName[i] === 'fyyy' ? '市妇幼保健院' : hospitalName[i] === 'rmyy' ? '市人民医院' : hospitalName[i] === 'zyy' ? '市中医医院' : hospitalName[i] === 'bayy' ? '博爱医院' : '-')].rows.push(itemData)
            }
          }
        } else if (type === 'week' || type === 'month' || type === 'year') {
          for (let i = 0; i < hospitalName.length; i++) {
            allChartData[hospitalName[i]] = {}
            allChartData[hospitalName[i]].columns = ["时间", "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告",]
            console.log(allChartData)
            //  if (hospitalName[i] == "bayy") {
            //     allChartData["博爱医院"].rows = []
            //   } else if (hospitalName[i] == "fyyy") {
            //     allChartData["市妇幼保健院"].rows = []
            //   } else if (hospitalName[i] == "rmyy") {
            //     allChartData["市人民医院"].rows = []
            //   } else if (hospitalName[i] == "zyy") {
            //     allChartData["市中医医院"].rows = []
            //   }
            allChartData[(hospitalName[i] === 'fyyy' ? '市妇幼保健院' : hospitalName[i] === 'rmyy' ? '市人民医院' : hospitalName[i] === 'zyy' ? '市中医医院' : hospitalName[i] === 'bayy' ? '博爱医院' : '-')].rows = []
            for (let j = 0; j < times.length; j++) {
              let itemLineData = {}
              let itemPieData = {}

              for (let n = 0; n < recordType.length; n++) {
                itemLineData[recordType[n]] = getDataCount(hospitalName[i], times[j], recordType[n], datas, 'line')
                itemLineData['时间'] = times[j]
              }

              allChartData[(hospitalName[i] === 'fyyy' ? '市妇幼保健院' : hospitalName[i] === 'rmyy' ? '市人民医院' : hospitalName[i] === 'zyy' ? '市中医医院' : hospitalName[i] === 'bayy' ? '博爱医院' : '-')].rows.push(itemLineData)
            }

          }
        }

        for (let w = 0; w < hospitalName.length; w++) {
          pieData[(hospitalName[w] === 'fyyy' ? '市妇幼保健院' : hospitalName[w] === 'rmyy' ? '市人民医院' : hospitalName[w] === 'zyy' ? '市中医医院' : hospitalName[w] === 'bayy' ? '博爱医院' : '-')] = {}
          pieData[(hospitalName[w] === 'fyyy' ? '市妇幼保健院' : hospitalName[w] === 'rmyy' ? '市人民医院' : hospitalName[w] === 'zyy' ? '市中医医院' : hospitalName[w] === 'bayy' ? '博爱医院' : '-')]['rows'] = []
          pieData[(hospitalName[w] === 'fyyy' ? '市妇幼保健院' : hospitalName[w] === 'rmyy' ? '市人民医院' : hospitalName[w] === 'zyy' ? '市中医医院' : hospitalName[w] === 'bayy' ? '博爱医院' : '-')].columns = ["记录名", '记录次数']
          for (let m = 0; m < recordType.length; m++) {
            let itemPieData = {}
            itemPieData["记录名"] = recordType[m]
            itemPieData["记录次数"] = getDataCount(hospitalName[w], '', recordType[m], datas, 'pie')

            pieData[(hospitalName[w] === 'fyyy' ? '市妇幼保健院' : hospitalName[w] === 'rmyy' ? '市人民医院' : hospitalName[w] === 'zyy' ? '市中医医院' : hospitalName[w] === 'bayy' ? '博爱医院' : '-')].rows.push(itemPieData)
          }
          // pieData[yljgmcName[w]].rows.push(itemPieData)
        }
        this.collectBar2Data = allChartData
        this.collectPie3Data = pieData
        // 右侧下方门诊总数、住院总数
        let treatmentCount = {
          mz: 0,
          zy: 0
        }
        console.error("zzz", datas)
        datas.map(data => {
          if (data.record_type.indexOf("门急诊") != -1 || data.record_type.indexOf("门诊") != -1) {
            console.log(data.record_type, data.amount)
            treatmentCount.mz += data.amount
          } else if (data.record_type.indexOf("住院") != -1) {
            console.log(data.record_type, data.amount)
            treatmentCount.zy += data.amount
          }
        })
        this.collectMz = treatmentCount.mz
        this.collectZy = treatmentCount.zy
      }
    },
    toManangerment() {
      // 跳转到后台管理页面
      let str = window.location.href
      let num = str.indexOf("?");
      str = str.substr(num + 1);
      window.location.href = '../../main/index.html?' + str
    },
    checkTimeHorizon(time = "day") {
      this.checkDataType = time;
      if (time === "day") {
        this.getAllData('day', this.tabsShow)
      }
      else if (time === "week") {
        this.getAllData('week', this.tabsShow)
      }
      else if (time === "month") {
        this.getAllData('month', this.tabsShow)
      } else if (time === "year") {
        this.getAllData('year', this.tabsShow)
      }
    },
    autoChangeTab(interval) {
      // 自动切换tab
      setInterval(() => {
        if (this.tabsShow > 3) {
          this.tabsShow = 1
          this.tabsShow++
        } else {
          this.tabsShow++
        }
        this.changeTab(this.tabsShow)
      }, interval);
    },
    getChartData(type = "day", tabsShow = this.tabsShow) {
      if (tabsShow == 1) {

      }
    },
  },
  data() {
    return {
      tabsShow: 1,
      runTime: {
        cvs: "",
        emr: ""
      },
      showComponent: InTreatment,
      user: {
        user_no: ""
      },
      titleViewData: {
        title: "",
        date: ""
      },
      date: null,
      today: '',
      checkDataType: 'day',
      chartSetting1: {
        stack: {          用户: ['市人民医院', '中医医院', '博爱医院', '妇幼医院', "市中医医院", "市妇幼医院", "门诊", "住院", "DI_ADI_REGISTER_INFO_select", "门诊诊疗挂号记录"
            , "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告"]        }
      }
    };
  },
  computed: {
    swiperTop() {
      return this.$refs.swiperTop.swiper;
    }
  },
  created() {
    let date = "2018-8-31"
    let today = moment().format('YYYY-MM-DD') // moment获取本日日期
    let day_of_week = moment(today, 'YYYY-MM-DD').format('E'); // 计算指定日期是这周第几天
    // let week_start = moment(today).subtract(day_of_week - 1, 'days').format('YYYY-MM-DD'); // 周一日期
    let week_start = moment(today).subtract(6, 'days').format('YYYY-MM-DD'); // 六天前
    let week_end = today // 今天
    // let week_end = moment(today).add(7 - day_of_week, 'days').format('YYYY-MM-DD'); // 周日日期
    let month_start = moment(today).subtract(30, 'days').format('YYYY-MM-DD') // 30天前
    // let month_start = moment(today).startOf('month').format('YYYY-MM-DD'); // 本月第一天
    let month_end = moment(today).endOf('month').format('YYYY-MM-DD'); // 本月最后一天
    let day_count = parseInt(moment(today).endOf('month').format('DD')); // 本月天数
    let year_start = moment(today).subtract(11, 'month').format('YYYY-MM-DD') // 11个月之前
    let user = sessionStorage.getItem('current_login_user')
    top.user = JSON.parse(user)
    this.user = top.user
  },
  mounted() {
    setInterval(() => {
      this.date = moment().format('YYYY-MM-DD  HH:mm:ss');
      this.titleViewData.date = moment().format('YYYY-MM-DD  HH:mm:ss');
    }, 1000);
    // this.getRunTime()
    // this.getAllData('day', this.tabsShow)
    // this.autoChangeTab(10000) // 自动切换Tab
  }
};
</script>

<style lang="scss">
* {
  color: rgba(255, 255, 255, 1);
}
html,
body {
  height: 100vh;
  zoom: 1;
  background: #0b0f34;
  // overflow: hidden;
  margin: 0;
  padding: 0;
}
.active {
  line-height: 1.4rem;
  background-color: rgba(0, 119, 255, 0.986);
}

.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 40px;
  height: 40px;
  .title_left {
    flex: 1;
    text-align: left;
  }

  .title_title {
    font-size: 25px;
    text-align: center;
    color: #007aff;
    flex: 1;
  }

  .title_right {
    justify-content: flex-end;
    display: flex;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    .nowdate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 1.2rem;
      padding-right: 20px;
      // color: #d13d2a;
      font-weight: 600;
    }
    .accountInfo {
      display: inline-block;
      // height: 50px;
      min-width: 130px;
      span {
        font-weight: 600;
      }
    }
    .btn {
      cursor: pointer;
      text-align: center;
      display: inline-block;
      // height: 30px;
      min-width: 80px;
      // line-height: 30px;
      margin: 0 20px;
      &:nth-child(2) {
        text-align: left;
        &:hover {
          background-color: transparent;
        }
      }
      &:hover {
        background-color: rgba(0, 119, 255, 0.986);
      }
    }
    .btn_logout {
      cursor: pointer;
      // line-height: 30px;
      // height: 30px;
      text-align: center;
      min-width: 50px;
      margin-left: 10px;
      &:hover {
        background-color: rgba(0, 119, 255, 0.986);
      }
    }
  }
  @media screen and (max-width: 1366px) {
    html,
    body {
      font-size: 14px !important;
    }
    .title_title {
      font-size: 20px;
    }
    .title_right {
      font-size: 14px;
      .nowdate {
        font-size: 14px;
        padding-right: 5px;
      }
      .accountInfo {
        min-width: 80px;
      }
      .btn_logout {
        min-width: 30px;
      }
    }
  }
}

.wrap {
  background: #0b0f34;
  width: 100vw;
  // height: 100%;
  height: 100vh;
  box-sizing: border-box;
  // zoom: 1;
  // min-width: 1500px;
  // overflow-y: scroll;
  .main {
    box-sizing: border-box;
    margin: 0 auto;
    padding: 0 20px;
    // height: 95vh;
    height: calc(100% - 40px);
    background: url("../assets/images/wrapper-bg.png") no-repeat;
    background-size: 100% 100%;
    // overflow: hidden;
    zoom: 1;
  }
  @media screen and(max-width: 1366px) {
    .main {
      height: calc(100% - 25px);
    }
  }
  .header {
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      margin: 0 0 0 30px;
      // height: 50px;
      // line-height: 50px;
      .top_left {
        display: flex;
        width: 23%;
        height: 40px;
        margin-bottom: 10px;
        box-sizing: border-box;
        justify-content: space-around;
        line-height: 50px;
        .page_name {
          font-size: 1.2rem;
          line-height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #0084ff;
          &.tabactive {
            border-bottom: 3px solid #007aff;
          }
        }
        @media screen and (max-width: 1366px) {
          .page_name {
            font-size: 1rem;
          }
        }
      }
      .top_right {
        display: flex;
        align-items: center;
        .accountInfo {
          display: inline-block;
          // height: 50px;
          min-width: 130px;
          span {
            font-weight: 600;
          }
        }
        .btn {
          cursor: pointer;
          text-align: center;
          display: inline-block;
          height: 30px;
          min-width: 80px;
          line-height: 30px;
          margin-right: 20px;
          &:nth-child(2) {
            text-align: left;
            &:hover {
              background-color: transparent;
            }
          }
          &:hover {
            background-color: rgba(0, 119, 255, 0.986);
          }
        }
        .btn_logout {
          cursor: pointer;
          line-height: 30px;
          height: 30px;
          text-align: center;
          min-width: 50px;
          &:hover {
            background-color: rgba(0, 119, 255, 0.986);
          }
        }
      }
    }
    .top_header {
      display: flex;
      // height: 30px;
      justify-content: space-between;
      box-sizing: border-box;
      width: 28%;
      .top_header_item {
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        text-align: left;
        text-indent: 20px;
        flex: 1;
        .all_number {
          text-indent: 1rem;
          color: #0084ff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      @media screen and (max-width: 1366px) {
        .top_header_item {
          font-size: 0.8rem;
          &:first-child {
            flex: 1;
            // margin-right: 20px;
          }
          &:last-child {
            flex: 0.8;
          }
        }
      }
      .tabbtn {
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 119, 255, 0.986);
        }
      }
    }
    @media screen and(max-width: 1366px) {
      .top_header {
        width: 31%;
      }
    }
    .time_horizon {
      display: flex;
      box-sizing: border-box;
      margin: 5px 50px;
      .time_horizon_item {
        cursor: pointer;
        width: 70px;
        line-height: 1rem;
        font-size: 1rem;
        margin: 0.4rem 0;
        text-align: center;
        border-right: 1px solid rgba(27, 40, 228, 0.322);
        &.active {
          line-height: 1.8rem;
          padding: 0 0.2rem;
          background-color: rgba(0, 119, 255, 0.986);
          margin: 0;
        }
        &:hover {
          line-height: 1.8rem;
          margin: 0;
          background-color: rgba(27, 40, 228, 0.322);
        }
      }
      @media screen and (max-width: 1366px) {
        .time_horizon_item {
          font-size: 0.8rem;
          line-height: 0.8rem;
          &.active {
            line-height: 1.4rem;
            padding: 0 0.2rem;
            background-color: rgba(0, 119, 255, 0.986);
            margin: 0;
          }
          &:hover {
            line-height: 1.2rem;
            margin: 0;
            background-color: rgba(27, 40, 228, 0.322);
          }
        }
      }
    }
  }
  .content {
    display: flex;
    height: calc(100% - 140px);
    justify-content: space-between;
    margin: 20px 0;
    box-sizing: border-box;
    .item_title {
      height: 40px;
      line-height: 40px;
      text-align: left;
      text-indent: 1rem;
    }
    .content_left {
      height: 100%;
      box-sizing: border-box;
      margin-right: 1rem;
      display: flex;
      .item_title {
        height: 40px;
        line-height: 40px;
        text-align: left;
        text-indent: 1rem;
        margin: 0.5rem 0.5rem 0 0;
      }
      .content_left_left {
        height: 100%;
        box-sizing: border-box;
        float: left;
        width: 70%;
        padding: 1rem;
        padding-left: 1vw;
        .big-title {
          padding: 0 20px;
          text-align: center;
          line-height: 50px;
          font-size: 1.2rem;
        }
        @media screen and (max-width: 1366px) {
          .big-title {
            padding: 0 10px;
            text-align: center;
            font-size: 1rem;
          }
        }
      }
      .content_left_right {
        padding-top: 1vh;
        height: 100%;
        margin: 0px 0px 0px 10px;
        width: 30%;
        display: flex;
        flex-direction: column;
        .content_left_right_item {
          &:first-child {
            margin-bottom: 10px;
          }
        }
      }
    }
    .content_right {
      position: relative;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      padding: 0px;
      .content_right_top {
        height: 30px;
        line-height: 30px;
        margin-bottom: 5px;
        text-align: left;
        text-indent: 20px;
        .swiper-slide {
          height: 100%;
          opacity: 0.4;
        }
        .swiper-slide-active {
          opacity: 1;
        }
      }
      .content_right_content {
        height: calc(50% - 10px);
        box-sizing: border-box;
        .tab_check {
          display: flex;
          margin: 20px auto;
          line-height: 30px;
          justify-content: center;
          .check_item {
            padding: 0 13px;
            cursor: pointer;
            font-size: 15px;
            border-bottom: 1px solid #007aff;
            &.activity {
              color: #fff;
              border-top-right-radius: 5px;
              border-top-left-radius: 5px;
              border: 1px solid #024994;
              background-color: #007aff;
              border-bottom: none;
            }
          }
          @media screen and (max-width: 1366px) {
            .check_item {
              font-size: 0.6rem;
              padding: 0 5px;
            }
          }
        }
        @media screen and (max-width: 1366px) {
          .tab_check {
            margin: 10px auto;
          }
        }
        .swiper-container {
          padding-top: 50px;
          height: 100%;
          position: relative;
        }
      }
      .content_right_bottom {
        height: calc(50% - 50px);
        margin: 10px;
        display: flex;
        justify-content: space-between;
        .content_right_bottom_item {
          width: 49%;
          font-size: 14px;
          &:first-child {
            box-sizing: border-box;
            background-image: url("../assets/images/panel-l-b.png");
            background-size: 100% 100%;
            width: 45%;
            height: 100%;
            margin: auto;
            font-size: 14px;
            // min-height: 6rem;
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-direction: column;
            div {
              .text-val {
                font-size: 2rem;
                overflow: hidden;
                text-align: center;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #007aff;
              }
              .label {
                font-size: 1rem;
                text-align: center;
              }
              @media screen and (max-width: 1680px) {
                .text-val {
                  font-size: 1.2rem;
                }
                .label {
                  font-size: 1rem;
                }
              }
              @media screen and (max-width: 1366px) {
                .label {
                  font-size: 0.8rem;
                }
                .text-val {
                  font-size: 1rem;
                }
              }
            }
          }
          .border-box-content {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            div {
              display: flex;
              flex-direction: column;
              height: 35%;
              .text-val {
                font-size: 2rem;
                color: #007aff;
                line-height: 3rem;
              }
              .label {
                font-size: 1rem;
                text-align: center;
              }
            }
          }
        }
      }
      @media screen and(max-width:1366px) {
        .content_right_bottom {
          height: calc(50% - 30px);
        }
      }
    }
  }
}
@media screen and (max-width: 1366px) {
  .title {
    height: 25px;
  }
  .wrap {
    height: calc(100vh-25px);
  }
}
.dv-border-box-8 {
  @media screen and (max-width: 1366px) {
    .border-box-content {
      font-size: 0.8rem;
    }
  }
}
.carousel-demo4 {
  position: relative;
  .h-carousel-pagination {
    margin-top: 10px;
    height: 100px;
    .h-carousel-pagination-item {
      float: left;
      width: 25%;
      cursor: pointer;
      > img {
        width: 100%;
        height: 100px;
        opacity: 0.5;
        transition: 0.3s;
      }
      &.active,
      &:hover {
        > img {
          opacity: 1;
        }
      }
    }
  }
}
.col-65 {
  width: 65%;
}
.col-35 {
  width: 35%;
}
</style>
