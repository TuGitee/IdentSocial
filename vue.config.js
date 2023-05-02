const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  lintOnSave: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  devServer: {
    port: 8080,
    hot: true,
    https: false,
    open: true,
  }
})
