<template>
  <div class="md-container">
    <div class="left-side-bar" :class="{ 'open': isSidebarOpen, 'closed': !isSidebarOpen }">
      <div class="sidebar-header">
        <svg class="icon svg-icon" aria-hidden="true">
          <use xlink:href="#icon-markdown1" />
        </svg>
        <span>Markdown</span>
      </div>
      <SideBar @change-markdown="changeMarkdown" />
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
            <el-button type="primary" size="mini" @click="shareDialogVisible=true">分享</el-button>
            <el-button type="primary" size="mini" @click="moveFileDialogVisible=true">move</el-button>
            <el-button type="primary" size="mini" @click="submitForm('ruleForm')">保存</el-button>
          </div>
        </div>

        <div>
          <div id="vditor" />
        </div>
      </div>
    </div>

    <Share :id="currentContentId" :show="shareDialogVisible" @close-dialog="closeDialog" />
    <MoveFile :id="currentContentId" :show="moveFileDialogVisible" @close-dialog="closeDialog" />
  </div>
</template>

<script>
// import { post } from '@/api/post'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import SideBar from '@/views/markdown/SideBar.vue'
import { getFileContent, updateFileContent } from '@/api/file'
import Share from '@/views/markdown/Share.vue'
import MoveFile from '@/views/markdown/MoveFile.vue'
import { Navbar } from '@/layout/components'

export default {
  name: 'TopicPost',
  components: { Navbar, MoveFile, Share, SideBar },

  data() {
    return {
      contentEditor: {},
      currentContentId: '',
      ruleForm: {
        title: '', // 标题
        content: '' // 内容
      },
      rules: {
        title: [
          { message: '请输入话题名称', trigger: 'blur' },
          {
            min: 1,
            max: 25,
            message: '长度在 1 到 25 个字符',
            trigger: 'blur'
          }
        ]
      },
      createDialogVisible: false,
      shareDialogVisible: false,
      moveFileDialogVisible: false,
      createType: 'file', // 新建类型,文件夹或文件
      currentParentId: '',
      isSidebarOpen: true
    }
  },
  mounted() {
    this.contentEditor = new Vditor('vditor', {
      'height': '100%',
      'width': '100%',
      minHeight: document.documentElement.scrollHeight - 200,
      placeholder: '此处为话题内容……',
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
  methods: {
    async submitForm(formName) {
      const content = this.contentEditor.getValue()
      const res = await updateFileContent({
        'content': content,
        'file_id': this.currentContentId
      })
      const { code, data, msg } = res
      if (code === 200) {
        this.$message.success(msg)
      } else {
        console.log('error submit!!data:', data)
        this.$message.error(msg)
      }
    },
    async changeMarkdown(id, name) {
      this.ruleForm.title = name
      this.currentContentId = id
      const res = await getFileContent(id)
      const { code, data, msg } = res
      if (code === 200) {
        this.contentEditor.setValue(data)
      } else {
        this.$message.error(msg)
      }
    },
    closeDialog() {
      this.createDialogVisible = false
      this.shareDialogVisible = false
      this.moveFileDialogVisible = false
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
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
    .sidebar-header{
      display: grid;
      place-items: center; /* 水平和垂直居中对齐 */

      font-size: 42px;
      span{
        font-size: 35px;
      }
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
