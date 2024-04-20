<template>
  <div id="app" class="container">
    <el-tree
      ref="tree"
      :data="this.$store.state.menu.treeData"
      :props="defaultProps"
      :expand-on-click-node="false"
      class="filter-tree"
      node-key="id"
      @node-contextmenu="handleContextMenu"
      @node-expand="handleNodeExpand"
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

export default {
  components: { TreeItem },
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
  created() {
    this.$store.dispatch('menu/fetchTreeData')
  },
  methods: {
    handleNodeExpand(node, nodeComponent) {
      if (!node.isLeaf) {
        // 如果节点没有子节点数据，触发加载
        this.$store.dispatch('menu/loadChildrenForNode', node.id)
      }
    },
    handleContextMenu(event, data, node, component) {
      event.preventDefault()
      // 你的右键菜单处理逻辑
    }
  }
}
</script>

<style scoped>
.container{
  margin-top: 50px;
}
</style>
