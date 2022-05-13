import permissionUtil from './permission.js';
// import store from '@/store/index.js'

export const tabList = [{
  name: '首页',
  pagePath: '/pages/home/home/index'
},
{
  name: '招聘会',
  pagePath: '/pages/jobFair/home/index'
},
{
  name: '消息',
  pagePath: '/pages/message/home/index'
},
{
  name: '我的',
  pagePath: '/pages/user/home/index'
}
]
export const tabPath = tabList.map(item => item.pagePath)
export const homePath = '/pages/home/home/index'
export const loginPath = '/pages/user/loginByPhone/index'

// 路由请求地址
export const BASE_URL = 'https://imtss.cn/applet' // 测试服务器
// export const BASE_URL = 'https://51qqx.com/applet' // 线上服务器
// export const BASE_URL = 'http://81.69.237.90:8082' // 测试服务器
// export const BASE_URL = `http://192.168.5.150:8082/applet` // 敏星电脑
// export const BASE_URL = `http://192.168.5.175:8081/applet` // 汪洋电脑
// export const BASE_URL = 'http://192.168.5.100:8081/applet' // 平华电脑
// export const BASE_URL = 'http://192.168.5.160:8081/applet' // 志浩电脑
// export const BASE_URL = 'http://139.159.159.34:8082' // 鲲鹏服务器

// 图片上传地址
export const uploadImageUrl = `${BASE_URL}/file/upload`
// export const uploadImageUrl = 'http://192.168.5.154:8082/file/upload'

// 文件上传地址
export const uploadFileUrl = `${BASE_URL}/file/upload`
// 文件上传本地地址
export const uploadFileLocalUrl = `${BASE_URL}/file/localSave`

// 默认头像
// #ifndef APP-NVUE
// export const defaultManAvatar = require('@/static/bases/man.png')
// export const defaultWomanAvatar = require('@/static/bases/woman.png')
// #endif

export function beforeSwitch (index) {
  // // #ifdef APP-PLUS
  // if (index === 1) {
  // 	uni.showToast({
  // 		title: '招聘会暂未开放,敬请期待',
  // 		icon: 'none'
  // 	})
  // 	return false
  // }
  // // #endif
  // if (index === 1) {
  // 	uni.showToast({
  // 		title: '招聘会暂未开放,敬请期待',
  // 		icon: 'none'
  // 	})
  // 	return false
  // }
  return true
}

export function getPage () {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  let path = '/' + current.route
  const param = current.options || (current.$route ? current.$route.query : [])
  for (const key in param) {
    if (path.indexOf('?') === -1) {
      path += `?${key}=${param[key]}`
    } else {
      path += `&${key}=${param[key]}`
    }
  }
  return path
}

/**
 * 自定义跳转方法
 * e 跳转路径
 * type 跳转类型
 * needLogin 是否需要登录后才能跳转
 * redirect 登录后才能跳转时 登录完成重定向页面路径
 */
export function jumpPage (e, type = 'default', needLogin, redirect = '/pages/home/home/index') {
  if (needLogin) {
    const phone = store.getters.userInfo.telephone || ''
    if (!phone) {
      redirect = encodeURIComponent(redirect)
      jumpPage(`/pages/user/loginByPhone/index?redirect=${redirect}`)
      return
    }
  }
  if (typeof e === 'number') {
    uni.navigateBack({
      delta: e
    })
  } else {
    if (type === 'reLaunch') {
      uni.reLaunch({
        url: e
      })
    } else if (tabPath.some(item => e.indexOf(item) !== -1)) {
      uni.switchTab({
        url: e
      })
    } else {
      if (type === 'redirect') {
        if (tabPath.some(item => getPage().indexOf(item) !== -1)) {
          uni.navigateTo({
            url: e
          })
        } else {
          uni.redirectTo({
            url: e
          })
        }
      } else {
        uni.navigateTo({
          url: e
        })
      }
    }
  }
}

/**
 * @description: 聊天跳转
 * @param {Number} acceptId 聊天对象id
 * @param {Nuber} isDetail 是否是岗位详情跳转  0-> 非岗位详情跳转 1-> 岗位详情跳转 
 * @param {String} jobDetailType 岗位类型  ordinary -> 普通岗位, crowdsourcing -> 众包岗位, jobFair -> 招聘会岗位
 * @param {Number} categoryId 岗位分类id
 * @param {Number} jobId 普通岗位id
 * @param {Number} taskId 众包岗位id
 * @param {Number} jobFairId 招聘会岗位id
 * @param {Number} companyId 招聘会企业id
 **/
export function jumpChat(acceptId = 0, isDetail = 0, jobDetailType = 'ordinary', categoryId = 0, jobId = 0, taskId = 0, jobFairId = 0, companyId) {
  // console.log('进入聊天', acceptId, store.getters.userInfo.id)
  if (acceptId === store.getters.userInfo.id) {
    uni.showToast({
      title: '无法与自己聊天',
      icon: 'none'
    })
    return
  }
  if (!acceptId) {
    uni.showToast({
      title: '缺少必要参数,无法聊天',
      icon: 'none'
    })
    return
  }
	let valueStr = `/pagesC/pages/message/detail/index?acceptId=${acceptId}&isDetail=${isDetail}&jobDetailType=${jobDetailType}`;
	if (categoryId > 0) valueStr += `&categoryId=${categoryId}`;
	if (jobId > 0) valueStr += `&jobId=${jobId}`;
	if (taskId > 0) valueStr += `&taskId=${taskId}`;
	if (jobFairId > 0) valueStr += `&jobFairId=${jobFairId}`;
	 if (companyId > 0) valueStr += `&companyId=${companyId}`;
	jumpPage(valueStr);
}

export function openMap (longitude, latitude, name, address) {
  uni.openLocation({
    longitude,
    latitude,
    name,
    address
  })
}

export function callPhone (e) {
  if (!e) {
    uni.showToast({
      title: '无电话无法拨打',
      icon: 'none'
    })
    return
  }
  // #ifdef APP-PLUS
  if (uni.getSystemInfoSync().platform === 'android') {
    let permissionId = "android.permission.CALL_PHONE"; // 拨打电话权限
    permissionUtil.requestAndroidPermission(permissionId).then((result) => {
      if (result === 1) {
        uni.makePhoneCall({
          phoneNumber: e
        })
      } else if (result === 0) {
        uni.showToast({
          title: '需要开启电话权限后拨打，请同意',
          icon: 'none',
          duration: 3000
        })
      } else {
        uni.showToast({
          title: '需要开启电话权限后拨打，请在系统设置中开启',
          icon: 'none',
          duration: 3000
        })
      }
    }).catch((e) => {
      console.log(e)
    })
  } else {
    // ios无需判断
    uni.makePhoneCall({
      phoneNumber: e
    })
  }
  // #endif
  // #ifndef APP-PLUS
  uni.makePhoneCall({
    phoneNumber: e
  })
  // #endif
}

// 复制
export function copyText(e, tip = '复制成功', errorTip = '无内容可复制') {
  if (!e || e === 'null') {
    uni.showToast({
      title: errorTip,
      icon: 'none'
    })
    return
  }
  e = e + ''
  // #ifndef H5
  uni.setClipboardData({
    data: e,
    success: () => {
      uni.showToast({
        title: tip,
        icon: 'none',
        duration: 2500
      })
    }
  })
  // #endif
  // #ifdef H5
  let textarea = document.createElement("textarea")
  textarea.value = e
  textarea.readOnly = "readOnly"
  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, e.length) 
  uni.showToast({
  	title: tip,
    icon: 'none'
  })
  document.execCommand("copy") 
  textarea.remove()
  // #endif
}

export function copy (e) {
  return JSON.parse(JSON.stringify(e))
}

// 手机号验证
export function checkTelephone (e) {
  return /^1[3456789]\d{9}$/.test(e)
}

// 根据临时路径提交文件
export function uploadToFileName(fileName, formData = { fileType: 10 }, url = '', name = 'files') {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    if (!url) {
      url = uploadFileUrl
    }
    uni.uploadFile({
      url: url,
      name: name,
      filePath: fileName,
      header: { 'token': token },
      formData,
      success: res => {
        const data = JSON.parse(res.data)
        if (data.status === 200) {
          resolve(data)
        } else {
          uni.showToast({
            title: data.msg || '上传失败,请稍后重试!',
            icon: 'none'
          })
          reject()
        }
      },
      fail: (e) => {
        console.log(e)
        uni.showToast({
          title: '上传出错',
          icon: 'none',
          mask: true
        })
      }
    })
  })
}

// 下载文件并返回文件流
export function downloadFileByUrl(url, fileType) {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    uni.showToast({
      title: 'H5暂不支持该功能,可前往小程序或APP使用',
      icon: 'none'
    })
    return
    // #endif
    uni.showLoading({
      mask: true,
      title: '加载中'
    })
    // this.fileObj.url = 'https://weikeimage.obs.cn-south-1.myhuaweicloud.com/20210821bbe.pdf'
    // this.fileObj.fileType = 'pdf'
    // #ifdef MP-WEIXIN
    const now = Math.round(new Date().getTime() / 1000)
    let filePath = `${wx.env.USER_DATA_PATH}/${now + '.' + fileType}`
    // #endif
    uni.downloadFile({
      url: url,
      timeout: 120000,
      // #ifdef MP-WEIXIN
      filePath: filePath,
      // #endif
      success: (e) => {
        const { filePath, tempFilePath } = e
        console.log(e)
        let fileName = ''
        // #ifdef MP-WEIXIN
        fileName = filePath
        // #endif
        // #ifdef APP-PLUS
        fileName = tempFilePath
        // #endif
        resolve(fileName)
      },
      fail: (e) => {
        console.log(e)
        uni.showToast({
          title: '下载失败',
          icon: 'none',
          mask: true
        })
      }
    })
  })
}

// 下载文件并预览
export function downloadFile(url, fileName, suffix) {
  console.log('预览基础属性', fileName, url)
  // #ifdef H5
  uni.showToast({
    title: 'H5暂不支持该功能,可前往小程序或APP使用',
    icon: 'none'
  })
  return
  // #endif
  uni.showLoading({
    title: '加载中',
    mask: true
  })
	let imgList = [
		'jpg',
		'jpeg',
		'png',
		'giff'
	]
	let lastName = '';
	let index = -1
	if (!suffix) {
		index = fileName.lastIndexOf('.');
		index !== -1 ? lastName = fileName.substr(index + 1, fileName.length - 1) : lastName = '';
	} else {
		lastName = suffix;
	}

	if (imgList.indexOf(lastName) !== -1) {
		uni.previewImage({
			urls: url instanceof Array ? url : [url],
			// #ifndef MP-WEIXIN
			indicator: 'number'
			// #endif
		})
		uni.hideLoading()
		return;
	}
	
  let filePath = ''
  // #ifdef MP-WEIXIN
  if (!suffix) {
    filePath = `${wx.env.USER_DATA_PATH}/` + fileName
  } else {
    filePath = `${wx.env.USER_DATA_PATH}/` + fileName + '.' + suffix
  }
  // #endif
  // console.log(wx.env.USER_DATA_PATH, url)
  uni.downloadFile({
    url,
    // #ifdef MP-WEIXIN
    filePath: filePath,
    // #endif
    success:(res) => {
      const { filePath, tempFilePath } = res
      console.log(res)
      uni.openDocument({
        // #ifdef MP-WEIXIN
        filePath: filePath,
        // #endif
        // #ifdef APP-PLUS
        filePath: tempFilePath,
        // #endif
        showMenu: true,
        // fileType: suffix,
        success: (e) => {
          uni.hideLoading()
        },
        fail: () => {
          uni.showToast({
            title: `文档打开失败`,
            icon: 'none'
          })
        }
      })
      // uni.saveFile({
      //   tempFilePath,
      //   success: (file) => {
      //     uni.showToast({
      //       title: `下载成功,下载路径为${file.savedFilePath}`,
      //       icon: 'none'
      //     })
      //   },
      //   fail: () => {
      //     uni.showToast({
      //       title: `下载失败`,
      //       icon: 'none'
      //     })
      //   }
      // })
    },
    fail: (e) => {
      console.log(e)
      uni.showToast({
        title: `生成本地链接失败`,
        icon: 'none'
      })
    }
  })
}

// 网络下载图片
export async function downloadImage (url) {
  // #ifdef APP-PLUS
  // app中需要判断相册权限
  if (uni.getSystemInfoSync().platform === 'android') {
    let permissionIdPhoto = "android.permission.WRITE_EXTERNAL_STORAGE"; // 相册读写权限
    let androidPhotoResult = await permissionUtil.requestAndroidPermission(permissionIdPhoto)
    if (androidPhotoResult === 0) {
      uni.showToast({
        title: '需要开启相册权限后上传，请同意',
        icon: 'none',
        duration: 3000
      });
      return;
    } else if (androidPhotoResult === -1) {
      uni.showToast({
        title: '需要开启相册权限后上传，请在系统设置中开启',
        icon: 'none',
        duration: 3000
      });
      return;
    }
  } else if (uni.getSystemInfoSync().platform === 'ios') {
    // ios相册读写权限
    let iosPhotoResult = iosPhotoResult = permissionUtil.judgeIosPermission('photoLibrary'); // 判断相册权限
    if (!iosPhotoResult) {
      uni.showToast({
        title: '需要开启相册权限后上传，请同意或开启',
        icon: 'none',
        duration: 3000
      });
    }
  }
  // #endif
  uni.downloadFile({
    url: url,
    success: res => {
      uni.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: (res) => {
          uni.showToast({
            title: '保存成功~',
            icon: 'none'
          })
        },
        fail: () => {
          uni.showModal({
            title: '温馨提示',
            content: '暂未获得您的相册权限,无法为您保存图片,请先允许我们获取您的授权!',
            cancelText: '拒绝授权',
            confirmText: '前往设置',
            success: res => {
              if (res.confirm) {
                uni.openSetting()
              }
            }
          })
        }
      })
    },
    fail: err => {
      uni.showToast({
        title: err.errMsg || '下载宣传码失败,请检查网络后重试!',
        icon: 'none'
      })
    }
  })
}

/**
 * @param {Object} list 数组
 * @param {String} param 参数名称
 * @param {String} split 分隔符
 * 传入数组从param中取值追加分割符split返回拼接字符串
 */
export function splitList (list, param = '', split = ';') {
  let str = ''
  if (param) {
    list.forEach(item => {
      str += item[param] + split
    })
  } else {
    list.forEach(item => {
      str += item + split
    })
  }
  return str.substr(0, str.length - 1)
}

//px转rpx  
export function pxToRpx (px) {
  var rpx = px / (uni.upx2px(px) / px);
  return rpx
}
//rpx转px  
export function rpxToPx (rpx) {
  var px = uni.upx2px(rpx);
  return px
}

//跳转腾讯会议方法
export function jumpTXMini(time){
  // #ifdef MP-WEIXIN
  uni.navigateToMiniProgram({
    appId: 'wx33fd6cdc62520063'
  })
  return
  // #endif
  // #ifdef APP-PLUS
  plus.share.getServices(function(res){
      var sweixin = null;
      for(var i=0;i<res.length;i++){
          var t = res[i]
          if(t.id == 'weixin'){  
              sweixin = t
          }
      }
      if(sweixin){  
          sweixin.launchMiniProgram({
              id: 'gh_ebae2dbaabf7',  
              type: 0
          })
      }
  }, function(res){  
      console.log(JSON.stringify(res));
  })
  return
  // #endif
  uni.showToast({
    title: '暂时只支持APP或者小程序跳转腾讯会议~',
    icon: 'none'
  })
}

/**
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
export function accDiv (arg1, arg2) {
  var t1 = 0;
  var t2 = 0;
  var r1;
  var r2
  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) { }
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) { }
  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
export function accMul (arg1, arg2) {
  var m = 0;
  var s1 = arg1.toString();
  var s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) { }
  try {
    m += s2.split('.')[1].length
  } catch (e) { }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export function accSub (arg1, arg2) {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2)) // last modify by deeka //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export function accAdd (arg1, arg2) {
  var r1, r2, m, c
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  c = Math.abs(r1 - r2)
  m = Math.pow(10, Math.max(r1, r2))
  if (c > 0) {
    var cm = Math.pow(10, c)
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', '')) * cm
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm
      arg2 = Number(arg2.toString().replace('.', ''))
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''))
    arg2 = Number(arg2.toString().replace('.', ''))
  }
  return (arg1 + arg2) / m
}

/**
 * @description: 格式化日期时间
 * @param {String} formatType 格式化类型 0 -> yyyy-mm-dd 包含年月日; 1 -> yyyy-mm-dd hh:mm:ss 包含年月日时分秒; 2 -> hh:mm:ss 包含时分秒
 * @param {String | Object} timeStr 是否传入时间，若传入字符串则已字符串创建时间;若传如时间对象则不重新创建时间 
 * @return {String} 格式化后的时间
 **/
export function formatDate (formatType = 1, timeStr = '') {
  let newTime = null;
  timeStr ?
    typeof timeStr === 'string' ? newTime = new Date(timeStr) : newTime = timeStr :
    newTime = new Date();
  let year = newTime.getFullYear();
  let month = newTime.getMonth() + 1;
  let day = newTime.getDate();
  let hours = newTime.getHours();
  let minutes = newTime.getMinutes();
  let seconds = newTime.getSeconds();
  let targetStr = '';
  // formatType === 1 ? targetStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` : targetStr = `${year}-${month}-${day}`;
  formatType !== 0 ?
    formatType === 2 ? targetStr = `${hours}:${minutes}:${seconds}` : targetStr =
      `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` :
    targetStr = `${year}-${month}-${day}`
  return targetStr;
}
/**
 * @description: 数组去重
 * @param {Array} uniqueArr 去重数组
 * @param {String} uniqueField 去重依靠的字段
 * @return {Array} 去重后的数组
 */
export function arrayUnique (uniqueArr = [], uniqueField = 'id') {
  let hasObj = {}; // 临时存放数组去重字段
  uniqueArr = uniqueArr.reduce((pre, curr) => {
    hasObj[curr[uniqueField]] ? '' : hasObj[curr[uniqueField]] = true && pre.push(curr)
    return pre
  }, [])
  return uniqueArr
}

/**
 * @description: 判断用户是否安装了某一个app
 * @param {String} targetName 商店名称 
 
 */
export function checkHasApp (targetName = '') {
  /*
  微信：com.tencent.mm --- weixin://
  QQ： com.tencent.mobileqq ----  mqq://
  微博： com.sina.weibo ---  sinaweibo://
  淘宝： com.taobao.taobao ---  taobao://
  支付宝： com.eg.android.AlipayGphone ---  alipay://
  京东： com.jingdong.app.mall ---  openApp.jdMobile://
  优酷： com.youku.phone ---  youku://
  高德地图： com.autonavi.minimap --- iosamap://
  百度地图： com.baidu.BaiduMap ---  baidumap://
  */
  // #ifndef APP-PLUS
  return false;
  // #endif
  // #ifdef APP-PLUS
  let targetFlag = false;
  let targetObj = null;
  let appList = [
    {
      name: 'qianqianxunCompany',
      check: {
        pname: 'com.qianqianxun.company',
        action: 'qianqianxuncompany://'
      }
    }, {
      name: 'weChat',
      check: {
        pname: 'com.tencent.mm',
        action: 'weixin://'
      }
    },
    {
      name: 'QQ',
      check: {
        pname: 'com.tencent.mobileqq',
        action: 'mqq://'
      }
    },
    {
      name: 'taoBao',
      check: {
        pname: 'com.taobao.taobao',
        action: 'taobao://'
      }
    },
    {
      name: 'zfb',
      check: {
        pname: 'com.eg.android.AlipayGphone',
        action: 'alipay://'
      }
    },
    {
      name: 'miniMap',
      check: {
        pname: 'com.autonavi.minimap',
        action: 'iosamap://'
      }
    },
  ]
  targetObj = appList.find((item) => {
    return item.name === targetName;
  })
  if (targetObj === null) {
    return targetFlag;
  }
  return targetFlag = plus.runtime.isApplicationExist(
    targetObj['check']);
  // #endif
}

//获取现在时间
export function getNowFormatDate () {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
};

//获取两个时间相差小时
function getHour (s1, s2) {
  s1 = new Date(s1.replace(/-/g, '/'));
  s2 = new Date(s2.replace(/-/g, '/'));
  var ms = Math.abs(s1.getTime() - s2.getTime());
  return ms / 1000 / 60 / 60;
}

//获取APP设备oaid和imei
export function getOaidAndImei () {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    plus.device.getOAID({
      success: ({ oaid }) => {
        plus.device.getInfo({
          success: (e)=> {
            console.log('设备码', e)
            console.log('oaid', oaid)
            const submitObj = {}
            if (uni.getSystemInfoSync().platform === 'android') {
              // 安卓版本号 10以上传 10 其他传9
              let system = uni.getSystemInfoSync().system // 安卓版本号
              system = Number(system.substr(8, system.length))
              if (system >= 10) {
                submitObj.sysver = 10
                submitObj.oaid = oaid // oaid
              } else {
                submitObj.sysver = 9
                submitObj.device = e.imei || e.uuid // imei
                if (submitObj.device.indexOf(',') >= 0) {
                  submitObj.device = submitObj.device.split(',')[0]
                }
              }
            } else {
              submitObj.device = e.idfa || e.uuid // IOS获取idfa
            }
            console.log(submitObj, '传参')
            resolve(submitObj)
          },
          fail: (e) => {
            uni.showToast({
              title: 'getInfo failed: '+JSON.stringify(e),
              icon: 'none'
            })
            reject()
          }
        });
      },
      fail: (e) => {
        uni.showToast({
          title: 'getOAID failed: '+JSON.stringify(e),
          icon: 'none'
        })
        reject()
      }
    });
    // #endif
    // #ifdef MP-WEIXIN
    resolve({
      oaid: '65ee1480586240c3',
      sysver: 10
    })
    // #endif
  })
};

/**
 * 数字转中文数字方法
 */
export function toChinesNum(num) {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let unit = ["", "十", "百", "千", "万"];
  num = parseInt(num);
  let getWan = (temp) => {
    let strArr = temp.toString().split("").reverse();
    let newNum = "";
    for (var i = 0; i < strArr.length; i++) {
      newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[
        strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
    }
    return newNum;
  }
  let overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) {
    noWan = "0" + noWan;
  }
  return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}

/**
 * 适配苹果的时间转换 默认秒
 */
export function getTime(time) {
  if (!time) {
    console.log('出现传入为空的时间戳了！排查！')
    return 0
  }
  // 苹果适配
  time = time.toString().replace(/-/g, '/')
  const length = time.split('/').length || 0
  if (length === 2) {
    time = time + '/01'
  }
  return Math.floor(new Date(time).getTime() / 1000)
}

/**
 * 限制只能输入2位小数
 */
export function handleInputLimitNumber(e) {
  let value = e;
  value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
  value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
  // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入2个小数
  // value = value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3');//只能输入3个小数
  // value = value.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3'); //只能输入4个小数
  // value = value.replace(/^(\-)*(\d+)\.(\d\d\d\d\d).*$/, '$1$2.$3'); //只能输入5个小数
  if (value.indexOf(".") < 0 && value != "") { 
  //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
    value = parseFloat(value);
  }
  return value
}