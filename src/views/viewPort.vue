<template>
  <div class="wrap">
    <div class="opendoc_right white_bg">
      <div class="content2_he">
        <div class="get-menu"></div>
        <div class="menu1 menu_tab">
          <div class="tab active" style="background:white;">
            <div>
              <h4>请求地址：</h4>
              <p class="tab_mb tei20" style="color:#999;">
                接口地址：
                <a>{{visitPath}}</a>
                会把登录系统时得到的 bx_auth_ticket带进去，达到访问权限的控制。
              </p>
              <h4>请求方式：</h4>
            </div>
            <div class="tab_mb">
              <span>POST</span>
            </div>
          </div>
          <div class="tab">
            <div>
              <h4>请求参数：</h4>
            </div>
            <div class="tab_mb">
              <template>
                <el-table :data="tableData" style="width: 100%" border>
                  <el-table-column prop="argument" label="请求参数名" width="180"></el-table-column>
                  <el-table-column prop="isMust" label="是否必须" width="180"></el-table-column>
                  <el-table-column prop="type" width="180" label="类型"></el-table-column>
                  <el-table-column prop="state" label="说明"></el-table-column>
                </el-table>
              </template>
            </div>
          </div>
          <div class="tab">
            <div>
              <h4>请求参数示例：</h4>
            </div>
            <div class="tab_mb">
              <!-- <span v-html="this.param"></span> -->
              <pre>{{this.param}}</pre>
            </div>
          </div>
          <div class="tab">
            <div>
              <h4>返回数据说明：</h4>
            </div>
            <el-table :data="ReturnData" style="width: 100%" border>
              <el-table-column prop="name" label="参数名" min-width="180"></el-table-column>
              <el-table-column prop="explain" label="说明" min-width="180"></el-table-column>
            </el-table>
          </div>
          <!-- <div class="tab">
            <div>
              <h4>返回数据示例：</h4>
            </div>
            <div class="tab_mb">
              <pre>{{this.returnParam}}</pre>
            </div>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "viewPort",
  data() {
    return {
      tableData: [
        {
          argument: "serviceName",
          isMust: "是",
          type: "String",
          state: "服务名称"
        },
        {
          argument: "colNames",
          isMust: "是",
          type: "String",
          state: "返回列名，* 通配；其他字段可过滤"
        },
        {
          argument: "colName",
          isMust: "是",
          type: "String",
          state: "Condition条件中的列名"
        },
        {
          argument: "value",
          isMust: "是",
          type: "String",
          state: "Condition条件中的列名对应的值，动态变化"
        },
        {
          argument: "ruleType",
          isMust: "是",
          type: "String",
          state: "Condition条件中的列名与值的对比规则"
        }
      ],
      ReturnData: [
        {
          name: "state",
          explain: "请求返回数据状态 SUCCESS 成功 FAILURE 失败"
        },
        {
          name: "resultMessage",
          explain: "接口请求返回数据描述"
        },
        {
          name: "resultCode",
          explain: "接口请求返回业务定义状态码"
        },
        {
          name: "response",
          explain: "返回其它数据信息(data是其返回值)"
        }
      ],
      visitPath: null,
      //   param: {
      //     serviceName: "srvdc_share_shared_column_select",
      //     colNames: ["*"],
      //     condition: [
      //       {
      //         colName: "table_no",
      //         value: "DS201909290012.bk_bxms_file.bxfile_attachment",
      //         ruleType: "eq"
      //       }
      //     ]
      //   }
      param:
        '{\n  "serviceName":"srvdc_share_shared_column_select",\n  "colNames": ["*"],\n    "condition": [\n        {\n        "colName":"table_no",\n       "value": "DS201909290012.bk_bxms_file.bxfile_attachment",\n        "ruleType":"eq"\n        },\n    ]\n}',
      returnParam:
        '{\n   "condition": [\n{\n"colName":"table_no",\n"value": "DS201909290012.bk_bxms_file.bxfile_attachment",\n        "ruleType":"eq"\n        }\n    ],\n  "data":[\n  {\n"column_comment": "文件大小",\n"column_name": "file_size",\n"seq": 20\n},\n{\n"column_comment":"上传文件名称",\n"column_name":"src_name",\n"seq":10\n}\n],\n"page":{\n"totle":2,\n"pageNo":1,\n"rownumber":100\n},\n"state":"SUCCESS"\n}'
    };
  },
  components: {},
  mounted() {
    console.log("-------------path", top.backendIpAddr);
    this.visitPath = top.backendIpAddr;
    this.getData();
    console.log(JSON.stringify(this.param));
  },
  methods: {
    getData() {
      let params = {
        serviceName: "srvdc_share_shared_column_select",
        colNames: ["column_name", "column_comment", "seq"],
        condition: [
          {
            colName: "table_no",
            value: "DS201910110018.bxms_emr.bxanalyze_emr_overall_record",
            ruleType: "eq"
          }
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
        // this.tableDataTitle = res.data.data;
        console.log("res.data.data--=-=-=-=-", res.data.data);
      });
    }
  }
};
</script>

<style>
/* å…¨å±€å¤´éƒ¨ */
.header-tabs {
  width: 100%;
  height: 80px;
  background-color: white;
}
.header-tabs .btn-default {
  padding: 6px 20px;
  margin-top: 25px;
}
.navbar-text {
  margin-top: 28px;
  border-left: 1px solid #ddd;
  padding-left: 15px;
  color: #999;
  display: inline-block;
  *display: inline;
  *zoom: 1;
  margin-left: 0px;
}
.nav-tabbable {
  margin-left: 50px;
  float: left;
  height: 80px;
}
.navbar-header {
  float: left;
}
.nav-tabs_k {
  float: left;
  margin-left: 110px;
}
.nav-tabs_k > li {
  float: left;
  font-size: 16px;
  margin: 0 10px;
}
.nav-tabs_k > li > a {
  height: 80px;
  line-height: 60px;
  *height: 60px;
}
/* .nav-tabs_k > li.active > a,
.nav-tabs_k > li.active > a:focus,
.nav-tabs_k > li.active > a:hover {
  color: #fff;
  cursor: default;
  background-color: #ff7800;
} */
.main-tabs {
  margin-top: 20px;
}

/* ä¿® æ”¹bootstrapæ ·å¼  å¯¼èˆª */
.navbar-brand {
  height: auto;
  padding: 10px 15px;
}
.navbar-right {
  margin-right: 15px;
  float: right;
}
.white_bg {
  background: #fff;
}
.opendoc_left {
  padding-left: 0px;
  padding-right: 20px;
  width: 20%;
  float: left;
}
.opendoc_right {
  padding: 30px 20px;
  min-height: 800px;
  width: 95%;
  margin: 0 auto;
}
.opendoc_right .h_cont {
  padding: 20px;
}
.opendoc_right .h_cont h3 {
  font-weight: bold;
  color: #333;
  font-size: 16px;
}
.opendoc_right .h_cont p img {
  margin: 0 auto;
  text-align: center;
}
.opendoc_right .h_cont h4 {
  color: #333;
  font-weight: bold;
}
.opendoc_right .h_cont h5 {
  font-weight: bold;
}
.bor_top {
  border-top: dashed 1px #ebebea;
}
.tools-nav li {
  border-bottom: solid 1px #eee;
  text-align: left;
}
.tools-nav .nav_tit {
  border-bottom: solid 1px #eee;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  background: #f8f8f8;
}
.tools-nav .nav_tit a:hover {
  height: 50px;
  line-height: 50px;
}
.tools-nav .nav_tit .tools-nav-btn {
  height: 50px;
  line-height: 50px;
}
.tools-nav-btn,
.tools-nav-btn:hover {
  width: 128px;
  height: 40px;
  display: block;
  color: #333;
  padding-left: 35px;
  line-height: 40px;
  font-size: 16px;
  text-decoration: none;
}
.tools-nav-btn:hover,
.tools-nav-btn:active,
.tools-nav ul li.tools-nav-btn-hover {
  background: #fff;
}
.tools-nav ul li.tools-nav-btn-hover {
  color: #ff8712;
  border-left: solid 5px #ff8712;
}
.tools-nav ul li.tools-nav-btn-hover a {
  color: #ff8712;
}
.header-tabs a.btn-un_default {
  padding: 6px 20px;
  margin-top: 25px;
  color: #ff7800;
  border-color: #ff7800;
}
.header-tabs a.btn-un_default:hover {
  color: #fff;
}

/*position èœå•èƒŒæ™¯å›¾æ ‡*/
.container .menu h3 i.fa {
  margin-right: 10px;
  font-size: 20px;
  color: #333;
}
.container .menu h3 {
  font-size: 16px;
  cursor: pointer;
  padding: 25px 20px;
  background: #fff;
  border-bottom: solid 1px #eeeeee;
}
.container .menu h3.onleft {
  border-left: solid 2px #ff7800;
}
.container .menu ul {
  display: none;
}
.container .menu ul li {
  height: 40px;
  background: #fcfcfc;
  line-height: 40px;
  text-align: left;
  text-indent: 56px;
}
.container .menu ul li a {
  display: block;
  height: 40px;
  width: 100%;
  cursor: pointer;
}
.container .menu ul li a:hover {
  color: #f60;
}
.container .menu .selected {
  color: #f60;
  display: block;
}
.container .get-menu {
  font-size: 16px;
  color: #333;
  border-bottom: #ececec solid 1px;
  margin-bottom: 20px;
  height: 41px;
}
.container .get-menu .nav_title {
  display: inline-block;
  height: 41px;
  *width: 180px;
  padding: 0px 10px;
  font-weight: bold;
  /* background: url(../images/icon.png) no-repeat center bottom; */
}
.container .get-menu span {
  display: inline-block;
  height: 40px;
}

/*èœå•ä¸‹çš„æ–‡æ¡£å†…å®¹*/
.container .content2_he .menu_tab .tab {
  display: none;
}
.container .content2_he .menu_tab .active {
  background-color: white !important;
}
.container .content2_he .menu_tab .tab p {
  font-size: 14px;
  line-height: 24px;
  word-break: break-all;
}
.container .content2_he .menu_tab .tab .tt {
  font-size: 14px;
  font-weight: bold;
}
.container .content2_he .menu_tab .tab {
  padding: 20px 30px;
}

/* æ–‡å­—æŽ’ ç‰ˆ */
.menu_tab {
  line-height: 36px;
}
.opendoc_right .menu_tab h3 {
  color: #333;
}
.menu_tab strong,
.opendoc_right .content2_he .tab h4 {
  color: #444;
  font-size: 16px;
}
.font_0071 {
  color: #0071ef;
}
.tab_mb {
  background: #fdfdfd;
  padding: 15px;
  border: solid 1px #ececec;
  border-radius: 5px;
  /* white-space: pre-line; */
  color: #606266;
}
.opendoc_right .table > thead > tr > th {
  background: #408fe4;
  color: #fff;
  min-width: 90px;
}
.opendoc_right .menu_tab h4,
.opendoc_right .menu_tab h5,
.opendoc_right .menu_tab h3,
.container .content2_he .menu_tab .tab p.t_h5 {
  padding-bottom: 10px;
  font-weight: bold;
}
.opendoc_right .panel-default,
.tab_mb {
  margin-bottom: 35px;
}
.opendoc_right .menu_tab h5,
.container .content2_he .menu_tab .tab p.t_h5 {
  font-size: 16px;
  color: #555;
}
.pt10_0 {
  padding: 10px 0px;
}
.tab_mb .linenums span {
  padding: 0px 3px;
}
.linenums li {
  list-style-type: none;
  line-height: 20px;
}
.hljs {
  color: black;
}
.hljs-string {
  color: #c7254e;
}
.hljs-number,
.hljs-literal {
  color: #080;
}
.hljs {
  display: block;
  overflow-x: auto;
  padding: 3px;
  -webkit-text-size-adjust: none;
}

/* .prettyprinted{ border:0px; background:none;}
 */

/* SDKä¸‹è½½ */
.menu4 .thumbnail .caption h4,
.tab-p2main .thumbnail .caption h4 {
  padding: 10px 0px;
  font-weight: normal;
  font-size: 16px;
}
.menu4 .thumbnail .caption,
.tab-p2main .thumbnail .caption {
  text-align: center;
  padding: 9px 0px;
}
.menu4 .thumbnail,
.tab-p2main .thumbnail {
  border: solid 1px #fff;
}
.menu4 .thumbnail:hover,
.tabmain .thumbnail:hover {
  border: 1px solid #ff7800;
}
.menu4 .thumbnail .caption p,
.tab-p2main .thumbnail .caption p {
  padding-top: 10px;
}

/* å¸¸è§ é—®é¢˜ */
.tab-pmain {
  padding: 30px 20px;
  min-height: 800px;
}
.panel-default > .panel-heading {
  color: #333;
  background-color: #f7f7f7;
}
.panel-default {
  border-color: #ececec;
}
.panel-default > .panel-heading + .panel-collapse > .panel-body {
  border-top-color: #ececec;
}
.panel-group .panel + .panel {
  margin-top: 15px;
}
.panel-title {
  display: block;
  width: 100%;
  cursor: pointer;
  font-size: 14px;
}
.panel-title i {
  float: right;
  font-size: 22px;
  margin-right: 10px;
  color: #c7c7c7;
}
.panel .panel-coll2 {
  display: none;
}
.panel.current .panel-coll2 {
  display: block;
}
.panel.current .panel-title i {
  transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  top: -3px;
}
.panel-group .panel {
  -webkit-box-shadow: 0 0px 0px;
  box-shadow: 0 0px 0px;
}

/* ä½¿ç”¨è¯´æ˜Ž */
.tab-p2main .col-md-2 {
  width: 19.666667%;
  float: left;
}
.tabmain .get-menu {
  background-color: #f9f9f9;
  height: 70px;
}
.tabmain .get-menu .nav_title {
  height: 70px;
  padding: 20px 30px;
  *height: 31px;
  *width: 180px;
}
.tabmain .get-menu .nav_title span {
  width: 6px;
  height: 20px;
  background-color: #0071ff;
  margin-right: 10px;
  position: relative;
  left: 0;
  top: 3px;
  border-radius: 10px;
}

/*  ä¸‹è½½ä¸­å¿ƒ */
.tab-p3main .thumbnail {
  padding: 15px;
}
.tab-p3main .thumbnail img {
  float: left;
  margin-right: 20px;
}
.tab-p3main .thumbnail .caption {
  padding: 0px;
}
.tab-p3main .thumbnail .caption p {
  padding-top: 2px;
  color: #999;
}
.tab-p3main .col-md-4 {
  width: 33.33333333%;
  float: left;
}
.label_news {
  background-color: red;
  color: #fff;
  width: 35px;
  height: 35px;
  right: 23%;
  font-size: 12px;
  line-height: 35px;
  text-align: center;
  border-radius: 100%;
  z-index: 1;
}
.tabmain {
  min-height: 600px;
}

/* å¼¹å‡ºçª—å£æç¤º */
.modal-dialog {
  width: 400px;
  margin: 20% auto;
}
.modal-content,
.modal-header,
.modal-footer {
  border: 0px;
}
.modal-body {
  text-align: center;
  color: #333;
}
.modal-title {
  font-size: 16px;
}
.modal-footer {
  text-align: center;
}

/* ç™½è‰²åº•éƒ¨ */
.footer-bg {
  background-color: #fff;
  width: 100%;
  height: 100px;
  height: auto !important;
  min-height: 100px;
  text-align: center;
  line-height: 100px;
  color: #999;
}
.footer-bg .copy a {
  color: #999;
}

/* æ–°å¢ž */
.bw {
  word-wrap: break-word;
  word-break: break-all;
}
</style>
