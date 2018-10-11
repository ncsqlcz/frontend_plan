<!--工序材料清单-->
<template>
  <div id="materialPut">
   <el-table
    :data="materialPutData"
    style="width: 100%"
    max-height="250"
    row-class-name="editNochange"
    v-loading="loading"
    >
    <el-table-column
      prop="date"
      label="物料编号"
      width="200">
    </el-table-column>
    <el-table-column
      prop="name"
      label="名称"
      width="200">
    </el-table-column>
    <el-table-column
      prop="position"
      label="类型"
      width="200">
    </el-table-column>
    <el-table-column
      label="操作"
      width="200"
      v-if="assemblyEditVisible" >
      <template slot-scope="scope"
      class="operateButton">
        <el-button
          type="text"
          size="small">
          <div class="addOperationRecord" @click="materialPutDialog(scope.row)">+</div>
        </el-button>
      </template>
      </el-table-column>
      </el-table>
        <!--添加物料记录清单-->
        <el-dialog title="添加物料记录" 
                   :visible.sync="materialPutDialogVisible"
                   append-to-body>
          <div class="materialPutDialog">
            <el-table
                     :data="materialPutList"
                     style="width: 100%"
                     row-class-name="editNochange"
                     max-height="450"
                     v-loading="loading">
            <el-table-column
              label="投料时间"
              width="240">
              <template slot-scope="scope">
                <el-date-picker
                    placeholder="选择物料投料时间"
                    v-model="scope.row.epItemPuttime"
                    type="datetime"
                    size="mini">
               </el-date-picker>
              </template>
            </el-table-column>
             <el-table-column 
              label="数量"
              width="250">
              <template slot-scope="scope">
                 <el-input
                  placeholder=""
                  v-model="scope.row.epItemPutnum"
                  size="mini"
                  class="actualValueInput onUnit">
                </el-input>
                <span style="margin-left: 10px">{{ materialsListUnit }}</span>
               </template>
             </el-table-column>
            <el-table-column 
              label="物料批次"
              width="130">
              <template slot-scope="scope">
                <el-input
                  placeholder=""
                  v-model="scope.row.epItemBath"
                  size="mini"
                  class="actualValueInput"
                  clearable>
                </el-input>
               </template>
             </el-table-column>
              <el-table-column 
              label="备注"
              width="250">
              <template slot-scope="scope">
                <el-input
                  placeholder=""
                  v-model="scope.row.epItemRecord"
                  size="mini"
                  class="actualValueInput"
                  clearable>
                </el-input>
               </template>
             </el-table-column>
             <el-table-column
                 label="操作"
                 v-if="assemblyEditVisible">
                 <template slot-scope="scope">
                   <el-button
                     @click.native.prevent="deleteRow(scope.$index, materialPutList)"
                     type="text"
                     size="small">
                     移除
                   </el-button>
                 </template>
            </el-table-column>
            </el-table>
           <el-button type="text" @click="addTableData"><div class="addOR" style="width:30px;
                height: 30px;
                font-size: 30px;
                color: #00e4bd;
                text-align: center;
                line-height: 24px;
                border: 2px solid #00e4bd; 
                border-radius: 3px;">+</div></el-button>
          </div>
        <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogFormVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="completeMaterialPut">完 成</el-button>
       </div>
     </el-dialog>
     
  </div>
</template>

<script>
export default {
  name: 'materialPut',
  props: {
    assemblyEditVisible: Boolean,
  },
  components: {
  },
  data () {
    return {
        materialPutData: [], //工序材料清单
        materialPutDialogVisible: false,
        materialPutList: [], //物料投放列表
        loading: false,
        materialId: '', //物料id
        epItemUnit:null, //物料单位
        materialsListId: null, //物料清单id
        materialsListUnit: null//生产工序材料清单单位
    }
  },
  mounted () {
    // this.queryMaterialPutInRecordByWorkOrder('123456')
  },
  methods: {
    //查询生产工序材料清单
     async queryProductionProcessMaterialMenu(id, type, page, pageSize) {
      this.materialId = id
      this.loading = true; // 等待
      const e = await this.ajax("queryProductionProcessMaterialMenu", {
        workOrderId: id,
        materialType: type,
        page: page,
        pageSize: pageSize
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
       if(this.materialPutData !== []){
          this.materialPutData =[]
        }
      if (e.status === 0) {
        //表示成功
        var map = e.map;
        // console.log(map)
        var productionProcessMaterialListDtos = map.productionProcessMaterialListDtos;
        // console.log(productionProcessMaterialListDtos)
        var list = []
        for(var i = 0, len = productionProcessMaterialListDtos.length; i < len; i++) {
          list.push({
            data: productionProcessMaterialListDtos[i].material_id,
            name: productionProcessMaterialListDtos[i].material_name,
            position: productionProcessMaterialListDtos[i].production_process_materials_type,
            materialsListId: productionProcessMaterialListDtos[i].work_order_production_process_materials_list_id,
            materialsListUnit: productionProcessMaterialListDtos[i].material_unit
          })
        }
       
        this.materialPutData = list
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
    //查询工单的材料投放记录
    async queryMaterialPutInRecordByWorkOrder(id, page, pageSize) {
      this.loading = true; // 等待
      const e = await this.ajax("queryMaterialPutInRecordByWorkOrder", {
        productionProcessMaterialId: id,
        page: page,
        pageSize: pageSize
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
       if(this.materialPutList !== []){
          this.materialPutList =[]
        }
      if (e.status === 0) {
        //表示成功
        var map = e.map;
        // console.log(map)
        var materialsPutInRecordDtos = map.materialsPutInRecordDtos;
        // console.log(materialsPutInRecordDtos)
        var list = []
        for(var i = 0, len = materialsPutInRecordDtos.length; i < len; i++) {
          list.push({
             epItemPuttime:materialsPutInRecordDtos[i].work_order_materials_put_in_time, //投料时间
             epItemPutnum: materialsPutInRecordDtos[i].work_order_materials_put_in_amount, //数量
             epItemPutunit: materialsPutInRecordDtos[i].work_order_materials_put_in_unit, //单位
             epItemBath: materialsPutInRecordDtos[i].work_order_materials_put_in_batch, //物料批次
             epItemRecord: materialsPutInRecordDtos[i].work_order_materials_put_in_remark, //备注
             id:materialsPutInRecordDtos[i].work_order_materials_put_in_employee_id  //投料人id
          }) 
        }
        this.materialPutList = list
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
    //添加工单的材料投放记录
    async saveMaterialPutInRecordByWorkOrder(addOrder) {
      const e = await this.ajax("saveMaterialPutInRecordByWorkOrder", {
        materialsPutInRecordDtos: addOrder,
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: '添加工单的材料投放记录成功',
          type: "success"
        });
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
    //删除工单的材料投放记录
    async removeMaterialPutInRecordByWorkOrder(obj) {
      const e = await this.ajax("removeMaterialPutInRecordByWorkOrder", {
        materialPutInRecordIds: obj,
      });
      if (e.status === 0) {
        //表示成功
       this.$message({
          message: '删除工单的材料投放记录成功',
          type: "success"
        });
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
    //物料投放弹窗
    materialPutDialog(row) {
     this.materialPutDialogVisible = true;
     console.log(row);
     this.materialsListId = row.materialsListId ;
     this.materialsListUnit = row.materialsListUnit
     this.queryMaterialPutInRecordByWorkOrder(this.materialsListId)
      },
    //新增物料信息
    addTableData() {
      // console.log('新增物料信息')
      // var addTableDataList = [];
      //  addTableDataList = { 
      //       epItemPuttime: '',
      //       epItemPutnum: '',
      //       epItemBath: '',
      //       epItemRecord: '',
      //       epItemNew:'1'};
      //   this.materialPutList.concat(addTableDataList);
      this.materialPutList.push(
         { 
            epItemPuttime: '',
            epItemPutnum: '',
            epItemBath: '',
            epItemRecord: '',
            epItemNew:'1'}
      )

      },
    //删除物料信息
    deleteRow(index, rows) {
      if(rows[index].epItemNew !== '1'){
         this.removeMaterialPutInRecordByWorkOrder(
            rows[index].id
         )      
      }
        rows.splice(index, 1);
      },
    completeMaterialPut() {
      this.dialogFormVisible = false
      //过滤出新增数据
      var uplist = this.materialPutList.filter(item=>{
           item.epItemNew === '1'
           return item
      })
      // console.log(uplist)
      var MaterialPutdata = [];
      for(var i = 0, len = uplist.length; i < len; i++) {
        var putTime = new Date(uplist[i].epItemPuttime).getTime();
          MaterialPutdata.push(
            {
              "work_order_production_process_materials_list_id":	this.materialsListId, //
              "work_order_materials_put_in_time": putTime, //投料时间
              "work_order_materials_put_in_amount": uplist[i].epItemPutnum, //数量
              "work_order_materials_put_in_unit":  this.materialsListUnit, //单位
              "work_order_materials_put_in_batch": uplist[i].epItemBath,   //物料批次
              "work_order_materials_put_in_remark": uplist[i].epItemRecord,   //备注   
          }
          )
      };
        this.saveMaterialPutInRecordByWorkOrder(
          JSON.stringify(MaterialPutdata)
       ) 
    }       
  }
}
</script>

<style lang="scss" scoped>
#materialPut {
   .addOperationRecord {
    display: inline-block;
    width: 30px;
    height: 30px;
    font-size: 30px;
    color: #00e4bd;
    text-align: center;
    line-height: 24px;
    border: 2px solid #00e4bd; 
    border-radius: 3px;
    margin: -10px 0;
   }
  //  .editNochange{
  //     padding: 0 0;
  //  }
  //  .operateButton{
  //   
  //  }
    //   .addOR {
    // // display: inline-block;
    // width: 30px;
    // height: 30px;
    // font-size: 30px;
    // color: #00e4bd;
    // text-align: center;
    // line-height: 26px;
    // border: 2px solid #00e4bd; 
    // border-radius: 3px;
    // }
  
    .el-table td{
     padding: 0 0;
   }
 }
 .actualValueInput{
     &.onUnit{
       display:inline-block;
       width:55%;
      //  
      .el-input__inner{
        padding: 0 1px;
      }
     }

   }
</style>
