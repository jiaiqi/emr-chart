import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/navs"
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/login.vue")
    },
    {
      path: "/onecard",
      name: "onecard",
      component: () =>
        import(/* webpackChunkName: "onecard" */ "./views/onecard.vue")
    },
    {
      path: "/platform",
      name: "platform",
      component: () =>
        import(/* webpackChunkName: "platform" */ "./views/platform.vue")
    },
    {
      path: "/datacenter",
      name: "datacenter",
      component: () =>
        import(/* webpackChunkName: "datacenter" */ "./views/datacenter.vue")
    },
    {
      path: "/secplat",
      name: "secplat",
      component: () =>
        import(/* webpackChunkName: "secplat" */ "./views/secplat.vue")
    },
    {
      path: "/navs",
      name: "navs",
      component: () => import(/* webpackChunkName: "navs" */ "./views/navs.vue")
    },
    {
      path: "/onecardHome",
      name: "onecardHome",
      component: () =>
        import(/* webpackChunkName: "onecardHome" */ "./views/onecardHome.vue")
    },
    {
      path: "/platformHome",
      name: "platformHome",
      component: () =>
        import(
          /* webpackChunkName: "platformHome" */ "./views/platformHome.vue"
        )
    },
    {
      path: "/datacenterHome",
      name: "datacenterHome",
      component: () =>
        import(
          /* webpackChunkName: "datacenterHome" */ "./views/datacenterHome.vue"
        )
    },
    {
      path: "/debugging",
      name: "debugging",
      component: () =>
        import(/* webpackChunkName: "debugging" */ "./views/debugging.vue")
    },
    {
      path: "/viewData/:num/:proc",
      name: "viewData",
      component: () =>
        import(/* webpackChunkName: "debugging" */ "./views/viewData.vue")
    },
    {
      path: "/viewPort",
      name: "viewPort",
      component: () =>
        import(/* webpackChunkName: "debugging" */ "./views/viewPort.vue")
    },
    {
      path: "/serveNum",
      name: "serveNum",
      component: () =>
        import(/* webpackChunkName: "debugging" */ "./views/serveNum.vue")
    },
    {
      // path: '/listdemo',
      path: "/listdemo/:app/:serveice/:modelId",
      name: "listdemo",
      component: () =>
        import(
          /* webpackChunkName: "listdemo" */ "./views/dataAnalysis/dataModel/eidtor.vue"
        )
    },
    {
      path: "/preview/:modelId",
      name: "preview",
      component: () =>
        import(
          /* webpackChunkName: "preview" */ "./views/dataAnalysis/dataModel/preview.vue"
        )
    },
    {
      path: "/dataChartPreview/:chartNumber",
      name: "dataChartPreview",
      component: () =>
        import(
          /* webpackChunkName: "preview" */ "./views/dataAnalysis/dataChart/preview.vue"
        )
    },
    {
      path: "/dataChartEditor/:chartNumber",
      name: "dataChartEditor",
      component: () =>
        import(
          /* webpackChunkName: "preview" */ "./views/dataAnalysis/dataChart/editor.vue"
        )
    },
    {
      path: "/dataStat",
      name: "dataStatistics", //数据统计
      component: () =>
        import( /* webpackChunkName: "preview" */ "./views/dataAnalysis/dataStatistics/index.vue")
    },
    {
      path: "/tableData/:tableNo",
      name: "tableData",
      component: () =>
        import( /* webpackChunkName: "preview" */ "./views/dataAnalysis/tableData/tableData.vue")
    },
  ]
});

export default router;
