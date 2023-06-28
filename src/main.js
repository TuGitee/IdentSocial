import Vue from 'vue'
import App from './App.vue'

import store from './store'

import router from "./router"

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import VueTouch from 'vue-touch'
Vue.use(VueTouch, {name: 'v-touch'})

Vue.config.productionTip = false

import '@/mock/mockServe'

let options = {
  fullscreenEl: false, //关闭全屏按钮
  shareEl: false, //关闭分享按钮
  zoomEl: false, //关闭缩放按钮
  counterEl: false, //关闭左下角数字
  tapToClose: true, //点击关闭
  clickToCloseNonZoomable: false, //点击关闭非缩放图片
  closeEl: false, //关闭右上角关闭按钮
  showAnimationDuration: 0, //显示动画时间
  hideAnimationDuration: 500, //隐藏动画时间
}
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview,options)

import axios from 'axios';
Vue.prototype.$axios = axios.create({
  baseURL: 'http://47.120.2.219:16998/',
  timeout: 5000
})

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
