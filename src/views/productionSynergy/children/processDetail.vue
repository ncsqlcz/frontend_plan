<!--工单详细-->
<template>
  <div class="batchDetail">
    <el-row class="conTxt">
      <ul>
        <li>订单编号：{{processDetail.plan_order_number}}</li>
        <li>工单号：{{processDetail.work_order_number}}</li>
        <li>生产批次：{{processDetail.plan_batch}}</li>
        <li>工序：{{processDetail.production_process_name}}</li>
        <li>生产方式：{{processDetail.work_order_production_mode}}</li>
        <li>生产状态：{{work.transitionStatus(processDetail.plan_production_status)}}</li>
        <li>排产量：{{processDetail.work_order_output}}</li>
        <li v-html="'计划时间：'+processDetail.work_order_scheduled_state_time+'&nbsp;至&nbsp;'+processDetail.work_order_scheduled_complete_time"></li>
        <li>计划负责人：{{processDetail.plan_responsible}}</li>
        <li>工单负责人：{{processDetail.work_order_responsible}}</li>
        <!-- <li >{{'生产方式'+processDetail.work_order_production_mode}}</li> -->
      </ul>
    </el-row>
    <el-row class="my-2">
      <el-button size="small"
                 type="primary"
                 @click="lookModHistory('modif')">修改历史</el-button>
    </el-row>
    <el-row>
      <el-collapse v-model="activeNames"
                   accordion
                   @change="handleChange">
        <template v-if="processDetail.work_order_production_mode=='自产'">           
        <el-collapse-item title="员工记录"
                          name="1">
          <template>
            <el-table :data="processOtherData"
                      style="width: 100%;max-height:250px;"
                      v-loading="loading">
              <el-table-column prop="employee_number"
                               label="编号">
              </el-table-column>
              <el-table-column prop="employee_name"
                               label="姓名">
              </el-table-column>
              <el-table-column prop="post_name"
                               label="职位">
              </el-table-column>
            </el-table>
          </template>
        </el-collapse-item>
        <el-collapse-item title="设备绑定"
                          name="2">
          <template>
            <el-table :data="processOtherData"
                      style="width: 100%;max-height:250px;"
                      v-loading="loading">
              <el-table-column prop="device_number"
                               label="编号">
              </el-table-column>
              <el-table-column prop="device_type_name"
                               label="设备类型">
              </el-table-column>
              <el-table-column prop="device_name"
                               label="设备名称">
              </el-table-column>
            </el-table>
          </template>
        </el-collapse-item>
        <el-collapse-item title="物料投放记录"
                          name="3">
          <template>
            <el-table :data="processOtherData"
                      style="width: 100%;max-height:250px;"
                      v-loading="loading">
              <el-table-column prop="material_mode"
                               label="物料编号">
              </el-table-column>
              <el-table-column prop="material_name"
                               label="名称">
              </el-table-column>
              <el-table-column prop="production_process_materials_type"
                               label="材料类型">
              </el-table-column>
            </el-table>
          </template>
        </el-collapse-item>
        <el-collapse-item title="环境参数"
                          name="4">
          <template>
            <el-table :data="processOtherData"
                      style="width: 100%;max-height:250px;"
                      v-loading="loading">
              <el-table-column prop="parameter_steady_state_value"
                               label="实际值">
              </el-table-column>
              <el-table-column prop="parameter_steady_state_value"
                               label="参考值">
              </el-table-column>
              <el-table-column prop="production_craft_parameter_hold_time"
                               label="记录时间">
              </el-table-column>
            </el-table>
          </template>
        </el-collapse-item>
        <el-collapse-item title="半成品参数"
                          name="5">
          <template>
            <el-table :data="processOtherData"
                      style="width: 100%;max-height:250px;"
                      v-loading="loading">
              <el-table-column prop="parameter_steady_state_value"
                               label="实际值">
              </el-table-column>
              <el-table-column prop="parameter_steady_state_value"
                               label="参考值">
              </el-table-column>
              <el-table-column prop="production_craft_parameter_hold_time"
                               label="记录时间">
              </el-table-column>
            </el-table>
          </template>
        </el-collapse-item>
        </template>
        <el-collapse-item title="执行过程"
                          name="6">
          <template>
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
          </template>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <!-- 修改历史 -->
    <el-dialog title="修改历史"
               :visible.sync="innerVisible"
               append-to-body>
      <div class="modContent"
           v-loading="loading">
        <el-steps direction="vertical"
                  :active="1">
          <el-step v-for="(item ,index) in modHisList"
                   :key="index"
                   :description="item.name+'在'+item.time+item.something">
          </el-step>

        </el-steps>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "batchDetail",
  props: ["workOrderId"],
  data() {
    return {
      activeNames: [],
      loading: false,
      processDetail: {}, //工单详情
      modHisList: [], //修改历史
      innerVisible: false, //修改弹窗
      processOtherData: [] //员工记录，设备绑定等
    };
  },
  mounted() {
    // this.queryWorkOrderParticulars();
    // console.log(this.workOrderId);
  },
  methods: {
    //查询工单详情
    async queryWorkOrderParticulars(workOrderId) {
      this.loading = true; // 等待
      const e = await this.ajax("queryWorkOrderParticulars", {
        workOrderId: this.workOrderId
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        this.processDetail = e.map.workOrderParticularsDTO;
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //查询修改历史"modif",或者执行过程"all"
    async lookModHistory(str) {
      if (str === "modif") {
        this.innerVisible = true; //修改弹出
      }
      this.loading = true; // 等待
      this.modHisList = [];
      const e = await this.ajax("queryProcessRecords", {
        screenCondition: str, //修改
        foreignKeyType: "workOrder",
        foreignKeyId: this.workOrderId //外键当前id
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
    //查询员工记录
    async queryStaffRecordByWorkOrder() {
      this.loading = true; // 等待
      this.processOtherData = [];
      const e = await this.ajax("queryStaffRecordByWorkOrder", {
        workOrderId: this.workOrderId
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        this.processOtherData = e.map.WorkOrderEmployeeRecordDTO;
      } else if (e.status === 2) {
        this.processOtherData = [];
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //查询设备绑定
    async queryDevicesRecordByWorkOrder() {
      this.loading = true; // 等待
      this.processOtherData = [];
      const e = await this.ajax("queryDevicesRecordByWorkOrder", {
        workOrderId: this.workOrderId
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        this.processOtherData = e.map.WorkOrderEmployeeRecordDTO;
      } else if (e.status === 2) {
        this.processOtherData = [];
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //物料投放记录
    async queryProductionProcessMaterialMenu() {
      this.loading = true; // 等待
      this.processOtherData = [];
      const e = await this.ajax("queryProductionProcessMaterialMenu", {
        workOrderId: this.workOrderId,
        materialType: "all"
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        this.processOtherData = e.map.productionProcessMaterialListDtos;
      } else if (e.status === 2) {
        this.processOtherData = [];
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //查询生产工艺参数列表:环境参数,半成品参数
    async queryProductionCraftParameters(parameterTypeId) {
      this.loading = true; // 等待
      this.processOtherData = [];
      const e = await this.ajax("queryProductionCraftParameters", {
        workOrderId: this.workOrderId,
        parameterTypeId: parameterTypeId
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        this.processOtherData = e.map.ProcessCraftParameterDTO;
      } else if (e.status === 2) {
        this.processOtherData = [];
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //切换
    handleChange(val) {
      switch (val) {
        case "1":
          //员工
          this.queryStaffRecordByWorkOrder();
          break;
        case "2":
          //设备绑定
          this.queryDevicesRecordByWorkOrder();
          break;
        case "3":
          //物料投放记录
          this.queryProductionProcessMaterialMenu();
          break;
        case "4":
          //环境参数
          this.queryProductionCraftParameters("123456");
          break;
        case "5":
          //半成品参数
          this.queryProductionCraftParameters("123456");
          break;
        case "6":
          //执行过程
          this.lookModHistory("all");
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.batchDetail {
  font-size: 13px;
  .conTxt {
    ul > li {
      height: 30px;
      line-height: 30px;
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
}
</style>
