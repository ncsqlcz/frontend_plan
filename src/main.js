// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css
import MesDialogUI from './components/dialog/index'
//引入封装的工具类和方法
import { setAjaxHeader, ajax } from './utils/ajax'
import loadjs from './utils/loadjs'
import work from './utils/work'
Vue.prototype.ajax = ajax
Vue.prototype.loadjs = loadjs
//业务方法
Vue.prototype.work=work
//设置请求头
Vue.prototype.setAjaxHeader=setAjaxHeader
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(MesDialogUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
