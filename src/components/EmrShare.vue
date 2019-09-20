<template>
  <div class="content">
    <dv-border-box-10 class="content_left col-65">
      <div class="content_left_left">
        <div class="big-title">电子病历查询统计</div>
        <ve-histogram
          height="calc(100% - 50px)"
          width="40vw"
          :data="shareBar1Data"
          :settings="chartSetting1"
          :textStyle="legend.textStyle"
          :extend="chartExtendLine"
          :legend="legend"
        ></ve-histogram>
      </div>
      <div class="content_left_right">
        <div class="content_left_right_item">
          <div class="item_title">
            <dv-border-box-8 :reverse="true">各医院查询次数分布</dv-border-box-8>
          </div>
          <ve-pie
            :data="sharePie1Data"
            :extend="chartExtendPie2"
            :legend-visible="false"
            height="30vh"
          ></ve-pie>
        </div>
        <div class="content_left_right_item">
          <div class="item_title">
            <dv-border-box-8 :reverse="true">身份验证卡类型分布</dv-border-box-8>
          </div>
          <ve-pie
            :data="sharePie2Data"
            :extend="chartExtendPie"
            :legend-visible="false"
            height="30vh"
          ></ve-pie>
        </div>
      </div>
    </dv-border-box-10>
    <dv-border-box-10 class="content_right col-35" ref="hospital_swiper">
      <div class="content_right_content">
        <!-- <div class="item_title_long">电子病历查询次数柱状图</div> -->
        <div class="tab_check">
          <div
            class="check_item"
            :class="{activity:showHospitalChart==0}"
            @click.stop="checkHospital(0)"
          >延大附院</div>
          <div
            class="check_item"
            :class="{activity:showHospitalChart==1}"
            @click.stop="checkHospital(1)"
          >市人民医院</div>
          <div
            class="check_item"
            :class="{activity:showHospitalChart==2}"
            @click.stop="checkHospital(2)"
          >市中医医院</div>
          <div
            class="check_item"
            :class="{activity:showHospitalChart==3}"
            @click.stop="checkHospital(3)"
          >博爱医院</div>
          <div
            class="check_item"
            :class="{activity:showHospitalChart==4}"
            @click.stop="checkHospital(4)"
          >市妇幼保健院</div>
          <div
            class="check_item"
            :class="{activity:showHospitalChart==5}"
            @click.stop="checkHospital(5)"
          >宝塔区医院</div>
        </div>
        <div class="tab_content">
          <div class="content_item">
            <ve-histogram
              :data="bar2data"
              :textStyle="legend.textStyle"
              :legend="legend"
              height="30vh"
              :extend="chartExtendLine"
              :settings="chartSetting1"
            ></ve-histogram>
          </div>
        </div>
      </div>
      <div class="content_right_bottom">
        <div class="content_right_bottom_item">
          <div>
            <div class="label">总查询次数</div>
            <div class="text-val">{{allSelectNum[showHospitalChart]}}</div>
          </div>
          <div>
            <div class="label">总验证次数</div>
            <div class="text-val">{{allVerifyCount[showHospitalChart]}}</div>
          </div>
        </div>
        <div class="content_right_bottom_item">
          <div class="content_left_right_item" style="height: 260px;">
            <div class="item_title">
              <dv-border-box-8>身份验证卡类型分布</dv-border-box-8>
            </div>
            <ve-pie
              :data="sharePie3Data[showHospitalChart]"
              :extend="chartExtendPie"
              :legend-visible="false"
              height="28vh"
            ></ve-pie>
          </div>
        </div>
      </div>
    </dv-border-box-10>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "EmrShare",
  methods: {
    checkHospital(num) {
      this.chartData = this.hos_bar_data[num][this.checkDataType]
      this.bar2data = this.shareBar2Data[num]
      this.showHospitalChart = num
      this.getVerifyCount(this.checkDataType)
      this.getChartData(this.checkDataType)
    },

    /**
     * getChartData: 从后端获取数据
     * type: 时间范围 （day||week||month||year）
     *
     */
    getChartData(type = "day") {
      let req = {
        "serviceName": "srvlog_call_statistics_select",
        "colNames": ["*"],
        "group": [
          {
            "colName": "num_of_calls",
            "type": "sum"
          }
        ]
      }
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
      if (type === 'day') {
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
      } else if (type === 'week') {
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

      } else if (type === 'month') {
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
      } else if (type === 'year') {
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
      }
      let requestUrl = this.getServiceUrl("select", req.serviceName, "log")
      this.axios({
        method: 'post',
        url: requestUrl,
        data: req
      }).then(res => {
        console.log("allSelectNumdata,", res.data.data);
        if (res.data.data[0].num_of_calls == null) {
          this.allSelectNum[2] = 0
        } else {
          this.allSelectNum[2] = res.data.data[0].num_of_calls
        }
      }).catch(err => {
        console.log(err);

      })
    },
    /**
     * 获取验证次数
     */
    getVerifyCount(type = 'day') {
      let req = {
        "serviceName": "srvemr_req_cert_select",
        "colNames": ["*"],
        "group": [
          {
            "colName": "cert_no",
            "type": "count"
          }
        ]
      }
      if (type == 'day') {
        req.condition = [
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
      } else if (type == 'week') {
        req.condition = [
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
      } else if (type == 'month') {
        req.condition = [
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
      } else if (type == 'year') {
        req.condition = [
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
      let url = this.getServiceUrl("select", req.serviceName, "emr")
      this.axios({ method: 'post', url: url, data: req }).then(res => {
        console.log("res.data.data==================", res.data.data)
        this.allVerifyCount[2] = res.data.data[0].cert_no
      }).catch(err => {

      })

    },
    /**
     * handelChartData 数据处理函数，将从后端返回的数据重新组装成图表需要的数据格式
     * data： 从后端返回的数据
     * time 时间范围 （day||week||month||year） 
     */
    handleChartData(data, time = "day") {
      let xVla = null
      if (type === 'day') {

      } else if (type === 'week') {

      } else if (type === 'month') {

      } else if (type === 'year') {

      }
    },
    setCheckData() {
      let now = new Date()
      let self = this
      this.nowDate = now
      this.chartData = this.hos_bar_data[this.showHospitalChart][this.checkDataType]
      this.bar2data = this.shareBar2Data[this.showHospitalChart]
      // setInterval(() => {
      if (this.showHospitalChart >= 5) {
        this.showHospitalChart = 0
      } else {
        self.showHospitalChart += 1
      }
      // self.getVerifyCount(this.checkDataType)

      self.bar2data = self.shareBar2Data[self.showHospitalChart]
      self.chartData = self.hos_bar_data[self.showHospitalChart][self.checkDataType]
      // }, 3000);
    }
  },
  computed: {
    sharePie3Data() {
      return [{}, {}, this.sharePie2Data, {}, {}, {}]
    }
  },
  data() {
    this.chartExtendLine = {
      grid: {
        top: '25%',
        bottom: "0",
        height: "auto"
      },
      series: {
        type: 'bar',
        center: ["50%", "50%"]
      }
    }
    this.chartExtendPie = {
      grid: {
        top: '10',
        bottom: "0",
        height: "auto"
      },
      series: {
        type: 'pie',
        center: ["50%", "50%"],
        radius: [0, '30%']
      }
    }
    this.chartExtendPie2 = {
      grid: {
        top: '10',
        bottom: "0",
        height: "auto"
      },
      series: {
        type: 'pie',
        center: ["50%", "50%"],
        radius: [0, '30%']
      }
    }
    this.chartExtendPie3 = {
      grid: {
        top: '10',
        bottom: "0",
        height: "auto"
      },
      series: {
        type: 'pie',
        center: ["50%", "50%"],
        radius: [0, '65%']
      }
    }

    return {
      showHospitalChart: 0,
      legend: {
        textStyle: {
          color: '#fff'
        }
      },
      chartData03: {
        hos1: {},
        hos2: {},
        hos3: {},
        hos4: {},
        hos5: {}
      },
      mzcs: 0,
      zycs: 0,
      bar2data: {},
      hos_bar_data: [
        {
          day: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '00:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '01:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '02:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '03:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '04:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '05:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '06:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '07:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '08:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '09:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '10:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '11:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '12:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '13:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '14:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '15:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '16:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '17:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '18:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '19:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '20:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '21:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '22:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '23:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 }
            ]
          },
          week: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '周一', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周二', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周三', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周四', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周五', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周六', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周日', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 }
            ]
          },
          month: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '1号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '2号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '3号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '4号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '5号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '6号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '7号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '8号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '9号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '10号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '11号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '12号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '13号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '14号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '15号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '16号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '17号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '18号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '19号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '20号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '21号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '22号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '23号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '24号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '25号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '26号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '27号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '28号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '29号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '30号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 }
            ]
          },
          year: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '1月', 门诊: Math.random() * 20019 + 7500, 住院: 8564 },
              { 时间: '2月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '3月', 门诊: Math.random() * 20019 + 7500, 住院: 3564 },
              { 时间: '4月', 门诊: Math.random() * 20019 + 7500, 住院: 5564 },
              { 时间: '5月', 门诊: Math.random() * 20019 + 7500, 住院: 7564 },
              { 时间: '6月', 门诊: Math.random() * 20019 + 7500, 住院: 1564 },
              { 时间: '7月', 门诊: Math.random() * 20019 + 7500, 住院: 8564 },
              { 时间: '8月', 门诊: Math.random() * 20019 + 7500, 住院: 9564 },
              { 时间: '9月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '10月', 门诊: Math.random() * 20019 + 7500, 住院: 5564 },
              { 时间: '11月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '12月', 门诊: Math.random() * 20019 + 7500, 住院: 18564 }
            ]
          }
        },
        {
          day: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '00:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '01:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '02:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '03:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '04:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '05:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '06:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '07:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '08:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '09:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '10:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '11:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '12:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '13:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '14:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '15:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '16:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '17:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '18:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '19:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '20:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '21:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '22:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '23:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 }
            ]
          },
          week: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '周一', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周二', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周三', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周四', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周五', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周六', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周日', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 }
            ]
          },
          month: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '1号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '2号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '3号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '4号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '5号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '6号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '7号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '8号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '9号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '10号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '11号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '12号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '13号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '14号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '15号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '16号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '17号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '18号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '19号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '20号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '21号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '22号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '23号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '24号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '25号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '26号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '27号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '28号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '29号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '30号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 }
            ]
          },
          year: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '1月', 门诊: Math.random() * 20019 + 7500, 住院: 8564 },
              { 时间: '2月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '3月', 门诊: Math.random() * 20019 + 7500, 住院: 3564 },
              { 时间: '4月', 门诊: Math.random() * 20019 + 7500, 住院: 5564 },
              { 时间: '5月', 门诊: Math.random() * 20019 + 7500, 住院: 7564 },
              { 时间: '6月', 门诊: Math.random() * 20019 + 7500, 住院: 1564 },
              { 时间: '7月', 门诊: Math.random() * 20019 + 7500, 住院: 8564 },
              { 时间: '8月', 门诊: Math.random() * 20019 + 7500, 住院: 9564 },
              { 时间: '9月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '10月', 门诊: Math.random() * 20019 + 7500, 住院: 5564 },
              { 时间: '11月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '12月', 门诊: Math.random() * 20019 + 7500, 住院: 18564 }
            ]
          }
        },
        {
          day: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '00:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '01:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '02:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '03:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '04:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '05:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '06:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '07:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '08:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '09:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '10:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '11:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '12:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '13:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '14:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '15:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '16:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '17:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '18:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '19:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '20:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '21:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '22:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '23:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 }
            ]
          },
          week: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '周一', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周二', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周三', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周四', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周五', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周六', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周日', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 }
            ]
          },
          month: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '1号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '2号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '3号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '4号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '5号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '6号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '7号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '8号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '9号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '10号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '11号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '12号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '13号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '14号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '15号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '16号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '17号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '18号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '19号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '20号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '21号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '22号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '23号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '24号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '25号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '26号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '27号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '28号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '29号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '30号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 }
            ]
          },
          year: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '1月', 门诊: Math.random() * 20019 + 7500, 住院: 8564 },
              { 时间: '2月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '3月', 门诊: Math.random() * 20019 + 7500, 住院: 3564 },
              { 时间: '4月', 门诊: Math.random() * 20019 + 7500, 住院: 5564 },
              { 时间: '5月', 门诊: Math.random() * 20019 + 7500, 住院: 7564 },
              { 时间: '6月', 门诊: Math.random() * 20019 + 7500, 住院: 1564 },
              { 时间: '7月', 门诊: Math.random() * 20019 + 7500, 住院: 8564 },
              { 时间: '8月', 门诊: Math.random() * 20019 + 7500, 住院: 9564 },
              { 时间: '9月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '10月', 门诊: Math.random() * 20019 + 7500, 住院: 5564 },
              { 时间: '11月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '12月', 门诊: Math.random() * 20019 + 7500, 住院: 18564 }
            ]
          }
        },
        {
          day: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '00:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '01:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '02:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '03:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '04:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '05:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '06:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '07:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '08:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '09:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '10:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '11:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '12:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '13:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '14:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '15:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '16:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '17:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '18:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '19:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '20:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '21:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '22:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '23:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 }
            ]
          },
          week: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '周一', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周二', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周三', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周四', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周五', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周六', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周日', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 }
            ]
          },
          month: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '1号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '2号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '3号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '4号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '5号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '6号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '7号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '8号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '9号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '10号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '11号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '12号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '13号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '14号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '15号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '16号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '17号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '18号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '19号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '20号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '21号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '22号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '23号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '24号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '25号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '26号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '27号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '28号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '29号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '30号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 }
            ]
          },
          year: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '1月', 门诊: Math.random() * 20019 + 7500, 住院: 8564 },
              { 时间: '2月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '3月', 门诊: Math.random() * 20019 + 7500, 住院: 3564 },
              { 时间: '4月', 门诊: Math.random() * 20019 + 7500, 住院: 5564 },
              { 时间: '5月', 门诊: Math.random() * 20019 + 7500, 住院: 7564 },
              { 时间: '6月', 门诊: Math.random() * 20019 + 7500, 住院: 1564 },
              { 时间: '7月', 门诊: Math.random() * 20019 + 7500, 住院: 8564 },
              { 时间: '8月', 门诊: Math.random() * 20019 + 7500, 住院: 9564 },
              { 时间: '9月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '10月', 门诊: Math.random() * 20019 + 7500, 住院: 5564 },
              { 时间: '11月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '12月', 门诊: Math.random() * 20019 + 7500, 住院: 18564 }
            ]
          }
        },
        {
          day: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '00:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '01:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '02:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '03:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '04:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '05:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '06:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '07:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '08:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '09:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '10:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '11:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '12:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '13:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '14:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '15:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '16:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '17:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '18:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '19:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '20:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '21:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '22:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '23:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 }
            ]
          },
          week: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '周一', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周二', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周三', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周四', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周五', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周六', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周日', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 }
            ]
          },
          month: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '1号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '2号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '3号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '4号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '5号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '6号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '7号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '8号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '9号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '10号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '11号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '12号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '13号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '14号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '15号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '16号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '17号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '18号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '19号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '20号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '21号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '22号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '23号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '24号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '25号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '26号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '27号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '28号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '29号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '30号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 }
            ]
          },
          year: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '1月', 门诊: Math.random() * 20019 + 7500, 住院: 8564 },
              { 时间: '2月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '3月', 门诊: Math.random() * 20019 + 7500, 住院: 3564 },
              { 时间: '4月', 门诊: Math.random() * 20019 + 7500, 住院: 5564 },
              { 时间: '5月', 门诊: Math.random() * 20019 + 7500, 住院: 7564 },
              { 时间: '6月', 门诊: Math.random() * 20019 + 7500, 住院: 1564 },
              { 时间: '7月', 门诊: Math.random() * 20019 + 7500, 住院: 8564 },
              { 时间: '8月', 门诊: Math.random() * 20019 + 7500, 住院: 9564 },
              { 时间: '9月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '10月', 门诊: Math.random() * 20019 + 7500, 住院: 5564 },
              { 时间: '11月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '12月', 门诊: Math.random() * 20019 + 7500, 住院: 18564 }
            ]
          }
        },
        {
          day: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '00:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '01:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '02:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '03:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '04:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '05:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '06:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '07:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '08:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '09:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '10:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '11:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '12:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '13:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '14:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '15:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '16:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '17:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '18:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '19:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '20:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '21:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '22:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 },
              { 时间: '23:00', 门诊: Math.random() * 10, 住院: Math.random() * 10 }
            ]
          },
          week: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '周一', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周二', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周三', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周四', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周五', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周六', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 },
              { 时间: '周日', 门诊: Math.random() * 500 + 100, 住院: Math.random() * 300 + 80 }
            ]
          },
          month: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '1号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '2号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '3号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '4号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '5号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '6号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '7号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '8号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '9号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '10号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '11号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '12号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '13号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '14号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '15号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '16号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '17号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '18号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '19号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '20号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '21号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '22号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '23号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '24号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '25号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '26号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '27号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '28号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '29号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 },
              { 时间: '30号', 门诊: Math.random() * 2000 + 500, 住院: Math.random() * 1000 + 300 }
            ]
          },
          year: {
            columns: ['时间', '门诊', '住院'],
            rows: [
              { 时间: '1月', 门诊: Math.random() * 20019 + 7500, 住院: 8564 },
              { 时间: '2月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '3月', 门诊: Math.random() * 20019 + 7500, 住院: 3564 },
              { 时间: '4月', 门诊: Math.random() * 20019 + 7500, 住院: 5564 },
              { 时间: '5月', 门诊: Math.random() * 20019 + 7500, 住院: 7564 },
              { 时间: '6月', 门诊: Math.random() * 20019 + 7500, 住院: 1564 },
              { 时间: '7月', 门诊: Math.random() * 20019 + 7500, 住院: 8564 },
              { 时间: '8月', 门诊: Math.random() * 20019 + 7500, 住院: 9564 },
              { 时间: '9月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '10月', 门诊: Math.random() * 20019 + 7500, 住院: 5564 },
              { 时间: '11月', 门诊: Math.random() * 20019 + 7500, 住院: 2564 },
              { 时间: '12月', 门诊: Math.random() * 20019 + 7500, 住院: 18564 }
            ]
          }
        },
      ],
      chartData: null,
      allSelectNum: [0, 0, 0, 0, 0, 0],// 总查询次数
      // sharePie3Data: [{}, {}, this.sharePie2Data, {}, {}, {}], // 验证类型分布
      allVerifyCount: [0, 0, this.shareAllCount, 0, 0, 0]
    }
  },
  watch: {
    checkDataType(newValue, oldValue) {
      this.getVerifyCount(newValue)
    }
  },
  props: ["swiperOptionTop", "shareBar1Data", "shareBar2Data", "shareAllCount", "sharePie1Data", "sharePie2Data", "chartSetting1", "hospital", "card1", "card", "checkDataType", "chartData01"],

  mounted() {
    let now = new Date()
    this.nowDate = now
    let timeType = this.checkDataType
    this.setCheckData()
    this.getChartData(timeType)
    this.getVerifyCount()
    setInterval(() => {
      this.setCheckData()
    }, 5000);
    let sharePie2Data = this.sharePie2Data
    // this.sharePie3Data[2] = this.sharePie2Data
  },
  // updated() {
  //   let checkDataType = this.checkDataType
  //   this.getChartData(checkDataType)
  // }
}
</script>

<style lang="scss" scoped>
</style>