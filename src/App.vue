<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data () {
    return {};
  },
  components: {},
  mounted () {
    window.document.title = "延安市社保医疗一体化服务平台";
  }
};
</script>

<style lang="scss">
@media screen and (max-width: 1366px) {
  html {
    font-size: 12px;
  }
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: #eee;
  height: 100%;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.el-pagination button:disabled,
.el-pager li,
.btn-next,
.btn-prev {
  background: transparent !important;
}
.el-pagination {
  color: #eee;
}
</style>

