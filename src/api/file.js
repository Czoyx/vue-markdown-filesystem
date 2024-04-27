import request from '@/utils/request'

export function getFileList(data) {
  return request({
    url: '/file/list/undefined',
    method: 'get'
  })
}

export function getFileListById(id) {
  return request({
    url: `/file/${id}/list`,
    method: 'get'
  })
}

export function getFileContent(id) {
  return request({
    url: `/file/${id}/content`,
    method: 'get'
  })
}

export function updateFileContent(data) {
  return request({
    url: `/file/${data.file_id}/content`,
    method: 'post',
    data: data
  })
}

export function createFile(data) {
  return request({
    url: `/file/${data.parent_id}/create`,
    method: 'post',
    data: data
  })
}

export function createFolder(data) {
  return request({
    url: `/file/${data.parent_id}/folder`,
    method: 'post',
    data: data
  })
}

export function deleteFile(id) {
  return request({
    url: `/file/${id}/delete`,
    method: 'delete'
  })
}

export function getFileInfo(id) {
  return request({
    url: `/file/${id}/info`,
    method: 'get'
  })
}

export function rename(data) {
  return request({
    url: `/file/${data.file_id}/rename`,
    method: 'post',
    data: data
  })
}

export function operateFile(data) {
  return request({
    url: `/file/${data.parent_id}/operate`,
    method: 'post',
    data: data
  })
}
