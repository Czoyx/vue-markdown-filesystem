<template>
  <div id="sidebar" class="container">
    <el-tree
      ref="tree"
      :data="this.$store.state.menu.treeData"
      :props="defaultProps"
      :expand-on-click-node="false"
      class="filter-tree"
      node-key="id"
      @node-contextmenu="handleContextMenu"
      @node-expand="handleNodeExpand"
      @current-change="handleNodeClick"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <TreeItem
          :node="node"
          :node-data="data"
        />
      </span>
    </el-tree>
  </div>
</template>

<script>

import TreeItem from '@/views/markdown/TreeItem.vue'
import { getFileInfo } from '@/api/file'

export default {
  components: { TreeItem },
  props: {
    currentId: String
  },
  computed: {
    treeData() {
      console.log('side', this.$store.state.menu.treeData)
      return this.$store.state.menu.treeData
    },
    defaultProps() {
      return {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
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
      // await this.$store.dispatch('menu/loadChildrenForNode', rootID)
    }
  },
  methods: {
    handleNodeExpand(node, nodeComponent) {
      if (!node.isLeaf && node.id !== 'undefined') {
        // 如果节点没有子节点数据，触发加载
        this.$store.dispatch('menu/loadChildrenForNode', node.id)
      }
    },
    handleContextMenu(event, data, node, component) {
      event.preventDefault()
      // 你的右键菜单处理逻辑
    },
    handleNodeClick(node) {
      if (node.isLeaf) {
        if (node.id) {
          this.$emit('change-markdown', node.id, node.name)
          console.log(node)
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.container{
  margin-top: 10px;

}

::v-deep .el-tree {
  max-width: 100%;
  background-color: #f4f4f4;
  .el-tree-node__content:hover{
    background-color: #e0e0e0; /* 修改为你想要的颜色 */
    color: #1e7ffd; /* 修改文字颜色 */
  }
}

.custom-tree-node {
  display: flex;
  flex:1;
  width:100%;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  overflow: hidden; /* 超出部分隐藏 */
}

</style>
