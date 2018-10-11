<!--工序列表主体-->
<template>
  <div class="processList"
       v-loading="loading">
    <el-row class="toolbar">
      <ul class="fl">
        <li>
          <span>生产批次:{{processList.plan_batch}}</span>
          <span class="px-3">产品名称:{{processList.product_model_name}}</span>
          <span class="px-3">生产进度：{{processList.craftProductionSchedule}}</span>
        </li>
        <li>
          <span v-html="'计划时间：'+processList.plan_scheduled_start_time+'&nbsp;至&nbsp;'+processList.plan_scheduled_completion_time"></span>
          <span class="px-3">实际产出量：{{processList.plan_actual_output}}</span>
          <span class="px-3">负责人：{{processList.plan_responsible}}</span>
        </li>
      </ul>
      <div class="fr btnBox">
        <el-button type="primary"
                   size="small"
                   class="mr-3"
                   @click="regroup()">重组工单</el-button>
        <el-button type="primary"
                   size="small"
                   @click="$router.back(-1)">返回</el-button>
      </div>
    </el-row>
    <el-row class="processContont">
      <el-collapse v-model="activeName"
                   accordion
                   @change="clearSelct">
        <el-collapse-item :title=item.production_process_name
                          :name=index
                          v-for="(item,index) in processList.productionCraftPaths"
                          :key="index">
          <template>
            <el-table :data="item.workOrderDOs"
                      ref="multipleTable"
                      height="220"
                      style="width: 100%"
                      @selection-change="handleSelectionChange"
                      @row-click="lookDetail">
              <el-table-column prop="work_order_number"
                               label="工单号"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="plan_batch"
                               label="生成批次"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="production_process_name"
                               label="工序"
                               show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="work_order_responsible"
                               label="负责人">
              </el-table-column>
              <el-table-column prop="work_order_output"
                               label="排产量"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="生产状态"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="work.transitionStatus(scope.row.plan_production_status)"></span>
                </template>

              </el-table-column>
              <el-table-column prop="work_order_production_mode"
                               label="生产方式"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="计划时间"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-html="scope.row.work_order_scheduled_state_time+'&nbsp;至&nbsp;'+scope.row.work_order_scheduled_complete_time"></span>
                </template>
              </el-table-column>
              <el-table-column type="selection"
                               width="55">
              </el-table-column>
            </el-table>
          </template>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <!-- 工单详情 -->
    <el-dialog title="工单详情页"
               top='120px'
               width="450px"
               :visible.sync="dialogDetail"
               class="detailDialog">
      <processDetail :workOrderId="nowProcessId"
                     ref="processDetail"></processDetail>
    </el-dialog>
    <!-- 重组工单 -->
    <el-dialog title="重组工单"
               :visible.sync="regroupDialog">
      <template>
        <el-table :data="regroupProcessList"
                  style="width: 100%">
          <el-table-column prop="work_order_number"
                           label="工单号"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="work_order_responsible"
                           label="负责人"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="work_order_output"
                           label="排产量"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="计划时间"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="scope.row.work_order_scheduled_state_time+'&nbsp;至&nbsp;'+scope.row.work_order_scheduled_complete_time"></span>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="80">
            <template slot-scope="scope">
              <span class="danger"
                    @click="delProcess(scope.$index)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="py-3 bs center">
          <el-button size="small"
                     @click="regroupDialog=false">取消</el-button>
          <el-button type="primary"
                     size="small"
                     @click="finishProcess">完成</el-button>
          <el-button size="small"
                     class="success-btn"
                     @click="addProcess()">新增</el-button>
        </div>
      </template>
      <!-- 内部二层弹框，编辑工单 -->
      <el-dialog title="编辑工单"
                 :visible.sync="editVisible"
                 append-to-body>
        <editProcess :selectProcessList=multipleSelection
                     :addProcessList=regroupProcessList
                     @sendProcess="getProcessList"
                     ref="editProcess"></editProcess>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
//工单详情，编辑
import processDetail from "@/views/productionSynergy/children/processDetail";
//重组工单
import editProcess from "@/views/productionSynergy/components/editProcess";
export default {
  name: "processList",
  props: ["parentData"],
  components: {
    processDetail,
    editProcess
  },
  data() {
    return {
      loading: false,
      activeName: ["1"],
      //详情
      nowProcessId: "", //当前对象传入子组件的工单id
      dialogDetail: false,
      //重组
      regroupDialog: false,
      //编辑工单
      editVisible: false,
      processList: {}, //工单列表
      multipleSelection: [], //选中的工序进行重组
      regroupProcessList: [], //工单列表
      surplusOutput: null //重组之后排产剩余量
    };
  },
  //从计划总浪进来拿不到父组件的id ，id是从列表工单列表传出来的
  //路由保持活性才可以watch，但是页面会缓存
  // watch: {
  //   $route(to, from) {
  //     console.log(from);
  //     if (from.path === "/productionSynergy/allProduction") {
  //       alert("555555")
  //       this.queryWorkOrderOutline(this.$route.query.planId, "all", "");
  //     }
  //   }
  // },
  mounted() {
    this.queryWorkOrderOutline(
      this.parentData.planId,
      this.parentData.workOrderStatus,
      this.parentData.keyword
    );
  },
  methods: {
    //查询工单列表
    async queryWorkOrderOutline(planId, workOrderStatus, keyword) {
      this.loading = true; // 等待
      this.processList = [];
      const e = await this.ajax("queryWorkOrderOutline", {
        workOrderStatus: workOrderStatus,
        searchType: "precise",
        staffType: "all",
        planId: planId,
        keyword: keyword
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        this.processList = e.map.planViewDTOs[0] || {};
      } else if (e.status === 2) {
        this.processList = [];
        //暂无数据
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //不同工序里面的工单不能重组
    clearSelct(val) {
      let arr = Array.prototype.slice.call(this.$refs.multipleTable);
      if (arr.length != 0) {
        arr.forEach((n, i) => {
          if (val === i) {
            return false;
          } else {
            this.$refs.multipleTable[i].clearSelection();
          }
        });
      }
    },
    //重组工单
    regroup() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "至少选择一个工单",
          type: "error"
        });
      } else {
        this.regroupDialog = true;
      }
    },
    //完成，调用重组
    async finishProcess() {
      if (parseFloat(this.surplusOutput) == 0) {
        const e = this.ajax("/plan/workOrderRecombination.do", {
          recombinationWorkOrderDtos: this.multipleSelection, //原工单
          workOrderDtos: this.regroupProcessList //重组工单
        });
        if (e.status === 0) {
          //表示成功
          this.queryWorkOrderOutline(
            this.parentData.planId,
            this.parentData.workOrderStatus,
            this.parentData.keyword
          );
        } else {
          this.$message({
            message: e.msg,
            type: "error"
          });
        }
      } else {
        this.$message({
          message: "重组的新工单排产量与原工单不等",
          type: "error"
        });
      }
    },
    //新增工单
    addProcess() {
      this.editVisible = true;
      this.$nextTick(() => {
        this.$refs.editProcess.createProcessNum(
          this.multipleSelection[0].plan_production_craft_path_id
        );
      });
    },
    //新怎工单
    getProcessList(msg) {
      this.surplusOutput = msg.surplusOutput;
      this.editVisible = msg.dialog;
      this.regroupProcessList.push(msg.processMsg);
    },
    //删除工单
    delProcess(index) {
      this.regroupProcessList.splice(index, 1);
    },
    //查看详情
    lookDetail(row, event, column) {
      this.dialogDetail = true;
      this.$nextTick(() => {
        this.$refs.processDetail.queryWorkOrderParticulars(row.work_order_id);
      });
      this.nowProcessId = row.work_order_id;
    }
  }
};
</script>

<style lang='scss'>
.processList {
  .toolbar {
    width: 100%;
    height: 80px;
    background-color: #ddedec;
    padding: 0 20px;
    ul > li {
      line-height: 40px;
    }
    .btnBox {
      line-height: 80px;
    }
  }
  .processContont {
    .el-collapse-item__header {
      padding: 0 20px;
    }
    .el-collapse-item__content {
      padding: 0 20px;
    }
  }
}
</style>