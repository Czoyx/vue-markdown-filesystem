<template>
  <div id="md-content" class="container">

    <el-card v-loading="loading">
      <div class="title-bar">
        <div class="title">
          <svg class="icon svg-icon" aria-hidden="true">
            <use xlink:href="#icon-markdown2" />
          </svg>
          <span class="fa fa fa-book ">{{ ruleForm.title }} </span>
        </div>
        <div class="tool">
          <el-button v-if="manageable" type="primary" size="mini" @click="openShareDialogWithData(currentContentNodeData)">分享</el-button>
          <el-button v-if="manageable" type="primary" size="mini" @click="openMoveFileDialogWithData(currentContentNodeData)">move</el-button>
          <el-button v-if="!readOnly" type="primary" size="mini" @click="submitForm('ruleForm')">保存</el-button>
        </div>
      </div>
      <div
        class="vvvditor-wrapper"
        :class="readOnly ? 'rrreadonly' : ''"
      >
        <div
          id="vditor"
          ref="vditor-container"
          v-loading="loading"
        />
      </div>
    </el-card>

  </div>
</template>
<script>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { getFileContent, updateFileContent } from '@/api/file'

export default {
  name: 'MDContent',
  props: {
    currentContentNodeData: {
      type: Object,
      required: true
    },
    ruleForm: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      default: true
    },
    manageable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {
    this.loadEditor()
    window.addEventListener('keydown', this.handleKeyUp)
  },
  beforeDestroy() {
    // 在组件销毁前移除事件监听器
    window.removeEventListener('keydown', this.handleKeyUp)
  },
  methods: {
    async loadEditor() {
      this.loading = true // 开始加载时设置loading为true
      try {
        this.contentEditor = new Vditor('vditor', {
          height: '100%',
          width: '100%',
          minHeight: document.documentElement.scrollHeight - 200,
          placeholder: '# 开始输入Markdown内容',
          theme: 'classic',
          counter: { enable: true, type: 'markdown' },
          preview: { delay: 0, hljs: { style: 'monokai', lineNumber: true }},
          tab: '\t',
          typewriterMode: true,
          toolbarConfig: { pin: true },
          cache: { enable: false },
          mode: 'ir'
        })
      } finally {
        this.loading = false // 加载完成后设置loading为false
      }
    },
    async submitForm(formName) {
      this.loading = true // 提交数据前设置loading为true
      const content = this.contentEditor.getValue()
      const res = await updateFileContent({
        'content': content,
        'file_id': this.currentContentNodeData.id
      })
      const { code, data, msg } = res
      this.loading = false // 提交完成后设置loading为false
      if (code === 200) {
        this.$message.success(msg)
      } else {
        console.log('error submit!!data:', data)
        this.$message.error(msg)
      }
    },
    async changeMarkdown1(id, name, per) {
      this.loading = true // 加载内容前设置loading为true
      const res = await getFileContent(id)
      const { code, data, msg } = res
      this.loading = false // 加载完成后设置loading为false
      if (code === 200) {
        this.contentEditor.setValue(data, true)
        this.readOnly = !per.write
        this.manageable = per.manage
        await this.$forceUpdate()
      } else {
        this.$message.error(msg)
      }
    },
    openShareDialogWithData(nodeData) {
      this.$emit('open-share', nodeData)
    },
    openMoveFileDialogWithData(nodeData) {
      this.$emit('open-move', nodeData)
    },
    handleKeyUp(event) {
      // 检查按下的键是否是回车键
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault() // 阻止浏览器默认保存操作
        if (!this.readOnly) {
          this.submitForm()
        } else {
          this.$message.warning('无权限！')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">

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

.left-side-bar{
  width: 250px;
}

.vvvditor-wrapper.rrreadonly ::v-deep{
  pointer-events: none;
}

</style>
