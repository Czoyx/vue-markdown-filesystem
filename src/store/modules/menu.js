
import { getFileListById } from '@/api/file'
import Vue from 'vue'

const state = {
  treeData: [{
    id: 'undefined',
    name: '我的云文档',
    isLeaf: false,
    permissions: {
      read: true,
      write: true,
      manage: true
    },
    type: 1,
    isRoot: true
  }]
}

const mutations = {
  SET_TREE_DATA: (state, data) => {
    Vue.set(state, 'treeData', data)
    // state.treeData = data
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
  async initRootNode({ commit }, data) {
    const nodeData = transformData(data)
    nodeData.isRoot = true
    const lis = [nodeData]
    commit('SET_TREE_DATA', lis)
  },
  async loadChildrenForNode({ commit }, nodeId) {
    const response = await getFileListById(nodeId)
    if (response.code === 200) {
      const children = response.data.length > 0
        ? response.data.map(transformData)
        : [{ name: '此文件夹为空', id: ``, isLeaf: true }]
      commit('ADD_CHILDREN_TO_NODE', { nodeId, children })
    }
  },
  appendAt({ commit }, { nodeId, fileData }) {
    const nodeData = transformData(fileData)
    appendNodeAt(nodeId, nodeData)
  },
  deleteNode({ commit }, nodeId) {
    deleteNodeData(state.treeData, nodeId)
  },
  moveNode({ commit }, { nodeId, parentID }) {
    const nodeData = findNodeData(state.treeData, nodeId)
    deleteNodeData(state.treeData, nodeId)
    appendNodeAt(parentID, nodeData)
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

function appendNodeAt(pNodeId, nodeData) {
  const pNodeData = findNodeData(state.treeData, pNodeId)
  if (pNodeData.children.length > 0) {
    const childNodes = [nodeData]
    for (const child of pNodeData.children) {
      if (child.id !== '') {
        childNodes.push(child)
      }
    }
    childNodes.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    Vue.set(pNodeData, 'children', childNodes)
  }
}

function transformData(item) {
  return {
    id: item.id,
    name: item.name,
    isLeaf: item.type === 0, // 如果type为0，则为文件，没有子节点
    children: item.type === 0 ? null : [{ name: '', id: '', leaf: true }],
    permissions: item.permissions,
    type: item.type,
    creatorId: item.creator || 0,
    path: item.path,
    created_at: item.created_at,
    updated_at: item.updated_at,
    isRoot: false
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
