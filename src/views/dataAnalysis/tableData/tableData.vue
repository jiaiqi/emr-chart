<template>
  <div class="table-data">
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%"
      v-if="tableData && tableData.length > 0"
    >
      <el-table-column
        :prop="item"
        :label="item"
        v-for="item in columnList"
        :key="item"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="tableData && tableData.length > 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageNo"
      :page-sizes="[2, 5, 10, 20, 50, 100, 200]"
      :page-size="page.rownumber"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    >
    </el-pagination>
    <div class="no-data" v-else>{{ tipText }}</div>
  </div>
</template>

<script>
export default {
  name: "table-data",
  data () {
    return {
      tableData: [],
      page: {
        total: 0,
        rownumber: 5,
        pageNo: 1
      },
      tableNo: '',
      tipText: "",
      loadingInstance: null
    }
  },
  created () {
    let tableNo = this.$route.params.tableNo
    if (tableNo) {
      this.tableNo = tableNo
      this.getTableData()
    }
  },
  methods: {
    async getTableData () {
      let table_no = this.tableNo
      if (table_no) {
        let url = this.getServiceUrl(
          "select",
          "srvdc_select_data_by_table",
          "datacenter"
        );
        let req = {
          "serviceName": "srvdc_select_data_by_table",
          "colNames": [
            "*"
          ],
          "page": {
            "pageNo": this.page.pageNo,
            "rownumber": this.page.rownumber
          },
          "condition": [
            {
              "colName": "table_no",
              "ruleType": "eq",
              "value": table_no
            }
          ]
        }
        let loadingInstance = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let res = await this.axios.post(url, req)
        loadingInstance.close()
        if (res.data.state === 'SUCCESS') {
          if (Array.isArray(res.data.data) && res.data.data.length > 0) {
            let columnList = Object.keys(res.data.data[ 0 ])
            this.columnList = columnList
          } else {
            this.tipText = '没有数据'
          }
          if (res.data.page) {
            this.$set(this.page, 'total', res.data.page.total)
            this.page.total = res.data.page.total
            // this.page.pageNo = res.data.page.pageNo

          }
          this.tableData = res.data.data
          return res.data.data
        } else {
          this.tipText = '请求出错，请检查参数并刷新重试'
        }
      }

    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
      this.page.rownumber = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      this.page.pageNo = val
      this.getTableData()
    }

  },
}
</script>

<style lang="scss" scoped>
.table-data {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 5px;
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
  }
}
</style>