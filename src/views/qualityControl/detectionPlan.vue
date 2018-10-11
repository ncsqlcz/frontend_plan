<!--品质检测计划-->
<template>
  <div id="detectionPlan">
    <el-row>
      <el-col :span="24"
              class="switcher">

        <el-popover placement="bottom"
                    width="120"
                    v-model="visible">
          <ul>
            <li>
              <el-button type="primary"
                         class="productType"
                         size="small"
                         @click="selectType('IQC')">IQC</el-button>
            </li>
            <li>
              <el-button type="primary"
                         class="productType"
                         size="small"
                         @click="selectType('PQC')">PQC</el-button>
            </li>
            <li>
              <el-button type="primary"
                         class="productType"
                         size="small"
                         @click="selectType('FQC')">FQC</el-button>
            </li>
          </ul>
          <el-button type="primary"
                     class="ml-5"
                     slot="reference">创建计划</el-button>
        </el-popover>
        <div class="filter">
          <div class="size1 fl mr-3">
            <el-select v-model="setPlanState"
                       @change="changeSetPlanState">
              <el-option v-for="item in setPlanStateList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="size1 fl mr-3">
            <el-select v-model="state"
                       @change="changeState">
              <el-option v-for="item in stateList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="size2 fl mr-3">
            <el-select v-model="type"
                       @change="changeType">
              <el-option v-for="item in typeList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>

          </div>
          <div class="fr size3">
            <el-input placeholder="搜索编号或名称"
                      v-model="selectVal"
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
    <!-- <detectionPlanList ref="detectionPlanList"></detectionPlanList> -->
    <!--检测计划列表-->
    <div id="detectionPlanList">
      <div class="myWorkOrderList">
        <el-table :data="detectionPlanList"
                  :header-cell-style="{'background-color':'#ecf5ff'}"
                  style="width: 100%;"
                  max-height="800"
                  v-loading="loading"
                  @row-click="checkDetails">
          <el-table-column label="计划编号"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_plan_number"></span>
            </template>
          </el-table-column>
          <el-table-column label="计划名称"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_plan_name"></span>
            </template>
          </el-table-column>
          <el-table-column label="计划进度"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_plan_schedule"></span>
            </template>
          </el-table-column>
          <el-table-column label="计划时间"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_plan_complete_time"></span>
            </template>
          </el-table-column>
          <el-table-column label="状态"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="work.transitionSetPlanStatus(scope.row.quality_plan_status)"></span>
            </template>
          </el-table-column>
          <el-table-column label="创建人"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_plan_create_people_name"></span>
            </template>
          </el-table-column>
          <el-table-column label="负责人"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="scope.row.quality_plan_duty_people_name"></span>
            </template>
          </el-table-column>
          <!--    <el-table-column fixed="right"
                           label="操作"
                           width="200"
                           align="center">
            <template slot-scope="scope">
              <el-button type="text"
                         size="small"
                         @click.stop="delectDetails(scope.$index, detectionPlanList, scope.row)">删 除</el-button>
              <el-button type="text"
                         size="small"
                         @click.stop="editDetail(scope.row)">编 辑</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-col :span="24"
                class="center mt-1">
          <!--分页 -->
          <el-pagination layout="total, sizes, prev, pager ,next"
                         :page-size="pagination.pageSize"
                         :total="pagination.total"
                         @current-change="handlePageChange"
                         @size-change="handleSizeChange">
          </el-pagination>
          <!-- 分页end -->
        </el-col>
      </div>
      <!-- :title="workOrderTitle" -->
      <el-dialog :visible.sync="dialogDetail"
                 class="detailDialog"
                 width="450px">
        <!--检测计划列表详细-->
        <div class="planListDetail">
          <el-row class="conTxt">
            <ul class="fl"
                style="width:350px">
              <li v-text="'计划编号：'+planDetailData.quality_plan_number"></li>
              <li v-text="'计划名称：'+planDetailData.quality_plan_name"></li>
              <li v-text="'生产批号：'+planDetailData.quality_plan_batch"></li>
              <li v-text="'工序：'+planDetailData.workstage_basics_name"></li>
              <li v-text="'计划时间：'+planDetailData.quality_plan_complete_time"></li>
              <li>计划负责人：
                <el-input v-model="planDetailData.quality_plan_duty_people_name"
                          size="mini"
                          class="inputSize pointer"
                          readonly
                          @click.native="selectPlanDirector"></el-input>
              </li>
            </ul>
            <ul class="fr">
              <el-button type="primary"
                         size="small"
                         class="completeButton"
                         icon="el-icon-edit"
                         v-if="editVisible"
                         @click="editPlanDetail"></el-button>
              <el-button type="primary"
                         size="small"
                         class="completeButton"
                         v-else
                         @click="completeEdit">完成</el-button>
            </ul>
          </el-row>
          <!--修改历史button-->
          <el-row>
            <el-row class="my-2">
              <el-button size="small"
                         type="primary"
                         @click="lookModHistory(planDetailData.quality_plan_id)">修改历史</el-button>
            </el-row>
            <!--方案折叠步骤条-->
            <el-collapse v-model="activeNames"
                         accordion
                         @change="handleChange">
              <el-collapse-item :title="item.quality_template_name"
                                name="1"
                                v-for="(item, index) in planDetailData.qualityPlanTemplates"
                                :key="index">
                <el-table :data="item.qualityReports"
                          style="width: 100%;max-height:250px;"
                          v-loading="loading">
                  <el-table-column label="报告名称">
                    <template slot-scope="scope">
                      <span v-if="editVisible">{{scope.row.quality_report_name}}</span>
                      <el-input v-model="scope.row.quality_report_name"
                                auto-complete="off"
                                size="small"
                                v-else></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="quality_report_number"
                                   label="PQC单号">
                  </el-table-column>
                  <el-table-column label="负责人">
                    <template slot-scope="scope">
                      <span v-if="editVisible">{{ scope.row.quality_report_duty_people_name }}</span>
                      <el-input placeholder=""
                                v-model="scope.row.quality_report_duty_people_name"
                                size="small"
                                readonly
                                class="pointer"
                                @click.native="selectDetailDirector(index, scope.$index)"
                                v-else>
                        <i slot="prefix"
                           class="el-input__icon el-icon-search"></i>
                      </el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </el-row>
          <!-- 修改历史 -->
          <el-dialog title="修改历史"
                     :visible.sync="innerVisible"
                     append-to-body>
            <div class="modContent"
                 v-loading="loading">
              <el-table :data="modHisList"
                        style="width: 100%;max-height:250px;"
                        v-loading="modHisLoading"
                        height="250">
                <el-table-column prop="createName"
                                 label="修改人">
                </el-table-column>
                <el-table-column prop="time"
                                 label="操作时间">
                </el-table-column>
                <el-table-column prop="oldName"
                                 label="计划旧负责人">
                </el-table-column>
                <el-table-column prop="newName"
                                 label="计划新负责人">
                </el-table-column>
              </el-table>
            </div>
          </el-dialog>
        </div>
      </el-dialog>
    </div>
    <!--新建计划dialog-->
    <el-dialog :title="planTitle"
               :visible.sync="planVisible"
               width="40%"
               min-width="400"
               @close="clearForm">
      <!--IQC创建计划-->
      <div class="iqcPlan"
           v-if="planTitle === 'IQC'">
        <el-form :model="iqcForm"
                 :rules="iqcRules"
                 label-width="100px"
                 label-position="left"
                 ref="planForm"
                 status-icon
                 style="border:1px solid #CCC;padding: 16px 10px; margin-top: -16px">
          <ul>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="计划编号">
                    <div>{{iqcForm.planNumber}}</div>
                  </el-form-item>
                </li>
                <li class="fl liWidth ml-5">
                  <el-form-item label="计划名称"
                                prop="planName">
                    <el-input v-model.number="iqcForm.planName"
                              auto-complete="off"
                              placeholder="请输入计划名称"
                              size="small"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="物料名称"
                                prop="materialsName">
                    <el-input v-model.number="iqcForm.materialsName"
                              auto-complete="off"
                              readonly
                              class="pointer"
                              placeholder="请选择物料名称"
                              size="small"
                              @click.native="selectMaterialsName">
                      <i slot="prefix"
                         class="el-input__icon el-icon-search"></i>
                    </el-input>
                  </el-form-item>
                </li>
                <li class="fl liWidth ml-5">
                  <el-form-item label="物料批次"
                                prop="materialsBath">
                    <el-input placeholder="请填写物料批次"
                              v-model="iqcForm.materialsBath"
                              size="small">
                    </el-input>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="检验方式"
                                prop="testMethod">
                    <el-input placeholder="请选择检验方式"
                              v-model="iqcForm.testMethod"
                              size="small"
                              readonly
                              class="pointer"
                              @click.native="selectTestMethod">
                      <i slot="prefix"
                         class="el-input__icon el-icon-search"></i>
                    </el-input>
                  </el-form-item>
                </li>
                <li class="fl liWidth ml-5">
                  <el-form-item label="检测数量"
                                prop="testAmount">
                    <el-input v-model.number="iqcForm.testAmount"
                              auto-complete="off"
                              placeholder="请输入检测数量"
                              size="small"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <li>
              <el-form-item label="计划时间"
                            prop="planTime">
                <el-date-picker v-model="iqcForm.planTime"
                                type="datetimerange"
                                start-placeholder="预计开始时间"
                                end-placeholder="预计完成时间"
                                :default-time="['12:00:00', '08:00:00']"
                                size="small">
                </el-date-picker>
              </el-form-item>
            </li>
            <li class="liWidth">
              <el-form-item label="计划负责人"
                            prop="programDirector">
                <el-input placeholder="请选择计划负责人"
                          v-model="iqcForm.programDirector"
                          size="small"
                          readonly
                          class="pointer"
                          @click.native="selectProgramDirector">
                  <i slot="prefix"
                     class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </li>
            <el-form-item label="备注"
                          prop="remarks">
              <el-input type="textarea"
                        placeholder="请填写备注"
                        v-model="iqcForm.remarks"
                        resize="none"
                        size="small">
              </el-input>
            </el-form-item>
          </ul>
        </el-form>
        <div slot="footer"
             class="dialog-footer selectButt">
          <el-button type="primary"
                     @click="selectProject"
                     size="mini">选择方案</el-button>
        </div>
        <el-table :data="iqcTestData"
                  style="width: 100%; border:1px solid #CCC">
          <el-table-column label="检测方案"
                           width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检测次数"
                           width="180">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.number"
                               controls-position="right"
                               @change="planNumberChange"
                               :min="1"
                               :max="10"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="danger"
                         @click="handleDeleteProject(scope.$index, iqcTestData)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer"
             class="dialog-footer selectButt">
          <el-button type="primary"
                     @click="nextStep"
                     size="mini">下一步</el-button>
        </div>
        <el-dialog title="IQC"
                   :visible.sync="iqcInnerVisible"
                   append-to-body>
          <el-collapse v-model="iqcActiveName"
                       accordion>
            <el-collapse-item title="Test_方案"
                              name="1">
              <el-table :data="iqcInnerTestData"
                        style="width: 100%">
                <el-table-column label="报告名称"
                                 width="240">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.reportName"
                              auto-complete="off"
                              placeholder="请输入报告名称"
                              size="small"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="IQC单号"
                                 width="240">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.orderNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="负责人"
                                 width="300">
                  <template slot-scope="scope">
                    <el-input placeholder="请选择负责人"
                              v-model="scope.row.directorName"
                              size="small"
                              readonly
                              class="pointer"
                              @click.native="selectDirector(scope.$index)">
                      <i slot="prefix"
                         class="el-input__icon el-icon-search"></i>
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
          <div slot="footer"
               class="dialog-footer">
            <el-button type="primary"
                       size="small"
                       @click="newDetectionPlan">完 成</el-button>
          </div>
        </el-dialog>
      </div>

      <!--PQC创建计划-->
      <div class="pqcPlan"
           v-if="planTitle === 'PQC'">
        <el-form :model="pqcForm"
                 :rules="pqcRules"
                 label-width="100px"
                 label-position="left"
                 ref="planForm"
                 status-icon
                 style="border:1px solid #CCC;padding: 16px 10px; margin-top: -16px">
          <ul>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="计划编号">
                    <div>{{pqcForm.planNumber}}</div>
                  </el-form-item>
                </li>
                <li class="fl liWidth ml-5">
                  <el-form-item label="计划名称"
                                prop="planName">
                    <el-input v-model.number="pqcForm.planName"
                              auto-complete="off"
                              placeholder="请输入计划名称"
                              size="small"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="生产批次"
                                prop="productBath">
                    <el-input v-model.number="pqcForm.productBath"
                              auto-complete="off"
                              readonly
                              class="pointer"
                              placeholder="请选择生产批次"
                              size="small"
                              @click.native="selectProductBath">
                      <i slot="prefix"
                         class="el-input__icon el-icon-search"></i>
                    </el-input>
                  </el-form-item>
                </li>
                <li class="fl liWidth ml-5">
                  <el-form-item label="工序"
                                prop="process">
                    <el-input v-model.number="pqcForm.process"
                              auto-complete="off"
                              readonly
                              class="pointer"
                              placeholder="请选择工序"
                              size="small"
                              @click.native="selectProcess">
                      <i slot="prefix"
                         class="el-input__icon el-icon-search"></i>
                    </el-input>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="检验方式"
                                prop="testMethod">
                    <el-input placeholder="请选择检验方式"
                              v-model="pqcForm.testMethod"
                              size="small"
                              readonly
                              class="pointer"
                              @click.native="selectTestMethod">
                      <i slot="prefix"
                         class="el-input__icon el-icon-search"></i>
                    </el-input>
                  </el-form-item>
                </li>
                <li class="fl liWidth ml-5">
                  <el-form-item label="检测数量"
                                prop="testAmount">
                    <el-input v-model.number="pqcForm.testAmount"
                              auto-complete="off"
                              placeholder="请输入检测数量"
                              size="small"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <li>
              <el-form-item label="计划时间"
                            prop="planTime">
                <el-date-picker v-model="pqcForm.planTime"
                                type="datetimerange"
                                start-placeholder="预计开始时间"
                                end-placeholder="预计完成时间"
                                :default-time="['12:00:00', '08:00:00']"
                                size="small">
                </el-date-picker>
              </el-form-item>
            </li>
            <li class="liWidth">
              <el-form-item label="计划负责人"
                            prop="programDirector">
                <el-input placeholder="请选择计划负责人"
                          v-model="pqcForm.programDirector"
                          size="small"
                          readonly
                          class="pointer"
                          @click.native="selectProgramDirector">
                  <i slot="prefix"
                     class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </li>
            <el-form-item label="备注"
                          prop="remarks">
              <el-input type="textarea"
                        placeholder="请填写备注"
                        v-model="pqcForm.remarks"
                        resize="none"
                        size="small">
              </el-input>
            </el-form-item>
          </ul>
        </el-form>

        <div slot="footer"
             class="dialog-footer selectButt">
          <el-button type="primary"
                     @click="selectProject"
                     size="mini">选择方案</el-button>
        </div>
        <el-table :data="pqcTestData"
                  style="width: 100%; border:1px solid #CCC"
                  height="300">
          <el-table-column label="检测方案"
                           width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.quality_template_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检测次数"
                           width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.quality_plan_check_frequency }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="danger"
                         @click="handleDeleteProject(scope.$index, pqcTestData)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div slot="footer"
             class="dialog-footer selectButt">
          <el-button type="primary"
                     @click="nextStep"
                     size="mini">下一步</el-button>
        </div>

        <el-dialog title="PQC"
                   :visible.sync="pqcInnerVisible"
                   append-to-body>
          <el-collapse v-model="pqcActiveName"
                       accordion>
            <el-collapse-item title="Test_方案"
                              name="1">
              <el-table :data="pqcInnerTestData"
                        style="width: 100%">
                <el-table-column label="报告名称"
                                 width="240">
                  <template slot-scope="scope">
                    <el-input v-model="pqcForm.scope.row.reportName"
                              auto-complete="off"
                              placeholder="请输入报告名称"
                              size="small"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="IQC单号"
                                 width="240">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.orderNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="负责人"
                                 width="300">
                  <template slot-scope="scope">
                    <el-input placeholder="请选择负责人"
                              v-model="scope.row.director"
                              size="small"
                              readonly
                              class="pointer"
                              @click.native="selectDirector(scope.$index)">
                      <i slot="prefix"
                         class="el-input__icon el-icon-search"></i>
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-dialog>
      </div>

      <!--FQC创建计划-->

      <div class="fqcPlan"
           v-if="planTitle === 'FQC'">
        <el-form :model="fqcForm"
                 :rules="fqcRules"
                 label-width="100px"
                 label-position="left"
                 ref="form"
                 status-icon
                 style="border:1px solid #CCC;padding: 16px 10px; margin-top: -16px">
          <ul>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="计划编号">
                    <div>{{fqcForm.planNumber}}</div>
                  </el-form-item>
                </li>
                <li class="fl liWidth ml-5">
                  <el-form-item label="计划名称"
                                prop="planName">
                    <el-input v-model.number="fqcForm.planName"
                              auto-complete="off"
                              placeholder="请输入计划名称"
                              size="small"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="生产批次"
                                prop="productBath">
                    <el-input v-model.number="fqcForm.productBath"
                              auto-complete="off"
                              readonly
                              class="pointer"
                              placeholder="请选择生产批次"
                              size="small"
                              @click.native="selectProductBath">
                      <i slot="prefix"
                         class="el-input__icon el-icon-search"></i>
                    </el-input>
                  </el-form-item>
                </li>
                <li class="fl liWidth ml-5">
                  <el-form-item label="成品名称"
                                prop="finishedProductName">
                    <span>{{fqcForm.finishedProductName}}</span>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <li class="before after">
              <ul>
                <li class="fl liWidth">
                  <el-form-item label="检验方式"
                                prop="testMethod">
                    <el-input placeholder="请选择检验方式"
                              v-model="fqcForm.testMethod"
                              size="small"
                              readonly
                              class="pointer"
                              @click.native="selectTestMethod">
                      <i slot="prefix"
                         class="el-input__icon el-icon-search"></i>
                    </el-input>
                  </el-form-item>
                </li>
                <li class="fl liWidth ml-5">
                  <el-form-item label="检测数量"
                                prop="testAmount">
                    <el-input v-model.number="fqcForm.testAmount"
                              auto-complete="off"
                              placeholder="请输入检测数量"
                              size="small"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </li>
            <li>
              <el-form-item label="计划时间"
                            prop="planTime">
                <el-date-picker v-model="fqcForm.planTime"
                                type="datetimerange"
                                start-placeholder="预计开始时间"
                                end-placeholder="预计完成时间"
                                :default-time="['12:00:00', '08:00:00']"
                                size="small">
                </el-date-picker>
              </el-form-item>
            </li>
            <li class="liWidth">
              <el-form-item label="计划负责人"
                            prop="programDirector">
                <el-input placeholder="请选择计划负责人"
                          v-model="fqcForm.programDirector"
                          size="small"
                          readonly
                          class="pointer"
                          @click.native="selectProgramDirector">
                  <i slot="prefix"
                     class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </li>
            <el-form-item label="备注"
                          prop="remarks">
              <el-input type="textarea"
                        placeholder="请填写备注"
                        v-model="fqcForm.remarks"
                        resize="none"
                        size="small">
              </el-input>
            </el-form-item>
          </ul>
        </el-form>

        <div slot="footer"
             class="dialog-footer selectButt">
          <el-button type="primary"
                     @click="selectProject"
                     size="mini">选择方案</el-button>
        </div>

        <el-table :data="fqcTestData"
                  style="width: 100%; border:1px solid #CCC">
          <el-table-column label="检测方案"
                           width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.plan }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检测次数"
                           width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.frequency }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="danger"
                         @click="handleDeleteProject(scope.$index, fqcTestData)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div slot="footer"
             class="dialog-footer selectButt">
          <el-button type="primary"
                     @click="nextStep"
                     size="mini">下一步</el-button>
        </div>

        <el-dialog title="IQC"
                   :visible.sync="fqcInnerVisible"
                   append-to-body>
          <el-collapse v-model="fqcActiveName"
                       accordion>
            <el-collapse-item title="Test_方案"
                              name="1">
              <el-table :data="fqcInnerTestData"
                        style="width: 100%">
                <el-table-column label="报告名称"
                                 width="240">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.reportName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="IQC单号"
                                 width="240">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.orderNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="负责人"
                                 width="300">
                  <template slot-scope="scope">
                    <el-input placeholder="请选择负责人"
                              v-model="scope.row.director"
                              size="small"
                              readonly
                              class="pointer"
                              @click.native="selectDirector">
                      <i slot="prefix"
                         class="el-input__icon el-icon-search"></i>
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-dialog>
      </div>

    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "detectionPlan",
  data() {
    var checkRemarks = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("备注不能为空"));
      } else if (!/^\S{1,50}$/.test(value)) {
        callback(new Error("50字以内"));
      } else {
        callback();
      }
    };
    return {
      setPlanState: "0",
      setPlanStateList: [
        {
          value: "0",
          label: "检测中"
        },
        {
          value: "1",
          label: "检测完成"
        },
        {
          value: "2",
          label: "关闭"
        }
      ],
      type: "all",
      typeList: [
        {
          value: "all",
          label: "所有"
        },
        {
          value: "establishStaff",
          label: "我创建的"
        },
        {
          value: "principal",
          label: "我负责的"
        }
      ],
      state: "0",
      stateList: [
        {
          value: "0",
          label: "IQC"
        },
        {
          value: "1",
          label: "PQC"
        },
        {
          value: "2",
          label: "FQC"
        }
      ],
      selectVal: "", //计划编码或者名称
      planVisible: false, //创建计划dialog显示
      planTitle: null, //创建计划dialog标题
      visible: false, //新建检测内容显示(IQC PQC FQC)
      detectionPlanList: [], //品质计划list
      planDetailData: {}, //品质计划详情数据
      dialogDetail: false, //计划详情显示
      loading: false, //加载
      pagination: {
        page: 1, //页数
        pageSize: 10, //每页的条数
        total: 0
      },
      activeNames: "0", //折叠选项
      innerVisible: false, //修改弹窗
      loading: false, //修改loading
      modHisList: [], //修改历史list
      modHisLoading: false, //修改历史加载
      newSelected: {}, //新选中的计划负责人
      planId: null, //计划id
      //iqc计划form
      iqcForm: {
        planNumber: "", //计划编号
        planName: "", //计划名称
        materialsName: "", //物料名称
        // materialsType: "", //物料类型
        materialsBath: "", //物料批次
        testMethod: "", //检验方式
        testAmount: "", //检测数量
        planTime: "", //计划时间
        programDirector: "", //计划负责人
        remarks: "" //备注
      },
      //表单校验iqcRules
      iqcRules: {
        planNumber: [],
        planName: [
          { required: true, message: "请输入计划名称", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        materialsName: [
          { required: true, message: "请选择物料名称", trigger: "change" }
        ],
        // materialsType: [],
        materialsBath: [
          { required: true, message: "请输入物料批次", trigger: "blur" }
        ],
        testMethod: [
          { required: true, message: "请选择检验方式", trigger: "change" }
        ],
        testAmount: [
          { required: true, message: "请输入检测数量", trigger: "blur" }
        ],
        planTime: [
          { required: true, message: "请选择计划时间", trigger: "change" }
        ],
        programDirector: [
          { required: true, message: "请选择计划负责人", trigger: "change" }
        ],
        remarks: [
          { required: true, validator: checkRemarks, trigger: "change" }
        ]
      },
      selectedMaterials: null, //选中物料
      checkMethod: null, //选中检测方式
      selectedProject: [], //选中的方案
      selectedProcess: null, //选中的工序
      //iqc检测方案 次数
      iqcTestData: [
        // {
        //   plan: "Test_方案",
        //   frequency: "2"
        // }
      ],
      iqcInnerTestData: [], //iqc检测方案数据
      iqcInnerVisible: false, //检测方案dialog显示
      iqcActiveName: "0",

      //pqc计划form
      pqcForm: {
        planNumber: "", //计划编号
        planName: "", //计划名称
        productBath: "", //生产批次
        process: "", //工序
        testMethod: "", //检验方式
        testAmount: "", //检测数量
        planTime: "", //计划时间
        programDirector: "", //计划负责人
        remarks: "" //备注
      },
      //表单校验pqcRules
      pqcRules: {
        planNumber: [],
        planName: [
          { required: true, message: "请输入计划名称", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        productBath: [
          { required: true, message: "请选择生产批次", trigger: "change" }
        ],
        process: [{ required: true, message: "请选择工序", trigger: "change" }],
        testMethod: [
          { required: true, message: "请选择检验方式", trigger: "change" }
        ],
        testAmount: [
          { required: true, message: "请输入检测数量", trigger: "blur" }
        ],
        planTime: [
          { required: true, message: "请选择计划时间", trigger: "change" }
        ],
        programDirector: [
          { required: true, message: "请选择计划负责人", trigger: "change" }
        ],
        remarks: [
          { required: true, validator: checkRemarks, trigger: "change" }
        ]
      },
      //pqc检测方案 次数
      pqcTestData: [
        // {
        //   plan: "Test_方案",
        //   frequency: "2"
        // }
      ],
      pqcInnerTestData: [
        {
          reportName: "Test_方案名称",
          orderNumber: "20180725110035",
          director: "负责人"
        }
      ],
      pqcInnerVisible: false, //检测方案dialog显示
      pqcActiveName: "0",
      //fqc计划form
      fqcForm: {
        planNumber: "", //计划编号
        planName: "", //计划名称
        productBath: "", //生产批次
        finishedProductName: "", //成品名称
        testMethod: "", //检验方式
        testAmount: "", //检测数量
        planTime: "", //计划时间
        programDirector: "", //计划负责人
        remarks: "" //备注
      },
      //表单校验fqcRules
      fqcRules: {
        planNumber: [],
        planName: [
          { required: true, message: "请输入计划名称", trigger: "change" },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        productBath: [
          { required: true, message: "请选择生产批次", trigger: "change" }
        ],
        finishedProductName: [],
        testMethod: [
          { required: true, message: "请选择检验方式", trigger: "change" }
        ],
        testAmount: [
          { required: true, message: "请输入检测数量", trigger: "blur" }
        ],
        planTime: [
          { required: true, message: "请选择计划时间", trigger: "change" }
        ],
        programDirector: [
          { required: true, message: "请选择计划负责人", trigger: "change" }
        ],
        remarks: [
          { required: true, validator: checkRemarks, trigger: "change" }
        ]
      },
      //fqc检测方案 次数
      fqcTestData: [
        // {
        //   plan: "Test_方案",
        //   frequency: "2"
        // }
      ],
      fqcInnerTestData: [
        // {
        //   reportName: "Test_方案名称",
        //   orderNumber: "20180725110035",
        //   director: "负责人",
        // }
      ],
      fqcInnerVisible: false, //检测方案dialog显示
      fqcActiveName: "0",
      editVisible: true, //编辑显示
      qualityPlanTemplates: [] //计划-方案中间表实体类字符串
    };
  },
  mounted() {
    this.queryQualityPlan("all", this.setPlanState, this.state);
  },
  methods: {
    //查看检测计划信息，详情
    async queryQualityPlan(
      type,
      processStatus,
      planType,
      planId,
      createPeople,
      dutyPeople,
      keyword
    ) {
      this.loading = true; // 等待
      const e = await this.ajax("queryQualityPlan", {
        type, //类型（detail：查看检测计划详情 all:查看所有
        processStatus, //计划的进行状态（0：进行中，1：已完成，2：已关闭）
        planType, //计划的类型(计划类型（0：iqc，1：pqc，2：fqc）
        createPeople, //创建人id
        dutyPeople, //负责人id
        planId, //检测计划id
        keyword, //编号名称模糊搜索
        page: this.pagination.page, //消息状态中的页数
        pageSize: this.pagination.pageSize //页大小
      });
      setTimeout(() => {
        this.loading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        switch (type) {
          case "all":
            this.detectionPlanList = e.map.qualityPlanList;
            this.pagination.total = e.map.line;
            break;
          case "detail":
            this.planDetailData = e.map.planDetailDTO;
            break;
          default:
            break;
        }
      } else if (e.status === 2) {
        //暂无数据
        switch (type) {
          case "all":
            this.pagination.total = 0;
            this.detectionPlanList = [];
            break;
          case "detail":
          default:
            break;
        }
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //新增检测计划
    async saveQualityPlan(qualityPlan, qualityPlanTemplates) {
      const e = await this.ajax("saveQualityPlan", {
        qualityPlan, //计划实体类字符串
        qualityPlanTemplates //计划-方案中间表实体类字符串
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "新增计划成功",
          type: "success"
        });
        this.queryQualityPlan("all", this.setPlanState, this.state);
      } else if (e.status === 2) {
        //暂无数据
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //删除计划
    async deleteQualityPlan(planId) {
      const e = await this.ajax("deleteQualityPlan", {
        planId //计划id
      });
      if (e.status === 0) {
        //表示成功
        this.$message({
          message: "删除计划成功",
          type: "success"
        });
      } else if (e.status === 2) {
        //暂无数据
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //生成计划编号
    async generateNumber(type, number, i) {
      const e = await this.ajax("generateNumber", {
        category: "plan",
        type
      });
      if (e.status === 0) {
        //表示成功
        switch (number) {
          case "编号":
            switch (this.planTitle) {
              case "IQC":
                this.iqcForm.planNumber = e.data;
                break;
              case "PQC":
                this.pqcForm.planNumber = e.data;
                break;
              case "FQC":
                this.fqcForm.planNumber = e.data;
                break;
              default:
                break;
            }
            break;
          case "单号":
            this.iqcInnerTestData[i].orderNumber = e.data;
            break;
          default:
            break;
        }
      } else if (e.status === 2) {
        //暂无数据
        this.iqcForm.planNumber = "";
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //查询修改历史
    async lookModHistory(planId) {
      this.innerVisible = true; //修改弹出
      this.modHisLoading = true; // 等待
      this.modHisList = [];
      const e = await this.ajax("queryPlanUpdateHistory", {
        planId //计划id
      });
      this.modHisList = [];
      setTimeout(() => {
        this.modHisLoading = false; // 等待结束
      }, 500);
      if (e.status === 0) {
        //表示成功
        this.modHisList.push(e.map.planUpdateHistory);
      } else if (e.status === 2) {
        //暂无数据
        this.modHisList = [];
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //修改负责人
    async updateQualityPlan() {
      const e = await this.ajax("updateQualityPlan", {
        planId: this.planDetailData.quality_plan_id, //计划id
        dutyPeople: this.newSelected.user_employees_id, //负责人id
        dutyPeopleName: this.newSelected.user_employees_name //负责人名称
      });
      if (e.status === 0) {
        this.$message({
          message: "修改计划负责人成功",
          type: "success"
        });
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    //在计划里修改报告的名字和负责人
    async updateReportInPlan(arr) {
      const e = await this.ajax("updateReportInPlan", {
        reports: arr //报告数组
      });
      if (e.status === 0) {
        this.editVisible = true;
        this.$message({
          message: "修改成功",
          type: "success"
        });
      } else {
        this.$message({
          message: e.msg,
          type: "error"
        });
      }
    },
    // 页码改变
    handlePageChange(val) {
      this.pagination.page = val;
      this.queryQualityPlan("all", this.setPlanState, this.state);
    },
    // 每页数量改变
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryQualityPlan("all", this.setPlanState, this.state);
    },
    //查看详情
    checkDetails(row) {
      this.dialogDetail = true;
      this.queryQualityPlan(
        "detail",
        null,
        row.quality_plan_type,
        row.quality_plan_id
      );
    },
    //选择计划负责人
    selectPlanDirector() {
      this.$mesEmployee
        .show("选择计划负责人", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            // 额外参数
            keyword: ""
          }
        })
        .then(res => {
          // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
          this.planDetailData.quality_plan_duty_people_name =
            res.rows[0].user_employees_name;
          this.newSelected = res.rows[0]; //当前选中的对象
          setTimeout(() => {
            this.updateQualityPlan();
          }, 500);
        });
    },
    //选择工序
    selectProcess() {
      this.$mesProcessBasic
        .show("选择工序", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            keyword: ""
          }
        })
        .then(res => {
          this.pqcForm.process = res.rows[0].production_process_name;
          this.selectedProcess = res.rows[0]; //当前选中的对象
        });
    },
    //选择物料名称
    selectMaterialsName() {
      this.$mesMeterialsName
        .show("选择物料名称", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            keyword: ""
          }
        })
        .then(res => {
          this.iqcForm.materialsName = res.rows[0].material_name;
          this.selectedMaterials = res.rows[0]; //当前选中的对象
        });
    },
    //选择检验方式
    selectTestMethod() {
      switch (this.planTitle) {
        case "IQC":
          this.$mesIqcCheckMethod
            .show("选择IQC检验方式", {
              reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
              multiple: false, // 是否多选
              params: {
                keyword: ""
              }
            })
            .then(res => {
              this.iqcForm.testMethod = res.rows[0].quality_check_method_name;
              this.checkMethod = res.rows[0];
            });
          break;
        case "PQC":
          this.$mesPqcCheckMethod
            .show("选择PQC检验方式", {
              reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
              multiple: false, // 是否多选
              params: {
                // 额外参数
                keyword: ""
              }
            })
            .then(res => {
              this.pqcForm.testMethod = res.rows[0].quality_check_method_name;
            });
          break;
        case "FQC":
          this.$mesFqcCheckMethod
            .show("选择FQC检验方式", {
              reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
              multiple: false, // 是否多选
              params: {
                // 额外参数
                keyword: ""
              }
            })
            .then(res => {
              this.fqcForm.testMethod = res.rows[0].quality_check_method_name;
            });
          break;
        default:
          break;
      }
    },
    //新建计划选择计划负责人
    selectProgramDirector() {
      this.$mesEmployee
        .show("选择计划负责人", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            // 额外参数
            keyword: ""
          }
        })
        .then(res => {
          switch (this.planTitle) {
            case "IQC":
              this.iqcForm.programDirector = res.rows[0].user_employees_name;
              this.planDutyPeople = res.rows[0];
              break;
            case "PQC":
              this.pqcForm.programDirector = res.rows[0].user_employees_name;
              this.planDutyPeople = res.rows[0];
              break;
            case "FQC":
              this.fqcForm.programDirector = res.rows[0].user_employees_name;
              this.planDutyPeople = res.rows[0];
              break;
            default:
              break;
          }
        });
    },
    //选择方案
    selectProject() {
      switch (this.planTitle) {
        case "IQC":
          this.$mesQualityProject
            .show("选择IQC方案", {
              reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
              multiple: false, // 是否多选
              params: {
                // 额外参数
                keyword: "",
                templateType: "0"
              }
            })
            .then(res => {
              var len = this.iqcTestData.length;
              if (len > 0) {
                for (var i = 0; i < len; i++) {
                  if (
                    !(
                      this.iqcTestData[i].name ===
                      res.rows[0].quality_template_name
                    )
                  ) {
                    this.iqcTestData.push({
                      name: res.rows[0].quality_template_name,
                      number: 1
                    });
                  } else {
                    this.$message({
                      message: "不要选择重复方案",
                      type: "warning"
                    });
                  }
                }
              } else {
                this.iqcTestData.push({
                  name: res.rows[0].quality_template_name,
                  number: 1
                });
                this.selectedProject.push(res.rows[0]);
              }
            });
          break;
        case "PQC":
          this.$mesQualityProject
            .show("选择PQC方案", {
              reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
              multiple: false, // 是否多选
              params: {
                // 额外参数
                keyword: "",
                templateType: "1"
              }
            })
            .then(res => {
              var len = this.pqcTestData.length;
              if (len > 0) {
                for (var i = 0; i < len; i++) {
                  if (
                    !(
                      this.pqcTestData[i].name ===
                      res.rows[0].quality_template_name
                    )
                  ) {
                    this.pqcTestData.push({
                      name: res.rows[0].quality_template_name,
                      number: 1
                    });
                  } else {
                    this.$message({
                      message: "不要选择重复方案",
                      type: "warning"
                    });
                  }
                }
              } else {
                this.pqcTestData.push({
                  name: res.rows[0].quality_template_name,
                  number: 1
                });
              }
            });
          break;
        case "FQC":
          break;
          this.$mesQualityProject
            .show("选择FQC方案", {
              reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
              multiple: false, // 是否多选
              params: {
                // 额外参数
                keyword: "",
                templateType: "2"
              }
            })
            .then(res => {
              var len = this.fqcTestData.length;
              if (len > 0) {
                for (var i = 0; i < len; i++) {
                  if (
                    !(
                      this.fqcTestData[i].name ===
                      res.rows[0].quality_template_name
                    )
                  ) {
                    this.fqcTestData.push({
                      name: res.rows[0].quality_template_name,
                      number: 1
                    });
                  } else {
                    this.$message({
                      message: "不要选择重复方案",
                      type: "warning"
                    });
                  }
                }
              } else {
                this.fqcTestData.push({
                  name: res.rows[0].quality_template_name,
                  number: 1
                });
              }
            });
        default:
          break;
      }
    },
    //选择生产批次
    selectProductBath() {
      this.$mesPlanOutline
        .show("选择生产批次", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            // 额外参数
            keyword: ""
          }
        })
        .then(res => {
          switch (this.planTitle) {
            case "PQC":
              this.pqcForm.productBath = res.rows[0].plan_batch;
              this.planDutyPeople = res.rows[0];
              break;
            case "FQC":
              this.fqcForm.productBath = res.rows[0].plan_batch;
              this.planDutyPeople = res.rows[0];
              break;
            default:
              break;
          }
        });
    },
    //删除检测方案
    handleDeleteProject(index, rows) {
      console.log(rows);
      rows.splice(index, 1);
    },
    //下一步
    nextStep() {
      this.$refs.planForm.validate(valid => {
        if (valid) {
          switch (this.planTitle) {
            case "IQC":
              this.iqcInnerTestData = [];
              for (let i = 0; i < this.iqcTestData[0].number; i++) {
                this.iqcInnerTestData.push({
                  reportName: "",
                  orderNumber: "",
                  directorName: "",
                  directorId: ""
                });
                this.generateNumber("0", "单号", i);
              }
              this.iqcInnerVisible = true;
              break;
            case "PQC":
              this.pqcInnerTestData = [];
              for (let i = 0; i < this.pqcTestData.number; i++) {
                this.pqcInnerTestData.push({
                  reportName: "",
                  orderNumber: "",
                  director: ""
                });
                this.generateNumber("1", "单号", i);
              }
              this.pqcInnerVisible = true;
              break;
            case "FQC":
              this.fqcInnerTestData = [];
              for (let i = 0; i < this.fqcTestData.number; i++) {
                this.fqcInnerTestData.push({
                  reportName: "",
                  orderNumber: "",
                  director: ""
                });
                this.generateNumber("2", "单号", i);
              }
              this.fqcInnerVisible = true;
              break;
            default:
              break;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 完成品质计划新建
    newDetectionPlan() {
      switch (this.planTitle) {
        case "IQC":
          let iqcQualityPlan = {
            quality_check_method_id: this.checkMethod.quality_check_method_id, // 检测方式id
            quality_plan_check_num: this.iqcForm.testAmount, //检测数量
            quality_plan_complete_time_start: new Date(
              this.iqcForm.planTime[0]
            ).getTime(), //计划开始时间
            quality_plan_complete_time_end: new Date(
              this.iqcForm.planTime[1]
            ).getTime(), //计划完成时间
            quality_plan_create_people: "776hjkdf356ett5h56h", //
            quality_plan_create_people_name: "李四", //
            quality_plan_duty_people: this.planDutyPeople.user_employees_id, // 计划负责人id
            quality_plan_duty_people_name: this.iqcForm.programDirector, //计划负责人
            quality_plan_name: this.iqcForm.planName, //计划名称
            quality_plan_number: this.iqcForm.planNumber, //计划编号
            quality_plan_remarks: this.iqcForm.remarks, //备注
            quality_plan_type: "0",
            warehouse_material_id: this.selectedMaterials.material_id, //物料id
            warehouse_material_name: this.iqcForm.materialsName, //物料名称
            warehouse_material_batch: this.iqcForm.materialsBath //物料批次
          };
          let iqcQualityPlanTemplates = [];
          for (let i = 0; i < this.selectedProject.length; i++) {
            qualityPlanTemplates.push({
              qualityReports: [],
              quality_plan_check_frequency: this.iqcTestData[i].number,
              quality_template_id: this.selectedProject[i].quality_template_id
            });
            this.iqcInnerTestData.forEach((item, index) => {
              qualityPlanTemplates[i].qualityReports.push({
                quality_report_create_people: "776hjkdf356ett5h56h", //
                quality_report_create_people_name: "李四", //
                quality_report_duty_people: item.directorId,
                quality_report_duty_people_name: item.directorName,
                quality_report_name: item.reportName,
                quality_report_number: item.orderNumber,
                quality_report_type: "0"
              });
            });
          }
          this.saveQualityPlan(
            JSON.stringify(iqcQualityPlan),
            JSON.stringify(iqcQualityPlanTemplates)
          );
          break;
        case "PQC":
          let pqcQualityPlan = {
            quality_check_method_id: this.checkMethod.quality_check_method_id, // 检测方式id
            quality_plan_check_num: this.iqcForm.testAmount, //检测数量
            quality_plan_complete_time_start: new Date(
              this.iqcForm.planTime[0]
            ).getTime(), //计划开始时间
            quality_plan_complete_time_end: new Date(
              this.iqcForm.planTime[1]
            ).getTime(), //计划完成时间
            quality_plan_create_people: "776hjkdf356ett5h56h", //
            quality_plan_create_people_name: "李四", //
            quality_plan_duty_people: this.planDutyPeople.user_employees_id, // 计划负责人id
            quality_plan_duty_people_name: this.iqcForm.programDirector, //计划负责人
            quality_plan_name: this.iqcForm.planName, //计划名称
            quality_plan_number: this.iqcForm.planNumber, //计划编号
            quality_plan_remarks: this.iqcForm.remarks, //备注
            quality_plan_type: "0",
            quality_plan_batch: this.iqcForm.productBath, //生成批次
            warehouse_basics_id: this.iqcForm.materialsBath, //工序id
            warehouse_basics_name: this.iqcForm.materialsName //工序名称
          };
          let pqcQualityPlanTemplates = [];
          for (let i = 0; i < this.selectedProject.length; i++) {
            qualityPlanTemplates.push({
              qualityReports: [],
              quality_plan_check_frequency: this.pqcTestData[i].number,
              quality_template_id: this.selectedProject[i].quality_template_id
            });
            this.pqcInnerTestData.forEach((item, index) => {
              qualityPlanTemplates[i].qualityReports.push({
                quality_report_create_people: "776hjkdf356ett5h56h", //
                quality_report_create_people_name: "李四", //
                quality_report_duty_people: item.directorId,
                quality_report_duty_people_name: item.directorName,
                quality_report_name: item.reportName,
                quality_report_number: item.orderNumber,
                quality_report_type: "0"
              });
            });
          }
          this.saveQualityPlan(
            JSON.stringify(pqcQualityPlan),
            JSON.stringify(pqcQualityPlanTemplates)
          );
          break;
        case "FQC":
          let fqcQualityPlan = {
            quality_check_method_id: this.checkMethod.quality_check_method_id,
            quality_plan_check_num: this.iqcForm.testAmount,
            quality_plan_complete_time_start: new Date(
              this.iqcForm.planTime[0]
            ).getTime(),
            quality_plan_complete_time_end: new Date(
              this.iqcForm.planTime[1]
            ).getTime(),
            quality_plan_create_people: "776hjkdf356ett5h56h",
            quality_plan_create_people_name: "李四",
            quality_plan_duty_people: this.planDutyPeople.user_employees_id,
            quality_plan_duty_people_name: this.iqcForm.programDirector,
            quality_plan_name: this.iqcForm.planName,
            quality_plan_number: this.iqcForm.planNumber,
            quality_plan_remarks: this.iqcForm.remarks,
            quality_plan_type: "2",
            quality_plan_batch: this.fqcForm.productBath, //生成批次
            // quality_finished_product_id: ,//产品id
            quality_finished_product_name: this.fqcForm.finishedProductName //成品名称
          };
          let fqcQualityPlanTemplates = [];
          for (let i = 0; i < this.selectedProject.length; i++) {
            qualityPlanTemplates.push({
              qualityReports: [],
              quality_plan_check_frequency: this.fqcTestData[i].number,
              quality_template_id: this.selectedProject[i].quality_template_id
            });
            this.fqcInnerTestData.forEach((item, index) => {
              qualityPlanTemplates[i].qualityReports.push({
                quality_report_create_people: "776hjkdf356ett5h56h", //
                quality_report_create_people_name: "李四", //
                quality_report_duty_people: item.directorId,
                quality_report_duty_people_name: item.directorName,
                quality_report_name: item.reportName,
                quality_report_number: item.orderNumber,
                quality_report_type: "0"
              });
            });
          }
          this.saveQualityPlan(
            JSON.stringify(fqcQualityPlan),
            JSON.stringify(fqcQualityPlanTemplates)
          );
          break;
        default:
          break;
      }
    },
    //选择负责人
    selectDirector(index) {
      this.$mesEmployee
        .show("选择负责人", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            // 额外参数
            keyword: ""
          }
        })
        .then(res => {
          // res 结构 res = {rows: [], action: 'selected'}, 无论单选多选，rows都为数组
          this.iqcInnerTestData[index].directorName =
            res.rows[0].user_employees_name;
          this.iqcInnerTestData[index].directorId =
            res.rows[0].user_employees_id;
        });
    },
    //删除计划列表项
    delectDetails(index, rows, row) {
      this.$confirm("确认删除该投诉吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          rows.splice(index, 1);
          this.deleteQualityPlan(row.quality_complain_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //进行编辑
    editDetail(row) {
      this.operationType = "编辑";
      // this.complainVisible = true;
      this.planId = row.quality_plan_id;
      this.queryQualityComplain("detail", row.quality_plan_id);
    },
    //选择创建类型
    selectType(type) {
      this.planTitle = type;
      switch (type) {
        case "IQC":
          this.generateNumber("0", "编号");
          break;
        case "PQC":
          this.generateNumber("1", "编号");
          break;
        case "FQC":
          this.generateNumber("2", "编号");
          break;
        default:
          break;
      }
      this.planVisible = true;
      this.visible = false;
    },
    //选择list详情方案详情负责人
    selectDetailDirector(indexOne, indexTwo) {
      this.$mesEmployee
        .show("选择负责人", {
          reRender: true, // 是否重新渲染, 如果同一种弹窗有的地方单选，有的地方多选，要设置为true
          multiple: false, // 是否多选
          params: {
            // 额外参数
            keyword: ""
          }
        })
        .then(res => {
          this.planDetailData.qualityPlanTemplates[indexOne].qualityReports[
            indexTwo
          ].quality_report_duty_people_name =
            res.rows[0].user_employees_name;
        });
    },
    //编辑计划list详情
    editPlanDetail() {
      this.editVisible = false;
    },
    //完成编辑
    completeEdit() {
      var reportPlanArr = [],
        lenOne = this.planDetailData.qualityPlanTemplates.length;
      for (var i = 0; i < lenOne; i++) {
        for (
          var j = 0,
            lenTwo = this.planDetailData.qualityPlanTemplates[i].qualityReports
              .length;
          j < lenTwo;
          j++
        ) {
          reportPlanArr.push({
            quality_report_duty_people: this.planDetailData
              .qualityPlanTemplates[i].qualityReports[j]
              .quality_report_duty_people,
            quality_report_duty_people_name: this.planDetailData
              .qualityPlanTemplates[i].qualityReports[j]
              .quality_report_duty_people_name,
            quality_report_id: this.planDetailData.qualityPlanTemplates[i]
              .qualityReports[j].quality_report_id,
            quality_report_name: this.planDetailData.qualityPlanTemplates[i]
              .qualityReports[j].quality_report_name,
            quality_report_type: this.planDetailData.qualityPlanTemplates[i]
              .qualityReports[j].quality_report_status
          });
        }
      }
      this.updateReportInPlan(JSON.stringify(reportPlanArr));
    },
    changeType() {
      // this.queryQualityPlan("all", this.setPlanState, this.state);
    },
    changeState() {
      this.queryQualityPlan("all", this.setPlanState, this.state);
    },
    changeSetPlanState() {
      this.queryQualityPlan("all", this.setPlanState, this.state);
    },
    //   //折叠板状态
    handleChange(val) {
      console.log(val);
    },
    //   //方案次数改变执行函数
    planNumberChange(val) {},
    //搜索批次/名称/类型
    selectInput() {},
    //清空form
    clearForm() {
      this.$refs.planForm.resetFields();
    }
    //   //子组件关闭dialog
    //   handle() {
    //     this.dlVisible = false;
    //   }
  }
};
</script>
<style lang="scss" scoped>
#detectionPlan {
  .planListDetail {
    font-size: 13px;
    .conTxt {
      ul > li {
        height: 32px;
        line-height: 32px;
        min-width: 280px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        float: left;
        .inputSize {
          width: 150px;
        }
      }
    }
    // .modContent {
    //   max-height: 150px;
    //   overflow-y: scroll;
    // }
  }
  .liWidth {
    width: 250px;
  }
  .selectButt {
    margin: 10px 0;
  }
}
</style>

