<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.keyword" placeholder="选择墓园" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in garden" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>
    <el-row :gutter="20">
      <el-col v-for="(item, index) in list" :key="index" :span="6">
        <router-link :to="'/manage/list/'+item.id" class="">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{ item.type_name }}</span>
            </div>
            <div class="component-item">
              <img :src="item.img" alt="" class="image">
            </div>
            <div class="manage-tag">
              <el-tag type="success">待售(22)</el-tag>
              <el-tag>预定(22)</el-tag>
              <el-tag type="warning">安葬(22)</el-tag>
              <el-tag type="danger">已售(22)</el-tag>
            </div>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { listArea } from '@/api/area'
export default {
  name: 'VueList',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      garden: [{
        id: '',
        name: '长青园'
      }],
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listArea(this.listQuery)
        .then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
          this.list.forEach((v, k) => {
            v.img = 'http://118.25.216.16:88/upload/picture/20181012/2cb24160fd37a94b20d09ce4cca901dd.jpg'
          })
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
 <style  scoped>
 .manage-components-container{
 padding: 0 20px;
 min-height: calc(100vh - 84px);
 }
 .box-card{
 padding:5px;

 }
.el-card__body{
padding:5px;
 }
 .component-item{
   min-height: 100px;
   }
.image {
    width: 100%;
    display: block;
  }
  .manage-tag{
margin-top:10px;
text-align: center;
  }
  .el-tag--medium{
  margin-right: 10px;
  margin-bottom:5px
  }

 </style>
