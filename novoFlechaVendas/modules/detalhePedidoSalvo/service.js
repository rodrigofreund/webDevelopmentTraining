'use strict';

angular.module('DetalhePedidoSalvo')

.factory('DetalhePedidoSalvoService', [ '$http', '$rootScope', 'StorageService',  function($http, $rootScope, StorageService) {
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
				NotificationService.error('Erro ao buscar dados dos vendedores', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.buscaPedidos = function(pedidoSearch, callback) {
		let pedidos = StorageService.getPedidosSalvo()
		callback(pedidos)
	}

	service.getListaStatusPedido = function(callback) {
		NetworkService.httpPost('/getListaStatusPedido', (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar lista status pedido', data);
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
	return service;
}]);