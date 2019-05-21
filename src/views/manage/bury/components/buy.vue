<template>
  <div class="container">
    <div class="filter-container">

      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleBury">添加购墓信息</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="姓名" prop="vcname" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :rules="rules" status-icon label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item label="联系人">
          <el-select v-model="dataForm.linkman_id" clearable placeholder="请选择">
            <el-option
              v-for="item in listlink"
              :key="item.id"
              :label="item.link_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="购买日期">
          <el-date-picker
            v-model="dataForm.order_begin"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="到期日期">
          <el-date-picker
            v-model="dataForm.order_end"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="销售金额">
          <el-input v-model="cems.sellprice" />
        </el-form-item>
        <el-form-item label="实收金额">
          <el-input v-model="dataForm.real_price" />
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
import { addbuy, listbuy } from '@/api/buy'
import { listlink } from '@/api/link'
export default {
  data() {
    return {
      list: null,
      listlink: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      dataForm: {
        cid: '',
        linkman_id: '',
        order_begin: '',
        order_end: '',
        real_price: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        // vcname: [{ required: true, message: '墓主不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    cems() {
      return this.$store.state.cemetery.cems
    }
  },
  watch: {
    cems: {
      handler(val) {
        this.getList()
      },
      immediate: true
    }
  },
  created() {

  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        cid: this.cems.id
      }
      listbuy(data)
        .then(response => {
          // this.list = response.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    handleBury() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetForm()
      this.listlink_()
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {

    },
    handleDelete(row) {

    },
    createData() {
      addbuy(this.dataForm)
        .then(response => {
          this.list.unshift(response.data)
          this.dialogFormVisible = false
          this.$notify.success({
            title: '成功',
            message: '添加购墓信息成功'
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
        cid: this.cems.id,
        linkman_id: '',
        order_begin: '',
        order_end: '',
        real_price: ''
      }
    },
    listlink_() {
      const cid = this.cems.id
      listlink(cid)
        .then(response => {
          this.listlink = response.data
        })
        .catch(() => {
          this.listlink = null
        })
    }
  }
}
</script>

