<!--编辑工单-->
<template>
  <div class="editProcess">
    <el-form :model="editForm"
             ref="editForm"
             label-width="150px">
      <el-form-item label="生产方式">
        <el-select v-model="editForm.work_order_production_mode"
                   placeholder="请选择">
          <el-option v-for="item in wayOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <template v-if="editForm.work_order_production_mode==='委外加工'">
        <el-form-item label="外协单位"
                      prop="outsourcing_unit"
                      :rules="[
      { required: true, trigger: 'change', message: '请选择外协单位'}
    ]">
          <el-input v-model="editForm.outsourcing_unit"
                    placeholder="请选择外协单位"
                    class="pointer input-size"
                    readonly
                    @click.native="selectCounit"></el-input>
        </el-form-item>
        <el-form-item label="计划物料外发时间"
                      prop="scheduled_materials_outbound_time"
                      :rules="[
      { required: true, message: '时间不能为空'}
    ]">
          <el-date-picker v-model="editForm.scheduled_materials_outbound_time"
                          type="datetime"
                          placeholder="选择日期时间"
                          value-format="yyyy-MM-dd hh:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划回厂时间"
                      prop="scheduled_materials_recovery_time"
                      :rules="[
      { required: true, trigger: 'change', message: '时间不能为空'}
    ]">
          <el-date-picker v-model="editForm.scheduled_materials_recovery_time"
                          type="datetime"
                          placeholder="选择日期时间"
                          value-format="yyyy-MM-dd hh:mm:ss">
          </el-date-picker>
        </el-form-item>
      </template>
      <el-form-item label="工单号">
        <el-input class="input-size"
                  v-model="editForm.work_order_number"
                  disabled></el-input>
      </el-form-item>
      <el-form-item label="排产量"
                    prop="work_order_output"
                    :rules="[
      { required: true, message: '排产量不能为空'},
      { type: 'number', message: '排产量必须为数字值'},
      {pattern:/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,message:'最多2位小数'}
    ]">
        <el-input class="input-size"
                  v-model.number="editForm.work_order_output"
                  auto-complete="off"></el-input>
        <span class="pl-3">剩余排产量：
          <span v-text="surplusOutput"
                :style="surplusOutput<0?{ color:'#F56C6C'}:''"></span>
        </span>
      </el-form-item>
      <el-form-item label="计划时间"
                    prop="time"
                    :rules="[
      { required: true, trigger: 'change', message: '时间不能为空'}
    ]">
        <el-date-picker v-model="editForm.time"
                        @change="getTime"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="计划负责人"
                    prop="work_order_responsible"
                    :rules="[
      { required: true, trigger: 'change', message: '请选择计划负责人'}
    ]">
        <el-input v-model="editForm.work_order_responsible"
                  placeholder="请选择计划负责人"
                  class="pointer input-size"
                  readonly
                  @click.native="selectProceduce"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="submitForm('editForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>  
<script>
import utils from "@/utils/index";
export default {
  //选中的工单，重组的新工单
  props: ["selectProcessList", "addProcessList"],
  data() {
    return {
      wayOptions: [
        {
          value: "自产",
          label: "自产"
        },
        {
          value: "委外加工",
          label: "委外加工"
        }
      ],
      editForm: {
        work_order_production_mode: "自产", //哪种方式，自产or委派
        time: "", //计划时间
        work_order_responsible_id: "", //工单负责人ID
        work_order_responsible: "", //工单负责人
        plan_production_craft_path_id: "", //工艺路线ID
        work_order_number: "", //工单编号
        work_order_output: "", //排产量
        production_process_name: "", //工序名称
        work_order_scheduled_state_time: "", //预计开始时间
        work_order_scheduled_complete_time: "", //预计完成时间
        outsourcing_unit_id: "", //外协单位ID
        outsourcing_unit: "", //外协单位
        scheduled_materials_outbound_time: "", //预计物料外放时间
        scheduled_materials_recovery_time: "" //预计物料回厂时间
      },
      //日期
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
      //负责人搜索
      restaurants: []
    };
  },
  computed: {
    //剩余排产量
    surplusOutput: function() {
      let selectNum = 0,
        addNum = 0;
      //求合选中的工单排产量之和
      this.selectProcessList.forEach(n => {
        selectNum += parseFloat(n.work_order_output);
      });
      //存在已新建的工单
      if (this.addProcessList.length == 0) {
        return isNaN(this.editForm.work_order_output)
          ? selectNum
          : utils.sub(selectNum, this.editForm.work_order_output);
      } else {
        this.addProcessList.forEach(n1 => {
          addNum += parseFloat(n1.work_order_output);
        });
      }
      return isNaN(this.editForm.work_order_output)
        ? utils.sub(selectNum, addNum)
        : utils.sub(
            utils.sub(selectNum, addNum),
            this.editForm.work_order_output
          );
    }
  },
  mounted() {},
  methods: {
    //生成工单号
    async createProcessNum(id) {
      const e = await this.ajax("createWorkOrderNumber", {
        productionCraftPathId: id
      });
      if (e.status === 0) {
        //表示成功
        // console.log(e.map.workOrderNumber)
        this.editForm.work_order_number = e.map.workOrderNumber;
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //获取计划开始结束时间
    getTime() {
      if (this.editForm.time === null) {
        this.editForm.work_order_scheduled_state_time = "";
        this.editForm.work_order_scheduled_complete_time = "";
      } else {
        this.editForm.work_order_scheduled_state_time = this.editForm.time[0];
        this.editForm.work_order_scheduled_complete_time = this.editForm.time[1];
      }
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
          this.editForm.work_order_responsible =
            res.rows[0].user_employees_name; //工单负责人
          this.editForm.work_order_responsible_id =
            res.rows[0].user_employees_id; //工单负责人id
        });
    },
    //选择外协单位
    selectCounit() {
      this.$mesCounit
        .show("选择工单负责人", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            // 额外参数
            keyword: ""
          }
        })
        .then(res => {
          this.editForm.outsourcing_unit_id = res.rows[0].outsourcing_unit_id; //外协单位ID
          this.editForm.outsourcing_unit = res.rows[0].outsourcing_unit_name; //外协单位
        });
    },
    submitForm(formName) {
      if (this.surplusOutput < 0) {
        this.$message({
          message: "排产量不能大于剩余排产量",
          type: "error"
        });
      } else {
        this.editForm.plan_production_craft_path_id = this.selectProcessList[0].plan_production_craft_path_id;
        this.editForm.production_process_name = this.selectProcessList[0].production_process_name;
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$emit("sendProcess", {
              dialog: false, //编辑的状态框
              processMsg: this.editForm, //添加的数据
              surplusOutput: this.surplusOutput //排产剩余量
            });
            setTimeout(() => {
              this.editForm = {
                work_order_production_mode: "自产", //哪种方式，自产or委派
                time: "", //计划时间
                work_order_responsible_id: "", //工单负责人ID
                work_order_responsible: "", //工单负责人
                plan_production_craft_path_id: "", //工艺路线ID
                work_order_number: "", //工单编号
                work_order_output: "", //排产量
                production_process_name: "", //工序名称
                work_order_scheduled_state_time: "", //预计开始时间
                work_order_scheduled_complete_time: "", //预计完成时间
                outsourcing_unit_id: "", //外协单位ID
                outsourcing_unit: "", //外协单位
                scheduled_materials_outbound_time: "", //预计物料外放时间
                scheduled_materials_recovery_time: "" //预计物料回厂时间
              };
            }, 100);
          } else {
            return false;
          }
        });
      }
    }
  }
};
</script>
<style lang="scss">
.editProcess {
  .input-size {
    width: 215px;
  }
}
</style>

