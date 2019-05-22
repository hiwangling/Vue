<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-select v-model="linkman_id" clearable placeholder="请选择付款人" style="width:150px">
        <el-option
          v-for="item in listlink"
          :key="item.id"
          :label="item.link_name"
          :value="item.id"
        />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加服务</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="订单号" prop="order_no" />
      <el-table-column align="center" label="购墓人" prop="buyer_name" />
      <el-table-column align="center" label="购买日期" prop="order_begin" />
      <el-table-column align="center" label="到期日期" prop="order_end" />
      <el-table-column align="center" style="width:50px" label="销售金额" prop="sell_price" />
      <el-table-column align="center" width="80" label="实收金额" prop="real_price" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <Service-select :linkman="linkman_id" @CloseDialog="CloseDialog" />
    </el-dialog>
  </div>
</template>
<script>
import ServiceSelect from './components/ServiceSelect'
import { listlink } from '@/api/link'
export default {
  components: { ServiceSelect },
  data() {
    return {
      list: null,
      linkman_id: '',
      listlink: '',
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
      this.listlink_()
    //   this.listLoading = true
    //   const data = {
    //     cid: this.cems.id
    //   }
    //   listbuy(data)
    //     .then(response => {
    //       this.list = response.data
    //       this.listLoading = false
    //     })
    //     .catch(() => {
    //       this.list = []
    //       this.listLoading = false
    //     })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    CloseDialog(val) {
      this.dialogFormVisible = val
    },
    Creatlink(val) {
    //   let obj = {}
    //   obj = this.listlink.find((item) => {
    //     return item.id === val
    //   })
    //   this.linkdata = obj
    },
    listlink_() {
      this.linkman_id = null
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
<style scoped>

</style>

