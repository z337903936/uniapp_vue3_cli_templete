const TokenKey = 'token'
const UidKey = 'uid'

export function getToken() {
  return uni.getStorageSync(TokenKey) || ''
}

export function setToken(token) {
  uni.setStorage({
    key: TokenKey,
    data: token
  })
}

export function removeToken() {
  uni.removeStorage({
    key: TokenKey
  })
}

export function getUid() {
  return uni.getStorageSync(UidKey) || ''
}

export function setUid(uid) {
  uni.setStorage({
    key: UidKey,
    data: uid
  })
}

export function removeUid() {
  uni.removeStorage({
    key: UidKey
  })
}
