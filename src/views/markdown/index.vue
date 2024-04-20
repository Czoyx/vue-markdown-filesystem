<template>
  <div class="md-container">
    <div class="left-side-bar">
      <SideBar @change-markdown="changeMarkdown" @create-file="createFile" />
      <SideBar2 />
    </div>
    <div class="md-content">
      <el-button type="primary" @click="shareDialogVisible=true">分享</el-button>
      <el-button type="primary" @click="moveFileDialogVisible=true">move</el-button>
      <el-card
        class="box-card"
        shadow="never"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span><i class="fa fa fa-book"> 主题 / 发布主题</i></span>
        </div>
        <div>
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            class="demo-ruleForm"
          >
            <el-form-item prop="title">
              <el-input
                v-model="ruleForm.title"
                placeholder="输入标题"
                :disabled="true"
              />
            </el-form-item>

            <!--Markdown-->
            <div id="vditor" />

            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('ruleForm')"
              >立即创建
              </el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
    <CreateDialog :id="currentParentId" :show="createDialogVisible" :create-type="createType" @close-dialog="closeDialog" />
    <Share :id="currentParentId" :show="shareDialogVisible" @close-dialog="closeDialog" />
    <MoveFile :id="currentParentId" :show="moveFileDialogVisible" @close-dialog="closeDialog" />
  </div>
</template>

<script>
// import { post } from '@/api/post'
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
          { required: true, message: '请输入话题名称', trigger: 'blur' },
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
      height: 500,
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
          // post(this.ruleForm).then((response) => {
          //   const { data } = response
          //   setTimeout(() => {
          //     this.$router.push({
          //       name: 'post-detail',
          //       params: { id: data.id }
          //     })
          //   }, 800)
          // })
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
  height: 100%;
  .left-side-bar{
    width: 250px;
    height: 100%;
    background-color: #f4f4f4;
    position: fixed;
  }
  .md-content{
    margin-left: 250px; /* Same as sidebar width */
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
    height: 100%;
    background-color: #fff;
  }

}
</style>
