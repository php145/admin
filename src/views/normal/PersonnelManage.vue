<template>
  <div>
    <el-form :inline="true">

      <el-form-item>
        <el-input
            v-model="searchForm.name"
            placeholder="名称"
            clearable>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button>搜索</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="确定批量删除吗？" @confirm="delHandle(null)">
          <el-button type="danger" slot="reference" :disabled="delBtlStatu">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
      <div style="float: right">
        <el-form-item>
          <el-select v-model="selectValue" filterable placeholder="请选择村" @change="selectChange">
            <el-option
                v-for="item in villageList"
                :key="item.id"
                :label="item.villageName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" circle @click="newVillageDialogVisible = true"></el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-edit" circle @click="editVillage(selectValue)"></el-button>
        </el-form-item>
        <template>
          <el-popconfirm title="确定删除吗？" @confirm="deleteVillage(selectValue)">
            <el-button type="danger" icon="el-icon-delete" slot="reference" circle></el-button>
          </el-popconfirm>
        </template>
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
          class="tableBox"
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

        <el-table-column width="75"
                         fixed>
          <template slot="header" slot-scope="scope">
            <el-checkbox v-model="checkedAll"
                         :indeterminate="checkAllIndeterminate"
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
            label="姓名">
        </el-table-column>
        <el-table-column
            prop="relation"
            label="与户主关系">
        </el-table-column>
        <el-table-column
            prop="idCard"
            width="200"
            label="身份证">
        </el-table-column>
        <el-table-column
            prop="birthday"
            label="出生日期">
        </el-table-column>
        <el-table-column
            prop="gender"
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
            label="是否公职人员">
        </el-table-column>

        <el-table-column
            prop="icon"
            label="操作"
            width="180">

          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="editHandle(scope.row.id)">编辑
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-popconfirm title="这一段内容确定删除吗？" @confirm="delHandle(scope.row.id)">
              <el-button type="danger" size="mini" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

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

    <!--新增对话框-->
    <el-dialog :title="`${newVillageForm.id>0?'编辑村':'新增村'}`"
               width="500px"
               :before-close="handleClose"
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
        <el-button type="primary" @click="submitSaveFrom('newVillageForm')">确 定</el-button>
        <el-button @click="resetForm('newVillageForm')">重 置</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "PersonnelManage",

  data() {

    // var vm = new Vue({
    //
    // })

    return {
      searchForm: {},
      delBtlStatu: true,
      //分页参数
      indent: 16,
      total: 0,
      size: 10,
      current: 1,

      dialogVisible: false,
      tableData: [],
      editFormRules: {
        name: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入唯一编码', trigger: 'blur'}
        ],
        statu: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ]
      },
      permDialogVisible: false,
      permForm: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      permTreeData: [],
      newVillageDialogVisible: false,
      newVillageForm: {
        villageName: ''
      },
      newVillageRules: {
        villageName: [
          {required: true, message: '请输入村名', trigger: 'blur'}
        ]
      },
      formLabelWidth: '120px',
      villageList: [],
      selectValue: '',
      checkedAll: false,
      checkAllIndeterminate: false,
      elTableHeight: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.elTableHeight = window.innerHeight - 250
    })
  }, created() {
    this.getVillageList()
  }, methods: {

    getVillageList() {

      this.$axios.get("/village/list").then(res => {
        this.villageList = res.data.data
        this.selectValue = this.villageList[0].id;
        this.$nextTick(function () {
          this.getPersonnelList(this.selectValue);
        })
      })
    },
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
    editVillage(id) {
      this.$axios.get("/village/info/" + id).then(res => {
        this.newVillageForm = res.data.data;
        this.newVillageDialogVisible = true;
      })
    },
    selectChange(val) {
      this.getPersonnelList(val)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val

      this.getPersonnelList(this.selectValue)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getPersonnelList(this.selectValue)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.newVillageDialogVisible = false
      this.newVillageForm = {}
    },
    handleClose() {
      this.resetForm('newVillageForm')
    },
    submitSaveFrom(formName) {
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
                    this.getVillageList()
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
    }, changeAllSelect(val) {
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
    }, changeRowSelect(val) {
      if (val.children != null && val.children.length > 0) {
        val.children.forEach(ss => {
          ss.checked = val.checked
        })
      } else {
        console.log("运行了" + val.householdId)
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
        // console.log(this.tableData2)
      }
      // 判断是否全部选择了,改变全选框的样式
      let flag = true
      this.tableData.some(item => {
        if (!item.checked) {
          flag = false
          return
        }
      })
      this.checkedAll = flag
    }
  }
}

</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>