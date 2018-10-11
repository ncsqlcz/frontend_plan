<!--工序进度主体-->
<template>
  <div class="processPlan"
       v-loading="loading">
    <div class="progressChart  after">
      <div class="fl"></div>
      <div class="fr">
        <el-col :span="20">
          <p class="pt-2 pl-2">
            <span>生产批次:{{batch.plan_batch}}</span>
            <span class="px-3">产品名称:{{batch.product_model_name}}</span>
            <span class="px-3">负责人：{{batch.plan_responsible}}</span>
          </p>
          <p class="pt-2 pl-2">
            <span v-html="'计划时间：'+batch.plan_scheduled_start_time+'&nbsp;至&nbsp;'+batch.plan_scheduled_completion_time"></span>
            <span class="px-3">生产进度：{{batch.craftProductionSchedule}}</span>
            <span class="px-3">实际产出量：{{batch.plan_actual_output}}</span>
          </p>
          <p class="pt-2 pl-2">
            <span>时间线间隔</span>
            <el-select v-model="interval"
                       @change='selectInterval'
                       size="small"
                       placeholder="请选择">
              <el-option v-for="item in intervalOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </p>
        </el-col>
        <el-col :span="4"
                class="back">
          <el-button type="primary"
                     size="small"
                     @click="$router.back(-1)">返回</el-button>
        </el-col>
      </div>
    </div>
    <div class="chartBox">
      <div class="leftBox">
        <div class="one"></div>
        <div class="processPlanList noScroll"
             ref="planScroll">
          <div class="processBox"
               v-for="(item,index) in batch.productionCraftPaths"
               :key="index">
            <p class="batch">
              <span class="fz1">{{item.production_process_name}}</span>
              <span>已完成{{item.workOrderProductionSchedule}}</span>
            </p>
            <ul class="process">
              <li v-for="(item1,index1) in item.workOrderDOs"
                  :key="index1" :style="{'color':item1.work_order_id==activeCurrent?'#00e4bd':''}">
                <span>{{item1.work_order_number}}</span>&nbsp;
                <span>负责人：{{item1.plan_responsible}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="three"></div>
      </div>
      <div class="rightBox">
        <div class="one noScroll"
             ref="timeScroll">
          <ul class="day">
            <li v-for="(day,dayindex) in dayList"
                :key="dayindex"
                ref="getLi">
              <p>{{day}}</p>
              <ul>
                <li v-for="(item ,index) in (24/interval)"
                    :key="index">{{index*interval+':00'}}</li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="two hasScroll"
             ref="lineScroll">
          <div class="chartLine"
               v-for="(a,b) in lineList"
               :key="b">
            <div class="processLi"
                 v-for="(item,index) in a.process"
                 :key="index" @mouseover="getCurrentProcess(item)" @mouseout="outCurrentProcess(item)">
              <div class="plan"
                   :style="{width:item.planWidth+'px',marginLeft:item.planMarginLeft+'px',zIndex:1, backgroundColor:'#b4efd9'}"></div>
              <div class="commonStyle hasBorderRadius"
                   :style="{width:item.actualWidth+'px',marginLeft:item.actualMarginLeft+'px',zIndex:2,backgroundColor:'#00e4bd'}"></div>
              <div class="commonStyle"
                   :style="{width:item.awaitWidth+'px',marginLeft:item.awaitMarginLeft+'px',zIndex:3,backgroundColor:'#1d3e3f'}"></div>
              <div class="commonStyle"
                   :style="{width:item1.width+'px',marginLeft:item1.marginLeft+'px',zIndex:4+index1,backgroundColor:'#f9ed8e'}"
                   v-for="(item1,index1) in item.pause"
                   :key="index1">
              </div>
            </div>
          </div>
        </div>
        <div class="three">
          <!--图的标识 -->
          <div class="chartExplain before after">
            <div class="name">计划：
              <span class="model planColor">&nbsp;</span>
            </div>
            <div class="name">实际：
              <span class="model actualColor">&nbsp;</span>
            </div>
            <div class="name">等待：
              <span class="model awaitColor">&nbsp;</span>
            </div>
            <div class="name">暂停:
              <span class="model pauseColor">&nbsp;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "processPlan",
  props: ["parentData"],
  data() {
    return {
      loading: false,
      intervalOptions: [
        {
          value: 3,
          label: "3小时"
        },
        {
          value: 6,
          label: "6小时"
        },
        {
          value: 8,
          label: "8小时"
        },
        {
          value: 12,
          label: "12小时"
        },
        {
          value: 24,
          label: "24小时"
        }
      ],
      dayList: [], //天数列表
      interval: 6, //默认时间线间隔
      minTime: "", //最小时间
      maxTime: "", //最大时间
      batch: {}, //批次》工序》工单》时间》暂停时间数组
      lineList: [], //线列表
      activeCurrent:''
    };
  },
  mounted() {
    //查询工单视图默认为所以状态的
    this.queryWorkOrderView(this.parentData.planId, "all");
    //创建监听事件
    this.$nextTick(() => {
      let planScroll = this.$refs.planScroll,
        lineScroll = this.$refs.lineScroll,
        timeScroll = this.$refs.timeScroll;
      // 监听这个dom的scroll事件
      // planScroll.addEventListener("scroll", (e) => {
      //   lineScroll.scrollTo(0,planScroll.scrollTop);
      // },false);
      lineScroll.addEventListener(
        "scroll",
        e => {
          planScroll.scrollTo(0, lineScroll.scrollTop);
          timeScroll.scrollTo(lineScroll.scrollLeft, 0);
        },
        false
      );
    });
  },
  methods: {
    //查询生产计划视图
    async queryWorkOrderView(planId, workOrderStatus, keyword) {
      this.loading = true; // 等待
      this.dayList = [];
      this.batch = {};
      this.lineList = [];
      const e = await this.ajax("queryWorkOrderView", {
        planId: planId,
        workOrderStatus: workOrderStatus,
        keyword: keyword
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        this.batch = e.map.planViewDTOs[0];
        //batch.productionCraftPaths,工序
        //最小时间
        this.minTime = e.map.minTime.split(" ")[0] + " " + "00:00:00";
        //最大时间,去时间但是多出一天
        this.maxTime = e.map.maxTime.split(" ")[0] + " " + "24:00:00";
        //画时间线
        this.drawingScale(this.minTime, this.maxTime);
        //画进度图
        this.drawLine(this.batch.productionCraftPaths); //工序[{[工单]}]
      } else if (e.status === 2) {
        //暂无数据
        this.$message({
          message: "暂无数据",
          type: "warning"
        });
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //画刻度线
    drawingScale(minTime, maxTime) {
      let a = new Date(minTime).getTime();
      let b = new Date(maxTime).getTime();
      let dayNum = (b - a) / (24 * 60 * 60 * 1000);
      let data = [];
      for (let index = 0; index <= dayNum; index++) {
        let time = a + 24 * 60 * 60 * 1000 * index;
        data[index] =
          new Date(time).getMonth() + 1 + "/" + new Date(time).getDate();
      }
      this.dayList = data;
    },
    timeNum(str) {
      return new Date(str).getTime();
    },
    //工单处理方法时间对象转化成长px
    timeSwitchPx(obj) {
      let liDom = this.$refs.getLi,
        px = {},
        ulGetWidth = liDom[0].clientWidth * (this.dayList.length - 1), //时间段选择的区间(uldom的总长度)
        k = new Date(this.maxTime).getTime() / 1000,
        j = new Date(this.minTime).getTime() / 1000,
        //时间段选择的区间分为多少s
        secondNum = k - j,
        //每1s占用多少px
        rate = ulGetWidth / secondNum,
        //一个基准
        aT = this.timeNum(this.minTime);
      //从这个基准去算
      //计划
      px.planMarginLeft =
        (this.timeNum(obj.work_order_scheduled_state_time) - aT) / 1000 * rate;
      px.planWidth =
        (this.timeNum(obj.work_order_scheduled_complete_time) -
          this.timeNum(obj.work_order_scheduled_state_time)) /
        1000 *
        rate;
      //实际
      if (obj.work_order_actual_state_time == null) {
        px.actualMarginLeft = 0;
        px.actualWidth = 0;
      } else {
        px.actualMarginLeft =
          (this.timeNum(obj.work_order_actual_state_time) - aT) / 1000 * rate;
        px.actualWidth =
          (this.timeNum(obj.work_order_actual_complete_time) -
            this.timeNum(obj.work_order_actual_state_time)) /
          1000 *
          rate;
      }
      //暂停，这里可以暂停多次obj.detailsTimeDTOs暂停的数组
      px.pause = []; //暂停的时间数组
      if (obj.detailsTimeDTOs.length != 0) {
        obj.detailsTimeDTOs.forEach(n => {
          px.pause.push({
            marginLeft:
              (this.timeNum(n.process_pause_start_time) - aT) / 1000 * rate,
            width:
              (this.timeNum(n.process_pause_end_time) -
                this.timeNum(n.process_pause_start_time)) /
              1000 *
              rate
          });
        });
      } else {
        px.pause = [];
      }
      //等待:实际开始时间大于计划开始时间
      if (
        this.timeNum(obj.work_order_actual_state_time) >=
        this.timeNum(obj.work_order_scheduled_state_time)
      ) {
        //有等待时间
        px.awaitWidth =
          (this.timeNum(obj.work_order_actual_state_time) -
            this.timeNum(obj.work_order_scheduled_state_time)) /
          1000 *
          rate;
        px.awaitMarginLeft = px.planMarginLeft;
      } else {
        //无等待时间
        px.awaitWidth = 0;
        px.awaitMarginLeft = 0;
      }
      px.id=obj.work_order_id;//工单id
      return px;
    },
    //TimeList:[{a: "2018-08-24 06:00:00",b: "2018-08-26 12:00:00",c: "2018-08-24 09:20:00",d: "2018-08-25 16:00:00",e:[{a:'',b:''}]},]
    drawLine(data) {
      this.lineList = []; //线列表[{[工单]}]
      //不加nexttick就是出现获取不到 li时间轴也就画不了线
      this.$nextTick(() => {
        //工序
        if (data.length == 0) {
          return false;
        } else {
          data.forEach((n, i) => {
            this.lineList.push({
              process: []
            });
            //工单work_order
            n.workOrderDOs.forEach(n1 => {
              this.lineList[i].process.push(this.timeSwitchPx(n1));
              // this.lineList[i1] = this.timeSwitchPx(n1);//数组本身没变，push的时候触发vue hike()方法才会触发对象改变
            });
          });
        }
      });
      // console.log(this.lineList);
    },
    //选择时间间隔
    selectInterval() {
      //画进度图
      this.drawLine(this.batch.productionCraftPaths); //工序[{[工单]}]
    },
    //选中的那个工序
    getCurrentProcess(item){
      this.activeCurrent=item.id;
    },
    outCurrentProcess(item){
      let a=this.activeCurrent;
      return this.activeCurrent=item.id==a?'':a
    }
  }
};
</script>
<style lang="scss" scoped>
$elAsideColor: rgb(221, 237, 236);
$planColor: #b4efd9;
$actualColor: #00e4bd;
$awaitColor: rgb(29, 62, 63);
$pauseColor: rgb(249, 237, 142);
.processPlan {
  .progressChart {
    width: 100%;
    height: 100px;
    .fl {
      width: 300px;
      height: 100px;
      background-color: $elAsideColor;
    }
    .fr {
      width: -moz-calc(100% - 300px);
      width: -webkit-calc(100% - 300px);
      width: calc(100% - 300px);
      height: 100px;
      background-color: $planColor;
      .back {
        text-align: center;
        line-height: 100px;
      }
    }
  }
  .chartBox {
    width: 100%;
    height: -moz-calc(100vh - 220px);
    height: -webkit-calc(100vh - 220px);
    height: calc(100vh - 220px);
    .leftBox {
      width: 300px;
      float: left;
      background-color: $elAsideColor;
      .processPlanList {
        /*重点*/
        width: 100%;
        height: -moz-calc(100vh - 340px);
        height: -webkit-calc(100vh - 340px);
        height: calc(100vh - 340px);
        overflow: auto;
        .processBox {
          .batch {
            padding-left: 10px;
            height: 40px;
            line-height: 40px;
            white-space: nowrap;
            .fz1 {
              font-weight: bold;
            }
          }
          .process {
            li {
              white-space: nowrap;
              padding: 10px 0 10px 10px;
              height: 40px;
              // border-bottom: 1px solid #cccccc;
            }
          }
        }
      }
      .one,.three {
        width: 100%;
        height: 60px;
      }
    }
    .rightBox {
      float: left;
      width: -moz-calc(100% - 300px);
      width: -webkit-calc(100% - 300px);
      width: calc(100% - 300px);
      .one {
        /*重点*/
        overflow-x: scroll;
        overflow-y: hidden;
        width: 100%;
        height: 60px;
        .day {
          width: 100%;
          display: flex;
          height: 60px;
          li {
            text-align: center;
            height: 20px;
            flex: 1;
            ul {
              margin-top: 5px;
              display: flex;
              li {
                flex: 1;
                box-sizing: content-box;
                min-width: 50px;
                height: 30px;
                border-top: 1px solid #ccc;
                border-right: 1px solid #ccc;
              }
            }
          }
        }
      }
      .two {
        width: 100%;
        height: -moz-calc(100vh - 340px);
        height: -webkit-calc(100vh - 340px);
        height: calc(100vh - 340px);
        overflow: auto; /*重点*/
        .chartLine {
          margin-top: 40px;
          width: 100%;
          .processLi {
            box-sizing: border-box;
            padding: 10px 0;
            position: relative;
            
            .plan {
              height: 20px;
              border-radius: 20px;
            }
            .hasBorderRadius {
              border-radius: 10px;
            }
            .commonStyle {
              height: 10px;
              position: absolute;
              top: 15px;
            }
          }
        }
      }
      .three {
        width: 100%;
        height: 60px;
        .chartExplain {
          position: fixed;
          bottom: 20px;
          left: 460px;
          width: 100%;
          display: inline-block;
          height: 20px;
          .name {
            display: inline-block;
            height: 20px;
            line-height: 20px;
            font-size: 13px;
            padding: 0 10px;
            .planColor {
              background-color: $planColor;
            }
            .actualColor {
              background-color: $actualColor;
            }
            .awaitColor {
              background-color: $awaitColor;
            }
            .pauseColor {
              background-color: $pauseColor;
            }
            .model {
              display: inline-block;
              width: 50px;
              height: 20px;
              border-radius: 13px;
            }
          }
        }
      }
    }
  }
}
</style>
