<template>
  <div class="addPlan">
    <el-row>
      <el-col :span="24"
              class="switcher">
        <div class="stepWidth"
             style="width:800px;padding:7px 20px 7px 40px">
          <el-steps :active="active"
                    finish-status="success"
                    simple>
            <el-step title="基础信息"></el-step>
            <el-step title="生产路线"></el-step>
            <el-step title="生产排程"></el-step>
            <el-step title="生产工单"></el-step>
          </el-steps>
        </div>
      </el-col>
    </el-row>
    <el-row class="el-card--custom">
      <add-plan-step1 v-if="active===1"></add-plan-step1>
      <add-plan-step2 v-else-if="active===2"></add-plan-step2>
      <add-plan-step3 v-else-if="active===3"></add-plan-step3>
      <add-plan-step4 v-else></add-plan-step4>
    </el-row>
    <el-row>
      <template>
        <el-button type="primary"
                   size="small"
                   class="fr mr-5"
                   @click="next"
                   v-show="active!=4">下一步</el-button>
        <el-button type="primary"
                   size="small"
                   class="fr mr-5"
                   v-if="active===4">完成</el-button>
        <el-button type="primary"
                   size="small"
                   class="fr mr-5"
                   v-if="active===4">完成并下发</el-button>
        <el-button type="primary"
                   size="small"
                   class="fr mr-5"
                   @click="back"
                   v-show="active!=1">上一步</el-button>
      </template>
    </el-row>
  </div>
</template>
<script>
import addPlanStep1 from "@/views/productionSynergy/components/addPlanStep1";
import addPlanStep2 from "@/views/productionSynergy/components/addPlanStep2";
import addPlanStep3 from "@/views/productionSynergy/components/addPlanStep3";
import addPlanStep4 from "@/views/productionSynergy/components/addPlanStep4";
export default {
  name: "add-plan",
  components: {},
  data() {
    return {
      active: 1
    };
  },
  components: {
    addPlanStep1,
    addPlanStep2,
    addPlanStep3,
    addPlanStep4
  },
  mounted() {},
  methods: {
    //下一步
    next() {
      if (this.active++ > 3) this.active = 1;
    },
    //上一步
    back() {
      if (this.active-- < 1) this.active = 4;
    }
  }
};
</script>