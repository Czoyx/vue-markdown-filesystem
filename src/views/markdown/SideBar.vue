<template>
  <div>
    <el-tree
      :props="props"
      :load="loadNode"
      :current-node-key="currentNodeKey"
      :highlight-current="true"
      lazy
      @current-change="handleNodeClick"
      @node-click="handleNodeClick"
    />
    <!--    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">-->
    <!--      <el-radio-button :label="false">展开</el-radio-button>-->
    <!--      <el-radio-button :label="true">收起</el-radio-button>-->
    <!--    </el-radio-group>-->
    <!--    <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen" @close="handleClose">-->
    <!--      <el-submenu index="1">-->
    <!--        <template slot="title">-->
    <!--          <i class="el-icon-location" />-->
    <!--          <span slot="title">导航一</span>-->
    <!--        </template>-->
    <!--        <el-menu-item-group>-->
    <!--          <span slot="title">分组一</span>-->
    <!--          <el-menu-item index="1-1">选项1</el-menu-item>-->
    <!--          <el-menu-item index="1-2">选项2</el-menu-item>-->
    <!--        </el-menu-item-group>-->
    <!--        <el-menu-item-group title="分组2">-->
    <!--          <el-menu-item index="1-3">选项3</el-menu-item>-->
    <!--        </el-menu-item-group>-->
    <!--      </el-submenu>-->

    <!--    </el-menu>-->
  </div>
</template>

<script>
import { getFileList, getFileListById } from '@/api/file'

export default {
  data() {
    return {
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf',
        textId: 'id',
        key: 'id'
      },
      isCollapse: true,
      fileList: [],
      currentNodeKey: ''
    }
  },
  async mounted() {
    const res = await getFileList()
    const { code, data, msg } = res
    console.log(data)
    this.fileList = data
  },
  async created() {

  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    handleNodeClick(node) {
      if (node.leaf && node.id !== '') {
        this.$emit('change-markdown', node.id, node.name)
        console.log(node)
      }
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        const res = await getFileList()
        const { code, data, msg } = res
        if (code === 200) {
          const fileList = data.map((obj) => {
            if (obj.type === 0) {
              obj.leaf = true
              return obj
            } else {
              return obj
            }
          })
          // this.fileList = data.filter((obj) => {
          //   return obj.type === 1
          // })
          return resolve(fileList)
        } else {
          this.$message.error(msg)
          resolve([])
        }
      }
      if (node.level > 0 && !node.isLeaf) {
        console.log(node.data.id)
        const res = await getFileListById(node.data.id)
        const { code, data, msg } = res
        if (code === 200) {
          const fileList = data.map((obj) => {
            if (obj.type === 0) {
              obj.leaf = true
              return obj
            } else {
              return obj
            }
          })
          console.log('fileList', fileList)
          if (fileList.length > 0) {
            return resolve(fileList)
          } else {
            return resolve([{ name: '暂无数据', leaf: true }])
          }
        } else {
          this.$message.error(msg)
          resolve([])
        }
      }
      if (node.isLeaf) {
        console.log('点击了叶子节点')
      }
    }
  }
}
</script>
