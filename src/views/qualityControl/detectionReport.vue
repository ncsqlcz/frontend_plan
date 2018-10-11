<!--品质检测报告-->
<template>
  <div id="detectionReport">
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
                       slot="reference">创建报告</el-button>
          </el-popover>
        <div class="filter">
          <div class="size1 fl mr-3">
            <el-select v-model="state"
                       @change="changeState">
              <el-option v-for="item in stateList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="size2 fl mr-3">
            <el-select v-model="type"
                       placeholder="我负责"
                       @change="changeType">
              <el-option v-for="item in typeList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="fr size3">
            <el-input placeholder="搜索计划编号或计划名称"
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
    <!-- <detectionReportList @changeCurr="changeCurr"></detectionReportList> -->
    <!--检测报告列表-->
    <div id="detectionReportList">
      <div class="myWorkOrderList">
        <el-table :data="detectionReportList"
                  :header-cell-style="{'background-color':'#ecf5ff'}"
                  style="width: 100%;"
                  max-height="800"
                  v-loading="loading"
                  @row-click="checkDetails">
          <el-table-column label="报告编号"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_report_number"></span>
            </template>
          </el-table-column>
          <el-table-column label="报告名称"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_report_name"></span>
            </template>
          </el-table-column>
          <el-table-column label="物料批次"
                           show-overflow-tooltip
                           v-if="state === '0'">
            <template slot-scope="scope">
              <span v-text="scope.row.quality_plan_batch"></span>
            </template>
          </el-table-column>
          <el-table-column label="生产批次"
                           show-overflow-tooltip
                           v-if="state === '1'||state === '2'">
            <template slot-scope="scope">
              <span v-text="scope.row.warehouse_material_batch"></span>
            </template>
          </el-table-column>
          <el-table-column label="检测结果"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="reportResult(scope.row.quality_report_comprehensive_result)"></span>
            </template>
          </el-table-column>
          <el-table-column label="创建人"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_report_create_people_name"></span>
            </template>
          </el-table-column>
          <el-table-column label="负责人"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_report_duty_people_name"></span>
            </template>
          </el-table-column>
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
      <!-- :title="workOrderTitle" -->
      <!-- <el-dialog :visible.sync="dialogDetail"
                     class="detailDialog">
            <iqcReport ></iqcReport>
        </el-dialog>    -->
    </div>

    <el-dialog :title="reportTitle"
               :visible.sync="reportVisible"
               width="40%"
               min-width="400"
               :before-close="handleClose">
       <iqcReport ref="iqcReport"
                 :parentData="{'curr':curr}"
                 v-if="reportTitle === 'IQC'"></iqcReport>
      <!-- <pqcReport 
                 :parentData="{'curr':curr}"
                 v-if="reportTitle === 'PQC'"></pqcReport>
      <fqcReport @handle="handle"
                 :parentData="{'curr':curr}"
                 v-if="reportTitle === 'FQC'"></fqcReport> -->
    </el-dialog>
  </div>
</template>
<script>
import iqcReport from "@/views/qualityControl/components/iqcReport";
export default {
  name: "detectionReport",
  components: {
    iqcReport,
  },
  data() {
    return {
      type: "all",
      typeList: [
        {
          value: "all",
          label: "所有"
        },
        {
          value: "establishStaff",
          label: "我创建的"
        },
        {
          value: "principal",
          label: "我负责的"
        }
      ],
      state: "0",
      stateList: [
        {
          value: "0",
          label: "IQC"
        },
        {
          value: "1",
          label: "PQC"
        },
        {
          value: "2",
          label: "FQC"
        }
      ],
      selectVal: "", //计划编码或者名称
      visible: false, //新建检测内容显示(IQC PQC FQC)
      // setCheckReportType: null, //新建检测计划类型
      reportVisible: false, //创建报告显示
      reportTitle: null, //创建报告dialog标题
      curr: null, //传入子组件判断(1 新建 2 查看)
      pagination: {
        page: 1, //页数
        pageSize: 10, //每页的条数
        total: 0
      },
      detailData: null, //报告详细数据
      detectionReportList: [], //检测报告列表数据
      loading: false, //加载
      pagination: {
        page: 1, //页数
        pageSize: 10, //每页的条数
        total: 0
      },
    };
  },
  mounted() {
    this.queryQualityReport("all", this.state);
  },
  methods: {
    //查看检测报告信息，详情
    async queryQualityReport( type, reportType, createPeople, dutyPeople, reportId, keyword) {
      this.loading = true;
      const e = await this.ajax("queryQualityReport", {
        type: type, //类型
        reportType: reportType, //报告的类型
        createPeople: createPeople, //创建人id
        dutyPeople, //负责人id
        reportId, //检测报告id
        keyword, //编号名称模糊搜索
        page: this.pagination.page, //消息状态中的页数
        pageSize: this.pagination.pageSize
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        switch (type) {
          case "all":
            this.pagination.total = e.map.line;
            this.detectionReportList = e.map.reportList;
            break;
          case "detail":
            this.detailData = e.map.reportDetail;
            break;
          default:
            break;
        }
      } else if (e.status === 2) {
        //暂无数据
        this.pagination.total = 0;
        this.qualityComplainList = [];
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //选择创建类型
    selectType(type) {
      // this.setCheckReportType = type;
      // this.setReport();
      this.visible = false;
      this.reportTitle = type;
      var reportType = '';
      switch(type) {
          case 'IQC':
            reportType = '0';
            break;
          case 'PQC':
            reportType = '1';
            break;
          case 'FQC':
            reportType = '2';
            break;
          default:
            break;
      };
      this.$mesQualityProject
            .show("选择"+ type + "方案", {
              reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
              multiple: false, // 是否多选
              params: {
                keyword: "",
                templateType:reportType,
              }
            })
            .then(res => {
               this.reportVisible = true;
              this.$nextTick(()=>{
                this.$refs.iqcReport.generateNumber(reportType);
              })
              
            
            });
      // switch (type) {
      //   case "IQC":
      //     this.$mesQualityProject
      //       .show("选择IQC方案", {
      //         reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
      //         multiple: false, // 是否多选
      //         params: {
      //           keyword: "",
      //           templateType:'0',
      //         }
      //       })
      //       .then(res => {
      //          this.reportVisible = true;
      //         this.$nextTick(()=>{
      //           this.$refs.iqcReport.generateNumber('0');
      //         })
              
            
      //       });
      //     break;
      //   case "PQC":
      //     this.$mesQualityProject
      //       .show("选择PQC方案", {
      //         reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
      //         multiple: false, // 是否多选
      //         params: {
      //           keyword: "",
      //           templateType:'1',
      //         }
      //       })
      //       .then(res => {
      //         this.$nextTick(()=>{
      //            this.$refs.iqcReport.generateNumber('1');
      //         })
             
      //       this.reportVisible = true;
      //       });
      //     break;
      //   case "FQC":
      //     this.$mesQualityProject
      //       .show("选择FQC方案", {
      //         reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
      //         multiple: false, // 是否多选
      //         params: {
      //           keyword: "",
      //           templateType:'2',
      //         }
      //       })
      //       .then(res => { 
      //         this.$refs.iqcReport.generateNumber('2');
      //        this.reportVisible = true;
      //       });

      //     break;
      // }
    },
    changeType() {},
    changeState() {
      this.queryQualityReport("all", this.state);
    },
    selectInput() {},
    //查看详情
    checkDetails(row) {
      // this.$emit("changeCurr");
      this.dialogDetail = true;
    },
    // 页码改变
    handlePageChange(val) {
      this.pagination.page = val;
      this.queryQualityReport("all", this.state);
    },
    // 每页数量改变
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryQualityReport("all", this.state);
    },
    //检测结果转换
    reportResult(str) {
      switch (str) {
        case "0":
          return "合格";
          break;
        case "1":
          return "不合格";
          break;
        case "2":
          return "特采";
          break;
        default:
          // return "没数据";
          break;
      }
    },
    //选择物料名称
    selectMaterialsName() {},
    //选择物料方式
    selectTestMethod() {
      switch (this.reportTitle) {
        case "IQC":
          this.$mesIqcCheckMethod
            .show("选择IQC检验方式", {
              reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
              multiple: false, // 是否多选
              params: {
                // 额外参数
                keyword: ""
              }
            })
            .then(res => {
              // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
              this.iqcReportForm.testMethod = res.rows[0].quality_check_method_name;
            });
          break;
        case "PQC":
          this.$mesPqcCheckMethod
            .show("选择PQC检验方式", {
              reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
              multiple: false, // 是否多选
              params: {
                // 额外参数
                keyword: ""
              }
            })
            .then(res => {
              // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
              this.pqcReportForm.testMethod = res.rows[0].quality_check_method_name;
            });
          break;
        case "FQC":
          break;
          this.$mesFqcCheckMethod
            .show("选择FQC检验方式", {
              reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
              multiple: false, // 是否多选
              params: {
                // 额外参数
                keyword: ""
              }
            })
            .then(res => {
              // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
              this.fqcReportForm.testMethod = res.rows[0].quality_check_method_name;
            });
        default:
          break;
      }
    },
    //选择计划负责人
    selectProgramDirector() {
      this.$mesEmployee
        .show("选择负责人", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            // 额外参数
            keyword: ""
          }
        })
        .then(res => {
          // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
          this.iqcReportForm.programDirector = res.rows[0].user_employees_name;
        });
    },
   
    //打印
    print() {

    },
    //编辑
    edit() {

    },
    // //完成 
    // completeReport() {
    //  this.$emit("handle");
    // },
    //选择负责人
    selectDirector() {},
    //检测情况
    addtestSituation() {
      this.testSituationVisible = true;
    },
    // //检测结果
    // changeState() {},
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
    //完成编辑
    completeEdit() {
      this.testSituationVisible = false;
      
    },
    //关闭二级dialog
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
  }
};
</script>

<style lang="scss" scoped>
#detectionReport {
  .iqcReport {
    .liWidth {
      width: 260px;
      // margin: -10px 0;
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
}
</style>



