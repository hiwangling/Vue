import request from '@/utils/request'

export function lamplist(query) {
  return request({
    url: '/lighting/list',
    method: 'get',
    params: query
  })
}

export function lampdel(query) {
  return request({
    url: '/lighting/del',
    method: 'get',
    params: query
  })
}

export function lampedit(data) {
  return request({
    url: '/lighting/edit',
    method: 'post',
    data
  })
}

export function lampCreate(data) {
  return request({
    url: '/lighting/add',
    method: 'post',
    data
  })
}

export function lampPay(query) {
  return request({
    url: '/lighting/settlement',
    method: 'get',
    params: query
  })
}

