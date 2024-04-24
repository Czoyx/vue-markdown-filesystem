import request from '@/utils/request'

export function listPermission(id) {
  return request({
    url: `/permission/list/${id}`,
    method: 'get'
  })
}

export function updatePermission(data) {
  return request({
    url: `/permission/update`,
    method: 'post',
    data: data
  })
}
