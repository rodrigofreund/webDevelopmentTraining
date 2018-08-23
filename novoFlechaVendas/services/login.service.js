'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas');

app.factory('LoginService', ['$http', 'HttpService', constructor]);

function constructor($http, HttpService) {
	var service = {};

	const SUBPATH = 'public/authentication/'

	service.doLogin = (_login, _senha) => {
		const password = btoa(_senha);
		const _loginParam = {
			login: _login,
			senha: password
		};
		return HttpService.httpPost(SUBPATH + 'doLogin', _loginParam)
			.then((result) => {
				setLogin(result.data);
			})
	}

	service.doLogoff = () => {
		clearLogin();
	}

	service.getUsuario = () => {
		return getLogin();
	}

	function setLogin(usuarioDto) {
		$http.defaults.headers.common.sessiontoken = usuarioDto.hash;
		sessionStorage.setItem('login', angular.toJson(usuarioDto));
	}

	function getLogin() {
		return angular.fromJson(sessionStorage.getItem('login'));
	}

	function clearLogin() {
		console.log('clean')
		sessionStorage.setItem('login', null);
	}

	/*
	service.ClearCredentials = function() {
		$rootScope.globals = {};
		if(!StorageService.getPasswordRemember()) {
			StorageService.clearUsuarioLogado();	
		}
		$http.defaults.headers.common.Authorization = 'Basic ';
		service.usuario = undefined
	};


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
	*/

	return service;
}
