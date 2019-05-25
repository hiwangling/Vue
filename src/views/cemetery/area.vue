<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.type_name" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓区名称" />
      <el-button v-permission="['GET /api/v1/cemetery_classify/a_list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /api/v1/cemetery_classify/a_add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :default-sort="{prop: 'sort',order:'ascending'}" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="排序" prop="sort" width="200">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.sort" class="edit-input" size="mini" style="width:100px" />
            <el-button
              class="cancel-btn"
              size="mini"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" prop="type_name" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="230">
        <template slot-scope="{row}">
          <el-button v-if="row.edit" type="success" size="mini" @click="confirmEdit(row)">
            确定
          </el-button>
          <el-button v-else v-permission="['POST /api/v1/cemetery_classify/a_edit']" type="warning" size="mini" @click="row.edit=!row.edit">
            排序
          </el-button>
          <el-button v-permission="['POST /api/v1/cemetery_classify/a_edit']" type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-permission="['GET /api/v1/cemetery_classify/a_del']" type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="墓区名称" prop="type_name">
          <el-input v-model="dataForm.type_name" />
        </el-form-item>
        <el-form-item label="墓区排序" prop="sort">
          <el-input v-model="dataForm.sort" />
        </el-form-item>
        <el-form-item label="墓园选择" prop="yid">
          <el-select v-model="dataForm.parent_id" clearable placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { listArea, createArea, updateArea, deleteArea, get_gardens } from '@/api/area'
import Pagination from '@/components/Pagination'

export default {
  name: 'VueArea',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      roleOptions: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        type_name: undefined,
        sort: undefined,
        parent_id: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        type_name: [{ required: true, message: '墓区名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  created() {
    this.getList()
    get_gardens()
      .then(response => {
        this.roleOptions = response.data
      })
  },
  methods: {
    getList() {
      this.listLoading = true
      listArea(this.listQuery)
        .then(response => {
          this.list = response.data.data
          this.total = response.data.total
          const items = response.data.data
          this.list = items.map(v => {
            this.$set(v, 'edit', false)
            v.originalTitle = v.sort
            return v
          })
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: '操作取消',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      updateArea(row)
        .then(() => {
          for (const v of this.list) {
            if (v.id === row.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, row)
              break
            }
          }
          this.$message({
            message: '更新墓区排序成功',
            type: 'success'
          })
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.msg
          })
        })
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        type_name: undefined,
        sort: undefined,
        parent_id: undefined
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createArea(this.dataForm)
            .then(response => {
              console.log(response.data)
              this.list.unshift(response.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加墓区成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.msg
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      console.log(this.dataForm)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateArea(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新墓区成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.msg
              })
            })
        }
      })
    },
    handleDelete(row) {
      deleteArea(row)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除墓区成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.msg
          })
        })
    }
  }
}
</script>
