<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加服务</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="订单号" prop="order_no" />
      <el-table-column align="center" label="购墓人" prop="buyer_name" />
      <el-table-column align="center" label="购买日期" prop="create_time" />
      <el-table-column align="center" label="服务项目" prop="sell_title" />
      <el-table-column align="center" style="width:50px" label="服务总价" prop="sum_price" />
      <el-table-column prop="order_status" label="付款状态" align="center" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.order_status | statusFilter">
            {{ scope.row.order_status == 1 ? '未付款' : '已付款' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.order_status === 1">
            <el-button type="warning" size="mini" @click="handlePay(scope.row)">结算</el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          </template>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <Service-select :service="service" :creatservice="creatservice" @CloseDialog="CloseDialog" />
    </el-dialog>
  </div>
</template>
<script>
import ServiceSelect from './components/ServiceSelect'
import { getsevices, editservices } from '@/api/buy-service'
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
  components: { ServiceSelect },
  data() {
    return {
      list: null,
      linkman_id: '',
      listlink: '',
      service: null,
      creatservice: '',
      linkdata: null,
      listLoading: false,
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑服务',
        create: '创建服务'
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
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        cid: this.cems.id
      }
      getsevices(data)
        .then(response => {
          this.list = response.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.creatservice = true
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      const data = {
        id: row.id
      }
      editservices(data)
        .then(response => {
          this.service = response.data.service
        })
    },
    CloseDialog(val) {
      this.getList()
      this.dialogFormVisible = val
    },
    Creatlink(val) {
    //   let obj = {}
    //   obj = this.listlink.find((item) => {
    //     return item.id === val
    //   })
    //   this.linkdata = obj
    }

  }
}
</script>
<style scoped>

</style>

