import Vue from 'vue'
import Vuex from 'vuex'
//各个模块的vuex
import production from './modules/production'
import product from './modules/product'
import information from './modules/information'
import workOrderExecuteData from './modules/workOrderExecuteData'
//getters
import getters from './getters'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    production,
    product,
    information,
    workOrderExecuteData
  },
  getters
})
export default store