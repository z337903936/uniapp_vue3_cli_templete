import { onPullDownRefresh,onReachBottom } from '@dcloudio/uni-app'

export default function () {
  let currentPage = 1 // 当前页面
  let loadMore = false // 加载状态
  let noMore = false // 是否已经无更多
  let isEmpty = false // 是否为空
  let triggered = false
  let needInit = false //下拉刷新时是否触发状态更新
  onPullDownRefresh(() => {
    triggerDown().then(() => {
      uni.stopPullDownRefresh()
    }).catch(() => {
      uni.stopPullDownRefresh()
    })
  })
  onReachBottom(() => {
    triggerUp()
  })
  const triggerInit = () => {
    return new Promise((resolve,reject) => {
      currentPage = 1
      loadMore = isEmpty = noMore = false
      downCallback().then(res => {
        if (!Array.isArray(res)) {
          res = [res, res]
        }
        noMore = !res[0]
        isEmpty = !res[1]
        loadMore = true
        resolve()
      }).catch(() => {
        reject()
      })
    })
  }
  const resetUp = () => {
    return new Promise((resolve, reject) => {
      currentPage = 1
      loadMore = isEmpty = noMore = false
      upCallback().then(res => {
        if (!Array.isArray(res)) {
          res = [res, res]
        }
        noMore = !res[0]
        isEmpty = !res[1]
        loadMore = true
        resolve()
      }).catch(() => {
        reject()
      })
    })
  }
  cosnt triggerDown = () => {
    return new Promise((resolve, reject) => {
      currentPage = 1
      if (needInit) {
        loadMore = isEmpty = noMore = false
      }
      downCallback().then(res => {
        if (!Array.isArray(res)) {
          res = [res, res]
        }
        noMore = !res[0]
        isEmpty = !res[1]
        loadMore = true
        resolve()
      }).catch(() => {
        reject()
      })
    })
  },
  const triggerUp = () => {
    return new Promise((resolve,reject) => {
      if (noMore) return
      if (!loadMore) return
      loadMore = false
      const page = currentPage + 1
      upCallback(page).then(res => {
        if (!Array.isArray(res)) {
          res = [res, res]
        }
        noMore = !res[0]
        currentPage = page
        loadMore = true
        resolve()
      }).catch(() => {
        loadMore = true
        reject()
      })
    })
  },
  const refresherrefresh = (e) => {
    triggered = true
    triggerDown().then(() => {
      triggered = false
    })
  }
}
