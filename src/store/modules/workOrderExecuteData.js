//state:储存初始化数据
const state = {
  //创建工单基础信息
  executeData:{'bath': {}, 'procedure': {}, 'workOrder': {}}
}
// getters:对数据进行过滤类似filter的作用
const getters = {}
// actions:处理Mutations中已经写好的方法 其直接触发方式是 this.$store.dispatch(actionName)
const actions = {}
// mutations:对数据进行计算的方法全部写在里面（类似computed） 在页面中触发时使用this.$store.commit('mutationName') 触发Mutations方法改变state的值
const mutations = {
  //改变创建工单批次
  setBath(state, data) {
    state.executeData.bath = data;
  },
  //改变创建工单工序
  setProcedure(state, data) {
    state.executeData.procedure = data;
  },
  //改变创建工单工单
  setWorkOrder(state, data) {
    state.executeData.workOrder = data;
  },
}
export default {
  namespaced: true, //同页面中引入getter、actions、mutations时，需要加上所属的模块名
  state,
  getters,
  actions,
  mutations
}
