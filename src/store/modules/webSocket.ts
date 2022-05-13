import {
	BASE_URL,
	formatDate
} from '@/utils/global'
import { defineStore } from 'pinia'
import { useAppStore } from '../index'
// import {
// 	getUnreadMessage,
// 	chatMsgSave
// } from '@/api/message.js'
interface webSocketType {
  // Socket连接状态
  IsOpen: boolean;
  // SocketTask
  SocketTask: boolean; // socket链接对象
  // 是否上线
  IsOnline: boolean;
  chatTotalCount: number; // 沟通消息未读数
  systemTotalCount: number; // 系统通知消息未读数
  interViewTotalCount: number; // 面试邀约未读数
}

const useWebSocketStore = defineStore('webSocket', {
  state: (): webSocketType => {
    return {
      // Socket连接状态
      IsOpen: false,
      // SocketTask
      SocketTask: false, // socket链接对象
      // 是否上线
      IsOnline: false,
      chatTotalCount: 0, // 沟通消息未读数
      systemTotalCount: 0, // 系统通知消息未读数
      interViewTotalCount: 0, // 面试邀约未读数
    }
  },
  actions: {
    openSocket() {
      
    },
    
    socketSend({
    	content,
    	acceptUserId,
    	chatType
    }) {
    return new Promise((resolve,reject)=>{
    })
    },
    // 获取未读消息
    unreadMessage() {
    	
    },
    // 用户退出登录时，清空state的数据
    reset() {
      this.IsOpen = false
      this.SocketTask = false
      this.IsOnline = false
      this.chatTotalCount = 0
      this.systemTotalCount = 0
      this.interViewTotalCount = 0
      const appStore = useAppStore()
      appStore.SET_TABBAR_LIST({
        index: 2,
        name: "count",
        value: 0,
        pagePath: '/pages/message/home/index'
      })
    }
  }
})

export default useWebSocketStore