import request from '@/utils/request'

/*

// 获取用户微信信息
export const getWechat = params => post('user/getWechat', params);
// 保存用户微信信息
export const saveWechat = params => post('user/saveWechat', params);

// 获取用户apple信息
export const getApple = params => post('user/hasAppleUser', params);
// 保存用户apple信息
export const saveApple = params => post('user/saveAppleUser', params);


*/

// 保存用户apple信息
export function saveApple(data) {
	return request({
		url: '/user/saveAppleUser',
		method: 'post',
		data
	})
}

// 保存用户微信信息
export function saveWechat(data) {
	return request({
		url: '/user/saveWechat',
		method: 'post',
		data
	})
}


// 获取用户apple信息
export function getApple(data) {
	return request({
		url: '/user/hasAppleUser',
		method: 'post',
		data
	})
}

// 获取微信信息
export function getWechat(data) {
	return request({
		url: '/user/getWechat',
		method: 'post',
		data
	})
}

export function getVcode(data) {
  return request({
    url: '/sms/getCode',
    method: 'get',
    data
  })
}

export function logout(data) {
  return request({
    url: '/user/logout',
    method: 'get',
    data
  })
}

// export function login(data) {
//   return request({
//     url: '/user/login',
//     method: 'get',
//     data
//   })
// }

export function loginByPhone(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function loginByWx(data) {
  return request({
    url: '/wechat/wechatAppletLogin',
    method: 'post',
    data
  })
}

export function getIsLogin(data) {
  return new Promise(resolve => {
    return request({
      url: '/user/is_login/',
      method: 'get',
      data
    }).then(data => {
      resolve(data.login)
    }).catch(() => {
      resolve(false)
    })
  })
}

export function getUserInfo(data) {
  return new Promise((resolve, reject) => {
    request({
      url: '/user/getUserInfoByToken',
      method: 'get',
      data
    }).then(data => {
      resolve(data)
    }).catch((err) => {
      reject(err)
    })
  })
}

// 获取用户首页基本信息
export function getPersonalInfo(data) {
  return new Promise((resolve, reject) => {
    request({
      url: '/resume/getPersonalInfo',
      method: 'get',
      data
    }).then(data => {
      resolve(data)
    }).catch((err) => {
      reject(err)
    })
  })
}

// 修改用户类型
export function updateUserType(data) {
  return new Promise((resolve, reject) => {
    request({
      url: '/user/updateUserType',
      method: 'post',
      data
    }).then(data => {
      resolve(data)
    }).catch((err) => {
      reject(err)
    })
  })
}

// 设置头像
export function setAvatar(data) {
  return new Promise((resolve, reject) => {
    request({
      url: '/resume/setAvatar',
      method: 'post',
      data
    }).then(data => {
      resolve(data)
    }).catch((err) => {
      reject(err)
    })
  })
}

// 修改手机号
export function changePhone(data) {
  return new Promise((resolve, reject) => {
    request({
      url: '/user/changeTel',
      method: 'post',
      data
    }).then(data => {
      resolve(data)
    }).catch((err) => {
      reject(err)
    })
  })
}

// 修改密码
export function changePassword(data) {
  return new Promise((resolve, reject) => {
    request({
      url: '/user/resetPwd',
      method: 'post',
      data
    }).then(data => {
      resolve(data)
    }).catch((err) => {
      reject(err)
    })
  })
}
