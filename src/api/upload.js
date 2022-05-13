// import { md5 } from 'uview-ui/libs/function/md5'
// import guid from 'uview-ui/libs/function/guid'
import { useUserStore } from '@/store/index'
import {
	uploadImageUrl
} from '@/utils/global'
import permissionUtil from '@/utils/permission.js';
// #ifdef H5
import lrz from 'lrz'
// #endif
export default function upload(formData = {}, url, name) {
	return new Promise(async (resolve, reject) => {
    const userStore = useUserStore()
		const token = userStore.token
		if (!url) {
			url = uploadImageUrl
		}
		if (!name) {
			name = 'files'
		}
		// let imgList = ['webp', 'bmp', 'pcx', 'tif', 'gif', 'jpeg', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf',
		// 'ufo', 'eps', 'ai', 'png', 'hdri', 'raw', 'wmf', 'flic', 'emf', 'ico', 'avif', 'jpg']
		// #ifdef APP-PLUS
		if (uni.getSystemInfoSync().platform === 'android') {
			let androidCameraResult = false; // 安卓相机权限
			let androidPhotoResult = false; // 安卓相册权限
			let permissionIdPhoto = "android.permission.WRITE_EXTERNAL_STORAGE"; // 相册读写权限
			let permissionCamera = "android.permission.CAMERA"; // 相机权限
			if (formData && formData.sourceType && formData.sourceType.length > 0) {
				// 需要判断一种
				if (formData.sourceType.indexOf('album') !== -1) {
					// 相册
					androidPhotoResult = await permissionUtil.requestAndroidPermission(permissionIdPhoto)
					if (androidPhotoResult === 0) {
						uni.showToast({
							title: '需要开启相册权限后上传，请同意',
							icon: 'none',
							duration: 3000
						});
					} else if (androidPhotoResult === -1) {
						uni.showToast({
							title: '需要开启相册权限后上传，请在系统设置中开启',
							icon: 'none',
							duration: 3000
						});
						return;
					}
				} else if (formData.sourceType.indexOf('camera') !== -1) {
					// 相机
					androidCameraResult = await permissionUtil.requestAndroidPermission(permissionCamera)
					if (androidCameraResult === 0) {
						uni.showToast({
							title: '需要开启相机权限后上传，请同意',
							icon: 'none',
							duration: 5000
						});
						return;
					} else if (androidCameraResult === -1) {
						uni.showToast({
							title: '需要开启相机权限后上传，请在系统设置中开启',
							icon: 'none',
							duration: 3000
						});
						return;
					}
				}

			} else {
				// 需要判断两种权限
				androidPhotoResult = await permissionUtil.requestAndroidPermission(permissionIdPhoto)
				androidCameraResult = await permissionUtil.requestAndroidPermission(permissionCamera)
				if (androidPhotoResult !== 1 || androidCameraResult !== 1) {
					uni.showToast({
						title: '需要开启相机权限和相册权限后上传，请同意或在系统设置中开启',
						icon: 'none',
						duration: 3000
					});
					return;
				}
			}
		} else if (uni.getSystemInfoSync().platform === 'ios') {
			let iosCameraResult = false; // 相机权限
			let iosPhotoResult = false; // 相册权限
			if (formData && formData.sourceType && formData.sourceType.length > 0) {
				if (formData.sourceType.indexOf('album') !== -1) {
					// 判断相册权限
					iosPhotoResult = permissionUtil.judgeIosPermission('photoLibrary'); // 判断相册权限
					if (!iosPhotoResult) {
						uni.showToast({
							title: '需要开启相册权限后上传，请同意或开启',
							icon: 'none',
							duration: 3000
						});
						// return;
					}

				} else if (formData.sourceType.indexOf('camera') !== -1) {
					// 判断相机权限
					iosCameraResult = permissionUtil.judgeIosPermission('camera') || false; // 判断ios相机权限
					if (!iosCameraResult) {
						uni.showToast({
							title: '需要开启相机权限后上传，请同意或开启',
							icon: 'none',
							duration: 3000
						});
						// return;
					}
				}
			} else {
				// 需要判断两种类型 没有指定类型时，需要判断两种权限
				iosCameraResult = permissionUtil.judgeIosPermission('camera') || false; // 判断ios相机权限
				iosPhotoResult = permissionUtil.judgeIosPermission('photoLibrary'); // 判断相册权限
				if (!iosCameraResult || !iosPhotoResult) {
					uni.showToast({
						title: '需要开启相机和相册权限后上传，请同意或开启',
						icon: 'none',
						duration: 3000
					});
					// return;
				}
			}

		}
		// #endif

		uni.chooseImage({
			count: 1,
			sourceType: formData && formData.sourceType && formData.sourceType.length > 0 ? formData
				.sourceType : ['album', 'camera'],
			success: res => {
				const tempPath = res.tempFilePaths[0]
				const tempFile = res.tempFiles[0]
				// const size = 1 * 1024 * 1024
				let quality = 0
				// #ifdef APP-PLUS
				// if (tempFile.size < 1 * 1024 * 1024) {
				// 	quality = 100
				// } else if (tempFile.size < 5 * 1024 * 1024) {
				// 	quality = 80
				// } else if (tempFile.size < 10 * 1024 * 1024) {
				// 	quality = 65
				// } else if (tempFile.size < 20 * 1024 * 1024) {
				// 	quality = 40
				// } else {
				// 	quality = 30
				// }
				// #endif
        if (tempFile.size < 1 * 1024 * 1024) {
        	quality = 100
        } else if (tempFile.size < 5 * 1024 * 1024) {
        	quality = 80
        } else if (tempFile.size < 10 * 1024 * 1024) {
        	quality = 65
        } else if (tempFile.size < 20 * 1024 * 1024) {
        	quality = 40
        } else {
        	quality = 30
        }
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				console.log('压缩   ', quality)
				// #ifndef H5
				let type = tempPath.split('.').length > 1 ? tempPath.split('.')[1]
					.toLowerCase() : 'jpg'
				uni.compressImage({
					src: tempPath,
					quality
				}).then(res => {
					console.log('2222222222 ', res)
					// formData.fileName = res[1].tempFilePath + '.' + type
          let tempFilePath = res[1].tempFilePath
          if (tempFilePath.indexOf('.') > -1) {
            tempFilePath = tempFilePath.substr(0, tempFilePath.indexOf('.')) + '.' + type
          } else {
            tempFilePath = tempFilePath + '.' + type
          }
          formData.fileName = tempFilePath
					console.log(formData)
					uni.uploadFile({
						url,
						name,
						timeout: 30000,
						filePath: res[1].tempFilePath,
						header: {
							// "Content-Type": "multipart/form-data",
							'token': token
						},
						formData,
						success: res => {
							uni.hideLoading()
							const data = JSON.parse(res.data)
							if (data.status === 200) {
								resolve(data)
							} else {
								uni.showToast({
									title: data.msg ||
										'上传失败,请稍后重试!',
									icon: 'none'
								})
								reject()
							}
						},
						fail: res => {
							uni.hideLoading()
							uni.showToast({
								title: '上传失败,请稍后重试!',
								icon: 'none'
							})
							reject()
						}
					})
				}).catch((e) => {
					console.log(e)
					// uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: '上传失败~'
					})
				})
				// #endif


				// #ifdef H5
				if (tempFile.size < 1 * 1024 * 1024) {
					quality = 1
				} else if (tempFile.size < 5 * 1024 * 1024) {
					quality = 0.8
				} else if (tempFile.size < 10 * 1024 * 1024) {
					quality = 0.65
				} else if (tempFile.size < 20 * 1024 * 1024) {
					quality = 0.4
				} else {
					quality = 0.3
				}
				lrz(tempFile, {
					quality: quality
				}).then(data => {
					let file = new window.File([data.file], tempFile.name, {
						type: tempFile.type
					});
					uni.uploadFile({
						url,
						name,
						// filePath: tempPath,
						timeout: 30000,
						file,
						header: {
							// "Content-Type": "multipart/form-data",
							'token': token
						},
						formData,
						success: res => {
							uni.hideLoading()
							const data = JSON.parse(res.data)
							if (data.status === 200) {
								resolve(data)
							} else {
								uni.showToast({
									title: data.msg ||
										'上传失败,请稍后重试!',
									icon: 'none'
								})
								reject()
							}
						},
						fail: res => {
							uni.hideLoading()
							uni.showToast({
								title: '上传失败,请稍后重试!',
								icon: 'none'
							})
							reject()
						}
					})
				})
				// #endif
			}
		})
	})
}
