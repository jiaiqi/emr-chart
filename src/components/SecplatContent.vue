<template>
  <div class="Cont_wrap">
    <div class="Cont_left_bar">
      <dv-border-box-10>
        <div class="bar_title">
          <span>微服务服务请求次数</span>
        </div>
        <div class="bar_content">
          <ve-histogram height="58vh" :data="chartData"></ve-histogram>
        </div>
      </dv-border-box-10>
      <!-- <li
        @click="timeCycle(item.key,index)"
        :class="{time:index==CurrAct}"
        v-for="(item,index) in dateLine"
        :key="index"
      >{{item.value}}</li>-->
    </div>
    <div class="Cont_right_pie">
      <dv-border-box-10>
        <div class="pie_title">
          <span>服务请求分布</span>
        </div>
        <div class="pie_content">
          <div class="pie_content_top">
            <ve-pie :legend-visible="false" height="30vh" width="100%" :data="RigPieData"></ve-pie>
          </div>
          <bot-norm></bot-norm>
        </div>
      </dv-border-box-10>
    </div>
    <!-- <div class="main_view">
      <div class="main_left">
        <dv-border-box-10>
          <div class="main_left_top">
            <p>微服务服务请求次数</p>
          </div>
          <div class="main_left_cen">
            <ve-histogram
              :extend="chartExtendLine"
              height="58vh"
              :textStyle="legend.textStyle"
              :legend="legend"
              :data="chartData"
              :settings="chartSettings"
              :log="true"
            ></ve-histogram>
          </div>
        </dv-border-box-10>
      </div>
      <div class="main_right">
        <dv-border-box-10>
          <div class="main_left_top">
            <p>服务请求分布</p>
          </div>
          <div class="main_right_top">
            <dv-border-box-8 style>
              <div class="main_left_cen_right">
                <ve-pie
                  :legend-visible="false"
                  height="30vh"
                  :extend="chartExtendPie"
                  width="100%"
                  :data="RigPieData"
                  :textStyle="legend.textStyle"
                  :settings="pieSetting"
                ></ve-pie>
              </div>
            </dv-border-box-8>
          </div>

          <div class="main_right_bot">
            <dv-border-box-8 style="height:6rem">
              <div class="main_right_word">
                <div class="main_right_count">
                  <p>累计请求次数</p>
                  <p>{{converts(askNum)}}</p>
                </div>
                <div class="main_right_count">
                  <p>累计运行时间</p>
                  <p>{{periods(runtime)?periods(runtime):0}}</p>
                </div>
              </div>
            </dv-border-box-8>
          </div>
        </dv-border-box-10>
      </div>
    </div>-->
  </div>
</template>

<script>
import BotNorm from "../components/BotNorm";
export default {
  name: "SecplatContent",
  data() {
    return {
      chartData: {},
      RigPieData: {}
    };
  },
  components: {
    BotNorm
  }
};
</script>

<style scoped lang="scss">
.Cont_wrap {
  width: 95%;
  margin: 0 auto;
  display: flex;
  margin-top: 3rem;
  .Cont_left_bar {
    flex: 6;
    margin-right: 1rem;
    .bar_title {
      display: flex;
      justify-content: center;
    }
  }
  .Cont_right_pie {
    flex: 3.5;
    .pie_title {
      display: flex;
      justify-content: center;
    }
    .pie_content {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .pie_content_top {
        margin-bottom: 6rem;
      }
    }
  }
}
// .wrap {
//   width: 100%;
//   height: 100%;
//   // background: url("../assets/images/wrapper-bg01.png");
//   background-size: 100% 100%;
//   .content-view {
//     width: 95%;
//     margin: 0 auto;
//     color: white;
//     .content_top {
//       display: flex;
//       height: 50px;
//       justify-content: space-between;
//       padding-top: 2rem;
//       .content_title {
//         width: 20%;
//         display: flex;
//         span {
//           margin-left: 20%;
//           font-size: 1.6rem;
//           line-height: 2.6rem;
//           color: rgb(61, 192, 253);
//         }
//       }

//       .content_cen_right {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         margin-right: 25px;
//         span {
//           padding: 5px 10px;
//         }
//       }
//     }
//     @media screen and (max-width: 1366px) {
//       .content_top {
//         height: 30px;
//         .content_title {
//           span {
//             font-size: 1.4rem;
//             margin-left: 15%;
//             line-height: 2rem;
//           }
//         }
//       }
//     }
//     .content_cen {
//       display: flex;
//       justify-content: space-between;
//       // overflow: hidden;
//       margin: 0% 0 0 2%;
//       .content_cen_left {
//         width: 100%;
//         display: flex;
//         p {
//           flex: 1;
//           display: flex;
//           flex-direction: row;
//           justify-content: center;
//           align-items: center;
//           :first-child {
//             font-size: 14px;
//           }
//           :last-child {
//             font-size: 18px;
//           }
//           span {
//             &:last-child {
//               color: rgb(201, 201, 45);
//               font-weight: bold;
//             }
//           }
//         }
//         @media screen and (max-width: 1366px) {
//           p {
//             flex: none;
//             width: 25%;
//             &:last-child {
//               font-size: 16px;
//             }
//           }
//         }
//       }
//     }
//     @media screen and (max-width: 1366px) {
//       .content_cen {
//         height: 40px;
//       }
//     }
//     .content_bot_s {
//       ul {
//         overflow: hidden;
//         list-style: none;
//         margin: 0;
//         margin-left: 1%;

//         li {
//           float: left;
//           padding: 0 20px;
//           border-right: 1px solid white;
//           font-size: 14px;
//           cursor: pointer;
//         }
//         & :hover {
//           background-color: rgba(0, 119, 255, 0.986);
//         }
//         :last-child {
//           border-right: none;
//         }
//       }
//       @media screen and (max-width: 1366px) {
//         ul {
//           margin: 10px;
//         }
//       }
//     }
//     .time {
//       background-color: rgba(0, 119, 255, 0.986);
//     }
//   }
//   .main_view {
//     width: 95%;
//     // height: 724px;
//     padding-bottom: 4.3%;
//     margin: 1% auto 0;
//     // overflow: hidden;
//     display: flex;
//     justify-content: space-around;
//     .main_left {
//       width: 65%;
//       height: 90%;
//       // background: url("../assets/images/panel-l-t.png");
//       background-size: 100% 100%;
//       float: left;
//       .main_left_top {
//         color: white;
//         // background: url("../assets/images/title-bg.png");
//         background-size: 100% 100%;
//         text-align: center;
//         p {
//           margin: 0 2%;
//         }
//       }
//       .main_left_cen {
//         margin: 15px 0;
//       }
//       .main_left_cen_right {
//         padding: 1rem;
//       }
//     }
//     @media screen and (max-width: 1366px) {
//       .main_left {
//         height: 65vh;
//       }
//     }
//     .main_right {
//       width: 30%;
//       // height: 90%;
//       display: flex;
//       flex-direction: column;
//       div /deep/ .border-box-content {
//         display: flex;
//         flex-direction: column;
//         justify-content: space-around;
//         box-sizing: border-box;
//         .main_left_cen_right {
//         }
//       }
//       .main_left_top {
//         // margin-top: -8px;
//         // margin-bottom: 12px;
//         text-align: center;
//         p {
//           margin: 0 2%;
//           color: white;
//         }
//       }
//       .main_right_top {
//         width: 90%;
//         height: 55%;
//         margin: 0 auto;
//         padding: 1rem;
//       }
//       .main_right_bot {
//         width: 90%;
//         height: 20%;
//         margin: 0 auto;
//         color: white;
//         display: flex;
//         align-items: center;
//         .main_right_word {
//           width: 90%;
//           margin: 0 auto;
//           display: flex;
//           justify-content: space-between;
//           .main_right_count {
//             width: 45%;
//             :first-child {
//               text-align: center;
//               font-size: 14px;
//             }
//             :last-child {
//               text-align: center;
//               font-size: 22px;
//               font-weight: 700;
//             }
//           }
//           :first-child {
//             :last-child {
//               font-size: 22px;
//             }
//           }
//           @media screen and (max-width: 1366px) {
//             :first-child {
//               :last-child {
//                 font-size: 18px;
//               }
//             }
//           }
//         }
//       }
//     }
//     @media screen and (max-width: 1366px) {
//       .main_right {
//         .main_left_top {
//           margin-top: 5px;
//           margin-bottom: 8px;
//         }
//         .main_right_top {
//           height: 65%;
//           padding-top: 0;
//         }
//         .main_right_bot {
//           height: 100%;
//         }
//         .main_left_cen_right {
//           padding-top: 10px;
//         }
//       }
//     }
//   }
// }
</style>
