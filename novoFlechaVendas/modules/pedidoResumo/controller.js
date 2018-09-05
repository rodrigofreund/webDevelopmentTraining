'use strict';
var PedidoResumoModule = angular.module('PedidoResumo')
.controller('PedidoResumoController',
	['$scope', '$rootScope', '$location', '$http', 'PedidoResumoService', 'PedidoService', 'PedidoProdutosService', 'StorageService', 'AuthenticationService', 'NotificationService','ModalService',
	function($scope, $rootScope, $location, $http, PedidoResumoService, PedidoService, PedidoProdutosService, StorageService, AuthenticationService, NotificationService, ModalService) {

	if(!PedidoService.industria) {
		$location.path('/pedido');
	}

	$scope.industria = PedidoService.industria;
	$scope.cliente = PedidoService.cliente;
	$scope.itensPedido = PedidoService.pedido.itensPedido;
	$scope.pedido = PedidoService.pedido;
	if($scope.pedido.observacoesPedidoDto === undefined) {
		$scope.pedido.observacoesPedidoDto = []
	}

	$scope.status = {
		open: false,
	}

	$scope.observacao = {
		msg: undefined
	}

	$scope.valorCaixaSemSt = function(item) {
		if(item.precoFinal) {
			return PedidoProdutosService.calculaPrecoItemSemStListaPedidos(item);
		} else {
			return PedidoProdutosService.calculaPrecoItemSemSt(item);
		}
	}
	
	$scope.valorCaixaComSt = function(item) {
		return PedidoProdutosService.calculaPrecoFinalItem(item);
	}
	
	$scope.valorTotalPedidoComSt = function() {
		return PedidoProdutosService.valorTotalPedidoComSt();
	}
	
	$scope.valorTotalPedidoSemSt = function() {
		return PedidoProdutosService.valorTotalPedidoSemSt();
	}
	
	$scope.valorPrazo = function() {
		if(PedidoService.pedido && PedidoService.pedido.industriaPrazo) {
			return PedidoService.pedido.industriaPrazo.descricao;
		} else {
			return undefined
		}
	}
	
	$scope.valorTabela = function() {
		return PedidoService.tabela;
	}
	
	$scope.valorCarga = function() {
		let result = $.grep(LISTA_CARGA, function(item){ return item.value == PedidoService.pedido.carga; });
		if(result && result.length > 0) {
			return result[0].text
		} else {
			return undefined
		}
	}
	
	$scope.totalItens = function() {
		return PedidoService.getTotalItens()
	}
	
	/*Salva pedido na base com status Salvo*/
	$scope.salvarPedido = function() {
		var modalOptions = {
			closeButtonText: 'Não',
			actionButtonText: 'Sim',
			headerText: 'Confirmar',
			bodyText: `Confirma SALVAR o pedido?`
		};
		ModalService.showModal({}, modalOptions).then(function (result) {
			PedidoService.pedido.statusPedido = STATUS_PEDIDO.SALVO
			PedidoService.pedido.industria = PedidoService.industria
			PedidoService.pedido.cliente = PedidoService.cliente
			PedidoService.pedido.nomeTabela = PedidoService.tabela
			PedidoService.pedido.usuario = AuthenticationService.getUsuario()
			PedidoService.salvaPedidoLocal(PedidoService.pedido)
			PedidoService.removePedido()
			NotificationService.success('Pedido salvo com sucesso!')
			$location.path('/pedido')
		})
	}
	
	/*Salva pedido na base com status Enviado*/
	$scope.enviarPedido = function() {
		var modalOptions = {
			closeButtonText: 'Não',
			actionButtonText: 'Sim',
			headerText: 'Confirmar',
			bodyText: `Confirma ENVIAR o pedido?`
		};

		ModalService.showModal({}, modalOptions).then(function (result) {
			PedidoService.pedido.statusPedido = STATUS_PEDIDO.ENVIADO;
			let idPedidoSalvo = PedidoService.pedido.idPedidoSalvo
			PedidoService.salvaPedido(PedidoService.pedido, function(response){
				NotificationService.success('Pedido enviado com sucesso!');
				PedidoService.pedido = response;
				PedidoService.removePedido();
				if(idPedidoSalvo) {
					PedidoService.pedido.idPedidoSalvo = idPedidoSalvo
					StorageService.removePedidoSalvo(PedidoService.pedido)
				}
				$location.path('/pedido');
			});
		})
	}

	$scope.getItensPedido = function() {
		return PedidoService.pedido.itensPedido;
	}

	$scope.voltar = function() {
		window.history.back();
	}
}]);
