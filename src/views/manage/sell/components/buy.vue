<template>
  <div class="container">
    <el-button v-if="list ? list.length < 1 : true" class="filter-item" type="primary" icon="el-icon-edit" style="margin:0 0 10px 0" @click="handleBury">添加购墓信息</el-button>
    <el-button v-else type="info" plain disabled style="margin:10px 0">购墓单信息</el-button>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="订单号" prop="order_no" />
      <el-table-column align="center" width="80" label="购墓人" prop="buyer_name" />
      <el-table-column align="center" label="购买日期" prop="order_begin" />
      <el-table-column align="center" label="到期日期" prop="order_end" />
      <el-table-column align="center" width="80" label="销售金额" prop="sell_price" />
      <el-table-column align="center" width="80" label="实收金额" prop="real_price" />
      <el-table-column prop="order_status" label="付款状态" align="center" width="80">
        <template>
          <el-tag :type="payStatus | statusFilter">
            {{ payStatus == 1 ? '未付款' : '已付款' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="payStatus == 1" align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="handlePay(scope.row)">付款</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :inline="true" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item label="联系人" prop="linkman_id">
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
          <el-input v-model="cems.sellprice" :disabled="true" />
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
import { addbuy, listbuy, editbuy, deletebuy, pay } from '@/api/buy'
import { listlink } from '@/api/link'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'danger',
        0: 'success'
      }
      return statusMap[status]
    }
  },
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
        linkman_id: [{ required: true, message: '联系人不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    cems() {
      return this.$store.state.cemetery.cems
    },
    payStatus() {
      return this.$store.state.cemetery.pay
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
          this.list = response.data
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
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.resetForm()
      this.listlink_()
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addbuy(this.dataForm)
            .then(response => {
              response.data.sell_price = this.cems.sellprice
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
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.listlink_()
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          editbuy(this.dataForm)
            .then((response) => {
              for (const v of this.list) {
                if (v.id === response.data.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, response.data)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新购墓信息成功'
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
      deletebuy(row)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除购墓信息成功'
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
    },
    handlePay() {
      this.$confirm('付款此订单后购墓信息及墓主信息将无法再次修改, 是否继续?', '付款操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          cid: this.cems.id
        }
        pay(data)
          .then(response => {
            this.$store.dispatch('cemetery/pay', this.cems.id)
            this.$notify.success({
              title: '成功',
              message: '付款成功'
            })
          })
          .catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.msg
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
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
      const data = {
        cid: this.cems.id
      }
      listlink(data)
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

