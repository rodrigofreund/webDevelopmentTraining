'use strict'
angular.module('DetalhePedido').controller('DetalhePedidoController', [
	'$scope',
	'$rootScope',
	'$location',
	'$http',
	'$route',
	'DetalhePedidoService',
	'IndustriasService',
	'PedidoService',
	'PedidoProdutosService',
	'MenuService',
	'AuthenticationService',
	'CadastroClientesService',
	'MapperService',
	'StorageService',
	'ModalService',
	'ClientesCadastradosService',
	'ObservacaoService',
	'NotificationService',
	constructor,
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
	ClientesCadastradosService,
	ObservacaoService,
	NotificationService) {


	var usuario = $rootScope.globals.currentUser.user;

	$scope.cliente = {
		selecionado: undefined
	}

	let _resultadoBusca = undefined
	$scope.paginaAtual = 0
	$scope.totalPaginas = 0

	$scope.canEditPedido = false;
	$scope.pedidoSelecionado = undefined;

	$scope.exibeOpcionais = innerWidth > 700 ? true : false;

	IndustriasService.getIndustriasUsuario(usuario.id, function (response) {
		$scope.industrias = response;
	})

	$scope.buscaClientes = function(value) {
		var searchObj = {
			idUsuario : usuario.id,
			razaoSocial: value,
			newPage: 1,
			pageSize: 6
		}
		return ClientesCadastradosService.getClientes(searchObj).then(function(response) {
			return response.data.content
		});
	}
	
	$scope.selectCliente = function(item) {
		$scope.pedidoSearch.idCliente = item.id
		buscaPedidos()
	}

	let filtroPedido = StorageService.getFiltroPedidoAtivo()
	if (filtroPedido) {
		$scope.pedidoSearch = filtroPedido
	} else {
		$scope.pedidoSearch = {
			idIndustria: null,
			idUsuario: null,
			idStatus: null,
			dtInicio: null,
			dtFim: null,
			idCliente: null,
			newPage: PAGINACAO.PEDIDO.NEW_PAGE,
			pageSize: PAGINACAO.PEDIDO.PAGE_SIZE
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

	$scope.statusPedido = undefined;
	service.getListaStatusPedido((response) => {
		$scope.listaStatusPedido = response;
		if ($scope.pedidoSearch.idStatus) {
			$scope.listaStatusPedido.forEach(function (item, index) {
				if (item.id === $scope.pedidoSearch.idStatus) {
					$scope.statusPedido = item
				}
			});
		}
	});

	var paginationOptions = {
		pageNumber: PAGINACAO.PEDIDO.NEW_PAGE,
		pageSize: PAGINACAO.PEDIDO.PAGE_SIZE,
		sort: null
	};

	/* FILTROS DE PESQUISA */
	$scope.selecionaIndustria = function () {
		buscaPedidos()
	}

	$scope.selecionaVendedor = function () {
		buscaPedidos()
	}

	$scope.selecionaData = function () {
		buscaPedidos();
	}

	$scope.limpaFiltro = function () {
		$scope.pedidoSearch = {
			idIndustria: null,
			idUsuario: $scope.isVendedor() ? usuario.id : null,
			idStatus: null,
			dtInicio: null,
			dtFim: null,
			idCliente: null,
			newPage: PAGINACAO.PEDIDO.NEW_PAGE,
			pageSize: PAGINACAO.PEDIDO.PAGE_SIZE
		};
		$scope.statusPedido = undefined
		$scope.cliente.selecionado = undefined
		buscaPedidos()
		StorageService.resetFiltroPedidoAtivo()
	}

	/* ----------------------------------------------------*/

	$scope.selecionaStatus = function () {
		if ($scope.statusPedido) {
			$scope.pedidoSearch.idStatus = $scope.statusPedido.id
		} else {
			$scope.pedidoSearch.idStatus = null
		}
		if (StorageService.getFiltroPedidoAtivo()) {
			StorageService.resetFiltroPedidoAtivo()
		}
		buscaPedidos();
	}

	$scope.selecionaIdPedido = function () {
		buscaPedidos()
	}

	$scope.isVendedor = function () {
		return AuthenticationService.isVendedor();
	}

	function buscaPedidos() {
		StorageService.setFiltroPedidoAtivo($scope.pedidoSearch)
		$scope.pedidoSearch.isVendedor = $scope.isVendedor()
		service.buscaPedidos($scope.pedidoSearch, (response) => {
			_resultadoBusca = response
			$scope.totalPaginas = response.totalPages
			$scope.paginaAtual = response.number + 1
			$scope.pedidos = response.content
		});
	}

	buscaPedidos();

	$scope.getStatus = function (i) {
		switch (i) {
			case 0:
				return "Indefinido";
			case 1:
				return "Criado";
			case 2:
				return "Salvo";
			case 3:
				return "Enviado";
			case 4:
				return "Negado";
			case 5:
				return "Colocado";
			case 6:
				return "Cancelado";
		}
	}

	$scope.formatDate = function (date) {
		return new Date(date).toLocaleDateString("pt-BR")
	}

	/* DETALHAR PEDIDO */
	$scope.exibeDetalhesPedido = function (idPedido) {
		if (!idPedido) {
			return
		}
		PedidoService.getPedido(idPedido, (result) => {
			let pedidoCompleto = result
			service.setPedido(pedidoCompleto);
			$location.path('/detalhePedidoItens')
		})
	}

	/* EDITAR PEDIDO */
	$scope.editarPedido = function (idPedido) {
		if (!idPedido) {
			return
		}
		StorageService.setFiltroPedidoAtivo($scope.pedidoSearch)
		PedidoService.getPedido(idPedido, (result) => {
			PedidoService.pedidoParaEditar = result;
			$location.path('/pedido');
		})
	}

	/* CANCELAR PEDIDO */
	$scope.cancelarPedido = function (listagemPedidoDto) {
		var modalOptions = {
			closeButtonText: 'Não',
			actionButtonText: 'Sim',
			headerText: 'Confirmar',
			bodyText: 'Confirma CANCELAMENTO do pedido para o cliente ' + listagemPedidoDto.nomeCliente + ' ?'
		};
		ModalService.showModal({}, modalOptions).then(function (result) {
			PedidoService.getPedido(listagemPedidoDto.idPedido, (pedidoDto) => {
				pedidoDto.statusPedido = STATUS_PEDIDO.CANCELADO
				PedidoService.salvaPedido(pedidoDto, function () {
					NotificationService.success("Pedido cancelado com sucesso!")
					$route.reload()
				}), function () {
					NotificationService.error("Erro ao cancelar pedido!")
					$route.reload()
				}
			})
		});
	}

	$scope.podeEditar = function (listagemPedidoDto) {
		if (!listagemPedidoDto) {
			return
		}
		return listagemPedidoDto.status === STATUS_PEDIDO.NEGADO && listagemPedidoDto.idVendedor === usuario.id;
	}

	$scope.mudaPagina = (pagina) => {
		$scope.pedidoSearch.newPage = pagina;
		buscaPedidos();
	}

	$scope.proximaPagina = () => {
		if (_resultadoBusca.last == true) {
			return
		}
		$scope.pedidoSearch.newPage += 1;
		buscaPedidos();
	}

	$scope.anteriorPagina = () => {
		if (_resultadoBusca.first == true) {
			return
		}
		$scope.pedidoSearch.newPage -= 1;
		buscaPedidos();
	}

	$scope.getTotalPedidoSemSt = (pedido) => {
		return service.getTotalPedidoSemSt(pedido)
	}
}
