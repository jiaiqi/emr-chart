import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/navs'
    },
    {
      path: "/login",
      name: "login",
      component: () => import( /* webpackChunkName: "login" */ "./views/login.vue")
    },
    {
      path: "/onecard",
      name: "onecard",
      component: () => import( /* webpackChunkName: "onecard" */ "./views/onecard.vue")
    },
    {
      path: "/platform",
      name: "platform",
      component: () =>
        import( /* webpackChunkName: "platform" */ "./views/platform.vue")
    },
    {
      path: "/datacenter",
      name: "datacenter",
      component: () =>
        import( /* webpackChunkName: "datacenter" */ "./views/datacenter.vue")
    },
    {
      path: "/secplat",
      name: "secplat",
      component: () =>
        import( /* webpackChunkName: "secplat" */ "./views/secplat.vue")
    },
    {
      path: "/navs",
      name: "navs",
      component: () =>
        import( /* webpackChunkName: "navs" */ "./views/navs.vue")
    },{
      path: "/onecardHome",
      name: "onecardHome",
      component: () =>
        import( /* webpackChunkName: "onecardHome" */ "./views/onecardHome.vue")
    },{
      path: "/platformHome",
      name: "platformHome",
      component: () =>
        import( /* webpackChunkName: "platformHome" */ "./views/platformHome.vue")
    },{
      path: "/datacenterHome",
      name: "datacenterHome",
      component: () =>
        import( /* webpackChunkName: "datacenterHome" */ "./views/datacenterHome.vue")
    },
    {
      path: '/debugging',
      name: 'debugging',
      component: () =>
      import( /* webpackChunkName: "debugging" */ "./views/debugging.vue")
    },
    {
      path: '/vChartView',
      name: 'vChartView',
      component: () =>
      import( /* webpackChunkName: "vChartView" */ "./views/vChartView.vue")
    }
  ]
});

export default router;
