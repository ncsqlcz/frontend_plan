<!--生产列表主体-->
<template>
    <div id="allProctionList">
        <el-table :data="productionList"
                  style="width: 100%;"
                  v-loading="loading">
            <el-table-column label="订单编号" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.plan_order_number"></span>
                </template>
            </el-table-column>
            <el-table-column label="生产批次" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.plan_batch"></span>
                </template>
            </el-table-column>
            <el-table-column label="客户" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.customer_name"></span>
                </template>
            </el-table-column>
            <el-table-column label="产品名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.product_model_name"></span>
                </template>
            </el-table-column>
            <el-table-column label="产品类型" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.product_model_type"></span>
                </template>
            </el-table-column>
            <el-table-column label="负责人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.plan_responsible"></span>
                </template>
            </el-table-column>
            <el-table-column label="排产量" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.plan_output"></span>
                </template>
            </el-table-column>
            <el-table-column label="生产状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="work.transitionStatus(scope.row.plan_production_status)"></span>
                </template>
            </el-table-column>
            <el-table-column label="计划时间" show-overflow-tooltip>
                <template slot-scope="scope" >
                    <span v-html="scope.row.plan_scheduled_start_time+'至&nbsp;'+scope.row.plan_scheduled_completion_time"></span>
                </template>
            </el-table-column>
            <el-table-column fixed="right"
                             label="操作"
                             width="200"
                             align="center">
                <template slot-scope="scope">
                    <el-button type="text"
                               size="small"
                               @click="lookDetail(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-col :span="24"
                class="center mt-1">
            <!--分页 -->
            <el-pagination layout="total, sizes, prev, pager ,next"
                           :page-sizes="pagination.pageSizes"
                           :page-size="pagination.pageSize"
                           :total="pagination.total"
                           @current-change="handlePageChange"
                           @size-change="handleSizeChange">
            </el-pagination>
            <!-- 分页end -->
        </el-col>
        <el-dialog title="生产批次详情页"
                   :visible.sync="dialogDetail"
                   top="60px"
                   width="450px"
                   class="detailDialog">
            <batchDetail :nowData=nowData
                         ref="batchDetail"
                         @getClose="getChildDate"></batchDetail>
        </el-dialog>
    </div>
</template>

<script>
import batchDetail from "@/views/productionSynergy/children/batchDetail";
export default {
  name: "allProctionList",
  components: {
    batchDetail
  },
  props: ["parentData"],
  data() {
    return {
      loading: false,
      productionList: [],
      nowData: {}, //当前对象传入子组件
      //分页
      pagination: {
        page: 1, //页数
        pageSizes: [5, 10, 20, 30, 40, 50, 100],
        pageSize: 10, //每页的条数
        total: 0
      },
      dialogDetail: false
    };
  },
  mounted() {
    this.queryPlanOutline(
      this.parentData.planType,
      this.parentData.planStatus,
      this.parentData.keyword
    );
    this.getChildDate;
  },
  methods: {
    //接受子组件点击工单列表传过来的状态 来判断关闭模态框
    getChildDate(data) {
      this.dialogDetail = data;
    },
    // 页码改变
    handlePageChange(val) {
      this.pagination.page = val;
      this.queryPlanOutline(
        this.parentData.planType,
        this.parentData.planStatus,
        this.parentData.keyword
      );
    },
    // 每页数量改变
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryPlanOutline(
        this.parentData.planType,
        this.parentData.planStatus,
        this.parentData.keyword
      );
    },
    //查询生产计划列表
    async queryPlanOutline(type, planStatus, keyword) {
      this.loading = true; // 等待
      const e = await this.ajax("queryPlanOutline", {
        staffType: type,
        planStatus: planStatus,
        keyword: keyword,
        page: this.pagination.page, //消息状态中的页数
        pageSize: this.pagination.pageSize
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        this.pagination.total = e.map.line;
        this.productionList = e.map.planOutlineDTOs;
      } else if (e.status === 2) {
        //暂无数据
        this.pagination.total = 0;
        this.productionList = [];
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //查看详情
    lookDetail(nowData) {
      this.dialogDetail = true;
      this.nowData = nowData;
    }
  }
};
</script>
