<template>
  <div id="app" class="container">
    <el-tree
      ref="tree"
      :data="treeData"
      :props="defaultProps"
      :expand-on-click-node="false"
      class="filter-tree"
      node-key="id"
      @node-contextmenu="handleContextMenu"
      @node-expand="handleNodeExpand"
      @current-change="handleNodeExpand"
    />
  </div>
</template>

<script>

export default {
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
