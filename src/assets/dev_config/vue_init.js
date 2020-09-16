/* eslint-disable */
import Vue from 'vue'
import devSrv from './spa_mock'

function init() {
	let backendIpAddr = null
	if (window.top.pathConfig && window.top.pathConfig.gateway) {
		// 如果外层有就用外层的路径配置
		let parentServerPath = window.top.pathConfig.gateway
		if (parentServerPath.endsWith('/')) {
			backendIpAddr = parentServerPath.substring(0, parentServerPath.length - 1)
		} else {
			backendIpAddr = parentServerPath
		}
	} else {
		// 单vue页面使用配置的后台地址
		if (sessionStorage.getItem('bx_auth_ticket') === null) {
			devSrv.dummy()
		}
		let server_cfg = devSrv.server_cfg
		backendIpAddr =
			server_cfg.back_server_protocol +
			'://' +
			server_cfg.back_server_ip +
			':' +
			server_cfg.back_server_port
	}
	top.window.backendIpAddr = backendIpAddr

	let defaultApp =
		(window.frameElement && window.frameElement.dataset['app']) ||
		(top.window.pathConfig && top.window.pathConfig.application)

	var service_api = {
		selectOne: backendIpAddr + '/' + defaultApp + '/select',
		select: backendIpAddr + '/' + defaultApp + '/select',
		selectByUser: backendIpAddr + '/' + defaultApp + '/select',
		operate: backendIpAddr + '/' + defaultApp + '/operate',
		approval: backendIpAddr + '/' + defaultApp + '/process/approval',

		uploadFile: backendIpAddr + '/file/upload',
		downloadFile: backendIpAddr + '/file/download?filePath=',
		deleteFile: backendIpAddr + '/file/delete',

		exportExcel: backendIpAddr + '/' + defaultApp + '/export/exportExcel',
		importExcel: backendIpAddr + '/' + defaultApp + '/bizDataImport',

		qrcode: backendIpAddr + '/' + defaultApp + '/bxsys/qrcode'
	}

	top.window.serviceApi = service_api

	Vue.prototype.service_api = service_api

	Vue.config.productionTip = false

	/**
	 * 定时重复发送请求
	 * @params t: 时间间隔
	 * @params out: 倒计时
	 * @params fun:请求数据的函数，必须是一个返回true/false的函数
	 */
	Vue.prototype.timeOut = function(t, out, efun) {
		// this.time  = t
		this.time = t // 定时间隔 秒
		this.nTime = out // 计时 秒
		this.isLoad = false // 请求是否成功有效
		this.eNum = 0 // 请求失败次数
		this.isDestroy = false //是否停止
		this.rFun = efun
		this.reqFun = async function() {
			let _this = this
			let reqPromise = await _this.rFun()


			// reqPromise.then((res)=>{

			if (reqPromise.isRes) {
				this.isLoad = true
				this.nTime = 0
				this.eNum = 0
				if (this.isDestroy === false) {
					this.startTime()
				}
				// this.timeOut(10,0)
			} else {
				this.isLoad = false
				if (this.eNum < 3) {
					this.nTime = 0
					this.eNum++
					if (this.isDestroy === false) {
						this.startTime()
					}
				}
			}
		}
		;(this.startTime = function() {
			if (this.eNum < 3 && this.nTime === this.time) {
				this.reqFun(this.nTime)
			} else if (this.eNum === 3) {
				
				return false
			} else {
				setTimeout(() => {
					this.nTime++

					if (this.isDestroy === false) {
						this.startTime()
					}
				}, 1000)
			}
		}),
			(this.endTime = function() {
				this.isDestroy = true
			})
	}
}

export default init
