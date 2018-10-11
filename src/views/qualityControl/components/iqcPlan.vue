<!--IQC创建计划-->
<template>
  <div id="iqcPlan">
    <el-form :model="iqcForm"
             :rules="iqcRules"
             label-width="100px"
             label-position="left"
             ref="form"
             status-icon
             style="border:1px solid #CCC;padding: 16px 10px; margin-top: -16px">
      <ul>
        <li class="before after">
          <ul>
            <li class="fl liWidth">
              <el-form-item label="计划编号">
                <div>{{iqcForm.planNumber}}</div>
              </el-form-item>
            </li>
            <li class="fl liWidth ml-5">
              <el-form-item label="计划名称"
                            prop="planName">
                <el-input v-model.number="iqcForm.planName"
                          auto-complete="off"
                          placeholder="请输入计划名称"
                          size="small"></el-input>
              </el-form-item>
            </li>
          </ul>
          </li>
          <li class="before after">
            <ul>
              <li class="fl liWidth">
                <el-form-item label="物料名称"
                              prop="materialsName">
                  <el-input v-model.number="iqcForm.materialsName"
                            auto-complete="off"
                            readonly
                            class="pointer"
                            placeholder="请选择物料名称"
                            size="small"
                            @click.native="selectMaterialsName">
                    <i slot="prefix"
                       class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-form-item>
              </li>
              <li class="fl liWidth ml-5">
                <el-form-item label="物料类型"
                              prop="materialsType">
                  <span>{{iqcForm.materialsType}}</span>
                </el-form-item>
              </li>
            </ul>
          </li>
          <li class="liWidth">
            <el-form-item label="物料批次"
                          prop="materialsBath">
              <el-input placeholder="请填写物料批次"
                        v-model="iqcForm.materialsBath"
                        size="small">
              </el-input>
            </el-form-item>
          </li>

          <li class="before after">
            <ul>
              <li class="fl liWidth">
                <el-form-item label="检验方式"
                              prop="testMethod">
                  <el-input placeholder="请选择检验方式"
                            v-model="iqcForm.testMethod"
                            size="small"
                            readonly
                            class="pointer"
                            @click.native="selectTestMethod">
                    <i slot="prefix"
                       class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-form-item>
              </li>
              <li class="fl liWidth ml-5">
                <el-form-item label="检测数量"
                              prop="testAmount">
                  <span>{{iqcForm.testAmount}}</span>
                </el-form-item>
              </li>
            </ul>
          </li>
          <li>
            <el-form-item label="计划时间"
                          prop="planTime">
              <el-date-picker v-model="iqcForm.planTime"
                              type="datetimerange"
                              start-placeholder="预计开始时间"
                              end-placeholder="预计完成时间"
                              :default-time="['12:00:00', '08:00:00']"
                              size="small">
              </el-date-picker>
            </el-form-item>
          </li>
          <li class="liWidth">
            <el-form-item label="计划负责人"
                          prop="programDirector">
              <el-input placeholder="请选择计划负责人"
                        v-model="iqcForm.programDirector"
                        size="small"
                        readonly
                        class="pointer"
                        @click.native="selectProgramDirector">
                <i slot="prefix"
                   class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form-item>
          </li>
          <el-form-item label="备注"
                        prop="remarks">
            <el-input type="textarea"
                      placeholder="请填写备注"
                      v-model="iqcForm.remarks"
                      resize="none"
                      size="small">
            </el-input>
          </el-form-item>
      </ul>
    </el-form>

    <div slot="footer"
         class="dialog-footer selectButt">
      <el-button type="primary"
                 @click="selectProject"
                 size="mini">选择方案</el-button>
    </div>

    <el-table :data="testData"
              style="width: 100%; border:1px solid #CCC">
      <el-table-column label="检测方案"
                       width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.plan }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测次数"
                       width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.frequency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer"
         class="dialog-footer selectButt">
      <el-button type="primary"
                 @click="nextStep"
                 size="mini">下一步</el-button>
    </div>

    <el-dialog title="IQC"
               :visible.sync="innerVisible"
               append-to-body>
      <el-collapse v-model="activeName"
                   accordion>
        <el-collapse-item title="Test_方案"
                          name="1">
          <el-table :data="innerTestData"
                    style="width: 100%">
            <el-table-column label="报告名称"
                             width="240">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.reportName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="IQC单号"
                             width="240">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.orderNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column label="负责人"
                             width="300">
              <template slot-scope="scope">
                 <el-input placeholder="请选择负责人"
                            v-model="scope.row.director"
                            size="small"
                            readonly
                            class="pointer"
                            @click.native="selectDirector">
                     <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "iqcPlan",
  data() {
    return {
      //iqc计划form
      iqcForm: {
        planNumber: "", //计划编号
        planName: "", //计划名称
        materialsName: "", //物料名称
        materialsType: "", //物料类型
        materialsBath: "", //物料批次
        testMethod: "", //检验方式
        testAmount: "", //检测数量
        planTime: "", //计划时间
        programDirector: "", //计划负责人
        remarks: "" //备注
      },
      //表单校验iqcRules
      iqcRules: {
        planNumber: [
          // { required: true, message: '请选择工序', trigger: 'change' }
        ],
        planName: [
          // { type: 'number', required: true, validator: checkScheduling, trigger: 'blur' },
        ],
        materialsName: [
          // { required: true, validator:checkPlanTime, trigger: 'blur' }
        ],
        materialsType: [
          
        ],
        materialsBath: [
          // { required: true, message: '请选择工单负责人', trigger: 'change' }
        ],
        testMethod: [
          // { required: true, message: '请选择生产批次', trigger: 'change' }
        ],
        testAmount: [],
        planTime: [],
        programDirector: [],
        remarks: []
      },
      //iqc检测方案 次数
      testData: [
        {
          plan: "Test_方案",
          frequency: "2"
        }
      ],
      innerTestData: [
        {
          reportName: "Test_方案名称",
          orderNumber: "20180725110035",
          director: "负责人",
        }
      ],
      innerVisible: false, //检测方案dialog显示
      activeName: "0"
    };
  },
  methods: {
    //选择物料名称
    selectMaterialsName() {},
    //选择物料方式
    selectTestMethod() {},
    //选择计划负责人
    selectProgramDirector() {},
    //选择方案
    selectProject() {},
    //删除检测方案
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    //下一步
    nextStep() {
      this.innerVisible = true;
    },
    //选择负责人
    selectDirector() {

    },
  }
};
</script>

<style lang="scss" scoped>
#iqcPlan {
  .liWidth {
    width: 250px;
    margin: -10px 0;
  }
  .selectButt {
    margin: 10px 0;
  }
}
</style>

