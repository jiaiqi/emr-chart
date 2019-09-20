<template>
  <div class="view_title">
    <div class="title_left"></div>
    <div class="title_center">社保医疗一卡通融合平台</div>
    <div class="title_right">
      <div class="date_time">{{ titleViewData.date }}</div>
      <div class="account_info">
        <span>当前帐号:</span>
        <span class="user_no"></span>
      </div>
      <div class="btn_logout long_btn">管理入口</div>
      <div class="btn_logout">注销</div>
      <div class="btn_logout">返回</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewTitle",
  data() {
    return {
      "key": ""
    }
  },
  methods: {
    name() {

    }
  },
  props: {
    titleViewData: {
      type: Object,
      default: {}
    },
  },
  watch: {
    titleViewData: {
      handler: function (newValue, oldValue) {
        // console.log("TitleData:", newValue)
        return newValue
      },
      deep: true//对象内部的属性监听，即深度监听
    },
  },
}
</script>

<style lang="scss" scoped>
// 字体大小长度宽度均用rem
// 1080p下html的font-size为16px,768p下html的font-size为12px
.view_title {
  width: 95%;
  margin: 0 auto;
  height: 2.5rem /* 40/16 */;
  display: flex;
  .title_left {
    flex: 1.3;
  }
  .title_center {
    flex: 1;
    text-align: center;
    color: #007aff;
    font-size: 1.5rem; /* 24/16 */
    line-height: 2.5rem; /* 40/16 */
  }
  .title_right {
    flex: 1.3;
    display: flex;
    justify-content: flex-end;
    line-height: 2.5rem; /* 40/16 */
    .date_time {
      min-width: 200px;
      text-align: center;
    }
    .account_info {
      .user_no {
        display: inline-block;
        min-width: 5rem; /* 80/16 */
      }
    }
    .btn_logout {
      // min-width: 3.75rem /* 60/16 */;
      padding: 0 0.625rem; /* 10/16 */
      text-align: center;
      &:hover {
        background-color: #0063b1;
      }
    }
  }
}
</style>