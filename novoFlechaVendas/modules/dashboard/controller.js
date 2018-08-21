'use strict'

angular.module('Menu')
.controller('MenuController', ['$scope', '$rootScope', '$location', '$http','MenuService', 'AuthenticationService', 'PedidoService', 'StorageService', 'ClientesCadastradosService', 'NetworkService', 
                               function($scope, $rootScope, $location, $http, MenuService, AuthenticationService, PedidoService, StorageService, ClientesCadastradosService, NetworkService) {
	var idUsuario = $rootScope.globals.currentUser.id;
	
	$scope.exibirPedidosEnviados = AuthenticationService.isMaster()
	$scope.exibirPedidosNegados = AuthenticationService.isVendedor()
	$scope.exibirClientesPendentes = AuthenticationService.isMaster()
	$scope.isMobile = NetworkService.isMobile()
	
	PedidoService.getNumeroPedidosEnviados(function(result) {
		$scope.getNumeroPedidosEnviados = result;
	})
	
	PedidoService.getNumeroPedidosNegados(AuthenticationService.getUsuario().id, function(result) {
		$scope.getNumeroPedidosNegados = result;
	})
	
	$scope.getNumeroPedidosSalvos = function() {
		if(StorageService.getPedidosSalvo()) {
			return StorageService.getPedidosSalvo().length
		}
		return undefined
	}
	
	ClientesCadastradosService.getNumeroClientesPendentes(function(result) {
		$scope.getNumeroClientesPendentes = result
	})
	
	$scope.nomeUsuario = $rootScope.globals.currentUser.user.nome;
	
	$scope.novoPedido = function() {
		MenuService.setModoCadastro();
		$location.path('/industrias');
	}
	
	$scope.exibeClientesPendentes = function() {
		const search = {
			razaoSocial: "",
			nomeFantasia: "",
			cpfCnpj: "",
			newPage: 1,
			pageSize: 10,
			idUsuario: AuthenticationService.getUsuario().id,
			vendedorFiltro: undefined,
			pendenteRegistro: true,
		};
		StorageService.setFiltroAtivo(search)
		$location.path('/listaClientes');
	}
	
	$scope.isPermissaoAdministrador = function() {
		return AuthenticationService.isAdministrador();
	}
	
	$scope.isPermissaoMaster = function() {
		return AuthenticationService.isMaster();
	}
	
	$scope.isPermissaoVendedor = function() {
		return AuthenticationService.isVendedor();
	}
	
	$scope.exibirDetalhePedido = function() {
		MenuService.setModoDetalhe();
		$location.path('/industrias');
	}
	
	$scope.exibirCadastroTabela = function() {
		MenuService.modoTabela();
		$location.path('/industrias');
	}
	
	$scope.novoCadastroCliente = function() {
		$location.path('/cadastroCompletoCliente');
	}
	
	$scope.moduloExterno = function() {
		MenuService.modo = 2;
	}
	
	$scope.moduloInterno = function() {
		MenuService.modo = 1;
	}
	
	$scope.exibePedidosEnviados = function() {
		let pedidoSearch = {
				idIndustria : null,
				idUsuario : null,
				idStatus : STATUS_PEDIDO.ENVIADO,
				newPage: PAGINACAO.PEDIDO.NEW_PAGE,
				pageSize: PAGINACAO.PEDIDO.PAGE_SIZE
			};
		StorageService.setFiltroPedidoAtivo(pedidoSearch)
		$location.path('/detalhePedido');
	}
	
	$scope.exibePedidosNegados = function() {
		let pedidoSearch = {
				idIndustria : null,
				idUsuario : null,
				idStatus : STATUS_PEDIDO.NEGADO,
				newPage: PAGINACAO.PEDIDO.NEW_PAGE,
				pageSize: PAGINACAO.PEDIDO.PAGE_SIZE
			};
		StorageService.setFiltroPedidoAtivo(pedidoSearch)
		$location.path('/detalhePedido');
	}
	
	$scope.exibePedidosAtivo = function() {
		$location.path('/pedido');
	}
	
	$scope.exibePedidosSalvos = function() {
		$location.path('/detalhePedidoSalvo');
	}
	
	$scope.exibirPedidosSalvos = function() {
		let pedidosSalvos = StorageService.getPedidosSalvo()
		return pedidosSalvos !== null
	}
	
	$scope.pedidoAtivo = PedidoService.getPedidoAtivo();
}]);
