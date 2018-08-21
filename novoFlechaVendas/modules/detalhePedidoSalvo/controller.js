'use strict'

angular.module('DetalhePedidoSalvo').controller('DetalhePedidoSalvoController', [
	'$scope',
	'$rootScope',
	'$location',
	'$http',
	'$route',
	'DetalhePedidoSalvoService',
	'IndustriasService',
	'PedidoService',
	'PedidoProdutosService',
	'MenuService',
	'AuthenticationService',
	'CadastroClientesService',
	'MapperService',
	'StorageService',
	'ModalService',
	'NotificationService',
	constructor
])

function constructor($scope,
	$rootScope,
	$location,
	$http,
	$route,
	service,
	IndustriasService,
	PedidoService,
	PedidoProdutosService,
	MenuService,
	AuthenticationService,
	CadastroClientesService,
	MapperService,
	StorageService,
	ModalService,
	NotificationService) {

	var usuario = $rootScope.globals.currentUser.user;

	$scope.statusPedido = undefined;

	IndustriasService.getIndustriasUsuario(usuario.id, function (response) {
		$scope.industrias = response;
	});

	let filtroPedido = StorageService.getFiltroPedidoAtivo()
	if (filtroPedido) {
		$scope.pedidoSearch = filtroPedido
	} else {
		$scope.pedidoSearch = {
			idIndustria: null,
		};
	}

	if (AuthenticationService.isVendedor()) {
		$scope.vendedor = usuario;
		$scope.pedidoSearch.idUsuario = usuario.id;
	} else {
		CadastroClientesService.buscaVendedores(function (response) {
			$scope.vendedores = response;
		});
	}

	$scope.selecionaIndustria = function () {
		filtraPedidos();
	}

	function filtraPedidos() {
		service.buscaPedidos($scope.pedidoSearch, function (response) {
			if (!response) {
				response = []
			}
			if ($scope.pedidoSearch.idIndustria) {
				let result = $.grep(response,
					function (item) {
						return item.idIndustria == $scope.pedidoSearch.idIndustria
					});
				$scope.pedidos = result
			} else {
				$scope.pedidos = response
			}
		});
	}

	filtraPedidos();

	$scope.exibeDetalhesPedido = function (pedido) {
		service.setPedido(pedido);
		$location.path('/detalhePedidoSalvoItens');
	}

	$scope.editarPedido = function (pedido) {
		PedidoService.pedidoParaEditar = pedido
		$location.path('/pedido');
	}

	$scope.isVendedor = function () {
		return AuthenticationService.isVendedor();
	}

	$scope.isPedidoSalvo = function (pedido) {
		return pedido.statusPedido == STATUS_PEDIDO.SALVO;
	}

	$scope.getValorFinalPedido = function (pedido) {
		PedidoProdutosService.itensPedido = pedido.itensPedido;
		return PedidoProdutosService.valorTotalPedidoComSt();
	}

	$scope.podeEditar = function (pedido) {
		return pedido.statusPedido === STATUS_PEDIDO.NEGADO || pedido.statusPedido === STATUS_PEDIDO.SALVO
	}

	$scope.podeDetalhar = function () {
		return true;
	}

	$scope.enviarPedido = function (pedido) {
		var modalOptions = {
			closeButtonText: 'Não',
			actionButtonText: 'Sim',
			headerText: 'Confirmar',
			bodyText: 'Confirma envio do pedido para o cliente ' + pedido.nomeCliente + ' ?'
		};

		ModalService.showModal({}, modalOptions).then(function (result) {
			pedido.statusPedido = 3
			let idPedidoSalvo = pedido.idPedidoSalvo
			PedidoService.salvaPedido(pedido, function (response) {
				NotificationService.success('Pedido enviado com sucesso!');
				if (idPedidoSalvo) {
					pedido.idPedidoSalvo = idPedidoSalvo
					StorageService.removePedidoSalvo(pedido)
				}
				$route.reload();
			});
		});
	}

	$scope.excluirPedido = function (i) {
		var modalOptions = {
			closeButtonText: 'Não',
			actionButtonText: 'Sim',
			headerText: 'Confirmar',
			bodyText: 'Confirma remoção do pedido para o cliente ' + i.nomeCliente + ' ?'
		};

		ModalService.showModal({}, modalOptions).then(function (result) {
			StorageService.removePedidoSalvo(i);
			NotificationService.success('Pedido removido com sucesso!');
			$route.reload();
		});
	}

	$scope.detalharPedido = function (pedido) {
		service.pedido = pedido
		$location.path('/detalhePedidoSalvoItens');
	}
}
