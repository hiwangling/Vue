<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加点灯服务</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <!-- <el-table-column align="center" label="使用人" prop="number" /> -->
      <!-- <el-table-column align="center" label="寄存点" prop="address" /> -->
      <el-table-column align="center" label="购买人" prop="buyer_name" width="100" />
      <el-table-column align="center" label="电话" prop="phone" width="120" />
      <el-table-column align="center" label="开始时间" prop="star" width="150">
        <template slot-scope="scope">
          <span style="font-size: 18px;color:red">
            {{ scope.row.star }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间" prop="end" width="150">
        <template slot-scope="scope">
          <span style="font-size: 18px;color:red">
            {{ scope.row.end }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="付款状态" prop="order_status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.order_status | or_status">
            {{ scope.row.order_status == 1 ? '未付款' : '已付款' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.order_status == 1">
            <el-button type="warning" size="mini" @click="handlePay(scope.row)">付款</el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
          <template v-else>
            <el-button type="info" size="mini" plain disabled>已完结</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :inline="true" :rules="rules" status-icon label-position="left" :model="dataForm" label-width="80px" style="margin-left:50px;">
        <el-form-item label="墓穴名称">
          <span class="tag" style="display: inline-block;width: 150px;">{{ cname }}</span>
        </el-form-item>
        <el-form-item label="使用人">
          <el-input v-model="dead" :disabled="true" />
        </el-form-item>
        <el-form-item label="购买人" prop="buyer_name">
          <el-input v-model="dataForm.buyer_name" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="dataForm.phone" />
        </el-form-item>
        <!-- <el-form-item label="身份证" prop="sfz">
          <el-input v-model="dataForm.card_no" />
        </el-form-item> -->
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="dataForm.star"
            type="year"
            value-format="yyyy"
            placeholder="选择年份"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="dataForm.end"
            type="year"
            value-format="yyyy"
            placeholder="选择年份"
            @change="choose"
          />
        </el-form-item>
        <el-form-item label="价格">
          <span class="tag" style="color:red;display: inline-block;width: 150px;">{{ dataForm.real_price }} 元</span>
        </el-form-item>
        <el-form-item label="总价">
          <span class="tag" style="color:red;display: inline-block;width: 150px;">{{ dataForm.total }} 元</span>
        </el-form-item>
        <!-- <el-form-item label="*注:">
          <div style="color:red;font-size:13px"> 选择2019年代表2019年腊月二十六——2020年正月十五点灯</div>
        </el-form-item> -->
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
import { lamplist, lampdel, lampedit, lampCreate, lampPay } from '@/api/lamp'
import { vuexData } from '@/utils/mixin'
import { listdead } from '@/api/dead'
export default {
  mixins: [vuexData],
  data() {
    return {
      list: null,
      dead: '',
      listLoading: true,
      dialogStatus: '',
      dataForm: {
        cid: '',
        buyer_name: '',
        phone: '',
        real_price: '',
        star: '',
        end: '',
        amount: 1,
        total: ''
      },
      dialogFormVisible: false,
      rules: {
        buyer_name: [{ required: true, message: '购买人不能为空', trigger: 'blur' }]
      }
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
  methods: {
    getList() {
      this.listLoading = true
      const data = { cid: this.cems.id }
      lamplist(data)
        .then(res => {
          this.list = res.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    handleCreate() {
      this.resetForm()
      this.getdead()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetForm() {
      this.dataForm = {
        cid: this.cems.id,
        buyer_name: '',
        phone: '',
        star: '2020',
        end: '2020',
        real_price: 50,
        amount: 1,
        total: 50
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          lampCreate(this.dataForm)
            .then(res => {
              // this.list.unshift(res.data)
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res.msg
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dataForm.real_price = 50
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.getdead()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getdead() {
      const data = { cid: this.cems.id }
      listdead(data)
        .then(res => {
          if (res.data !== []) {
            res.data.forEach((v, k) => {
              this.dead += v.vcname + '  '
            })
          }
        })
    },
    choose(date) {
      this.dataForm.total = (date - this.dataForm.star <= 0 ? 1 : (date - this.dataForm.star) + 1) * this.dataForm.real_price
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          lampedit(this.dataForm)
            .then((res) => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新寄存信息成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res
              })
            })
        }
      })
    },
    handlePay(row) {
      this.$confirm('付款此订单后将无法修改和删除, 是否继续?', '付款操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        lampPay(row)
          .then(res => {
            this.$notify.success({
              title: '成功',
              message: '付款服务成功'
            })
            this.getList()
          })
          .catch(res => {
            this.$notify.error({
              title: '失败',
              message: res.msg
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleDelete(row) {
      lampdel(row)
        .then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(res => {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        })
    }
  }
}
</script>

