'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').factory('ConsoleService', [
	'$http',
	'$rootScope',
	constructor,
])

function constructor($http, $rootScope) {
	var service = {};

	service.startLog = function() {
		document.addEventListener("deviceready", onDeviceReady, false);
		function onDeviceReady() {
			console.log("console.log works well");
		}
	}

	return service;
}