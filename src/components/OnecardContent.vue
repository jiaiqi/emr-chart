<template>
  <div class="onecard_content">
    <dv-border-box-10 class="content_left">
      <div class="content_left_box">
        <div class="content_left_left">
          <div class="big-title">{{ contentData.firstBar.title }}</div>
          <ve-histogram
            :data="contentData.firstBar.data"
            :settings="chartSetting"
            :extend="chartExtendLine"
            :textStyle="legend.textStyle"
            :legend="legend"
            height="calc(100% - 50px)"
            v-if="
              contentData.firstBar.data.rows &&
                contentData.firstBar.data.rows.length > 0
            "
          ></ve-histogram>
          <div v-else class="mask">
            <span>~暂无数据~</span>
          </div>
        </div>
        <div class="content_left_right">
          <div class="content_left_right_item">
            <div class="item_title">
              <dv-border-box-8>{{
                contentData.firstPie.title
              }}</dv-border-box-8>
            </div>
            <ve-pie
              v-if="
                contentData.firstPie.data.rows &&
                  contentData.firstPie.data.rows.length > 0
              "
              :data="contentData.firstPie.data"
              class="etlPos"
              height="28vh"
              :extend="chartExtendPie"
              :settings="chartPieSetting"
            ></ve-pie>
            <div v-else class="mask">
              <span>~暂无数据~</span>
            </div>
          </div>
          <div class="content_left_right_item">
            <div class="item_title">
              <dv-border-box-8>{{
                contentData.secondPie.title
              }}</dv-border-box-8>
            </div>
            <ve-pie
              class="etlPos"
              :data="contentData.secondPie.data"
              :extend="chartExtendPie"
              :settings="chartPieSetting"
              height="28vh"
              v-if="
                (contentData.currentPage === 'emrCollect' ||
                  contentData.currentPage === 'emrShare' ||
                  contentData.currentPage === 'oneCard') &&
                  contentData.secondPie.data.rows &&
                  contentData.secondPie.data.rows.length > 0
              "
            ></ve-pie>
            <ve-pie
              :data="contentData.secondPie.data"
              class="etlPos"
              :settings="chartPieSetting"
              :extend="chartExtendPie"
              height="28vh"
              v-if="
                (contentData.currentPage === 'ETL' ||
                  contentData.currentPage === 'dataShare') &&
                  contentData.secondPie.data.rows &&
                  contentData.secondPie.data.rows.length > 0
              "
            ></ve-pie>
            <div
              v-if="contentData.secondPie.data.rows.length === 0"
              class="mask"
            >
              <span>~暂无数据~</span>
            </div>
          </div>
        </div>
      </div>
    </dv-border-box-10>
    <dv-border-box-10 class="content_right">
      <div
        class="content_right_box"
        v-if="
          contentData.currentPage == 'oneCard' ||
            contentData.currentPage == 'emrShare' ||
            contentData.currentPage == 'emrCollect'
        "
      >
        <div class="content_right_content">
          <div class="tab_check">
            <div
              class="check_item"
              v-for="(item, index) in contentData.secondBar.tabCheckItem"
              :key="index"
              :class="{ current_hospital: currentHospital == index }"
              @click="selectHospital(index)"
            >
              {{ item }}
            </div>
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
                v-if="
                  contentData.secondBar.data[currentHospital] &&
                    contentData.secondBar.data[currentHospital].rows &&
                    contentData.secondBar.data[currentHospital].rows.length > 0
                "
              ></ve-histogram>
              <div v-else class="mask">
                <span>~暂无数据~</span>
              </div>
            </div>
          </div>
        </div>
        <div class="content_right_bottom">
          <div class="content_right_bottom_item">
            <div class="count">
              <div class="label" v-if="contentData.currentPage === 'oneCard'">
                门诊次数
              </div>
              <div class="label" v-if="contentData.currentPage === 'emrShare'">
                总查询次数
              </div>
              <div
                class="label"
                v-if="contentData.currentPage === 'emrCollect'"
              >
                门诊总数
              </div>
              <div
                class="text-val"
                v-if="
                  countData.length > 0 && contentData.currentPage === 'oneCard'
                "
              >
                {{ countData[currentHospital].门诊 }}
              </div>
              <div
                class="text-val"
                v-if="
                  countData.length > 0 && contentData.currentPage === 'emrShare'
                "
              >
                {{ countData[currentHospital].select }}
              </div>
              <div
                class="text-val"
                v-if="
                  countData.length > 0 &&
                    contentData.currentPage === 'emrCollect'
                "
              >
                {{ countData[currentHospital].门诊 }}
              </div>
            </div>
            <div class="count">
              <div class="label" v-if="contentData.currentPage === 'oneCard'">
                住院次数
              </div>
              <div class="label" v-if="contentData.currentPage === 'emrShare'">
                总验证次数
              </div>
              <div
                class="label"
                v-if="contentData.currentPage === 'emrCollect'"
              >
                住院总数
              </div>
              <div
                class="text-val"
                v-if="
                  countData.length > 0 && contentData.currentPage === 'oneCard'
                "
              >
                {{ countData[currentHospital].住院 }}
              </div>
              <div
                class="text-val"
                v-if="
                  countData.length > 0 && contentData.currentPage === 'emrShare'
                "
              >
                {{ countData[currentHospital].verify }}
              </div>
              <div
                class="text-val"
                v-if="
                  countData.length > 0 &&
                    contentData.currentPage === 'emrCollect'
                "
              >
                {{ countData[currentHospital].住院 }}
              </div>
            </div>
          </div>
          <div class="content_right_bottom_item">
            <div class="content_left_right_item">
              <div class="item_title">
                <dv-border-box-8>{{
                  contentData.thirdPie.title
                }}</dv-border-box-8>
              </div>
              <ve-pie
                :data="contentData.thirdPie.data[currentHospital]"
                :extend="chartExtendPie"
                height="28vh"
                :settings="chartPieSetting"
                v-if="
                  (contentData.currentPage === 'emrShare' ||
                    contentData.currentPage === 'oneCard' ||
                    contentData.currentPage === 'emrCollect') &&
                    contentData.thirdPie.data[currentHospital]
                "
              ></ve-pie>
              <!-- <ve-pie
                :data="contentData.thirdPie.data[currentHospital]"
                :extend="chartExtendPie"
                :settings="chartPieSetting"
                v-if="(contentData.currentPage==='emrCollect'||contentData.currentPage==='emrShare'||contentData.currentPage==='oneCard') && contentData.thirdPie.data && contentData.thirdPie.data.length > 0"
              ></ve-pie>-->
              <div
                v-if="!contentData.thirdPie.data[currentHospital]"
                class="mask"
              >
                <span>~暂无数据~</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="content_right_box"
        v-else-if="contentData.currentPage == 'dataShare'"
      >
        <div
          class="content_right_content"
          :class="{
            content_right_content_datacenter:
              contentData.currentPage === 'dataShare'
          }"
        >
          <div class="tab_content">
            <div style="text-align:center;margin:10px;" class="item_title">
              {{ contentData.secondBar.title }}
            </div>
            <div class="content_item">
              <ve-histogram
                :settings="contentData.secondBar.set"
                :data="contentData.secondBar.data"
                :textStyle="legend.textStyle"
                :legend="legend"
                :extend="rightChartExtend"
                v-if="
                  contentData.secondBar.data.rows &&
                    contentData.secondBar.data.rows.length > 0
                "
                height="70vh"
              ></ve-histogram>
              <div v-else class="mask">
                <span>~暂无数据~</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="databox_three" v-else-if="contentData.currentPage === 'ETL'">
        <!-- <div class="last">
          <span @click="GoLast">上一次</span>
          <span @click="GoNext">下一次</span>
          <span>选择记录</span>
        </div>-->
        <div class="gantt_task">
          <span
            @click="choose(item, index)"
            v-for="(item, index) in contentData.secondBar.tableData.title"
            :key="index"
            :class="{ hos: Act == index }"
            >{{ item.job_name }}</span
          >
        </div>
        <div class="databox_three_content">
          <div class="databox_three_contentheader">
            <div class="databox-col">开始时间</div>
            <div class="databox-col">结束时间</div>
            <div class="databox-col">任务名称</div>
            <div class="databox-col">输入记录数</div>
            <div class="databox-col">成功记录数</div>
            <div class="databox-col">失败记录数</div>
            <div class="databox-col">输出记录数</div>
          </div>
          <div
            v-show="index < 5"
            class="databox-three-contentdata-view"
            v-for="(item, index) in contentData.secondBar.tableData.GanttData"
            :key="index"
          >
            <div v-if="item.start_time" class="databox-col time">
              <span>{{
                item.start_time ? item.start_time.split(" ")[0] : ""
              }}</span>
              <br style="display:none" />
              <span>{{
                item.start_time ? item.start_time.split(" ")[1] : ""
              }}</span>
              <!-- {{item.start_time?item.start_time.split(" ")[0]:""}} -->
            </div>
            <div v-else class="databox-col time">
              {{ item.start_time ? item.start_time : "" }}
            </div>
            <div v-if="item.end_time" class="databox-col time">
              <span>{{
                item.end_time ? item.end_time.split(" ")[0] : ""
              }}</span>
              <br style="display:none" />
              <span>{{
                item.end_time ? item.end_time.split(" ")[1] : ""
              }}</span>
            </div>
            <div v-else class="databox-col">
              {{ item.end_time ? item.end_time : "" }}
            </div>
            <div class="databox-col">
              {{ item.processor_name ? item.processor_name : "" }}
            </div>
            <div class="databox-col">
              {{ item.input_record_count ? item.input_record_count : 0 }}
            </div>
            <div class="databox-col">
              {{ item.ok_records_count ? item.ok_records_count : 0 }}
            </div>
            <div class="databox-col">
              {{ item.failed_records_count ? item.failed_records_count : 0 }}
            </div>
            <div class="databox-col">
              {{ item.output_record_count ? item.output_record_count : 0 }}
            </div>
            <!-- <div class="databox-col">{{item.item08}}</div> -->
          </div>
          <div
            style="text-align:center;padding:5rem 0;"
            v-if="!contentData.secondBar.tableData.GanttData.length"
          >
            ~ 暂无数据 ~
          </div>
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
      Act: 0,
      loading: true,
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
      chartPieSetting: { limitShowNum: 5 },
      chartExtendLine: {
        grid: {
          top: "10%",
          bottom: "0",
          height: "auto"
        },
        legend: {
          type: "scroll",
          textStyle: {
            color: "#fff"
          },
          pageTextStyle: {
            color: "#fff"
          },
          pageIconColor: "#3399ff"
        },
        series: {
          type: null,
          itemStyle: {
            normal: {
              label: {
                // show: true
              }
            }
          }
        }
      },
      chartExtendLine2: {
        grid: {
          top: "10%",
          bottom: "0",
          height: "auto"
        },
        legend: {
          type: "scroll",
          textStyle: {
            color: "#fff"
          },
          pageTextStyle: {
            color: "#fff"
          },
          pageIconColor: "#3399ff"
        },
        series: {
          type: "bar",
          itemStyle: {
            normal: {
              label: {
                // show: true
              }
            }
          }
        }
      },
      chartExtendPie: {
        legend: {
          type: "scroll",
          textStyle: {
            color: "#fff"
          },
          selectedMode: false,
          pageTextStyle: {
            color: "#fff"
          },
          pageIconColor: "#3399ff"
        },
        series: {
          type: "pie",
          center: ["50%", "50%"],
          radius: [0, "30%"],
          avoidLabelOverlap: true,
          label: {
            normal: {
              show: true,
              // formatter: "{b}:{d}%"
              formatter: params => {
                let length = params.name.length;
                if (length < 6) {
                  // params.name = params.name.slice(0, 16) + params.name.slice(4)
                  params.name = params.name;
                } else if (length > 6) {
                  params.name = params.name.slice(0, 6) + "...";
                }
                return (
                  "{c|" + params.percent + "%}" + "{b| " + params.name + "}"
                );
              },
              rich: {
                c: {
                  color: "rgb(241,246,104)",
                  fontSize: 10
                  // fontWeight: 'bold',
                  // lineHeight: 10
                },
                b: {
                  color: "rgb(98,137,169)",
                  fontSize: 12
                  // height: 20
                }
              }
            }
          },
          labelLine: {
            length: 8,
            length2: 4
          }
        }
      },
      chartExtendPieL: {
        legend: {
          type: "scroll",
          textStyle: {
            color: "#fff"
          },
          pageTextStyle: {
            color: "#fff"
          },
          pageIconColor: "#3399ff"
        },
        series: {
          type: "pie",
          center: ["50%", "50%"],
          radius: [0, "30%"],
          avoidLabelOverlap: true,
          label: {
            normal: {
              show: true,
              // formatter: "{b}:{d}%"
              formatter: params => {
                let length = params.name.length;
                if (length < 6) {
                  // params.name = params.name.slice(0, 16) + params.name.slice(4)
                  params.name = params.name;
                } else if (length > 6) {
                  params.name = params.name.slice(0, 6) + "...";
                }
                return (
                  "{c|" +
                  params.percent.toFixed(2) +
                  "%}" +
                  "{b| " +
                  params.name +
                  "}"
                );
              },
              rich: {
                c: {
                  color: "rgb(241,246,104)",
                  fontSize: 10
                  // fontWeight: 'bold',
                  // lineHeight: 10
                },
                b: {
                  color: "rgb(98,137,169)",
                  fontSize: 12
                  // height: 20
                }
              }
            }
          },
          labelLine: {
            length: 8,
            length2: 4
          }
        }
      },
      chartExtendPieS: {
        legend: {
          type: "scroll",
          textStyle: {
            color: "#fff"
          },
          pageTextStyle: {
            color: "#fff"
          },
          pageIconColor: "#3399ff"
        },
        // 小饼图
        series: {
          type: "pie",
          center: ["50%", "50%"],
          radius: [0, "30%"],
          avoidLabelOverlap: true,
          label: {
            normal: {
              show: true,
              formatter: ["{d|{d}%}", "{b|{b}}"].join("\n"),
              formatter: params => {
                let length = params.name.length;
                if (length < 6) {
                  // params.name = params.name.slice(0, 16) + params.name.slice(4)
                  params.name = params.name;
                } else if (length > 6) {
                  params.name = params.name.slice(0, 6) + "...";
                }
                return (
                  "{c|" +
                  params.percent.toFixed(0) +
                  "%}" +
                  "{b| " +
                  params.name +
                  "}"
                );
              },
              rich: {
                c: {
                  color: "rgb(241,246,104)",
                  fontSize: 10
                  // fontWeight: 'bold',
                  // lineHeight: 10
                },
                b: {
                  color: "rgb(98,137,169)",
                  fontSize: 12
                  // height: 20
                }
              }
            }
          },
          labelLine: {
            length: 8,
            length2: 4
          }
        }
      },
      currentHospital: 0,
      legend: {
        type: "scroll",
        textStyle: {
          color: "#fff"
        }
      },
      rightChartExtend: {
        series: { type: "bar" },
        xAxis: {
          axisLabel: {
            margin: 10,
            interval: 0
          }
        },
        yAxis: {
          interval: ""
        }
      },
      taskName: [],
      chooseNum: 0
    };
  },
  methods: {
    selectHospital(index) {
      // 点击选择医院
      this.currentHospital = index;
    },
    autoChangeHospital(interval) {
      // 医院轮播
      setInterval(() => {
        if (this.currentHospital >= 5) {
          this.currentHospital = 0;
        } else {
          this.currentHospital += 1;
        }
      }, interval);
    },
    choose(item, index) {
      this.Act = index;
      this.$emit("checktask", item);
    },
    GoLast() {
      this.chooseNum++;
      if (
        this.chooseNum <=
        this.contentData.secondBar.tableData.step.length - 1
      ) {
        this.contentData.secondBar.tableData.taskNo = this.contentData.secondBar.tableData.step[
          this.chooseNum
        ].job_no;

        this.$parent.getNewTask(this.contentData.secondBar.tableData.taskNo);
      }
    },
    GoNext() {
      if (this.chooseNum > 0) this.chooseNum--;

      this.contentData.secondBar.tableData.taskNo = this.contentData.secondBar.tableData.step[
        this.chooseNum
      ].job_no;
      this.$parent.getNewTask(this.contentData.secondBar.tableData.taskNo);
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
  created() {
    if (
      this.contentData.currentPage === "ETL" ||
      this.contentData.currentPage === "emrCollect"
    ) {
      this.chartExtendLine.series.type = "line";
    }
  },
  watch: {
    contentData: {
      deep: true,
      handler(newValue, oldValue) {
        this.rightChartExtend.yAxis.interval = newValue.secondBar.interval;
        this.countData = newValue.countData;
        if (this.contentData.currentPage === "dataShare") {
          this.chartExtendLine.series.type = newValue.firstBar.set.type;
        } else if (this.contentData.currentPage === "ETL") {
          this.chartExtendLine.series.type = newValue.firstBar.set.type;
        } else {
          this.chartExtendLine.series.type = newValue.firstBar.type;
        }

        if (this.contentData.currentPage === "ETL") {
          let PieSeriesL = {
            type: "pie",
            center: ["50%", "40%"],
            radius: [0, "30%"],
            label: {
              normal: {
                show: true,
                formatter: "{d}%"
              }
            }
          };
          let PieSeries = {
            type: "pie",
            center: ["50%", "40%"],
            radius: [0, "30%"],
            label: {
              normal: {
                show: true,
                formatter: "{d}%"
              }
            }
          };
          this.chartPieSetting = { limitShowNum: 5 };
          // this.chartExtendPieL.series = PieSeriesL;
          // this.chartExtendPie.series = PieSeries;

          this.chartExtendPieL["legend"] = {
            show: true,
            type: "scroll",
            textStyle: { color: "#ffffff" }
          };
          this.chartExtendPie["legend"] = {
            show: true,
            type: "scroll",
            selectedMode: false,
            textStyle: { color: "#ffffff" }
          };
        } else {
          let series1 = {
            type: "pie",
            center: ["50%", "40%"],
            radius: [0, "30%"],
            label: {
              normal: {
                show: true,
                formatter: "{b}:{d}%"
              }
            }
          };
          let PieSeries1 = {
            type: "pie",
            center: ["50%", "40%"],
            radius: [0, "30%"],
            label: {
              normal: {
                show: true,
                formatter: "{b}:{d}%"
              }
            }
          };
          this.chartPieSetting = { limitShowNum: 5 };
          // this.chartExtendPieL.series = series1;
          // this.chartExtendPie.series = PieSeries1;
          this.chartExtendPieL["legend"] = {
            // show: false,
            type: "scroll",
            textStyle: { color: "#ffffff" }
          };
          this.chartExtendPie["legend"] = {
            // show: false,
            type: "scroll",
            selectedMode: false,
            textStyle: { color: "#ffffff" }
          };
        }
      }
    },
    chartSetting: {
      deep: true,
      handler(newValue, oldValue) {
        this.chartExtendLine.series.type = this.contentData.firstBar.set.type;
      }
    }
  },
  mounted() {
    this.autoChangeHospital(3000);
  }
};
</script>

<style lang="scss" scoped>
$br-color: #4b93ff78;
$bg-color: #ed795a;
$text-color: #47acff;
.mask {
  height: 28vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nodata {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
.onecard_content {
  overflow: hidden;
  display: flex;
  height: calc(100% - 10rem /* 160/16 */);
  justify-content: space-between;
  margin: 1.25rem /* 20/16 */ 2rem;
  box-sizing: border-box;
  .content_left {
    display: flex;
    // flex: 6.5;
    width: 65%;
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
        // border: #007aff 1px solid;
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
      @media screen and (max-width: 1366px) {
        .content_left_left {
          min-width: 50%;
          max-width: 60%;
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
          // border: #007aff 1px solid;
          .item_title {
            height: 2rem;
            line-height: 2rem;
            text-indent: 1rem;
          }

          .etlPos {
            width: 100%;
            top: 15px;
          }
        }
      }
    }
  }
  .content_right {
    // flex: 3.5;
    width: 35%;
    .content_right_box {
      height: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .content_right_content {
        width: 100%;
        // border: #007aff 1px solid;
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
            flex: 1;
            text-align: center;
            border-bottom: 1px solid #007aff;
            font-size: 0.9rem;
            &.current_hospital {
              color: #fff;
              border-top-right-radius: 5px;
              border-top-left-radius: 5px;
              background-color: #007aff;
              border-bottom: none;
            }
          }
        }
      }
      @media screen and (max-width: 1366px) {
        .tab_content {
          .item_title {
            margin: 0 10px !important;
            height: 35px;
          }
        }
      }

      .content_right_content_datacenter {
        width: 100%;
        // border: #007aff 1px solid;
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
            // border-bottom: 1px solid #007aff;
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
          // border: #007aff 1px solid;
          width: calc(38% - 1rem);
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
            margin-right: 0.5rem;
          }
          &:last-child {
            width: calc(55%);
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
          padding: 4px;
          text-align: center;
          color: #fff;
          border-right: 1px solid rgba(27, 40, 228, 0.322);
          &:last-child {
            border-right: 0;
          }
          cursor: pointer;
        }
        @media screen and (max-width: 1366px) {
          span {
            padding: 2px;
          }
        }
        .hos {
          background-color: #47acff;
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
      .time {
        display: flex;
        flex-direction: column !important;
      }

      .databox-three-contentdata-view:last-child {
        border-width: 0;
      }
    }
  }
}
</style>