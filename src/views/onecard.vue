<template>
  <div class="wrap">
    <view-title :titleViewData="titleViewData" :user="user"></view-title>
    <div class="main">
      <view-tabs :tabsData="tabsData" @viewtabs="viewtabs"></view-tabs>
      <time-type
        v-if="contentData.currentPage === 'oneCard'"
        @showTimeType="getTimeType"
        :timeType="checkDataType"
      ></time-type>
      <onecard-content
        v-if="contentData.currentPage === 'oneCard'"
        :contentData="contentData"
        :chartSetting="chartSetting1"
      ></onecard-content>
      <iframe-page v-else :url="pageUrl"></iframe-page>
    </div>
  </div>
</template>

<script>
let moment = require('moment');
import ViewTitle from '@/components/ViewTitle'
import ViewTabs from '@/components/ViewTabs'
import TimeType from "@/components/TimeType";
import OnecardContent from '@/components/OnecardContent'
import iframePage from '@/components/iframePage'
export default {
  name: "onecard",
  components: { ViewTitle, ViewTabs, TimeType, OnecardContent, iframePage },
  methods: {
    getBar1data (currentPage, originData) {
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
              if (item == 'register') {
                dataMap[ '门诊' ] = count
              } else if (item == 'inpatient') {
                dataMap[ '住院' ] = count
              }
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
              if (item == 'register') {
                dataMap[ '门诊' ] = count
              } else if (item == 'inpatient') {
                dataMap[ '住院' ] = count
              }
            })
          }
        })
        bar1Data = {
          columns: [ '时间', "门诊", "住院" ],
          rows: rows
        }
      } else if (currentPage == 'emrShare') {

      } else if (currentPage == 'emrCollect') {
        let types = this.getCols(originData, "record_type")
        if (originData.length > 0) {

          xVal.map(hour => {
            let dataMap = {}
            rows.push(dataMap)
            if (timeType === 'day') {
              if (hour < 10) {
                dataMap.时间 = hour.slice(1, 2) + "点"
              } else {
                dataMap.时间 = hour + "点"
              }
              types.map(item => {
                let count = 0
                originData.map(dataItem => {
                  let dateHour = dataItem.count_hour
                  if (dateHour == hour && dataItem.record_type == item) {
                    count += dataItem.amount
                  }
                })
                dataMap[ item ] = count
              })
            } else if (timeType === 'week' || timeType === "month" || timeType === 'year') {
              dataMap.时间 = hour
              types.map(item => {
                let count = 0
                originData.map(dataItem => {
                  let dateHour = dataItem.count_hour
                  if (dateHour == hour && dataItem.record_type == item) {
                    count += dataItem.amount
                  }
                })
                dataMap[ item ] = count
              })
            }
          })
          bar1Data = {
            columns: [ '时间' ].concat(types),
            rows: rows
          }

        }
      }
      this.contentData.firstBar.data = bar1Data
    },
    getPie1Data (currentPage, originData) {
      let data = this.allData.Pie1
      let timeType = this.checkDataType
      let pie1Data = {
        columns: [],
        rows: []
      }
      if (data && currentPage == 'oneCard') {
        // 获取指标
        let hospital = this.getCols(data, "yljgmc")
        // let hospital = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院"]
        // 获取columns
        pie1Data.columns = [ "医院", "就诊次数" ]
        hospital.map(type => {
          let pie1DataItem = {
            "医院": "",
            "就诊次数": 0
          }
          pie1DataItem.医院 = type
          pie1Data.rows.push(pie1DataItem)
          for (let i = 0; i < data.length; i++) {
            if (type === data[ i ].yljgmc) {
              pie1DataItem.就诊次数 = data[ i ].create_time
            }
          }
        })
      } else if (currentPage == 'emrShare') {

      } else if (currentPage === 'emrCollect') {
        // 获取指标
        // let types = this.getCols(data, "yljgmc")
        let hospital = [ "延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院" ]
        hospital = this.getCols(originData, "hospital")
        // 获取columns
        pie1Data.columns = [ "医院", "就诊次数" ]
        hospital.map(type => {
          let pie1DataItem = {
            "医院": "",
            "就诊次数": 0
          }
          pie1Data.rows.push(pie1DataItem)
          for (let i = 0; i < originData.length; i++) {
            if (type === originData[ i ].hospital) {
              pie1DataItem.就诊次数 = originData[ i ].amount
            }
          }
          switch (type) {
            case 'bayy':
              type = '博爱医院'
              break;
            case 'fybjyy':
              type = '市妇幼医院'
              break;
            case 'zyyy':
              type = '市中医医院'
              break;
            case 'rmyy':
              type = '市人民医院'
              break;
            default:
              type = '-'
              break;
          }
          pie1DataItem.医院 = type
        })

      }
      this.contentData.firstPie.data = pie1Data
    },
    getPie2Data (currentPage, originData) {
      let datas = this.allData.Pie2
      // let cardType = this.getCols(datas, "card_type")
      let pie2Data = {
        columns: [],
        rows: []
      }
      if (currentPage === 'oneCard') {
        // let cardType = this.getCols(datas, "card_type")

        let cardType = [ "社保卡", "就诊卡", "身份证" ]
        pie2Data.columns = [ '卡类型', '就诊次数' ],
          cardType.map(ct => {
            let pieDataItem = {
              "卡类型": '',
              "就诊次数": 0
            }
            // pieDataItem.卡类型 = ct
            let pie2Count = 0
            for (let i = 0; i < datas.length; i++) {
              let cardType = ''
              switch (datas[ i ].card_type) {
                case 'sbk':
                  cardType = '社保卡'
                  // ct = '社保卡'
                  break;
                case 'jzk':
                  cardType = '就诊卡'
                  // ct = '就诊卡'
                  break;
                case 'sfz':
                  // ct = '身份证'
                  cardType = '身份证'
                  break;
              }
              if (ct === cardType) {
                pie2Count += datas[ i ].create_time
              }
            }
            pieDataItem.卡类型 = ct
            pieDataItem.就诊次数 = pie2Count
            pie2Data.rows.push(pieDataItem)
          })
      } else if (currentPage === 'emrShare') {
      } else if (currentPage === 'emrCollect') {
        let recordType = this.getCols(originData, 'record_type')
        // recordType = ["住院诊疗入院记录", "门急诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检验报告", "住院诊疗医嘱", "住院诊疗检验报告"]
        pie2Data.columns = [ '记录类型', '刷卡次数' ],
          recordType.map(ct => {
            let pieDataItem = {
            }
            // pieDataItem.卡类型 = ct
            let pie2Count = 0
            for (let i = 0; i < originData.length; i++) {
              if (ct === originData[ i ].record_type) {
                pie2Count += originData[ i ].amount
              }
            }
            pieDataItem.记录类型 = ct
            pieDataItem.刷卡次数 = pie2Count
            pie2Data.rows.push(pieDataItem)
          })

      }
      this.contentData.secondPie.data = pie2Data
    },
    getBar2Data (currentPage, originData) {
      let datas = this.allData.Bar2
      let bar2Arr = []
      let timeType = this.checkDataType
      let xVal = this.getXaxis(timeType)
      let bar1Data = {}
      if (currentPage === 'oneCard') {
        // let hospital = this.getCols(datas, "yljgmc")
        let hospital = [ "延大附院", "市人民医院", "延安市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院" ]
        if (hospital && hospital.length > 0) {
          let types = this.getCols(datas, "cmd")
          // types = ['住院', '门诊']
          hospital.map(hos => {
            let obj = {
              columns: [ '时间', '住院', '门诊' ],
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
                  if (item == 'register') {
                    dataMap[ '门诊' ] = count
                  } else if (item == 'inpatient') {
                    dataMap[ '住院' ] = count
                  }
                  // dataMap[item] = count
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
                  if (item == 'register') {
                    dataMap[ '门诊' ] = count
                  } else if (item == 'inpatient') {
                    dataMap[ '住院' ] = count
                  }
                  // dataMap[item] = count
                })
              }
            })
            bar2Arr.push(obj)
          })
          this.contentData.secondBar.data = bar2Arr
        }
      } else if (currentPage === 'emrCollect') {
        // let hospital = this.getCols(datas, "yljgmc")
        let hospital = [ "延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院" ]
        let types = this.getCols(originData, "record_type")
        // types = ["住院诊疗入院记录", "门急诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检验报告", "住院诊疗医嘱", "住院诊疗检验报告"]
        hospital.map(item => {
          let obj = {
            columns: [ '时间' ].concat(types),
            rows: []
          }
          bar2Arr.push(obj)
        })
        hospital = this.getCols(originData, 'hospital')

        // if (hospital && hospital.length > 0) {
        hospital.map(hos => {
          let obj = {
            columns: [ '时间' ].concat(types),
            rows: []
          }
          xVal.map(hour => {
            let dataMap = {}
            obj.rows.push(dataMap)
            if (timeType === 'day') {
              if (hour < 10) {
                dataMap[ '时间' ] = hour.slice(1, 2) + "点"
              } else {
                dataMap[ '时间' ] = hour + "点"
              }
              types.map(item => {
                let count = 0
                originData.map(dataItem => {
                  let dateHour = dataItem.count_hour
                  if (dateHour == hour && dataItem.record_type == item && dataItem.hospital === hos) {
                    count += dataItem.amount
                  }
                })
                dataMap[ item ] = count
              })
            } else if (timeType === 'week' || timeType === "month" || timeType === 'year') {
              dataMap.时间 = hour
              types.map(item => {
                let count = 0
                originData.map(dataItem => {
                  let dateHour = dataItem.count_hour

                  if (dateHour == hour && dataItem.record_type == item && dataItem.hospital === hos) {
                    count += dataItem.amount
                  }
                })
                dataMap[ item ] = count
              })
            }
          })
          switch (hos) {
            case 'bayy':
              // hos = '博爱医院'
              bar2Arr[ 3 ] = obj
              break;
            case 'fybjyy':
              // hos = '市妇幼医院'
              bar2Arr[ 4 ] = obj
              break;
            case 'zyyy':
              // hos = '市中医医院'
              bar2Arr[ 2 ] = obj
              break;
            case 'rmyy':
              // hos = '市人民医院'
              bar2Arr[ 1 ] = obj
              break;
          }
          bar2Arr[ 0 ] = {}
          bar2Arr[ 5 ] = {}
          // bar2Arr.push(obj)
        })

        this.contentData.secondBar.data = bar2Arr
        // }
      }
    },
    getPie3Data (currentPage, originData) {
      let data = this.allData.Pie3
      let pie3Arr = []
      if (currentPage === 'oneCard') {
        let hospital = [ "延大附院", "市人民医院", "延安市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院" ]
        // let hospital = this.getCols(data, "yljgmc")
        // this.contentData.tabCheckItem = hospital
        // let cardType = this.getCols(data, "card_type")
        let cardType = [ "社保卡", "就诊卡", "身份证" ]
        hospital.map((hos, i) => {
          let obj = {
            columns: [ '卡类型', '就诊次数' ],
            rows: []
          }
          cardType.map(card => {
            let count = 0
            data.map(dataItem => {
              let cardsType = ''
              switch (dataItem.card_type) {
                case 'sbk':
                  cardsType = '社保卡'
                  break;
                case 'jzk':
                  cardsType = '就诊卡'
                  break;
                case 'sfz':
                  cardsType = '身份证'
                  break;
              }
              if (dataItem.yljgmc === hos && cardsType === card) {
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
      } else if (currentPage == 'emrShare') {

      } else if (currentPage === 'emrCollect') {
        // let hospital = ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院"]
        if (originData.length > 0) {
          let hospital = this.getCols(originData, "hospital")
          if (hospital && hospital.length > 0) {
            let record_type = this.getCols(originData, 'record_type')
            hospital.map((hos, i) => {
              let obj = {
                columns: [ '就诊类型', '次数' ],
                rows: []
              }
              record_type.map(card => {
                let count = 0
                originData.map(dataItem => {
                  if (dataItem.hospital === hos && dataItem.record_type == card) {
                    count += dataItem.amount
                  }
                })
                obj.rows.push({
                  "就诊类型": card,
                  "次数": count
                })
              })
              switch (hos) {
                case 'bayy':
                  // hos = '博爱医院'
                  pie3Arr[ 3 ] = obj
                  break;
                case 'fybjyy':
                  // hos = '市妇幼医院'
                  pie3Arr[ 4 ] = obj
                  break;
                case 'zyyy':
                  // hos = '市中医医院'
                  pie3Arr[ 2 ] = obj
                  break;
                case 'rmyy':
                  // hos = '市人民医院'
                  pie3Arr[ 1 ] = obj
                  break;
              }
            })
          }

        }
      }
      this.contentData.thirdPie.data = pie3Arr
    },
    getCount (currentPage, originData) {
      let datas = this.allData.countData

      let hospital = [ "延大附院", "市人民医院", "延安市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院" ]
      let countArr = []
      hospital.map(item => {
        let obj = {
          "门诊": 0,
          "住院": 0
        }
        countArr.push(obj)
      })
      if (currentPage === 'oneCard') {
        hospital.map(hos => {
          let obj = {
            "门诊": 0,
            "住院": 0
          }
          datas.map(data => {
            if (data.cmd == "register" && hos == data.yljgmc) {
              obj[ "门诊" ] += data.create_time
            } else if (data.cmd == "inpatient" && hos == data.yljgmc) {
              obj[ "住院" ] += data.create_time
            }
          })
          switch (hos) {
            case '博爱医院':
              countArr[ 3 ] = obj
              break;
            case '市妇幼医院':
              countArr[ 4 ] = obj
              break;
            case '延安市中医医院':
              countArr[ 2 ] = obj
              break;
            case '市人民医院':
              countArr[ 1 ] = obj
              break;
          }
        })
        this.contentData.countData = countArr
      } else if (currentPage == 'emrShare') {

      } else if (currentPage === 'emrCollect') {
        hospital.map(item => {
          let obj = {
            "门诊": 0,
            "住院": 0
          }
          countArr.push(obj)
        })
        hospital = this.getCols(originData, 'hospital')
        hospital.map(hos => {
          let obj = {
            "门诊": 0,
            "住院": 0
          }
          originData.map(data => {
            if (data.record_type.indexOf('住院诊疗') && hos === data.hospital) {
              obj[ "住院" ] += data.amount
            } else {
              obj[ "门诊" ] += data.amount
            }
          })

          switch (hos) {
            case 'bayy':
              countArr[ 3 ] = obj // '博爱医院'
              break;
            case 'fybjyy':
              countArr[ 4 ] = obj // '市妇幼医院'
              break;
            case 'zyyy':
              countArr[ 2 ] = obj // '市中医医院'
              break;
            case 'rmyy':
              countArr[ 1 ] = obj // '市人民医院'
              break;
            default:
              break;
          }
        })

        this.contentData.countData = countArr
      }
    },
    getAllChartData (currentPage) {
      this.getBar1data(currentPage)
      this.getPie1Data(currentPage)
      this.getPie2Data(currentPage)
      this.getBar2Data(currentPage)
      this.getPie3Data(currentPage)
      this.getCount(currentPage)
    },
    async getRunTime () {
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
      if (res.status == 200 && res.statusText == "OK") {
        return { 'isRes': true, 'res': res }
      } else {
        return { 'isRes': false, 'res': res }
      }
    },
    getTimeSection (type = 'day') {
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
    async getAlldata () {
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
          "colNames": [ "*" ],
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
          "colNames": [ "*" ],
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
          "colNames": [ "*" ],
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
          "colNames": [ "*" ],
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
          "colNames": [ "*" ],
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
          "colNames": [ "*" ],
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
          "colNames": [ "*" ],
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
          "colNames": [ "*" ],
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
          "colNames": [ "*" ],
          "group": [
            {
              "colName": "num_of_calls",
              "type": "sum"
            }
          ]
        }
        let req4 = {
          "serviceName": "srvemr_req_cert_select",
          "colNames": [ "*" ],
          "group": [
            {
              "colName": "cert_no",
              "type": "count"
            }
          ]
        }
        if (type == "day") {
          req[ "group" ] = [
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
          req[ "relation_condition" ] = {
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
                    "value": this.timeSection.start,
                    "ruleType": "ge"
                  },
                  {
                    "colName": "statistics_time",
                    "value": this.timeSection.end,
                    "ruleType": "le"
                  }
                ]
              }
            ]
          }
          req3[ "relation_condition" ] = req[ "relation_condition" ]
          req2.condition = [
            {
              "colName": "cert_time",
              "value": this.timeSection.start,
              "ruleType": "ge"
            },
            {
              "colName": "cert_time",
              "value": this.timeSection.end,
              "ruleType": "le"
            }
          ]
          req4.condition = [
            {
              "colName": "cert_time",
              "value": this.timeSection.start,
              "ruleType": "ge"
            },
            {
              "colName": "cert_time",
              "value": this.timeSection.end,
              "ruleType": "le"
            }
          ]
        } else if (type == "week") {
          req[ "relation_condition" ] = {
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
                    "value": this.timeSection.start,
                    "ruleType": "ge"
                  },
                  {
                    "colName": "statistics_time",
                    "value": this.timeSection.end,
                    "ruleType": "le"
                  }
                ]
              }
            ]
          }
          req2.condition = [
            {
              "colName": "cert_time",
              "value": this.timeSection.start,
              "ruleType": "ge"
            },
            {
              "colName": "cert_time",
              "value": this.timeSection.end,
              "ruleType": "le"
            }
          ]
          req3[ "relation_condition" ] = req[ "relation_condition" ]
          req4.condition = [
            {
              "colName": "cert_time",
              "value": this.timeSection.start,
              "ruleType": "ge"
            },
            {
              "colName": "cert_time",
              "value": this.timeSection.end,
              "ruleType": "le"
            }
          ]
        } else if (type == "month") {
          req[ "relation_condition" ] = {
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
                    "value": this.timeSection.start,
                    "ruleType": "ge"
                  },
                  {
                    "colName": "statistics_time",
                    "value": this.timeSection.end,
                    "ruleType": "le"
                  }
                ]
              }
            ]
          }
          req3[ "relation_condition" ] = req[ "relation_condition" ]
          req2.condition = [
            {
              "colName": "cert_time",
              "value": this.timeSection.start,
              "ruleType": "ge"
            },
            {
              "colName": "cert_time",
              "value": this.timeSection.end,
              "ruleType": "le"
            }
          ]
          req4.condition = [
            {
              "colName": "cert_time",
              "value": this.timeSection.start,
              "ruleType": "ge"
            },
            {
              "colName": "cert_time",
              "value": this.timeSection.end,
              "ruleType": "le"
            }
          ]
        } else if (type == "year") {
          req[ "group" ] = [
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
          req[ "relation_condition" ] = {
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
                    "value": this.timeSection.start,
                    "ruleType": "ge"
                  },
                  {
                    "colName": "statistics_time",
                    "value": this.timeSection.end,
                    "ruleType": "le"
                  }
                ]
              }
            ]
          }
          req3[ "relation_condition" ] = req[ "relation_condition" ]
          req2.condition = [
            {
              "colName": "cert_time",
              "value": this.timeSection.start,
              "ruleType": "ge"
            },
            {
              "colName": "cert_time",
              "value": this.timeSection.end,
              "ruleType": "le"
            }
          ]
          req4.condition = [
            {
              "colName": "cert_time",
              "value": this.timeSection.start,
              "ruleType": "ge"
            },
            {
              "colName": "cert_time",
              "value": this.timeSection.end,
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
        let url2 = this.getServiceUrl("select", req2.serviceName, "emr")
        let resb = await this.axios.post(url2, req2)
        let datab = resb.data.data

        this.getCountData(datab, type, currentPage, "verify_count")
        let emrShareCount = { select: 0, verify: 0 }
        let url3 = this.getServiceUrl("select", req.serviceName, "log")
        let resc = await this.axios.post(url3, req3)
        if (resc.data.data[ 0 ].num_of_calls == null) {
          emrShareCount.select = 0
        } else {
          emrShareCount.select = resc.data.data[ 0 ].num_of_calls
        }
        let url4 = this.getServiceUrl("select", req4.serviceName, "emr")
        let resd = await this.axios.post(url4, req4)
        let verifyCount = resd.data.data[ 0 ].cert_no
        if (verifyCount) {
          emrShareCount.verify = verifyCount
        } else {
          emrShareCount.verify = 0
        }
        let allEmrShareCount = []
        for (let i = 0; i < 6; i++) {
          allEmrShareCount.push({ select: 0, verify: 0 })
        }
        allEmrShareCount[ 2 ] = emrShareCount
        this.contentData.countData = allEmrShareCount
        if (resa.status == 200 && resa.statusText == "OK") {
          return { 'isRes': true, 'res': resa }
        } else {
          return { 'isRes': false, 'res': resa }
        }
      } else if (currentPage === 'emrCollect') { // 电子病历采集电子病历采集
        this.getCollectOriginData()
        this.contentData.firstBar.title = "电子病历采集数量"
        this.contentData.firstPie.title = "各医院采集数量分布"
        this.contentData.secondPie.title = "各类型记录分布"
        this.contentData.thirdPie.title = "各类型记录分布"
        this.contentData.firstBar.type = 'line'

        // let res = await this.axios.post(url, req)
        // let data = res.data.data

        // this.getCountData(data, type, currentPage)
        // let resb = await this.axios.post(url, reqPie3)
        // let datab = resb.data.data

        // this.getCountData(datab, type, currentPage, "collectPie3")
        // if (resb.status == 200 && res.statusText == "OK") {
        //   return { 'isRes': true, 'res': resb }
        // } else {
        //   return { 'isRes': false, 'res': resb }
        // }
      }
    },
    getCountData (data, type, currentPage, dataType) {
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
      if (currentPage == 'emrShare') {

        if (dataType && dataType == "verify_count") {
          // 左侧下方饼图
          let cardTypes = datas.map(item => item.card_type)
          cardTypes = Array.from(new Set(cardTypes))
          cardTypes = [ "身份证", "社保卡", "其它" ]
          let verify_data = {
            columns: [ "卡类型", "次数" ],
            rows: []
          }
          let pie3DataArr = []
          for (let i = 0; i < 6; i++) {
            pie3DataArr.push({
              columns: [ "卡类型", "次数" ],
              rows: []
            })
            pie3DataArr[ i ].rows = [ { "卡类型": '社保卡', "次数": 0 }, { "卡类型": '身份证', "次数": 0 }, { "卡类型": '其它', "次数": 0 } ]
          }
          cardTypes.map(ct => {
            let typeData = {
              "卡类型": '',
              "次数": 0
            }
            let cardCount = 0
            let otherCount = 0
            for (let i = 0; i < datas.length; i++) {
              if (ct === datas[ i ].card_type) {
                cardCount += data[ i ].cert_no
              } else {
                otherCount += data[ i ].cert_no
                typeData.卡类型 = "其它"
              }
            }
            typeData.卡类型 = ct
            typeData.次数 = cardCount
            verify_data.rows.push(typeData)
          })
          this.contentData.secondPie.data = verify_data
          pie3DataArr[ 2 ] = verify_data
          this.contentData.thirdPie.data = pie3DataArr
        } else if (dataType && dataType == "select_count") {

        } else {
          let types = datas.map(item => item.name)
          types = Array.from(new Set(types))
          types = [ "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告" ]
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
              types.map(item => { // 遍历就诊类型
                let count = 0
                datas.map(dataItem => { // 遍历原始数据
                  let dateHour = dataItem.statistics_time
                  if (dateHour == hour && dataItem.name == item) {
                    count += dataItem.num_of_calls
                  }
                })
                dataMap[ item ] = count
              })
            } if (type === "week" || type === "month" || type === 'year') {
              dataMap.时间 = hour
              types.map(item => {
                let count = 0
                datas.map(dataItem => {
                  let dateHour = dataItem.statistics_time
                  if (dateHour == hour && dataItem.name == item) {


                    count += dataItem.num_of_calls
                  }
                })
                dataMap[ item ] = count
              })
            }
          })
          let bar1Data = {
            columns: [ "时间", "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告" ],
            rows: rows
          }
          // this.shareBar1Data = bra1Data
          this.contentData.firstBar.data = bar1Data

          // emr-share 左上饼图
          let InTypes = datas.map(item => item.name) //就诊类型
          InTypes = Array.from(new Set(InTypes))
          InTypes = [ "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告" ]
          let pie1Data = {
            columns: [ "就诊记录", "就诊次数" ],
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
              if (its === datas[ i ].name) {
                pie1Count += data[ i ].num_of_calls
              }
            }
            pieDataItem.就诊记录 = its
            pieDataItem.就诊次数 = pie1Count
          })
          this.sharePie1Data = pie1Data
          this.contentData.firstPie.data = pie1Data
          // emr-share 右上柱状图  表里无医院这个字段 查出来的数据给中医医院
          let shareBar2Data = [ {}, {}, {}, {}, {}, {} ]
          shareBar2Data.map(item => {
            item.columns = [ "时间", "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告" ]
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
          shareBar2Data[ 2 ] = {
            columns: [ "时间", "门诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检查报告", "住院诊疗入院记录", "住院诊疗医嘱信息", "住院诊疗检验报告" ],
            rows: rows
          }

          this.contentData.secondBar.data = shareBar2Data
        }
      }
    },
    async getCollectOriginData () {
      let serviceName = "srvemr_record_count_by_hour_select"
      let url = this.getServiceUrl('select', serviceName, 'emr')
      let params1 = {
        serviceName: serviceName,
        colNames: [ "*" ],
        "relation_condition": {
          "relation": "AND",
          "data": [
            {
              "relation": "or",
              "data": this.recordCollectList
            },
            {
              "relation": "AND",
              "data": [
                {
                  "colName": "count_hour",
                  "value": this.timeSection.start,
                  "ruleType": "ge"
                },
                {
                  "colName": "count_hour",
                  "value": this.timeSection.end,
                  "ruleType": "le"
                } ]
            }
          ]
        },
        group: [
          {
            "colName": "record_type",
            "type": "by"
          },
          {
            "colName": "amount",
            "type": "sum"
          },
          {
            "colName": "count_hour",
            "type": this.byValue
          }
        ]
      }
      let res1 = await this.axios.post(url, params1)
      this.getBar1data('emrCollect', res1.data.data)
      // this.contentData.firstBar.data = res1.data.data ? res1.data.data : [] // 左侧折线图数据
      let params2 = {
        serviceName: serviceName,
        colNames: [ "*" ],
        relation_condition: params1.relation_condition,
        group: [
          {
            "colName": "hospital",
            "type": "by"
          },
          {
            "colName": "amount",
            "type": "sum"
          }
        ]
      }
      let res2 = await this.axios.post(url, params2)
      this.getPie1Data('emrCollect', res2.data.data)
      // this.contentData.firstPie.data = res2.data.data ? res2.data.data : [] // 左侧上方饼图数据
      let params3 = {
        serviceName: serviceName,
        colNames: [ "*" ],
        relation_condition: params1.relation_condition,
        group: [
          {
            "colName": "record_type",
            "type": "by"
          },
          {
            "colName": "amount",
            "type": "sum"
          }
        ]
      }
      let res3 = await this.axios.post(url, params3)
      if (res3.data.data) {
        this.getPie2Data('emrCollect', res3.data.data)
        // this.contentData.secondPie.data = res3.data.data // 左侧下方饼图数据
      }
      let params4 = {
        serviceName: serviceName,
        colNames: [ "*" ],
        relation_condition: params1.relation_condition,
        group: [
          {
            "colName": "record_type",
            "type": "by"
          },
          {
            "colName": "hospital",
            "type": "by"
          },
          {
            "colName": "amount",
            "type": "sum"
          },
          {
            "colName": "count_hour",
            "type": this.byValue
          }
        ]
      }
      let res4 = await this.axios.post(url, params4)
      this.getBar2Data('emrCollect', res4.data.data)
      let params6 = {
        serviceName: serviceName,
        colNames: [ "*" ],
        relation_condition: params1.relation_condition,
        group: [
          {
            "colName": "record_type",
            "type": "by"
          },
          {
            "colName": "hospital",
            "type": "by"
          },
          {
            "colName": "amount",
            "type": "sum"
          }
        ]
      }
      let res6 = await this.axios.post(url, params6)
      this.getCount('emrCollect', res6.data.data)
      this.getPie3Data('emrCollect', res6.data.data)
    },

    viewtabs (pageName) {
      this.contentData.currentPage = pageName.key;
      if (pageName.key === "oneCard") {
        this.checkDataType = 'day'
        this.getTimeType('day')
      } else {
        this.pageUrl = pageName.url
      }
    },
    loginOut () {
      sessionStorage.clear();
      window.top.location.href = "/main/login_pages/login-fw.html"
    },
    toNav () {
      this.$router.push({ name: "navs", query: { from: "onecard" } })
    },
    async getTimeType (TimeType) {
      this.getTimeSection(TimeType)
      // 获取时间区间类型
      let byValue = ""
      if (TimeType) {
        this.checkDataType = TimeType
        switch (TimeType) {
          case 'day':
            byValue = 'by_hour'
            break;
          case 'week':
            byValue = 'by_date'
            break;
          case 'month':
            byValue = 'by_date'
            break;
          case 'year':
            byValue = 'by_month_of_year'
            break;
          default:
            byValue = 'by_hour'
            break;
        }
        this.byValue = byValue
        this.refresh && this.refresh.RunTime && this.refresh.RunTime.endTime ? this.refresh.RunTime.endTime() : ''
        this.refresh && this.refresh.timeOutReq && this.refresh.timeOutReq.endTime ? this.refresh.timeOutReq.endTime() : ''
        // this.refresh.timeOutReq.endTime()
        this.autoRefresh()
      }
      // await this.getAlldata()
    },
    toManangerment () {
      // 跳转到后台管理页面
      let str = window.location.href
      let num = str.indexOf("?");
      str = str.substr(num + 1);
      window.location.href = '../../main/index.html?' + str
    },
    autoChangeTab (interval) {
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
    autoRefresh () {
      this.refresh.RunTime = new this.timeOut(30, 0, this.getRunTime)
      this.refresh.RunTime.reqFun()
      this.refresh.RunTime.startTime()
      this.refresh.timeOutReq = new this.timeOut(30, 0, this.getAlldata)
      this.refresh.timeOutReq.reqFun()
      this.refresh.timeOutReq.startTime()
    },
    autoRefreshEnd () {
      this.refresh.RunTime.endTime()
      this.refresh.timeOutReq.endTime()
    }
  },
  data () {
    return {
      tabsShow: 1,
      pageUrl: "",
      user: {
        user_no: ""
      },
      refresh: {
        RunTime: null,
        timeOutReq: null,
      },
      titleViewData: {
        title: "社保医疗一卡通融合平台",
        date: "",
        currentPage: "onecard" // oneCard、emrShare、emrCollect
      },
      tabsData: {
        tabs: [ {
          key: 'oneCard',
          value: '一卡通就诊'
        },
        {
          key: 'totalAnalyze',
          value: '电子病历总体分析',
          url: '/bx-chart/#/dataView/DS201910140002'
        },
        {
          key: 'diseaseAnalyze',
          value: '病种分析',
          url: '/bx-chart/#/dataView/DS201910140003'
        }
          // {
          //   key: 'emrShare',
          //   value: '电子病历共享'
          // },
          // {
          //   key: 'emrCollect',
          //   value: '电子病历采集'
          // }
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
          tabCheckItem: [ "延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院" ],
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
      timeSection: { // 数据起止时间
        start: "",
        end: ""
      },
      byValue: "hour", // group by什么
      allData: {},
      checkDataType: 'day',
      chartSetting1: {
        stack: {
          用户: [ "门诊", "住院", "住院诊疗入院记录", "门急诊诊疗挂号记录", "门急诊诊疗医嘱", "门急诊诊疗检验报告", "住院诊疗医嘱", "住院诊疗检验报告" ]
        }
      },
      recordCollectList: [
        {
          "colName": "record_type",
          "value": "门急诊诊疗挂号记录",
          "ruleType": "eq"
        },
        {
          "colName": "record_type",
          "value": "门急诊诊疗医嘱",
          "ruleType": "eq"
        },
        {
          "colName": "record_type",
          "value": "门急诊诊疗检验报告",
          "ruleType": "eq"
        },
        {
          "colName": "record_type",
          "value": "住院诊疗入院记录",
          "ruleType": "eq"
        },
        {
          "colName": "record_type",
          "value": "住院诊疗医嘱",
          "ruleType": "eq"
        },
        {
          "colName": "record_type",
          "value": "住院诊疗检验报告",
          "ruleType": "eq"
        }
      ]
    };
  },
  created () {
    let user = sessionStorage.getItem('current_login_user')
    top.user = JSON.parse(user)
    this.user = top.user
  },
  mounted () {
    this.getTimeType()
    // this.getRunTime()
    this.autoRefresh()
    // this.autoChangeTab(10000) // 自动切换Tab
  },
  destroyed () {
    this.autoRefreshEnd()
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
