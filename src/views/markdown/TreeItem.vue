<template>
  <span class="tree-item">
    <span class="file-icon">
      <svg class="icon" aria-hidden="true">
        <use v-if="nodeData.type===1" xlink:href="#icon-wenjianleixing-suolvetu-wenjianjia" />
        <use v-if="nodeData.type===0" xlink:href="#icon-markdown2" />
      </svg>
    </span>
    <span class="title">
      <span v-if="isEditor">
        <el-input
          v-model="nodeData.name"
          :placeholder="请输入文件名"
          size="mini"
          @change="renameFile"
        />
      </span>
      <span v-else>
        <span class="title-span">{{ nodeData.name }} </span>
      </span>
    </span>
    <span class="menuIcon">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link menuIcon">
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="!nodeData.isLeaf" command="createFile" :disabled="!nodeData.permissions.manage">
            <i class="icon iconfont icon-xinjian" />
            新建文件
          </el-dropdown-item>
          <el-dropdown-item v-if="!nodeData.isLeaf" command="createFolder" :disabled="!nodeData.permissions.manage">
            <i class="icon iconfont icon-wenjian" />
            新建文件夹
          </el-dropdown-item>
          <el-dropdown-item v-if="!(nodeData.id==='undefined')" command="share" :disabled="!nodeData.permissions.manage">
            <i class="icon iconfont icon-fenxiang_2" />
            分享
          </el-dropdown-item>
          <el-dropdown-item v-if="!nodeData.isRoot" command="delete" :disabled="!nodeData.permissions.manage">
            <i class="icon iconfont icon-shanchu" />
            删除
          </el-dropdown-item>
          <el-dropdown-item v-if="!nodeData.isRoot" command="move" :disabled="!nodeData.permissions.manage">
            <i class="icon iconfont icon-yidongwenjian" />
            移动
          </el-dropdown-item>
          <el-dropdown-item v-if="!(nodeData.id==='undefined')" command="rename" :disabled="!nodeData.permissions.write">
            <i class="icon iconfont icon-zhongmingming" />
            重命名
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </span>
  </span>
</template>
<script >
import { createFile, createFolder, deleteFile, getFileInfo, rename } from '@/api/file'

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
    async handleCommand(command) { // 处理下拉菜单点击事件
      switch (command) {
        case 'createFile':await this.create('file'); break
        case 'createFolder':await this.create('folder'); break
        case 'delete':await this.delete(); break
        case 'rename':this.startRenameFile(); break
        case 'share':this.$emit('open-share', this.nodeData); break// 打开分享对话框
        case 'move':this.$emit('open-move', this.nodeData); break// 打开移动对话框
      }
    },
    async create(type) { // 创建文件或文件夹
      console.log(this.nodeData.id)
      const submitData = { content: '', parent_id: this.nodeData.id, file_name: '未命名' + (type === 'file' ? '文件' : '文件夹') }
      const res = type === 'file' ? await createFile(submitData) : await createFolder(submitData)
      const { code, data, msg } = res
      if (code === 200) {
        this.$message.success('创建成功!')
        const res1 = await getFileInfo(data)
        const { code: code1, data: data1, msg: msg1 } = res1
        if (code1 === 200) {
          // 同步添加节点
          await this.$store.dispatch('menu/appendAt', { nodeId: this.nodeData.id, fileData: data1 })
        } else { this.$message.error(msg1) }
      } else { this.$message.success(msg) }
    },
    async delete() { // 删除文件或文件夹
      const id = this.nodeData.id
      const res = await deleteFile(id)
      const { code } = res
      if (code === 200) {
        this.$message.success('删除成功')
        this.$store.dispatch('menu/deleteNode', id) // 同步删除节点
      }
    },
    startRenameFile() { this.isEditor = true },
    renameFile(file_name) {
      const renameData = { file_name: file_name, file_id: this.nodeData.id }
      const res = rename(renameData)
      const { code } = res
      if (code === 200) { this.$message.success('重命名成功') }
      this.isEditor = false
    }
  }
}

</script>
<style scoped lang="less">

.tree-item {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding-right: 10px;
  .file-icon {
    flex: 1;
    margin-right: 10px; /* 调整图标与标题之间的间距 */
    max-width: 16px;
  }
  .title {
    flex: 1; /* 填充剩余空间 */
    white-space: nowrap; /* 防止标题换行 */
    overflow: hidden; /* 超出部分隐藏 */
    font-family: "Microsoft YaHei UI";
    text-overflow: ellipsis; /* 显示省略号 */
    .title-span{
      flex:1
    }
  }
  .menuIcon {
    flex: 1;
    margin-right: 8px;
    position: relative;
    right:0;
    max-width: 16px;
   }
}

.el-dropdown-link{
  margin-right: 10px;
}

.title-span{
  overflow: hidden; /* 当内容超出容器范围时隐藏 */
  white-space: nowrap; /* 防止内容换行 */
  text-overflow: ellipsis; /* 使用省略号显示溢出内容 */
}

</style>
