<!--工艺概览-->
<template>
    <div class="craftOverview">
        <el-row>
            <el-col :span="24"
                    class="switcher">
                <div class="ml-5 sortBox">
                    <span class="fl mr-3 sortName">排序方式</span>
                    <div class="sort fl">
                        <span class="name">发布时间</span>
                        <span class="caret-wrapper">
                            <i class="el-icon-caret-top sortActive"></i>
                            <i class="el-icon-caret-bottom"></i>
                        </span>
                    </div>
                    <div class="sort fl">
                        <span class="name">发布版本号</span>
                        <span class="caret-wrapper">
                            <i class="el-icon-caret-top"></i>
                            <i class="el-icon-caret-bottom"></i>
                        </span>
                    </div>
                    <div class="sort fl">
                        <span class="name">名称</span>
                        <span class="caret-wrapper">
                            <i class="el-icon-caret-top"></i>
                            <i class="el-icon-caret-bottom"></i>
                        </span>
                    </div>
                </div>
                <div class="filter">
                    <div class="size2 fl mr-3">
                        <el-select v-model="state"
                                   placeholder="全部产品类型"
                                   @change="changeState">
                            <el-option v-for="item in stateList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="fl mr-3">
                        <el-date-picker v-model="timeQuantum"
                                        @change="selectTime"
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
                    <div class="fr size3">
                        <el-input placeholder="路径/产品名称/创建人"
                                  v-model="path"
                                  clearable
                                  @clear="selectInput"
                                  @keyup.native.enter="selectInput">
                            <el-button slot="append"
                                       icon="el-icon-search"
                                       @click.native="selectInput"></el-button>
                        </el-input>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
  name: "productionPlan",
  data() {
    return {
      state: "all",
      stateList: [
        {
          value: "all",
          label: "所有类型"
        },
        {
          value: "awaitProduction",
          label: "未生产"
        },
        {
          value: "inProduction",
          label: "生产中"
        },
        {
          value: "complete",
          label: "完成"
        },
        {
          value: "pause",
          label: "暂停"
        },
        {
          value: "close",
          label: "关闭"
        }
      ],
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
      path: "" //批次
    };
  },
  mounted() {},
  methods: {
      //切换类型
    changeState() {},
    //搜索
    selectInput() {},
    //时间段选择
    selectTime() {}
  }
};
</script>
<style lang="scss" scoped>
.craftOverview {
  .sortBox {
    position: absolute;
    top: 10px;
    left: 0;
    .sortName {
      color: #fff;
      line-height: 40px;
    }
    .sort {
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      padding-left: 15px;
      margin-right: 10px;
      background-color: #fff;
      .caret-wrapper {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        height: 30px;
        width: 25px;
        vertical-align: middle;
        cursor: pointer;
        overflow: initial;
        position: relative;
      }
      .sortActive {
        color: #17c9a7;
      }
    }
  }
}
</style>

