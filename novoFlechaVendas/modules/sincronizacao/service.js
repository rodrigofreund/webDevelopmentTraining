'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').factory('SincronizacaoService', [
	'$http',
	'$rootScope',
	'StorageService',
	'IndustriasService',
	'PedidoService',
	constructor,
])

function constructor($http, $rootScope, StorageService, IndustriasService, PedidoService) {
	var service = {};

	service.sincroniza = function(username, password, callback) {
		$http.post(MODO_HTTP + URL + '/doLogin/', { login: username, senha: password })
			.success(function (usuario) {
				sincronizaUsuarios(usuario)
				sincronizaIndustrias(usuario)
				sincronizaClientes(usuario)
				// sincronizaTabelas(usuario)
				atualizaBaseLocal(callback)
				}
			)
			.error(function(response) {
				conluirSincronizacao(undefined, response)
			}
		)
	}

	function sincronizaUsuarios(usuario) {
		let usuarioLocal = StorageService.getLoginUsuario(usuario.login, usuario.senha)
		if(usuarioLocal) {
			StorageService.removeUsuarioSalvo(usuarioLocal)
			StorageService.addUsuarioSalvo(usuario)
		} else {
			StorageService.addUsuarioSalvo(usuario)
		}
	}

	function sincronizaIndustrias(usuario) {
		IndustriasService.getIndustriasUsuario(usuario.id, function(data) {
			StorageService.setIndustriasUsuario(usuario.id, data)
		})
	}

	function sincronizaClientes(usuario) {
		IndustriasService.getIndustriasUsuario(usuario.id, function(industrias) {
			industrias.forEach(industria => {
				PedidoService.carregaClientesPorRepresentacao(industria.id, usuario.id, clientes => {
					if(clientes.length > 0) {
						StorageService.setClientesUsuario(usuario.id, industria.id, clientes)
					}
				})
			})
		})
	}

	function sincronizaTabelas(usuario) {
		IndustriasService.getTabelasIndustria(idIndustria, tabelas => {
			if(tabelas.length > 0) {
				StorageService.setTabelasIndustriaUsuario(usuario.id, idIndustria, tabelas)
			}
		})
	}

	function atualizaBaseLocal(callback) {
		let idDb = StorageService.getIdentificadorBancoDados()
		if(!idDb || idDb !== DATABASE.ID) {
			$http.get(MODO_HTTP + URL + '/getIdentificadorAtualizacaoBancoDeDados/').success(function(id) {
					StorageService.setIdentificadorBancoDados(id)
					conluirSincronizacao(true, callback)
				})
			} else {
				conluirSincronizacao(true, callback)
			}
	}

	function conluirSincronizacao(resultado, callback) {
		if(resultado) {
			StorageService.setDataSincronizacao(moment())
			callback(resultado)
		} else {
			callback(resultado)
		}
	}

	return service;
}
