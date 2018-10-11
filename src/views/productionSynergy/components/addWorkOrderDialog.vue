<!-- 工单执行-领料单、补料单、退料单等dialog-->
<template>
  <div id="addWorkOrderDialog">
     <div class="dialogContext"> 
      <div class="contextItem" :class="{'on':index === (addWorkOrderList.length - 1)}" v-for="(item, index) in addWorkOrderList"
           :key="index">
        <span class="itemTitle" :class="{'on':index === (addWorkOrderList.length - 1)}">{{item.title}}</span>
        <span  class="itemValue" v-if="(index < addWorkOrderList.length - 2 && ($route.query.num <= 4 || $route.query.num == 9)) || (index < addWorkOrderList.length - 4 && $route.query.num > 4 && $route.query.num != 9) ">{{item.value}}</span>
        <span   class="itemValue" v-if="index === addWorkOrderList.length - 4 && addWorkOrderList.length >= 7 && $route.query.num > 4 && $route.query.num != 9">
          <el-input v-model="item.value" 
                    placeholder="请填写数量"
                    size="small">
          </el-input>
        </span>
        <span   class="itemValue" v-if="index === addWorkOrderList.length - 3 && addWorkOrderList.length >= 7 && $route.query.num > 4 && $route.query.num != 9">
          
          <el-input v-model="item.value" 
                    placeholder="请选择输出物"
                    readonly
                    class="pointer"
                    size="small"
                    @click.native="selectWarehouse">
             <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </span>
        <span   class="itemValue" v-if="index === addWorkOrderList.length - 2">
          <el-input v-model="item.value" 
                    placeholder="请选择仓库"
                    readonly
                    class="pointer"
                    size="small"
                    @click.native="selectWarehouse">
             <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </span>
        <span  class="itemValue" :class="{'on':index === (addWorkOrderList.length - 1)}" v-if="index === addWorkOrderList.length - 1">
          <el-input type="textarea" 
                    v-model="item.value"
                    placeholder="50字以内"     
                    size="small"
                    maxlength="50"
                    resize="none"
                    class="explainArera">

          </el-input>
        </span> 
      </div>
    </div> 
    <div>

      <el-table ref="multipleTable"
                :data="inventoryData"
                tooltip-effect="dark"
                style="width: 100%"
                max-height="250"
                @selection-change="handleSelectionChange"
                v-loading="loading"
                v-if="$route.query.num == 0 || $route.query.num == 3 || $route.query.num == 4">
        <el-table-column prop="data"
                         label="编号"
                         width="120">
        </el-table-column>
        <el-table-column prop="name"
                         label="名称"
                         width="120">
        </el-table-column>
        <el-table-column prop="type"
                         label="类型">
        </el-table-column>
        <el-table-column prop="materialBath"
                         label="物料批次">
        </el-table-column>
        <el-table-column prop="planNum"
                         label="计划量">
        </el-table-column>
        <el-table-column prop="surplusNum"
                         label="剩余量"
                         v-if="$route.query.num == 0 || $route.query.num == 3">
        </el-table-column>
        <el-table-column prop="surplusNum"
                         label="已发量"
                         v-if="$route.query.num == 4">
        </el-table-column>
        <el-table-column label="实际量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.actualNum" 
                      placeholder=""
                      size="mini"
                      :class="{'on':checkVisible == scope.$index}"
                      @change.native="checkNum(scope.$index,scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
      </el-table>


      <el-table ref="multipleTable"
                :data="inventoryData"
                tooltip-effect="dark"
                style="width: 100%"
                max-height="250"
                @selection-change="handleSelectionChange"
                v-loading="loading"
                v-if="$route.query.num == 1 || $route.query.num == 2 || $route.query.num == 9">
        <el-table-column prop="number"
                         label="编号"
                         width="120">
        </el-table-column>
        <el-table-column prop="name"
                         label="名称"
                         width="120">
        </el-table-column>
        <el-table-column prop="type"
                         label="类型">
        </el-table-column>
        <el-table-column prop="materialBath"
                         label="物料批次">
        </el-table-column>
        <!-- <el-table-column prop="planNum"
                         label="计划量">
        </el-table-column>
        <el-table-column prop="surplusNum"
                         label="剩余量">
        </el-table-column> -->
        <el-table-column label="数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.actualNum" 
                      placeholder=""
                      size="mini"
                      :class="{'on':checkVisible == scope.$index}"
                      @change.native="checkNum(scope.$index, scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
      </el-table>


      <el-table ref="multipleTable"
                :data="semiManufacturesData"
                tooltip-effect="dark"
                style="width: 100%"
                max-height="250"
                @selection-change="handleSelectionChange"
                v-if="$route.query.num == 5 || $route.query.num == 6 || $route.query.num == 7 || $route.query.num == 8">
        <el-table-column label="产出物编号"
                         width="160">
          <template slot-scope="scope">
            <el-input v-model="scope.row.numValue" 
                      placeholder=""
                      :ref="scope.$index"
                      @keydown.native.enter="addInput(scope.row, scope.column, scope.$index)"
                      size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right"
                         label="操作"
                         idth="200"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       class="text-btn-danger"
                       size="small"
                       @click.stop="delectDetails(scope.$index, semiManufacturesData)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" 
                   size="small"
                   @click="newProductOrder"
                   >完 成</el-button>
      </div>
  </div>
</template>
<script>
import {mapState } from "vuex"
export default {
  props:{
    addWorkOrderForm:Array
  },
  data() {
    return {
      inventoryData: [], //清单内容
      multipleSelection: [], //选中的清单内容
      semiManufacturesData: [
          {'numValue':''}
        ], //产出、不良、报废、回厂编号内容
      focusIndex:0,
      selectedIds:[],
      addWorkOrderList: this.addWorkOrderForm,
      loading: false, //加载
      warehouse: null, //仓库信息
      unitType: null, //生产单类型
      executionType: null, //执行类型
      executionDimensionality: null, //执行维度
      checkVisible: -1, //校验实际量
    }
  },
   computed: {
    // 状态管理映射
    ...mapState({
      executeData: state => state.workOrderExecuteData.executeData, //创建工单基本信息
    })
  },
  mounted() {
  },
  methods: {
    //选择仓库
    selectWarehouse() {
      this.$mesWarehouse.show('选择仓库', {
       reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
       multiple: false, // 是否多选
       params: {       // 额外参数
          keyword: ''
        },
        selectedIds: this.selectedIds,  // 选中的id数组
      }).then(res => {
        this.warehouse = res.rows[0]; //仓库信息
        // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
        this.addWorkOrderList[this.addWorkOrderList.length - 2].value = res.rows[0].warehouse_name;
      })
    },
    //查询材料清单(领料)
    async queryMaterialByPickingUnit(id, idType, materialType) {
      this.loading = true;
      const e = await this.ajax("queryMaterialByPickingUnit",{
        id, 
        idType, 
        materialType, 
      });
      setInterval(() => {
        this.loading = false;
      }, 500);
       if(this.inventoryData !== []){
          this.inventoryData =[]
        }
      if (e.status === 0) {
        //表示成功
        console.log('查询材料清单(领料)')
        var MaterialDetailedUnitDtos = e.map.MaterialDetailedUnitDtos;
        var list1 = []
        //  console.log(MaterialDetailedUnitDtos)
        for(var i = 0, len = MaterialDetailedUnitDtos.length; i < len; i++) {
          // console.log(MaterialDetailedUnitDtos[i].material_number)
          list1.push({
            workId: MaterialDetailedUnitDtos[i].material_id,
            number: MaterialDetailedUnitDtos[i].material_number,
            name: MaterialDetailedUnitDtos[i].material_name,
            type: MaterialDetailedUnitDtos[i].material_type,
            materialBath: MaterialDetailedUnitDtos[i].material_batch,
            model:MaterialDetailedUnitDtos[i].material_model, //型号规格
            unit:MaterialDetailedUnitDtos[i].material_unit, //材料单位 = 物料单位 = 半成品单位
            planNum: MaterialDetailedUnitDtos[i].material_plan_amount,
            surplusNum: MaterialDetailedUnitDtos[i].inventory_quantity,
            actualNum: '',
          })
        }
       
        this.inventoryData = list1
      } else if (e.status === 1) {
        //非法参数
      } else if (e.status === 2) {
        //暂无数据
      } else {
        this.$message({
          message: e.msg?e.msg:e.errorMsg,
          type: "error"
        });
      }
    },
    //查询材料清单(补料)
    async queryMaterialByMaterialsSupplementUnit(id, idType, materialType) {
      this.loading = true;
      const e = await this.ajax("queryMaterialByMaterialsSupplementUnit",{
        id, 
        idType, 
        materialType, 
      });
      setInterval(() => {
        this.loading = false;
      }, 500);
      if(this.inventoryData !== []){
          this.inventoryData =[]
        }
      if (e.status === 0) {
        //表示成功
        console.log('查询材料清单(补料)')
        var MaterialDetailedUnitDtos = e.map.MaterialDetailedUnitDtos;
         var list2 = []
        for(var i = 0, len = MaterialDetailedUnitDtos.length; i < len; i++) {
          list2.push({
            workId: MaterialDetailedUnitDtos[i].material_id, //材料id = 物料id = 半成品id
            number: MaterialDetailedUnitDtos[i].material_number, //材料编号
            name: MaterialDetailedUnitDtos[i].material_name, //材料名称 = 物料名称 = 半成品名称
            type: MaterialDetailedUnitDtos[i].material_type, //	材料类型(原材料/半成品)
            materialBath: MaterialDetailedUnitDtos[i].material_batch, //材料批次	
            model:MaterialDetailedUnitDtos[i].material_model, //型号规格
            unit:MaterialDetailedUnitDtos[i].material_unit, //材料单位 = 物料单位 = 半成品单位
            planNum: MaterialDetailedUnitDtos[i].material_plan_amount, //计划数量 ,需求量 ,半成品的排产量 
            surplusNum: MaterialDetailedUnitDtos[i].inventory_quantity, //预计库存量,剩余量 
            actualNum: '', //实际库存量
          })
        }
        
        this.inventoryData = list2
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
    //查询材料清单(退料)
    async queryMaterialByMaterialsReturnedUnit(id, idType, returnedType, materialType) {
      this.loading = true;
      const e = await this.ajax("queryMaterialByMaterialsReturnedUnit",{
        id, 
        idType, 
        returnedType,
        materialType, 
      });
      setInterval(() => {
        this.loading = false;
      }, 500);
       if(this.inventoryData !== []){
          this.inventoryData =[]
        }
      if (e.status === 0) {
        //表示成功
        console.log('查询材料清单(退料)')
        var MaterialDetailedUnitDtos = e.map.MaterialDetailedUnitDtos;
        var list3 = []
        for(var i = 0, len = MaterialDetailedUnitDtos.length; i < len; i++) {
          list3.push({
            workId: MaterialDetailedUnitDtos[i].material_id,
            number: MaterialDetailedUnitDtos[i].material_number,
            name: MaterialDetailedUnitDtos[i].material_name,
            type: MaterialDetailedUnitDtos[i].material_type,
            materialBath: MaterialDetailedUnitDtos[i].material_batch,
            model:MaterialDetailedUnitDtos[i].material_model,
            unit:MaterialDetailedUnitDtos[i].material_unit,
            planNum: MaterialDetailedUnitDtos[i].material_plan_amount,
            surplusNum: MaterialDetailedUnitDtos[i].inventory_quantity,
            actualNum: '',
          })
        }
       
        this.inventoryData = list3
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
    //新建生产产物执行单(半成品-产出、不良、报废、回厂)
    async saveProductionUnit(type, obj) {
      const e = await this.ajax("saveProductionUnit",{
        productionUnitType:type, //必传,生产单类型 
        productMaterialUnitDto: obj  //必传,生产产物单DTO实体
      });
      if (e.status === 0) {
        //表示成功
        console.log('新建生产产物执行单(半成品-产出、不良、报废、回厂)')
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
    //新建生产材料执行单(成品-领、退、补、外发、外发退、外发补)
    async saveMaterialsUnit(type, obj) {
      const e = await this.ajax("saveMaterialsUnit",{
        productionUnitType:type, //必传,生产单类型 
        materialsUnitDto: obj  //必传,生产材料单DTO实体
      });
      if (e.status === 0) {
        //表示成功
        console.log('新建生产材料执行单(成品-领、退、补、外发、外发退、外发补)')
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
    
    //
    // toggleSelection(rows) {
    //   if (rows) {
    //       rows.forEach(row => {
    //         this.$refs.multipleTable.toggleRowSelection(row);
    //       });
    //     } else {
    //       this.$refs.multipleTable.clearSelection();
    //     }
    // },
    //选中的rows
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    //删除tableItem
    delectDetails(index, rows) {
     this.semiManufacturesData.splice(index,1)
    },
    //添加输入信息
    addInput(row, column, index) {
      if(!row.numValue) {
         return
      }
      this.$refs[index].blur()
      this.semiManufacturesData.push({
         'numValue':''
      })
          // this.$refs[index+1].focus()  
    },
    newProductOrder() {
      if(!this.warehouse) {
         this.$message({
          message:'请选择仓库',
          type: "warning"
        });
        return;
      }
       const executionTime = new Date().getTime();
      //  console.log(executionTime);
       if(this.$route.query.num == 5 || this.$route.query.num == 6 || this.$route.query.num == 7 || this.$route.query.num == 8) {
         this.selectUnitType();  //选择生产单类型
         this.selectExecutionType();  //选择执行类型
         this.selectExecutionDimensionality();  //选择执行维度
          //计划执行时间
        
         var materialObj = {
                    "execution_production_product_material_unit_number":this.addWorkOrderList[0].value,
                     "plan_id":this.executeData.bath.id,
                     "plan_batch":this.executeData.bath.name,
                     "workstage_id":this.executeData.procedure.id ? this.executeData.procedure.id : null,
                     "workstage_name":this.executeData.procedure.name ? this.executeData.procedure.name : null,
                     "work_order_id":this.executeData.workOrder.id ? this.executeData.workOrder.id : null,
                     "work_order_number":this.executeData.workOrder.name ? this.executeData.workOrder.id : null,
                     "product_material_id":"334",
                     "product_material_name":"贝斯",
                     "product_material_unit_id":"111222",
                     "product_material_unit_name":"把", //产物单位名称
                     "product_material_amount":"8", //产物数量
                     "warehouse_id":this.warehouse.warehouse_id,
                     "warehouse_name":this.warehouse_name,
                     "execution_time":executionTime,
                     "execution_explain":this.addWorkOrderList[this.addWorkOrderList.length-1].value,
                     "execution_production_materials_unit_creator_id":"123456",
                     "execution_production_materials_unit_creator":"张三",
                    //  "execution_production_materials_unit_executor_id":"123456",
                    //  "execution_production_materials_unit_executor":"dasdsa",
                     "execution_type":this.executionType,
                     "execution_dimensionality":this.executionDimensionality,
                    //  "execution_complete_status":"完成",
                     "materialDetailedDtos":[] ,}
                    for(var i = 0, len = this.semiManufacturesData.length; i < len; i ++) {
                      materialObj.materialDetailedDtos.push(
                        {"number_number":this.semiManufacturesData[i].numValue,}
                       )
                    };
               if(materialObj.materialDetailedDtos == []) {
                           this.$message({
                            message:'物料详情不能为空',
                            type: "warning"
                          });
                          return;
                 }      
           // console.log(materialObj)
          this.saveProductionUnit(
            this.unitType, //生产单类型
             JSON.stringify(materialObj) //生产材料单DTO实体
           ) 
       }else {
         this.selectUnitType();  //选择生产单类型
         this.selectExecutionType();  //选择执行类型
         this.selectExecutionDimensionality();  //选择执行维度
        
         var productObj =  {
                     "execution_production_materials_unit_number":this.addWorkOrderList[0].value,
                     "plan_id":this.executeData.bath.id,
                     "plan_batch":this.executeData.bath.name,
                     "workstage_id":this.executeData.procedure.id,
                     "workstage_name":this.executeData.procedure.id,
                     "work_order_id":this.executeData.workOrder.id,
                     "work_order_number":this.executeData.workOrder.id,
                     "warehouse_id":this.warehouse.warehouse_id,
                     "warehouse_name":this.warehouse_name,
                     "execution_time":executionTime,
                     "execution_explain":this.addWorkOrderList[this.addWorkOrderList.length-1].value,
                     "execution_production_materials_unit_creator_id":"123456",
                     "execution_production_materials_unit_creator":"张三",
                    //  "execution_production_materials_unit_executor_id":"123456",
                    //  "execution_production_materials_unit_executor":"dasdsa",
                     "execution_type":this.executionType,
                     "execution_dimensionality":this.executionDimensionality,
                    //  "execution_complete_status":"完成",
                     "materialDetailedDtos":[] };
                     if(this.$route.query.num == 0 || this.$route.query.num == 3) {
                         for(var i = 0, len = this.multipleSelection.length; i < len; i ++){
                            productObj.materialDetailedDtos.push({
                                 "execution_production_materials_id":this.multipleSelection[i].workId,
                                 "execution_production_materials_number":this.multipleSelection[i].number,
                                 "execution_production_materials_name":this.multipleSelection[i].name,
                                 "execution_production_materials_mode":this.multipleSelection[i].model,
                                 "execution_production_materials_unit":this.multipleSelection[i].unit,
                                 "execution_production_materials_batch":this.multipleSelection[i].materialBath,
                                 "execution_production_materials_plan_amount":this.multipleSelection[i].planNum,
                                 "execution_production_materials_received_quantity":this.multipleSelection[i].number,
                                 "execution_production_materials_get_number":this.multipleSelection[i].actualNum,
                                 "execution_production_materials_return_number":null,
                                 "execution_production_materials_replenish_number":null,
                                //  "supplier_id":this.multipleSelection.number,
                                //  "supplier_name":this.multipleSelection.number,
                                 "execution_production_materials_type":"原材料",
                                //  "quantity_can_be_gotten":null
                           })
                        }
                     }else if(this.$route.query.num == 1 || this.$route.query.num == 4) {
                          for(var i = 0, len = this.multipleSelection.length; i < len; i ++){
                            productObj.materialDetailedDtos.push({
                                 "execution_production_materials_id":this.multipleSelection[i].workId,
                                 "execution_production_materials_number":this.multipleSelection[i].number,
                                 "execution_production_materials_name":this.multipleSelection[i].name,
                                 "execution_production_materials_mode":this.multipleSelection[i].model,
                                 "execution_production_materials_unit":this.multipleSelection[i].unit,
                                 "execution_production_materials_batch":this.multipleSelection[i].materialBath,
                                 "execution_production_materials_plan_amount":this.multipleSelection[i].planNum,
                                 "execution_production_materials_received_quantity":this.multipleSelection[i].number,
                                 "execution_production_materials_get_number":null,
                                 "execution_production_materials_return_number":this.multipleSelection[i].actualNum,
                                 "execution_production_materials_replenish_number":null,
                                //  "supplier_id":this.multipleSelection.number,
                                //  "supplier_name":this.multipleSelection.number,
                                 "execution_production_materials_type":"原材料",
                                //  "quantity_can_be_gotten":null
                           })
                        }
                     }else if(this.$route.query.num == 2 || this.$route.query.num == 9) {
                        for(var i = 0, len = this.multipleSelection.length; i < len; i ++){
                            productObj.materialDetailedDtos.push({
                                 "execution_production_materials_id":this.multipleSelection[i].workId,
                                 "execution_production_materials_number":this.multipleSelection[i].number,
                                 "execution_production_materials_name":this.multipleSelection[i].name,
                                 "execution_production_materials_mode":this.multipleSelection[i].model,
                                 "execution_production_materials_unit":this.multipleSelection[i].unit,
                                 "execution_production_materials_batch":this.multipleSelection[i].materialBath,
                                 "execution_production_materials_plan_amount":this.multipleSelection[i].planNum,
                                 "execution_production_materials_received_quantity":this.multipleSelection[i].number,
                                 "execution_production_materials_get_number":null,
                                 "execution_production_materials_return_number":null,
                                 "execution_production_materials_replenish_number":this.multipleSelection[i].actualNum,
                                //  "supplier_id":this.multipleSelection.number,
                                //  "supplier_name":this.multipleSelection.number,
                                 "execution_production_materials_type":"原材料",
                                //  "quantity_can_be_gotten":null
                           })
                        }
                     }
             if(materialObj.materialDetailedDtos == []) {
                           this.$message({
                            message:'物料详情不能为空',
                            type: "warning"
                          });
                          return;
                 }         
         this.saveMaterialsUnit(
            this.unitType, JSON.stringify(productObj)
         );
        }
       this.$emit('hidePanel');
    },
    //选择生产单类型
    selectUnitType() {
      switch(this.$route.query.num + '') {
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
              this.unitType = 'outsourceUnit';
              break;
            case '4':
              this.unitType = 'outsourceMaterialsSupplementUnit';
              break;
            case '5':
              this.unitType = 'productUnit';
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
              this.unitType = 'returnFactoryMaterialsReturnedUnit';
              break;
            default:
              console.log('选择生产单类型类型错啦');
              break;
         };
    },
    //选择执行类型
    selectExecutionType() {
      switch(this.$route.query.num + '') {
            case '0':
              this.executionType = '领料单';
              break;
            case '1':
              this.executionType = '补料单';
              break;
            case '2':
              this.executionType = '退料单';
              break;
            case '3':
              this.executionType = '外发单';
              break;
            case '4':
              this.executionType = '外发补料单';
              break;
            case '5':
              this.executionType = '产出单';
              break;
            case '6':
              this.executionType = '不良单';
              break;
            case '7':
              this.executionType = '报废单';
              break;
            case '8':
              this.executionType = '回厂单';
              break;
            case '9':
              this.executionType = '回厂退料单';
              break;
            default:
              console.log('选择执行类型错啦');
              break;
      }
    },
    //选择执行维度
    selectExecutionDimensionality() {
      switch(this.$route.query.idType + '') {
            case '1':
              this.executionType = '生产计划';
              break;
            case '2':
              this.executionType = '工序';
              break;
            case '3':
              this.executionType = '工单';
              break;
            default:
              console.log('选择执行维度错啦');
              break;
      }
    },
    checkNum(index, row) {
      console.log('234234')
      if(this.$route.query.num == 0 || this.$route.query.num == 3) {

      
      if( isNaN (row.actualNum) ) {
        this.$message({
          message:'请输入数字',
          type: "warning"
        });
        this.checkVisible = index;
      //  console.log(this.$refs.checkNum) 
      }
      // else if(row.actualNum > row.surplusNum) {
      //    this.checkVisible = index;
      // }
      else {
        this.checkVisible = -1;
      }
       };
      // console.log(index, row)
    },
  }
} 
</script>
<style lang="scss" scoped>
 #addWorkOrderDialog {
  .dialogContext {
     display: flex;
     flex-wrap: wrap;
     border:1px solid #ccc;  
     border-radius: 5px;
     .contextItem {
       display: flex;
       width: 50%;
       height: 40px;
       line-height: 40px;
       .itemTitle {
         flex: 1;
         font-weight: 700;
         padding-left: 30px;
         &.on {
           flex:1;
         }
       }
       .itemValue {
         flex: 1; 
         padding-left: 30px;
         &.on {
           flex: 3;
           margin: -5px 60px 0 0;
         }
       }
     }
     .contextItem.on{
       width: 100%;
       height: 60px;
       line-height: 60px;
     }
  }
  .el-table{
     width: 95% !important;
     border: 1px solid #ccc;
     margin: 20px auto;
     .numInput{
       width: 120px;
       height: 30px;
     }
  }
  .dialog-footer{
    position: absolute;
    right: 20px;
    bottom: 10px;
  }
 }
</style>


