<template>
  <div>
    <el-form :inline="true">

      <el-form-item>
        <el-input
            v-model="searchForm.name"
            placeholder="名称"
            clearable
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getRoleList">搜索</el-button>
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

    <!--中间的表格-->
    <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        @selection-change="handleSelectionChange"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

      <el-table-column
          type="selection"
          width="55">
      </el-table-column>

      <el-table-column
          prop="date"
          label="日期"
          sortable
          width="180">
      </el-table-column>
      <el-table-column
          prop="name"
          label="姓名"
          sortable
          width="180">
      </el-table-column>
      <el-table-column
          prop="address"
          label="地址">
      </el-table-column>
    </el-table>

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
    return {
      searchForm: {},
      delBtlStatu: true,

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

      multipleSelection: [],

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
      selectValue: 1
    }
  }, created() {
    this.getVillageList()
  },
  methods: {
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
    editVillage(id) {
      this.$axios.get("/village/info/" + id).then(res => {
        this.newVillageForm = res.data.data;
        this.newVillageDialogVisible = true;
      })
    },
    getVillageList() {
      this.$axios.get("/village/list").then(res => {
        this.villageList = res.data.data;
        this.selectValue = res.data.data[0].id;
        console.log()
      })
    },
    selectChange(val) {
      console.log(val + " " + this.selectValue)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      console.log("勾选")
      console.log(val)
      this.multipleSelection = val;

      this.delBtlStatu = val.length == 0
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val
      this.getRoleList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getRoleList()
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
                    this.getRoleList()
                  }
                });

                this.newVillageDialogVisible = false
                this.resetForm(formName)
              })
          this.getVillageList()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    editHandle(id) {
      this.$axios.get('/sys/role/info/' + id).then(res => {

        this.editForm = res.data.data

        this.dialogVisible = true
      })
    },
    delHandle(id) {

      var ids = []

      if (id) {
        ids.push(id)
      } else {
        this.multipleSelection.forEach(row => {
          ids.push(row.id)
        })
      }

      console.log(ids)

      this.$axios.post("/sys/role/delete", ids).then(() => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose: () => {
            this.getRoleList()
          }
        });
      })
    },
    permHandle(id) {
      this.permDialogVisible = true

      this.$axios.get("/sys/role/info/" + id).then(res => {

        console.log(res.data.data)

        this.$refs.permTree.setCheckedKeys(res.data.data.menuIds, false)

        console.log(this.$refs.permTree)
        this.permForm = res.data.data
      })
    },

    submitPermFormHandle() {
      var menuIds = this.$refs.permTree.getCheckedKeys()

      console.log(menuIds)

      this.$axios.post('/sys/role/perm/' + this.permForm.id, menuIds).then(() => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose: () => {
            this.getRoleList()
          }
        });
        this.permDialogVisible = false
        // this.resetForm(formName)
      })
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