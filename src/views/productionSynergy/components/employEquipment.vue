/*
 * @Author: liucz 
 * @Date: 2018-08-15 09:19:27 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-09-18 16:06:47
 */
<template>
   <el-row class="employEquipment">
   <el-table
          :data="employEquipmentData"
          style="width: 100%"
          max-height="250"
          row-class-name="editNochange"
          v-loading="loading">
    <el-table-column
      fixed
      prop="data"
      label="编号"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      v-if="employEqlist.curr == 1">
    </el-table-column>
    <el-table-column
      prop="position"
      label="职位"
      v-if="employEqlist.curr == 1">
    </el-table-column>
    <el-table-column
      prop="name"
      label="设备类型"
      v-if="employEqlist.curr == 2">
    </el-table-column>
    <el-table-column
      prop="position"
      label="设备名称"
      v-if="employEqlist.curr == 2">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      v-if="employEqlist.assemblyEditVisible">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="deleteRow(scope.$index, employEquipmentData)"
          type="text"
          size="small">
          移除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button type="text" @click="wholeEmployeedialog" v-show="employEqlist.assemblyEditVisible"><div class="addOperationRecord">+</div></el-button>
  </el-row>
</template>

<script>
export default {
  name: 'employEquipment',
  props:{
        employEqlist: Object
  },
  components: {
  },
   data() {
        return {
        loading: false,
        staffId: '',
        selectedIds:[],
        employEquipmentData: []
       }
      },
  mounted () {
    // console.log(this.employEqlist.id)
    // this.queryStaffRecordByWorkOrder(
    //   this.employEqlist.id
    // )
  },
  methods: {
    //查询工单的员工记录
    async queryStaffRecordByWorkOrder(id, page, pageSize) {
      this.staffId = id
      this.loading = true; // 等待
      const e = await this.ajax("queryStaffRecordByWorkOrder", {
        workOrderId: id,
        page:page,
        pageSize:pageSize
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
       if(this.employEquipmentData !== []){
          this.employEquipmentData =[]
        }
      if (e.status === 0) {
        //表示成功
        var map = e.map;
        // console.log(map)
        var WorkOrderEmployeeRecordDTO = map.WorkOrderEmployeeRecordDTO;
        // console.log(WorkOrderEmployeeRecordDTO)
        var list = []
        for(var i = 0, len = WorkOrderEmployeeRecordDTO.length; i < len; i++) {
          list.push({
            workId: WorkOrderEmployeeRecordDTO[i].work_order_id,
            data: WorkOrderEmployeeRecordDTO[i].employee_number,
            name: WorkOrderEmployeeRecordDTO[i].employee_name,
            position: WorkOrderEmployeeRecordDTO[i].post_name,
            id: WorkOrderEmployeeRecordDTO[i].work_order_employee_record_id
          })
        }
       
        this.employEquipmentData = list
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
    //查询工单绑定的设备
    async queryDevicesRecordByWorkOrder(id) {
      this.loading = true;
      const e = await this.ajax("queryDevicesRecordByWorkOrder",{
        workOrderId: id
      });
      setInterval(() => {
        this.loading = false;
      }, 500);
       if(this.employEquipmentData !== []){
          this.employEquipmentData =[]
        }
      if (e.status === 0) {
        //表示成功
        var map = e.map;
        console.log(map)
        var WorkOrderEmployeeRecordDTO = map.WorkOrderEmployeeRecordDTO;
        // console.log(WorkOrderEmployeeRecordDTO)
        var list = []
        for(var i = 0, len = WorkOrderEmployeeRecordDTO.length; i < len; i++) {
          list.push({
            workId: WorkOrderEmployeeRecordDTO[i].work_order_id,
            data: WorkOrderEmployeeRecordDTO[i].device_number,
            name: WorkOrderEmployeeRecordDTO[i].device_name,
            position: WorkOrderEmployeeRecordDTO[i].device_type_name,
            id: WorkOrderEmployeeRecordDTO[i].work_order_device_record_id
          })
        }
       
        this.employEquipmentData = list
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
    //删除工单的员工记录
    async removeStaffRecordByWorkOrder(id) {
      this.loading = true;
      const e = await this.ajax("removeStaffRecordByWorkOrder",{
        staffRecordIds: id
      });
      setInterval(() => {
        this.loading = false;
      }, 500);
      if (e.status === 0) {
        //表示成功
         this.$message({
          message:'删除工单的员工记录成功',
          type: "success"
        });
      //  console.log('删除工单的员工记录')
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
    //删除工单绑定的设备
    async removeDevicesRecordByWorkOrder(workId, id) {
      this.loading = true;
      const e = await this.ajax("removeDevicesRecordByWorkOrder",{
        workOrderId: workId,
        devicesRecordIds: id
      });
      setInterval(() => {
        this.loading = false;
      }, 500);
      if (e.status === 0) {
        this.$message({
          message:'删除工单绑定的设备成功',
          type: "success"
        });
        //表示成功
        // var map = e.msg;
      //  console.log(map)
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
    //新增工单的员工记录
    async saveStaffRecordByWorkOrder(obj) {
      // console.log(obj)
      this.loading = true;
      const e = await this.ajax("saveStaffRecordByWorkOrder",{
       employeeRecordDtos: obj  
      });
      setInterval(() => {
        this.loading = false;
      }, 500);
      if (e.status === 0) {
        //表示成功
        console.log('新增工单的员工记录 ')
        // var map = e.msg;
      //  console.log(map)
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
    //新增工单绑定的设备
    async saveDevicesRecordByWorkOrder(obj) {
      // this.loading = true;
      const e = await this.ajax("saveDevicesRecordByWorkOrder",{
       deviceRecordDtos: obj  
      });
      // setInterval(() => {
      //   this.loading = false;
      // }, 500);
      if (e.status === 0) {
        //表示成功
        console.log('chenggongla啦啦啦啦 ')
        // var map = e.msg;
      //  console.log(map)
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
    //删除员工记录，设备绑定信息
    deleteRow(index, rows) {
      // console.log( rows[index])
      // console.log( this.employEqlist.curr)
      //员工记录
      if(this.employEqlist.curr == 1) {
        console.log(rows[index].id)
        this.removeStaffRecordByWorkOrder(
          rows[index].id
          // '123456,123'
        )
         rows.splice(index, 1);
      //设备绑定
      }else if(this.employEqlist.curr == 2) {
           this.removeDevicesRecordByWorkOrder(
          rows[index].id
            // '123456','123456,abc'
        )
        rows.splice(index, 1);
      } 
      },
    //新增员工记录，设备绑定弹窗
    wholeEmployeedialog() {
      //员工记录
      if(this.employEqlist.curr == 1) {
         this.$mesEmployee.show('选择员工', {
       reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
       multiple: false, // 是否多选
       params: {       // 额外参数
          keyword: ''
        },
        selectedIds: this.selectedIds,  // 选中的id数组
      }).then(res => {
        // res 结构  无论单选多选，rows都为数组
        // res = {rows: [], action: 'selected'};
        //弹窗选择的员工信息
        var res = res.rows
        // console.log(res)
        var saveStaffRecordObj = [{"employee_id":res[0].user_employees_post_id,
                    "employee_name": res[0].user_employees_name,
                    "post_id":res[0].user_employees_id,
                    "post_name":res[0].user_employees_post,
                    "work_order_id":this.employEqlist.id,
                    'employee_number':res[0].user_employees_number}];
         //页面员工信息添加
         this.employEquipmentData.push({
            workId: this.employEqlist.id,
            data: res[0].user_employees_number,
            name: res[0].user_employees_name,
            position: res[0].user_employees_post,
            id: res[0].user_employees_id
          })
        //新增员工信息传入后台
       var  compleLen = 0;
       console.log(saveStaffRecordObj[0])
       for (const key in saveStaffRecordObj[0]) {
         if (saveStaffRecordObj[0].hasOwnProperty(key)) {
           if(saveStaffRecordObj[0][key]){
              
           }else{
             compleLen++;
           }
         }
       };
       console.log()
       if(compleLen == 0 ) {
         this.saveStaffRecordByWorkOrder(
             JSON.stringify(saveStaffRecordObj)
            );
       }else {
         this.$message({
                message: '数据传输有误',
                type: "error"
                });
       }
      });
      //设备绑定
      }else if(this.employEqlist.curr == 2) {
         this.$mesDevice.show('选择设备', {
       reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
       multiple: false, // 是否多选
       params: {       // 额外参数
          keyword: ''
        },
        selectedIds: this.selectedIds,  // 选中的id数组
      }).then(res => {
        // console.log('12324')
        // res 结构  无论单选多选，rows都为数组
        // res = {rows: [], action: 'selected'};
        //弹窗选择的设备信息
        var res = res.rows
        var obj =  [
           {   "work_order_id":this.employEqlist.id, // 工单id
               "device_id":res[0].device_id,  //设备id
               "device_name":res[0].device_name, //设备名字
               "device_number":res[0].device_number,  //设备编号
               "device_type_name":res[0].device_type, //设备类型
               "device_record_operation_state_time":null ,//操作开始时间(字符串)
               "device_record_operation_end_time": null,//操作结束时间(字符串)
               "device_record_operation_type": null,//操作类型
              //  "device_type_id": , //设备类型id
              //  "device_record_operation_employee_id": , //操作员工id
              //  "device_record_operation_employee_name": , //操作员工姓名
           }];
        //页面设备信息添加
        this.employEquipmentData.push({
                workId: this.employEqlist.id, //工单id
                data: res[0].device_number, //设备编号
                name: res[0].device_name,  //设备名字
                position: res[0].device_type, //设备类型
                id: res[0].device_id //设备id
            })
        //新增设备信息传入后台
          this.saveDevicesRecordByWorkOrder(JSON.stringify(obj))
          //校验设备传入信息
      //   for (const key in obj) {
      //    if (obj.hasOwnProperty(key)) {
      //      if(obj[key]){
              
                  
      //      }else {
      //        this.$message({
      //           message: '数据传输有误',
      //           type: "error"
      //           });
      //      }
      //    };
      //  };
        
      })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .employEquipment {
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
   
 }
 .editNochange {
     height: 57px !important; 
   }
</style>
