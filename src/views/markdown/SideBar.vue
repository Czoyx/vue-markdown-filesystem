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
        <TreeItem
          :node="node"
          :node-data="data"
          @append="(child) => append(data,child)"
        />
      </span>
    </el-tree>
  </div>
</template>

<script>
import { getFileList, getFileListById } from '@/api/file'
import TreeItem from '@/views/markdown/TreeItem.vue'

export default {
  components: { TreeItem },
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
    append(data, newChild) {
      if (!this.nodeData.children) {
        this.$set(this.nodeData, 'children', [])
      }
      this.nodeData.children.push(newChild)
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
            }
            return obj
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
    }
  }
}
</script>
