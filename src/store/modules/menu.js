
import { getFileListById } from '@/api/file'
import Vue from 'vue' // 确保这里路径正确

const state = {
  treeData: [{ name: '根目录', id: 'undefined', isLeaf: false }]
}

const mutations = {
  SET_TREE_DATA: (state, data) => {
    state.treeData = data
  },
  ADD_CHILDREN_TO_NODE: (state, { nodeId, children }) => {
    const node = findNode(state.treeData, nodeId)
    if (node) {
      Vue.set(node, 'children', children) // 使用Vue.set确保响应性
      console.log(state.treeData)
    }
  }
}

const actions = {
  fetchTreeData({ commit }, nodeId = 'undefined') {
    getFileListById(nodeId).then(response => {
      if (response.code === 200) {
        const childNodes = response.data.map(item => ({
          id: item.id,
          name: item.name,
          isLeaf: item.type === 0, // 如果type为0，则为文件，没有子节点
          children: item.type === 0 ? null : [{ name: '此文件夹为空', leaf: true, parentId: nodeId }]
        }))
        commit('SET_TREE_DATA', childNodes)
      }
    })
  },
  loadChildrenForNode({ commit }, nodeId) {
    getFileListById(nodeId).then(response => {
      if (response.code === 200) {
        if (response.data.length === 0) {
          // 当没有子节点时，可以选择不添加任何节点或添加一个表示空的节点
          commit('ADD_CHILDREN_TO_NODE', { nodeId, children: [{ name: '此文件夹为空', id: `empty-${nodeId}`, isLeaf: true }] })
        } else {
          const childNodes = response.data.map(item => ({
            id: item.id,
            name: item.name,
            isLeaf: item.type === 0, // 如果type为0，则为文件，没有子节点
            children: item.type === 0 ? null : [{ name: '此文件夹为空', leaf: true, parentId: nodeId }]
          }))
          commit('ADD_CHILDREN_TO_NODE', { nodeId, children: childNodes })
        }
      }
    })
  }
}

// 辅助函数用于寻找特定ID的节点
function findNode(data, id) {
  for (const item of data) {
    if (item.id === id) return item
    if (item.children) {
      const result = findNode(item.children, id)
      if (result) return result
    }
  }
  return null
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}