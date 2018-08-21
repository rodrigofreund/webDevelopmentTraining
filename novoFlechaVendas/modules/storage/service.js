'use strict';

angular.module('GerenciadorFinanceiroFlechaVendas')

.factory('StorageService', [ '$http', '$rootScope', 'LocalStorageService', function($http, $rootScope, LocalStorageService) {
	var service = {};
	
	/*---------------USUARIO LOGADO--------------------*/
	service.setUsuarioLogado = function(authdata, usuario) {
		let currentUser = {authdata : authdata, user : usuario};
		localStorage.currentUser = angular.toJson(currentUser);
	}
	
	service.getUsuarioLogado = function() {
		if(localStorage.currentUser) {
			let currentUser = angular.fromJson(localStorage.currentUser);
			return currentUser;
		} else {
			return null;
		}
	}
	service.clearUsuarioLogado = function() {
		if(localStorage.currentUser) {
			localStorage.removeItem('currentUser');
		}
	}
	
	/*---------------LEMBRAR SENHA--------------------*/
	service.setPasswordRemember = function(remember) {
		localStorage.rememberPassword = angular.toJson(remember);
	}
	
	service.getPasswordRemember = function() {
		return angular.fromJson(localStorage.rememberPassword);
	}
	
	/*---------------PEDIDO ATIVO--------------------*/
	service.setPedidoAtivo = function(pedidoAtivo) {
		localStorage.pedidoAtivo = angular.toJson(pedidoAtivo);
	}
	
	service.getPedidoAtivo = function() {
		return angular.fromJson(localStorage.pedidoAtivo);
	}
	
	service.resetPedidoAtivo = function() {
		if(localStorage.pedidoAtivo) {
			localStorage.removeItem('pedidoAtivo');
		}
	}
	
	/*---------------FILTRO DE CLIENTES--------------------*/
	service.setFiltroAtivo = function(filtroAtivo) {
		localStorage.filtroAtivo = angular.toJson(filtroAtivo);
	}
	
	service.getFiltroAtivo = function() {
		return angular.fromJson(localStorage.filtroAtivo);
	}
	
	service.resetFiltroAtivo = function() {
		if(localStorage.filtroAtivo) {
			localStorage.removeItem('filtroAtivo');
		}
	}
	
	/*---------------FILTRO DE PEDIDOS--------------------*/
	service.setFiltroPedidoAtivo = function(filtroPedidoAtivo) {
		localStorage.filtroPedidoAtivo = angular.toJson(filtroPedidoAtivo);
	}
	
	service.getFiltroPedidoAtivo = function() {
		return angular.fromJson(localStorage.filtroPedidoAtivo);
	}
	
	service.resetFiltroPedidoAtivo = function() {
		if(localStorage.filtroPedidoAtivo) {
			localStorage.removeItem('filtroPedidoAtivo');
		}
	}

	/*---------------PEDIDOS SALVOS--------------------*/
	service.setPedidosSalvo = function(pedido) {
		let listaPedidosSalvos = []
		listaPedidosSalvos.push(pedido)
		pedido.idPedidoSalvo = 1
		localStorage.setItem('pedidos', JSON.stringify(listaPedidosSalvos))
	}
	
	service.addPedidosSalvo = function(pedido) {
		let listaPedidosSalvos = service.getPedidosSalvo()
		if(!listaPedidosSalvos) {
			service.setPedidosSalvo(pedido)
		} else {
			let indice = undefined
			listaPedidosSalvos.forEach(function(item, index) {
				if(item.idPedidoSalvo === pedido.idPedidoSalvo) {
					indice = index
				}
			})
			if(indice !== undefined) {
				listaPedidosSalvos[indice] = pedido
			} else {
				for(var i in listaPedidosSalvos) {
					if(indice === undefined || indice < listaPedidosSalvos[i].idPedidoSalvo) {
						indice = listaPedidosSalvos[i].idPedidoSalvo
					}
				}
				if(!indice) {
					indice = 0
				}
				pedido.idPedidoSalvo = indice + 1
				listaPedidosSalvos.push(pedido)
			}
			localStorage.setItem('pedidos', JSON.stringify(listaPedidosSalvos))
		}
	}
	
	service.getPedidosSalvo = function() {
		if(localStorage.getItem('pedidos') !== 'undefined') {
			return JSON.parse(localStorage.getItem('pedidos'))
		} else {
			return undefined
		}
	}
	
	service.removePedidoSalvo = function(pedido) {
		let listaPedidosSalvos = service.getPedidosSalvo()
		if(listaPedidosSalvos) {
			let indice = undefined
			listaPedidosSalvos.forEach(function(item, index) {
				if(item.idPedidoSalvo === pedido.idPedidoSalvo) {
					indice = index
				}
			})
			if(indice !== undefined) {
				listaPedidosSalvos.splice(indice, 1)
			}
			if(listaPedidosSalvos.length === 0) {
				service.resetPedidosSalvo()
			} else {
				localStorage.setItem('pedidos', JSON.stringify(listaPedidosSalvos))	
			}
		}
	}
	
	service.resetPedidosSalvo = function() {
		if(localStorage.getItem('pedidos')) {
			localStorage.removeItem('pedidos');
		}
	}

	/*---------------DATABASE USUARIO--------------------*/

	service.setDataUsuario = function(usuario) {
		let usuarioDb = []
		usuarioDb.push(usuario)
		localStorage.setItem('usuarioDb', JSON.stringify(usuarioDb))
	}

	service.getDataUsuario = function() {
		if(localStorage.getItem('usuarioDb') !== 'undefined') {
			return JSON.parse(localStorage.getItem('usuarioDb'))
		} else {
			return undefined
		}
	}

	service.getLoginUsuario = function(login, senha) {
		let listaUsuarioSalvo = service.getDataUsuario()
		if(listaUsuarioSalvo && listaUsuarioSalvo.length > 0) {
			let indice = undefined
			listaUsuarioSalvo.forEach(function(item, index) {
				if(item.login === login && item.senha === senha) {
					indice = index
				}
			})
			if(indice !== undefined) {
				return listaUsuarioSalvo[indice]
			} else {
				return undefined
			}
		} else {
			return undefined
		}
	}

	service.addUsuarioSalvo = function(usuario) {
		let listaUsuarioSalvo = service.getDataUsuario()
		if(!listaUsuarioSalvo) {
			service.setDataUsuario(usuario)
		} else {
			let indice = undefined
			listaUsuarioSalvo.forEach(function(item, index) {
				if(item.id === usuario.id) {
					indice = index
				}
			})
			if(indice !== undefined) {
				listaUsuarioSalvo[indice] = usuario
			} else {
				listaUsuarioSalvo.push(usuario)
			}
			localStorage.setItem('usuarioDb', JSON.stringify(listaUsuarioSalvo))
		}
	}

	service.removeUsuarioSalvo = function(usuario) {
			let listaUsuarioSalvo = service.getDataUsuario()
			if(listaUsuarioSalvo) {
				let indice = undefined
				listaUsuarioSalvo.forEach(function(item, index) {
					if(item.login === usuario.login && item.password == usuario.senha) {
						indice = index
					}
				})
				if(indice) {
					listaUsuarioSalvo.splice(indice, 1)
					localStorage.setItem('usuarioDb', JSON.stringify(listaUsuarioSalvo))
					return indice
				}
			}
			return undefined
	}

	/*---------------IDENTIFICADOR DATABASE--------------------*/
	service.setIdentificadorBancoDados = function(identificador) {
		localStorage.identificadorBancoDados = angular.toJson(identificador);
	}
	
	service.getIdentificadorBancoDados = function() {
		return angular.fromJson(localStorage.identificadorBancoDados);
	}

	service.resetIdentificadorBancoDados = function() {
		if(localStorage.identificadorBancoDados) {
			localStorage.removeItem('identificadorBancoDados');
		}
	}

	/*---------------DATA SINCRONIZACAO DATABASE--------------------*/
	service.setDataSincronizacao = function(dataSincronizacao) {
		localStorage.dataSincronizacao = angular.toJson(dataSincronizacao)
	}
	service.getDataSincronizacao = function() {
		return angular.fromJson(localStorage.dataSincronizacao);
	}

	/*---------------INDUSTRIA DATABASE--------------------*/
	service.getIndustriasUsuario = function(idUsuario) {
		let industriasUsuario = LocalStorageService.getData(STORAGE_ITEM.INDUSTRIAS_USUARIO)
		
		if(industriasUsuario) {
			var result = $.grep(industriasUsuario, function(n, i) {
				return n.idUsuario === idUsuario;
			})

			if(result && result.length > 0) {
				return result[0].industrias
			}
		}
		return undefined
	}

	service.setIndustriasUsuario = function(idUsuario, industrias) {
		let nodo = { idUsuario: idUsuario, industrias: industrias }
		let usuarioIndustrias = LocalStorageService.getData(STORAGE_ITEM.INDUSTRIAS_USUARIO)
		if(usuarioIndustrias) {
			usuarioIndustrias.push(nodo)
		} else {
			usuarioIndustrias = [nodo]
		}
		LocalStorageService.setData(STORAGE_ITEM.INDUSTRIAS_USUARIO, usuarioIndustrias)
	}

	/*---------------CLIENTE-INDUSTRIA DATABASE--------------------*/
	service.getClientesUsuario = function(idUsuario, idIndustria) {
		let clientes = LocalStorageService.getData(STORAGE_ITEM.CLIENTES_USUARIO)

		if(clientes) {
			var result = $.grep(clientes, function(n, i) {
				return n.idUsuario == idUsuario && n.idIndustria == idIndustria
			})

			if(result && result.length > 0) {
				return result[0].clientes
			}
		}
		return undefined
	}

	/*
	service.getTabelasIndustriaUsuario = function(idUsuario, idIndustria) {
		let tabelas = LocalStorageService.getData(STORAGE_ITEM.TABELAS_INDUSTRIA)

		if(tabelas) {
			var result = $.grep(tabelas, function(n, i) {
				return n.idTabela
			})
		}
	}

	service.setTabelasIndustriaUsuario = function(idUsuario, idIndustria, tabelas) {

	}
	*/

	service.setClientesUsuario = function(idUsuario, idIndustria, clientes) {
		let nodo = { idUsuario: idUsuario, idIndustria: idIndustria, clientes: clientes }
		let usuarioClientes = LocalStorageService.getData(STORAGE_ITEM.CLIENTES_USUARIO)
		if(usuarioClientes) {
			usuarioClientes.push(nodo)
		} else {
			usuarioClientes = [nodo]
		}
		LocalStorageService.setData(STORAGE_ITEM.CLIENTES_USUARIO, usuarioClientes)
	}

	return service;
}]);