<template>
  <div class="wrap-data">
    <view-title :titleViewData="titleViewData"></view-title>
    <div class="main">
      <view-tabs @viewtabs="viewtabs" :tabsData="tabsData"></view-tabs>
      <top-indicator :indicatorData="indicatorData" :current="titleViewData"></top-indicator>
      <time-type @showTimeType="getTimeType" v-if="contentData.currentPage !== 'DataMonitor'"></time-type>
      <data-monitor v-if="contentData.currentPage === 'DataMonitor'"></data-monitor>
      <onecard-content
        v-else
        @checktask="checktask"
        :chartSetting="contentData.firstBar.set"
        :contentData="contentData"
      ></onecard-content>
    </div>
  </div>
</template>

<script>
let moment = require("moment");
import ViewTitle from "@/components/ViewTitle";
import ViewTabs from "@/components/ViewTabs";
import TimeType from "@/components/TimeType";
import OnecardContent from "@/components/OnecardContent";
import DataShare from "../components/DataShare";
import EtlTask from "../components/EtlTask";
import TopIndicator from "../components/TopIndicator";
import DataMonitor from "../components/DataMonitor";
export default {
  components: {
    DataShare,
    EtlTask,
    ViewTitle,
    ViewTabs,
    TimeType,
    OnecardContent,
    DataMonitor,
    TopIndicator
  },
  data() {
    return {
      ReqTimeOut:{
        RunTimeOut:null,
        dataSizeTimeOut:null,
        DataShareSizeTimeOut:null,
        DataShareRecodTimeOut:null,
        leftChartLegendTimeOut:null,
        RightTaskTimeOut:null
      },
      titleViewData: {
        title: "数据中心",
        date: "",
        currentPage: "datacenter"
      },
      tabsData: {
        tabs: [
          {
            key: "dataShare",
            value: "数据资源"
          },
          {
            key: "ETL",
            value: "ETL"
          },
          {
            key: "DataMonitor",
            value: "数据库监控"
          }
        ],
        runTime: ""
      },
      contentData: {
        currentPage: 'dataShare',
        firstBar: {
          title: "数据共享",
          data: {
            columns: [],
            rows: []
          },
          set:{            
            stack: { '用户': ['访问用户', '下单用户'] },
            type:null  
          }
        },
        secondBar: {
          title: "数据资源",
          data: {
            columns: [],
            rows: []
          },
          tableData:{
            title:[],
            step:[],
            taskNo:'',
            GanttData:[]
          },
          set:{
            series:{
              type:null
            },
            axisSite: { right: ["占用空间"] },
            yAxisType: ["normal", "normal"],
            yAxisName: ["数值", "占用空间"],
            max: [1300, 2600],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function(c) {
                    return JSON.stringify(c.data);
                  }
                }
              }
            }
          },
          interval:''
        },
        firstPie: {
          title: "数据共享比例",
          data: {
            columns: ["医院", "访问用户"],
            rows: []
          }
        },
        secondPie: {
          title: "数据共享用户资源",
          data: {
            columns: ["卡类型", "访问用户"],
            rows: []
          }
        }
      },
      countData: [
        {
          key: "累计运行时间",
          val: "3天"
        },
        {
          key: "数据量(表/记录)",
          val: "3682/225万"
        },
        {
          key: "共享数据量(表/记录)",
          val: "3/560"
        },
        {
          key: "数据共享次数",
          val: "3"
        },
        {
          key: "ETL数据量(表/记录)",
          val: "321.5万"
        }
      ],
      indicatorData: {
        runtime: "",
        dataSize: {},
        dataShareSize: {
          listNum: "",
          record: "",
          shareNum: ""
        },
        EtlSize: {
          listNum: "",
          record: ""
        }
      },
      checkDataType: "day",
      data01: {
        "day": {
          columns: ['时间', '表1', '表2', '表3', '表4', '表5'],
          rows: [
            { 时间: '00:00', 表1: 5101, 表2: 2158, 表3: 1254, 表4: 1230, 表5: 0.45 },
            { 时间: '01:00', 表1: 3654, 表2: 5351, 表3: 2395, 表4: 1158, 表5: 0.32 },
            { 时间: '02:00', 表1: 1215, 表2: 3632, 表3: 1548, 表4: 3423, 表5: 0.21 },
            { 时间: '03:00', 表1: 2364, 表2: 1254, 表3: 1659, 表4: 2123, 表5: 0.11 },
            { 时间: '04:00', 表1: 2014, 表2: 1423, 表3: 1423, 表4: 1423, 表5: 0.49 },
            { 时间: '05:00', 表1: 4975, 表2: 3492, 表3: 3492, 表4: 3492, 表5: 0.323 },
            { 时间: '06:00', 表1: 4568, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '07:00', 表1: 3065, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '08:00', 表1: 2589, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '09:00', 表1: 4593, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '10:00', 表1: 5547, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '11:00', 表1: 714, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '12:00', 表1: 6520, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '13:00', 表1: 987, 表2: 1093, 表3: 1093, 表4: 1093, 表5: 0.32 },
            { 时间: '14:00', 表1: 1982, 表2: 3230, 表3: 3230, 表4: 3230, 表5: 0.26 },
            { 时间: '15:00', 表1: 2923, 表2: 2623, 表3: 2623, 表4: 2623, 表5: 0.76 },
            { 时间: '16:00', 表1: 2456, 表2: 1423, 表3: 1423, 表4: 1423, 表5: 0.49 },
            { 时间: '17:00', 表1: 3792, 表2: 3492, 表3: 3492, 表4: 3492, 表5: 0.323 },
            { 时间: '18:00', 表1: 1514, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '19:00', 表1: 2436, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '20:00', 表1: 4125, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '21:00', 表1: 3201, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '22:00', 表1: 2514, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '23:00', 表1: 1026, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 }
          ]
        },
        "week": {
          columns: ['时间', '表1', '表2', '表3', '表4', '表5'],
          rows: [
            { 时间: '周一', 表1: 1234, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '周二', 表1: 5851, 表2: 1093, 表3: 1093, 表4: 1093, 表5: 0.32 },
            { 时间: '周三', 表1: 4567, 表2: 3230, 表3: 3230, 表4: 3230, 表5: 0.26 },
            { 时间: '周四', 表1: 4521, 表2: 2623, 表3: 2623, 表4: 2623, 表5: 0.76 },
            { 时间: '周五', 表1: 2014, 表2: 1423, 表3: 1423, 表4: 1423, 表5: 0.49 },
            { 时间: '周六', 表1: 4975, 表2: 3492, 表3: 3492, 表4: 3492, 表5: 0.323 },
            { 时间: '周日', 表1: 4568, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 }
          ]
        },
        "month": {
          columns: ['时间', '表1', '表2', '表3', '表4', '表5'],
          rows: [
            { 时间: '1号', 表1: 1234, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '2号', 表1: 5851, 表2: 1093, 表3: 1093, 表4: 1093, 表5: 0.32 },
            { 时间: '3号', 表1: 4567, 表2: 3230, 表3: 3230, 表4: 3230, 表5: 0.26 },
            { 时间: '4号', 表1: 4521, 表2: 2623, 表3: 2623, 表4: 2623, 表5: 0.76 },
            { 时间: '5号', 表1: 2014, 表2: 1423, 表3: 1423, 表4: 1423, 表5: 0.49 },
            { 时间: '6号', 表1: 4975, 表2: 3492, 表3: 3492, 表4: 3492, 表5: 0.323 },
            { 时间: '7号', 表1: 4568, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '8号', 表1: 3065, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '9号', 表1: 2589, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '10号', 表1: 4593, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '11号', 表1: 5547, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '12号', 表1: 714, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '13号', 表1: 6520, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '14号', 表1: 987, 表2: 1093, 表3: 1093, 表4: 1093, 表5: 0.32 },
            { 时间: '15号', 表1: 1982, 表2: 3230, 表3: 3230, 表4: 3230, 表5: 0.26 },
            { 时间: '16号', 表1: 2923, 表2: 2623, 表3: 2623, 表4: 2623, 表5: 0.76 },
            { 时间: '17号', 表1: 2456, 表2: 1423, 表3: 1423, 表4: 1423, 表5: 0.49 },
            { 时间: '18号', 表1: 3792, 表2: 3492, 表3: 3492, 表4: 3492, 表5: 0.323 },
            { 时间: '19号', 表1: 1514, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '20号', 表1: 2436, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '21号', 表1: 4125, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '22号', 表1: 3201, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '23号', 表1: 2514, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '24号', 表1: 1026, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '25号', 表1: 1234, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '26号', 表1: 5851, 表2: 1093, 表3: 1093, 表4: 1093, 表5: 0.32 },
            { 时间: '27号', 表1: 4567, 表2: 3230, 表3: 3230, 表4: 3230, 表5: 0.26 },
            { 时间: '28号', 表1: 4521, 表2: 2623, 表3: 2623, 表4: 2623, 表5: 0.76 },
            { 时间: '29号', 表1: 2014, 表2: 1423, 表3: 1423, 表4: 1423, 表5: 0.49 },
            { 时间: '30号', 表1: 4975, 表2: 3492, 表3: 3492, 表4: 3492, 表5: 0.323 }
          ]
        },
        "year": {
          columns: ['时间', '表1', '表2', '表3', '表4', '表5'],
          rows: [
            { 时间: '1月', 表1: 1234, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '2月', 表1: 5851, 表2: 1093, 表3: 1093, 表4: 1093, 表5: 0.32 },
            { 时间: '3月', 表1: 4567, 表2: 3230, 表3: 3230, 表4: 3230, 表5: 0.26 },
            { 时间: '4月', 表1: 4521, 表2: 2623, 表3: 2623, 表4: 2623, 表5: 0.76 },
            { 时间: '5月', 表1: 2014, 表2: 1423, 表3: 1423, 表4: 1423, 表5: 0.49 },
            { 时间: '6月', 表1: 4975, 表2: 3492, 表3: 3492, 表4: 3492, 表5: 0.323 },
            { 时间: '7月', 表1: 4568, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '8月', 表1: 3065, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '9月', 表1: 2589, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '10月', 表1: 4593, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '11月', 表1: 5547, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 },
            { 时间: '12月', 表1: 714, 表2: 4293, 表3: 4293, 表4: 4293, 表5: 0.78 }
          ]
        }
      },
      data02: {
        day: {
          columns: ["医院", "访问用户"],
          rows: [
            { 医院: "表1", 访问用户: 154 },
            { 医院: "表2", 访问用户: 33 },
            { 医院: "表3", 访问用户: 75 },
            { 医院: "表4", 访问用户: 27 },
            { 医院: "其他", 访问用户: 19 }
          ]
        },
        week: {
          columns: ["医院", "访问用户"],
          rows: [
            { 医院: "表1", 访问用户: 515 },
            { 医院: "表2", 访问用户: 365 },
            { 医院: "表3", 访问用户: 245 },
            { 医院: "表4", 访问用户: 147 },
            { 医院: "其他", 访问用户: 19 }
          ]
        },
        month: {
          columns: ["医院", "访问用户"],
          rows: [
            { 医院: "表1", 访问用户: 2564 },
            { 医院: "表2", 访问用户: 1859 },
            { 医院: "表3", 访问用户: 1574 },
            { 医院: "表4", 访问用户: 982 },
            { 医院: "其他", 访问用户: 19 }
          ]
        },
        year: {
          columns: ["医院", "访问用户"],
          rows: [
            { 医院: "表1", 访问用户: 15789 },
            { 医院: "表2", 访问用户: 12658 },
            { 医院: "表3", 访问用户: 6598 },
            { 医院: "表4", 访问用户: 9852 },
            { 医院: "其他", 访问用户: 19 }
          ]
        },
      },
      data03: {
        day: {
          columns: ["卡类型", "访问用户"],
          rows: [
            { 卡类型: "用户1", 访问用户: 235 },
            { 卡类型: "用户2", 访问用户: 23 },
            { 卡类型: "用户3", 访问用户: 223 },
            { 卡类型: "用户4", 访问用户: 53 },
            { 卡类型: "其他", 访问用户: 83 },
          ]
        },
        week: {
          columns: ["卡类型", "访问用户"],
          rows: [
            { 卡类型: "用户1", 访问用户: 35 },
            { 卡类型: "用户2", 访问用户: 43 },
            { 卡类型: "用户3", 访问用户: 93 },
            { 卡类型: "用户4", 访问用户: 23 },
            { 卡类型: "其他", 访问用户: 53 },
          ]
        },
        month: {
          columns: ["卡类型", "访问用户"],
          rows: [
            { 卡类型: "用户1", 访问用户: 235 },
            { 卡类型: "用户2", 访问用户: 43 },
            { 卡类型: "用户3", 访问用户: 13 },
            { 卡类型: "用户4", 访问用户: 93 },
            { 卡类型: "其他", 访问用户: 53 },
          ]
        },
        year: {
          columns: ["卡类型", "访问用户"],
          rows: [
            { 卡类型: "用户1", 访问用户: 235 },
            { 卡类型: "用户2", 访问用户: 73 },
            { 卡类型: "用户3", 访问用户: 23 },
            { 卡类型: "用户4", 访问用户: 93 },
            { 卡类型: "其他", 访问用户: 113 },
          ]
        }
      },
    };
    // title: '',
    //   tabsData: [{
    //     key: '',
    //     val: ''
    //   }, {
    //     key: '',
    //     val: ''
    //   }{
    //     key: '',
    //     val: ''
    //   }{
    //     key: '',
    //     val: ''
    //   }],
    //     timeData: [{
    //       key: '',
    //       val: ''
    //     }, {
    //       key: '',
    //       val: ''
    //     }],
    //       sTime: '',
    //         eTime: '',
    //           tabSelected：0
    // this.pieSetting = {
    //   radius: 80,
    //   offsetY: 160
    // };
    // this.pieSetting3 = {
    //   radius: 50,
    //   offsetY: 120
    // };

    // return {
    //   runtime:{},
    //   tabeNo:[],
    //   deploy:[],
    //   headerFirst: {

    //   },
    //   headerSecond: {
    //     sheetNum: '',
    //     sheetLog: ''
    //   },
    //   dataShare:{},
    //   headerThird: {
    //     sheetNum: '',
    //     sheetLog: ''
    //   },
    //   headerFour: {
    //     sheetNum: '',
    //     sheetLog: ''
    //   },
    //   xItemValue: null,
    //   tabsShow: 1,
    //   showComponent: DataShare,
    //   user: {
    //     user_no: ''
    //   },
    //   date: null,
    //   timeHorizon: {},
    //   today: "",
    //   checkDataType: "day",
    //   legend: {
    //     textStyle: {
    //       color: "#fff"
    //     }
    //   },
    //   pieUser: {},
    //   pieData: {},
    //   rightData: {},
    //   chartSetting1: {
    //     stack: {
    //       用户: [
    //         "市人民医院",
    //         "中医医院",
    //         "博爱医院",
    //         "妇幼医院",
    //         "市中医医院",
    //         "市妇幼医院",
    //         "挂号",
    //         "住院"
    //       ]
    //     }
    //   },
    //   swiperOptionTop: {
    //     watchSlidesProgress: true,
    //     watchSlidesVisibility: true,
    //     loopedSlides: 5,
    //     autoplay: {
    //       delay: 5000,
    //       disableOnInteraction: false
    //     },
    //     pagination: {
    //       el: ".swiper-pagination",
    //       clickable: true,
    //       renderBullet(index, className) {
    //         let hospital_name = [
    //           "博爱医院",
    //           "市中医医院",
    //           "市人民医院",
    //           "市妇幼医院"
    //         ];
    //         return `<span class="${className} swiper-pagination-bullet-custom">${hospital_name[index]}</span>`;
    //       }
    //     }
    //   },
    //   chartData01: {
    //     columns: ['时间'],
    //     rows: []
    //   },
     
    //   data02: {
    //     day: {
    //       columns: ["医院", "访问用户"],
    //       rows: [
    //         { 医院: "表1", 访问用户: 154 },
    //         { 医院: "表2", 访问用户: 33 },
    //         { 医院: "表3", 访问用户: 75 },
    //         { 医院: "表4", 访问用户: 27 },
    //         { 医院: "其他", 访问用户: 19 }
    //       ]
    //     },
    //     week: {
    //       columns: ["医院", "访问用户"],
    //       rows: [
    //         { 医院: "表1", 访问用户: 515 },
    //         { 医院: "表2", 访问用户: 365 },
    //         { 医院: "表3", 访问用户: 245 },
    //         { 医院: "表4", 访问用户: 147 },
    //         { 医院: "其他", 访问用户: 19 }
    //       ]
    //     },
    //     month: {
    //       columns: ["医院", "访问用户"],
    //       rows: [
    //         { 医院: "表1", 访问用户: 2564 },
    //         { 医院: "表2", 访问用户: 1859 },
    //         { 医院: "表3", 访问用户: 1574 },
    //         { 医院: "表4", 访问用户: 982 },
    //         { 医院: "其他", 访问用户: 19 }
    //       ]
    //     },
    //     year: {
    //       columns: ["医院", "访问用户"],
    //       rows: [
    //         { 医院: "表1", 访问用户: 15789 },
    //         { 医院: "表2", 访问用户: 12658 },
    //         { 医院: "表3", 访问用户: 6598 },
    //         { 医院: "表4", 访问用户: 9852 },
    //         { 医院: "其他", 访问用户: 19 }
    //       ]
    //     },
    //   },
    //   pieData1: {
    //     hospital: {},
    //     card: {}
    //   },
    //   chartData02: {
    //     hos1: {},
    //     hos2: {},
    //     hos3: {},
    //     hos4: {},
    //     hos5: {}
    //   },
    //   bardata: {
    //     hos1: {},
    //     hos2: {},
    //     hos3: {},
    //     hos4: {},
    //     hos5: {}
    //   },
    //   distribute: {},

    //   data03: {
    //     day: {
    //       columns: ["卡类型", "访问用户"],
    //       rows: [
    //         { 卡类型: "用户1", 访问用户: 235 },
    //         { 卡类型: "用户2", 访问用户: 23 },
    //         { 卡类型: "用户3", 访问用户: 223 },
    //         { 卡类型: "用户4", 访问用户: 53 },
    //         { 卡类型: "其他", 访问用户: 83 },
    //       ]
    //     },
    //     week: {
    //       columns: ["卡类型", "访问用户"],
    //       rows: [
    //         { 卡类型: "用户1", 访问用户: 35 },
    //         { 卡类型: "用户2", 访问用户: 43 },
    //         { 卡类型: "用户3", 访问用户: 93 },
    //         { 卡类型: "用户4", 访问用户: 23 },
    //         { 卡类型: "其他", 访问用户: 53 },
    //       ]
    //     },
    //     month: {
    //       columns: ["卡类型", "访问用户"],
    //       rows: [
    //         { 卡类型: "用户1", 访问用户: 235 },
    //         { 卡类型: "用户2", 访问用户: 43 },
    //         { 卡类型: "用户3", 访问用户: 13 },
    //         { 卡类型: "用户4", 访问用户: 93 },
    //         { 卡类型: "其他", 访问用户: 53 },
    //       ]
    //     },
    //     year: {
    //       columns: ["卡类型", "访问用户"],
    //       rows: [
    //         { 卡类型: "用户1", 访问用户: 235 },
    //         { 卡类型: "用户2", 访问用户: 73 },
    //         { 卡类型: "用户3", 访问用户: 23 },
    //         { 卡类型: "用户4", 访问用户: 93 },
    //         { 卡类型: "其他", 访问用户: 113 },
    //       ]
    //     }
    //   },
    //   data04: {
    //     day: {
    //       columns: ["表", "数据量", "占用空间"],
    //       rows: [
    //         { 表: "表1", 数据量: 51, 占用空间: 0.22 },
    //         { 表: "表2", 数据量: 403, 占用空间: 0.15 },
    //         { 表: "表3", 数据量: 421, 占用空间: 0.52 },
    //         { 表: "表4", 数据量: 311, 占用空间: 0.12 },
    //         { 表: "表5", 数据量: 512, 占用空间: 0.12 }
    //       ]
    //     },
    //     week: {
    //       columns: ["表", "数据量", "占用空间"],
    //       rows: [
    //         { 表: "表1", 数据量: 50, 占用空间: 0.26},
    //         { 表: "表2", 数据量: 423, 占用空间: 0.16},
    //         { 表: "表3", 数据量: 451, 占用空间: 0.52},
    //         { 表: "表4", 数据量: 356, 占用空间: 0.14},
    //         { 表: "表5", 数据量: 557, 占用空间: 0.14}
    //       ]
    //     },
    //     month: {
    //       columns: ["表", "数据量", "占用空间"],
    //       rows: [
    //         { 表: "表1", 数据量: 100, 占用空间: 0.45 },
    //         { 表: "表2", 数据量: 154, 占用空间: 0.47 },
    //         { 表: "表3", 数据量: 224, 占用空间: 0.84 },
    //         { 表: "表4", 数据量: 123, 占用空间: 0.49 },
    //         { 表: "表5", 数据量: 142, 占用空间: 0.24 }
    //       ]
    //     },
    //     year: {
    //       columns: ["表", "数据量", "占用空间"],
    //       rows: [
    //         { 表: "表1", 数据量: 1461, 占用空间: 0.51 },
    //         { 表: "表2", 数据量: 9654, 占用空间: 0.45 },
    //         { 表: "表3", 数据量: 6956, 占用空间: 0.52 },
    //         { 表: "表4", 数据量: 15854, 占用空间: 0.57 },
    //         { 表: "表5", 数据量: 10136, 占用空间: 0.15 }
    //       ]
    //     }
    //   }
    // }
  },
  methods: {
    onTabs() {
      let servName = "";
      let cond = "";
      let dataConfig = {
        linea: {
          columns: [key],
          rows: [
            {
              住院: "",
              门诊: "",
              时间: ""
            }
          ]
        }
      };
    },
    getResData(req) {
      req = [];
    },
    getCahrData(data, dataConfig) {
      return {
        linea: {
          columns: [],
          row: []
        }
      };
    },
    viewtabs(pageName) {
      this.contentData.currentPage = pageName.key;
      if(pageName.key !=='DataMonitor'){
      this.getChartData(this.checkDataType)        
      }
     if(pageName.key === 'ETL'){
       this.contentData.firstBar.title = 'ETL任务执行情况'
       this.contentData.firstPie.title = '任务执行时间分布'
       this.contentData.secondPie.title = '任务处理记录数分布'
       this.contentData.firstBar.set.type = 'line'
        // this.getRightTask()
        this.RightTaskTimeOut()
      }else{
        if(this.ReqTimeOut.RightTaskTimeOut){
          this.ReqTimeOut.RightTaskTimeOut.endTime()
        }
      }

      if(pageName.key === 'dataShare'){
        this.contentData.firstBar.title = '数据共享'
       this.contentData.firstPie.title = '数据共享比例'
       this.contentData.secondPie.title = '数据共享用户资源'
        this.RunTimeOut()
        this.dataSizeTimeOut()
        this.DataShareSizeTimeOut()
        this.DataShareRecodTimeOut()
        this.leftChartLegendTimeOut()
      }else{
        this.ReqTimeOut.RunTimeOut.endTime()
        this.ReqTimeOut.dataSizeTimeOut.endTime()
        this.ReqTimeOut.DataShareSizeTimeOut.endTime()
        this.ReqTimeOut.DataShareRecodTimeOut.endTime()
        this.ReqTimeOut.leftChartLegendTimeOut.endTime()
        // this.ReqTimeOut.RightTaskTimeOut.endTime()
      }
    },
    async getRunTime() {
      let self = this      
      let req = {
        serviceName: "srvlog_apps_onlie_time_select",
        colNames: ["*"],
        condition: []
        // group: [
        //   {
        //     colName: "num_of_calls",
        //     type: "sum"
        //   }
        // ]
      };
      let path = this.getServiceUrl(
        "select",
        "srvlog_apps_onlie_time_select",
        "monitor"
      );
      let res = await self.axios.post(path,req)
      
      console.log("--------------发送请求--------------res",res);
      let run = res.data.data
      if(res.status === 200){        
        run = Object.assign(...run)
        self.indicatorData.runtime = run
        return { 'isRes': true, 'res': res }
      }else{
        return { 'isRes': false, 'res': res };
      }

      // this.axios
      //   .post(path, req)
      //   .then(res => {
      //     let run = res.data.data;
      //     run = Object.assign(...run);
      //     this.indicatorData.runtime = run;
      //     // this.getDataSize();
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    async getDataSize() {
      let self = this
      let params = {
        serviceName: "srvdc_rc_db_table_select",
        colNames: ["*"],
        condition: [],
        group: [
          {
            colName: "table_name",
            type: "count"
          },
          {
            colName: "row_count",
            type: "sum"
          }
        ]
      };
      let url = this.getServiceUrl("select", params.serviceName, "etl");
      let res = await self.axios.post(url,params)
      if(res.status === 200){
        self.indicatorData.dataSize = res.data.data[0];
        return {'isRes':true,'res':res}
      }else{
        return {'isRes':false,'res':res}
      }
      // this.axios({
      //   method: "POST",
      //   url: url,
      //   data: params
      // })
      //   .then(res => {
      //     console.log("re123s", res.data.data);
      //     if (res.data.data.length > 0) {
      //       this.indicatorData.dataSize = res.data.data[0];
      //       this.getDataShareSize();
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    async getDataShareSize() {
      let self = this
      let params = {
        serviceName: "srvdc_share_shared_table_select",
        colNames: ["*"],
        condition: [],
        group: [
          {
            colName: "table_name",
            type: "count"
          }
        ]
      };
      let url = this.getServiceUrl(
        "select",
        "srvdc_share_shared_table_select",
        "datashare"
      );
      let res = await self.axios.post(url,params)
      
      if(res.status === 200){
        self.indicatorData.dataShareSize.listNum =
            res.data.data[0].table_name;
        return {'isRes':true,'res':res}
      }else{
        return {'isRes':false,'res':res}
      }
      // this.axios
      //   .post(url, params)
      //   .then(res => {
      //     console.log("dataShareSize", res.data.data[0]);
      //     this.indicatorData.dataShareSize.listNum =
      //       res.data.data[0].table_name;
      //     this.getDataShareRecod();
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    async getDataShareRecod() {
      let self = this
      let params = {
        serviceName: "srvdc_share_serve_summary_select",
        colNames: ["*"],
        condition: [],
        group: [
          {
            colName: "share_row_count",
            type: "sum"
          },
          {
            colName: "invoke_success_count",
            type: "sum"
          }
        ]
      };
      let url = this.getServiceUrl(
        "select",
        "srvdc_share_serve_summary_select",
        "datashare"
      );
      let res = await self.axios.post(url,params)
      if(res.status===200){
        self.indicatorData.dataShareSize.record =
            res.data.data[0].share_row_count;
          self.indicatorData.dataShareSize.shareNum =
            res.data.data[0].invoke_success_count;
        return {'isRes':true,'res':res}
      }else{
        return {'isRes':false,'res':res}
      }
      // this.axios
      //   .post(url, params)
      //   .then(res => {
      //     // this.headerSecond.sheetLog = res.data.data[0].share_row_count
      //     this.indicatorData.dataShareSize.record =
      //       res.data.data[0].share_row_count;
      //     this.indicatorData.dataShareSize.shareNum =
      //       res.data.data[0].invoke_success_count;
      //       if(this.contentData.currentPage ==='dataShare'){
      //         this.getleftChartLegend()
      //       }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    getTimeType(TimeType) {
      //获取当前点击得时间（近一天/近一周。。。。）
      this.checkDataType = TimeType;
      this.getChartData(TimeType)
    },
    getChartData(type) {
      let xValue = this.getXaxis(type);
      
      xValue.forEach((item,i)=>{
        if(type === 'day'){
          this.data01[type].rows[i].时间 = item + '点'
        }else{
          this.data01[type].rows[i].时间 = item
        }
      })

      if(this.contentData.currentPage === 'dataShare'){
        this.contentData.firstBar.set.type = 'bar'
        //数据资源---数据共享数据
        this.contentData.firstBar.set.stack.用户 = ['表1','表2','表3','表4','表5']//setting中得stack设置
        this.contentData.firstBar.data.columns = this.data01[type].columns;//获取到的图例
        this.contentData.firstBar.data.rows = this.data01[type].rows;//最终的rows

        //数据资源---数据共享比例
        this.contentData.firstPie.data.columns = this.data02[type].columns;
        this.contentData.firstPie.data.rows = this.data02[type].rows;//最终的rows

        //数据资源---数据共享用户资源
        this.contentData.secondPie.data.columns = this.data03[type].columns;
        this.contentData.secondPie.data.rows = this.data03[type].rows;//最终的rows

      }else if(this.contentData.currentPage === 'ETL'){
        let rowData = []
        xValue.map(only=>{
          let rowItem = {}
            rowItem['时间'] = only + '点'
            rowItem['处理总时长'] = parseInt(Math.random()*100000)
            rowItem['总处理记录数'] =parseInt(Math.random()*100000)
            rowData.push(rowItem)
        })
        
        //ETL---数据共享
        this.contentData.firstBar.data.columns = ['时间','处理总时长','总处理记录数']
        this.contentData.firstBar.data.rows = rowData;

        //ETL---数据共享比例
        let datas = {
        columns: ['任务', '执行时间'],
          rows: [
            { '任务': '任务1', '执行时间': 393 },
            { '任务': '任务2', '执行时间': 530 },
            { '任务': '任务3', '执行时间': 923 },
            { '任务': '任务4', '执行时间': 723 },
            { '任务': '任务5', '执行时间': 792 },
            { '任务': '任务6', '执行时间': 593 }
          ]
        }
        datas.rows.map((item)=>{
            item['执行时间'] = parseInt(Math.random()*100)
          })

        this.contentData.firstPie.data.columns = datas.columns
        this.contentData.firstPie.data.rows = datas.rows

        this.contentData.secondPie.data.columns = datas.columns
        this.contentData.secondPie.data.rows = datas.rows


      }
      

      

      console.log('this.contentData.firstBar.data',this.contentData.firstBar)
        
    },
    //获取右边双Y轴图例
    async getleftChartLegend(){
      let self = this
      let req = {
        serviceName: "srvdc_rc_db_table_uiconf_select",
        colNames: ["table_no","table_name","table_label"],
      };
      let path = this.getServiceUrl(
        "select",
        "srvdc_rc_db_table_uiconf_select",
        "datacenter"
      );
      // let res = self.axios.post(path,req)
      // if(res.status === 200){
      //   let Odeploy = res.data.data
      //   let tabeNum = Odeploy.map(item => item.table_no)
      //       tabeNum = tabeNum.join(',')
        
      // }
      let res =  await self.axios.post(path,req)
      if(res.status === 200 && res.data.data.length > 0){
        let Odeploy = res.data.data
        let tabeNum = Odeploy.map(item => item.table_no)
            tabeNum = tabeNum.join(',')
            await self.getLegend(tabeNum)
        return {'isRes':true,'res':res}
      }else{
        return {'isRes':false,'res':res}
      }
      // this.axios
      //   .post(path, req)
      //   .then(res => {
      //     // this.deploy = res.data.data
      //     if(res.status === 200){
      //       let Odeploy = res.data.data
      //     // Odeploy.map(item=>{
      //     //   // this.chartData01.columns.push(item.table_label)
      //     // })
      //       let tabeNum = Odeploy.map(item => item.table_no)
      //       tabeNum = tabeNum.join(',')
      //       self.getLegend(tabeNum)
      //     }
                
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    //获取图例对应的数据
    async getLegend(tabe){
      let self = this
      console.log('maxData',tabe)
      let req = {        
          "serviceName": "srvdc_rc_db_table_select",
          "condition":[{"colName":"table_no","ruleType":"in","value":tabe}],
          "colNames": ["row_count","storage_size","table_no","table_label"],           
      }
      let path = this.getServiceUrl('select','srvdc_rc_db_table_select','datacenter');
      let res = await self.axios.post(path,req)

      if(res.status === 200){
        let barDatas = res.data.data
        console.log('barDatas-----------',barDatas)
        let rightDateStro = []
        let rightDataSize = []
        this.contentData.secondBar.data.columns = ['表','占用空间','数据量']
        barDatas.map((item,index)=>{
            //  { 表: "表1", 数据量: 51, 占用空间: 0.22 },
            let defaultObj = {}
            
            defaultObj['占用空间'] = item.storage_size / 1024
            defaultObj['数据量'] = item.row_count
            defaultObj['表'] = item.table_label 
            rightDateStro.push(defaultObj['占用空间'])
            rightDataSize.push(defaultObj['数据量'])            
            this.contentData.secondBar.data.rows.push(defaultObj)
        })

        console.log('this.secondBar.data',this.contentData.secondBar.data)
        let maxNum = Math.max.apply(null, rightDateStro)
        let ArgMax = Math.max.apply(null, rightDataSize)
        this.maxData = {}
        // console.log('this.maxData==>',this.maxData)
        this.maxData['占用空间'] = maxNum
        this.maxData['数据量'] = ArgMax
        // console.log(this.rightData)
        this.getMaxNum(maxNum,ArgMax)
        // console.log('maxData',this.maxData,maxNum,ArgMax)
        return {'isRes':true,'res':res}
      }else{
        return {'isRes':false,'res':res}
      }
      // this.axios.post(path,req).then(res=>{
      //   let barDatas = res.data.data
      //   console.log('barDatas',barDatas)
      //   let rightDateStro = []
      //   let rightDataSize = []
      //   this.contentData.secondBar.data.columns = ['表','占用空间','数据量']
      //   barDatas.map((item,index)=>{
      //       //  { 表: "表1", 数据量: 51, 占用空间: 0.22 },
      //       let defaultObj = {}
            
      //       defaultObj['占用空间'] = item.storage_size / 1024
      //       defaultObj['数据量'] = item.row_count
      //       defaultObj['表'] = item.table_label 
      //       rightDateStro.push(defaultObj['占用空间'])
      //       rightDataSize.push(defaultObj['数据量'])            
      //       this.contentData.secondBar.data.rows.push(defaultObj)
      //   })

      //   console.log('this.secondBar.data',this.contentData.secondBar.data)
      //   let maxNum = Math.max.apply(null, rightDateStro)
      //   let ArgMax = Math.max.apply(null, rightDataSize)
      //   this.maxData = {}
      //   // console.log('this.maxData==>',this.maxData)
      //   this.maxData['占用空间'] = maxNum
      //   this.maxData['数据量'] = ArgMax
      //   // console.log(this.rightData)
      //   this.getMaxNum(maxNum,ArgMax)
      //   console.log('maxData',this.maxData,maxNum,ArgMax)
      // })
    },
    //获取ETL右边记录
   async getRightTask (){
     let self = this
      let params = {
        "serviceName": "srvetl_job_history_select",
        "colNames": ["*"],
        "condition": [],   
        "group":[{
          "colName":"job_name",
          "type":"by"
        },
        {
          "colName":"job_no",
          "type":"by"
        }
        
        ]       
      }
      let url = this.getServiceUrl("select", params.serviceName, "etl")
      let res = await self.axios.post(url,params)
      if(res.status === 200 && res.data.data.length > 0){
          let taskName = res.data.data
          let no = res.data.data[0].job_no
          this.contentData.secondBar.tableData.taskNo = no
          this.contentData.secondBar.tableData.title = taskName

          let initial = res.data.data[0]
         let reqTime = await self.checktask(initial)
          console.log('taskName',taskName)
          return reqTime
      }else{
        console.log('error-------',res.status,res.data.data.length)
        return {'isRes':false,'res':res}
      }
        // this.axios({
        //   method:"POST",url:url,data:params
        // }
        // )
        // .then(res => {

        //   let taskName = res.data.data
        //   let no = res.data.data[0].job_no
        //   this.contentData.secondBar.tableData.taskNo = no
        //   this.contentData.secondBar.tableData.title = taskName

        //   let initial = res.data.data[0]
        //   this.checktask(initial)

        //   console.log('taskName',taskName)

        // })
        // .catch(err => {
        //   console.log(err);
        // });
  },

    async checktask(item){
      let self = this
      let NewStep = []
      let value = item.job_no
      let name = item.job_name  
      let params = {
        "serviceName": "srvetl_job_history_select",
        "colNames": ["*"],
        "condition": [],
        "group": [
            {
              "colName": "job_no",
              "type": "by"
            }, {
              "colName": "job_name",
              "type": "by"
            }, {
              "colName": "end_time",
              "type": "by"
            },
            {
              "colName": "start_time",
              "type": "by"
            }
            
          ],
        "order": [
            {
              "colName": "start_time",
              "orderType": "desc"
            }
          ]   
               
      }
      let url = this.getServiceUrl("select", params.serviceName, "etl")
      let res = await self.axios.post(url,params)
      if(res.status === 200){
        let old = res.data.data
          old.forEach(simple=>{
            if(name === simple.job_name){
              NewStep.push(simple)
            }
          })
          this.contentData.secondBar.tableData.step = NewStep
          console.log('/-/-/-/-/-//-/-/-/',NewStep)
           this.contentData.secondBar.tableData.taskNo = this.contentData.secondBar.tableData.step[0].job_no
          
           await this.getNewTask(this.contentData.secondBar.tableData.taskNo)
           return res
      }
        // this.axios({
        //   method:"POST",url:url,data:params
        // }
        // )

        // .then(res => {
        //   let old = res.data.data
        //   old.forEach(simple=>{
        //     if(name === simple.job_name){
        //       NewStep.push(simple)
        //     }
        //   })
        //   this.contentData.secondBar.tableData.step = NewStep
        //   console.log('/-/-/-/-/-//-/-/-/',NewStep)
        //    this.contentData.secondBar.tableData.taskNo = this.contentData.secondBar.tableData.step[0].job_no
          
        //     this.getNewTask(this.contentData.secondBar.tableData.taskNo)
        //   // this.taskName = res.data.data
        //   // let no = res.data.data[0].job_no
        //   // this.taskNo = no

        // })
        // .catch(err => {
        //   console.log(err);
        // });
    },
    async getNewTask(str){
      console.log('121312')
      let params = {
        "serviceName": "srvetl_processor_history_select",
        "colNames": ["*"],
        "condition": [{
          colName:'job_no',
          ruleType:'eq',
          value:str
        }],
        page: {
          pageNo: 1,
          rownumber: 6
        },                        
      }
      let url = this.getServiceUrl("select", params.serviceName, "etl")
      let res = this.axios.post(url,params)
      if(res.status === 200){
        this.contentData.secondBar.tableData.GanttData = res.data.data
        return {'isRes':true,'res':res}
      }else{
        return {'isRes':false,'res':res}
      }
        // this.axios({
        //   method:"POST",url:url,data:params
        // }
        // )
        // .then(res => {
        //     this.contentData.secondBar.tableData.GanttData = res.data.data
        //     // console.error('GanttData',res.data.data)
        //     // this.taskNo = res.data.data[0].job_no
        // })
        // .catch(err => {
        //   console.log(err);
        // });
    },
    //双Y轴间隔设置
    getMaxNum(e, r) {
      let ops = { maxbar: 0, maxline: 0, interval: 0 };
      let n = 1;
      ops.interval = n * 100;
      if (Math.ceil(r / ops.interval) % 2 !== 0) {
        ops.maxline = Math.ceil(r / ops.interval) + 1;
        ops.maxline = ops.maxline * ops.interval;
      } else {
        ops.maxline = Math.ceil(r / ops.interval);
        ops.maxline = ops.maxline * ops.interval;
      }
      if (Math.ceil(e / ops.interval) % 2 !== 0) {
        ops.maxbar = Math.ceil(e / ops.interval) + 1;
        ops.maxbar = ops.maxbar * ops.interval;
      } else {
        ops.maxbar = Math.ceil(e / ops.interval);
        ops.maxbar = ops.maxbar * ops.interval;
      }
      if (ops.maxbar > ops.maxline) {
        ops.interval = ops.maxline;
        ops.maxbar = Math.ceil(ops.maxbar / ops.interval) * ops.interval;
        if (ops.maxbar / ops.interval < 4) {
          ops.interval = ops.interval / 2;
        } else if (ops.maxbar / ops.interval > 8) {
          ops.interval = ops.interval * 2;
        }
      } else {
        ops.interval = ops.maxbar;
        ops.maxline = Math.ceil(ops.maxline / ops.interval) * ops.interval;
        if (ops.maxline / ops.interval < 4) {
          ops.interval = ops.interval / 2;
        } else if (ops.maxline / ops.interval > 8) {
          ops.interval = ops.interval * 2;
        }
      }

      this.contentData.secondBar.interval = ops.interval;
      this.contentData.secondBar.set.max[0] = ops.maxbar;
      this.contentData.secondBar.set.max[1] = ops.maxline;

      console.log("ops", e, r, ops);
      return ops;
    },

    // toIndex(num) {
    //   if (num === "1") {
    //     sessionStorage.clear();
    //     window.location.href = "/main/login_pages/login-fw.html";
    //     // this.$router.push({ name: "login" });
    //   }
    //   if (num === "2") {
    //     this.$router.push({ name: "navs" });
    //   }
    // },
    // changeTab(num) {
    //   this.tabsShow = num;
    //   if (this.tabsShow == 1) {
    //     this.showComponent = DataShare;
    //   } else if (this.tabsShow == 2) {
    //     this.showComponent = EtlTask;
    //   } else if (this.tabsShow == 3) {
    //     this.showComponent = DataMonitor;
    //   }
    // },
    // timeCycle(e, index = 0) {
    //   // this.CurrAct = index
    //   // console.log(index, this.CurrAct)
    //   let self = this
    //   self.checkDataType = e
    //   let currtTimes = []
    //   let rows = []
    //   if (e === "day") {
    //     for (let i = 1; i <= 24; i++) {
    //       currtTimes.push(moment().subtract(24 - i, 'hours').format('HH'))
    //     }
    //     currtTimes.forEach((item, i) => {
    //       this.data01.day.rows[i].时间 = item + '点'
    //     })
    //     console.log('+++++++++++++++', this.chartData01)
    //   } else if (e === 'week') {
    //     for (let i = 1; i <= 7; i++) {
    //       currtTimes.push(moment().subtract(7 - i, 'weeks').format('YYYY-MM-DD'))
    //     }
    //     currtTimes.forEach((item, i) => {
    //       this.data01.week.rows[i].时间 = item
    //     })

    //   }
    //   else if (e === 'month') {
    //     for (let i = 1; i <= 30; i++) {
    //       currtTimes.push(moment().subtract(30 - i, 'days').format('MM-DD'))
    //     }
    //     currtTimes.forEach((item, i) => {
    //       this.data01.month.rows[i].时间 = item
    //     })

    //   }
    //   else if (e === 'year') {
    //     for (let i = 1; i <= 12; i++) {
    //       currtTimes.push(moment().subtract(12 - i, 'month').format('YYYY-MM'))
    //     }
    //     currtTimes.forEach((item, i) => {
    //       this.data01.year.rows[i].时间 = item
    //     })

    //   } else {
    //     console.error('false')
    //   }
    //   self.chartData01 = self.data01[e]
    //   self.pieData = self.data02[e]
    //   self.pieUser = self.data03[e]
    //   self.rightData = self.data04[e]
    //   // this.DateDatum.day.moreColg

    // },
    // getData(groupBy) {
    //   let req = {
    //     serviceName: "srvemr_record_count_by_hour_select",
    //     colNames: ["*"],
    //     condition: [
    //       {
    //         colName: "count_hour",
    //         value: this.timeHorizon.today,
    //         ruleType: "[like]"
    //       }
    //     ],
    //     group: [
    //       {
    //         colName: "hospital",
    //         type: "by"
    //       },
    //       {
    //         colName: "count_hour",
    //         type: groupBy
    //       },
    //       {
    //         colName: "amount",
    //         type: "sum"
    //       }
    //     ],
    //     order: [
    //       {
    //         colName: "count_hour",
    //         orderType: "asc"
    //       }
    //     ]
    //   };
    //   if (groupBy === "by_month_of_year") {
    //     req.condition = [
    //       {
    //         colName: "count_hour",
    //         value: this.timeHorizon.year_start,
    //         ruleType: "ge"
    //       },
    //       {
    //         colName: "count_hour",
    //         value: this.timeHorizon.today,
    //         ruleType: "le"
    //       }
    //     ];
    //     req.group = [
    //       {
    //         colName: "record_type",
    //         type: "by"
    //       },
    //       {
    //         colName: "count_hour",
    //         type: groupBy
    //       },
    //       {
    //         colName: "amount",
    //         type: "sum"
    //       }
    //     ];
    //   } else if (groupBy === "by_date_of_week") {
    //     // console.log(this.timeHorizon)
    //     req.condition = [
    //       {
    //         colName: "count_hour",
    //         value: this.timeHorizon.week_start,
    //         ruleType: "ge"
    //       },
    //       {
    //         colName: "count_hour",
    //         value: this.timeHorizon.today,
    //         ruleType: "le"
    //       }
    //     ];
    //     req.group = [
    //       {
    //         colName: "record_type",
    //         type: "by"
    //       },
    //       {
    //         colName: "count_hour",
    //         type: "by_date"
    //       },
    //       {
    //         colName: "amount",
    //         type: "sum"
    //       }
    //     ];
    //   } else if (groupBy === "by_date_of_month") {
    //     req.condition = [
    //       {
    //         colName: "count_hour",
    //         value: this.timeHorizon.month_start,
    //         ruleType: "ge"
    //       },
    //       {
    //         colName: "count_hour",
    //         value: this.timeHorizon.today,
    //         ruleType: "le"
    //       }
    //     ];
    //     req.group = [
    //       {
    //         colName: "record_type",
    //         type: "by"
    //       },
    //       {
    //         colName: "count_hour",
    //         type: "by_date"
    //       },
    //       {
    //         colName: "amount",
    //         type: "sum"
    //       }
    //     ];
    //   }
    //   let url = this.getServiceUrl("select", req.serviceName, "emr");
    //   this.axios({ method: "POST", url: url, data: req })
    //     .then(res => {
    //       // if (res.data.resultCode === "0011") {
    //       //   this.$router.push({ name: "login" });
    //       // }
    //       let data = res.data.data;
    //       if (groupBy === "by_hour_of_date") {
    //         let req = {
    //           serviceName: "srvcvs_medical_records_select",
    //           colNames: ["*"],
    //           condition: [
    //             {
    //               colName: "ywfssj",
    //               value: this.timeHorizon.today,
    //               ruleType: "[like]"
    //             }
    //           ]
    //         };
    //         let url = this.getServiceUrl("select", req.serviceName, "cvs");
    //         this.axios
    //           .post(url, req)
    //           .then(res => {
    //             let timeData = res.data.data;
    //             this.getChartData(timeData, "day");
    //           })
    //           .catch(err => {
    //             console.log(err);
    //           });
    //       } else if (groupBy === "by_month_of_year") {
    //         this.getChartData(data, "year");
    //       } else if (groupBy === "by_date_of_week") {
    //         this.getChartData(data, "week");
    //       } else if (groupBy === "by_date_of_month") {
    //         this.getChartData("month");
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // requestData() { },
    // toManangerment() {
    //   let str = window.location.href;
    //   let num = str.indexOf("?");
    //   str = str.substr(num + 1);
    //   console.log(str);
    //   window.location.href = "../../main/index.html?" + str;
    // },
    // autoChangeTab(interval) {
    //   setInterval(() => {
    //     if (this.tabsShow >= 3) {
    //       this.tabsShow = 1;
    //       this.tabsShow++;
    //     } else {
    //       this.tabsShow++;
    //     }
    //     this.changeTab(this.tabsShow);
    //   }, interval);
    // },
    // getRunTime() {
    //   let req = {
    //     serviceName: "srvlog_apps_onlie_time_select",
    //     colNames: ["*"],
    //     condition: [],
    //     // group: [
    //     //   {
    //     //     colName: "num_of_calls",
    //     //     type: "sum"
    //     //   }
    //     // ]
    //   };
    //   let path = this.getServiceUrl(
    //     "select",
    //     "srvlog_apps_onlie_time_select",
    //     "monitor"
    //   );
    //   this.axios
    //     .post(path, req)
    //     .then(res => {
    //       let run = res.data.data
    //       run = Object.assign(...run)
    //       this.runtime = run
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // getDataSize() {
    //   let params = {
    //     "serviceName": "srvdc_rc_db_table_select",
    //     "colNames": ["*"],
    //     "condition": [],
    //     "group": [
    //       {
    //         "colName": "table_name",
    //         "type": "count"
    //       },
    //       {
    //         "colName": "row_count",
    //         "type": "sum"
    //       }
    //     ]
    //   }
    //   let url = this.getServiceUrl("select", params.serviceName, "datacenter")
    //   this.axios({
    //     method: "POST", url: url, data: params
    //   }
    //   )
    //     .then(res => {
    //       console.log('re123s', res.data.data);
    //       if (res.data.data.length > 0) {
    //         this.headerFirst = res.data.data[0]
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // getDataShareSize() {
    //   let params = {
    //     "serviceName": "srvdc_share_shared_table_select",
    //     "colNames": ["*"],
    //     "condition": [
    //     ],
    //     "group": [
    //       {
    //         "colName": "table_name",
    //         "type": "count"
    //       }
    //     ]

    //   }
    //   let url = this.getServiceUrl("select", 'srvdc_share_shared_table_select', "datashare")
    //   this.axios.post(
    //     url, params
    //   )
    //     .then(res => {
    //       this.headerSecond.sheetNum = res.data.data[0].table_name
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // getDataShareRecod() {
    //   let params = {
    //     "serviceName": "srvdc_share_serve_summary_select",
    //     "colNames": ["*"],
    //     "condition": [
    //     ],
    //     "group": [
    //       {
    //         "colName": "share_row_count",
    //         "type": "sum"
    //       },
    //       {
    //         "colName": "invoke_success_count",
    //         "type": "sum"
    //       }
    //     ]

    //   }
    //   let url = this.getServiceUrl("select", 'srvdc_share_serve_summary_select', "datashare")
    //   this.axios.post(
    //     url, params
    //   )
    //     .then(res => {
    //       // this.headerSecond.sheetLog = res.data.data[0].share_row_count
    //       this.dataShare = res.data.data[0]
    //       console.log('res.data.data', res.data.data)
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // //获取图例
    // getleftChartLegend() {
    //   let req = {
    //     serviceName: "srvdc_rc_db_table_uiconf_select",
    //     colNames: ["table_no", "table_name", "table_label"],
    //     condition: [],
    //   };
    //   let path = this.getServiceUrl(
    //     "select",
    //     "srvdc_rc_db_table_uiconf_select",
    //     "datacenter"
    //   );
    //   this.axios
    //     .post(path, req)
    //     .then(res => {
    //       this.deploy = res.data.data
    //       let Odeploy = res.data.data
    //       Odeploy.map(item => {
    //         this.chartData01.columns.push(item.table_label)
    //       })
    //       let tabeNum = this.deploy.map(item => item.table_no)
    //       tabeNum = tabeNum.join(',')
    //       this.getLegend(tabeNum)
    //       console.log('deploy', tabeNum)
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // //获取图例对应的数据
    // getLegend(tabe) {
    //   let req = {
    //     "serviceName": "srvdc_rc_db_table_select",
    //     "condition": [{ "colName": "table_no", "ruleType": "in", "value": tabe }],
    //     "colNames": ["row_count", "storage_size", "table_no", "table_label"],
    //     // 'group':[
    //     //   {
    //     //     colName:'table_no',
    //     //     type:'by'
    //     //   },
    //     //   {
    //     //     colName:'table_label',
    //     //     type:'by'
    //     //   }
    //     // ]
    //   }
    //   let path = this.getServiceUrl('select', 'srvdc_rc_db_table_select', 'datacenter');
    //   this.axios.post(path, req).then(res => {
    //     console.log('res.data.data', res.data.data)
    //   })
    // },
    // //转换数字
    // convert(num) {
    //   let nums = parseInt(num);
    //   if (nums > 10000) {
    //     if (nums % 10000 == 0) {
    //       nums = num / 10000 + "万";
    //     } else {
    //       nums = Math.round((num / 10000) * 10) / 10 + "万";
    //     }
    //   } else {
    //     nums = num;
    //   }
    //   return nums;
    // },
    // // 持续运行时长转换
    // period(num) {
    //   let nums = parseInt(num) / 60 / 60;
    //   if (nums < 24) {
    //     if (nums % parseInt(nums) == 0) {
    //       nums = nums;
    //     } else {
    //       nums = Math.round(nums * 10) / 10 + "h";
    //     }
    //   } else {
    //     nums = Math.round((nums / 24) * 10) / 10 + "天";
    //   }
    //   return nums;
    // },

    /*累计运行时长定时刷新*/
    RunTimeOut(){
      let self = this
      self.ReqTimeOut.RunTimeOut = new this.timeOut(30,0,self.getRunTime)
      self.ReqTimeOut.RunTimeOut.reqFun();
      self.ReqTimeOut.RunTimeOut.startTime();
    },
    /**数据量定时刷新 */
    dataSizeTimeOut(){
      let self = this
      self.ReqTimeOut.dataSizeTimeOut = new this.timeOut(30,0,self.getDataSize)
      self.ReqTimeOut.dataSizeTimeOut.reqFun();
      self.ReqTimeOut.dataSizeTimeOut.startTime();
    },
    /**共享数据量（表）定时刷新 */
    DataShareSizeTimeOut(){
      let self = this
      self.ReqTimeOut.DataShareSizeTimeOut = new this.timeOut(30,0,self.getDataShareSize)
      self.ReqTimeOut.DataShareSizeTimeOut.reqFun();
      self.ReqTimeOut.DataShareSizeTimeOut.startTime();
    },
    /**共享数据量（记录）和 数据共享次数定时刷新 */
    DataShareRecodTimeOut(){
      let self = this
      self.ReqTimeOut.DataShareRecodTimeOut = new this.timeOut(30,0,self.getDataShareRecod)
      self.ReqTimeOut.DataShareRecodTimeOut.reqFun();
      self.ReqTimeOut.DataShareRecodTimeOut.startTime();
    },
    /**数据资源右边柱状图定时刷新 */
    leftChartLegendTimeOut(){
      let self = this
      self.ReqTimeOut.leftChartLegendTimeOut = new this.timeOut(30,0,self.getleftChartLegend)
      self.ReqTimeOut.leftChartLegendTimeOut.reqFun();
      self.ReqTimeOut.leftChartLegendTimeOut.startTime();
    },
    /**ETL右边任务定时刷新 */
    RightTaskTimeOut(){
      let self = this
      self.ReqTimeOut.RightTaskTimeOut = new this.timeOut(30,0,self.getRightTask)
      self.ReqTimeOut.RightTaskTimeOut.reqFun();
      self.ReqTimeOut.RightTaskTimeOut.startTime();
    }
  },
  name: "datacenter",

  computed: {
    swiperTop() {
      return this.$refs.swiperTop.swiper;
    }
  },
  created() {
    // this.getRunTime();
    // this.getRunTime();
    // this.getDataSize();
    // this.getDataShareSize();
    // this.getDataShareRecod();
    // this.getleftChartLegend();
    let date = "2018-8-31";
    let today = moment().format("YYYY-MM-DD"); // moment获取本日日期
    let day_of_week = moment(today, "YYYY-MM-DD").format("E"); // 计算指定日期是这周第几天
    // let week_start = moment(today).subtract(day_of_week - 1, 'days').format('YYYY-MM-DD'); // 周一日期
    let week_start = moment(today)
      .subtract(6, "days")
      .format("YYYY-MM-DD"); // 六天前
    let week_end = today; // 今天
    // let week_end = moment(today).add(7 - day_of_week, 'days').format('YYYY-MM-DD'); // 周日日期
    let month_start = moment(today)
      .subtract(30, "days")
      .format("YYYY-MM-DD"); // 30天前
    // let month_start = moment(today).startOf('month').format('YYYY-MM-DD'); // 本月第一天
    let month_end = moment(today)
      .endOf("month")
      .format("YYYY-MM-DD"); // 本月最后一天
    let day_count = parseInt(
      moment(today)
        .endOf("month")
        .format("DD")
    ); // 本月天数
    let year_start = moment(today)
      .subtract(11, "month")
      .format("YYYY-MM-DD"); // 11个月之前
    this.timeHorizon = {
      date: date,
      today: today,
      day_count: day_count,
      day_of_week: day_of_week,
      week_start: week_start,
      week_end: week_end,
      month_start: month_start,
      month_end: month_end,
      year_start: year_start
    };
    let user = sessionStorage.getItem("current_login_user");
    this.user = JSON.parse(user);
    // this.user = top.user;
  },
  mounted() {
    // this.RunTimeOut()
    // this.dataSizeTimeOut()
    // this.DataShareSizeTimeOut()
    // this.DataShareRecodTimeOut()
    // this.leftChartLegendTimeOut()
    // let self = this
    // self.ReqTimeOut.RunTimeOut = new this.timeOut(5,0,self.getRunTime)
    // self.ReqTimeOut.RunTimeOut.reqFun();
    // self.ReqTimeOut.RunTimeOut.startTime();









    setInterval(() => {
      this.date = moment().format("YYYY-MM-DD  HH:mm:ss");
    }, 1000);
    // this.timeCycle("day");
  },
  destroyed(){
    this.ReqTimeOut.RunTimeOut.endTime()
    this.ReqTimeOut.dataSizeTimeOut.endTime()
    this.ReqTimeOut.DataShareSizeTimeOut.endTime()
    this.ReqTimeOut.DataShareRecodTimeOut.endTime()
    this.ReqTimeOut.leftChartLegendTimeOut.endTime()
    this.ReqTimeOut.RightTaskTimeOut.endTime()
  }
};
</script>

<style lang="scss">
* {
  // overflow: hidden;
  // color: rgba(255, 255, 255, 1);
}
div /deep/ .swiper-pagination-bullets {
  height: 30px;
  margin-top: 10px;
}
.swiper-pagination-bullets /deep/ .swiper-pagination-bullet {
  width: 100px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.1);
  opacity: 1;
}
.swiper-pagination-bullets /deep/ .swiper-pagination-bullet-active {
  opacity: 1;
  background: #007aff;
}
.swiper-pagination-fraction,
.swiper-pagination-custom,
.swiper-container-horizontal > .swiper-pagination-bullets {
  top: 0;
  left: 0;
  width: 100%;
}
.active {
  background-color: rgba(0, 119, 255, 0.986);
}
.xpanel-l-t {
  background-image: url("../assets/images/panel-l-t.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.panel-r-t {
  background-image: url("../assets/images/panel-r-t.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.xpanel-l-b {
  background-image: url("../assets/images/panel-l-b.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.item_title {
  // margin: 10px 10px 20px 0;
  height: 40px;
  line-height: 40px;
  text-align: left;
  text-indent: 20px;
  // background-image: url("../assets/images/title-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.item_title_long {
  height: 40px;
  line-height: 40px;
  text-indent: 34px;
  text-align: left;
  background-image: url("../assets/images/title-bg-long.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-right: 0;
  height: 40px;
  .title_left {
    flex: 1;
    text-align: left;
  }
  .title_title {
    font-size: 25px;
    text-align: center;
    color: #007aff;
    flex: 1;
  }
  .title_right {
    // text-align: right;
    justify-content: flex-end;
    display: flex;
    height: 20px;
    line-height: 20px;
    flex: 1;
    .nowdate {
      // font-size: 1.2rem;
      padding-right: 20px;
      // color: #d13d2a;
      font-weight: 600;
    }
    .accountInfo {
      display: inline-block;
      // height: 50px;
      min-width: 130px;
      span {
        font-weight: 600;
      }
    }
    .btn {
      cursor: pointer;
      text-align: center;
      display: inline-block;
      // height: 30px;
      min-width: 80px;
      // line-height: 30px;
      margin: 0 20px;
      &:nth-child(2) {
        text-align: left;
        &:hover {
          background-color: transparent;
        }
      }
      &:hover {
        background-color: rgba(0, 119, 255, 0.986);
      }
    }
    .btn_logout {
      cursor: pointer;
      // line-height: 30px;
      // height: 30px;
      text-align: center;
      min-width: 50px;
      margin-left: 10px;
      &:hover {
        background-color: rgba(0, 119, 255, 0.986);
      }
    }
  }
  @media screen and (max-width: 1366px) {
    .title_right {
      font-size: 14px;
      width: 34%;
      .accountInfo {
      }
    }
  }
}
@media screen and (max-width: 1366px) {
  .title {
    height: 25px;
  }
}
.wrap-data {
  background: #0b0f34;
  width: 100%;
  height: 100%;
  .title .title_right {
    .nowdate,
    .accountInfo,
    .btn_logout {
      // font-size: 0.8rem;
      color: #ffffff;
    }
  }
  // min-width: 1500px;
  .main {
    box-sizing: border-box;
    margin: 0 auto;
    background: url("../assets/images/wrapper-bg.png") no-repeat;
    background-size: 100% 99%;
    height: calc(100% - 40px);
    height: calc(100% - 40px);
  }
  @media screen and (max-width: 1366px) {
    .main {
      overflow: hidden;
      height: calc(100% - 30px);
    }
  }

  .header {
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      margin: 0px 50px;
      // height: 50px;
      // line-height: 50px;
      .top_left {
        display: flex;
        width: 23%;
        height: 40px;
        margin-bottom: 10px;
        box-sizing: border-box;
        justify-content: space-around;
        line-height: 50px;
        .page_name {
          font-size: 1.2rem;
          // font-weight: 600;
          line-height: 40px;
          color: #0084ff;
          &.tabactive {
            border-bottom: 3px solid #007aff;
          }
          cursor: pointer;
        }
      }
      .top_right {
        display: flex;
        align-items: center;
        .accountInfo {
          display: inline-block;
          // height: 50px;
          min-width: 130px;
          span {
            font-weight: 600;
          }
        }
        .btn {
          cursor: pointer;
          text-align: center;
          display: inline-block;
          height: 30px;
          min-width: 80px;
          line-height: 30px;
          margin-right: 20px;
          &:nth-child(2) {
            text-align: left;
            &:hover {
              background-color: transparent;
            }
          }
          &:hover {
            background-color: rgba(0, 119, 255, 0.986);
          }
        }
        .btn_logout {
          cursor: pointer;
          line-height: 30px;
          height: 30px;
          text-align: center;
          min-width: 50px;
          &:hover {
            background-color: rgba(0, 119, 255, 0.986);
          }
        }
      }
    }
    .content_cen1 {
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      // margin-top: 20px;
      .content_cen_left {
        width: 100%;
        display: flex;
        p {
          flex: 1;
          display: flex;
          text-align: center;
          margin: 0;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          :first-child {
            font-size: 14px;
          }
          :last-child {
            font-size: 18px;
          }
          span {
            margin-bottom: 5px;
            &:last-child {
              color: rgb(201, 201, 45);
              font-weight: bold;
            }
          }
        }
      }
    }
    .top_header {
      display: flex;
      height: 30px;
      justify-content: space-between;
      box-sizing: border-box;
      width: 30%;

      .top_header_item {
        width: auto;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        flex: 1;
        text-align: left;
        text-indent: 20px;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span:first-child {
          max-width: 2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        // span:last-child{

        // }
        &:first-child {
          margin-right: 20px;
        }
        .all_number {
          font-size: 1.2rem;
          color: #0084ff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .tabbtn {
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 119, 255, 0.986);
        }
      }
    }
    .time_horizon {
      display: flex;
      box-sizing: border-box;
      margin: 5px 50px;
      .time_horizon_item {
        cursor: pointer;
        width: 70px;
        line-height: 1rem;
        font-size: 1rem;
        margin: 0.4rem 0;
        text-align: center;
        border-right: 1px solid rgba(27, 40, 228, 0.322);
        &:last-child {
          // width: 150px;
          border-right: none;
        }
        &.active {
          line-height: 1.8rem;
          padding: 0 0.2rem;
          background-color: rgba(0, 119, 255, 0.986);
          margin: 0;
        }
        &:hover {
          line-height: 1.8rem;
          margin: 0;
          background-color: rgba(27, 40, 228, 0.322);
        }
      }
    }
  }
  .content {
    display: flex;
    justify-content: space-between;
    height: calc(100% - 150px);
    // height: 100%;
    // margin: 0px 30px 15px;
    box-sizing: border-box;
    padding: 1rem;
    padding-top: 0;
    box-sizing: border-box;
    > .dv-border-box-10 {
      // box-sizing: border-box;
      > .border-box-content {
        //  height:calc(100% - 140px);
        position: relative;
        width: 100%;
        /* height: 100%; */
        // padding: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
      }
    }
    > .dv-border-box-10.etl-task-right {
      > .border-box-content {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-self: flex-start !important;
      }
    }
    .content_left {
      // height: 93%;
      box-sizing: border-box;
      margin: 10px;
      display: flex;
      // padding: 20px;
      .content_left_left {
        box-sizing: border-box;
        float: left;
        width: 70%;
        height: calc(100% - 2rem);
        margin: 0px 0px;
        .big-title {
          padding: 0 20px;
        }
      }
      .content_left_right {
        margin: 0px 0px 0px 10px;
        width: 30%;
        padding-top: 1rem;
        height: calc(100% - 2rem);
        display: flex;
        flex-direction: column;
        .content_left_right_item {
          height: 49%;
          overflow: hidden;
          &:first-child {
            // margin-bottom: 10px;
          }
        }
      }
    }
    .content_right {
      position: relative;
      // height: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      padding: 0px;
      margin-top: 10px;
      // min-height: 75vh;
      .content_right_top {
        height: 30px;
        line-height: 30px;
        margin-bottom: 5px;
        text-align: left;
        text-indent: 20px;
        .swiper-slide {
          height: 100%;
          opacity: 0.4;
        }
        .swiper-slide-active {
          opacity: 1;
        }
      }
      .content_right_content {
        flex: 1;
        margin-bottom: 5px;
        height: 100%;
        .tab_content {
          height: 100%;
          .content_item {
            height: calc(100% - 60px);
          }
        }
        .tab_check {
          display: flex;
          margin: 20px auto;
          line-height: 30px;
          justify-content: center;
          .check_item {
            padding: 0 10px;
            cursor: pointer;
            // border-top-right-radius: 5px;
            // border-top-left-radius: 5px;
            border-bottom: 1px solid #007aff;
            &.activity {
              border-top-right-radius: 5px;
              border-top-left-radius: 5px;
              border: 1px solid #007aff;
              border-bottom: none;
            }
          }
        }
        .swiper-container {
          padding-top: 50px;
          height: 100%;
          position: relative;
        }
      }
      .content_right_bottom {
        height: 300px;
        display: flex;
        justify-content: space-between;
        .content_right_bottom_item {
          width: 49%;
          margin: 0px 0px 0px 0px;
          font-size: 14px;
          height: 100%;
          &:first-child {
            margin-left: 10px;
          }
          .border-box-content {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            padding: 1rem;
            box-sizing: border-box;
            div {
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              height: 35%;
              .text-val {
                font-size: 2rem;
                color: #007aff;
                line-height: 3rem;
              }
              .label {
                font-size: 1rem;
              }
            }
          }
        }
      }
    }
  }
}
.carousel-demo4 {
  position: relative;
  .h-carousel-pagination {
    margin-top: 10px;
    height: 100px;
    .h-carousel-pagination-item {
      float: left;
      width: 25%;
      cursor: pointer;
      > img {
        width: 100%;
        height: 100px;
        opacity: 0.5;
        transition: 0.3s;
      }
      &.active,
      &:hover {
        > img {
          opacity: 1;
        }
      }
    }
  }
}
.col-65 {
  width: 65%;
}
.col-35 {
  width: 35%;
}
</style>
