<!--生产列表主体-->
<template>
    <div id="addWorkOrderList">
      <div class="myWorkOrderList">
      <el-table :data="informationList"
                :header-cell-style="{'background-color':'#ecf5ff'}"
                style="width: 100%;"
                v-loading="loading"
                @row-click="handleCurrentChange">
          <el-table-column :label="listLableUnitNumber">
              <template slot-scope="scope">
                  <span v-text="scope.row.a"></span>
              </template>
          </el-table-column>
          <el-table-column :label="listLableUnitCreator">
              <template slot-scope="scope">
                  <span v-text="scope.row.b"></span>
              </template>
          </el-table-column>
          <el-table-column label="生产批次">
              <template slot-scope="scope">
                  <span v-text="scope.row.c"></span>
              </template>
          </el-table-column>
          <el-table-column label="创建时间">
              <template slot-scope="scope">
                  <span v-text="scope.row.d"></span>
              </template>
          </el-table-column>
          
          <el-table-column fixed="right"
                           label="操作"
                           width="200"
                           align="center">
              <template slot-scope="scope"
                        >
                  <el-button type="text"
                             size="small"
                             v-if="scope.row.f == '未完成'"
                             @click.native.prevent="editWorkOrder(scope.$index, informationList)">编辑</el-button>
                  <el-button type="text"
                             size="small" 
                             v-if="scope.row.f == '完成'"
                             @click.native.prevent="editWorkOrder(scope.$index, informationList)">编辑</el-button>          
                  <el-button type="text"
                             class="text-btn-danger"
                             size="small"
                             @click.stop="delectDetails(scope.$index, informationList)">删除</el-button>
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

      <el-dialog :title="dialogValue" 
               :visible.sync="dialogVisible"
               >
        <addWorkOrderDialog :addWorkOrderForm="form"></addWorkOrderDialog>
        <div slot="footer" class="dialog-footer">
           <el-button type="primary" 
                      size="small">完 成</el-button>
        </div>
     </el-dialog> 
         
    </div>
</template>
<script>
import addWorkOrderDialog from "@/views/productionSynergy/components/addWorkOrderDialog"
export default {
  name: "addWorkOrderList",
  components:{
      addWorkOrderDialog
  },
  props:['parentData'],
  data() {
    return {
      workOrderTitle: null,
      informationList: [],
      listLableUnitNumber: '', //领料、补料...单号
      listLableUnitCreator: '', //领料人 补料人 退料人...
      dialogDetail: false,
      workDetailList: {},
      dialogVisible: false,
      dialogValue: '',
      form: {},
      loading: false,
      pagination: {
          page: 1,//页数
          pageSize: 10,//每页的条数
          total: 0
        },
      type:null,
      unitType: null,

    };
  },
  mounted() {
    this.productionUnitOutline()
    this.changeTitle(this.$route.query.num)       
    
    //  this.queryProductionUnitOutline (
    //      '123456',
    //      'plan',
    //      'pickingUnit'
    //  )

  },
  methods: {
    //查询生产单摘要： 领料单/补料单/退料单/产出单/不良品单/报废/外发单/外发补料单/回厂单/回厂退料单
    async queryProductionUnitOutline(id, idType, productionUnitType, keyword) {
      this.loading = true; // 等待
      const e = await this.ajax("queryProductionUnitOutline", {
        id,
        idType,
        productionUnitType,
        keyword,
        page: this.pagination.page, //消息状态中的页数
        pageSize: this.pagination.pageSize
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
       if(this.informationList !== []){
          this.informationList =[]
        }
      if (e.status === 0) {
        //表示成功
        var map = e.map;
        //  console.log(map)
        var pickingUnitOutlineDTO = map.pickingUnitOutlineDTO;
        this.pagination.total = map.pickingUnitOutlineLines
        // console.log(pickingUnitOutlineDTO)
        var list = [];
        for(var i = 0, len = pickingUnitOutlineDTO.length; i < len; i++) {
          list.push({
             a: pickingUnitOutlineDTO[i].execution_production_materials_unit_number ? 
                  pickingUnitOutlineDTO[i].execution_production_materials_unit_number:  //生产材料执行单号
                  pickingUnitOutlineDTO[i].execution_production_product_material_unit_number, //生产产物执行单号	
             b: pickingUnitOutlineDTO[i].execution_production_materials_unit_creator ?
                pickingUnitOutlineDTO[i].execution_production_materials_unit_creator://材料创建人
                pickingUnitOutlineDTO[i].execution_production_product_material_unit_creator,  //产物创建人
             c: pickingUnitOutlineDTO[i].plan_batch,  //生产批次
             d: pickingUnitOutlineDTO[i].execution_time, //执行时间
             e: pickingUnitOutlineDTO[i].execution_production_materials_unit_id ?
                pickingUnitOutlineDTO[i].execution_production_materials_unit_id: //生产材料执行单id
                pickingUnitOutlineDTO[i].execution_production_product_material_unit_id, //生产产物执行单id
             f: pickingUnitOutlineDTO[i].execution_complete_status //完成状态 ('完成', '未完成')
                 
          })
        }
       
        this.informationList = list
      
      } else if (e.status === 1) {
        //非法参数
      } else if (e.status === 2) {
          this.pagination.total = 0
          this.informationList = []
        //暂无数据
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    // 删除生产材料执行单
    async removeMaterialsUnit(id) {
      const e = await this.ajax("removeMaterialsUnit", {
        materialsUnitId:id,
      });
      if (e.status === 0) {
        //表示成功
       console.log('删除生产材料执行单')
      } else if (e.status === 1) {
        //非法参数
      } else if (e.status === 2) {
          this.pagination.total = 0
          this.informationList = []
        //暂无数据
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    // 删除生产产物执行单
    async removeProductionUnit(id) {
      const e = await this.ajax("removeProductionUnit", {
        productMaterialUnitId:id,
      });
      if (e.status === 0) {
        //表示成功
       console.log('删除生产产物执行单')
      } else if (e.status === 1) {
        //非法参数
      } else if (e.status === 2) {
          this.pagination.total = 0
          this.informationList = []
        //暂无数据
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    changeTitle(num) {
        switch(num+'') {
        case '0':
          this.listLableUnitNumber = "领料单号";
          this.listLableUnitCreator = '领料人';
          this.dialogValue = "领料";
          this.addWorkOrderTitle = "创建领料单";
          break;
        case '1':
          this.listLableUnitNumber = "补料单号";
          this.listLableUnitCreator = '补料人';
          this.dialogValue = "补料";
          this.addWorkOrderTitle = "创建补料单";
          break;
        case '2':
          this.listLableUnitNumber = "退料单号";
          this.listLableUnitCreator = '退料人';
          this.dialogValue = "退料";
          this.addWorkOrderTitle = "创建退料单";
          break;
        case '3':
          this.listLableUnitNumber = "外发单号";
          this.listLableUnitCreator = '领料人';
          this.dialogValue = "外发";
          this.addWorkOrderTitle = "创建外发单";
          break;
        case '4':
          this.listLableUnitNumber = "外发领料单号";
          this.listLableUnitCreator = '领料人';
          this.dialogValue = "外发补料";
          this.addWorkOrderTitle = "创建外发补料单";
          break;
        case '5':
          this.listLableUnitNumber = "产出单号";
          this.listLableUnitCreator = '记录人';
          this.dialogValue = "产出";
          this.addWorkOrderTitle = "创建产出单";
          break;
        case '6':
          this.listLableUnitNumber = "不良单号";
          this.listLableUnitCreator = '记录人';
          this.dialogValue = "不良";
          this.addWorkOrderTitle = "创建不良单";
          break;
        case '7':
          this.listLableUnitNumber = "报废单号";
          this.listLableUnitCreator = '记录人';
          this.dialogValue = "报废";
          this.addWorkOrderTitle = "创建报废单";
          break;
        case '8':
          this.listLableUnitNumber = "回厂单号";
          this.listLableUnitCreator = '记录人';
          this.dialogValue = "回厂";
          this.addWorkOrderTitle = "创建回厂单";
          break;
        case '9':
          this.listLableUnitNumber = "外发退料单号";
          this.listLableUnitCreator = '退料人';
          this.dialogValue = "外发退料";
          this.addWorkOrderTitle = "创建回厂退料单";
          break;
        default:
          break;
      } 
    },
    //判断类型 执行接口
    productionUnitOutline() {
      // var type = null, unitType = null;
      switch(this.parentData.idType+'') {
         case '1':
           this.type = 'plan';
           break;
        case '2':
           this.type = 'productionCraftpath';
           break;
        case '3':
           this.type = 'workOrder';
           break;
        default:
           break;
      };
      switch(this.parentData.num+'') {
        case '0':
           this.unitType = 'pickingUnit';
           break;
        case '1':
           this.unitType = 'materialsSupplementUnit';
           break;
        case '2':
           this.unitType = 'materialsReturnedUnit';
           break;
        case '3':
           this.unitType = 'outsourceMaterialsSupplementUnit';
           break;
        case '4':
           this.unitType = 'utsourceUnit';
           break;
        case '5':
           this.unitType = 'oproductUnit';
           break;
        case '6':
           this.unitType = 'rejectsUnit';
           break;
        case '7':
           this.unitType = 'scrapUnit';
           break;
        case '8':
           this.unitType = 'returnFactoryUnit';
           break;
        case '9':
           this.unitType = 'returnFactoryMaterials';
           break;
        default:
           break;
      };
      this.queryProductionUnitOutline(
        this.parentData.planId,
        this.type,
        this.unitType
      )
    },
    // 页码改变
      handlePageChange (val) {
        this.pagination.page = val
        this.queryProductionUnitOutline(
          this.parentData.planId,
          this.type,
          this.unitType
      )
      },
      // 每页数量改变
      handleSizeChange (val) {
        this.pagination.pageSize = val
        this.queryProductionUnitOutline(
          this.parentData.planId,
          this.type,
          this.unitType
      )
      },
   //编辑工单列表项
   editWorkOrder(index, rows) {
    // console.log('编辑工单列表项');
    // console.log(index, rows);
    // this.dialogVisible = true;

    this.$emit('edit');
   },
   //删除工单列表项
    delectDetails(index, rows) {
      // console.log(rews)
     this.informationList.splice(index,1);
     if(this.parentData.num == 5 || this.parentData.num == 6 || this.parentData.num == 7 || this.parentData.num == 8) {
        this.removeProductionUnit(rows[index].e);
     }else{
        this.removeMaterialsUnit(rows[index].e);
     }


    },
    selectItem(row, event, column) {
     
     console.log(row, event)
    },
    //创建领料工单
    handleCurrentChange(val,event) {
      this.currentRow = val;
      
      // event.stopPropagation() 
      // console.log(val, event)
      this.dialogVisible = true;
      switch(this.$route.query.idType + '') {
        case '1':
          this.form = [
             {'title':'领料单号', 'value': '1'},
             {'title':'生产批次', 'value': '2'},
             {'title':'领料人', 'value': '空白'},
             {'title':'仓库', 'value': ''},
             {'title':'领料说明', 'value': ''}
             ];
          break;
        case '2':
          this.form = [
             {'title':'领料单号', 'value': '1'},
             {'title':'生产批次', 'value': '2'},
             {'title':'工序', 'value': '3'},
             {'title':'领料人', 'value': '空白'},
             {'title':'仓库', 'value': ''},
             {'title':'领料说明', 'value': ''}
             ];
          break;
        case '3':
          this.form = [
             {'title':'领料单号', 'value': '1'},
             {'title':'生产批次', 'value': '2'},
             {'title':'工序', 'value': '3'},
             {'title':'工单', 'value': '4'},
             {'title':'领料人', 'value': '空白'},
             {'title':'仓库', 'value': ''},
             {'title':'领料说明', 'value': ''}
             ];
          break;
        default:
          console.log('创建领料工单错误');
          break;
      };
      
    },
  
   
  }
};
</script>

<style lang='scss'>
 
</style>
