'use strict'

angular.module('Authentication')

.factory('AuthenticationRepository', ['Base64', '$http', '$rootScope', '$timeout', 'DatabaseService', constructor])

function constructor(Base64, $http, $rootScope, $timeout, DatabaseService) {
	var service = {};

	service.doLogin = function(login, passwordEncoded, callback) {
		DatabaseService.query('SELECT * FROM usuarios WHERE login = ' + login + ' and ' + ' senha = ' + passwordEncoded + ';', 
		function(response) {
			callback(response)
		})
	}
	
	return service;
}