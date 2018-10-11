//路由分类
export default [{
    name: 'productionSynergy',
    title: '', //分组标题
    text: '生产协同',
    icon: 'el-icon--custom png-menu-1',
    childGroup: [{
        name: 'allProduction',
        text: '生产总览',
        leaf: false
      },
      {
        name: 'productionPlan',
        text: '我的生产计划',
        leaf: false
      },
      {
        name: 'myWorkOrder',
        text: '我的工单',
        leaf: false,
      },
      {
        name: 'workOrderExecute',
        text: '工单执行',
        leaf: false,
      },
      {
        name: 'productionPath',
        text: '生产路径',
        leaf: false,
      }
    ]
  }, {
    name: 'qualityControl',
    title: '',
    text: '品质管理',
    icon: 'el-icon--custom png-menu-2',
    childGroup: [{
        name: 'detectionPlan',
        text: '检测计划',
        leaf: false,
      },
      {
        name: 'detectionReport',
        text: '检测报告',
        leaf: false,
      },
      {
        name: 'detectionCase',
        text: '检测方案',
        leaf: false,
      },
      {
        name: 'qualityComplain',
        text: '品质投诉',
        leaf: false,
      },
      {
        name: 'qualityBaseData',
        text: '品质基础数据',
        leaf: false,
      }
    ]
  },
  {
    name: 'craftControl',
    title: '',
    text: '工艺管理',
    icon: 'el-icon--custom png-menu-3',
    childGroup: [{
      name: 'overview',
      text: '工艺概览',
      leaf: false,
    }, {
      name: 'pathManage',
      text: '工艺路径管理',
      leaf: false,
    }, {
      name: 'pathFlowChart',
      text: '工艺路径流程图',
      leaf: false
    }]
  },
  {
    name: 'equipmentManagement',
    title: '',
    text: '设备管理',
    icon: 'el-icon--custom png-menu-4',
  },
  {
    name: 'inventoryManagement',
    title: '',
    text: '库存管理',
    icon: 'el-icon--custom png-menu-5',
  },
  {
    name: 'TracesQuery',
    title: '',
    text: '追溯查询',
    icon: 'el-icon--custom png-menu-6',
  },
  {
    name: 'dataChart',
    title: '',
    text: '数据看板',
    icon: 'el-icon--custom png-menu-7',
  },
  {
    name: 'customerManagement',
    title: '',
    text: '客商管理',
    icon: 'el-icon--custom png-menu-8',
  },
  {
    name: 'monitoringWarning',
    title: '',
    text: '监测预警',
    icon: 'el-icon--custom png-menu-9',
  },
  {
    name: 'baseData',
    title: '',
    text: '基础数据',
    icon: 'el-icon--custom png-menu-9',
    childGroup: [{
        name: 'production',
        text: '生产&工艺',
        leaf: true,
        childGroup: [{
          name: 'projectCode',
          text: '项目代码',
          leaf: false
        }, {
          name: 'rejectsCode',
          text: '生产不良品代码',
          leaf: false
        }, {
          name: 'factoryCalendar',
          text: '工厂日历',
          leaf: false
        }]
      },
      {
        name: 'quality',
        text: '品质',
        leaf: true,
        childGroup: [{
          name: 'type',
          text: '检测类型',
          leaf: false
        }, {
          name: 'project',
          text: '检测项目',
          leaf: false
        }, {
          name: 'standard',
          text: '检测标准',
          leaf: false
        }, {
          name: 'way',
          text: '检测方式',
          leaf: false
        }, {
          name: 'tool',
          text: '检测工具',
          leaf: false
        }, {
          name: 'rejects',
          text: '品质不良品代码',
          leaf: false
        }]
      },
      {
        name: 'equipment',
        text: '设备',
        leaf: true,
        childGroup: [{
          name: 'XX',
          text: "XXXX",
          leaf: false
        }]
      },
      {
        name: 'material',
        text: '物料',
        leaf: true,
        childGroup: [{
          name: 'rawMaterial',
          text: '原料',
          leaf: false
        }, {
          name: 'bProduct',
          text: '半成品',
          leaf: false
        }, {
          name: 'sProduct',
          text: '成品',
          leaf: false
        }, {
          name: 'supplier',
          text: '供应商',
          leaf: false
        }, {
          name: 'unit',
          text: '单位',
          leaf: false
        }]
      },
      {
        name: 'hr',
        text: '人力资源',
        leaf: true,
        childGroup: [{
          name: 'staff',
          text: '员工',
          leaf: false
        }, {
          name: 'post',
          text: '职位',
          leaf: false
        }, {
          name: 'classes',
          text: '班次',
          leaf: false
        }]
      },
      {
        name: 'modeling',
        text: '工厂建模',
        leaf: true,
        childGroup: [{
          name: 'workshop',
          text: '车间',
          leaf: false
        }, {
          name: 'productionLine',
          text: '产线',
          leaf: false
        }]
      },
    ]
  },
 
  {
    name: 'systemSetup',
    title: '',
    text: '系统设置',
    icon: 'el-icon--custom png-menu-9',
    childGroup: [{
      name: 'factoryCalendar',
      text: '工厂日历',
      leaf: false
    }]
  }
]
