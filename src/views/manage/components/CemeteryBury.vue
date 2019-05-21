<template>
  <div class="container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleBury">购买</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit">增加墓主</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="姓名" prop="type_name" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="filter-item" type="primary" icon="el-icon-plus" style="margin-bottom:10px" @click="handlelink">增加联系人</el-button>
    <el-table v-loading="listlinkLoading" :data="listlink" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="姓名" prop="link_name" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdatelink(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDeletelink(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body>
      <div style="height:40px">
        <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
          <el-form-item label="墓型">
            <el-select v-model="dataForm.type_id" clearable placeholder="请选择">
              <el-option
                v-for="item in cemeteryType"
                :key="item.id"
                :label="item.type_name"
                :value="item.hrm"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="销售价格">
            <el-input v-model="dataForm.vno" />
          </el-form-item>
          <el-form-item label="实收金额">
            <el-input v-model="dataForm.vno" />
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="ele" /> -->
      <div class="el-divider el-divider--horizontal"><div class="el-divider__text is-left">墓主信息</div></div>
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <div v-for="(index) in dataForm.type_id" :key="index" style="height:120px">
          <el-form-item label="墓主" prop="vno">
            <el-input v-model="dataForm.vno" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="dataForm.sex">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="身份证">
            <el-input v-model="dataForm.vno" />
          </el-form-item>
          <el-form-item label="出生日期" prop="createdate">
            <el-date-picker
              v-model="dataForm.createdate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="去世日期" prop="createdate">
            <el-date-picker
              v-model="dataForm.createdate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="安葬日期" prop="createdate">
            <el-date-picker
              v-model="dataForm.createdate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <!-- 增加联系人 -->
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisiblelink" append-to-body>
      <div class="linkman">
        <el-form ref="dataFormlink" :rules="ruleslink" :model="dataFormlink" status-icon label-position="left" label-width="100px" style="width: 600px; margin-left:50px;" class="dataFormlinkman">
          <el-form-item label="联系人姓名" prop="link_name">
            <el-input v-model="dataFormlink.link_name" />
          </el-form-item>
          <el-form-item label="联系人电话" prop="phone">
            <el-input v-model="dataFormlink.phone" />
          </el-form-item>
          <el-form-item label="身份证号码" prop="card_no">
            <el-input v-model="dataFormlink.card_no" />
          </el-form-item>
          <el-form-item label="关系" prop="relation">
            <el-input v-model="dataFormlink.relation" />
          </el-form-item>
          <el-form-item label="家庭住址" prop="address">
            <el-input v-model="dataFormlink.address" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblelink = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createDatalink">确定</el-button>
        <el-button v-else type="primary" @click="updateDatalink">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listType } from '@/api/type'
import { listlink, createlink, updatelink, deletelink } from '@/api/link'
export default {
  data() {
    return {
      list: null,
      listlink: null,
      listLoading: true,
      listlinkLoading: true,
      dialogFormVisible: false,
      dialogFormVisiblelink: false,
      cemeteryType: null,
      dialogStatus: '',
      dataForm: {
        type_id: 2
      },
      dataFormlink: {
        cid: '',
        link_name: '',
        phone: '',
        card_no: '',
        relation: '',
        address: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        vno: [{ required: true, message: '墓号不能为空', trigger: 'blur' }]
      },
      ruleslink: {

      }
    }
  },
  computed: {
    cems() {
      return this.$store.state.cemetery.cems
    }
  },
  created() {
    this.getList()
    listType()
      .then(response => {
        this.cemeteryType = response.data
      })
  },
  methods: {
    getList() {
      this.listlinkLoading = true
      listlink(this.listQuery)
        .then(response => {
          this.listlink = response.data.data
        })
        .catch(() => {
          this.list = []
          this.listlinkLoading = false
        })
    },

    handleBury() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handlelink() {
      this.dialogStatus = 'create'
      this.dialogFormVisiblelink = true
    },
    handleUpdate(row) {

    },
    handleDelete(row) {

    },
    updateData() {

    },
    createData() {

    },
    updateDatalink() {

    },
    createDatalink() {
      this.dataFormlink.cid = this.cems.id
      this.$refs['dataFormlink'].validate(valid => {
        if (valid) {
          createlink(this.dataFormlink)
            .then(response => {
              this.listlink.unshift(response.data)
              this.dialogFormVisiblelink = false
              this.$notify.success({
                title: '成功',
                message: '添加联系人成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.msg
              })
            })
        }
      })
    },
    handleUpdatelink(row) {

    },
    handleDeletelink(row) {

    }
  }
}
</script>
<style>

.dialog .el-dialog{
  margin-top: 5vh!important;
}
.dialog .el-form-item__label{
  width: 70px !important
}
.dialog .el-form-item--medium .el-form-item__content{
 margin-left: 70px !important;
}
.dialog .dataFormlinkman .el-form-item__label{
 width: 85px !important
}
.linkman{
  height: 100px;
  margin-top: 15px;
}
.dialog .dataFormlinkman .el-form-item--medium .el-form-item__content{
 margin-left: 85px !important;
}
.dialog .el-dialog__body{
  height: auto!important;
}
</style>

