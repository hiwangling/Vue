<template>
  <div>
    <div class="filter-container">
      <el-select v-model="linkman_id" clearable placeholder="请选择付款人" style="width:150px">
        <el-option
          v-for="item in listlink"
          :key="item.id"
          :label="item.link_name"
          :value="item.id"
        />
      </el-select>

      <div class="el-divider el-divider--horizontal"><div class="el-divider__text is-left">服务项目</div></div>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      border
      :row-class-name="tableRow"
      highlight-current-row
      :data="list"
      tooltip-effect="dark"
      style="width: 100%;margin-bottom:10px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55"
      />
      <el-table-column
        prop="service_name"
        align="center"
        label="服务名称"
      />
      <el-table-column
        prop="sellprice"
        align="center"
        label="服务价格"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.sellprice" class="edit-input" size="mini" style="width:100px" />
            <el-button size="mini" type="success" @click="confirmEdit(row)">
              确定
            </el-button>
            <el-button size="mini" type="warning" @click="cancelEdit(row)">
              取消
            </el-button>
          </template>
          <span v-else @click="row.edit=!row.edit">{{ row.sellprice }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="el-divider el-divider--horizontal"><div class="el-divider__text is-left">已选项目</div></div>
    <el-table
      v-loading="listLoading"
      :show-header="false"
      show-summary
      :data="sell"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        prop="service_name"
        width="200"
      />
      <el-table-column
        prop="sellprice"
      />
    </el-table>
    <div slot="footer" class="dialog-footer service">
      <el-button @click="CloseDialog">取消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="sendData">确定</el-button>
      <el-button v-else type="primary" @click="editData">确定</el-button>
    </div>
  </div>
</template>

<script>
import { listService } from '@/api/service'
import { getEditService, addservices, editservices } from '@/api/buy-service'
import { listlink } from '@/api/link'
export default {
  data() {
    return {
      bury: '',
      listlink: '',
      linkman_id: '',
      dialogStatus: '',
      list: null,
      sell: null,
      listLoading: true,
      multipleSelection: []
    }
  },
  computed: {
    cems() {
      return this.$store.state.cemetery.cems
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listService()
        .then(response => {
          this.list = response.data.data
          this.listLoading = false
          const items = response.data.data
          this.list = items.map(v => {
            this.$set(v, 'edit', false)
            v.originalTitle = v.sellprice
            return v
          })
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    tableRow({ row, rowIndex }) {
      return 'rows'
    },
    cancelEdit(row) {
      row.sellprice = row.originalTitle
      row.edit = false
      this.$message({
        message: '操作取消',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.sellprice
    },
    restservice() {
      this.linkman_id = null
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection()
      })
      this.findlink()
    },
    editservice(val) {
      const data = { id: val }
      this.dialogStatus = 'update'
      getEditService(data)
        .then(response => {
          this.linkman_id = response.data.linkman_id
          const service = response.data.services
          service.forEach((v, k) => {
            this.$refs.multipleTable.toggleRowSelection(this.$refs.multipleTable.data.find((item) => item.id === v.id), true)
          })
        })
      this.findlink()
    },
    sendData() {
      let sum_price = 0
      this.Sell.forEach((v, k) => {
        sum_price = sum_price + parseInt(v.sellprice)
      })
      const data = {
        cid: this.cems.id,
        services: this.Sell,
        sum_price: sum_price,
        linkman_id: this.linkman_id
      }
      addservices(data)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '添加服务成功'
          })
          this.CloseDialog()
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.msg
          })
        })
    },
    editData() {
      const data = {}
      editservices(data)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '编辑服务成功'
          })
          this.CloseDialog()
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.msg
          })
        })
    },
    CloseDialog() {
      this.$emit('CloseDialog', false)
    },
    handleSelectionChange(val) {
      this.sell = val
    },
    findlink() {
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
.el-table .rows {
height: 50px;
  }
.service{
    text-align: right;
    height: 65px;
    line-height: 80px;
  }
</style>

