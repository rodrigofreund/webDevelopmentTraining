'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').factory('NetworkService', [
	'$http',
	'$rootScope',
	'$timeout',
	'blockUI',
	constructor,
])

function constructor($http, $rootScope, $timeout, blockUI) {
	var service = {};

	service.startNetworkMonitor = function() {
		if(service.isMobile()) {
			document.addEventListener('online', function() {
				NETWORK.STATUS = NETWORK_STATUS.ONLINE
				$rootScope.$apply();
			}, false);
			document.addEventListener('offline', function() {
				NETWORK.STATUS = NETWORK_STATUS.OFFNLINE
				$rootScope.$apply();
			}, false);

			NETWORK.STATUS = service.isOnline()
		}
	}

	service.getNetworkStatus = function() {
		return NETWORK.STATUS
	}

	service.isOnline = function() {
		if(navigator.connection.type != Connection.UNKNOWN && navigator.connection.type != Connection.NONE) {
			$rootScope.globals.online = true
			return NETWORK_STATUS.ONLINE
		} else {
			$rootScope.globals.online = false
			return NETWORK_STATUS.OFFNLINE
		}
	}

	service.isMobile = function() {
		// return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)
		return false
	}

	service.httpPost = function(path, param, callback) {
		blockUI.start()
		$timeout(callAtTimeout, TIMEOUT)
		const opt = {'timeout' : TIMEOUT }
		$http.post(MODO_HTTP + URL + path, param, opt)
			.success(function (response) {
				callback(CALLRESULT.OK, response)
			})
			.error(function(error) {
				if(error) {
					callback(CALLRESULT.ERROR, error)
				} else {
					callback(CALLRESULT.UNKNOWN, null)
				}
			})
			.finally(function() {
				blockUI.stop()
			})
	}

	service.httpGet = function(path, callback) {
		blockUI.start()
		//$timeout(callAtTimeout, TIMEOUT)
		const opt = {'timeout' : TIMEOUT }
		$http.get(MODO_HTTP + URL + path, opt)
			.success(function (response) {
				callback(CALLRESULT.OK, response)
			})
			.error(function(error) {
				if(error) {
					callback(CALLRESULT.ERROR, error)
				} else {
					callback(CALLRESULT.UNKNOWN, null)
				}
			})
			.finally(function() {
				blockUI.stop()
			})
	}

	function callAtTimeout() {
		blockUI.stop()
	}

	return service;
}
