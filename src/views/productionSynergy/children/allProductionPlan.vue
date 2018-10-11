<!--生产进度主体-->
<template>
  <div id="allProductionPlan">
    <div class="planChart  after">
      <div class="title">
        <div class="block">
          <p class="timeQuantum">时间段选择：</p>
          <el-date-picker v-model="timeQuantum"
                          @change="selectTime"
                          size="small"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          align="right"
                          unlink-panels
                          range-separator="|"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="productionBar">
          <ul>
            <li class="py-1">
              <span>生产批次:{{nowplanTxt.plan_batch}}</span>
              <span class="px-3">产品名称:{{nowplanTxt.name}}</span>
              <span class="px-3">负责人：{{nowplanTxt.plan_responsible}}</span>
              <span class="px-3">生产进度：{{nowplanTxt.craftProductionSchedule}}</span>
            </li>
            <li class="py-1">
              <span v-html="'计划时间：'+nowplanTxt.planTime"></span>
              <span class="px-3"
                    v-html="'实际时间：'+nowplanTxt.actualTime"></span>
              <span class="px-3">实际产出量：{{nowplanTxt.plan_actual_output}}</span>
              <span class="px-3">排产量：{{nowplanTxt.plan_output}}</span>
            </li>
          </ul>
          <template>
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
          </template>
        </div>
      </div>
    </div>
    <div class="chartBox">
      <div class="leftBox">
        <div class="one"></div>
        <div class="two noScroll"
             ref="planScroll">
          <ul>
            <li @click="$router.push({path:'process',query:{planId:item.plan_id}})"
                v-for="(item,index) in planList"
                :key="index"
                v-cloak
                @mouseover="showPlan(index)"
                :style="{'color':item.plan_id==activeCurrent?'#00e4bd':''}">
              {{item.plan_batch}}
            </li>
          </ul>
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
          <div class="planList"
               @click="openDialog(index)"
               v-for="(item,index) in lineList"
               :key="index" @mouseover="getCurrentProcess(item)" @mouseout="outCurrentProcess(item)">
            <span class="subline"
                  :style="{marginLeft:(item.planMarginLeft-1)+'px',height:35+(index*40)+'px',top:-15-(index*40)+'px'}"
                  v-show="item.planSubline"></span>
            <div class="plan"
                 :style="{width:item.planWidth+'px',marginLeft:item.planMarginLeft+'px'}"
                 @mouseover="getPostion(item,index,0)"
                 @mouseout="outPostion(item,index,0)">
            </div>
            <span class="subline"
                  :style="{marginLeft:(item.planMarginLeft+item.planWidth-1)+'px',height:35+(index*40)+'px',top:-15-(index*40)+'px'}"
                  v-show="item.planSubline"></span>
            <span class="subline"
                  :style="{marginLeft:(item.actualMarginLeft-1)+'px',height:30+(index*40)+'px',top:-15-(index*40)+'px'}"
                  v-show="item.actualSubline"></span>
            <div class="actual"
                 :style="{width:item.actualWidth+'px',marginLeft:item.actualMarginLeft+'px'}"
                 @mouseover="getPostion(item,index,1)"
                 @mouseout="outPostion(item,index,1)"></div>
            <span class="subline"
                  :style="{marginLeft:(item.actualMarginLeft+item.actualWidth-1)+'px',height:30+(index*40)+'px',top:-15-(index*40)+'px'}"
                  v-show="item.actualSubline"></span>
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
          </div>
        </div>
      </div>
    </div>
    <!-- 甘特图弹窗组件 -->
    <gant-chart-dialog :visible.sync="visible.gantDialog"
                       :title="currentPlan ? currentPlan.plan_batch : ''"
                       :data="currentPlan"></gant-chart-dialog>
  </div>
</template>
<script>
import utils from "@/utils/index";
import gantChartDialog from "@/components/production/gantChartDialog";
export default {
  name: "allProductionPlan",
  components: { gantChartDialog },
  props: ["parentData"],
  data() {
    return {
      loading: false, //加载
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
      timeQuantum: [], //时间段选择
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
      //甘特图弹出
      visible: {
        gantDialog: false
      },
      planList: [], //计划列表
      minTime: "", //最小时间
      maxTime: "", //最大时间
      lineList: [], //图的数据里面包含四个时间转化的2段线，一个辅助线的false，一个弹出
      nowplanTxt: {
        name: "", //名称
        plan_batch: "", //批次
        planTime: "", //计划时间
        actualTime: "", //实际时间
        plan_responsible: "", //负责人
        craftProductionSchedule: "", //进度
        plan_actual_output: "", //实际产出量
        plan_output: "" //排产量
      }, //当前批次信息
      curPosX: "", //鼠标位置
      currentPlan: null, // 当前选中的plan
      activeCurrent:''//当前高亮
    };
  },
  mounted() {
    this.deTimeSection();
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
    //滚动监听事件
    //时间段默认 传个new Date
    defaultTime(date) {
      let Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate();
      M = M < 10 ? `0${M}` : M;
      D = D < 10 ? `0${D}` : D;
      return `${Y}-${M}-${D}`;
    },
    //设置默认时间，当前往前7天
    deTimeSection() {
      let sDate = new Date();
      let eDate = new Date(sDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      this.timeQuantum = [this.defaultTime(eDate), this.defaultTime(sDate)];
      //请求接口获取批次（计划）列表和最大最小时间划线
      //获取数据
      this.queryPlanView(
        this.parentData.planType,
        this.parentData.planStatus,
        this.parentData.keyword
      );
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
    //时间段选择
    selectTime() {
      this.queryPlanView(
        this.parentData.planType,
        this.parentData.planStatus,
        this.parentData.keyword
      );
    },
    //选择时间间隔
    selectInterval() {
      //重新画刻度线
      this.drawLine(this.planList);
    },
    //查询生产计划视图
    async queryPlanView(type, planStatus, keyword) {
      this.planList = [];
      this.loading = true; // 等待
      const e = await this.ajax("queryPlanView", {
        staffType: type,
        planStatus: planStatus,
        keyword: keyword,
        startTime: this.timeQuantum[0] + " " + "00:00:00",
        endTime: this.timeQuantum[1] + " " + "00:00:00",
        timeInterval: "hour"
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        this.planList = e.map.planViewDTOs;
        //最小时间
        this.minTime = e.map.minTime.split(" ")[0] + " " + "00:00:00";
        //最大时间,去时间但是多出一天
        this.maxTime = e.map.maxTime.split(" ")[0] + " " + "24:00:00";
        //画时间线
        this.drawingScale(this.minTime, this.maxTime);
        //画图
        this.drawLine(this.planList);
        //上方批次显示默认第一个
        this.showPlan(0);
      } else if (e.status === 2) {
        this.$message({
          message: "没有找到相关数据",
          type: "warning"
        });
        //暂无数据
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //画进度图,TimeList:[{a: "2018-08-24 06:00:00",b: "2018-08-26 12:00:00",c: "2018-08-24 09:20:00",d: "2018-08-25 16:00:00"}]
    drawLine(timeList) {
      this.lineList = [];
      this.$nextTick(() => {
        //这里开始处理生产一条条的线[{planWidth:'',planMarginLeft:'',actualWidth:'',actualMarginLeft:''}]
        if (timeList.length == 0) {
          return false;
        } else {
          timeList.forEach((n, i) => {
            this.lineList.push(this.timeSwitchPx(n));
          });
        }
      });
    },
    //处理方法时间对象转化成长px
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
        aT = new Date(this.minTime).getTime(),
        //从这个基准去算
        aS = new Date(obj.plan_scheduled_start_time).getTime(),
        aE = new Date(obj.plan_scheduled_completion_time).getTime(),
        bS = new Date(obj.plan_actual_start_time).getTime(),
        bE = new Date(obj.plan_actual_completion_time).getTime();
      //计划
      px.planWidth = (aE - aS) / 1000 * rate;
      px.planMarginLeft = (aS - aT) / 1000 * rate;
      //实际
      px.actualWidth = (bE - bS) / 1000 * rate;
      px.actualMarginLeft = (bS - aT) / 1000 * rate;
      px.planSubline = false; //计划辅助线
      px.actualSubline = false; //实际辅助线
      px.id=obj.plan_id;//批次的id
      return px;
    },
    //移入显示批次的信息
    showPlan(index) {
      this.nowplanTxt.plan_batch = this.planList[index].plan_batch;
      this.nowplanTxt.planTime =
        this.planList[index].plan_scheduled_start_time +
        "&nbsp;至&nbsp;" +
        this.planList[index].plan_scheduled_completion_time;
      this.nowplanTxt.actualTime =
        this.planList[index].plan_actual_start_time +
        "&nbsp;至&nbsp;" +
        this.planList[index].plan_actual_completion_time;
      this.nowplanTxt.plan_responsible = this.planList[index].plan_responsible;
      this.nowplanTxt.craftProductionSchedule = this.planList[
        index
      ].craftProductionSchedule;
      this.nowplanTxt.plan_actual_output = this.planList[
        index
      ].plan_actual_output;
      this.nowplanTxt.plan_output = this.planList[index].plan_output;
      this.nowplanTxt.name = this.planList[index].product_model_name;
    },
    //弹出甘特图
    openDialog(index) {
      this.currentPlan = this.planList[index];
      this.visible.gantDialog = true;
    },
    //tooltip跟随鼠标,辅助线显示
    getPostion(item, index, tag) {
      switch (tag) {
        case 0:
          item.planSubline = true;
          break;
        case 1:
          item.actualSubline = true;
          break;
        default:
          break;
      }
      // let dom = this.$refs.tooltip;
      // dom.style.display = "block";
      // dom.style.top = 110+index*40+'px';
      // dom.style.left = event.offsetX - 450 + "px";
      this.showPlan(index);
    },
    //鼠标离开
    outPostion(item, index, tag) {
      switch (tag) {
        case 0:
          item.planSubline = false;
          break;
        case 1:
          item.actualSubline = false;
          break;
        default:
          break;
      }
      // let dom = this.$refs.tooltip
      // dom.style.display = "none";
    },
    //选中的那个批次
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
#allProductionPlan {
  .planChart {
    .title {
      width: 100%;
      .block {
        float: left;
        width: 300px;
        height: 100px;
        background-color: $elAsideColor;
        .timeQuantum {
          width: 100%;
          padding: 20px 10px;
        }
        .el-date-editor--daterange.el-input__inner {
          margin-left: 10px;
          width: 270px;
        }
      }
      .productionBar {
        padding: 7px 20px;
        float: left;
        height: 100px;
        width: -moz-calc(100% - 300px);
        width: -webkit-calc(100% - 300px);
        width: calc(100% - 300px);
        background-color: $planColor;
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
      .one,
      .three {
        width: 100%;
        height: 60px;
      }
      .two {
        /*重点*/
        width: 100%;
        height: -moz-calc(100vh - 340px);
        height: -webkit-calc(100vh - 340px);
        height: calc(100vh - 340px);
        overflow: auto;
        ul {
          li {
            padding: 10px 0 10px 10px;
            height: 40px;
            // border-bottom: 1px solid #cccccc;
            &:hover {
              color: $actualColor;
              cursor: pointer;
            }
          }
        }
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
        .planList {
          padding: 10px 0;
          position: relative;
          &:hover {
            cursor: pointer;
          }
          .subline {
            width: 1px;
            float: left;
            background: #ccc;
            z-index: 10;
            position: absolute;
          }
          .plan {
            z-index: 1;
            height: 20px;
            background-color: $planColor;
            border-radius: 20px;
          }
          .actual {
            z-index: 2;
            height: 10px;
            background-color: $actualColor;
            border-radius: 10px;
            position: absolute;
            top: 15px;
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
