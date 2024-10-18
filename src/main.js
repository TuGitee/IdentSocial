import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from "./router"
import ElementUI from 'element-ui';
import './css/element/index.css';
import longpress from './directives/longpress';
import VueTouch from 'vue-touch';
import preview from 'vue-photo-preview';
import 'vue-photo-preview/dist/skin.css';
import "./utils/checkUpdate";
import "@/mock/index";
import "@/ws/index";
Vue.use(ElementUI);
Vue.use(VueTouch, { name: 'v-touch' });
Vue.directive('longpress', longpress);

const options = {
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
Vue.use(preview, options)

import './utils/messageOffset';

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
