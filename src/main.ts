import { createSSRApp } from 'vue'
import App from './App.vue'
import * as Pinia from 'pinia'
import * as global from '@/utils/global'
import * as filter from '@/utils/filters'
import { accAdd, accSub, accDiv, accMul } from '@/utils/math'

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  Object.keys(global).forEach(key => {
    const totalData: any = global
    app.config.globalProperties[`$${key}`] = totalData[key]
  })
  Object.keys(filter).forEach(key => {
    const totalData: any = filter
    app.config.globalProperties[`$${key}`] = totalData[key]
  })
  app.config.globalProperties.$accAdd = accAdd
  app.config.globalProperties.$accSub = accSub
  app.config.globalProperties.$accDiv = accDiv
  app.config.globalProperties.$accMul = accMul
  return {
    app,
    Pinia
  }
}
