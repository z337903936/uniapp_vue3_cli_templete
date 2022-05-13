import request from '@/utils/request'

// 模板A - GET
export function template_A(data) {
  return request({
    url: '/path/path',
    method: 'get',
    data
  })
}

// 模板B - POST
export function template_B(data) {
  return request({
    url: '/path/path',
    method: 'post',
    data
  })
}

// 模板B - POST
export function getIndexData(data) {
  return new Promise(resolve => {
    resolve()
  })
}