<template>
  <div class="pie_content_bot">
    <dv-border-box-8 style="height:6rem">
      <div class="main_right_word">
        <div class="main_right_count">
          <span>累计请求次数</span>
          <span>{{(title)?convert(title):0}}</span>
        </div>
        <div class="main_right_count">
          <span>累计运行时间</span>
          <span>{{secondToTime(appNo)?secondToTime(appNo):0}}</span>
        </div>
      </div>
    </dv-border-box-8>
  </div>
</template>

<script>
export default {
  name: "BotNorm",
  data() {
    return {
      title: this.$route.query.askNum,
      appNo: this.$route.query.runtime
    };
  },
  components: {}
};
</script>

<style scoped lang="scss">
.pie_content_bot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  margin: 0 auto;
  .main_right_word {
    display: flex;
    .main_right_count {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 1.5rem;
      :first-child {
        font-size: 14px;
      }
      :last-child {
        font-size: 22px;
      }
    }
  }
}
</style>
