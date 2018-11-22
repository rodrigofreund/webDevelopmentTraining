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
			.then((usuarioDto) => {
				setLogin(usuarioDto);
			})
	}

	service.doLogoff = () => {
		clearLogin();
	}

	service.getUsuario = () => {
		return getLogin();
	}

	service.decodePassword = function (authdata) {
		return btoa(authdata);
	}

	service.encodePassword = function (authdata) {
		return btoa(authdata);
	}

	service.getPassword = function(password) {
		return atob(password);
	}

	service.salvaDadosAutenticacao = function(_login, _senha) {
		var autenticacao = {
			login: _login,
			senha: _senha
		};
		localStorage.setItem('currentUser', angular.toJson(autenticacao))
	}

	service.limpaDadosAutenticacao = function() {
		localStorage.removeItem('currentUser');
	}

	service.getDadosAuthenticacao = function() {
		return angular.fromJson(localStorage.getItem('currentUser'));
	}

	function setLogin(usuarioDto) {
		$http.defaults.headers.common.sessiontoken = usuarioDto.hash;
		sessionStorage.setItem('login', angular.toJson(usuarioDto));
	}

	function getLogin() {
		return angular.fromJson(sessionStorage.getItem('login'));
	}

	function clearLogin() {
		sessionStorage.setItem('login', null);
	}

	return service;
}
