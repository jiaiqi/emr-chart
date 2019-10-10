<template>
  <div class="wrap">
    <view-title :titleViewData="titleViewData" :user="user"></view-title>
    <div class="main">
      <view-tabs :tabsData="tabsData" @viewtabs="viewtabs"></view-tabs>
      <time-type @showTimeType="getTimeType"></time-type>
      <onecard-content :contentData="contentData" :chartSetting="chartSetting1"></onecard-content>
    </div>
  </div>
</template>

<script>
let moment = require('moment');
import ViewTitle from '@/components/ViewTitle'
import ViewTabs from '@/components/ViewTabs'
import TimeType from "@/components/TimeType";
import OnecardContent from '@/components/OnecardContent'
export default {
  name: "onecard",
  components: { ViewTitle, ViewTabs, TimeType, OnecardContent },
  methods: {
    getBar1data(currentPage) {
      let datas = this.allData.Bar1
      let rows = []
      let timeType = this.checkDataType
      let xVal = this.getXaxis(timeType)
      let bar1Data = {}
      if (currentPage === 'oneCard') {
        let types = this.getCols(datas, "cmd")
        xVal.map(hour => {
          let dataMap = {
            "住院": 0,
            "门诊": 0,
            "时间": ""
          }
          rows.push(dataMap)
          if (timeType === 'day') {
            if (hour < 10) {
              dataMap.时间 = hour.slice(1, 2) + "点"
            } else {
              dataMap.时间 = hour + "点"
            }
            types.map(item => {
              let count = 0
              datas.map(dataItem => {
                let dateHour = dataItem.ywfssj
                if (dateHour == hour && dataItem.cmd == item) {
                  count += dataItem.create_time
                }
              })
              dataMap[item] = count
            })
          } else if (timeType === 'week' || timeType === "month" || timeType === 'year') {
            dataMap.时间 = hour
            types.map(item => {
              let count = 0
              datas.map(dataItem => {
                let dateHour = dataItem.ywfssj
                if (dateHour == hour && dataItem.cmd == item) {
                  count += dataItem.create_time
                }
              })
              dataMap[item] = count
            })
          }
        })
        bar1Data = {
          columns: ['时间', "门诊", "住院"],
          rows: rows
        }
      } else if (currentPage === 'emrShare') {

      } else if (currentPage === 'emrCollect') { }
      this.contentData.firstBar.data = bar1Data
    },
    getPie1Data(currentPage) {
      let data = this.allData.Pie1
      let timeType = this.checkDataType
      let pie1Data = {
        columns: [],
        rows: []
      }
      if (data && currentPage == 'oneCard') {
        // 获取指标
        // let types = this.getCols(data, "yljgmc")
        let hospital = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院"]
        // 获取columns
        pie1Data.columns = ["医院", "就诊次数"]
        hospital.map(type => {
          let pie1DataItem = {
            "医院": "",
            "就诊次数": 0
          }
          pie1DataItem.医院 = type
          pie1Data.rows.push(pie1DataItem)
          for (let i = 0; i < data.length; i++) {
            if (type === data[i].yljgmc) {
              pie1DataItem.就诊次数 = data[i].create_time
            }
          }
        })
      } else if (currentPage === 'emrShare') {

      } else if (currentPage === 'emrCollect') { }
      this.contentData.firstPie.data = pie1Data
    },
    getPie2Data(currentPage) {
      let datas = this.allData.Pie2
      // let cardType = this.getCols(datas, "card_type")
      let pie2Data = {
        columns: [],
        rows: []
      }
      if (currentPage === 'oneCard') {
        let cardType = ["社保卡", "就诊卡", "身份证"]
        pie2Data.columns = ['卡类型', '就诊次数'],
          cardType.map(ct => {
            let pieDataItem = {
              "卡类型": '',
              "就诊次数": 0
            }
            pieDataItem.卡类型 = ct
            let pie2Count = 0
            for (let i = 0; i < datas.length; i++) {
              if (ct === datas[i].card_type) {
                pie2Count += datas[i].create_time
              }
            }
            pieDataItem.卡类型 = ct
            pieDataItem.就诊次数 = pie2Count
            pie2Data.rows.push(pieDataItem)
          })
      } else if (currentPage === 'emrShare') {

      } else if (currentPage === 'emrCollect') { }
      this.contentData.secondPie.data = pie2Data
    },
    getBar2Data(currentPage) {
      let datas = this.allData.Bar2
      let bar2Arr = []
      let timeType = this.checkDataType
      let xVal = this.getXaxis(timeType)
      let bar1Data = {}
      if (currentPage === 'oneCard') {
        // let hospital = this.getCols(datas, "yljgmc")
        let hospital = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院"]
        if (hospital && hospital.length > 0) {
          let types = this.getCols(datas, "cmd")
          types = ['住院', '门诊']
          hospital.map(hos => {
            let obj = {
              columns: ['时间', '住院', '门诊'],
              rows: []
            }
            xVal.map(hour => {
              let dataMap = {
                "住院": 0,
                "门诊": 0,
                "时间": ""
              }
              obj.rows.push(dataMap)
              if (timeType === 'day') {
                if (hour < 10) {
                  dataMap.时间 = hour.slice(1, 2) + "点"
                } else {
                  dataMap.时间 = hour + "点"
                }
                types.map(item => {
                  let count = 0
                  datas.map(dataItem => {
                    let dateHour = dataItem.ywfssj
                    if (dateHour == hour && dataItem.cmd == item && dataItem.yljgmc === hos) {
                      count += dataItem.create_time
                    }
                  })
                  dataMap[item] = count
                })
              } else if (timeType === 'week' || timeType === "month" || timeType === 'year') {
                dataMap.时间 = hour
                types.map(item => {
                  let count = 0
                  datas.map(dataItem => {
                    let dateHour = dataItem.ywfssj
                    if (dateHour == hour && dataItem.cmd == item && dataItem.yljgmc === hos) {
                      count += dataItem.create_time
                    }
                  })
                  dataMap[item] = count
                })
              }
            })
            bar2Arr.push(obj)
          })
          this.contentData.secondBar.data = bar2Arr
        }
      } else if (currentPage === 'emrShare') {

      } else if (currentPage === 'emrCollect') { }

    },
    getPie3Data(currentPage) {
      let data = this.allData.Pie3
      let pie3Arr = []
      if (currentPage === 'oneCard') {
        let hospital = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院"]
        // let hospital = this.getCols(data, "yljgmc")
        this.contentData.tabCheckItem = hospital
        if (hospital && hospital.length > 0) {
          // let cardType = this.getCols(data, "card_type")
          let cardType = ["社保卡", "就诊卡", "身份证"]
          hospital.map((hos, i) => {
            let obj = {
              columns: ['卡类型', '就诊次数'],
              rows: []
            }
            cardType.map(card => {
              let count = 0
              data.map(dataItem => {
                if (dataItem.yljgmc === hos && dataItem.card_type === card) {
                  count = dataItem.create_time
                }
              })
              obj.rows.push({
                "卡类型": card,
                "就诊次数": count
              })
            })
            pie3Arr.push(obj)
          })
        }
      } else if (currentPage === 'emrShare') {

      } else if (currentPage === 'emrCollect') { }
      this.contentData.thirdPie.data = pie3Arr
    },
    getCount(currentPage) {
      let datas = this.allData.countData
      let hospital = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院"]
      // let hospital = this.contentData.tabCheckItem
      let countArr = []
      if (hospital && hospital.length > 0) {
        if (currentPage === 'oneCard') {
          hospital.map(hos => {
            let obj = {
              "门诊": 0,
              "住院": 0
            }
            countArr.push(obj)
            datas.map(data => {
              if (data.cmd == "门诊" && hos == data.yljgmc) {
                obj["门诊"] += data.create_time
              } else if (data.cmd == "住院" && hos == data.yljgmc) {
                obj["住院"] += data.create_time
              }
            })
          })
        } else if (currentPage === 'emrShare') {

        } else if (currentPage === 'emrCollect') { }
        console.log("countArr:", countArr)
        this.contentData.countData = countArr
      }
    },
    getAllChartData(currentPage) {
      this.getBar1data(currentPage)
      setTimeout(() => {
        this.getPie1Data(currentPage)
        setTimeout(() => {
          this.getPie2Data(currentPage)
          setTimeout(() => {
            this.getBar2Data(currentPage)
            setTimeout(() => {
              this.getPie3Data(currentPage)
              setTimeout(() => {
                this.getCount(currentPage)
              }, 200);
            }, 200);
          }, 200);
        }, 200);
      }, 200);
    },
    async getRunTime() {
      // 获取累计运行时间
      let runTime = {}
      let req = { serviceName: "srvlog_apps_onlie_time_select" }
      let url = this.getServiceUrl("select", req.serviceName, "monitor")
      let res = await this.axios.post(url, req)
      let data = res.data.data
      runTime = Object.assign(...data)
      this.runTime = runTime
      if (this.contentData.currentPage === 'oneCard') {
        this.tabsData.runTime = this.secondToTime(runTime.CVS)
      } else if (this.contentData.currentPage === 'emrShare' || this.contentData.currentPage === "emrCollect") {
        this.tabsData.runTime = this.secondToTime(runTime.EMR)
      }
      // console.log("\n\n\n\n", res, "\n\n\n\n")
      if (res.status == 200 && res.statusText == "OK") {
        return { 'isRes': true, 'res': res }
      } else {
        return { 'isRes': false, 'res': res }
      }
    },
    getTimeSection(type = 'day') {
      // 获取时间区间
      let start = ""
      let end = ""
      if (type === 'day') {
        start = moment().subtract(23, 'hours').format("YYYY-MM-DD HH") //大于当前时间往前推23个小时
        end = moment().add(1, 'hours').format("YYYY-MM-DD HH") //小于当前时间的下一个整点
      } else if (type === 'week') {
        start = moment().subtract(6, 'days').format('YYYY-MM-DD') // 六天前,
        end = moment().add(1, 'days').format('YYYY-MM-DD') // 今晚0点
      } else if (type === 'month') {
        start = moment().subtract(30, 'days').format('YYYY-MM-DD') // 30天前
        end = moment().add(1, 'days').format('YYYY-MM-DD') // 今晚0点,
      } else if (type === 'year') {
        start = moment().subtract(11, 'month').format('YYYY-MM-DD')
        end = moment().add(1, 'days').format('YYYY-MM-DD')
      }
      this.timeSection = {
        start: start,
        end: end
      }
    },
    async getAlldata() {
      let condition = []
      let timeGroupType = "by_hour"
      let type = this.checkDataType
      let currentPage = this.contentData.currentPage
      if (currentPage === 'oneCard') {
        this.contentData.firstBar.title = "一卡通就诊次数"
        this.contentData.firstPie.title = "各医院就诊分布"
        this.contentData.secondPie.title = "就诊刷卡类型分布"
        this.contentData.thirdPie.title = "就诊刷卡类型分布"
        this.contentData.firstBar.type = 'bar'
        let serviceName = "srvcvs_medical_records_select"
        this.getTimeSection(type)
        condition = [
          {
            "colName": "ywfssj",
            "value": this.timeSection.start,
            "ruleType": "ge"
          },
          {
            "colName": "ywfssj",
            "value": this.timeSection.end,
            "ruleType": "le"
          }
        ]
        if (type === 'week' || type === 'month') {
          timeGroupType = "by_date"
        } else if (type === 'year') {
          timeGroupType = "by_month_of_year"
        }
        let url = this.getServiceUrl("select", serviceName, "cvs")
        let reqa = {
          "serviceName": serviceName,
          "colNames": ["*"],
          "condition": condition,
          "group": [
            {
              "colName": "ywfssj", // 业务发生时间
              "type": timeGroupType
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
        let reqb = {
          "serviceName": serviceName,
          "colNames": ["*"],
          "condition": condition,
          "group": [
            {
              "colName": "yljgmc", // 医疗机构名称
              "type": "by"
            },
            {
              "colName": "create_time", // 要用来统计的字段
              "type": "count"
            }
          ]
        }
        let reqc = {
          "serviceName": serviceName,
          "colNames": ["*"],
          "condition": condition,
          "group": [
            {
              "colName": "card_type", // 卡类型
              "type": "by"
            },
            {
              "colName": "create_time",
              "type": "count"
            }
          ]
        }
        let reqd = {
          "serviceName": serviceName,
          "colNames": ["*"],
          "condition": condition,
          "group": [
            {
              "colName": "ywfssj", // 业务发生时间
              "type": timeGroupType
            },
            {
              "colName": "yljgmc", // 医疗机构名称
              "type": "by"
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
        let reqe = {
          "serviceName": serviceName,
          "colNames": ["*"],
          "condition": condition,
          "group": [
            {
              "colName": "yljgmc", // 医疗机构名称
              "type": "by"
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
        let reqf = {
          "serviceName": serviceName,
          "colNames": ["*"],
          "condition": condition,
          "group": [
            {
              "colName": "yljgmc", // 医疗机构名称
              "type": "by"
            },
            {
              "colName": "card_type", // 卡类型
              "type": "by"
            },
            {
              "colName": "create_time",
              "type": "count"
            }
          ]
        }
        let allData = {}
        let resa = await this.axios.post(url, reqa)
        allData.Bar1 = resa.data.data
        let resb = await this.axios.post(url, reqb)
        allData.Pie1 = resb.data.data
        let resc = await this.axios.post(url, reqc)
        allData.Pie2 = resc.data.data
        let resd = await this.axios.post(url, reqd)
        allData.Bar2 = resd.data.data
        let rese = await this.axios.post(url, reqe)
        allData.countData = rese.data.data
        let resf = await this.axios.post(url, reqf)
        allData.Pie3 = resf.data.data
        this.allData = allData
        this.getAllChartData(this.contentData.currentPage)
        if (resf.status == 200 && resf.statusText == "OK") {
          return { 'isRes': true, 'res': resa }
        } else {
          return { 'isRes': false, 'res': resa }
        }
        // this.axios({ method: "POST", url: url, data: reqa })
        //   .then(res => {
        //     allData.Bar1 = res.data.data
        //     this.contentData.firstBar.loading = false
        //     this.axios({ method: "POST", url: url, data: reqb })
        //       .then(res => {
        //         allData.Pie1 = res.data.data
        //         this.contentData.firstPie.loading = false
        //         this.axios({ method: "POST", url: url, data: reqc })
        //           .then(res => {
        //             allData.Pie2 = res.data.data
        //             this.contentData.secondPie.loading = false
        //             this.axios({ method: "POST", url: url, data: reqd })
        //               .then(res => {
        //                 allData.Bar2 = res.data.data
        //                 this.contentData.secondBar.loading = false
        //                 this.axios({ method: "POST", url: url, data: reqe })
        //                   .then(res => {
        //                     allData.countData = res.data.data
        //                     this.axios({ method: "POST", url: url, data: reqf })
        //                       .then(res => {
        //                         allData.Pie3 = res.data.data
        //                         console.log("allData::::", allData)
        //                         this.allData = allData
        //                         this.getAllChartData(this.contentData.currentPage)
        //                       }).catch(err => {
        //                         console.error(err)
        //                       })
        //                   }).catch(err => {
        //                     console.error(err)
        //                   })
        //               }).catch(err => {
        //                 console.error(err)
        //               })
        //           }).catch(err => {
        //             console.error(err)
        //           })
        //       }).catch(err => {
        //         console.error(err)
        //       })
        //   }).catch(err => {
        //     console.error(err)
        //   })
      } else if (currentPage === 'emrShare') {
        this.contentData.firstBar.title = "电子病历查询统计"
        this.contentData.firstPie.title = "各医院查询次数分布"
        this.contentData.secondPie.title = "身份验证卡类型分布"
        this.contentData.thirdPie.title = "身份验证卡类型分布"
        this.contentData.firstBar.type = 'bar'
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
        let req3 = {
          "serviceName": "srvlog_call_statistics_select",
          "colNames": ["*"],
          "group": [
            {
              "colName": "num_of_calls",
              "type": "sum"
            }
          ]
        }
        let req4 = {
          "serviceName": "srvemr_req_cert_select",
          "colNames": ["*"],
          "group": [
            {
              "colName": "cert_no",
              "type": "count"
            }
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
          req3["relation_condition"] = req["relation_condition"]
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
          req4.condition = [
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
          req3["relation_condition"] = req["relation_condition"]
          req4.condition = [
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
          req3["relation_condition"] = req["relation_condition"]
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
          req4.condition = [
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
          req3["relation_condition"] = req["relation_condition"]
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
          req4.condition = [
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
        let resa = await this.axios.post(url, req)
        let dataa = resa.data.data
        dataa.map(datas => {
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
        this.getCountData(dataa, type, currentPage)
        // this.axios({ method: "POST", url: url, data: req })
        //   .then(res => {
        //     let data = res.data.data
        //     data.map(datas => {
        //       if (datas.service_name == "DI_ADI_REGISTER_INFO_select") {
        //         datas.name = "门诊诊疗挂号记录"
        //       } else if (datas.service_name == "DI_ADI_DRUREC_INFO_select") {
        //         datas.name = "门急诊诊疗医嘱"
        //       } else if (datas.service_name == "DI_ADI_LAREXA_INFO_select") {
        //         datas.name = "门急诊诊疗检查报告"
        //       } else if (datas.service_name == "DI_HDI_INRECORD_INFO_select") {
        //         datas.name = "住院诊疗入院记录"
        //       } else if (datas.service_name == "DI_HDI_DRUREC_INFO_select") {
        //         datas.name = "住院诊疗医嘱信息"
        //       } else if (datas.service_name == "DI_HDI_LAREXA_INFO_select") {
        //         datas.name = "住院诊疗检验报告"
        //       }
        //     })
        //     console.log("emr-share-data:", data)
        //     this.getCountData(data, type, currentPage)
        //   }).catch(err => { console.log(err) })
        let url2 = this.getServiceUrl("select", req2.serviceName, "emr")
        let resb = await this.axios.post(url2, req2)
        let datab = resb.data.data
        this.getCountData(datab, type, currentPage, "verify_count")
        // this.axios({ method: "POST", url: url2, data: req2 }).then(res => {
        //   let data = res.data.data
        //   console.log("验证次数：", res.data.data)
        //   this.getCountData(data, type, currentPage, "verify_count")
        // }).catch(err => { console.log(err) })
        // 获取查询次数
        let emrShareCount = { select: 0, verify: 0 }
        let url3 = this.getServiceUrl("select", req.serviceName, "log")
        let resc = await this.axios.post(url3, req3)
        if (resc.data.data[0].num_of_calls == null) {
          emrShareCount.select = 0
        } else {
          emrShareCount.select = resc.data.data[0].num_of_calls
        }
        let url4 = this.getServiceUrl("select", req4.serviceName, "emr")
        let resd = await this.axios.post(url4, req4)
        let verifyCount = resd.data.data[0].cert_no
        if (verifyCount) {
          emrShareCount.verify = verifyCount
        } else {
          emrShareCount.verify = 0
        }
        let allEmrShareCount = []
        for (let i = 0; i < 6; i++) {
          allEmrShareCount.push({ select: 0, verify: 0 })
        }
        allEmrShareCount[2] = emrShareCount
        this.contentData.countData = allEmrShareCount
        if (resa.status == 200 && resa.statusText == "OK") {
          return { 'isRes': true, 'res': resa }
        } else {
          return { 'isRes': false, 'res': resa }
        }
        // this.axios({
        //   method: 'post',
        //   url: url3,
        //   data: req3
        // }).then(res => {
        //   console.log("allSelectNumdata,", res.data.data);
        //   if (res.data.data[0].num_of_calls == null) {
        //     emrShareCount.select = 0
        //   } else {
        //     emrShareCount.select = res.data.data[0].num_of_calls
        //   }
        //   let url4 = this.getServiceUrl("select", req4.serviceName, "emr")       // 获取验证次数
        //   this.axios({ method: 'post', url: url4, data: req4 }).then(res => {
        //     let verifyCount = res.data.data[0].cert_no
        //     if (verifyCount) {
        //       emrShareCount.verify = verifyCount
        //     } else {
        //       emrShareCount.verify = 0
        //     }
        //     console.log("emrShareCount:", emrShareCount);
        //     let allEmrShareCount = []
        //     for (let i = 0; i < 6; i++) {
        //       allEmrShareCount.push({ select: 0, verify: 0 })
        //     }
        //     allEmrShareCount[2] = emrShareCount
        //     this.contentData.countData = allEmrShareCount
        //   }).catch(err => { console.error(err); })
        // }).catch(err => { console.error(err); })
      } else if (currentPage === 'emrCollect') { // 电子病历采集电子病历采集
        this.contentData.firstBar.title = "电子病历采集数量"
        this.contentData.firstPie.title = "各医院采集数量分布"
        this.contentData.secondPie.title = "各类型记录分布"
        this.contentData.thirdPie.title = "各类型记录分布"
        this.contentData.firstBar.type = 'line'
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
        let reqPie3 = {
          "serviceName": "srvemr_record_count_by_hour_select",
          "colNames": ["*"],
          "group": [
            {
              "colName": "hospital", // 医疗机构名称
              "type": "by"
            },
            {
              "colName": "record_type", // 记录类型
              "type": "by"
            },
            {
              "colName": "amount",
              "type": "count"
            }
          ]
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
        let res = await this.axios.post(url, req)
        let data = res.data.data
        this.getCountData(data, type, currentPage)
        let resb = await this.axios.post(url, reqPie3)
        let datab = resb.data.data
        this.getCountData(datab, type, currentPage, "collectPie3")
        if (resb.status == 200 && res.statusText == "OK") {
          return { 'isRes': true, 'res': resb }
        } else {
          return { 'isRes': false, 'res': resb }
        }
        // this.axios({ method: "POST", url: url, data: req }).then(res => {
        //   let data = res.data.data
        //   console.log("emr-collect-data:", data)
        //   this.getCountData(data, type, currentPage)
        //   this.axios.post(url, reqPie3)
        //     .then(res => {
        //       console.log(res)
        //       this.getCountData(data, type, currentPage, "collectPie3")
        //     })
        //     .catch(err => {
        //       console.error(err);
        //     })
        // }).catch(err => {
        //   console.log(err);
        // })
      }
    },
    getCountData(data, type, currentPage, dataType) {
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
          week.push(moment().subtract(7 - i, 'days').format('YYYY-MM-DD'))
        }
        xVal = week
      } else if (type === 'month') {
        let days = []
        for (let i = 1; i < 31; i++) {
          days.push(moment().subtract(30 - i, 'days').format('YYYY-MM-DD'))
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
      if (currentPage == 'oneCard') {
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
      } else if (currentPage == 'emrShare') {
        if (dataType && dataType == "verify_count") {
          // 左侧下方饼图
          let cardTypes = datas.map(item => item.card_type)
          cardTypes = Array.from(new Set(cardTypes))
          cardTypes = ["身份证", "社保卡", "其它"]
          let verify_data = {
            columns: ["卡类型", "次数"],
            rows: []
          }
          let pie3DataArr = []
          for (let i = 0; i < 6; i++) {
            pie3DataArr.push({
              columns: ["卡类型", "次数"],
              rows: []
            })
            pie3DataArr[i].rows = [{ "卡类型": '社保卡', "次数": 0 }, { "卡类型": '身份证', "次数": 0 }, { "卡类型": '其它', "次数": 0 }]
          }
          cardTypes.map(ct => {
            let typeData = {
              "卡类型": '',
              "次数": 0
            }
            let cardCount = 0
            let otherCount = 0
            for (let i = 0; i < datas.length; i++) {
              if (ct === datas[i].card_type) {
                cardCount += data[i].cert_no
              } else {
                otherCount += data[i].cert_no
                typeData.卡类型 = "其它"
              }
            }
            typeData.卡类型 = ct
            typeData.次数 = cardCount
            verify_data.rows.push(typeData)
          })
          this.contentData.secondPie.data = verify_data
          pie3DataArr[2] = verify_data
          this.contentData.thirdPie.data = pie3DataArr
        } else if (dataType && dataType == "select_count") {

        } else {
          let types = datas.map(item => item.name)
          types = Array.from(new Set(types))
          types = ["门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告"]
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
          let bar1Data = {
            columns: ["时间", "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告"],
            rows: rows
          }
          // this.shareBar1Data = bra1Data
          this.contentData.firstBar.data = bar1Data
          // emr-share 左上饼图
          let InTypes = datas.map(item => item.name) //就诊类型
          InTypes = Array.from(new Set(InTypes))
          InTypes = ["门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告"]
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
          this.contentData.firstPie.data = pie1Data
          // emr-share 右上柱状图  表里无医院这个字段 查出来的数据给中医医院
          let shareBar2Data = [{}, {}, {}, {}, {}, {}]
          shareBar2Data.map(item => {
            item.columns = ["时间", "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告"]
            let rows2 = []
            let dataMap2 = {
              "门急诊诊疗医嘱": 0
            }
            rows.map(row => {
              dataMap2.时间 = row.时间
              rows2.push(dataMap2)
            })
            item.rows = rows2
          })
          shareBar2Data[2] = {
            columns: ["时间", "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告"],
            rows: rows
          }
          console.log("shareBar2Data", shareBar2Data)
          this.contentData.secondBar.data = shareBar2Data
        }
      } else if (currentPage == 'emrCollect') {
        let timeType = type
        console.log(data, type)
        let types = datas.map(item => item.record_type)
        types = Array.from(new Set(types))
        types = ["门急诊诊疗医嘱", "门急诊诊疗医嘱", "门诊诊疗挂号记录", "住院诊疗医嘱信息", "住院诊疗入院记录", "住院诊疗检验报告"]
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
        let bar1Data = {
          columns: ["时间", "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告"],
          rows: rows
        }
        this.contentData.firstBar.data = bar1Data
        /**
         * 电子病历采集 左侧上方饼图
         */
        let pieHos = datas.map((item) => {
          return (item.hospital === 'fyyy' ? '市妇幼保健院' : item.hospital === 'rmyy' ? '市人民医院' : item.hospital === 'zyy' ? '市中医医院' : item.hospital === 'bayy' ? '博爱医院' : '-')
        })
        pieHos = Array.from(new Set(pieHos))
        pieHos = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院"]
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
        // this.collectPie1Data = pie1Data
        // console.log("collectPie1Data:", pie1Data)
        this.contentData.firstPie.data = pie1Data
        /**
         * 电子病历采集 左侧下方饼图
         */
        let recordTypes = datas.map(item => item.record_type) //就诊类型
        recordTypes = Array.from(new Set(recordTypes))
        recordTypes = ["门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告"]
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
          dataPie['记录名'] = item
          if (datas && datas.length > 0) {
            datas.map(dataItem => {
              if (dataItem.record_type == item) {
                dataPie['记录次数'] += dataItem.amount
              }
              dataPie['记录名'] = item
              console.log("---记录名记录名记录名记录名记录名", item)
            })
          }
          pie2Datas.rows.push(dataPie)
        })
        console.log("collectPie2Data", pie2Datas)
        this.contentData.secondPie.data = pie2Datas
        /**
         *  右侧柱状图分医院
         */
        let bar2Arr = []
        let hospitalsArr = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院"]
        let collectTypes = ["门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告"]
        hospitalsArr.map(hospital => {
          let obj = {
            columns: ['时间'].concat(collectTypes),
            rows: []
          }
          xVal.map(hour => {
            let dataMap = {
              "时间": "",
              "门急诊诊疗医嘱": 0,
              "门急诊诊疗检查报告": 0,
              "门诊诊疗挂号记录": 0,
              "住院诊疗医嘱信息": 0,
              "住院诊疗入院记录": 0,
            }
            obj.rows.push(dataMap)
            if (timeType === 'day') {
              if (hour < 10) {
                dataMap.时间 = hour.slice(1, 2) + "点"
              } else {
                dataMap.时间 = hour + "点"
              }
              collectTypes.map(item => {
                let count = 0
                datas.map(dataItem => {
                  let dateHour = dataItem.count_hour
                  if (dateHour == hour && dataItem.record_type == item && dataItem.hospital === hospital) {
                    count += dataItem.amount
                  }
                })
                dataMap[item] = count
              })
            } else if (timeType === 'week' || timeType === "month" || timeType === 'year') {
              dataMap.时间 = hour
              types.map(item => {
                let count = 0
                datas.map(dataItem => {
                  let dateHour = dataItem.count_hour
                  if (dateHour == hour && dataItem.record_type == item && dataItem.hospital === hospital) {
                    count += dataItem.amount
                  }
                })
                dataMap[item] = count
              })
            }
          })
          bar2Arr.push(obj)
        })
        this.contentData.secondBar.data = bar2Arr
        console.log('CollectBar2Data----------------\n:', bar2Arr)
        // 右侧下方饼图
        let collectPie3Data = []
        if (dataType && dataType === 'collectPie3') {
          let hospital = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院"]
          let recordTypes = ["门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告"]
          hospital.map(hos => {
            let obj = {
              columns: ['记录类型', '记录次数'],
              rows: []
            }
            recordTypes.map(recordType => {
              let count = 0
              datas.map(dataItem => {
                if (dataItem.hospital === hos && dataItem.record_type === recordType) {
                  count = dataItem.amount
                }
              })
              obj.rows.push({
                "记录类型": recordType,
                "记录次数": count
              })
            })
            collectPie3Data.push(obj)
          })
        }
        this.contentData.thirdPie.data = collectPie3Data
        console.log("collectPie3Data", collectPie3Data)
        // 右侧下方门诊总数、住院总数
        let treatmentCount = {
          mz: 0,
          zy: 0
        }
        let hospital = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院"]
        let countArr = []
        hospital.map(hos => {
          let obj = {
            "门诊": 0,
            "住院": 0
          }
          countArr.push(obj)
          datas.map(data => {
            if (data.record_type.indexOf("门急诊") != -1 || data.record_type.indexOf("门诊") != -1 && hos == data.hospital) {
              obj["门诊"] += data.amount
            } else if (data.record_type.indexOf("住院") != -1 && hos == data.hospital) {
              obj["住院"] += data.amount
            }
          })
        })
        this.contentData.countData = countArr
        console.log("countArr", countArr)
      }
    },
    viewtabs(pageName) {
      this.contentData.currentPage = pageName.key;
      console.log("当前页：", pageName.value);
      this.checkDataType = 'day'
      this.getTimeType('day')
    },
    loginOut() {
      sessionStorage.clear();
      window.location.href = "/main/login_pages/login-fw.html"
    },
    toNav() {
      this.$router.push({ name: "navs", query: { from: "onecard" } })
    },
    async getTimeType(TimeType) {
      // 获取时间区间类型
      if (TimeType) {
        this.checkDataType = TimeType
      }
      let timeOutReq = new this.timeOut(30, 0, this.getAlldata)
      timeOutReq.reqFun()
    },
    toManangerment() {
      // 跳转到后台管理页面
      let str = window.location.href
      let num = str.indexOf("?");
      str = str.substr(num + 1);
      window.location.href = '../../main/index.html?' + str
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
    autoRefresh() {
      let RunTime = new this.timeOut(30, 0, this.getRunTime)
      RunTime.reqFun()
      RunTime.startTime()
      let timeOutReq = new this.timeOut(30, 0, this.getAlldata)
      timeOutReq.reqFun()
      timeOutReq.startTime()
    }
  },
  data() {
    return {
      tabsShow: 1,
      user: {
        user_no: ""
      },
      titleViewData: {
        title: "社保医疗一卡通融合平台",
        date: "",
        currentPage: "onecard" // oneCard、emrShare、emrCollect
      },
      tabsData: {
        tabs: [{
          key: 'oneCard',
          value: '一卡通就诊'
        },
        {
          key: 'emrShare',
          value: '电子病历共享'
        },
        {
          key: 'emrCollect',
          value: '电子病历采集'
        }
        ],
        runTime: ""
      },
      contentData: {
        currentPage: "oneCard",
        firstBar: {
          type: 'bar',
          title: "一卡通就诊次数",
          data: [],
          loading: true // 状态- 是否加载中
        },
        secondBar: {
          type: 'bar',
          tabCheckItem: ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院"],
          data: [], //各个医院的data
          loading: true // 状态- 是否加载中
        },
        firstPie: {
          type: 'pie',
          title: "各医院就诊分布",
          data: [],
          loading: true // 状态- 是否加载中
        },
        secondPie: {
          title: "就诊刷卡类型分布",
          data: [],
          loading: true // 状态- 是否加载中
        },
        thirdPie: {
          title: "各医院就诊刷卡类型分布",
          data: [],
          loading: true // 状态- 是否加载中
        },
        countData: []
      },
      timeSection: {
        start: "",
        end: ""
      },
      allData: {},
      checkDataType: 'day',
      chartSetting1: {
        stack: {
          用户: ['市人民医院', '中医医院', '博爱医院', '妇幼医院', "市中医医院", "市妇幼医院", "门诊", "住院", "门诊诊疗挂号记录"
            , "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告"]
        }
      }
    };
  },
  created() {
    let user = sessionStorage.getItem('current_login_user')
    top.user = JSON.parse(user)
    this.user = top.user
  },
  mounted() {
    this.getTimeType()
    // this.getRunTime()
    this.autoRefresh()
    // this.autoChangeTab(10000) // 自动切换Tab
  }
};
</script>

<style lang="scss">
.wrap {
  background: #0b0f34;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  .main {
    box-sizing: border-box;
    margin: 0 auto;
    padding: 0 20px;
    // height: 95vh;
    height: calc(100% - 40px);
    background: url("../assets/images/wrapper-bg.png") no-repeat;
    background-size: 100% 100%;
    zoom: 1;
  }
}
</style>
