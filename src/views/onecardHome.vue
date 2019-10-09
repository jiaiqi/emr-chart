<template>
  <!-- 一卡通 -->
  <div class="content_right_box">
    <div class="content_header">
      <div class="icon-view">
        <div id="currey" @click="homeHref(item.title)" :class="item.classStyle" v-for="(item,index) in lineOne" :key="index">
          <div class="content_header_divo">
            <i :class="item.icon"></i>
          </div>
          <div class="content_header_divt">
            <span>{{item.title}}</span>
            <span>{{item.value === null ? '-' : item.value}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content_two_title">
      <span>电子病历</span>
    </div>
    <div class="content_two">
      <div @click="development(item.title)" id="currey" class="content_two_box" v-for="(item,index) in lineTwo" :key="index">
        <div class="content_two_boxone">
          <span>{{item.title}}</span>
        </div>
        <div class="content_two_boxtwo">
          <span>{{item.value === null ? '-' : item.value}}</span>
        </div>
      </div>
    </div>
    <div class="content_three_title">就诊数量</div>
    <div class="content_three">
      <div class="content_three_box">
        <ve-line :data="chartData" :settings="chartSettings" height="310px"></ve-line>
      </div>
    </div>
  </div>
</template>
<script>
let moment = require('moment');
import axios from 'axios'
import VeLine from 'v-charts/lib/line'

export default {
  data() {
    this.chartSettings = {
      metrics: ['门诊人数', '住院人数'],
      dimension: ['时间']
    }

    return {
      lineOne: [
        {
          "title": '卡机个数',
          "value": 0,
          "icon": 'fa fa-server',
          "classStyle": 'icon-view-item icon-view-item-orange'
        }, {
          "title": '门诊记录数',
          "value": 0,
          "icon": 'fa fa-address-card-o',
          "classStyle": 'icon-view-item icon-view-item-green'
        }, {
          "title": '住院记录数',
          "value": 0,
          "icon": 'fa fa-calendar-check-o',
          "classStyle": 'icon-view-item icon-view-item-blue'
        }, {
          "title": '卡机设备心跳数',
          "value": 0,
          "icon": 'fa fa-credit-card',
          "classStyle": 'icon-view-item icon-view-item-lGreen'
        }
      ],
      lineTwo: [
        {
          "title": '患者总数',
          "value": 0,

        },
        {
          "title": '门诊挂号',
          "value": 0,

        },
        {
          "title": '入院记录',
          "value": 0,

        },
        {
          "title": '检验报告',
          "value": 0,

        },
        {
          "title": '医嘱',
          "value": 0,

        },

      ],
      chartData: {
        columns: ['时间', '门诊人数', '住院人数'],
        rows: [
          {
            "住院人数": 100,
            "时间": "17点",
            "门诊人数": 10
          }
        ]
      },
    }
  },
  methods: {
    //卡机个数
    getData_one() {
      let req = {
        "serviceName": "srvcvs_device_cfg_select",
        "colNames": ["*"],
        "condition": [
        ],
        "group": [{ "colName": "card_id", "type": "count" }]
      }
      let path = this.getServiceUrl("select", 'srvcvs_device_cfg_select', "cvs");
      axios.post(
        path, req,
      ).then(res => {
        this.lineOne[0].value = res.data.data[0].card_id
      }).catch(err => {
        console.log(err)
      })
    },
    //住院记录数
    getLineData() {
      let req2 = {
        "serviceName": "srvcvs_medical_records_select",
        "colNames": ["*"],
        "condition": [
          {
            "colName": "ywfssj",
            // "value": this.timeHorizon.today,
            "value": moment().format("YYYY-MM-DD HH:mm:ss"),
            "ruleType": "le"
          },
          {
            "colName": "ywfssj",
            // "value": this.timeHorizon.today,
            "value": moment().subtract(23, 'hours').format("YYYY-MM-DD HH:mm:ss"),
            "ruleType": "ge"
          },
        ],

      }
      let path = this.getServiceUrl("select", 'srvcvs_medical_records_select', "cvs");
      axios.post(
        path, req2,
      ).then(res => {
        // this.lineOne[1].value = res.data.data.length
        let timeData = res.data.data
        let hours = []
        for (let i = 1; i <= 24; i++) {
          hours.push(moment().subtract(24 - i, 'hours').format("HH"))

        }
        // console.log("hours",hours)
        let types = ["门诊人数", "住院人数"]
        let rows = []
        hours.map(hour => {
          // let dateHour = timeData[i].ywfssj.slice(11, 13) 
          let dataMap = {
            "住院人数": 0,
            "门诊人数": 0,
            "时间": ""
          }
          if (hour < 10) {
            dataMap.时间 = hour.slice(1, 2) + "点"
          } else {
            dataMap.时间 = hour + "点"
          }
          for (let i = 0; i < types.length; i++) {
            let datas = timeData
            // console.log('timeData',timeData,datas)
            let countData = []
            datas.map((res) => {
              let dateHour = res.ywfssj.slice(11, 13)
              if (dateHour == hour && types[i].indexOf(res.cmd) !== -1) {
                countData.push(res)
              }
            })
            // console.log('count',countData)
            dataMap[types[i]] = countData.length
          }
          rows.push(dataMap)
        })
        this.chartData.rows = rows
        // console.log('22222222__111111',this.chartData)
      }).catch(err => {
        console.log(err)
      })
    },
    //门诊记录数
    getData_two3() {
      let req9 = {
        "serviceName": "srvcvs_medical_records_select",
        "colNames": ["*"],
        "condition": [{
          colName: 'cmd',
          ruleType: 'eq',
          value: '门诊'
        }
        ],
        "group": [{ "colName": "bizno", "type": "count" }]

      }
      let path = this.getServiceUrl("select", 'srvcvs_medical_records_select', "cvs");
      axios.post(
        path, req9,
      ).then(res => {
        this.lineOne[1].value = res.data.data[0].bizno
      }).catch(err => {
        console.log(err)
      })
    },
    //住院记录数
    getData_two2() {
      let req9 = {
        "serviceName": "srvcvs_medical_records_select",
        "colNames": ["*"],
        "condition": [{
          colName: 'cmd',
          ruleType: 'eq',
          value: '住院'
        }
        ],
        "group": [{ "colName": "bizno", "type": "count" }]

      }
      let path = this.getServiceUrl("select", 'srvcvs_medical_records_select', "cvs");
      axios.post(
        path, req9,
      ).then(res => {
        this.lineOne[2].value = res.data.data[0].bizno
      }).catch(err => {
        console.log(err)
      })
    },
     homeHref(item){
      if(item=="卡机个数"){
          let page = {
        title: item,
        url: '/vpages/index.html#/list/srvcvs_device_cfg_select/0001',
        icon: ""
      };
      window.top.tab.addTab(page);
        // window.location.href ='http://192.168.0.199/vpages/index.html#/list/srvcvs_device_cfg_select/0001'
        // window.location.href = '/vpages/index.html#/list/srvcvs_device_cfg_select/0001'
        //  this.$router.push({path:'/vpages/index.html#/list/srvcvs_device_cfg_select/0001'})
      }else if(item=="门诊记录数"){
          let page = {
        title: item,
        url: '/vpages/index.html#/list/srvcvs_medical_records_select',
        icon: ""
      };
      window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/list/srvcvs_medical_records_select'

        //  this.$router.push({path:'/vpages/index.html#/list/srvcvs_medical_records_select'})
      }else if(item=="住院记录数"){
          let page = {
        title: item,
        url: '/vpages/index.html#/list/srvcvs_medical_records_select',
        icon: ""
      };
      window.top.tab.addTab(page);
        //  window.location.href ='/vpages/index.html#/list/srvcvs_medical_records_select'
      }else if(item=="卡机设备心跳"){
          let page = {
        title: item,
        url: '/vpages/index.html#/list/srvcvs_device_heart_record_select',
        icon: ""
      };
      window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/list/srvcvs_device_heart_record_select'
      }
    },
    development(item){
      if(item=="患者总数"){
          let page = {
        title: item,
        url: '/vpages/index.html#/list/DI_MPI_REGISTERINFO_select',
        icon: ""
      };
      window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/list/DI_MPI_REGISTERINFO_select'
      }else if(item=="门诊挂号"){
          let page = {
        title: item,
        url: '/vpages/index.html#/list/DI_ADI_REGISTER_INFO_select',
        icon: ""
      };
      window.top.tab.addTab(page);
        //  window.location.href = '/vpages/index.html#/list/DI_ADI_REGISTER_INFO_select'
      }else if(item=="入院记录"){
          let page = {
        title: item,
        url: '/vpages/index.html#/list/DI_HDI_INRECORD_INFO_select',
        icon: ""
      };
      window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/list/DI_HDI_INRECORD_INFO_select'
      }
      // }else if(item=="申请中应用个数"){
      //    this.$router.push({path:'/vpages/index.html#/listproc/srvapprc_application_apply_select'})
      // }else if(item=="上线应用个数"){
      //    this.$router.push({path:'/vpages/index.html#/listproc/srvapprc_online_apply_select'})
      // }
    },
    //卡机设备心跳数
    getData_kj() {
      let req = {
        "serviceName": "srvcvs_device_heart_record_select",
        "colNames": ["*"],
        "condition": [
        ],
        "group": [{ "colName": "id", "type": "count" }]
      }
      let path = this.getServiceUrl("select", 'srvcvs_device_heart_record_select', "cvs");
      axios.post(
        path, req,
      ).then(res => {
        this.lineOne[3].value = res.data.data[0].id
      }).catch(err => {
        console.log(err)
      })
    },
    //患者总数
    getData_three() {
      let req3 = {
        "serviceName": "DI_MPI_REGISTERINFO_select",
        "colNames": ["*"],
        "condition": [

        ],
        "group": [{ "colName": "id", "type": "count" }]
      }
      let path = this.getServiceUrl("select", 'DI_MPI_REGISTERINFO_select', "emr");
      axios.post(
        path, req3,
      ).then(res => {
        this.lineTwo[0].value = res.data.data[0].id
        // console.log('3333333',res.data.data)
      }).catch(err => {
        console.log(err)
      })
    },
    //门诊挂号
    getData_four() {
      let req4 = {
        "serviceName": "DI_ADI_REGISTER_INFO_select",
        "colNames": ["*"],
        "condition": [

        ],
        "group": [{ "colName": "AP01_00_027_00", "type": "count" }]
      }
      let path = this.getServiceUrl("select", 'DI_ADI_REGISTER_INFO_select', "emr");
      axios.post(
        path, req4,
      ).then(res => {
        this.lineTwo[1].value = res.data.data[0].AP01_00_027_00
      }).catch(err => {
        console.log(err)
      })
    },
    //入院记录
    getData_five() {
      let req5 = {
        "serviceName": "DI_HDI_INRECORD_INFO_select",
        "colNames": ["*"],
        "condition": [

        ],
        "group": [{ "colName": "BATCH_NUM_NEW", "type": "count" }]
      }
      let path = this.getServiceUrl("select", 'DI_HDI_INRECORD_INFO_select', "emr");
      axios.post(
        path, req5,
      ).then(res => {
        this.lineTwo[2].value = res.data.data[0].BATCH_NUM_NEW
      }).catch(err => {
        console.log(err)
      })
    },
    //检验报告
    getData_six() {
      let self = this
      let req6 = {
        "serviceName": "DI_ADI_LAREXA_INFO_select",
        "colNames": ["*"],
        "condition": [

        ],
        "group": [{ "colName": "VER", "type": "count" }]
      }
      let path = this.getServiceUrl("select", 'DI_ADI_LAREXA_INFO_select', "emr");
      axios.post(
        path, req6,
      ).then(res => {
        if (res.data.data[0].VER > 0) {
          this.lineTwodif_one = res.data.data[0].VER
        }
        // console.log('666',res.data.data[0].VER)
        function getData_seven() {
          let req7 = {
            "serviceName": "DI_HDI_LAREXA_INFO_select",
            "colNames": ["*"],
            "condition": [

            ],
            "group": [{ "colName": "ORGANIZATION_NAME", "type": "count" }]
          }
          let path = self.getServiceUrl("select", 'DI_HDI_LAREXA_INFO_select', "emr");
          axios.post(
            path, req7,
          ).then(res => {
            // console.log(res.data.data[0].ORGANIZATION_NAME)
            if (res.data.data[0].ORGANIZATION_NAME > 0) {
              self.lineTwodif_two = res.data.data[0].ORGANIZATION_NAME
              self.lineTwo[3].value = self.lineTwodif_two + self.lineTwodif_one
            }
          }).catch(err => {
            console.log(err)
          })
        }
        getData_seven()
      }).catch(err => {
        console.log(err)
      })
    },
    //医嘱
    getData_eight() {
      let req8 = {
        "serviceName": "DI_ADI_DRUREC_INFO_select",
        "colNames": ["*"],
        "condition": [
        ]
      }
      let path = this.getServiceUrl("select", 'DI_ADI_DRUREC_INFO_select', "emr");
      axios.post(
        path, req8,
      ).then(res => {
        if (res.data.data.length > 0) {
          this.lineTwodif_three = res.data.data.length
        }
        // console.log('888888',res.data.data.length)
      }).catch(err => {
        console.log(err)
      })
    },
    getData_nine() {
      let req9 = {
        "serviceName": "DI_HDI_DRUREC_INFO_select",
        "colNames": ["*"],
        "condition": [
        ],
        "group": [{ "colName": "LOCAL_ID", "type": "count" }]
      }
      let path = this.getServiceUrl("select", 'DI_HDI_DRUREC_INFO_select', "emr");
      axios.post(
        path, req9,
      ).then(res => {
        // console.log(res.data.data[0].LOCAL_ID)
        this.lineTwodif_four = res.data.data[0].LOCAL_ID
        if (res.data.data[0].LOCAL_ID > 0) {
          this.lineTwo[4].value = this.lineTwodif_four + this.lineTwodif_four
        }
        // console.log('99999999',res.data.data.length)
      }).catch(err => {
        console.log(err)
      })
    },
  },
  created() {
    this.getData_one()
    this.getLineData()
    this.getData_two2()
    this.getData_two3()
    this.getData_three()
    this.getData_four()
    this.getData_five()
    this.getData_six()
    // this.getData_seven()
    this.getData_eight()
    this.getData_nine()
    this.getData_kj()
  }

}  
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
#currey{
  cursor: pointer;
}
/* 1920*1080 */
.content_two_title,
.content_three_title {
  width: 100%;
  height: 1.5rem;
  text-indent: 10px;
  line-height: 1.5rem;
  margin-top: 10px;
  padding-bottom: 10px;
  padding-top: 10px;
  font-weight: bolder;
  background-color: rgb(78, 194, 248);
  color: white;
}
.content_three_title {
  margin-top: 20px;
  margin-bottom: 10px;
}
.icon-view {
  list-style: none;
}
.content_right_box {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
}
.content_header {
  width: 100%;
}
.content_header > .icon-view {
  width: 100%;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content_header > .icon-view > .icon-view-item {
  width: 23%;
  display: flex;
  align-items: center;
  /* margin-right:1rem; */
  justify-content: space-around;
  border-radius: 10px;
}
.content_header > .icon-view > .icon-view-item-green {
  background-color: rgb(55, 221, 91);
}
.content_header > .icon-view > .icon-view-item-blue {
  background-color: rgb(11, 148, 240);
}
.content_header > .icon-view > .icon-view-item-orange {
  background-color: rgb(228, 207, 19);
}
.content_header > .icon-view > .icon-view-item-lGreen {
  background-color: rgb(137, 44, 243);
}
.content_header_divo {
  width: 50%;
  text-align: center;
}
.content_header_divt {
  width: 50%;
  padding-top: 20px;
  color: #fff;
}
.content_header_divo > span {
  width: 100%;
}
.content_header_divo > i {
  font-size: 80px;
  color: #fff;
}
.content_header_divt > span {
  display: block;
  text-align: center;
}
.content_header_divt > span:nth-of-type(2) {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 40px;
}
/* content_two */
.content_two {
  width: 100%;
  /* margin-top: 20px; */
  display: flex;
}
.content_two_box {
  margin-top: 20px;
  color: black!important;
  width: 20%;
}
.content_two_boxone {
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: baseline;
  margin-bottom: 20px;
}
.content_two_boxone > span {
  width: 100%;
  display: inline-block;
  text-align: center;
}
.content_two_boxtwo {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: baseline;
  font-size: 40px;
  /* margin-top:20px; */
  margin-bottom: 30px;
}
.content_two_boxtwo > span {
  width: 100%;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  border-right: 1px solid #cccccc;
}
.content_two_box:last-child .content_two_boxtwo > span {
  border-right-width: 0;
}
.content_two_boxtwo > span:nth-of-type(5) {
  border-right: none !important;
}
/* content_three */
.content_three {
  width: 100%;
  /* margin-top: 20px; */
}
.content_three > p {
  width: 100%;
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #cccccc;
  font-weight: bolder;
}
.content_three_box {
  width: 100%;
  height: 280px;
}

/* 1366*769 */
@media screen and (max-width: 1366px) {
  .content_two_title,
  .content_three_title {
    width: 100%;
    height: 1rem;
    text-indent: 10px;
    line-height: 1rem;
    /* margin-top: 10px; */
    padding-bottom: 5px;
    padding-top: 5px;
    font-weight: bolder;
    background-color: rgb(78, 194, 248);
    color: white;
    margin-top: 5px;
  }
  .content_three_title {
    margin-bottom: 5px;
  }
  .icon-view {
    list-style: none;
  }
  .content_right_box {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
  }
  .content_header {
    width: 100%;
  }
  .content_header > .icon-view {
    width: 100%;
    padding: 5px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content_header > .icon-view > .icon-view-item {
    width: 23%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
  }
  .content_header > .icon-view > .icon-view-item-green {
    background-color: rgb(55, 221, 91);
  }
  .content_header > .icon-view > .icon-view-item-blue {
    background-color: rgb(11, 148, 240);
  }
  .content_header > .icon-view > .icon-view-item-orange {
    background-color: rgb(219, 206, 83);
  }
  .content_header > .icon-view > .icon-view-item-lGreen {
    background-color: rgb(137, 44, 243);
  }
  .content_header_divo {
    width: 50%;
    text-align: center;
  }
  .content_header_divt {
    width: 50%;
    padding-top: 20px;
    color: #fff;
  }
  .content_header_divo > span {
    width: 100%;
  }
  .content_header_divo > i {
    font-size: 70px;
    color: #fff;
  }
  .content_header_divt > span {
    display: block;
    text-align: center;
  }
  .content_header_divt > span:nth-of-type(2) {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 30px;
  }
  /* content_two */
  .content_two {
    width: 100%;
    /* margin-top: 20px; */
    display: flex;
  }
  .content_two_box {
    margin-top: 10px;
    width: 20%;
  }
  .content_two_boxone {
    width: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: baseline;
    margin-bottom: 10px;
  }
  .content_two_boxone > span {
    width: 100%;
    display: inline-block;
    text-align: center;
  }
  .content_two_boxtwo {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: baseline;
    font-size: 30px;
    /* margin-top:20px; */
    margin-bottom: 30px;
  }
  .content_two_boxtwo > span {
    width: 100%;
    text-align: center;
    padding-top: 20px;
    padding-bottom: 20px;
    border-right: 1px solid rgb(235, 232, 232);
  }
  .content_two_box:last-child .content_two_boxtwo > span {
    border-right-width: 0;
  }
  .content_two_boxtwo > span:nth-of-type(5) {
    border-right: none !important;
  }
  /* content_three */
  .content_three {
    width: 100%;
    /* margin-top: 20px; */
  }
  .content_three > p {
    width: 100%;
    margin-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #cccccc;
    font-weight: bolder;
  }
  .content_three_box {
    width: 100%;
    height: 280px;
  }
}
</style>

