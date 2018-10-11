<!--IQC创建报告-->
<template>
  <div id="iqcReport">
    <el-form :model="iqcForm"
             :rules="iqcRules"
             label-width="100px"
             label-position="left"
             ref="form"
             status-icon
             style="border:1px solid #CCC;padding: 16px 10px 0px 10px; margin-top: -16px">
      <ul>
        <li class="before after">
          <ul>
            <li class="fl liWidth">
              <el-form-item label="报告编号">
                <div>{{iqcForm.reportNumber}}</div>
              </el-form-item>
            </li>
            <li class="fl liWidth ml-5">
              <el-form-item label="报告名称"
                            prop="reportName">
                <el-input v-model.number="iqcForm.reportName"
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
                <el-form-item label="物料型号"
                              prop="materialsType">
                  <span>{{iqcForm.materialsType}}</span>
                </el-form-item>
              </li>
            </ul>
          </li>
          <li class="before after">
            <ul>
              <li class="fl liWidth">
                <el-form-item label="物料批次"
                              prop="materialsBath">
                  <el-input placeholder="请填写物料批次"
                            v-model="iqcForm.materialsBath"
                            size="small">
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
                <el-form-item label="负责人"
                              prop="programDirector">
                  <el-input placeholder="请选择负责人"
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
            </ul>
          </li>
          <li>
            <el-form-item label="计划完成时间"
                          prop="planCompleteTime">
              <el-date-picker v-model="iqcForm.planCompleteTime"
                              type="datetimerange"
                              start-placeholder="预计开始时间"
                              end-placeholder="预计完成时间"
                              :default-time="['12:00:00', '08:00:00']"
                              size="small">
              </el-date-picker>
            </el-form-item>
          </li>

      </ul>
    </el-form>

    <el-collapse v-model="activeName"
                 accordion>
      <el-collapse-item title="设备参数"
                        name="1">
        <el-table :data="testData"
                  style="width: 100%">
          <el-table-column label="检测项目"
                           width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.testProject }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检验工具"
                           width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.testTool }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检验标准"
                           width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.testStandard }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检测情况"
                           width="130">
            <template slot-scope="scope">
              <div class="addblack"
                   @click="addtestSituation">+</div>
            </template>
          </el-table-column>
          <el-table-column label="检测结果"
                           width="130">
            <template slot-scope="scope">
              <el-select v-model="scope.row.testResult"
                         size="small"
                         @change="changeState">
                <el-option v-for="item in stateList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="尺寸检测"
                        name="2">
      </el-collapse-item>
      <el-collapse-item title="环境参数"
                        name="3">
      
      </el-collapse-item>
    </el-collapse>
    <ul style="margin:10px 0 ">
      <li>
        <span> 综合判定:</span>
        <el-select v-model="generalState"
                   size="small"
                   @change="changeGeneralState">
          <el-option v-for="item in generalStateList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span>备注:</span>
        <el-input type="textarea"
                  placeholder="请填写备注"
                  v-model="determineRemark"
                  resize="none"
                  size="small"
                  >
        </el-input>
      </li>
    </ul>
    <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   size="small"
                   @click="print">打 印</el-button>
                   <el-button 
                   size="small"
                   @click="edit">编 辑</el-button>
                   <el-button type="primary"
                   size="small"
                   @click="complete">完 成</el-button>
    </div>
    <el-dialog title="检测情况"
               :visible.sync="testSituationVisible"
               width="16%"
               min-width="400"
               append-to-body
               :before-close="handleClose">
      <div style=" border: 1px solid #CCC">
        <el-table :data="testSituationData"
                  style="width: 100%;"
                  max-height="500">
          <el-table-column type="index">
          </el-table-column>
          <el-table-column label="检测值">
            <template slot-scope="scope">
              <!-- 数值区间或标称值-偏差 -->
              <!-- <el-input v-model="scope.row.testValue"
                      size="small">
            </el-input> -->
              <!-- 文本描述 -->
              <el-select v-model="scope.row.testValue"
                         size="small"
                         @change="selectTestValue">
                <el-option v-for="item in TestValueList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>

            </template>
          </el-table-column>
          <el-table-column fixed="right">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, testSituationData)"
                         type="text"
                         size="small">
                移除
              </el-button>
            </template>
          </el-table-column>

        </el-table>
        <div class="addgreen"
             @click="addtestValue">+</div>
      </div>
      <ul>
        <li class="computedList">
          <span class="computedTitle">合格率</span>
          <span class="computedContent">24</span>
        </li>
        <li class="computedList">
          <span class="computedTitle">极差</span>
          <span class="computedContent">234</span>
        </li>
      </ul>

      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   size="small"
                   @click="completeEdit">完 成</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "iqcReport",
  props:["parentData"],
  data() {
    return {
      //iqc计划form
      iqcForm: {
        reportNumber: "", //计划编号
        reportName: "", //计划名称
        materialsName: "", //物料名称
        materialsType: "", //物料类型
        materialsBath: "", //物料批次
        testMethod: "", //检验方式
        testAmount: "", //检测数量
        planCompleteTime: "", //计划时间
        programDirector: "" //计划负责人
      },
      //表单校验iqcRules
      iqcRules: {
        reportNumber: [
          // { required: true, message: '请选择工序', trigger: 'change' }
        ],
        reportName: [
          // { type: 'number', required: true, validator: checkScheduling, trigger: 'blur' },
        ],
        materialsName: [
          // { required: true, validator:checkplanCompleteTime, trigger: 'blur' }
        ],
        materialsType: [],
        materialsBath: [
          // { required: true, message: '请选择工单负责人', trigger: 'change' }
        ],
        testMethod: [
          // { required: true, message: '请选择生产批次', trigger: 'change' }
        ],
        testAmount: [],
        planCompleteTime: [],
        programDirector: []
      },
      //iqc检测方案 次数
      testData: [
        {
          testProject: "外观",
          testTool: "内径千分尺",
          testStandard: "TEST01",
          testResult: "合格"
        },
        {
          testProject: "洁净度",
          testTool: "激光粒度仪",
          testStandard: "TEST02",
          testResult: "合格"
        },
        {
          testProject: "粘度",
          testTool: "激光粒度仪",
          testStandard: "TEST03",
          testResult: "不合格"
        }
      ],
      //检测项目的判定结果
      stateList: [
        {
          value: "不合格",
          label: "不合格"
        },
        {
          value: "合格",
          label: "合格"
        }
      ],
      generalState: "合格",
      generalStateList: [
        {
          value: "不合格",
          label: "不合格"
        },
        {
          value: "合格",
          label: "合格"
        },
        {
          value: "特采",
          label: "特采"
        }
      ],
      TestValueList: [
        {
          value: "NG",
          label: "NG"
        },
        {
          value: "OK",
          label: "OK"
        }
      ],
      innerVisible: false, //检测方案dialog显示
      activeName: "0", //折叠板状态
      determineRemark: "", //判定备注
      testSituationVisible: false, //检测情况显示
      testSituationData: [
        //检测情况数据
        // { testValue: "" },
        { testValue: "OK" },
        { testValue: "NG" }
      ]
    };
  },
  mounted() {
   
  },
  computed: {
    percentPass: function() {},
    range: function() {}
  },
  methods: {
     //生成报告编号
    async generateNumber(type) {
      const e = await this.ajax("generateNumber", {
        category: "report",
        type: type
      });
      if (e.status === 0) {
        //表示成功
               this.iqcForm.reportNumber = e.data;
      } else if (e.status === 2) {
        //暂无数据
        this.iqcForm.planNumber = "";
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
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
    //打印
    print() {

    },
    //编辑
    edit() {

    },
    //完成 
    complete() {
     this.$emit("handle");
    },
    //选择负责人
    selectDirector() {},
    //检测情况
    addtestSituation() {
      this.testSituationVisible = true;
    },
    //检测结果
    changeState() {},
    //综合判定
    changeGeneralState() {},
    //删除检测情况检测值
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    //添加检测情况检测值
    addtestValue() {
      this.testSituationData.push({ testValue: "" });
    },
    //选择检测值
    selectTestValue() {
      
    },
    //关闭二级dialog
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    //完成编辑
    completeEdit() {
      this.testSituationVisible = false;
      
    }
  }
};
</script>

<style lang="scss" scoped>
#iqcReport {
  .liWidth {
    width: 250px;
    margin: -10px 0;
  }
  .selectButt {
    margin: 10px 0;
  }
}
.computedList {
  margin: 5px;
  .computedTitle {
    width: 80px;
    display: inline-block;
  }
  .computedContent {
    display: inline-block;
    border: 1px solid #ccc;
    width: 80px;
    height: 32px;
    text-align: center;
    line-height: 30px;
    border-radius: 5px;
    margin-left: 20px;
  }
}
</style>

