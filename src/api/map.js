const QQMapWX = require('@/utils/qqmap-wx-jssdk.js')
import md5 from 'md5'
import permissionUtil from '@/utils/permission.js';
const qqmapsdk = new QQMapWX({
  // key: 'GZQBZ-KX5C4-UV6UA-DFB66-62XNK-LNFLJ'
  key: '2MMBZ-VE66V-55WPU-UHBIG-JFTRK-7UFJI'
})
// 增加判断权限参数，用户主动触发时才提示权限

export function getLocation(active = false, loading = false) {
  return new Promise( async (resolve, reject) => {
		// #ifdef APP-PLUS
			if (uni.getSystemInfoSync().platform === 'android') {
				// let permissionLocation1 = "android.permission.ACCESS_FINE_LOCATION"; // 定位权限 ACCESS_COARSE_LOCATION
				let permissionLocation = "android.permission.ACCESS_COARSE_LOCATION"
				
				// let locationResult1 = await permissionUtil.requestAndroidPermission(permissionLocation1)
				let androidLocationResult = await permissionUtil.requestAndroidPermission(permissionLocation)
        console.log('当前权限',androidLocationResult, active)
				if (androidLocationResult === 0 && active) {
					uni.showToast({
						title: '需要开启定位权限后使用定位功能，请同意',
						icon: 'none',
						duration: 3000
					})
					return;
				} else if (androidLocationResult === -1 && active) {
					uni.showToast({
						title: '需要开启定位权限后使用定位功能，请在系统中开启',
						icon: 'none',
						duration: 3000
					})
					return;
				}
			} else if (uni.getSystemInfoSync().platform === 'ios') {
				let iosLocationResult = permissionUtil.judgeIosPermission('location') || false;
				if (!iosLocationResult && active) {
					uni.showToast({
						title: '需要开启定位权限后使用定位功能，请同意或开启',
						icon: 'none',
						duration: 3000
					})
					// return;
				}
			}
		// #endif
    console.log('loading', loading)
    if (loading) {
      uni.showLoading({
        title: '加载中',
        mask: true
      })
    }
    uni.getLocation({
      type: 'gcj02',
      // altitude: true,
      success: res => {
        uni.hideLoading()
        const locationData = {}
        locationData.latitude = res.latitude
        locationData.longitude = res.longitude
        resolve(locationData)
      },
      fail: (res) => {
        console.log('错误', res)
        // #ifdef MP-WEIXIN
        uni.showModal({
          title: '温馨提示',
          content: '暂未获得您的位置信息授权,无法继续为您提供服务,请先允许我们获取您的位置信息!',
          showCancel: false,
          confirmText: '前往设置',
          complete: () => {
            uni.openSetting()
          }
        })
        // #endif
        reject(res)
      }
    })
  })
}

// 根据坐标获取当前地址，周边地址
export function getAddressByLocation(location, get_poi = 0) {
  return new Promise((resolve, reject) => {
    qqmapsdk.reverseGeocoder({
      location,
      get_poi,
      success: ({ result }) => {
        // console.log(result, result.pois)
        let address = result.address_component.province + result.address_component.city + result.address_component.district + result.address_component.street
        const data = {
          id: result.ad_info.adcode.substr(0, 4) + '00', // 用于获取到省级code
          area: result.ad_info.adcode, // 用于精确具体code
          name: result.ad_info.city,
          shortname: result.ad_info.city,
          latitude: result.location.lat,
          longitude: result.location.lng,
          pois: get_poi === 1 ? result.pois : [],
          address
        }
        resolve(data)
      },
      fail: () => {
        reject()
      }
    })
  })
}

export function getDistance(data) {
  return new Promise((resolve, reject) => {
    qqmapsdk.calculateDistance({
      from: data.from,
      to: data.to.map(item => {
        return {
          latitude: item.latitude,
          longitude: item.longitude
        }
      }),
      success: ({ result }) => {
        data.to.forEach(item => {
          result.elements.some(ele => {
            if (ele.to.lat === item.latitude && ele.to.lng === item.longitude) {
              item.distance = ele.distance
              return true
            }
          })
        })
        data.to.sort((a, b) => a.distance - b.distance)
        resolve(data.to)
      },
      fail: () => {
        reject()
      }
    })
  })
}

/**
 * @param {Object} options 
 * keyword: 关键字 必填
 * location: lat,lng 字符串 非必填
 * page_size: 条数 默认10 最大20
 * page_index: 页数
 * get_subpois: 是否返回子地点，如大厦停车场、出入口等取值：0 [默认]不返回 1 返回
 */
export function getSuggestion(options) {
  return new Promise((resolve, reject) => {
    qqmapsdk.getSuggestion({
      ...options,
      success: (data) => {
        resolve(data)
      },
      fail: (e) => {
        console.log('错误', e)
        reject(e)
      }
    })
  })
}

export function getTXMapAddressSn(data) {
  return new Promise(function(resolve, reject) {
    const uri = '/ws/geocoder/v1/'
    const address = encodeURIComponent(data)
    const output = 'json'
    const key = 'ZEGBZ-VMVRJ-23SFU-KJ4BC-JR76V-DTBRH'
    const sk = 'yGDPUXEbAlHnHXLOKcrHGDGMuz2ZdA9'
    const sn = md5(encodeURIComponent(`${uri}?address=${address}&output=${output}&key=${key}${sk}`))
    resolve(sn)
  })
}