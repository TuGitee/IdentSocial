const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  lintOnSave: false,
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  devServer: {
    port: 8080,
    hot: true
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/css/color.less'),
      ]
    }
  },
  configureWebpack: {
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].[chunkhash].js'
    },
    experiments: {
      topLevelAwait: true
    }
  }
})
