<template>
  <div class="md-container">
    <div class="left-side-bar" :class="{ 'open': isSidebarOpen, 'closed': !isSidebarOpen }">

      <SideBar @change-markdown="changeMarkdown" @open-share="openShareDialogWithData" @open-move="openMoveFileDialogWithData" />
    </div>
    <div class="right-content" :class="{ 'open': isSidebarOpen, 'closed': !isSidebarOpen }">
      <navbar @toggleSidebar="toggleSidebar" />
      <div class="md-content">
        <div class="title-bar">
          <div class="title">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-markdown2" />
            </svg>
            <span class="fa fa fa-book ">{{ ruleForm.title }} </span>
          </div>
          <div class="tool">
            <el-button type="primary" size="mini" @click="openShareDialogWithData(currentContentNodeData)">分享</el-button>
            <el-button type="primary" size="mini" @click="openMoveFileDialogWithData(currentContentNodeData)">move</el-button>
            <el-button type="primary" size="mini" @click="submitForm('ruleForm')">保存</el-button>
          </div>
        </div>

        <div>
          <div id="vditor" ref="vditor-container" class="vditor-container" />
        </div>
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
import { getFileContent, getFileInfo, updateFileContent } from '@/api/file'
import Share from '@/views/markdown/Share.vue'
import MoveFile from '@/views/markdown/MoveFile.vue'
import { Navbar } from '@/layout/components'

export default {
  name: 'TopicPost',
  components: { Navbar, MoveFile, Share, SideBar },

  data() {
    return {
      contentEditor: {},
      currentContentNodeData: '',
      ruleForm: {
        title: '', // 标题
        content: '' // 内容
      },
      shareDialogVisible: false,
      moveFileDialogVisible: false,
      createType: 'file', // 新建类型,文件夹或文件
      currentParentId: '',
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
  mounted() {
    this.contentEditor = new Vditor('vditor', {
      'height': '100%',
      'width': '100%',
      minHeight: document.documentElement.scrollHeight - 200,
      placeholder: '# 开始输入Markdown内容',
      theme: 'classic',
      counter: {
        enable: true,
        type: 'markdown'
      },
      preview: {
        delay: 0,
        hljs: {
          style: 'monokai',
          lineNumber: true
        }
      },
      tab: '\t',
      typewriterMode: true,
      toolbarConfig: {
        pin: true
      },
      cache: {
        enable: false
      },
      mode: 'ir'
    })
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
    async submitForm(formName) {
      const content = this.contentEditor.getValue()
      const res = await updateFileContent({
        'content': content,
        'file_id': this.currentContentNodeData.id
      })
      const { code, data, msg } = res
      if (code === 200) {
        this.$message.success(msg)
      } else {
        console.log('error submit!!data:', data)
        this.$message.error(msg)
      }
    },
    async changeMarkdown(nodaDate, name, per) {
      this.ruleForm.title = name
      this.currentContentNodeData = nodaDate
      const res = await getFileContent(nodaDate.id)
      const { code, data, msg } = res
      if (code === 200) {
        this.contentEditor.setValue(data, true)
        if (per) {
          this.contentEditor.enable()
        } else {
          this.contentEditor.disabled()
        }
      } else {
        this.$message.error(msg)
      }
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
