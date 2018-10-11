<!--品质检测投诉-->
<template>
    <div id="qualityComplain">
        <el-row>
            <el-col :span="24"
                    class="switcher">
                        <el-button type="primary"
                                   class="ml-5"
                                   @click="setComplain">创建投诉</el-button>
                <div class="filter">
                    <div class="fr size3">
                        <el-input placeholder="搜索工序或编号"
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
        <!-- 投诉list -->
        <div class="qualityComplainList">
        <el-table :data="qualityComplainList"
                  :header-cell-style="{'background-color':'#ecf5ff'}"
                  style="width: 100%;"
                  max-height="800"
                  v-loading="loading"
                  @row-click="checkDetails">
            <el-table-column label="投诉编号" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.quality_complain_number"></span>
                </template>
            </el-table-column>
            <el-table-column label="投诉名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.quality_complain_name"></span>
                </template>
            </el-table-column>
            <el-table-column label="工序" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.workstage_basics_name"></span>
                </template>
            </el-table-column>
            <el-table-column label="投诉时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.quality_complain_create_date"></span>
                </template>
            </el-table-column>
            <el-table-column label="不良代号" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.quality_unqualified_name"></span>
                </template>
            </el-table-column>
            <el-table-column label="投诉人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.quality_complain_create_people_name"></span>
                </template>
            </el-table-column>
                <el-table-column fixed="right"
                                 label="操作"
                                 width="200"
                                 align="center">
                    <template slot-scope="scope">
                                <!-- scope.row.quality_complain_id -->
                        <el-button type="text"
                                   size="small"
                                   @click.stop="delectDetails(scope.$index, qualityComplainList, scope.row)">删 除</el-button>
                                   <el-button type="text"
                                   size="small"
                                   @click.stop="editDetail(scope.row)">编 辑</el-button>
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
       
        
        <!-- 创建新建投诉dialog -->
        <el-dialog title="创建投诉"
               :visible.sync="complainVisible"
               width="40%"
               min-width="400"
              @close="clearForm">
             <div class="qualityComplainDialog">
    <el-form :model="qualityComplainForm"
             :rules="qualityComplainRules"
             label-width="100px"
             label-position="left"
             ref="qualityComplainForm"
             status-icon
             style="border:1px solid #CCC;padding: 16px 10px; margin-top: -16px"
               >
      <ul>
        <li class="liWidth">
          <el-form-item label="投诉编号">
            <div>{{qualityComplainForm.complainNumber}}</div>
           
          </el-form-item>
        </li>
        <li class="liWidth">
          <el-form-item label="投诉名称"
                        prop="complainName">
            <el-input  v-model="qualityComplainForm.complainName"
                      auto-complete="off"
                      placeholder="请输入投诉名称"
                      size="small"></el-input>
          </el-form-item>
        </li>
        <li class="liWidth">
          <el-form-item label="工序"
                        prop="process">
            <el-input  v-model="qualityComplainForm.process"
                      auto-complete="off"
                      placeholder="请选择工序"
                      readonly
                      class="pointer"
                      size="small"
                      @click.native="selectProcess"></el-input>
          </el-form-item>
        </li>
        <li class="liWidth">
          <el-form-item label="不良代号"
                        prop="rejectCode">
            <el-input  v-model="qualityComplainForm.rejectCode"
                      auto-complete="off"
                      placeholder="请选择不良代号"
                      size="small"
                      readonly
                      class="pointer"
                      @click.native="selectRejectCode"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="投诉内容"
                        prop="complainContent">
            <el-input type="textarea"
                      placeholder="请填写投诉内容"
                      v-model="qualityComplainForm.complainContent"
                      resize="none"
                      size="small">
            </el-input>
          </el-form-item>
        </li>
      </ul>
    </el-form>
    <div slot="footer"
           class="dialog-footer" style="text-align:right">
                   <el-button type="primary"
                   size="small"
                   @click="completeComplain('qualityComplainForm')">完 成</el-button>
    </div>
  </div>
        </el-dialog>
        <!-- 创建查看投诉dialog -->
        <el-dialog title="投诉详情"
               :visible.sync="complainDetailVisible"
               width="40%"
               min-width="400"
               @close="clearForm">
             <div class="qualityComplainDialog">
    <el-form :model="complainDetailData"
             label-width="100px"
             label-position="left"
             style="border:1px solid #CCC;padding: 16px 10px; margin-top: -16px">
      <ul>
        <li class="liWidth">
          <el-form-item label="投诉编号">
            
            <div >{{complainDetailData.quality_complain_number}}</div>
          </el-form-item>
        </li>
        <li class="liWidth">
          <el-form-item label="投诉名称">
                      <div>{{complainDetailData.quality_complain_name}}</div>
          </el-form-item>
        </li>
        <li class="liWidth">
          <el-form-item label="工序">
                      <div >{{complainDetailData.workstage_basics_name}}</div>
          </el-form-item>
        </li>
        <li class="liWidth">
          <el-form-item label="不良代号">
                      <div>{{complainDetailData.quality_unqualified_name}}</div>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="投诉内容">
            <div>{{complainDetailData.quality_complain_content}}</div>
          </el-form-item>
        </li>
      </ul>
    </el-form>
  </div>
        </el-dialog>
   </div>
</template>
<script>
export default {
  name: "qualityComplain",
  data() {
    return {
      selectVal: "", //工序或编号
      complainVisible: false, //创建投诉
      qualityComplainList: null,
      type: 'all', //('detail' 查看详情 'all' 查看所有)
      pagination: {
          page: 1,//页数
          pageSize: 10,//每页的条数
          total: 0
        },
      detailData: null,
      loading: false, //加载
      complainDetailVisible: false, //详情投诉dialog
      complainEditVisible: false, //投诉编辑dialog
      //投诉弹窗
      qualityComplainForm: {
        complainNumber: "", //投诉编号
        complainName: "", //投诉名称
        process: '',  //工序
        rejectCode: '',  //不良代号
        complainContent: "", //投诉内容
        processId: '', //工序ID
        rejectCodeId:'', //不良代号ID
      },
      //投诉弹窗校验规则
      qualityComplainRules: {
        complainNumber: [],
        complainName: [
          {required: true, message: '请输入投诉名称', trigger: 'blur'} 
        ],
        process: [
          {required: true, message: '请选择工序', trigger: 'change'} 
        ],
        rejectCode: [
          { required: true, message: '请选择不良代号', trigger: 'change'} 
        ],
        complainContent: [
          { required: true, message: '请填写投诉内容', trigger: 'blur' }
        ]
      },
      complainDetailData: {}, //投诉详情数据
      complainId: null, //品质投诉id
    };
  },
  mounted() {
    this.queryQualityComplain(this.type);
  },
  methods: {
    //查询品质投诉信息
     async queryQualityComplain(type, complainId, keyword) {
       console.log(complainId)
       this.loading = true;
      const e = await this.ajax("queryQualityComplain", {
        type,
        complainId,
        keyword: keyword,
        page: this.pagination.page, //消息状态中的页数
        pageSize: this.pagination.pageSize
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        switch(type) {
          case 'all':
             this.qualityComplainList = e.map.qualityComplain;
             this.pagination.total = e.map.line;
            //  console.log(this.qualityComplainList);
             break;
          case 'detail':
             this.complainDetailData = e.map.qualityComplain;
       this.qualityComplainForm = {
        complainNumber: e.map.qualityComplain.quality_complain_number, //投诉编号
        complainName: e.map.qualityComplain.quality_complain_name, //投诉名称
        process: e.map.qualityComplain.workstage_basics_name,  //工序
        rejectCode: e.map.qualityComplain.quality_unqualified_name,  //不良代号
        complainContent: e.map.qualityComplain.quality_complain_content, //投诉内容
        processId: e.map.qualityComplain.workstage_basics_id, //工序ID
        rejectCodeId:e.map.qualityComplain.quality_unqualified_id, //不良代号ID
      };
             break;
          default:
             break;
        };
      }else if (e.status === 2) {
        //暂无数据
         this.pagination.total = 0
         this.qualityComplainList = [];
         this.complainDetailData = {};
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
     //删除品质投诉
     async deleteQualityComplain(complainId) {
      const e = await this.ajax("deleteQualityComplain", {
        complainId,
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: '删除品质投诉成功',
          type: "success"
        });
      }else if (e.status === 2) {
        //暂无数据
         this.pagination.total = 0
         this.qualityComplainList = []
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //生成投诉编号
     async generateNumber() {
      const e = await this.ajax("generateNumber", {
        category: 'complain',
      });
      if (e.status === 0) {
        //表示成功
       this.qualityComplainForm.complainNumber = e.data;
      }else if (e.status === 2) {
        //暂无数据
         this.qualityComplainForm.complainNumber = '';
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //新增品质投诉
     async saveQualityComplain(qualityComplain) {
      const e = await this.ajax("saveQualityComplain", {
        qualityComplain: qualityComplain,
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: '新增品质投诉成功',
          type: "success"
        });
        this.queryQualityComplain('all');
      }else if (e.status === 2) {
        //暂无数据
         this.pagination.total = 0
         this.qualityComplainList = []
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //编辑品质投诉
     async updateQualityComplain(complainId, complainNumber, complainName, workstageBasicsId, unqualifiedId, complainContent) {
       console.log(complainId, complainNumber, complainName, workstageBasicsId, unqualifiedId, complainContent)
      const e = await this.ajax("updateQualityComplain", {
        complainId,
        complainNumber,
        complainName,
        workstageBasicsId,
        unqualifiedId,
        complainContent
      });
      
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: '编辑品质投诉成功',
          type: "success"
        });
        this.queryQualityComplain('all');
      }else if (e.status === 2) {
        //暂无数据
         this.pagination.total = 0
         this.qualityComplainList = []
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //选择工序
    selectProcess() {
       this.$mesProcessBasic.show('选择工序', {
       reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
       multiple: false, // 是否多选
       params: {       // 额外参数
          keyword: ''
        },
      }).then(res => {
        // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
        // console.log(res)
         this.qualityComplainForm.process = res.rows[0].production_process_name; //工序
         this.qualityComplainForm.processId = res.rows[0].plan_production_craft_path_id; //工序ID
        
      })
    },
    //选择不良代号
    selectRejectCode() {
      this.$mesRejectCode.show('选择不良代号', {
       reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
       multiple: false, // 是否多选
       params: {       // 额外参数
          keyword: ''
        },
      }).then(res => {
        // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
        // console.log(res)
         this.qualityComplainForm.rejectCode = res.rows[0].quality_unqualified_name; //不良名称
         this.qualityComplainForm.rejectCodeId = res.rows[0].quality_unqualified_id; //不良名称ID
      })
    },

   //删除投诉列表项
   delectDetails(index, rows, row) {
      this.$confirm('确认删除该投诉吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rows.splice(index,1);
          this.deleteQualityComplain(row.quality_complain_id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
   },
    //创建投诉
    setComplain() {
      this.generateNumber();
        this.operationType = '创建';
        this.complainVisible = true;
        this.qualityComplainForm = {
        complainNumber: '', //投诉编号
        complainName: '', //投诉名称
        process: '',  //工序
        rejectCode: '',  //不良代号
        complainContent: '', //投诉内容
        processId: '', //工序ID
        rejectCodeId:'', //不良代号ID
      };
    },
    changeType() {},
    changeState() {},
    selectInput() {},
    //进行编辑
    editDetail(row) {
        this.operationType = '编辑';
        this.complainVisible = true;
        this.complainId = row.quality_complain_id;
        this.queryQualityComplain( 'detail', row.quality_complain_id)
    },
    //查看详情
   checkDetails(val) {
    this.queryQualityComplain('detail', val.quality_complain_id);
    this.complainDetailVisible = true;
   },
   //完成投诉dialog
    completeComplain(qualityComplainForm) {
      this.$refs[qualityComplainForm].validate((valid) => {
          if (valid) {
            switch(this.operationType) {
              case '创建':
              //  新增投诉
                const qualityComplain = {
                 "quality_complain_content": this.qualityComplainForm.complainContent,
                 "quality_complain_create_people":"people1111" ,
                 "quality_complain_name": this.qualityComplainForm.complainName,
                 "quality_complain_number": this.qualityComplainForm.complainNumber,
                 "quality_unqualified_id":this.qualityComplainForm.rejectCodeId,
                 "workstage_basics_id": this.qualityComplainForm.processId,
                 "workstage_basics_name": this.qualityComplainForm.process,
                 };
                 this.saveQualityComplain(JSON.stringify(qualityComplain));
                 this.$refs[qualityComplainForm].resetFields();
                 this.complainVisible = false;
                 break;
              case '编辑':
              //编辑投诉
                 this.updateQualityComplain(
                   this.complainId, //品质投诉id
                   this.qualityComplainForm.complainNumber, //投诉编号
                   this.qualityComplainForm.complainName, //投诉名称
                   this.qualityComplainForm.processId,//工序id
                   this.qualityComplainForm.rejectCodeId, //不良代号id
                   this.qualityComplainForm.complainContent //投诉内容
                   );
                  this.complainVisible = false;
                  //  this.$refs[qualityComplainForm].resetFields();
                 break;
              default:
                break;
            };
            
          } else {
            return false;
          }
        });
    },
    //更新投诉列表
    updataList() {
      this.queryQualityComplain('all');
    },
    //关闭dialog清空数据
    clearForm() {
    this.$refs.qualityComplainForm.resetFields();
    },
    // 页码改变
      handlePageChange (val) {
        this.pagination.page = val
    this.queryQualityComplain('all');
      },
      // 每页数量改变
      handleSizeChange (val) {
        this.pagination.pageSize = val
    this.queryQualityComplain('all');
      },
  }
};
</script>

<style lang="scss" scoped>
#qualityComplain{
  .qualityComplainDialog {
  .liWidth {
    width: 250px;
    margin: -3px 0;
  }
  .dialog-footer {
    margin-top: 10px;
    margin-right: 10px;
  }
 }
}

</style>
