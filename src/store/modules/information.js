//state:储存初始化数据
const state = {
  // 加载中显示的文字
  loadingText: "拼命加载中...",
  //公共的分页配置
  // 分页组件的page-sizes
  pageSizes: [10, 20, 30, 40, 50],
  // 分页组件的page-size
  pageSize: 10,

  list: [], //每页单独的分页参数
  pageNum: 1,
  total: 0,
  message: {
    title: '你代码', //标题
    abstract: '', //摘要
    body: '' //正文
  }
}
// getters:对数据进行过滤类似filter的作用
const getters = {}
// actions:处理Mutations中已经写好的方法 其直接触发方式是 this.$store.dispatch(actionName)
const actions = {}
// mutations:对数据进行计算的方法全部写在里面（类似computed） 在页面中触发时使用this.$store.commit('mutationName') 触发Mutations方法改变state的值
const mutations = {
  /** 
   * 设置每页信息数量
   */
  setPageSize(state, data) {
    state.pageSize = data;
  },
  //设置用户列表数据
  setInformationList(state, data) {
    state.list = data.list; //data.list数据data[]
    state.total = data.total; //data.total//数据总条数
  },
  //设置用户列表页列表当前页
  setInformationPageNum(state, data) {
    state.pageNum = data;
  },
  //设置消息
  setMessage(state, data) {
    state.message = data;
  },
  //清空发布消息列表数据
  clearMessage(state, data) {
    state.message = {};
  }
}
export default {
  namespaced: true, //同页面中引入getter、actions、mutations时，需要加上所属的模块名
  state,
  getters,
  actions,
  mutations
}
