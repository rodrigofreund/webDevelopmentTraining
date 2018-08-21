'use strict';
var module = angular.module('ClientesCadastrados')
	.controller('ClientesCadastradosController',
	['$scope', '$rootScope', '$location', '$http', 'ClientesCadastradosService', 'PedidoService', 'IndustriasService', 'AuthenticationService', 'ModalService', 'StorageService', 'CadastroClientesService',
		function ($scope, $rootScope, $location, $http, service, PedidoService, IndustriasService, AuthenticationService, ModalService, StorageService, CadastroClientesService) {

			let usuario = AuthenticationService.getUsuario();

			if (StorageService.getFiltroAtivo()) {
				$scope.search = StorageService.getFiltroAtivo();
			} else {
				$scope.search = {
					razaoSocial: "",
					nomeFantasia: "",
					cpfCnpj: "",
					newPage: 1,
					pageSize: 10,
					idUsuario: usuario.id,
					vendedorFiltro: undefined,
					pendenteRegistro: undefined,
				};
			}

			var paginationOptions = {
				pageNumber: 1,
				pageSize: 10,
				sort: null
			};

			$scope.exibeOpcionais = innerWidth > 700 ? true : false;

			CadastroClientesService.buscaVendedores(function (result) {
				$scope.listaVendedores = result;
			});

			$scope.gridClientes = {
				paginationPageSizes: [10, 15, 20],
				paginationPageSize: paginationOptions.pageSize,
				useExternalPagination: true,
				enableRowSelection: true,
				multiSelect: false,
				rowHeight: 35,
				enableColumnResizing: true,
				columnDefs: [
					{ name: 'razaoSocial', width: ($scope.exibeOpcionais ? '30%' : '44%') },
					{ name: 'nomeFantasia', width: ($scope.exibeOpcionais ? '24%' : '32%') },
					{ name: 'cpfCnpj', width: ($scope.exibeOpcionais ? '10%' : '18%') },
					{ name: 'telefone', width: '8%', visible: $scope.exibeOpcionais },
					{ name: 'celular', width: '8%', visible: $scope.exibeOpcionais },
					{ name: 'informacoesAdicionais', width: '14%', visible: $scope.exibeOpcionais },
				],
				onRegisterApi: function (gridApi) {
					$scope.gridApi = gridApi;
					gridApi.pagination.on.paginationChanged($scope,
						function (newPage, pageSize) {
							paginationOptions.pageNumber = newPage;
							paginationOptions.pageSize = pageSize;
							$scope.search.newPage = newPage;
							$scope.search.pageSize = pageSize;
							$scope.search.vendedor = AuthenticationService.isVendedor();
							service.carregaClientes($scope.search, function (response) {
								$scope.gridClientes.data = response.content;
							});
						});
					gridApi.selection.on.rowSelectionChanged($scope,
						function (row) {
							if (!row.isSelected) {
								$scope.canEditCliente = false;
								$scope.clienteSelecionado = null;
							} else {
								$scope.canEditCliente = true;
								$scope.clienteSelecionado = row.entity;
							}
						});
				}
			}

			$scope.search.vendedor = AuthenticationService.isVendedor()
			service.carregaClientes($scope.search, function (response) {
				$scope.gridClientes.data = response.content;
				service.getTotalClientes(function (response) {
					$scope.gridClientes.totalItems = response;
				})
			});

			$scope.clienteSelecionado = null;
			$scope.canEditCliente = false;

			$scope.editarCliente = function () {
				service.clienteParaEditar = $scope.clienteSelecionado
				StorageService.setFiltroAtivo($scope.search)
				$location.path('/cadastroCompletoCliente')
			}

			$scope.removerCliente = function () {
				var modalOptions = {
					closeButtonText: 'Não',
					actionButtonText: 'Sim',
					headerText: 'Confirmar',
					bodyText: 'Confirma exclusão do cliente ' + $scope.clienteSelecionado.razaoSocial + '?'
				};

				ModalService.showModal({}, modalOptions).then(function (result) {
					service.removerCliente($scope.clienteSelecionado.id, function (response) {
						alert('Cliente ' + response.razaoSocial + ' excluído com sucesso!');
						$scope.filter();
					});
				});
			}

			$scope.filter = function () {
				$scope.search.vendedor = AuthenticationService.isVendedor()
				service.carregaClientes($scope.search, function (response) {
					$scope.gridClientes.data = response.content;
					if ($scope.search.razaoSocial.length == 0 && $scope.search.nomeFantasia.length == 0 && $scope.search.cpfCnpj.length == 0) {
						service.getTotalClientes(function (response) {
							$scope.gridClientes.totalItems = response;
						})
					} else {
						$scope.gridClientes.totalItems = response.content.length;
					}
				});
			}

			$scope.possuiPermissaoEditar = function () {
				if (AuthenticationService.isVendedor()) {
					return false;
				}
				return true;
			}

			$scope.selecionaVendedor = function () {
				CadastroClientesService.getRepresentacoesUsuario($scope.search.vendedorFiltro.id, function (response) {
					$scope.search.listaRepresentacoes = response;
					$scope.filter();
				})
			}

		}])
		.directive('focus', function() {
			return {
				restrict: 'A',
				link: function($scope,elem,attrs) {
					elem.bind('keydown', function(e) {
						var code = e.keyCode || e.which;
						if (code === 13) {
							//e.preventDefault();
							//elem.next().focus();
							elem.blur();
						}
					});
				}
			}
		});