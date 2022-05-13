// import { md5 } from 'uview-ui/libs/function/md5'
// import guid from 'uview-ui/libs/function/guid'
import { useUserStore } from '@/store'
import { BASE_URL } from '@/utils/global'
import { getPage, loginPath, jumpPage } from './global'
// var BASE_URL1 = BASE_URL
// BASE_URL = `https://imtss.cn` // 测试服务器地址
// // BASE_URL = `http://qianxun.51xgf.cn:8082/` // 测试服务器地址
// //  BASE_URL = `http://124.71.8.159:8082` // 线上服务器地址
// // BASE_URL = `http://192.168.5.177:8082` // 水生电脑
// // BASE_URL = `http://192.168.5.167:8082`  // 平华电脑
// // BASE_URL = `http://192.168.5.157:8082` // 汪洋电脑
// BASE_URL = `http://192.168.5.171:8080` // 敏星电脑
function request({ url, method, data = {} }) {
  return new Promise((resolve, reject) => {
    const userStore = useUserStore()
    const token = userStore.token
    url = BASE_URL + url
    const loading = data.loading || false
    // const isFile = true || data.isFile || false
    if (loading) {
      uni.showLoading({
        mask: true,
        title: data.loadingMsg || '加载中'
      })
      delete data.loading
    }
    if (data.loading === false) {
      delete data.loading
    }
    let content_type = 'application/x-www-form-urlencoded;charset=utf-8'
    if (data.content_type) {
      content_type = data.content_type
      delete data.content_type
    }
    // if (isFile) {
    //   uni.showLoading({
    //     mask: true,
    //     title: '加载中'
    //   })
    //   delete data.isFile
    // }
    // console.log(token)
    // #ifdef APP-PLUS
    data.operationDevice = uni.getSystemInfoSync().platform
    // #endif
    // #ifdef MP-WEIXIN
    data.operationDevice = '小程序'
    // #endif
    if (!data.operationDevice) {
      data.operationDevice = 'H5'
    }
    for(let i in data) {
      if (data[i] === undefined || data[i] === null) {
        delete data[i]
      }
    }
    uni.request({
      url,
      method,
      data,
      header: {
        'token': token,
        'content-type': content_type
        // 'content-type': 'application/json;charset=utf-8'
        // "Content-Type": isFile ? "application/x-www-form-urlencoded" : "application/json;charset=UTF-8"
				// 'X-Requested-With': 'XMLHttpRequest',
				// 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      success: (response) => {
        if (loading) {
          uni.hideLoading()
        }
        const res = response.data
        if (res.status !== 200) {
          if (res.status === 401) {
            userStore.reset()
            const page = getPage()
            if (page.indexOf(loginPath) === -1) {
              jumpPage(`${loginPath}?redirect=${encodeURIComponent(page)}`, 'redirect')
            }
            reject('暂未登录!')
          } else {
            uni.showToast({
              title: res.msg || '请求错误, 请稍后重试!',
              duration: 1500,
              icon: 'none'
            })
            // setTimeout(() => {
            //   uni.hideToast()
            // }, 5000)
            reject(res.msg || '请求错误, 请稍后重试!')
          }
        } else {
          resolve(res)
        }
        
      },
      fail: (e) => {
        if (loading) {
          uni.hideLoading()
        }
        uni.showToast({
          title: '请求超时, 请稍后重试!',
          duration: 1500,
          icon: 'none'
        })
        // setTimeout(() => {
        //   uni.hideToast()
        // }, 5000)
        reject('请求超时, 请稍后重试!')
      }
    })
  })
}

export default request
