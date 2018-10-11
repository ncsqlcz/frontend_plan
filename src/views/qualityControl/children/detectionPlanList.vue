<!--检测计划列表-->
<template>
    <div id="detectionPlanList">
        <div class="myWorkOrderList">
        <el-table :data="detectionPlanList"
                  :header-cell-style="{'background-color':'#ecf5ff'}"
                  style="width: 100%;"
                  max-height="800"
                  v-loading="loading"
                  @row-click="checkDetails">
            <el-table-column label="计划编号" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.quality_plan_number"></span>
                </template>
            </el-table-column>
            <el-table-column label="计划名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.quality_plan_name"></span>
                </template>
            </el-table-column>
            <el-table-column label="计划进度" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.quality_plan_schedule"></span>
                </template>
            </el-table-column>
            <el-table-column label="计划时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.quality_plan_complete_time"></span>
                </template>
            </el-table-column>
            <el-table-column label="创建人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.quality_plan_create_people"></span>
                </template>
            </el-table-column>
            <el-table-column label="负责人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.quality_plan_duty_people"></span>
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
                                   @click.stop="delectDetails(scope.$index,parentData.list, scope.row)">删 除</el-button>
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
        <!-- :title="workOrderTitle" -->
        <el-dialog :visible.sync="dialogDetail"
                     class="detailDialog"
                     width="450px">
            <planListDetail ></planListDetail>
        </el-dialog>   
    </div>
</template>
<script>
import planListDetail from "@/views/qualityControl/components/planListDetail"
export default {
  name: "detectionPlanList",
  components:{
      planListDetail
  },
   props: [],
  data() {
    return {
    //   workOrderTitle: null,

      detectionPlanList:[],
      dialogDetail: false, //计划详情显示
      loading: false, //加载
      pagination: {
          page: 1,//页数
          pageSize: 10,//每页的条数
          total: 0
        },
    };
  },
  mounted() {
    // this.queryQualityPlan(
    //   this.parentData.status,
    //   this.parentData.searchType,
    //   this.parentData.staffType,
    // )
  },
  methods: {
    //查看检测计划信息，详情
     async queryQualityPlan(type, planType, planId, createPeople, dutyPeople, keyword) {
      //  console.log(status, searchType, staffType);
      this.loading = true; // 等待
      const e = await this.ajax("queryQualityPlan", {
        type, //类型（detail：查看检测计划详情 all:查看所有
        planType, //计划的类型(计划类型（0：iqc，1：pqc，2：fqc）
        createPeople, //创建人id
        dutyPeople, //负责人id
        planId, //检测计划id
        keyword, //编号名称模糊搜索
        page: this.pagination.page, //消息状态中的页数
        pageSize: this.pagination.pageSize //页大小

      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
         this.detectionPlanList = e.map.qualityPlanList;
      }else if (e.status === 2) {
        //暂无数据
         this.pagination.total = 0
         this.detectionPlanList = []
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
   
    // 页码改变
      handlePageChange (val) {
        this.pagination.page = val
    //     this.queryWorkOrderOutline(this.parentData.status,
    //   this.parentData.searchType,
    //   this.parentData.staffType,)
      },
      // 每页数量改变
      handleSizeChange (val) {
        this.pagination.pageSize = val
    //     this.queryWorkOrderOutline(this.parentData.status,
    //   this.parentData.searchType,
    //   this.parentData.staffType,)
      },
   //删除工单列表项
  //  delectDetails(index, rows) {
  //    this.informationList.splice(index,1)
  //  },
   //查看详情
   checkDetails(row) {
    this.dialogDetail = true;
    console.log(row.quality_plan_type, row.quality_plan_id)
    this.queryQualityPlan('detail', row.quality_plan_type, row.quality_plan_id);
   }
   
  }
};
</script>

<style lang='scss'>
 #detectionPlanList {
     .completeButton {
       position: absolute;
       top: 16px;
       right: 220px; 
     }
     .copyButton {
       position: absolute;
       top: 16px;
       right: 80px;
     }  
 }
</style>
