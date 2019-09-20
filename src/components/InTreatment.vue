<template>
  <div class="content">
    <dv-border-box-10 class="content_left col-65">
      <div class="content_left_left">
        <div class="big-title">一卡通就诊次数</div>
        <ve-histogram
          width="40vw"
          height="calc(100% - 50px)"
          data
          :settings="chartSetting1"
          :textStyle="legend.textStyle"
          :extend="chartExtendLine"
          :legend="legend"
        ></ve-histogram>
      </div>
      <div class="content_left_right">
        <div class="content_left_right_item">
          <div class="item_title">
            <dv-border-box-8>各医院就诊分布</dv-border-box-8>
          </div>
          <ve-pie data :extend="chartExtendPie2" height="28vh" :legend-visible="false"></ve-pie>
        </div>
        <div class="content_left_right_item">
          <div class="item_title">
            <dv-border-box-8>就诊刷卡类型分布</dv-border-box-8>
          </div>
          <ve-pie data :extend="chartExtendPie3" height="28vh" :legend-visible="false"></ve-pie>
        </div>
      </div>
    </dv-border-box-10>
    <dv-border-box-10 class="content_right col-35" ref="hospital_swiper">
      <div class="content_right_content">
        <div class="tab_check">
          <div class="check_item">延大附院</div>
          <div class="check_item">市人民医院</div>
          <div class="check_item">市中医医院</div>
          <div class="check_item">博爱医院</div>
          <div class="check_item">市妇幼保健院</div>
          <div class="check_item">宝塔区医院</div>
        </div>
        <div class="tab_content">
          <div class="content_item">
            <ve-histogram
              data
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
            <div class="label">门诊次数</div>
            <div class="text-val"></div>
          </div>
          <div>
            <div class="label">住院次数</div>
            <div class="text-val"></div>
          </div>
        </div>
        <div class="content_right_bottom_item">
          <div class="content_left_right_item">
            <div class="item_title">
              <dv-border-box-8>就诊刷卡类型分布</dv-border-box-8>
            </div>
            <ve-pie data :extend="chartExtendPie" height="28vh" :legend-visible="false"></ve-pie>
          </div>
        </div>
      </div>
    </dv-border-box-10>
  </div>
</template>

<script>
export default {
  name: "InTreatment",
  data() {
    this.chartExtendLine = {
      grid: {
        top: '10%',
        bottom: "0",
        height: "auto"
      },
      series: {
        type: 'bar',
      }
    }
    this.chartExtendPie = {
      grid: {
        top: '0',
        bottom: "0",
        height: "auto"
      },
      series: {
        type: 'pie',
        center: ["50%", "50%"],
        radius: [0, '30%'],
        labelLine: {
          smooth: false,
          length: 4
        }
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
      legend: {
        textStyle: {
          color: '#fff'
        }
      },
      chartData: []
    }
  },
  methods: {
    getChartData(timeSlot = 'day') {
      let serviceName = "srvcvs_medical_records_select"
      let url = this.getServiceUrl("select", serviceName, "cvs")
      let req = {
        "serviceName": serviceName,
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
      if (time === 'day') {

      } else if (time === 'week') {

      } else if (time === 'month') {

      } else if (time === 'year') {

      }
    }
  },
  props: [],
  mounted() {

  },
  created() {

  },
}
</script>

<style lang="scss" scoped>
</style>