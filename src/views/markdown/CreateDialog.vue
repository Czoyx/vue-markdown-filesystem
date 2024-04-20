<template>
  <el-dialog
    :title="createType==='file'?'新建文件':'新建文件夹'"
    :visible.sync="show"
    width="50%"
    :before-close="handleClose"
  >

    <el-form ref="form" :model="form" label-width="40px">
      <el-form-item label="名称">
        <el-input v-model="form.name" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script >
import { createFile, createFolder } from '@/api/file'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    createType: {
      type: String,
      default: 'file'
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: { id: '', name: '' }
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
    }
  }
}

</script>
<style scoped lang="scss">

</style>
