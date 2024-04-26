<template>
  <div class="md-container">
    <div class="left-side-bar" :class="{ 'open': isSidebarOpen, 'closed': !isSidebarOpen }">

      <SideBar @change-markdown="changeMarkdown" @open-share="openShareDialogWithData" @open-move="openMoveFileDialogWithData" />
    </div>
    <div class="right-content" :class="{ 'open': isSidebarOpen, 'closed': !isSidebarOpen }">
      <navbar @toggleSidebar="toggleSidebar" />
      <div v-if="currentContentNodeData!==undefined" class="md-content">
        <MDContent
          ref="mdContent"
          :rule-form="ruleForm"
          :current-content-node-data="currentContentNodeData"
          @open-share="openShareDialogWithData"
          @open-move="openMoveFileDialogWithData"
        />
      </div>
    </div>

    <Share ref="shareDialog" :show="shareDialogVisible" @close-dialog="closeDialog" />
    <MoveFile ref="moveDialog" :show="moveFileDialogVisible" :root-data="rootData" @close-dialog="closeDialog" />
  </div>
</template>

<script>
// import { post } from '@/api/post'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import SideBar from '@/views/markdown/SideBar.vue'
import MDContent from '@/views/markdown/MDContent.vue'
import { getFileContent, getFileInfo, updateFileContent } from '@/api/file'
import Share from '@/views/markdown/Share.vue'
import MoveFile from '@/views/markdown/MoveFile.vue'
import { Navbar } from '@/layout/components'

export default {
  name: 'TopicPost',
  components: { Navbar, MoveFile, Share, SideBar, MDContent },

  data() {
    return {
      currentContentNodeData: undefined,
      ruleForm: {
        title: '', // 标题
        content: '' // 内容
      },
      shareDialogVisible: false,
      moveFileDialogVisible: false,
      isSidebarOpen: true,
      rootData: {
        id: 'undefined',
        name: '我的云文档',
        isLeaf: false,
        permissions: {
          read: true,
          write: true,
          manage: true
        },
        type: 1,
        isRoot: true
      }
    }
  },
  async created() {
    const rootID = this.$route.query.fileId || 'undefined'
    if (rootID === 'undefined') {
      this.$store.dispatch('menu/loadChildrenForNode', rootID)
      return
    }
    const res = await getFileInfo(rootID)
    const { code, data } = res
    if (code === 200) {
      await this.$store.dispatch('menu/initRootNode', data)
      this.rootData = data
      // await this.$store.dispatch('menu/loadChildrenForNode', rootID)
    }
  },
  methods: {
    async changeMarkdown(nodaDate) {
      this.currentContentNodeData = nodaDate
      this.ruleForm.title = nodaDate.name
      await this.$forceUpdate()
      await this.$refs.mdContent.changeMarkdown1(nodaDate.id, nodaDate.name, nodaDate.permissions)
    },
    closeDialog() {
      this.shareDialogVisible = false
      this.moveFileDialogVisible = false
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    async openShareDialogWithData(nodeData) {
      await this.$refs.shareDialog.reloadData(nodeData)
      this.shareDialogVisible = true
    },
    openMoveFileDialogWithData(nodeData) {
      this.$refs.moveDialog.reloadData(nodeData)
      this.moveFileDialogVisible = true
    }
  }
}
</script>

<style scoped lang="less">
@sidebar-width: 250px;
@transition-speed: 0.3s;

.md-container{
  display: flex;
  .left-side-bar{
    width: @sidebar-width;
    height: 100%;
    background-color: #f4f4f4;
    position: fixed;
    margin-top: 0;
    &.open {
      width: @sidebar-width; // 展开状态
    }

    &.closed {
      width: 0; // 隐藏状态
    }
  }

  .right-content{
    margin-left:  @sidebar-width; /* Same as sidebar width */
    height: 100%;
    flex-grow: 1;
    overflow-y: auto;
    background-color: #fff;
    transition: margin-left @transition-speed;
    &.closed {
      margin-left: 0; // 当侧边栏隐藏时
    }
    .md-content{
      margin: 20px;
      display: flex;
      flex-direction: column;

      .title-bar{
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
        margin-bottom: 10px;
        .title{
          display: flex;
          font-weight: bolder;
          font-size: 1.5rem;
          white-space: nowrap; /* 防止标题换行 */
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 显示省略号 */
        }
        .tool{
          display: flex;
          flex-wrap: nowrap;
        }
      }
    }
  }

}

.left-side-bar{
  width: 250px;
}

</style>
