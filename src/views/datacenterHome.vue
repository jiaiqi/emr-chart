<template>
<!-- 数据中心 -->
<div class="home">
    <div class="content_right_box">
        <div class="content_header">
            <div class="icon-view">
                <div id="currey" @click="homeHref(item.title)" :class="item.classStyle" v-for="(item,index) in lineOne" :key="index">
                    <div class="content_header_divo">
                        <i :class="item.icon"></i>
                    </div>
                    <div class="content_header_divt">
                        <span>{{item.title}}</span>
                        <span>{{item.value === null ? '-' : (item.value)>10000?(Math.round((item.value)/10000)+'万'):(item.value)}}</span>
                    </div>
                </div>   
            </div>
        </div>
        <div class="content_two_title"><span>ETL统计</span></div>
        <div class="content_two">
        <div id="currey" @click="development(item.title)" class="content_two_box" v-for="(item,index) in lineTwo" :key="index">
            <div class="content_two_boxone">       
                <span>{{item.title}}</span>
            </div>
            <div class="content_two_boxtwo">
                <span>{{item.value === null ? '-' : (item.value)>10000?(Math.round((item.value)/10000)+'万'):(item.value)}}</span>
            </div>
          </div>
        </div>
        </div>
        <div class="content_three_title">总共享次数</div>
        <div class="content_three">
        <div class="content_three_box">
            <ve-line 
            :data="chartData" 
            :settings="chartSettings"          
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
        this.chartSettings = {
            metrics: ['总共享次数','时间'],
            dimension: ['时间']
        }
        return {
            lineOne:[
            {
                "title":'数据库个数',
                "value":0,
                "icon":'fa fa-calculator',
                "classStyle":'icon-view-item icon-view-item-orange'
            },{
                "title":'表个数',
                "value":0,
                "icon":'fa fa-file-word-o',
                "classStyle":'icon-view-item icon-view-item-green'
            },{
                "title":'记录数',
                "value":0,
                "icon":'fa fa-calendar',
                "classStyle":'icon-view-item icon-view-item-blue'
            }
            ,{
                "title":'共享表个数',
                "value":0,
                "icon":'fa fa-file-pdf-o',
                "classStyle":'icon-view-item icon-view-item-lGreen'
            }
            ],
            lineTwo: [
                {
                "title":'作业数',
                "value":0,
                },
                {
                "title":'执行次数',
                "value":0,
                },
                {
                "title":'抽取记录数',
                "value":0,               
                },
                {
                "title":'加载表个数',
                "value":0,                
                },
                {
                "title":'加载记录数',
                "value":0,
                },
            ],
            chartData: {
                columns: ['时间', '总共享次数'],
                rows: [
                {
                    "总共享次数":100,
                    "时间":"17点"
                } 
                ]
            },
        }
    },
    methods: {
        getCollectData(timeData, type) {
        let yVal = ""
        let rows = []
        if (type === 'day') {
            let hours = []
            for (let i = 1; i <= 24; i++) {
              hours.push(moment().subtract(24 - i, 'hours').format("HH"))
            }
            yVal = hours
        } 
        // console.log("yVal",yVal)
        let hosiptalArr = ["时间", "总共享次数"]
        yVal.map(hour => {
            let dataMap = {
            "时间": 0,
            "总共享次数": 0
            }
            if (type === "day") {
                if (hour < 10) {
                    dataMap.时间 = hour.slice(1, 2) + "点"
                } else {
                    dataMap.时间 = hour + "点"
                }
                hosiptalArr.map(hospital => {
                    let count = 0
                    timeData.map(dataItem => {
                    if (hospital == '总共享次数' && dataItem.create_time.slice(11, 13) == hour) {
                        count += dataItem.invoke_success_count
                        // console.log("count",count)
                        dataMap[hospital] = count
                    }
                    })
                })
            }
            rows.push(dataMap)
        })
        // this.hospitaldata.rows = rows
            return rows
        },

        homeHref(item){
      if(item=="数据库个数"){
        let page = {
        title: item,
        url: '/vpages/index.html#/list/srvdc_rc_db_select?menuapp=datacenter',
        icon: ""
      };
      window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/list/srvdc_rc_db_select?menuapp=datacenter'
      }else if(item=="表个数"){
        let page = {
        title: item,
        url: '/vpages/index.html#/list/srvdc_rc_db_table_select?menuapp=datacenter',
        icon: ""
      };
      window.top.tab.addTab(page);
      //  window.location.href = '/vpages/index.html#/list/srvdc_rc_db_table_select?menuapp=datacenter'
      }else if(item=="记录数"){
        let page = {
        title: item,
        url: '/vpages/index.html#/list/srvdc_rc_db_table_select?menuapp=datacenter',
        icon: ""
      };
      window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/list/srvdc_rc_db_table_select?menuapp=datacenter'
      }
    },
    development(item){
      if(item=="作业数"){
        let page = {
        title: item,
        url: '/vpages/index.html#/list/srvetl_job_select?menuapp=etl',
        icon: ""
      };
      window.top.tab.addTab(page);
        // window.location.href = '/vpages/index.html#/list/srvetl_job_select?menuapp=etl'
      }else if(item=="执行次数"){
        let page = {
        title: item,
        url: '/vpages/index.html#/list/srvetl_job_history_select?menuapp=etl',
        icon: ""
      };
      window.top.tab.addTab(page);
      //  window.location.href = '/vpages/index.html#/list/srvetl_job_history_select?menuapp=etl'
      }else if(item=="抽取记录数"){
        let page = {
        title: item,
        url: '/vpages/index.html#/list/srvetl_processor_history_select?menuapp=etl',
        icon: ""
      };
      window.top.tab.addTab(page);
      //  window.location.href = '/vpages/index.html#/list/srvetl_processor_history_select?menuapp=etl'

      }else if(item=="加载表个数"){
        let page = {
        title: item,
        url: '/vpages/index.html#/list/srvetl_processor_history_select?menuapp=etl',
        icon: ""
      };
      window.top.tab.addTab(page);
      // window.location.href = '/vpages/index.html#/list/srvetl_processor_history_select?menuapp=etl'
      }else if(item=="加载记录数"){
        let page = {
        title: item,
        url: '/vpages/index.html#/list/srvetl_processor_history_select?menuapp=etl',
        icon: ""
      };
      window.top.tab.addTab(page);
        //  window.location.href = '/vpages/index.html#/list/srvetl_processor_history_select?menuapp=etl'
      }
    },
        //数据库个数
        getData_one() {
            let req1 = {
                "serviceName": "srvdc_rc_db_select",
                "colNames": ["*"],
                "condition": [         
                ],
                "group": [ { "colName": "id", "type": "count" }]
            }
            let path = this.getServiceUrl("select", 'srvdc_rc_db_select', "datacenter");
            axios.post(
                path, req1,
            ).then(res => {
                this.lineOne[0].value = res.data.data[0].id        
                // console.log('11111111',res.data.data[0].id)
            }).catch(err => {
                console.log(err)
            })
        },
        //表个数
        getData_two() {
            let req2 = {
                "serviceName": "srvdc_rc_db_table_select",
                "colNames": ["*"],
                "condition": [         
                ],
                "group": [ { "colName": "id", "type": "count" }]

            }
            let path = this.getServiceUrl("select", 'srvdc_rc_db_table_select', "datacenter");
            axios.post(
                path, req2,
            ).then(res => {
                this.lineOne[1].value = res.data.data[0].id      
                // console.log('222',res.data.data[0].id)
            }).catch(err => {
                console.log(err)
            })
        },
        //记录数
        getData_three() {
            let req3 = {
                "serviceName": "srvdc_rc_db_table_select",
                "colNames": ["*"],
                "condition": [         
                ],
                "group": [                
                    {
                        "colName": "row_count",
                        "type": "sum"
                    },
                ]
            }
            let path = this.getServiceUrl("select", 'srvdc_rc_db_table_select', "datacenter");
            axios.post(
                path, req3,
            ).then(res => {
                this.lineOne[2].value = res.data.data[0].row_count
                console.log('333',res.data.data)
            }).catch(err => {
                console.log(err)
            })
        },
        //共享表个数
        getData_four() {
            let req4 = {
                "serviceName": "srvdc_share_serve_summary_select",
                "colNames": ["*"],
                "condition": [         
                ],
                "group": [                
                    {
                        "colName": "id",
                        "type": "count"
                    },

                ]
            }
            let path = this.getServiceUrl("select", 'srvdc_share_serve_summary_select', "datashare");
            axios.post(
                path, req4,
            ).then(res => {
                this.lineOne[3].value = res.data.data[0].id    
                // console.log('444',res.data.data[0].id)
            }).catch(err => {
                console.log(err)
            })
        },
        //作业数
        getData_five() {
            let req5 = {
                "serviceName": "srvetl_job_select",
                "colNames": ["*"],
                "condition": [         
                ],
                "group": [ { "colName": "state", "type": "count" }]

            }
            let path = this.getServiceUrl("select", 'srvetl_job_select', "etl");
            axios.post(
                path, req5,
            ).then(res => {
                this.lineTwo[0].value = res.data.data[0].state       
                // console.log('5555',res.data.data[0].state)
            }).catch(err => {
                console.log(err)
            })
        },
        //执行次数
        getData_six() {
            let req6 = {
                "serviceName": "srvetl_job_history_select",
                "colNames": ["*"],
                "condition": [         
                ],
                "group": [ { "colName": "id", "type": "count" }]
            }
            let path = this.getServiceUrl("select", 'srvetl_job_history_select', "etl");
            axios.post(
                path, req6,
            ).then(res => {
                this.lineTwo[1].value = res.data.data[0].id       
                // console.log('6666666',res)
            }).catch(err => {
                console.log(err)
            })
        },
        //抽取记录数
        getData_seven() {
            let req7 = {
                "serviceName": "srvetl_processor_history_select",
                "colNames": ["*"],
                "condition": [
                    {
                    colName:'Processor_type',
                    ruleType:'eq',
                    value:'extractor-db'
                    },
                ],
                "group": [                
                    {
                        "colName": "ok_records_count",
                        "type": "sum"
                    },
                ]
            }
            let path = this.getServiceUrl("select", 'srvetl_processor_history_select', "etl");
            axios.post(
                path, req7,
            ).then(res => {
                this.lineTwo[2].value = res.data.data[0].ok_records_count     
                // console.log('7777',res.data.data)
            }).catch(err => {
                console.log(err)
            })
        },
        //加载表个数
        getData_eight() {
            let req8 = {
                "serviceName": "srvetl_processor_history_select",
                "colNames": ["*"],
                "condition": [
                    {
                    colName:'Processor_type',
                    ruleType:'eq',
                    value:'loader-db'
                    }         
                ],
                "group": [                
                    {
                        "colName": "dst_table_name",
                        "type": "count"
                    }
                ]
            }
            let path = this.getServiceUrl("select", 'srvetl_processor_history_select', "etl");
            axios.post(
                path, req8,
            ).then(res => {
                this.lineTwo[3].value = res.data.data[0].dst_table_name    
                // console.log('888',res.data.data)
            }).catch(err => {   
                console.log(err)
            })
        },
        //加载记录数
        getData_nine() {
            let req9 = {
                "serviceName": "srvetl_processor_history_select",
                "colNames": ["*"],
                "condition": [
                    {
                    colName:'Processor_type',
                    ruleType:'eq',
                    value:'loader-db'
                    }         
                ],
                "group": [                
                    {
                        "colName": "ok_records_count",
                        "type": "count"
                    }
                ]

            }
            let path = this.getServiceUrl("select", 'srvetl_processor_history_select', "etl");
            axios.post(
                path, req9,
            ).then(res => {
                this.lineTwo[4].value = res.data.data[0].ok_records_count      
                // console.log('999',res.data.data)
            }).catch(err => {
                console.log(err)
            })
        },
        //总共享次数
        getData_ten() {
            let dates = new Date()
            let time = moment().format('YYYY-MM-DD')
            // console.log("time",time)
            let req = {
                "serviceName": "srvdc_share_serve_summary_select",
                "colNames": ["*"],
                "condition": [
                    {
                    "colName": "create_time",
                    // "value": this.timeHorizon.today,
                    "value": moment().format("YYYY-MM-DD HH:mm:ss"),
                    "ruleType": "le"
                    },
                    {
                    "colName": "create_time",
                    // "value": this.timeHorizon.today,
                    "value": moment().subtract(23, 'hours').format("YYYY-MM-DD HH:mm:ss"),
                    "ruleType": "ge"
                    }
                ],
                "group": [                
                    {
                        "colName": "invoke_success_count",
                        "type": "sum"
                    },{
                        "colName": "create_time",
                        "type": "by"
                    }
                ]
            }
            let path = this.getServiceUrl("select", 'srvdc_share_serve_summary_select', "datashare");
            axios.post(
                path, req,
            ).then(res => {
              console.log(res)
                // this.chartData =  res.data.data[0].invoke_success_count
                this.chartData.rows = this.getCollectData(res.data.data,'day')
                console.log('999',res.data)
            }).catch(err => {
                console.log(err)
            })
        },
         Automatically(){
          setInterval(()=>{
              this.getData_one()
        this.getData_two()
        this.getData_three()
        this.getData_four()
        this.getData_five()
        this.getData_six()
        this.getData_seven()
        this.getData_eight()
        this.getData_nine() 
        this.getData_ten()
          },50000)
    },
    },
    created() {
        this.getData_one()
        this.getData_two()
        this.getData_three()
        this.getData_four()
        this.getData_five()
        this.getData_six()
        this.getData_seven()
        this.getData_eight()
        this.getData_nine() 
        this.getData_ten()
        // this.Automatically()
    },
     destroyed() {
      clearInterval(this.Automatically);
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
    padding-top: 20px;
    color:#fff;
  }
  .content_header_divo>span {
    width: 100%;
  }
  .content_header_divo>i {
    font-size: 70px;
    color:#fff;
  }
  .content_header_divt>span {
    display: block;
    text-align: center;
  }
  .content_header_divt>span:nth-of-type(2) {
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
    margin-bottom: 30px;
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
}


</style>