//state:储存初始化数据
const state = {
  //公共的分页配置
  // 分页组件的page-sizes
  pageSizes: [10, 20, 30, 40, 50],
  // 分页组件的page-size
  pageSize: 10,
  list: [], //每页单独的分页参数
  pageNum: 1,
  total: 0,
}
// getters:对数据进行过滤类似filter的作用
const getters = {}
// actions:处理Mutations中已经写好的方法 其直接触发方式是 this.$store.dispatch(actionName)
const actions = {}
// mutations:对数据进行计算的方法全部写在里面（类似computed） 在页面中触发时使用this.$store.commit('mutationName') 触发Mutations方法改变state的值
const mutations = {
  //设置列表数据
  setListData(state, data) {
    state.list = data.planViewDTOs; //data.list数据data[]
    state.total = data.line; //data.total//数据总条数
  },
  //设置每页的信息量
  setPageSize(state, data) {
    state.pageSize = data;
  },
  //设置用户列表页列表当前页
  setPageNum(state, data) {
    state.pageNum = data;
  },
}
export default {
  namespaced: true,//同页面中引入getter、actions、mutations时，需要加上所属的模块名
  state,
  getters,
  actions,
  mutations
}
