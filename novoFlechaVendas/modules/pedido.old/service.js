'use strict';

angular.module('Pedido')

.factory('PedidoService', [ '$http', '$rootScope', 'StorageService', 'NetworkService', 'NotificationService', 'AuthenticationService', 
	function($http, $rootScope, StorageService, NetworkService, NotificationService, AuthenticationService) {
	var service = {};
	service.idPedido = null;
	service.idTabela = null;
	service.industria = null;
	service.cliente = null;
	service.prazo = null;
	service.tabela = null;
	service.carga = null;
	service.pedido = null;
	service.trocaTabela = null;
	
	service.carregaClientes = function(login, callback) {
		NetworkService.httpPost('/getClientesByLogin/', login, function (result, data) {
			if (result == CALLRESULT.OK) {
				service.idPedido = response.id;
				service.pedido = response;
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao salvar pedido', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.carregaClientesPorRepresentacao = function (idIndustria, idUsuario, callback) {
		NetworkService.httpPost('/getClientesPorRepresentacao/', {idIndustria: idIndustria, idUsuario: idUsuario}, function (result, data) {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar clientes', data);
			} else {
				callback(StorageService.getClientesUsuario(idUsuario, idIndustria))
			}
		})
	}
	
	/*Salva um pedido na máquina local*/
	service.criaPedido = function(pedido, callback) {
		var dataFinal = new Date()
		dataFinal.setDate(dataFinal.getDate() + 30)
		StorageService.setPedidoAtivo(pedido)
		let pedidoSalvo = StorageService.getPedidoAtivo()
		callback(pedidoSalvo)
	}
	
	/*Envia um pedido para armazenamento local criado na máquina local*/
	service.salvaPedidoLocal = function(pedido) {
		let date = new Date()
		pedido.dataPedido = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0).toLocaleDateString("pt-BR")
		StorageService.addPedidosSalvo(pedido)
	}
	
	/*Envia um pedido para a base criado na máquina local*/
	service.salvaPedido = function(pedido, callback) {
		pedido.usuarioAlteracao = AuthenticationService.getUsuario()
		NetworkService.httpPost('/salvaPedido/', pedido, function (result, data) {
			if (result == CALLRESULT.OK) {
				service.idPedido = result.id;
				service.pedido = result;
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao salvar pedido', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}
	
	service.getPedidoAtivo = function(usuario) {
		let pedido = StorageService.getPedidoAtivo();
		return pedido;
	}
	
	/*Remove pedido da máquina local*/
	service.removePedido = function(callback) {
		StorageService.resetPedidoAtivo();
		service.emEdicao = undefined;
		service.pedidoParaEditar = undefined;
	}

	service.getPedido = function (idPedido, callback) {
		NetworkService.httpPost('/getPedido', idPedido, function (result, data) {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error(`Erro ao buscar pedido ${idPedido}`);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}
	
	service.getNumeroPedidosEnviados = function(callback) {
		NetworkService.httpGet('/getNumeroPedidosEnviados', function (result, data) {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar pedidos enviados');
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}
	
	service.getNumeroPedidosNegados = function(idUsuario, callback) {
		NetworkService.httpGet(`/getNumeroPedidosNegados/?idUsuario=${idUsuario}`, function (result, data) {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar pedidos negados');
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}
	
	service.setIdPedido = function(id) {
		service.idPedido = id;
	};
	
	service.setIdTabela = function(id) {
		service.idTabela = id;
	};
	
	service.setIndustria = function(obj) {
		service.industria = obj;
	}
	
	service.setCliente = function(obj) {
		service.cliente = obj;
	}
	
	service.getTotalItens = function() {
		let total = 0
		if(service.pedido.itensPedido) {
			for(var i = 0; i < service.pedido.itensPedido.length; i++) {
				total += service.pedido.itensPedido[i].quantidadeSolicitada
			}
		}
		return total
	}
	
	return service;
}]);