'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').factory('NotificationService', [
	'$http',
	'$rootScope',
	'Notification',
	constructor,
])

function constructor($http, $rootScope, Notification) {
	var service = {};

	service.success = function(msg, data) {
		let message = msg
		if(data) {
			message = msg + ' ' + data
		}
		Notification.success(message)
	}

	service.alert = function(msg, data) {
		let message = msg
		if(data) {
			message = msg + ' ' + data
		}
		Notification.warning(message)
	}

	service.error = function(msg, data) {
		let message = msg
		if(data) {
			message = "Erro no processamento: " + data.errorCode + " - " + data.message
		}
		Notification.error(message)
	}

	return service;
}