// 链接socket
export function connectSocket(url) {

	uni.connectSocket({
		url: url
	});
	onSocketOpen();
	onSocketError();
}
// 监听打开
export function onSocketOpen() {
	uni.onSocketOpen(function(res) {
		console.log('WebSocket连接已打开！', res);
	});
}

// 监听打开失败
export function onSocketError() {
	uni.onSocketError(function(res) {
		console.log('WebSocket连接打开失败，请检查！', res);
	});
}
