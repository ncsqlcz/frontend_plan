<!--生产路径-->
<template>
    <div class="createPath">
        <el-row>
            <el-col :span="24"
                    class="switcher">
                <el-button type="primary"
                           class="ml-5"
                           @click="toCreatPath">创建路径</el-button>
                <div class="filter">
                    <el-input v-model="selectTxt"
                             placeholder="ee"
                              @clear="selectInput"
                              @keyup.native.enter="selectInput">
                        <el-button slot="append"
                                   icon="el-icon-search"
                                   @click.native="selectInput"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-table :data="pathList"
                      style="width: 100%;">
                <el-table-column label="路径名称">
                    <template slot-scope="scope">
                        <span v-text="scope.row.a"></span>
                    </template>
                </el-table-column>
                <el-table-column label="生产版本">
                    <template slot-scope="scope">
                        <span v-text="scope.row.b"></span>
                    </template>
                </el-table-column>
                <el-table-column label="产品名称">
                    <template slot-scope="scope">
                        <span v-text="scope.row.c"></span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人">
                    <template slot-scope="scope">
                        <span v-text="scope.row.d"></span>
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <span v-text="scope.row.e"></span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right"
                                 label="操作"
                                 width="100"
                                 align="center">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
    </div>
</template>
<script>
export default {
  name: "createPath",
  data() {
    return {
      selectTxt: "", //查询
      pathList: [
        {
          a: "请我1",
          b: "而我却2",
          c: "56我去5",
          d: "55权威q5",
          e: "王企鹅额5",
          f: "卫栖梧",
          g: "我去二群问",
          k: "委屈额",
          j: "而我却"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    selectInput() {},
    toCreatPath() {
      this.$router.push({
        path: "/productionSynergy/productionPath/createPath"
      });
    }
  }
};
</script>




