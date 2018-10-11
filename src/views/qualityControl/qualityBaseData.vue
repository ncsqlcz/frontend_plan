<!--品质基础数据-->
<template>
  <div class="qualityBaseData">
    <el-row>
      <el-col :span="24"
              class="switcher">
          <el-button type="primary"
                     class="ml-5 size"
                     @click="addBaseData({state:'0'})">创&nbsp;&nbsp;建</el-button>
        <div class="filter">
          <div class="fr size3">
            <el-input placeholder="搜索名称或编号"
                      v-model="selectVal"
                      @clear="selectInput"
                      @keyup.native.enter="selectInput">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click.native="selectInput"></el-button>

            </el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="leftBox fl">
          <ul>
            <li :class="active=='检测类型'?'active':''"
                @click="queryQualityProjectType('all')">检测类型</li>
            <li :class="active=='检测项目'?'active':''"
                @click="queryQualityProject('all')">检测项目</li>
            <li :class="active=='检测方式'?'active':''"
                @click="queryQualityCheckMethod('all')">检测方式</li>
            <li :class="active=='检测工具'?'active':''"
                @click="queryQualityAppliance('all')">检测工具</li>
            <li :class="active=='不良代号'?'active':''"
                @click="queryQualityUnqualified('all')">不良代号</li>
            <li :class="active=='检测标准'?'active':''"
                @click="queryQualityStandard('all')">检测标准</li>
          </ul>
        </div>
        <div class="rightBox fr">
          <!--检测类型数据-->
          <template v-if="active==='检测类型'">
            <el-table :data="typeDataList"
                      style="width: 100%;"
                      v-loading="loading"
                      @row-click="lookDetail">
              <el-table-column label="编号"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_project_type_number"></span>
                </template>
              </el-table-column>
              <el-table-column label="类型名称"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_project_type_name"></span>
                </template>
              </el-table-column>
              <el-table-column label="说明"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_project_type_description"></span>
                </template>
              </el-table-column>
              <el-table-column fixed="right"
                               label="操作"
                               width="200"
                               align="center">
                <template slot-scope="scope">
                  <el-button type="text"
                             size="small"
                             @click.stop="lookEdit({'id':scope.row.quality_project_type_id,state:'1'})">编辑</el-button>
                  <el-button type="text"
                             size="small"
                             class="danger"
                             @click.stop="delFn(scope.row.quality_project_type_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <!--检测项目数据-->
          <template v-if="active==='检测项目'">
            <el-table :data="proDataList"
                      style="width: 100%;"
                      v-loading="loading"
                      @row-click="lookDetail">
              <el-table-column label="编号"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_project_number"></span>
                </template>
              </el-table-column>
              <el-table-column label="项目名称"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_project_name"></span>
                </template>
              </el-table-column>
              <el-table-column label="项目类型"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_project_type_name"></span>
                </template>
              </el-table-column>
              <el-table-column fixed="right"
                               label="操作"
                               width="200"
                               align="center">
                <template slot-scope="scope">
                  <el-button type="text"
                             size="small"
                             @click.stop="lookEdit({'projectId':scope.row.quality_project_id,'projectTypeId':scope.row.quality_project_type_id,state:'1'})">编辑</el-button>
                  <el-button type="text"
                             size="small"
                             class="danger"
                             @click.stop="delFn(scope.row.quality_project_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <!--检测方式数据-->
          <template v-if="active==='检测方式'">
            <el-table :data="caseDataList"
                      style="width: 100%;"
                      v-loading="loading"
                      @row-click="lookDetail">
              <el-table-column label="编号"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_check_method_number"></span>
                </template>
              </el-table-column>
              <el-table-column label="检测方式"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_check_method_name"></span>
                </template>
              </el-table-column>
              <el-table-column label="说明"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_check_method_description"></span>
                </template>
              </el-table-column>
              <el-table-column fixed="right"
                               label="操作"
                               width="200"
                               align="center">
                <template slot-scope="scope">
                  <el-button type="text"
                             size="small"
                             @click.stop="lookEdit({'id':scope.row.quality_check_method_id,state:'1'})">编辑</el-button>
                  <el-button type="text"
                             size="small"
                             class="danger"
                             @click.stop="delFn(scope.row.quality_check_method_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <!--检测工具-->
          <template v-if="active==='检测工具'">
            <el-table :data="toolDataList"
                      style="width: 100%;"
                      v-loading="loading"
                      @row-click="lookDetail">
              <el-table-column label="编号"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_appliance_number"></span>
                </template>
              </el-table-column>
              <el-table-column label="检测工具名称"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_appliance_name"></span>
                </template>
              </el-table-column>
              <el-table-column label="说明"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_appliance_description"></span>
                </template>
              </el-table-column>
              <el-table-column fixed="right"
                               label="操作"
                               width="200"
                               align="center">
                <template slot-scope="scope">
                  <el-button type="text"
                             size="small"
                             @click.stop="lookEdit({'id':scope.row.quality_appliance_id,state:'1'})">编辑</el-button>
                  <el-button type="text"
                             size="small"
                             class="danger"
                             @click.stop="delFn(scope.row.quality_appliance_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <!--不良品-->
          <template v-if="active==='不良代号'">
            <el-table :data="rejectsDataList"
                      style="width: 100%;"
                      v-loading="loading"
                      @row-click="lookDetail">
              <el-table-column label="编号"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_unqualified_number"></span>
                </template>
              </el-table-column>
              <el-table-column label="不良品名称"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_unqualified_name"></span>
                </template>
              </el-table-column>
              <el-table-column label="说明"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_unqualified_description"></span>
                </template>
              </el-table-column>
              <el-table-column fixed="right"
                               label="操作"
                               width="200"
                               align="center">
                <template slot-scope="scope">
                  <el-button type="text"
                             size="small"
                             @click.stop="lookEdit({'id':scope.row.quality_unqualified_id,state:'1'})">编辑</el-button>
                  <el-button type="text"
                             size="small"
                             class="danger"
                             @click.stop="delFn(scope.row.quality_unqualified_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <!--检测标准-->
          <template v-if="active==='检测标准'">
            <el-table :data="standardDataList"
                      style="width: 100%;"
                      v-loading="loading"
                      @row-click="lookDetail">
              <el-table-column label="编号"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_standard_number"></span>
                </template>
              </el-table-column>
              <el-table-column label="标准名称"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_standard_name"></span>
                </template>
              </el-table-column>
              <el-table-column label="检测项目"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-text="scope.row.quality_project_name"></span>
                </template>
              </el-table-column>
              <el-table-column fixed="right"
                               label="操作"
                               width="200"
                               align="center">
                <template slot-scope="scope">
                  <el-button type="text"
                             size="small"
                             @click.stop="lookEdit({'standardId':scope.row.quality_standard_id,'projectId':scope.row.quality_project_id,state:'1'})">编辑</el-button>
                  <el-button type="text"
                             size="small"
                             class="danger"
                             @click.stop="delFn(scope.row.quality_standard_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </el-col>
    </el-row>
    <!--检测类型-->
    <el-dialog title="检测类型"
               :visible.sync="typeDialog"
               width="400px">
      <el-form :model="typeForm"
               ref="typeForm"
               label-width="80px">
        <el-form-item label="编号"
                      prop="code"
                      :rules="[
      { required: true, message: '编码不能为空'},
      { min:1,max:50,message: '50个字符内'},
      {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号'}
    ]">
          <el-input v-model="typeForm.code"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="类型名称"
                      prop="name"
                      :rules="[
      { required: true, message: '类型名称不能为空'},
      { min:1,max:50,message: '50个字符内'},
      {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号'}
    ]">
          <el-input class="input-size"
                    v-model="typeForm.name"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="说明"
                      prop="dec"
                      :rules="[
      { required: true, message: '说明不能为空'},
      { min:1,max:50,message: '50个字符内'}
    ]">
          <el-input type="textarea"
                    v-model="typeForm.dec"
                    clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="editObj.state==='1'?editFn('typeForm'):submitForm('typeForm')">完成</el-button>
          <el-button @click="resetForm('typeForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--检测项目-->
    <el-dialog title="检测项目"
               :visible.sync="proDialog"
               width="450px">
      <el-form :model="proForm"
               ref="proForm"
               label-width="80px">
        <el-form-item label="编号"
                      prop="code"
                      :rules="[
      { required: true, message: '编码不能为空'},
      { min:1,max:50,message: '50个字符内'},
      {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号'}
    ]">
          <el-input v-model="proForm.code"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="项目名称"
                      prop="name"
                      :rules="[
      { required: true, message: '项目名称不能为空'},
      { min:1,max:50,message: '50个字符内'},
      {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号'}
    ]">
          <el-input class="input-size"
                    v-model="proForm.name"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="检测类型"
                      prop="type"
                      :rules="[ {required: true, message: '请选择检测类型', trigger: 'change' }]">
          <el-select v-model="proForm.type"
                     placeholder="请选择检测类型">
            <el-option v-for="(item,index) in typeDataList"
                       :key="index"
                       :label="item.quality_project_type_name"
                       :value="item.quality_project_type_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体内容"
                      prop="content"
                      :rules="[
      { required: true, message: '具体内容不能为空'},
      { min:1,max:50,message: '50个字符内'}
    ]">
          <el-input v-model="proForm.content"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="操作标准"
                      prop="operating"
                      :rules="[
      { required: true, message: '操作标准不能为空'},
      { min:1,max:50,message: '50个字符内'}
    ]">
          <el-input v-model="proForm.operating"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="说明"
                      prop="dec"
                      :rules="[
      { required: true, message: '说明不能为空'},
      { min:1,max:50,message: '50个字符内'}
    ]">
          <el-input type="textarea"
                    v-model="proForm.dec"
                    clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="editObj.state==='1'?editFn('proForm'):submitForm('proForm')">完成</el-button>
          <el-button @click="resetForm('proForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--检测方式-->
    <el-dialog title="检测方式"
               :visible.sync="caseDialog"
               width="400px">
      <el-form :model="caseForm"
               ref="caseForm"
               label-width="80px">
        <el-form-item label="编号"
                      prop="code"
                      :rules="[
      { required: true, message: '编码不能为空'},
      { min:1,max:50,message: '50个字符内'},
      {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号'}
    ]">
          <el-input v-model="caseForm.code"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="检测方式"
                      prop="name"
                      :rules="[
      { required: true, message: '检测方式不能为空'},
      { min:1,max:50,message: '50个字符内'},
      {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号'}
    ]">
          <el-input class="input-size"
                    v-model="caseForm.name"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="说明"
                      prop="dec"
                      :rules="[
      { required: true, message: '说明不能为空'},
      { min:1,max:50,message: '50个字符内'}
    ]">
          <el-input type="textarea"
                    v-model="caseForm.dec"
                    clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="editObj.state==='1'?editFn('caseForm'):submitForm('caseForm')">完成</el-button>
          <el-button @click="resetForm('caseForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--检测工具-->
    <el-dialog title="检测工具"
               :visible.sync="toolDialog"
               width="400px">
      <el-form :model="toolForm"
               ref="toolForm"
               label-width="80px">
        <el-form-item label="编号"
                      prop="code"
                      :rules="[
      { required: true, message: '编码不能为空'},
      { min:1,max:50,message: '50个字符内'},
      {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号'}
    ]">
          <el-input v-model="toolForm.code"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="检测工具"
                      prop="name"
                      :rules="[
      { required: true, message: '检测工具不能为空'},
      { min:1,max:50,message: '50个字符内'},
      {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号'}
    ]">
          <el-input class="input-size"
                    v-model="toolForm.name"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="说明"
                      prop="dec"
                      :rules="[
      { required: true, message: '说明不能为空'},
      { min:1,max:50,message: '50个字符内'}
    ]">
          <el-input type="textarea"
                    v-model="toolForm.dec"
                    clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="editObj.state==='1'?editFn('toolForm'):submitForm('toolForm')">完成</el-button>
          <el-button @click="resetForm('toolForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--不良品-->
    <el-dialog title="不良品代号"
               :visible.sync="rejectsDialog"
               width="400px">
      <el-form :model="rejectsForm"
               ref="rejectsForm"
               label-width="100px">
        <el-form-item label="编号"
                      prop="code"
                      :rules="[
      { required: true, message: '编码不能为空'},
      { min:1,max:50,message: '50个字符内'},
      {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号'}
    ]">
          <el-input v-model="rejectsForm.code"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="不良品代号"
                      prop="name"
                      :rules="[
      { required: true, message: '不良品代号不能为空'},
      { min:1,max:50,message: '50个字符内'},
      {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号'}
    ]">
          <el-input class="input-size"
                    v-model="rejectsForm.name"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="说明"
                      prop="dec"
                      :rules="[
      { required: true, message: '说明不能为空'},
      { min:1,max:50,message: '50个字符内'}
    ]">
          <el-input type="textarea"
                    v-model="rejectsForm.dec"
                    clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="editObj.state==='1'?editFn('rejectsForm'):submitForm('rejectsForm')">提交</el-button>
          <el-button @click="resetForm('rejectsForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--检测标准-->
    <el-dialog title="检测标准"
               :visible.sync="standarDialog"
               width="600px">
      <el-form :model="standarForm"
               ref="standarForm"
               label-width="100px">
        <el-form-item label="编号"
                      prop="code"
                      :rules="[
      { required: true, message: '编码不能为空'},
      { min:1,max:50,message: '50个字符内'},
      {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号'}
    ]">
          <el-input v-model="standarForm.code"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="标准名称"
                      prop="name"
                      :rules="[
      { required: true, message: '标准名称不能为空'},
      { min:1,max:50,message: '50个字符内'},
      {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号'}
    ]">
          <el-input class="input-size"
                    v-model="standarForm.name"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="检测项目"
                      prop="proid"
                      :rules="[ {required: true, message: '请选择检测项目', trigger: 'change' }]">
          <el-select v-model="standarForm.proid"
                     placeholder="检测项目">
            <el-option v-for="(item,index) in proDataList"
                       :key="index"
                       :label="item.quality_project_name"
                       :value="item.quality_project_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检测类别"
                      prop="type"
                      :rules="[{ required: true, message: '请选择检测类别', trigger: 'change' }]">
          <el-radio-group v-model="standarForm.type">
            <el-radio label="0">数值区间</el-radio>
            <el-radio label="1">标准值-偏差</el-radio>
            <el-radio label="2">文本描述</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="standarForm.type==0">
          <el-form-item label="数值区间"
                        required>
            <el-col :span="11">
              <el-form-item prop="value1"
                            :rules="[
      { required: true, message: '输入不能为空'},
      { type: 'number', message: '必须为数字值'},
      {pattern:/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,message:'最多2位小数'}
    ]">
                <el-input type="text"
                          style="width: 100%;"
                          v-model.number="standarForm.value1"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line"
                    :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="value2"
                            :rules="[
      { required: true, message: '输入不能为空'},
      { type: 'number', message: '必须为数字值'},
      {pattern:/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,message:'最多2位小数'}
    ]">
                <el-input type="text"
                          style="width: 100%;"
                          v-model.number="standarForm.value2"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </template>
        <template v-else-if="standarForm.type==1">
          <el-form-item label="标准值-偏差"
                        required>
            <el-col :span="11">
              <el-form-item prop="value1"
                            :rules="[
      { required: true, message: '输入不能为空'},
      { type: 'number', message: '必须为数字值'},
      {pattern:/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,message:'最多2位小数'}
    ]">
                <el-input type="text"
                          style="width: 100%;"
                          v-model.number="standarForm.value1"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line"
                    :span="2">±</el-col>
            <el-col :span="11">
              <el-form-item prop="value2"
                            :rules="[
      { required: true, message: '输入不能为空'},
      { type: 'number', message: '必须为数字值'},
      {pattern:/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,message:'最多2位小数'}
    ]">
                <el-input type="text"
                          style="width: 100%;"
                          v-model.number="standarForm.value2"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="文本描述"
                        prop="value"
                        :rules="[
      { required: true, message: '文本描述不能为空'},
      { min:1,max:50,message: '50个字符内'}
    ]">
            <el-input type="textarea"
                      v-model="standarForm.value"
                      clearable></el-input>
          </el-form-item>
        </template>
        <el-form-item label="说明"
                      prop="dec"
                      :rules="[
      { required: true, message: '说明不能为空'},
      { min:1,max:50,message: '50个字符内'}
    ]">
          <el-input type="textarea"
                    v-model="standarForm.dec"
                    clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
                     @click="editObj.state==='1'?editFn('standarForm'):submitForm('standarForm')">提交</el-button>
          <el-button @click="resetForm('standarForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--查看详情-->
    <el-dialog title="详情"
               :visible.sync="detailDialog"
               width="30%">
      <p class="detail"
         v-text="detailContent.code"></p>
      <p class="detail"
         v-text="detailContent.name"></p>
      <p class="detail"
         v-text="detailContent.dec"></p>
      <p class="detail"
         v-text="detailContent.operating"></p>
      <p class="detail"
         v-text="detailContent.content"></p>
      <p class="detail"
         v-text="detailContent.proName"></p>
      <p class="detail"
         v-text="detailContent.type"></p>
      <p class="detail"
         v-text="detailContent.value"></p>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="detailDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "qualityBaseData",
  data() {
    //bug:点击编辑时请求了查看详情数据，清空了列表
    return {
      selectVal: "", //工序或编号
      detailContent: {
        code: "",
        name: "",
        dec: "",
        content: "",
        proName: "",
        operating: "",
        value: ""
      }, //详情
      //检测类型数据
      typeDataList: [],
      typeForm: {
        code: "",
        name: "",
        dec: ""
      },
      typeDialog: false,
      //检测项目数据
      proDataList: [],
      proForm: {
        code: "",
        name: "",
        type: "", //检测类型id
        content: "", //内容
        operating: "", //操作标准
        dec: ""
      },
      proDialog: false,
      //检测方式数据
      caseDataList: [],
      caseForm: {
        code: "",
        name: "",
        dec: ""
      },
      caseDialog: false,
      //检测工具数据
      toolDataList: [],
      toolForm: {
        code: "",
        name: "",
        dec: ""
      },
      toolDialog: false,
      //不良品
      rejectsDataList: [],
      rejectsForm: {
        code: "",
        name: "",
        dec: ""
      },
      rejectsDialog: false,
      //检测标准
      standardDataList: [],
      standarForm: {
        proid: "",
        name: "",
        code: "",
        type: "0",
        dec: "",
        value: "",
        value1: "",
        value2: "",
        unit: "单位"
      },
      standarDialog: false,
      //数据加载
      loading: false,
      //点击高亮
      active: "检测类型",
      //修改
      detailDialog: false, //详情弹出
      editObj: {} //修改接口需要的字段。0代表编辑，1代表新增
    };
  },
  mounted() {
    //查看检测类型
    this.queryQualityProjectType("all");
    //查看检测项目
    this.queryQualityProject("all");
  },
  methods: {
    //搜索
    selectInput() {},
    //新增基础数据
    addBaseData(state) {
      //还原状态
      this.editObj.state = state;
      switch (this.active) {
        case "检测类型":
          //先质空
          this.typeDialog = true;
          this.resetForm("typeForm");
          break;
        case "检测项目":
          this.proDialog = true;
          this.resetForm("proForm");
          break;
        case "检测方式":
          this.caseDialog = true;
          this.resetForm("caseForm");
          break;
        case "检测工具":
          this.toolDialog = true;
          this.resetForm("toolForm");
          break;
        case "不良代号":
          this.rejectsDialog = true;
          this.resetForm("rejectsForm");
          break;
        case "检测标准":
          this.standarDialog = true;
          this.resetForm("standarForm");
          break;
        default:
          break;
      }
    },
    //查看检测类型
    async queryQualityProjectType(type, projectTypeId) {
      this.active = "检测类型";

      this.loading = true; // 等待
      const e = await this.ajax("queryQualityProjectType", {
        type: type,
        projectTypeId: projectTypeId,
        keyword: this.selectVal
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        if (type === "all") {
          this.typeDataList = []; //清空
          this.typeDataList = e.map.qualityProjectTypes;
        } else {
          //编辑查看详情
          this.typeForm.code =
            e.map.qualityProjectType.quality_project_type_number;
          this.typeForm.name =
            e.map.qualityProjectType.quality_project_type_name;
          this.typeForm.dec =
            e.map.qualityProjectType.quality_project_type_description;
          //查看详情
          this.detailContent.code =
            "编码：" + e.map.qualityProjectType.quality_project_type_number;
          this.detailContent.name =
            "检测类型名称：" +
            e.map.qualityProjectType.quality_project_type_name;
          this.detailContent.dec =
            "说明：" +
            e.map.qualityProjectType.quality_project_type_description;
        }
      } else if (e.status === 2) {
        this.typeDataList = [];
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //查看检测项目 项目id,项目类型id
    async queryQualityProject(type, projectId, projectTypeId) {
      this.active = "检测项目";
      this.loading = true; // 等待
      const e = await this.ajax("queryQualityProject", {
        type: type,
        projectId: projectId,
        projectTypeId: projectTypeId,
        keyword: this.selectVal
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        if (type === "all") {
          this.proDataList = [];
          this.proDataList = e.map.qualityProjectDTOs;
        } else {
          //查看详情
          this.proForm.code = e.map.qualityProjectDTO.quality_project_number;
          this.proForm.name = e.map.qualityProjectDTO.quality_project_name;
          this.proForm.type = e.map.qualityProjectDTO.quality_project_type_id; //检测类型id
          this.proForm.content =
            e.map.qualityProjectDTO.quality_project_content; //内容
          this.proForm.operating =
            e.map.qualityProjectDTO.quality_project_operating_standard; //操作标准
          this.proForm.dec =
            e.map.qualityProjectDTO.quality_project_description;
          //查看详情
          this.detailContent.code =
            "编码：" + e.map.qualityProjectDTO.quality_project_number; //编码
          this.detailContent.name =
            "检测项目类型名称：" +
            e.map.qualityProjectDTO.quality_project_type_name; //检测项目类型名称
          this.detailContent.dec =
            "说明：" + e.map.qualityProjectDTO.quality_project_description; //说明
          this.detailContent.proName =
            "检测项目名称：" + e.map.qualityProjectDTO.quality_project_name; //检测项目名称
          this.detailContent.content =
            "具体内容：" + e.map.qualityProjectDTO.quality_project_content; //具体内容
          this.detailContent.operating =
            "操作标准：" +
            e.map.qualityProjectDTO.quality_project_operating_standard; //操作标准
        }
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //查看检测方式
    async queryQualityCheckMethod(type, checkMethodId) {
      this.active = "检测方式";
      this.loading = true; // 等待
      const e = await this.ajax("queryQualityCheckMethod", {
        type: type,
        checkMethodId: checkMethodId,
        keyword: this.selectVal
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        if (type === "all") {
          this.caseDataList = [];
          this.caseDataList = e.map.qualityCheckMethodDTOs;
        } else {
          //查看详情
          this.caseForm.code =
            e.map.qualityCheckMethodDTO.quality_check_method_number;
          this.caseForm.name =
            e.map.qualityCheckMethodDTO.quality_check_method_name;
          this.caseForm.dec =
            e.map.qualityCheckMethodDTO.quality_check_method_description;
          //查看详情
          this.detailContent.code =
            "编码：" + e.map.qualityCheckMethodDTO.quality_check_method_number;
          this.detailContent.name =
            "检测方式名称：" +
            e.map.qualityCheckMethodDTO.quality_check_method_name;
          this.detailContent.dec =
            "说明：" +
            e.map.qualityCheckMethodDTO.quality_check_method_description;
        }
      } else if (e.status === 2) {
        this.caseDataList = [];
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //查看检测工具
    async queryQualityAppliance(type, applianceId) {
      this.active = "检测工具";
      this.loading = true; // 等待
      const e = await this.ajax("queryQualityAppliance", {
        type: type,
        applianceId: applianceId,
        keyword: this.selectVal
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        if (type === "all") {
          this.toolDataList = [];
          this.toolDataList = e.map.qualityApplianceDTOs;
        } else {
          //查看详情
          this.toolForm.code =
            e.map.qualityApplianceDTO.quality_appliance_number;
          this.toolForm.name = e.map.qualityApplianceDTO.quality_appliance_name;
          this.toolForm.dec =
            e.map.qualityApplianceDTO.quality_appliance_description;

          this.detailContent.code =
            "编码：" + e.map.qualityApplianceDTO.quality_appliance_number;
          this.detailContent.name =
            "检测工具名称：" + e.map.qualityApplianceDTO.quality_appliance_name;
          this.detailContent.dec =
            "说明：" + e.map.qualityApplianceDTO.quality_appliance_description;
        }
      } else if (e.status === 2) {
        this.toolDataList = [];
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //查看不良品 ，不良品id
    async queryQualityUnqualified(type, unqualifiedId) {
      this.active = "不良代号";
      this.loading = true; // 等待
      const e = await this.ajax("queryQualityUnqualified", {
        type: type,
        unqualifiedId: unqualifiedId,
        keyword: this.selectVal
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        if (type === "all") {
          this.rejectsDataList = [];
          this.rejectsDataList = e.map.qualityUnqualifiedDTOs;
        } else {
          //查看详情
          this.rejectsForm.code =
            e.map.QualityUnqualifiedDTO.quality_unqualified_number;
          this.rejectsForm.name =
            e.map.QualityUnqualifiedDTO.quality_unqualified_name;
          this.rejectsForm.dec =
            e.map.QualityUnqualifiedDTO.quality_unqualified_description;

          this.detailContent.code =
            "编码：" + e.map.QualityUnqualifiedDTO.quality_unqualified_number;
          this.detailContent.name =
            "检测工具名称：" +
            e.map.QualityUnqualifiedDTO.quality_unqualified_name;
          this.detailContent.dec =
            "说明：" +
            e.map.QualityUnqualifiedDTO.quality_unqualified_description;
        }
      } else if (e.status === 2) {
        this.rejectsDataList = [];
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //查看检测标准 检测标准id 项目id
    async queryQualityStandard(type, standardId, projectId) {
      this.active = "检测标准";
      this.loading = true; // 等待
      const e = await this.ajax("queryQualityStandard", {
        type: type,
        standardId: standardId,
        projectId: projectId,
        keyword: this.selectVal
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        if (type === "all") {
          this.standardDataList = [];
          this.standardDataList = e.map.standard;
        } else {
          //编辑详情
          this.standarForm.proid = e.map.standard.quality_project_id;
          this.standarForm.type = e.map.standard.quality_standard_value_type;
          if (e.map.standard.quality_standard_value_type == "2") {
            this.standarForm.value = e.map.standard.quality_standard_value;
          } else {
            let a = e.map.standard.quality_standard_value;
            this.standarForm.value1 = a.split(",")[0] * 1;
            this.standarForm.value2 = a.split(",")[1] * 1;
          }
          this.standarForm.unit = e.map.standard.quality_standard_unit;
          this.standarForm.code = e.map.standard.quality_standard_number;
          this.standarForm.name = e.map.standard.quality_standard_name;
          this.standarForm.dec = e.map.standard.quality_standard_description;
          //查看详情
          this.detailContent.code =
            "编码：" + e.map.standard.quality_standard_number;
          this.detailContent.name =
            "检测标准名称：" + e.map.standard.quality_standard_name;
          this.detailContent.proName =
            "检测项目名称：" + e.map.standard.quality_project_name;
          this.detailContent.dec =
            "说明：" + e.map.standard.quality_standard_description;
          let b = e.map.standard.quality_standard_value_type;
          let c = e.map.standard.quality_standard_value;
          if (b === "2") {
            this.detailContent.type = "检测标准类别：文字描述";
            this.detailContent.value = c;
          } else if (b === "0") {
            this.detailContent.type = "检测标准类别：数值区间";
            this.detailContent.value = "数值区间：" + c.replace(/,/g, "-");
          } else {
            this.detailContent.type = "检测标准类别：标准值-偏差";
            this.detailContent.value = "标准值-偏差：" + c.replace(/,/g, "±");
          }
        }
      } else if (e.status === 2) {
        this.standardDataList = [];
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //新增检测类别
    async saveQualityProjectType() {
      const e = await this.ajax("saveQualityProjectType", {
        qualityProjectType: JSON.stringify({
          quality_project_type_description: this.typeForm.dec,
          quality_project_type_name: this.typeForm.name,
          quality_project_type_number: this.typeForm.code
        })
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "新增检测类别成功",
          type: "success"
        });
        //查看检测类型
        this.queryQualityProjectType("all");
        //关闭弹框
        this.typeDialog = false;
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //新增检测项目
    async saveQualityProject() {
      const e = await this.ajax("saveQualityProject", {
        qualityProject: JSON.stringify({
          quality_project_content: this.proForm.content,
          quality_project_description: this.proForm.dec,
          quality_project_name: this.proForm.name,
          quality_project_number: this.proForm.code,
          quality_project_operating_standard: this.proForm.operating,
          quality_project_type_id: this.proForm.type
        })
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "新增检测项目成功",
          type: "success"
        });
        //查看检测项目
        this.queryQualityProject("all");
        //关闭弹框
        this.proDialog = false;
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //新增检测方式
    async saveQualityCheckMethod() {
      const e = await this.ajax("saveQualityCheckMethod", {
        qualityCheckMethod: JSON.stringify({
          quality_check_method_number: this.caseForm.code,
          quality_check_method_name: this.caseForm.name,
          quality_check_method_description: this.caseForm.dec
        })
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "新增检测方式成功",
          type: "success"
        });
        //查看检测方式
        this.queryQualityCheckMethod("all");
        //关闭弹框
        this.caseDialog = false;
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //新增不良代号
    async saveQualityUnqualified() {
      const e = await this.ajax("saveQualityUnqualified", {
        qualityUnqualified: JSON.stringify({
          quality_unqualified_number: this.rejectsForm.code,
          quality_unqualified_name: this.rejectsForm.name,
          quality_unqualified_description: this.rejectsForm.dec
        })
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "新增不良品成功",
          type: "success"
        });
        //查看检测方式
        this.queryQualityUnqualified("all");
        //关闭弹框
        this.rejectsDialog = false;
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //新增检测工具
    async saveQualityAppliance() {
      const e = await this.ajax("saveQualityAppliance", {
        qualityAppliance: JSON.stringify({
          quality_appliance_number: this.toolForm.code,
          quality_appliance_name: this.toolForm.name,
          quality_appliance_description: this.toolForm.dec
        })
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "新增不良品成功",
          type: "success"
        });
        //查看检测gj
        this.queryQualityAppliance("all");
        //关闭弹框
        this.toolDialog = false;
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //新增检测标准
    async saveQualityStandard() {
      const e = await this.ajax("saveQualityStandard", {
        qualityStandard: JSON.stringify({
          quality_project_id: this.standarForm.proid,
          quality_standard_name: this.standarForm.name,
          quality_standard_number: this.standarForm.code,
          quality_standard_value:
            this.standarForm.type == "2"
              ? this.standarForm.value
              : this.standarForm.value1 + "," + this.standarForm.value2,
          quality_standard_value_type: this.standarForm.type,
          quality_standard_description: this.standarForm.dec,
          quality_standard_unit: this.standarForm.unit
        })
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "新增检测标准成功",
          type: "success"
        });
        //查看检测项目
        this.queryQualityStandard("all");
        //关闭弹框
        this.standarDialog = false;
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //删除检测类型
    async deleteQualityProjectType(id) {
      const e = await this.ajax("deleteQualityProjectType", {
        qualityProjectTypeId: id
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "删除成功",
          type: "success"
        });
        //查看检测类型
        this.queryQualityProjectType("all");
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //删除检测项目
    async deleteQualityProject(id) {
      const e = await this.ajax("deleteQualityProject", {
        projectId: id
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "删除成功",
          type: "success"
        });
        //查看检测项目
        this.queryQualityProject("all");
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //删除检测方法
    async deleteQualityCheckMethod(id) {
      const e = await this.ajax("deleteQualityCheckMethod", {
        checkMethodId: id
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "删除成功",
          type: "success"
        });
        //查看检测方法
        this.queryQualityCheckMethod("all");
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //删除检测工具
    async deleteQualityAppliance(id) {
      const e = await this.ajax("deleteQualityAppliance", {
        applianceId: id
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "删除成功",
          type: "success"
        });
        //查看检测工具
        this.queryQualityAppliance("all");
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //删除不良品
    async deleteQualityUnqualified(id) {
      const e = await this.ajax("deleteQualityUnqualified", {
        unqualifiedId: id
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "删除成功",
          type: "success"
        });
        //查看检测工具
        this.queryQualityUnqualified("all");
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //删除检测标准
    async deleteQualityStandard(id) {
      const e = await this.ajax("deleteQualityStandard", {
        standardId: id
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "删除成功",
          type: "success"
        });
        //查看检测标准
        this.queryQualityStandard("all");
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //修改检测类别
    async updateQualityProjectType(id) {
      const e = await this.ajax("updateQualityProjectType", {
        projectTypeId: id,
        projectTypeNumber: this.typeForm.code,
        projectTypeName: this.typeForm.name,
        projectTypeDescription: this.typeForm.dec
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "修改检测类别成功",
          type: "success"
        });
        //查看检测类型
        this.queryQualityProjectType("all");
        //关闭弹框
        this.typeDialog = false;
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //修改检测项目
    async updateQualityProject(projectId) {
      const e = await this.ajax("updateQualityProject", {
        projectId: projectId,
        projectNumber: this.proForm.code,
        projectName: this.proForm.name,
        projectTypeId: this.proForm.type,
        projectContent: this.proForm.content,
        projectOperatingStandard: this.proForm.operating,
        projectDescription: this.proForm.dec
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "修改检测项目成功",
          type: "success"
        });
        //查看检测项目
        this.queryQualityProject("all");
        //关闭弹框
        this.proDialog = false;
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //修改检测方式
    async updateQualityCheckMethod(id) {
      const e = await this.ajax("updateQualityCheckMethod", {
        checkMethodId: id,
        checkMethodNumber: this.caseForm.code,
        checkMethodName: this.caseForm.name,
        checkMethodDescription: this.caseForm.dec
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "修改检测方式成功",
          type: "success"
        });
        //查看检测方式
        this.queryQualityCheckMethod("all");
        //关闭弹框
        this.caseDialog = false;
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //修改检测工具
    async updateQualityAppliance(id) {
      const e = await this.ajax("updateQualityAppliance", {
        applianceId: id,
        applianceNnumber: this.toolForm.code,
        applianceName: this.toolForm.name,
        applianceDescription: this.toolForm.dec
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "修改检测工具成功",
          type: "success"
        });
        //查看检测工具
        this.queryQualityAppliance("all");
        //关闭弹框
        this.toolDialog = false;
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //修改不良品
    async updateQualityUnqualified(id) {
      const e = await this.ajax("updateQualityUnqualified", {
        unqualifiedId: id,
        unqualifiedNnumber: this.rejectsForm.code,
        unqualifiedName: this.rejectsForm.name,
        unqualifiedDescription: this.rejectsForm.dec
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "修改检测工具成功",
          type: "success"
        });
        //查看不良品
        this.queryQualityUnqualified("all");
        //关闭弹框
        this.rejectsDialog = false;
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //修改检测标准
    async updateQualityStandard(standardId) {
      const e = await this.ajax("updateQualityStandard", {
        standardId: standardId,
        standardNumber: this.standarForm.code,
        standardName: this.standarForm.name,
        projectId: this.standarForm.proid,
        standardValueType: this.standarForm.type,
        standardValue:
          this.standarForm.type == "2"
            ? this.standarForm.value
            : this.standarForm.value1 + "," + this.standarForm.value2,
        standardUnit: this.standarForm.unit,
        standardDescription: this.standarForm.dec
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "修改检测标准成功",
          type: "success"
        });
        //查看检测项目
        this.queryQualityStandard("all");
        //关闭弹框
        this.standarDialog = false;
      } else {
        this.$message({
          message: e.errorMsg,
          type: "error"
        });
      }
    },
    //编辑查看
    lookEdit(obj) {
      this.editObj = obj;
      switch (this.active) {
        case "检测类型":
          //修改弹出
          this.typeDialog = true;
          //调用查看详情
          this.queryQualityProjectType("detail", obj.id);
          break;
        case "检测项目":
          //弹出框出现
          this.proDialog = true;
          //调用查询详情
          this.queryQualityProject("detail", obj.projectId, obj.projectTypeId);
          break;
        case "检测方式":
          this.caseDialog = true;
          //调用查询详情
          this.queryQualityCheckMethod("detail", obj.id);
          break;
        case "检测工具":
          this.toolDialog = true;
          //调用查询详情
          this.queryQualityAppliance("detail", obj.id);
          break;
        case "不良代号":
          this.rejectsDialog = true;
          this.queryQualityUnqualified("detail", obj.id);
          break;
        case "检测标准":
          this.standarDialog = true;
          this.queryQualityStandard("detail", obj.standardId, obj.projectId);
          break;
        default:
          break;
      }
    },
    //编辑方法
    editFn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (formName) {
            //修改检测类型
            case "typeForm":
              this.updateQualityProjectType(this.editObj.id);
              break;
            //修改项目
            case "proForm":
              this.updateQualityProject(this.editObj.projectId);
              break;
            //修改方式
            case "caseForm":
              this.updateQualityCheckMethod(this.editObj.id);
              break;
            //修改工具
            case "toolForm":
              this.updateQualityAppliance(this.editObj.id);
              break;
            //修改不良品
            case "rejectsForm":
              this.updateQualityUnqualified(this.editObj.id);
              break;
            //修改检测标准
            case "standarForm":
              this.updateQualityStandard(this.editObj.standardId);
              break;
            default:
              break;
          }
        } else {
          return false;
        }
      });
    },
    //添加
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (formName) {
            //新增检测类型
            case "typeForm":
              this.saveQualityProjectType();
              break;
            //新增项目
            case "proForm":
              this.saveQualityProject();
              break;
            //新增方式
            case "caseForm":
              this.saveQualityCheckMethod();
              break;
            //新增不良品
            case "rejectsForm":
              this.saveQualityUnqualified();
              break;
            //新增工具
            case "toolForm":
              this.saveQualityAppliance();
              break;
            //新增检测方法
            case "standarForm":
              this.saveQualityStandard();
              break;
            default:
              break;
          }
        } else {
          return false;
        }
      });
    },
    //删除
    delFn(tagId) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          switch (this.active) {
            case "检测类型":
              this.deleteQualityProjectType(tagId);
              break;
            case "检测项目":
              this.deleteQualityProject(tagId);
              break;
            case "检测方式":
              this.deleteQualityCheckMethod(tagId);
              break;
            case "检测工具":
              this.deleteQualityAppliance(tagId);
              break;
            case "不良代号":
              this.deleteQualityUnqualified(tagId);
              break;
            case "检测标准":
              this.deleteQualityStandard(tagId);
              break;
            default:
              break;
          }
        })
        .catch(() => {});
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //查看详情
    lookDetail(row, event, column) {
      this.detailDialog = true;
      this.detailContent = {
        code: "",
        name: "",
        dec: "",
        content: "",
        proName: "",
        operating: "",
        value: ""
      };
      switch (this.active) {
        case "检测类型":
          this.queryQualityProjectType("detail", row.quality_project_type_id);
          break;
        case "检测项目":
          this.queryQualityProject(
            "detail",
            row.quality_project_id,
            row.quality_project_type_id
          );
          break;
        case "检测方式":
          this.queryQualityCheckMethod("detail", row.quality_check_method_id);
          break;
        case "检测工具":
          this.queryQualityAppliance("detail", row.quality_appliance_id);
          break;
        case "不良代号":
          this.queryQualityUnqualified("detail", row.quality_unqualified_id);
          break;
        case "检测标准":
          this.queryQualityStandard(
            "detail",
            row.quality_standard_id,
            row.quality_project_id
          );
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.qualityBaseData {
  .switcher {
    .size {
      width: 100px;
    }
  }
  .leftBox {
    width: 300px;
    height: -moz-calc(100vh - 120px);
    height: -webkit-calc(100vh - 120px);
    height: calc(100vh - 120px);
    background-color: rgb(221, 237, 236);
    border-right: 1px solid #dcdcdc;
    ul > li {
      width: 299px;
      height: 60px;
      text-align: center;
      line-height: 60px;
    }
    .active {
      background-color: #fff;
      color: rgb(0, 228, 189);
      // background-color: rgba(0, 228, 189, 1);
    }
  }
  .rightBox {
    width: -moz-calc(100% - 300px);
    width: -webkit-calc(100% - 300px);
    width: calc(100% - 300px);
    height: -moz-calc(100vh - 120px);
    height: -webkit-calc(100vh - 120px);
    height: calc(100vh - 120px);
  }
  .line {
    text-align: center;
  }
  .detail {
    line-height: 30px;
  }
}
</style>