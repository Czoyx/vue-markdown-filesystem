<template>
  <div class="md-container">
    <div class="left-side-bar">
      <SideBar @change-markdown="changeMarkdown" @create-file="createFile" />
      <SideBar2 @change-markdown="changeMarkdown" />
      <el-button type="primary" @click="shareDialogVisible=true">分享</el-button>
    </div>
    <div class="md-content">
      <el-card
        class="box-card"
        shadow="never"
      >
        <el-card class="title"><i class="fa fa fa-book">{{ ruleForm.title }} </i></el-card>
        <el-card>
          <el-button type="primary" @click="shareDialogVisible=true">分享</el-button>
          <el-button type="primary" @click="moveFileDialogVisible=true">move</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </el-card>
      </el-card>

      <div
        slot="header"
        class="clearfix"
      />
      <div>
        <div id="vditor" />
      </div>
    </div>
    <CreateDialog :id="currentParentId" :show="createDialogVisible" :create-type="createType" @close-dialog="closeDialog" />
    <Share :id="currentParentId" :show="shareDialogVisible" @close-dialog="closeDialog" />
    <MoveFile :id="currentParentId" :show="moveFileDialogVisible" @close-dialog="closeDialog" />
  </div>
</template>

<script>
// import { post } from '@/api/post'
// at.alicdn.com/t/c/font_4516165_6yp6n203kcu.css
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import SideBar from '@/views/markdown/SideBar.vue'
import SideBar2 from '@/views/markdown/SideBar2.vue'
import { getFileContent, updateFileContent } from '@/api/file'
import CreateDialog from '@/views/markdown/CreateDialog.vue'
import Share from '@/views/markdown/Share.vue'
import MoveFile from '@/views/markdown/MoveFile.vue'

export default {
  name: 'TopicPost',
  components: { MoveFile, Share, CreateDialog, SideBar, SideBar2 },

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
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (
            this.contentEditor.getValue().length === 1 ||
            this.contentEditor.getValue() == null ||
            this.contentEditor.getValue() === ''
          ) {
            this.$message.warning('话题内容不可为空')
            return false
          }
          const content = this.contentEditor.getValue()
          const res = await updateFileContent({
            'content': content,
            'file_id': this.currentContentId
          })
          const { code, data, msg } = res
          if (code === 200) {
            this.$message.success(msg)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.contentEditor.setValue('')
      this.ruleForm.tags = ''
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
    createFile(id, type) {
      this.currentParentId = id
      if (type === 'folder') {
        this.createType = 'folder'
      }
      this.createDialogVisible = true
    },
    closeDialog() {
      this.createDialogVisible = false
      this.shareDialogVisible = false
    }
  }
}
</script>

<style scoped lang="less">
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
    height: 100%;
    background-color: #fff;
  }
}
</style>
