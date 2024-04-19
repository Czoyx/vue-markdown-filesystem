<template>
  <el-dialog
    title="提示"
    :visible.sync="show"
    width="30%"
    :before-close="handleClose"
  >

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="路径">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.name" />
      </el-form-item>
    </el-form>
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script >
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: { id: '', name: '', content: '' }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close-dialog')
    }
  }
}

</script>
<style scoped lang="scss">

</style>
