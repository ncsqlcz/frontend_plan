/*生产总览 api*/
import axios from 'axios'

export default {
    //查询生产计划视图
    queryPlanView: params => axios.post('/plan/plan/queryPlanView.do', params),
    //查询生产计划摘要
    queryPlanOutline: params => axios.post('/plan/plan/queryPlanOutline.do', params),
    //查询工单视图
    queryWorkOrderView: params => axios.post('/plan/plan/queryWorkOrderView.do', params),
    //查询工单摘要
    queryWorkOrderOutline: params => axios.post('/plan/plan/queryWorkOrderOutline.do', params),
    //查询工单详情
    queryWorkOrderParticulars: params => axios.post('/plan/plan/queryWorkOrderParticulars.do', params),
    //根据外键(生产计划id/工单id)查询生产过程记录
    queryProcessRecords: params => axios.post('/plan/plan/queryProcessRecords.do', params),
    //查询生产工艺路线
    queryProductionCraftPath: params => axios.post('/plan/plan/queryProductionCraftPath.do', params),
    //查询齐套分析（生产计划物料清单）
    queryResourceAllocation: params => axios.post('/plan/plan/queryResourceAllocation.do', params),
    //"生产单统计： 领料统计/补料统计/退料统计/ 产出统计/不良品统计/报废统计"
    productionUnitStatistics: params => axios.post('/plan/plan/productionUnitStatistics.do', params),
    //修改负责人
    updatePrincipals: params => axios.post('/plan/plan/updatePrincipals.do', params),
    //生产计划执行
    planExecute: params => axios.post('/plan/plan/planExecute.do', params),
    
    //新建生产执行单
    saveProductionUnit: params => axios.post('/plan/plan/saveProductionUnit.do', params),
    //生成生产计划批号(订单编号+时间(年月日)+当天的批次自增号)
    createPlanBatchNumber: params => axios.post('/plan/plan/createPlanBatchNumber.do', params),
    //保存生产计划基础信息
    savePlanBasic: params => axios.post('/plan/plan/savePlanBasic.do', params),
    //查询生产计划基础信息
    queryPlanBasic: params => axios.post('/plan/plan/queryPlanBasic.do', params),
    //生成工单号(生产批号+工单自增号)
    createWorkOrderNumber: params => axios.post('/plan/plan/createWorkOrderNumber.do', params),
    //生成生产单单号,规则：生产批次+执行代号+自增号
    createProductionUnitNumber: params => axios.post('/plan/plan/createProductionUnitNumber.do', params),
    //查询客户信息 （新建生产计划-基础数据）
    queryCustomerMsgs: params => axios.post('/plan/plan/queryCustomerMsgs.do', params),
    //查询外协单位信息（新建生产计划-生成工单）
    queryOutsourcingUnitMsgs: params => axios.post('/plan/plan/queryOutsourcingUnitMsgs.do', params),
    //重组工单
    workOrderRecombination: params => axios.post('/plan/plan/workOrderRecombination.do', params),
  
    /*生产单统计(生产协同/工单执行) api*/
    /*查询生产单详情 api*/
    //领料单/补料单/退料单/产出单/不良品单/报废单/ 外发单/外发补料单/回厂单/回厂退料单 
    queryProductionUnitParticulars: params => axios.post('/plan/plan/queryProductionUnitParticulars.do', params),
  
    /*查询生产单摘要 api*/
    //领料单/补料单/退料单/产出单/不良品单/报废/外发单/外发补料单/回厂单/回厂退料单
    queryProductionUnitOutline: params => axios.post('/plan/plan/queryProductionUnitOutline.do', params),
  
    /*我的工单 api*/
    //生成补工单单号(未关联生产计划时使用) (不需传参,只需调用)
    createSupplementWorkOrderNumber: () => axios.post('/plan/plan/createSupplementWorkOrderNumber.do'),
    //查询工单的员工记录
    queryStaffRecordByWorkOrder: params => axios.post('/plan/plan/queryStaffRecordByWorkOrder.do', params),
    //删除工单的员工记录
    removeStaffRecordByWorkOrder: params => axios.post('/plan/plan/removeStaffRecordByWorkOrder.do', params),
    //新增工单的员工记录
    saveStaffRecordByWorkOrder: params => axios.post('/plan/plan/saveStaffRecordByWorkOrder.do', params),
    //查询工单绑定的设备
    queryDevicesRecordByWorkOrder: params => axios.post('/plan/plan/queryDevicesRecordByWorkOrder.do', params),
    //删除工单绑定的设备
    removeDevicesRecordByWorkOrder: params => axios.post('/plan/plan/removeDevicesRecordByWorkOrder.do', params),
    //新增工单绑定的设备
    saveDevicesRecordByWorkOrder: params => axios.post('/plan/plan/saveDevicesRecordByWorkOrder.do', params),
    //查询生产工序材料清单，投放物料
    queryProductionProcessMaterialMenu: params => axios.post('/plan/plan/queryProductionProcessMaterialMenu.do', params),
    //查询工单的材料投放记录
    queryMaterialPutInRecordByWorkOrder: params => axios.post('/plan/plan/queryMaterialPutInRecordByWorkOrder.do', params),
    //添加工单的材料投放记录
    saveMaterialPutInRecordByWorkOrder: params => axios.post('/plan/plan/saveMaterialPutInRecordByWorkOrder.do', params),
    //删除工单的材料投放记录
    removeMaterialPutInRecordByWorkOrder: params => axios.post('/plan/plan/removeMaterialPutInRecordByWorkOrder.do', params),
    //查询生产工艺参数列表
    queryProductionCraftParameters: params => axios.post('/plan/plan/queryProductionCraftParameters.do', params),
    //查询工单的工艺参数记录
    queryCraftParameterRecordByWorkOrder: params => axios.post('/plan/plan/queryCraftParameterRecordByWorkOrder.do', params),
    //删除工单的工艺参数记录
    removeCraftParameterRecordByWorkOrder: params => axios.post('/plan/plan/removeCraftParameterRecordByWorkOrder.do', params),
    //添加工单的工艺参数记录
    saveCraftParameterRecordByWorkOrder: params => axios.post('/plan/plan/saveCraftParameterRecordByWorkOrder.do', params),
    // 查询工序列表
    queryProcessMsgs: params => axios.post('/plan/plan/queryProcessMsgs.do', params),
    // 查询员工列表
    queryUserEmployeesMsgs: params => axios.post('/plan/plan/queryUserEmployeesMsgs.do', params),
    // 查询生产批次
    queryPlanOutline: params => axios.post('/plan/plan/queryPlanOutline.do', params),
    // 查询设备信息
    queryDeviceMsgs: params => axios.post('/plan/plan/queryDeviceMsgs.do', params),
    //查询仓储信息
    queryWarehouseMsgs: params => axios.post('/plan/plan/queryWarehouseMsgs.do', params),
    //查询齐套分析(工单),根据工序下的物料信息及排产量计算
    queryResourceAllocationByWorkOrder: params => axios.post('/plan/plan/queryResourceAllocationByWorkOrder.do', params),
    //新建补工单(计划外派工)
    createSupplementWorkOrder: params => axios.post('/plan/plan/createSupplementWorkOrder.do', params),
    //工单执行
    workOrderExecute: params => axios.post('/plan/plan/workOrderExecute.do', params),
  
  
    /*工单执行 api*/
    //查询生产计划摘要(工单执行)
    queryPlanOutlineByWorkOrderExecute: params => axios.post('/plan/plan/queryPlanOutlineByWorkOrderExecute.do', params),
    //查询生产工艺路线(工单执行)
    queryProductionCraftPathByWorkOrderExecute: params => axios.post('/plan/plan/queryProductionCraftPathByWorkOrderExecute.do', params),
    //查询工单摘要(工单执行)
    queryWorkOrderOutlineByWorkOrderExecute: params => axios.post('/plan/plan/queryWorkOrderOutlineByWorkOrderExecute.do', params),
    //新建生产材料执行单
    saveMaterialsUnit: params => axios.post('/plan/plan/saveMaterialsUnit.do', params),
    //查询材料清单(领料)
    queryMaterialByPickingUnit: params => axios.post('/plan/plan/queryMaterialByPickingUnit.do', params),
    //查询材料清单(补料)
    queryMaterialByMaterialsSupplementUnit: params => axios.post('/plan/plan/queryMaterialByMaterialsSupplementUnit.do', params),
    //查询材料清单(退料)
    queryMaterialByMaterialsReturnedUnit: params => axios.post('/plan/plan/queryMaterialByMaterialsReturnedUnit.do', params),
    //生成生产单单号,规则：生产批次+执行代号+自增号
    createProductionUnitNumber: params => axios.post('/plan/plan/createProductionUnitNumber.do', params),
    //删除生产材料执行单
    removeMaterialsUnit: params => axios.post('/plan/plan/removeMaterialsUnit.do', params),
    //删除生产产物执行单
    removeProductionUnit: params => axios.post('/plan/plan/removeProductionUnit.do', params),
  }