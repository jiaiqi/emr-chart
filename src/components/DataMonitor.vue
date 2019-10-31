<template>
  <div style="height:90%;">
    <div class="databox_three">
      <div class="databox_three_content">
        <div class="databox_three_contentheader">
          <div class="databox-col">数据源</div>
          <div class="databox-col">数据库类型</div>
          <div class="databox-col">数据库名称</div>
          <div class="databox-col">表/集合数</div>
          <div class="databox-col">数据量（记录）</div>
          <div class="databox-col">占用空间</div>
        </div>
        <!-- <div class="data_wrap"> -->
        <!-- <div class="databox-three-contentdata-view">
            <div class="databox-col">1</div>
            <div class="databox-col">1</div>
            <div class="databox-col">1</div>
            <div class="databox-col">1</div>
            <div class="databox-col">1</div>
        </div>-->
        <div class="data_wrap">
          <div
            class="databox-three-contentdata-view"
            v-show="databox3list1.length > 0"
            v-for="(item,index) in databox3list1"
            :key="index"
          >
            <div class="databox-col">{{item.src_no}}</div>
            <div class="databox-col">{{item.db_type?item.db_type:'mongodb'}}</div>
            <div class="databox-col">{{item.db_name}}</div>
            <div class="databox-col">{{item.table_count_real?item.table_count_real:'0'}}</div>
            <div class="databox-col">{{item.row_count?item.row_count:'0'}}</div>
            <div class="databox-col">{{item.storage_size?ConvertStor(item.storage_size):0 }}</div>
          </div>
        </div>
      </div>
      <el-pagination
        layout="prev, pager, next"
        @current-change="changePage"
        :current-page="page.pageNo"
        :page-size="page.rownumber"
        :total="page.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import onIcon from "../assets/images/switch.png";
import offIcon from "../assets/images/off.png";
import mysqlIcon from "../assets/images/mysql.png";
export default {
  data() {
    return {
      databox3list1: [
        // {
        //   // item01: onIcon,
        //   item02: "192.168.0.9",
        //   item03: mysqlIcon,
        //   // item04: "25",
        //   // item05: "321",
        //   item06: "120",
        //   item07: "55412",
        //   item08: "20%"
        // }
      ],
      page: {
        total: 0,
        pageNo: 1,
        rownumber: 25
      },
      TimeOut: null
      // databox3list2: {
      //   item01: "MongoDB",
      //   item02: "√",
      //   item03: "×",
      //   item04: "√",
      //   item05: "√",
      //   item06: "√",
      //   item07: "×",
      //   item08: "√",
      //   item09: "√"
      // }
    };
  },
  components: {},
  methods: {
    changePage(val) {
      this.page.pageNo = val;
      this.getDataBase();
    },
    async getDataBase() {
      let req = {
        serviceName: "srvdc_rc_db_select",
        colNames: [
          "src_no",
          "db_type",
          "table_count_real",
          "storage_size",
          "row_count",
          "db_name"
        ],
        page: this.page,
        // page: {
        //   pageNo: 1,
        //   rownumber: 5
        // },
        condition: []
      };
      let path = this.getServiceUrl(
        "select",
        "srvdc_rc_db_select",
        "datacenter"
      );
      let res = await this.axios.post(path, req);
      if (res.status === 200) {
        this.page = res.data.page;
        this.databox3list1 = res.data.data;
        return { isRes: true, res: res };
      } else {
        return { isRes: false, res: res };
      }
      // this.axios
      //   .post(path, req)
      //   .then(res => {
      //     console.log("222", res);
      //     this.page = res.data.page;
      //     this.databox3list1 = res.data.data;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    ConvertStor(num) {
      if (parseFloat(num) < 1024) {
        num = parseInt(num);
      } else if (num >= 1024 * 1024 && num < 1024 * 1024 * 1024) {
        num = (num / 1024 / 1024).toFixed(2) + "MB";
      } else if (num >= 1024 * 1024 * 1024 && num < 1024 * 1024 * 1024 * 1024) {
        num = (num / 1024 / 1024 / 1024).toFixed(2) + "GB";
      } else {
        num = (num / 1024 / 1024 / 1024 / 1024).toFixed(2) + "TB";
      }
      return num;
    }
  },
  mounted() {
    // this.getDataBase();
    let self = this;
    self.TimeOut = new this.timeOut(30, 0, self.getDataBase);
    self.TimeOut.reqFun();
    self.TimeOut.startTime();
  },
  beforeDestroy() {
    console.log("this.TimeOut----", this.TimeOut);
    this.TimeOut.endTime();
  }
};
</script>

<style scoped lang="scss">
$br-color: #4b93ff78;
$bg-color: #ed795a;
$text-color: #47acff;

.databox_three {
  width: 100%;
  height: 92%;
  padding: 2rem;
  padding-bottom: 0;

  box-sizing: border-box;
  //   background: url("../assets/images/panel-r-b.png") no-repeat;
  background-size: 100% 100%;
  // border:1px solid #fff;
  .databox_three_content {
    height: 100%;
    overflow-y: auto;
    // border: 1px solid $br-color;
  }
  .databox_three_top {
    line-height: 1.8rem;
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .databox_three_contentheader {
    border-top: 1px solid $br-color !important;
    > .databox-col {
      font-weight: bold;
      color: $text-color;
    }
  }

  .data_wrap::-webkit-scrollbar {
    display: none;
  }
  .databox_three_contentheader,
  .databox-three-contentdata-view {
    display: flex;
    flex-direction: row;
    padding: 5px 0;
    align-items: center;
    box-sizing: border-box;
    border: 1px solid $br-color;
    border-top: none;
    line-height: 1rem;
    > .databox-col {
      width: 20%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border-right: 1px solid $br-color;
      text-align: center;
      img {
        width: 2rem;
      }
      &:last-child {
        border-right: 0;
      }
    }
  }

  .databox-three-contentdata-view:first-child {
    // border-width: 0;
    border-top: 1px solid $br-color;
  }
  .el-pagination {
    width: 20% !important;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
  @media screen and (max-width: 1366px) {
    .el-pagination {
      margin-top: 0rem;
    }
  }
}
@media screen and (max-width: 1366px) {
  .data_wrap {
    width: 100%;
    height: 94%;
    overflow-y: auto;
  }
}
// .databox_three_top {
//   width: 100%;
//   height: 50px;
//   color: white;
//   padding-left: 50px;
//   line-height: 50px;
//   //   background: url("../assets/images/title-bg-long.png") no-repeat;
//   background-size: 100% 100%;
// }
// .databox_three_content {
//   width: 98%;
//   height: 310px;
//   margin: 0 auto;
// }
// .databox_three_contentheader {
//   width: 100%;
//   // height: 20px;
//   display: flex;
//   justify-content: space-around;
//   align-items: center;
//   color: white;
//   padding-top: 10px;
// }
// .databox_three_contentdata1,
// .databox_three_contentdata2 {
//   color: white;
//   display: flex;
//   align-items: center;
//   width: 100%;
//   height: 40px;
// }
// .databox_three_contentdata1 > li:nth-of-type(1) {
//   margin-left: 120px;
// }
// .databox_three_contentdata2 > li:nth-of-type(1) {
//   margin-left: 105px;
// }
// .databox_three_contentdata1 > li:nth-of-type(2) {
//   margin-left: 730px;
// }
// .databox_three_contentdata2 > li:nth-of-type(2) {
//   margin-left: 714px;
// }
// .databox_three_contentdata1 > li:nth-of-type(3) {
//   margin-left: 110px;
// }
// .databox_three_contentdata2 > li:nth-of-type(3) {
//   margin-left: 107px;
// }
// .databox_three_contentdata1 > li:nth-of-type(4) {
//   margin-left: 98px;
// }
// .databox_three_contentdata2 > li:nth-of-type(4) {
//   margin-left: 99px;
// }
// .databox_three_contentdata1 > li:nth-of-type(5) {
//   margin-left: 135px;
// }
// .databox_three_contentdata2 > li:nth-of-type(5) {
//   margin-left: 136px;
// }
// .databox_three_contentdata1 > li:nth-of-type(6) {
//   margin-left: 150px;
// }
// .databox_three_contentdata2 > li:nth-of-type(6) {
//   margin-left: 151px;
// }
// .databox_three_contentdata1 > li:nth-of-type(7) {
//   margin-left: 110px;
// }
// .databox_three_contentdata2 > li:nth-of-type(7) {
//   margin-left: 110px;
// }
// .databox_three_contentdata1 > li:nth-of-type(8) {
//   margin-left: 93px;
// }
// .databox_three_contentdata2 > li:nth-of-type(8) {
//   margin-left: 93px;
// }
// .databox_three_contentdata1 > li:nth-of-type(9) {
//   margin-left: 90px;
// }
// .databox_three_contentdata2 > li:nth-of-type(9) {
//   margin-left: 90px;
// }
</style>
