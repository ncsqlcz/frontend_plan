import ProcessBasic from './ProcessBasic/index.js'
import Employee from './Employee/index.js'
import PlanOutline from './PlanOutline/index.js'
import Device from './Device/index.js'
import Warehouse from './Warehouse/index.js'
import Customer from './Customer/index.js'
import Counit from './Counit/index.js'
import QualityProject from './QualityProject/index.js'
import RejectCode from './RejectCode/index.js'
import CheckMethod from './CheckMethod/index.js'
import MeterialsName from './MeterialsName/index.js'
import QualityStandard from './QualityStandard/index.js'
import QualityAppliance from './QualityAppliance/index.js'

const components = [
  ProcessBasic,
  Employee,
  PlanOutline,
  Device,
  Warehouse,
  Customer,
  Counit,
  QualityProject,
  RejectCode,
  CheckMethod,
  MeterialsName,
  QualityStandard,
  QualityAppliance
]

const install = function (Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component)
  })
  // 选择工序
  Vue.prototype.$mesProcessBasic = ProcessBasic
  // 选择员工
  Vue.prototype.$mesEmployee = Employee
  // 选择工单，批次
  Vue.prototype.$mesPlanOutline = PlanOutline
  //选择设备
  Vue.prototype.$mesDevice = Device
  //选择仓库
  Vue.prototype.$mesWarehouse = Warehouse
  //选择客户
  Vue.prototype.$mesCustomer = Customer
  //外协单位
  Vue.prototype.$mesCounit = Counit
  //Iqc方案
  Vue.prototype.$mesQualityProject = QualityProject
  //不良代号
  Vue.prototype.$mesRejectCode = RejectCode
  //检验(测)方式
  Vue.prototype.$mesCheckMethod = CheckMethod
  //物料名称/原料名称
  Vue.prototype.$mesMeterialsName = MeterialsName
  //检测标准
  Vue.prototype.$mesQualityStandard = QualityStandard
  //检测工具
  Vue.prototype.$mesQualityAppliance = QualityAppliance
  
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

const modules = {
  version: '1.0.0',
  author: 'liuchuanzhong',
  install,
  ProcessBasic,
  Employee,
  PlanOutline,
  Device,
  Warehouse,
  Customer,
  Counit,
  QualityProject,
  RejectCode,
  CheckMethod,
  MeterialsName,
  QualityStandard,
  QualityAppliance
}

export default modules
