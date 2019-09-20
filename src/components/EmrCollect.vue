<template>
  <div class="content">
    <dv-border-box-10 class="content_left col-65">
      <div class="content_left_left">
        <div class="big-title">电子病历采集数量</div>
        <ve-line
          height="calc(100% - 50px)"
          width="40vw"
          :data="collectBar1Data"
          :settings="chartSetting1"
          :extend="chartExtendLineone"
          :textStyle="legend.textStyle"
          :legend="legend"
        ></ve-line>
      </div>
      <div class="content_left_right">
        <div class="content_left_right_item">
          <div class="item_title">
            <dv-border-box-8 :reverse="true">各医院采集数量分布</dv-border-box-8>
          </div>
          <ve-pie
            :data="collectPie1Data"
            :legend-visible="false"
            height="28vh"
            :extend="chartExtendPie2"
          ></ve-pie>
        </div>
        <div class="content_left_right_item">
          <div class="item_title">
            <dv-border-box-8 :reverse="true">各类型记录分布</dv-border-box-8>
          </div>
          <ve-pie
            :data="collectPie2Data"
            :legend-visible="false"
            height="28vh"
            :extend="chartExtendPie3"
          ></ve-pie>
        </div>
      </div>
    </dv-border-box-10>
    <dv-border-box-10 class="content_right col-35" ref="hospital_swiper">
      <div class="content_right_content">
        <!-- <div class="item_title_long">电子病历采集数量</div> -->
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
              :data="collectBar2Datas"
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
            <div class="label">门诊总数</div>
            <div class="text-val">{{amount.mz}}</div>
          </div>
          <div>
            <div class="label">住院总数</div>
            <div class="text-val">{{amount.zy}}</div>
          </div>
        </div>
        <div class="content_right_bottom_item">
          <div class="content_left_right_item" style="height: 260px;">
            <div class="item_title">
              <dv-border-box-8>各类型记录分布</dv-border-box-8>
            </div>
            <ve-pie
              :data="collectPie3Datas"
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
import moment from 'moment'
export default {
  name: "EmrCollect",
  methods: {
    checkHospital(num) {
      let self = this
      this.showHospitalChart = num
      if (self.showHospitalChart == 0) {
        self.pie3Datas = self.pieData["延大附院"]
      } else if (self.showHospitalChart == 1) {
        self.pie3Datas = self.pieData["市人民医院"]
        self.collectPie3Datas = self.collectPie3Data['市人民医院']
        self.collectBar2Datas = self.collectBar2Data['市人民医院']
      } else if (self.showHospitalChart == 2) {
        self.pie3Datas = self.pieData["市中医医院"]
        self.collectPie3Datas = self.collectPie3Data['市中医医院']
        self.collectBar2Datas = self.collectBar2Data['市中医医院']
      } else if (self.showHospitalChart == 3) {
        self.pie3Datas = self.pieData["博爱医院"]
        self.collectPie3Datas = self.collectPie3Data['博爱医院']
        self.collectBar2Datas = self.collectBar2Data['博爱医院']
      } else if (self.showHospitalChart == 4) {
        self.pie3Datas = self.pieData["市妇幼保健院"]
        self.collectPie3Datas = self.collectPie3Data['市妇幼保健院']
        self.collectBar2Datas = self.collectBar2Data['市妇幼保健院']
      } else if (self.showHospitalChart == 5) {
        self.pie3Datas = self.pieData["宝塔区医院"]
      }
    },
    checkTimeHorizon(time) {
      this.checkDataType = time;
      if (time != "day") {
      }
      if (time === "day") {
        // this.getData("by_hour_of_date")
      }
      else if (time === "week") {
        // this.getData("by_date_of_week")
      }
      else if (time === "month") {
        // this.getData("by_date_of_month")
      } else if (time === "year") {
        // this.getData("by_month_of_year")
      }
    },
    /**
    * getChartData: 从后端获取数据
    * type: 时间范围 （day||week||month||year）
    *
    */
    getChartData(type = "day") {
      let req = {
        serviceName: "srvlog_operate_record_select"
      }
      if (type === 'day') {
        req.condition = [
          {
            "colName": "statistics_time",
            "value": moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss'),
            "ruleType": "ge"
          },
          {
            "colName": "statistics_time",
            "value": moment().format('YYYY-MM-DD HH:mm:ss'),
            "ruleType": "le"
          }
        ]
        req.order = [
          {
            "colName": "count_hour",
            "orderType": "asc"
          }
        ]
      } else if (type === 'week') {
        req.relation_condition = {
          "relation": "AND",
          "data": [
            {
              "relation": "OR",
              "data": [
                {
                  "colName": "service_name",
                  "value": "DI_ADI_REGISTER_INFO_select", // 门诊诊疗挂号记录
                  "ruleType": "eq"
                },
                {
                  "colName": "service_name",
                  "value": "DI_ADI_DRUREC_INFO_select", // 门急诊诊疗医嘱
                  "ruleType": "eq"
                },
                {
                  "colName": "service_name",
                  "value": "DI_ADI_LAREXA_INFO_select", //门诊诊疗检验报告头表
                  "ruleType": "eq"
                },
                {
                  "colName": "service_name",
                  "value": "DI_HDI_INRECORD_INFO_select", // 住院诊疗入院记录
                  "ruleType": "eq"
                },
                {
                  "colName": "service_name",
                  "value": "DI_HDI_DRUREC_INFO_select", // 住院诊疗医嘱信息
                  "ruleType": "eq"
                },
                {
                  "colName": "service_name",
                  "value": "DI_HDI_LAREXA_INFO_select", // 住院诊疗检验报告头表查询
                  "ruleType": "eq"
                }
              ]
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
                  "value": moment().format('YYYY-MM-DD'),
                  "ruleType": "le"
                }
              ]
            }
          ]
        }
      } else if (type === 'month') {
        req.condition = [
          {
            "colName": "count_hour",
            "value": moment().subtract(30, 'days').format('YYYY-MM-DD'), // 30天前
            "ruleType": "ge"
          },
          {
            "colName": "count_hour",
            "value": moment().format('YYYY-MM-DD'),
            "ruleType": "le"
          }
        ]
      } else if (type === 'year') {
        req.condition = [
          {
            "colName": "count_hour",
            "value": moment().subtract(11, 'month').format('YYYY-MM-DD'), // 11个月之前
            "ruleType": "ge"
          },
          {
            "colName": "count_hour",
            "value": moment().format('YYYY-MM-DD'),
            "ruleType": "le"
          }
        ]
      }
      let requestUrl = this.getServiceUrl("select", req.serviceName, "emr")
      this.axios({
        method: 'post',
        url: requestUrl,
        data: req
      }).then(res => {
        console.log(`share-data:${res}`);
      }).catch(err => {
        console.log(err);
      })
    },
    setCheckData() {
      let now = new Date()
      let self = this
      this.nowDate = now
      // setInterval(() => {
      if (this.showHospitalChart >= 5) {
        this.showHospitalChart = 0
      } else {
        self.showHospitalChart += 1
      }
      let hosData = self.hosData
      if (self.showHospitalChart == 0) {
        self.pie3Datas = self.pieData["延大附院"]
      } else if (self.showHospitalChart == 1) {
        self.pie3Datas = self.pieData["市人民医院"]
        self.collectPie3Datas = self.collectPie3Data['市人民医院']
        self.collectBar2Datas = self.collectBar2Data['市人民医院']
      } else if (self.showHospitalChart == 2) {
        self.amount.mz = this.collectMz
        self.amount.zy = this.collectZy
        self.pie3Datas = self.pieData["市中医医院"]
        self.collectPie3Datas = self.collectPie3Data['市中医医院']
        self.collectBar2Datas = self.collectBar2Data['市中医医院']
      } else if (self.showHospitalChart == 3) {
        self.pie3Datas = self.pieData["博爱医院"]
        self.collectPie3Datas = self.collectPie3Data['博爱医院']
        self.collectBar2Datas = self.collectBar2Data['博爱医院']
      } else if (self.showHospitalChart == 4) {
        self.pie3Datas = self.pieData["市妇幼保健院"]
        self.collectPie3Datas = self.collectPie3Data['市妇幼保健院']
        self.collectBar2Datas = self.collectBar2Data['市妇幼保健院']
      } else if (self.showHospitalChart == 5) {
        self.pie3Datas = self.pieData["宝塔区医院"]
      }
      // }, 5000);
    }

  },
  computed: {
    checktype() {
      this.checkTimeHorizon(this.checkDataType)
      return this.data.checkDataType
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
        type: 'line',
        center: ["50%", "55%"]
      }
    }
    this.chartExtendLineone = {
      grid: {
        top: '15%',
        bottom: "0",
        height: "auto"
      },
      series: {
        type: 'line',
        center: ["50%", "55%"]
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
        radius: [0, '30%']
      }
    }
    return {
      showHospitalChart: 0,
      collectPie3Datas: {},
      collectBar2Datas: {},
      timeHorizon: {},
      legend: {
        textStyle: {
          color: '#fff'
        }
      },
      pie3Datas: {},
      mzcs: 0,
      zycs: 0,
      pieData1: {
        hospital: {},
        card: {}
      },
      amount: {
        mz: 0,
        zy: 0
      },
      chartData: null
    }
  },
  props: ["collectBar1Data", "collectBar2Data", "collectPie1Data", "collectPie2Data", "collectPie3Data", "collectMz", "collectZy", "collectCountData", "swiperOptionTop", "shareBar1Data", "pieData", "card1", "chartSetting1", "chartData01", "card", "checkDataType", "hospital", "hospitaldata"],
  mounted() {
    let now = new Date()
    this.nowDate = now
    this.setCheckData()
    console.log("collectBar2Data", this.collectBar2Data)
    setInterval(() => {
      this.setCheckData()
    }, 5000);
    // this.checkTimeHorizon(this.checkDataType)
  },
  created() {

  },
}
</script>

<style lang="scss" scoped>
</style>