<template>
  <div class="home">
    <div class="home_content">
      <div class="box_one  boxs">
        <div class = "box_title">
          <span>一 . 选择服务应用：</span>
        </div>
        <select v-model="data_change" @change="adm">
          <option
            v-for="(item,index) in app_name"
            :key="index"
            :value="item.app_name"
          >{{item.app_name}}</option>
        </select>
      </div>
      <div class="box_two boxs">
        <div class = "box_title">
          <span>二 . 选择接口列表：</span>
        </div>
        <el-select v-model="value8" filterable placeholder="请选择" @change="serviceChange">
          <el-option
            v-for="(item,index) in app_no"
            :key="index"
            :label="item.service_view_name"
            :value="item.service_view_name"
          ></el-option>
        </el-select>
        <!-- <span class="box_two_method">方法：GET</span> -->
      </div>

      <div class="box_three boxs">
        <div class = "box_title">
          <span  >三 .  <i class="importid">appid：</i></span>
        </div>
        <!-- <input type="text" v-model="appId" /> -->
        <el-select
          v-model="appId"
          filterable
          placeholder="请选择"
          @change="changeAppId"
          style="width:400px; margin-left:50px;">
          <el-option
            v-for="(item,index) in appIdData"
            :key="index"
            :label="item.appid"
            :value="item.appid"
          ></el-option>
        </el-select>
        <!-- <p class="box_three_foot_p">填写appid</p>
        <p class="box_three_foot_p2">校验通过</p> -->
      </div>


      <div class="box_four boxs">
        <div class = "box_title">
          <span><i class="importid">secret：</i></span>
        </div>
        <el-input
          type="text"
          v-model="appSecret"
          class="secret"
        />
        <!-- <p class="box_three_foot_p">填写appsecret</p>
        <p class="box_three_foot_p2">校验通过</p> -->
      </div>

      <div class="box_five boxs">
        <div class = "box_title">
          <p class = "box_param">四 . 参数列表</p>
        </div>
        <div class = "cont">
          <div class = "cont_title">
            <p class="box_pone">接口参数：</p>
          </div>
          <div class = "cont_text">
            <textarea id="textTest" cols="130" rows="25" v-model="data_one" @change="paramChange"></textarea>
            <p class="box_threep">调用接口的数据json串</p>
          </div>
        </div>
      </div>
      <div class = "but boxs">
          <el-button type="primary" @click="debuggs">在线调试</el-button>
        <!-- <button  class="debugger">在线调试</button> -->
      </div>
      <div class="box_six boxs" v-if="show">
        <!-- <div class="box_four_a">
          <div class="c_title">
            <span>{{this.data_change}}</span>
            <span>：</span>
            <span>{{this.value8}}</span>
          </div>
        </div> -->
        <div class="box_four_b">
          <div class="req_addr">
            <span>请求地址：</span>
            <span>{{requestUrl}}</span>
          </div>
        </div>
        <div class="box_four_c">
          <p>返回结果：</p>
          <textarea id="texertwo" class="cont" cols="130" rows="25" v-model="data_return"></textarea>
        </div>
        <div class="box_four_d">
          <span class="d_title">提示：</span>
          <span class="box_four_d_color">{{data_state}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
let $ = require('jquery');
export default {
  data() {
    return {
      //elementui组件
      value8: "应用分类查询",
      app_no: [],
      app_name: [],
      data_change: "配置监控",
      api: "",
      show: true,
      data_one: "",
      serviceName: "",
      serviceType: "",
      data: [],
      appSecret: "",
      appId: "",
      data_return: [],
      data_state: "",
      requestUrl: "",
      appIdData: [],
      reqData:[]
    };
  },
  methods: {
    
    // acquire(val){
    //   this.data_one=val
    // },
    getData_one() {
      //选择服务应用
      let req = {
        colNames: ["*"],
        condition: [],
        order: [],
        page: {},
        serviceName: "srvconfig_app_list_select"
      };
      let salf = this;
      let url = this.getServiceUrl("select", req.serviceName, "config");
      axios.post(url, req).then(res => {
          salf.app_name = res.data.data;
          console.log(salf.app_name);
          salf.data_change = salf.app_name[4].app_name;
          salf.api = salf.app_name[4].app_no;
        }).catch(err => {
          console.error(err);
        });
    },
    changeAppId() {
      // 选择appid
      let appIdData = this.appIdData;
      let appid = this.appId;
      // console.log(appid, appIdData)
      for (let i = 0; i < appIdData.length; i++) {
        if (appid == appIdData[i].appid) {
          console.log(appid, appIdData[i].appid);
          this.appSecret = appIdData[i].secret_key;
        }
      }
      this.getData_three()
    },
    /**
     * 选择应用后，触发查询接口
     */
    getData_sec() {
      //选择接口列表
      let req2 = {
        "serviceName": "srvsys_service_select",
        "colNames": [
          "*"
        ],
        "condition": [
          {
            "colName": "module",
            "value": "syscore",
            "ruleType": "ne"
          },
          {
            "colName": "module",
            "value": "process",
            "ruleType": "ne"
          },
          {
            "colName": "permission_type",
            "value": "内部访问",
            "ruleType": "ne"
          },
          {
            "colName": "main_table",
            "value": "",
            "ruleType":"notnull"
          }
        ],
        "order": []
      }
      let url = this.getServiceUrl("select", req2.serviceName, this.api);
      axios.post(url, req2).then(res => {
          this.app_no = res.data.data;
          this.value8 = res.data.data[0].service_view_name;
          // console.log(res.data.data)
        }).catch(err => {
          // console.log(err)
        });
    },
    paramChange(){
      this.reqData = JSON.parse(this.data_one);
    },
    getData_three() {
      // try {
        // let req3 = this.data_one;
        let req3 =[
          {
            "colName": "id",
            "value": "1",
            "ruleType": "eq"
          }
        ]
        let appNo = this.api;
        let service = this.serviceName;

        let salf = this;
        
        let tableReq = {
          "serviceName": "srvsys_service_select",
          "colNames": [
            "*"
          ],
          "condition": [
            {
              "colName": "service_name",
              "value": service,
              "ruleType": "eq"
            }
          ]
        }
        let tableName = "";
        let url1 = salf.getServiceUrl("select", "srvsys_service_select", appNo);
        axios.post(url1, tableReq).then(res => {
          let service_data = res.data.data;
          let imple_type = service_data[0].imple_type;
          tableName = service_data[0].main_table;
          let tableStr = tableName.substring(2);
          let serviceName = "srv" + tableStr + "_select";



          let issueReq = {
            "serviceName": serviceName,
            "colNames": [
              "*"
            ]
          }
          let url2 = salf.getServiceUrl("select", serviceName, appNo);
          axios.post(url2, issueReq).then(res => {
            let issue = [];
            issue.push(res.data.data[0]);

            let type = this.serviceType;
            req3 = JSON.stringify(req3);
            let data1 = [];
            let data2 = [];
            let map = {
              serviceName: "srvonline_interface_deubg",
              data: data2
            };
            let map1 = null;
            if(type === 'select'){
              map1 = {
                req_app: appNo,
                operate_type: type,
                app_Id: this.appId,
                app_secret: this.appSecret,
                param: {
                  "serviceName": service,
                  "condition": [
                    {
                      "colName": "id",
                      "value": "1",
                      "ruleType": "eq"
                    }
                  ]
                }
              };
            }
            if(type === 'delete'){
              map1 = {
                req_app: appNo,
                operate_type: type,
                app_Id: salf.appId,
                app_secret: salf.appSecret,
                param: {
                  "serviceName": service,
                  "condition": [
                    {
                      "colName": "id",
                      "value": "1",
                      "ruleType": "eq"
                    }
                  ]
                }
                
              };
            }
            if(type === 'update' || type === 'add' || type === 'apply'){
              map1 = {
                req_app: appNo,
                operate_type: type,
                app_Id: salf.appId,
                app_secret: salf.appSecret,
                param: {
                  "serviceName": service,
                  "data": issue
                }
              };
            }
            data1.push(map);
            data2.push(map1);
            // salf.reqData = data1;
            console.error(data1)
            // let salf = this;
            salf.data_one = salf.formatJson(data1);
            
            // console.log(aaa);
          });
        });
    },
    /**
    * 应用选择事件
    */
    adm() {
      // console.log(this.data_change)
      this.app_name.forEach(item => {
        if (this.data_change === item.app_name) {
          this.api = item.app_no;
        }
      });
      this.getData_sec();
    },
    getAppId() {
      let req = {
        serviceName: "srvapprc_application_apply_select",
        colNames: [
          "apply_no",
          "appid",
          "secret_key",
          "application_name",
          "proc_status",
          "create_time"
        ],
        condition: [
          {
            colName: "proc_status",
            value: "完成",
            ruleType: "eq"
          }
        ]
      };

      let url = this.getServiceUrl("select", req.serviceName, "apprc");
      this.axios.post(url, req).then(res => {
          console.log("appidData:", res.data.data);
          this.appIdData = res.data.data;
        }).catch(err => {
          console.error();
        });
    },
    /**
     * 接口选择事件
     */
    serviceChange() {
      this.app_no.forEach(item => {
        if (this.value8 === item.service_view_name) {
          this.serviceName = item.service_name;
          this.serviceType = item.service_type;
          this.getData_three();
        }
      });
    },
    /**
     * 按钮点击事件
     */
    debuggs() {
      let salf = this;
      let cond = salf.reqData;
      let url = this.getServiceUrl("operate", "srvonline_interface_deubg", "apprc");
      axios.post(url, cond).then(res => {
        let response = res.data.response;
        this.data_return = salf.formatJson(res.data.response);
          this.data_state = res.data.state;
        }).catch(err => {
          console.error(err);
        });
    },
    formatJson(json, options) {
      
        var reg = null,
        formatted = '',
        pad = 0,
        PADDING = '    '; // one can also use '\t' or a different number of spaces
        // optional settings
        options = options || {};
        // remove newline where '{' or '[' follows ':'
        options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
        // use a space after a colon
        options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;

        // begin formatting...

        // make sure we start with the JSON as a string
        if (typeof json !== 'string') {
            json = JSON.stringify(json);
        }
        // parse and stringify in order to remove extra whitespace
        json = JSON.parse(json);
        json = JSON.stringify(json);

        // add newline before and after curly braces
        reg = /([\{\}])/g;
        json = json.replace(reg, '\r\n$1\r\n');

        // add newline before and after square brackets
        reg = /([\[\]])/g;
        json = json.replace(reg, '\r\n$1\r\n');

        // add newline after comma
        reg = /(\,)/g;
        json = json.replace(reg, '$1\r\n');

        // remove multiple newlines
        reg = /(\r\n\r\n)/g;
        json = json.replace(reg, '\r\n');

        // remove newlines before commas
        reg = /\r\n\,/g;
        json = json.replace(reg, ',');

        // optional formatting...
        if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
            reg = /\:\r\n\{/g;
            json = json.replace(reg, ':{');
            reg = /\:\r\n\[/g;
            json = json.replace(reg, ':[');
        }
        if (options.spaceAfterColon) {
            reg = /\:/g;
            json = json.replace(reg, ': ');
        }

        $.each(json.split('\r\n'), function(index, node) {
            var i = 0,
                indent = 0,
                padding = '';

            if (node.match(/\{$/) || node.match(/\[$/)) {
                indent = 1;
            } else if (node.match(/\}/) || node.match(/\]/)) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else {
                indent = 0;
            }

            for (i = 0; i < pad; i++) {
                padding += PADDING;
            }
            formatted += padding + node + '\r\n';
            pad += indent;
        });
        return formatted;
    }
  },
  
    watch:{
        value8(val, oldVal) {
          //  this.data_one=val
        }
    },
  mounted() {
    this.getData_one();
    setTimeout(() => {
      this.getData_sec();
      let requestUrl = this.getServiceUrl(
        "select",
        "srvsys_service_select",
        this.api
      );
      this.requestUrl = requestUrl;
    }, 1000);
    this.getAppId();
  }
};
</script>

<style scoped lang="scss">
* {
  padding: 0;
  margin: 0;
  list-style: none;
  box-sizing: border-box;
  /* color: black !important; */
}
.home {
  width: 100%;
  background-color: white;
}
.home_content {
  width: 96%;
  margin: 0 auto;
  color: #000;
}
.boxs {
  width: 100%;
  margin: 1rem;
}
.box_one{
  display: flex;
}
.box_one .box_title{
  width: 12rem;
}
.box_one span{
  display: inline-block;
  font-size: 1.3rem;
}
.box_two{
  display: flex;
}
.box_two .box_title{
  width: 12rem;
}
.box_two .box_title span{
  font-size: 1.3rem;
}
.box_three{
  display: flex;
}
.box_three .box_title{
  width: 12rem;
  /* padding-left: 2rem; */
}
.box_three .box_title span {
  font-size: 1.3rem;
}
.box_four{
  display: flex;
}
.box_four .box_title{
  width: 12rem;
  padding-left: 2rem;
}
.box_four .box_title span {
  font-size: 1.3rem;
}
.box_four .secret{
  width: 400px;
  margin-left: 50px;
}
.el-select {
  width: 400px;
  margin-left: 50px;
}
.box_five{

}
.box_five .box_title{
  width: 12rem;
}
.box_five .box_title .box_param{
  font-size: 1.3rem;
}
.box_five .cont{
  display: flex;
}
.box_five .cont .cont_title{
  width: 12rem;
}
.box_five .cont .cont_title .box_pone{
  font-size: 1.2rem;
  margin: 1.5rem 2rem;
}
.box_five .cont .cont_text{
  margin-top: 2rem;
  margin-left: 50px;
}
.but{
  width: 100%;
  height: 3rem;
  border-bottom: solid 0.5px #eee;
  /* text-align: center; */
}
.but button{
  width: 10rem;
  font-size: 1.3rem;
  height: 2.5rem;
  margin-left: 16rem;
}
.box_six .box_four_a{
  height: 3rem;
  width: 100%;
  border-bottom: solid 0.5px #eee;
  font-size: 1.3rem;
}
.box_six .box_four_a .c_title {
  margin-left: 2rem;
}
.box_six .box_four_b{
  height: 3rem;
  width: 100%;
  border-bottom: solid 0.5px #eee;
  font-size: 1.3rem;
}
.box_six .box_four_b .req_addr {
  margin-left: 2rem;
}
.box_six .box_four_c{
  display: flex;
  padding: 1rem 0;
  border-bottom: solid 0.5px #eee;
}
.box_six .box_four_c p{
  font-size: 1.2rem;
  margin-left: 2rem;
  width: 12rem;
}
.box_six .box_four_c .cont{
  margin-left: 1.3rem;
}
.box_six .box_four_d .d_title{
  font-size: 1.3rem;
  margin-left: 2rem;
}
.box_six .box_four_d .box_four_d_color{
  font-size: 1.3rem;
  color: red;
}

/* 在线调试按钮以下 */
.box_one > select {
  width: 200px;
  height: 40px;
  margin-left: 50px;
  border-radius: 3px;
  border: solid 1px #ccc;
}
input {
  height: 40px;
  width: 200px;
}
@media screen and (max-width:1185px){
 #textTest{
   width: 70vw;
 }
.box_six .box_four_c .cont{
    width: 70vw !important; 
     margin-left: 2rem;
 }
}

@media screen and (min-width:1185px){
 .but button{
  margin-left: 15rem;
}
}

@media screen and (min-width:1185px) and (max-width:1191px) {
   .but button{
  margin-left: 16rem !important;
}
}
</style>