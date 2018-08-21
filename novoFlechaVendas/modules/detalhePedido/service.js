'use strict';

angular.module('DetalhePedido')

.factory('DetalhePedidoService', [ '$http', '$rootScope', 'PedidoProdutosService', 'NetworkService', 'NotificationService',
	function($http, $rootScope, PedidoProdutosService, NetworkService, NotificationService) {
	var service = {};
	
	service.itens = [];
	
	service.setItens = function(itens) {
		service.itens = itens;
	}

	service.buscaVendedores = function(industria, callback) {
		NetworkService.httpPost('/getVendedoresPorIndustria', industria.id, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar dados dos clientes', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.buscaPedidos = function(pedidoSearch, callback) {
		if(!pedidoSearch.idUsuario && pedidoSearch.isVendedor) {
			NotificationService.error('Não foi possível se comunicar com o servidor.');
			return
		}
		NetworkService.httpPost('/getPedidosPorCriteria', pedidoSearch, function(result, data) {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar pedidos', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.getListaStatusPedido = function(callback) {
		NetworkService.httpGet('/getListaStatusPedido', (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar pedidos', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}
	
	service.setPedido = function(pedido) {
		service.pedido = pedido;
	}
	
	service.getPedido = function() {
		return service.pedido;
	}
	
	service.pushVendedor = function(vendedor) {
		service.vendedor = vendedor;
	}
	
	service.popVendedor = function(callback) {
		var aux = service.vendedor;
		service.vendedor = undefined;
		callback(aux);
	}
	
	service.getTotalItensPedido = function() {
		let total = 0
		if(service.pedido.itensPedido) {
			for(var i = 0; i < service.pedido.itensPedido.length; i++) {
				total += service.pedido.itensPedido[i].quantidadeSolicitada
			}
		}
		return total
	}
	
	service.getTotalPedido = function() {
		let total = 0
		if(service.pedido.itensPedido) {
			for(var i = 0; i < service.pedido.itensPedido.length; i++) {
				let pedido = service.pedido.itensPedido[i]
				total += PedidoProdutosService.calculaPrecoItemSemStListaPedidos(pedido) * pedido.quantidadeSolicitada
			}
		}
		return total
	}

	service.getTotalPedidoSemSt = function(pedido) {
		let total = 0
		if(pedido.itensPedido) {
			for(var i = 0; i < pedido.itensPedido.length; i++) {
				let item = pedido.itensPedido[i]
				total += PedidoProdutosService.calculaPrecoItemSemStListaPedidos(item) * item.quantidadeSolicitada
			}
		}
		return total
	}

	return service;
}]);