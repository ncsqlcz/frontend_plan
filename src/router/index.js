import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
//MES的模板
import mesLayout from '@/views/layout'
//基础数据框架
import baseData from '@/views/baseData/index'
export const constantRouterMap = [{
    path: '/',
    // redirect: '/login',
    component: () =>
      import ('@/views/login/login'),
    // hidden: true
  },
  {
    path: '/404',
    component: () =>
      import ('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () =>
      import ('@/views/errorPage/401'),
    hidden: true
  },
  //生产协同
  // {
  //   path: '/productionSynergy',
  //   component: mesLayout,
  //   children: [{
  //       path: '/productionSynergy',
  //       redirect: '/productionSynergy/allProduction',
  //     },
  //     {
  //       path: '/productionSynergy/:page',
  //       components: {
  //         'allProduction': () =>
  //           import ('@/views/productionSynergy/allProduction'),
  //         'process': () =>
  //           import ('@/views/productionSynergy/process'),
  //         'produtionPlan': () =>
  //           import ('@/views/productionSynergy/produtionPlan'),
  //         'addPlan': () =>
  //         import ('@/views/productionSynergy/children/addPlan'),
  //         'myWorkOrder': () =>
  //           import ('@/views/productionSynergy/myWorkOrder'),
  //         'workOrderExecute': () =>
  //           import ('@/views/productionSynergy/workOrderExecute')
  //       }
  //     }
  //   ]
  // },
  {
    path: '/productionSynergy',
    name: '生产协同',
    component: mesLayout,
    redirect: '/productionSynergy/allProduction',
    children: [{
        path: '/productionSynergy/allProduction',
        name: '生产协同/生产总览',
        component: () =>
          import ('@/views/productionSynergy/productionPlan')
      },
      {
        path: '/productionSynergy/process',
        name: '生产协同/我的生产计划/生产工序',
        component: () =>
          import ('@/views/productionSynergy/process')
      },
      {
        path: '/productionSynergy/productionPlan',
        name: '生产协同/我的生产计划',
        component: () =>
          import ('@/views/productionSynergy/productionPlan')
      },
      {
        path: '/productionSynergy/productionPlan/addPlan',
        name: '生产协同/我的生产计划/创建生产计划',
        component: () =>
          import ('@/views/productionSynergy/children/addPlan')
      },
      {
        path: '/productionSynergy/myWorkOrder',
        name: '生产协同/我的工单',
        component: () =>
          import ('@/views/productionSynergy/myWorkOrder')
      },
      {
        path: '/productionSynergy/workOrderExecute',
        name: '生产协同/工单执行',
        component: () =>
          import ('@/views/productionSynergy/workOrderExecute')
      },
      {
        path: '/productionSynergy/addWorkOrder',
        name: '生产协同/工单执行/创建工单',
        component: () =>
          import ('@/views/productionSynergy/children/addWorkOrder')
      },
      {
        path: '/productionSynergy/productionPath',
        name: '生产协同/生产路径',
        component: () =>
          import ('@/views/productionSynergy/productionPath')
      },
      {
        path: '/productionSynergy/productionPath/createPath',
        name: '生产协同/生产路径/创建路径',
        component: () =>
          import ('@/views/productionSynergy/children/createPath')
      },
    ]
  },
  //品质管理
  {
    path: '/qualityControl',
    component: mesLayout,
    name: '品质管理',
    redirect: '/qualityControl/detectionPlan',
    children: [{
        path: '/qualityControl/detectionPlan',
        name: '品质管理/检测计划',
        component: () =>
          import ('@/views/qualityControl/detectionPlan')
      },
      {
        path: '/qualityControl/detectionReport',
        name: '品质管理/检测报告',
        component: () =>
          import ('@/views/qualityControl/detectionReport')
      },
      {
        path: '/qualityControl/detectionCase',
        name: '品质管理/检测方案',
        component: () =>
          import ('@/views/qualityControl/detectionCase')
      },
      {
        path: '/qualityControl/qualityComplain',
        name: '品质管理/品质投诉',
        component: () =>
          import ('@/views/qualityControl/qualityComplain')
      },
      {
        path: '/qualityControl/qualityBaseData',
        name: '品质管理/品质基本数据',
        component: () =>
          import ('@/views/qualityControl/qualityBaseData')
      }
    ]
  },
  //工艺管理
  {
    path: '/craftControl',
    component: mesLayout,
    name: '工艺管理',
    children: [{
        path: '/craftControl/overview',
        name: '工艺管理/工艺概览',
        component: () =>
          import ('@/views/craftControl/overview')
      },
      {
        path: '/craftControl/pathManage',
        name: '工艺管理/工艺路径管理',
        component: () =>
          import ('@/views/craftControl/pathManage')
      },
      {
        path: '/craftControl/pathFlowChart',
        name: '工艺管理/工艺路径流程图',
        component: () =>
          import ('@/views/craftControl/pathFlowChart')
      },

    ]
  },
  //基础数据
  {
    path: '/baseData',
    component: mesLayout,
    name: '基础数据',
    children: [{
      path: '/baseData/production',
      name: '基础数据/生产&工艺',
      component: baseData,
      children: [{
          path: '/baseData/production/projectCode',
          name: '基础数据/生产&工艺/项目代码',
          component: () =>
            import ('@/views/baseData/production/projectCode')
        },
        {
          path: '/baseData/production/rejectsCode',
          name: '基础数据/生产&工艺/不良品代码',
          component: () =>
            import ('@/views/baseData/production/rejectsCode')
        },
        {
          path: '/baseData/production/factoryCalendar',
          name: '基础数据/生产&工艺/工厂日历',
          component: () =>
            import ('@/views/baseData/production/factoryCalendar')
        }
      ]
    }, {
      path: '/baseData/quality',
      name: '基础数据/品质',
      component: baseData,
      children: [{
          path: '/baseData/quality/project',
          name: '基础数据/品质/检测项目',
          component: () =>
            import ('@/views/baseData/quality/project')
        },
        {
          path: '/baseData/quality/type',
          name: '基础数据/品质/检测类型',
          component: () =>
            import ('@/views/baseData/quality/type')
        },
        {
          path: '/baseData/quality/standard',
          name: '基础数据/品质/检测标准',
          component: () =>
            import ('@/views/baseData/quality/standard')
        },
        {
          path: '/baseData/quality/way',
          name: '基础数据/品质/检测方式',
          component: () =>
            import ('@/views/baseData/quality/way')
        },
        {
          path: '/baseData/quality/tool',
          name: '基础数据/品质/检测工具',
          component: () =>
            import ('@/views/baseData/quality/tool')
        },
        {
          path: '/baseData/quality/rejects',
          name: '基础数据/品质/品质不良品代码',
          component: () =>
            import ('@/views/baseData/quality/rejects')
        }
      ]
    }, {
      path: '/baseData/material',
      name: '基础数据/物料',
      component: baseData,
      children: [{
          path: '/baseData/material/bProduct',
          name: '基础数据/物料/半成品',
          component: () =>
            import ('@/views/baseData/material/bProduct')
        },
        {
          path: '/baseData/material/sProduct',
          name: '基础数据/物料/成品',
          component: () =>
            import ('@/views/baseData/material/sProduct')
        },
        {
          path: '/baseData/material/rawMaterial',
          name: '基础数据/物料/原料',
          component: () =>
            import ('@/views/baseData/material/rawMaterial')
        },
        {
          path: '/baseData/material/supplier',
          name: '基础数据/物料/供应商',
          component: () =>
            import ('@/views/baseData/material/supplier')
        },
        {
          path: '/baseData/material/unit',
          name: '基础数据/物料/单位',
          component: () =>
            import ('@/views/baseData/material/unit')
        }
      ]
    }, {
      path: '/baseData/hr',
      name: '基础数据/人力资源',
      component: baseData,
      children: [{
          path: '/baseData/hr/staff',
          name: '基础数据/人力资源/员工',
          component: () =>
            import ('@/views/baseData/hr/staff')
        },
        {
          path: '/baseData/hr/post',
          name: '基础数据/人力资源/职位',
          component: () =>
            import ('@/views/baseData/hr/post')
        },
        {
          path: '/baseData/hr/classes',
          name: '基础数据/人力资源/班次',
          component: () =>
            import ('@/views/baseData/hr/classes')
        }
      ]
    }, {
      path: '/baseData/modeling',
      name: '基础数据/工厂建模',
      component: baseData,
      children: [{
          path: '/baseData/modeling/workshop',
          name: '基础数据/工厂建模/车间',
          component: () =>
            import ('@/views/baseData/modeling/workshop')
        },
        {
          path: '/baseData/modeling/productionLine',
          name: '基础数据/工厂建模/产线',
          component: () =>
            import ('@/views/baseData/modeling/productionLine')
        }
      ]
    }, ]
  },

  //系统设置
  {
    path: '/systemSetup',
    component: mesLayout,
    name: '系统设置',
    children: [{
      path: '/systemSetup/factoryCalendar',
      name: '系统设置/工厂日历',
      component: () =>
        import ('@/views/systemSetup/factoryCalendar')
    }]
  }
]
export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
