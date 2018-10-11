/*
 * @Author: liucz 
 * @Date: 2018-08-15 09:19:27 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-08-18 16:45:37
 */
<template>
  <section class="p-3">
    <div class="toolbar pb-3">
      <!-- 日期选择 -->
      <span class="color-999">选择日期:</span>
      <el-date-picker v-model="timeValues"
                      @change="handleTimeChange"
                      size="small"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="|"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions">
      </el-date-picker>

      <!-- 时间间隔选择 -->
      <span class="color-999 ml-3">时间间隔:</span>
      <el-select size="small" v-model="splitHour" placeholder="选择时间间隔">
        <el-option v-for="item in intervalOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
        ></el-option>
      </el-select>
          
    </div>

    <!-- 甘特图组件 -->
    :start-date="startDate"
        :end-date="endDate"
    <gant-chart
        :batch-list="batchList"
        :data="planData"
        :split-hour="splitHour"
        
        :show-planned="false"
        @item-click="handleDataItemClick"
      ></gant-chart>

    <!-- 甘特图操作弹出框 -->
    <gant-chart-handler-dialog :visible.sync="visible.gantHandlerDialog"
                                :plan-data="planDataRef"
                                :min-max-date-obj="minMaxDateObjRef"
                                :current-data="currentDataItem"
                                @change="handlePlanDataChange"
    ></gant-chart-handler-dialog>
  </section>
</template>

<script>
import utils from "@/utils/index"
import { mapGetters, mapActions } from "vuex";
import gantChart from '@/components/production/gantChart.vue'
import gantChartHandlerDialog from './gantChartHandlerDialog.vue'
export default {
  name: 'add-plan-step1',
  components: {
    gantChart,
    gantChartHandlerDialog
  },
  data () {
    return {
      timeValues: [utils.addDateByDay(new Date(), 0), utils.addDateByDay(new Date(), 1)],
      splitHour: 6,
      startDate: utils.addDateByDay(new Date(), 0),
      endDate: utils.addDateByDay(new Date(), 1),
      planData: [],
      planDataDict: {},
      batchList: [],  // 批次列表
      minMaxDateObj: [], // 每个工序最大时间和最小时间
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      // 以下数据作为引用传给子组件，子组件就不用再计算一遍了
      planDataRef: null,
      minMaxDateObjRef: null,
      currentDataItem: null,
      visible: {
        gantHandlerDialog: false
      }
    }
  },
  computed: {
    ...mapGetters({
      intervalOptions: 'product/intervalOptions'
    })
  },
  mounted () {
    this.initPage()
  },
  methods: {
    // 初始化
    initPage () {
      this.handleTimeChange()
      setTimeout(() => {
        this.batchList = [
          {id: '生产批次AID', name: '生产批次A'},
          {id: '生产批次BID', name: '生产批次B'},
          {id: '生产批次CID', name: '生产批次C'},
          {id: '生产批次DID', name: '生产批次D'},
          {id: '生产批次EID', name: '生产批次E'},
          {id: '生产批次FID', name: '生产批次F'},
          {id: '生产批次GID', name: '生产批次G'},
          {id: '生产批次HID', name: '生产批次H'}
        ]
        this.planData = [
          {
            id: '工序AID',
            name: '工序A',
            data: [
              {
                id: '生产批次AID',
                name: '生产批次A',
                status: '1',
                plannedStartTime: new Date('2018-08-23 01:00:00').getTime(),
                plannedEndTime: new Date('2018-08-23 20:00:00').getTime(),
                actualStartTime: new Date('2018-08-23 00:59:00').getTime(),
                actualEndTime: new Date('2018-08-23 10:00:00').getTime(),
              },
              {
                id: '生产批次AID',
                name: '生产批次A',
                status: '1',
                plannedStartTime: new Date('2018-08-23 01:00:00').getTime(),
                plannedEndTime: new Date('2018-08-23 20:00:00').getTime(),
                actualStartTime: new Date('2018-08-23 16:00:00').getTime(),
                actualEndTime: new Date('2018-08-23 19:00:00').getTime(),
              },
              {
                id: '生产批次FID',
                name: '生产批次F',
                status: '4',
                plannedStartTime: new Date('2018-08-23 21:00:00').getTime(),
                plannedEndTime: new Date('2018-08-23 23:59:00').getTime(),
                actualStartTime: new Date('2018-08-23 22:00:00').getTime(),
                actualEndTime: new Date('2018-08-23 23:00:00').getTime(),
              },
            ]
          },
          {
            id: '工序BID',
            name: '工序B',
            data: [
              {
                id: '生产批次AID',
                name: '生产批次A',
                status: '1',
                plannedStartTime: new Date('2018-08-24 02:00:00').getTime(),
                plannedEndTime: new Date('2018-08-24 10:00:00').getTime(),
                actualStartTime: new Date('2018-08-24 04:00:00').getTime(),
                actualEndTime: new Date('2018-08-24 12:00:00').getTime(),
              },
              {
                id: '生产批次FID',
                name: '生产批次F',
                status: '4',
                plannedStartTime: new Date('2018-08-24 12:00:00').getTime(),
                plannedEndTime: new Date('2018-08-24 18:00:00').getTime(),
                actualStartTime: new Date('2018-08-24 13:00:00').getTime(),
                actualEndTime: new Date('2018-08-24 17:00:00').getTime(),
              },
            ]
          },
          {
            id: '工序CID',
            name: '工序C',
            data: [
              {
                id: '生产批次FID',
                name: '生产批次F',
                status: '4',
                plannedStartTime: new Date('2018-08-24 18:00:00').getTime(),
                plannedEndTime: new Date('2018-08-24 22:00:00').getTime(),
                actualStartTime: new Date('2018-08-24 18:00:00').getTime(),
                actualEndTime: new Date('2018-08-24 22:00:00').getTime(),
              },
              {
                id: '生产批次AID',
                name: '生产批次A',
                status: '1',
                plannedStartTime: new Date('2018-08-25 02:00:00').getTime(),
                plannedEndTime: new Date('2018-08-25 10:00:00').getTime(),
                actualStartTime: new Date('2018-08-25 04:00:00').getTime(),
                actualEndTime: new Date('2018-08-25 12:00:00').getTime(),
              }
            ]
          },
        ]
        // 数组反转
        this.planData = this.planData.reverse()

        this.minMaxDateObj = this.getMinMaxDateObj(this.planData)
        // 建立索引
        this.planData.forEach((item, pIndex) => {
          item.dataDict = {}
          item.data.forEach((val, cIndex) => {
            val.pId = item.id
            val.pIndex = pIndex // 父级所在的index
            val.cId = val.id
            val.cIndex = cIndex // 子级所在的index，即当前行的index
            item.dataDict[val.id] = val
          })
          this.planDataDict[item.id] = item
        })
      }, 1000)
    },
    // 时间选择
    handleTimeChange () {
      if (this.timeValues) {
        this.startDate = this.timeValues[0]
        this.endDate = this.timeValues[1]
      } else {
        this.startDate = utils.addDateByDay(new Date(), 0)
        this.endDate = utils.addDateByDay(new Date(), 1)
      }
    },
    // 点击
    handleDataItemClick (dataItem) {
      // 只能处理自己正在排程的数据哦
      // if (dataItem.data.data.status === '4') {
        this.currentDataItem = dataItem.data
        this.planDataRef = this.planData
        this.minMaxDateObjRef = this.minMaxDateObj
        this.visible.gantHandlerDialog = true
      // }
    },
    // 确认回调
    handlePlanDataChange (data) {
      // console.log(data)
      switch (data.type) {
        case 'insert': {
          break
        }
        case 'adjustTime': {
          let parent = this.planDataDict[this.currentDataItem.pId]
          let child = parent.dataDict[this.currentDataItem.cId]
          child.actualStartTime = data.timeValues[0]
          child.actualEndTime = data.timeValues[1]
          parent.data.splice(this.currentDataItem.cIndex, 1, child)
          this.planData.splice(this.currentDataItem.pIndex, 1, parent)
          this.clearRef()
          break
        }
        case 'dialogClose': {
          this.clearRef()
        }
      }
      // 清空引用
      // this.planDataRef = null
      // this.minMaxDateObjRef = null
      // this.currentDataItem = null
    },
    // 清空引用
    clearRef () {
      this.planDataRef = null
      this.minMaxDateObjRef = null
      this.currentDataItem = null
    },
    // 每个工序的时间的最大值和最小值, 所有工序的时间最大值和最小值
    getMinMaxDateObj (data) {
      let minDate = ''
      let maxDate = ''
      let dataDict = {} // 工序列表字典
      let allTimes = [] // 所有的时间：实际，预计 开始结束时间
      data.forEach(item => {
        dataDict[item.id] = []
      })
      data.forEach(item => {
        item.data.forEach(val => {
          dataDict[item.id].push(val)
        })
      })

      Object.entries(dataDict).forEach(([key, value]) => {
        value.forEach(item => {
          allTimes.push(item.actualStartTime)
          allTimes.push(item.actualEndTime)
          allTimes.push(item.plannedStartTime)
          allTimes.push(item.plannedEndTime)
        })
        if (value.length > 0) {
          // 每个工序里面 批次的实际开始时间最大和最小值
          value = {
            actualMin: Math.min(...value.map(v => v.actualStartTime)),
            actualMax: Math.max(...value.map(v => v.actualEndTime)),
            plannedMin: Math.min(...value.map(v => v.plannedStartTime)),
            plannedMax: Math.max(...value.map(v => v.plannedEndTime))
          }
        }
        // 每个工序里面 批次的时间最大和最小值
        value.min = value.actualMin > value.plannedMin ? value.plannedMin : value.actualMin
        value.max = value.actualMax > value.plannedMax ? value.plannedMax : value.actualMax
      })

      return {
        min: Math.min(...allTimes),
        max: Math.max(...allTimes),
        minMaxDict: dataDict
      }
    }
  },
  watch: {
  }
}
</script>

<style lang="scss">
</style>