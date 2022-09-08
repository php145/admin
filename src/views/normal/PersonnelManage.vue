<template>
  <div>
    <el-form :inline="true">

      <el-form-item>
        <el-input
            v-model="searchForm.name"
            placeholder="名称"
            clearable size="small">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="small">搜索</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="newPersonnelBtn()" size="small">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="确定批量删除吗？" @confirm="delRowHandle(null)">
          <el-button type="danger" slot="reference" :disabled="delBtlStatu" size="small">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
      <div style="float: right">
        <el-form-item>
          <el-select v-model="selectValue" filterable placeholder="请选择村" @change="selectChange" size="small">
            <el-option
                v-for="item in villageList"
                :key="item.id"
                :label="item.villageName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" circle @click="newVillageDialogVisible = true"
                     size="small"></el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-edit" circle @click="editVillageHandle(selectValue)"
                     size="small"></el-button>
        </el-form-item>
        <el-form-item>
          <template>
            <el-popconfirm title="确定删除吗？" @confirm="deleteVillage(selectValue)">
              <el-button type="danger" icon="el-icon-delete" slot="reference" circle size="small"></el-button>
            </el-popconfirm>
          </template>
        </el-form-item>
        <el-form-item>
          <el-upload
              class="upload-demo"
              action="11"
              :http-request="uploadselectionFile"
              accept="xlsx,xls"
              :show-file-list="false">
            <el-button type="primary" icon="el-icon-upload" size="small" circle></el-button>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
    <template class="table-container" style="height: 100%">
      <!--中间的表格-->
      <el-table
          :data="tableData"
          ref="multipleTable"
          style="width: 100%;margin-bottom: 10px"
          :indent="indent"
          :max-height="elTableHeight"
          row-key="id"
          border
          v-loading="loading"
          :cell-style="cellStyle"
          :row-class-name="tableRowClassName"
          class="tableBox"
          default-expand-all
          :tree-props="{children: 'list'}">

        <el-table-column width="75"
                         align="center"
                         fixed>
          <template slot="header" slot-scope="scope">
            <el-checkbox v-model="checkedAll"
                         :indeterminate="selectAllIndeterminate"
                         @change="changeAllSelect"/>
          </template>
          <template slot-scope="scope">
            <el-checkbox
                v-if="scope.row.children"
                :indeterminate="scope.row.indeterminate"
                v-model="scope.row.checked"
                @change="changeRowSelect(scope.row)"
            />
            <el-checkbox
                v-else
                v-model="scope.row.checked"
                @change="changeRowSelect(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column
            prop="name"
            width="90"
            label="姓名">
        </el-table-column>

        <el-table-column
            prop="relation"
            label="与户主关系">
        </el-table-column>


        <el-table-column
            prop="idCard"
            width="190"
            label="身份证">
          <template slot-scope="scope">
            <el-popover trigger="hover"
                        placement="top"
                        popper-class="myPopper"
                        v-if="scope.row.verifyIdcard!=null">
              <p>{{ scope.row.verifyIdcard }}</p>
              <div slot="reference" class="name-wrapper">
                <span>{{ scope.row.idCard }}</span>
              </div>
            </el-popover>
            <span v-else>{{ scope.row.idCard }}</span>
          </template>
        </el-table-column>

        <el-table-column
            prop="birthday"
            label="出生日期">
        </el-table-column>
        <el-table-column
            prop="gender"
            width="50"
            label="性别">
        </el-table-column>
        <el-table-column
            prop="age"
            label="年龄">
        </el-table-column>
        <el-table-column
            prop="location"
            label="户籍地">
        </el-table-column>
        <el-table-column
            prop="isOffice"
            width="110"
            label="是否公职人员">
        </el-table-column>

        <el-table-column
            prop="insuranceType"
            label="参保类型"
        >
        </el-table-column>
        <el-table-column
            prop="remake"
            label="备注">
        </el-table-column>
        <el-table-column
            prop="icon"
            label="操作"
            width="180">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="editPersonnelHandle(scope.row)">编辑
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-popconfirm title="这一段内容确定删除吗？" @confirm="delRowHandle(scope.row.id)">
              <el-button type="danger" size="mini" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
        <template slot="empty">
          <el-empty description="暂无数据"></el-empty>
        </template>
      </el-table>
    </template>
    <!--分页插件-->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="current"
        :page-size="size"
        :total="total">
    </el-pagination>

    <!--村名新增对话框-->
    <el-dialog :title="`${newVillageForm.id>0?'编辑村':'新增村'}`"
               width="34%"
               :before-close="villageHandleClose"
               :visible.sync="newVillageDialogVisible">

      <el-form :model="newVillageForm"
               :rules="newVillageRules"
               ref="newVillageForm"
      >
        <el-form-item label="村名" :label-width="formLabelWidth" prop="villageName">
          <el-input v-model="newVillageForm.villageName" autocomplete="off" label-width="100px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSaveVillageFrom('newVillageForm')">确 定</el-button>
        <el-button @click="resetForm('newVillageForm')">重 置</el-button>
      </div>
    </el-dialog>

    <!--村人员新增对话框-->
    <template>
      <div>
        <el-dialog :before-close="personnelHandleClose"
                   :visible.sync="newPersonnelDialogVisible"
                   :title="`${personnelForm.id>0?'编辑':'新增'}`">
          <el-row :gutter="15">
            <el-form ref="personnelForm"
                     :model="personnelForm"
                     :rules="personnelRules"
                     size="small"
                     label-width="100px"
                     label-position="top">

              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="personnelForm.name" placeholder="请输入姓名" clearable :style="{width: '100%'}">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证号" prop="idCard">
                  <el-input v-model="personnelForm.idCard" placeholder="请输入身份证号" clearable
                            :style="{width: '100%'}" @blur="newPersonnelIdcard($event)" autocomplete></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出生日期" prop="birthday">
                  <el-date-picker v-model="personnelForm.birthday" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                  :style="{width: '100%'}" placeholder="请选择出生日期" clearable></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="年龄" prop="age">
                  <el-input-number v-model="personnelForm.age" placeholder="年龄" :step='1'></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别" prop="gender">
                  <el-select v-model="personnelForm.gender" placeholder="请选择性别" clearable
                             :style="{width: '100%'}">
                    <el-option v-for="(item, index) in genderOptions" :key="index" :label="item.label"
                               :value="item.value" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="户主名" prop="houseHoldId">
                  <el-select v-model="personnelForm.houseHoldId"
                             filterable
                             placeholder="请选择户主名，户主请设置为空"
                             @change="houseHoldNameSelectChange"
                             clearable
                             :style="{width: '100%'}">
                    <el-option
                        v-for="item in households"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="与户主关系" prop="relation">
                  <el-autocomplete
                      v-model="personnelForm.relation"
                      placeholder="请输入与户主关系"
                      clearable
                      :fetch-suggestions="inputQuerySearch"
                      @select="handleSelect"
                      class="inline-input"
                      :style="{width: '100%'}"></el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="村（社区）组" prop="location">
                  <el-input v-model="personnelForm.location" placeholder="请输入村（社区）组" clearable
                            :style="{width: '100%'}"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结婚日期" prop="weddingDate">
                  <el-date-picker v-model="personnelForm.weddingDate" format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择结婚日期" clearable>
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="原耕地面积" prop="curCultivatedArea">
                  <el-input v-model="personnelForm.oldCultivatedArea" placeholder="请输入原耕地面积" clearable
                            :style="{width: '100%'}"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="现耕地面积" prop="curCultivatedArea">
                  <el-input v-model="personnelForm.curCultivatedArea" placeholder="请输入现耕地面积" clearable
                            :style="{width: '100%'}"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="现平均耕地面积" prop="curAveArea">
                  <el-input v-model="personnelForm.curAveArea" placeholder="请输入现平均耕地面积" clearable
                            :style="{width: '100%'}"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="征地补偿公告日期时年龄" prop="announcementDateAge">
                  <el-input-number v-model="personnelForm.announcementDateAge" placeholder="征地补偿公告日期时年龄"
                                   :step='1'></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否已在省外领取养老待遇" prop="isProvincesPensionTreatment">
                  <el-select v-model="personnelForm.isProvincesPensionTreatment" placeholder="请选择是否已在省外领取养老待遇"
                             clearable :style="{width: '100%'}">
                    <el-option v-for="(item, index) in isProvincesPensionTreatmentOptions" :key="index"
                               :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="参保类型" prop="insuranceType">
                  <el-select v-model="personnelForm.insuranceType" placeholder="请选择参保类型" clearable
                             :style="{width: '100%'}">
                    <el-option v-for="(item, index) in insuranceTypeOptions" :key="index" :label="item.label"
                               :value="item.value" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="政府补贴时间" prop="subsidyTime">
                  <el-date-picker v-model="personnelForm.subsidyTime" format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择政府补贴时间" clearable>
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="field144">
                  <el-input v-model="personnelForm.remake" type="textarea" placeholder="请输入备注"
                            :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <div slot="footer">
            <el-button type="primary" @click="submitSavePersonnelForm('personnelForm')">确定</el-button>
            <el-button @click="resetForm('personnelForm')">重置</el-button>
          </div>
        </el-dialog>
      </div>
    </template>

  </div>
</template>

<script>
export default {
  name: "PersonnelManage",
  inheritAttrs: false,
  components: {},
  props: [],
  data() {
    return {
      //搜索框表单
      searchForm: {},
      //批量删除按钮状态
      delBtlStatu: true,
      //分页参数
      indent: 16,
      total: 0,
      size: 10,
      current: 1,

      //人员数据新增对话框显示
      newPersonnelDialogVisible: false,
      //表格数据
      tableData: [],
      //村名新增对话框显示
      newVillageDialogVisible: false,
      //村子对话框的表单
      newVillageForm: {
        villageName: ''
      },
      //新增村民对话框的表单
      personnelForm: {
        houseHoldId: undefined,
        relation: undefined,
        idCard: undefined,
        name: "",
        birthday: null,
        age: undefined,
        gender: undefined,
        location: undefined,
        weddingDate: null,
        oldCultivatedArea: undefined,
        curCultivatedArea: undefined,
        curAveArea: undefined,
        announcementDateAge: undefined,
        isProvincesPensionTreatment: undefined,
        insuranceType: undefined,
        subsidyTime: null,
        remake: undefined,
      },
      //村人员数据验证
      personnelRules: {
        houseHoldId: [],
        relation: [{
          required: true,
          message: '请输入与户主关系',
          trigger: 'blur'
        }],
        idCard: [
          {
            required: true,
            message: '请输入身份证号',
            trigger: 'blur',
          }, {
            validator: function (rule, value, callback) {

              if (value.length > 18) {
                callback(new Error("身份证号码长度大于18位"));
              } else if (value.length < 18 && value.length > 15) {
                callback(new Error("身份证号码小于18位"))
              } else if (value.length < 15) {
                callback(new Error("身份证号码小于15位"))
              } else {
                callback()
              }
            }
          }, {
            validator: function (rule, value, callback) {

              let pattern18 = /([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]/
              let pattern15 = /([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}/
              if (pattern15.test(value) || pattern18.test(value)) {
                callback()
              } else {
                callback(new Error("无效的身份证号码"))
              }
            }
          }
        ],
        name: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        birthday: [{
          required: true,
          message: '请选择出生日期',
          trigger: 'change'
        }],
        age: [{
          required: true,
          message: '年龄',
          trigger: 'blur'
        }],
        gender: [{
          required: true,
          message: '请选择性别',
          trigger: 'change'
        }],
        location: [{
          required: true,
          message: '请输入村（社区）组',
          trigger: 'blur'
        }],
        insuranceType: [],
        subsidyTime: [],
        remake: [],
      },
      //复选框数据
      genderOptions: [{
        "label": "男",
        "value": 1
      }, {
        "label": "女",
        "value": 2
      }],
      isProvincesPensionTreatmentOptions: [{
        "label": "是",
        "value": 1
      }, {
        "label": "否",
        "value": 2
      }],
      insuranceTypeOptions: [{
        "label": "城居",
        "value": 1
      }, {
        "label": "城职",
        "value": 2
      }],
      //村名校验
      newVillageRules: {
        villageName: [
          {required: true, message: '请输入村名', trigger: 'blur'}
        ]
      },
      //全选框的半选中状态
      selectAllIndeterminate: false,
      formLabelWidth: '120px',
      villageList: [],

      selectValue: '',
      checkedAll: false,
      elTableHeight: 0,
      loading: false,
      //当前村子的所有户主
      households: [],
      //与户主关系的所有项目
      relationItems: [],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.elTableHeight = window.innerHeight - 250
    })
    this.loadRelationItem()
  }, created() {
    this.getVillageList()
  }, methods: {
    //高亮显示错误行
    tableRowClassName({row, rowIndex}) {
      if (row.verifyIdcard != null) {
        return 'warning-row'
      }
    },
    cellStyle({row, column, rowIndex, columnIndex}) {
      if (column.label == "身份证" && row.verifyIdcard != null) {
        return 'color:#F56C6C'
      }
    },
    //获取村子列表
    getVillageList() {
      this.$axios.get("/village/list").then(res => {
        this.villageList = res.data.data
        this.selectValue = this.villageList[0].id;
        this.$nextTick(function () {
          this.getPersonnelList(this.selectValue);
        })
      })
    },
    //按村子id获取村子下人员
    getPersonnelList(val) {
      this.$axios.get("/personnel/list/", {
        params: {
          villageId: val,
          current: this.current,
          size: this.size
        }
      }).then(res => {
        this.tableData = res.data.data.records

        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    //村名编辑框
    editVillageHandle(id) {
      this.$axios.get("/village/info/" + id).then(res => {
        this.newVillageForm = res.data.data;
        this.newVillageDialogVisible = true;
      })
    },
    //村子下拉框改变调用
    selectChange(val) {
      this.getPersonnelList(val)
    },
    //户主名下拉框改变调用
    houseHoldNameSelectChange(val) {
      this.personnelForm.houseHoldId = val
    },
    //显示页码
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val

      this.getPersonnelList(this.selectValue)
    },
    //显示当前页码
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getPersonnelList(this.selectValue)
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      switch (formName) {
        case "newVillageForm" :
          this.newVillageDialogVisible = false
          this.newVillageForm = {}
          break
        case "personnelForm" :
          this.newPersonnelDialogVisible = false
          this.personnelForm = {}
          break
      }
    },
    //关闭对话框
    villageHandleClose() {
      this.resetForm("newVillageForm")
    },
    personnelHandleClose() {
      this.resetForm("personnelForm")
    },
    //提交村名更新或保存的表单
    submitSaveVillageFrom(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post(
              '/village/' + (this.newVillageForm.id ? 'update' : 'save'), this.newVillageForm)
              .then(() => {
                this.$message({
                  showClose: true,
                  message: '恭喜你，操作成功',
                  type: 'success',
                  onClose: () => {
                    this.getPersonnelList(this.selectValue)
                  }
                });
                this.newVillageDialogVisible = false
                this.resetForm(formName)
              })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //根据id删除村名
    deleteVillage(id) {
      this.$axios.post("/village/delete/" + id).then(res => {
        console.log(res.data.data)
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose: () => {
            this.getVillageList()
          }
        });
      })
    },
    //上传文件
    uploadselectionFile(param) {
      this.loading = true
      let form = new FormData()
      form.append("file", param.file)
      form.append("villageId", this.selectValue)
      this.$axios.post("/personnel/import", form).then(res => {

        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose: () => {
            this.loading = false
            this.getPersonnelList(this.selectValue)
          }
        })
      })
    },
    //删除表格内一行
    delRowHandle(id) {
      let ids = []

      if (id) {
        ids.push(id)
      } else {
        this.tableData.forEach(row => {
          if (row.checked) {
            ids.push(row.id)
          }
          row.children.forEach(children => {
            if (children.checked) {
              ids.push(children.id)
            }
          })
        })
      }
      console.log(ids)
      this.$axios.post("/personnel/delete/", ids).then(res => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose: () => {
            this.getPersonnelList(this.selectValue)
            this.checkedAll = false;
          }
        });
      })
    },
    //村人员编辑框
    editPersonnelHandle(row) {
      this.$axios.get("/personnel/info/" + row.id).then(res => {
        this.personnelForm = res.data.data
      })
      if (this.selectValue != null && this.selectValue != "") {
        this.$axios.get("/personnel/getHouseholds/" + this.selectValue).then(res => {
          this.households = res.data.data
          this.personnelForm.houseHoldId = row.householdId
        })
      }
      this.newPersonnelDialogVisible = true
    },
    //新增村民按钮点击事件
    newPersonnelBtn() {
      if (this.selectValue != null && this.selectValue != "") {
        this.newPersonnelDialogVisible = true
        this.$axios.get("/personnel/getHouseholds/" + this.selectValue).then(res => {
          this.households = res.data.data
        })
      } else {
        this.$message.error("请先添加村子")
      }
    },
    //新增对话框身份证输入框的事件
    newPersonnelIdcard(e) {
      let id = e.target.value
      let year
      let month
      let day
      let sc
      if (id != null && id.length != 0) {
        if (id.length > 15) {
          year = id.substring(6, 10);
          month = id.substring(10, 12);
          day = id.substring(12, 14);
          sc = id.substring(14, 17)
        } else {
          year = "19" + id.substring(6, 8);
          month = id.substring(8, 10);
          day = id.substring(10, 12);
          sc = id.substring(12, 15)
        }
        console.log(year + "-" + month + "-" + day)
        let d = new Date()
        let d1 = new Date(year + "-" + month + "-" + day)
        let currTime = d.getTime()
        let oldTime = d1.getTime()
        let timeMillis = currTime - oldTime
        this.personnelForm.birthday = year + "-" + month + "-" + day
        this.personnelForm.age = parseInt(timeMillis * 3.16887385E-11)
        this.personnelForm.gender = (sc % 2 == 0 ? "女" : "男")
      } else {
        this.personnelForm.birthday = null
        this.personnelForm.age = null
      }
    },
    //全选表格
    changeAllSelect(val) {
      this.delBtlStatu = !val
      this.selectAllIndeterminate = false;
      const loop = (data) => {
        data.forEach(item => {
          item.checked = val
          if ('indeterminate' in item) {
            item.indeterminate = false
          }
          if (item.children) {
            loop(item.children)
          }
        })
      }
      loop(this.tableData)
    },
    //选择表格单行数据
    changeRowSelect(val) {
      this.delBtlStatu = true
      if (val.children != null && val.children.length > 0) {
        val.children.forEach(ss => {
          ss.checked = val.checked
        })
      } else {
        let checkedLeg = 0

        this.tableData.some(item => {
          if (item.id === val.householdId) {
            // 获取当前父级下子级选中条数*/
            const leg = item.children.length
            checkedLeg = item.children.filter(ss => ss.checked).length
            // 根据条数改变父级的indeterminate和checked
            if (leg == 0 && item.id === item.householdId) {
              item.checked = val.checked
            } else if (checkedLeg === 0) {
              item.indeterminate = false
              item.checked = false
            } else if (checkedLeg < leg) {
              item.indeterminate = true
              item.checked = false
            } else if (checkedLeg === leg) {
              item.indeterminate = false
              item.checked = true
            }
            return
          }
        })
      }
      // 判断是否全部选择了,改变全选框的样式
      let flag = true
      this.tableData.some(item => {
        if (!item.checked) {
          flag = false
          return
        }
      })
      this.selectAllIndeterminate = false;
      this.checkedAll = flag
      //判断是否有选择
      if (!flag) {
        let indeterminate = false
        this.tableData.some(item => {
          var checkedLeg = item.children.filter(ss => ss.checked).length
          if (checkedLeg > 0) {
            indeterminate = true
            this.delBtlStatu = false
            return
          }
          if (item.checked) {
            indeterminate = true
            this.delBtlStatu = false
            return
          }
        })
        this.selectAllIndeterminate = indeterminate
      }
    },
    //新增数据保存到数据库
    submitSavePersonnelForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/personnel/' + (this.personnelForm.id ? 'update' : 'save'), this.personnelForm)
              .then(() => {
                this.$message({
                  showClose: true,
                  message: '恭喜你，操作成功',
                  type: 'success',
                  onClose: () => {
                    this.getPersonnelList()
                  }
                })
                this.newPersonnelDialogVisible = false
                this.resetForm(formName)
              })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    //加载和户主关系的选项
    loadRelationItem() {
      this.$axios.get("/personnel/getRelationItems/").then(res => {
        this.relationItems = res.data.data
        console.log(this.relationItems)
      })
    },
    //设置输入框的搜索项
    inputQuerySearch(queryString, cb) {
      let relationItems = this.relationItems
      let results = queryString ? relationItems.filter((relationItem) => {
        return (relationItem.value.toLowerCase().indexOf(queryString.toLowerCase()) == 0)
      }) : relationItems
      cb(results)
    },
    objectSpanMethod({row, column, rowIndex, columnIndex}) {

    }
  }
}

</script>

<style>
.el-pagination {
  float: right;
  margin-top: 22px;
}

.el-table .warning-row {
  background: oldlace;
}

.el-popper.myPopper {
  background: #F2F6FC;
  color: #F56C6C;
}
</style>