<template>
  <div class="top_indicat">
    <div v-if="current.currentPage=='secplat'" class="secplat_indic">
      <span>{{(douTitle.title)}}</span>
    </div>
    <div v-if="current === 'datacenter'" class="dataCenter_indic">
      <div class="content_cen_left">
        <p>
          <span>累计运行时间：</span>
          <span>{{this.secondToTime(indicatorData.runtime.DATACENTER)}}</span>
        </p>
        <p>
          <span>数据量(表/记录)：</span>
          <span>{{indicatorData.dataSize.table_name}}/{{this.convert(indicatorData.dataSize.row_count?indicatorData.dataSize.row_count : 0) }}</span>
        </p>
        <p>
          <span>共享数据量(表/记录)：</span>
          <span>{{indicatorData.dataShareSize.listNum}}/{{this.convert(indicatorData.dataShareSize.record)}}</span>
        </p>
        <p>
          <span>数据共享次数：</span>
          <span>{{this.convert(indicatorData.dataShareSize.shareNum)}}</span>
        </p>
        <p>
          <span>ETL数据量(表/记录)：</span>
          <span>29/6892.3万</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopIndicator",
  // props:["current"],
  props: {
    current: {
      type: Object,
      default: null
    },
    indicatorData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isSecplat: 1,
      douTitle:[]
    };
  },
  // components: {},
  created() {

    this.douTitle=JSON.parse(JSON.stringify (this.current));
   
  },

  watch: {
  current: function (newdata,olddata) {
     this.douTitle=newdata
   }
 },
};
</script>

<style scoped lang="scss">
.top_indicat {
  border: 1px solid transparent;
  .secplat_indic {
    width: 95%;
    margin: 3rem auto 2rem;
    display: flex;
    span {
      font-size: 1.6rem;
      line-height: 2.6rem;
      color: rgb(61, 192, 253);
      margin-left: 2rem;
    }
  }
  .dataCenter_indic {
    .content_cen_left {
      width: 100%;
      display: flex;
      p {
        flex: 1;
        display: flex;
        text-align: center;
        margin: 0;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        :first-child {
          font-size: 14px;
        }
        :last-child {
          font-size: 18px;
        }
        span {
          margin-bottom: 5px;
          &:last-child {
            color: rgb(201, 201, 45);
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
