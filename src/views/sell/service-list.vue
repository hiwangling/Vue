<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓主或墓号" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="墓名" prop="cname" width="200" />
      <el-table-column align="center" label="墓主" prop="vcname" width="150" />
      <el-table-column align="center" label="联系人" prop="buyer_name" width="150" />
      <el-table-column align="center" label="已完成服务" prop="finish_num">
        <template slot-scope="scope">
          {{ scope.row.finish_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="未完成服务" prop="to_be_com_num">
        <template slot-scope="scope">
          <span style="color:red"> {{ scope.row.to_be_com_num }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="wancheng_status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.wancheng_status | statusFilter">
            {{ scope.row.wancheng_status == 1 ? '待完成' : '已完成' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog class="dialog" :title="dialogStatus" :visible.sync="dialogFormVisible" top="5vh">
      <el-table v-loading="listLoading_" :data="list_service" element-loading-text="正在查询中。。。" border fit highlight-current-row>
        <el-table-column align="center" label="服务名称" prop="service_name" />
        <el-table-column align="center" label="服务数量" prop="serviceamount" width="80" />
        <el-table-column align="center" label="创建时间" prop="begindate" width="100" />
        <el-table-column align="center" label="状态" prop="resutlstatus" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.resutlstatus | statusFilter">
              {{ scope.row.resutlstatus == 1 ? '待完成' : '已完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="130">
          <template slot-scope="scope">
            <el-button v-if="scope.row.resutlstatus === 1" type="primary" size="mini" @click="handleCreate(scope.row.id)">执行</el-button>
            <el-button v-else type="info" size="mini" plain disabled>已完结</el-button>
          </template>

        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog class="dialog" title="服务执行" :visible.sync="dialogFormVisible_" top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="margin-left:50px;">
        <el-form-item label="完成时间" prop="execdate">
          <el-date-picker
            v-model="dataForm.execdate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="服务说明" prop="execnote">
          <el-input v-model="dataForm.execnote" type="textarea" style="width: 250px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_ = false">取消</el-button>
        <el-button type="primary" @click="SendData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { AllCemetery, AllCemeteryCid, ExecuteService } from '@/api/to-service'
// import { get_name } from '@/api/cemetery'
import Pagination from '@/components/Pagination'

export default {
  name: 'VueSaveList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'danger',
        0: 'success'
      }
      return statusMap[status]
    }
  },
  components: { Pagination },
  data() {
    return {
      list: null,
      list_service: null,
      total: 0,
      listLoading: true,
      listLoading_: true,
      dialogStatus: '',
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        save_status: '',
        sort: 'add_time',
        order: 'desc'
      },
      dialogFormVisible: false,
      dialogFormVisible_: false,
      dataForm: {
        cid: '',
        id: '',
        execdate: '',
        execnote: ''
      },
      rules: {
        execdate: [{ required: true, message: '服务时间不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {

  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      AllCemetery(this.listQuery)
        .then(response => {
          this.list = response.data.data
          this.total = response.data.total
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
    handleUpdate(row) {
      this.listLoading_ = true
      this.dialogStatus = row.cname
      this.dialogFormVisible = true
      this.dataForm.cid = row.cid
      const data = { cid: row.cid }
      AllCemeteryCid(data)
        .then(response => {
          this.list_service = response.data
          this.listLoading_ = false
        })
        .catch(() => {
          this.list_service = []
          this.listLoading_ = false
        })
    },
    handleCreate(id) {
      this.dataForm.execdate = ''
      this.dataForm.execnote = ''
      this.dialogFormVisible_ = true
      this.dataForm.id = id
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    SendData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          ExecuteService(this.dataForm)
            .then(response => {
              for (const v of this.list_service) {
                if (v.id === response.data.id) {
                  v.resutlstatus = 2
                  break
                }
              }
              this.getList()
              this.dialogFormVisible_ = false
              this.$notify.success({
                title: '成功',
                message: '服务执行成功'
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
    }
  }
}
</script>

