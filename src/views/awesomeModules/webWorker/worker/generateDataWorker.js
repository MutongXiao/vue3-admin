/**
webworker注意点
Web Worker 有以下几个使用注意点。
同源限制、DOM限制、通信限制、脚本限制、文件限制

1.分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。
2.Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用document、window、parent这些对象。但是，Worker 线程可以navigator对象和location对象。
3.Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。
4.Worker 线程不能执行alert()方法和confirm()方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求
5.Worker 线程无法读取本地文件，即不能打开本机的文件系统（file://），它所加载的脚本，必须来自网络。
6.全局变量中并不存在this，this并不指向window，有self，指向worker本身。(os：但是在worker.js中打印出来的this和self显示一致)
7.子线程和父线程的通讯是通过值拷贝，子线程对通信内容的修改，不会影响到父线程。在通信过程中值过大也会影响到性能(解决这个问题可以用transferable objects)

通信方法
(1) 发送消息
主线程：worker.postMessage();
子线程：self.postMessage()
(2)接收消息
主线程：worker.onmessage(); // addEventListener(‘message’)
子线程：self.onmessage()
(3)监听异常
主线程：worker.onerror();
子线程：self.onerror()
(4)销毁方法
主线程：worker.terminate();
子线程：self.close()
(5)加载脚本(worker内部加载其他脚本)
importScripts(‘one.js’, ‘two.js’)
 */

self.onmessage = function (e) {
	const data = e.data;
	const list = [];
	for (let i = 0; i < 400; i++) {
		for (let j = 0; j < 10; j++) {
			list.push({ ...data[j], key: `数据${j + 1 + i * 10}` });
		}
	}
	self.postMessage(list);
};
