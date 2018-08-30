'use strict'

var PedidoApp = angular.module('Pedido')
.controller('PedidoController', ['$scope', '$rootScope', '$location', '$http', '$route', 'IndustriasService', 'PedidoService', 'AuthenticationService', 'ModalService', 'IndustriaClientePrazoService', 'NotificationService', 
                                 function($scope, $rootScope, $location, $http, $route, IndustriasService, service, AuthenticationService, ModalService, IndustriaClientePrazoService, NotificationService) {

	let usuario = $rootScope.globals.currentUser.user;

	$scope.proposta = {
		selecionado: undefined
	}

	$scope.carga = {
		selecionado: undefined
	}

	$scope.LISTA_SIMNAO = LISTA_SIMNAO
	$scope.LISTA_CARGA = LISTA_CARGA

	$scope.pedido = inicializaPedido(usuario);

	$scope.industria = {
			selecionado : null
	}

	$scope.listaPrazo = []

	IndustriasService.getIndustriasUsuario(usuario.id, function(response){
		$scope.industrias = response;
		if($scope.pedido.idIndustria) {
			$scope.industrias.forEach(function(item, index){
				// Se já possui uma indústria selecionada atribui objeto
				if(item.id == $scope.pedido.idIndustria) {
					$scope.industria.selecionado = item;
				}
			})
			if($scope.industria.selecionado) {
				$scope.cliente = {
						selecionado : null
				};
				carregaClientes($scope.industria.selecionado.id, usuario.id, $scope.pedido.idCliente, function(listaClientes, clienteSelecionado){
					$scope.clientes = listaClientes;
					$scope.cliente.selecionado = clienteSelecionado;
					carregaPrazos($scope.industria.selecionado.id, $scope.cliente.selecionado.id, (data) => {
						$scope.listaPrazo = data
						let prazosCliente = $.grep($scope.listaPrazo, (e) => {
							return e.idIndustriaPrazo === $scope.pedido.idIndustriaPrazo
						})
						$scope.prazo = {
							selecionado : prazosCliente[0]
						}
						if($scope.prazo && $scope.prazo.selecionado &&  $scope.prazo.selecionado.padrao == true) {
							$scope.naoAlteraPrazo = true
						}
					})
				});
				$scope.tabela = {
						selecionado : null
				};
				carregaTabelasIndustria($scope.industria.selecionado.id, $scope.pedido.idTabela, function(listaTabelas, tabelaSelecionada){
					$scope.tabelas = listaTabelas;
					$scope.tabela.selecionado = tabelaSelecionada;
				});
			}
			if($scope.pedido.carga) {
				let result = $.grep(LISTA_CARGA, function(item){ return item.value == $scope.pedido.carga; });
				$scope.carga.selecionado = result[0];
			}
		} else {
			$scope.prazo = {
				selecionado : undefined
			}
		}
	});
	
	/*Altera a indústria selecionada*/
	$scope.selecionaIndustria = function() {
		carregaClientes($scope.industria.selecionado.id, usuario.id, $scope.pedido.idCliente, function(listaClientes, clienteSelecionado){
			$scope.clientes = listaClientes;
			$scope.cliente.selecionado = clienteSelecionado;
		});
		carregaTabelasIndustria($scope.industria.selecionado.id, $scope.pedido.idTabela, function(listaTabelas, tabelaSelecionada){
			$scope.tabelas = listaTabelas;
			$scope.tabela.selecionado = tabelaSelecionada;
		});
	}

	$scope.geraPedido = function() {
		$scope.pedido.idCliente        = $scope.cliente.selecionado.id
		$scope.pedido.idIndustria      = $scope.industria.selecionado.id
		$scope.pedido.idTabela         = $scope.tabela.selecionado.id
		$scope.pedido.nomeCliente      = $scope.cliente.selecionado.razaoSocial
		$scope.pedido.idIndustriaPrazo = $scope.prazo.selecionado.idIndustriaPrazo
		$scope.pedido.industriaPrazo   = $scope.prazo.selecionado
		$scope.pedido.proposta         = $scope.proposta.selecionado.value
		$scope.pedido.carga            = $scope.carga.selecionado.value
		service.cliente                = $scope.cliente.selecionado
		service.industria              = $scope.industria.selecionado

		//Se for pedido novo
		if(!$scope.emEdicao) {
			service.criaPedido($scope.pedido, function(response){
				if(response) {
					service.pedido = response;
					service.tabela = $scope.tabela.selecionado.nome;
					$scope.pedido.id = response.id;
					$scope.pedido.dataPedido = response.dataPedido;
					$location.path('/pedidoProdutos');
				}
			});
		} else {
			//Senão
			service.pedido = $scope.pedido;
			service.tabela = $scope.tabela.selecionado.nome;
			$scope.pedido.id = $scope.pedido.id;
			$scope.pedido.dataPedido = $scope.pedido.dataPedido;
			$location.path('/pedidoProdutos');
		}
	}
	
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};
	
	$scope.possuiPedidoAtivo = function() {
		if(service.getPedidoAtivo()) {
			return true;
		} else {
			return false;
		}
	}
	
	$scope.cancelarPedido = function() {
        var modalOptions = {
                closeButtonText: 'Não',
                actionButtonText: 'Sim',
                headerText: 'Confirmar',
                bodyText: 'Confirma remoção do pedido atual ?'
            };

        ModalService.showModal({}, modalOptions).then(function (result) {
        	service.removePedido();
        	NotificationService.success('Pedido removido com sucesso!');
        	$route.reload();
        });
	}
	
	$scope.onChange = function() {
		$scope.$broadcast('selectChanged');
	};
	
	$scope.selecionaTabela = function() {
		if($scope.pedido.itensPedido.length > 0) {
			service.trocaTabela = true;
		}
	}

	$scope.selecionaCliente = () => {
		const idIndustria = $scope.industria.selecionado.id
		const idCliente = $scope.cliente.selecionado.id
		$scope.pedido.idPedidoPrazo = undefined
		$scope.naoAlteraPrazo = false
		carregaPrazos(idIndustria, idCliente, (data) => {
			$scope.listaPrazo = data
			verificaPrazoPadrao()
		})
	}

	$scope.isClienteDisabled = () => {
		return $scope.industria.selecionado == null || $scope.emEdicao
	}

	function carregaPrazos(idIndustria, idCliente, callback) {
		IndustriaClientePrazoService.getIndustriaPrazoOuIndustriaClientePrazo(idIndustria, idCliente, (data) => {
			callback(data)
		})
	}

	function verificaPrazoPadrao() {
		$scope.listaPrazo.forEach((e) => {
			if(e.padrao) {
				$scope.prazo = {
					selecionado : e
				}
				if($scope.prazo && $scope.prazo.selecionado &&  $scope.prazo.selecionado.padrao == true) {
					$scope.naoAlteraPrazo = true
				}
			}
		})
	}

	function carregaTabelasIndustria(idIndustria, idTabela, callback) {
		$scope.tabela = {
				selecionado : null
		};
		IndustriasService.getTabelasIndustria(idIndustria, function(response) {
			let tabelaSelecionada = null;
			if(idTabela) {
				response.forEach(function(item, index) {
					if(item.id == idTabela) {
						tabelaSelecionada = item;
					}
				})
			}
			callback(response, tabelaSelecionada)
		});
	}
	
	function carregaClientes(idIndustria, idUsuario, idCliente, callback) {
		$scope.cliente = {
				selecionado : null
		}
		service.carregaClientesPorRepresentacao(idIndustria, idUsuario, function(response) {
			let clienteSelecionado = null;
			if(idCliente) {
				response.forEach(function(item, index){
					if(item.id == idCliente) {
						clienteSelecionado = item;
					}
				})
			}
			callback(response, clienteSelecionado);
		});
	}
	
	function inicializaPedido(usuario) {
		let pedido = service.pedidoParaEditar;
		if(!pedido) {
			pedido = service.getPedidoAtivo();
			if(!pedido) {
				let date = new Date(); 
				$scope.dataEntrega = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1).toLocaleDateString("pt-BR");
				pedido = new PedidoDto(usuario.id, $scope.dataEntrega)
			} else {
				$scope.emEdicao = true;
			}
		} else {
			$scope.emEdicao = true;
			service.emEdicao = true;
		}
		return pedido;
	}

}]);

PedidoApp.directive('focus', function($timeout) {
	   return function(scope, elem, attr) {
	      scope.$on(attr.focus, function(e) {
	        $timeout(function() {
	          elem[0].focus();
	        }, 50);
	      });
	   };
	})
