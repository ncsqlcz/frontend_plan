<!--批次详细-->
<template>
  <div class="batchDetail">
    <el-row class="conTxt">
      <ul>
        <li v-text="'订单编号：'+nowData.plan_order_number"></li>
        <li v-text="'生产批次：'+nowData.plan_batch"></li>
        <li v-text="'产品名称：'+nowData.product_model_name"></li>
        <li v-text="'产品类型：'+nowData.product_model_type"></li>
        <li v-text="'客户：'+nowData.customer_name"></li>
        <li v-text="'需求量：'+nowData.plan_quantity_demanded"></li>
        <li v-text="'排产量：'+nowData.plan_output"></li>
        <li v-text="'计划创建人：'+nowData.plan_creator"></li>
        <li v-if="$route.path=='/productionSynergy/productionPlan'">计划负责人：
          <el-input v-model="principal"
                    size="mini"
                    class="inputSize pointer"
                    readonly
                    @click.native="selectProceduce"></el-input>
        </li>
        <li v-else
            v-text="'计划负责人：'+nowData.plan_creator"></li>
        <li v-html="'计划时间：'+nowData.plan_scheduled_start_time+'&nbsp;至&nbsp;'+nowData.plan_scheduled_completion_time"></li>
      </ul>
    </el-row>
    <el-row class="my-2">
      <el-button size="small"
                 @click="lookModHistory('modif')">修改历史</el-button>
      <el-button type="primary"
                 size="small"
                 @click="LinkToProcessList()">工单列表</el-button>
      <el-button size="small"
                 class="tiffany-btn"
                 v-if="$route.path=='/productionSynergy/productionPlan'">复制计划</el-button>
    </el-row>
    <el-row class="py-2"
            v-if="$route.path=='/productionSynergy/productionPlan'">
      <el-button size="small"
                 type="success"
                 :disabled="nowData.plan_production_status!='2'&&nowData.plan_production_status!='3'"
                 @click="beginPlan">开始计划</el-button>
      <el-button size="small"
                 type="primary"
                 :disabled="nowData.plan_production_status!='1'"
                 @click="finishPlan">完成计划</el-button>
      <el-button size="small"
                 type="warning"
                 :disabled="nowData.plan_production_status!='1'"
                 @click="pausePlan">暂停计划</el-button>
      <el-button size="small"
                 type="danger"
                 :disabled="nowData.plan_production_status!='1'&&nowData.plan_production_status!='2'&&nowData.plan_production_status!='3'"
                 @click="closePlan">关闭计划</el-button>
    </el-row>
    <el-row>
      <el-collapse v-model="activeNames"
                   accordion
                   @change="handleChange">
        <el-collapse-item title="生产路径"
                          name="1">
          <!-- 工艺路线 -->
        </el-collapse-item>
        <el-collapse-item title="BOM"
                          name="2">
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>
        <el-collapse-item title="执行过程"
                          name="3">
          <div class="modContent"
               v-loading="loading">
            <el-table :data="modHisList"
                      style="width: 100%;max-height:250px;"
                      v-loading="loading">
              <el-table-column prop="name"
                               label="操作人">
              </el-table-column>
              <el-table-column prop="time"
                               label="操作时间">
              </el-table-column>
              <el-table-column prop="something"
                               label="操作内容">
              </el-table-column>
              <el-table-column prop="cause"
                               label="原因">
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <el-row class="conBtn py-3">
      <ul>
        <li>
          <el-button type="success"
                     size="mini"
                     @click="statistics('pickingUnit','领料')">领料统计</el-button>
        </li>
        <li>
          <el-button type="success"
                     size="mini"
                     @click="statistics('materialsSupplementUnit','补料')">补料统计</el-button>
        </li>
        <li>
          <el-button type="success"
                     size="mini"
                     @click="statistics('materialsReturnedUnit','退料')">退料统计</el-button>
        </li>
        <li>
          <el-button type="success"
                     size="mini"
                     @click="statistics('productUnit','产出')">产出统计</el-button>
        </li>
        <li>
          <el-button type="success"
                     size="mini"
                     @click="statistics('rejectsUnit','不良品')">不良品统计</el-button>
        </li>
        <li>
          <el-button type="success"
                     size="mini"
                     @click="statistics('scrapUnit','废品')">废品统计</el-button>
        </li>
      </ul>
    </el-row>
    <!-- 修改历史 -->
    <el-dialog title="修改历史"
               :visible.sync="innerVisible"
               append-to-body>
      <div class="modContent"
           v-loading="loading">
        <el-table :data="modHisList"
                  style="width: 100%;max-height:250px;"
                  v-loading="loading">
          <el-table-column prop="name"
                           label="操作人">
          </el-table-column>
          <el-table-column prop="time"
                           label="操作时间">
          </el-table-column>
          <el-table-column prop="something"
                           label="操作内容">
          </el-table-column>
          <el-table-column prop="cause"
                           label="原因">
          </el-table-column>
        </el-table>
        <!-- <el-steps direction="vertical"
                  :active="1">
          <el-step v-for="(item ,index) in modHisList"
                   :key="index"
                   :description="item.name+'在'+item.time+item.something">
          </el-step>
        </el-steps> -->
      </div>
    </el-dialog>
    <el-dialog :title="dialogTitle+'统计'"
               :visible.sync="statisticsVisible"
               append-to-body>
      <div style="height: 300px;">
        <el-tabs v-model="statisticsType"
                 type="card"
                 @tab-click="handleClick">
          <el-tab-pane :label="dialogTitle+'数据'"
                       name="dataStatistics">
            <template>
              <el-table :data="tableData"
                        style="width: 100%"
                        v-loading="loading">
                <el-table-column prop="execution_production_materials_number"
                                 label="编号">
                </el-table-column>
                <el-table-column prop="execution_production_materials_name"
                                 label="名称">
                </el-table-column>
                <el-table-column prop="execution_production_materials_mode"
                                 label="型号规格">
                </el-table-column>
                <el-table-column prop="supplier_name"
                                 label="供应商">
                </el-table-column>
                <el-table-column prop="execution_production_materials_received_quantity"
                                 label="数量">
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>
          <el-tab-pane :label="dialogTitle+'单'"
                       name="unitStatistics">
            <template>
              <el-table :data="tableData"
                        style="width: 100%"
                        v-loading="loading">
                <el-table-column prop="execution_production_materials_unit_number"
                                 label="领料单号">
                </el-table-column>
                <el-table-column prop="execution_production_materials_unit_executor"
                                 label="领料人">
                </el-table-column>
                <el-table-column prop="plan_batch"
                                 label="生产批号">
                </el-table-column>
                <el-table-column prop="work_order_number"
                                 label="工单号">
                </el-table-column>
                <el-table-column prop="execution_time"
                                 label="时间">
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "batchDetail",
  props: ["nowData"],
  data() {
    return {
      principal: this.nowData.plan_responsible,
      activeNames: [], //折叠选项
      innerVisible: false, //修改弹窗
      loading: false, //修改loading
      modHisList: [], //修改历史
      statisticsVisible: false, //领料弹框
      dialogTitle: "", //领补等弹出框标题
      statisticsType: "dataStatistics", //默认选择的是什么单
      productionUnitType: "", //领补。。。
      tableData: [], //领，补，不良等数据
      newSelected: {} // 选中负责人的id数组
    };
  },
  mounted() {},
  methods: {
    //查询修改历史"modif",或者执行过程"all"
    async lookModHistory(str) {
      if (str === "modif") {
        this.innerVisible = true; //修改弹出
      }
      this.loading = true; // 等待
      this.modHisList = [];
      const e = await this.ajax("queryProcessRecords", {
        screenCondition: str, //修改
        foreignKeyType: "plan",
        foreignKeyId: this.nowData.plan_id //外键当前id
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        if (e.map.line != 0) {
          e.map.processRecordDTOs.forEach(n => {
            this.modHisList.push({
              name: n.process_record_operation_user,
              time: n.process_record_operation_time,
              something: n.process_record_execute_operation,
              cause: n.process_record_operation_explain
            });
          });
        }
      } else if (e.status === 2) {
        //暂无数据
        this.modHisList = [];
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //查询生产工艺路线
    async queryProductionCraftPath() {
      this.loading = true; // 等待
      const e = await this.ajax("queryProductionCraftPath", {
        planId: this.nowData.plan_id
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        console.log("工艺路线", e.map);
      } else if (e.status === 2) {
        //暂无数据
        this.$message({
          message: e.msg,
          type: "warning"
        });
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //查询Bom
    async queryResourceAllocation() {
      this.loading = true; // 等待
      const e = await this.ajax("queryResourceAllocation", {
        planId: this.nowData.plan_id
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        console.log("BOM", e.map);
      } else if (e.status === 2) {
        //暂无数据
        this.$message({
          message: e.msg,
          type: "warning"
        });
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //查询"生产单统计： 领料统计/补料统计/退料统计/ 产出统计/不良品统计/报废统计"
    async productionUnitStatistics(type) {
      this.tableData = []; //清空数据
      this.loading = true; // 等待
      const e = await this.ajax("productionUnitStatistics", {
        productionUnitType: this.productionUnitType,
        planId: this.nowData.plan_id,
        statisticsType: this.statisticsType //数量dataStatistics，领料单：unitStatistics
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        this.tableData = e.map.materialsSupplementUnitOutlineDTO;
      } else if (e.status === 2) {
        //暂无数据
        this.tableData = [];
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //卡片切换
    handleChange(val) {
      switch (val) {
        case "1":
          //调用工艺路线
          this.queryProductionCraftPath();
          break;
        case "2":
          //调用查询bom
          this.queryResourceAllocation();
          break;
        case "3":
          //调用执行过程
          this.lookModHistory("all");
          break;
        default:
          break;
      }
    },

    statistics(type, val) {
      this.dialogTitle = val;
      this.statisticsVisible = true;
      this.productionUnitType = type; //点的是哪一个
      //进去默认调用一次
      this.productionUnitStatistics();
    },
    //各个统计,内部选项卡切换
    handleClick(tab, event) {
      this.productionUnitStatistics();
    },
    //工单列表
    LinkToProcessList() {
      this.$emit("getClose", false);
      this.$router.push({
        path: "/productionSynergy/process",
        query: { planId: this.nowData.plan_id, active: "列表" }
      });
    },
    //选择负责人
    selectProceduce() {
      this.$mesEmployee
        .show("选择工单负责人", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            // 额外参数
            keyword: ""
          }
        })
        .then(res => {
          // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
          this.principal = res.rows[0].user_employees_name;
          this.newSelected = res.rows[0]; //当前选中的对象
          setTimeout(() => {
            this.updatePrincipals();
          }, 500);
        });
    },
    //修改负责人
    async updatePrincipals() {
      const e = await this.ajax("updatePrincipals", {
        planPrincipalDtos: JSON.stringify([
          {
            plan_order_id: this.nowData.plan_id, //生产计划id
            responsible_id: this.newSelected.user_employees_id, //负责人id
            responsible_name: this.newSelected.user_employees_name, //负责人名称
            old_responsible_id: this.nowData.plan_responsible_id, //原负责人id
            old_responsible_name: this.nowData.plan_responsible //原负责人名称
          }
        ]),
        type: "plan"
      });
      if (e.status === 0) {
        this.$message({
          message: "修改成功",
          type: "success"
        });
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //生产执行
    async planExecute(type, cause) {
      const e = await this.ajax("planExecute", {
        planId: this.nowData.plan_id, //生产id
        type: type, //类型
        explain: "" //执行说明
      });
      if (e.status === 0) {
        //成功
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },

    //开始计划
    beginPlan() {
      let nowTime = new Date().getTime(),
        tagSTime = new Date(this.nowData.plan_scheduled_start_time).getTime(),
        tagETime = new Date(
          this.nowData.plan_scheduled_completion_time
        ).getTime();
      if (tagTime > nowTime) {
        //未到开始时间
        this.$prompt("请输入原因", "还未到计划开始时间", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^\S{1,50}$/,
          inputErrorMessage: "50个字符内"
        })
          .then(({ value }) => {
            this.planExecute("start", value); //开始计划
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          });
      } else if (tagETime < nowTime) {
        //已超过计划完成时间
        this.$prompt("请输入原因", "已超过计划完成时间", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^\S{1,50}$/,
          inputErrorMessage: "50个字符内"
        })
          .then(({ value }) => {
            this.planExecute("start", value); //开始计划
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          });
      } else {
        this.$confirm("是否开始计划?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
          center: true
        })
          .then(() => {
            this.planExecute("start", ""); //开始计划
          })
          .catch(() => {});
      }
    },
    //完成计划
    finishPlan() {
      let nowTime = new Date().getTime(),
        tagETime = new Date(
          this.nowData.plan_scheduled_completion_time
        ).getTime();
      if (tagETime < nowTime) {
        //已超过计划完成时间
        this.$prompt("请输入原因", "已超过计划完成时间", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^\S{1,50}$/,
          inputErrorMessage: "50个字符内"
        })
          .then(({ value }) => {
            this.planExecute("finish", value); //开始计划
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          });
      } else {
        this.$confirm("是否开始计划?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
          center: true
        })
          .then(() => {
            this.planExecute("finish", ""); //开始计划
          })
          .catch(() => {});
      }
    },
    //暂停计划
    pausePlan() {
      this.$prompt("请输入原因", "确认暂停", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^\S{1,50}$/,
        inputErrorMessage: "50个字符内"
      })
        .then(({ value }) => {
          this.planExecute("pause", value); //开始计划
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //关闭计划
    closePlan() {
      this.$prompt("请输入原因", "确认关闭", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        //第一种
        inputPattern: /^\S{1,50}$/,
        inputErrorMessage: "50个字符内"
        //第二张
        // inputValidator:(val) => {
        //   if (val == "") {
        //     return "原因不能为空";
        //     console.log(1111);
        //   }else{
        //     return true;
        //   }
        // }
      })
        .then(({ value }) => {
          this.planExecute("close", value); //开始计划
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.batchDetail {
  font-size: 13px;
  .conTxt {
    ul > li {
      height: 32px;
      line-height: 32px;
      min-width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      float: left;
      .inputSize {
        width: 150px;
      }
    }
  }
  .conBtn {
    ul > li {
      width: 300px;
      padding: 5px;
      margin: 0 auto;
      .el-button {
        width: 300px;
      }
    }
  }
  .modContent {
    max-height: 150px;
    overflow-y: scroll;
  }
}
</style>

