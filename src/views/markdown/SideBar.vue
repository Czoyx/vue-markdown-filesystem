<template>
  <div>
    <el-tree
      ref="tree"
      :data="treeData"
      :props="props"
      :load="loadNode"
      :current-node-key="currentNodeKey"
      node-key="id"
      lazy
      @current-change="handleNodeClick"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => createFolderOrFile(data,'file')"
          >
            新建
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => deleteFolderOrFile(data)"
          >
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
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
import { deleteFile, getFileList, getFileListById } from '@/api/file'

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
      currentNodeKey: '',
      treeData: []
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
      console.log('side1', this.$refs.tree.getNode())
      this.currentId = node.id ? node.id : node.parentId
      if (node.leaf) {
        if (node.id) {
          this.$emit('change-markdown', node.id, node.name)
          console.log(node)
        }
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
            console.log('treeData', this.treeData)
            return resolve(fileList)
          } else {
            return resolve([{ name: '暂无数据', leaf: true, parentId: node.data.id }])
          }
        } else {
          this.$message.error(msg)
          resolve([])
        }
      }
    },
    async createFolderOrFile(node, type) {
      if (type === 'file') {
        this.$emit('create-file', node.id)
      } else {
        this.$emit('create-folder', node.id)
      }
    },
    deleteFolderOrFile(node) {
      const res = deleteFile(node.id)
      const { code, data, msg } = res
      if (code === 200) {
        this.$message.success('删除成功')
      }
    }
  }
}
</script>
