<!--检测报告列表详细-->
<template>
    <div id="detectionReportList">
        <div class="myWorkOrderList">
        <el-table :data="detectionReportList"
                  :header-cell-style="{'background-color':'#ecf5ff'}"
                  style="width: 100%;"
                  max-height="800"
                  v-loading="loading"
                  @row-click="checkDetails">
            <el-table-column label="报告编号" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.a"></span>
                    <!-- <span v-text="scope.row.plan_order_number"></span> -->
                </template>
            </el-table-column>
            <el-table-column label="报告名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <!-- <span v-text="scope.row.plan_order_number"></span> -->
                </template>
            </el-table-column>
            <el-table-column label="物料/生产批次" show-overflow-tooltip>
                <template slot-scope="scope">
                    <!-- <span v-text="scope.row.plan_order_number"></span> -->
                </template>
            </el-table-column>
            <el-table-column label="检测结果" show-overflow-tooltip>
                <template slot-scope="scope">
                    <!-- <span v-text="scope.row.plan_order_number"></span> -->
                </template>
            </el-table-column>
            <el-table-column label="创建人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <!-- <span v-text="scope.row.plan_order_number"></span> -->
                </template>
            </el-table-column>
            <el-table-column label="负责人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <!-- <span v-text="scope.row.plan_order_number"></span> -->
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
</template>
<script>
import iqcReport from "@/views/qualityControl/components/iqcReport"
export default {
  name: "detectionReportList",
  components:{
      iqcReport
  },
   props: [],
  data() {
    return {
    //   workOrderTitle: null,

      detectionReportList:[
          {a:'报告编号'}
      ],

      workType: '', //工单类型
      workId: '', //工单id

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
    // this.queryWorkOrderOutline(
    //   this.parentData.status,
    //   this.parentData.searchType,
    //   this.parentData.staffType,
    // )
  },
  methods: {
    //查询工单摘要
    //  async queryWorkOrderOutline(status, searchType, staffType, planId, keyword) {
    //   //  console.log(status, searchType, staffType);
    //   this.loading = true; // 等待
    //   const e = await this.ajax("queryWorkOrderOutline", {
    //     workOrderStatus: status,
    //     searchType: searchType,
    //     staffType: staffType,
    //     planId: planId,
    //     keyword: keyword,
    //     page: this.pagination.page, //消息状态中的页数
    //     pageSize: this.pagination.pageSize

    //   });
    //   setTimeout(() => {
    //     this.loading = false; // 等待结束
    //   }, 500);
    //   if(this.informationList != []) {
    //       this.informationList = [];
    //   };
    //   if (e.status === 0) {
    //     //表示成功
    //     var map = e.map;
    //     var planViewDTOs = map.planViewDTOs;
    //      this.pagination.total = map.line
    //     var len1 = planViewDTOs.length;
    //     var list = [];
    //     for(var i = 0; i < len1; i++) {
    //        planViewDTOs[i].productionCraftPaths
          
    //          for(var j = 0, len2 = planViewDTOs[i].productionCraftPaths.length; j < len2; j++) {
    //            planViewDTOs[i].productionCraftPaths[j]
    //            var item = planViewDTOs[i].productionCraftPaths[j]
               
    //            for(var k = 0, len3 = item.workOrderDOs.length; k < len3; k++) {
    //                var planProductionStatus = '';
    //                switch(item.workOrderDOs[k].plan_production_status) {
    //                  case '0':
    //                     planProductionStatus = '已完成'
    //                     break;
    //                  case '1':
    //                     planProductionStatus = '生产中'
    //                     break;
    //                  case '2':
    //                     planProductionStatus = '暂停'
    //                     break;
    //                  case '3':
    //                     planProductionStatus = '未生产'
    //                     break;
    //                  case '4':
    //                     planProductionStatus = '关闭'
    //                     break;
    //                  case '5':
    //                     planProductionStatus = '未发出'
    //                     break;
    //                  case '6':
    //                     planProductionStatus = '已发出'
    //                     break;
    //                  case '7':
    //                     planProductionStatus = '已回厂'
    //                     break;
    //                  default:
    //                  console.log('状态码错误')
    //                     break;
    //                };
    //              list.push({
    //                    a: item.workOrderDOs[k].work_order_number, //工单号
    //                    b: item.workOrderDOs[k].plan_batch, //生产批次
    //                    c: item.workOrderDOs[k].production_process_name, //工序
    //                    d: item.workOrderDOs[k].plan_responsible, //负责人
    //                    e: item.workOrderDOs[k].work_order_output, //排产量
    //                    f: planProductionStatus, //生产状态
    //                    g: item.workOrderDOs[k].work_order_scheduled_complete_time, //计划完成时间
    //                    h: item.workOrderDOs[k].work_order_id, //工单id
    //                    l: item.workOrderDOs[k].work_order_production_mode //工单类型(自产、 委外加工)
    //                    })
    //            }
    //         }
    //     }

    //      this.informationList = list

    //   }else if (e.status === 2) {
    //     //暂无数据
    //      this.pagination.total = 0
    //      this.informationList = []
    //   } else {
    //     this.$message({
    //       message: e.msg,
    //       type: "error"
    //     });
    //   }
    // },
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
    this.$emit('changeCurr');
    this.dialogDetail = true;
    
   }
   
  }
};
</script>

<style lang='scss' scoped>
 #detectionReportList {
    //  .completeButton {
    //    position: absolute;
    //    top: 16px;
    //    right: 220px; 
    //  }
    //  .copyButton {
    //    position: absolute;
    //    top: 16px;
    //    right: 80px;
    //  }  
 }
</style>
