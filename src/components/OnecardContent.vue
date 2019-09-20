<template>
  <div class="onecard_content">
    <dv-border-box-10 class="content_left">
      <div class="content_left_box">
        <div class="content_left_left">
          <div class="big-title">{{contentData.firstBar.title}}</div>
          <ve-histogram width="40vw" height="calc(100% - 50px)"></ve-histogram>
        </div>
        <div class="content_left_right">
          <div class="content_left_right_item">
            <div class="item_title">
              <dv-border-box-8>{{contentData.firstPie.title}}</dv-border-box-8>
            </div>
            <ve-pie height="28vh" :legend-visible="false"></ve-pie>
          </div>
          <div class="content_left_right_item">
            <div class="item_title">
              <dv-border-box-8>{{contentData.secondPie.title}}</dv-border-box-8>
            </div>
            <ve-pie height="28vh" :legend-visible="false"></ve-pie>
          </div>
        </div>
      </div>
    </dv-border-box-10>
    <dv-border-box-10 class="content_right">
      <div class="content_right_box" v-if="contentData.currentPage == 'onecard'">
        <div class="content_right_content">
          <div class="tab_check">
            <div
              class="check_item"
              v-for="(item,index) in contentData.secondBar.tabCheckItem"
              :key="index"
            >{{item}}</div>
          </div>
          <div class="tab_content">
            <div class="content_item">
              <ve-histogram height="30vh"></ve-histogram>
            </div>
          </div>
        </div>
        <div class="content_right_bottom">
          <div class="content_right_bottom_item">
            <div class="count">
              <div class="label">门诊次数</div>
              <div class="text-val"></div>
            </div>
            <div class="count">
              <div class="label">住院次数</div>
              <div class="text-val"></div>
            </div>
          </div>
          <div class="content_right_bottom_item">
            <div class="content_left_right_item">
              <div class="item_title">
                <dv-border-box-8>{{contentData.thirdPie.title}}</dv-border-box-8>
              </div>
              <ve-pie height="28vh"></ve-pie>
            </div>
          </div>
        </div>
      </div>
      <div class="content_right_box" v-else-if="contentData.currentPage=='datacenter'">
        <div class="content_right_content">
          <div class="tab_content">
            <div
              style="text-align:center;margin:10px;"
              class="item_title"
            >{{contentData.secondBar.title}}</div>
            <div class="content_item">
              <ve-histogram
                :data="rightData"
                :textStyle="legend.textStyle"
                :legend="legend"
                height="70vh"
                :settings="chartSetting2"
              ></ve-histogram>
            </div>
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
      firstBar: {
        title: "", data: {}
      },
      tabCheckItem: []
    }
  },
  methods: {
    name() {

    }
  },
  props: {
    contentData: {
      type: Object,
      default: {}
    },
  },
  watch: {
    contentData: {
      deep: true,
      handler(newValue, oldValue) {
        return newValue
      }
    }
  },

}
</script>

<style lang="scss" scoped>
.onecard_content {
  display: flex;
  height: calc(100% - 8.75rem /* 140/16 */);
  justify-content: space-between;
  margin: 1.25rem /* 20/16 */ 0;
  box-sizing: border-box;
  .content_left {
    display: flex;
    flex: 6.5;
    box-sizing: border-box;
    margin-right: 1.25rem /* 20/16 */;
    .content_left_box {
      display: flex;
      align-items: center;
      height: 100%;
      .content_left_left {
        border: #007aff 1px solid;
        // margin: 1rem;
        height: 95%;
        box-sizing: border-box;
        float: left;
        width: 66%;
        margin: 0 1rem;
        .big-title {
          padding: 0 1.25rem /* 20/16 */;
          text-align: center;
          line-height: 3.125rem /* 50/16 */;
          font-size: 1.2rem;
        }
      }
      .content_left_right {
        // flex: 3.5;
        height: 100%;
        margin-bottom: 0.625rem /* 10/16 */;
        width: 30%;
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .content_left_right_item {
          height: 46%;
          width: 95%;
          border: #007aff 1px solid;
          margin-bottom: -1rem /* 10/16 */;
          &:first-child {
            margin-bottom: 1rem /* 10/16 */;
          }
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
  }
}
</style>