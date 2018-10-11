<!--我的生产计划-->
<template>
  <div id="productionPlan">
    <el-row>
      <el-col :span="24"
              class="switcher">
        <div class="ml-5">
          <el-radio-group v-model="radio">
            <el-radio-button label="进度"></el-radio-button>
            <el-radio-button label="列表"></el-radio-button>
          </el-radio-group>
          <template v-if="$route.path=='/productionSynergy/productionPlan'">
            <el-button type="primary"
                       class="ml-5">草稿箱</el-button>
            <el-button type="primary"
                       class="ml-5 "
                       @click="toAddPlan">创建计划</el-button>
          </template>
        </div>
        <div class="filter">
          <div class="size1 fl mr-3">
            <el-select v-model="type"
                       placeholder="我负责"
                       @change="changeType">
              <el-option v-for="item in typeList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="size2 fl mr-3">
            <el-select v-model="state"
                       placeholder="全部类型"
                       @change="changeState">
              <el-option v-for="item in stateList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="fr size3">
            <el-input placeholder="批次/名称/类型"
                      v-model="batch"
                      clearable
                      @clear="selectInput"
                      @keyup.native.enter="selectInput">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click.native="selectInput"></el-button>
            </el-input>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <allProductionPlan v-if="radio==='进度'"
                         ref="allProductionPlan"
                         :parentData="{'planType': type,'planStatus': state,'keyword':batch}"></allProductionPlan>
      <allProductionList v-else
                         :fromMyPlan="true"
                         :parentData="{'planType': type,'planStatus': state,'keyword':batch}"
                         ref="allProductionList"></allProductionList>
    </el-row>
  </div>
</template>
<script>
import allProductionPlan from "@/views/productionSynergy/children/allProductionPlan";
import allProductionList from "@/views/productionSynergy/children/allProductionList";
export default {
  name: "productionPlan",
  components: {
    allProductionPlan,
    allProductionList
  },
  data() {
    return {
      radio: "进度",
      type: "all",
      typeList: [
        {
          value: "all",
          label: "所有"
        },
        {
          value: "establishStaff",
          label: "我创建"
        },
        {
          value: "principal",
          label: "我负责"
        }
      ],
      state: "all",
      stateList: [
        {
          value: "all",
          label: "所有状态"
        },
        {
          value: "awaitProduction",
          label: "未生产"
        },
        {
          value: "inProduction",
          label: "生产中"
        },
        {
          value: "complete",
          label: "完成"
        },
        {
          value: "pause",
          label: "暂停"
        },
        {
          value: "close",
          label: "关闭"
        }
      ],
      batch: "" //批次
    };
  },
  mounted() {},
  methods: {
    changeType() {
      if (this.radio === "进度") {
        this.$refs.allProductionPlan.queryPlanView(
          this.type,
          this.state,
          this.batch
        );
      } else {
        this.$refs.allProductionList.queryPlanOutline(
          this.type,
          this.state,
          this.batch
        );
      }
    },
    changeState() {
      if (this.radio === "进度") {
        this.$refs.allProductionPlan.queryPlanView(
          this.type,
          this.state,
          this.batch
        );
      } else {
        this.$refs.allProductionList.queryPlanOutline(
          this.type,
          this.state,
          this.batch
        );
      }
    },
    selectInput() {
      if (this.radio === "进度") {
        this.$refs.allProductionPlan.queryPlanView(
          this.type,
          this.state,
          this.batch
        );
      } else {
        this.$refs.allProductionList.queryPlanOutline(
          this.type,
          this.state,
          this.batch
        );
      }
    },
    // 跳转到创建生产计划页面
    toAddPlan() {
      this.$router.push({
        path: "/productionSynergy/productionPlan/addPlan"
      });
    }
  }
};
</script>
