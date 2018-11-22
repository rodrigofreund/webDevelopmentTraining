'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.factory('HttpService', [
	'$http',
	'blockUI',
	'$log',
	'$q',
	constructor,
])

function constructor($http, blockUI, $log, $q) {
	var service = {};

	service.httpPost = function (path, param, timeout, header, opt, unblock) {
		let _timeout = timeout !== null ? timeout : TIMEOUT
		let _header = {
			'Authorization': getUsuarioHash(),
		}
		if (header) {
			for (let i in header) {
				_header[i] = header[i];
			}
		}
		var req = {
			method: 'POST',
			url: `${MODO_HTTP}/${URL}/${path}`,
			headers: _header,
			data: param,
			timeout: _timeout
		};
		if (opt) {
			for (let i in opt) {
				req[i] = opt[i];
			}
		}
		if(!unblock) {
			blockUI.start();
		}
		return $http(req).then(
			function(result) {
				return result.data;
			},
			function(error) {
				throw `${error.data.errorCode} - ${error.data.message}`;
			},
			).finally(function () {
				if(!unblock) {
					blockUI.stop();
				}
			})
	}

	service.httpGet = function (path, param, timeout) {
		var _timeout = timeout !== null ? timeout : TIMEOUT
		var req = {
			method: 'GET',
			url: `${MODO_HTTP}/${URL}/${path}`,
			headers: { 'Authorization': getUsuarioHash() },
			params: param,
			timeout: _timeout
		}
		blockUI.start()
		return $http(req)
			.then(result => {
				return result.data
			})
			.finally(function () {
				blockUI.stop()
			})
	}

	function getUsuarioHash() {
		return angular.fromJson(sessionStorage.getItem('login')) === null ? null : angular.fromJson(sessionStorage.getItem('login'));
	}

	return service;
}
