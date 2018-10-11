<!-- 计划外派工dialog -->
<template>
  <div id="createWorkOrder">
    <!-- status-icon  校验结果的反馈图标 -->
    <el-form  :model="form"
              :rules="rules"
              label-width="150px"
              label-position="left"
              ref="form"
              status-icon>
       <el-form-item label="工单号">
          <div>{{form.name}}</div>
       </el-form-item>
       <el-form-item label="工序"
                     prop = "proceduceValue">
          <el-input placeholder="点击选择工序"
                    v-model="form.proceduceValue"
                    size="small"
                    readonly
                    class="pointer checkicon"
                    @click.native="selectProceduce">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="排产量"
                       prop="schedulingValue">
               <el-input 
                         v-model.number="form.schedulingValue"
                         auto-complete="off"
                         placeholder="请输入排产量"
                         size="small"
                         class="checkicon"
                         ></el-input>
         </el-form-item>
         <el-form-item label="计划时间"
                      prop="planTimeValue">
            <el-date-picker
                    v-model="form.planTimeValue"
                    type="datetimerange"
                    start-placeholder="预计开始时间"
                    end-placeholder="预计完成时间"
                    :default-time="['12:00:00', '08:00:00']"
                    class="planTime"
                    size="small">
           </el-date-picker>    
         </el-form-item>  
         <el-form-item label="工单负责人"
                       prop="productMenValue">
            <el-input placeholder="请选择工单负责人"
                    v-model="form.productMenValue"
                    size="small"
                    readonly
                    class="pointer checkicon"
                    @click.native="selectProductMen">
              <i slot="prefix" class="el-input__icon el-icon-search" ></i>
            </el-input>  
         </el-form-item>
         <el-form-item label="关联现有生产批次"
                       :prop="corrleValue===true?'productNumberValue':''">
           <div class="productNum">
             <el-input placeholder="请选择生产批次"
                    v-model="form.productNumberValue"
                    size="small"
                    readonly
                    class="pointer"
                    v-if="corrleValue"
                    @click.native="selectProductNumber">
                <i slot="prefix" class="el-input__icon el-icon-search" ></i>
            </el-input>  
         </div>
         <el-switch
               v-model="corrleValue"
               active-color="#13ce66"
               @change="correlation(corrleValue)"
               >
         </el-switch>
         </el-form-item>
     </el-form>
      <div slot="footer" class="dialog-footer">
          
           <el-button type="primary" @click="submitForm('form')" size="mini">完 成</el-button>
           <el-button type="primary" @click="resetForm('form')" size="mini">重 置</el-button>
      </div>
     <!-- 物料齐套弹窗  -->
    <el-dialog title="物料齐套" 
                       :visible.sync="materielListVisible"
                       width="70%"
                       min-width="400"
                       append-to-body
                       :before-close="handleClose">
          <el-table
                   :data="tableData3"
                   height="500"
                   border
                   row-class-name="editNochange">
          <el-table-column
                          prop="number"
                          label="编号"
                          width="180">
          </el-table-column>
          <el-table-column
                          prop="name"
                          label="名称"
                          width="180">
          </el-table-column>
          <el-table-column
                          prop="modelNumber"
                          label="型号规格">
          </el-table-column>
          <el-table-column
                          prop="dosage"
                          label="用量">
          </el-table-column>
          <el-table-column
                          prop="storageStock"
                          label="现库存量">
          </el-table-column>
          <el-table-column
                          prop="modelNumber"
                          label="计划库存量">
          </el-table-column>
          <el-table-column
                          prop="procurement"
                          label="需采购量">
          </el-table-column>
       </el-table> 
        <div slot="footer" class="dialog-footer">
           <el-button type="primary" @click="back" size="mini">返 回</el-button>
           <el-button type="primary" @click="mayerialcontinue" size="mini">继 续</el-button>
      </div>
    </el-dialog>     
   </div>
</template>

<script>
export default {
   name:"createWorkOrder",
   data() {
     //排产量校验
     var checkScheduling = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('排产量不能为空'));
        }
        console.log(value)
        setTimeout(() => {
          if (isNaN(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if ( !(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value))) {
              callback(new Error('最多2位小数'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      //计划时间校验
      var checkPlanTime = (rule, value, callback) => {
        // console.log(rule)
        // console.log( value)
        // console.log( callback)
        if (!value) {
          return callback(new Error('计划时间不能为空'));
        }else{
          callback();
        }
        // setTimeout(() => {
        //   if (!Number.isInteger(value)) {
        //     callback(new Error('请输入数字值'));
        //   } else {
        //     if (value < 0) {
        //       callback(new Error('请填入正数'));
        //     } else {
        //       callback();
        //     }
        //   }
        // }, 1000);
      };
     return {
       //form内容
       form: {
          name: '', //工单号
          proceduceValue: '', //工序
          schedulingValue: '', //排产量
          planTimeValue: '', //计划时间
          productMenValue: '', //工单负责人
          productNumberValue: '' //现有生产批次
      },
      //表单校验rules
      rules: {
          proceduceValue: [
            { required: true, message: '请选择工序', trigger: 'change' }
          ],
          schedulingValue: [
            { type: 'number', required: true, validator: checkScheduling, trigger: 'blur' },
          ],
          planTimeValue: [
            { required: true, validator:checkPlanTime, trigger: 'blur' }
          ],
          productMenValue: [
            { required: true, message: '请选择工单负责人', trigger: 'change' }
          ],
          productNumberValue: [
            { required: true, message: '请选择生产批次', trigger: 'change' }
          ]
        },
      corrleValue: false,       //是否关联按钮
      selectedIds:[], //全局弹窗预选id数组
      materielListVisible: false, //物料不全状态下dialog状态
      //物料齐套内容
      tableData3: [], //物料齐套列表
      loading: false, //加载状态
      workProduce: null, //工序
      productHead: null, //工单负责人
      productBath: null //生产批次
     }
   },
   mounted() {
     //生成补工单单号
     this.queryWorkOrderOutline()
   },
   methods: {
    //生成补工单单号(未关联生产计划时使用) (不需传参,只需调用)
    async queryWorkOrderOutline() {
    const e = await this.ajax("createSupplementWorkOrderNumber");
      this.form.name = e
      // if (e.status === 0) {
      //   //表示成功
      //   var map = e.map;
      //   console.log(map)
      
      // } else if (e.status === 1) {
      //   //非法参数
      // } else if (e.status === 2) {
      //   //暂无数据
      // } else {
      //   this.$message({
      //     message: e.msg,
      //     type: "error"
      //   });
      // }
    },
   //查询齐套分析(工单),根据工序下的物料信息及排产量计算
   async queryResourceAllocationByWorkOrder(id, number) {
    this.loading = true; // 等待
    const e = await this.ajax("queryResourceAllocationByWorkOrder", {
      processId: id,
      productionNumber: number
    });
    setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
     if(this.tableData3 !== []){
          this.tableData3 =[]
       }
      if (e.status === 0) {
        //表示成功
        var map = e.map;
        // console.log('查询齐套分析(工单),根据工序下的物料信息及排产量计算')
        var ResourceAllocationDtos = map.ResourceAllocationDtos;
        var list = []
        for(var i = 0, len = ResourceAllocationDtos.length; i < len; i++) {
          if(ResourceAllocationDtos[i].needPurchaseQuantity > 0) {
           this.materielListVisible = true;
          }
          list.push({
            number: ResourceAllocationDtos[i].materialNumber,
            name: ResourceAllocationDtos[i].materialName,
            modelNumber: ResourceAllocationDtos[i].materialModel,
            dosage: ResourceAllocationDtos[i].materialASingleDose,
            storageStock: ResourceAllocationDtos[i].materialInventoryQuantity,
            planStorageStock: ResourceAllocationDtos[i].materialInventoryEstimated,
            procurement: ResourceAllocationDtos[i].needPurchaseQuantity
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
   //新建补工单(计划外派工)
   async createSupplementWorkOrder(newWorkOrder) {
    const e = await this.ajax("createSupplementWorkOrder", {
      workOrderDto: newWorkOrder
    });
      if (e.status === 0) {
        //表示成功
         this.$message({
          message: '新建补工单(计划外派工)成功',
          type: "error"
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
   //关联生产批次
   correlation(corrleValue) {

   },
   //校验计划外派工表单
   submitForm(formName) {
    //  console.log(this.form.planTimeValue)
     this.$refs[formName].validate((valid) => {
      //  console.log(valid)
       if (valid) {
          // console.log( this.workProduce.plan_production_craft_path_id)
          // console.log( this.form.schedulingValue)
         this.queryResourceAllocationByWorkOrder(
           this.workProduce.plan_production_craft_path_id, this.form.schedulingValue
          // '57825e86207e41d080e1abd4252d8c81','5'
           );
          //  console.log(this.materielListVisible)
           if(this.materielListVisible == false) {
             this.mayerialcontinue(formName);
            
           }
         
       } else {
          this.$message.error({
          message: '信息填写不全',
          type: 'warning'
          });
         return false;
       }
     });
   },
   //物料齐套返回
   back() {
     this.materielListVisible = false;
   },
   //物料齐套继续
   mayerialcontinue(formName) {
     var newOrder = {
            "work_order_scheduled_state_time": this.form.planTimeValue, //预计开始时间
             "work_order_production_mode": "委外加工", //生产模式
             "work_order_responsible_id": this.productHead.production_process_id, //工单负责人ID
             "work_order_responsible": this.productHead.production_process_name, //工单负责人
             "plan_production_craft_path_id": this.workProduce.plan_production_craft_path_id, //工艺路线ID(工序ID)
             "work_order_number": this.form.name,  //工单编号
             "work_order_output": this.form.schedulingValue,    // 排产量
             "production_process_name": this.workProduce.production_process_name,    //工序名称
             "work_order_scheduled_state_time":this.form.planTimeValue[0].getTime(),       //预计开始时间
             "work_order_scheduled_complete_time": this.form.planTimeValue[1].getTime(),//预计完成时间
             "outsourcing_unit_id": null,//外协单位ID
             "outsourcing_unit": null,//外协单位
             "scheduled_materials_outbound_time": null,//预计物料外放时间
             "scheduled_materials_recovery_time": null,//预计物料回厂时间
             "plan_batch": this.corrleValue ? this.productBath.plan_batch : null //生产批次
             };
      //新建计划外派工
      this.createSupplementWorkOrder(
        JSON.stringify(newOrder)
      );
       this.$refs[formName].resetFields();
      //关闭弹窗
      this.$emit('handle');
   },
   //重置计划外派工表单
   resetForm(formName) {
     this.$refs[formName].resetFields();
   },
   //搜索工序
   selectProceduce() {
     this.$mesProcessBasic.show('选择工序', {
       reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
       multiple: false, // 是否多选
       params: {       // 额外参数
          keyword: ''
        },
        selectedIds: this.selectedIds,  // 选中的id数组
      }).then(res => {
        // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
        // console.log(res)
         this.form.proceduceValue = res.rows[0].production_process_name; //填写工序名称
         this.workProduce = res.rows[0] ; //保存工序信息
      })
   },
   //搜索工单负责人  
   selectProductMen() {
        this.$mesEmployee.show('选择工单负责人', {
       reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
       multiple: false, // 是否多选
       params: {       // 额外参数
          keyword: ''
        },
        selectedIds: this.selectedIds,  // 选中的id数组
      }).then(res => {
        // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
        // console.log(res)
        this.form.productMenValue = res.rows[0].user_employees_name //填写工单负责人名称
        this.productHead  = res.rows[0] //保存工单负责人信息
      });
     
   },
   //搜索关联生产批次
   selectProductNumber() {
      this.$mesPlanOutline.show('选择生产批次', {
       reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
       multiple: false, // 是否多选
       params: {       // 额外参数
          planStatus: 'all',
          staffType: 'all',
          keyword: ''
        },
        selectedIds: this.selectedIds,  // 选中的id数组
      }).then(res => {
        // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
        console.log(res)
        this.form.productNumberValue = res.rows[0].plan_batch //填写生产批次名称
        this.productBath = res.rows[0] //保存生产批次信息
      })
   },
    //关闭二级dialog
   handleClose(done) {
     this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
     },
  }
}
</script>

<style lang="scss" scoped>
  #createWorkOrder {
    .el-dialog__wrapper{
      .el-dialog{
        width: 70%;
     }
    }
    .checkicon{
      width: 160px;
    }
    .planTime{
      width: 370px;
    }
  }
</style>


