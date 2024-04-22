
import { getFileListById } from '@/api/file'
import Vue from 'vue' // 确保这里路径正确

const state = {
  treeData: [{ name: '根目录', id: 'undefined', isLeaf: false, type: 1 }]
}

const mutations = {
  SET_TREE_DATA: (state, data) => {
    state.treeData = data
  },
  ADD_CHILDREN_TO_NODE: (state, { nodeId, children }) => {
    const nodeData = findNodeData(state.treeData, nodeId)
    if (nodeData) {
      Vue.set(nodeData, 'children', children) // 使用Vue.set确保响应性
      console.log(state.treeData)
    }
  }
}

const actions = {
  async fetchTreeData({ commit }, nodeId = 'undefined') {
    const response = await getFileListById(nodeId)
    if (response.code === 200) {
      const childNodes = response.data.map(transformData)
      commit('SET_TREE_DATA', childNodes)
    }
  },
  async loadChildrenForNode({ commit }, nodeId) {
    const response = await getFileListById(nodeId)
    if (response.code === 200) {
      const children = response.data.length > 0
        ? response.data.map(transformData)
        : [{ name: '此文件夹为空', id: `empty-${nodeId}`, isLeaf: true }]
      commit('ADD_CHILDREN_TO_NODE', { nodeId, children })
    }
  },
  appendAt({ commit }, { nodeId, newChild }) {
    const nodeData = findNodeData(state.treeData, nodeId)
    const childNodes = [newChild]
    for (const child of nodeData.children) {
      if (child.id !== '') {
        childNodes.push(child)
      }
    }
    Vue.set(nodeData, 'children', childNodes)
  },
  deleteNode({ commit }, nodeId) {
    deleteNodeData(state.treeData, nodeId)
  },
  moveNode({ commit }, { nodeId, parentID }) {
    const nodeData = findNodeData(state.treeData, nodeId)
    deleteNodeData(state.treeData, nodeId)
    const pNodeData = findNodeData(state.treeData, parentID)
    if (pNodeData.children.length !== 0) {
      const childNodes = [nodeData]
      for (const child of pNodeData.children) {
        if (child.id !== '') {
          childNodes.push(child)
        }
      }
      const childNodes1 = childNodes.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      Vue.set(pNodeData, 'children', childNodes1)
    }
  }
}

// 辅助函数用于寻找特定ID的节点
function findNodeData(data, id) {
  for (const item of data) {
    if (item.id === id) return item
    if (item.children) {
      const result = findNodeData(item.children, id)
      if (result) return result
    }
  }
  return null
}

// 辅助函数用于寻找特定ID的节点
function deleteNodeData(data, id) {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (item.id === id) {
      Vue.delete(data, i)
      return true
    }
    if (item.children) {
      const re = deleteNodeData(item.children, id)
      if (re) return re
    }
  }
  return false
}

function transformData(item) {
  return {
    id: item.id,
    name: item.name,
    isLeaf: item.type === 0, // 如果type为0，则为文件，没有子节点
    children: item.type === 0 ? null : [{ name: '此文件夹为空', leaf: true }],
    permissions: item.permissions,
    type: item.type,
    creatorId: item.creator,
    path: item.path,
    created_at: item.created_at,
    updated_at: item.updated_at
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
