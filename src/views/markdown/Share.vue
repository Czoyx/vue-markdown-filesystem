<template>
  <el-dialog
    title="分享"
    :visible.sync="show"
    width="60%"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="70px">
      <el-form-item label="链接">
        <el-row span="24" gutter="5">
          <el-col span="18">
            <el-input ref="input" v-model="form.url" :disabled="true" readonly />
          </el-col>
          <el-col span="4">
            <el-button ref="copyButton" type="primary" @click="copyToClipboard">复制</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="链接权限">
        <el-select
          v-model="form.control"
          clearable
          multiple
          placeholder="请选择链接权限"
          style="width: 100%"
        >
          <el-option v-for="item in control" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="协作者">
        <el-select
          v-model="form.userList"
          filterable
          clearable
          multiple
          placeholder="请选择协作者"
          style="width: 100%"
        >
          <el-option v-for="item in userList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </span>
  </el-dialog>
</template>
<script >
import { createFile, createFolder } from '@/api/file'

export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        id: '',
        url: '111111',
        control: [],
        userList: []
      },
      control: [
        {
          label: '读',
          value: 'read'
        },
        {
          label: '写',
          value: 'write'
        },
        {
          label: '管理',
          value: 'manage'
        }
      ],
      userList: [{ name: 'lsc' }]
    }
  },
  methods: {
    handleClose() {
      this.$emit('close-dialog')
    },
    async submit() {
      const submitData = {
        content: '',
        file_name: this.form.name,
        parent_id: this.id
      }
      const res = this.createType === 'file' ? await createFile(submitData) : await createFolder(submitData)
      const { code, data, msg } = res
      if (code === 200) {
        this.$message.success('创建成功!')
        this.form.name = ''
        this.handleClose()
      }
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
    }
  }
}

</script>
<style scoped lang="scss">

</style>
