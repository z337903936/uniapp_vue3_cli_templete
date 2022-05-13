import { defineStore } from 'pinia'

interface tabbarObj {
  iconPath: String;
  selectedIconPath: String;
  text: String;
  pagePath: String;
  count?: Number;
}

interface TempleteModuleTypes {
  navInfo: {
    top?: Number;
    height?: Number;
  };
  dealerCode: String;
  tabbarList: Array<tabbarObj>;
  tabbarBgColor: string;
  tabbarIconSize: string;
}

const useAppStore = defineStore('app', {
  state: (): TempleteModuleTypes => {
    return {
      navInfo: {},
      dealerCode: '',
      tabbarList: [{
      		iconPath: "/static/tabs/index-unchecked.png",
      		selectedIconPath: "/static/tabs/index-checked.png",
      		text: '',
      		pagePath: '/pages/home/home/index'
      	},
      	// {
      	// 	iconPath: "/static/tabs/jobfair_unchecked.png",
      	// 	selectedIconPath: "/static/tabs/jobfair_checked.png",
      	// 	text: '',
      	// 	pagePath: '/pages/jobFair/home/index'
      	// },
      	// {
      	// 	iconPath: "/static/tabs/info-unchecked.png",
      	// 	selectedIconPath: "/static/tabs/info-checked.png",
      	// 	text: '',
      	// 	count: 0,
      	// 	pagePath: '/pages/message/home/index'
      	// },
      	{
      		iconPath: "/static/tabs/mine-unchecked.png",
      		selectedIconPath: "/static/tabs/mine-checked.png",
      		text: '',
      		pagePath: '/pages/user/home/index'
      	}
      ],
      tabbarBgColor: '#FFFFFF', // 全局tabber栏背景色
      tabbarIconSize: '80rpx',
    }
  },
  actions: {
    getNavInfo() {
    	return new Promise(resolve => {
    		const systemInfo = uni.getSystemInfoSync()
    		let navInfo = {
    			top: systemInfo.statusBarHeight,
    			height: systemInfo.statusBarHeight + 44
    		}
    		// #ifdef MP-WEIXIN
    		const menuInfo = uni.getMenuButtonBoundingClientRect()
    		navInfo = {
    			top: menuInfo.top - 8,
    			height: menuInfo.bottom + 8
    		}
    		// #endif
        this.navInfo = navInfo
    		resolve(navInfo)
    	})
    },
    SET_TABBAR_LIST: (obj) => {
    	let {
    		name,
    		value,
    		pagePath
    	} = {...obj}
    	let nowIndex = 0
    	this.tabbarList.some((item, index)=>{
    		if (item.pagePath === pagePath) {
    			nowIndex = index
    			return true
    		}
    	})
    	this.tabbarList[nowIndex][name] = value
    }
  }
})

export default useAppStore
