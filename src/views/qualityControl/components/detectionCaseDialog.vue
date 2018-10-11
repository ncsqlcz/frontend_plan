<!--创建方案-->
<template>
  <div id="caseDialog">
    <el-form :model="caseForm"
             :rules="caseRules"
             label-width="100px"
             label-position="left"
             ref="caseForm"
             status-icon
             style="border:1px solid #CCC;padding: 16px 10px; margin-top: -16px">
      <ul>
        <li class="before after">
          <ul>
            <li class="fl liWidth">
              <el-form-item label="方案名称"
                            prop="caseName">
                <el-input v-model.number="caseForm.caseName"
                          auto-complete="off"
                          placeholder="请输入方案名称"
                          size="small"></el-input>

              </el-form-item>
            </li>
            <li class="fl liWidth ml-5">
              <el-form-item label="方案编号"
                            prop="caseCode">
                <el-input v-model.number="caseForm.caseCode"
                          auto-complete="off"
                          placeholder="请输入方案编号"
                          size="small"></el-input>
              </el-form-item>
            </li>
          </ul>
        </li>

        
        <li class="before after">
          <ul>
            <li class="fl liWidth">
              <el-form-item label="检测方式"
                            prop="testMethod">
                <el-input placeholder="请选择检测方式"
                          v-model="caseForm.testMethod"
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
              <el-form-item label="原料名称"
                            prop="materialName"
                            v-if="parentData.type == 'IQC'">
                <el-input placeholder="请选择原料名称"
                          v-model="caseForm.materialName"
                          size="small"
                          readonly
                          class="pointer"
                          @click.native="selectMaterialName">
                  <i slot="prefix"
                     class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
              <el-form-item label="工序"
                            prop="process"
                            v-if="parentData.type == 'PQC'">
                <el-input placeholder="请选择工序"
                          v-model="caseForm.process"
                          size="small"
                          readonly
                          class="pointer"
                          @click.native="selectProcess">
                  <i slot="prefix"
                     class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
              <el-form-item label="成品名称"
                            prop="productName"
                            v-if="parentData.type == 'FQC'">
                <el-input placeholder="请选择成品名称"
                          v-model="caseForm.productName"
                          size="small"
                          readonly
                          class="pointer"
                          @click.native="selectProductName">
                  <i slot="prefix"
                     class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </li>
          </ul>
        </li>
        <el-form-item label="方案说明"
                      prop="caseCause">
          <el-input type="textarea"
                    placeholder="请填写方案说明"
                    v-model="caseForm.caseCause"
                    resize="none"
                    size="small">
          </el-input>
        </el-form-item>
      </ul>
    </el-form>
    <div slot="footer"
         class="dialog-footer selectButt">
      <el-button type="primary"
                 @click="selectTestType"
                 size="mini">选择检测类型</el-button>
    </div>
    <el-collapse v-model="activeName"
                 accordion>
      <el-collapse-item v-for="(item, index) in testTypeArray"
                        :key="index"
                        :name="index + 1">
        <template slot="title">
          {{item.name}}
          <el-button type="primary"
                     size="mini"
                     class="fr mt-2 mr-2"
                     @click.stop="selectTestProject(item.id, index)">选择检测项目</el-button>
        </template>
        <el-table :data="item.testProjectData"
                  style="width: 100%">
          <el-table-column label="检测项目"
                           width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检验工具"
                           width="250">
            <template slot-scope="scope">
              <el-input placeholder="请选择检验工具"
                        v-model="scope.row.testTool"
                        size="small"
                        readonly
                        class="pointer caseInput"
                        @click.native="selectTestTool(index, scope.$index)">
                <i slot="prefix"
                   class="el-input__icon el-icon-search"></i>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="检验标准"
                           width="250">
            <template slot-scope="scope">
              <el-input placeholder="请选择检验标准"
                        v-model="scope.row.testStandard"
                        size="small"
                        readonly
                        class="pointer caseInput"
                        @click.native="selectTestStandard(index, scope.$index)">
                <i slot="prefix"
                   class="el-input__icon el-icon-search"></i>
              </el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

    <div slot="footer"
         class="dialog-footer mt-3"
         style="text-align:right">
      <el-button type="primary"
                 @click="completeCase"
                 size="mini">完 成</el-button>
    </div>

    <el-dialog :title="innerDialogTitle"
               :visible.sync="innerVisible"
               append-to-body
               width="250px"
               class="detailDialog">
      <el-table ref="testTypeData"
                :data="testTypeData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column width="120"
                         v-if="innerDialogTitle === '检测类型'">
          <template slot-scope="scope">{{ scope.row.quality_project_type_name }}</template>
        </el-table-column>
        <el-table-column width="120"
                         v-if="innerDialogTitle === '检测项目'">
          <template slot-scope="scope">{{ scope.row.quality_project_name }}</template>
        </el-table-column>
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
      </el-table>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="testTypeConfirm"
                   size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "iqcCaseDialog",
  props: { parentData: Object },
  data() {
    var checkCaseCause = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("方案不能为空"));
      } else if (!/^\S{1,50}$/.test(value)) {
        callback(new Error("50字以内"));
      } else {
        callback();
      }
    };
    return {
      //方案form
      caseForm: {
        caseName: "", //方案名称
        caseCode: "", //方案编号
        testMethod: "", //检测方式
        materialName: "", //原料名称
        process: "", //工序
        productName: "", //成品名称
        caseCause: "" //方案说明
      },
      selectedTestMethod: null, //选中的检测方式
      selectedMaterialName: null, //选中的原料名称
      selectedProcess: null, //选中的工序
      selectedProductName: null, //选中的成品名称
      //表单校验caseRules
      caseRules: {
        caseName: [
          { required: true, message: "请输入方案名称", trigger: "blur" }
          // {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号'}
        ],
        caseCode: [
          { required: true, message: "请填写方案编号", trigger: "blur" }
        ],
        testMethod: [
          { required: true, message: "请选择检测方式", trigger: "change" }
        ],
        materialName: [
          { required: true, message: "请选择原料名称", trigger: "change" }
        ],
        process: [{ required: true, message: "请选择工序", trigger: "change" }],
        productName: [
          { required: true, message: "请选择成品名称", trigger: "change" }
        ],
        caseCause: [
          { required: true, validator: checkCaseCause, trigger: "change" }
        ]
      },
      //检测类型
      testProjectData: [],
      innerVisible: false, //检测方案dialog显示
      innerDialogTitle: null, //内部dialog标题 (检测类型 检测项目)
      activeName: "0", //折叠面板状态
      //检测类型内容
      testTypeData: [],
      testTypeSelection: [], //选择的检测类型内容
      testTypeArray: [],
      pagination: {
        page: 1, //页数
        pageSize: 10, //每页的条数
        total: 0
      },
      curr: 0 //当前选择检测项目排名
    };
  },
  methods: {
    //查看检测类型信息，详情
    async queryQualityProjectType(projectTypeId, keyword) {
      // this.loading = true; // 等待
      const e = await this.ajax("queryQualityProjectType", {
        type: "all", //类型(detail：查看检测计划详情 all:查看所有)
        projectTypeId, //检验类型id
        keyword, //编号名称模糊搜索
        page: this.pagination.page, //消息状态中的页数
        pageSize: this.pagination.pageSize //页大小
      });
      // setTimeout(() => {
      //   this.loading = false; // 等待结束
      // }, 500);
      if (e.status === 0) {
        //表示成功
        this.testTypeData = e.map.qualityProjectTypes;
      } else if (e.status === 2) {
        //暂无数据
        this.testTypeData = [];
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //查看检测项目信息，详情
    async queryQualityProject(projectId,projectTypeId, keyword) {
      // this.loading = true; // 等待
      const e = await this.ajax("queryQualityProject", {
        type: "all", //类型(detail：查看检测计划详情 all:查看所有)
        projectId, //检验项目id
        projectTypeId, //项目类型id
        keyword, //编号名称模糊搜索
        page: this.pagination.page, //消息状态中的页数
        pageSize: this.pagination.pageSize //页大小
      });
      // setTimeout(() => {
      //   this.loading = false; // 等待结束
      // }, 500);
      if (e.status === 0) {
        //表示成功
        this.testTypeData = e.map.qualityProjectDTOs;
      } else if (e.status === 2) {
        //暂无数据
        this.testTypeData = [];
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //新增检测方案基础信息
    async saveQualityTemplate(
      template,
      projectTypeList,
      projectStandards,
      projectAppliances
    ) {
      const e = await this.ajax("saveQualityTemplate", {
        template, //方案基础信息
        projectTypeList, //检测类型id集合,以逗号分割
        projectStandards, //项目标准实体字符串
        projectAppliances //项目工具实体字符串
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "新建品质方案成功",
          type: "success"
        });
      } else if (e.status === 2) {
        //暂无数据
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //选择检测方式
    selectTestMethod() {
      switch (this.parentData.type) {
        case "IQC":
          this.$mesCheckMethod
            .show("选择IQC检测方式", {
              reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
              multiple: false, // 是否多选
              params: {
                keyword: "",
                templateType: "0"
              }
            })
            .then(res => {
              this.caseForm.testMethod = res.rows[0].quality_check_method_name;
              this.selectedTestMethod = res.rows[0]; //当前选中的对象
            });
          break;
        case "PQC":
          this.$mesCheckMethod
            .show("选择PQC检测方式", {
              reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
              multiple: false, // 是否多选
              params: {
                keyword: "",
                templateType: "1"
              }
            })
            .then(res => {
              this.caseForm.testMethod = res.rows[0].quality_check_method_name;
              this.selectedTestMethod = res.rows[0]; //当前选中的对象
            });
          break;
        case "FQC":
          this.$mesCheckMethod
            .show("选择FQC检测方式", {
              reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
              multiple: false, // 是否多选
              params: {
                keyword: "",
                templateType: "2"
              }
            })
            .then(res => {
              this.caseForm.testMethod = res.rows[0].quality_check_method_name;
              this.selectedTestMethod = res.rows[0]; //当前选中的对象
            });
          break;
        default:
          break;
      }
    },
    //选择工序
    selectProcess() {
      this.$mesProcessBasic
        .show("选择工序", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            keyword: ""
          }
        })
        .then(res => {
          this.caseForm.process = res.rows[0].production_process_name;
          this.selectedProcess = res.rows[0]; //当前选中的工序
        });
    },
    //选择成品名称
    selectProductName() {
      // this.
      //    .show("选择成品名称", {
      //      reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
      //      multiple: false, // 是否多选
      //      params: {
      //        keyword: ""
      //      }
      //    })
      //    .then(res => {
      //      this.caseForm.productName = res.rows[0].;
      //      this.selectedProductName = res.rows[0]; //当前选中的工序
      //    });
    },
    //选择原料名称
    selectMaterialName() {
      this.$mesMeterialsName
        .show("选择原料名称", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            keyword: ""
          }
        })
        .then(res => {
          this.caseForm.materialName = res.rows[0].material_name;
          this.selectedMaterialName = res.rows[0]; //当前选中的工序
        });
    },
    //选择检测类型
    selectTestType() {
      this.innerDialogTitle = "检测类型";
      this.queryQualityProjectType();
      this.innerVisible = true;
    },
    //选择检测项目
    selectTestProject(id, index) {
      this.innerDialogTitle = "检测项目";
      this.curr = index;
      this.queryQualityProject(null, id);
      this.innerVisible = true;
    },
    //选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.testTypeSelection = val;
    },
    //确定检测类型
    testTypeConfirm() {
      switch (this.innerDialogTitle) {
        case "检测类型":
          this.testTypeSelection.forEach(item => {
            this.testTypeArray.push({
              name: item.quality_project_type_name,
              id: item.quality_project_type_id,
              testProjectData: []
            });
          });
          break;
        case "检测项目":
          this.testTypeSelection.forEach(item => {
            this.testTypeArray[this.curr].testProjectData.push({
              projectId:item.quality_project_type_id,
              name: item.quality_project_type_name,
              testTool: "",
              testToolId: "",
              testStandard: "",
              testStandardId: "",
            });
          });
          break;
        default:
          break;
      }
      this.innerVisible = false;
    },
    //选择检验工具
    selectTestTool(i, index) {
      this.$mesQualityAppliance
        .show("选择检验工具", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            keyword: ""
          }
        })
        .then(res => {
          this.testTypeArray[i].testProjectData[index].testTool =
            res.rows[0].quality_appliance_name;
             this.testTypeArray[i].testProjectData[index].testToolId =
            res.rows[0].quality_appliance_id;
            
        });
    },
    //选择检验标准
    selectTestStandard(i, index) {
      this.$mesQualityStandard
        .show("选择检验标准", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            keyword: ""
          }
        })
        .then(res => {
          this.testTypeArray[i].testProjectData[index].testStandard =
            res.rows[0].quality_standard_name;
            this.testTypeArray[i].testProjectData[index].testStandardId =
            res.rows[0].quality_standard_id;
        });
    },
    //完成方案创建
    completeCase() {
      this.$refs.caseForm.validate(valid => {
        if (valid) {
          let template = {};
           let projectTypeList = "";
              this.testTypeArray.forEach(item => {
                projectTypeList += item.id + ','
              });
              let projectStandards = [];
              this.testTypeArray.forEach((i)=>{
                   i.testProjectData.forEach((item)=>{
                    projectStandards.push({
                       quality_project_id:item.projectId,
                       quality_standard_id:item.testStandardId
                    })
                   })
              });
              let projectAppliances = [];
               this.testTypeArray.forEach((i)=>{
                   i.testProjectData.forEach((item)=>{
                    projectAppliances.push({
                      quality_project_id: item.projectId,
                      quality_appliance_id: item.testToolId
                    })
                   })
              });
          switch (this.parentData.type) {
            case "IQC":
              template = {
                quality_check_method_id: this.selectedTestMethod.quality_check_method_id,
                quality_raw_material_id: this.selectedMaterialName.material_id,
                quality_raw_material_name: this.caseForm.materialName,
                quality_template_description: this.caseForm.caseCause,
                quality_template_name: this.caseForm.caseName,
                quality_template_number: this.caseForm.caseCode,
                quality_template_type: "0"
              };
              break;
          case "PQC":
              template = {
                quality_check_method_id: this.selectedTestMethod.quality_check_method_id,
                workstage_basics_id: this.selectedProcess.plan_production_craft_path_id,
                workstage_basics_name: this.caseForm.process,
                quality_template_description: this.caseForm.caseCause,
                quality_template_name: this.caseForm.caseName,
                quality_template_number: this.caseForm.caseCode,
                quality_template_type: "1"
              };
              break;
          case "FQC":
             template = {
                quality_check_method_id: this.selectedTestMethod.quality_check_method_id,
                // quality_finished_product_id: this.selectedProductName.,//成品名称id
                quality_finished_product_name: this.caseForm.productName,
                quality_template_description: this.caseForm.caseCause,
                quality_template_name: this.caseForm.caseName,
                quality_template_number: this.caseForm.caseCode,
                quality_template_type: "2"
              };
              break;   
          default:
             break;
          }
          this.saveQualityTemplate(
                JSON.stringify(template),
                JSON.stringify(projectTypeList.slice(projectTypeList.length)),
                JSON.stringify(projectStandards),
                JSON.stringify(projectAppliances)
              );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clearForm() {
       this.$refs.caseForm.resetFields();
    },
  }
};
</script>
<style lang="scss" scoped>
#caseDialog {
  .liWidth {
    width: 250px;
  }
  .selectButt {
    margin: 10px 0;
  }
  .caseInput {
    width: 150px;
  }
}
</style>