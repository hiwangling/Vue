<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.type_name" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓名或者墓号" />
      <el-button class="filter-item" type="primary" icon="el-icon-search">查找</el-button>
    </div>
    <div class="manage-tag">
      <el-tag class="reserve">预定(22)</el-tag>
      <el-tag class="sell">待售(22)</el-tag>
      <el-tag class="sold">已售(22)</el-tag>
      <el-tag class="bury">安葬(22)</el-tag>
    </div>
    <el-row type="flex" class="row-bg">
      <el-col v-for="(item,value) in list" :key="value" :span="6" :class="[classA,status[item.usestatus]]">
        <div style="height:100%;" @click="CreateCemetery(item)">
          <p>墓号：{{ item.vno }}</p>
          <p>墓型：{{ item.cemetery_type.type_name }}</p>
        </div>
      </el-col>
    </el-row>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog id="cemetery" :title="dialogStatus" :visible.sync="dialogFormVisible" top="5vh" @open="activeName = 'reserve'">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="预定" name="reserve"><reserve /></el-tab-pane>
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
import { get_name } from '@/api/cemetery'
import Pagination from '@/components/Pagination'
import Service from './service/service'
import Sell from './sell/sell'
import Save from './save/save'
import Reserve from './reserve/reserve'
import monumental from './monumen/monumen'
export default {
  name: 'VueLists',
  components: { Pagination, Service, Sell, Reserve, Save, monumental },
  data() {
    return {
      list: null,
      total: 0,
      cid: '',
      classA: 'bg-gaid',
      status: {
        1: 'sell',
        2: 'reserve',
        3: 'sold',
        4: 'bury'
      },
      activeName: 'reserve',
      listLoading: true,
      listQuery: {
        id: this.$route.params.id,
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
      const data = { cid: item.id }
      get_name(data)
        .then(response => {
          this.dialogStatus = response.data.name
        })
      this.dialogFormVisible = true
    },
    handleClick(tab) {
      this.$store.dispatch('cemetery/changeOrders', tab.index)
    }
  }
}
</script>

