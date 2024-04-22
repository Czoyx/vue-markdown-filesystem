import request from '@/utils/request'

export function getFileList(data) {
  return request({
    url: '/file/list/undefined',
    method: 'get'
  })
}

export function getFileListById(id) {
  return request({
    url: `/file/list/${id}`,
    method: 'get'
  })
}

export function getFileContent(id) {
  return request({
    url: `/file/content/${id}`,
    method: 'get'
  })
}

export function updateFileContent(data) {
  return request({
    url: `/file/content`,
    method: 'post',
    data: data
  })
}

export function createFile(data) {
  return request({
    url: `/file/create`,
    method: 'post',
    data: data
  })
}

export function createFolder(data) {
  return request({
    url: `/file/folder`,
    method: 'post',
    data: data
  })
}

export function deleteFile(id) {
  return request({
    url: `/file/delete/${id}`,
    method: 'delete'
  })
}

export function getFileInfo(id) {
  return request({
    url: `/file/info/${id}`,
    method: 'get'
  })
}

export function rename(data) {
  return request({
    url: `/file/rename`,
    method: 'post',
    data: data
  })
}

export function operateFile(data) {
  return request({
    url: `/file/operate`,
    method: 'post',
    data: data
  })
}
