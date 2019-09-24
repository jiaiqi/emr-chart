<template>
  <div class="onecard_content">
    <dv-border-box-10 class="content_left">
      <div class="content_left_box">
        <div class="content_left_left">
          <div class="big-title">{{contentData.firstBar.title}}</div>
          <ve-histogram
            :data="contentData.firstBar.data"
            :settings="chartSetting"
            :extend="chartExtendLine"
            :textStyle="legend.textStyle"
            :legend="legend"
            width="40vw"
            height="calc(100% - 50px)"
          ></ve-histogram>
        </div>
        <div class="content_left_right">
          <div class="content_left_right_item">
            <div class="item_title">
              <dv-border-box-8>{{contentData.firstPie.title}}</dv-border-box-8>
            </div>
            <ve-pie
              height="28vh"
              :data="contentData.firstPie.data"
              :legend-visible="false"
              :extend="chartExtendPie"
            ></ve-pie>
          </div>
          <div class="content_left_right_item">
            <div class="item_title">
              <dv-border-box-8>{{contentData.secondPie.title}}</dv-border-box-8>
            </div>
            <ve-pie
              :data="contentData.secondPie.data"
              height="28vh"
              :legend-visible="false"
              :extend="chartExtendPie"
            ></ve-pie>
          </div>
        </div>
      </div>
    </dv-border-box-10>
    <dv-border-box-10 class="content_right">
      <div class="content_right_box" v-if="contentData.currentPage == 'oneCard'">
        <div class="content_right_content">
          <div class="tab_check">
            <div
              class="check_item"
              v-for="(item,index) in contentData.secondBar.tabCheckItem"
              :key="index"
              :class="{current_hospital:currentHospital==index}"
              @click="selectHospital(index)"
            >{{item}}</div>
          </div>
          <div class="tab_content">
            <div class="content_item">
              <ve-histogram
                height="30vh"
                :extend="chartExtendLine"
                :settings="chartSetting"
                :textStyle="legend.textStyle"
                :legend="legend"
                :data="contentData.secondBar.data[currentHospital]"
              ></ve-histogram>
            </div>
          </div>
        </div>
        <div class="content_right_bottom">
          <div class="content_right_bottom_item">
            <div class="count">
              <div class="label">门诊次数</div>
              <div class="text-val" v-if="countData.length>0">{{countData[currentHospital].门诊}}</div>
            </div>
            <div class="count">
              <div class="label">住院次数</div>
              <div class="text-val" v-if="countData.length>0">{{countData[currentHospital].住院}}</div>
            </div>
          </div>
          <div class="content_right_bottom_item">
            <div class="content_left_right_item">
              <div class="item_title">
                <dv-border-box-8>{{contentData.thirdPie.title}}</dv-border-box-8>
              </div>
              <ve-pie
                :data="contentData.thirdPie.data[currentHospital]"
                height="28vh"
                :legend="legend"
                :extend="chartExtendPie"
              ></ve-pie>
            </div>
          </div>
        </div>
      </div>
      <div class="content_right_box" v-else-if="contentData.currentPage=='dataShare'">
        <div
          class="content_right_content"
          :class="{content_right_content_datacenter:contentData.currentPage==='dataShare'}"
        >
          <div class="tab_content">
            <div
              style="text-align:center;margin:10px;"
              class="item_title"
            >{{contentData.secondBar.title}}</div>
            <div class="content_item">
              <ve-histogram height="70vh"></ve-histogram>
            </div>
          </div>
        </div>
      </div>
      <div class="databox_three" v-else-if="contentData.currentPage === 'ETL'">
        <div class="last">
          <span>上一次</span>
          <span>下一次</span>
          <span>选择记录</span>
        </div>
        <div class="gantt_task">
          <!-- <span
            @click="checkTask(item)"
            v-for="(item,index) in taskName"
            :key="index"
          >{{item.job_name}}</span>-->
          <span>任务1</span>
        </div>
        <div class="databox_three_content">
          <div class="databox_three_contentheader">
            <div class="databox-col">开始时间</div>
            <div class="databox-col">任务名称</div>
            <div class="databox-col">失败记录数</div>
            <div class="databox-col">成功记录数</div>
            <div class="databox-col">输入记录数</div>
            <div class="databox-col">输出记录数</div>
            <div class="databox-col">结束时间</div>
          </div>
          <!-- <div
            v-show="index < 6"
            class="databox-three-contentdata-view"
            v-for="(item,index) in GanttData"
            :key="index"
          >-->
          <div class="databox-three-contentdata-view">
            <div class="databox-col">2019-9-9</div>
            <div class="databox-col">one</div>
            <div class="databox-col">1</div>
            <div class="databox-col">1</div>
            <div class="databox-col">1</div>
            <div class="databox-col">1</div>
            <div class="databox-col">2019-9-9</div>
            <!-- <div class="databox-col">{{item.item08}}</div> -->
          </div>
          <!-- <div style="text-align:center;padding:5rem 0;" v-if="!this.GanttData.length">~ 暂无数据 ~</div> -->
        </div>
      </div>
    </dv-border-box-10>
  </div>
</template>

<script>
export default {
  name: "OnecardContent",
  data() {
    return {
      data: {},
      firstBar: {
        title: "",
        data: {}
      },
      secondBar: {
        title: "",
        data: {}
      },
      firstPie: {
        title: "",
        data: {}
      },
      secondPie: {
        title: "",
        data: {}
      },
      thirdPie: {
        title: "",
        data: {}
      },
      countData: [],
      CurrPage: "datacenter",
      tabCheckItem: [],
      chartSettings: {},
      chartExtendLine: {
        grid: {
          top: '10%',
          bottom: "0",
          height: "auto"
        },
        series: {
          type: "bar",
          itemStyle: {
            normal: {
              label: {
                show: true
              }
            }
          }
        }
      },
      chartExtendPie: {
        grid: {
          top: '10',
          bottom: "0",
          height: "auto"
        },
        series: {
          type: 'pie',
          center: ["50%", "50%"],
          radius: [0, '30%'],
          label: {
            normal: {
              show: true,
              formatter: '{b}:{d}%'
            }
          },
        }
      },
      currentHospital: 0,
      legend: {
        textStyle: {
          color: '#fff'
        }
      },
    };
  },
  methods: {
    autoChangeHospital(interval = 3000) {
      // 自动切换医院数据
      setInterval(() => {
        if (this.currentHospital < 5) {
          this.currentHospital += 1
        } else {
          this.currentHospital = 0
        }
      }, interval);
    },
    selectHospital(index) {
      // 点击选择医院
      this.currentHospital = index
    }
  },
  props: {
    contentData: {
      type: Object,
      default: {}
    },
    chartSetting: {
      type: Object,
      default: {}
    }
  },
  watch: {
    contentData: {
      deep: true,
      handler(newValue, oldValue) {
        this.chartExtendLine.series.type = newValue.firstBar.type
        this.countData = newValue.countData
        return newValue;
      }
    }
  },
  mounted() {
    this.autoChangeHospital(3000)
  },
};
</script>

<style lang="scss" scoped>
$br-color: #4b93ff78;
$bg-color: #ed795a;
$text-color: #47acff;
.onecard_content {
  display: flex;
  height: calc(100% - 10rem /* 140/16 */);
  justify-content: space-between;
  margin: 1.25rem /* 20/16 */ 2rem;
  box-sizing: border-box;
  .content_left {
    display: flex;
    flex: 6.5;
    box-sizing: border-box;
    margin-right: 1.25rem /* 20/16 */;
    .content_left_box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 1rem;
      box-sizing: border-box;
      .content_left_left {
        border: #007aff 1px solid;
        // margin: 1rem;
        height: 100%;
        box-sizing: border-box;
        float: left;
        width: 66%;
        // margin: 0 1rem;
        .big-title {
          padding: 0 1.25rem /* 20/16 */;
          text-align: center;
          line-height: 3.125rem /* 50/16 */;
          font-size: 1.2rem;
        }
      }
      .content_left_right {
        padding-left: 1rem;
        flex: auto;
        height: 100%;
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .content_left_right_item {
          height: 49%;
          width: 100%;
          border: #007aff 1px solid;
          .item_title {
            height: 2rem;
            line-height: 2rem;
            text-indent: 1rem;
          }
        }
      }
    }
  }
  .content_right {
    flex: 3.5;
    .content_right_box {
      height: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .content_right_content {
        width: 100%;
        border: #007aff 1px solid;
        height: calc(53% - 1rem);
        width: calc(100% - 3rem);
        margin: 0 auto;
        margin-top: 1rem;
        .tab_check {
          display: flex;
          width: 98%;
          line-height: 2rem;
          margin: 0 auto;
          justify-content: center;
          .check_item {
            padding: 0 0.5rem;
            border-bottom: 1px solid #007aff;
            font-size: 0.9rem;
            &.current_hospital {
              color: #fff;
              border-top-right-radius: 5px;
              border-top-left-radius: 5px;
              border: 1px solid #024994;
              background-color: #007aff;
              border-bottom: none;
            }
          }
        }
      }
      .content_right_content_datacenter {
        width: 100%;
        border: #007aff 1px solid;
        width: calc(100% - 3rem);
        height: 95%;
        margin: 0 auto;
        margin-top: 1rem;
        .tab_check {
          display: flex;
          width: 98%;
          line-height: 2rem;
          margin: 0 auto;
          justify-content: center;
          .check_item {
            padding: 0 0.5rem;
            border-bottom: 1px solid #007aff;
            &.current_hospital {
              color: #fff;
              border-top-right-radius: 5px;
              border-top-left-radius: 5px;
              border: 1px solid #024994;
              background-color: #007aff;
              border-bottom: none;
            }
          }
        }
      }
      .content_right_bottom {
        height: calc(45% - 1rem);
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
        .content_right_bottom_item {
          // margin: 0 auto;
          border: #007aff 1px solid;
          width: calc(47% - 1rem);
          .count {
            text-align: center;
            height: 40%;
            .label {
              font-size: 1rem;
            }
            .text-val {
              font-size: 2rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #007aff;
            }
          }
          &:first-child {
            display: flex;
            align-items: center;
            justify-content: space-around;
            flex-direction: column;
            margin-right: 1.5rem;
          }
          .item_title {
            height: 2rem;
            line-height: 2rem;
            text-indent: 1rem;
          }
        }
      }
    }

    .databox_three {
      width: 100%;
      height: 100%;
      padding: 1rem;
      box-sizing: border-box;
      background-size: 100% 100%;
      .last {
        display: flex;
        justify-content: flex-end;
        span {
          margin-right: 1rem;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .gantt_task {
        display: flex;
        margin-bottom: 1rem;
        margin-top: 1rem;
        span {
          // margin-left: 1rem;
          padding-right: 1rem;
          background-color: #47acff;
          padding: 4px;
          text-align: center;
          color: #fff;
          border-right: 1px solid rgb(17, 44, 194);
          &:last-child {
            border-right: 0;
          }
          cursor: pointer;
        }
      }
      .databox_three_content {
        border: 1px solid $br-color;
      }
      .databox_three_top {
        line-height: 1.8rem;
        text-align: center;
        font-size: 1.5rem;
      }

      .databox_three_contentheader {
        > .databox-col {
          font-weight: bold;
          color: $text-color;
        }
      }

      .databox_three_contentheader,
      .databox-three-contentdata-view {
        display: flex;
        flex-direction: row;
        padding: 5px 0;
        align-items: center;
        box-sizing: border-box;
        border-bottom: 1px solid $br-color;
        line-height: 1rem;
        > .databox-col {
          width: 14.2%;
          font-size: 0.8rem;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          border-right: 1px solid $br-color;
          text-align: center;
          word-break: break-all;
          img {
            width: 2.8rem;
          }
          &:last-child {
            border-right: 0;
          }
        }
      }

      .databox-three-contentdata-view:last-child {
        border-width: 0;
      }
    }
  }
}
</style>