'use strict'

angular.module('Authentication')

.factory('AuthenticationService', ['Base64', '$http', '$rootScope', '$timeout', 'StorageService', 'NetworkService', 'NotificationService',
	function(Base64, $http, $rootScope, $timeout, StorageService, NetworkService, NotificationService) {
		var service = {};
		
		service.ClearCredentials = function() {
			$rootScope.globals = {};
			if(!StorageService.getPasswordRemember()) {
				StorageService.clearUsuarioLogado();	
			}
			$http.defaults.headers.common.Authorization = 'Basic ';
			service.usuario = undefined
		};

		service.Login = (_login, _senha, callback) => {
			const _loginParam = {
				login: _login,
				senha: _senha
			}
			NetworkService.httpPost('/doLogin/', _loginParam, (result, data) => {
				if (result == CALLRESULT.OK) {
					callback(data)
				} else if (result == CALLRESULT.ERROR) {
					NotificationService.error('Erro ao efetuar o login', data);
				} else {
					NotificationService.error('Falha de comunicação com o servidor');
				}
			})
		}

		service.SetCredentials = function(senha, remember, usuario) {
			var authdata = Base64.encode(senha)
			StorageService.resetFiltroAtivo()
			StorageService.resetFiltroPedidoAtivo()
			service.usuario = usuario;

			$rootScope.globals = {
				currentUser: {
					authdata: authdata,
					user : usuario
				}
			};

			$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
			var dataFinal = new Date();
			dataFinal.setDate(dataFinal.getDate() + 30);
			
			if(remember) {
				StorageService.setPasswordRemember(true);
			} else {
				StorageService.setPasswordRemember(false);
			}
			
			StorageService.setUsuarioLogado(authdata, usuario);
		};
		
		service.getUsuario = function() {
			return service.usuario;
		}
		
		service.setUsuario = function(usuario) {
			return service.usuario = usuario;
		}
		
		service.isAdministrador = function() {
			if(!service.usuario) {
				return false
			}
			if(service.usuario.perfil.id === 2) {
				return true;
			}
			return false;
		}
		
		service.isMaster = function() {
			if(!service.usuario) {
				return false
			}
			if(service.usuario.perfil.id === 2) {
				return true;
			}
			return false;
		}
		
		service.isVendedor = function() {
			if(!service.usuario) {
				return false
			}
			if(service.usuario.perfil.id === 1) {
				return true;
			}
			return false;
		}
		
		service.getPasswordRemember = function() {
			return StorageService.getPasswordRemember();
		}
		
		service.getCredentialsRemember = function() {
			return StorageService.getUsuarioLogado();
		}
		
		service.getPassword = function(authdata) {
			return Base64.decode(authdata);
		}
		
		service.getPasswordEncoded = function(password) {
			return Base64.encode(password);
		}
		
		service.getNomeUsuario = function() {
			if(service.usuario) {
				return service.usuario.nome	
			} else {
				""
			}
		}

		return service;
	}
	])

	.factory('Base64', function() {
	/* jshint ignore:start */

	var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	return {
		encode: function(input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			do {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output +
					keyStr.charAt(enc1) +
					keyStr.charAt(enc2) +
					keyStr.charAt(enc3) +
					keyStr.charAt(enc4);
				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			} while (i < input.length);

			return output;
		},

		decode: function(input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			var base64test = /[^A-Za-z0-9\+\/\=]/g;
			if (base64test.exec(input)) {
				window.alert("There were invalid base64 characters in the input text.\n" +
					"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
					"Expect errors in decoding.");
			}
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			do {
				enc1 = keyStr.indexOf(input.charAt(i++));
				enc2 = keyStr.indexOf(input.charAt(i++));
				enc3 = keyStr.indexOf(input.charAt(i++));
				enc4 = keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}

				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";

			} while (i < input.length);

			return output;
		}
	};

	/* jshint ignore:end */
});
