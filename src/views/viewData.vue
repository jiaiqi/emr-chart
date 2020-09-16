<template>
  <div class="wrap_w">
    <div class="wrap_title">
      <el-table :data="tableData" border stripe style="width: 100%;overflow:auto;">
        <template v-for="(item,index) in tableDataTitle">
          <el-table-column
            :prop="item.column_name"
            :key="index"
            :label="item.column_comment"
            min-width="180"
          ></el-table-column>
        </template>
        <!-- <el-table-column prop="name" label="姓名" min-width="180"></el-table-column>
        <el-table-column prop="address" label="地址" min-width="180"></el-table-column>-->
      </el-table>
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
export default {
  name: "viewData",
  data() {
    return {
      num: this.$route.params.num,
      proc: this.$route.params.proc,
      tableData: [],
      tableDataTitle: [],
      page: {
        total: 0,
        pageNo: 1,
        rownumber: 10
      }
    };
  },
  components: {},
  methods: {
    getData() {
      let params = {
        serviceName: "srvdc_share_shared_column_select",
        colNames: ["column_name", "column_comment", "seq"],
        condition: [
          {
            colName: "table_no",
            value: this.num,
            // value: "DS201910280021.bxms_cvs.bxcvs_medical_records",
            ruleType: "eq"
          }
          // ,
          // {
          //   colName: "proc_instance_no",
          //   value: this.proc,
          //   ruleType: "eq"
          // }
        ],
        order: [
          {
            colName: "seq",
            orderType: "asc"
          }
        ],
        page: {
          pageNo: 1,
          rownumber: 10
        }
      };
      let url = this.getServiceUrl("select", params.serviceName, "datashare");
      this.axios.post(url, params).then(res => {
        this.tableDataTitle = res.data.data;
        
      });
    },
    // DS201910110018.bxms_emr.bxanalyze_emr_overall_record
    getData1() {
      let params = {
        serviceName: "srvdatashared_select",
        colNames: ["record_type"],
        condition: [
          {
            colName: "table_no",
            value: this.num, //数据表编号
            ruleType: "eq"
          },
          {
            colName: "proc_instance_no",
            value: this.proc,
            ruleType: "eq"
          }
        ],
        page: this.page
      };
      let url = this.getServiceUrl("select", params.serviceName, "datashare");
      this.axios.post(url, params).then(res => {
        this.page = res.data.page;
        this.tableData = res.data.data;
        
      });
    },
    changePage(val) {
      this.page.pageNo = val;
      this.getData1();
    }
  },
  mounted() {
    this.getData();
    this.getData1();
  }
};
</script>

<style scoped lang="scss">
* {
  color: #333;
}
.wrap_w {
  width: 100%;
  border-top: 1px solid transparent;
  background-color: white;
  color: #333;
  height: 100%;
  // overflow: hidden;
  .wrap_title {
    padding: 0 8px;
    .el-pagination {
      width: 20%;
      margin: 2rem auto;
    }
  }
}
</style>
