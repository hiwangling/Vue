<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;" placeholder="请输入寄存人或墓号" />
      <el-select v-model="listQuery.save_status" placeholder="选择寄存状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in save" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <!-- <el-table-column align="center" label="墓号" prop="cid" width="80" /> -->
      <el-table-column align="center" label="名称" prop="link_name" width="80" />
      <el-table-column align="center" label="关系" prop="relation" width="50" />
      <el-table-column align="center" label="联系电话" prop="phone" />
      <el-table-column align="center" label="家庭地址" prop="address" />
      <el-table-column align="center" label="开始时间" prop="savebegindate" />
      <el-table-column align="center" label="结束时间" prop="saveenddate" />
      <el-table-column align="center" label="费用" prop="saveprice" width="70" />
      <el-table-column align="center" label="寄存状态" prop="save_status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.save_status | statusFilter">
            {{ scope.row.save_status == 1 ? '寄存中' : '已取走' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="付款状态" prop="order_state">
        <template slot-scope="scope">
          <el-tag :type="scope.row.order_state | statusFilter">
            {{ scope.row.order_state == 1 ? '未付款' : '已付款' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="到期时间" prop="order_state" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.guoqi_status | statusFilter">
            {{ scope.row.guoqi_days }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { listSave } from '@/api/save'
import Pagination from '@/components/Pagination'

export default {
  name: 'CemeteryGarden',
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
      total: 0,
      listLoading: true,
      save: [{
        id: 1,
        name: '寄存中'
      }, {
        id: 2,
        name: '已取走'
      }],
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        save_status: '',
        sort: 'add_time',
        order: 'desc'
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
      listSave(this.listQuery)
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
    }
  }
}
</script>
