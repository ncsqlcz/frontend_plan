/*
 * @Author: liucz 
 * @Date: 2018-07-17 14:26:53 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-03 17:54:49
 */
<template>
  <section ref="section" v-loading="visible.dataLoading">
    <!-- 时间 -->
    <div class="w-100 flex-wrap" style="overflow-x: auto;">
      <div style="width: 100%; margin-left: 100px; margin-right: 0px;">
        <table class="w-100 table" ref="timeTable">
          <thead>
            <tr>
              <th v-for="(date, index) in dateList" :key="index" :colspan="timeList.length">{{ date }}</th>
            </tr>
            <tr>
              <th v-for="(item, index) in dateList.length * timeList.length" :key="index">{{ timeList[index % timeList.length] }}</th>
            </tr>
          </thead>
        </table>

        <!-- <el-table size="mini" header-cell-class-name="cell-text-center" class="gant-chart-table">
          <el-table-column :label="date" v-for="(date, index) in dateList" :key="index">
              <el-table-column :prop="time" :label="time" v-for="(time, timeIndex) in timeList" :key="timeIndex"></el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table> -->
      </div>
      <div class="gant-chart-wrap" :style="{width: chartWidth}">
        <div class="gant-chart" ref="gantChart" :style="{width: chartWidth, height: chartHeight}"></div>
      </div>

      <!-- 一些提示信息 -->
      <div style="padding-left: 100px;" v-if="showTips">
        <!-- 工单列表 -->
        <div class="batch-list flex-wrap">
          <div v-for="(item, index) in batchList" :key="item.id">
            <span class="circle-number">{{ index + 1 }}</span>
            <span class="mr-3">{{ item.name }}</span>
          </div>
        </div>

        <!-- 图例颜色 -->
        <div class="color-list flex-wrap mt-2">
          <div v-for="item in statusColorDict" :key="item.name">
            <span>{{ item.name }}</span>: 
            <span class="status-color mr-3" :style="{backgroundColor: item.color}"></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import utils from '@/utils/index'
  import { mapGetters, mapActions } from 'vuex'
  import { echartsUrl } from '@/api/cdn.js'
  // window.loadEcharts()
  // import echarts from 'echarts'
  // // 引入基本模板
  // const echarts = require("echarts/lib/echarts");
  // // 引入提示框和标题组件
  // require("echarts/lib/component/tooltip");
  // require("echarts/lib/component/title");
  // require("echarts/lib/component/custom");
  // // 引入柱状图
  // require("echarts/lib/chart/bar");

  export default {
    name: 'Gant-Chart',
    data () {
      return {
        gantChart: null,
        batchListDict: {},
        dataList: [],
        startDateCopy: utils.addDateByDay(new Date(), 0),
        endDateCopy: utils.addDateByDay(new Date(), 0),
        addDays: 0,
        timeList: ['00:00', '06:00', '12:00', '18:00'],   // 一天的时间间隔列表
        xDataList: [],
        xAxisDataActual: [],
        xAxisDataPlanned: [],
        chartWidth: '100%',  // 图表的宽度
        chartHeight: '200px',  // 图表的宽度
        statusColorDict: {
          '紧急': {
            name: '紧急',
            color: '#F56C6C'
          },
          '正常': {
            name: '正常',
            color: '#1080C3'
          },
          '当前计划': {
            name: '当前计划',
            color: '#70AD47'
          },
          '正在排程': {
            name: '正在排程',
            color: '#F9ED8E'
          },
        },
        visible: {
          dataLoading: true,
        },
        echartsjsLoaded: false,
        minMaxDict: null  // 每个工序最大时间和最小时间
      }
    },
    props: {
      // 一天分为几个小时
      splitHour: {
        type: [String, Number],
        default: '6'
      },
      // 是否显示计划
      showPlanned: {
        type: Boolean,
        default: false
      },
      // 是否显示图例
      showTips: {
        type: Boolean,
        default: true
      },
      // 甘特图的开始时间
      startDate: {
        type: Date,
        default: () => {
          return null
        }
      },
      // 甘特图的结束时间
      endDate: {
        type: Date,
        default: () => {
          return null
        }
      },
      // 从开始时间起有多少天
      days: {
        type: [String, Number],
        default: '1'
      },
      // 是否显示实际时间
      showActualTime: {
        type: Boolean,
        default: true
      },
      // 生产批次列表
      batchList: {
        type: Array,
        default: () => {
          return [
            {id: '生产批次AID', name: '生产批次A'},
            {id: '生产批次BID', name: '生产批次B'},
            {id: '生产批次CID', name: '生产批次C'},
            {id: '生产批次DID', name: '生产批次D'},
            {id: '生产批次EID', name: '生产批次E'},
            {id: '生产批次FID', name: '生产批次F'},
            {id: '生产批次GID', name: '生产批次G'},
            {id: '生产批次HID', name: '生产批次H'}
          ]
        }
      },
      // 排程数据
      data: {
        type: Array,
        default: () => {
          return [
            {
              id: '工序AID',
              name: '工序A',
              data: [
                {
                  id: '生产批次AID',
                  name: '生产批次A',
                  status: '1',
                  plannedStartTime: new Date('2018-08-23 10:00:00').getTime(),
                  plannedEndTime: new Date('2018-08-23 13:00:00').getTime(),
                  actualStartTime: new Date('2018-08-23 12:00:00').getTime(),
                  actualEndTime: new Date('2018-08-23 14:00:00').getTime(),
                },
                {
                  id: '生产批次AID',
                  name: '生产批次A',
                  status: '1',
                  plannedStartTime: new Date('2018-08-23 14:00:00').getTime(),
                  plannedEndTime: new Date('2018-08-23 15:00:00').getTime(),
                  actualStartTime: new Date('2018-08-23 12:00:00').getTime(),
                  actualEndTime: new Date('2018-08-23 14:00:00').getTime(),
                },
                {
                  id: '生产批次FID',
                  name: '生产批次F',
                  status: '2',
                  plannedStartTime: new Date('2018-08-23 05:00:00').getTime(),
                  plannedEndTime: new Date('2018-08-23 13:00:00').getTime(),
                  actualStartTime: new Date('2018-08-23 08:00:00').getTime(),
                  actualEndTime: new Date('2018-08-23 14:00:00').getTime(),
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
                  plannedStartTime: new Date('2018-08-23 10:00:00').getTime(),
                  plannedEndTime: new Date('2018-08-23 13:00:00').getTime(),
                  actualStartTime: new Date('2018-08-23 12:00:00').getTime(),
                  actualEndTime: new Date('2018-08-23 14:00:00').getTime(),
                },
                {
                  id: '生产批次FID',
                  name: '生产批次F',
                  status: '2',
                  plannedStartTime: new Date('2018-08-23 05:00:00').getTime(),
                  plannedEndTime: new Date('2018-08-23 13:00:00').getTime(),
                  actualStartTime: new Date('2018-08-23 08:00:00').getTime(),
                  actualEndTime: new Date('2018-08-23 14:00:00').getTime(),
                },
              ]
            },
          ]
        }
      },
    },
    computed: {
      ...mapGetters([]),
      // 日期列表
      dateList () {
        if (this.startDateCopy.getTime() > this.endDateCopy.getTime()) {
          this.startDateCopy = this.endDateCopy
          this.endDateCopy = this.startDate
        }
        // 相差多少天
        let days = utils.getHowManyDays(this.endDateCopy, this.startDateCopy)
        let dateList = []
        Array.from({ length: days + 1 }).forEach((item, index) => {
          let date = utils.addDateByDay(this.startDateCopy, index)
          dateList.push(utils.formatDate.format(date, 'MM/dd'))
        })
        this.chartResize()
        return dateList
      }
    },
    created () {
      // 加载echartsjs
      this.loadjs(echartsUrl).then(() => {
        this.echartsjsLoaded = true
      })
    },
    mounted () {
      this.startDateCopy = this.startDate || utils.addDateByDay(new Date(), 0)
      this.endDateCopy = this.endDate || utils.addDateByDay(new Date(), 0)
      // document.addEventListener('mousewheel', this.handleScroll, false)
      window.onmousewheel = document.onmousewheel = this.handleScroll
      window.addEventListener('resize', () => {
        this.chartResize()
        // 对每个拖拽圆点重新计算位置，并用 setOption 更新。
        // this.gantChart.setOption({
        //     graphic: echarts.util.map(data, (item, dataIndex) => {
        //         return {
        //             position: this.gantChart.convertToPixel('grid', item)
        //         };
        //     })
        // });
      })
    },
    methods: {
      ...mapActions([]),
      // 初始化页面
      initPage (list) {
        if (!this.echartsjsLoaded) return
        if (!list || list.length === 0) {
          this.gantChart.clear()
        }
        this.chartHeight = list.length * 80 + 'px'
        let obj = this.getMinMaxDateObj(list)
        if (this.startDate) {
          this.startDateCopy = this.startDate
        } else {
          // 自适应最小日期
          this.startDateCopy = utils.addDateByDay(new Date(obj.min), 0)
        }
        if (this.endDate) {
          this.endDateCopy = this.endDate
        } else {
          // 自适应最大日期
          this.endDateCopy = utils.addDateByDay(new Date(obj.max), 1)
        }
        this.minMaxDict = obj.minMaxDict
        this.initChartData(list)
      },
      // 初始化甘特图
      initChartData (xDataList) {
        if (xDataList.length === 0 || this.batchList.length === 0 || !this.echartsjsLoaded) return
        let categories = xDataList.map(v => v.name)
        let legendData = this.batchList.map(v => v.name)
        // 标识有重复的批次
        this.markRepeatBatch(xDataList)
        this.xAxisDataActual = this.getXAxisData(xDataList, 'actual')
        this.xAxisDataPlanned = this.getXAxisData(xDataList, 'planned')
        
        let series = [
          {
            name: '计划',
            type: 'custom',
            stack: '计划',
            renderItem: this.renderItemPlanned,
            itemStyle: {
              normal: {
                opacity: .1
              }
            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: this.xAxisDataPlanned
          },
          {
            name: '实际',
            type: 'custom',
            stack: '实际',
            renderItem: this.renderItemActual,
            itemStyle: {
              normal: {
                opacity: 1
              }
            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: this.xAxisDataActual
          }
        ]
        if (!this.showPlanned) {
          // 去掉计划时间的数据
          series.shift()
        }

        let option = {
          title: {
            // text: '生产计划排程'
          },
          legend: {
            data: legendData,
            // bottom: '0%',
            // left: '10%'
          },
          xAxis: {
            type: 'time',
            position: 'bottom',
            show: true,
            scale: true,
            min: this.startDateCopy,
            max: utils.addDateByDay(this.endDateCopy, 1),
            // splitNumber: this.dateList.length - 1,
            // axisLabel: {
            //   formatter: function (val) {
            //     // console.log(val)
            //     // return Math.max(0, val - 0) + ' ms'
            //   }
            // }
          },
          yAxis: {
            data: categories
          },
          grid: {
            left: '100px',
            // left: this.$refs.section.offsetWidth * 1 / 10 - 1 + 'px',
            top: '10px',
            right: '0%',
            bottom: '60px',
          },
          tooltip: {
            // trigger: 'axis',
            formatter: (params) => {
              // console.log(params)
              // 实际时间hover才有效果哦
              let txt = ''
              if (this.showPlanned) {
                txt = `
                  ${params.data.name} </br>
                  预计开始时间：${utils.formatDate.format(new Date(params.data.data.plannedStartTime), 'yyyy-MM-dd hh:mm:ss')} </br>
                  预计结束时间：${utils.formatDate.format(new Date(params.data.data.plannedEndTime), 'yyyy-MM-dd hh:mm:ss')} </br>
                  实际开始时间：${utils.formatDate.format(new Date(params.data.data.actualStartTime), 'yyyy-MM-dd hh:mm:ss')} </br>
                  实际结束时间：${utils.formatDate.format(new Date(params.data.data.actualEndTime), 'yyyy-MM-dd hh:mm:ss')} </br>
                  负责人: ${params.data.data.responsible} </br>
                  持续时间：${utils.getBootTime(params.data.value[3]).split(':')[0]}小时 </br>
                `
              } else {
                txt = `
                  ${params.data.name} </br>
                  开始时间：${utils.formatDate.format(new Date(params.data.data.actualStartTime), 'yyyy-MM-dd hh:mm:ss')} </br>
                  结束时间：${utils.formatDate.format(new Date(params.data.data.actualEndTime), 'yyyy-MM-dd hh:mm:ss')} </br>
                  负责人: ${params.data.data.actualEndTime} </br>
                  持续时间：${utils.getBootTime(params.data.value[3]).split(':')[0]}小时 </br>
                `
              }
              return txt
            },
            position: (point) => {
              return [point[0] + 20, point[1] / 2]
            }
          },
          series: series
        }
        this.visible.dataLoading = false
        this.gantChart.setOption(option)
        return;

        this.$nextTick(() => {
          this.gantChart.setOption({
            graphic: echarts.util.map(this.xAxisDataActual, (dataItem, dataIndex) => {
              console.log(this.gantChart.convertToPixel('grid', dataItem))
              let that = this
              return {
                  // 'circle' 表示这个 graphic element 的类型是圆点。
                  type: 'circle',
                  shape: {
                      // 圆点的半径。
                      r: 20 / 2
                  },
                  // 用 transform 的方式对圆点进行定位。position: [x, y] 表示将圆点平移到 [x, y] 位置。
                  // 这里使用了 convertToPixel 这个 API 来得到每个圆点的位置，下面介绍。
                  position: this.gantChart.convertToPixel('grid', dataItem),
                  // 这个属性让圆点不可见（但是不影响他响应鼠标事件）。
                  invisible: false,
                  // 这个属性让圆点可以被拖拽。
                  draggable: true,
                  // 把 z 值设得比较大，表示这个圆点在最上方，能覆盖住已有的折线图的圆点。
                  z: 100,
                  // 此圆点的拖拽的响应事件，在拖拽过程中会不断被触发。下面介绍详情。
                  // 这里使用了 echarts.util.curry 这个帮助方法，意思是生成一个与 onPointDragging
                  // 功能一样的新的函数，只不过第一个参数永远为此时传入的 dataIndex 的值。
                  ondrag: echarts.util.curry(onDragging, that, dataIndex)
              }
            })
          })
        })

        // 拖拽
        function onDragging (that, dataIndex, dx, dy) {
          that.xAxisData[dataIndex] = that.gantChart.convertFromPixel('grid', this.position);
          // Update data
          that.gantChart.setOption({
              series: [
                {
                  type: 'custom',
                  renderItem: that.renderItem,
                  itemStyle: {
                    normal: {
                      opacity: 1
                    }
                  },
                  encode: {
                    x: [1, 2],
                    y: 0
                  },
                  data: that.xAxisData
                }
              ]
          });
        }
      },
      // 标识有重复的批次 - 防止同一批次的 计划时间被重复绘制（因为同一工序可能会有相同批次的不同片段哦）
      markRepeatBatch (xDataList) {
        xDataList.forEach(item => {
          // 挨个对比，找到重复批次id
          for (let i = 0; i < item.data.length - 1; i++) {
            for (let j = i + 1; j < item.data.length; j++) {
              if (item.data[i].id === item.data[j].id) {
                item.data[j].isRepeat = 1
              }
            }
          }
        })
      },
      // X轴数据 - 分为实际时间 和 计划时间， 默认实际时间
      getXAxisData (xDataList, timeType = 'actual') {
        let isActualType = false
        if (timeType === 'actual') {
          isActualType = true
        }
        let xAxisData = []
        xDataList.forEach((item, index) => {
          item.data.forEach((val, valIndex) => {
            let baseTime = ''
            let duration = ''
            if (isActualType) {
              baseTime = val.actualStartTime
              duration = val.actualEndTime - val.actualStartTime
            } else {
              baseTime = val.plannedStartTime
              duration = val.plannedEndTime - val.plannedStartTime
            }
            let xDataItem = {
              pId: item.id, // 工序id - 用于点击的时候 找到点击元素对应数据项的id
              pIndex: index,
              cId: val.id,  // 批次id
              cIndex: valIndex,
              name: val.name, // 条状上方显示的文字
              type: 'custom',
              clickable: isActualType,
              // renderItem: timeType === 'actual' ? this.renderItemActual : this.renderItemPlanned,
              stack: isActualType ? '实际' : '计划',
              data: val,
              itemStyle: {
                normal: {
                  color: this.statusColorDict[val.status].color
                }
              },
              label: {
                normal: {
                  show: isActualType,
                  position: 'top',
                  color: val.status === '4' ? '#666' : '',  // 上方字体颜色
                  formatter: (val) => {
                    return val.name
                  }
                }
              },
              value: [
                index,  // 索引
                baseTime, // 开始时间
                baseTime += duration, // 结束时间
                duration,  // 持续时间
                val.isRepeat || 0 // 是否是重复的批次
              ]
            }
            xAxisData.push(xDataItem)
          })
        })
        return xAxisData
      },
      padding (val) {
        if (val < 10) {
          val = '0' + val
        }
        return val
      },
      // 渲染甘特图小格子 - 实际
      renderItemActual (params, api) {
        let categoryIndex = api.value(0)
        let start = api.coord([api.value(1), categoryIndex])
        let end = api.coord([api.value(2), categoryIndex])
        let height = api.size([0, 1])[1] * 0.6
        return {
          type: 'rect',
          shape: echarts.graphic.clipRectByRect({
              x: start[0],
              y: start[1] - height / 2,
              width: end[0] - start[0],
              height: height
          }, {
              x: params.coordSys.x,
              y: params.coordSys.y,
              width: params.coordSys.width,
              height: params.coordSys.height
          }),
          style: api.style()
        }
      },
      // 渲染甘特图小格子 - 计划
      renderItemPlanned (params, api) {
        let isRepeat = api.value(4)
        if (isRepeat) {
          return null
        } else {
          let categoryIndex = api.value(0)
          let start = api.coord([api.value(1), categoryIndex])
          let end = api.coord([api.value(2), categoryIndex])
          let height = api.size([0, 1])[1] * 0.9
          return {
            type: 'rect',
            shape: echarts.graphic.clipRectByRect({
                x: start[0],
                y: start[1] - height / 2,
                width: end[0] - start[0],
                height: height
            }, {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
            }),
            style: api.style()
          }
        }
      },
      // 图表重绘
      chartResize () {
        if (!this.echartsjsLoaded) return
        this.$nextTick(() => {
          if (this.$refs.timeTable) {
            this.chartWidth = this.$refs.timeTable.offsetWidth + this.$refs.section.offsetWidth * 0 / 10 + 100 + 'px'
            this.gantChart.clear()
            setTimeout(() => {
              this.gantChart.resize()
              this.initChartData(this.data)
            })
          }
        })
      },
      // 每个工序的时间的最大值和最小值
      // 所有工序的时间最大值和最小值
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
      },
      // 处理鼠标滚动
      handleScroll (e) {
        return
        
        if (this.$refs.timeTable.contains(e.target)) {
          e.wheelDeltaY > 0 ? ++this.addDays : --this.addDays
          e.stopPropagation()
          e.preventDefault()
        }
      }
    },
    watch: {
      // echartsjs加载完成
      echartsjsLoaded (val) {
        if (val) {
          this.gantChart = echarts.init(this.$refs.gantChart)
          // 添加点击事件
          this.gantChart.on('click', (param) => {
            this.$emit('item-click', param)
          })
          if (this.data) {
            this.initPage(this.data)
          }
        }
      },
      splitHour (val) {
        let split = 24 / parseInt(val)
        this.timeList = []
        Array.from({ length: split }).forEach((item, index) => {
          this.timeList.push(`${this.padding(index * val)}:00`)
        })
       this.chartResize() 
      },
      // 从获取的data数据可以计算出，最小时间和最大时间
      data (list) {
        this.initPage(list)
      },
      batchList (list) {
        list.forEach((item, index) => {
          item.index = index
          this.batchListDict[item.id] = item
        })
        // this.initChartData(this.data)
      },
      startDate (val) {
        this.startDateCopy = val
        this.initChartData(this.data)
      },
      endDate (val) {
        this.endDateCopy = val
        this.initChartData(this.data)
      },
      addDays (val) {
        if (val < 10 && val > -10) {
          this.endDateCopy = utils.addDateByDay(this.endDate, val)
        }
      }
    },
    destroyed () {
      window.onmousewheel = document.onmousewheel = null
    }
  }
</script>

<style scoped lang="scss">
.gant-chart {
  min-height: 200px;
}
.table {
  border-collapse: collapse;
  th {
    border: 1px solid #dfdfdf;
    color: #666;
    padding: 6px 4px;
  }
}
.circle-number {
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  background-color: #009DD9;
  border-radius: 50%;
  text-align: center;
  color: #fff;
}
.status-color {
  display: inline-block;
  width: 30px;
  height: 16px;
  border-radius: 8px;
  vertical-align: -3px;
}
</style>

<style>
.cell-text-center .cell{
  text-align: center;
}
.gant-chart-table .el-table__empty-block {
  display: none;
}
</style>
