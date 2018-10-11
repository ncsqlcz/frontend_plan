<template>
  <div id="addWorkOrder">

    <el-row>
      <el-col :span="24"
              class="switcher">
        <el-button type="primary"
                   class="ml-5"
                   @click="setaddWorkdialog">{{addWorkOrderTitle}}</el-button>
        <div class="filter">
          <el-input v-model="workSelect"
                    placeholder="搜索单号、批次、工序、工单号"
                    clearable
                    @clear="selectInput"
                    @keyup.native.enter="selectInput">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click.native="selectInput"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="24"
              class="toolbar">
        <div class="fl">生产计划:{{executeData.bath.name}}
          <span v-if="$route.query.idType >= 2">工序:{{executeData.procedure.name}}</span>
          <span v-if="$route.query.idType >= 3">工单:{{executeData.workOrder.name}}</span>
        </div>
        <div class="fr mt-2">
          <el-button type="primary"
                     @click="toWorkOrderExecute"
                     class="fl">返回</el-button>
        </div>

      </el-col>
    </el-row>

    <!-- 创建领料，补料，外发等弹窗 -->
    <el-dialog :title="dialogValue"
               :visible.sync="dialogVisible">
      <addWorkOrderDialog :addWorkOrderForm="form"
                          ref="addWorkOrderDialog"
                          @hidePanel="hidePanel"></addWorkOrderDialog>

    </el-dialog>

    <addWorkOrderList :parentData="{'planId':$route.query.id,'num':$route.query.num,'idType': $route.query.idType}"
                      @edit="eidtAddWorkOrdewr"></addWorkOrderList>

  </div>
</template>
<script>
import { mapState } from "vuex";
import addWorkOrderDialog from "@/views/productionSynergy/components/addWorkOrderDialog";
import addWorkOrderList from "@/views/productionSynergy/components/addWorkOrderList";
export default {
  components: {
    addWorkOrderDialog,
    addWorkOrderList
  },
  data() {
    return {
      addWorkOrderTitle: "",
      workSelect: null,
      dialogVisible: false,
      dialogValue: "",
      form: {},
      materialsUnitNumber: ""
    };
  },
  computed: {
    // 状态管理映射
    ...mapState({
      executeData: state => state.workOrderExecuteData.executeData //创建工单基本信息
    })
  },
  mounted() {
    console.log(this.executeData);
    this.changeTitle(this.$route.query.num);
    this.oddWorkOrder();
  },
  // beforeRouteEnter (to, from, next) {
  //   console.log(to, from, next)
  //   next()
  // 在渲染该组件的对应路由被 confirm 前调用
  // 不！能！获取组件实例 `this`
  // 因为当守卫执行前，组件实例还没被创建
  // },

  methods: {
    //生成生产单单号,规则：生产批次+执行代号+自增号
    async createProductionUnitNumber(
      planId,
      dimensionality,
      productionUnitType
    ) {
      const e = await this.ajax("createProductionUnitNumber", {
        planId, //生产计划id
        dimensionality, //生产单维度
        productionUnitType //生产单类型
      });
      if (e.status === 0) {
        //表示成功
        console.log("生成生产单单号,规则：生产批次+执行代号+自增号");
        this.materialsUnitNumber = e.map.materialsUnitNumber;
      } else if (e.status === 2) {
        //暂无数据
        this.pagination.total = 0;
        this.productionList = [];
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //生成生产单单号
    oddWorkOrder() {
      var dimensionality = "";
      switch (this.$route.query.idType + "") {
        case "1":
          dimensionality = "P";
          break;
        case "2":
          dimensionality = "C";
          break;
        case "3":
          dimensionality = "W";
          break;
      }
      var unitType = "";
      switch (this.$route.query.num + "") {
        case "0":
          unitType = "LL";
          break;
        case "1":
          unitType = "BL";
          break;
        case "2":
          unitType = "TL";
          break;
        case "3":
          unitType = "WF";
          break;
        case "4":
          unitType = "WFBL";
          break;
        case "5":
          unitType = "CCW";
          break;
        case "6":
          unitType = "BLP";
          break;
        case "7":
          unitType = "BFP";
          break;
        case "8":
          unitType = "HC";
          break;
        case "9":
          unitType = "HCTL";
          break;
      }
      this.createProductionUnitNumber(
        this.executeData.bath.id,
        // this.$route.query.id,
        dimensionality,
        unitType
      );
    },
    //标题判断
    changeTitle(num) {
      switch (num + "") {
        case "0":
          this.dialogValue = "领料";
          this.addWorkOrderTitle = "创建领料单";
          break;
        case "1":
          this.dialogValue = "补料";
          this.addWorkOrderTitle = "创建补料单";
          break;
        case "2":
          this.dialogValue = "退料";
          this.addWorkOrderTitle = "创建退料单";
          break;
        case "3":
          this.dialogValue = "外发";
          this.addWorkOrderTitle = "创建外发单";
          break;
        case "4":
          this.dialogValue = "外发补料";
          this.addWorkOrderTitle = "创建外发补料单";
          break;
        case "5":
          this.dialogValue = "产出";
          this.addWorkOrderTitle = "创建产出单";
          break;
        case "6":
          this.dialogValue = "不良";
          this.addWorkOrderTitle = "创建不良单";
          break;
        case "7":
          this.dialogValue = "报废";
          this.addWorkOrderTitle = "创建报废单";
          break;
        case "8":
          this.dialogValue = "回厂";
          this.addWorkOrderTitle = "创建回厂单";
          break;
        case "9":
          this.dialogValue = "外发退料";
          this.addWorkOrderTitle = "创建回厂退料单";
          break;
        default:
          break;
      }
    },
    //创建领料工单
    setaddWorkdialog() {
      this.dialogVisible = true;
      switch (this.$route.query.idType + "") {
        case "1":
          switch (this.$route.query.num + "") {
            case "0":
              this.form = [
                { title: "领料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "领料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "领料说明", value: "" }
              ];
              break;
            case "1":
              this.form = [
                { title: "补料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "补料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "补料说明", value: "" }
              ];
              break;
            case "2":
              this.form = [
                { title: "退料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "退料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "退料说明", value: "" }
              ];
              break;
            case "3":
              this.form = [
                { title: "外发单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "领料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "外发说明", value: "" }
              ];
              break;
            case "4":
              this.form = [
                { title: "外发补料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "领料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "外发说明", value: "" }
              ];
              break;
            case "5":
              this.form = [
                { title: "产出单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "记录人", value: "空白" },
                { title: "数量", value: "" },
                { title: "输出物", value: "" },
                { title: "仓库", value: "" },
                { title: "产出物说明", value: "" }
              ];
              break;
            case "6":
              this.form = [
                { title: "不良品单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "记录人", value: "空白" },
                { title: "数量", value: "" },
                { title: "仓库", value: "" },
                { title: "不良输出物", value: "" },
                { title: "不良说明", value: "" }
              ];
              break;
            case "7":
              this.form = [
                { title: "报废单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "记录人", value: "空白" },
                { title: "数量", value: "" },
                { title: "报废输出物", value: "" },
                { title: "仓库", value: "" },
                { title: "报废品说明", value: "" }
              ];
              break;
            case "8":
              this.form = [
                { title: "回厂单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "记录人", value: "空白" },
                { title: "数量", value: "" },
                { title: "输出物", value: "" },
                { title: "仓库", value: "" },
                { title: "回厂说明", value: "" }
              ];
              break;
            case "9":
              this.form = [
                { title: "外发退料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "退料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "退料说明", value: "" }
              ];
              break;
          }
          break;
        case "2":
          switch (this.$route.query.num + "") {
            case "0":
              this.form = [
                { title: "领料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "领料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "领料说明", value: "" }
              ];
              break;
            case "1":
              this.form = [
                { title: "补料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "补料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "补料说明", value: "" }
              ];
              break;
            case "2":
              this.form = [
                { title: "退料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "退料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "退料说明", value: "" }
              ];
              break;
            case "3":
              this.form = [
                { title: "外发单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "领料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "外发说明", value: "" }
              ];
              break;
            case "4":
              this.form = [
                { title: "外发补料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "领料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "外发说明", value: "" }
              ];
              break;
            case "5":
              this.form = [
                { title: "产出单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "记录人", value: "空白" },
                { title: "数量", value: "" },
                { title: "输出物", value: "" },
                { title: "仓库", value: "" },
                { title: "产出物说明", value: "" }
              ];
              break;
            case "6":
              this.form = [
                { title: "不良品单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "记录人", value: "空白" },
                { title: "数量", value: "" },
                { title: "不良输出物", value: "" },
                { title: "仓库", value: "" },
                { title: "不良说明", value: "" }
              ];
              break;
            case "7":
              this.form = [
                { title: "报废单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "记录人", value: "空白" },
                { title: "数量", value: "" },
                { title: "报废输出物", value: "" },
                { title: "仓库", value: "" },
                { title: "报废品说明", value: "" }
              ];
              break;
            case "8":
              this.form = [
                { title: "回厂单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "记录人", value: "空白" },
                { title: "数量", value: "" },
                { title: "输出物", value: "" },
                { title: "仓库", value: "" },
                { title: "回厂说明", value: "" }
              ];
              break;
            case "9":
              this.form = [
                { title: "外发退料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "退料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "退料说明", value: "" }
              ];
              break;
          }
          break;
        case "3":
          switch (this.$route.query.num + "") {
            case "0":
              this.form = [
                { title: "领料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "工单", value: this.executeData.workOrder.name },
                { title: "领料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "领料说明", value: "" }
              ];
              break;
            case "1":
              this.form = [
                { title: "补料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "工单", value: this.executeData.workOrder.name },
                { title: "补料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "补料说明", value: "" }
              ];
              break;
            case "2":
              this.form = [
                { title: "退料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "工单", value: this.executeData.workOrder.name },
                { title: "退料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "退料说明", value: "" }
              ];
              break;
            case "3":
              this.form = [
                { title: "外发单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "工单", value: this.executeData.workOrder.name },
                { title: "领料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "外发说明", value: "" }
              ];
              break;
            case "4":
              this.form = [
                { title: "外发补料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "工单", value: this.executeData.workOrder.name },
                { title: "领料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "外发说明", value: "" }
              ];
              break;
            case "5":
              this.form = [
                { title: "产出单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "工单", value: this.executeData.workOrder.name },
                { title: "记录人", value: "空白" },
                { title: "数量", value: "" },
                { title: "输出物", value: "" },
                { title: "仓库", value: "" },
                { title: "产出物说明", value: "" }
              ];
              break;
            case "6":
              this.form = [
                { title: "不良品单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "工单", value: this.executeData.workOrder.name },
                { title: "记录人", value: "空白" },
                { title: "数量", value: "" },
                { title: "不良输出物", value: "" },
                { title: "仓库", value: "" },
                { title: "不良说明", value: "" }
              ];
              break;
            case "7":
              this.form = [
                { title: "报废单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "工单", value: this.executeData.workOrder.name },
                { title: "记录人", value: "空白" },
                { title: "数量", value: "" },
                { title: "报废输出物", value: "" },
                { title: "仓库", value: "" },
                { title: "报废品说明", value: "" }
              ];
              break;
            case "8":
              this.form = [
                { title: "回厂单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "工单", value: this.executeData.workOrder.name },
                { title: "记录人", value: "空白" },
                { title: "数量", value: "" },
                { title: "输出物", value: "" },
                { title: "仓库", value: "" },
                { title: "回厂说明", value: "" }
              ];
              break;
            case "9":
              this.form = [
                { title: "外发退料单号", value: this.materialsUnitNumber },
                { title: "生产批次", value: this.executeData.bath.name },
                { title: "工序", value: this.executeData.procedure.name },
                { title: "工单", value: this.executeData.workOrder.name },
                { title: "退料人", value: "空白" },
                { title: "仓库", value: "" },
                { title: "退料说明", value: "" }
              ];
              break;
          }
          break;
        default:
          console.log("创建领料工单错误");
          break;
      }
      var MaterialType = "";
      switch (this.$route.query.idType + "") {
        case "1":
          MaterialType = "plan";
          break;
        case "2":
          MaterialType = "productionCraftPath";
          break;
        case "3":
          MaterialType = "workOrder";
          break;
      }
      if (
        this.$route.query.num + "" === "0" ||
        this.$route.query.num + "" === "3"
      ) {
        this.$nextTick(() => {
          this.$refs.addWorkOrderDialog.queryMaterialByPickingUnit(
            //  this.$route.query.id,
            "2",
            MaterialType,
            "rawMaterial"
          );
        });
      } else if (
        this.$route.query.num + "" === "1" ||
        this.$route.query.num + "" === "4"
      ) {
        this.$nextTick(() => {
          this.$refs.addWorkOrderDialog.queryMaterialByMaterialsSupplementUnit(
            //  this.$route.query.id,
            "2",
            MaterialType,
            "rawMaterial"
          );
        });
      } else if (this.$route.query.num + "" === "2") {
        this.$nextTick(() => {
          this.$refs.addWorkOrderDialog.queryMaterialByMaterialsReturnedUnit(
            //  this.$route.query.id,
            "2",
            MaterialType,
            "interior",
            "rawMaterial"
          );
        });
      } else if (this.$route.query.num + "" === "9") {
        this.$nextTick(() => {
          this.$refs.addWorkOrderDialog.queryMaterialByMaterialsReturnedUnit(
            this.$route.query.id,
            MaterialType,
            "external",
            "rawMaterial"
          );
        });
      }
    },
    //搜索编号
    selectInput() {},
    //返回WorkOrderExecute
    toWorkOrderExecute() {
      this.$router.back(
        -1
        //   {
        //   path: "/productionSynergy/workOrderExecute"
        // }
      );
    },
    //dialog传父
    hidePanel() {
      this.dialogVisible = false;
    },
    //list传父
    eidtAddWorkOrdewr(val) {
      this.dialogVisible = true;
      console.log(val);
    }
  }
};
</script>
<style lang="scss" scoped>
#addWorkOrder {
  .el-dialog__wrapper {
    .el-dialog__body {
      padding: 6px 20px;
    }
  }
  // .switcher {
  //   height: 80px;
  //   background-color: rgb(16, 91, 89);
  //   .el-button {
  //      margin-top: 20px;
  //      margin-left: 40px;
  //      background-color: #00e4bd;
  //      border-color: #00e4bd;
  //    }
  //   .fr {
  //     margin-top: 24px;
  //     margin-right: 40px;
  //     font-size: 12px;
  //     .el-input__inner {
  //       width: 230px;
  //     }
  //   }
  // }
  .toolbar {
    width: 100%;
    height: 60px;
    background-color: #ddedec;
    line-height: 60px;
    padding: 0 20px;
    font-size: 21px;
  }
}
</style>
