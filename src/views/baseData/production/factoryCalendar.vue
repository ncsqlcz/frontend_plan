<!--工厂日历-->
<template>
  <div class="factoryCalendar">
    <el-row>
      <el-col :span="24"
              class="switcher">
        <div class="fl">
          <el-button type="primary"
                     class="ml-5 my-3"
                     @click="addCalendar()"
                     size="small">创建工作日类型</el-button>
        </div>
        <div class="filter fr">
          <div class="fr size3">
            <el-input placeholder="名称"
                      v-model="code"
                      size="small">
              <i slot="suffix"
                 class="el-input__icon el-icon-search"
                 @click="selectInput"></i>
            </el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="24">
        <el-table :data="typeList"
                  style="width: 100%;">
          <el-table-column label="工作日名称"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <i :class="scope.row.defaultType==='y'?'el-icon-star-on':'el-icon-star-off'"></i>
              <span v-text="scope.row.name"></span>
            </template>
          </el-table-column>
          <el-table-column label="工作时间"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.time"></span>
            </template>
          </el-table-column>
          <el-table-column label="备注"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.cause"></span>
            </template>
          </el-table-column>
          <el-table-column fixed="right"
                           label="操作"
                           width="200"
                           align="center">
            <template slot-scope="scope">
              <el-button type="text"
                         size="small"
                         @click="lookDetail(scope.row.id , scope.row.insertTime)">编辑</el-button>
              <el-button type="text"
                         v-show="scope.row.defaultType==='y'?false:true"
                         class="danger"
                         size="small"
                         @click="delFn(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--分页 -->
    <div class="pagination">
      <el-pagination layout="total, sizes, prev, pager ,next"
                     :page-sizes="pagination.pageSizes"
                     :page-size="pagination.pageSize"
                     :total="pagination.total"
                     @current-change="handlePageChange"
                     @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <!-- 分页end -->
    <!--创建工作日弹框-->
    <el-dialog title="创建工作日类型"
               class="detailDialog"
               :visible.sync="addCalendarDialog">
      <el-form ref="form"
               :model="form"
               :rules="typeRules"
               label-width="80px"
               label-position="left">
        <el-form-item label="名称"
                      prop="name">
          <el-input v-model="form.name"
                    placeholder="20字以内"
                    @blur="queryWorkDayName"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="备注"
                      prop="desc">
          <el-input type="textarea"
                    placeholder="50字以内"
                    v-model="form.desc"></el-input>
        </el-form-item>
        <el-table :data="form.oneCalendlarType"
                  style="width: 100%;">
          <el-table-column label="时段"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.working_time_frame"></span>
            </template>
          </el-table-column>
          <el-table-column label="开始时间">
            <template slot-scope="scope">
              <span v-text="scope.row.working_start_time"></span>
            </template>
          </el-table-column>
          <el-table-column label="结束时间">
            <template slot-scope="scope">
              <span v-text="scope.row.working_end_time"></span>
            </template>
          </el-table-column>
          <el-table-column fixed="right"
                           label="操作"
                           width="200"
                           align="center">
            <template slot-scope="scope">
              <el-button type="text"
                         size="small"
                         class="danger"
                         icon="el-icon-close"
                         @click="delOneCalendlarType(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="addgreen explain"
             @click="addTimeQuantum">+</div>
        <div class="explain"> 工作时间：{{changeHours(workingHours)}}</div>
        <el-form-item label="工作日">
          <el-checkbox v-model="form.monday">周一</el-checkbox>
          <el-checkbox v-model="form.tuesday">周二</el-checkbox>
          <el-checkbox v-model="form.wednesday">周三</el-checkbox>
          <el-checkbox v-model="form.thursday">周四</el-checkbox>
          <el-checkbox v-model="form.friday">周五</el-checkbox>
          <el-checkbox v-model="form.saturday">周六</el-checkbox>
          <el-checkbox v-model="form.sunday">周日</el-checkbox>
        </el-form-item>
        <div class="explain">(未勾选的为休息日)</div>
        <el-form-item label="设置默认"
                      v-if="hasEdit">
          <el-switch v-model="form.hasDefault"
                     @change="setDefault"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     class="fr mr-3"
                     @click="onSubmit('form')">完成</el-button>
        </el-form-item>
      </el-form>
      <!--创建工作日弹框-->
      <el-dialog width="30%"
                 title="编辑时段"
                 :visible.sync="innerVisible"
                 class="detailDialog"
                 append-to-body>
        <el-form ref="addTime"
                 :model="addTime"
                 :rules="timeRules"
                 label-width="100px"
                 label-position="left">
          <el-form-item label="时段名称"
                        prop="timeName"
                        placeholder="20字以内">
            <el-input v-model="addTime.timeName"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="开始时间"
                        prop="startTime">
            <el-time-picker v-model="addTime.startTime"
                            placeholder="任意时间点"
                            format="HH:mm"
                            value-format="HH:mm">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="结束时间"
                        prop="endTime">
            <el-time-picker v-model="addTime.endTime"
                            placeholder="任意时间点"
                            format="HH:mm"
                            value-format="HH:mm">
              <!-- :picker-options="{
      selectableRange: addTime.startTime+':00'+':00 - 23:59:00'
    }" -->
            </el-time-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       class="mr-3 fr"
                       @click="submitAddTime('addTime')">完成</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("时段名称不能为空"));
      } else if (value.length > 30) {
        return callback(new Error("时段名称不能超过30个字符"));
      } else {
        //不能重复
        let data = this.form.oneCalendlarType;
        if (data.length != 0) {
          data.forEach(n => {
            if (value == n.working_time_frame) {
              return callback(new Error("时段名称重复"));
            } else {
              callback();
            }
          });
        } else {
          callback();
        }
      }
    };
    var checkStartTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("开始时间不能为空"));
      } else {
        let data = this.form.oneCalendlarType;
        if (data.length != 0) {
          let a = value.split(":"),
            b = data[data.length - 1].working_end_time.split(":"),
            c = 24 * a[0] + 1 * a[1],
            d = 24 * b[0] + 1 * b[1];
          if (c <= d) {
            callback(new Error("开始时间不能小于您上次添加的结束时间"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    };
    var checkEndTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("结束时间不能为空"));
      } else {
        let start = this.addTime.startTime.split(":"),
          end = value.split(":"),
          a = 24 * end[0] + 1 * end[1],
          b = 24 * start[0] + 1 * start[1];
        if (a <= b) {
          callback(new Error("结束时间不能小于开始时间"));
        } else {
          callback();
        }
      }
    };
    return {
      //分页
      pagination: {
        page: 1, //页数
        pageSizes: [1, 5, 10, 20, 30, 40, 50],
        pageSize: 10, //每页的条数
        total: 0
      },
      loading: false,
      hasEdit: false, //是否编辑
      code: "",
      typeList: [], //日历列表
      addCalendarDialog: false,
      nowWorkId: "", //当前工作日id
      insertTime: "", //插入时间
      form: {
        name: "",
        desc: "",
        monday: true, //周一
        tuesday: true, //周二
        wednesday: true, //周三
        thursday: true, //周四
        friday: true, //周五
        saturday: false, //周六
        sunday: false, //周日
        oneCalendlarType: [], //一个工作日类型时间段划分
        hasDefault: false //不是默认
      },
      typeRules: {
        name: [
          { required: true, message: "工作日类型名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        desc: [
          { required: true, message: "请填写备注", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ]
      },
      innerVisible: false, //时段添加二层弹框
      addTime: {
        timeName: "",
        startTime: "",
        endTime: ""
      },
      timeRules: {
        timeName: [{ required: true, validator: checkName, trigger: "blur" }],
        startTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        startTime: [
          {
            required: true,
            validator: checkStartTime,
            trigger: "change"
          }
        ],
        endTime: [
          {
            required: true,
            validator: checkEndTime,
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    workingHours: function() {
      let b = this.form.oneCalendlarType,
        a = 0;
      if (b.length == 0) {
        return 0;
      } else {
        b.forEach(n => {
          a +=
            this.changeMs(n.working_end_time) -
            this.changeMs(n.working_start_time);
        });
        return a;
      }
    }
  },
  mounted() {
    this.queryWorkDayAbstract();
  },
  methods: {
    //补零
    add0(M) {
      return (M = M < 10 ? `0${M}` : M);
    },
    //ms转小时分钟
    changeHours(str) {
      return (
        this.add0(parseInt((str * 1) / 1000 / 60 / 60)) +
        ":" +
        this.add0(((str * 1) / 1000 / 60) % 60)
      );
    },
    //小时分钟转ms
    changeMs(str) {
      let a = str.split(":");
      return (a[0] * 60 * 60 + a[1] * 60) * 1000;
    },
    // 页码改变
    handlePageChange(val) {
      this.pagination.page = val;
      this.queryWorkDayAbstract();
    },
    // 每页数量改变
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryWorkDayAbstract();
    },
    //模糊搜索
    selectInput() {
      this.queryWorkDayAbstract();
    },
    //查询工厂日历列表
    async queryWorkDayAbstract() {
      this.loading = true; // 等待
      const e = await this.ajax("queryWorkDayAbstract", {
        keyWord: this.code,
        page: this.pagination.page, //页数
        pageSize: this.pagination.pageSize
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        this.typeList = [];
        //数据总条数
        this.pagination.total = e.map.lines;
        e.map.workDayDtos.forEach(n => {
          this.typeList.push({
            name: n.workday_type_name,
            time:
              this.add0(
                parseInt((n.workday_total_working_hours * 1) / 1000 / 60 / 60)
              ) +
              ":" +
              this.add0(((n.workday_total_working_hours * 1) / 1000 / 60) % 60),
            cause: n.workday_remark,
            defaultType: n.workday_default_type,
            id: n.workday_type_id,
            insertTime: n.workday_insert_time
          });
        });
      } else if (e.status === 2) {
        //数据为空
        this.typeList = [];
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //查询工作日详情
    async queryWorkDayDetails(id) {
      const e = await this.ajax("queryWorkDayDetails", {
        workDayId: id
      });
      if (e.status === 0) {
        //表示成功
        let data = e.map.WorkDayDto;
        this.form.oneCalendlarType = e.map.WorkDayDto.workingHoursDo; //数据时间
        this.form.name = data.workday_type_name; //名称
        this.form.desc = data.workday_remark; //备注
        this.form.monday = data.workday_monday === "y" ? true : false; //周一
        this.form.tuesday = data.workday_tuesday === "y" ? true : false; //周二
        this.form.wednesday = data.workday_wednesday === "y" ? true : false; //周三
        this.form.thursday = data.workday_thursday === "y" ? true : false; //周四
        this.form.friday = data.workday_friday === "y" ? true : false; //周五
        this.form.saturday = data.workday_saturday === "y" ? true : false; //周六
        this.form.sunday = data.workday_sunday === "y" ? true : false; //周日
        this.form.hasDefault = data.workday_default_type === "y" ? true : false;
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //查询工作日名称重复
    async queryWorkDayName() {
      const e = await this.ajax("queryWorkDayName", {
        workDayName: this.form.name
      });
      if (e.status === 1) {
        //表示成功
        this.$message({
          message: e.msg,
          type: "error"
        });
        this.form.name = "";
      }
    },
    //设置工作日是否默认
    setDefault(val) {
      // console.log(val);
      this.modifyWorkDayType();
    },
    //修改工作日类型
    async modifyWorkDayType(id) {
      const e = await this.ajax("modifyWorkDayType", {
        workDayId: this.nowWorkId
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "修改工作日默认成功",
          type: "success"
        });
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //修改工作日
    async modifyWorkDay() {
      const e = await this.ajax("modifyWorkDay", {
        workDayDto: JSON.stringify({
          workday_type_id: this.nowWorkId,
          workday_insert_time: this.insertTime, //插入时间
          workday_type_name: this.form.name, //名称
          workday_remark: this.form.desc, //备注
          workday_total_working_hours: this.workingHours, //总时长
          workday_monday: this.form.monday ? "y" : "n", //周一
          workday_tuesday: this.form.tuesday ? "y" : "n", //周二
          workday_wednesday: this.form.wednesday ? "y" : "n", //周三
          workday_thursday: this.form.thursday ? "y" : "n", //周四
          workday_friday: this.form.friday ? "y" : "n", //周五
          workday_saturday: this.form.saturday ? "y" : "n", //周六
          workday_sunday: this.form.sunday ? "y" : "n", //周日
          workday_default_type: this.form.hasDefault ? "y" : "n", //是否要默认
          workingHoursDo: this.form.oneCalendlarType
        })
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "修改成功",
          type: "success"
        });
        //清空当前选择的id
        this.nowWorkId = "";
        //刷新列表
        this.queryWorkDayAbstract();
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //编辑
    lookDetail(id, insertTime) {
      //编辑弹出
      this.nowWorkId = id;
      this.insertTime = insertTime;
      this.hasEdit = true;
      this.addCalendarDialog = true;
      //先查看//渲染页面
      this.queryWorkDayDetails(id);
    },
    //新增工作日
    async saveWorkDay() {
      const e = await this.ajax("saveWorkDay", {
        workDayDto: JSON.stringify({
          workday_type_name: this.form.name, //名称
          workday_remark: this.form.desc, //备注
          workday_total_working_hours: this.workingHours, //总时长
          workday_monday: this.form.monday ? "y" : "n", //周一
          workday_tuesday: this.form.tuesday ? "y" : "n", //周二
          workday_wednesday: this.form.wednesday ? "y" : "n", //周三
          workday_thursday: this.form.thursday ? "y" : "n", //周四
          workday_friday: this.form.friday ? "y" : "n", //周五
          workday_saturday: this.form.saturday ? "y" : "n", //周六
          workday_sunday: this.form.sunday ? "y" : "n", //周日
          workingHoursDo: this.form.oneCalendlarType
        })
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: e.msg,
          type: "success"
        });
        //刷新列表
        this.queryWorkDayAbstract();
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },

    //创建工作日类型
    addCalendar() {
      this.hasEdit = false;
      //form数据制空
      this.form = {
        name: "",
        desc: "",
        monday: true, //周一
        tuesday: true, //周二
        wednesday: true, //周三
        thursday: true, //周四
        friday: true, //周五
        saturday: false, //周六
        sunday: false, //周日
        oneCalendlarType: [], //一个工作日类型时间段划分
        hours: null,
        hasDefault: false //不是默认
      };
      this.addCalendarDialog = true;
    },
    //新增table日期
    addTimeQuantum() {
      this.innerVisible = true;
      this.addTime = {
        timeName: "",
        startTime: "",
        endTime: ""
      };
    },
    submitAddTime(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.oneCalendlarType.push({
            working_time_frame: this.addTime.timeName,
            working_start_time: this.addTime.startTime,
            working_end_time: this.addTime.endTime
          });
          //弹出关闭
          this.innerVisible = false;
        } else {
          return false;
        }
      });
    },
    //删除一条刚添加的数据
    delOneCalendlarType(index) {
      this.form.oneCalendlarType.splice(index, 1);
    },
    //提交创建
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.nowWorkId === "") {
            //新增
            this.saveWorkDay();
          } else {
            //修改
            this.modifyWorkDay();
          }
          //弹出关闭
          this.addCalendarDialog = false;
        } else {
          return false;
        }
      });
    },
    //删除
    async removeWorkDay(id) {
      const e = await this.ajax("removeWorkDay", {
        workDayId: id
      });
      if (e.status === 0) {
        //表示成功
        //刷新列表
        this.queryWorkDayAbstract();
      } else {
        this.$message({
          message: "删除失败",
          type: "error"
        });
      }
    },

    delFn(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.removeWorkDay(id);
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss">
.factoryCalendar {
  .detailDialog {
    .explain {
      margin-bottom: 22px;
    }
  }
  .pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>