//state:储存初始化数据
const state = {
  // 甘特图时间段
  intervalOptions: [
    {
      value: 3,
      label: "3小时"
    },
    {
      value: 6,
      label: "6小时"
    },
    {
      value: 8,
      label: "8小时"
    },
    {
      value: 12,
      label: "12小时"
    },
    {
      value: 24,
      label: "24小时"
    }
  ],
}
// getters:对数据进行过滤类似filter的作用
const getters = {
  intervalOptions: state => state.intervalOptions
}
// actions:处理Mutations中已经写好的方法 其直接触发方式是 this.$store.dispatch(actionName)
const actions = {}
// mutations:对数据进行计算的方法全部写在里面（类似computed） 在页面中触发时使用this.$store.commit('mutationName') 触发Mutations方法改变state的值
const mutations = {}
export default {
  namespaced: true,//同页面中引入getter、actions、mutations时，需要加上所属的模块名
  state,
  getters,
  actions,
  mutations
}