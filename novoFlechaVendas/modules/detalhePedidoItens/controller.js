'use strict';
var detalhePedidoItensModule = angular.module('DetalhePedidoItens').controller('DetalhePedidoItensController', [
	'$scope',
	'$rootScope',
	'$location',
	'$http',
	'DetalhePedidoService',
	'IndustriasService',
	'PedidoProdutosService',
	'PedidoService',
	'AuthenticationService',
	'CadastroClientesService',
	'ObservacaoService',
	'NotificationService',
	'ModalService',
	constructor,
])
	
function constructor(
		$scope,
		$rootScope,
		$location,
		$http,
		DetalhePedidoService,
		IndustriasService,
		PedidoProdutosService,
		PedidoService,
		AuthenticationService,
		CadastroClientesService,
		ObservacaoService,
		NotificationService,
		ModalService
	){

	// ----------------------SCOPE FUNCTIONS-----------------------------
	init()

	$scope.alteraPrecoColocado = function(itemPedido) {
		var precoColocado = itemPedido.precoColocado; /*novo valor do preco item sem st*/
	}

	$scope.valorCarga = function() {
		let result = $.grep(LISTA_CARGA, function(item){ return item.value == $scope.pedido.carga; });
		return result[0].text;
	}

	$scope.negarPedido = function() {
		var modalOptions = {
			closeButtonText: 'Não',
			actionButtonText: 'Sim',
			headerText: 'Confirmar',
			bodyText: `Confirma NEGAR o pedido ${$scope.pedido.id} ?`
		};

		ModalService.showModal({}, modalOptions).then(function (result) {
			$scope.pedido.statusPedido = STATUS_PEDIDO.NEGADO
			PedidoService.salvaPedido($scope.pedido, (response) => {
				$scope.pedido = response;
				NotificationService.success('Pedido ' + $scope.pedido.id + ' negado com sucesso!')
				$location.path('/detalhePedido');
			})
		});
	}

	$scope.colocarPedido = function() {
		var modalOptions = {
			closeButtonText: 'Não',
			actionButtonText: 'Sim',
			headerText: 'Confirmar',
			bodyText: `Confirma COLOCAR o pedido ${$scope.pedido.id} ?`
		};

		ModalService.showModal({}, modalOptions).then(function (result) {
			$scope.pedido.statusPedido = STATUS_PEDIDO.COLOCADO
			PedidoService.salvaPedido($scope.pedido, (response) => {
				$scope.pedido = response;
				NotificationService.success('Pedido ' + $scope.pedido.id + ' colocado com sucesso!')
				$location.path('/detalhePedido');
			})
		});
	}

	$scope.adicionaObservacao = function() {
		const _idUsuario = AuthenticationService.getUsuario().id
		const _observacao = $scope.observacao.msg
		const _nomeUsuario = AuthenticationService.getUsuario().nome
		const _dataCriacao = new Date().toISOString();
		const _idPedido = $scope.pedido.id
		let msg = {
			idObservacao: undefined,
			idPedido: _idPedido,
			dataCriacao: _dataCriacao,
			dataLeitura: undefined,
			lido: undefined,
			idUsuario: _idUsuario,
			observacao: _observacao,
			nomeUsuario: _nomeUsuario
		}
		if(!$scope.pedido.observacoesPedidoDto) {
			$scope.pedido.observacoesPedidoDto = []
		}
		$scope.pedido.observacoesPedidoDto.push(msg)

		if(_idPedido) {
			let observacaoPedidoUpdateDto = {
				idPedido: _idPedido,
				listaObservacaoPedidoDto: $scope.pedido.observacoesPedidoDto,
			}
			ObservacaoService.atualizaObservacoes(observacaoPedidoUpdateDto, (observacoes) => {
				$scope.pedido.observacoesPedidoDto = observacoes
				NotificationService.success('Mensagem enviada com sucesso!')
			})
		}

		// Limpa campo da tela
		$scope.observacao.msg = undefined
	}

	$scope.isVendedor = function() {
		return AuthenticationService.isVendedor();
	}

	$scope.podeColocarPedido = function() {
		return $scope.pedido.statusPedido === STATUS_PEDIDO.ENVIADO;
	}

	$scope.podeNegarPedido = function() {
		return $scope.pedido.statusPedido === STATUS_PEDIDO.COLOCADO || $scope.pedido.statusPedido === STATUS_PEDIDO.ENVIADO;
	}

	$scope.podeEditarCodigoPedido = function() {
		return AuthenticationService.isAdministrador() || AuthenticationService.isMaster();
	}

	$scope.buscaPrecoSemSt = function(item) {
		return PedidoProdutosService.calculaPrecoItemSemStListaPedidos(item);
	}

	$scope.verificaPedidoAlterado = function(item) {
		return item.desconto > 0
	}

	$scope.voltar = function() {
		window.history.back()
	}

	//----------------------LOCAL FUNCTIONS-----------------------------
	
	function init() {
		$scope.pedido = DetalhePedidoService.getPedido();

		if(!$scope.pedido) {
			$location.path('/detalhePedido')
			return
		}
		$scope.pedido.itensPedido = $scope.pedido.itensPedido.sort((a, b) => {
			return (a.descricao > b.descricao) ? 1 : ((a.descricao < b.descricao ? -1 : 0))
		})

		$scope.totalItensPedido = DetalhePedidoService.getTotalItensPedido()
		$scope.totalPedido = DetalhePedidoService.getTotalPedido()

		CadastroClientesService.getIndustriasCliente($scope.pedido.idCliente, (response) => {
			let clienteIndustria = $.grep(response, function(item) {
				return item.idIndustria == $scope.pedido.industria.id 
			})
			if(clienteIndustria && clienteIndustria.length > 0) {
				$scope.idIndustriaCliente = clienteIndustria[0].codigo;
			}
		})

		$scope.observacao = {
			msg: undefined
		}
	}
}

detalhePedidoItensModule.filter('percentage', ['$filter', ($filter) => {
	return function(input) {
		return $filter('number')(input * 100) + '%';
	};
}])
