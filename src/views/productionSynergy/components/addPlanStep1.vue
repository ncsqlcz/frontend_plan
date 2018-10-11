<!--基础信息-->
<template>
  <div id="addBasicInf">
    <el-row>
      <el-form :model="addForm"
               ref="addForm"
               :rules="rules"
               label-width="130px">
        <div class="assets-wrap">
          <ul>
            <li class="liWidth">
              <el-form-item label="订单编号"
                            prop="number">
                <el-input placeholder="50个字符"
                          size="small"
                          auto-complete="off"
                          v-model="addForm.number"
                          @blur="getBatch"></el-input>
              </el-form-item>
            </li>
            <li class="liWidth">
              <el-form-item label="生产批次"
                            prop="batch">
                <el-input size="small"
                          disabled
                          v-model="addForm.batch"></el-input>
              </el-form-item>
            </li>
            <li class="liWidth">
              <el-form-item label="客户"
                            prop="customer">
                            <el-input v-model="addForm.customer"
                          placeholder="请选择客户"
                          size="small"
                          class="pointer"
                          readonly
                          @click.native="selectCustomer"></el-input>
              
              </el-form-item>
            </li>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="生产路径"
                                prop="path">
                    <el-input placeholder="生产路径"
                              size="small"
                              v-model="addForm.path"></el-input>
                  </el-form-item>
                </li>
                <li class="fl liWidth">
                  <el-form-item label="路径版本"
                                prop="version">
                    <el-input placeholder="需求量"
                              size="small"
                              auto-complete="off"
                              v-model="addForm.version"></el-input>
                  </el-form-item>
                </li>
                <li class="fl liWidth">
                  <el-form-item label="产品名称"
                                prop="modelName">
                    <el-input size="small"
                              disabled
                              auto-complete="off"
                              v-model="addForm.modelName"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="生产方式"
                                prop="resource">
                    <el-radio-group v-model="addForm.production_mode">
                      <el-radio label="量产"></el-radio>
                      <el-radio label="试样"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </li>
                <li class="fl liWidth">
                  <el-form-item label="产品优率"
                                prop="rate">
                    <el-input placeholder="产品优率"
                              size="small"
                              disabled
                              auto-complete="off"
                              v-model="addForm.rate"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="需求量"
                                prop="demanded">
                    <el-input placeholder="需求量"
                              size="small"
                              auto-complete="off"
                              v-model="addForm.demanded"></el-input>
                  </el-form-item>
                </li>
                <li class="fl liWidth">
                  <el-form-item label="排产量"
                                prop="output">
                    <el-input placeholder="排产量"
                              size="small"
                              auto-complete="off"
                              v-model="addForm.output"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <li class="liWidth">
              <el-form-item label="生产优先级"
                            prop="priority">
                <el-select v-model="addForm.priority"
                           placeholder="选择生产优先级"
                           size="small"
                           class="select1">
                  <el-option v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </li>
            <li class="liWidth">
              <el-form-item label="计划负责人"
                            prop="principal">
                <el-input v-model="addForm.principal"
                          placeholder="请选择计划负责人"
                          size="small"
                          class="pointer"
                          readonly
                          @click.native="selectProceduce"></el-input>
              </el-form-item>
            </li>
          </ul>
        </div>
      </el-form>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "add-plan-step1",
  components: {},
  data() {
    return {
      addForm: {
        number: "", //订单编号
        batch: "", //生产批次
        customer: "", //客户
        path: "", //路径
        modelName: "", //产品名称
        version: "", //版本
        production_mode: "量产", //生产方式
        rate: "", //产品优率
        demanded: "", //需求量
        output: "", //排产量
        priority: "正常", //生产优先级
        principal: "" //负责人
      },
      //表单数据过滤
      rules: {
        number: [
          { required: true, message: "请输入订单编号", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 5 个字符", trigger: "blur" }
        ],
        customer: [
          { required: true, message: "请选择生产路径", trigger: "change" }
        ],
        version: [
          { required: true, message: "请选择路径版本", trigger: "change" }
        ],
        production_mode: [
          { required: true, message: "请选择生产方式", trigger: "change" }
        ],
        demanded: [
          { required: true, message: "请输入需求量", trigger: "blur" }
        ],
        output: [{ required: true, message: "请输入排产量", trigger: "blur" }],
        priority: [
          { required: true, message: "请选择生产优先级", trigger: "change" }
        ],
        principal: [
          { required: true, message: "请选择计划负责人", trigger: "change" }
        ]
      },
      options: [
        {
          value: "正常",
          label: "正常"
        },
        {
          value: "紧急",
          label: "紧急"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    getBatch() {
      if (this.addForm.number != "") {
        this.createPlanBatchNumber();
      }
    },
    //生成生产计划批号(订单编号+时间(年月日)+当天的批次自增号)
    async createPlanBatchNumber() {
      const e = await this.ajax("createPlanBatchNumber", {
        orderNumber: this.addForm.number //订单编号
      });
      if (e.status === 0) {
        //表示成功
        this.addForm.batch = e.map.planBatchNumber;
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //选择客户
    selectCustomer(){
      this.$mesCustomer.show('选择客户', {
       reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
       multiple: false, // 是否多选
       params: {       // 额外参数
          planStatus: 'all',
          staffType: 'all',
          keyword: ''
        },
            }).then(res => {
              this.addForm.customer=res.rows[0].customer_name;
              console.log(res);
        // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
            })
    },
    //选择负责人
    selectProceduce() {
      this.$mesEmployee
        .show("选择工单负责人", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            // 额外参数
            keyword: ""
          }
        })
        .then(res => {
          // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
          this.addForm.principal = res.rows[0].user_employees_name;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#addBasicInf {
  .assets-wrap {
    border: 1px solid rgb(209, 221, 229);
    background-color: rgb(255, 255, 255);
    padding: 24px;
    .liWidth {
      width: 350px;
    }
  }
}
</style>
<style lang="scss">
#addBasicInf {
  .el-form-item__label {
    font-size: 12px;
  }
}
</style>
