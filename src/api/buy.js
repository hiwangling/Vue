import request from '@/utils/request'

export function listbuy(query) {
  return request({
    url: '/cemetery/get_buy_cemetery',
    method: 'get',
    params: query
  })
}

export function addbuy(data) {
  return request({
    url: '/cemetery/buy_cemetery',
    method: 'post',
    data
  })
}

export function updatelink(data) {
  return request({
    url: '/linkman/edit',
    method: 'post',
    data
  })
}

export function deletelink(query) {
  return request({
    url: '/linkman/del',
    method: 'get',
    params: query
  })
}
