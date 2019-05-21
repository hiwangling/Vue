import request from '@/utils/request'

export function listArea(query) {
  return request({
    url: '/cemetery_classify/a_list',
    method: 'get',
    params: query
  })
}

export function createArea(data) {
  return request({
    url: '/cemetery_classify/a_add',
    method: 'post',
    data
  })
}

export function updateArea(data) {
  return request({
    url: '/cemetery_classify/a_edit',
    method: 'post',
    data
  })
}

export function deleteArea(query) {
  return request({
    url: '/cemetery_classify/a_del',
    method: 'get',
    params: query
  })
}

export function get_gardens(query) {
  return request({
    url: '/cemetery_classify/get_gardens',
    method: 'get',
    params: query
  })
}
