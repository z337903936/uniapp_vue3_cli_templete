import { ComponentInternalInstance, getCurrentInstance } from 'vue'
interface useCurrentInstanceObj {
  proxy: {
    [key: string]: any
  }
  globalProperties: any
}
export default function useCurrentInstance() {
  const { appContext, proxy } = getCurrentInstance() as ComponentInternalInstance
  // const obj = getCurrentInstance() as ComponentInternalInstance
  const globalProperties = appContext.config.globalProperties
  return {
    proxy,
    globalProperties
  }
}
