'use strict';

angular.module('PedidoProdutos')

.factory('PedidoProdutosService', [ '$http', '$rootScope', 'NetworkService', 'NotificationService', function($http, $rootScope, NetworkService, NotificationService) {
	var service = {};
	service.pedidoAndamento = false;
	service.itensPedido = null;

	service.carregaClientes = function(login, callback) {
		NetworkService.httpPost('/getClientesByLogin', login, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao carregar clientes', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.criaNovoPedido = function(pedido, callback) {
		NetworkService.httpPost('/cadastraNovoPedido', pedido, (result, data) => {
			if (result == CALLRESULT.OK) {
				service.pedidoAndamento = true;
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao salvar itens pedido', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.carregaItensTabela = function(idTabela, callback) {
		NetworkService.httpPost('/getItensPorIdTabela', idTabela, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao salvar itens pedido', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.salvarItensPedido = function(_idPedido, _itens, callback) {
		const dto = {
			idPedido : _idPedido,
			itens : _itens
		}
		NetworkService.httpPost('/salvarItensPedido', dto, (result, data) => {
			if (result == CALLRESULT.OK) {
				service.itensPedido = _itens;
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao salvar itens pedido', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.atualizarStatusPedido = function(_idPedido, _status, callback) {
		const dto = {
			idPedido : _idPedido,
			statusPedido : _status
		}
		NetworkService.httpPost('/atualizarStatusPedido', dto, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar dados dos clientes', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.getUltimasVendasItem = function(_idCliente, _idUsuario, _codigoItem, callback) {
		const ultimasVendasItemSearchDto = {
			idCliente : _idCliente,
			idUsuario : _idUsuario,
			codigoItem: _codigoItem,
		}
		NetworkService.httpPost('/getUltimasVendasItem', ultimasVendasItemSearchDto, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar dados dos clientes', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}
	
	/* Calcula o preço Caixa com ST */
	service.calculaPrecoFinalItem = function(item) {
		var valorComST = item.preco + (item.preco * item.st);
		var valorComSTeIPI = valorComST + (item.preco * item.ipi);
		return parseFloat(valorComSTeIPI.toFixed(2));
	}
	
	/* Calcula o valor do desconto */
	service.calculaDescontoItem = function(item) {
		var precoFinalOriginal = service.calculaPrecoFinalItem(item);
		var diferenca = precoFinalOriginal - item.precoFinal;
		var desconto = diferenca / precoFinalOriginal;
		return desconto;
	}
	
	/*Calcula preco final sem st (a partir do preco final atual) */
	service.calculaPrecoItemSemSt = function(item) {
		return item.preco - (item.preco * item.desconto)
	}
	
	/*Calcula preco final sem st (a partir do preco final atual) */
	service.calculaPrecoItemSemStListaPedidos = function(item) {
		var impostos = item.st + item.ipi;
		return item.precoFinal / (impostos + 1);
	}
	
	/*Calcula o preco final do item com desconto*/
	service.calculaPrecoFinalItemComDesconto = function(item) {
		var precoFinal = 0.0;
		if(item.desconto === "0") {
			precoFinal = service.calculaPrecoFinalItem(item);
		} else {
			var precoFinalOriginal = service.calculaPrecoFinalItem(item);
			var valorDesconto = precoFinalOriginal * item.desconto;
			precoFinal = precoFinalOriginal - valorDesconto;
		}
		return parseFloat(Math.round(precoFinal * 100) / 100);
	}
	
	/*Calcula valor total do pedido com ST*/
	service.valorTotalPedidoComSt = function() {
		var total = 0;
		for(var index in service.itensPedido) {
			var item = service.itensPedido[index]; 
			total += service.calculaPrecoFinalItemComDesconto(item) * item.quantidadeSolicitada;
		}
		return total;
	}
	
	/*Calcula valor total do pedido sem ST*/
	service.valorTotalPedidoSemSt = function() {
		var total = 0;
		for(var index in service.itensPedido) {
			var item = service.itensPedido[index];
			if(item.precoFinal) {
				total += service.calculaPrecoItemSemStListaPedidos (item) * item.quantidadeSolicitada;
			} else {
				total += service.calculaPrecoItemSemSt(item) * item.quantidadeSolicitada;
			}
		}
		return total;
	}
	
	service.calculaPrecoUnitarioComSt = function(item) {
		var preco = item.precoFinal / item.quantidade;
		return parseFloat(Math.round(preco * 100) / 100);
	}
	
	service.calculaPrecoUnitarioSemSt = function(item) {
		var precoFinalItemSemSt = service.calculaPrecoItemSemSt(item);
		var preco = precoFinalItemSemSt / item.quantidade; 
		return parseFloat(Math.round(preco * 100) / 100);
	}
	
	service.calculaPrecoFinalComBasePrecoItem = function(item, precoUnitarioComSt) {
		var preco = precoUnitarioComSt * item.quantidade;
		return parseFloat(Math.round(preco * 100) / 100);
	}
	
	return service;
}]);