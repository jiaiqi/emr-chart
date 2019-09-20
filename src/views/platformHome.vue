<template>
<!-- 协同平台 -->
<div class="content_right_box">
    <div class="content_header">
        <div class="icon-view">
            <div :class="item.classStyle" v-for="(item,index) in lineOne" :key="index">
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
    <div class="content_two_title"><span>应用开发中心</span></div>
    <div class="content_two">
    <div class="content_two_box" v-for="(item,index) in lineTwo" :key="index">
        <div class="content_two_boxone">       
            <span>{{item.title}}</span>
        </div>
        <div class="content_two_boxtwo">
            <span>{{item.value === null ? '-' : item.value}}</span>
        </div>
    </div>
    </div>
    <div class="content_three_title">服务请求次数</div>
    <div class="content_three">
    <div class="content_three_box">
       <ve-line
        :data="chartData"
        
        class="ve_lineitem"
        ></ve-line> 
    </div>
    </div>
</div> 
</template>
<script>
let moment = require('moment');
import axios from 'axios'
import VeLine from 'v-charts/lib/line'

export default {
    data () {
        return {
            sData1:'', //当前计算时间
            sData2:'', //计算后时间-24小时
            lineOne:[
            {
                "title":'用户数',
                "value":0,
                "icon":'fa fa-user-circle',
                "classStyle":'icon-view-item icon-view-item-orange'
            },{
                "title":'应用个数',
                "value":0,
                "icon":'fa fa-address-book-o',
                "classStyle":'icon-view-item icon-view-item-green'
            },{
                "title":'服务器个数',
                "value":0,
                "icon":'fa fa-list-ol',
                "classStyle":'icon-view-item icon-view-item-blue'
            }
            ,{
                "title":'累计服务次数',
                "value":0,
                "icon":'fa fa-calendar-check-o',
                "classStyle":'icon-view-item icon-view-item-lGreen'
            }
            ],
            lineTwo: [
                {
                "title":'工单个数',
                "value":0,
                },
                {
                "title":'文档个数',
                "value":0,
                },
                {
                "title":'开发包个数',
                "value":0,
                },
                {
                "title":'申请中应用个数',
                "value":0,
                
                },
                {
                "title":'上线应用个数',
                "value":0,
                },

            ],
             chartData : {
            columns: ['时间', '请求次数'],
            rows: [
                { '时间': '00：00', '请求次数': 123 },
                { '时间': '04：00', '请求次数': 1223 },
                { '时间': '08：00', '请求次数': 2123 },
                { '时间': '12：00', '请求次数': 4123 },
                { '时间': '16：00', '请求次数': 3123 },
                { '时间': '20：00', '请求次数': 7123 }
            ],
            grid: {
                top: '120',
                bottom: "0",
                height: "auto"
            },
            
        }
        }
    },
    methods: {
       serverNum(){
          let req10={
            "serviceName": "srvlog_call_statistics_select",
            "colNames": [
                "*"
            ],
            "condition": [
                {
                    "colName": "application",
                    "value": "apprc",
                    "ruleType": "eq"
                },
                {
                    "colName": "statistics_time",
                    "value": this.sData1,//（当前时间，需要前端自己定义变量）
                    "ruleType": "lt"
                },
                {
                    "colName": "statistics_time",
                    "value": this.sData2,//（开始计算的时间，是根据上个条件减去一个周期时间得到）
                    "ruleType": "gt"
                }
            ],
            "group": [
                {
                    "colName": "statistics_time",
                    "type": "by"
                },
                {
                  "colName": "statistics_time",
                  "type": "by_hour"
                },
                {
                    "colName": "num_of_calls",
                    "type": "sum"
                }
            ]
        }
        let path = this.getServiceUrl("select", 'srvlog_call_statistics_select', "log");
            axios.post(
                path, req10,
            ).then(res => {
                // console.log(res.data.data)
                let rowsArr=[]
                let rowsJson=''
                let datas = res.data.data
                for(let i=0;i<datas.length;i++){
                     rowsJson={'时间':(datas[i].statistics_time)+":00" ,'请求次数':(datas[i].num_of_calls)}
                     rowsArr.push(rowsJson)
                }
                // console.log(rowsArr)
                this.chartData.rows=rowsArr
            }).catch(err => {
                console.log(err)
            })
      },
      //当前时间计算
      nowTime(){
        var currentTime = //修改数据date
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate()  +
        " " +
        new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ":" +
        new Date().getSeconds();
        this.sData1=currentTime
        // console.log( this.sData1)

        // console.log((new Date(new Date().getTime() - 24 * 60 * 60 * 1000)))
        // console.log("哈哈"+new Data())
      },
      nowTimeMinus(){ //当前时间减去24小时
       var nowDataMinus =(new Date(new Date().getTime() - 24 * 60 * 60 * 1000))
      //  console.log(nowDataMinus)
       this.sData2=
         nowDataMinus.getFullYear() +
        "-" +
        (nowDataMinus.getMonth() + 1) +
        "-" +
        nowDataMinus.getDate()  +
        " " +
        nowDataMinus.getHours() +
        ":" +
        nowDataMinus.getMinutes() +
        ":" +
        nowDataMinus.getSeconds();
        // console.log( this.sData2)
      },
        //用户数
        getData_one() {
            let req1 = {
                "serviceName": "srvapprc_personal_basic_info_select",
                "colNames": ["*"],
                "condition": [        
                ],
                "group": [ { "colName": "birth_date", "type": "count" }]
            }
            let path = this.getServiceUrl("select", 'srvapprc_personal_basic_info_select', "apprc");
            axios.post(
                path, req1,
            ).then(res => {
                this.lineOne[0].value = res.data.data[0].birth_date       
                // console.log('11111111',res.data.data[0].birth_date)
            }).catch(err => {
                console.log(err)
            })
        },
        //应用个数
        getData_two() {
            let req2 = {
                "serviceName": "srvconfig_app_list_select",
                "colNames": ["*"],
                "condition": [         
                ],
                "group": [ { "colName": "app_class", "type": "count" }]

            }
            let path = this.getServiceUrl("select", 'srvconfig_app_list_select', "config");
            axios.post(
                path, req2,
            ).then(res => {
                this.lineOne[1].value = res.data.data[0].app_class        
                // console.log('2222',res.data.data[0].app_class  )
            }).catch(err => {
                console.log(err)
            })
        },
        //服务器个数
        getData_three() {
            let req3 = {
                "serviceName": "srvapprc_env_apply_select",
                "colNames": ["*"],
                "condition": [         
                ],
                "group": [ { "colName": "id", "type": "count" }]
            }
            let path = this.getServiceUrl("select", 'srvapprc_env_apply_select', "apprc");
            axios.post(
                path, req3,
            ).then(res => {
                this.lineOne[2].value = res.data.data[0].id     
                // console.log('3333',res.data.data[0].id)
            }).catch(err => {
                console.log(err)
            })
        },
        //累计服务次数
        getData_four() {
            let req4 = {
              "serviceName": "srvlog_call_statistics_select",
              "colNames": [
                  "*"
              ],
              "condition": [
                  {
                      "colName": "application",
                      "value": "apprc",
                      "ruleType": "eq"
                  }
              ],
              "group": [
                  {
                      "colName": "num_of_calls",
                      "type": "sum"
                  }
              ],
              
            }
               
            
            let path = this.getServiceUrl("select", 'srvlog_call_statistics_select', "log");
            axios.post(
                path, req4,
            ).then(res => {
                this.lineOne[3].value = res.data.data[0].num_of_calls  
                // console.log(44444,res.data.data[0].num_of_calls  )
            }).catch(err => {
                console.log(err)
            })
        },
        
        
        //工单个数
        getData_five() {
            let req5 = {
                "serviceName": "srvapprc_issue_info_select",
                "colNames": ["*"],
                "condition": [
                
                ],
                "group": [ { "colName": "id", "type": "count" }]

            }
            let path = this.getServiceUrl("select", 'srvapprc_issue_info_select', "apprc");
            axios.post(
                path, req5,
            ).then(res => {
                this.lineTwo[0].value = res.data.data[0].id
                // console.log('555555',res.data.data[0].id)
            }).catch(err => {
                console.log(err)
            })
        },
        //文档个数
        getData_six() {
            let req6 = {
                "serviceName": "srvapprc_dev_wendang_select",
                "colNames": ["*"],
                "condition": [               
                ],
                "group": [ { "colName": "id", "type": "count" }]
            }
            let path = this.getServiceUrl("select", 'srvapprc_dev_wendang_select', "apprc");
            axios.post(
                path, req6,
            ).then(res => {
                this.lineTwo[1].value = res.data.data[0].id
                // console.log('666666',res.data.data[0].id)
            }).catch(err => {
                console.log(err)
            })
        },
        //开发包个数
        getData_seven() {
            let req7 = {
                "serviceName": "srvapprc_kit_components_select",
                "colNames": ["*"],
                "condition": [
                
                ],
                "group": [ { "colName": "no", "type": "count" }]
            }
            let path = this.getServiceUrl("select", 'srvapprc_kit_components_select', "apprc");
            axios.post(
                path, req7,
            ).then(res => {
                this.lineTwo[2].value = res.data.data[0].no
                // console.log('777',res.data.data[0].no)
            }).catch(err => {
                console.log(err)
            })
        },
        //申请中应用
        getData_eight() {
            let req8 = {
                "serviceName": "srvapprc_application_apply_select",
                "colNames": ["*"],
                "condition": [
                ],
                "group": [ { "colName": "appid", "type": "count" }]

            }
            let path = this.getServiceUrl("select", 'srvapprc_application_apply_select', "apprc");
            axios.post(
                path, req8,
            ).then(res => {
                this.lineTwo[3].value = res.data.data[0].appid
                // console.log('88888',res.data.data[0].appid)
            }).catch(err => {
                console.log(err)
            })
        },
        //上线应用个数
        getData_nine() {
            let req9 = {
                "serviceName": "srvapprc_online_apply_select",
                "colNames": ["*"],
                "condition": [
                ],
                "group": [                
                    {
                        "colName": "appid",
                        "type": "count"
                    }
                ]
            }
            let path = this.getServiceUrl("select", 'srvapprc_online_apply_select', "apprc");
            axios.post(
                path, req9,
            ).then(res => {
                this.Automatically()
                this.lineTwo[4].value = res.data.data[0].appid
                // console.log('999999',res.data.data)
            }).catch(err => {
                console.log(err)
            })
        },
        //5s自动刷新
        Automatically(){
          setInterval(()=>{
               this.nowTime()
        this.getData_one()
        this.getData_two()
        this.getData_three()
        this.getData_four()
        this.getData_five()
        this.getData_six()
        this.getData_seven()
        this.getData_eight()
        this.getData_nine()
        this.nowTimeMinus()
        this.serverNum()
          },100000)
        }
       
    },

    created() {
        this.nowTime()
        this.getData_one()
        this.getData_two()
        this.getData_three()
        this.getData_four()
        this.getData_five()
        this.getData_six()
        this.getData_seven()
        this.getData_eight()
        this.getData_nine()
        this.nowTimeMinus()
        this.serverNum()
        //模拟数据
      
        // this.chartExtendLine = {
        //     grid: {
        //         top: '0',
        //         bottom: "0",
        //         height: "auto"
        //     },
        //     series: {
        //         center: ["50%", "50%"]
        //     }
        // }

        components: { VeLine }
    },
    destroyed() {
      clearInterval(this.Automatically);
  },
} 

</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
.content_two_title,.content_three_title {
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
.icon-view{
  list-style: none; 
}
.content_right_box {
  width: 100%;
  padding:10px;
  box-sizing:border-box;
  background-color:#fff;
}
.content_header {
  width: 100%;
}
.content_header>.icon-view {
  width: 100%;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content_header>.icon-view>.icon-view-item {
  width: 23%;
  display: flex;
  align-items: center;
  /* margin-right:1rem; */
  justify-content: space-around;
  border-radius: 10px;
}
.content_header>.icon-view>.icon-view-item-green {
  background-color: rgb(55, 221, 91);
}
.content_header>.icon-view>.icon-view-item-blue {
  background-color: rgb(11, 148, 240);
}
.content_header>.icon-view>.icon-view-item-orange {
  background-color: rgb(228, 209, 40);
}
.content_header>.icon-view>.icon-view-item-lGreen {
  background-color: rgb(137, 44, 243);
}
.content_header_divo {
  width: 50%;
  text-align: center;
}
.content_header_divt {
  width: 50%;
  padding-top: 20px;
  color:#fff;
}
.content_header_divo>span {
  width: 100%;
}
.content_header_divo>i {
  font-size: 80px;
  color:#fff;
}
.content_header_divt>span {
  display: block;
  text-align: center;
}
.content_header_divt>span:nth-of-type(2) {
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
  margin-top: 10px;
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
.content_two_boxone>span {
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
.content_two_boxtwo>span {
  width: 100%;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  border-right: 1px solid #cccccc;
}
.content_two_box:last-child .content_two_boxtwo>span{
  border-right-width: 0;
}
.content_two_boxtwo>span:nth-of-type(5) {
  border-right: none !important;
}
/* content_three */
.content_three {
  width: 100%;
  /* margin-top: 20px; */
}
.content_three>p {
  width: 100%;
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #cccccc;
    font-weight: bolder;
}
.content_three_box {
  width: 100%;
  height:280px;
}


 /* 1366*769 */
@media screen and (max-width: 1366px) {
  .content_two_title,.content_three_title {
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
  .icon-view{
    list-style: none; 
  }
  .content_right_box {
    width: 100%;
    padding:10px;
    box-sizing:border-box;
    background-color:#fff;
  }
  .content_header {
    width: 100%;
  }
  .content_header>.icon-view {
    width: 100%;
    padding: 5px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content_header>.icon-view>.icon-view-item {
    width: 23%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
  }
  .content_header>.icon-view>.icon-view-item-green {
    background-color: rgb(55, 221, 91);
  }
  .content_header>.icon-view>.icon-view-item-blue {
    background-color: rgb(11, 148, 240);
  }
  .content_header>.icon-view>.icon-view-item-orange {
    background-color: rgb(219, 206, 83);
  }
  .content_header>.icon-view>.icon-view-item-lGreen {
    background-color: rgb(137, 44, 243);
  }
  .content_header_divo {
    width: 50%;
    text-align: center;
  }
  .content_header_divt {
    width: 50%;
    padding-top: 10px;
    color:#fff;
  }
  .content_header_divo>span {
    width: 100%;
  }
  .content_header_divo>i {
    font-size: 60px;
    color:#fff;
  }
  .content_header_divt>span {
    display: block;
    text-align: center;
  }
  .content_header_divt>span:nth-of-type(2) {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 30px;
  }
  /* content_two */
  .content_two {
  width: 100%;
  /* margin-top: 20px; */
  display: flex;
  }
  .content_two_box {
    margin-top: 5px;
    width: 20%;
  }
  .content_two_boxone {
    width: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: baseline;
    margin-bottom: 5px;
  }
  .content_two_boxone>span {
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
    margin-bottom: 20px;
  }
  .content_two_boxtwo>span {
    width: 100%;
    text-align: center;
    padding-top: 20px;
    padding-bottom: 20px;
    border-right: 1px solid rgb(235, 232, 232);
  }
  .content_two_box:last-child .content_two_boxtwo>span{
    border-right-width: 0;
  }
  .content_two_boxtwo>span:nth-of-type(5) {
    border-right: none !important;
  }
  /* content_three */
  .content_three {
    width: 100%;
  }
  .content_three_box {
    width: 100%;
    height:300px;
  }
}
</style>
