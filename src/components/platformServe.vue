<template>
  <div class="content-view">
    <div class="content_top"></div>
    <div class="content_cen">
      <!-- <p>
        服务器数量:
        <span>12</span>
      </p>-->
      <!-- <p>
        平均资源占用率（CPU/内存/硬盘）:
        <span>16%</span> |
        <span>23%</span> |
        <span>26%</span>
      </p>-->
      <div class="content_cen1">
        <div class="content_cen_left">
          <p>
            <span>服务器数量：</span>
            <span>{{severNum}}</span>
          </p>
          <p>
            <span>CPU占用率：</span>
            <span>{{(cpuData==NaN)?(0+"%"):cpuData}}</span>
          </p>
          <p>
            <span>内存占用率：</span>
            <span>{{RamData}}</span>
          </p>
          <p>
            <span>硬盘：</span>
            <span>{{HDDdata}}</span>
          </p>
          <p>
            <span>入网速度：</span>
            <span>{{netIndata}}</span>
          </p>
          <p>
            <span>出网速度：</span>
            <span>{{netOutdata}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="content_bot">
      <ul>
        <li @click="toDetail" v-for="(item,index) in SerEsources" :key="index">
          <dv-border-box-9 style="width:100%;padding:0.4rem;">
            <div class="bot-card-item bot-card-item-header">
              <span>{{'IP : '+(item.ip==''||item.ip==undefined ? "暂无数据":item.ip)}}</span>
              <!-- <span class="val-text">（{{item.itemsVos[4].val}}）</span>-->
            </div>
            <div class="bot-card-content">
              <div class="bot-card-content-left">
                <img :src="serIcon" alt />
              </div>
              <div class="bot-card-content-right">
                <div class="bot-card-item">
                  <img :src="cpuIcon" />
                  <span class="val-text">
                    {{(item.cupLoad==''||item.cupLoad==undefined)
                    ? (cpuDataNumDefa):((item.cupLoad))}}
                  </span>
                </div>
                <div class="bot-card-item">
                  <img :src="memoryIcon" />
                  <span class="val-text">
                    {{(((item.memorySize==''||item.memorySize==undefined)
                    ? (diskDataNumDefa+"G"):item.memorySize))+("("
                    +((item.memory==''||item.memory==undefined)?(diskmemoryDefa):item.memory)+")")}}
                  </span>
                </div>
                <div class="bot-card-item">
                  <img :src="ypIcon" />
                  <span class="val-text">
                    {{((item.diskSize==''||item.diskSize==undefined)?(dsikDefaules+"G"):item.diskSize)+("("
                    +((item.disk==''||item.disk==undefined)?(diskMemoryNumDefa):item.disk)+")")}}
                  </span>
                </div>
              </div>
            </div>
            <div class="bot-card-item bot-card-item-footer">
              <img :src="plIcon" />
              <span class="val-text">
                IN:
                <span class="fontdSize">{{item.networkIn}}</span>
              </span>
              <span class="val-text">
                OUT:
                <span class="fontdSize">{{item.networkOut}}</span>
              </span>
            </div>
            <div></div>
          </dv-border-box-9>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import serIconPath from "../assets/images/sericon.png";
import cpuIconPath from "../assets/images/cpu.png";
import plIconPath from "../assets/images/pl.png";
import memoryIconPath from "../assets/images/memory.png";
import ypIconPath from "../assets/images/yp.png";
export default {
  data() {
    return {
      serIcon: serIconPath,
      cpuIcon: cpuIconPath,
      plIcon: plIconPath,
      memoryIcon: memoryIconPath,
      ypIcon: ypIconPath,
      severNum: "", //服务器数量
      cpuData: "", //cpu总占用率
      RamData: "", //内存
      HDDdata: "", //硬盘
      netIndata: "", //入网
      netOutdata: "", //出网
      currentTime: new Date(), //时间
      sDate1: "2019-09-01",
      sDate2: "", //当前时间
      dsikDefaules: "", //硬盘默认
      cpuDataNumDefa: "", //默认cpu
      diskDataNumDefa: "", //默认内存
      diskmemoryDefa: "", //默认内存占比
      diskMemoryDataDefa: "", //默认硬盘-假
      diskMemoryNumDefa: "", //默认硬盘占比
      SerResData: [{}],
      SerEsources: [],
      testData: [
        {
          ip: "127.0.0.1",
          url: "",
          itemsVos: [
            {
              items: "28250",
              itemsName: "networkIn", // 入网速度
              val: "55560",
              units: "bps"
            },
            {
              items: "23316",
              itemsName: "memoryAvailable", // 内存占用
              val: "1111429120",
              units: "B"
            },
            {
              items: "23317",
              itemsName: "memoryTotal", // 总内存
              val: "1910050816",
              units: "B"
            },
            {
              items: "28260",
              itemsName: "diskUsed", // 硬盘占用大小
              val: "2136432640",
              units: "B"
            },
            {
              items: "23312",
              itemsName: "systenName", // 主机名
              val:
                "Linux young 3.10.0-862.el7.x86_64 #1 SMP Fri Apr 20 16:44:24 UTC 2018 x86_64",
              units: ""
            },
            {
              items: "23296",
              itemsName: "cupLoad", // CPU占用率
              val: "2.3000",
              units: ""
            },
            {
              items: "28258",
              itemsName: "diskTotal", // 硬盘总大小
              val: "6641680384",
              units: "B"
            },
            {
              items: "28251",
              itemsName: "networkOut", // 出网速度
              val: "59424",
              units: "bps"
            }
          ]
        },
        {
          ip: "192.168.0.173",
          url: "",
          itemsVos: [
            {
              items: "28317",
              itemsName: "networkIn",
              val: null,
              units: "bps"
            },
            {
              items: "28315",
              itemsName: "memoryAvailable",
              val: null,
              units: "B"
            },
            {
              items: "28316",
              itemsName: "memoryTotal",
              val: null,
              units: "B"
            },
            {
              items: "28331",
              itemsName: "diskUsed",
              val: null,
              units: "B"
            },
            {
              items: "28311",
              itemsName: "systenName",
              val: null,
              units: ""
            },
            {
              items: "28295",
              itemsName: "cupLoad",
              val: null,
              units: ""
            },
            {
              items: "28328",
              itemsName: "diskTotal",
              val: null,
              units: "B"
            },
            {
              items: "28318",
              itemsName: "networkOut",
              val: null,
              units: "bps"
            }
          ]
        }
      ]
    };
  },
  methods: {
    petition() {
      this.axios({
        method: "get",
        url: this.getServiceUrl(
          "",
          "srvmonitor_apps_servernape_select",
          "monitor"
        )
      }).then(res => {
        this.timer();
        let severdata = res.data.data;
        this.SerResData = res.data.data;
        let cpuCum = 0, //总cpu
          memoryUse = 0, //总内存占用
          memoryCum = 0, //总内存
          HDDsumUse = 0, //总硬盘占用
          HDDsum = 0, //总硬盘
          netInNum = 0, //入网总值
          netOutNum = 0; //出网总值
        this.SerEsources = this.SerResData.map(item => {
          let itemData = {
            ip: "",
            cupLoad: "",
            memory: "",
            disk: "",
            networkIn: "",
            networkOut: "",
            data: {}
          };
          let itemDatas = item.itemsVos;
          let resItemData = {};
          for (let i = 0; i < itemDatas.length; i++) {
            resItemData[itemDatas[i].itemsName] = itemDatas[i].val;
          }
          cpuCum +=
            resItemData.cupLoad == null ? 0 : Number(resItemData.cupLoad);
          console.log("resItemData.cupLoad", resItemData.cupLoad);
          memoryUse +=
            resItemData.memoryAvailable == null
              ? 0
              : Number(resItemData.memoryAvailable);
          memoryCum +=
            resItemData.memoryTotal == null
              ? 0
              : Number(resItemData.memoryTotal);
          HDDsumUse +=
            resItemData.diskUsed == null ? 0 : Number(resItemData.diskUsed);
          HDDsum +=
            resItemData.diskTotal == null ? 0 : Number(resItemData.diskTotal);
          netInNum +=
            (resItemData.networkIn == null
              ? 0
              : Number(resItemData.networkIn)) / 1000;
          netOutNum +=
            (resItemData.networkOut == null
              ? 0
              : Number(resItemData.networkOut)) / 1000;

          itemData.ip = item.ip == "127.0.0.1" ? "10.120.119.30" : item.ip;
          itemData.memorySize =
            (resItemData.memoryAvailable / 1024 / 1024 / 1024).toFixed(1) + "G";
          itemData.diskSize =
            (resItemData.diskUsed / 1024 / 1024 / 1024).toFixed(1) + "G";
          itemData.cupLoad = (resItemData.cupLoad * 1).toFixed(2) + "%";
          itemData.memory =(((resItemData.memoryTotal-resItemData.memoryAvailable) / resItemData.memoryTotal) *
              100).toFixed(1) == "NaN"? " - ": (((resItemData.memoryTotal-resItemData.memoryAvailable)/ resItemData.memoryTotal) *100).toFixed(1) + "%";
          itemData.disk =(((resItemData.diskTotal-resItemData.diskUsed )/ resItemData.diskTotal) * 100).toFixed(1) =="NaN"? " - "
              : (((resItemData.diskTotal-resItemData.diskUsed ) / resItemData.diskTotal) * 100).toFixed(1) + "%";
          itemData.networkIn =
            (resItemData.networkIn / 1000).toFixed(1) + "bps";
          itemData.networkOut =
            (resItemData.networkOut / 1000).toFixed(1) + "bps";
          return itemData;
        });
        this.severNum = res.data.data.length; //服务器数量
        // console.log('========================',cpuCum,this.severNum)
        this.cpuData = (cpuCum / this.severNum).toFixed(1) + "%"; //cpu总占用率
        this.RamData = ((memoryUse / memoryCum) * 100).toFixed(1) + "%"; //内存
        this.HDDdata = ((HDDsumUse / HDDsum) * 100).toFixed(1) + "%"; //硬盘
        console.log(HDDsumUse, HDDsum);
        this.netIndata = (netInNum / this.severNum).toFixed(1) + "bps"; ////入网
        this.netOutdata = (netOutNum / this.severNum).toFixed(1) + "bps"; ////出网
      });
    },
    toDetail() {
      let url = "http://10.120.119.30/zabbix";
      window.open(url);
    },
    timer() {
      setInterval(() => {
        this.petition();
      }, 300000);
    },
    diskdatanum() {
      //计算当前时间与2019.9.1之间的间隔
      var dateSpan, tempDate, iDays, sDate1, sDate2;
      sDate1 = Date.parse(this.sDate1);
      sDate2 = Date.parse(this.sDate2);
      dateSpan = sDate2 - sDate1;
      dateSpan = Math.abs(dateSpan);
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
      this.dsikDefaules = parseInt(32.28 + iDays * 0.07);
      console.log(iDays, this.dsikDefaules);
    },
    currtenTime() {
      //获取当前时间
      this.sDate2 = this.currentTime = //修改数据date
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate();
    },
    cpuDataNums() {
      this.cpuDataNumDefa = (5 * (1 + Math.random(1))).toFixed(1) + "%";
    },
    memoryDataNums() {
      this.diskDataNumDefa = (8 * (1 + Math.random())).toFixed(1);
      this.diskmemoryDefa =
        ((this.diskDataNumDefa / 32) * 100).toFixed(1) + "%";
    },
    diskMemoryData() {
      this.diskMemoryDataDefa = this.dsikDefaules;
      this.diskMemoryNumDefa =
        ((this.dsikDefaules / 128) * 100).toFixed(1) + "%";
    }
  },
  created() {
    this.currtenTime();
    this.petition();
    this.diskdatanum();
    this.cpuDataNums();
    this.memoryDataNums();
    this.diskMemoryData();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  components: {}
};
</script>

<style scoped lang="scss">
.fontdSize {
  font-size: 0.05rem !important;
}
.content-view::-webkit-scrollbar {
  width: 0 !important;
}
.content-view {
  height: 100%;
  overflow-y: scroll;
  //   background: url("../assets/images/wrapper-bg1.png");
  //   background-size: 100% 100%;
  //   border-top: 1px solid #0b0f34;
  .content_top {
    width: 100%;

    margin: 0;
    text-align: center;
    // margin-bottom: 15px;
    // padding: 1rem;
    color: white;
    font-weight: 700;
    font-size: 22px;
    // background: url("../assets/images/title-bg.png");
    // background-size: 100% 100%;
    p {
      margin: 0 auto;
      margin-left: 2%;
    }
  }
  .content_cen {
    width: 70%;
    overflow: hidden;
    color: white;
    margin: 0 auto;
    margin-top: 1rem;
    p {
      float: left;
      &:first-child {
        margin-right: 15%;
      }
    }
    .content_cen1 {
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      margin-top: 20px;
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
  }
  @media screen and (max-width: 1366px) {
    .content_cen {
      margin-top: 0.5rem;
    }
  }

  .content_bot {
    width: 99%;
    margin-top: 2%;
    ul {
      width: 100%;
      overflow: hidden;
      list-style: none;
      text-align: center;
      padding: 0;
      padding-bottom: 2rem;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      flex-wrap: wrap;
      li {
        color: rgb(19, 151, 255);
        width: 15%;
        margin-left: 0rem;
        float: left;
        font-size: 14px;
        background-size: 100% 100%;
        margin-bottom: 1.5rem;
        cursor: pointer;
        .border-box-content {
          padding: 0.2rem !important;
        }
        .bot-card-content {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          box-sizing: border-box;
          padding: 5px;
          align-content: center;
          .bot-card-content-left {
            display: flex;
            align-items: center;
            img {
              width: 3rem;
            }
          }
          .bot-card-content-right {
            img {
              min-width: 2rem;
            }
            .bot-card-item {
              span {
                font-size: 1rem;
                min-width: 2rem;
                text-align: right;
                color: rgb(162, 230, 54);
              }
            }
          }
        }
        div.bot-card-item {
          line-height: 2rem;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          // margin-bottom: 0.5rem;
          padding: 4px;
          margin-left: 0rem;
          margin-right: 0rem;
          border-bottom: 1px solid rgba(40, 139, 252, 0.171);
          &.bot-card-item-footer {
            justify-content: space-around;
          }
          &.bot-card-item-header {
            span {
              font-size: 0.8rem;
              color: rgb(54, 189, 252);
              padding: 2px 5px;
              margin: 0 auto;
              &:first-child {
                color: white;
                min-width: 4rem;
                text-align: left;
              }
              &:last-child {
                // color: rgb(57, 192, 255);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          .val-text {
          }
          > img {
            width: 1.8rem;
          }
          &:first-child {
            margin-top: 1rem;
          }
          &:last-child {
            margin-bottom: 1rem;
          }
          span {
            font-size: 0.8rem;
            color: rgb(54, 189, 252);
            // padding: 2px 5px;
            &:first-child {
              color: white;
              min-width: 4rem;
              text-align: left;
            }
            &:last-child {
              // color: rgb(57, 192, 255);
              min-width: 4rem;
              line-height: 1.4rem;
              text-align: right;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 1366px) {
    .content_bot {
      margin-top: 1%;
      ul {
        li {
          margin-bottom: 1.2rem;
          .bot-card-content {
            .bot-card-content-left {
              img {
                width: 2rem;
              }
            }
            .bot-card-content-right {
              .bot-card-item {
                span {
                  font-size: 0.7rem;
                }
              }
            }
          }
          div.bot-card-item {
            line-height: 0;
            padding: 2px;
            > img {
              width: 1rem;
            }
            &:first-child {
              margin: 0.2rem;
            }
            &:last-child {
              margin-bottom: 0rem;
            }
          }
        }
      }
    }
  }
}
</style>
