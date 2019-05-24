<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.type_name" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓穴或者墓号" />
      <el-button v-permission="['GET /api/v1/service_info/list']" class="filter-item" type="primary" icon="el-icon-search">查找</el-button>
    </div>
    <div class="manage-tag">
      <el-tag class="sell">待售(22)</el-tag>
      <el-tag>预定(22)</el-tag>
      <el-tag class="bury">安葬(22)</el-tag>
      <el-tag class="sold">已售(22)</el-tag>
    </div>
    <el-row type="flex" class="row-bg">
      <div v-for="(item,value) in list" :key="value" @click="CreateCemetery(item)">
        <el-col :span="2" class="bg-gaid">
          <p>墓号：{{ item.vno }}</p>
          <p>墓型：{{ item.cemetery_type.type_name }}</p>
        </el-col>
      </div>
    </el-row>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog id="cemetery" :title="dialogStatus" :visible.sync="dialogFormVisible" @open="activeName = 'sell'">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="购墓" name="sell"><sell /></el-tab-pane>
        <el-tab-pane label="殡葬服务" name="service"><service /></el-tab-pane>
        <el-tab-pane label="寄存" name="save"><save /></el-tab-pane>
        <el-tab-pane label="碑文" name="monument"><monumental /></el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import { listGrave } from '@/api/grave'
import Pagination from '@/components/Pagination'
import Service from './service/service'
import Sell from './sell/sell'
import Save from './save/save'
import monumental from './monumen/monumen'
export default {
  name: 'ManageList',
  components: { Pagination, Service, Sell, Save, monumental },
  data() {
    return {
      list: null,
      total: 0,
      cid: '',
      activeName: 'sell',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listGrave(this.listQuery)
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
    CreateCemetery(item) {
      this.$store.dispatch('cemetery/pay', item.id)
      this.$store.dispatch('cemetery/addCemetery', item)
      this.dialogStatus = item.vno + '号'
      this.dialogFormVisible = true
    },
    handleClick(tab) {
      // console.log(tab.index)
    }
  }
}
</script>
<style>
#cemetery .el-dialog{
    margin-top: 5vh!important;
    width: 900px;
}
.manage-tag{
  margin-bottom: 20px
}
.bg-gaid{
  background: #4097AA;
  color: #fff;
  margin: 5px;
  padding: 5px;
  min-width: 120px;
  font-size: 16px;
  height: 120px;
  border-radius: 5px;
}
.bg-gaid p{
  margin: 5px 0;
}
</style>

