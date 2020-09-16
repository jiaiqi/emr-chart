<template>
  <iframe :src="src" frameborder="0" class="iframe" :key="url"></iframe>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
  },
  computed: {
    src () {
      return window.location.origin + this.url
    }
  },
  mounted () {
    if (this.url) {
    }
  }
}
</script>

<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: calc(100% - 100px);
  margin: 0 auto;
}
</style>