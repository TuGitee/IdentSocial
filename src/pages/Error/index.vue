<template>
  <el-empty :description="msg">
    <router-link to="/">
      <el-button type="primary">
        Back to Home
      </el-button>
    </router-link>
  </el-empty>
</template>

<script>
export default {
  data() {
    return {
      msg: `Error! Can't find the page of ${this.$route.path} !`
    }
  }
}
</script>