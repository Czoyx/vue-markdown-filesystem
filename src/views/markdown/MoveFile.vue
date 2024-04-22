<template>
  <el-dialog
    title="移动"
    :visible.sync="show"
    width="60%"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="40px">
      <el-form-item label="路径">
        <el-cascader v-model="form.location" :props="treeProps" style="width: 100%" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </span>
  </el-dialog>
</template>
<script >
import { getFileListById, operateFile } from '@/api/file'

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
        location: '111111'
      },
      treeProps: {
        checkStrictly: true,
        lazy: true,
        async lazyLoad(node, resolve) {
          const { level } = node
          if (level === 0) {
            resolve([{
              value: 'undefined',
              label: '根目录',
              leaf: false
            }])
          } else {
            const res = await getFileListById(node.value)
            const { code, data, msg } = res
            if (code === 200) {
              const fileList = data.filter(item => item.type !== 0).map((obj) => {
                return {
                  value: obj.id,
                  label: obj.name,
                  leaf: obj.type === 0
                }
              })
              console.log('fileList', fileList)
              if (fileList.length > 0) {
                return resolve(fileList)
              } else {
                return resolve([])
              }
            }
          }
        }
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close-dialog')
    },
    async submit() {
      // console.log(this.form.id)
      console.log(this.form.location)
      console.log(this.form.location.length)
      const parent_id = this.form.location[this.form.location.length - 1]
      const submitData = {
        file_id: this.id,
        operate: 'move',
        parent_id: parent_id
      }
      const res = await operateFile(submitData)
      const { code, data } = res
      if (code === 200) {
        this.$message.success('移动成功')
        this.$store.dispatch('menu/moveNode', {
          nodeId: this.nodeData.id,
          parentID: this.nodeData.parent_id
        })
      }
    }
  }
}

</script>
<style scoped lang="scss">

</style>
