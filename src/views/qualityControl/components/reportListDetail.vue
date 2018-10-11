<!--检测报告列表详细-->
<template>
  <div id="planListDetail">
    <el-row class="conTxt">
      <ul>
        <!-- <li v-text="'PQC 单号：20180530test'+nowData.plan_order_number"></li>
        <li v-text="'计划名称：test计划'+nowData.plan_batch"></li>
        <li v-text="'生产批号：C02351015'+nowData.product_model_name"></li>
        <li v-text="'工序：'+nowData.product_model_type"></li>
        <li v-text="'计划时间：2018/05/25 - 2018/05/27'+nowData.customer_name"></li> -->
        <!-- <li v-if="$route.path=='/qualityControl/detectionPlan'">计划负责人：
          <el-input v-model="principal"
                    size="mini"
                    class="inputSize pointer"
                    readonly
                    @click.native="selectProceduce"></el-input>
        </li> -->
        <li v-text="'PQC 单号：20180530test'"></li>
        <li v-text="'计划名称：test计划'"></li>
        <li v-text="'生产批号：C02351015'"></li>
        <li v-text="'工序：'"></li>
        <li v-text="'计划时间：2018/05/25 - 2018/05/27'"></li>
        <li v-text="'计划创建人：Alan'"></li>  
      </ul>
    </el-row>
    <el-row>
    <el-row class="my-2">
      <el-button size="small"
                 type="primary"
                 @click="lookModHistory('modif')">修改历史</el-button>
      <!-- <el-button type="primary"
                 size="small"
                 @click="LinkToProcessList()">工单列表</el-button> -->
      <!-- <el-button size="small"
                 class="tiffany-btn"
                 v-if="$route.path=='/productionSynergy/productionPlan'">复制计划</el-button> -->
    </el-row>
      <el-collapse v-model="activeNames"
                   accordion
                   @change="handleChange">
        <el-collapse-item title="Test_方案_01"
                          name="1">
          <el-table :data="testPlanList"
                      style="width: 100%;max-height:250px;"
                      v-loading="loading">
              <el-table-column prop="name"
                               label="报告名称">
              </el-table-column>
              <el-table-column prop="number"
                               label="PQC单号">
              </el-table-column>
              <el-table-column prop="director"
                               label="负责人">
              </el-table-column>
            </el-table>
        </el-collapse-item>
        <el-collapse-item title="Test_方案_02"
                          name="2">
          <el-table :data="testPlanList"
                      style="width: 100%;max-height:250px;"
                      v-loading="loading">
              <el-table-column prop="name"
                               label="报告名称">
              </el-table-column>
              <el-table-column prop="number"
                               label="PQC单号">
              </el-table-column>
              <el-table-column prop="director"
                               label="负责人">
              </el-table-column>
            </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    
    <!-- 修改历史 -->
    <el-dialog title="修改历史"
               :visible.sync="innerVisible"
               append-to-body>
      <div class="modContent"
           v-loading="loading">
        <el-table :data="modHisList"
                  style="width: 100%;max-height:250px;"
                  v-loading="loading">
          <el-table-column prop="name"
                           label="操作人">
          </el-table-column>
          <el-table-column prop="time"
                           label="操作时间">
          </el-table-column>
          <el-table-column prop="something"
                           label="操作内容">
          </el-table-column>
          <el-table-column prop="cause"
                           label="原因">
          </el-table-column>
        </el-table>
        <!-- <el-steps direction="vertical"
                  :active="1">
          <el-step v-for="(item ,index) in modHisList"
                   :key="index"
                   :description="item.name+'在'+item.time+item.something">
          </el-step>
        </el-steps> -->
      </div>
    </el-dialog>
    
  </div>
</template>
<script>
export default {
  name: "planListDetail",
  // props: ["nowData"],
  data() {
    return {
      //详情基本信息
      nowData:{'plan_responsible':'Alan'

      },
      principal: this.nowData.plan_responsible,
      activeNames: '1', //折叠选项
      innerVisible: false, //修改弹窗
      loading: false, //修改loading
      testPlanList: [
        {name:'1',
         number:'2',
         }
      ], //修改历史
     
     
      
      // newSelected: {} // 选中负责人的id数组
    };
  },
  mounted() {},
  methods: {
    //查询修改历史"modif",或者执行过程"all"
    async lookModHistory(str) {
      // if (str === "modif") {
      //   this.innerVisible = true; //修改弹出
      // }
      // this.loading = true; // 等待
      // this.modHisList = [];
      // const e = await this.ajax("queryProcessRecords", {
      //   screenCondition: str, //修改
      //   foreignKeyType: "plan",
      //   foreignKeyId: this.nowData.plan_id //外键当前id
      // });
      // setTimeout(() => {
      //   this.loading = false; // 等待结束
      // }, 500);
      // if (e.status === 0) {
      //   //表示成功
      //   // if (e.map.line != 0) {
      //   //   e.map.processRecordDTOs.forEach(n => {
      //   //     this.testPlanList.push({
      //   //       name: n.process_record_operation_user,
      //   //       time: n.process_record_operation_time,
      //   //       something: n.process_record_execute_operation,
      //   //       cause: n.process_record_operation_explain
      //   //     });
      //   //   });
      //   // }
      // } else if (e.status === 2) {
      //   //暂无数据
      //   this.testPlanList = [];
      // } else {
      //   this.$message({
      //     message: e.msg,
      //     type: "error"
      //   });
      // }
    },
    //选择负责人
    selectProceduce() {
      // this.$mesEmployee
      //   .show("选择工单负责人", {
      //     reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
      //     multiple: false, // 是否多选
      //     params: {
      //       // 额外参数
      //       keyword: ""
      //     }
      //   })
      //   .then(res => {
      //     // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
      //     this.principal = res.rows[0].user_employees_name;
      //     this.newSelected = res.rows[0]; //当前选中的对象
      //     setTimeout(() => {
      //       this.updatePrincipals();
      //     }, 500);
      //   });
    },
     //修改负责人
    async updatePrincipals() {
      // const e = await this.ajax("updatePrincipals", {
      //   planPrincipalDtos: JSON.stringify([
      //     {
      //       plan_order_id: this.nowData.plan_id, //生产计划id
      //       responsible_id: this.newSelected.user_employees_id, //负责人id
      //       responsible_name: this.newSelected.user_employees_name, //负责人名称
      //       old_responsible_id: this.nowData.plan_responsible_id, //原负责人id
      //       old_responsible_name: this.nowData.plan_responsible //原负责人名称
      //     }
      //   ]),
      //   type: "plan"
      // });
      // if (e.status === 0) {
      //   this.$message({
      //     message: "修改成功",
      //     type: "success"
      //   });
      // } else {
      //   this.$message({
      //     message: e.msg,
      //     type: "error"
      //   });
      // }
    },
  }
};
</script>
<style lang="scss" scoped>
#planListDetail {
  font-size: 13px;
  .conTxt {
    ul > li {
      height: 30px;
      line-height: 30px;
      min-width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      float: left;
      .inputSize {
        width: 150px;
      }
    }
  }
  
  .modContent {
    max-height: 150px;
    overflow-y: scroll;
  }
}
</style>

