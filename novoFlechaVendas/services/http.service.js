'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.factory('HttpService', [
	'$http',
	'blockUI',
	constructor,
])

function constructor($http, blockUI) {
	var service = {};

	service.httpPost = function (path, param, timeout) {
		var _timeout = timeout !== null ? timeout : TIMEOUT
		var req = {
			method: 'POST',
			url: `${MODO_HTTP}/${URL}/${path}`,
			headers: { 'Authorization': getUsuarioHash() },
			data: param,
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
