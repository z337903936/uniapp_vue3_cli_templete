import { defineStore } from 'pinia'
import { getToken, setToken, removeToken, getUid, setUid, removeUid } from '@/utils/auth'
import { loginByWx, loginByPhone, getIsLogin, getUserInfo, getPersonalInfo, updateUserType, logout } from '@/api/user'
import { BASE_URL } from '@/utils/global'
import useWebSocketStroe from './webSocket'
interface userInfo {
  [key: string]: any
}

interface UserTypes {
  token: String;
  uid: String;
  userInfo: userInfo;
  isLogin: Boolean;
}

const useUserStore = defineStore('user', {
  state: (): UserTypes => {
    return {
      token: getToken(),
      uid: getUid(),
      userInfo: {},
      isLogin: false,
    }
  },
  actions: {
    // app端ios登录
    loginByAppApple(data) {
      return new Promise<void>((resolve, reject) => {
        if (data.token) {
          setToken(data.token)
          this.token = data.token
          this.isLogin = true
          this.userInfo = data.userInfo
          const WebSocketStroe = useWebSocketStroe()
          WebSocketStroe.openSocket()
          resolve()
        } else {
          resolve()
        }
      })
    },
    // app端微信登录
    loginByAppWeChat(data) {
      return new Promise((resolve, reject) => {
        if (data.token) {
          setToken(data.token)
          this.token = data.token
          this.isLogin = true
          this.userInfo = data.userInfo
          const WebSocketStroe = useWebSocketStroe()
          WebSocketStroe.openSocket()
          resolve()
        } else {
          resolve()
        }
      })
    },
    loginByWx(form) {
      return new Promise((resolve, reject) => {
        loginByWx(form).then(res => {
          const data = res.data || {}
          if (data.token) {
            setToken(data.token)
            this.token = data.token
            this.isLogin = true
            this.userInfo = data.userInfo
            const WebSocketStroe = useWebSocketStroe()
            WebSocketStroe.openSocket()
            resolve()
          } else {
            resolve()
          }
        }).catch(error => {
          uni.showToast({
            title: error,
            icon: 'none'
          })
          reject(error)
        })
      })
    },

    loginByPhone(form) {
      return new Promise((resolve, reject) => {
        loginByPhone(form).then(res => {
          const data = res.data || {}
          console.log(data)
          if (data.token) {
            setToken(data.token)
            this.token = data.token
            this.isLogin = true
            this.userInfo = data.userInfo
            const WebSocketStroe = useWebSocketStroe()
            WebSocketStroe.openSocket()
            resolve()
            // dispatch('getUserInfo').then(data => {
            //   console.log(123, data)
            //   resolve(data)
            // }).catch(error => {
            //   reject(error)
            // })
          } else {
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    getIsLogin() {
      return new Promise((resolve, reject) => {
        let token = getToken()
        if (!token) {
          dispatch('reset')
          resolve(false)
        } else {
          uni.request({
            url: `${BASE_URL}/user/getUserInfoByToken`,
            method: 'get',
            data: {},
            header: {
              'token': token,
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            success: (response) => {
              const res = response.data
              if (res.status !== 200) {
                if (res.status === 401) {
                  this.reset()
                  resolve(false)
                } else {
                  uni.showToast({
                    title: res.msg || '请求错误, 请稍后重试!',
                    icon: 'none'
                  })
                  reject(res.msg || '请求错误, 请稍后重试!')
                }
              } else {
                this.isLogin = true
                this.getUserInfo()
                resolve(true)
              }
            },
            fail: (e) => {
              uni.showToast({
                title: '请求超时, 请稍后重试!',
                icon: 'none'
              })
              reject('请求超时, 请稍后重试!')
            }
          })
        }
      })
    },

    getUserInfo(form = { loading: false }) {
      function resetUserInfo(userInfo) {
        if (userInfo.extra) {
          userInfo.extra = JSON.parse(userInfo.extra)
        }
        if (userInfo.resume && userInfo.resume.edu_experience) {
          userInfo.resume.edu_experience = JSON.parse(userInfo.resume.edu_experience)
        } else if (userInfo.resume && !userInfo.resume.edu_experience) {
          userInfo.resume.edu_experience = []
        }
        if (userInfo.resume && userInfo.resume.intern_experience) {
          userInfo.resume.intern_experience = JSON.parse(userInfo.resume.intern_experience)
        } else if (userInfo.resume && !userInfo.resume.intern_experience) {
          userInfo.resume.intern_experience = []
        }
        let defaultUrl = ''
        let resume = userInfo.resume || null
        // gender === 1 男性 2 女性
        // #ifndef APP-NVUE
        if (!resume) {
          defaultUrl = require('@/static/bases/man.png')
        } else if (resume.gender === 2) {
          defaultUrl = require('@/static/bases/woman.png')
        } else {
          defaultUrl = require('@/static/bases/man.png')
        }
        // #endif
        userInfo.avatar = userInfo.person.avatar ? userInfo.person.avatar : defaultUrl
        if (!resume) {
          userInfo.lineName = ''
          userInfo.resume = {}
          userInfo.resume.specialty_name = []
          userInfo.resume.email = userInfo.email
          userInfo.resume.id_card_info = {}
        } else {
          userInfo.resume.email = userInfo.email
          if (userInfo.resume.specialty_name) {
            userInfo.resume.specialty_name = userInfo.resume.specialty_name.split(',')
          } else {
            userInfo.resume.specialty_name = []
          }
          if (resume.id_card_info) {
            userInfo.resume.id_card_info = JSON.parse(resume.id_card_info)
          } else {
            userInfo.resume.id_card_info = {}
          }
          if (userInfo.resume.off_line_names && userInfo.resume.on_line_names) {
            userInfo.lineName = '线上线下均可'
          } else if (userInfo.resume.off_line_names) {
            userInfo.lineName = '线下岗位'
          } else if (userInfo.resume.on_line_names) {
            userInfo.lineName = '线上岗位'
          } else {
            userInfo.lineName = ''
          }
        }
        return userInfo
      }
      return new Promise((resolve, reject) => {
        if (form && form.user_type >= 0) {
          updateUserType({
            userType: form.user_type || 0,
            loading: form.loading || false
          }).then(() => {
            getPersonalInfo({
              loading: form.loading || false
            }).then(info => {
              getUserInfo({
                loading: form.loading || false
              }).then(data => {
                let userInfo = data.data
                userInfo.person = info.data || {
                  avatar: userInfo.user_avatar,
                  collectCount: 0,
                  gender: 1,
                  myPoint: 0,
                  myWallet: 0,
                  nick: userInfo.nick,
                  personalSign: '',
                  resumeProgress: 0,
                  invitedEarnings: 0
                }
                userInfo = resetUserInfo(userInfo)
                this.userInfo = userInfo
                resolve(userInfo)
              }).catch(error => {
                console.log(123, error)
                reject(error)
              })
            }).catch(() => {
              getUserInfo().then(data => {
                let userInfo = data.data
                userInfo.person = {
                  avatar: userInfo.user_avatar,
                  collectCount: 0,
                  gender: 1,
                  myPoint: 0,
                  myWallet: 0,
                  nick: userInfo.nick,
                  personalSign: '',
                  resumeProgress: 0
                }
                userInfo = resetUserInfo(userInfo)
                this.userInfo = userInfo
                resolve(userInfo)
              }).catch(error => {
                console.log(123, error)
                reject(error)
              })
            })
          })
        } else {
          getPersonalInfo({
            loading: form.loading || false
          }).then(info => {
            getUserInfo({
              loading: form.loading || false
            }).then(data => {
              let userInfo = data.data
              userInfo.person = info.data || {
                avatar: userInfo.user_avatar,
                collectCount: 0,
                gender: 1,
                myPoint: 0,
                myWallet: 0,
                nick: userInfo.nick,
                personalSign: '',
                resumeProgress: 0
              }
              userInfo = resetUserInfo(userInfo)
              this.userInfo = userInfo
              resolve(userInfo)
            }).catch(error => {
              console.log(123, error)
              reject(error)
            })
          }).catch(() => {
            getUserInfo().then(data => {
              let userInfo = data.data
              userInfo.person = {
                avatar: userInfo.user_avatar,
                collectCount: 0,
                gender: 1,
                myPoint: 0,
                myWallet: 0,
                nick: userInfo.nick,
                personalSign: '',
                resumeProgress: 0
              }
              userInfo = resetUserInfo(userInfo)
              this.userInfo = userInfo
              resolve(userInfo)
            }).catch(error => {
              console.log(123, error)
              reject(error)
            })
          })
        }

      })
    },


    logout() {
      return new Promise((resolve, reject) => {
        logout({ loading: true }).then(() => {
          this.reset()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    reset() {
      removeToken()
      removeUid()
      this.token = ''
      this.uid = ''
      this.isLogin = false
      this.userInfo = {}
      const WebSocketStroe = useWebSocketStroe()
      WebSocketStroe.reset()
    }
  }
})

export default useUserStore

