<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    width="60%"
    :before-close="handleClose"
  >
    <el-form label-width="70px">
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
        <el-select
          v-model="allUserPermission.user"
          placeholder="请选择范围"
          style="width: 50%"
        >
          <el-option
            v-for="item in userList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="allUserPermission.permission"
          placeholder="请选择权限"
          style="width: 50%"
        >
          <el-option
            v-for="item in control"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="协作者">
        <el-select
          :v-model="permissionList"
          filterable
          clearable
          multiple
          placeholder="请选择协作者"
          style="width: 50%"
        >
          <el-option v-for="item in permissionList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { listPermission, updatePermission } from '@/api/permission'

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
      default: 'http://localhost:9528/#/markdown?fileId='
    },
    title: {
      type: String,
      default: '分享'
    }
  },
  data() {
    return {
      control: [
        {
          label: '读',
          value: 1
        },
        {
          label: '写',
          value: 2
        },
        {
          label: '管理',
          value: 3
        }
      ],
      userList: [
        {
          label: '所有人',
          value: 123456
        },
        {
          label: '指定人',
          value: 0
        }
      ],
      allUserPermission: {
        user: 0,
        permission: 3
      },
      permissionList: []
    }
  },
  methods: {
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
      this.fileUrl = 'http://localhost:9528/#/markdown?fileId=' + String(this.id)
      console.log(this.fileUrl)
      const res = await listPermission(this.id)
      const { code, data, msg } = res
      if (code === 200) {
        this.permissionList = data
      } else {
        this.$message.error(msg)
      }
      this.$forceUpdate()
    },
    async submitPermission(data) {
      const req = {
        file_id: this.id,
        permission: data.permission,
        user_id: data.user_id
      }
      const res = await updatePermission(req)
      if (res.code === 200) {
        this.$message.success('权限更新成功')
      }
    }
  }
}

</script>
<style scoped lang="scss">

</style>
