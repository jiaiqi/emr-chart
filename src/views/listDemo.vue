<template>
  <div class="hual">
    <div class="select-box">
      <div class="select-item">
        <div class="label">选择服务应用：</div>
        <el-select v-model="appName" placeholder="请选择" @change="getServiceName(appName)">
          <el-option
            v-for="item in allApp"
            :key="item.value"
            :label="item.app_name"
            :value="item.app_no"
          ></el-option>
        </el-select>
      </div>
      <div class="select-item">
        <div class="label">选择接口列表：</div>
        <el-select @change="getData" v-model="serviceName" placeholder="请选择">
          <el-option
            v-for="item in appService"
            :key="item.value"
            :label="item.service_view_name"
            :value="item.service_name"
          ></el-option>
        </el-select>
      </div>
      <div class="select-item">
        <el-checkbox-group v-model="checkedReqOptions" :min="0" :max="4" @change="changeReqOption">
          <el-checkbox v-for="option in ReqOptions" :label="option" :key="option">{{option}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="content-box">
      <div class="column-box">
        <listhaul :singList="allColum"></listhaul>
      </div>
      <div class="condition-box">
        <div class="sing_hual" v-for="(item,index) in listData" :key="index" v-if="listData[index]">
          <listhaul ref="child" @save="requestData" :singList="item"></listhaul>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="previewData" type="success">预览</el-button>
      <el-button @click="saveConfig" type="primary">保存</el-button>
    </div>
    <div class="preview-box">
      <div class="preview-title">
        <div class="title">结果预览</div>
      </div>
      <div class="preview-content">
        <el-table
          :data="tableData"
          style="width: 100%"
          stripe
          fixed
          max-height="250"
          v-if="tableData&&tableTitle"
          id="out-table"
        >
          <template v-for="(only,i) in tableTitle">
            <el-table-column
              :key="i"
              :prop="only.columns"
              :label="only.aliasName?only.aliasName:only.label"
            ></el-table-column>
          </template>
          <el-table-column v-if="tableTitle.length != 0" fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="toDetail(scope.row)" type="text" size="small">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button @click="exportExcel" type="primary" class="export-button">导出为Excel</el-button>
    </div>
    <el-dialog title="详情" :visible.sync="dialogTableVisible" class="detail-dialog">
      <el-table :data="detailTableData">
        <template v-for="(only,i) in detailTableTitle">
          <el-table-column
            :key="i"
            :prop="only.columns"
            :label="only.aliasName?only.aliasName:only.label"
          ></el-table-column>
        </template>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import listhaul from "../components/listhaul";
import moment from "moment";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  name: "listDemo",
  components: {
    listhaul
  },
  data() {
    return {
      dialogTableVisible: false,
      // app: this.$route.params.app,
      // serveice: this.$route.params.serveice,
      app: "cvs",
      serveice: "srvcvs_medical_records_select",
      allColum: {
        type: "all",
        name: "字段",
        list: [],
        isClone: true
      },
      listData: [
        // {
        //   type: "condition",
        //   name: "过滤条件",
        //   list: [],
        //   isClone: false
        // },
        // {
        //   type: "group",
        //   name: "分组配置",
        //   list: [],
        //   isClone: false
        // },
        // {
        //   type: "aggregation",
        //   name: "聚合配置",
        //   list: [],
        //   isClone: false
        // },
        // {
        //   type: "order",
        //   name: "排序配置",
        //   list: [],
        //   isClone: false
        // }
      ],
      checkedReqOptions: ["条件", "分组"],
      ReqOptions: ["条件", "分组", "聚合", "排序"],
      showReqArea: {
        condition: false,
        group: true,
        aggregation: true,
        order: false
      },
      detailTableData: [], // 详情表格数据
      detailTableTitle: [], // 详情表头数据
      columnsOption: [],
      columnsList: [],
      tableTitle: [], //表格表头
      tableData: [], //表格内容
      chartType: "",
      databaseModel: "",
      endList: [],
      endData: {
        condition: [],
        group: [],
        order: [],
        aggregation: []
      },
      reqData: {
        condition: [],
        group: [],
        aggregation: [],
        order: []
      },
      allApp: [],
      appService: [],
      appName: "",
      serviceName: "",
      requestUrl: "",
      ListData: null,
      saveConfigData: {}
    };
  },
  methods: {
    getData() {
      this.columnsList = [];
      this.allColum.list = [];
      let req = {
        serviceName: "srvsys_service_columns_select",
        colNames: ["*"],
        condition: [
          {
            colName: "service_name",
            ruleType: "eq",
            value: this.serviceName
          }
        ],
        order: [
          {
            colName: "seq",
            orderType: "asc"
          }
        ]
      };
      let url = this.getServiceUrl(
        "select",
        "srvsys_service_columns_select",
        this.appName
      );
      this.axios
        .post(url, req)
        .then(res => {
          let all = res.data.data;
          this.columnsOption = [];
          all.forEach(item => {
            if (item.in_list === 1) {
              item["_condition"] = {
                colName: item.columns,
                ruleType: "",
                value: ""
              };
              item["_group"] = {
                colName: item.columns,
                type: ""
              };
              item["_order"] = {
                colName: item.columns,
                orderType: ""
              };
              item["_aggregation"] = {
                colName: item.columns,
                type: ""
              };
              item["aliasName"] = "";
              this.columnsOption.push(item);
            }
          });
          this.deleteListData();
          this.allColum.list = this.columnsOption;
          this.detailTableTitle = this.columnsOption;
        })
        .catch(err => {
          console.log(err);
        });
    },
    requestData(endList, endData) {
      let requestData = {
        condition: [],
        group: [],
        aggregation: [],
        order: []
      };
      if (endList.type === "condition") {
        this.endData["condition"] = endData.condition;
      } else if (endList.type === "group") {
        this.endData["group"] = endData.group;
      } else if (endList.type === "aggregation") {
        this.endData["aggregation"] = endData.aggregation;
      } else if (endList.type === "order") {
        this.endData["order"] = endData.order;
      }
      this.endList = endList;
    },
    previewData() {
      // 根据组装的条件 发送请求 预览数据
      this.reqData = {
        group:
          this.endData.aggregation && this.endData.group
            ? this.endData.group.concat(this.endData.aggregation)
            : this.endData.aggregation && !this.endData.group
            ? this.endData.aggregation
            : !this.endData.aggregation && this.endData.group
            ? this.endData.group
            : undefined,
        condition: this.endData.condition,
        order: this.endData.order
      };
      let reqData = {};
      if (this.reqData.condition) {
        reqData.condition = this.reqData.condition
          .map(item => {
            if (item.ruleType && item.value) {
              return item;
            }
          })
          .filter(Boolean);
      }
      if (this.reqData.group) {
        reqData.group = this.reqData.group
          .map(item => {
            if (item.type) {
              return item;
            }
          })
          .filter(Boolean);
      }
      if (this.reqData.order) {
        reqData.order = this.reqData.order.map(item => {
          return item;
        });
      }
      this.requestUrl = this.getServiceUrl(
        "select",
        this.serviceName,
        this.appName
      );
      console.log("this.allColum.list", this.allColum.list);
      if (this.allColum.list.length === 0) {
        reqData["colNames"] = ["*"];
      } else {
        reqData["colNames"] = this.columnsList;
      }
      reqData["serviceName"] = this.serviceName;
      reqData["colNames"] = ["*"];
      this.reqData = reqData;
      this.getListData(reqData);
    },
    saveConfig() {
      let saveData = {};
      saveData["allApp"] = this.allApp;
      saveData["appService"] = this.appService;
      saveData["allColum"] = this.allColum;
      saveData["endData"] = this.endData;
      saveData["chooseServe"] = this.appName;
      saveData["choosePort"] = this.serviceName;
      saveData["columnsOption"] = this.columnsOption;
      saveData["listData"] = this.listData;
      this.saveConfigData = saveData;
      let str = JSON.stringify(this.saveConfigData);
      localStorage.setItem("saveConfigData", str);
      console.log("saveData", saveData);
    },
    exportExcel() {
      if (!this.ListData) {
        alert("表格数据为空");
        return;
      } else {
        let time = moment().format("YYYYMMDDHHmmss");
        let fileName = this.serviceName + time + ".xlsx";
        // 将预览表格中的数据导出为excel
        var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
        /* 获取二进制字符串作为输出 */
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
            //Blob 对象表示一个不可变、原始数据的类文件对象。
            //Blob 表示的不一定是JavaScript原生格式的数据。
            //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
            //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
            new Blob([wbout], { type: "application/octet-stream" }),
            //设置导出文件名称
            fileName
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      }
    },
    getApp() {
      //获取应用列表
      let req = {
        colNames: ["*"],
        condition: [],
        order: [
          {
            colName: "app_seq",
            orderType: "desc"
          }
        ],
        serviceName: "srvconfig_app_list_select"
      };
      let url = this.getServiceUrl("select", req.serviceName, "config");
      this.axios
        .post(url, req)
        .then(res => {
          this.allApp = res.data.data;
          // console.log("allappp-------->", this.allApp);
        })
        .catch(err => {
          console.error(err);
        });
    },
    changeReqOption() {
      // 选择显示那四个框中的哪个
      // this.showReqArea = {
      //   condition: false,
      //   group: true,
      //   aggregation: true,
      //   order: false
      // }

      let options = this.checkedReqOptions;
      let listData = [];
      if (options.length == 4) {
      }
      options.map(option => {
        if (option == "条件") {
          this.showReqArea.condition = true;
          listData[0] = {
            type: "condition",
            name: "过滤条件",
            list: [],
            isClone: false
          };
          // listData.push({
          //   type: "condition",
          //   name: "过滤条件",
          //   list: [],
          //   isClone: false
          // })
        } else if (option == "分组") {
          this.showReqArea.group = true;
          listData[1] = {
            type: "group",
            name: "分组配置",
            list: [],
            isClone: false
          };
          // listData.push({
          //   type: "group",
          //   name: "分组配置",
          //   list: [],
          //   isClone: false
          // })
        } else if (option == "聚合") {
          this.showReqArea.aggregation = true;
          listData[2] = {
            type: "aggregation",
            name: "聚合配置",
            list: [],
            isClone: false
          };
          // listData.push({
          //   type: "aggregation",
          //   name: "聚合配置",
          //   list: [],
          //   isClone: false
          // })
        } else if (option == "排序") {
          this.showReqArea.order = true;
          listData[3] = {
            type: "order",
            name: "排序配置",
            list: [],
            isClone: false
          };
          // listData.push({
          //   type: "order",
          //   name: "排序配置",
          //   list: [],
          //   isClone: false
          // })
        }
      });
      this.listData = listData;
      console.log("TCL: changeReqOption -> listData", listData);
    },
    toDetail(rowData) {
      let colnumns = Object.keys(rowData);
      console.log("TCL: toDetail -> colnumns", colnumns);
      this.detailTableTitle = this.columnsOption;

      colnumns = this.endData.group.map(item => item.colName);
      this.dialogTableVisible = true;
      if (colnumns.length > 0) {
        console.log("TCL: toDetail -> endData", colnumns);
        let condition = [];
        colnumns.map(rows => {
          if (rowData[rows]) {
            condition.push({
              colName: rows,
              ruleType: "eq",
              value: rowData[rows]
            });
          } else {
            condition.push({
              colName: rows,
              ruleType: "isnull",
              value: ""
            });
          }
        });
        let url = this.getServiceUrl("select", this.serviceName, this.appName);
        let req = {
          serviceName: this.serviceName,
          colNames: ["*"],
          condition: condition
        };
        this.axios
          .post(url, req)
          .then(res => {
            let resData = res.data.data;
            this.detailTableData = resData;
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        console.log("TCL: toDetail -> rowData", rowData);
        this.detailTableData = [rowData];
      }
    },
    getServiceName(appno) {
      //选择服务名称列表
      this.appService = [];
      this.allColum.list = [];
      this.serviceName = "";
      this.columnsList = [];
      //清楚endData中得数据
      this.endData.condition = [];
      this.endData.group = [];
      this.endData.order = [];
      this.endData.aggregation = [];
      let req = {
        serviceName: "srvsys_service_select",
        colNames: ["*"],
        condition: [
          {
            colName: "service_type",
            value: "select",
            ruleType: "eq"
          },
          {
            colName: "module",
            value: "syscore",
            ruleType: "ne"
          },
          {
            colName: "module",
            value: "process",
            ruleType: "ne"
          }
        ],
        page: {},
        order: [
          {
            colName: "id",
            orderType: "desc"
          }
        ]
      };
      let url = this.getServiceUrl("select", req.serviceName, this.appName);
      this.axios
        .post(url, req)
        .then(res => {
          let data = res.data.data;
          let selectServiceList = [];
          if (data) {
            data.map(item => {
              if (item.service_type === "select") {
                selectServiceList.push(item);
              }
            });
          }
          // console.log("res.data.data:>>>>>", res.data.data);
          this.deleteListData();
          this.appService = selectServiceList;
          this.colNameOption = selectServiceList;
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteListData() {
      for (let index = 0; index < this.listData.length; index++) {
        this.listData[index].list = [];
      }
    },
    getListData(req) {
      let self = this;
      self.tableTitle = [];
      this.axios
        .post(this.requestUrl, req)
        .then(res => {
          // this.app_no = res.data.data;
          this.ListData = res.data.data;
          //点击后出先表格
          //表头数组

          let tableAllTitleData = self.reqData.group;
          if (tableAllTitleData.length === 0) {
            self.tableTitle = self.columnsOption;
            // console.log("self.tableTitle----------", self.tableTitle);
          } else {
            tableAllTitleData.forEach(item => {
              if (item.type) {
                self.columnsOption.forEach(col => {
                  if (item.colName === col.columns) {
                    self.tableTitle.push(col);
                  }
                });
              } else {
                self.tableTitle = self.columnsOption;
              }
            });
            let obj = {};
            let newArr = [];
            newArr = self.tableTitle.reduce((item, next) => {
              obj[next.columns]
                ? " "
                : (obj[next.columns] = true && item.push(next));
              return item;
            }, []);
            // console.log("NEWaRR--------------", newArr);
            self.tableTitle = newArr;
          }
          //表格内容数据

          self.tableData = self.ListData;
          // console.log("ListData:>>>>>", res.data.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    let self = this;
    this.changeReqOption();
    let saveConfigData = JSON.parse(localStorage.getItem("saveConfigData"));
    if (saveConfigData) {
      self.allApp = saveConfigData.allApp;
      self.allColum = saveConfigData.allColum;
      self.appService = saveConfigData.appService;
      self.columnsOption = saveConfigData.columnsOption;
      self.endData = saveConfigData.endData;
      self.listData = saveConfigData.listData;

      // self.listData.forEach(item => {
      //   if (item.type === "condition") {
      //     item.list.forEach(only => {
      //       self.$set(only._condition, "ruleType", "等于");
      //     });
      //   }
      // });
      self.appName = saveConfigData.chooseServe;
      self.serviceName = saveConfigData.choosePort;
    } else {
      if (self.app && self.serveice) {
        this.getApp();
        self.appName = self.app;
        self.getServiceName(self.appName);
        self.serviceName = self.serveice;
        self.getData();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.hual {
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: 0 auto;
  .sing_hual {
    margin-left: 0.5rem;
    height: 50%;
    width: 30%;
  }
  .menu {
    height: 70vh;
    min-height: 500px;
    width: 15%;
  }
  .select-box {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    .select-item {
      display: flex;
      line-height: 40px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-right: 8rem;
      .label {
        color: #333;
      }
    }
  }
  .content-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .column-box {
      // width: 15%;
      max-width: 15%;
      min-width: 8%;
      // flex: 1.5;
      margin-right: 1.5rem;
      height: 300px;
      max-width: 300px;
      font-size: 0.8rem;
      font-weight: 100;
    }
    .condition-box {
      // max-width: 85%;
      min-height: 300px;
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      justify-content: space-between;
      .sing_hual {
        // width: 65%;
        // height: 235px;
        height: 100%;
        flex: 1;
        display: flex;

        &:first-child {
          // width: 30%;
        }
        &:nth-child(2) {
          // width: 30%;
        }
        &:nth-child(3) {
          // width: 56%;
        }
        &:nth-child(4) {
          // width: 40%;
        }
      }
    }
  }
  .btn-box {
    height: 100px;
    display: flex;
    align-items: center;
  }
  .preview-box {
    margin-bottom: 50px;
    .preview-title {
      line-height: 3rem;
      display: flex;
      justify-content: space-between;
      .title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #333;
      }
    }
    .preview-content {
      width: 100%;
      min-height: 200px;
      border: 1px solid #ebebeb;
      border-radius: 5px;
    }
    .export-button {
      margin: 20px 0;
    }
  }
  .detail-dialog /deep/ .el-dialog__body {
    overflow-y: scroll;
    height: 600px;
  }
}
</style>
