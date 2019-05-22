<template>
  <div>
    <div class="filter-container">
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
      :data="Sell"
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
      <el-button type="primary" @click="sendData">确定</el-button>
    </div>
  </div>
</template>

<script>
import { listService } from '@/api/service'
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    linkman: null
  },
  data() {
    return {
      bury: '',
      linkman_id: '',
      list: null,
      Sell: null,
      listLoading: true,
      multipleSelection: []
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
    sendData() {
      const data = {
        service: this.Sell,
        linkman: this.linkman
      }
      console.log(data)
    },
    CloseDialog() {
      this.$emit('CloseDialog', false)
    },
    handleSelectionChange(val) {
      this.Sell = val
    }
  }
}
</script>
<style>
.el-table .rows {
height: 50px;
  }
  .service{
    text-align: right;
    height: 65px;
    line-height: 80px;
  }
</style>

