/*
 * @Author: liucz 
 * @Date: 2018-08-15 09:19:27 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-09-15 09:47:43
 */
<template>
  <div id="environmentProducts">
    <el-collapse v-model="activeNames" 
                 @change="handleChange"
                 accordion>
      <el-collapse-item v-for="(item, index) in environmentProductsList" :key="index" :title="item.name" name="1">
       <div class="epItem">
   <!-- row-class-name="editNochange" -->
      <el-table
               :data="envirProdData"
               style="width: 100%"
               max-height="250"
              
              
               > 
               <!-- v-loading="loading" -->
       <el-table-column
               label="实际值"
               width="180">
       <template slot-scope="scope">
         <el-input
            placeholder="请选择实际值"
            v-model="scope.row.epItemValue"
            size="mini"
            class="actualValueInput"
            clearable>
          </el-input>
          <!-- {{scope.row.epItemUnit}} -->
        </template>
      </el-table-column>
      <el-table-column
       label="参考值"
       width="180">
       <template slot-scope="scope">
           <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.referenceValue }}32423</el-tag>
           </div>
       </template>
      </el-table-column>
      <el-table-column 
       label="记录时间"
       width="240">
       <template slot-scope="scope">
        <el-date-picker
          v-model="scope.row.epItemTimeValue"
          type="datetime"
          placeholder="选择日期时间"
          size="mini">
        </el-date-picker>
       </template>
     </el-table-column>
     <el-table-column
      fixed="right"
      label="操作"
      v-if="assemblyEditVisible">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="deleteRow(scope.$index, envirProdData)"
          type="text"
          size="small">
          移除
        </el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-button type="text" @click="addTableData" v-if="assemblyEditVisible"><div class="addOperationRecord">+</div></el-button>
  </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>

export default {
  name: 'environmentProducts',
  props:{
        assemblyEditVisible: Boolean
  },
  data () {
    return {
      environmentProductsList: [
        // '容量mah', '电压V'
        ],
      activeNames: ['0'],
      envirProdData: [],
      page: 1,
      pageSize: 10
    }
  },
  mounted () {},
  methods: {
    //查询生产工艺参数列表
     async queryProductionCraftParameters(workOrderId, parameterTypeId) {
      // this.loading = true;
      const e = await this.ajax("queryProductionCraftParameters",{
        workOrderId: workOrderId,
        parameterTypeId: parameterTypeId,
        page: this.page,
        pageSize: this.pageSize
      });
      // setInterval(() => {
      //   this.loading = false;
      // }, 500);
      if (e.status === 0) {
        //表示成功
        var map = e.map;
        var processCraftParameterDtos = map.processCraftParameterDtos;
        var list = [];
         if(this.environmentProductsList !== []){
          this.environmentProductsList = []
        };
        for(var i = 0, len = processCraftParameterDtos.length; i < len; i++) {
          this.environmentProductsList.push({name:processCraftParameterDtos[i].parameter_name,
                                            id:processCraftParameterDtos[i].parameter_id,
                                            craftId: processCraftParameterDtos[i].work_order_production_craft_parameter_id
                                            });
                                            
        }
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
    //查询工单的工艺参数记录
     async queryCraftParameterRecordByWorkOrder(id) {
      this.loading = true;
      const e = await this.ajax("queryCraftParameterRecordByWorkOrder",{
        processCraftParameterId: id,
        page: this.page,
        pageSize: this.pageSize
      });
      setInterval(() => {
        this.loading = false;
      }, 500);
        if(this.envirProdData !== []){
          this.envirProdData = [];
        };
      if (e.status === 0) {
        //表示成功
        var map = e.map;
        // console.log(map)
        var processCraftParameterDtos = map.processCraftParameterDtos;
        var list = [];
        for(var i = 0, len = processCraftParameterDtos.length; i < len; i++) {
          list.push({
            workId: processCraftParameterDtos[i].work_order_id,
            valueType: processCraftParameterDtos[i].parameter_value_type,
            epItemValue: '',
            epItemUnit: processCraftParameterDtos[i].parameter_unit_name,
            referenceValue: processCraftParameterDtos[i].parameter_steady_state_value,
            epItemTimeValue: '',
            // id:work_order_production_craft_parameter_id
          })
        }
        this.envirProdData = list;
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
     //删除工单的工艺参数记录
     async removeCraftParameterRecordByWorkOrder(id) {
      const e = await this.ajax("removeCraftParameterRecordByWorkOrder",{
        parameterRecordIds: id,
      });
      if (e.status === 0) {
       console.log('删除工单的工艺参数记录')
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
     //添加工单的工艺参数记录
     async saveCraftParameterRecordByWorkOrder(id) {
      const e = await this.ajax("saveCraftParameterRecordByWorkOrder",{
        parameterRecordDtos: id,
      });
      if (e.status === 0) {
        //表示成功
       console.log('添加工单的工艺参数记录')
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
     handleChange(val) {
       this.queryCraftParameterRecordByWorkOrder(
         this.environmentProductsList[val - 1].craftId
       )
      },
     handleDelete(index, rows) {
       if(rows[index].epItemNew !== '1'){
         this.removeCraftParameterRecordByWorkOrder(
            rows[index].id
         )      
      }
      rows.splice(index, 1);
     },
     //添加记录
     addTableData() {
      this.envirProdData.push({ 
                          workId: '',
                          valueType: '',
                          epItemValue: '',
                          referenceValue: '',
                          epItemTimeValue: '',
                          epItemNew: '1'
                          });
      },
    completeMaterialPut() {
      //过滤出新增数据
      var uplist = this.envirProdData.filter(item=>{
           item.epItemNew === '1'
      })
      // var arr =  [
      //     // {
      //     //     "work_order_production_process_materials_list_id":	this.materialId,
      //     //     "work_order_materials_put_in_time": uplist.epItemPuttime,
      //     //     "work_order_materials_put_in_amount": uplist.epItemPutnum,
      //     //     "work_order_materials_put_in_unit":  '单位',
      //     //     "work_order_materials_put_in_bat": uplist.epItemNum,
      //     //     "work_order_materials_put_in_remark": uplist.epItemRecord,
      //     //     "work_order_materials_put_in_employee_id": '1213',
      //     //     "work_order_materials_put_in_employee_name": '小明'
      //     // }
      //     // ,
      //     {
      //         "work_order_materials_put_in_amount":1,
      //         "work_order_materials_put_in_batch":"1",
      //         "work_order_materials_put_in_employee":"测试",
      //         "work_order_materials_put_in_employee_name":"测试",
      //         "work_order_materials_put_in_remark":"测试"
      //     }
      //      ]
    //测试数据
    var arr = [
              {
                  "device_id":"123456",
                  "device_name":"测试",
                  "parameter_error_value":1,
                  "parameter_id":"123456",
                  "parameter_least_value":1,
                  "parameter_left_margin":"1.0",
                  "parameter_name":"测试名称",
                  "parameter_peak_value":4.4,
                  "parameter_right_margin":"1.0",
                  "parameter_steady_state_value":1,
                  "parameter_unit_name":"个",
                  "parameter_value_type":"类型",
                  "work_order_id":"123456",
                  "work_order_parameter_record_employee_id":"123456",
                  "work_order_parameter_record_employee_name":"测试",
                  "work_order_parameter_record_hold_time":1535531849323,
                  "work_order_parameter_record_time":1535531849323,
                  "work_order_production_craft_parameter_id":"123456"
              }
              ]
      this.saveCraftParameterRecordByWorkOrder(
         JSON.stringify(arr)
    ) 
    } 
  }
}
</script>

<style lang="scss" scoped>
 #environmentProducts {
   padding: 0 20px;
   .epItem {
    .addOperationRecord {
      width: 30px;
      height: 30px;
      font-size: 30px;
      color: #00e4bd;
      text-align: center;
      line-height: 24px;
      border: 2px solid #00e4bd; 
      border-radius: 3px;
   }
   .actualValueInput {
      width: 120px;
   }
 }
 }
</style>
