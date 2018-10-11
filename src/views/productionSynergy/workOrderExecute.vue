<!--工单执行首页-->
<template>
  <div id="workOrderExecute">
    <el-button type="text" 
               v-for="(item, index) in ExecuteList"
               @click="executeItem(index)"
               :key="index">
        <el-button class="executeItem">{{item}}</el-button>
    </el-button>
    <!-- 生产批次、工序、工单dialog -->
    <el-dialog :title="dialogTitle"
               :visible.sync="dialogFormVisible"
               :before-close="handleClose">
       <!-- dialog内容 -->
      <div class="nameList">
        <div class="nameListItem1"
             v-if="currdialogNumber === 1">
      
          <el-select v-model="selectType"
                     size="small"
                     placeholder="全部类型"
                     @change="changeType">
            <el-option v-for="item in typeList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- 搜索框 -->
        <div class="nameListItem2">
          <el-input v-model="nameContent"
                    placeholder="名称或编号"
                    size="small"
                    suffix-icon="el-icon-search"></el-input>
        </div>
      </div>
      <!-- 生产批次 -->
      <el-table :data="tableData1"
                style="width: 100%"
                highlight-current-row
                @current-change="handleCurrentChange"
                max-height="400"
                v-loading="loading"
                v-if="currdialogNumber === 1">
        <el-table-column prop="date"
                         label="生产批次"
                         width="250">
        </el-table-column>
        <el-table-column prop="name"
                         label="产品名称"
                         width="250">
        </el-table-column>
        <el-table-column prop="address"
                         label="负责人">
        </el-table-column>
      </el-table>
      <!-- 工序 -->
      <el-table :data="tableData2"
                style="width: 100%"
                highlight-current-row
                @current-change="handleCurrentChange"
                max-height="400"
                v-if="currdialogNumber === 2">
        <el-table-column prop="date"
                         label="工序编号"
                         width="250">
        </el-table-column>
        <el-table-column prop="name"
                         label="工序名称"
                         >
        </el-table-column>
      </el-table>
      <!-- 工单 -->
      <el-table :data="tableData3"
                style="width: 100%"
                highlight-current-row
                @current-change="handleCurrentChange"
                max-height="400"
                v-if="currdialogNumber === 3">
        <el-table-column prop="date"
                         label="工单编号"
                         width="250">
        </el-table-column>
        <el-table-column prop="name"
                         label="工序名称"
                         width="250">
        </el-table-column>
        <el-table-column prop="address"
                         label="负责人">
        </el-table-column>
      </el-table>
      <!-- 底部操作button -->
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="prevStep"
                   v-if="currdialogNumber !== 1">上一步</el-button>
        <el-button type="primary"
                   @click="nextStep"
                   :disabled = "buttonDisabled"
                   v-if="currdialogNumber !== 3">下一步</el-button>
        <el-button type="primary"
                   @click="toaddWorkOrder"
                   :disabled = "buttonDisabled">完 成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapMutations } from "vuex" //状态管理器 存批次、工序、工单名称
export default {
  name: "workOrderExecute",
  data() {
    return {
      ExecuteList: [
        "领料",
        "补料",
        "退料",
        "外发",
        "外发补料",
        "产出",
        "不良",
        "报废",
        "回厂",
        "回厂退料"
      ],
      dialogFormVisible: false, //"领料","补料","退料","外发","外发补料", "产出","不良","报废","回厂","回厂退料"dialog显示
      tableData1: [],//生产批次列表
      tableData2: [],//选择工序列表
      tableData3: [], //选择工单列表
      buttonDisabled: true, //底部操作按钮是否可用
      currentRow: [], //选择的批次、工序、工单内容
      selectType: "1", 
      typeList: [
        {
          value: "1",
          label: "正在生产中"
        },
        {
          value: "2",
          label: "已完成"
        }
      ],
      nameContent: null, //搜索框内容
      dialogTitle: null, //dialog标题
      currdialogNumber: null, //当前dialog进度(1.生产批次 2.工序 3.工单)
      loading: false,//加载 
      mode: 'interior', //查询生产计划摘要(工单执行) 模式
      type: 'all', //查询生产计划摘要(工单执行) 类型
      status: 'inProduction', //查询生产计划摘要(工单执行) 状态
      page: 1, //当前页
      pageSize: 5, //总页码
      unitTypeNum: null, //url参数(0,1,2,3,4,5,6,7,8,9)
    };
  },
  mounted() {},
  methods: {
    // 状态管理映射
    ...mapMutations({
      setBath:"workOrderExecuteData/setBath",
      setProcedure:"workOrderExecuteData/setProcedure",
      setWorkOrder: "workOrderExecuteData/setWorkOrder",
    }),
    //查询生产计划摘要(工单执行)
    async queryPlanOutlineByWorkOrderExecute(mode, type, status, keyword) {
      // this.materialId = id
      this.loading = true; // 等待
      const e = await this.ajax("queryPlanOutlineByWorkOrderExecute", {
        workOrderProductionMode: mode,
        staffType: type,
        planStatus: status,
        keyword: keyword,
        page: this.page,
        pageSize: this.pageSize
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
       if(this.tableData1 !== []){
          this.tableData1 =[]
        }
      if (e.status === 0) {
        //表示成功
        var map = e.map;
        var planOutlineDTOs = map.planOutlineDTOs;
        var list = []
        for(var i = 0, len = planOutlineDTOs.length; i < len; i++) {
          list.push({
            date: planOutlineDTOs[i].plan_batch,
            name: planOutlineDTOs[i].product_model_name,
            address: planOutlineDTOs[i].plan_responsible,
            id: planOutlineDTOs[i].plan_id
          })
        }
       
        this.tableData1 = list
      } else if (e.status === 1) {
        //非法参数
      } else if (e.status === 2) {
        //暂无数据
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //查询生产工艺路线(工单执行)
    async queryProductionCraftPathByWorkOrderExecute(mode, id, keyword) {
      // this.materialId = id
      this.loading = true; // 等待
      const e = await this.ajax("queryProductionCraftPathByWorkOrderExecute", {
        workOrderProductionMode: mode,
        planId: id,
        keyword: keyword,
        page: this.page,
        pageSize: this.pageSize
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
       if(this.tableData2 !== []){
          this.tableData2 = []
        }
      if (e.status === 0) {
        //表示成功
        var map = e.map;
        var productionCraftPathDTOs = map.productionCraftPathDTOs;
        var list = []
        for(var i = 0, len = productionCraftPathDTOs.length; i < len; i++) {
          list.push({
            date: productionCraftPathDTOs[i].plan_production_craft_path_id,
            name: productionCraftPathDTOs[i].production_process_name,
            id: productionCraftPathDTOs[i].plan_production_craft_path_id
          })
        }
       
        this.tableData2 = list
      } else if (e.status === 1) {
        //非法参数
      } else if (e.status === 2) {
        //暂无数据
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //查询工单摘要(工单执行)
    async queryWorkOrderOutlineByWorkOrderExecute(mode, id, keyword) {
      // this.materialId = id
      this.loading = true; // 等待
      const e = await this.ajax("queryWorkOrderOutlineByWorkOrderExecute", {
        workOrderProductionMode: mode,
        productionCraftPathId	: id,
        keyword: keyword,
        page: this.page,
        pageSize: this.pageSize
      });
      // console.log('查询工单摘要')
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
       if(this.tableData3 !== []){
          this.tableData3 =[]
        }
      if (e.status === 0) {
        //表示成功
        var map = e.map;
        // console.log(map)
        var workOrderOutlineDTOs = map.workOrderOutlineDTOs;
        var list = []
        for(var i = 0, len = workOrderOutlineDTOs.length; i < len; i++) {
          list.push({
            date: workOrderOutlineDTOs[i].work_order_number,
            name: workOrderOutlineDTOs[i].production_process_name,
            address: workOrderOutlineDTOs[i].work_order_responsible,
            id:workOrderOutlineDTOs[i]. work_order_id
          })
        }
       
        this.tableData3 = list
      } else if (e.status === 1) {
        //非法参数
      } else if (e.status === 2) {
        //暂无数据
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //选择生产批次dialog
    executeItem(index) {
      this.dialogTitle = '选择生产批次';
      this.currdialogNumber = 1;
      this.dialogFormVisible = true;
      this.unitTypeNum = index;
      if(index === 0 || index === 1 || index === 2 || index === 5 || index === 6 || index === 7) {
        this.mode = 'interior'
        this.queryPlanOutlineByWorkOrderExecute(
                          this.mode,
                          this.type,
                          this.status,
                )
      }else {
        this.mode = 'external'
        this.queryPlanOutlineByWorkOrderExecute(
                          this.mode,
                          this.type,
                          this.status,
                )
      }
    },
    //改变生产批次状态
    changeType(val) {
      switch(val) {
        case '1':
          this.status = 'inProduction';
          this.queryPlanOutlineByWorkOrderExecute(
                            this.mode,
                            this.type,
                            this.status,
                  ) 
          break;
        case '2':
          this.status = 'complete';
          this.queryPlanOutlineByWorkOrderExecute(
                            this.mode,
                            this.type,
                            this.status,
                  ) 
          break;
      }
    },
    //选择具体详情
    handleCurrentChange(val) {
      this.currentRow = val;
      this.buttonDisabled = false
      if(this.currentRow) {
        switch(this.currdialogNumber) {
        case 1:
          console.log(this.currentRow)
          // console.log(this.setBath)
          this.setBath(this.currentRow);
          break;
        case 2:
         console.log(this.currentRow)
          // this.setBath(this.currentRow.name);
          this.setProcedure(this.currentRow);
          break;
        case 3:
         console.log(this.currentRow)
          this.setWorkOrder(this.currentRow);
          break;
        default:
          break;
       }
      }
    },
    //上一步
    prevStep() {
       this.currdialogNumber--;
    },
    //下一步 
    nextStep(e) {
      this.currdialogNumber++;
      this.$nextTick(()=>{
            this.buttonDisabled = true ;
      });
      if (this.currdialogNumber === 2) {
        this.dialogTitle = "选择工序";
        // console.log(this.currentRow)
        this.queryProductionCraftPathByWorkOrderExecute(
          this.mode,
          this.currentRow.id
        )
      } else if (this.currdialogNumber === 3) {
        this.dialogTitle = "选择工单";
        // console.log(this.currentRow)
        this.queryWorkOrderOutlineByWorkOrderExecute(
          this.mode,
          this.currentRow.id
          // '3'
        )
      };

    //  e.stopPropagation();
    },
    //二级dialog关闭
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    //完成
    toaddWorkOrder() {
      this.dialogFormVisible = false;
      switch(this.currdialogNumber) {
        case 1:
          this.setProcedure('');
          this.setWorkOrder('');
          break;
        case 2:
          this.setWorkOrder('');
          break;
      };
      this.$router.push(
      {path:'addWorkOrder',query:{
                              id: this.currentRow.id , // '123456'
                              idType:this.currdialogNumber, 
                              num: this.unitTypeNum}}); 
      this.currdialogNumber = 1;
    },
    //  async queryWorkOrderParticulars(productionUnitId, productionUnitType) {
    //   this.loading = true; // 等待
    //   const e = await this.ajax("queryWorkOrderParticulars", {
    //     // type:type,
    //     productionUnitId,
    //     productionUnitType,
    //   });
    //   setTimeout(() => {
    //     this.loading = false; // 等待结束
    //   }, 500);
    //   console.log(e);
    //   if (e.status === 0) {
    //     //表示成功
    //     console.log(e.map);
    //   } else if (e.status === 1) {
    //     //非法参数
    //   } else if (e.status === 2) {
    //     //暂无数据
    //   } else {
    //     this.$message({
    //       message: e.msg,
    //       type: "error"
    //     });
    //   }
    // },
  }
};
</script>

<style lang="scss" scoped>
$executeItemWidth_1:250px;
$executeItemWidth_2:200px;
$executeItemWidth_3:150px;
$executeItemMargin_1:40px;
$executeItemMargin_2:30px;
$executeItemMargin_3:20px;
 #workOrderExecute{ 
    display: flex;
    flex-wrap: wrap;
    // overflow: auto;
    .executeItem{
       width: $executeItemWidth_1;
       height: $executeItemWidth_1;
       margin: $executeItemMargin_1;
       font-size: 24px;
      }
    @media screen and (min-width: 1800px) and (max-width: 2000px) {
     .executeItem{
       width: $executeItemWidth_1;
       height: $executeItemWidth_1;
       margin: $executeItemMargin_1;
       font-size: 24px;
      }
   }
    @media only screen and (min-width: 1200px) and (max-width: 1800px) {
     .executeItem{
       width: $executeItemWidth_2;
       height: $executeItemWidth_2;
       margin: $executeItemMargin_2;
       font-size: 22px;
      }
    }
     @media only screen and (min-width: 800px) and (max-width: 1200px) {
     .executeItem{
       width: $executeItemWidth_3;
       height: $executeItemWidth_3;
       margin: $executeItemMargin_3;
       font-size: 20px;
      }
    }
    .nameList{
      display: flex;
      justify-content: flex-end;
      .nameListItem1{
       margin-right: 20px;
      }
      
  }
}
</style>

