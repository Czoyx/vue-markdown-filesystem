
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
    const nodeData = findNodeData(state.treeData, nodeId)
    if (nodeData) {
      Vue.set(nodeData, 'children', children) // 使用Vue.set确保响应性
      console.log(state.treeData)
    }
  }
}

const actions = {
  fetchTreeData({ commit }, nodeId = 'undefined') {
    getFileListById(nodeId).then(response => {
      if (response.code === 200) {
        const childNodes = response.data.map(transformData)
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
          const childNodes = response.data.map(transformData)
          commit('ADD_CHILDREN_TO_NODE', { nodeId, children: childNodes })
        }
      }
    })
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
      Vue.set(pNodeData, 'children', childNodes)
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
