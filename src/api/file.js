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

