<template>
  <div class="time_horizon">
    <div
      class="time_horizon_item btn"
      @click="selectTimeType('day')"
      :class="{ active: checkDataType === 'day' }"
    >近24小时</div>
    <div
      class="time_horizon_item btn"
      @click="selectTimeType('week')"
      :class="{ active: checkDataType === 'week' }"
    >近一周</div>
    <div
      class="time_horizon_item btn"
      @click="selectTimeType('month')"
      :class="{ active: checkDataType === 'month' }"
    >近一月</div>
    <div
      class="time_horizon_item btn"
      @click="selectTimeType('year')"
      :class="{ active: checkDataType === 'year' }"
    >近一年</div>
    <!-- <div class="time_horizon_item btn">自定义时间段</div> -->
  </div>
</template>

<script>
export default {
  name: "TimeType",
  data() {
    return {
      checkDataType: 'day'
    };
  },
  methods: {
    selectTimeType(TimeType) {
      this.checkDataType = TimeType;
      this.$emit("showTimeType", TimeType);
    }
  },
  props: {
    timeType: {
      type: String,
      default: 'day'
    },
  },
  watch: {
    timeType(newValue, oldValue) {
      this.checkDataType = newValue
    }
  },
  mounted() {
    // alert(this.timeType);
  },
};
</script>

<style lang="scss" scoped>
.time_horizon {
  display: flex;
  box-sizing: border-box;
  margin: 0 3.125rem;
  .time_horizon_item {
    cursor: pointer;
    width: 4.375rem /* 70/16 */;
    line-height: 1rem;
    font-size: 1rem;
    margin: 0.4rem 0;
    text-align: center;
    border-right: 1px solid rgba(27, 40, 228, 0.322);
    &.active {
      line-height: 1.8rem;
      padding: 0 0.2rem;
      background-color: rgba(0, 119, 255, 0.986);
      margin: 0;
    }
    &:hover {
      line-height: 1.8rem;
      margin: 0;
      background-color: rgba(27, 40, 228, 0.322);
    }
  }
  @media screen and (max-width: 1366px) {
    .time_horizon_item {
      font-size: 0.8rem;
      line-height: 0.8rem;
      &.active {
        line-height: 1.4rem;
        padding: 0 0.2rem;
        background-color: rgba(0, 119, 255, 0.986);
        margin: 0;
      }
      &:hover {
        line-height: 1.2rem;
        margin: 0;
        background-color: rgba(27, 40, 228, 0.322);
      }
    }
  }
}
</style>