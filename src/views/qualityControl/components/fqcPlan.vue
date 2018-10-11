<!--FQC创建计划-->
<template>
  <div id="fqcPlan">
    <el-form :model="fqcForm"
             :rules="fqcRules"
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
                <div>{{fqcForm.planNumber}}</div>
              </el-form-item>
            </li>
            <li class="fl liWidth ml-5">
              <el-form-item label="计划名称"
                            prop="planName">
                <el-input v-model.number="fqcForm.planName"
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
                <el-form-item label="生产批次"
                              prop="planBath">
                  <el-input v-model.number="fqcForm.planBath"
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
                <el-form-item label="成品名称"
                              prop="finishedProductName">
                  <span>{{fqcForm.finishedProductName}}</span>
                </el-form-item>
              </li>
            </ul>
          </li>
          <li class="before after">
            <ul>
              <li class="fl liWidth">
                <el-form-item label="检验方式"
                              prop="testMethod">
                  <el-input placeholder="请选择检验方式"
                            v-model="fqcForm.testMethod"
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
                  <span>{{fqcForm.testAmount}}</span>
                </el-form-item>
              </li>
            </ul>
          </li>
          <li>
            <el-form-item label="计划时间"
                          prop="planTime">
              <el-date-picker v-model="fqcForm.planTime"
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
                        v-model="fqcForm.programDirector"
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
                      v-model="fqcForm.remarks"
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

    <el-table :data="fqcTestData"
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
               :visible.sync="fqcInnerVisible"
               append-to-body>
      <el-collapse v-model="fqcActiveName"
                   accordion>
        <el-collapse-item title="Test_方案"
                          name="1">
          <el-table :data="fqcInnerTestData"
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
  name: "fqcPlan",
  data() {
    return {
      //fqc计划form
      fqcForm: {
        planNumber: "", //计划编号
        planName: "", //计划名称
        planBath: "", //生产批次
        finishedProductName: "", //成品名称
        testMethod: "", //检验方式
        testAmount: "", //检测数量
        planTime: "", //计划时间
        programDirector: "", //计划负责人
        remarks: "" //备注
      },
      //表单校验fqcRules
      fqcRules: {
        planNumber: [
          // { required: true, message: '请选择工序', trigger: 'change' }
        ],
        planName: [
          // { type: 'number', required: true, validator: checkScheduling, trigger: 'blur' },
        ],
        planBath: [
          // { required: true, validator:checkPlanTime, trigger: 'blur' }
        ],
        finishedProductName:[

        ],
        testMethod: [
          // { required: true, message: '请选择生产批次', trigger: 'change' }
        ],
        testAmount: [],
        planTime: [],
        programDirector: [],
        remarks: []
      },
      //fqc检测方案 次数
      fqcTestData: [
        {
          plan: "Test_方案",
          frequency: "2"
        }
      ],
      fqcfqcInnerTestData: [
        {
          reportName: "Test_方案名称",
          orderNumber: "20180725110035",
          director: "负责人",
        }
      ],
      fqcfqcInnerVisible: false, //检测方案dialog显示
      fqcActiveName: "0"
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
      this.fqcInnerVisible = true;
    },
    //选择负责人
    selectDirector() {

    },
  }
};
</script>

<style lang="scss" scoped>
#fqcPlan {
  .liWidth {
    width: 250px;
    margin: -10px 0;
  }
  .selectButt {
    margin: 10px 0;
  }
}
</style>
