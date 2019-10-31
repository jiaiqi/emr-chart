<template>
  <div class="content">
    <dv-border-box-10 class="content_left col-65">
      <div class="content_left_left">
        <div class="big-title">电子病历查询统计</div>
        <ve-histogram
          height="calc(100% - 50px)"
          width="40vw"
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
            <dv-border-box-8 :reverse="true">各医院查询次数分布</dv-border-box-8>
          </div>
          <ve-pie data :extend="chartExtendPie2" :legend-visible="false" height="30vh"></ve-pie>
        </div>
        <div class="content_left_right_item">
          <div class="item_title">
            <dv-border-box-8 :reverse="true">身份验证卡类型分布</dv-border-box-8>
          </div>
          <ve-pie data :extend="chartExtendPie" :legend-visible="false" height="30vh"></ve-pie>
        </div>
      </div>
    </dv-border-box-10>
    <dv-border-box-10 class="content_right col-35" ref="hospital_swiper">
      <div class="content_right_content">
        <!-- <div class="item_title_long">电子病历查询次数柱状图</div> -->
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
            <div class="label">总查询次数</div>
            <div class="text-val"></div>
          </div>
          <div>
            <div class="label">总验证次数</div>
            <div class="text-val"></div>
          </div>
        </div>
        <div class="content_right_bottom_item">
          <div class="content_left_right_item" style="height: 260px;">
            <div class="item_title">
              <dv-border-box-8>身份验证卡类型分布</dv-border-box-8>
            </div>
            <ve-pie data :extend="chartExtendPie" :legend-visible="false" height="28vh"></ve-pie>
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

  },
  computed: {

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

      legend: {
        textStyle: {
          color: '#fff'
        }
      },
    }
  },
  watch: {

  },
  props: [],

  mounted() {

  }
}
</script>

<style lang="scss" scoped>
</style>