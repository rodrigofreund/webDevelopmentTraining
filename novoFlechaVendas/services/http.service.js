'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.factory('HttpService', [
	'$http',
	'blockUI',
	'$log',
	constructor,
])

function constructor($http, blockUI, $log) {
	var service = {};

	service.httpPost = function (path, param, timeout, header, opt) {
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
		blockUI.start();
		return $http(req).then(result => {
				return result.data;
			}, error => {
				$log.log('Erro na chamada ao servidor: ', error);
			}).finally(function () {
				blockUI.stop();
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
