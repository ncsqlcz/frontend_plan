<!--品质检测方案-->
<template>
  <div id="detectionCase">
    <el-row>
      <el-col :span="24"
              class="switcher">
          <el-popover placement="bottom"
                      width="120"
                      v-model="visible">
            <ul>
              <li>
                <el-button type="primary"
                           class="productType"
                           size="small"
                           @click="selectType('IQC')">IQC</el-button>
              </li>
              <li>
                <el-button type="primary"
                           class="productType"
                           size="small"
                           @click="selectType('PQC')">PQC</el-button>
              </li>
              <li>
                <el-button type="primary"
                           class="productType"
                           size="small"
                           @click="selectType('FQC')">FQC</el-button>
              </li>
            </ul>
            <el-button type="primary"
                       class="ml-5"
                       slot="reference">创建方案</el-button>
          </el-popover>
        <div class="filter">
          <div class="fr size3">
            <el-input placeholder="搜索名称或编号"
                      v-model="selectVal"
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
    <div class="leftBox fl">
      <ul>
        <li v-for="(item, index) in leftBoxData"
            :key="index"
            :class="calendarActive == item?'active':''"
            @click="selectCaseType(item)">{{item}}</li>
      </ul>
    </div>
    <div class="rightBox fr">

      <div class="iqcCaseList">
        <el-table :data="caseList"
                  style="width: 100%;"
                  v-loading="loading"
                  @row-click="checkDetails">
          <el-table-column label="编号"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_template_number"></span>
            </template>
          </el-table-column>
          <el-table-column label="方案名称"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_template_name"></span>
            </template>
          </el-table-column>
          <el-table-column label="创建人"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_template_create_people_name"></span>
            </template>
          </el-table-column>

          <el-table-column label="说明"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_template_description"></span>
            </template>
          </el-table-column>
          <!--  <el-table-column fixed="right"
                                 label="操作"
                                 width="200"
                                 align="center">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="small"
                                   @click="lookDetail(scope.row)">编辑</el-button>
                    </template>
                </el-table-column> -->
        </el-table>
        <el-col :span="24"
                class="center mt-1">
          <!--分页 -->
          <el-pagination layout="total, sizes, prev, pager ,next"
                         :page-size="pagination.pageSize"
                         :total="pagination.total"
                         @current-change="handlePageChange"
                         @size-change="handleSizeChange">
          </el-pagination>
          <!-- 分页end -->
        </el-col>
      </div>
    </div>
    <!-- 创建方案dialog -->
    <el-dialog :title="'创建' + caseTitle + '方案'"
               :visible.sync="caseVisible"
               width="40%"
               min-width="400"
               @close="handleClose">
      <caseDialog ref="caseDialog"
                  :parentData="{'type':caseTitle}"></caseDialog>
    </el-dialog>
    <!-- 方案详情dialog -->
    <el-dialog title="方案详情"
               :visible.sync="dialogDetail"
               width="40%"
               min-width="400">

      <div class="caseDetailsDialog">
        <el-form :model="caseDetailsData"
                 label-width="100px"
                 label-position="left"
                 ref="caseDetailsData"
                 status-icon
                 style="border:1px solid #CCC;padding: 16px 10px; margin-top: -16px">
          <ul>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="方案名称">
                    <span>{{caseDetailsData.quality_template_name}}</span>
                  </el-form-item>
                </li>
                <li class="fl liWidth ml-5">
                  <el-form-item label="方案编号">
                    <span>{{caseDetailsData.quality_template_number}}</span>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="检测方式">
                    <span>{{caseDetailsData.quality_check_method_name}}</span>
                  </el-form-item>
                </li>
                <li class="fl liWidth ml-5">
                  <el-form-item label="原料名称"
                                v-if="caseDetailsData.quality_template_type == '0'">
                    <span>{{caseDetailsData.quality_raw_material_name}}</span>
                  </el-form-item>
                  <el-form-item label="工序"
                                v-if="caseDetailsData.quality_template_type == '1'">
                    <span>{{caseDetailsData.workstage_basics_name}}</span>
                  </el-form-item>
                  <el-form-item label="成品名称"
                                v-if="caseDetailsData.quality_template_type == '2'">
                    <span>{{caseDetailsData.quality_finished_product_name}}</span>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <el-form-item label="方案说明">
              <span>{{caseDetailsData.quality_template_description}}</span>
            </el-form-item>
          </ul>
        </el-form>
        <div slot="footer"
             class="dialog-footer selectButt">
          <el-row>检测类型</el-row>
        </div>
        <el-collapse v-model="activeName"
                     accordion>
          <el-collapse-item v-for="(item, index) in caseDetailsData.projectTypes"
                            :key="index"
                            :name="index + 1">
            <template slot="title">
              {{item.quality_project_type_name}}
            </template>
            <el-table :data="item.projectApplianceStandards"
                      style="width: 100%">
              <el-table-column label="检测项目"
                               width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.quality_project_name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="检验工具"
                               width="250">
                <template slot-scope="scope">
                  <span>{{ scope.row.quality_appliance_name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="检验标准"
                               width="250">
                <template slot-scope="scope">
                  <span>{{ scope.row.quality_standard_name }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import caseDialog from "@/views/qualityControl/components/detectionCaseDialog";
export default {
  name: "detectionCase",
  components: {
    caseDialog
  },
  data() {
    return {
      selectVal: "", //工序或编号
      loading: false, //加载
      pagination: {
        page: 1, //页数
        pageSize: 10, //每页的条数
        total: 0
      },
      visible: false, //新建检测内容显示(IQC PQC FQC)
      dialogDetail: false, //方案详情弹窗
      // setCheckReportType: null, //新建检测计划类型
      caseVisible: false, //创建基础数据
      caseTitle: null, //创建方案dialog标题
      leftBoxData: ["IQC", "PQC", "FQC"],
      calendarActive: "IQC", //左侧标签选择
      state: "0", //左侧选择类型(0-"IQC" 1-"PQC" 2-"FQC")
      curr: null, //(1-创建 2-查看编辑 )
      caseList: [], //方案list数据
      caseDetailsData: {}, //方案详情
      activeName: "0" //折叠面板状态
    };
  },
  mounted() {
    this.queryQualityTemplate("all", this.state);
  },
  methods: {
    //查看检测计划信息，详情
    async queryQualityTemplate(
      type,
      templateType,
      templateId,
      createPeople,
      dutyPeople,
      keyword
    ) {
      this.loading = true; // 等待
      const e = await this.ajax("queryQualityTemplate", {
        type, //类型(detail：查看检测计划详情 all:查看所有)
        templateType, //方案的类型(计划类型（0：iqc，1：pqc，2：fqc)
        templateId, //检测方案id
        keyword, //编号名称模糊搜索
        page: this.pagination.page, //消息状态中的页数
        pageSize: this.pagination.pageSize //页大小
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        switch (type) {
          case "all":
            this.caseList = e.map.templateList;
            this.pagination.total = e.map.line;
            break;
          case "detail":
            this.caseDetailsData = e.map.templateDetail;
            break;
          default:
            break;
        }
      } else if (e.status === 2) {
        //暂无数据
        switch (type) {
          case "all":
            this.pagination.total = 0;
            this.caseList = [];
            break;
          case "detail":
            this.caseDetailsData = null;
            break;
          default:
            break;
        }
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //选择创建类型 创建方案
    selectType(type) {
      this.visible = false;
      this.caseTitle = type;
      this.caseVisible = true;
    },
    //查看编辑List的基础数据
    editCase(val) {
      //alert(val); // id
      this.curr = 2;
      this.caseVisible = true;
    },
    //选择基础数据类型
    selectCaseType(item) {
      this.calendarActive = item;
      switch (item) {
        case "IQC":
          this.state = "0";
          break;
        case "PQC":
          this.state = "1";
          break;
        case "FQC":
          this.state = "2";
          break;
        default:
          break;
      }
      this.queryQualityTemplate("all", this.state);
    },

    //选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.testTypeSelection = val;
    },
    //查看详情
    checkDetails(row) {
      this.dialogDetail = true;
      this.queryQualityTemplate(
        "detail",
        row.quality_template_type,
        row.quality_template_id
      );
    },
    //搜索名称或编号
    selectInput() {},
    // 页码改变
    handlePageChange(val) {
      this.pagination.page = val;
      this.queryQualityTemplate("all", this.state);
    },
    // 每页数量改变
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryQualityTemplate("all", this.state);
    },
    //清空form数据
    handleClose() {
      this.$refs.caseDialog.clearForm();
    }
  }
};
</script>

<style lang="scss" scoped>
#detectionCase {
  .switcher {
    .bw {
      width: 86px;
    }
  }
  .leftBox {
    width: 300px;
    height: -moz-calc(100vh - 120px);
    height: -webkit-calc(100vh - 120px);
    height: calc(100vh - 120px);
    background-color: rgb(221, 237, 236);
    border-right: 1px solid #dcdcdc;
    ul > li {
      width: 299px;
      height: 60px;
      text-align: center;
      line-height: 60px;
    }
    .active {
      background-color: #fff;
      color: rgb(0, 228, 189);
    }
  }
  .rightBox {
    width: -moz-calc(100% - 300px);
    width: -webkit-calc(100% - 300px);
    width: calc(100% - 300px);
    height: -moz-calc(100vh - 120px);
    height: -webkit-calc(100vh - 120px);
    height: calc(100vh - 120px);
  }
  .caseDetailsDialog {
    .liWidth {
      width: 250px;
      margin: -10px 0;
    }
    .selectButt {
      margin: 10px 0;
    }
    .caseInput {
      width: 130px;
    }
  }
}
</style>