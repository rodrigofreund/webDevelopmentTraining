'use strict'

var detalhePedidoSalvoItensModule = angular.module('DetalhePedidoSalvoItens')
.controller('DetalhePedidoSalvoItensController', ['$scope', '$rootScope', '$location', '$http', 'DetalhePedidoSalvoService', 'IndustriasService', 'PedidoProdutosService', 'PedidoService', 'AuthenticationService', 'ModalService', 'StorageService', 'NotificationService', function($scope, $rootScope, $location, $http, DetalhePedidoSalvoService, IndustriasService, PedidoProdutosService, PedidoService, AuthenticationService, ModalService, StorageService, NotificationService) {

	$scope.pedido = DetalhePedidoSalvoService.getPedido()

	$scope.observacao = {
		msg: undefined
	}
	
	if(!$scope.pedido) {
		$location.path('/detalhePedidoSalvo');
	}

	$scope.valorCarga = function(pedido) {
		let result = $.grep(LISTA_CARGA, function(item){ return item.value == pedido.carga; });
		return result[0].text;
	}
	
	$scope.pedido.itensPedido = $scope.pedido.itensPedido.sort(function(a, b) {
		return (a.descricao > b.descricao) ? 1 : ((a.descricao < b.descricao) ? -1 : 0)
	})
	
	$scope.alteraPrecoColocado = function(itemPedido) {
		var precoColocado = itemPedido.precoColocado; /*novo valor do preco item sem st*/
	}
	
	$scope.enviarPedido = function() {
		let pedido = $scope.pedido
        var modalOptions = {
                closeButtonText: 'Não',
                actionButtonText: 'Sim',
                headerText: 'Confirmar',
                bodyText: 'Confirma envio do pedido para o cliente ' + pedido.nomeCliente + ' ?'
            };

        ModalService.showModal({}, modalOptions).then(function (result) {
    		pedido.statusPedido = STATUS_PEDIDO.ENVIADO
    		let idPedidoSalvo = pedido.idPedidoSalvo
    		PedidoService.salvaPedido(pedido, function(response){
    			NotificationService.success('Pedido enviado com sucesso!');
    			if(idPedidoSalvo) {
    				pedido.idPedidoSalvo = idPedidoSalvo
    				StorageService.removePedidoSalvo(pedido)
    			}
    			$location.path('/detalhePedidoSalvo');
    		});
        });		
	}

	$scope.adicionaObservacao = () => {
		const _idUsuario = AuthenticationService.getUsuario().id
		const _observacao = $scope.observacao.msg
		const _nomeUsuario = AuthenticationService.getUsuario().nome
		const _dataCriacao = new Date().toISOString();
		let msg = {
			idObservacao: undefined,
			dataCriacao: _dataCriacao,
			dataLeitura: undefined,
			lido: undefined,
			idUsuario: _idUsuario,
			observacao: _observacao,
			nomeUsuario: _nomeUsuario
		}
		$scope.pedido.observacoesPedidoDto.push(msg)

		PedidoService.salvaPedidoLocal($scope.pedido)

		// Limpa campo da tela
		$scope.observacao.msg = undefined
	}
	
	$scope.excluirPedido = function() {
		let i  = $scope.pedido
        var modalOptions = {
                closeButtonText: 'Não',
                actionButtonText: 'Sim',
                headerText: 'Confirmar',
                bodyText: 'Confirma remoção do pedido para o cliente ' + i.nomeCliente + ' ?'
            };

        ModalService.showModal({}, modalOptions).then(function (result) {
        	StorageService.removePedidoSalvo(i);
        	NotificationService.success('Pedido removido com sucesso!');
        	$location.path('/detalhePedidoSalvo');
        });		
	}
	
	$scope.isVendedor = function() {
		return AuthenticationService.isVendedor();
	}
	
	$scope.podeColocarPedido = function() {
		return $scope.pedido.statusPedido === STATUS_PEDIDO.ENVIADO;
	}
	
	$scope.podeNegarPedido = function() {
		return $scope.pedido.statusPedido === STATUS_PEDIDO.COLOCADO || $scope.pedido.status === STATUS_PEDIDO.ENVIADO;
	}
	
	$scope.podeEditarCodigoPedido = function() {
		return AuthenticationService.isAdministrador() || AuthenticationService.isMaster();
	}
	
	$scope.buscaPrecoSemSt = function(item) {
		return PedidoProdutosService.calculaPrecoItemSemStListaPedidos(item);
	}
	
	$scope.verificaPedidoAlterado = function(item) {
		return item.desconto > 0;
	}
	
	$scope.voltar = function() {
		window.history.back();
	}
}]);

detalhePedidoSalvoItensModule.filter('percentage', ['$filter', function($filter){
	return function(input) {
		return $filter('number')(input * 100) + '%';
	};
}]);
