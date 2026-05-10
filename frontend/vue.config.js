const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    client: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8084', // 后端服务器地址
        ws: true,
        changeOrigin: true,
        secure: true,
        pathRewrite: {'^/api': ''},
      }
    }
  },
  configureWebpack: {
    devtool: "source-map"
  }
})
