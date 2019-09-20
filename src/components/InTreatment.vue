<template>
  <div class="content">
    <dv-border-box-10 class="content_left col-65">
      <div class="content_left_left">
        <div class="big-title">一卡通就诊次数</div>
        <ve-histogram
          width="40vw"
          height="calc(100% - 50px)"
          :data="chartData01"
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
          <ve-pie :data="hospital" :extend="chartExtendPie2" height="28vh" :legend-visible="false"></ve-pie>
        </div>
        <div class="content_left_right_item">
          <div class="item_title">
            <dv-border-box-8>就诊刷卡类型分布</dv-border-box-8>
          </div>
          <ve-pie :data="card1" :extend="chartExtendPie3" height="28vh" :legend-visible="false"></ve-pie>
        </div>
      </div>
    </dv-border-box-10>
    <dv-border-box-10 class="content_right col-35" ref="hospital_swiper">
      <div class="content_right_content">
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
              :data="chartData"
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
            <div class="text-val">{{mzcs}}</div>
          </div>
          <div>
            <div class="label">住院次数</div>
            <div class="text-val">{{zycs}}</div>
          </div>
        </div>
        <div class="content_right_bottom_item">
          <div class="content_left_right_item">
            <div class="item_title">
              <dv-border-box-8>就诊刷卡类型分布</dv-border-box-8>
            </div>
            <ve-pie
              :data="pie3Datas"
              :extend="chartExtendPie"
              height="28vh"
              :legend-visible="false"
            ></ve-pie>
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
      pieData1: {
        hospital: {},
        card: {}
      },
      pie3Datas: {},
      card: {},
      mzcs: 0,
      zycs: 0,
      chartData: null
    }
  },
  methods: {
    checkHospital(num) {
      let hosData = this.hosData
      if (num == 0) {
        this.chartData = hosData["延大附院"]
        this.mzcs = this.countData["延大附院"].门诊
        this.zycs = this.countData["延大附院"].住院
        this.pie3Datas = this.pieData["延大附院"]
      } else if (num == 1) {
        this.chartData = hosData["市人民医院"]
        this.mzcs = this.countData["市人民医院"].门诊
        this.zycs = this.countData["市人民医院"].住院
        this.pie3Datas = this.pieData["市人民医院"]
      } else if (num == 2) {
        this.chartData = hosData["市中医医院"]
        this.mzcs = this.countData["市中医医院"].门诊
        this.zycs = this.countData["市中医医院"].住院
        this.pie3Datas = this.pieData["市中医医院"]
      } else if (num == 3) {
        this.chartData = hosData["博爱医院"]
        this.mzcs = this.countData["博爱医院"].门诊
        this.zycs = this.countData["博爱医院"].住院
        this.pie3Datas = this.pieData["博爱医院"]
      } else if (num == 4) {
        this.chartData = hosData["市妇幼保健院"]
        this.mzcs = this.countData["市妇幼保健院"].门诊
        this.zycs = this.countData["市妇幼保健院"].住院
        this.pie3Datas = this.pieData["市妇幼保健院"]
      } else if (num == 5) {
        this.chartData = hosData["宝塔区医院"]
        this.mzcs = this.countData["宝塔区医院"].门诊
        this.zycs = this.countData["宝塔区医院"].住院
        this.pie3Datas = this.pieData["宝塔区医院"]
      }
      // this.card = this.card_num_pie[this.checkDataType]
      this.showHospitalChart = num
    },
    setCheckData() {
      let now = new Date()
      let self = this
      this.nowDate = now
      // setTimeout(() => {
      //   let hosData = self.hosData
      //   this.chartData = hosData["延大附院"]
      // }, 100);
      if (this.showHospitalChart >= 5) {
        this.showHospitalChart = 0
      } else {
        self.showHospitalChart += 1
      }
      let hosData = self.hosData
      if (self.showHospitalChart == 0) {
        self.chartData = hosData["延大附院"]
        self.mzcs = this.countData["延大附院"].门诊
        self.zycs = this.countData["延大附院"].住院
        self.pie3Datas = self.pieData["延大附院"]
      } else if (self.showHospitalChart == 1) {
        self.mzcs = this.countData["市人民医院"].门诊
        self.zycs = this.countData["市人民医院"].住院
        self.chartData = hosData["市人民医院"]
        self.pie3Datas = self.pieData["市人民医院"]
      } else if (self.showHospitalChart == 2) {
        self.mzcs = this.countData["市中医医院"].门诊
        self.zycs = this.countData["市中医医院"].住院
        self.chartData = hosData["市中医医院"]
        self.pie3Datas = self.pieData["市中医医院"]
      } else if (self.showHospitalChart == 3) {
        self.mzcs = this.countData["博爱医院"].门诊
        self.zycs = this.countData["博爱医院"].住院
        self.chartData = hosData["博爱医院"]
        self.pie3Datas = self.pieData["博爱医院"]
      } else if (self.showHospitalChart == 4) {
        self.mzcs = this.countData["市妇幼保健院"].门诊
        self.zycs = this.countData["市妇幼保健院"].住院
        self.chartData = hosData["市妇幼保健院"]
        self.pie3Datas = self.pieData["市妇幼保健院"]
      } else if (self.showHospitalChart == 5) {
        self.mzcs = this.countData["宝塔区医院"].门诊
        self.zycs = this.countData["宝塔区医院"].住院
        self.chartData = hosData["宝塔区医院"]
        self.pie3Datas = self.pieData["宝塔区医院"]
      }
    }
  },
  props: ["swiperOptionTop", "chartSetting1", "chartData01", "hospital", "checkDataType", "pieData", "countData", "hosData", "card1"],
  mounted() {
    setInterval(() => {
      this.setCheckData()
    }, 5000);
    // console.log(this.countData)
  },
  created() {

  },
  watch: {
    'countData': {
      handler(newName, oldName) {
        // ...
        this.setCheckData()
      },
      deep: true,
      // immediate: true
    }
  }

}
</script>

<style lang="scss" scoped>
</style>