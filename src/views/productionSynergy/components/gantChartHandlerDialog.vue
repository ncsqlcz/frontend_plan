<template>
  <el-dialog :title="currentData && currentData.name" :visible.sync="dialogVisible" width="455px">
    <el-tabs tab-position="top" class="mt-3" v-model="tabActiveName">
      <!-- 调整时间 -->
      <el-tab-pane label="调整时间" name="adjustTime">
        <div style="min-height: 100px;">
          <p class="color-999 mb-2">
            <span>
              开始时间范围：[ 
              <span v-if="startTimeMin">{{ getTime(startTimeMin) }}</span>
              ,
            </span>
            <span class="ml-1">
              <span v-if="startTimeMax">{{ getTime(startTimeMax) }}</span>
               ]
            </span>
            <br/>
          </p>
          <p class="color-999 mb-2" v-if="showEndTime">
            <span>
              结束时间范围：[ 
              <span v-if="endTimeMin">{{ getTime(endTimeMin) }}</span>
              ,
            </span>
            <span class="ml-1">
              <span v-if="endTimeMax">{{ getTime(endTimeMax) }}</span>
               ]
            </span>
            <br/>
          </p>

          <p class="color-999">开始时间：</p>
          <el-date-picker
            v-model="startDate"
            type="date"
            size="small"
            value-format="timestamp"
            @change="handleStartTimeChange"
            :picker-options="startDatePickerOptions"
            :style="{width: timePickerWidth}"
            placeholder="选择日期">
          </el-date-picker>
          <span> - </span>
          <el-time-picker
            v-model="startTime"
            size="small"
            value-format="timestamp"
            :picker-options="startTimePickerOptions"
            :style="{width: timePickerWidth}"
            placeholder="选择时间点">
          </el-time-picker>

          <span v-if="showEndTime">
            <p class="color-999 mt-2">结束时间：</p>
            <el-date-picker
              v-model="endDate"
              type="date"
              size="small"
              value-format="timestamp"
              @change="handleEndTimeChange"
              :picker-options="endDatePickerOptions"
              :style="{width: timePickerWidth}"
              placeholder="选择日期">
            </el-date-picker>
            <span> - </span>
            <el-time-picker
              v-model="endTime"
              size="small"
              value-format="timestamp"
              :picker-options="endTimePickerOptions"
              :style="{width: timePickerWidth}"
              placeholder="选择时间点">
            </el-time-picker>
          </span>
          
          <div class="hidden">
            <br/><br/><br/>
            <el-date-picker v-model="timeValues"
                            @change="handleSelectTime"
                            size="small"
                            type="datetimerange"
                            align="right"
                            unlink-panels
                            range-separator="|"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :is-range="true"
                            :picker-options="pickerOptions">
            </el-date-picker>
          </div>

        </div>
      </el-tab-pane>
      
      <!-- 插单 -->
      <el-tab-pane label="插单" name="insert">
        <div style="min-height: 100px;" class="py-3">
          <span class="color-999">插单方向：</span>
          <el-radio v-model="forward" label="-1">往前</el-radio>
          <el-radio v-model="forward" label="1">往后</el-radio>
          <br/>
          <span class="color-999">插单数：</span>
          <el-input-number v-model="stepValue"
                      class="mt-4"
                      :step="1"
                      size="small"
                      :min="1"
                      @change="handleStepValueChange"
                      label="插单数"></el-input-number>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer">
      <el-button size="medium" type="primary" :loading="btnLoading" @click="handleConfirm" :disabled="!currentData">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import utils from "@/utils/index"
export default {
  name: 'gant-Chart-Handler-Dialog',
  components: {
  },
  data () {
    return {
      dialogVisible: false,
      btnLoading: false,
      forward: '-1',
      stepValue: 1,
      tabActiveName: 'adjustTime',  // 当前选中的标签
      timeValues: null,
      pickerOptions: null,
      planDataDict: {},
      startTimeMin: null,  // 开始时间的最小值
      startTimeMax: null,  // 开始时间的最大值
      endTimeMin: null, // 结束时间的最小值
      endTimeMax: null, // 结束时间的最大值
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      startDatePickerOptions: null,
      endDatePickerOptions: null,
      timePickerWidth: '160px',
      timeLength: 0 // 记录一下时间长度，更改了开始时间
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 所有的数据对象引用
    planData: Array,
    // 当前操作的生产批次对象引用
    currentData: Object,
    minMaxDateObj: Object,
    showEndTime: { // 是否显示结束时间，是否可以操作结束时间
      type: Boolean,
      default: false
    }
  },
  computed: {
    startTimePickerOptions () {
      let option = {
        selectableRange: '00:00:00 - 23:59:59'
      }
      let minDate = utils.formatDate.format(new Date(this.startTimeMin), 'yyyy-MM-dd')
      let maxDate = utils.formatDate.format(new Date(this.startTimeMax), 'yyyy-MM-dd')
      let chooseDate = utils.formatDate.format(new Date(this.startDate), 'yyyy-MM-dd')
      // 有最小时间的情况 且 最小日期和最大日期不是同一天，选择的日期也是最小日期
      if (this.startTimeMin && minDate !== maxDate) {
        if (chooseDate === minDate) {
          option.selectableRange = `${utils.formatDate.format(new Date(this.startTimeMin), 'hh:mm:ss')} - 23:59:59`
        } else if (chooseDate === maxDate) {
          option.selectableRange = `00:00:00 - ${utils.formatDate.format(new Date(this.startTimeMax), 'hh:mm:ss')}` 
        }
      } else if (minDate === maxDate) { // 最小日期和最大日期是同一天
        option.selectableRange = `${utils.formatDate.format(new Date(this.startTimeMin), 'hh:mm:ss')} - ${utils.formatDate.format(new Date(this.startTimeMax), 'hh:mm:ss')}`
      }
      return option
    },
    endTimePickerOptions () {
      let option = {
        selectableRange: '00:00:00 - 23:59:59',
      }
      let minDate = utils.formatDate.format(new Date(this.endTimeMin), 'yyyy-MM-dd')
      let maxDate = utils.formatDate.format(new Date(this.endTimeMax), 'yyyy-MM-dd')
      let chooseDate = utils.formatDate.format(new Date(this.endDate), 'yyyy-MM-dd')
      // 有最大时间的情况 且 最小日期和最大日期不是同一天，选择的日期也是最大日期
      if (this.endTimeMax && minDate !== maxDate) {
        if (chooseDate === minDate) {
          option.selectableRange = `${utils.formatDate.format(new Date(this.endTimeMin), 'hh:mm:ss')} - 23:59:59`
        } else if (chooseDate === maxDate){
          option.selectableRange = `00:00:00 - ${utils.formatDate.format(new Date(this.endTimeMax), 'hh:mm:ss')}`
        }
      } else if (minDate === maxDate) { // 最小日期和最大日期是同一天
        option.selectableRange = `${utils.formatDate.format(new Date(this.endTimeMin), 'hh:mm:ss')} - ${utils.formatDate.format(new Date(this.endTimeMax), 'hh:mm:ss')}`
      }
      return option
    },
  },
  mounted () {},
  methods: {
    handleStepValueChange () {},
    // 确认
    handleConfirm () {
      switch (this.tabActiveName) {
        case 'insert': {
          this.btnLoading = true

          // 调用插单接口
          setTimeout(() => {
            this.btnLoading = false
            this.$message.success('插单成功')
          }, 1000)
          this.$emit('change', {
            status: 0,
            type: 'insert'
          })
          this.dialogVisible = false
          break
        }
        case 'adjustTime': {
          let res = null
          if (this.showEndTime) {
            res = this.checkTime()
          } else {
            res = this.checkTimeForAutoEndTime()
          }
          if (res === true) {
            // 拼接为年月日 再转换为时间戳
            let startDateTime = new Date(utils.formatDate.format(new Date(this.startDate), 'yyyy-MM-dd') + ' ' + utils.formatDate.format(new Date(this.startTime), 'hh:mm:ss')).getTime()
            let endDateTime = 0
            if (this.showEndTime) {
              endDateTime = new Date(utils.formatDate.format(new Date(this.endDate), 'yyyy-MM-dd') + ' ' + utils.formatDate.format(new Date(this.endTime), 'hh:mm:ss')).getTime()
            } else {
              endDateTime = startDateTime + this.timeLength
            }

            this.$emit('change', {
              status: 0,
              type: 'adjustTime',
              timeValues: [startDateTime, endDateTime]
            })
            this.dialogVisible = false
          } else {
            this.$message.info(res.message)
          }
          break
        }
      }
      
    },
    // 自定义结束时间的情况 - 校验时间，确保选择的时间是在允许范围内
    checkTimeForAutoEndTime () {
      if (this.startDate && this.startTime) {
        let startDateTime = new Date(utils.formatDate.format(new Date(this.startDate), 'yyyy-MM-dd') + ' ' + utils.formatDate.format(new Date(this.startTime), 'hh:mm:ss')).getTime()
        if (startDateTime >= this.startTimeMin) {
          // 最大时间可能为null哦，就是没有限制
          if (this.startTimeMax && startDateTime > this.startTimeMax) {
            return new Error('开始时间已经超出最大限制范围')
          }
          return true
        }
      }
      return false
    },
    // 自定义结束时间的情况 - 校验时间，确保选择的时间是在允许范围内
    checkTime () {
      // 确保每一个都有值
      if (this.startDate && this.startTime && this.endDate && this.endTime) {
        let startDateTime = new Date(utils.formatDate.format(new Date(this.startDate), 'yyyy-MM-dd') + ' ' + utils.formatDate.format(new Date(this.startTime), 'hh:mm:ss')).getTime()
        let endDateTime = new Date(utils.formatDate.format(new Date(this.endDate), 'yyyy-MM-dd') + ' ' + utils.formatDate.format(new Date(this.endTime), 'hh:mm:ss')).getTime()

        if (startDateTime === endDateTime) {
          return new Error('开始时间和结束时间不能完全相同')
        } else if (startDateTime >= endDateTime) {
          return new Error('开始时间不能大于结束时间')
        }

        // 都大于最小时间
        if (startDateTime >= this.startTimeMin && endDateTime >= this.endTimeMin) {
          // 最大时间可能为null哦，就是没有限制
          if (this.startTimeMax && startDateTime > this.startTimeMax) {
            return new Error('开始时间或结束时间已经超出最大限制范围')
          }
          if (this.endTimeMax && endDateTime > this.endTimeMax) {
            return new Error('开始时间或结束时间已经超出最大限制范围')
          }
          return true
        } else {
          return new Error('开始时间或结束时间已经超出最大限制范围')
        }
      } else {
        return new Error('时间不完整')
      }
      return false
    },
    // 选择开始日期
    handleStartTimeChange () {
      let minDate = new Date(utils.formatDate.format(new Date(this.startTimeMin), 'yyyy-MM-dd 00:00:00')).getTime()
      if (minDate === this.startDate) {
        this.startTime = this.startTimeMin
      }
      if (this.startTimeMax) {
        let maxDate = new Date(utils.formatDate.format(new Date(this.startTimeMax), 'yyyy-MM-dd 00:00:00')).getTime()
        if (maxDate === this.startDate) {
          this.startTime = this.startTimeMax
        }
      }
    },
    // 选择结束日期
    handleEndTimeChange () {
      let minDate = new Date(utils.formatDate.format(new Date(this.endTimeMin), 'yyyy-MM-dd 00:00:00')).getTime()
      if (minDate === this.endDate) {
        this.endTime = this.endTimeMin
      }
      if (this.endTimeMax) {
        let maxDate = new Date(utils.formatDate.format(new Date(this.endTimeMax), 'yyyy-MM-dd 00:00:00')).getTime()
        if (maxDate === this.endDate) {
          this.endTime = this.endTimeMax
        }
      }
    },
    // 选择时间
    handleSelectTime () {
      // console.log(this.timeValues)
      if (this.timeValues) {
        if (this.timeValues[0].getTime() < this.startTimeMin) {
          this.timeValues[0] = new Date(this.startTimeMin)
        }

        if(this.startTimeMax) {
          if (this.timeValues[1].getTime() > this.startTimeMax) {
            this.timeValues[1] = new Date(this.startTimeMax)
          }
        }
      }
    },
    // 时间戳转正常时间格式
    getTime (timestamp) {
      if (!timestamp) {
          return ''
        } else {
          return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd hh:mm:ss')
      }
    },
    // 计算可以调整的极限时间范围
    setAvailableTime (planData, currentData) {
      // 来自当前行数据的时间限制
      let curLimitTime = this.getCurrentRowLimitTime(planData, currentData)
      // 来自上一行数据的时间限制
      let prevLimitTime = this.getEmptyLimitTimeObj()
      // 来自下一行数据的时间限制
      let nextLimitTime = this.getEmptyLimitTimeObj()

      // 获取上一行数据 如果有的话
      if (planData.length > 1 && currentData.pIndex < planData.length - 1) {
        let prevRowData = planData[currentData.pIndex + 1]
        let prevData = prevRowData.dataDict[currentData.cId]
        prevLimitTime = this.getCurrentRowLimitTime(planData, prevData)
      }
      
      // 获取下一行数据 如果有的话
      if (planData.length > 1 && currentData.pIndex > 0) {
        let nextRowData = planData[currentData.pIndex - 1]
        let nextData = nextRowData.dataDict[currentData.cId]
        nextLimitTime = this.getCurrentRowLimitTime(planData, nextData)
      }

      // 根据三行的时间限制综合得出时间限制
      let limitObj = this.getStartEndTimeLimitConf(curLimitTime, prevLimitTime, nextLimitTime)

      // 将时间限制设置为时间选择组件的配置
      this.setPickerOptions(limitObj)
    },
    // 分析数据分别得出开始时间，结束时间的最大最小值
    getStartEndTimeLimitConf (curLimitTime, prevLimitTime, nextLimitTime) {
      curLimitTime = curLimitTime || this.getEmptyLimitTimeObj()
      prevLimitTime = prevLimitTime || this.getEmptyLimitTimeObj()
      nextLimitTime = nextLimitTime || this.getEmptyLimitTimeObj()
      let startTimeMin = null
      let startTimeMax = null
      let endTimeMin = null
      let endTimeMax = null

      // 调试的时候可能会用到哦
      // console.log(
      //   '当前行：',
      //   utils.formatDate.format(new Date(curLimitTime.minTime), 'yyyy-MM-dd hh:mm:ss'),
      //   utils.formatDate.format(new Date(curLimitTime.maxTime), 'yyyy-MM-dd hh:mm:ss'),
      //   utils.formatDate.format(new Date(curLimitTime.actualStartTime), 'yyyy-MM-dd hh:mm:ss'),
      //   utils.formatDate.format(new Date(curLimitTime.actualEndTime), 'yyyy-MM-dd hh:mm:ss')
      // )
      // console.log(
      //   '上一行：',
      //   utils.formatDate.format(new Date(prevLimitTime.minTime), 'yyyy-MM-dd hh:mm:ss'),
      //   utils.formatDate.format(new Date(prevLimitTime.maxTime), 'yyyy-MM-dd hh:mm:ss'),
      //   utils.formatDate.format(new Date(prevLimitTime.actualStartTime), 'yyyy-MM-dd hh:mm:ss'),
      //   utils.formatDate.format(new Date(prevLimitTime.actualEndTime), 'yyyy-MM-dd hh:mm:ss')
      // )
      // console.log(
      //   '下一行：',
      //   utils.formatDate.format(new Date(nextLimitTime.minTime), 'yyyy-MM-dd hh:mm:ss'),
      //   utils.formatDate.format(new Date(nextLimitTime.maxTime), 'yyyy-MM-dd hh:mm:ss'),
      //   utils.formatDate.format(new Date(nextLimitTime.actualStartTime), 'yyyy-MM-dd hh:mm:ss'),
      //   utils.formatDate.format(new Date(nextLimitTime.actualEndTime), 'yyyy-MM-dd hh:mm:ss')
      // )

      // 当前行如果往前面调整，能调整的时间范围是：
      // 1.当前行的最小时间，即前一个数据的结束时间
      // 2.上一行的的开始时间
      // 3.不能小于当前时间
      // 4.开始时间的最大值最小值 和 结束时间的最大值和最小值不一样的哦
      this.startTimeMin = Math.max(curLimitTime.minTime, prevLimitTime.actualStartTime)
      this.startTimeMin = this.startTimeMin < Date.now() ? Date.now() : this.startTimeMin
      // 最小时间不能小于当前时间
      startTimeMin = this.startTimeMin < Date.now() ? utils.addDateByDay(new Date(), 0).getTime() : utils.addDateByDay(new Date(this.startTimeMin), 0).getTime()
      // console.log('开始时间最小值找到啦：', this.startTimeMin, utils.formatDate.format(new Date(this.startTimeMin), 'yyyy-MM-dd hh:mm:ss'),)
      
      // 当前行如果往前面调整，能调整的时间范围是：
      // 1.当前行的最大时间，即后一个数据的开始时间
      // 2.下一行的的开始时间
      // 3.不能小于最小时间
      // 4.最大值有可能是null，代表无限制
      // 5.开始时间的最大值最小值 和 结束时间的最大值和最小值不一样的哦
      if (nextLimitTime.actualStartTime) { // 有可能没有下一行的数据
        this.startTimeMax = Math.max(curLimitTime.minTime, nextLimitTime.actualStartTime)
      } else {
        this.startTimeMax = curLimitTime.maxTime
      }
      // 如果有最大时间限制
      if (curLimitTime.maxTime) {
        this.startTimeMax = Math.min(this.startTimeMax, curLimitTime.maxTime)
        // 最大的开始时间要自动减去本身的时间长度
        this.startTimeMax -= this.timeLength
      }
      if (this.startTimeMax) {
        this.startTimeMax = this.startTimeMax < this.startTimeMin ? this.startTimeMin : this.startTimeMax
        // 最大时间不能小于最小时间
        startTimeMax = this.startTimeMax < this.startTimeMin ? utils.addDateByDay(this.startTimeMin, 0).getTime() : utils.addDateByDay(new Date(this.startTimeMax), 0).getTime()
      } else {
        startTimeMax = null
      }
      // console.log('开始时间最大值找到啦：', this.startTimeMax, utils.formatDate.format(new Date(this.startTimeMax), 'yyyy-MM-dd hh:mm:ss'),)

      // console.log(utils.formatDate.format(new Date(startTimeMin), 'yyyy-MM-dd hh:mm:ss'), utils.formatDate.format(new Date(startTimeMax), 'yyyy-MM-dd hh:mm:ss'))

      // 开始找结束时间的范围啦
      // 1.结束时间的最小值就是开始时间的最小值
      // 2.结束时间的最大值就是当前行下一个批次的时间的开始值 或 无限制
      endTimeMin = this.endTimeMin = this.startTimeMin
      this.endTimeMax = curLimitTime.maxTime
      // 如果时间不是从 00:00 开始的 要转成 00:00，不然会导致不能选取当天时间
      if (this.endTimeMax) {
        this.endTimeMax = this.endTimeMax < this.endTimeMin ? this.endTimeMin : this.endTimeMax
        // 最大时间不能小于最小时间
        endTimeMax = this.endTimeMax < this.endTimeMin ? utils.addDateByDay(this.endTimeMin, 0).getTime() : utils.addDateByDay(new Date(this.endTimeMax), 0).getTime()
      } else {
        endTimeMax = null
      }

      return {
        startTimeMin: startTimeMin,
        startTimeMax: startTimeMax,
        endTimeMin: endTimeMin,
        endTimeMax: endTimeMax
      }
    },
    // 设置时间选择器的时间范围
    setPickerOptions (limitObj) {
      limitObj = limitObj || this.getEmptyLimitTimeObj()
      let startTimeMin = limitObj.startTimeMin
      let startTimeMax = limitObj.startTimeMax
      let endTimeMin = limitObj.endTimeMin
      let endTimeMax = limitObj.endTimeMax

      let that = this
      this.startDatePickerOptions =  {
        disabledDate (time) {
          if (startTimeMax) { // 有最大时间限制
            return time.getTime() < startTimeMin || time.getTime() > startTimeMax
          } else {  // 只有最小时间限制
            return time.getTime() < startTimeMin
          }
        }
      }

      this.endDatePickerOptions =  {
        disabledDate (time) {
          // 选中了开始时间, 就已开始时间为最小值
          let min = null
          if (that.startDate) {
            min = new Date(utils.formatDate.format(new Date(that.startDate), 'yyyy-MM-dd 00:00:00')).getTime()
          } else {
            min = endTimeMin
          }

          // 结束日期不为空的情况
          if (endTimeMax) {
            return time.getTime() < min || time.getTime() > endTimeMax 
          } else {
            // 结束日期为空（没有限制）的情况
            return time.getTime() < min
          }
        }
      }

      // 暂时不用
      this.pickerOptions = {
        disabledDate (time) {
          if (startTimeMin && startTimeMax) { // 有最大最小时间
            return time.getTime() < startTimeMin || time.getTime() > startTimeMax
          } else if (startTimeMin && !startTimeMax) { // 只有最小时间
            return time.getTime() < startTimeMin
          }
        }
      }
    },
    // 一行的时间相关数据，空的数据格式
    getEmptyLimitTimeObj () {
      return {
          minTime: null,
          maxTime: null,
          actualStartTime: null,
          actualEndTime: null
        }
    },
    // 获取当前行的限制时间
    getCurrentRowLimitTime (planData, currentData) {
      let minTime = null
      let maxTime = null
      // 得到当前数据所在列表，前后所在的最大最小时间。 注意planData是倒序的
      let curRowData = planData[currentData.pIndex] // 当前行数据

      // 当前批次是第一个数据 或 最后一个数据
      if (currentData.cIndex === 0 || currentData.cIndex === curRowData.data.length - 1) {
        // 如果当前行总共就只有一个数据
        if (curRowData.data.length === 1) {
          minTime = Date.now()
          maxTime = null
        } else {
          // 当前行有多个数据
          // 当前批次是第一个数据
          if (currentData.cIndex === 0) {
            minTime = Date.now()
            maxTime = curRowData.data[currentData.cIndex + 1].actualStartTime
          } else {
            // 当前批次是最后一个数据
            minTime = curRowData.data[currentData.cIndex - 1].actualEndTime
            maxTime = null
          }
        }
      } else {
        // 当前批次处于中间的情况，就是前后批次都有数据
        // 最小值为前一个工序的结束时间
        // 最大值是后一个工单的开始时间
        minTime = curRowData.data[currentData.cIndex - 1].actualEndTime
        maxTime = curRowData.data[currentData.cIndex + 1].actualStartTime
      }

      return {
        minTime: minTime,
        maxTime: maxTime,
        actualStartTime: currentData.actualStartTime,
        actualEndTime: currentData.actualEndTime
      }
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('update:visible', val)
      if (!val) {
        this.$emit('change', {
          status: -1,
          type: 'dialogClose'
        })
      }
    },
    planData (val) {
      if (val) {
      }
    },
    currentData (val) {
      if (val) {
        this.timeValues = [new Date(val.data.actualStartTime), new Date(val.data.actualEndTime)]
        // 记录时间长度，如果showEndTime为false，则不能调整结束时间，需要根据最初的时间长度自动计算出结束时间
        this.timeLength = val.data.actualEndTime - val.data.actualStartTime
        
        // 初始化选中批次的时间段
        this.startDate = val.data.actualStartTime
        this.startTime = val.data.actualStartTime
        this.endDate = val.data.actualEndTime
        this.endTime = val.data.actualEndTime

        this.setAvailableTime(this.planData, val.data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
