<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加常青树服务</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="订单号" prop="order_no" />
      <!-- <el-table-column align="center" label="寄存点" prop="address" /> -->
      <el-table-column align="center" label="购买人" prop="buyer_name" width="100" />
      <el-table-column align="center" label="电话" prop="phone" width="120" />
      <el-table-column align="center" label="点灯时间" prop="lamp_nd" width="150">
        <template slot-scope="scope">
          <span style="font-size: 18px;color:red">
            {{ scope.row.lamp_nd }}
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
            <!-- <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button> -->
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
        <!-- <el-form-item label="类型">
          <el-radio v-model="dataForm.type" label="1">单盆</el-radio>
          <el-radio v-model="dataForm.type" label="2">多盆</el-radio>
        </el-form-item> -->

        <el-form-item label="付款人" prop="buyname">
          <el-input v-model="dataForm.buyname" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="dataForm.phone" />
        </el-form-item>
        <!-- <el-form-item label="身份证" prop="sfz">
          <el-input v-model="dataForm.card_no" />
        </el-form-item> -->
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="dataForm.buydate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择年份"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="dataForm.buydate1"
            type="date"
            placeholder="选择年份"
            @change="choose"
          />
        </el-form-item>
        <el-form-item label="盆数">
          <el-input v-model="dataForm.quantity" @blur="quantity" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="dataForm.real_price" />
        </el-form-item>
        <el-form-item label="总价">
          <span class="tag" style="color:red;display: inline-block;width: 150px;">{{ dataForm.all_price }} 元</span>
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
// import { lamplist, lampadd, lampdelete, lamppay } from '@/api/lamp'
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
        buyname: '',
        phone: '',
        real_price: '',
        buydate: '',
        buydate1: '',
        all_price: '',
        card_no: '',
        quantity: ''

      },
      dialogFormVisible: false,
      rules: {
        buyname: [{ required: true, message: '付款人不能为空', trigger: 'blur' }]
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
      // const data = { cid: this.cems.id }
      // lamplist(data)
      //   .then(res => {
      //     this.list = res.data
      //     this.listLoading = false
      //   })
      //   .catch(() => {
      //     this.list = []
      //     this.listLoading = false
      //   })
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
        buyname: '',
        phone: '',
        buydate: new Date(),
        buydate1: '',
        real_price: 80,
        card_no: '',
        all_price: 80,
        quantity: 1
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // lampadd(this.dataForm)
          //   .then(res => {
          //     // this.list.unshift(res.data)
          //     this.getList()
          //     this.dialogFormVisible = false
          //     this.$notify.success({
          //       title: '成功',
          //       message: '添加成功'
          //     })
          //   })
          //   .catch(res => {
          //     this.$notify.error({
          //       title: '失败',
          //       message: res.msg
          //     })
          //   })
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
    },
    getdead() {
      const data = { cid: this.cems.id }
      const deadbox = []
      listdead(data)
        .then(res => {
          if (res.data !== []) {
            res.data.forEach((v, k) => {
              deadbox.push(v.vcname)
            })
          }
        })
      this.dead = deadbox.join(' ')
    },
    choose(date) {
      this.sum()
    },
    quantity() {
      this.sum()
    },
    sum() {
      const v = this.dataForm.buydate.getFullYear()
      const e = this.dataForm.buydate1.getFullYear()
      const m = e - v <= 0 ? 1 : e - v
      this.dataForm.all_price = m * this.dataForm.quantity * this.dataForm.real_price
    },
    updateData() {
      // this.$refs['dataForm'].validate(valid => {
      //   if (valid) {
      //     updateSave(this.dataForm)
      //       .then((res) => {
      //         this.getList()
      //         this.dialogFormVisible = false
      //         this.$notify.success({
      //           title: '成功',
      //           message: '更新寄存信息成功'
      //         })
      //       })
      //       .catch(res => {
      //         this.$notify.error({
      //           title: '失败',
      //           message: res
      //         })
      //       })
      //   }
      // })
    },
    handlePay(row) {
      // this.$confirm('付款此订单后将无法修改和删除, 是否继续?', '付款操作', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      //   customClass: 'confirmTop'
      // }).then(() => {
      //   lamppay(row)
      //     .then(res => {
      //       this.$notify.success({
      //         title: '成功',
      //         message: '付款服务成功'
      //       })
      //       this.getList()
      //     })
      //     .catch(res => {
      //       this.$notify.error({
      //         title: '失败',
      //         message: res.msg
      //       })
      //     })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消'
      //   })
      // })
    },
    handleDelete(row) {
      // lampdelete(row)
      //   .then(res => {
      //     this.$notify.success({
      //       title: '成功',
      //       message: '删除成功'
      //     })
      //     const index = this.list.indexOf(row)
      //     this.list.splice(index, 1)
      //   })
      //   .catch(res => {
      //     this.$notify.error({
      //       title: '失败',
      //       message: res.msg
      //     })
      //   })
    }
  }
}
</script>

