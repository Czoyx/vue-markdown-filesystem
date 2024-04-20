<template>
  <span>
    <span v-if="isEditor">
      <el-input
        v-model="nodeData.name"
        :placeholder="请输入文件名"
        size="mini"
        @change="renameFile"
      />
    </span>
    <span v-else>
      {{ nodeData.name }}
    </span>
    <span>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="nodeData.permission." command="createFile">新建文件</el-dropdown-item>
          <el-dropdown-item command="createFolder">新建文件夹</el-dropdown-item>
          <el-dropdown-item command="delete">删除</el-dropdown-item>
          <el-dropdown-item command="rename">重命名</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </span>
  </span>
</template>
<script >
import { createFile, createFolder, deleteFile, rename } from '@/api/file'
import Vue from 'vue'

export default {
  props: {
    node: {
      type: Object,
      required: true
    },
    nodeData: {
      type: Object,
      required: true
    },
    isEditor: {
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
    handleCommand(command) {
      this.$message('click on item ' + command)
      switch (command) {
        case 'createFile':
          this.create('file')
          break
        case 'createFolder':
          this.create('folder')
          break
        case 'delete':
          this.delete()
          break
        case 'rename':
          this.startRenameFile()
          break
      }
    },
    handleClose() {
      this.$emit('close-dialog')
    },
    append(parentid, newChild) {
      const childNodes = [newChild]
      for (const child of this.nodeData.children) {
        if (child.id !== '') {
          childNodes.push(child)
        }
      }
      Vue.set(this.nodeData, 'children', childNodes)
    },
    deleteChild(id) {
      const childNodes = []
      for (const child of this.nodeData.children) {
        if (child.id !== id) {
          childNodes.push(child)
        }
      }
      Vue.set(this.nodeData, 'children', childNodes)
    },
    async create(type) {
      const submitData = {
        content: '',
        file_name: '未命名' + (type === 'file' ? '文件' : '文件夹'),
        parent_id: this.nodeData.id
      }
      const res = type === 'file' ? await createFile(submitData) : await createFolder(submitData)
      const { code, data } = res
      if (code === 200) {
        this.$message.success('创建成功!')
        this.$emit('finish-create', data)
      }
      this.$store.dispatch('menu/appendAt', { nodeId: this.nodeData.id, newChild: {
        id: data,
        name: submitData.file_name,
        isLeaf: type === 'file', // 如果type为0，则为文件，没有子节点
        children: null
      }})
    },
    async delete() {
      const id = this.nodeData.id
      const res = await deleteFile(id)
      const { code } = res
      if (code === 200) {
        this.$message.success('删除成功')
        this.$store.dispatch('menu/deleteNode', id)
      }
    },
    startRenameFile() {
      this.isEditor = true
    },
    renameFile(file_name) {
      const renameData = {
        file_name: file_name,
        file_id: this.nodeData.id
      }
      const res = rename(renameData)
      const { code } = res
      if (code === 200) {
        this.$message.success('重命名成功')
      }
      this.isEditor = false
    }
  }
}

</script>
<style scoped lang="scss">

</style>
