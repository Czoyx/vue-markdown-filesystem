<template>
  <div id="sidebar" class="container">
    <div class="sidebar-header">
      <div>
        <svg class="icon svg-icon" aria-hidden="true">
          <use xlink:href="#icon-markdown1" />
        </svg>
      </div>
      <span>
        Markdown
      </span>
    </div>
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
          @open-move="openMove"
          @open-share="openShare"
        />
      </span>
    </el-tree>
  </div>
</template>

<script>

import TreeItem from '@/views/markdown/TreeItem.vue'

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
          this.$emit('change-markdown', node)
          console.log(node)
        }
      }
    },
    openShare(data) {
      this.$emit('open-share', data)
    },
    openMove(data) {
      this.$emit('open-move', data)
    }
  }
}
</script>

<style scoped lang="less">

.sidebar-header{
  display: flex;
  place-items: center; /* 水平和垂直居中对齐 */
  flex-direction: column;
  font-size: 60px;
  span{
    margin-top: 0;
    font-size: 35px;
  }
}

.el-tree{
  margin-top: 20px;
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
