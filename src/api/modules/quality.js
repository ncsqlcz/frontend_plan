import axios from 'axios'
export default {
   /*品质计划 api*/ 
   //查看检测计划信息，详情
   queryQualityPlan: params => axios.post('/m2_quality/quality/queryQualityPlan.do', params),
   //查询检测计划的修改历史
   queryPlanUpdateHistory: params => axios.post('/m2_quality/quality/queryPlanUpdateHistory.do', params),
   //编辑计划的负责人
   updateQualityPlan: params => axios.post('/m2_quality/quality/updateQualityPlan.do', params),
   //删除计划
   deleteQualityPlan: params => axios.post('/m2_quality/quality/deleteQualityPlan.do', params),
   //查询物料信息
   queryMaterial: params => axios.post('/warehouse/warehouseManage/materialBasic/queryMaterial.do', params),
   //在计划里修改报告的名字和负责人
   updateReportInPlan: params => axios.post('/m2_quality/quality/updateReportInPlan.do', params),
   //新增检测计划
   saveQualityPlan: params => axios.post('/m2_quality/quality/saveQualityPlan.do', params),

   /*品质报告 api*/
   //查看检测报告信息，详情
   queryQualityReport: params => axios.post('/m2_quality/quality/queryQualityReport.do', params),

   /*品质方案 api*/ 
   //查看检测方案信息，详情
   queryQualityTemplate: params => axios.post('/m2_quality/quality/queryQualityTemplate.do', params),
   //新增检测方案基础信息
   saveQualityTemplate: params => axios.post('/m2_quality/quality/saveQualityTemplate.do', params),

  /*品质投诉 api*/
  //查询品质投诉信息
  queryQualityComplain: params => axios.post('/m2_quality/quality/queryQualityComplain.do', params),
  //删除品质投诉
  deleteQualityComplain: params => axios.post('/m2_quality/quality/deleteQualityComplain.do', params),
  //新增品质投诉
  saveQualityComplain: params => axios.post('/m2_quality/quality/saveQualityComplain.do', params),
  //生成检测计划，检测报告，投诉编号
  generateNumber: params => axios.post('/m2_quality/quality/generateNumber.do', params),
  //查看不良代号信息，详情
  queryQualityUnqualified: params => axios.post('/m2_quality/quality/queryQualityUnqualified.do', params),
  //编辑品质投诉
  updateQualityComplain: params => axios.post('/m2_quality/quality/updateQualityComplain.do', params),

 

  /*品质基础数据 api*/
  //新增检测类型
  saveQualityProjectType: params => axios.post('/m2_quality/quality/saveQualityProjectType.do', params),
  //删除检测类型
  deleteQualityProjectType: params => axios.post('/m2_quality/quality/deleteQualityProjectType.do', params),
  //修改检测类型
  updateQualityProjectType: params => axios.post('/m2_quality/quality/updateQualityProjectType.do', params),
  //查看检测类型
  queryQualityProjectType: params => axios.post('/m2_quality/quality/queryQualityProjectType.do', params),

  //新增检测方式
  saveQualityCheckMethod: params => axios.post('/m2_quality/quality/saveQualityCheckMethod.do', params),
  //删除检测方式
  deleteQualityCheckMethod: params => axios.post('/m2_quality/quality/deleteQualityCheckMethod.do', params),
  //修改检测方式
  updateQualityCheckMethod: params => axios.post('/m2_quality/quality/updateQualityCheckMethod.do', params),
  //查看检测方式信息，详情
  queryQualityCheckMethod: params => axios.post('/m2_quality/quality/queryQualityCheckMethod.do', params),

  //新增检测工具
  saveQualityAppliance: params => axios.post('/m2_quality/quality/saveQualityAppliance.do', params),
  //删除检测工具
  deleteQualityAppliance: params => axios.post('/m2_quality/quality/deleteQualityAppliance.do', params),
  //修改检测工具
  updateQualityAppliance: params => axios.post('/m2_quality/quality/updateQualityAppliance.do', params),
  //查看检测工具信息，详情
  queryQualityAppliance: params => axios.post('/m2_quality/quality/queryQualityAppliance.do', params),

  //新增不良品
  saveQualityUnqualified: params => axios.post('/m2_quality/quality/saveQualityUnqualified.do', params),
  //删除不良品
  deleteQualityUnqualified: params => axios.post('/m2_quality/quality/deleteQualityUnqualified.do', params),
  //修改不良品
  updateQualityUnqualified: params => axios.post('/m2_quality/quality/updateQualityUnqualified.do', params),
  //查看不良品信息，详情
  queryQualityUnqualified: params => axios.post('/m2_quality/quality/queryQualityUnqualified.do', params),

  //新增检测项目
  saveQualityProject: params => axios.post('/m2_quality/quality/saveQualityProject.do', params),
  //删除检测项目
  deleteQualityProject: params => axios.post('/m2_quality/quality/deleteQualityProject.do', params),
  //编辑检测项目
  updateQualityProject: params => axios.post('/m2_quality/quality/updateQualityProject.do', params),
  //查询检测项目
  queryQualityProject: params => axios.post('/m2_quality/quality/queryQualityProject.do', params),

  //新增检测标准
  saveQualityStandard: params => axios.post('/m2_quality/quality/saveQualityStandard.do', params),
  //删除检测标准
  deleteQualityStandard: params => axios.post('/m2_quality/quality/deleteQualityStandard.do', params),
  //编辑检测标准
  updateQualityStandard: params => axios.post('m2_quality/quality/updateQualityStandard.do', params),
  //查看检测标准
  queryQualityStandard: params => axios.post('/m2_quality/quality/queryQualityStandard.do', params),
  }