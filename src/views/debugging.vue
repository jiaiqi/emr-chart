<template>
  <div class="home">
    <div class="home_content">
      <div class="box_one">
        <span>一 . 选择服务应用:</span>
        <select v-model="data_change" @change="adm">
          <option
            v-for="(item,index) in app_name"
            :key="index"
            :value="item.app_name"
          >{{item.app_name}}</option>
        </select>
      </div>
      <div class="box_two">
        <span>二 . 选择接口列表:</span>
        <el-select v-model="value8" filterable placeholder="请选择" @change="serviceChange">
          <el-option
            v-for="(item,index) in app_no"
            :key="index"
            :label="item.service_view_name"
            :value="item.service_view_name"
          ></el-option>
        </el-select>
        <span class="box_two_method">方法：GET</span>
      </div>
      <div class="box_three">
        <p>三. 参数列表</p>
        <p class="box_pone">接口参数：</p>
        <textarea cols="130" rows="25" v-model="data_one"></textarea>
        <p class="box_threep">调用接口的数据json包</p>
        <div class="box_three_foot1">
          <span class="box_three_foot_span">*</span>
          <span>appid:</span>
          <!-- <input type="text" v-model="appId" /> -->
          <el-select
            v-model="appId"
            filterable
            placeholder="请选择"
            @change="changeAppId"
            style="width:400px; margin-left:130px;"
          >
            <el-option
              v-for="(item,index) in appIdData"
              :key="index"
              :label="item.appid"
              :value="item.appid"
            ></el-option>
          </el-select>
          <p class="box_three_foot_p">填写appid</p>
          <p class="box_three_foot_p2">校验通过</p>
        </div>
        <div class="box_three_foot2">
          <span class="box_three_foot_span">*</span>
          <span>secret:</span>
          <el-input
            type="text"
            v-model="appSecret"
            class="secret"
            style="width:400px; margin-left:130px;"
          />
          <p class="box_three_foot_p">填写appsecret</p>
          <p class="box_three_foot_p2">校验通过</p>
        </div>
        <input @click="debuggs" type="submit" value="在线调试" />
      </div>
      <div class="box_four" v-if="show">
        <div class="box_four_a">
          <span>{{this.data_change}}</span>
          <span>:</span>
          <span>{{this.value8}}</span>
        </div>
        <div class="box_four_b">
          <span>请求地址：</span>
          <span>{{requestUrl}}</span>
          <!-- <span>'http://192.168.0.192:8101/{{this.api}}/select/srvsys_service_select'</span> -->
        </div>
        <div class="box_four_c">
          <p>返回结果：</p>
          <textarea cols="100" rows="25" v-model="data_return"></textarea>
        </div>
        <div class="box_four_d">
          <span>提示 :</span>
          <span class="box_four_d_color">{{data_state}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
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
      appIdData: []
    };
  },
  methods: {
    getData_one() {
      //选择服务应用
      let req = {
        colNames: ["*"],
        condition: [],
        order: [],
        page: { pageNo: 1, rownumber: 10 },
        serviceName: "srvconfig_app_list_select"
      };
      let url = this.getServiceUrl("select", req.serviceName, "config");
      axios
        .post(url, req)
        .then(res => {
          this.app_name = res.data.data;
          console.log(this.app_name);
          this.data_change = this.app_name[4].app_name;
          this.api = this.app_name[4].app_no;
        })
        .catch(err => {
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
    },
    getData_sec() {
      //选择接口列表
      let req2 = {
        serviceName: "srvsys_service_select",
        colNames: ["*"],
        condition: [
          {
            colName: "permission_type",
            ruleType: "ne",
            value: "内部访问"
          },
          {
            colName: "is_leaf",
            ruleType: "eq",
            value: "是"
          }
        ],
        page: {},
        order: []
      };
      let url = this.getServiceUrl("select", req2.serviceName, this.api);
      axios
        .post(url, req2)
        .then(res => {
          this.app_no = res.data.data;
          this.value8 = res.data.data[0].service_view_name;
          // console.log(res.data.data)
        })
        .catch(err => {
          // console.log(err)
        });
    },
    getData_three() {
      let req3 = this.data_one;
      let appNo = this.api;
      let service = this.serviceName;
      let type = this.serviceType;
      let str = `{"serviceName": "${service}", ${req3}}`;
      str = JSON.parse(str.replace(/\s+/g, ""));
      this.data[0] = str;
      // console.log('+++++++++', this.data)
      let data1 = [];
      let data2 = [];
      let map = {
        serviceName: "srvonline_interface_deubg",
        data: data2
      };
      let map1 = {
        req_app: appNo,
        operate_type: type,
        app_Id: this.appId,
        app_secret: this.appSecret,
        param: str
      };
      data1.push(map);
      data2.push(map1);
      // console.log('+++++++++', data1)
      let url = this.getServiceUrl("operate", map.serviceName, "apprc");
      axios
        .post(url, data1)
        .then(res => {
          this.data_return = JSON.stringify(res.data.response);
          this.data_state = res.data.state;
        })
        .catch(err => {
          console.error(err);
        });
    },
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
      this.axios
        .post(url, req)
        .then(res => {
          console.log("appidData:", res.data.data);
          this.appIdData = res.data.data;
        })
        .catch(err => {
          console.error();
        });
    },
    serviceChange() {
      this.app_no.forEach(item => {
        if (this.value8 === item.service_view_name) {
          this.serviceName = item.service_name;
          this.serviceType = item.service_type;
        }
      });
    },
    debuggs() {
      this.getData_three();
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
  color: black !important;
}
.home {
  width: 100%;
  background-color: white;
}
.home_content {
  width: 96%;
  margin: 0 auto;
}
.box_one {
  padding-top: 20px;
}
.box_one,
.box_two {
  width: 100%;
  height: 100px;
}

.box_two_method {
  margin-left: 20px;
  opacity: 0.5;
}
.box_three > textarea {
  margin-left: 180px;
}
.box_pone {
  margin-top: 10px;
}
.box_threep {
  margin-left: 180px;
  opacity: 0.5;
}
.box_three_foot_span {
  color: red;
  .secret {
    width: 35%;
  }
}
.box_three_foot2 > input {
  margin-left: 108px;
}
.box_three_foot1 > input {
  margin-left: 111px;
}
.box_three_foot1 > p,
.box_three_foot2 > p {
  margin-left: 173px;
}
.box_three_foot_p {
  opacity: 0.5;
  margin-top: 5px;
}
.box_three_foot_p2 {
  color: darkgreen;
  display: none;
}
.box_three_foot1 {
  max-width: 600px;
  margin-top: 20px;
}
.box_three > input {
  margin-left: 173px;
  margin-top: 30px;
  background-color: lightgreen;
  width: 120px;
  height: 40px;
  font-size: 20px;
}
.box_three_foot2 {
  max-width: 600px;
  margin-top: 30px;
}
.el-select {
  width: 400px;
  margin-left: 50px;
}
el-select > el-option {
  height: 20px;
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
.box_four {
  width: 100%;
  margin-top: 50px;
}
.box_four > .box_four_a {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-weight: bolder;
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;
}
.box_four > .box_four_b {
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #ccc;
}
.box_four_c > textarea {
  margin-left: 155px;
  margin-top: -16px;
}
.box_four_c {
  border-bottom: 1px solid #ccc;
}
.box_four_d_color {
  color: red;
}
.box_four_d {
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
</style>