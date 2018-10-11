<!-- 我的工单主页面 -->
<template>
  <div id="myWorkOrder">
    <el-row>
    <el-col :span="24"
            class="switcher">
      <el-button type="primary"
                 class="ml-5"
                 @click="setWorkdialog">创建工单</el-button>
      <div class="filter">
        <div class="size1 fl mr-3">
          <el-select v-model="type1"
                     @change="changeType">
            <el-option v-for="item in typeList1"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="size2 fl mr-3">
          <el-select v-model="type2"
                     @change="changeStatus">
            <el-option v-for="item in typeList2"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="fr size3">
          <el-input placeholder="搜索生产批次/工序/工单号"
                    v-model="inputValue"
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
    <allMyWorkOrderList :parentData="{'status': status,'searchType': searchType,'staffType':staffType, 'keyword':keyword}"
                        ref="allMyWorkOrderList"></allMyWorkOrderList>
    <!--计划外派工dialog -->
    <el-dialog title="计划外派工"
               :visible.sync="dlVisible"
               width="30%"
               min-width="600"
               :before-close="handleClose">
      <createWorkOrder @handle="handle"></createWorkOrder>
    </el-dialog>

  </div>
</template>

<script>
import allMyWorkOrderList from "@/views/productionSynergy/children/allMyWorkOrderList";
import createWorkOrder from "@/views/productionSynergy/components/createWorkOrder";
export default {
  name: "myWorkOrder",
  components: {
    allMyWorkOrderList,
    createWorkOrder
  },
  data() {
    return {
      //创建工单显示与否
      dlVisible: false,
      //下拉框1
      type1: "1",
      typeList1: [
        {
          value: "1",
          label: "所有"
        },
        {
          value: "2",
          label: "我创建"
        },
        {
          value: "3",
          label: "我负责"
        }
      ],
      //下拉框2
      type2: "1",
      typeList2: [
        {
          value: "1",
          label: "所有状态"
        },
        {
          value: "2",
          label: "未生产"
        },
        {
          value: "3",
          label: "生产中"
        },
        {
          value: "4",
          label: "暂停"
        },
        {
          value: "5",
          label: "已完成"
        },
        {
          value: "6",
          label: "关闭"
        },
        {
          value: "7",
          label: "未发出"
        },
        {
          value: "8",
          label: "已发出"
        },
        {
          value: "9",
          label: "已回厂"
        },
        {
          value: "10",
          label: "重组状态(未生产/未发出)"
        }
      ],
      inputValue: "", //搜索框内容
      // loading: false, //搜索状态
      status: "all",
      searchType: "vague",
      staffType: "all",
      keyword: ""
    };
  },
  mounted() {},
  methods: {
    //创建工单弹窗
    setWorkdialog() {
      this.dlVisible = true;
    },
    //关闭二级dialog
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    changeType(val) {
      switch (val) {
        case "1":
          this.staffType = "all";
          break;
        case "2":
          this.staffType = "establishStaff";
          break;
        case "3":
          this.staffType = "principal";
          break;
      }
      this.$refs.allMyWorkOrderList.queryWorkOrderOutline(
        this.status,
        this.searchType,
        this.staffType
      );
    },
    changeStatus(val) {
      switch (val) {
        case "1":
          this.status = "all";
          break;
        case "2":
          this.status = "awaitProduction";
          break;
        case "3":
          this.status = "inProduction";
          break;
        case "4":
          this.status = "pause";
          break;
        case "5":
          this.status = "complete";
          break;
        case "6":
          this.status = "close";
          break;
        case "7":
          this.status = "notEmit";
          break;
        case "8":
          this.status = "emit";
          break;
        case "9":
          this.status = "homing";
          break;
        case "10":
          this.status = "recombination";
          break;
        default:
          console.log("错误啦");
          break;
      }
      this.$refs.allMyWorkOrderList.queryWorkOrderOutline(
        this.status,
        this.searchType,
        this.keyword
      );
    },
    selectInput() {},
    //子组件关闭dialog
    handle() {
      this.dlVisible = false;
    }
  }
};
</script>