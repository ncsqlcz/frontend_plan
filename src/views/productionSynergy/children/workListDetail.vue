<!--批次详细-->
<template>
    <div class="batchDetail">
      <div v-if="this.workListDetailData.workType === '0'">
        <el-button type="primary" size="small" class="completeButton" icon="el-icon-edit" v-if="editVisible" @click="editWorkOrder"></el-button>
        <el-button type="primary" size="small" class="completeButton" v-else @click="completeEdit">完成</el-button>
      </div>  
        <el-button type="primary" size="small" class="copyButton" @click="copyList">复制工单</el-button>
        <!-- 工单详情 -->
        <div class="conTxt">
            <el-table 
            :data="workDetailList.a"
            style="width: 100%"
            size="mini"
            v-loading="loading"
            >
            <el-table-column
              prop="name"
              width="280">
            </el-table-column>
            <el-table-column
              prop="address"
              >
            </el-table-column>
            </el-table>
        </div>
       
        <div class="conList">
            <el-collapse v-model="activeNames2"
                         @change="handleChange"
                         accordion>
                <el-collapse-item :title="item"
                                  :name="index+1"
                                  v-for="(item, index) in workDetailList.b"
                                  :key="index">
                    <!-- 员工记录 设备绑定模块 -->
                   <employEquipment ref="employ"
                                    v-if="(index === 0 || index === 1) && workDetailList.b.length > 1" 
                                    :employEqlist="employEqlist"></employEquipment>
                    <!-- 物料投放记录 -->
                   <materialPut ref="material"
                                v-if="index === 2" 
                                :assemblyEditVisible="assemblyEditVisible"></materialPut>
                    <!-- 环境参数 半成品参数 -->
                   <environmentProducts ref="environmentProd"
                                        v-if="index === 3 || index === 4" 
                                        :assemblyEditVisible="assemblyEditVisible"></environmentProducts>
                   <div v-if="index === 5 || workDetailList.b.length === 1" 
                        style="max-height: 300px; overflow: auto">
                        <!-- 执行过程 -->
                     <el-steps direction="vertical" 
                               :active="operatingSteps.length"
                               space="80px"
                               v-loading="implementationLoading">
                       <el-step :title="'操作' + (index + 1)" 
                                :description="item.name + '在'+item.time +' ' + item.value " 
                                v-for="(item, index) in operatingSteps" 
                                :key="index"></el-step>
                     </el-steps>
                   </div>  
                </el-collapse-item>
            </el-collapse> 
        </div>
        <div class="footButton">
        <div  class="buttonOne"> 
           <!-- <el-button  :type="{'primary':index == 0}"
                      v-for="(item, index) in planList" 
                      :key="index" 
                      @click="planDialogVisible = true"  
                      :disabled='buttonState !== 0'>{{item}}</el-button> -->
           <el-button type="primary" @click="beginPlan"  
                                    :disabled="productPlanContent.currProductState !== '2' && 
                                               productPlanContent.currProductState !== '3'">开始计划</el-button>
           <el-button type="success" @click="finishPlan"   
                                    :disabled="productPlanContent.currProductState !== '1' &&
                                               productPlanContent.currProductState !== '7'">完成计划</el-button>
           <el-button type="warning" @click="pausePlan"   
                                    :disabled="productPlanContent.currProductState !== '1' &&
                                               productPlanContent.currProductState !== '5' &&
                                               productPlanContent.currProductState !== '6' &&
                                               productPlanContent.currProductState !== '7' ">暂停计划</el-button>
           <!-- <el-button type="primary" @click="planDialogVisible = true"  :disabled='buttonState !== 0'>开始计划</el-button>
           <el-button type="success" @click="planDialogVisible = true"   :disabled='buttonState !== 1'>完成计划</el-button>
           <el-button type="warning" @click="planDialogVisible = true"   :disabled='buttonState !== 2'>暂停计划</el-button> -->
           <!-- <el-dialog
             :title="planTitle"
             :visible.sync="planDialogVisible"
             width="30%"
             append-to-body
             >
             <span v-if="textareaState === 1">
               <el-input type="textarea" v-model="form.desc" maxlength="50" placeholder="原因(50字)"></el-input>
             </span>
             <span slot="footer" class="dialog-footer">
               <el-button @click="planDialogVisible = false">取 消</el-button>
               <el-button type="primary" @click="confirmPlan">确 定</el-button>
             </span>
           </el-dialog> -->
      </div>
      <div v-if="workListDetailData.workType === '1' || 
                                               productPlanContent.currProductState === '5'" class="buttonTwo">
          <el-button type="primary" @click="puttingOut"
                                    :disabled="productPlanContent.currProductState !== '5'">外发</el-button>
          <el-button type="primary" @click="returnFactory"
                                    :disabled="productPlanContent.currProductState !== '6'">回厂</el-button>
      </div>
      </div>
     </div>
</template>
<script>
// import {utils} from '@'
import employEquipment from '@/views/productionSynergy/components/employEquipment'
import environmentProducts from '@/views/productionSynergy/components/environmentProducts'
import materialPut from '@/views/productionSynergy/components/materialPut'
export default {
  name: "workListDetail",
  props: ['workListDetailData'],
  components: {
       employEquipment,
       environmentProducts,
       materialPut,
      },
  data() {
    return {
       operatingSteps: [],
       // activeNames1: ["0"],
       activeNames2: ["0"],
       tableData: [],
      //  editButton: true,
       planList: ['开始计划', '完成计划', '暂停计划'],
       productPlanContent: {
         'currProductState': '',
        //  'currProductTime':2
         },
       form: {
          desc: ''
        },
       planTitle: null,
       planDialogVisible: false,
       completeDialogVisible: false,
       textareaState: null,
       buttonState: null,
       //编辑按钮状态
       editVisible: true,
       //组件是否可编辑
       assemblyEditVisible: false,
       employEqlist:{
         assemblyEditVisible: false,
         id: '',
         curr: '',
       },
      loading: false, //加载
      implementationLoading: false, //执行过程加载
      workDetailList: [],
      workTime:{
        workOrderStateTime: '', //开始时间
        workOrderCompleteTime: '' //完成时间
      },
    };
  },
  created() {
     this.tableData = [] 
     this.batchDetailList = []
  },
  mounted() {
    // console.log(this.productPlanContent.currProductState)
    // console.log(this.productPlanContent)
  },
  methods: {
    /* api */
    //查询工单详情
    async queryWorkOrderParticulars(id) {
      
      this.loading = true; // 等待
      this.workDetailList = {};
      const e = await this.ajax("queryWorkOrderParticulars", {
        workOrderId: id,
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        // console.log(e.map.workOrderParticularsDTO)
        var workOrderParticularsDTO = e.map.workOrderParticularsDTO;
        this.workTime.workOrderStateTime = workOrderParticularsDTO.work_order_scheduled_state_time;
        this.workTime.workOrderCompleteTime = workOrderParticularsDTO.work_order_scheduled_complete_time;
        // var startTime = this.timestampToDate(new Date(workOrderParticularsDTO.work_order_scheduled_state_time)).a;
        // var completeTime = this.timestampToDate(new Date(workOrderParticularsDTO.work_order_scheduled_complete_time)).a;
        this.productPlanContent.currProductState = workOrderParticularsDTO.plan_production_status //开始 完成 暂停 操作状态
        var productionStatus = '';
        switch(workOrderParticularsDTO.plan_production_status+ '') {
          case '0':
             productionStatus = '已完成'
             break;
          case '1':
             productionStatus = '生产中'
             break;
          case '2':
             productionStatus = '暂停'
             break;
          case '3':
             productionStatus = '未生产'
             break;
          case '4':
             productionStatus = '关闭'
             break;
          case '5':
             productionStatus = '未发出'
             break;
          case '6':
             productionStatus = '已发出'
             break;
          case '7':
             productionStatus = '已回厂'
             break;
          default:
          console.log('状态码错误')
             break;
        };
        if(this.workListDetailData.workType === '0') {
           this.workDetailList = {
            "a" : [{
          name: '订单编号：',
          address: workOrderParticularsDTO.plan_order_number
        }, {
          name: '工单号：',
          address: workOrderParticularsDTO.work_order_number
        }, {
          name: '生产批次：',
          address: workOrderParticularsDTO.plan_batch
        }, {
          name: '工序：',
          address: workOrderParticularsDTO.production_process_name
        }, {
          name: '生产状态：',
          address: productionStatus
        }, {
          name: '排产量：',
          address: workOrderParticularsDTO.work_order_output
        }, {
          name: '计划时间：',
          address: workOrderParticularsDTO.work_order_scheduled_state_time + ' - ' + workOrderParticularsDTO.work_order_scheduled_complete_time
        }, 
        {
          name: '实际时间',
          address: workOrderParticularsDTO.work_order_actual_state_time + ' - ' + workOrderParticularsDTO.work_order_actual_complete_time
        },{
          name: '计划创建人：',
          address: workOrderParticularsDTO.plan_responsible
        }, {
          name: '工单负责人：',
          address: workOrderParticularsDTO.work_order_responsible	
        }],
        "b":['员工记录', '设备绑定', '物料投放记录', '环境参数', '半成品参数', '执行过程']
         }
        }else if(this.workListDetailData.workType === '1') {
          this.workDetailList = {
            "a" : [{
          name: '订单编号：',
          address: workOrderParticularsDTO.plan_order_number
        }, {
          name: '工单号：',
          address: workOrderParticularsDTO.work_order_number
        }, {
          name: '生产批次：',
          address: workOrderParticularsDTO.plan_batch
        }, {
          name: '工序：',
          address: workOrderParticularsDTO.production_process_name
        }, {
          name: '生产状态：',
          address: productionStatus
        }, {
          name: '排产量：',
          address: workOrderParticularsDTO.work_order_output
        }, {
          name: '计划物料外发时间：',
          address: workOrderParticularsDTO.scheduled_materials_outbound_time
        }, {
          name: '计划回厂时间：',
          address: workOrderParticularsDTO. scheduled_materials_recovery_time	
        },  {
          name: '计划时间：',
          address: workOrderParticularsDTO.work_order_scheduled_state_time + ' - ' + workOrderParticularsDTO.work_order_scheduled_complete_time
        }, 
        {
          name: '实际时间',
          address: workOrderParticularsDTO.work_order_actual_state_time + ' - ' + workOrderParticularsDTO.work_order_actual_complete_time
        },{
          name: '计划负责人：',
          address: workOrderParticularsDTO.plan_responsible
        }, {
          name: '工单负责人：',
          address: workOrderParticularsDTO.work_order_responsible
        }],
        "b":['执行过程']
         }
        }
      this.employEqlist.id = workOrderParticularsDTO.work_order_id
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
   //根据外键(生产计划id/工单id)查询生产过程记录
   async queryProcessRecords(condition, type, id, page, pageSize) {
      this.implementationLoading = true; // 等待
      const e = await this.ajax("queryProcessRecords", {
        screenCondition: condition,
        foreignKeyType: type,
        foreignKeyId: id,
        page: page,
        pageSize: pageSize
      });
      setTimeout(() => {
        this.implementationLoading = false; // 等待结束
      }, 500);
       if(this.operatingSteps !== []) {
          this.operatingSteps = []
        }
      if (e.status === 0) {
        //表示成功
        var map = e.map;
        // console.log(map)
        var processRecordDTOs = map.processRecordDTOs;
        // console.log(processRecordDTOs);
        var list = [];
        for(var i = 0, len = processRecordDTOs.length; i < len; i++) {
          var date = this.timestampToDate(processRecordDTOs[i].process_record_operation_time).a
          list.push({
            'name': processRecordDTOs[i].process_record_operation_user,
            'time': date,
            'operation': processRecordDTOs[i].process_record_execute_operation,
            'value':processRecordDTOs[i].process_record_operation_explain
          })
        }
       
        this.operatingSteps = list
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
   //时间戳转 年-月-日 时:分
   timestampToDate (time) {
    let date = new Date(time);
    let Y = date.getFullYear(),
      M = date.getMonth() + 1,
      D = date.getDate(),
      h = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();
    M = (M < 10 ? `0${M}` : M);
    h = (h < 10 ? `0${h}` : h);
    m = (m < 10 ? `0${m}` : m);
    return {'a':`${Y}-${M}-${D} ${h}:${m}`,
    'b':`${Y}/${M}/${D}`}
  },
    //复制工单
    copyList() {
      // this.$confirm(
      //   "是否开始计划?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "info",
      //   center: true
      // }
      // )
      //   .then(() => {
      //     this.$message({
      //       type: "success",
      //       message: "成功!"
      //     });
      //   })
      //   .catch(() => {});
    
    },
    //编辑工单
    editWorkOrder() {
      this.editVisible = false
      this.assemblyEditVisible = true
      this.employEqlist.assemblyEditVisible = true
    },
    //完成编辑
    completeEdit() {
      this.editVisible = true
      this.assemblyEditVisible = false
    },
    //折叠面板选择
    handleChange(val) {
      if(this.workDetailList.b.length > 1) {
      switch(val) {
        case 1:
         //员工记录
         this.employEqlist.curr = 1
         this.$refs.employ[0].queryStaffRecordByWorkOrder(
             this.workListDetailData.workId  //工单id
         )
          break;
        case 2:
        //设备绑定
         this.employEqlist.curr = 2
         this.$refs.employ[1].queryDevicesRecordByWorkOrder(
            this.workListDetailData.workId
        ) 
          break;
        case 3:
        //物料投放记录
        // console.log(this.$refs.material)
         this.$refs.material[0].queryProductionProcessMaterialMenu(
            this.workListDetailData.workId, //工单id
            // 'semifinishedProduct',
            // '123456',
            'all'
        ) 
          break;
        case 4:
        //环境参数
        this.$refs.environmentProd[0].queryProductionCraftParameters(
             this.workListDetailData.workId,  //工单id
             //环境参数类型id
            //  '123456',
            '123456'
         )
          break;
        case 5:
        //半成品参数
        this.$refs.environmentProd[1].queryProductionCraftParameters(
             this.workListDetailData.workId,  //工单id
             //半成品参数类型id
            //  '123456','123456'
         )
          break;
        case 6:
        //执行过程
          this.queryProcessRecords('all', 'workOrder', 
          this.workListDetailData.workId)
          break; 
       }
      }else if(this.workDetailList.b.length = 1) {
        // console.log(val)
          switch(val) {
              case 1:
                this.queryProcessRecords('all', 'workOrder', this.workListDetailData.workId)
                break;
              default:
                console.log('cuola');
                break;
       } 
      }
    },
    //生产执行
    async workOrderExecute(type, cause) {
      const e = await this.ajax("workOrderExecute", {
        workOrderId: this.workListDetailData.workId, //生产id 
        type: type, //类型
        explain: cause ,//执行说明
        userId: "" //操作人
      });
      if (e.status === 0) {
        //成功
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //开始计划
    beginPlan() {
      let nowTime = new Date().getTime(),
          tagSTime = new Date(this.workTime.workOrderStateTime).getTime(),
          tagETime = new Date(
          this.workTime.workOrderCompleteTime
        ).getTime();
      if (tagSTime > nowTime) {
        //未到开始时间
        this.$prompt("请输入原因", "还未到计划开始时间", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^\S{1,50}$/,
          inputErrorMessage: "50个字符内"
        })
          .then(({ value }) => {
            this.workOrderExecute("advanceStart", value); //开始计划
            this.$message({
            type: "success",
            message: "开始计划成功"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          });
      } else if (tagETime < nowTime) {
        //已超过计划完成时间
        this.$prompt("请输入原因", "已超过计划完成时间", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^\S{1,50}$/,
          inputErrorMessage: "50个字符内"
        })
          .then(({ value }) => {
            this.workOrderExecute("delayStart", value); //开始计划
            this.$message({
            type: "success",
            message: "开始计划成功"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          });
      } else {
        this.$confirm("是否开始计划?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
          center: true
        })
          .then(() => {
            this.workOrderExecute("start", ""); //开始计划
            this.$message({
            type: "success",
            message: "开始计划成功"
            });
          })
          .catch(() => {});
      }
    },
    //完成计划
    finishPlan() {
      let nowTime = new Date().getTime(),
        tagETime = new Date(
          this.workTime.workOrderCompleteTime
        ).getTime();
      if (tagETime < nowTime) {
        //已超过计划完成时间
        this.$prompt("请输入原因", "已超过计划完成时间", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^\S{1,50}$/,
          inputErrorMessage: "50个字符内"
        })
          .then(({ value }) => {
            this.workOrderExecute("delayFinish", value); //完成计划
            this.$message({
            type: "success",
            message: "完成计划成功"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          });
      } else {
        this.$confirm("是否开始计划?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
          center: true
        })
          .then(() => {
            this.workOrderExecute("finish", ""); //完成计划
            this.$message({
            type: "success",
            message: "完成计划成功"
          });
          })
          .catch(() => {});
      }
    },
    //暂停计划
    pausePlan() {
      this.$prompt("请输入原因", "确认暂停", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^\S{1,50}$/,
        inputErrorMessage: "50个字符内"
      })
        .then(({ value }) => {
          this.workOrderExecute("pause", value); //暂停计划
           this.$message({
            type: "success",
            message: "暂停计划成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //外发
    puttingOut() {
       this.$prompt("请输入原因", "确认外发", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^\S{1,50}$/,
        inputErrorMessage: "50个字符内"
      })
        .then(({ value }) => {
          this.workOrderExecute("external", value); //外发
          this.$message({
            type: "success",
            message: "外发成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //回厂
    returnFactory() {
      this.$prompt("请输入原因", "确认回厂", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^\S{1,50}$/,
        inputErrorMessage: "50个字符内"
      })
        .then(({ value }) => {
          this.workOrderExecute("returnFactory", value); //回厂
          this.$message({
            type: "success",
            message: "回厂成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    // //button状态调整
    // confirmPlan() {
    //   if(this.form.desc === '') {
    //     return
    //   }
    //   if(this.buttonState === 0) {
    //       this.buttonState = 1
    //   }else if(this.buttonState === 1 ) {
    //       this.buttonState = 2
    //   }else if(this.buttonState === 2 ) {
    //       this.buttonState = 0
    //   }
    //    this.operatingSteps.push({'value': this.form.desc})
    //   this.planDialogVisible = false
    //   this.form.desc = ''
    // },
    
  }
};
</script>
<style lang="scss" scoped>
.batchDetail {
  .conTxt {
      margin-top: -34px;
      margin-bottom: 20px;
  }
  .footButton{
    display: flex;
    .buttonOne{
      flex: 2;
    }
    .buttonTwo{
      flex: 1;
    }
  }
}
</style>

