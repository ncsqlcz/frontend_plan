/*
 * @Author: liucz 
 * @Date: 2018-08-14 17:34:08 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-03 18:04:05
 */
<template>
  <!-- 批次工序甘特图弹窗 -->
  <el-dialog :title="title || '生产批次排程'"
             :visible.sync="dialogVisible"
             width="80%">
    <div class="" v-loading="listLoading">
      
      <!-- 时间间隔选择 -->
      <div class="time-spilt-wrap">
        <span>时间间隔</span>
        <el-select size="small" v-model="splitHour" placeholder="选择时间间隔">
          <el-option v-for="item in intervalOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <!-- <el-button size="small" @click="endDateAddByDay(1)">加一天</el-button>
      <el-button size="small" @click="endDateAddByDay(-1)">减一天</el-button> -->
      <gant-chart
        :batch-list="batchList"
        :data="planData"
        :split-hour="splitHour"
        :show-planned="true"
        @item-click="handleDataItemClick"
      ></gant-chart>
      <!-- :start-date="startDate"
        :end-date="endDate" -->

    </div>
  </el-dialog>
</template>

<script>
import utils from "@/utils/index";
import gantChart from "@/components/production/gantChart";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Gant-Chart",
  data() {
    return {
      dialogVisible: false,
      splitHour: 6,
      startDate: utils.addDateByDay(new Date(), 0),
      endDate: utils.addDateByDay(new Date(), 1),
      yAxis: [],
      planData: [],
      planDataDict: {},
      batchList: [],  // 批次列表
      minMaxDateObj: [],
      minMaxDict: null, // 每个工序最大时间和最小时间
      listLoading: false
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    // 计划相关数据
    data: Object
  },
  computed: {
    ...mapGetters({
      intervalOptions: 'product/intervalOptions'
    })
  },
  components: { gantChart },
  mounted () {
  },
  methods: {
    ...mapActions(['setMenuModule', 'setRoutes']),
    initPage (planData) {
      this.planData = []
      this.listLoading = true
      this.handleTimeChange()

      this.batchList = [{ id: planData.plan_id, name: planData.plan_batch }]

      // 数据转换 - 转换为工序里面包含批次，源数据是批次里面包含工序
      planData.productionCraftPaths.forEach(item => {
        this.planData.push({
          id: item.production_process_id || Math.random(),
          name: item.production_process_name,
          data: [
            {
              id: planData.plan_id,
              name: planData.plan_batch,  // 批次名称
              // 以下市 预计开始时间, 预计结束时间, 实际开始时间, 实际结束时间
              plannedStartTime: item.production_craft_scheduled_production_start_time ? new Date(item.production_craft_scheduled_production_start_time).getTime() : new Date().getTime(),
              plannedEndTime: item.production_craft_scheduled_production_end_time ? new Date(item.production_craft_scheduled_production_end_time).getTime() : new Date().getTime(),
              actualStartTime: item.production_craft_actual_production_start_time ? new Date(item.production_craft_actual_production_start_time).getTime() : new Date().getTime(),
              actualEndTime: item.production_craft_actual_production_end_time ? new Date(item.production_craft_actual_production_end_time).getTime() : new Date().getTime(),
              status: planData.plan_production_priority, // 批次状态(优先级)
              responsible: item.craft_path_responsible, // 工序负责人
              // durationTime: item.durationTime // 该工序持续时间
            }
          ]
        })
      })
      // console.log(this.batchList, this.planData)

      // 数组反转
      this.planData = this.planData.reverse()

      this.minMaxDateObj = this.getMinMaxDateObj(this.planData)
      // 建立索引
      this.planData.forEach(item => {
        item.dataDict = {}
        item.data.forEach(val => {
          item.dataDict[val.id] = val
        })
        this.planDataDict[item.id] = item
      })
      
      this.listLoading = false
      return;

      
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
                status: '2',
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
                status: '2',
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
                id: '生产批次AID',
                name: '生产批次A',
                status: '1',
                plannedStartTime: new Date('2018-08-25 02:00:00').getTime(),
                plannedEndTime: new Date('2018-08-25 10:00:00').getTime(),
                actualStartTime: new Date('2018-08-25 04:00:00').getTime(),
                actualEndTime: new Date('2018-08-25 12:00:00').getTime(),
              },
              {
                id: '生产批次FID',
                name: '生产批次F',
                status: '3',
                plannedStartTime: new Date('2018-08-24 18:00:00').getTime(),
                plannedEndTime: new Date('2018-08-24 22:00:00').getTime(),
                actualStartTime: new Date('2018-08-24 18:00:00').getTime(),
                actualEndTime: new Date('2018-08-24 22:00:00').getTime(),
              },
            ]
          },
        ]
        
      },1000)
    },
    handleTimeChange () {
      // 必须是整天
      // this.startDate = new Date(utils.formatDate.format(new Date(), 'yyyy-MM-dd 00:00:00'))
      // this.endDate = new Date(utils.formatDate.format(new Date(new Date().setDate(new Date().getDate() + 12)), 'yyyy-MM-dd 00:00:00'))
      // setTimeout(() => {
      //   this.endDate = new Date(utils.formatDate.format(new Date(new Date().setDate(new Date().getDate() + 12)), 'yyyy-MM-dd 00:00:00'))
      // }, 1000)
    },
    // 增加最大时间
    endDateAddByDay (days = 1) {
      this.endDate = utils.addDateByDay(this.endDate, days)
    },
    handleDataItemClick (dataItem) {
    },
    // 工序往前 或 往后移动 n小时
    processMoveHours (dataItem, hours) {
      // 移动之后的时间
      let afterMoveStartDate = utils.addDateByHour(new Date(child.startDate), hours).getTime()
      let afterMoveEndDate = utils.addDateByHour(new Date(child.endDate), hours).getTime()

      // 用移动之后的时间进行对比，看是否能移动成功，提示：是否是休息日，是否紧急状态
      

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
    visible (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('update:visible', val)
    },
    data (val) {
      if (val) {
        this.initPage(val)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.time-spilt-wrap{
  padding-left: 100px;
  padding-bottom: 16px;
}
</style>
