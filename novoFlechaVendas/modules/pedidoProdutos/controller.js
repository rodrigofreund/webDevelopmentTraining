'use strict'

var PedidoProdutosModule = angular.module('PedidoProdutos').controller('PedidoProdutosController', [
	'$scope',
	'$rootScope',
	'$location',
	'$http',
	'IndustriasService',
	'PedidoService',
	'PedidoProdutosService',
	'ModalService',
	'NotificationService',
	constructor,
]);

function constructor($scope, 
		$rootScope, 
		$location, 
		$http, 
		IndustriasService, 
		PedidoService, 
		PedidoProdutosService,
		ModalService,
		NotificationService){

	init()


	// ----------------------SCOPE FUNCTIONS-----------------------------

	$scope.atualizaProduto = function(item) {
		if(item) {
			item.precoFinal = PedidoProdutosService.calculaPrecoFinalItemComDesconto(item);
		}
	}

	/* Adiciona produto selecionado a lista de produtos selecionados */
	$scope.adicionaProduto = function() {
		if($scope.produto.selecionado != null) {
			PedidoService.pedido.itensPedido.push($scope.produto.selecionado);
			var index = $scope.produtosDisponiveis.indexOf($scope.produto.selecionado);
			if(index > -1) {
				$scope.produtosDisponiveis.splice(index, 1);
			}
			inicializaProdutoSelecionado();
			if($scope.editandoItem) {
				$scope.editandoItem = false
			}
		}
	}
	
	/* Configura preço e desconto ao selecionar outro produto da lista */
	$scope.selecionaProduto = function() {
		if($scope.produto.selecionado) {
			$scope.produto.selecionado.precoFinal = PedidoProdutosService.calculaPrecoFinalItem($scope.produto.selecionado);
			$scope.produto.selecionado.desconto = 0;
			$scope.produto.selecionado.quantidadeSolicitada = 1;
			$scope.precoFinalItemSemSt = PedidoProdutosService.calculaPrecoItemSemSt($scope.produto.selecionado);
			$scope.precoUnitarioItemComSt = PedidoProdutosService.calculaPrecoUnitarioComSt($scope.produto.selecionado);
			$scope.precoUnitarioItemSemSt = PedidoProdutosService.calculaPrecoUnitarioSemSt($scope.produto.selecionado);
		}
	}
	
	/* Configura preço ao selecionar outro produto da lista */
	$scope.selecionaProdutoComDesconto = function() {
		if($scope.produto.selecionado) {
			$scope.produto.selecionado.precoFinal = PedidoProdutosService.calculaPrecoFinalItem($scope.produto.selecionado)
			/* $scope.produto.selecionado.quantidadeSolicitada = 1; */
			$scope.precoFinalItemSemSt = PedidoProdutosService.calculaPrecoItemSemSt($scope.produto.selecionado)
			$scope.precoUnitarioItemComSt = PedidoProdutosService.calculaPrecoUnitarioComSt($scope.produto.selecionado)
			$scope.precoUnitarioItemSemSt = PedidoProdutosService.calculaPrecoUnitarioSemSt($scope.produto.selecionado)
			$scope.alteraDescontoItem()
		}
	}
	
	/* Recalcula desconto ao alterar o valor do produto */
	$scope.alteraPrecoFinalItem = function() {
		$scope.produto.selecionado.desconto = PedidoProdutosService.calculaDescontoItem($scope.produto.selecionado);
		$scope.precoFinalItemSemSt = PedidoProdutosService.calculaPrecoItemSemSt($scope.produto.selecionado);
		$scope.precoUnitarioItemComSt = PedidoProdutosService.calculaPrecoUnitarioComSt($scope.produto.selecionado);
		$scope.precoUnitarioItemSemSt = PedidoProdutosService.calculaPrecoUnitarioSemSt($scope.produto.selecionado);
	}
	
	/* Recalcula preco do produto ao alterar o valor do desconto */
	$scope.alteraDescontoItem = function() {
		$scope.produto.selecionado.precoFinal = PedidoProdutosService.calculaPrecoFinalItemComDesconto($scope.produto.selecionado);
		$scope.precoFinalItemSemSt = PedidoProdutosService.calculaPrecoItemSemSt($scope.produto.selecionado);
		$scope.precoUnitarioItemComSt = PedidoProdutosService.calculaPrecoUnitarioComSt($scope.produto.selecionado);
		$scope.precoUnitarioItemSemSt = PedidoProdutosService.calculaPrecoUnitarioSemSt($scope.produto.selecionado);
	}
	
		/* Recalcula preco final ao alterar o preco de cada item */
	$scope.atualizaPrecoUnitario = function() {
		$scope.produto.selecionado.precoFinal = PedidoProdutosService.calculaPrecoFinalComBasePrecoItem($scope.produto.selecionado, $scope.precoUnitarioItemComSt);
		$scope.produto.selecionado.desconto = PedidoProdutosService.calculaDescontoItem($scope.produto.selecionado);
		$scope.precoFinalItemSemSt = PedidoProdutosService.calculaPrecoItemSemSt($scope.produto.selecionado);
		$scope.precoUnitarioItemComSt = PedidoProdutosService.calculaPrecoUnitarioComSt($scope.produto.selecionado);
		$scope.precoUnitarioItemSemSt = PedidoProdutosService.calculaPrecoUnitarioSemSt($scope.produto.selecionado);
	}

	/* Edita Produto */
	$scope.editarProduto = function(item) {
		var index = PedidoService.pedido.itensPedido.indexOf(item);
		if(index > -1) {
			PedidoService.pedido.itensPedido.splice(index, 1);
			$scope.produtosDisponiveis.push(item);
			$scope.produto.selecionado = item;
			$scope.selecionaProdutoComDesconto();
			$scope.produto.selecionado.precoColocado = item.precoColocado;
			$scope.produto.selecionado.quantidadeSolicitada = item.quantidadeSolicitada;
			$scope.editandoItem = true
		}
	}
	
	/*Remove item da lista de adicionados*/
	$scope.removeProduto = function(item) {
		var index = PedidoService.pedido.itensPedido.indexOf(item);
		if(index > -1) {
			PedidoService.pedido.itensPedido.splice(index, 1)
			//Adicionar item na sua posição original
			$scope.produtosDisponiveis.push(item)
			$scope.produtosDisponiveis = $scope.produtosDisponiveis.sort(function(a,b) {
				return (a.descricao > b.descricao) ? 1 : ((a.descricao < b.descricao) ? -1 : 0)
			})

			if(PedidoService.pedido.statusPedido == STATUS_PEDIDO.CRIADO) {
				PedidoService.salvaPedido(PedidoService.pedido, function(response){
					if(response) {
						PedidoService.pedido = response;
					}
				});
			}
		}
	}

	/*Calcula o preco final do pedido*/
	$scope.calculaTotalPedido = function() {
		var total = 0;
		PedidoService.pedido.itensPedido.forEach(function(item, index, array) {
			total = total + (item.precoFinal * item.quantidadeSolicitada);
		});
		return total;
	}
	
	/*Finaliza o pedido*/
	$scope.finalizarPedido = function() {
		if(!PedidoService.emEdicao) {
			PedidoService.criaPedido(PedidoService.pedido, function(response){
				if(response) {
					PedidoService.pedido = response;
					PedidoProdutosService.itensPedido = PedidoService.pedido.itensPedido;
					$location.path('/pedidoResumo');
				}
			});
		} else {
			PedidoProdutosService.itensPedido = PedidoService.pedido.itensPedido;
			$location.path('/pedidoResumo');
		}
	}

	$scope.verificaPropostaPedido = function() {
		return PedidoService.pedido.proposta == false;
	}

	$scope.getItensSelecionados = function() {
		return PedidoService.pedido.itensPedido;
	}

	$scope.usarPrecoColocado = function() {
		$scope.precoInicial = $scope.produto.selecionado.precoFinal;
		$scope.produto.selecionado.preco = $scope.produto.selecionado.precoColocado;
		
		$scope.produto.selecionado.precoFinal = PedidoProdutosService.calculaPrecoFinalItem($scope.produto.selecionado);
		$scope.produto.selecionado.desconto = 0;
		$scope.produto.selecionado.quantidadeSolicitada = 1;
		$scope.precoFinalItemSemSt = PedidoProdutosService.calculaPrecoItemSemSt($scope.produto.selecionado);
		$scope.precoUnitarioItemComSt = PedidoProdutosService.calculaPrecoUnitarioComSt($scope.produto.selecionado);
		$scope.precoUnitarioItemSemSt = PedidoProdutosService.calculaPrecoUnitarioSemSt($scope.produto.selecionado);
	}

	$scope.voltar = function() {
		if(!PedidoService.emEdicao) {
			PedidoService.criaPedido(PedidoService.pedido, function(response){
				if(response) {
					PedidoService.pedido = response;
					PedidoProdutosService.itensPedido = PedidoService.pedido.itensPedido;
				}
			});
		} else {
			PedidoProdutosService.itensPedido = PedidoService.pedido.itensPedido;
		}
		window.history.back();
	}

	$scope.exibeModalUltimoPedidosItem = () => {
		PedidoProdutosService.getUltimasVendasItem($scope.cliente.id, PedidoService.pedido.idUsuario, $scope.produto.selecionado.codigo, (response) => {
			var modalOptions = {
				closeButtonText: 'Cancelar',
				actionButtonText: 'Selecionar',
				headerText: `Histórico - ${$scope.produto.selecionado.descricao}`,
				bodyDataList: response
			};
			var modalDefaults = {
				backdrop: true,
				keyboard: true,
				modalFade: true,
				templateUrl: 'modules/partials/modalUltimosPedidosItem.html',
		};
	
			ModalService.showModal(modalDefaults, modalOptions).then(function (result) {
				if(!result) {
					return
				}
				var itemSelecionado = JSON.parse(result)
				if(itemSelecionado && itemSelecionado.hasOwnProperty("quantidade") && itemSelecionado.hasOwnProperty("preco")) {
					$scope.produto.selecionado.quantidadeSolicitada = itemSelecionado.quantidade
					$scope.produto.selecionado.precoFinal = itemSelecionado.preco
					$scope.alteraPrecoFinalItem()
				} else {
					NotificationService.error("Erro ao buscar informações do item. Contate o administrador")
				}
			}, function (result) {
				return
			});
		})
	}

	//----------------------LOCAL FUNCTIONS-----------------------------

	function init() {

		if(PedidoService.industria == null) {
			$location.path('/pedido');
		}
		$scope.industria = PedidoService.industria;
		$scope.cliente = PedidoService.cliente;
		$scope.idTabela = PedidoService.pedido.idTabela;
		$scope.produtosDisponiveis = null;
		$scope.totalPedido = 0;
		inicializaProdutoSelecionado();
	
		if(PedidoService.trocaTabela) {
			PedidoService.trocaTabela = null;
			PedidoProdutosService.carregaItensTabela($scope.idTabela, function(response){
				$scope.produtosDisponiveis = response;
				/*Consiste lista de pedidos disponíveis*/
				if(PedidoService.pedido.itensPedido) {
					let posicaoItemAntigoNaLista = -1
					PedidoService.pedido.itensPedido.forEach(function(item, index){
						let result = $.grep($scope.produtosDisponiveis, 
								function(e){
									return e.codigo === item.codigo;
								});
						item.preco = result[0].preco
						item.st = result[0].st
						item.tabela = result[0].tabela
						$scope.atualizaProduto(item)
					});
				}
			});
		}
	
		/* Carrega lista de produtos */
		PedidoProdutosService.carregaItensTabela($scope.idTabela, function(response){
			$scope.produtosDisponiveis = response;
			/*Consiste lista de pedidos disponíveis*/
			if(PedidoService.pedido.itensPedido) {
				PedidoService.pedido.itensPedido.forEach(function(item, index){
					let result = $.grep($scope.produtosDisponiveis, 
							function(e){
								return e.codigo === item.codigo;
							});
					if(result.length > 0) {
						$scope.produtosDisponiveis = $.grep($scope.produtosDisponiveis, function(item){
							return item.codigo !== result[0].codigo;
						})
					}
				});
			}
		});
		$scope.editandoItem = false
	}
	
	function inicializaProdutoSelecionado() {
		$scope.produto = {
				selecionado : null
		};
		$scope.precoFinalItemSemSt = 0;
		$scope.precoUnitarioItemComSt = 0;
		$scope.precoUnitarioItemSemSt = 0;
	}
}
