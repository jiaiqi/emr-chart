<template>
  <div class="view_tabs">
    <div class="top">
      <!-- 页面内容table -->
      <div class="top_left">
        <div
          class="page_name"
          @click="CheckPage(item)"
          :class="{CurrClass:CurrPage === item.key}"
          v-for="(item,index) in tabsData.tabs"
          :key="index"
        >{{item.value}}</div>
      </div>
      <div class="top_header">
        <div class="top_header_item"></div>
        <div v-if="isShow" class="top_header_item">
          <span>累计运行时间：</span>
          <span class="all_number">{{tabsData.runTime}}</span>
        </div>
      </div>
    </div>
    <!-- <times ref="timesType"></times> -->
  </div>
</template>

<script>
export default {
  name: "ViewTabs",
  props: {
    tabsData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      key: "value",
      isShow: false,
      CurrPage: this.tabsData.tabs[0].key
    };
  },
  methods: {
    name() { },
    CheckPage(item) {
      this.CurrPage = item.key;
      this.$emit("viewtabs", item);
    },
    BackCurrPage() {
      let Curr = {};

      Curr.key = this.CurrPage;
      this.tabsData.tabs.forEach(online => {
        if (online.key === Curr.key) {
          Curr.value = online.value;
        }
      });
      return Curr;
    }
  },
  props: {
    tabsData: {
      type: Object,
      default: {}
    }
  },
  mounted() {
    let first = this.tabsData.tabs[0];
    this.CheckPage(first);
    if (this.CurrPage === ("oneCard" || "emrShare" || "emrCollect")) {
      this.isShow = true
    }
  },
  watch: {
    tabsData: {
      handler: function (newValue, oldValue) {
        return newValue;
      },
      deep: true //对象内部的属性监听，即深度监听
    },
    isShow: {
      deep: true,
      handler(newValue, oldValue) {

      }
    }
  }
};
</script>

<style lang="scss" scoped>
.view_tabs {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    margin: 0 0 0 1.875rem /* 30/16 */;
    .top_left {
      display: flex;
      width: 23%;
      height: 2.5rem /* 40/16 */;
      margin-bottom: 0.625rem /* 10/16 */;
      box-sizing: border-box;
      justify-content: space-around;
      line-height: 2.5rem; /* 40/16 */
      .page_name {
        font-size: 1.2rem;
        line-height: 2.5rem /* 40/16 */;
        padding: 0 0.625rem /* 10/16 */;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #0084ff;
        cursor: pointer;
        &.tabactive {
          border-bottom: 3px solid #007aff;
        }
        &:hover {
          background-color: rgba(27, 40, 228, 0.322);
        }
      }
      .CurrClass {
        border-bottom: 3px solid #007aff;
      }
    }
    .top_right {
      display: flex;
      align-items: center;
      .accountInfo {
        display: inline-block;
        // height: 50px;
        min-width: 8.125rem /* 130/16 */;
        span {
          font-weight: 600;
        }
      }
      .btn {
        cursor: pointer;
        text-align: center;
        display: inline-block;
        height: 1.875rem /* 30/16 */;
        min-width: 5rem /* 80/16 */;
        line-height: 1.875rem /* 30/16 */;
        margin-right: 1.25rem /* 20/16 */;
        &:nth-child(2) {
          text-align: left;
          &:hover {
            background-color: transparent;
          }
        }
        &:hover {
          background-color: rgba(0, 119, 255, 0.986);
        }
      }
      .btn_logout {
        cursor: pointer;
        line-height: 1.875rem /* 30/16 */;
        height: 1.875rem /* 30/16 */;
        text-align: center;
        min-width: 3.125rem /* 50/16 */;
        &:hover {
          background-color: rgba(0, 119, 255, 0.986);
        }
      }
    }
  }
  .top_header {
    display: flex;
    // height: 30px;
    justify-content: space-between;
    box-sizing: border-box;
    width: 28%;
    .top_header_item {
      height: 2.5rem /* 40/16 */;
      line-height: 2.5rem /* 40/16 */;
      box-sizing: border-box;
      text-align: left;
      text-indent: 1.25rem /* 20/16 */;
      flex: 1;
      .all_number {
        text-indent: 1rem;
        color: #0084ff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .tabbtn {
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 119, 255, 0.986);
      }
    }
  }
}
</style>