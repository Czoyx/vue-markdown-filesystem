<template>
  <div class="md-container">
    <div class="left-side-bar">
      <SideBar2 @change-markdown="changeMarkdown" />
      <el-button type="primary" @click="shareDialogVisible=true">分享</el-button>
    </div>
    <el-col class="md-content">
      <el-card
        class="box-card"
        shadow="never"
      >
        <div class="title-bar">
          <div class="title">
            <span class="fa fa fa-book ">{{ ruleForm.title }} </span>
          </div>
          <div class="tool">
            <el-button type="primary" @click="shareDialogVisible=true">分享</el-button>
            <el-button type="primary" @click="moveFileDialogVisible=true">move</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          </div>
        </div>

      </el-card>

      <div
        slot="header"
        class="clearfix"
      />
      <div>
        <div id="vditor" />
      </div>
    </el-col>

    <Share :id="currentContentId" :show="shareDialogVisible" @close-dialog="closeDialog" />
    <MoveFile :id="currentContentId" :show="moveFileDialogVisible" @close-dialog="closeDialog" />
  </div>
</template>

<script>
// import { post } from '@/api/post'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import SideBar2 from '@/views/markdown/SideBar2.vue'
import { getFileContent, updateFileContent } from '@/api/file'
import Share from '@/views/markdown/Share.vue'
import MoveFile from '@/views/markdown/MoveFile.vue'

export default {
  name: 'TopicPost',
  components: { MoveFile, Share, SideBar2 },

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
      currentParentId: ''
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
    }
  }
}
</script>

<style scoped lang="less">

.title-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title{
    font-weight: bolder;
    font-size: 1.5rem;
    margin-left: 0;
    order: 1;
    white-space: nowrap; /* 防止标题换行 */
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 显示省略号 */
  }

  .tool{
    margin-right: 0;
    order: 2;
  }
}

.md-container{
  display: flex;
  .left-side-bar{
    width: 250px;
    height: 100%;
    background-color: #f4f4f4;
    position: fixed;
  }
  .md-content{
    margin-left: 250px; /* Same as sidebar width */
    height: 100%;
    flex-grow: 1;
    overflow-y: auto;
    background-color: #fff;
  }
}

.left-side-bar{
  width: 250px;
}

</style>
