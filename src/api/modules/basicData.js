/*基础数据 api*/
import axios from 'axios'
export default {
    /*工厂日历 api*/
    //查询工作日列表
    queryWorkDayAbstract: params => axios.post('/m2_system/queryWorkDayAbstract.do', params),
    //查询工作日详情
    queryWorkDayDetails: params => axios.post('/m2_system/queryWorkDayDetails.do', params),
    //新增工作日
    saveWorkDay: params => axios.post('/m2_system/saveWorkDay.do', params),
    //修改工作日
    modifyWorkDay: params => axios.post('/m2_system/modifyWorkDay.do', params),
    //删除工作日
    removeWorkDay: params => axios.post('/m2_system/removeWorkDay.do', params),
    //查询工作日名称
    queryWorkDayName: params => axios.post('/m2_system/queryWorkDayName.do', params),
    //修改工作日类型
    modifyWorkDayType: params => axios.post('/m2_system/modifyWorkDayType.do', params),
  }