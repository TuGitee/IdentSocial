const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  lintOnSave: false,
  // devServer: {
  //   host: "192.168.1.143",
  //   // host: "192.168.31.183",
  //   port: 8080,
  //   hot: true,
  //   https: false,
  //   open: true,
  // }

})
