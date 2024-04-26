<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    width="500px"
    :before-close="handleClose"
  >
    <el-card style="border-radius: 10px;margin: 10px">
      <el-form label-width="70px" label-position="left">
        <el-form-item label="链接">
          <el-row span="24" gutter="5">
            <el-col span="18">
              <el-input ref="input" :value="fileUrl" :disabled="true" readonly />
            </el-col>
            <el-col span="4">
              <el-button ref="copyButton" type="primary" @click="copyToClipboard">复制</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="链接权限">
          <el-row span="24" gutter="5">
            <el-col span="12">
              <el-select
                v-model="allUserPermission.user"
                placeholder="请选择范围"
                style="width: 100%"
              >
                <el-option
                  v-for="item in allUserList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col span="7">
              <el-select
                v-model="allUserPermission.permission"
                placeholder="请选择权限"
                style="width: 100%"
              >
                <el-option
                  v-for="item in control"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="border-radius: 10px;margin: 10px">
      <div>
        <span
          style="vertical-align: middle;
                  float: left;
                  font-size: 14px;
                  color: #606266;
                  line-height: 40px;
                  padding: 0 12px 0 0;
                  font-weight: 700;"
        >
          协作者
        </span>
        <el-table
          :data="permissionList"
          tyle="width: 100%"
        >
          <el-table-column label="协作者">
            <template slot="header" slot-scope="scope">
              <el-select v-model="currentAddUserData.userId" filterable placeholder="请选择">
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
            <template slot-scope="scope">
              <div style="display: flex;align-items: center">
                <el-avatar :style="`background:${extractColorByName(scope.row.user_name)}`" class="avatar">
                  {{ scope.row.user_name }}
                </el-avatar>
                <span>{{ scope.row.user_name }}</span>
              </div>
            </template>
          </el-table-column>
          <!--          <el-table-column prop="username" label="用户名" />-->
          <el-table-column
            label="操作"
          >
            <template slot="header" slot-scope="scope">
              <div style="display: flex;flex-wrap: nowrap">
                <el-select
                  v-model="currentAddUserData.permissionIndex"
                  placeholder="请选择权限"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in control"
                    :key="item.name"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
                <el-button
                  size="mini"
                  @click="handleAddUser"
                >
                  <i class="icon iconfont icon-tianjiarenyuan" />
                </el-button>
              </div>

            </template>
            <template slot-scope="scope">
              <div style="display: flex;flex-wrap: nowrap">
                <el-select
                  v-model="scope.row.permissionIndex"
                  placeholder="请选择权限"
                  style="width: 100%"
                  @change="(value)=>handleChange(value,scope.row)"
                >
                  <el-option
                    v-for="item in control"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
                <el-button
                  size="mini"
                  @click="handleDelete(scope.$index,scope.row)"
                >
                  <i class="icon iconfont icon-shanchu" />
                </el-button>
              </div>

            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

  </el-dialog>
</template>
<script>

import { listPermission, updatePermission } from '@/api/permission'
import { extractColorByName } from '@/utils/avatar'
import { listUser } from '@/api/user'

export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: ''
    },
    fileUrl: {
      type: String,
      default: 'localhost:9528/#/?fileId='
    },
    title: {
      type: String,
      default: '分享'
    },
    permissionList: {
      type: Array,
      default: () => [
        {
          user_name: '156645646',
          user_id: 123123,
          permissionIndex: 1,
          fileID: 'dwdadsad'
        }
      ]
    }
  },
  data() {
    return {
      permissionIndex: [
        {
          read: false,
          write: false,
          manage: false

        },
        {
          read: true,
          write: false,
          manage: false

        },
        {
          read: true,
          write: true,
          manage: false

        },
        {
          read: true,
          write: true,
          manage: true

        }
      ],
      control: [
        {
          name: '读',
          value: 1
        },
        {
          name: '写',
          value: 2
        },
        {
          name: '管理',
          value: 3
        }
      ],
      allUserList: [
        {
          label: '所有人',
          value: 123456
        },
        {
          label: '指定人',
          value: 0
        }
      ],
      userList: [
        {
          'id': '123456',
          'name': 'string'
        }
      ],
      currentAddUserData: {
        userId: undefined,
        permissionIndex: undefined
      },
      allUserPermission: {
        user: 0,
        permission: 1
      }
    }
  },
  methods: {
    extractColorByName,
    handleClose() {
      this.$emit('close-dialog')
    },
    async submit() {
      // const submitData = {
      //   content: '',
      //   file_name: this.form.name,
      //   parent_id: this.id
      // }
    },
    copyToClipboard() {
      const textToCopy = this.$refs.input.value // 从输入框获取文本
      if (navigator.clipboard) {
        // 检查浏览器是否支持 clipboard API
        navigator.clipboard.writeText(textToCopy).then(() => {
          console.log('复制成功！')
        }).catch(err => {
          console.error('复制失败：', err)
        })
      } else {
        console.error('浏览器不支持 Clipboard API')
      }
    },
    async reloadData(nodeData) {
      this.id = nodeData.id
      this.title = '分享 ' + nodeData.name
      this.fileUrl = location.host + '/#/?fileId=' + String(this.id)
      console.log(this.fileUrl)
      {
        const res = await listUser(this.id)
        const { code, data, msg } = res
        if (code === 200) {
          this.userList = data
        } else {
          this.$message.error(msg)
        }
      }
      {
        const res = await listPermission(this.id)
        const { code, data, msg } = res
        if (code === 200) {
          const newData = data.map(item => {
            return {
              ...item,
              permissionIndex: this.permissionIndex.findIndex(
                i => (i.read === item.permission.read &&
                  i.write === item.permission.write &&
                  i.manage === item.permission.manage))
            }
          })
          this.permissionList = newData
        } else {
          this.$message.error(msg)
        }
      }
    },
    async handleChange(value, row) {
      const req = {
        'file_id': this.id,
        'permission': this.permissionIndex[value],
        'user_id': row.user_id
      }
      const res = await updatePermission(req)
      const { code, data, msg } = res
      if (code === 200) {
        console.log(data)
      } else {
        this.$message.warning(msg)
      }
    },
    async handleDelete(index, row) {
      const req = {
        'file_id': this.id,
        'permission': this.permissionIndex[0],
        'user_id': row.user_id
      }
      const res = await updatePermission(req)
      const { code, data, msg } = res
      if (code === 200) {
        this.permissionList.splice(index, 1)
        console.log(data)
      } else {
        this.$message.warning(msg)
      }
    },
    async handleAddUser() {
      if (this.currentAddUserData.permissionIndex && this.currentAddUserData.userId) {
        const req = {
          'file_id': this.id,
          'permission': this.permissionIndex[this.currentAddUserData.permissionIndex],
          'user_id': this.currentAddUserData.userId
        }
        const res = await updatePermission(req)
        const { code, data, msg } = res
        if (code === 200) {
          this.permissionList.push({
            user_name: this.userList.filter(item => item.id === this.currentAddUserData.userId)[0].name,
            user_id: this.currentAddUserData.userId,
            permissionIndex: this.currentAddUserData.permissionIndex,
            file_id: this.id
          })
          console.log(data)
        } else {
          this.$message.warning(msg)
        }
      }
    }
  }
}

</script>
<style scoped lang="scss">
.avatar {
  transform: scale(0.7);
}

::v-deep .el-table {
  td {
    padding: 1px;
  }

  .cell {
    padding: 0;
  }
}
</style>
