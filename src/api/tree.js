import request from '@/utils/request'

export function treelist(query) {
  return request({
    url: '/evergreen/list',
    method: 'get',
    params: query
  })
}

export function treedel(query) {
  return request({
    url: '/evergreen/del',
    method: 'get',
    params: query
  })
}

export function treeedit(data) {
  return request({
    url: '/evergreen/edit',
    method: 'post',
    data
  })
}

export function treeCreate(data) {
  return request({
    url: '/evergreen/add',
    method: 'post',
    data
  })
}

