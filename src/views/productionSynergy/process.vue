
<!--工序-->
<template>
  <div id="process">
    <el-row>
      <el-col :span="24"
              class="switcher">
        <div class="ml-5">
          <el-radio-group v-model="radio">
            <el-radio-button label="进度"></el-radio-button>
            <el-radio-button label="列表"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter">
          <div class="fl size2 mr-3">
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
            <el-input placeholder="工序/工单号"
                      v-model="processNum"
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
    <processPlan v-if="radio==='进度'"
                 :parentData="{'planId':$route.query.planId,'workOrderStatus':state,'keyword':processNum}"
                 ref="processPlan"></processPlan>
    <processList v-else
                 :parentData="{'planId':$route.query.planId,'workOrderStatus':state,'keyword':processNum}"
                 ref="processList"></processList>
  </div>
</template>
<script>
import processPlan from "@/views/productionSynergy/children/processPlan";
import processList from "@/views/productionSynergy/children/processList";
export default {
  name: "process",
  components: {
    processPlan,
    processList
  },
  data() {
    return {
      radio: "进度",
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
          label: "已完成"
        },
        {
          value: "pause",
          label: "暂停"
        },
        {
          value: "close",
          label: "关闭"
        },
        {
          value: "notEmit",
          label: "未发出"
        },
        {
          value: "emit",
          label: "已发出"
        },
        {
          value: "homing",
          label: "已回厂"
        }
      ],
      processNum: ""
    };
  },
  //   watch:{
  //     "radio":(val)=>{

  //       if(val==="进度"){

  // console.log(this.$refs);
  //       }
  //     }
  //   },
  mounted() {
    if (this.$route.query.active) {
      this.radio = this.$route.query.active;
    } else {
      this.radio = "进度";
    }
  },
  methods: {
    changeState() {
      if (this.radio === "进度") {
        this.$refs.processPlan.queryWorkOrderView(
          this.$route.query.planId,
          this.state,
          this.processNum
        );
      } else {
        this.$refs.processList.queryWorkOrderOutline(
          this.$route.query.planId,
          this.state,
          this.processNum
        );
      }
    },
    selectInput() {
      if (this.radio === "进度") {
        this.$refs.processPlan.queryWorkOrderView(
          this.$route.query.planId,
          this.state,
          this.processNum
        );
      } else {
        this.$refs.processList.queryWorkOrderOutline(
          this.$route.query.planId,
          this.state,
          this.processNum
        );
      }
    }
  }
};
</script>