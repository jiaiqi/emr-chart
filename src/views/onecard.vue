<template>
  <div class="wrap">
    <view-title :titleViewData="titleViewData" :user="user"></view-title>
    <div class="main">
      <view-tabs :tabsData="tabsData" @viewtabs="viewtabs"></view-tabs>
      <time-type @showTimeType="getTimeType" :timeType="checkDataType"></time-type>
      <onecard-content :contentData="contentData" :chartSetting="chartSetting"></onecard-content>
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
    viewtabs(pageName) {
      this.contentData.currentPage = pageName.key;
      let currentPage = this.contentData.currentPage
      if (currentPage === 'oneCard') {
        this.contentData.firstBar.title = "一卡通就诊次数"
        this.contentData.firstPie.title = "各医院就诊分布"
        this.contentData.secondPie.title = "就诊刷卡类型分布"
        this.contentData.thirdPie.title = "就诊刷卡类型分布"
        this.contentData.firstBar.type = 'bar'
      } else if (currentPage === 'emrShare') {
        this.contentData.firstBar.title = "电子病历查询统计"
        this.contentData.firstPie.title = "各医院查询次数分布"
        this.contentData.secondPie.title = "身份验证卡类型分布"
        this.contentData.thirdPie.title = "身份验证卡类型分布"
        this.contentData.firstBar.type = 'bar'
      } else if (currentPage === 'emrCollect') {
        this.contentData.firstBar.title = "电子病历采集数量"
        this.contentData.firstPie.title = "各医院采集数量分布"
        this.contentData.secondPie.title = "各类型记录分布"
        this.contentData.thirdPie.title = "各类型记录分布"
        this.contentData.firstBar.type = 'line'
      }
    },
    getTimeType(TimeType) {
      this.checkDataType = TimeType
      this.getTimeSection(TimeType)
    },
    async getRunTime() { // 获取运行时常
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
      if (res.status == 200) {
        return { 'isRes': true, 'res': res }
      } else {
        return { 'isRes': false, 'res': res }
      }
    },
    async getBar1Data() { // 获取柱状图1/折线图1的数据
      let condition = []
      let timeGroupType = "by_hour"
      let type = this.checkDataType
      let currentPage = this.contentData.currentPage
      if (currentPage === 'oneCard') {
        let serviceName = "srvcvs_medical_records_select"
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
        let req = {
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
        let res = await this.axios.post(url, req)
        if (res.status == 200) {
          this.allData.Bar1 = res.data.data
          if (res.data.data) {
            this.contentData.firstBar.loading = false
          } else if (res.data.data = []) {
            this.contentData.firstBar.dataEmpty = true
          }
          return { 'isRes': true, 'res': res }
        } else {
          return { 'isRes': false, 'res': res }
        }
      } else if (currentPage === 'emrShare') {

      } else if (currentPage === 'emrCollect') {

      }
    },
    async getBar2Data() { // 获取柱状图2/折线图2的数据
      let condition = []
      let timeGroupType = "by_hour"
      let type = this.checkDataType
      let currentPage = this.contentData.currentPage
      if (currentPage === 'oneCard') {
        let serviceName = "srvcvs_medical_records_select"
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
        let req = {
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
        let res = await this.axios.post(url, req)
        if (res.status == 200) {
          this.allData.Bar2 = res.data.data
          if (res.data.data) {
            this.contentData.secondBar.loading = false
          } else if (res.data.data = []) {
            this.contentData.secondBar.dataEmpty = true
          }
          return { 'isRes': true, 'res': res }
        } else {
          return { 'isRes': false, 'res': res }
        }
      } else if (currentPage === 'emrShare') {

      } else if (currentPage === 'emrCollect') {

      }
    },
    async getPie1Data() { // 获取饼图1的数据
      let condition = []
      let timeGroupType = "by_hour"
      let type = this.checkDataType
      let currentPage = this.contentData.currentPage
      if (currentPage === 'oneCard') {
        let serviceName = "srvcvs_medical_records_select"
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
        let req = {
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
        let res = await this.axios.post(url, req)
        if (res.status == 200) {
          this.allData.Pie1 = res.data.data
          if (res.data.data) {
            this.contentData.firstPie.loading = false
          } else if (res.data.data = []) {
            this.contentData.firstPie.dataEmpty = true
          }
          return { 'isRes': true, 'res': res }
        } else {
          return { 'isRes': false, 'res': res }
        }
      } else if (currentPage === 'emrShare') {

      } else if (currentPage === 'emrCollect') {

      }
    },
    async getPie2Data() { // 获取饼图2的数据
      let condition = []
      let timeGroupType = "by_hour"
      let type = this.checkDataType
      let currentPage = this.contentData.currentPage
      if (currentPage === 'oneCard') {
        let serviceName = "srvcvs_medical_records_select"
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
        let req = {
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
        let res = await this.axios.post(url, req)
        if (res.status == 200) {
          this.allData.Pie2 = res.data.data
          if (res.data.data) {
            this.contentData.secondPie.loading = false
          } else if (res.data.data = []) {
            this.contentData.secondPie.dataEmpty = true
          }
          return { 'isRes': true, 'res': res }
        } else {
          return { 'isRes': false, 'res': res }
        }
      } else if (currentPage === 'emrShare') {

      } else if (currentPage === 'emrCollect') {

      }
    },
    async getPie3Data() { // 获取饼图3的数据
      let condition = []
      let timeGroupType = "by_hour"
      let type = this.checkDataType
      let currentPage = this.contentData.currentPage
      if (currentPage === 'oneCard') {
        let serviceName = "srvcvs_medical_records_select"
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
        let req = {
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
        let res = await this.axios.post(url, req)
        if (res.status == 200) {
          this.allData.Pie3 = res.data.data
          if (res.data.data) {
            this.contentData.thirdPie.loading = false
          } else if (res.data.data = []) {
            this.contentData.thirdPie.dataEmpty = true
          }
          return { 'isRes': true, 'res': res }
        } else {
          return { 'isRes': false, 'res': res }
        }
      } else if (currentPage === 'emrShare') {

      } else if (currentPage === 'emrCollect') {

      }
    },
    async getCountData() { // 获取请求次数
      let condition = []
      let timeGroupType = "by_hour"
      let type = this.checkDataType
      let currentPage = this.contentData.currentPage
      if (currentPage === 'oneCard') {
        let serviceName = "srvcvs_medical_records_select"
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
        let req = {
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
        let res = await this.axios.post(url, req)
        if (res.status == 200) {
          this.allData.countData = res.data.data
          if (res.data.data) {
            this.contentData.countData.loading = false
          } else if (res.data.data = []) {
            this.contentData.countData.dataEmpty = true
          }
          return { 'isRes': true, 'res': res }
        } else {
          return { 'isRes': false, 'res': res }
        }
      } else if (currentPage === 'emrShare') {

      } else if (currentPage === 'emrCollect') {

      }
    },
    refreshRunTime() {  // 定时刷新运行时长
      this.refresh.RunTime = new this.timeOut(30, 0, this.getRunTime)
      this.refresh.RunTime.reqFun()
      this.refresh.RunTime.startTime()
    },
    refreshBar1Data() { // 定时刷新柱状图/折线图1的数据
      this.refresh.Bar1 = new this.timeOut(30, 0, this.getBar1Data)
      this.refresh.Bar1.reqFun()
      this.refresh.Bar1.startTime()
    },
    refreshBar2Data() { // 定时刷新柱状图/折线图2的数据
      this.refresh.Bar2 = new this.timeOut(30, 0, this.getBar2Data)
      this.refresh.Bar2.reqFun()
      this.refresh.Bar2.startTime()
    },
    refreshPie1Data() { // 定时刷新饼图1的数据
      this.refresh.Pie1 = new this.timeOut(30, 0, this.getPie1Data)
      this.refresh.Pie1.reqFun()
      this.refresh.Pie1.startTime()
    },
    refreshPie2Data() { // 定时刷新饼图2的数据
      this.refresh.Pie2 = new this.timeOut(30, 0, this.getPie2Data)
      this.refresh.Pie2.reqFun()
      this.refresh.Pie2.startTime()
    },
    refreshPie3Data() { // 定时刷新饼图3的数据
      this.refresh.Pie3 = new this.timeOut(30, 0, this.getPie3Data)
      this.refresh.Pie3.reqFun()
      this.refresh.Pie3.startTime()
    },
    refreshCountData() { // 定时刷新请求次数
      this.refresh.Count = new this.timeOut(30, 0, this.getCountData)
      this.refresh.Count.reqFun()
      this.refresh.Count.startTime()
    },
    refreshAllData() { // 定时刷新所有数据
      this.refreshRunTime()
      this.refreshBar1Data()
      this.refreshBar2Data()
      this.refreshPie1Data()
      this.refreshPie2Data()
      this.refreshPie3Data()
      this.refreshCountData()
    },
    getTimeSection(type = 'day') { // 获取时间区间
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
      let timeSection = {
        "start": start,
        "end": end
      }
      this.timeSection = timeSection
      // return timeSection
    },
    buildBar1data(currentPage) {
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
      }
      // else if (currentPage === 'emrShare') {

      // } else if (currentPage === 'emrCollect') { }
      this.contentData.firstBar.data = bar1Data
    },
    buildPie1Data(currentPage) {
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
    buildPie2Data(currentPage) {
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
    buildBar2Data(currentPage) {
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
    buildPie3Data(currentPage) {
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
    buildCountNum(currentPage) {
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
    buildAllData() {
      let currentPage = this.contentData.currentPage
      this.buildBar1data(currentPage)
      setTimeout(() => {
        this.buildPie1Data(currentPage)
        setTimeout(() => {
          this.buildPie2Data(currentPage)
          setTimeout(() => {
            this.buildBar2Data(currentPage)
            setTimeout(() => {
              this.buildPie3Data(currentPage)
              setTimeout(() => {
                this.buildCountNum(currentPage)
              }, 100);
            }, 100);
          }, 100);
        }, 100);
      }, 100);
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
  },
  data() {
    return {
      tabsShow: 1,
      user: {
        user_no: ""
      },
      refresh: { // 定时刷新的实例
        RunTime: null,
        Bar1: null,
        Bar2: null,
        Pie1: null,
        Pie2: null,
        Pie3: null,
        Count: null
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
          loading: true, // 状态- 是否加载中
          dataEmpty: false //数据是否为空
        },
        secondBar: {
          type: 'bar',
          tabCheckItem: ["延大附院", "市人民医院", "市中医医院", "博爱医院", "市妇幼医院", "宝塔区医院"],
          data: [], //各个医院的data
          loading: true, // 状态- 是否加载中
          dataEmpty: false //数据是否为空
        },
        firstPie: {
          type: 'pie',
          title: "各医院就诊分布",
          data: [],
          loading: true, // 状态- 是否加载中
          dataEmpty: false // 数据是否为空
        },
        secondPie: {
          title: "就诊刷卡类型分布",
          data: [],
          loading: true, // 状态- 是否加载中
          dataEmpty: false // 数据是否为空
        },
        thirdPie: {
          title: "各医院就诊刷卡类型分布",
          data: [],
          loading: true, // 状态- 是否加载中
          dataEmpty: false //数据是否为空
        },
        countData: []
      },
      timeSection: {
        start: "",
        end: ""
      },
      allData: {},
      checkDataType: 'day',
      chartSetting: {
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
    this.refreshAllData()
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

  .v-charts-component-loading {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
  }

  .v-charts-mask-status {
    -webkit-filter: blur(1px);
    filter: blur(1px);
  }

  .v-charts-component-loading .circular {
    width: 42px;
    height: 42px;
    -webkit-animation: loading-rotate 2s linear infinite;
    animation: loading-rotate 2s linear infinite;
  }

  .v-charts-component-loading .path {
    -webkit-animation: loading-dash 1.5s ease-in-out infinite;
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: #20a0ff;
    stroke-linecap: round;
  }

  @-webkit-keyframes loading-rotate {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes loading-rotate {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @-webkit-keyframes loading-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -40px;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -120px;
    }
  }

  @keyframes loading-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -40px;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -120px;
    }
  }

  .v-charts-data-empty {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: #888;
    font-size: 14px;
  }
}
</style>
