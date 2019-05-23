import request from '@/utils/request'

export function getsevices(query) {
  return request({
    url: '/cemetery/buy_services_list',
    method: 'get',
    params: query
  })
}

export function addservices(data) {
  return request({
    url: '/cemetery/buy_services_add',
    method: 'post',
    data
  })
}

export function editservices(query) {
  return request({
    url: '/cemetery/buy_services_one_list',
    method: 'get',
    params: query
  })
}
