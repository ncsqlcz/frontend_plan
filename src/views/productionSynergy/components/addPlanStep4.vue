<!--生产工单-->
<template>
  <div class="process">
    <el-row>
      <el-collapse v-model="activeName"
                   accordion>
        <el-collapse-item title="工序A"
                          name="1">
          <template>
            <el-table :data="tableData3"
                      height="200"
                      style="width: 100%">
              <el-table-column prop="date"
                               label="工单号">
              </el-table-column>
              <el-table-column prop="name"
                               label="负责人">
              </el-table-column>
              <el-table-column prop="address"
                               label="排产量">
              </el-table-column>
              <el-table-column prop="address"
                               label="计划时间">
              </el-table-column>
              <el-table-column fixed="right"
                               label="操作"
                               width="80">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)"
                             type="text"
                             size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 20px">
              <el-button size="small"
                         type="primary" @click="editVisible=true">新增工单</el-button>
            </div>
          </template>
        </el-collapse-item>
        <el-collapse-item title="工序B"
                          name="2">
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>
        <el-collapse-item title="工序C"
                          name="3">
          <div>简化流程：设计简洁直观的操作流程；</div>
          <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
          <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
        </el-collapse-item>
        <el-collapse-item title="工序D"
                          name="4">
          <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
          <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
        </el-collapse-item>
      </el-collapse>
    </el-row>

    <el-dialog title="编辑工单"
                 :visible.sync="editVisible"
                 >
        <editProcess></editProcess>
      </el-dialog>
  </div>
</template>
<script>
import editProcess from "@/views/productionSynergy/components/editProcess";
export default {
  name: "add-plan-step4",
  components: {
    editProcess
  },
  data() {
    return {
      editVisible:false,
      activeName: ["1"],
      
      tableData3: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    handleChange(val) {
      console.log(val);
    },
    handleClick(row) {
      console.log(row);
    }
  }
};
</script>

<style lang="scss" scoped>
.process {
  padding: 24px;
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(209, 221, 229);
}
</style>
<style lang="scss">
#addBasicInf {
  .el-form-item__label {
    font-size: 12px;
  }
}
</style>