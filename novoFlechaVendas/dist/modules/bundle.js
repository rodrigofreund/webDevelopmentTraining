'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.config(function ($stateProvider) {
  const login = {
    name: 'login',
    url: '/',
    component: 'loginComponent'
  }
  const main = {
    name: 'main',
    url: '/main',
    component: 'mainComponent',
    abstract: true,
    resolve: {
      auth: (LoginService, $q, $timeout, $state) => {
        const deferred = $q.defer();
        $timeout(() => {
          if (LoginService.getUsuario()) {
            return deferred.resolve(LoginService.getUsuario());
          }
          $state.go('login');
          return deferred.reject('usuário não logado!');
        });
        return deferred.promise;
      }
    }
  }
  const dashboard = {
    name: 'main.dashboard',
    url: '/dashboard',
    component: 'dashboardComponent',
    resolve: {
      informacoes: (DashboardService, auth) => {
        return DashboardService.getInformacoesDashboardDto(auth.id);
      }
    }
  }
  $stateProvider.state(login)
  $stateProvider.state(main)
  $stateProvider.state(dashboard)
})

'use strict';

const STATUS_PEDIDO = {
	INDEFINIDO: 0,
	CRIADO: 1,
	SALVO: 2,
	ENVIADO: 3,
	NEGADO: 4,
	COLOCADO: 5,
	CANCELADO: 6,
}

const NETWORK_STATUS = {
	OFFLINE: 0,
	ONLINE: 1
}

const NETWORK = {
	STATUS: NETWORK_STATUS.OFFLINE
}

const Connection = {
	UNKNOWN: 0,
	NONE: 1
}

const DATABASE_STATUS = {
	OFFLINE: 0,
	ONLINE: 1
}

const DATABASE = {
	NAME: 'flechavendaslocal.db',
	HASH: '98288f2f1127c95121bcb51c897251c9',
	STATUS: DATABASE_STATUS.ONLINE,
	ID: 115478445
}

const CALLRESULT = {
	OK: 0,
	ERROR: -1,
	UNKNOWN: -2,
}

const TIMEOUT = 60000

const STORAGE_ITEM = {
	INDUSTRIAS_USUARIO: 1,
	CLIENTES_USUARIO: 2,
}

const LISTA_SIMNAO = [
	{ value: false, text: 'Não' },
	{ value: true, text: 'Sim' }
]

const LISTA_CARGA = [
	{ value: 1, text: 'Batida' },
	{ value: 2, text: 'Paletizado' }
]

const PAGINACAO = {
	PEDIDO: {
		PAGE_SIZE: 20,
		NEW_PAGE: 1
	}
}

const IMAGE_FILE_TYPE = [
	'image/png',
	'image/jpeg'
]

const DOCUMENT_FILE_TYPE = [
	'application/pdf',
	'text/plain',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/msword'
]

const ENTER_KEY_CODE = 13;

const PEDIDO_PROPOSTA = 1;

'use strict'

var app = angular.module(
	'GerenciadorFinanceiroFlechaVendas',
	['ui.router',
		'blockUI',
		'usuario.module',
		'ModalApp',
		'Notificacao',
		'cliente.module',
		'pedido.module',
		'industria.module',
		'tabela.module',
		'industria.prazo.module'])
	.run(['$transitions', ($transitions) => {
		$transitions.onBefore({}, transition => {
			console.log('transacao');
		});
	}]);

app.filter('propsFilter', function () {
	return function (items, props) {
		var out = [];

		if (angular.isArray(items)) {
			var keys = Object.keys(props);
			items.forEach(function (item) {
				var itemMatches = false;

				for (var i = 0; i < keys.length; i++) {
					var prop = keys[i];
					var text = props[prop].toLowerCase();
					if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
						itemMatches = true;
						break;
					}
				}

				if (itemMatches) {
					out.push(item);
				}
			});
		} else {
			// Let the output be the input untouched
			out = items;
		}

		return out;
	};
});

/*
angular.module('Authentication', [])
angular.module('Industrias', ['ui.grid','ui.grid.pagination', 'ui.grid.selection', 'ui.grid.resizeColumns'])
angular.module('Menu', [])
angular.module('Pedido', ['ngAnimate', 'ui.bootstrap'])
angular.module('PedidoProdutos', ['ngSanitize', 'ui.select'])
angular.module('PedidoResumo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap.accordion'])
angular.module('DetalhePedido', ['ngAnimate','ui.bootstrap', 'ui.grid','ui.grid.pagination', 'ui.grid.selection', 'ui.grid.resizeColumns'])
angular.module('DetalhePedidoItens', [])
angular.module('DetalhePedidoSalvo', [])
angular.module('DetalhePedidoSalvoItens', [])
angular.module('Tabela', ['blockUI'])
angular.module('CadastroClientes', ['blockUI', 'ui.mask', 'ngSanitize', 'ui.select'])
angular.module('ClientesCadastrados', ['ui.grid','ui.grid.pagination', 'ui.grid.selection', 'ui.grid.resizeColumns'])
angular.module('ModalApp', ['ui.bootstrap'])
angular.module('Notificacao', ['ui-notification'])
angular.module('UsuarioModulo', ['ui.router', 'ui.bootstrap.tabs'])

var app = angular.module('GerenciadorFinanceiroFlechaVendas',
				[ 'Authentication', 'Industrias', 'Menu', 'Pedido', 'PedidoProdutos', 'PedidoResumo', 
				  'DetalhePedido', 'DetalhePedidoItens', 'Tabela', 'CadastroClientes', 'ClientesCadastrados', 'ModalApp', 
				  'DetalhePedidoSalvo', 'DetalhePedidoSalvoItens','ngRoute', 'ngCookies', 'Notificacao', 'UsuarioModulo'])
		.config([ '$routeProvider', function($routeProvider) {
			$routeProvider.when('/login', {
				controller : 'LoginController',
				templateUrl : 'modules/authentication/views/login.html'
			}).when('/dashboard', {
				controller : 'MenuController',
				templateUrl : 'modules/dashboard/views/dashboard.html'
			}).when('/industrias', {
				controller : 'IndustriasController',
				templateUrl : 'modules/industrias/views/industrias.html'
			}).when('/pedido', {
				controller : 'PedidoController',
				templateUrl : 'modules/pedido/views/pedido.html'
			}).when('/pedidoProdutos', {
				controller : 'PedidoProdutosController',
				templateUrl : 'modules/pedidoProdutos/views/produtos.html'
			}).when('/pedidoResumo', {
				controller : 'PedidoResumoController',
				templateUrl : 'modules/pedidoResumo/views/pedidoResumo.html'
			}).when('/detalhePedido', {
				controller : 'DetalhePedidoController',
				templateUrl : 'modules/detalhePedido/views/detalhePedido.html'
			}).when('/detalhePedidoItens', {
				controller : 'DetalhePedidoItensController',
				templateUrl : 'modules/detalhePedidoItens/views/detalhePedidoItens.html'
			}).when('/cadastroTabela', {
				controller : 'TabelaController',
				templateUrl : 'modules/tabela/views/tabela.html'
			}).when('/detalheTabela/:idTabela', {
				controller : 'TabelaController',
				templateUrl : 'modules/tabela/views/detalheTabela.html'
			}).when('/cadastroCompletoCliente', {
				controller : 'CadastroClientesController',
				templateUrl : 'modules/cadastroClientes/views/cadastroCompletoCliente.html'
			}).when('/detalhePedidoSalvo', {
				controller : 'DetalhePedidoSalvoController',
				templateUrl : 'modules/detalhePedidoSalvo/views/detalhePedidoSalvo.html'
			}).when('/detalhePedidoSalvoItens', {
				controller : 'DetalhePedidoSalvoItensController',
				templateUrl : 'modules/detalhePedidoSalvoItens/views/detalhePedidoSalvoItens.html'
			}).when('/listaClientes', {
				controller : 'ClientesCadastradosController',
				templateUrl : 'modules/clientesCadastrados/views/clientesCadastrados.html'
			}).when('/listaIndustrias', {
				controller : 'IndustriasController',
				templateUrl : 'modules/industrias/views/industrias.html'
			}).when('/usuarioPesquisa', {
				template : '<usuario-modulo id=2></usuario-modulo>'
			}).when('/usuarioCadastro', {
				template : '<usuario-modulo id=1></usuario-modulo>'
			}).when('/usuario', {
				template : '<usuario-modulo></usuario-modulo>'
			}).otherwise({
				redirectTo : '/login'
			})
		}]).run(['$rootScope', '$location', '$http', 'AuthenticationService', 'NetworkService',
		function($rootScope, $location, $http, AuthenticationService, NetworkService) {
			$rootScope.globals = {};
			$rootScope.globals.currentUser = AuthenticationService.getCredentialsRemember();
			if ($rootScope.globals.currentUser) {
				$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
				AuthenticationService.setUsuario($rootScope.globals.currentUser.user);
			}
			$rootScope.$on('$locationChangeStart', function(event, next, current) {
				if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
					AuthenticationService.setUsuario(undefined)
					$location.path('/login');
				}
			});
	}
]);

app.controller('AppController', ['$scope', '$rootScope', 'AuthenticationService', 'NetworkService', function($scope, $rootScope, AuthenticationService, NetworkService) {
	moment.locale('pt')

	$scope.$watch(AuthenticationService.getUsuario, function (usuario) {
		if(AuthenticationService.usuario) {
			$scope.nomeUsuario = "Flecha Vendas - " + AuthenticationService.usuario.nome
			$scope.isMaster = AuthenticationService.isMaster()
		} else {
			$scope.nomeUsuario = "Flecha Vendas"
			$scope.isMaster = false
		}
	})

	NetworkService.startNetworkMonitor()

	$scope.$watch(NetworkService.getNetworkStatus, function (newValue, oldValue) {
		if(newValue === NETWORK_STATUS.ONLINE) {
				$scope.hasConnection = true
				$rootScope.globals.online = true
		} else {
			$scope.hasConnection = false
			$rootScope.globals.online = false
		}
	})

	$scope.isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)

	$scope.isAdministrador = AuthenticationService.isAdministrador()

}]);

app.config(function(blockUIConfig) {
	blockUIConfig.autoBlock = true;
	blockUIConfig.resetOnException = false;
	blockUIConfig.message = 'Carregando...';
})



	*/

'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.factory('HttpService', [
	'$http',
	'blockUI',
	'$log',
	constructor,
])

function constructor($http, blockUI, $log) {
	var service = {};

	service.httpPost = function (path, param, timeout, header, opt) {
		let _timeout = timeout !== null ? timeout : TIMEOUT
		let _header = {
			'Authorization': getUsuarioHash(),
		}
		if (header) {
			for (let i in header) {
				_header[i] = header[i];
			}
		}
		var req = {
			method: 'POST',
			url: `${MODO_HTTP}/${URL}/${path}`,
			headers: _header,
			data: param,
			timeout: _timeout
		};
		if (opt) {
			for (let i in opt) {
				req[i] = opt[i];
			}
		}
		blockUI.start();
		return $http(req).then(result => {
				return result.data;
			}, error => {
				$log.log('Erro na chamada ao servidor: ', error);
			}).finally(function () {
				blockUI.stop();
			})
	}

	service.httpGet = function (path, param, timeout) {
		var _timeout = timeout !== null ? timeout : TIMEOUT
		var req = {
			method: 'GET',
			url: `${MODO_HTTP}/${URL}/${path}`,
			headers: { 'Authorization': getUsuarioHash() },
			params: param,
			timeout: _timeout
		}
		blockUI.start()
		return $http(req)
			.then(result => {
				return result.data
			})
			.finally(function () {
				blockUI.stop()
			})
	}

	function getUsuarioHash() {
		return angular.fromJson(sessionStorage.getItem('login')) === null ? null : angular.fromJson(sessionStorage.getItem('login'));
	}

	return service;
}

'use strict'

angular.module('CadastroClientes')
	.controller('CadastroClientesController',
		['$scope',
			'$rootScope',
			'$location',
			'$sce',
			'$route',
			'$routeParams',
			'$window',
			'CadastroClientesService',
			'ClientesCadastradosService',
			'IndustriasService',
			'AuthenticationService',
			'blockUI',
			'ModalService',
			'IndustriaClientePrazoService',
			'NotificationService',
			function ($scope,
				$rootScope,
				$location,
				$sce,
				$route,
				$window,
				service,
				ClientesCadastradosService,
				IndustriasService,
				AuthenticationService,
				blockUI,
				ModalService,
				IndustriaClientePrazoService,
				NotificationService) {

				var cliente = ClientesCadastradosService.clienteParaEditar;

				$scope.listaRepresentacoesVendedor = [];
				$scope.listaRepresentacoesCliente = [];
				$scope.listaIndustriaCliente = [];
				$scope.industriaPrazo = {
					selecionado: undefined,
				}

				if (cliente) {
					$scope.cliente = cliente;
					$scope.listaRepresentacoesCliente = cliente.listaRepresentacoesCliente;
					ClientesCadastradosService.clienteParaEditar = null;
					service.getIndustriasCliente(cliente.id, function (response) {
						$scope.listaIndustriaCliente = response;
					});
					if ($scope.cliente.excluido) {
						NotificationService.alert('Este cliente está excluído. Efetue as alterações e salve o cadastro para reativá-lo.')
					}
				} else {
					$scope.cliente = {
						id: null,
						razaoSocial: "",
						nomeFantasia: "",
						cpfCnpj: null,
						rgIe: "",
						rua: "",
						numero: null,
						sala: null,
						andar: null,
						complemento: "",
						bairro: "",
						cep: "",
						cidade: "",
						estado: null,
						telefone: null,
						celular: null,
						contato: "",
						email: "",
						diasEntrega: "",
						horarioEntrega: "",
						nomeBanco: null,
						numeroAgencia: "",
						nomeAgencia: "",
						numeroConta: "",
						idPessoa: null,
						ativo: true,
						bloqueioVenda: false,
						informacoesAdicionais: "",
						pendenteRegistro: null,
						referenciasComerciais: undefined,
						excluido: null
					};
				}

				$scope.banco = {
					nome: null
				};

				$scope.arquivoCliente = undefined

				$scope.representacaoVendedor = {
					selecionado: null
				};

				$scope.industria = {
					selecionado: null
				};

				$scope.estado = {
					selecionado: null
				}

				$scope.industriaCliente = {
					idCliente: null,
					idIndustria: null,
					codigo: null,
					limiteCredito: null,
					ativo: true,
					bloqueioVenda: false,
					nomeIndustria: null,
					removido: false,
					listaIndustriaClientePrazo: [],
					listaIndustriaClientePrazoParaRemover: [],
				}

				$scope.representacaoCliente = {
					id: null,
					industria: {
						id: null,
						nome: null
					},
					usuario: {
						id: null,
						nome: null
					}
				}

				$scope.bloqueiaSalvar = (AuthenticationService.isVendedor() && $scope.listaRepresentacoesCliente.length < 1)

				$scope.tipoPessoa = {
					selecionado: null
				};

				$scope.industriaClientePrazoPadrao = {
					selecionado: undefined,
				}

				var usuario = $rootScope.globals.currentUser.user;

				function _base64ToArrayBuffer(base64) {
					var binary_string =  $window.atob(base64);
					var len = binary_string.length;
					var bytes = new Uint8Array( len );
					for (var i = 0; i < len; i++)        {
							bytes[i] = binary_string.charCodeAt(i);
					}
					return bytes.buffer;
				}

				function b64toBlob(b64Data, contentType, sliceSize) {
					return new Blob([_base64ToArrayBuffer(b64Data)], {type: contentType});
				}

				$scope.downloadArquivo = (nomeArquivo) => {
					service.downloadArquivo($scope.cliente.cpfCnpj, nomeArquivo, (data) => {
							/*let image = new Image();
							image.src = `data:image/jpg;base64,${data}`
							var w = $window.open("", '_blank');
							w.document.write(image.outerHTML);*/
							let a = document.createElement("a");
    					document.body.appendChild(a);
    					a.style = "display: none";
							var blob = b64toBlob(data, 'image/jpg');
							let url = $window.webkitURL.createObjectURL(blob);
							a.href = url;
							a.download = nomeArquivo;
							a.click();
							$window.webkitURL.revokeObjectURL(url);
					})
				}

				$scope.listaNomeBancos = service.buscaNomesBancos();
				if ($scope.cliente.nomeBanco != null) {
					$scope.banco.nome = $scope.cliente.nomeBanco;
				}

				service.getRepresentacoesUsuario(usuario.id, function (response) {
					$scope.listaRepresentacoes = response;
				});

				service.buscaVendedores(function (response) {
					$scope.vendedores = response;
				});

				service.buscaListaTipoPessoa(function (response) {
					$scope.listaTipoPessoa = response;
					if ($scope.cliente.idPessoa != null) {
						$scope.listaTipoPessoa.forEach(function (item, index) {
							if (item.id == $scope.cliente.idPessoa) {
								$scope.tipoPessoa.selecionado = item;
							}
						});
					} else {
						$scope.tipoPessoa.selecionado = $scope.listaTipoPessoa[1];
					}

				});

				$scope.verificaCliente = function () {
					const cpfCnpj = $scope.cliente.cpfCnpj
					if (!cpfCnpj) {
						return
					}
					ClientesCadastradosService.getClienteExistente(cpfCnpj, (response) => {
						if (response) {
							if (AuthenticationService.isVendedor() && !$scope.cliente.id) {
								NotificationService.alert('Cliente já cadastrado! Entre em contato com a administração.')
								$scope.naoEditavel = true
							} else {
								if (!$scope.cliente.id) {
									exibeModalConfirmacaoCliente(response)
								}
							}
						} else {
							$scope.naoEditavel = false
						}
					})
				}

				$scope.selecionaIndustria = function () {
					var industria = $scope.industria.selecionado.industria;
					var listaEncontrados = $.grep($scope.listaIndustriaCliente, function (e, i) {
						return e.idIndustria == industria.id;
					});
					$scope.industriaPrazo = {
						selecionado: undefined
					}
					$scope.industriaClientePrazoPadrao = {
						selecionado: undefined
					}

					if (listaEncontrados.length == 0) {
						$scope.industriaCliente = {
							idCliente: null,
							idIndustria: industria.id,
							codigo: null,
							limiteCredito: null,
							ativo: true,
							bloqueioVenda: false,
							nomeIndustria: industria.nome,
							removido: false,
							listaIndustriaClientePrazo: [],
							listaIndustriaClientePrazoParaRemover: [],
						}
						$scope.industriaPrazo = {
							selecionado: undefined,
						}
						$scope.industriaClientePrazoPadrao = {
							selecionado: undefined,
						}
					} else {
						$scope.industriaCliente = listaEncontrados[0];
						IndustriaClientePrazoService.getIndustriaClientePrazoPorIdIndustriaCliente($scope.industriaCliente.id, (result) => {
							$scope.industriaClientePrazo = result
						})
					}

					buscaRepresentacoesIndustria(industria)

					geraListaPrazosExistentes(industria)
				}

				function exibeModalConfirmacaoCliente(response) {
					var modalOptions = {
						closeButtonText: 'Não',
						actionButtonText: 'Sim',
						headerText: 'Confirmar',
						bodyText: 'O cliente com CNPJ ' + response.cpfCnpj + ' já possui cadastro! Deseja carregar seus dados?'
					};
					ModalService.showModal({}, modalOptions).then(() => {
						ClientesCadastradosService.clienteParaEditar = response
						$route.reload();
					}, function (result) {
						return
					});
				}

				function buscaRepresentacoesIndustria(industria) {
					service.getRepresentacoesIndustria(industria.id, function (response) {
						$scope.listaRepresentacoesVendedor = response;

						if (AuthenticationService.isVendedor()) {
							var representacoes = $.grep($scope.listaRepresentacoesVendedor, function (e, i) {
								return e.usuario.id == usuario.id;
							});
							if (representacoes && representacoes.length > 0) {
								$scope.representacaoVendedor.selecionado = representacoes[0];
							}
							if ($scope.representacaoVendedor.selecionado) {
								$scope.selecionaRepresentacaoVendedor();
							}
						}
					})
				}

				function geraListaPrazosExistentes(industria) {
					IndustriasService.getPrazosIndustria(industria.id, (result) => {
						if ($scope.industriaCliente.listaIndustriaClientePrazo !== null && $scope.industriaCliente.listaIndustriaClientePrazo.length > 0) {
							//GERA LISTA DE PRAZOS JA ADICIONADOS NA INDUSTRIA SELECIONADA
							$scope.industriaPrazo.selecionado = $.grep(result, (ePrazo) => {
								let exists = $.grep($scope.industriaCliente.listaIndustriaClientePrazo, (eIndustriaClientePrazo) => {
									return ePrazo.id === eIndustriaClientePrazo.idIndustriaPrazo
								})
								return exists.length !== 0
							})
							//BUSCA ITEM PADRAO SELECIONADO
							if ($scope.industriaCliente.listaIndustriaClientePrazo.length > 0) {
								let exists = $.grep($scope.industriaCliente.listaIndustriaClientePrazo, (eIndustriaClientePrazo) => {
									return eIndustriaClientePrazo.padrao === true
								})
								if (exists.length > 0) {
									$scope.industriaClientePrazoPadrao.selecionado = exists[0]
								}
							}
						}
						$scope.prazosIndustria = result
					})
				}

				$scope.selecionaRepresentacaoVendedor = function () {
					if (!$scope.listaRepresentacoesCliente) {
						$scope.listaRepresentacoesCliente = [];
					}

					var listaEncontrados = $.grep($scope.listaRepresentacoesCliente, function (e, i) {
						return e.idRepresentacao == $scope.representacaoVendedor.selecionado.id;
					});

					if (!listaEncontrados || listaEncontrados.length == 0) {
						$scope.representacaoCliente = {
							id: $scope.representacaoVendedor.selecionado.id,
							industria: {
								id: $scope.representacaoVendedor.selecionado.industria.id,
								nome: $scope.representacaoVendedor.selecionado.industria.nome
							},
							usuario: {
								id: $scope.representacaoVendedor.selecionado.usuario.id,
								nome: $scope.representacaoVendedor.selecionado.usuario.nome
							}
						}
					} else {
						$scope.representacaoCliente = listaEncontrados[0];
					}
				}

				$scope.alteraSelecaoIndustria = function (industria) {
					if (industria.selecionado) {
						adicionaIndustria(industria);
					} else {
						removeIndustria(industria);
					}
				}

				service.buscaEstados(function (response) {
					$scope.estados = response;
					if ($scope.cliente.estado == null) {
						$scope.estados.forEach(function (item, index) {
							if (item.sigla == 'RS') {
								$scope.estado.selecionado = item;
							}
						});
					} else {
						$scope.estados.forEach(function (item, index) {
							if (item.sigla == $scope.cliente.estado.sigla) {
								$scope.estado.selecionado = item;
							}
						});
					}
				});

				$scope.salvarCliente = function () {
					var banco = $scope.banco.nome;
					$scope.cliente.idPessoa = $scope.tipoPessoa.selecionado.id;
					$scope.cliente.listaIndustriaCliente = $scope.listaIndustriaCliente;
					$scope.cliente.listaRepresentacoesCliente = $scope.listaRepresentacoesCliente;
					$scope.cliente.estado = $scope.estado.selecionado;
					$scope.cliente.nomeBanco = $scope.banco.nome;

					if (AuthenticationService.isVendedor()) {
						$scope.cliente.pendenteRegistro = true
						salvar()
					} else {
						if ($scope.cliente.pendenteRegistro == true) {
							var modalOptions = {
								closeButtonText: 'Não',
								actionButtonText: 'Sim',
								headerText: 'Confirmar',
								bodyText: 'O cliente ' + $scope.cliente.razaoSocial + ' está mardo como pendente de cadastro. Deseja remover esta marcação?'
							};

							ModalService.showModal({}, modalOptions).then(function (result) {
								$scope.cliente.pendenteRegistro = false
								salvar()
							}, function (result) {
								salvar()
							});
						} else {
							salvar()
						}
					}
				}

				$scope.adicionaIndustriaCliente = function () {
					if (!$scope.listaIndustriaCliente) {
						$scope.listaIndustriaCliente = [];
					}
					let atualizou = false
					$scope.listaIndustriaCliente.forEach(function(item, index) {
						if(item.id == $scope.industriaCliente.id && item.removido) {
							$scope.listaIndustriaCliente[index].removido = false
							atualizou = true
						}
					})
					if(!atualizou) {
						$scope.listaIndustriaCliente.push($scope.industriaCliente);
					}
				}

				$scope.adicionaRepresentcaoVendedor = function () {
					if (!$scope.listaRepresentacoesCliente) {
						$scope.listaRepresentacoesCliente = [];
					}
					$scope.listaRepresentacoesCliente.push($scope.representacaoCliente)
					$scope.bloqueiaSalvar = (AuthenticationService.isVendedor() && $scope.listaRepresentacoesCliente.length < 1)
				}

				$scope.adicionaIndustriaClienteRepresentacaoVendedor = function () {
					$scope.adicionaIndustriaCliente();
					$scope.adicionaRepresentcaoVendedor();
				}

				$scope.validaDocumento = function (cpfCnpj) {
					if (cpfCnpj.length == 14) {
						return service.validarCnpj(cpfCnpj);
					} else {
						return false;
					}
				}

				$scope.removeRepresentacao = function (representacao) {
					$.each($scope.listaRepresentacoesCliente, function (i) {
						if ($scope.listaRepresentacoesCliente[i].id === representacao.id) {
							$scope.listaRepresentacoesCliente.splice(i, 1);
							$scope.bloqueiaSalvar = (AuthenticationService.isVendedor() && $scope.listaRepresentacoesCliente.length < 1)
							return false;
						}
					});
				}

				$scope.removerIndustriaCliente = function (industriaCliente) {
					$.each($scope.listaIndustriaCliente, function (i) {
						if ($scope.listaIndustriaCliente[i].id === industriaCliente.id) {
							if(industriaCliente.id === undefined) {
								$scope.listaIndustriaCliente.splice(i, 1);
							} else {
								$scope.listaIndustriaCliente[i].removido = true;
							}
							return false;
						}
					});
				}

				$scope.voltar = function () {
					window.history.back();
				}

				$scope.podeSalvar = function () {
					if (AuthenticationService.isVendedor()) {
						if ($scope.listaRepresentacoesCliente && $scope.listaRepresentacoesCliente.length > 0) {
							return true
						} else {
							return false
						}
					} else {
						return true
					}
				}

				$scope.selecionaIndustriaPrazo = (item) => {
					let industriaClientePrazo = {
						id: undefined,
						idIndustriaCliente: undefined,
						idIndustriaPrazo: item.id,
						descricaoIndustriaPrazo: item.descricao,
						padrao: undefined,
					}
					$scope.industriaCliente.listaIndustriaClientePrazo.push(industriaClientePrazo)
				}

				$scope.removeIndustriaPrazo = (item) => {

					const itemRemovido = $.grep($scope.industriaCliente.listaIndustriaClientePrazo, (e) => {
						return e.idIndustriaPrazo === item.id;
					})

					$scope.industriaCliente.listaIndustriaClientePrazo = $.grep($scope.industriaCliente.listaIndustriaClientePrazo, (e) => {
						return e.idIndustriaPrazo !== item.id;
					})

					if (itemRemovido[0] && itemRemovido[0].padrao) {
						$scope.industriaClientePrazoPadrao.selecionado = undefined
					}

					if (itemRemovido[0] && itemRemovido[0].id) {
						$scope.industriaCliente.listaIndustriaClientePrazoParaRemover.push(itemRemovido[0])
					}
				}

				$scope.removerPadrao = () => {
					$scope.industriaCliente.listaIndustriaClientePrazo.forEach((e, i, arr) => {
						e.padrao = undefined
						$scope.industriaClientePrazoPadrao.selecionado = undefined
					})
				}

				$scope.buscaDescricaoResumidaPrazo = (industriaCliente) => {
					let descr = ""
					industriaCliente.listaIndustriaClientePrazo.forEach((e, i, arr) => {
						if (i === arr.length - 1) {
							descr += (e.padrao ? `<strong>${e.descricaoIndustriaPrazo}</strong>` : e.descricaoIndustriaPrazo)
						} else {
							descr += (e.padrao ? `<strong>${e.descricaoIndustriaPrazo}</strong>, ` : e.descricaoIndustriaPrazo + ", ")
						}
					})
					return $sce.trustAsHtml(descr)
				}

				$scope.selecionaIndustriaPrazoPadrao = function () {
					$scope.industriaCliente.listaIndustriaClientePrazo.forEach((e, i, arr) => {
						if (e.id == $scope.industriaClientePrazoPadrao.selecionado.id && e.idIndustriaPrazo == $scope.industriaClientePrazoPadrao.selecionado.idIndustriaPrazo) {
							e.padrao = true
						} else {
							e.padrao = false
						}
					})
				}

				$scope.uploadArquivoCliente = function () {
					var files = $scope.arquivoCliente;
					if (!files) {
						NotificationService.alert("Nenhum arquivo selecionado")
					}
					blockUI.start('Carregando Arquivo, Aguarde...');
					service.uploadArquivoCliente(files, $scope.cliente.cpfCnpj, function (result) {
						adicionaArquivosCliente(result)
						$scope.arquivoCliente = null
						blockUI.stop();
					}, function (error) {
						console.log('ERR')
						blockUI.stop();
					});
				}

				function adicionaArquivosCliente(arquivosEnviados) {
					if (arquivosEnviados) {
						if (!$scope.cliente.arquivos) {
							$scope.cliente.arquivos = []
						}
						arquivosEnviados.forEach((item, index) => {
							const arquivoClienteDto = {
								id: null,
								idCliente: $scope.cliente.id,
								nomeArquivo: item.nomeArquivo
							}
							$scope.cliente.arquivos.push(arquivoClienteDto)
						})
					}
				}

				function salvar() {
					service.salvarCliente($scope.cliente, function (result) {
						NotificationService.success(`Cliente ${result.razaoSocial} cadastrado com sucesso!`);
						$location.path('/listaClientes');
					})
				}

			}]);

var cadastroClienteModule = angular.module('CadastroClientes');

cadastroClienteModule.directive('autoComplete', ['$timeout', function ($timeout) {
  return function (scope, iElement, iAttrs) {
    iElement.autocomplete({
      source: scope[iAttrs.uiItems],
      select: function () {
        $timeout(function () {
          iElement.trigger('input');
        }, 0);
      }
    });
  };
}]);

cadastroClienteModule.directive('capitalize', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      var capitalize = function (inputValue) {
        if (inputValue == undefined) inputValue = '';
        var capitalized = inputValue.toUpperCase();
        if (capitalized !== inputValue) {
          modelCtrl.$setViewValue(capitalized);
          modelCtrl.$render();
        }
        return capitalized;
      }
      modelCtrl.$parsers.push(capitalize);
      capitalize(scope[attrs.ngModel]); // capitalize initial value
    }
  };
});

cadastroClienteModule.directive('checkCpfCnpj', function () {
  return {
    require: 'ngModel',
    link: function (scope, iElement, attrs, ngModel) {
      iElement.bind('blur', function (e) {
        if (ngModel.$modelValue != undefined) {
          ngModel.$setValidity('cnfCnpj', true);
          if (scope.validaDocumento(ngModel.$modelValue)) {
            ngModel.$setValidity('cnfCnpj', true);
          } else {
            ngModel.$setValidity('cnfCnpj', false);
          }
          scope.$apply();
        }
      });
    }
  };
});

cadastroClienteModule.directive('ngFileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.ngFileModel);
      var isMultiple = attrs.multiple;
      var modelSetter = model.assign;
      element.bind('change', function () {
        var values = [];
        var url = 
        angular.forEach(element[0].files, function (item) {
          values.push(item);
        });
        scope.$apply(function () {
          if (isMultiple) {
            modelSetter(scope, values);
          } else {
            modelSetter(scope, values[0]);
          }
        });
      });
    }
  };
}]);

cadastroClienteModule.filter('sim_nao', function () {
  return function (text, length, end) {
    if (text) {
      return 'Sim';
    }
    return 'Não';
  }
});
'use strict'

angular.module('CadastroClientes').factory('CadastroClientesService', [ '$http', 'NetworkService', 'NotificationService', function($http, NetworkService, NotificationService) {
	var service = {};
	
	service.salvarCliente = (cliente, callback) => {
		NetworkService.httpPost('/salvarCliente', cliente, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao salvar o cliente', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.buscaEstados = function(callback) {
		NetworkService.httpGet('/buscaEstados', (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar os estados', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.buscaVendedores = function(callback) {
		NetworkService.httpGet('/buscaUsuarios', (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar vendedores', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.buscaListaTipoPessoa = function(callback) {
		NetworkService.httpGet('/buscaListaTipoPessoa', (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar tipos de pessoa', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.getIndustriasCliente = function(idCliente, callback) {
		NetworkService.httpPost(`/buscaIndustriaCliente`, idCliente, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar industrias do cliente', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.getRepresentacoesIndustria = function(idIndustria, callback) {
		NetworkService.httpPost(`/buscaRepresentacoesIndustria`, idIndustria, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar representacoes industrias', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.getRepresentacoesUsuario = function(idUsuario, callback) {
		NetworkService.httpPost(`/buscaRepresentacoesUsuario`, idUsuario, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar representacoes industrias', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.downloadArquivo = function(cpfCnpj, nomeArquivo, callback) {
		NetworkService.httpGet(`/downloadArquivoCliente?nomeArquivo=${nomeArquivo}&cpfCnpj=${cpfCnpj}`, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar arquivo', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})		
	}

	service.compactarArquivos = function (files, callback) {
		var fd = new FormData()
		let cont = 0
		for (var i in files) {
			if (IMAGE_FILE_TYPE.indexOf(files[i].type) > -1) {
				new ImageCompressor(files[i], {
					quality: .8,
					minWidth: 1024,
					maxWidth: 1440 ,
					minHeight: 768,
					maxHeight: 900,
					success(result) {
						fd.append("files", result, result.name);
						cont++
						if (cont == files.length) {
							callback(fd)
						}
					},
					error(e) {
						NotificationService.error(error);
						callback(null)
					}
				})
			} else {
				fd.append("files", files[i]);
				cont++
				if (cont == files.length) {
					callback(fd)
				}
			}
		}
	}

	service.uploadArquivoCliente = function (files, cpfCnpj, callback, callbackError) {
		service.compactarArquivos(files, (mFileDescriptor) => {
			if (mFileDescriptor) {
				mFileDescriptor.append('cpfCnpj', cpfCnpj)
				$http.post(MODO_HTTP + URL + '/uploadArquivoCliente', mFileDescriptor, {
					transformRequest: angular.identity,
					headers: { 'Content-Type': undefined }
				})
					.success(function (result) {
						NotificationService.success('Arquivo enviado com sucesso!')
						callback(result);
					})
					.error(function (error) {
						NotificationService.error(error);
						callbackError(error);
					});
			} else {
				NotificationService.error("Não foi possível enviar os arquivos");
			}
		});
	}

	service.validarCpf = function(cpf) {
	    cpf = cpf.replace(/[^\d]+/g,'');    
	    if(cpf == '') return false; 
	    // Elimina CPFs invalidos conhecidos    
	    if (cpf.length != 11 || 
	        cpf == "00000000000" || 
	        cpf == "11111111111" || 
	        cpf == "22222222222" || 
	        cpf == "33333333333" || 
	        cpf == "44444444444" || 
	        cpf == "55555555555" || 
	        cpf == "66666666666" || 
	        cpf == "77777777777" || 
	        cpf == "88888888888" || 
	        cpf == "99999999999")
	            return false;       
	    // Valida 1o digito 
	    var add = 0;    
	    for (var i=0; i < 9; i ++)       
	        add += parseInt(cpf.charAt(i)) * (10 - i);  
	     var rev = 11 - (add % 11);  
	     if (rev == 10 || rev == 11)     
	    	 rev = 0;    
	     if (rev != parseInt(cpf.charAt(9)))     
	    	 return false;       
	    // Valida 2o digito 
	    add = 0;
	    for (var i = 0; i < 10; i ++)        
	        add += parseInt(cpf.charAt(i)) * (11 - i);  
	    rev = 11 - (add % 11);  
	    if (rev == 10 || rev == 11) 
	        rev = 0;    
	    if (rev != parseInt(cpf.charAt(10)))
	        return false;       
	    return true;   
	}
	
	service.validarCnpj = function (cnpj) {
	    cnpj = cnpj.replace(/[^\d]+/g,'');
	    
	    if(cnpj == '') {
			return false;
		}
	     
	    if (cnpj.length != 14) {
	        return false;
		}
	 
	    // Elimina CNPJs invalidos conhecidos
	    if (cnpj == "00000000000000" || 
	        cnpj == "11111111111111" || 
	        cnpj == "22222222222222" || 
	        cnpj == "33333333333333" || 
	        cnpj == "44444444444444" || 
	        cnpj == "55555555555555" || 
	        cnpj == "66666666666666" || 
	        cnpj == "77777777777777" || 
	        cnpj == "88888888888888" || 
	        cnpj == "99999999999999") {
	        return false;
		}
	         
	    // Valida DVs
	    var tamanho = cnpj.length - 2
	    var numeros = cnpj.substring(0,tamanho);
	    var digitos = cnpj.substring(tamanho);
	    var soma = 0;
	    var pos = tamanho - 7;
		
	    for (var i = tamanho; i >= 1; i--) {
	      soma += numeros.charAt(tamanho - i) * pos--;
	      if (pos < 2)
	            pos = 9;
	    }
	    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
	    if (resultado != digitos.charAt(0)) {
	        return false;
		}
	         
	    tamanho = tamanho + 1;
	    numeros = cnpj.substring(0,tamanho);
	    soma = 0;
	    pos = tamanho - 7;
	    for (var i = tamanho; i >= 1; i--) {
	      soma += numeros.charAt(tamanho - i) * pos--;
	      if (pos < 2)
	            pos = 9;
	    }
	    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
	    if (resultado != digitos.charAt(1)) {
	          return false;
		}
	    return true;
	}
	
	service.buscaNomesBancos = function(callback) {
		var nomes = [
			'Alvorada Banco de Investimento',
			'654 | Banco A.J.Renner S.A.',
			'246 | Banco ABC Brasil S.A.',
			'75 | Banco ABN AMRO S.A.',
			'Banco Alfa de Investimentos SA',
			'25 | Banco Alfa S.A.',
			'641 | Banco Alvorada S.A.',
			'65 | Banco AndBank (Brasil) S.A.',
			'213 | Banco Arbi S.A.',
			'19 | Banco Azteca do Brasil S.A.',
			'Banco Bandeirantes de Investimentos SA',
			'24 | Banco BANDEPE S.A.',
			'29 | Banco Banerj S.A.',
			'0 | Banco Bankpar S.A.',
			'740 | Banco Barclays S.A.',
			'107 | Banco BBM S.A.',
			'31 | Banco Beg S.A.',
			'122-8 | Banco BERJ S.A.',
			'96 | Banco BM&FBOVESPA de Serviços de Liquidação e Custódia S.A',
			'318 | Banco BMG S.A.',
			'752 | Banco BNP Paribas Brasil S.A.',
			'248 | Banco Boavista Interatlântico S.A.',
			'218 | Banco Bonsucesso S.A.',
			'Banco BPI Investimentos SA',
			'36 | Banco Bradesco BBI S.A.',
			'204 | Banco Bradesco Cartões S.A.',
			'394 | Banco Bradesco Financiamentos S.A.',
			'237 | Banco Bradesco S.A.',
			'225 | Banco Brascan S.A.',
			'Banco BRJ S.A.',
			'208 | Banco BTG Pactual S.A.',
			'44 | Banco BVA S.A.',
			'263 | Banco Cacique S.A.',
			'473 | Banco Caixa Geral - Brasil S.A.',
			'412 | Banco Capital S.A.',
			'40 | Banco Cargill S.A.',
			'Banco Caterpillar S.A.',
			'266 | Banco Cédula S.A.',
			'739 | Banco Cetelem S.A.',
			'233 | Banco Cifra S.A.',
			'745 | Banco Citibank S.A.',
			'0 | Banco Citicard S.A.',
			'241 | Banco Clássico S.A.',
			'0 | Banco CNH Industrial Capital S.A.',
			'215 | Banco Comercial e de Investimento Sudameris S.A.',
			'Banco Commercial Investment Trus do Brasil S.A.',
			'95 | Banco Confidence de Câmbio S.A.',
			'756 | Banco Cooperativo do Brasil S.A. - BANCOOB',
			'748 | Banco Cooperativo Sicredi S.A.',
			'721 | Banco Credibel S.A.',
			'222 | Banco Credit Agricole Brasil S.A.',
			'505 | Banco Credit Suisse (Brasil) S.A.',
			'229 | Banco Cruzeiro do Sul S.A.',
			'Banco CSF S.A.',
			'3 | Banco da Amazônia S.A.',
			'083-3 | Banco da China Brasil S.A.',
			'0 | Banco Daimlerchrysler S.A.',
			'707 | Banco Daycoval S.A.',
			'BANCO DE INVEST TENDENCIA S.A.',
			'BANCO DE INVESTIMENTOS CREDIT SUISSE BRASIL S A - CREDIT SUISSE',
			'300 | Banco de La Nacion Argentina',
			'495 | Banco de La Provincia de Buenos Aires',
			'494 | Banco de La Republica Oriental del Uruguay',
			'0 | Banco de Lage Landen Brasil S.A.',
			'456 | Banco de Tokyo-Mitsubishi UFJ Brasil S.A.',
			'214 | Banco Dibens S.A.',
			'1 | Banco do Brasil S.A.',
			'47 | Banco do Estado de Sergipe S.A.',
			'37 | Banco do Estado do Pará S.A.',
			'39 | Banco do Estado do Piauí S.A. - BEP',
			'41 | Banco do Estado do Rio Grande do Sul S.A.',
			'4 | Banco do Nordeste do Brasil S.A.',
			'265 | Banco Fator S.A.',
			'0 | Banco Fiat S.A.',
			'224 | Banco Fibra S.A.',
			'626 | Banco Ficsa S.A.',
			'Banco Fidis S.A.',
			'Banco Finasa de Investimentos SA',
			'0 | Banco Ford S.A.',
			'Banco Geração Futuro de Investimentos',
			'Banco Gerador S.A.',
			'734 | Banco Gerdau S.A.',
			'0 | Banco GMAC S.A.',
			'612 | Banco Guanabara S.A.',
			'0 | Banco Honda S.A.',
			'63 | Banco Ibi S.A. Banco Múltiplo',
			'0 | Banco IBM S.A.',
			'604 | Banco Industrial do Brasil S.A.',
			'320 | Banco Industrial e Comercial S.A.',
			'653 | Banco Indusval S.A.',
			'630 | Banco Intercap S.A.',
			'77 | Banco Intermedium S.A.',
			'249 | Banco Investcred Unibanco S.A.',
			'Banco Investimentos BMC SA',
			'184 | Banco Itaú BBA S.A.',
			'479 | Banco ItaúBank S.A',
			'Banco Itaucard S.A.',
			'0 | Banco Itaucred Financiamentos S.A.',
			'Banco ITAULEASING S.A.',
			'376 | Banco J. P. Morgan S.A.',
			'74 | Banco J. Safra S.A.',
			'217 | Banco John Deere S.A.',
			'76 | Banco KDB S.A.',
			'757 | Banco KEB do Brasil S.A.',
			'600 | Banco Luso Brasileiro S.A.',
			'243 | Banco Máxima S.A.',
			'0 | Banco Maxinvest S.A.',
			'BANCO MERCANTIL DE INVESTIMENTOS SA',
			'389 | Banco Mercantil do Brasil S.A.',
			'Banco Mercedes-Benz S.A.',
			'370 | Banco Mizuho do Brasil S.A.',
			'746 | Banco Modal S.A.',
			'0 | Banco Moneo S.A.',
			'738 | Banco Morada S.A.',
			'Banco Morada SA',
			'66 | Banco Morgan Stanley S.A.',
			'45 | Banco Opportunity S.A.',
			'79 | Banco Original do Agronegócio S.A.',
			'212 | Banco Original S.A.',
			'Banco Ourinvest',
			'712-9 | Banco Ourinvest S.A.',
			'623 | Banco PAN S.A.',
			'611 | Banco Paulista S.A.',
			'613 | Banco Pecúnia S.A.',
			'094-2 | Banco Petra S.A.',
			'643 | Banco Pine S.A.',
			'Banco Porto Real de Investimentos S.A.',
			'724 | Banco Porto Seguro S.A.',
			'735 | Banco Pottencial S.A.',
			'638 | Banco Prosper S.A.',
			'0 | Banco PSA Finance Brasil S.A.',
			'747 | Banco Rabobank International Brasil S.A.',
			'088-4 | Banco Randon S.A.',
			'356 | Banco Real S.A.',
			'633 | Banco Rendimento S.A.',
			'741 | Banco Ribeirão Preto S.A.',
			'0 | Banco Rodobens S.A.',
			'Banco Rural de Investimentos SA',
			'72 | Banco Rural Mais S.A.',
			'453 | Banco Rural S.A.',
			'422 | Banco Safra S.A.',
			'33 | Banco Santander (Brasil) S.A.',
			'743 | Banco Semear S.A.',
			'749 | Banco Simples S.A.',
			'366 | Banco Société Générale Brasil S.A.',
			'637 | Banco Sofisa S.A.',
			'12 | Banco Standard de Investimentos S.A.',
			'Banco Sudameris Investimento SA',
			'464 | Banco Sumitomo Mitsui Brasileiro S.A.',
			'082-5 | Banco Topázio S.A.',
			'0 | Banco Toyota do Brasil S.A.',
			'634 | Banco Triângulo S.A.',
			'18 | Banco Tricury S.A.',
			'0 | Banco Volkswagen S.A.',
			'0 | Banco Volvo (Brasil) S.A.',
			'655 | Banco Votorantim S.A.',
			'610 | Banco VR S.A.',
			'119 | Banco Western Union do Brasil S.A.',
			'Banco Woori Bank do Brasil S.A.',
			'Banco Yamaha Motor S.A.',
			'21 | BANESTES S.A. Banco do Estado do Espírito Santo',
			'Banif Brasil BI SA',
			'719 | Banif-Banco Internacional do Funchal (Brasil)S.A.',
			'755 | Bank of America Merrill Lynch Banco Múltiplo S.A.',
			'744 | BankBoston N.A.',
			'BB BANCO DE INVESTIMENTO S A - BB',
			'73 | BB Banco Popular do Brasil S.A.',
			'081-7 | BBN Banco Brasileiro de Negócios S.A.',
			'250 | BCV - Banco de Crédito e Varejo S.A.',
			'78 | BES Investimento do Brasil S.A.-Banco de Investimento',
			'BMW Financeira',
			'BNY Mellon Banco S.A.',
			'69 | BPN Brasil Banco Múltiplo S.A.',
			'BR PARTNERS BANCO DE INVESTIMENTO S A',
			'125 | Brasil Plural S.A. - Banco Múltiplo',
			'70 | BRB - Banco de Brasília S.A.',
			'BRB - Crédito',
			'092-2 | Brickell S.A. Crédito',
			'BV Financeira S.A. - CFI',
			'104 | Caixa Econômica Federal',
			'114-7 | Central das Coop. de Economia e Crédito Mutuo do Est. do ES',
			'477 | Citibank S.A.',
			'Companhia de Crédito',
			'136 | CONFEDERACAO NACIONAL DAS COOPERATIVAS CENTRAIS UNICREDS',
			'097-3 | Cooperativa Central de Crédito Noroeste Brasileiro Ltda.',
			'085-x | Cooperativa Central de Crédito Urbano-CECRED',
			'099-x | Cooperativa Central de Economia e Credito Mutuo das Unicreds',
			'090-2 | Cooperativa Central de Economia e Crédito Mutuo das Unicreds',
			'089-2 | Cooperativa de Crédito Rural da Região de Mogiana',
			'087-6 | Cooperativa Unicred Central Santa Catarina',
			'098-1 | CREDIALIANÇA COOPERATIVA DE CRÉDITO RURAL',
			'487 | Deutsche Bank S.A. - Banco Alemão',
			'Finamax S/A C. F. I.',
			'64 | Goldman Sachs do Brasil Banco Múltiplo S.A.',
			'62 | Hipercard Banco Múltiplo S.A.',
			'399 | HSBC Bank Brasil S.A. - Banco Múltiplo',
			'168 | HSBC Finance (Brasil) S.A. - Banco Múltiplo',
			'ICBC DO BRASIL BANCO MULTIPLO S A - ICBC DO BRASIL',
			'492 | ING Bank N.V.',
			'652 | Itaú Unibanco Holding S.A.',
			'341 | Itaú Unibanco S.A.',
			'J. Malucelli',
			'488 | JPMorgan Chase Bank',
			'14 | Natixis Brasil S.A. Banco Múltiplo',
			'753 | NBC Bank Brasil S.A. - Banco Múltiplo',
			'086-8 | OBOE Crédito Financiamento e Investimento S.A.',
			'Omni SA Crédito Financiamento Investimento',
			'254 | Paraná Banco S.A.',
			'Santana S.A. Crédito',
			'Scania Banco S.A.',
			'751 | Scotiabank Brasil S.A. Banco Múltiplo',
			'Standard Chartered Bank (Brasil) S/A–Bco Invest.',
			'Sul Financeira S/A - Crédito',
			'UAM - Assessoria e Gestão',
			'UBS Brasil Banco de Investimento S.A.',
			'409 | UNIBANCO - União de Bancos Brasileiros S.A.',
			'230 | Unicard Banco Múltiplo S.A.',
			'091-4 | Unicred Central do Rio Grande do Sul'
			];
		return nomes;
	}
	
	return service;
}]);
'use strict'

var AuthenticationApp = angular.module('Authentication').controller('LoginController', [
	'$scope',
	'$rootScope',
	'$location',
	'$http',
	'AuthenticationService',
	'AuthenticationRepository',
	'StorageService',
	'NetworkService',
	'SincronizacaoService',
	'blockUI',
	constructor
])

function constructor($scope,
		$rootScope,
		$location,
		$http,
		AuthenticationService,
		AuthenticationRepository,
		StorageService,
		NetworkService,
		SincronizacaoService,
		blockUI) {

	AuthenticationService.ClearCredentials();

	$scope.rememberModel = {
		value : AuthenticationService.getPasswordRemember()
	};
	
	var credentials = null;

	if($scope.rememberModel.value) {
		credentials = AuthenticationService.getCredentialsRemember();
		if(credentials) {
			$scope.login = credentials.user.login;
			$scope.senha = AuthenticationService.getPassword(credentials.authdata);
		}
	}

	$scope.doLogin = function() {
		let login = $scope.login
		let senha = $scope.senha
		//Verificar se e celular
		if (NetworkService.isMobile()) {
			if(NetworkService.isOnline() == NETWORK_STATUS.ONLINE) {
				blockUI.start('Sincronizando dados, Aguarde...')
				SincronizacaoService.sincroniza(login, AuthenticationService.getPasswordEncoded(senha), function(response) {
					if(response) {
						let usuarioLocal = StorageService.getLoginUsuario(login, AuthenticationService.getPasswordEncoded(senha))
						if(usuarioLocal) {
							blockUI.stop()
							AuthenticationService.SetCredentials($scope.senha, $scope.rememberModel.value, usuarioLocal);
							$location.path('/dashboard')
						} else {
							blockUI.stop()
							$scope.mensagem = "Autenticação inválida";
						}
					} else {
						blockUI.stop()
						console.log('erro na sincronização')
					}
				})
			} else {
				let idDb = StorageService.getIdentificadorBancoDados()
				if(idDb && idDb === DATABASE.ID) {
					let usuarioLocal = StorageService.getLoginUsuario(login, AuthenticationService.getPasswordEncoded(senha))
					if(usuarioLocal) {
						AuthenticationService.SetCredentials($scope.senha, $scope.rememberModel.value, usuarioLocal);
						$location.path('/dashboard')
						let dtAtualizacao = StorageService.getDataSincronizacao()
						alert('Você está operando offline no momento. Data última sincronização: ' + moment(dtAtualizacao).format('dddd, DD/M/YYYY'))
					} else {
						$scope.mensagem = "Autenticação inválida";
					}
				} else {
					alert("É necessário efetuar a sincronização com o servidor antes de usar o aplicativo.")
					$location.path('/login')
				}
			}
		} else {
			AuthenticationService.Login($scope.login, AuthenticationService.getPasswordEncoded($scope.senha), function(response) {
				if (response != "") {
					AuthenticationService.SetCredentials($scope.senha, $scope.rememberModel.value, response);
					$location.path('/dashboard')
				} else {
					$scope.mensagem = "Autenticação inválida";
				}
			});
		}
	}
}

AuthenticationApp.directive('restrict', function(AuthenticationService){
	return{
		restrict: 'A',
		prioriry: 100000,
		scope: false,
		link: function(){
		},
		compile:  function(element, attr, linker){
			var accessDenied = true;
			var user = AuthenticationService.getUsuario();
			
			var attributes = attr.access.split(" ");
			for(var i in attributes){
				if(user.perfil.nome === attributes[i]){
					accessDenied = false;
				}
			}
			if(accessDenied){
				element.children().remove();
				element.remove();
			}
		}
	}
});

'use strict'

angular.module('Authentication')

.factory('AuthenticationRepository', ['Base64', '$http', '$rootScope', '$timeout', 'DatabaseService', constructor])

function constructor(Base64, $http, $rootScope, $timeout, DatabaseService) {
	var service = {};

	service.doLogin = function(login, passwordEncoded, callback) {
		DatabaseService.query('SELECT * FROM usuarios WHERE login = ' + login + ' and ' + ' senha = ' + passwordEncoded + ';', 
		function(response) {
			callback(response)
		})
	}
	
	return service;
}
'use strict'

angular.module('Authentication')

.factory('AuthenticationService', ['Base64', '$http', '$rootScope', '$timeout', 'StorageService', 'NetworkService', 'NotificationService',
	function(Base64, $http, $rootScope, $timeout, StorageService, NetworkService, NotificationService) {
		var service = {};
		
		service.ClearCredentials = function() {
			$rootScope.globals = {};
			if(!StorageService.getPasswordRemember()) {
				StorageService.clearUsuarioLogado();	
			}
			$http.defaults.headers.common.Authorization = 'Basic ';
			service.usuario = undefined
		};

		service.Login = (_login, _senha, callback) => {
			const _loginParam = {
				login: _login,
				senha: _senha
			}
			NetworkService.httpPost('/doLogin/', _loginParam, (result, data) => {
				if (result == CALLRESULT.OK) {
					callback(data)
				} else if (result == CALLRESULT.ERROR) {
					NotificationService.error('Erro ao efetuar o login', data);
				} else {
					NotificationService.error('Falha de comunicação com o servidor');
				}
			})
		}

		service.SetCredentials = function(senha, remember, usuario) {
			var authdata = Base64.encode(senha)
			StorageService.resetFiltroAtivo()
			StorageService.resetFiltroPedidoAtivo()
			service.usuario = usuario;

			$rootScope.globals = {
				currentUser: {
					authdata: authdata,
					user : usuario
				}
			};

			$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
			var dataFinal = new Date();
			dataFinal.setDate(dataFinal.getDate() + 30);
			
			if(remember) {
				StorageService.setPasswordRemember(true);
			} else {
				StorageService.setPasswordRemember(false);
			}
			
			StorageService.setUsuarioLogado(authdata, usuario);
		};
		
		service.getUsuario = function() {
			return service.usuario;
		}
		
		service.setUsuario = function(usuario) {
			return service.usuario = usuario;
		}
		
		service.isAdministrador = function() {
			if(!service.usuario) {
				return false
			}
			if(service.usuario.perfil.id === 2) {
				return true;
			}
			return false;
		}
		
		service.isMaster = function() {
			if(!service.usuario) {
				return false
			}
			if(service.usuario.perfil.id === 2) {
				return true;
			}
			return false;
		}
		
		service.isVendedor = function() {
			if(!service.usuario) {
				return false
			}
			if(service.usuario.perfil.id === 1) {
				return true;
			}
			return false;
		}
		
		service.getPasswordRemember = function() {
			return StorageService.getPasswordRemember();
		}
		
		service.getCredentialsRemember = function() {
			return StorageService.getUsuarioLogado();
		}
		
		service.getPassword = function(authdata) {
			return Base64.decode(authdata);
		}
		
		service.getPasswordEncoded = function(password) {
			return Base64.encode(password);
		}
		
		service.getNomeUsuario = function() {
			if(service.usuario) {
				return service.usuario.nome	
			} else {
				""
			}
		}

		return service;
	}
	])

	.factory('Base64', function() {
	/* jshint ignore:start */

	var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	return {
		encode: function(input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			do {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output +
					keyStr.charAt(enc1) +
					keyStr.charAt(enc2) +
					keyStr.charAt(enc3) +
					keyStr.charAt(enc4);
				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			} while (i < input.length);

			return output;
		},

		decode: function(input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			var base64test = /[^A-Za-z0-9\+\/\=]/g;
			if (base64test.exec(input)) {
				window.alert("There were invalid base64 characters in the input text.\n" +
					"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
					"Expect errors in decoding.");
			}
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			do {
				enc1 = keyStr.indexOf(input.charAt(i++));
				enc2 = keyStr.indexOf(input.charAt(i++));
				enc3 = keyStr.indexOf(input.charAt(i++));
				enc4 = keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}

				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";

			} while (i < input.length);

			return output;
		}
	};

	/* jshint ignore:end */
});

'use strict';

var ClienteModulo = angular.module('cliente.module');

ClienteModulo.config(($stateProvider) => {
  var cliente = {
    name: 'main.cliente',
    abstract: true,
    url: '/cliente',
  };
  var pesquisaCliente = {
    name: 'main.cliente.pesquisa',
    url: '/pesquisa',
    component: 'pesquisaClienteComponent'
  }
  var cadastroCliente = {
    name:'main.cliente.cadastro',
    url: 'cadastro',
    component: 'cadastroClienteComponent'
  };
  var  edicaoCliente = {
    name: 'main.cliente.edicao',
    url: 'edicao/:id',
    component: 'cadastroClienteComponent',
    resolve: {
      cliente: ($q) => {
        const deferred = $q.defer();
        return deferred.promisse;
      },
      listaIndustriaCliente: ($q) => {
        const deferred = $q.defer();
        return deferred.promisse;
      }
    }
  };
  $stateProvider.state(cliente);
  $stateProvider.state(pesquisaCliente);
  $stateProvider.state(cadastroCliente);
  $stateProvider.state(edicaoCliente);
});
'use strict';
angular.module('cliente.module', ['ui.router']);
'use strict';

var ClienteModule = angular.module('usuario.module');

ClienteModule.factory('ClienteService', ['HttpService',
  function (HttpService) {
    var service = {};
    const SUBPATH = 'service/cliente';

    const URL_CLIENTE_SALVAR = `${SUBPATH}/salvarCliente`;
    const URL_CLIENTE_POR_LOGIN = `${SUBPATH}/getClientesByLogin`;
    const URL_CLIENTE_POR_FILTRO = `${SUBPATH}/getClientesByFilter`;
    const URL_CLIENTE_EXISTENTE = `${SUBPATH}/getClienteExistente`;
    const URL_CLIENTE_POR_REPRESENTACAO = `${SUBPATH}/getClientesPorRepresentacao`;
    const URL_CLIENTE_EXCLUIR = `${SUBPATH}/excluirCliente`;
    const URL_INDUSTRIA_CLIENTE_BUSCAR_POR_CLIENTE = `${SUBPATH}/buscaIndustriaCliente`;
    const URL_CLIENTE_UPLOAD_ARQUIVO = `${SUBPATH}/uploadArquivoCliente`;
    const URL_CLIENTE_DOWNLOAD_ARQUIVO = `${SUBPATH}/downloadArquivoCliente`;

    service.salvarCliente = (clienteDto) => {
      return HttpService.httpPost(URL_CLIENTE_SALVAR, clienteDto);
    };

    service.getClientesPorLogin = (login) => {
      return HttpService.httpPost(URL_CLIENTE_POR_LOGIN, login);
    };

    service.getClientesPorFiltro = (clienteDto) => {
      return HttpService.httpPost(URL_CLIENTE_POR_FILTRO, clienteDto);
    };

    service.getClientePorCnpj = (cnpj) => {
      return HttpService.httpPost(URL_CLIENTE_EXISTENTE, cnpj);
    };

    service.getClientesPorRepresentacao = (buscaClientesDto) => {
      return HttpService.httpPost(URL_CLIENTE_POR_REPRESENTACAO, buscaClientesDto);
    };

    service.excluirCliente = (idCliente) => {
      return HttpService.httpPost(URL_CLIENTE_EXCLUIR, idCliente);
    };

    service.buscaIndustriaCliente = (idCliente) => {
      return HttpService.httpPost(URL_INDUSTRIA_CLIENTE_BUSCAR_POR_CLIENTE, idCliente);
    };

    service.uploadArquivoCliente = function (files, cpfCnpj, callback, callbackError) {
      service.compactarArquivos(files, (mFileDescriptor) => {
        if (mFileDescriptor) {
          mFileDescriptor.append('cpfCnpj', cpfCnpj)
          $http.post(MODO_HTTP + URL + '/uploadArquivoCliente', mFileDescriptor, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
          })
            .success(function (result) {
              NotificationService.success('Arquivo enviado com sucesso!')
              callback(result);
            })
            .error(function (error) {
              NotificationService.error(error);
              callbackError(error);
            });
        } else {
          NotificationService.error("Não foi possível enviar os arquivos");
        }
      });
    }

    service.uploadArquivoCliente = (files, cpfCnpj) => {
      service.compactarArquivos(files, (mFileDescriptor) => {
        if (mFileDescriptor) {
          let header = { 'Content-Type': undefined };
          let opt = { transformRequest: angular.identity };
          mFileDescriptor.append('cpfCnpj', cpfCnpj);
          return HttpService.httpPost(URL_CLIENTE_UPLOAD_ARQUIVO, mFileDescriptor, null, header, opt);
        };
      });
    };

    service.downloadArquivoCliente = (cpfCnpj, nomeArquivo) => {
      return HttpService.httpGet(URL_CLIENTE_DOWNLOAD_ARQUIVO, {cpfCnpj, nomeArquivo});
    };

    //----------------------------------REFATORAR------------------------------------------------------

    service.compactarArquivos = function (files, callback) {
      var fd = new FormData()
      let cont = 0
      for (var i in files) {
        if (IMAGE_FILE_TYPE.indexOf(files[i].type) > -1) {
          new ImageCompressor(files[i], {
            quality: .8,
            minWidth: 1024,
            maxWidth: 1440 ,
            minHeight: 768,
            maxHeight: 900,
            success(result) {
              fd.append("files", result, result.name);
              cont++
              if (cont == files.length) {
                callback(fd)
              }
            },
            error(e) {
              NotificationService.error(error);
              callback(null)
            }
          })
        } else {
          fd.append("files", files[i]);
          cont++
          if (cont == files.length) {
            callback(fd)
          }
        }
      }
    }

    service.buscaNomesBancos = function() {
      var nomes = [
        'Alvorada Banco de Investimento',
        '654 | Banco A.J.Renner S.A.',
        '246 | Banco ABC Brasil S.A.',
        '75 | Banco ABN AMRO S.A.',
        'Banco Alfa de Investimentos SA',
        '25 | Banco Alfa S.A.',
        '641 | Banco Alvorada S.A.',
        '65 | Banco AndBank (Brasil) S.A.',
        '213 | Banco Arbi S.A.',
        '19 | Banco Azteca do Brasil S.A.',
        'Banco Bandeirantes de Investimentos SA',
        '24 | Banco BANDEPE S.A.',
        '29 | Banco Banerj S.A.',
        '0 | Banco Bankpar S.A.',
        '740 | Banco Barclays S.A.',
        '107 | Banco BBM S.A.',
        '31 | Banco Beg S.A.',
        '122-8 | Banco BERJ S.A.',
        '96 | Banco BM&FBOVESPA de Serviços de Liquidação e Custódia S.A',
        '318 | Banco BMG S.A.',
        '752 | Banco BNP Paribas Brasil S.A.',
        '248 | Banco Boavista Interatlântico S.A.',
        '218 | Banco Bonsucesso S.A.',
        'Banco BPI Investimentos SA',
        '36 | Banco Bradesco BBI S.A.',
        '204 | Banco Bradesco Cartões S.A.',
        '394 | Banco Bradesco Financiamentos S.A.',
        '237 | Banco Bradesco S.A.',
        '225 | Banco Brascan S.A.',
        'Banco BRJ S.A.',
        '208 | Banco BTG Pactual S.A.',
        '44 | Banco BVA S.A.',
        '263 | Banco Cacique S.A.',
        '473 | Banco Caixa Geral - Brasil S.A.',
        '412 | Banco Capital S.A.',
        '40 | Banco Cargill S.A.',
        'Banco Caterpillar S.A.',
        '266 | Banco Cédula S.A.',
        '739 | Banco Cetelem S.A.',
        '233 | Banco Cifra S.A.',
        '745 | Banco Citibank S.A.',
        '0 | Banco Citicard S.A.',
        '241 | Banco Clássico S.A.',
        '0 | Banco CNH Industrial Capital S.A.',
        '215 | Banco Comercial e de Investimento Sudameris S.A.',
        'Banco Commercial Investment Trus do Brasil S.A.',
        '95 | Banco Confidence de Câmbio S.A.',
        '756 | Banco Cooperativo do Brasil S.A. - BANCOOB',
        '748 | Banco Cooperativo Sicredi S.A.',
        '721 | Banco Credibel S.A.',
        '222 | Banco Credit Agricole Brasil S.A.',
        '505 | Banco Credit Suisse (Brasil) S.A.',
        '229 | Banco Cruzeiro do Sul S.A.',
        'Banco CSF S.A.',
        '3 | Banco da Amazônia S.A.',
        '083-3 | Banco da China Brasil S.A.',
        '0 | Banco Daimlerchrysler S.A.',
        '707 | Banco Daycoval S.A.',
        'BANCO DE INVEST TENDENCIA S.A.',
        'BANCO DE INVESTIMENTOS CREDIT SUISSE BRASIL S A - CREDIT SUISSE',
        '300 | Banco de La Nacion Argentina',
        '495 | Banco de La Provincia de Buenos Aires',
        '494 | Banco de La Republica Oriental del Uruguay',
        '0 | Banco de Lage Landen Brasil S.A.',
        '456 | Banco de Tokyo-Mitsubishi UFJ Brasil S.A.',
        '214 | Banco Dibens S.A.',
        '1 | Banco do Brasil S.A.',
        '47 | Banco do Estado de Sergipe S.A.',
        '37 | Banco do Estado do Pará S.A.',
        '39 | Banco do Estado do Piauí S.A. - BEP',
        '41 | Banco do Estado do Rio Grande do Sul S.A.',
        '4 | Banco do Nordeste do Brasil S.A.',
        '265 | Banco Fator S.A.',
        '0 | Banco Fiat S.A.',
        '224 | Banco Fibra S.A.',
        '626 | Banco Ficsa S.A.',
        'Banco Fidis S.A.',
        'Banco Finasa de Investimentos SA',
        '0 | Banco Ford S.A.',
        'Banco Geração Futuro de Investimentos',
        'Banco Gerador S.A.',
        '734 | Banco Gerdau S.A.',
        '0 | Banco GMAC S.A.',
        '612 | Banco Guanabara S.A.',
        '0 | Banco Honda S.A.',
        '63 | Banco Ibi S.A. Banco Múltiplo',
        '0 | Banco IBM S.A.',
        '604 | Banco Industrial do Brasil S.A.',
        '320 | Banco Industrial e Comercial S.A.',
        '653 | Banco Indusval S.A.',
        '630 | Banco Intercap S.A.',
        '77 | Banco Intermedium S.A.',
        '249 | Banco Investcred Unibanco S.A.',
        'Banco Investimentos BMC SA',
        '184 | Banco Itaú BBA S.A.',
        '479 | Banco ItaúBank S.A',
        'Banco Itaucard S.A.',
        '0 | Banco Itaucred Financiamentos S.A.',
        'Banco ITAULEASING S.A.',
        '376 | Banco J. P. Morgan S.A.',
        '74 | Banco J. Safra S.A.',
        '217 | Banco John Deere S.A.',
        '76 | Banco KDB S.A.',
        '757 | Banco KEB do Brasil S.A.',
        '600 | Banco Luso Brasileiro S.A.',
        '243 | Banco Máxima S.A.',
        '0 | Banco Maxinvest S.A.',
        'BANCO MERCANTIL DE INVESTIMENTOS SA',
        '389 | Banco Mercantil do Brasil S.A.',
        'Banco Mercedes-Benz S.A.',
        '370 | Banco Mizuho do Brasil S.A.',
        '746 | Banco Modal S.A.',
        '0 | Banco Moneo S.A.',
        '738 | Banco Morada S.A.',
        'Banco Morada SA',
        '66 | Banco Morgan Stanley S.A.',
        '45 | Banco Opportunity S.A.',
        '79 | Banco Original do Agronegócio S.A.',
        '212 | Banco Original S.A.',
        'Banco Ourinvest',
        '712-9 | Banco Ourinvest S.A.',
        '623 | Banco PAN S.A.',
        '611 | Banco Paulista S.A.',
        '613 | Banco Pecúnia S.A.',
        '094-2 | Banco Petra S.A.',
        '643 | Banco Pine S.A.',
        'Banco Porto Real de Investimentos S.A.',
        '724 | Banco Porto Seguro S.A.',
        '735 | Banco Pottencial S.A.',
        '638 | Banco Prosper S.A.',
        '0 | Banco PSA Finance Brasil S.A.',
        '747 | Banco Rabobank International Brasil S.A.',
        '088-4 | Banco Randon S.A.',
        '356 | Banco Real S.A.',
        '633 | Banco Rendimento S.A.',
        '741 | Banco Ribeirão Preto S.A.',
        '0 | Banco Rodobens S.A.',
        'Banco Rural de Investimentos SA',
        '72 | Banco Rural Mais S.A.',
        '453 | Banco Rural S.A.',
        '422 | Banco Safra S.A.',
        '33 | Banco Santander (Brasil) S.A.',
        '743 | Banco Semear S.A.',
        '749 | Banco Simples S.A.',
        '366 | Banco Société Générale Brasil S.A.',
        '637 | Banco Sofisa S.A.',
        '12 | Banco Standard de Investimentos S.A.',
        'Banco Sudameris Investimento SA',
        '464 | Banco Sumitomo Mitsui Brasileiro S.A.',
        '082-5 | Banco Topázio S.A.',
        '0 | Banco Toyota do Brasil S.A.',
        '634 | Banco Triângulo S.A.',
        '18 | Banco Tricury S.A.',
        '0 | Banco Volkswagen S.A.',
        '0 | Banco Volvo (Brasil) S.A.',
        '655 | Banco Votorantim S.A.',
        '610 | Banco VR S.A.',
        '119 | Banco Western Union do Brasil S.A.',
        'Banco Woori Bank do Brasil S.A.',
        'Banco Yamaha Motor S.A.',
        '21 | BANESTES S.A. Banco do Estado do Espírito Santo',
        'Banif Brasil BI SA',
        '719 | Banif-Banco Internacional do Funchal (Brasil)S.A.',
        '755 | Bank of America Merrill Lynch Banco Múltiplo S.A.',
        '744 | BankBoston N.A.',
        'BB BANCO DE INVESTIMENTO S A - BB',
        '73 | BB Banco Popular do Brasil S.A.',
        '081-7 | BBN Banco Brasileiro de Negócios S.A.',
        '250 | BCV - Banco de Crédito e Varejo S.A.',
        '78 | BES Investimento do Brasil S.A.-Banco de Investimento',
        'BMW Financeira',
        'BNY Mellon Banco S.A.',
        '69 | BPN Brasil Banco Múltiplo S.A.',
        'BR PARTNERS BANCO DE INVESTIMENTO S A',
        '125 | Brasil Plural S.A. - Banco Múltiplo',
        '70 | BRB - Banco de Brasília S.A.',
        'BRB - Crédito',
        '092-2 | Brickell S.A. Crédito',
        'BV Financeira S.A. - CFI',
        '104 | Caixa Econômica Federal',
        '114-7 | Central das Coop. de Economia e Crédito Mutuo do Est. do ES',
        '477 | Citibank S.A.',
        'Companhia de Crédito',
        '136 | CONFEDERACAO NACIONAL DAS COOPERATIVAS CENTRAIS UNICREDS',
        '097-3 | Cooperativa Central de Crédito Noroeste Brasileiro Ltda.',
        '085-x | Cooperativa Central de Crédito Urbano-CECRED',
        '099-x | Cooperativa Central de Economia e Credito Mutuo das Unicreds',
        '090-2 | Cooperativa Central de Economia e Crédito Mutuo das Unicreds',
        '089-2 | Cooperativa de Crédito Rural da Região de Mogiana',
        '087-6 | Cooperativa Unicred Central Santa Catarina',
        '098-1 | CREDIALIANÇA COOPERATIVA DE CRÉDITO RURAL',
        '487 | Deutsche Bank S.A. - Banco Alemão',
        'Finamax S/A C. F. I.',
        '64 | Goldman Sachs do Brasil Banco Múltiplo S.A.',
        '62 | Hipercard Banco Múltiplo S.A.',
        '399 | HSBC Bank Brasil S.A. - Banco Múltiplo',
        '168 | HSBC Finance (Brasil) S.A. - Banco Múltiplo',
        'ICBC DO BRASIL BANCO MULTIPLO S A - ICBC DO BRASIL',
        '492 | ING Bank N.V.',
        '652 | Itaú Unibanco Holding S.A.',
        '341 | Itaú Unibanco S.A.',
        'J. Malucelli',
        '488 | JPMorgan Chase Bank',
        '14 | Natixis Brasil S.A. Banco Múltiplo',
        '753 | NBC Bank Brasil S.A. - Banco Múltiplo',
        '086-8 | OBOE Crédito Financiamento e Investimento S.A.',
        'Omni SA Crédito Financiamento Investimento',
        '254 | Paraná Banco S.A.',
        'Santana S.A. Crédito',
        'Scania Banco S.A.',
        '751 | Scotiabank Brasil S.A. Banco Múltiplo',
        'Standard Chartered Bank (Brasil) S/A–Bco Invest.',
        'Sul Financeira S/A - Crédito',
        'UAM - Assessoria e Gestão',
        'UBS Brasil Banco de Investimento S.A.',
        '409 | UNIBANCO - União de Bancos Brasileiros S.A.',
        '230 | Unicard Banco Múltiplo S.A.',
        '091-4 | Unicred Central do Rio Grande do Sul'
        ];
      return nomes;
    };

    return service;
  }
]);

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
'use strict'

angular.module('ClientesCadastrados')

.factory('ClientesCadastradosService', [ '$http', '$rootScope', 'NetworkService', 'NotificationService',
	function($http, $rootScope, NetworkService, NotificationService) {
		var service = {};
		
		service.clienteParaEditar = null;
		
		service.carregaClientes = function(clienteDto, callback) {
			NetworkService.httpPost('/getClientesByFilter', clienteDto,  (result, data) => {
				if (result == CALLRESULT.OK) {
					callback(data)
				} else if (result == CALLRESULT.ERROR) {
					NotificationService.error('Erro ao buscar dados dos clientes', data);
				} else {
					NotificationService.error('Não foi possível se comunicar com o servidor.');
				}
			})
		}

		service.getClientes = function(clienteDto, callback) {
			NetworkService.httpPost('/getClientesByFilter', clienteDto, (result, data) => {
				if (result == CALLRESULT.OK) {
					callback(data)
				} else if (result == CALLRESULT.ERROR) {
					NotificationService.error('Erro ao buscar dados dos clientes', data);
				} else {
					NotificationService.error('Não foi possível se comunicar com o servidor.');
				}
			})
		}

		service.getClienteExistente = function(clienteExistenteSearchDto, callback) {
			NetworkService.httpPost('/getClienteExistente', clienteExistenteSearchDto, (result, data) => {
				if (result == CALLRESULT.OK) {
					callback(data)
				} else if (result == CALLRESULT.ERROR) {
					NotificationService.error('Erro ao buscar dados dos clientes', data);
				} else {
					NotificationService.error('Não foi possível se comunicar com o servidor.');
				}
			})
		}

		service.getTotalClientes = function(callback) {
			NetworkService.httpGet('/getTotalClientes', (result, data) => {
				if (result == CALLRESULT.OK) {
					callback(data)
				} else if (result == CALLRESULT.ERROR) {
					NotificationService.error('Erro ao buscar dados dos clientes', data);
				} else {
					NotificationService.error('Não foi possível se comunicar com o servidor.');
				}
			})
		}

		service.removerCliente = function(idCliente, callback) {
			NetworkService.httpPost('/excluirCliente', idCliente, (result, data) => {
				if (result == CALLRESULT.OK) {
					callback(data)
				} else if (result == CALLRESULT.ERROR) {
					NotificationService.error('Erro ao buscar dados dos clientes', data);
				} else {
					NotificationService.error('Não foi possível se comunicar com o servidor.');
				}
			})
		}
		
		service.getNumeroClientesPendentes = function(callback) {
			NetworkService.httpGet('/getNumeroClientesPendentes', (result, data) => {
				if (result == CALLRESULT.OK) {
					callback(data)
				} else if (result == CALLRESULT.ERROR) {
					NotificationService.error('Erro ao buscar dados dos clientes', data);
				} else {
					NotificationService.error('Não foi possível se comunicar com o servidor.');
				}
			})
		}

		//VERIFICAR COMO TRABALHAR USANDO NETWORKSERVICE
		service.getClientes = function(clienteDto) {
			return $http.post(MODO_HTTP + URL + '/getClientesByFilter/', clienteDto)
		}
		
		return service;
}]);
'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').factory('ConsoleService', [
	'$http',
	'$rootScope',
	constructor,
])

function constructor($http, $rootScope) {
	var service = {};

	service.startLog = function() {
		document.addEventListener("deviceready", onDeviceReady, false);
		function onDeviceReady() {
			console.log("console.log works well");
		}
	}

	return service;
}
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

'use strict';

angular.module('Menu')

.factory('MenuService', ['$http', '$rootScope', 
    function($http, $rootScope){
		var service = {};
		/*modo = 1 : Cadastro*/
		/*modo = 2 : Detalhe*/
		/*modo = 3 : Tabela */
		service.modo = null;
		
		service.modoCadastro = function() {
			return service.modo == 1;
		}
		
		service.modoDetalhe = function() {
			return service.modo == 2;
		}
		
		service.modoTabela = function() {
			return service.modo == 3;
		}
		
		service.setModoCadastro = function() {
			return service.modo = 1;
		}
		
		service.setModoDetalhe = function() {
			return service.modo = 2;
		}
		
		service.setModoTabela = function() {
			return service.modo = 3;
		}
		
		return service;
	}
]);
'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').factory('DatabaseService', [
	'$http',
	'$rootScope',
	constructor,
])

function constructor($http, $rootScope) {
	var service = {};

	service.startDatabase = function() {
		document.addEventListener('deviceready', function() {
			var db = window.sqlitePlugin.openDatabase({name: 'test.db', location: 'default'});
			alert(db)
			db.transaction(function(tr) {
				tr.executeSql('SELECT upper(?) AS upperString', ['Test string'], function(tr, rs) {
					alert('Got upperString result: ' + rs.rows.item(0).upperString);
				});
			}, function(erro) {
				alert('error ao abrir dabaase')
			});
		});
	}

	return service;
}
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

'use strict';

angular.module('DetalhePedido')

.factory('DetalhePedidoService', [ '$http', '$rootScope', 'PedidoProdutosService', 'NetworkService', 'NotificationService',
	function($http, $rootScope, PedidoProdutosService, NetworkService, NotificationService) {
	var service = {};
	
	service.itens = [];
	
	service.setItens = function(itens) {
		service.itens = itens;
	}

	service.buscaVendedores = function(industria, callback) {
		NetworkService.httpPost('/getVendedoresPorIndustria', industria.id, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar dados dos clientes', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.buscaPedidos = function(pedidoSearch, callback) {
		if(!pedidoSearch.idUsuario && pedidoSearch.isVendedor) {
			NotificationService.error('Não foi possível se comunicar com o servidor.');
			return
		}
		NetworkService.httpPost('/getPedidosPorCriteria', pedidoSearch, function(result, data) {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar pedidos', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.getListaStatusPedido = function(callback) {
		NetworkService.httpGet('/getListaStatusPedido', (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar pedidos', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}
	
	service.setPedido = function(pedido) {
		service.pedido = pedido;
	}
	
	service.getPedido = function() {
		return service.pedido;
	}
	
	service.pushVendedor = function(vendedor) {
		service.vendedor = vendedor;
	}
	
	service.popVendedor = function(callback) {
		var aux = service.vendedor;
		service.vendedor = undefined;
		callback(aux);
	}
	
	service.getTotalItensPedido = function() {
		let total = 0
		if(service.pedido.itensPedido) {
			for(var i = 0; i < service.pedido.itensPedido.length; i++) {
				total += service.pedido.itensPedido[i].quantidadeSolicitada
			}
		}
		return total
	}
	
	service.getTotalPedido = function() {
		let total = 0
		if(service.pedido.itensPedido) {
			for(var i = 0; i < service.pedido.itensPedido.length; i++) {
				let pedido = service.pedido.itensPedido[i]
				total += PedidoProdutosService.calculaPrecoItemSemStListaPedidos(pedido) * pedido.quantidadeSolicitada
			}
		}
		return total
	}

	service.getTotalPedidoSemSt = function(pedido) {
		let total = 0
		if(pedido.itensPedido) {
			for(var i = 0; i < pedido.itensPedido.length; i++) {
				let item = pedido.itensPedido[i]
				total += PedidoProdutosService.calculaPrecoItemSemStListaPedidos(item) * item.quantidadeSolicitada
			}
		}
		return total
	}

	return service;
}]);
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

'use strict';

angular.module('DetalhePedidoSalvo')

.factory('DetalhePedidoSalvoService', [ '$http', '$rootScope', 'StorageService',  function($http, $rootScope, StorageService) {
	var service = {};
	
	service.itens = [];
	
	service.setItens = function(itens) {
		service.itens = itens;
	}

	service.buscaVendedores = function(industria, callback) {
		NetworkService.httpPost('/getVendedoresPorIndustria', industria.id, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar dados dos vendedores', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.buscaPedidos = function(pedidoSearch, callback) {
		let pedidos = StorageService.getPedidosSalvo()
		callback(pedidos)
	}

	service.getListaStatusPedido = function(callback) {
		NetworkService.httpPost('/getListaStatusPedido', (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar lista status pedido', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}
	
	service.setPedido = function(pedido) {
		service.pedido = pedido;
	}
	
	service.getPedido = function() {
		return service.pedido;
	}
	
	service.pushVendedor = function(vendedor) {
		service.vendedor = vendedor;
	}
	
	service.popVendedor = function(callback) {
		var aux = service.vendedor;
		service.vendedor = undefined;
		callback(aux);
	}
	return service;
}]);
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

'use strict';
var IndustriaModule = angular.module('industria.module');

IndustriaModule.config(function($stateProvider) {
  var industria = {
    name: 'main.industria',
    url: '/industria',
    abstract: true,
  };
  var cadastroPrazo = {
    name: 'main.industria.prazo',
    url: '/cadastro-prazo',
    component: 'cadastroPrazoComponent',
    resolve: {
      listaIndustrias: function (IndustriaService) {
        return IndustriaService.getIndustrias();
      },
    }
  };
  $stateProvider.state(industria);
  $stateProvider.state(cadastroPrazo);
});


'use strict';
angular.module('industria.module', ['ui.router']);
'use strict';

var IndustriaModule = angular.module('industria.module');

IndustriaModule.factory('IndustriaService', ['HttpService',
  function (HttpService) {
    var service = {};
    const SUBPATH = 'service/industria';

    const URL_INDUSTRIA_BUSCAR_INDUSTRIA_POR_ID_USUARIO = `${SUBPATH}/getIndustriasUsuario`;
    const URL_INDUSTRIA_BUSCAR_INDUSTRIA = `${SUBPATH}/getIndustrias`;

    service.getIndustriasByIdUsuario = (idUsuario) => {
      return HttpService.httpPost(URL_INDUSTRIA_BUSCAR_INDUSTRIA_POR_ID_USUARIO, idUsuario);
    };

    service.getIndustrias = () => {
      return HttpService.httpGet(URL_INDUSTRIA_BUSCAR_INDUSTRIA);
    };

    return service;
  }
]);

'use strict';
angular.module('industria.prazo.module', []);
'use strict';

var PedidoModule = angular.module('industria.prazo.module');

PedidoModule.factory('IndustriaPrazoService', ['HttpService',
  function (HttpService) {
    var service = {};
    const SUBPATH = 'service/industriaprazo';

    const URL_INDUSTRIA_PRAZO_SALVAR = `${SUBPATH}/salvaIndustriaPrazo`;
    const URL_INDUSTRIA_PRAZO_BUSCAR_POR_INDUSTRIA = `${SUBPATH}/getIndustriaPrazo`;
    const URL_INDUSTRIA_PRAZO_BUSCAR_POR_ID = `${SUBPATH}/getIndustriaPrazoById`;
    const URL_INDUSTRIA_PRAZO_CLIENTE = `${SUBPATH}/getIndustriaPrazoOuIndustriaClientePrazo`;
    const URL_INDUSTRIA_PRAZO_REMOVER = `${SUBPATH}/removerIndustriaPrazo`;
    const URL_INDUSTRIA_PRAZO_POR_INDUSTRIA_CLIENTE = `${SUBPATH}/getIndustriaClientePrazoPorIdIndustriaCliente`;

    service.salvaIndustriaPrazo = (industriaPrazoDto) => {
      return HttpService.httpPost(URL_INDUSTRIA_PRAZO_SALVAR, industriaPrazoDto);
    };

    service.getIndustriaPrazo = (idIndustria) => {
      return HttpService.httpGet(URL_INDUSTRIA_PRAZO_BUSCAR_POR_INDUSTRIA, {idIndustria});
    };

    service.getIndustriaPrazoById = (idIndustriaPrazo) => {
      return HttpService.httpGet(URL_INDUSTRIA_PRAZO_BUSCAR_POR_ID, idIndustriaPrazo);
    };

    service.getIndustriaPrazoClientePrazo = (industriaPrazoSearchDto) => {
      return HttpService.httpPost(URL_INDUSTRIA_PRAZO_CLIENTE, industriaPrazoSearchDto);
    };

    service.removerIndustriaPrazo = (idIndustriaPrazo) => {
      return HttpService.httpGet(URL_INDUSTRIA_PRAZO_REMOVER, {idIndustriaPrazo});
    };

    service.getIndustriaClientePrazoPorIdIndustriaCliente = () => {
      return HttpService.httpGet(URL_INDUSTRIA_PRAZO_POR_INDUSTRIA_CLIENTE);
    };

    return service;
  }
]);
'use strict'

angular.module('CadastroClientes').factory('IndustriaClientePrazoService', ['NetworkService', 'NotificationService', constructor])

function constructor(NetworkService, NotificationService) {
  let service = {};
  service.getIndustriaClientePrazoPorIdIndustriaCliente = function(idIndustriaCliente, callback) {
    NetworkService.httpGet('/getIndustriaClientePrazoPorIdIndustriaCliente?idIndustriaCliente=' + idIndustriaCliente, (result, data) => {
      if (result == CALLRESULT.OK) {
        callback(data)
      } else if (result == CALLRESULT.ERROR) {
        NotificationService.error('Erro ao buscar prazos do cliente na indústria', data);
      } else {
        NotificationService.error('Falha! Deve-se implementar busca de dados local');
      }
    })
  }

  service.getIndustriaPrazoOuIndustriaClientePrazo = function(idIndustria, idCliente, callback) {
    NetworkService.httpPost('/getIndustriaPrazoOuIndustriaClientePrazo/', {idIndustria: idIndustria, idCliente: idCliente}, (result, data) => {
      if (result == CALLRESULT.OK) {
        callback(data)
      } else if (result == CALLRESULT.ERROR) {
        NotificationService.error('Erro ao buscar prazos do cliente na indústria', data);
      } else {
        NotificationService.error('Falha! Deve-se implementar busca de dados local');
      }
    })
  }
  return service;
}
'use strict'
angular.module('Industrias').controller('IndustriasController', ['$scope', 'IndustriasService', 'NotificationService', 'ModalService', constructor])

function constructor($scope, service, NotificationService, ModalService) {

  $scope.industria = {}
  $scope.listaPrazoDia = []
  $scope.listaPrazo = []
  $scope.diaSelecionado = {
    dia: undefined
  }

  $scope.prazoDia = {
    prazo: undefined,
  }

  $scope.industriaPrazoDto = {
    dias: []
  }

  inicializaDados()

  service.getIndustrias(function (result) {
    $scope.listaIndustrias = result
  })

  $scope.adicionaDia = function () {
    let existe = $.grep($scope.listaPrazoDia, function(item, index) {
      return item === $scope.prazoDia.prazo
    })
    if(existe.length > 0) {
      return
    } else {
      $scope.listaPrazoDia.push($scope.prazoDia.prazo)
      $scope.prazoDia.prazo = undefined
    }
  }

  $scope.buscaDias = function (prazo) {
    let strDias = ""
    if (prazo && prazo.dias) {
      prazo.dias.forEach(element => {
        if (strDias.length == 0) {
          strDias = element.prazo
        } else {
          strDias = `${strDias} - ${element.prazo}`
        }
      })
    }
    return strDias
  }

  $scope.carregaDadosIndustria = function (industria) {
    $scope.industriaPrazoDto.idIndustria = industria.id

    service.getPrazosIndustria(industria.id, function (result) {
      $scope.listaPrazo = result
    })
  }

  $scope.salvar = function () {
    if(!$scope.listaPrazoDia || $scope.listaPrazoDia.length < 1) {
      NotificationService.error('É necessário fornecer ao menos um dia!')
      return
    }
    $scope.listaPrazoDia.forEach(element => {
      const industriaPrazoDiaDto = {
        prazo: element
      }
      $scope.industriaPrazoDto.dias.push(industriaPrazoDiaDto)
    })
    service.salvaIndustriaPrazo($scope.industriaPrazoDto, function () {
      NotificationService.success('Prazos da indústria atualizado com sucesso!');
      atualizaListaPrazos()
      inicializaDados()
    })
  }

  $scope.removerDia = function () {
    $scope.listaPrazoDia = $.grep($scope.listaPrazoDia, function (value) {
      return value !== $scope.diaSelecionado.dia
    })
  }

  $scope.excluirPrazosIndustria = function (idPrazoIndustria) {
    var modalOptions = {
      closeButtonText: 'Não',
      actionButtonText: 'Sim',
      headerText: 'Confirmar',
      bodyText: 'Confirma EXCLUSÃO do prazo para a indústria?'
    }
    ModalService.showModal({}, modalOptions).then(function (result) {
      service.excluirPrazosIndustria(idPrazoIndustria, function () {
        NotificationService.success('Prazo excluído com sucesso!');
        atualizaListaPrazos()
      }), function () {
        NotificationService.error('Erro ao excluir prazo!!');
        atualizaListaPrazos()
      }
    })
  }

  function atualizaListaPrazos() {
    $scope.carregaDadosIndustria($scope.industria.selecionado)
  }

  function inicializaDados() {
    $scope.industriaPrazoDto.dias = []
    $scope.industriaPrazoDto.codigo = undefined
    $scope.industriaPrazoDto.descricao = undefined
    $scope.listaPrazoDia = []
  }

}

'use strict'

angular.module('Industrias')

	.factory('IndustriasService', ['$http', '$rootScope', 'NetworkService', 'NotificationService', 'StorageService',
		function ($http, $rootScope, NetworkService, NotificationService, StorageService) {
			var service = {};
			var industriaSelecionada = null;

			service.setIndustria = function (industria) {
				industriaSelecionada = industria;
			}

			service.getIndustria = function () {
				return industriaSelecionada;
			}

			service.getIndustriaCliente = function (idIndustria, idCliente, callback) {
				NetworkService.httpPost('/getIndustriaCliente/', { idIndustria: idIndustria, idCliente: idCliente }, function (result, data) {
					if (result == CALLRESULT.OK) {
						callback(data)
					} else if (result == CALLRESULT.ERROR) {
						NotificationService.error('Erro ao buscar indústrias do cliente', data);
					} else {
						NotificationService.error('Falha de comunicação com o servidor');
					}
				})
			}

			service.getTabelasIndustria = function (idIndustria, callback) {
				NetworkService.httpPost('/getTabelasPorIndustria/', idIndustria, function (result, data) {
					if (result == CALLRESULT.OK) {
						callback(data)
					} else if (result == CALLRESULT.ERROR) {
						NotificationService.error('Erro ao buscar tabelas da indústria', data);
					} else {
						callback(StorageService.getTabelasIndustria(idUsuario))
					}
				})
			}

			service.getIndustriasUsuario = function (idUsuario, callback) {
				NetworkService.httpPost('/getIndustriasUsuario/', idUsuario, function (result, data) {
					if (result == CALLRESULT.OK) {
						callback(data)
					} else if (result == CALLRESULT.ERROR) {
						NotificationService.error('Erro ao buscar indústrias', data);
					} else {
						callback(StorageService.getIndustriasUsuario(idUsuario))
					}
				})
			}

			service.getIndustrias = function (callback) {
				NetworkService.httpGet('/getIndustrias/', function (result, data) {
					if (result == CALLRESULT.OK) {
						callback(data)
					} else if (result == CALLRESULT.ERROR) {
						NotificationService.error('Erro ao buscar indústrias', data);
					} else {
						NotificationService.error('Não foi possível se comunicar com o servidor.');
					}
				})
			}

			service.salvaIndustriaPrazo = function (industriaPrazoDto, callback) {
				NetworkService.httpPost('/salvaIndustriaPrazo', industriaPrazoDto, function (result, data) {
					if (result == CALLRESULT.OK) {
						callback(data)
					} else if (result == CALLRESULT.ERROR) {
						NotificationService.error('Erro ao buscar prazos das indústrias', data);
					} else {
						NotificationService.error('Não foi possível se comunicar com o servidor.');
					}
				})
			}

			service.getPrazosIndustria = function (idIndustria, callback) {
				NetworkService.httpGet('/getIndustriaPrazo/?idIndustria=' + idIndustria, function (result, data) {
					if (result == CALLRESULT.OK) {
						callback(data)
					} else if (result == CALLRESULT.ERROR) {
						NotificationService.error('Erro ao buscar prazos das indústrias', data);
					} else {
						NotificationService.error('Não foi possível se comunicar com o servidor.');
					}
				})
			}

			service.excluirPrazosIndustria = function (idIndustriaPrazo, callback) {
				NetworkService.httpGet('/removerIndustriaPrazo/?idIndustriaPrazo=' + idIndustriaPrazo, function (result, data) {
					if (result == CALLRESULT.OK) {
						callback(data)
					} else if (result == CALLRESULT.ERROR) {
						NotificationService.error('Erro ao excluir prazos das indústrias', data);
					} else {
						NotificationService.error('Não foi possível se comunicar com o servidor.');
					}
				})
			}

			return service;
		}
	]);
'use strict'

angular.module('DetalhePedidoItens').factory('IndustriaPrazoService', ['NetworkService', 'NotificationService', constructor])

function constructor(NetworkService, NotificationService) {
  let service = {};
  service.getIndustriaPrazoPorId = function(idIndustriaPrazo, callback) {
    NetworkService.httpGet('/getIndustriaPrazoById?idIndustriaPrazo=' + idIndustriaPrazo, (result, data) => {
      if (result == CALLRESULT.OK) {
        callback(data)
      } else if (result == CALLRESULT.ERROR) {
        NotificationService.error('Erro ao buscar prazo da indústria', data);
      } else {
        NotificationService.error('Falha! Deve-se implementar busca de dados local');
      }
    })
  }
  return service;
}
'use strict';
angular.module('Item')
.controller('ItemController', ['$scope', '$rootScope', '$location', '$http', function($scope, $rootScope, $location, $http) {
	
}]);
'use strict';

angular.module('PedidoProdutos')
'use strict';

angular.module('GerenciadorFinanceiroFlechaVendas')

.factory('MapperService', [ '$http', '$rootScope', function($http, $rootScope) {
	var service = {};
	
	return service;
}]);
angular.module('ModalApp', ['ui.bootstrap']).service('ModalService', ['$uibModal',
    function ($uibModal) {
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'modules/modal/modal.html'
        };

        var modalOptions = {
            closeButtonText: 'Cancelar',
            actionButtonText: 'Confirmar',
            headerText: 'Continua?',
            bodyText: 'Executar esta ação?',
            bodyDataList: [],
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                    $scope.selectedOption = null //Item atualmente selecionado
                    $scope.selectedElement = null //Elemento atualmente selecionado
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                    	$uibModalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                    	$uibModalInstance.dismiss('cancel');
                    };
                    $scope.selecionaTodos = false
                    $scope.selectLine = function ($event) {
                        let element = $event.currentTarget
                        if(!element) {
                            return
                        }
                        if(!$scope.selectedElement) {
                            selectLine(element)
                        } else {
                            if($scope.selectedElement == element) {
                                desselectLine($scope.selectedElement)
                            } else {
                                desselectLine()
                                selectLine(element)
                            }
                        }
                    }
                    $scope.pesquisa = null
                    $scope.filtroClientes = function(item) {
                        if($scope.pesquisa) {
                            return item.nome.indexOf($scope.pesquisa.toUpperCase()) !== -1
                        } else {
                            return true
                        }
                    }
                    function selectLine(element) {
                        $scope.selectedElement = element
                        $scope.selectedOption = element.dataset.item;
                        element.style.backgroundColor = 'rgb(255,200,200)';
                    }
                    function desselectLine() {
                        $scope.selectedElement.style.backgroundColor = null
                        $scope.selectedElement = null
                        $scope.selectedOption = null
                    }

                    $scope.marcarTodos = function() {
                        $scope.selecionaTodos = !$scope.selecionaTodos
                        $scope.modalOptions.bodyDataList.forEach(element => {
                            element.listaCliente.forEach(cliente => {
                                cliente.importar = $scope.selecionaTodos
                            })
                        });
                    }
                }
            }
            return $uibModal.open(tempModalDefaults).result;
        };

    }]);
'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas')

.factory('LocalStorageService', [ '$http', '$rootScope', function($http, $rootScope) {
  let service = {}

  service.getData = function(itemName) {
  	if(localStorage.getItem(itemName) !== 'undefined') {
			return JSON.parse(localStorage.getItem(itemName))
		} else {
			return undefined
		}
  }

  service.setData = function(itemName, data) {
    if(data) {
		  localStorage.setItem(itemName, JSON.stringify(data))
    }
  }

  service.eraseData = function(itemName) {
    localStorage.removeItem(itemName)
  }

  service.resetData = function(id) {
    if(DATABASE.ID === id) {
      localStorage.clear()
    }
  }

  return service
}])
'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').factory('NetworkService', [
	'$http',
	'$rootScope',
	'$timeout',
	'blockUI',
	constructor,
])

function constructor($http, $rootScope, $timeout, blockUI) {
	var service = {};

	service.startNetworkMonitor = function() {
		if(service.isMobile()) {
			document.addEventListener('online', function() {
				NETWORK.STATUS = NETWORK_STATUS.ONLINE
				$rootScope.$apply();
			}, false);
			document.addEventListener('offline', function() {
				NETWORK.STATUS = NETWORK_STATUS.OFFNLINE
				$rootScope.$apply();
			}, false);

			NETWORK.STATUS = service.isOnline()
		}
	}

	service.getNetworkStatus = function() {
		return NETWORK.STATUS
	}

	service.isOnline = function() {
		if(navigator.connection.type != Connection.UNKNOWN && navigator.connection.type != Connection.NONE) {
			$rootScope.globals.online = true
			return NETWORK_STATUS.ONLINE
		} else {
			$rootScope.globals.online = false
			return NETWORK_STATUS.OFFNLINE
		}
	}

	service.isMobile = function() {
		// return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)
		return false
	}

	service.httpPost = function(path, param, callback) {
		blockUI.start()
		$timeout(callAtTimeout, TIMEOUT)
		const opt = {'timeout' : TIMEOUT }
		$http.post(MODO_HTTP + URL + path, param, opt)
			.success(function (response) {
				callback(CALLRESULT.OK, response)
			})
			.error(function(error) {
				if(error) {
					callback(CALLRESULT.ERROR, error)
				} else {
					callback(CALLRESULT.UNKNOWN, null)
				}
			})
			.finally(function() {
				blockUI.stop()
			})
	}

	service.httpGet = function(path, callback) {
		blockUI.start()
		//$timeout(callAtTimeout, TIMEOUT)
		const opt = {'timeout' : TIMEOUT }
		$http.get(MODO_HTTP + URL + path, opt)
			.success(function (response) {
				callback(CALLRESULT.OK, response)
			})
			.error(function(error) {
				if(error) {
					callback(CALLRESULT.ERROR, error)
				} else {
					callback(CALLRESULT.UNKNOWN, null)
				}
			})
			.finally(function() {
				blockUI.stop()
			})
	}

	function callAtTimeout() {
		blockUI.stop()
	}

	return service;
}

'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').factory('ObservacaoService', [
  '$http',
  'NetworkService',
  'NotificationService',
	constructor,
])

function constructor($http, NetworkService, NotificationService) {
  var service = {};

  service.getObservacoesPedido = function(idPedido, callback) {
    NetworkService.httpGet(`/getObservacoesPedido/?idPedido=${idPedido}`, function (result, data) {
      if (result == CALLRESULT.OK) {
        callback(data)
      } else if (result == CALLRESULT.ERROR) {
        NotificationService.error('Erro ao buscar observações do pedido', data);
      } else {
        NotificationService.error('Falha de comunicação com o servidor');
      }
    })
  }

  service.atualizaObservacoes = function(observacaoPedidoUpdateDto, callback) {
    NetworkService.httpPost('/setObservacoesPedido', observacaoPedidoUpdateDto,function (result, data) {
      if (result == CALLRESULT.OK) {
        callback(data)
      } else if (result == CALLRESULT.ERROR) {
        NotificationService.error('Erro ao salvar observações do pedido', data);
      } else {
        NotificationService.error('Falha de comunicação com o servidor');
      }
    })
  }

	return service;
}

'use strict';

var PedidoModule = angular.module('pedido.module');

PedidoModule.factory('PedidoCalculoService', ['$filter',
  function ($filter) {

    var service = {};

    service.getValorTotalPedido = function (pedido) {
      let total = 0;
      $filter('itensAdicionadosFilter', null)(pedido.tabela.itens).forEach(item => {
        total += item.precoComImposto * item.quantidadeSolicitada;
      });
      return total;
    }

    service.getValorTotalPedidoSemImposto = function (pedido) {
      let total = 0;
      $filter('itensAdicionadosFilter', null)(pedido.tabela.itens).forEach(item => {
        total += item.precoSemImposto * item.quantidadeSolicitada;
      });
      return total;
    }

    service.getTotalItens = function (pedido) {
      let total = 0;
      $filter('itensAdicionadosFilter', null)(pedido.tabela.itens).forEach(item => {
        total += item.quantidadeSolicitada;
      });
      return total;
    }

    service.getValorImposto = function (item) {
      return item.preco * (item.st + item.ipi);
    }

    service.getValorDesconto = function (item) {
      return item.preco * item.desconto;
    }

    service.alteraPrecoSemImposto = function (item) {
      let diferenca = item.preco - item.precoSemImposto;
      let desconto = diferenca / item.preco;
      item.desconto = desconto;
      item.precoComImposto = item.precoSemImposto + item.valorImposto;
      item.precoUnitarioComImposto = item.precoComImposto / item.quantidade;
      item.precoUnitarioSemImposto = item.precoSemImposto / item.quantidade;
    }

    service.alteraPrecoComImposto = function (item) {
      let diferenca = item.preco + item.valorImposto - item.precoComImposto;
      let desconto = diferenca / (item.preco + item.valorImposto);
      item.desconto = desconto;
      item.precoSemImposto = item.precoComImposto - item.valorImposto;
      item.precoUnitarioComImposto = item.precoComImposto / item.quantidade;
      item.precoUnitarioSemImposto = item.precoSemImposto / item.quantidade;
    }

    service.alteraDesconto = function (item) {
      item.precoComImposto = item.preco - service.getValorDesconto(item) + service.getValorImposto(item);
      item.precoSemImposto = item.preco - service.getValorDesconto(item);
      item.precoUnitarioComImposto = item.precoComImposto / item.quantidade;
      item.precoUnitarioSemImposto = item.precoSemImposto / item.quantidade;
    }

    service.inicializaPreco = function (item) {
      if (!item.desconto) {
        item.desconto = 0;
      }
      if (!item.quantidadeSolicitada) {
        item.quantidadeSolicitada = 1;
      }
      item.valorImposto = service.getValorImposto(item);
      item.precoComImposto = item.preco + item.valorImposto - service.getValorDesconto(item);
      item.precoSemImposto = item.preco - service.getValorDesconto(item);
      item.precoUnitarioComImposto = item.precoComImposto / item.quantidade;
      item.precoUnitarioSemImposto = item.precoSemImposto / item.quantidade;
    }

    return service;
  }
]);
'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.config(($stateProvider) => {
  var pedido = {
    name: 'main.pedido',
    url: '/pedido',
    abstract: true
  };
  var cadastroPedido = {
    name: 'main.pedido.cadastro',
    url: '/cadastro',
    abstract: true
  };
  var cadastroPedidoDados = {
    name: 'main.pedido.cadastro.dados',
    url: '/dados-pedido',
    component: 'dadosPedidoComponent',
    resolve: {
      listaIndustrias: function (IndustriaService, auth) {
        return IndustriaService.getIndustriasByIdUsuario(auth.id);
      },
    }
  };
  var edicaoPedidoDados = {
    name: 'main.pedido.cadastro.edicao',
    url: '/edicao',
    component: 'edicaoPedidoComponent',
    resolve: {
      pedido: (PedidoService) => {
        return PedidoService.getPedidoAtivo();
      }
    },
  };
  var pedidoItens = {
    name: 'main.pedido.cadastro.itens',
    url: '/itens-pedido',
    component: 'itensPedidoComponent',
    resolve: {
      pedido: (PedidoService) => {
        return PedidoService.getPedidoAtivo();
      }
    }
  };
  var pedidoResumo = {
    name: 'main.pedido.cadastro.resumo',
    url: '/resumo-pedido',
    component: 'resumoPedidoComponent',
    resolve: {
      pedido: (PedidoService) => {
        return PedidoService.getPedidoAtivo();
      }
    }
  };
  var pesquisaPedido = {
    name: 'main.pedido.pesquisa',
    url: '/pesquisa',
    component: 'pesquisaPedidoComponent',
    resolve: {
      listaIndustrias: function (IndustriaService, auth) {
        return IndustriaService.getIndustriasByIdUsuario(auth.id);
      },
    }
  };
  $stateProvider.state(pedido);
  $stateProvider.state(cadastroPedido);
  $stateProvider.state(cadastroPedidoDados);
  $stateProvider.state(pedidoItens);
  $stateProvider.state(pedidoResumo);
  $stateProvider.state(edicaoPedidoDados);
  $stateProvider.state(pesquisaPedido);
});
'use strict';

var PedidoModule = angular.module('pedido.module');

PedidoModule.directive('percent', function ($filter) {
  var p = function (viewValue) {
    if (!viewValue) {
      viewValue = "0"
    }
    return parseFloat(viewValue) / 100
  };

  var f = function (modelValue) {
    return $filter('number')(parseFloat(modelValue) * 100, 2)
  };

  return {
    require: 'ngModel',
    link: function (scope, ele, attr, ctrl) {
      ctrl.$parsers.unshift(p)
      ctrl.$formatters.unshift(f)
    }
  };
});
'use strict';

var PedidoModule = angular.module('pedido.module');

PedidoModule.filter('itensAdicionadosFilter', function () {
  return function (items) {
    var out = [];

    if (angular.isArray(items)) {

      items.forEach(function (item) {
        var itemMatches = false;

        if (item.hasOwnProperty('inserido')) {
          itemMatches = true
        }
        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      out = items;
    }

    return out;
  };
});

PedidoModule.filter('itensNaoAdicionadosFilter', function () {
  return function (items) {
    var out = [];

    if (angular.isArray(items)) {

      items.forEach(function (item) {
        var itemMatches = true;

        if (item.hasOwnProperty('inserido')) {
          itemMatches = false
        }
        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      out = items;
    }

    return out;
  };
});

PedidoModule.filter('percentage', ['$filter', function($filter){
  return function(input) {
    if(input !== undefined) {
      return $filter('number')(input * 100) + '%';
    } else {
      return null;
    }
  };
}]);

'use strict';
angular.module('pedido.module', ['ui.router', 'ngAnimate', 'ui.bootstrap']);

'use strict';

var PedidoModule = angular.module('pedido.module');

PedidoModule.factory('PedidoService', ['HttpService',
  function (HttpService) {
    var service = {};
    const SUBPATH = 'service/pedido';

    const URL_PEDIDO_SALVAR = `${SUBPATH}/salvaPedido`;
    const URL_PEDIDO_ATUALIZAR_STATUS = `${SUBPATH}/atualizarStatusPedido`;
    const URL_PEDIDO_BUSCAR_POR_CRITERIA = `${SUBPATH}/getPedidosPorCriteria`;
    const URL_PEDIDO_BUSCAR_ITENS = `${SUBPATH}/getItensPedido`;
    const URL_PEDIDO_BUSCAR_PEDIDO_POR_ID = `${SUBPATH}/getPedido`;
    const URL_PEDIDO_BUSCAR_LISTA_STATUS_PEDIDO = `${SUBPATH}/getListaStatusPedido`;
    const URL_PEDIDO_BUSCAR_OBSERVACOES_PEDIDO = `${SUBPATH}/getObservacoesPedido`;
    const URL_PEDIDO_ADICIONAR_OBSERVACOES_PEDIDO = `${SUBPATH}/setObservacoesPedido`;
    const URL_PEDIDO_BUSCAR_ULTIMAR_VENDAS_ITEM = `${SUBPATH}/getUltimasVendasItem`;

    service.salvaPedido = (pedidoDto) => {
      return HttpService.httpPost(URL_PEDIDO_SALVAR, pedidoDto);
    };

    service.atualizarStatusPedido = (atualizaStatusPedidoDto) => {
      return HttpService.httpPost(URL_PEDIDO_ATUALIZAR_STATUS, atualizaStatusPedidoDto);
    };

    service.getPedidosPorCriteria = (filtroPedidoDto) => {
      return HttpService.httpPost(URL_PEDIDO_BUSCAR_POR_CRITERIA, filtroPedidoDto);
    };

    service.getItensPedido = (idPedido) => {
      return HttpService.httpPost(URL_PEDIDO_BUSCAR_ITENS, idPedido);
    };

    service.getPedido = (idPedido) => {
      return HttpService.httpPost(URL_PEDIDO_BUSCAR_PEDIDO_POR_ID, idPedido);
    };

    service.getListaStatusPedido = () => {
      return HttpService.httpGet(URL_PEDIDO_BUSCAR_LISTA_STATUS_PEDIDO);
    };

    service.getObservacoesPedido = (idPedido) => {
      return HttpService.httpGet(URL_PEDIDO_BUSCAR_OBSERVACOES_PEDIDO, idPedido);
    };

    service.setObservacoesPedido = (observacaoPedidoUpdateDto) => {
      return HttpService.httpGet(URL_PEDIDO_ADICIONAR_OBSERVACOES_PEDIDO, observacaoPedidoUpdateDto);
    };

    service.getUltimasVendasItem = (ultimasVendasItemSearchDto) => {
      return HttpService.httpGet(URL_PEDIDO_BUSCAR_ULTIMAR_VENDAS_ITEM, ultimasVendasItemSearchDto);
    };

    service.setPedidoAtivo = function (pedidoAtivo) {
      localStorage.setItem('pedidoAtivo', angular.toJson(pedidoAtivo));
    }

    service.getPedidoAtivo = function () {
      return angular.fromJson(localStorage.getItem('pedidoAtivo'));
    }

    service.removePedidoAtivo = function () {
      return localStorage.removeItem('pedidoAtivo');
    }

    return service;
  }
]);
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

'use strict';

angular.module('Pedido')

.factory('PedidoService', [ '$http', '$rootScope', 'StorageService', 'NetworkService', 'NotificationService', 'AuthenticationService', 
	function($http, $rootScope, StorageService, NetworkService, NotificationService, AuthenticationService) {
	var service = {};
	service.idPedido = null;
	service.idTabela = null;
	service.industria = null;
	service.cliente = null;
	service.prazo = null;
	service.tabela = null;
	service.carga = null;
	service.pedido = null;
	service.trocaTabela = null;
	
	service.carregaClientes = function(login, callback) {
		NetworkService.httpPost('/getClientesByLogin/', login, function (result, data) {
			if (result == CALLRESULT.OK) {
				service.idPedido = response.id;
				service.pedido = response;
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao salvar pedido', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.carregaClientesPorRepresentacao = function (idIndustria, idUsuario, callback) {
		NetworkService.httpPost('/getClientesPorRepresentacao/', {idIndustria: idIndustria, idUsuario: idUsuario}, function (result, data) {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar clientes', data);
			} else {
				callback(StorageService.getClientesUsuario(idUsuario, idIndustria))
			}
		})
	}
	
	/*Salva um pedido na máquina local*/
	service.criaPedido = function(pedido, callback) {
		var dataFinal = new Date()
		dataFinal.setDate(dataFinal.getDate() + 30)
		StorageService.setPedidoAtivo(pedido)
		let pedidoSalvo = StorageService.getPedidoAtivo()
		callback(pedidoSalvo)
	}
	
	/*Envia um pedido para armazenamento local criado na máquina local*/
	service.salvaPedidoLocal = function(pedido) {
		let date = new Date()
		pedido.dataPedido = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0).toLocaleDateString("pt-BR")
		StorageService.addPedidosSalvo(pedido)
	}
	
	/*Envia um pedido para a base criado na máquina local*/
	service.salvaPedido = function(pedido, callback) {
		pedido.usuarioAlteracao = AuthenticationService.getUsuario()
		NetworkService.httpPost('/salvaPedido/', pedido, function (result, data) {
			if (result == CALLRESULT.OK) {
				service.idPedido = result.id;
				service.pedido = result;
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao salvar pedido', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}
	
	service.getPedidoAtivo = function(usuario) {
		let pedido = StorageService.getPedidoAtivo();
		return pedido;
	}
	
	/*Remove pedido da máquina local*/
	service.removePedido = function(callback) {
		StorageService.resetPedidoAtivo();
		service.emEdicao = undefined;
		service.pedidoParaEditar = undefined;
	}

	service.getPedido = function (idPedido, callback) {
		NetworkService.httpPost('/getPedido', idPedido, function (result, data) {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error(`Erro ao buscar pedido ${idPedido}`);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}
	
	service.getNumeroPedidosEnviados = function(callback) {
		NetworkService.httpGet('/getNumeroPedidosEnviados', function (result, data) {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar pedidos enviados');
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}
	
	service.getNumeroPedidosNegados = function(idUsuario, callback) {
		NetworkService.httpGet(`/getNumeroPedidosNegados/?idUsuario=${idUsuario}`, function (result, data) {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar pedidos negados');
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}
	
	service.setIdPedido = function(id) {
		service.idPedido = id;
	};
	
	service.setIdTabela = function(id) {
		service.idTabela = id;
	};
	
	service.setIndustria = function(obj) {
		service.industria = obj;
	}
	
	service.setCliente = function(obj) {
		service.cliente = obj;
	}
	
	service.getTotalItens = function() {
		let total = 0
		if(service.pedido.itensPedido) {
			for(var i = 0; i < service.pedido.itensPedido.length; i++) {
				total += service.pedido.itensPedido[i].quantidadeSolicitada
			}
		}
		return total
	}
	
	return service;
}]);
'use strict'
var NotificacaoModule = angular.module('Notificacao', ['ui-notification']).controller('NotificacaoController', [
	'$scope',
	'Notificacation',
	constructor,
])

function constructor() {

}

NotificacaoModule.config(function(NotificationProvider) {
	NotificationProvider.setOptions({
		delay: TIMEOUT/4,
		startTop: 20,
		startRight: 10,
		verticalSpacing: 20,
		horizontalSpacing: 20,
		positionX: 'right',
		positionY: 'top'
	});
})


'use strict'

angular.module('Notificacao').factory('NotificationService', [
	'Notification',
	notificacoConstructor,
])

function notificacoConstructor(Notification) {
	var service = {};

	service.success = function(msg, data) {
		let message = msg
		if(data) {
			message = msg + ' ' + data
		}
		Notification.success(message)
	}

	service.alert = function(msg, data) {
		let message = msg
		if(data) {
			message = msg + ' ' + data
		}
		Notification.warning(message)
	}

	service.error = function(msg, data) {
		let message = msg
		if(data) {
			message = "Erro no processamento: " + data.errorCode + " - " + data.message
		}
		Notification.error(message)
	}

	return service;
};

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

var pedidoProdutosModule = angular.module('PedidoProdutos');

pedidoProdutosModule.filter('percentage', ['$filter', function($filter){
		return function(input) {
			return $filter('number')(input * 100) + '%';
		};
	}]);

pedidoProdutosModule.directive('percent', function($filter){
	var p = function(viewValue) {
        if(!viewValue) {
            viewValue = "0"
        }
		return parseFloat(viewValue)/100
	};
	
    var f = function(modelValue){
        return $filter('number')(parseFloat(modelValue)*100, 2)
    };
    
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            ctrl.$parsers.unshift(p)
            ctrl.$formatters.unshift(f)
        }
    };
});
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

'use strict';

angular.module('PedidoResumo')

.factory('PedidoResumoService', [ '$http', '$rootScope', function($http, $rootScope) {
	var service = {};

	return service;
}]);
'use strict';

angular.module('GerenciadorFinanceiroFlechaVendas')

.factory('StorageService', [ '$http', '$rootScope', 'LocalStorageService', function($http, $rootScope, LocalStorageService) {
	var service = {};
	
	/*---------------USUARIO LOGADO--------------------*/
	service.setUsuarioLogado = function(authdata, usuario) {
		let currentUser = {authdata : authdata, user : usuario};
		localStorage.currentUser = angular.toJson(currentUser);
	}
	
	service.getUsuarioLogado = function() {
		if(localStorage.currentUser) {
			let currentUser = angular.fromJson(localStorage.currentUser);
			return currentUser;
		} else {
			return null;
		}
	}
	service.clearUsuarioLogado = function() {
		if(localStorage.currentUser) {
			localStorage.removeItem('currentUser');
		}
	}
	
	/*---------------LEMBRAR SENHA--------------------*/
	service.setPasswordRemember = function(remember) {
		localStorage.rememberPassword = angular.toJson(remember);
	}
	
	service.getPasswordRemember = function() {
		return angular.fromJson(localStorage.rememberPassword);
	}
	
	/*---------------PEDIDO ATIVO--------------------*/
	service.setPedidoAtivo = function(pedidoAtivo) {
		localStorage.pedidoAtivo = angular.toJson(pedidoAtivo);
	}
	
	service.getPedidoAtivo = function() {
		return angular.fromJson(localStorage.pedidoAtivo);
	}
	
	service.resetPedidoAtivo = function() {
		if(localStorage.pedidoAtivo) {
			localStorage.removeItem('pedidoAtivo');
		}
	}
	
	/*---------------FILTRO DE CLIENTES--------------------*/
	service.setFiltroAtivo = function(filtroAtivo) {
		localStorage.filtroAtivo = angular.toJson(filtroAtivo);
	}
	
	service.getFiltroAtivo = function() {
		return angular.fromJson(localStorage.filtroAtivo);
	}
	
	service.resetFiltroAtivo = function() {
		if(localStorage.filtroAtivo) {
			localStorage.removeItem('filtroAtivo');
		}
	}
	
	/*---------------FILTRO DE PEDIDOS--------------------*/
	service.setFiltroPedidoAtivo = function(filtroPedidoAtivo) {
		localStorage.filtroPedidoAtivo = angular.toJson(filtroPedidoAtivo);
	}
	
	service.getFiltroPedidoAtivo = function() {
		return angular.fromJson(localStorage.filtroPedidoAtivo);
	}
	
	service.resetFiltroPedidoAtivo = function() {
		if(localStorage.filtroPedidoAtivo) {
			localStorage.removeItem('filtroPedidoAtivo');
		}
	}

	/*---------------PEDIDOS SALVOS--------------------*/
	service.setPedidosSalvo = function(pedido) {
		let listaPedidosSalvos = []
		listaPedidosSalvos.push(pedido)
		pedido.idPedidoSalvo = 1
		localStorage.setItem('pedidos', JSON.stringify(listaPedidosSalvos))
	}
	
	service.addPedidosSalvo = function(pedido) {
		let listaPedidosSalvos = service.getPedidosSalvo()
		if(!listaPedidosSalvos) {
			service.setPedidosSalvo(pedido)
		} else {
			let indice = undefined
			listaPedidosSalvos.forEach(function(item, index) {
				if(item.idPedidoSalvo === pedido.idPedidoSalvo) {
					indice = index
				}
			})
			if(indice !== undefined) {
				listaPedidosSalvos[indice] = pedido
			} else {
				for(var i in listaPedidosSalvos) {
					if(indice === undefined || indice < listaPedidosSalvos[i].idPedidoSalvo) {
						indice = listaPedidosSalvos[i].idPedidoSalvo
					}
				}
				if(!indice) {
					indice = 0
				}
				pedido.idPedidoSalvo = indice + 1
				listaPedidosSalvos.push(pedido)
			}
			localStorage.setItem('pedidos', JSON.stringify(listaPedidosSalvos))
		}
	}
	
	service.getPedidosSalvo = function() {
		if(localStorage.getItem('pedidos') !== 'undefined') {
			return JSON.parse(localStorage.getItem('pedidos'))
		} else {
			return undefined
		}
	}
	
	service.removePedidoSalvo = function(pedido) {
		let listaPedidosSalvos = service.getPedidosSalvo()
		if(listaPedidosSalvos) {
			let indice = undefined
			listaPedidosSalvos.forEach(function(item, index) {
				if(item.idPedidoSalvo === pedido.idPedidoSalvo) {
					indice = index
				}
			})
			if(indice !== undefined) {
				listaPedidosSalvos.splice(indice, 1)
			}
			if(listaPedidosSalvos.length === 0) {
				service.resetPedidosSalvo()
			} else {
				localStorage.setItem('pedidos', JSON.stringify(listaPedidosSalvos))	
			}
		}
	}
	
	service.resetPedidosSalvo = function() {
		if(localStorage.getItem('pedidos')) {
			localStorage.removeItem('pedidos');
		}
	}

	/*---------------DATABASE USUARIO--------------------*/

	service.setDataUsuario = function(usuario) {
		let usuarioDb = []
		usuarioDb.push(usuario)
		localStorage.setItem('usuarioDb', JSON.stringify(usuarioDb))
	}

	service.getDataUsuario = function() {
		if(localStorage.getItem('usuarioDb') !== 'undefined') {
			return JSON.parse(localStorage.getItem('usuarioDb'))
		} else {
			return undefined
		}
	}

	service.getLoginUsuario = function(login, senha) {
		let listaUsuarioSalvo = service.getDataUsuario()
		if(listaUsuarioSalvo && listaUsuarioSalvo.length > 0) {
			let indice = undefined
			listaUsuarioSalvo.forEach(function(item, index) {
				if(item.login === login && item.senha === senha) {
					indice = index
				}
			})
			if(indice !== undefined) {
				return listaUsuarioSalvo[indice]
			} else {
				return undefined
			}
		} else {
			return undefined
		}
	}

	service.addUsuarioSalvo = function(usuario) {
		let listaUsuarioSalvo = service.getDataUsuario()
		if(!listaUsuarioSalvo) {
			service.setDataUsuario(usuario)
		} else {
			let indice = undefined
			listaUsuarioSalvo.forEach(function(item, index) {
				if(item.id === usuario.id) {
					indice = index
				}
			})
			if(indice !== undefined) {
				listaUsuarioSalvo[indice] = usuario
			} else {
				listaUsuarioSalvo.push(usuario)
			}
			localStorage.setItem('usuarioDb', JSON.stringify(listaUsuarioSalvo))
		}
	}

	service.removeUsuarioSalvo = function(usuario) {
			let listaUsuarioSalvo = service.getDataUsuario()
			if(listaUsuarioSalvo) {
				let indice = undefined
				listaUsuarioSalvo.forEach(function(item, index) {
					if(item.login === usuario.login && item.password == usuario.senha) {
						indice = index
					}
				})
				if(indice) {
					listaUsuarioSalvo.splice(indice, 1)
					localStorage.setItem('usuarioDb', JSON.stringify(listaUsuarioSalvo))
					return indice
				}
			}
			return undefined
	}

	/*---------------IDENTIFICADOR DATABASE--------------------*/
	service.setIdentificadorBancoDados = function(identificador) {
		localStorage.identificadorBancoDados = angular.toJson(identificador);
	}
	
	service.getIdentificadorBancoDados = function() {
		return angular.fromJson(localStorage.identificadorBancoDados);
	}

	service.resetIdentificadorBancoDados = function() {
		if(localStorage.identificadorBancoDados) {
			localStorage.removeItem('identificadorBancoDados');
		}
	}

	/*---------------DATA SINCRONIZACAO DATABASE--------------------*/
	service.setDataSincronizacao = function(dataSincronizacao) {
		localStorage.dataSincronizacao = angular.toJson(dataSincronizacao)
	}
	service.getDataSincronizacao = function() {
		return angular.fromJson(localStorage.dataSincronizacao);
	}

	/*---------------INDUSTRIA DATABASE--------------------*/
	service.getIndustriasUsuario = function(idUsuario) {
		let industriasUsuario = LocalStorageService.getData(STORAGE_ITEM.INDUSTRIAS_USUARIO)
		
		if(industriasUsuario) {
			var result = $.grep(industriasUsuario, function(n, i) {
				return n.idUsuario === idUsuario;
			})

			if(result && result.length > 0) {
				return result[0].industrias
			}
		}
		return undefined
	}

	service.setIndustriasUsuario = function(idUsuario, industrias) {
		let nodo = { idUsuario: idUsuario, industrias: industrias }
		let usuarioIndustrias = LocalStorageService.getData(STORAGE_ITEM.INDUSTRIAS_USUARIO)
		if(usuarioIndustrias) {
			usuarioIndustrias.push(nodo)
		} else {
			usuarioIndustrias = [nodo]
		}
		LocalStorageService.setData(STORAGE_ITEM.INDUSTRIAS_USUARIO, usuarioIndustrias)
	}

	/*---------------CLIENTE-INDUSTRIA DATABASE--------------------*/
	service.getClientesUsuario = function(idUsuario, idIndustria) {
		let clientes = LocalStorageService.getData(STORAGE_ITEM.CLIENTES_USUARIO)

		if(clientes) {
			var result = $.grep(clientes, function(n, i) {
				return n.idUsuario == idUsuario && n.idIndustria == idIndustria
			})

			if(result && result.length > 0) {
				return result[0].clientes
			}
		}
		return undefined
	}

	/*
	service.getTabelasIndustriaUsuario = function(idUsuario, idIndustria) {
		let tabelas = LocalStorageService.getData(STORAGE_ITEM.TABELAS_INDUSTRIA)

		if(tabelas) {
			var result = $.grep(tabelas, function(n, i) {
				return n.idTabela
			})
		}
	}

	service.setTabelasIndustriaUsuario = function(idUsuario, idIndustria, tabelas) {

	}
	*/

	service.setClientesUsuario = function(idUsuario, idIndustria, clientes) {
		let nodo = { idUsuario: idUsuario, idIndustria: idIndustria, clientes: clientes }
		let usuarioClientes = LocalStorageService.getData(STORAGE_ITEM.CLIENTES_USUARIO)
		if(usuarioClientes) {
			usuarioClientes.push(nodo)
		} else {
			usuarioClientes = [nodo]
		}
		LocalStorageService.setData(STORAGE_ITEM.CLIENTES_USUARIO, usuarioClientes)
	}

	return service;
}]);
'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').factory('SincronizacaoService', [
	'$http',
	'$rootScope',
	'StorageService',
	'IndustriasService',
	'PedidoService',
	constructor,
])

function constructor($http, $rootScope, StorageService, IndustriasService, PedidoService) {
	var service = {};

	service.sincroniza = function(username, password, callback) {
		$http.post(MODO_HTTP + URL + '/doLogin/', { login: username, senha: password })
			.success(function (usuario) {
				sincronizaUsuarios(usuario)
				sincronizaIndustrias(usuario)
				sincronizaClientes(usuario)
				// sincronizaTabelas(usuario)
				atualizaBaseLocal(callback)
				}
			)
			.error(function(response) {
				conluirSincronizacao(undefined, response)
			}
		)
	}

	function sincronizaUsuarios(usuario) {
		let usuarioLocal = StorageService.getLoginUsuario(usuario.login, usuario.senha)
		if(usuarioLocal) {
			StorageService.removeUsuarioSalvo(usuarioLocal)
			StorageService.addUsuarioSalvo(usuario)
		} else {
			StorageService.addUsuarioSalvo(usuario)
		}
	}

	function sincronizaIndustrias(usuario) {
		IndustriasService.getIndustriasUsuario(usuario.id, function(data) {
			StorageService.setIndustriasUsuario(usuario.id, data)
		})
	}

	function sincronizaClientes(usuario) {
		IndustriasService.getIndustriasUsuario(usuario.id, function(industrias) {
			industrias.forEach(industria => {
				PedidoService.carregaClientesPorRepresentacao(industria.id, usuario.id, clientes => {
					if(clientes.length > 0) {
						StorageService.setClientesUsuario(usuario.id, industria.id, clientes)
					}
				})
			})
		})
	}

	function sincronizaTabelas(usuario) {
		IndustriasService.getTabelasIndustria(idIndustria, tabelas => {
			if(tabelas.length > 0) {
				StorageService.setTabelasIndustriaUsuario(usuario.id, idIndustria, tabelas)
			}
		})
	}

	function atualizaBaseLocal(callback) {
		let idDb = StorageService.getIdentificadorBancoDados()
		if(!idDb || idDb !== DATABASE.ID) {
			$http.get(MODO_HTTP + URL + '/getIdentificadorAtualizacaoBancoDeDados/').success(function(id) {
					StorageService.setIdentificadorBancoDados(id)
					conluirSincronizacao(true, callback)
				})
			} else {
				conluirSincronizacao(true, callback)
			}
	}

	function conluirSincronizacao(resultado, callback) {
		if(resultado) {
			StorageService.setDataSincronizacao(moment())
			callback(resultado)
		} else {
			callback(resultado)
		}
	}

	return service;
}

'use strict';

var TabelaModulo = angular.module('tabela.module');

TabelaModulo.config(($stateProvider) => {
  var tabela = {
    name: 'main.tabela',
    url: '/tabela',
    abstract: true
  };
  var cargaTabela = {
    name: 'main.tabela.carga',
    url: '/carga',
    component: 'cargaTabelaComponent',
    resolve: {
      listaIndustrias: function (IndustriaService) {
        return IndustriaService.getIndustrias();
      },
    }
  };
  $stateProvider.state(tabela);
  $stateProvider.state(cargaTabela);
});
'use strict';
angular.module('tabela.module', []);
'use strict';

var PedidoModule = angular.module('tabela.module');

PedidoModule.factory('TabelaService', ['HttpService',
  function(HttpService){
    var service = {};
    const SUBPATH = 'service/tabela';

    const URL_TABELA_UPLOAD = `${SUBPATH}/uploadTabela`;
    const URL_TABELA_BUSCAR_POR_INDUSTRIAS = `${SUBPATH}/getTabelasPorIndustria`;
    const URL_TABELA_EXCLUIR = `${SUBPATH}/excluirTabela`;
    const URL_TABELA_DOWNLOAD_ARQUIVO = `${SUBPATH}/downloadArquivoTabela`;
    const URL_TABELA_BUSCAR_POR_ID = `${SUBPATH}/buscaTabelaPorId`;

    service.uploadTabela = (file) => {
      var fd = new FormData();
      fd.append('file', file);
      return HttpService.httpPost(URL_TABELA_UPLOAD, fd);
    };

    service.getTabelasPorIndustria = (idIndustria) => {
      return HttpService.httpPost(URL_TABELA_BUSCAR_POR_INDUSTRIAS, idIndustria);
    };

    service.excluirTabela = (idTabela) => {
      return HttpService.httpPost(URL_TABELA_EXCLUIR, idTabela);
    };

    service.excluirTabela = (idTabela) => {
      return HttpService.httpGet(URL_TABELA_DOWNLOAD_ARQUIVO, idTabela);
    };

    service.buscaTabelaPorId = (idTabela) => {
      return HttpService.httpGet(URL_TABELA_BUSCAR_POR_ID, idTabela);
    };

    return service;
  }
]);
'use strict';
var TabelaModule = angular.module('Tabela')
	.controller('TabelaController', ['$scope', '$rootScope', '$location', '$http', '$routeParams', '$window', 'TabelaService', 'IndustriasService', 'AuthenticationService', 'ModalService', 'blockUI', 'NotificationService', 
		function ($scope, $rootScope, $location, $http, $routeParams, $window, TabelaService, IndustriasService, AuthenticationService, ModalService, blockUI, NotificationService) {

		$scope.tabelas = [];

		$scope.fileTabela = null;

		$scope.industria = {
			selecionado: null
		};

		$scope.tabela = {}

		IndustriasService.getIndustriasUsuario($rootScope.globals.currentUser.user.id, function (response) {
			$scope.industrias = response;
		});

		$scope.selecionaIndustria = function () {
			IndustriasService.getTabelasIndustria($scope.industria.selecionado.id, function (response) {
				$scope.tabelas = response;
			});
		}

		var idTabela = $routeParams.idTabela
		if(idTabela) {
			//busca dados da tabela
			TabelaService.buscaTabelaPorId(idTabela, function(response){
				$scope.tabela = response;
			})
		} else {
			if(sessionStorage.industria) {
				$scope.industria.selecionado = JSON.parse(sessionStorage.getItem('industria')).selecionado
				sessionStorage.removeItem('industria')
				$scope.selecionaIndustria()
			}
		}

		$scope.isVendedor = function () {
			return AuthenticationService.isVendedor();
		}

		$scope.removerTabela = function (tabelaAtual) {
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: 'Confirma remoção da ' + tabelaAtual.nome + '?'
			};

			ModalService.showModal({}, modalOptions).then(function (result) {
				TabelaService.excluirTabela(tabelaAtual, function (response) {
					IndustriasService.getTabelasIndustria($scope.industria.selecionado.id, function (response) {
						$scope.tabelas = response;
					});
					NotificationService.success(response.nome + ' excluída com sucesso!')
				});
			});
		}

		$scope.uploadTabela = function () {
			var file = $scope.fileTabela;
			blockUI.start('Carregando Tabela, Aguarde...');
			TabelaService.uploadTabelaToUrl(file, function () {
				IndustriasService.getTabelasIndustria($scope.industria.selecionado.id, function (response) {
					$scope.tabelas = response;
					blockUI.stop();
				});
			}, function (error) {
				blockUI.stop();
			});
		}

		function _base64ToArrayBuffer(base64) {
			var binary_string =  $window.atob(base64);
			var len = binary_string.length;
			var bytes = new Uint8Array( len );
			for (var i = 0; i < len; i++) {
					bytes[i] = binary_string.charCodeAt(i);
			}
			return bytes.buffer;
		}

		function b64toBlob(b64Data, contentType, sliceSize) {
			return new Blob([_base64ToArrayBuffer(b64Data)], {type: contentType});
		}

		$scope.downloadTabela = (idTabela) => {
			TabelaService.downloadArquivo(idTabela, (data) => {
					let a = document.createElement("a");
					document.body.appendChild(a);
					a.style = "display: none";
					var blob = b64toBlob(data.arquivo, 'application/octet-stream');
					let url = $window.webkitURL.createObjectURL(blob);
					a.href = url;
					a.download = data.nomeArquivo;
					a.click();
					$window.webkitURL.revokeObjectURL(url);
			})
		}

		$scope.detalheTabela = function(idTabela) {
			sessionStorage.industria = JSON.stringify({ selecionado:$scope.industria.selecionado })
			$location.path(`/detalheTabela/${idTabela}`)
		}

	}]);

TabelaModule.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function () {
				scope.$apply(function () {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);

'use strict'

angular.module('Tabela')

.factory('TabelaService', [ '$http', '$rootScope', 'NetworkService', 'NotificationService', function($http, $rootScope, NetworkService, NotificationService) {
	var service = {};

	service.uploadTabelaToUrl = function(file, callback, callbackError) {
        var fd = new FormData();
        fd.append('file', file);
     
        $http.post(MODO_HTTP + URL + '/uploadTabela', fd, {
           transformRequest: angular.identity,
           headers: {'Content-Type': undefined}
        })
        .success(function(){
					NotificationService.success('Tabela cadastrada com sucesso!')
        	callback();
        })
        .error(function(error){
					NotificationService.error(error);
        	callbackError(error);
        });
	}

	service.excluirTabela = function(tabela, callback) {
		const _id = tabela.id
		NetworkService.httpPost('/excluirTabela', _id, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar lista status pedido', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.buscaTabelaPorId = function(idTabela, callback) {
		NetworkService.httpGet(`/buscaTabelaPorId/?idTabela=${idTabela}`, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar tabela', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})
	}

	service.downloadArquivo = function(idTabela, callback) {
		NetworkService.httpGet(`/downloadArquivoTabela?idTabela=${idTabela}`, (result, data) => {
			if (result == CALLRESULT.OK) {
				callback(data)
			} else if (result == CALLRESULT.ERROR) {
				NotificationService.error('Erro ao buscar tabela', data);
			} else {
				NotificationService.error('Não foi possível se comunicar com o servidor.');
			}
		})		
	}

	return service;
}]);
'use strict'

var UsuarioModulo = angular.module('usuario.module')

UsuarioModulo.config(function($stateProvider){
  var usuario = {
      name: 'main.usuario',
      abstract: true,
      url:'/usuario',
  }
  var pesquisaUsuarioState = {
    name:'main.usuario.pesquisa',
    url: '/pesquisa',
    component: 'pesquisaUsuarioComponent'
  } 
  var cadastroUsuarioState = {
    name:'main.usuario.cadastro',
    url: '/cadastro',
    component: 'cadastroUsuarioComponent'
  }
  var edicaoUsuarioState = {
    name:'main.usuario.edicao',
    url: '/edicao/:id',
    component:'cadastroUsuarioComponent',
    resolve: {
      usuarioParaEditar: (UsuarioService, $stateParams, $q) => {
        const deferred = $q.defer();
        //efetuar busca pelo usuário
        if($stateParams.id) {
          UsuarioService.buscaUsuarioPorId($stateParams.id).then(usuarioDto => {
            deferred.resolve(usuarioDto);
          }, (error) => {
            deferred.reject(error);
          });
        } else {
          deferred.reject(null);
        }
        return deferred.promise;
        //verificar se há permissão
      }
    }
  }
  $stateProvider.state(usuario)
  $stateProvider.state(pesquisaUsuarioState)
  $stateProvider.state(cadastroUsuarioState)
  $stateProvider.state(edicaoUsuarioState)
});

'use strict';
angular.module('usuario.module', ['ui.router', 'ui.bootstrap.tabs', 'ui.select', 'ui.mask', 'ui.bootstrap.pagination', 'ngSanitize']);

'use strict'

var UsuarioModule = angular.module('usuario.module')

UsuarioModule.factory('UsuarioService', ['HttpService',
  function (HttpService) {
    var service = {}

    const SUBPATH = 'service/usuario'

    service.pesquisa = (filter) => {
      return HttpService.httpPost(SUBPATH + '/getUsuariosByFilter', filter);
    }

    service.listaPerfil = () => {
      return HttpService.httpGet(SUBPATH + '/getListaPerfil');
    }

    service.salvaUsuario = (usuarioDto) => {
      return HttpService.httpPost(SUBPATH + '/salvaUsuario', usuarioDto);
    }

    service.buscaUsuarioPorId = (idUsuario) => {
      return HttpService.httpGet(SUBPATH + '/buscaUsuarioPorId', { 'idUsuario': idUsuario });
    }

    service.buscaUsuarioPorLogin = (login) => {
      return HttpService.httpPost(SUBPATH + '/buscaUsuarioPorLogin', login);
    }

    service.verificarImportacaoBaseUsuario = (importacaoUsuarioDto) => {
      return HttpService.httpPost(SUBPATH + '/verificarImportacaoBaseUsuario', importacaoUsuarioDto);
    }

    service.buscaUsuarioCadastroDto = (idUsuario) => {
      return HttpService.httpGet(SUBPATH + '/buscaRepresentacoesPorIdUsuario', { 'idUsuario': idUsuario });
    }

    service.importarBaseUsuario = (importacaoUsuarioDto) => {
      return HttpService.httpPost(SUBPATH + '/importarBaseUsuario', importacaoUsuarioDto);
    }

    service.buscaUsuarios = () => {
      return HttpService.httpGet(SUBPATH + '/buscaUsuarios');
    }

    return service;
  }
])
'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.component('loginComponent', {
	controller: function loginController($state, LoginService) {
    let vm = this;
    vm.doLogin = () => {
      LoginService.doLogin(vm.login, vm.senha).then((data) => {
        $state.go('main.dashboard')
      })
    }
  },
  templateUrl: 'modules/app/components/login/login.html',
	bindings: {},
	controllerAs: 'ctrl',
});

'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas');

app.factory('LoginService', ['$http', 'HttpService', constructor]);

function constructor($http, HttpService) {
	var service = {};

	const SUBPATH = 'public/authentication/'

	service.doLogin = (_login, _senha) => {
		const password = btoa(_senha);
		const _loginParam = {
			login: _login,
			senha: password
		};
		return HttpService.httpPost(SUBPATH + 'doLogin', _loginParam)
			.then((usuarioDto) => {
				setLogin(usuarioDto);
			})
	}

	service.doLogoff = () => {
		clearLogin();
	}

	service.getUsuario = () => {
		return getLogin();
	}

	service.decodePassword = function(authdata) {
		return btoa(authdata);
	}

	function setLogin(usuarioDto) {
		$http.defaults.headers.common.sessiontoken = usuarioDto.hash;
		sessionStorage.setItem('login', angular.toJson(usuarioDto));
	}

	function getLogin() {
		return angular.fromJson(sessionStorage.getItem('login'));
	}

	function clearLogin() {
		console.log('clean')
		sessionStorage.setItem('login', null);
	}

	/*
	service.ClearCredentials = function() {
		$rootScope.globals = {};
		if(!StorageService.getPasswordRemember()) {
			StorageService.clearUsuarioLogado();	
		}
		$http.defaults.headers.common.Authorization = 'Basic ';
		service.usuario = undefined
	};


	service.SetCredentials = function(senha, remember, usuario) {
		var authdata = Base64.encode(senha)
		StorageService.resetFiltroAtivo()
		StorageService.resetFiltroPedidoAtivo()
		service.usuario = usuario;

		$rootScope.globals = {
			currentUser: {
				authdata: authdata,
				user : usuario
			}
		};

		$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
		var dataFinal = new Date();
		dataFinal.setDate(dataFinal.getDate() + 30);
		
		if(remember) {
			StorageService.setPasswordRemember(true);
		} else {
			StorageService.setPasswordRemember(false);
		}
		
		StorageService.setUsuarioLogado(authdata, usuario);
	};
	
	service.getUsuario = function() {
		return service.usuario;
	}
	
	service.setUsuario = function(usuario) {
		return service.usuario = usuario;
	}
	
	service.isAdministrador = function() {
		if(!service.usuario) {
			return false
		}
		if(service.usuario.perfil.id === 2) {
			return true;
		}
		return false;
	}
	
	service.isMaster = function() {
		if(!service.usuario) {
			return false
		}
		if(service.usuario.perfil.id === 2) {
			return true;
		}
		return false;
	}
	
	service.isVendedor = function() {
		if(!service.usuario) {
			return false
		}
		if(service.usuario.perfil.id === 1) {
			return true;
		}
		return false;
	}
	
	service.getPasswordRemember = function() {
		return StorageService.getPasswordRemember();
	}
	
	service.getCredentialsRemember = function() {
		return StorageService.getUsuarioLogado();
	}
	
	service.getPasswordEncoded = function(password) {
		return Base64.encode(password);
	}
	
	service.getNomeUsuario = function() {
		if(service.usuario) {
			return service.usuario.nome	
		} else {
			""
		}
	}
	*/

	return service;
}

'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.component('dashboardComponent', {
	controller: function dashboardController($log) {
    var vm = this;
  },
  bindings: {
    informacoes: '<'
  },
  templateUrl: 'modules/app/components/dashboard/dashboard.html',
	controllerAs: 'ctrl',
});

'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas');

app.factory('DashboardService', ['HttpService', constructor]);

function constructor (HttpService) {
		var service = {};

		const SUBPATH = 'service/dashboard/'

		service.getInformacoesDashboardDto = (idUsuario) => {
			return HttpService.httpGet(SUBPATH + 'informacoes', {'idUsuario': idUsuario})
				.then((informacoes) => {
					return informacoes.data;
				})
		}

		return service;
	}

'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.component('mainComponent', {
  controller: function mainController(LoginService) {
    this.$onInit = init();
    var vm = this;
    vm.nomeUsuario = vm.auth.nome;

    vm.logoff = () => {
      LoginService.doLogoff()
    }

  },
  templateUrl: 'modules/app/components/main/main.html',
  bindings: {
    auth: '<'
  },
  controllerAs: 'ctrl',
});

function init() {
  $(function () {
    var accordionActive = false;

    $(window).on('resize', function () {
      var windowWidth = $(window).width();
      var $topMenu = $('#top-menu');
      var $sideMenu = $('#side-menu');

      if (windowWidth < 768) {
        if ($topMenu.hasClass("active")) {
          $topMenu.removeClass("active");
          $sideMenu.addClass("active");

          var $ddl = $('#top-menu .movable.dropdown');
          $ddl.detach();
          $ddl.removeClass('dropdown');
          $ddl.addClass('nav-header');

          $ddl.find('.dropdown-toggle').removeClass('dropdown-toggle').addClass('link');
          $ddl.find('.dropdown-menu').removeClass('dropdown-menu').addClass('submenu');

          $ddl.prependTo($sideMenu.find('.accordion'));
          $('#top-menu #qform').detach().removeClass('navbar-form').prependTo($sideMenu);

          if (!accordionActive) {
            var Accordion2 = function (el, multiple) {
              this.el = el || {};
              this.multiple = multiple || false;

              // Variables privadas
              var links = this.el.find('.movable .link');
              // Evento
              links.on('click', { el: this.el, multiple: this.multiple }, this.dropdown);
            }

            Accordion2.prototype.dropdown = function (e) {
              var $el = e.data.el;
              $this = $(this),
                $next = $this.next();

              $next.slideToggle();
              $this.parent().toggleClass('open');

              if (!e.data.multiple) {
                $el.find('.movable .submenu').not($next).slideUp().parent().removeClass('open');
              };
            }

            var accordion = new Accordion2($('ul.accordion'), false);
            accordionActive = true;
          }
        }
      }
      else {
        if ($sideMenu.hasClass("active")) {
          $sideMenu.removeClass('active');
          $topMenu.addClass('active');

          var $ddl = $('#side-menu .movable.nav-header');
          $ddl.detach();
          $ddl.removeClass('nav-header');
          $ddl.addClass('dropdown');

          $ddl.find('.link').removeClass('link').addClass('dropdown-toggle');
          $ddl.find('.submenu').removeClass('submenu').addClass('dropdown-menu');

          $('#side-menu #qform').detach().addClass('navbar-form').appendTo($topMenu.find('.nav'));
          $ddl.appendTo($topMenu.find('.nav'));
        }
      }
    });

    /**/
    var $menulink = $('.side-menu-link'),
      $wrap = $('.wrap');

    $menulink.click(function () {
      $menulink.toggleClass('active');
      $wrap.toggleClass('active');
      return false;
    });

    $(".submenu").click(function () {
      $menulink.toggleClass('active');
      $wrap.toggleClass('active');
      return true;
    });

    /*Accordion*/
    var Accordion = function (el, multiple) {
      this.el = el || {};
      this.multiple = multiple || false;

      // Variables privadas
      var links = this.el.find('.link');
      // Evento
      links.on('click', { el: this.el, multiple: this.multiple }, this.dropdown);
    }

    Accordion.prototype.dropdown = function (e) {
      var $el = e.data.el;
      var $this = $(this);
      var $next = $this.next();

      $next.slideToggle();
      $this.parent().toggleClass('open');

      if (!e.data.multiple) {
        $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
      };
    }

    var accordion = new Accordion($('ul.accordion'), false);


  });
}

'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.directive('restrict', function (LoginService) {
  return {
    restrict: 'A',
    prioriry: 100000,
    scope: false,
    link: function () {
    },
    compile: function (element, attr) {
      var accessDenied = true;
      var user = LoginService.getUsuario();

      var attributes = attr.access.split(" ");
      for (var i in attributes) {
        if (user.perfil.nome === attributes[i]) {
          accessDenied = false;
        }
      }
      if (accessDenied) {
        element.children().remove();
        element.remove();
      }
    }
  }
});

'use strict';

var ClienteModulo = angular.module('cliente.module');

ClienteModulo.component('cadastroClienteComponent', {
  templateUrl: 'modules/cliente/components/cadastro/views/cadastroCliente.html',
  bindings: {
    cliente: '<',
    listaIndustriaCliente: '<'
  },
  controllerAs: 'ctrl',
  /*
  $scope,
				$rootScope,
				$location,
				$sce,
				$route,
				$window,
				service,
				ClientesCadastradosService,
				IndustriasService,
				AuthenticationService,
				blockUI,
				ModalService,
				IndustriaClientePrazoService,
				NotificationService
  */
  controller: function (NotificationService, ModalService, ClienteService) {
    var ctrl = this;

    function _base64ToArrayBuffer(base64) {
      var binary_string = $window.atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    }

    function b64toBlob(b64Data, contentType) {
      return new Blob([_base64ToArrayBuffer(b64Data)], { type: contentType });
    }

    ctrl.downloadArquivo = (nomeArquivo) => {
      service.downloadArquivo(ctrl.cliente.cpfCnpj, nomeArquivo, (data) => {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = b64toBlob(data, 'image/jpg');
        let url = $window.webkitURL.createObjectURL(blob);
        a.href = url;
        a.download = nomeArquivo;
        a.click();
        $window.webkitURL.revokeObjectURL(url);
      })
    }

    ctrl.listaNomeBancos = service.buscaNomesBancos();
    if (ctrl.cliente.nomeBanco != null) {
      ctrl.banco.nome = ctrl.cliente.nomeBanco;
    }

    service.getRepresentacoesUsuario(usuario.id, function (response) {
      ctrl.listaRepresentacoes = response;
    });

    service.buscaVendedores(function (response) {
      ctrl.vendedores = response;
    });

    service.buscaListaTipoPessoa(function (response) {
      ctrl.listaTipoPessoa = response;
      if (ctrl.cliente.idPessoa != null) {
        ctrl.listaTipoPessoa.forEach(function (item, index) {
          if (item.id == ctrl.cliente.idPessoa) {
            ctrl.tipoPessoa.selecionado = item;
          }
        });
      } else {
        ctrl.tipoPessoa.selecionado = ctrl.listaTipoPessoa[1];
      }

    });

    ctrl.verificaCliente = function () {
      const cpfCnpj = ctrl.cliente.cpfCnpj
      if (!cpfCnpj) {
        return
      }
      ClientesCadastradosService.getClienteExistente(cpfCnpj, (response) => {
        if (response) {
          if (AuthenticationService.isVendedor() && !ctrl.cliente.id) {
            NotificationService.alert('Cliente já cadastrado! Entre em contato com a administração.')
            ctrl.naoEditavel = true
          } else {
            if (!ctrl.cliente.id) {
              exibeModalConfirmacaoCliente(response)
            }
          }
        } else {
          ctrl.naoEditavel = false
        }
      })
    }

    ctrl.selecionaIndustria = function () {
      var industria = ctrl.industria.selecionado.industria;
      var listaEncontrados = $.grep(ctrl.listaIndustriaCliente, function (e, i) {
        return e.idIndustria == industria.id;
      });
      ctrl.industriaPrazo = {
        selecionado: undefined
      }
      ctrl.industriaClientePrazoPadrao = {
        selecionado: undefined
      }

      if (listaEncontrados.length == 0) {
        ctrl.industriaCliente = {
          idCliente: null,
          idIndustria: industria.id,
          codigo: null,
          limiteCredito: null,
          ativo: true,
          bloqueioVenda: false,
          nomeIndustria: industria.nome,
          removido: false,
          listaIndustriaClientePrazo: [],
          listaIndustriaClientePrazoParaRemover: [],
        }
        ctrl.industriaPrazo = {
          selecionado: undefined,
        }
        ctrl.industriaClientePrazoPadrao = {
          selecionado: undefined,
        }
      } else {
        ctrl.industriaCliente = listaEncontrados[0];
        IndustriaClientePrazoService.getIndustriaClientePrazoPorIdIndustriaCliente(ctrl.industriaCliente.id, (result) => {
          ctrl.industriaClientePrazo = result
        })
      }

      buscaRepresentacoesIndustria(industria)

      geraListaPrazosExistentes(industria)
    }

    function exibeModalConfirmacaoCliente(response) {
      var modalOptions = {
        closeButtonText: 'Não',
        actionButtonText: 'Sim',
        headerText: 'Confirmar',
        bodyText: 'O cliente com CNPJ ' + response.cpfCnpj + ' já possui cadastro! Deseja carregar seus dados?'
      };
      ModalService.showModal({}, modalOptions).then(() => {
        ClientesCadastradosService.clienteParaEditar = response
        $route.reload();
      }, function (result) {
        return
      });
    }

    function buscaRepresentacoesIndustria(industria) {
      service.getRepresentacoesIndustria(industria.id, function (response) {
        ctrl.listaRepresentacoesVendedor = response;

        if (AuthenticationService.isVendedor()) {
          var representacoes = $.grep(ctrl.listaRepresentacoesVendedor, function (e, i) {
            return e.usuario.id == usuario.id;
          });
          if (representacoes && representacoes.length > 0) {
            ctrl.representacaoVendedor.selecionado = representacoes[0];
          }
          if (ctrl.representacaoVendedor.selecionado) {
            ctrl.selecionaRepresentacaoVendedor();
          }
        }
      })
    }

    function geraListaPrazosExistentes(industria) {
      IndustriasService.getPrazosIndustria(industria.id, (result) => {
        if (ctrl.industriaCliente.listaIndustriaClientePrazo !== null && ctrl.industriaCliente.listaIndustriaClientePrazo.length > 0) {
          //GERA LISTA DE PRAZOS JA ADICIONADOS NA INDUSTRIA SELECIONADA
          ctrl.industriaPrazo.selecionado = $.grep(result, (ePrazo) => {
            let exists = $.grep(ctrl.industriaCliente.listaIndustriaClientePrazo, (eIndustriaClientePrazo) => {
              return ePrazo.id === eIndustriaClientePrazo.idIndustriaPrazo
            })
            return exists.length !== 0
          })
          //BUSCA ITEM PADRAO SELECIONADO
          if (ctrl.industriaCliente.listaIndustriaClientePrazo.length > 0) {
            let exists = $.grep(ctrl.industriaCliente.listaIndustriaClientePrazo, (eIndustriaClientePrazo) => {
              return eIndustriaClientePrazo.padrao === true
            })
            if (exists.length > 0) {
              ctrl.industriaClientePrazoPadrao.selecionado = exists[0]
            }
          }
        }
        ctrl.prazosIndustria = result
      })
    }

    ctrl.selecionaRepresentacaoVendedor = function () {
      if (!ctrl.listaRepresentacoesCliente) {
        ctrl.listaRepresentacoesCliente = [];
      }

      var listaEncontrados = $.grep(ctrl.listaRepresentacoesCliente, function (e, i) {
        return e.idRepresentacao == ctrl.representacaoVendedor.selecionado.id;
      });

      if (!listaEncontrados || listaEncontrados.length == 0) {
        ctrl.representacaoCliente = {
          id: ctrl.representacaoVendedor.selecionado.id,
          industria: {
            id: ctrl.representacaoVendedor.selecionado.industria.id,
            nome: ctrl.representacaoVendedor.selecionado.industria.nome
          },
          usuario: {
            id: ctrl.representacaoVendedor.selecionado.usuario.id,
            nome: ctrl.representacaoVendedor.selecionado.usuario.nome
          }
        }
      } else {
        ctrl.representacaoCliente = listaEncontrados[0];
      }
    }

    ctrl.alteraSelecaoIndustria = function (industria) {
      if (industria.selecionado) {
        adicionaIndustria(industria);
      } else {
        removeIndustria(industria);
      }
    }

    service.buscaEstados(function (response) {
      ctrl.estados = response;
      if (ctrl.cliente.estado == null) {
        ctrl.estados.forEach(function (item, index) {
          if (item.sigla == 'RS') {
            ctrl.estado.selecionado = item;
          }
        });
      } else {
        ctrl.estados.forEach(function (item, index) {
          if (item.sigla == ctrl.cliente.estado.sigla) {
            ctrl.estado.selecionado = item;
          }
        });
      }
    });

    ctrl.salvarCliente = function () {
      var banco = ctrl.banco.nome;
      ctrl.cliente.idPessoa = ctrl.tipoPessoa.selecionado.id;
      ctrl.cliente.listaIndustriaCliente = ctrl.listaIndustriaCliente;
      ctrl.cliente.listaRepresentacoesCliente = ctrl.listaRepresentacoesCliente;
      ctrl.cliente.estado = ctrl.estado.selecionado;
      ctrl.cliente.nomeBanco = ctrl.banco.nome;

      if (AuthenticationService.isVendedor()) {
        ctrl.cliente.pendenteRegistro = true
        salvar()
      } else {
        if (ctrl.cliente.pendenteRegistro == true) {
          var modalOptions = {
            closeButtonText: 'Não',
            actionButtonText: 'Sim',
            headerText: 'Confirmar',
            bodyText: 'O cliente ' + ctrl.cliente.razaoSocial + ' está mardo como pendente de cadastro. Deseja remover esta marcação?'
          };

          ModalService.showModal({}, modalOptions).then(function (result) {
            ctrl.cliente.pendenteRegistro = false
            salvar()
          }, function (result) {
            salvar()
          });
        } else {
          salvar()
        }
      }
    }

    ctrl.adicionaIndustriaCliente = function () {
      if (!ctrl.listaIndustriaCliente) {
        ctrl.listaIndustriaCliente = [];
      }
      let atualizou = false
      ctrl.listaIndustriaCliente.forEach(function (item, index) {
        if (item.id == ctrl.industriaCliente.id && item.removido) {
          ctrl.listaIndustriaCliente[index].removido = false
          atualizou = true
        }
      })
      if (!atualizou) {
        ctrl.listaIndustriaCliente.push(ctrl.industriaCliente);
      }
    }

    ctrl.adicionaRepresentcaoVendedor = function () {
      if (!ctrl.listaRepresentacoesCliente) {
        ctrl.listaRepresentacoesCliente = [];
      }
      ctrl.listaRepresentacoesCliente.push(ctrl.representacaoCliente)
      ctrl.bloqueiaSalvar = (AuthenticationService.isVendedor() && ctrl.listaRepresentacoesCliente.length < 1)
    }

    ctrl.adicionaIndustriaClienteRepresentacaoVendedor = function () {
      ctrl.adicionaIndustriaCliente();
      ctrl.adicionaRepresentcaoVendedor();
    }

    ctrl.validaDocumento = function (cpfCnpj) {
      if (cpfCnpj.length == 14) {
        return service.validarCnpj(cpfCnpj);
      } else {
        return false;
      }
    }

    ctrl.removeRepresentacao = function (representacao) {
      $.each(ctrl.listaRepresentacoesCliente, function (i) {
        if (ctrl.listaRepresentacoesCliente[i].id === representacao.id) {
          ctrl.listaRepresentacoesCliente.splice(i, 1);
          ctrl.bloqueiaSalvar = (AuthenticationService.isVendedor() && ctrl.listaRepresentacoesCliente.length < 1)
          return false;
        }
      });
    }

    ctrl.removerIndustriaCliente = function (industriaCliente) {
      $.each(ctrl.listaIndustriaCliente, function (i) {
        if (ctrl.listaIndustriaCliente[i].id === industriaCliente.id) {
          if (industriaCliente.id === undefined) {
            ctrl.listaIndustriaCliente.splice(i, 1);
          } else {
            ctrl.listaIndustriaCliente[i].removido = true;
          }
          return false;
        }
      });
    }

    ctrl.voltar = function () {
      window.history.back();
    }

    ctrl.podeSalvar = function () {
      if (AuthenticationService.isVendedor()) {
        if (ctrl.listaRepresentacoesCliente && ctrl.listaRepresentacoesCliente.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    }

    ctrl.selecionaIndustriaPrazo = (item) => {
      let industriaClientePrazo = {
        id: undefined,
        idIndustriaCliente: undefined,
        idIndustriaPrazo: item.id,
        descricaoIndustriaPrazo: item.descricao,
        padrao: undefined,
      }
      ctrl.industriaCliente.listaIndustriaClientePrazo.push(industriaClientePrazo)
    }

    ctrl.removeIndustriaPrazo = (item) => {

      const itemRemovido = $.grep(ctrl.industriaCliente.listaIndustriaClientePrazo, (e) => {
        return e.idIndustriaPrazo === item.id;
      })

      ctrl.industriaCliente.listaIndustriaClientePrazo = $.grep(ctrl.industriaCliente.listaIndustriaClientePrazo, (e) => {
        return e.idIndustriaPrazo !== item.id;
      })

      if (itemRemovido[0] && itemRemovido[0].padrao) {
        ctrl.industriaClientePrazoPadrao.selecionado = undefined
      }

      if (itemRemovido[0] && itemRemovido[0].id) {
        ctrl.industriaCliente.listaIndustriaClientePrazoParaRemover.push(itemRemovido[0])
      }
    }

    ctrl.removerPadrao = () => {
      ctrl.industriaCliente.listaIndustriaClientePrazo.forEach((e, i, arr) => {
        e.padrao = undefined
        ctrl.industriaClientePrazoPadrao.selecionado = undefined
      })
    }

    ctrl.buscaDescricaoResumidaPrazo = (industriaCliente) => {
      let descr = ""
      industriaCliente.listaIndustriaClientePrazo.forEach((e, i, arr) => {
        if (i === arr.length - 1) {
          descr += (e.padrao ? `<strong>${e.descricaoIndustriaPrazo}</strong>` : e.descricaoIndustriaPrazo)
        } else {
          descr += (e.padrao ? `<strong>${e.descricaoIndustriaPrazo}</strong>, ` : e.descricaoIndustriaPrazo + ", ")
        }
      })
      return $sce.trustAsHtml(descr)
    }

    ctrl.selecionaIndustriaPrazoPadrao = function () {
      ctrl.industriaCliente.listaIndustriaClientePrazo.forEach((e, i, arr) => {
        if (e.id == ctrl.industriaClientePrazoPadrao.selecionado.id && e.idIndustriaPrazo == ctrl.industriaClientePrazoPadrao.selecionado.idIndustriaPrazo) {
          e.padrao = true
        } else {
          e.padrao = false
        }
      })
    }

    ctrl.uploadArquivoCliente = function () {
      var files = ctrl.arquivoCliente;
      if (!files) {
        NotificationService.alert("Nenhum arquivo selecionado")
      }
      blockUI.start('Carregando Arquivo, Aguarde...');
      service.uploadArquivoCliente(files, ctrl.cliente.cpfCnpj, function (result) {
        adicionaArquivosCliente(result)
        ctrl.arquivoCliente = null
        blockUI.stop();
      }, function (error) {
        console.log('ERR')
        blockUI.stop();
      });
    }

    function adicionaArquivosCliente(arquivosEnviados) {
      if (arquivosEnviados) {
        if (!ctrl.cliente.arquivos) {
          ctrl.cliente.arquivos = []
        }
        arquivosEnviados.forEach((item, index) => {
          const arquivoClienteDto = {
            id: null,
            idCliente: ctrl.cliente.id,
            nomeArquivo: item.nomeArquivo
          }
          ctrl.cliente.arquivos.push(arquivoClienteDto)
        })
      }
    }

    function salvar() {
      service.salvarCliente(ctrl.cliente, function (result) {
        NotificationService.success(`Cliente ${result.razaoSocial} cadastrado com sucesso!`);
        $location.path('/listaClientes');
      })
    }

    this.$onInit = function () {
      ctrl.auth = $scope.$parent.$resolve.auth;
      ctrl.listaRepresentacoesVendedor = [];
      ctrl.listaRepresentacoesCliente = [];
      ctrl.listaIndustriaCliente = [];
      ctrl.industriaPrazo = {
        selecionado: undefined,
      }

      if (ctrl.cliente) {
        ctrl.listaRepresentacoesCliente = ctrl.cliente.listaRepresentacoesCliente;
        ClienteService.buscaIndustriaCliente(cliente.id).then((response) => {
          ctrl.listaIndustriaCliente = response;
        });
        if (ctrl.cliente.excluido) {
          NotificationService.alert('Este cliente está excluído. Efetue as alterações e salve o cadastro para reativá-lo.')
        }
      } else {
        ctrl.cliente = {
          id: null,
          razaoSocial: "",
          nomeFantasia: "",
          cpfCnpj: null,
          rgIe: "",
          rua: "",
          numero: null,
          sala: null,
          andar: null,
          complemento: "",
          bairro: "",
          cep: "",
          cidade: "",
          estado: null,
          telefone: null,
          celular: null,
          contato: "",
          email: "",
          diasEntrega: "",
          horarioEntrega: "",
          nomeBanco: null,
          numeroAgencia: "",
          nomeAgencia: "",
          numeroConta: "",
          idPessoa: null,
          ativo: true,
          bloqueioVenda: false,
          informacoesAdicionais: "",
          pendenteRegistro: null,
          referenciasComerciais: undefined,
          excluido: null
        };
      }

      ctrl.banco = {
        nome: null
      };

      ctrl.arquivoCliente = undefined

      ctrl.representacaoVendedor = {
        selecionado: null
      };

      ctrl.industria = {
        selecionado: null
      };

      ctrl.estado = {
        selecionado: null
      }

      ctrl.industriaCliente = {
        idCliente: null,
        idIndustria: null,
        codigo: null,
        limiteCredito: null,
        ativo: true,
        bloqueioVenda: false,
        nomeIndustria: null,
        removido: false,
        listaIndustriaClientePrazo: [],
        listaIndustriaClientePrazoParaRemover: [],
      }

      ctrl.representacaoCliente = {
        id: null,
        industria: {
          id: null,
          nome: null
        },
        usuario: {
          id: null,
          nome: null
        }
      }

      ctrl.bloqueiaSalvar = (AuthenticationService.isVendedor() && ctrl.listaRepresentacoesCliente.length < 1)

      ctrl.tipoPessoa = {
        selecionado: null
      };

      ctrl.industriaClientePrazoPadrao = {
        selecionado: undefined,
      }

      ctrl.usuario = $rootScope.globals.currentUser.user;
    };
  }
});
'use strict'

var ClienteModulo = angular.module('cliente.module');

ClienteModulo.component('pesquisaClienteComponent', {
  templateUrl: 'modules/cliente/components/pesquisa/views/pesquisaCliente.html',
  controller : () => {
    this.vm = this;
  }
});
'use strict';

var IndustriaModule = angular.module('industria.module');

IndustriaModule.component('cadastroPrazoComponent', {
  templateUrl: 'modules/industria/components/cadastroPrazo/views/cadastroPrazo.html',
  bindings: {
    listaIndustrias: '<'
  },
  controllerAs: 'ctrl',
  controller: function(IndustriaPrazoService, NotificationService, ModalService) {
    var ctrl = this;
    this.$onInit = init(ctrl);

    ctrl.adicionaDia = function () {
      let existe = $.grep(ctrl.listaPrazoDia, function(item) {
        return item === ctrl.prazoDia.prazo
      })
      if(existe.length > 0) {
        return
      } else {
        ctrl.listaPrazoDia.push(ctrl.prazoDia.prazo)
        ctrl.prazoDia.prazo = undefined
      }
    }

    ctrl.buscaDias = function (prazo) {
      let strDias = ""
      if (prazo && prazo.dias) {
        prazo.dias.forEach(element => {
          if (strDias.length == 0) {
            strDias = element.prazo
          } else {
            strDias = `${strDias} - ${element.prazo}`
          }
        })
      }
      return strDias
    }
  
    ctrl.carregaDadosIndustria = function (industria) {
      ctrl.industriaPrazoDto.idIndustria = industria.id
  
      IndustriaPrazoService.getIndustriaPrazo(industria.id).then((result) => {
        ctrl.listaPrazo = result;
      });
    }
  
    ctrl.salvar = function () {
      if(!ctrl.listaPrazoDia || ctrl.listaPrazoDia.length < 1) {
        NotificationService.error('É necessário fornecer ao menos um dia!')
        return
      }
      ctrl.listaPrazoDia.forEach(element => {
        const industriaPrazoDiaDto = {
          prazo: element
        }
        ctrl.industriaPrazoDto.dias.push(industriaPrazoDiaDto)
      })
      IndustriaPrazoService.salvaIndustriaPrazo(ctrl.industriaPrazoDto).then(() => {
        NotificationService.success('Prazos da indústria atualizado com sucesso!');
        atualizaListaPrazos()
        inicializaDados()
      })
    }
  
    ctrl.removerDia = function () {
      ctrl.listaPrazoDia = $.grep(ctrl.listaPrazoDia, function (value) {
        return value !== ctrl.diaSelecionado.dia
      })
    }
  
    ctrl.excluirPrazosIndustria = function (idPrazoIndustria) {
      var modalOptions = {
        closeButtonText: 'Não',
        actionButtonText: 'Sim',
        headerText: 'Confirmar',
        bodyText: 'Confirma EXCLUSÃO do prazo para a indústria?'
      }
      ModalService.showModal({}, modalOptions).then(function (result) {
        IndustriaPrazoService.removerIndustriaPrazo(idPrazoIndustria).then(() => {
          NotificationService.success('Prazo excluído com sucesso!');
          atualizaListaPrazos()
        }), () => {
          NotificationService.error('Erro ao excluir prazo!!');
          atualizaListaPrazos()
        }
      })
    }

    function inicializaDados() {
      ctrl.industriaPrazoDto.dias = []
      ctrl.industriaPrazoDto.codigo = undefined
      ctrl.industriaPrazoDto.descricao = undefined
      ctrl.listaPrazoDia = []
    }
  
    function atualizaListaPrazos() {
      ctrl.carregaDadosIndustria(ctrl.industria.selecionado)
    }
  

    //---------------------------


    function init() {
      ctrl.industria = {}
      ctrl.listaPrazoDia = []
      ctrl.listaPrazo = []
      ctrl.diaSelecionado = {
        dia: undefined
      }
    
      ctrl.prazoDia = {
        prazo: undefined,
      }
    
      ctrl.industriaPrazoDto = {
        dias: []
      }

      inicializaDados();
    }
  }
});
'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('pesquisaPedidoComponent', {
  templateUrl: 'modules/pedido/components/pesquisa/views/pesquisaPedido.html',
  bindings: {
    listaIndustrias: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log, $scope, PedidoService,
    ModalService, ClienteService, NotificationService, UsuarioService, uibDateParser) {
    var ctrl = this;
    this.$onInit = init();

    ctrl.buscaClientes = function (value) {
      ctrl.clienteSearch.razaoSocial = value;
      return ClienteService.getClientesPorFiltro(ctrl.clienteSearch).then(result => {
        return result.content;
      });
    };

    UsuarioService.buscaUsuarios().then(response => {
      ctrl.listaVendedores = response;
    });

    PedidoService.getListaStatusPedido().then(result => {
      ctrl.listaStatusPedido = result
    })

    ctrl.selectCliente = function($item) {
      ctrl.pedidoSearch.idCliente = $item.id;
    }
    

    $scope.$watchCollection('ctrl.pedidoSearch', function (novaTabela, antigaTabela) {
      $log.log('filtro: ', ctrl.pedidoSearch);
      PedidoService.getPedidosPorCriteria(ctrl.pedidoSearch).then((result) => {
        $log.log('result: ', result);
        ctrl.searchResult = result;
        ctrl.pedidos = result.content;
      })
    });

    /*
    ctrl.selectCliente = function (item) {
      ctrl.pedidoSearch.idCliente = item.id
      buscaPedidos()
    }

    let filtroPedido = StorageService.getFiltroPedidoAtivo()
    if (filtroPedido) {
      ctrl.pedidoSearch = filtroPedido
    } else {
      ctrl.pedidoSearch = {
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
      ctrl.vendedor = usuario;
      ctrl.pedidoSearch.idUsuario = usuario.id;
    } else {
      CadastroClientesService.buscaVendedores(function (response) {
        ctrl.vendedores = response;
      });
    }

    ctrl.statusPedido = undefined;
    */
    /*
     service.getListaStatusPedido((response) => {
       ctrl.listaStatusPedido = response;
       if (ctrl.pedidoSearch.idStatus) {
         ctrl.listaStatusPedido.forEach(function (item, index) {
           if (item.id === ctrl.pedidoSearch.idStatus) {
             ctrl.statusPedido = item
           }
         });
       }
     });
     */

    /*
    var paginationOptions = {
      pageNumber: PAGINACAO.PEDIDO.NEW_PAGE,
      pageSize: PAGINACAO.PEDIDO.PAGE_SIZE,
      sort: null
    };
    */

    /* FILTROS DE PESQUISA

    ctrl.selecionaVendedor = function () {
      buscaPedidos()
    }

    ctrl.selecionaData = function () {
      buscaPedidos();
    }

    ctrl.limpaFiltro = function () {
      ctrl.pedidoSearch = {
        idIndustria: null,
        idUsuario: ctrl.isVendedor() ? usuario.id : null,
        idStatus: null,
        dtInicio: null,
        dtFim: null,
        idCliente: null,
        newPage: PAGINACAO.PEDIDO.NEW_PAGE,
        pageSize: PAGINACAO.PEDIDO.PAGE_SIZE
      };
      ctrl.statusPedido = undefined
      ctrl.cliente.selecionado = undefined
      buscaPedidos()
      StorageService.resetFiltroPedidoAtivo()
    }
    */

    /* ----------------------------------------------------*/

    /*
    ctrl.selecionaStatus = function () {
      if (ctrl.statusPedido) {
        ctrl.pedidoSearch.idStatus = ctrl.statusPedido.id
      } else {
        ctrl.pedidoSearch.idStatus = null
      }
      if (StorageService.getFiltroPedidoAtivo()) {
        StorageService.resetFiltroPedidoAtivo()
      }
      buscaPedidos();
    }
    */

    /*

    buscaPedidos();
    */

    ctrl.buscaPedidos = function () {
      //StorageService.setFiltroPedidoAtivo(ctrl.pedidoSearch)
      //ctrl.pedidoSearch.isVendedor = ctrl.isVendedor()
      PedidoService.getPedidosPorCriteria(ctrl.pedidoSearch).then((result) => {
        $log.log('pedidos: ', result);
        ctrl.searchResult = result;
        ctrl.pedidos = result.content;
      })
    }



    ctrl.getStatus = function (i) {
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

    ctrl.formatDate = function (date) {
      return new Date(date).toLocaleDateString("pt-BR")
    }

    /* DETALHAR PEDIDO */
    ctrl.exibeDetalhesPedido = function (idPedido) {
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
    ctrl.editarPedido = function (idPedido) {
      if (!idPedido) {
        return
      }
      StorageService.setFiltroPedidoAtivo(ctrl.pedidoSearch)
      PedidoService.getPedido(idPedido, (result) => {
        PedidoService.pedidoParaEditar = result;
        $location.path('/pedido');
      })
    }

    /* CANCELAR PEDIDO */
    ctrl.cancelarPedido = function (listagemPedidoDto) {
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
            //$route.reload()
          }), function () {
            NotificationService.error("Erro ao cancelar pedido!")
            //$route.reload()
          }
        })
      });
    }

    ctrl.podeEditar = function (listagemPedidoDto) {
      if (!listagemPedidoDto) {
        return
      }
      return listagemPedidoDto.status === STATUS_PEDIDO.NEGADO && listagemPedidoDto.idVendedor === ctrl.usuario.id;
    }

    ctrl.mudaPagina = () => {
      ctrl.buscaPedidos();
    }

    ctrl.getTotalPedidoSemSt = (pedido) => {
      return service.getTotalPedidoSemSt(pedido)
    }

    ctrl.openIni = function() {
      ctrl.popup.openedini = true;
    };

    ctrl.openFim = function() {
      ctrl.popup.openedfim = true;
    };

    function init() {

      ctrl.cliente = {
        selecionado: undefined
      }

      ctrl.resultadoBusca = undefined
      ctrl.paginaAtual = 0
      ctrl.totalPaginas = 0

      ctrl.canEditPedido = false;
      ctrl.pedidoSelecionado = undefined;

      ctrl.exibeOpcionais = innerWidth > 700 ? true : false;

      ctrl.usuario = ctrl.auth = $scope.$parent.$resolve.auth;

      ctrl.clienteSearch = {
        idUsuario: ctrl.usuario.id,
        razaoSocial: null,
        newPage: 1,
        pageSize: 6
      };

      ctrl.pedidoSearch = {
        idIndustria: null,
        idUsuario: null,
        idStatus: null,
        dtInicio: null,
        dtFim: null,
        idCliente: null,
        newPage: PAGINACAO.PEDIDO.NEW_PAGE,
        pageSize: PAGINACAO.PEDIDO.PAGE_SIZE
      };

      ctrl.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
      };

      ctrl.popup = {
        opened: false
      };
    };
  }
});
'use strict';

var TabelaModulo = angular.module('tabela.module');

PedidoModulo.component('cargaTabelaComponent', {
  templateUrl: 'modules/tabela/components/carga/views/cargaTabela.html',
  bindings: {
    listaIndustrias: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log) {
    var ctrl = this;
    this.$onInit = init();
    function init() {
      $log.log('init carga de tabelas');
    };
  }
});

'use strict'

var UsuarioModulo = angular.module('usuario.module')

UsuarioModulo.component('cadastroUsuarioComponent', {
	templateUrl: 'modules/usuario/components/cadastro/views/cadastroUsuario.html',
	controllerAs: 'ctrl',
	bindings: {
    usuarioParaEditar: '<'
  },
	controller: function usuarioModuloController(
		$state,
		UsuarioService,
		IndustriaService,
		NotificationService,
		LoginService,
		ModalService
	) {

		this.vm = this;

		if (this.vm.usuarioParaEditar) {
			this.vm.cadastro = this.vm.usuarioParaEditar
			this.vm.senhaOriginal = LoginService.decodePassword(this.vm.cadastro.senha.senha1)
			this.vm.cadastro.senha.senha1
			this.vm.representacoes = this.vm.usuarioParaEditar.representacoes
		} else {
			this.vm.cadastro = {
				ativo: true
			}
			this.vm.representacoes = []
		}

		this.vm.representacao = {
			industria: null
		}
		this.vm.listaIndustria = []
		this.vm.senhaAlterada = false
		this.vm.importacao = {
			usuario: null
		}

		UsuarioService.listaPerfil().then((result) => {
			this.vm.listaPerfil = result
		})

		this.vm.selecionaTabRepresentacao = function () {

			IndustriaService.getIndustrias().then((result) => {
				this.vm.listaIndustria = result
			})
			if (this.vm.cadastro.id) {
				UsuarioService.buscaUsuarioCadastroDto(this.vm.cadastro.id).then((result) => {
					this.vm.representacoes = result.representacoes
				})
			}
		}

		this.vm.selecionaTabRepresentacaoCliente = function () {

			UsuarioService.buscaUsuarios().then((result) => {
				this.vm.usuarios = result;
				this.vm.nomeUsuarioFormatado = `${this.vm.cadastro.id} - ${this.vm.cadastro.nome}`;
			});
		}

		this.vm.criaRepresentacao = function () {
			var listaEncontrados = $.grep(this.vm.representacoes, function (e, i) {
				return e.idIndustria == this.vm.representacao.industria.id;
			});
			if (listaEncontrados && listaEncontrados.length > 0) {
				NotificationService.alert('Indústria já cadastrada para o usuário.')
			} else {
				var representacaoDto = new RepresentacaoDto(this.vm.cadastro, this.vm.representacao.industria);
				this.vm.representacoes.push(representacaoDto)
			}
		}

		this.vm.salvaUsuario = function () {
			ajustesCriptografiaSenha()
			this.vm.cadastro.representacoes = this.vm.representacoes
			if (validaSenha()) {
				UsuarioService.salvaUsuario(this.vm.cadastro).then((result) => {
					this.vm.cadastro = result
					this.vm.senhaOriginal = LoginService.getPassword(this.vm.cadastro.senha.senha1)
					this.vm.senhaAlterada = false
					NotificationService.success('Usuário cadastrado com sucesso!')
				})
			} else {
				NotificationService.error('Senhas informadas não são iguais')
			}
		}

		this.vm.excluiUsuario = function () {
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: `Ao EXCLUIR o usuário o não será mais possível acessar os dados deste! Confirma?`
			};
			ModalService.showModal({}, modalOptions).then(function (result) {
				UsuarioService.buscaUsuarioPorId(this.vm.cadastro.id, function (result) {
					result.excluido = true
					UsuarioService.salvaUsuario(result, function (usuario) {
						NotificationService.success("Usuário EXCLUÍDO com sucesso!")
						$state.go('usuario.pesquisa')
					})
				})
			})
		}

		this.vm.sinalizaSenhaAlterada = function () {
			this.vm.senhaAlterada = true
		}

		this.vm.isVendedor = function () {
			return LoginService.isVendedor();
		}

		this.vm.importar = function () {
			if (this.vm.cadastro.id === this.vm.importacao.usuario.id) {
				NotificationService.alert('Não é possível importar para o mesmo usuário')
				return
			}
			var importacaoUsuarioDto = {
				idUsuarioOrigem: this.vm.importacao.usuario.id,
				idUsuarioDestino: this.vm.cadastro.id
			}
			UsuarioService.verificarImportacaoBaseUsuario(importacaoUsuarioDto).then((result) => {
				var modalOptions = {
					closeButtonText: 'Cancelar',
					actionButtonText: 'Importar',
					headerText: `Dados a serem importados`,
					bodyDataList: result
				};
				var modalDefaults = {
					backdrop: true,
					keyboard: true,
					modalFade: true,
					templateUrl: 'modules/modal/modalImportacaoClientesUsuario.html',
				};
				ModalService.showModal(modalDefaults, modalOptions).then(function (modalResult) {
					UsuarioService.importarBaseUsuario(result, function (importacaoResult) {
						NotificationService.success(`Importação realizada com sucesso! ${importacaoResult} clientes importados.`)
						$state.go('usuario.edicao', { 'id': this.vm.cadastro.id })
					})
				});
			})
		}

		this.vm.verificaUsuarioCadastradoPorLogin = () => {
			UsuarioService.buscaUsuarioPorLogin(this.vm.cadastro.login).then(result => {
				if (result) {
					NotificationService.error('Login do usuário já existente');
					this.vm.cadastro.login = null
				}
			});
		}

		function ajustesCriptografiaSenha() {
			if (this.vm.cadastro.id) {
				if (this.vm.senhaAlterada && this.vm.senhaOriginal != this.vm.cadastro.senha.senha1) {
					this.vm.cadastro.senha.senha1 = LoginService.getPasswordEncoded(this.vm.cadastro.senha.senha1)
					this.vm.cadastro.senha.senha2 = LoginService.getPasswordEncoded(this.vm.cadastro.senha.senha2)
				}
			} else {
				this.vm.cadastro.senha.senha1 = LoginService.getPasswordEncoded(this.vm.cadastro.senha.senha1)
				this.vm.cadastro.senha.senha2 = LoginService.getPasswordEncoded(this.vm.cadastro.senha.senha2)
			}
		}

		function validaSenha() {
			return this.vm.cadastro.senha.senha1 === this.vm.cadastro.senha.senha2
		}
	}
})

'use strict';

var UsuarioModulo = angular.module('usuario.module');

UsuarioModulo.component('pesquisaUsuarioComponent', {
	templateUrl: 'modules/usuario/components/pesquisa/views/pesquisa.html',
	controllerAs: 'ctrl',
	controller: function usuarioModuloController($state, UsuarioService, NotificationService, ModalService) {
		var changeFilter = true

		this.vm = this

		this.vm.totalItens = 0
		this.vm.filter = {
			pageSize: 10,
			newPage: 1
		}
		// SE $event FOR PASSADO O COMPONENTE NAO PERDE O FOCO
		this.vm.pesquisa = ($event) => {
			if (!changeFilter) {
				return
			}
			UsuarioService.pesquisa(this.vm.filter).then((result) => {
				this.vm.result = result
				this.vm.lista = this.vm.result.content;
				this.vm.totalItens = this.vm.result.totalElements
				if (this.vm.lista) {
					changeFilter = false
					if ($event && $event.target) {
						$event.target.focus()
					}
				}
			})
		}

		this.vm.verificaPesquisa = ($event) => {
			if ($event.charCode === ENTER_KEY_CODE) {
				this.vm.pesquisa($event)
			}
		}

		//APENAS EFETUA A PESQUISA SE O FILTRO FOI ALTERADO
		this.vm.changeField = () => {
			changeFilter = true
		}

		this.vm.mudaPagina = () => {
			changeFilter = true
			this.vm.pesquisa()
		}

		this.vm.editarRegistro = (id) => {
			$state.go('main.usuario.edicao', { 'id': id })
		}

		this.vm.novoUsuario = function () {
			$state.go('usuario.cadastro')
		}

		this.vm.inativarUsuario = function (id) {
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: `Ao DESABILITAR o usuário o mesmo não poderá mais acessar o sistema! Confirma?`
			};
			ModalService.showModal({}, modalOptions).then(function (result) {
				UsuarioService.buscaUsuarioPorId(id).then((result) => {
					result.ativo = false
					UsuarioService.salvaUsuario(result).then((usuario) => {
						NotificationService.success(`Usuário ${usuario.nome} DESABILITADO com sucesso!`)
						changeFilter = true
						this.vm.pesquisa()
					})
				})
			})
		}

		this.vm.excluirUsuario = function (id) {
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: `Ao EXCLUIR o usuário o não será mais possível acessar os dados deste! Confirma?`
			};
			ModalService.showModal({}, modalOptions).then(function (result) {
				UsuarioService.buscaUsuarioPorId(id).then((result) => {
					result.excluido = true
					UsuarioService.salvaUsuario(result).then((usuario) => {
						NotificationService.success(`Usuário ${usuario.nome} EXCLUÍDO com sucesso!`)
						changeFilter = true
						this.vm.pesquisa()
					})
				})
			})
		}

		this.vm.pesquisa()

	}

});

'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').component('chat', {
	templateUrl: './components/chat/chat-template.html',
	bindings: {
		observacoes: '=',
		auth: '<',
		idPedido: '<'
	},
	controllerAs: 'ctrl',
	controller: function chatController() {
		var ctrl = this
		ctrl.adicionaObservacao = function() {
			const dataCriacao = new Date().toISOString();
			let msg = {
				idObservacao: undefined,
				idPedido: ctrl.idPedido,
				dataCriacao: dataCriacao,
				dataLeitura: undefined,
				lido: undefined,
				idUsuario: ctrl.auth.id,
				observacao: ctrl.observacao,
				nomeUsuario: ctrl.auth.nome
			}
			console.log('msg: ', msg);
			ctrl.observacoes.push(msg);
			console.log('ctrl.observacoes: ', ctrl.observacoes);
	
			// Limpa campo da tela
			ctrl.observacao = undefined
		}
	}
})
'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas').component('chatMessage', {
	templateUrl: './components/chat-message/chat-message-template.html',
	controller: function chatMessageController() {
		var ctrl = this

		ctrl.calculaTempo = function (msg) {
			return new Date(msg.dataCriacao).toLocaleString()
		}

		ctrl.verificaUsuarioLogado = function (msg) {
			if (ctrl.auth.id == msg.idUsuario) {
				return true;
			}
			return false;
		}
	},
	bindings: {
		mensagens: '=',
		auth: '<'
	},
	controllerAs: 'ctrl'
})
'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('dadosPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/dadosPedido/views/dadosPedido.html',
  bindings: {
    listaIndustrias: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log, ClienteService, $scope, TabelaService, IndustriaPrazoService, $state, PedidoService) {
    var ctrl = this;
    this.$onInit = init(ctrl);

    ctrl.selecionaIndustria = function () {
      const buscaClientesDto = {
        idUsuario: ctrl.idUsuario,
        idIndustria: ctrl.pedido.industria.id
      }
      ClienteService.getClientesPorRepresentacao(buscaClientesDto).then((clienteDtoList) => {
        ctrl.listaClientes = clienteDtoList;
      });
      TabelaService.getTabelasPorIndustria(ctrl.pedido.industria.id).then((tabelaDtoList) => {
        ctrl.listaTabelas = tabelaDtoList
      });
    };

    ctrl.selecionaCliente = function () {
      $log.log(ctrl.pedido.cliente);
    };

    ctrl.selecionaTabela = function () {
      const industriaPrazoSearchDto = {
        idIndustria: ctrl.pedido.industria.id,
        idCliente: ctrl.pedido.cliente.id
      }
      IndustriaPrazoService.getIndustriaPrazoClientePrazo(industriaPrazoSearchDto).then((industriaPrazoPedidoDtoList) => {
        ctrl.listaPrazos = industriaPrazoPedidoDtoList;
      })
    };

    ctrl.open = function() {
      ctrl.popup.opened = true;
    };

    ctrl.geraPedido = function() {
      PedidoService.setPedidoAtivo(ctrl.pedido);
      $state.go('main.pedido.cadastro.itens', {'pedido': ctrl.pedido});
    };

    function init(ctrl) {
      ctrl.pedido = {}
      ctrl.pedido.dataPedido = new Date();

      ctrl.possuiPedidoAtivo = false;
      ctrl.idUsuario = $scope.$parent.$resolve.auth.id;
      ctrl.pedido.dataEntrega = geraDataEntrega();

      ctrl.dateOptions = {
        formatYear: 'yyyy',
        minDate: new Date(),
        startingDay: 1
      };

      ctrl.popup = {
        opened: false
      };

      ctrl.propostaOptions = [
        {id: 0, text: 'Não'},
        {id: 1, text: 'Sim'}
      ];

      ctrl.cargaOptions = [
        {value: 1, text: 'Batida'},
        {value: 2, text: 'Paletizada'}
      ];

      ctrl.proposta = {
        selecionado : null
      };

      ctrl.carga = {
        selecionado: null
      };
    }

    function geraDataEntrega() {
      let dataAtual = new Date(); 
      return new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate() + 1);
    }
  }
});

'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('edicaoPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/edicaoPedido/views/edicaoPedido.html',
  bindings: {
    pedido: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log, $scope, IndustriaPrazoService, $state, PedidoService, TabelaService, $filter, PedidoCalculoService) {
    var ctrl = this;
    this.$onInit = init(ctrl);

    ctrl.open = function () {
      ctrl.popup.opened = true;
    };

    ctrl.geraPedido = function () {
      PedidoService.setPedidoAtivo(ctrl.pedido);
      $state.go('main.pedido.cadastro.itens', { 'pedido': ctrl.pedido });
    };

    $scope.$watch('ctrl.pedido.tabela', function (novaTabela, antigaTabela) {
      if (novaTabela.id !== antigaTabela.id) {
        $filter('itensAdicionadosFilter', null)(antigaTabela.itens).forEach(item => {
          $filter('filter')(novaTabela.itens, { codigo: item.codigo }).forEach(novoItem => {
            novoItem['inserido'] = item['inserido']
            novoItem['quantidadeSolicitada'] = item['quantidadeSolicitada']
            novoItem['desconto'] = item['desconto']
            PedidoCalculoService.inicializaPreco(novoItem);
          })
        });
      }
    });

    function init(ctrl) {
      TabelaService.getTabelasPorIndustria(ctrl.pedido.industria.id).then((tabelaDtoList) => {
        ctrl.listaTabelas = tabelaDtoList
      });

      const industriaPrazoSearchDto = {
        idIndustria: ctrl.pedido.industria.id,
        idCliente: ctrl.pedido.cliente.id
      }
      IndustriaPrazoService.getIndustriaPrazoClientePrazo(industriaPrazoSearchDto).then((industriaPrazoPedidoDtoList) => {
        ctrl.listaPrazos = industriaPrazoPedidoDtoList;
      })

      function geraDataEntrega(dataEntrega) {
        return new Date(dataEntrega)
      }

      ctrl.pedido.dataEntrega = geraDataEntrega(ctrl.pedido.dataEntrega);

      ctrl.dateOptions = {
        formatYear: 'yyyy',
        minDate: new Date(),
        startingDay: 1
      };

      ctrl.popup = {
        opened: false
      };

      ctrl.propostaOptions = [
        { id: 0, text: 'Não' },
        { id: 1, text: 'Sim' }
      ];

      ctrl.cargaOptions = [
        { value: 1, text: 'Batida' },
        { value: 2, text: 'Paletizada' }
      ];
    }
  }
});

'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('itensPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/itensPedido/views/itensPedido.html',
  bindings: {
    pedido: '='
  },
  controllerAs: 'ctrl',
  controller: function ($log, $state, PedidoService, PedidoCalculoService) {
    var ctrl = this;

    ctrl.selecionaProduto = function () {
      ctrl.pedido.tabela.itens.findIndex((item) => {
        if (item.id === ctrl.produto.selecionado.id) {
          ctrl.inicializaPreco(item);
        }
      });
    };

    ctrl.isPedidoProposta = function () {
      return ctrl.pedido.proposta.id === PEDIDO_PROPOSTA;
    };

    ctrl.adicionaProduto = function () {
      ctrl.produto.selecionado.inserido = true;
      ctrl.produto.selecionado = null;
      PedidoService.setPedidoAtivo(ctrl.pedido);
      ctrl.valorTotalPedido = PedidoCalculoService.getValorTotalPedido(ctrl.pedido);
    }

    ctrl.editarProduto = function (item) {
      delete item.inserido;
      ctrl.produto.selecionado = item;
    }

    ctrl.removeProduto = function (item) {
      delete item.inserido;
      PedidoService.setPedidoAtivo(ctrl.pedido);
    }

    ctrl.voltar = function () {
      $state.go('main.pedido.cadastro.edicao');
    }

    ctrl.finalizarPedido = function () {
      $state.go('main.pedido.cadastro.resumo');
    }

    ctrl.alteraPrecoSemImposto = function () {
      PedidoCalculoService.alteraPrecoSemImposto(ctrl.produto.selecionado);
    }

    ctrl.alteraPrecoComImposto = function () {
      PedidoCalculoService.alteraPrecoComImposto(ctrl.produto.selecionado);
    }

    ctrl.alteraDesconto = function () {
      PedidoCalculoService.alteraDesconto(ctrl.produto.selecionado);
    }

    ctrl.inicializaPreco = function (item) {
      PedidoCalculoService.inicializaPreco(item);
    }

    this.$onInit = function () {
      ctrl.produto = {
        selecionado: null
      };
      ctrl.valorTotalPedido = PedidoCalculoService.getValorTotalPedido(ctrl.pedido);
      ctrl.editandoItem = null
      $log.log('pedido: ', ctrl.pedido);
    };
  }
});


'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('resumoPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/resumoPedido/views/resumoPedido.html',
  bindings: {
    pedido: '='
  },
  controllerAs: 'ctrl',
  controller : function ($scope, $state, PedidoCalculoService, PedidoService) {
    var ctrl = this;

    ctrl.voltar = function() {
      PedidoService.setPedidoAtivo(ctrl.pedido);
      $state.go('main.pedido.cadastro.itens');
    }

    this.$onInit = function () {
      ctrl.valorTotalPedidoComImposto = PedidoCalculoService.getValorTotalPedido(ctrl.pedido)
      ctrl.valorTotalPedidoSemImposto = PedidoCalculoService.getValorTotalPedidoSemImposto(ctrl.pedido)
      ctrl.totalItens = PedidoCalculoService.getTotalItens(ctrl.pedido)
      ctrl.auth = $scope.$parent.$resolve.auth
      if(!ctrl.pedido.observacoesPedidoDto) {
        ctrl.pedido.observacoesPedidoDto = [];
      }
    };
  }
});


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuY29uZmlnLmpzIiwiYXBwL2FwcC5jb25zdGFudHMuanMiLCJhcHAvYXBwLm1vZHVsZS5qcyIsImFwcC9odHRwLnNlcnZpY2UuanMiLCJjYWRhc3Ryb0NsaWVudGVzL2NvbnRyb2xsZXIuanMiLCJjYWRhc3Ryb0NsaWVudGVzL2RpcmVjdGl2ZXMuanMiLCJjYWRhc3Ryb0NsaWVudGVzL3NlcnZpY2VzLmpzIiwiYXV0aGVudGljYXRpb24vY29udHJvbGxlci5qcyIsImF1dGhlbnRpY2F0aW9uL3JlcG9zaXRvcnkuanMiLCJhdXRoZW50aWNhdGlvbi9zZXJ2aWNlcy5qcyIsImNsaWVudGUvY2xpZW50ZS5jb25maWcuanMiLCJjbGllbnRlL2NsaWVudGUubW9kdWxlLmpzIiwiY2xpZW50ZS9jbGllbnRlLnNlcnZpY2UuanMiLCJjbGllbnRlc0NhZGFzdHJhZG9zL2NvbnRyb2xsZXIuanMiLCJjbGllbnRlc0NhZGFzdHJhZG9zL3NlcnZpY2UuanMiLCJjb25zb2xlL3NlcnZpY2UuanMiLCJkYXNoYm9hcmQvY29udHJvbGxlci5qcyIsImRhc2hib2FyZC9zZXJ2aWNlLmpzIiwiZGF0YWJhc2Uvc2VydmljZS5qcyIsImRldGFsaGVQZWRpZG8vY29udHJvbGxlci5qcyIsImRldGFsaGVQZWRpZG8vc2VydmljZS5qcyIsImRldGFsaGVQZWRpZG9JdGVucy9jb250cm9sbGVyLmpzIiwiZGV0YWxoZVBlZGlkb1NhbHZvL2NvbnRyb2xsZXIuanMiLCJkZXRhbGhlUGVkaWRvU2Fsdm8vc2VydmljZS5qcyIsImRldGFsaGVQZWRpZG9TYWx2b0l0ZW5zL2NvbnRyb2xsZXIuanMiLCJpbmR1c3RyaWEvaW5kdXN0cmlhLmNvbmZpZy5qcyIsImluZHVzdHJpYS9pbmR1c3RyaWEubW9kdWxlLmpzIiwiaW5kdXN0cmlhL2luZHVzdHJpYS5zZXJ2aWNlLmpzIiwiaW5kdXN0cmlhLXByYXpvL2luZHVzdHJpYS1wcmF6by5tb2R1bGUuanMiLCJpbmR1c3RyaWEtcHJhem8vaW5kdXN0cmlhLXByYXpvLnNlcnZpY2UuanMiLCJpbmR1c3RyaWFDbGllbnRlUHJhem8vc2VydmljZS5qcyIsImluZHVzdHJpYXMvY29udHJvbGxlci5qcyIsImluZHVzdHJpYXMvc2VydmljZXMuanMiLCJpbmR1c3RyaWFQcmF6by5vbGQvc2VydmljZS5qcyIsIml0ZW0vY29udHJvbGxlci5qcyIsIml0ZW0vc2VydmljZS5qcyIsIm1hcHBlci9zZXJ2aWNlLmpzIiwibW9kYWwvc2VydmljZS5qcyIsImxvY2FsU3RvcmFnZS9zZXJ2aWNlLmpzIiwibmV0d29yay9zZXJ2aWNlLmpzIiwib2JzZXJ2YWNhb1BlZGlkby9zZXJ2aWNlLmpzIiwicGVkaWRvL3BlZGlkby5jYWxjdWxvLnNlcnZpY2UuanMiLCJwZWRpZG8vcGVkaWRvLmNvbmZpZy5qcyIsInBlZGlkby9wZWRpZG8uZGlyZWN0aXZlLmpzIiwicGVkaWRvL3BlZGlkby5maWx0ZXIuanMiLCJwZWRpZG8vcGVkaWRvLm1vZHVsZS5qcyIsInBlZGlkby9wZWRpZG8uc2VydmljZS5qcyIsInBlZGlkby5vbGQvY29udHJvbGxlci5qcyIsInBlZGlkby5vbGQvc2VydmljZS5qcyIsIm5vdGlmaWNhY2FvL2NvbnRyb2xsZXIuanMiLCJub3RpZmljYWNhby9zZXJ2aWNlLmpzIiwicGVkaWRvUHJvZHV0b3MvY29udHJvbGxlci5qcyIsInBlZGlkb1Byb2R1dG9zL2RpcmVjdGl2ZS5qcyIsInBlZGlkb1Byb2R1dG9zL3NlcnZpY2UuanMiLCJwZWRpZG9SZXN1bW8vY29udHJvbGxlci5qcyIsInBlZGlkb1Jlc3Vtby9zZXJ2aWNlLmpzIiwic3RvcmFnZS9zZXJ2aWNlLmpzIiwic2luY3Jvbml6YWNhby9zZXJ2aWNlLmpzIiwidGFiZWxhL3RhYmVsYS5jb25maWcuanMiLCJ0YWJlbGEvdGFiZWxhLm1vZHVsZS5qcyIsInRhYmVsYS90YWJlbGEuc2VydmljZS5qcyIsInRhYmVsYS5vbGQvY29udHJvbGxlci5qcyIsInRhYmVsYS5vbGQvc2VydmljZS5qcyIsInVzdWFyaW8vdXN1YXJpby5jb25maWcuanMiLCJ1c3VhcmlvL3VzdWFyaW8ubW9kdWxlLmpzIiwidXN1YXJpby91c3VhcmlvLnNlcnZpY2UuanMiLCJhcHAvY29tcG9uZW50cy9sb2dpbi9sb2dpbi5jb21wb25lbnQuanMiLCJhcHAvY29tcG9uZW50cy9sb2dpbi9sb2dpbi5zZXJ2aWNlLmpzIiwiYXBwL2NvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC5jb21wb25lbnQuanMiLCJhcHAvY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLnNlcnZpY2UuanMiLCJhcHAvY29tcG9uZW50cy9tYWluL21haW4uY29tcG9uZW50LmpzIiwiYXBwL2NvbXBvbmVudHMvbWFpbi9tYWluLmRpcmVjdGl2ZS5qcyIsImNsaWVudGUvY29tcG9uZW50cy9jYWRhc3Ryby9jYWRhc3Ryb0NsaWVudGVDb21wb25lbnQuanMiLCJjbGllbnRlL2NvbXBvbmVudHMvcGVzcXVpc2EvcGVzcXVpc2FDbGllbnRlQ29tcG9uZW50LmpzIiwiaW5kdXN0cmlhL2NvbXBvbmVudHMvY2FkYXN0cm9QcmF6by9jYWRhc3Ryb1ByYXpvQ29tcG9uZW50LmpzIiwicGVkaWRvL2NvbXBvbmVudHMvcGVzcXVpc2EvcGVzcXVpc2FQZWRpZG9Db21wb25lbnQuanMiLCJ0YWJlbGEvY29tcG9uZW50cy9jYXJnYS9jYXJnYVRhYmVsYUNvbXBvbmVudC5qcyIsInVzdWFyaW8vY29tcG9uZW50cy9jYWRhc3Ryby9jYWRhc3Ryb1VzdWFyaW9Db21wb25lbnQuanMiLCJ1c3VhcmlvL2NvbXBvbmVudHMvcGVzcXVpc2EvcGVzcXVpc2FVc3VhcmlvQ29tcG9uZW50LmpzIiwiYXBwL2NvbXBvbmVudHMvc2hhcmVkL2NoYXQvY2hhdC1jb21wb25lbnQuanMiLCJhcHAvY29tcG9uZW50cy9zaGFyZWQvY2hhdC1tZXNzYWdlL2NoYXQtbWVzc2FnZS1jb21wb25lbnQuanMiLCJwZWRpZG8vY29tcG9uZW50cy9jYWRhc3Ryby9kYWRvc1BlZGlkby9kYWRvc1BlZGlkb0NvbXBvbmVudC5qcyIsInBlZGlkby9jb21wb25lbnRzL2NhZGFzdHJvL2VkaWNhb1BlZGlkby9lZGljYW9QZWRpZG9Db21wb25lbnQuanMiLCJwZWRpZG8vY29tcG9uZW50cy9jYWRhc3Ryby9pdGVuc1BlZGlkby9pdGVuc1BlZGlkb0NvbXBvbmVudC5qcyIsInBlZGlkby9jb21wb25lbnRzL2NhZGFzdHJvL3Jlc3Vtb1BlZGlkby9yZXN1bW9QZWRpZG9Db21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdGtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNWpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ0dlcmVuY2lhZG9yRmluYW5jZWlyb0ZsZWNoYVZlbmRhcycpXHJcblxyXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gIGNvbnN0IGxvZ2luID0ge1xyXG4gICAgbmFtZTogJ2xvZ2luJyxcclxuICAgIHVybDogJy8nLFxyXG4gICAgY29tcG9uZW50OiAnbG9naW5Db21wb25lbnQnXHJcbiAgfVxyXG4gIGNvbnN0IG1haW4gPSB7XHJcbiAgICBuYW1lOiAnbWFpbicsXHJcbiAgICB1cmw6ICcvbWFpbicsXHJcbiAgICBjb21wb25lbnQ6ICdtYWluQ29tcG9uZW50JyxcclxuICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhdXRoOiAoTG9naW5TZXJ2aWNlLCAkcSwgJHRpbWVvdXQsICRzdGF0ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAkdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoTG9naW5TZXJ2aWNlLmdldFVzdWFyaW8oKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShMb2dpblNlcnZpY2UuZ2V0VXN1YXJpbygpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcclxuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZWplY3QoJ3VzdcOhcmlvIG7Do28gbG9nYWRvIScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNvbnN0IGRhc2hib2FyZCA9IHtcclxuICAgIG5hbWU6ICdtYWluLmRhc2hib2FyZCcsXHJcbiAgICB1cmw6ICcvZGFzaGJvYXJkJyxcclxuICAgIGNvbXBvbmVudDogJ2Rhc2hib2FyZENvbXBvbmVudCcsXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGluZm9ybWFjb2VzOiAoRGFzaGJvYXJkU2VydmljZSwgYXV0aCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBEYXNoYm9hcmRTZXJ2aWNlLmdldEluZm9ybWFjb2VzRGFzaGJvYXJkRHRvKGF1dGguaWQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGxvZ2luKVxyXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKG1haW4pXHJcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoZGFzaGJvYXJkKVxyXG59KVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBTVEFUVVNfUEVESURPID0ge1xyXG5cdElOREVGSU5JRE86IDAsXHJcblx0Q1JJQURPOiAxLFxyXG5cdFNBTFZPOiAyLFxyXG5cdEVOVklBRE86IDMsXHJcblx0TkVHQURPOiA0LFxyXG5cdENPTE9DQURPOiA1LFxyXG5cdENBTkNFTEFETzogNixcclxufVxyXG5cclxuY29uc3QgTkVUV09SS19TVEFUVVMgPSB7XHJcblx0T0ZGTElORTogMCxcclxuXHRPTkxJTkU6IDFcclxufVxyXG5cclxuY29uc3QgTkVUV09SSyA9IHtcclxuXHRTVEFUVVM6IE5FVFdPUktfU1RBVFVTLk9GRkxJTkVcclxufVxyXG5cclxuY29uc3QgQ29ubmVjdGlvbiA9IHtcclxuXHRVTktOT1dOOiAwLFxyXG5cdE5PTkU6IDFcclxufVxyXG5cclxuY29uc3QgREFUQUJBU0VfU1RBVFVTID0ge1xyXG5cdE9GRkxJTkU6IDAsXHJcblx0T05MSU5FOiAxXHJcbn1cclxuXHJcbmNvbnN0IERBVEFCQVNFID0ge1xyXG5cdE5BTUU6ICdmbGVjaGF2ZW5kYXNsb2NhbC5kYicsXHJcblx0SEFTSDogJzk4Mjg4ZjJmMTEyN2M5NTEyMWJjYjUxYzg5NzI1MWM5JyxcclxuXHRTVEFUVVM6IERBVEFCQVNFX1NUQVRVUy5PTkxJTkUsXHJcblx0SUQ6IDExNTQ3ODQ0NVxyXG59XHJcblxyXG5jb25zdCBDQUxMUkVTVUxUID0ge1xyXG5cdE9LOiAwLFxyXG5cdEVSUk9SOiAtMSxcclxuXHRVTktOT1dOOiAtMixcclxufVxyXG5cclxuY29uc3QgVElNRU9VVCA9IDYwMDAwXHJcblxyXG5jb25zdCBTVE9SQUdFX0lURU0gPSB7XHJcblx0SU5EVVNUUklBU19VU1VBUklPOiAxLFxyXG5cdENMSUVOVEVTX1VTVUFSSU86IDIsXHJcbn1cclxuXHJcbmNvbnN0IExJU1RBX1NJTU5BTyA9IFtcclxuXHR7IHZhbHVlOiBmYWxzZSwgdGV4dDogJ07Do28nIH0sXHJcblx0eyB2YWx1ZTogdHJ1ZSwgdGV4dDogJ1NpbScgfVxyXG5dXHJcblxyXG5jb25zdCBMSVNUQV9DQVJHQSA9IFtcclxuXHR7IHZhbHVlOiAxLCB0ZXh0OiAnQmF0aWRhJyB9LFxyXG5cdHsgdmFsdWU6IDIsIHRleHQ6ICdQYWxldGl6YWRvJyB9XHJcbl1cclxuXHJcbmNvbnN0IFBBR0lOQUNBTyA9IHtcclxuXHRQRURJRE86IHtcclxuXHRcdFBBR0VfU0laRTogMjAsXHJcblx0XHRORVdfUEFHRTogMVxyXG5cdH1cclxufVxyXG5cclxuY29uc3QgSU1BR0VfRklMRV9UWVBFID0gW1xyXG5cdCdpbWFnZS9wbmcnLFxyXG5cdCdpbWFnZS9qcGVnJ1xyXG5dXHJcblxyXG5jb25zdCBET0NVTUVOVF9GSUxFX1RZUEUgPSBbXHJcblx0J2FwcGxpY2F0aW9uL3BkZicsXHJcblx0J3RleHQvcGxhaW4nLFxyXG5cdCdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldCcsXHJcblx0J2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50JyxcclxuXHQnYXBwbGljYXRpb24vbXN3b3JkJ1xyXG5dXHJcblxyXG5jb25zdCBFTlRFUl9LRVlfQ09ERSA9IDEzO1xyXG5cclxuY29uc3QgUEVESURPX1BST1BPU1RBID0gMTtcclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoXHJcblx0J0dlcmVuY2lhZG9yRmluYW5jZWlyb0ZsZWNoYVZlbmRhcycsXHJcblx0Wyd1aS5yb3V0ZXInLFxyXG5cdFx0J2Jsb2NrVUknLFxyXG5cdFx0J3VzdWFyaW8ubW9kdWxlJyxcclxuXHRcdCdNb2RhbEFwcCcsXHJcblx0XHQnTm90aWZpY2FjYW8nLFxyXG5cdFx0J2NsaWVudGUubW9kdWxlJyxcclxuXHRcdCdwZWRpZG8ubW9kdWxlJyxcclxuXHRcdCdpbmR1c3RyaWEubW9kdWxlJyxcclxuXHRcdCd0YWJlbGEubW9kdWxlJyxcclxuXHRcdCdpbmR1c3RyaWEucHJhem8ubW9kdWxlJ10pXHJcblx0LnJ1bihbJyR0cmFuc2l0aW9ucycsICgkdHJhbnNpdGlvbnMpID0+IHtcclxuXHRcdCR0cmFuc2l0aW9ucy5vbkJlZm9yZSh7fSwgdHJhbnNpdGlvbiA9PiB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCd0cmFuc2FjYW8nKTtcclxuXHRcdH0pO1xyXG5cdH1dKTtcclxuXHJcbmFwcC5maWx0ZXIoJ3Byb3BzRmlsdGVyJywgZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBmdW5jdGlvbiAoaXRlbXMsIHByb3BzKSB7XHJcblx0XHR2YXIgb3V0ID0gW107XHJcblxyXG5cdFx0aWYgKGFuZ3VsYXIuaXNBcnJheShpdGVtcykpIHtcclxuXHRcdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcyk7XHJcblx0XHRcdGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0XHR2YXIgaXRlbU1hdGNoZXMgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHR2YXIgcHJvcCA9IGtleXNbaV07XHJcblx0XHRcdFx0XHR2YXIgdGV4dCA9IHByb3BzW3Byb3BdLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdFx0XHRpZiAoaXRlbVtwcm9wXS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0KSAhPT0gLTEpIHtcclxuXHRcdFx0XHRcdFx0aXRlbU1hdGNoZXMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChpdGVtTWF0Y2hlcykge1xyXG5cdFx0XHRcdFx0b3V0LnB1c2goaXRlbSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIExldCB0aGUgb3V0cHV0IGJlIHRoZSBpbnB1dCB1bnRvdWNoZWRcclxuXHRcdFx0b3V0ID0gaXRlbXM7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG91dDtcclxuXHR9O1xyXG59KTtcclxuXHJcbi8qXHJcbmFuZ3VsYXIubW9kdWxlKCdBdXRoZW50aWNhdGlvbicsIFtdKVxyXG5hbmd1bGFyLm1vZHVsZSgnSW5kdXN0cmlhcycsIFsndWkuZ3JpZCcsJ3VpLmdyaWQucGFnaW5hdGlvbicsICd1aS5ncmlkLnNlbGVjdGlvbicsICd1aS5ncmlkLnJlc2l6ZUNvbHVtbnMnXSlcclxuYW5ndWxhci5tb2R1bGUoJ01lbnUnLCBbXSlcclxuYW5ndWxhci5tb2R1bGUoJ1BlZGlkbycsIFsnbmdBbmltYXRlJywgJ3VpLmJvb3RzdHJhcCddKVxyXG5hbmd1bGFyLm1vZHVsZSgnUGVkaWRvUHJvZHV0b3MnLCBbJ25nU2FuaXRpemUnLCAndWkuc2VsZWN0J10pXHJcbmFuZ3VsYXIubW9kdWxlKCdQZWRpZG9SZXN1bW8nLCBbJ25nQW5pbWF0ZScsICduZ1Nhbml0aXplJywgJ3VpLmJvb3RzdHJhcC5hY2NvcmRpb24nXSlcclxuYW5ndWxhci5tb2R1bGUoJ0RldGFsaGVQZWRpZG8nLCBbJ25nQW5pbWF0ZScsJ3VpLmJvb3RzdHJhcCcsICd1aS5ncmlkJywndWkuZ3JpZC5wYWdpbmF0aW9uJywgJ3VpLmdyaWQuc2VsZWN0aW9uJywgJ3VpLmdyaWQucmVzaXplQ29sdW1ucyddKVxyXG5hbmd1bGFyLm1vZHVsZSgnRGV0YWxoZVBlZGlkb0l0ZW5zJywgW10pXHJcbmFuZ3VsYXIubW9kdWxlKCdEZXRhbGhlUGVkaWRvU2Fsdm8nLCBbXSlcclxuYW5ndWxhci5tb2R1bGUoJ0RldGFsaGVQZWRpZG9TYWx2b0l0ZW5zJywgW10pXHJcbmFuZ3VsYXIubW9kdWxlKCdUYWJlbGEnLCBbJ2Jsb2NrVUknXSlcclxuYW5ndWxhci5tb2R1bGUoJ0NhZGFzdHJvQ2xpZW50ZXMnLCBbJ2Jsb2NrVUknLCAndWkubWFzaycsICduZ1Nhbml0aXplJywgJ3VpLnNlbGVjdCddKVxyXG5hbmd1bGFyLm1vZHVsZSgnQ2xpZW50ZXNDYWRhc3RyYWRvcycsIFsndWkuZ3JpZCcsJ3VpLmdyaWQucGFnaW5hdGlvbicsICd1aS5ncmlkLnNlbGVjdGlvbicsICd1aS5ncmlkLnJlc2l6ZUNvbHVtbnMnXSlcclxuYW5ndWxhci5tb2R1bGUoJ01vZGFsQXBwJywgWyd1aS5ib290c3RyYXAnXSlcclxuYW5ndWxhci5tb2R1bGUoJ05vdGlmaWNhY2FvJywgWyd1aS1ub3RpZmljYXRpb24nXSlcclxuYW5ndWxhci5tb2R1bGUoJ1VzdWFyaW9Nb2R1bG8nLCBbJ3VpLnJvdXRlcicsICd1aS5ib290c3RyYXAudGFicyddKVxyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdHZXJlbmNpYWRvckZpbmFuY2Vpcm9GbGVjaGFWZW5kYXMnLFxyXG5cdFx0XHRcdFsgJ0F1dGhlbnRpY2F0aW9uJywgJ0luZHVzdHJpYXMnLCAnTWVudScsICdQZWRpZG8nLCAnUGVkaWRvUHJvZHV0b3MnLCAnUGVkaWRvUmVzdW1vJywgXHJcblx0XHRcdFx0ICAnRGV0YWxoZVBlZGlkbycsICdEZXRhbGhlUGVkaWRvSXRlbnMnLCAnVGFiZWxhJywgJ0NhZGFzdHJvQ2xpZW50ZXMnLCAnQ2xpZW50ZXNDYWRhc3RyYWRvcycsICdNb2RhbEFwcCcsIFxyXG5cdFx0XHRcdCAgJ0RldGFsaGVQZWRpZG9TYWx2bycsICdEZXRhbGhlUGVkaWRvU2Fsdm9JdGVucycsJ25nUm91dGUnLCAnbmdDb29raWVzJywgJ05vdGlmaWNhY2FvJywgJ1VzdWFyaW9Nb2R1bG8nXSlcclxuXHRcdC5jb25maWcoWyAnJHJvdXRlUHJvdmlkZXInLCBmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xyXG5cdFx0XHQkcm91dGVQcm92aWRlci53aGVuKCcvbG9naW4nLCB7XHJcblx0XHRcdFx0Y29udHJvbGxlciA6ICdMb2dpbkNvbnRyb2xsZXInLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvYXV0aGVudGljYXRpb24vdmlld3MvbG9naW4uaHRtbCdcclxuXHRcdFx0fSkud2hlbignL2Rhc2hib2FyZCcsIHtcclxuXHRcdFx0XHRjb250cm9sbGVyIDogJ01lbnVDb250cm9sbGVyJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL2Rhc2hib2FyZC92aWV3cy9kYXNoYm9hcmQuaHRtbCdcclxuXHRcdFx0fSkud2hlbignL2luZHVzdHJpYXMnLCB7XHJcblx0XHRcdFx0Y29udHJvbGxlciA6ICdJbmR1c3RyaWFzQ29udHJvbGxlcicsXHJcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnbW9kdWxlcy9pbmR1c3RyaWFzL3ZpZXdzL2luZHVzdHJpYXMuaHRtbCdcclxuXHRcdFx0fSkud2hlbignL3BlZGlkbycsIHtcclxuXHRcdFx0XHRjb250cm9sbGVyIDogJ1BlZGlkb0NvbnRyb2xsZXInLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvcGVkaWRvL3ZpZXdzL3BlZGlkby5odG1sJ1xyXG5cdFx0XHR9KS53aGVuKCcvcGVkaWRvUHJvZHV0b3MnLCB7XHJcblx0XHRcdFx0Y29udHJvbGxlciA6ICdQZWRpZG9Qcm9kdXRvc0NvbnRyb2xsZXInLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvcGVkaWRvUHJvZHV0b3Mvdmlld3MvcHJvZHV0b3MuaHRtbCdcclxuXHRcdFx0fSkud2hlbignL3BlZGlkb1Jlc3VtbycsIHtcclxuXHRcdFx0XHRjb250cm9sbGVyIDogJ1BlZGlkb1Jlc3Vtb0NvbnRyb2xsZXInLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvcGVkaWRvUmVzdW1vL3ZpZXdzL3BlZGlkb1Jlc3Vtby5odG1sJ1xyXG5cdFx0XHR9KS53aGVuKCcvZGV0YWxoZVBlZGlkbycsIHtcclxuXHRcdFx0XHRjb250cm9sbGVyIDogJ0RldGFsaGVQZWRpZG9Db250cm9sbGVyJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL2RldGFsaGVQZWRpZG8vdmlld3MvZGV0YWxoZVBlZGlkby5odG1sJ1xyXG5cdFx0XHR9KS53aGVuKCcvZGV0YWxoZVBlZGlkb0l0ZW5zJywge1xyXG5cdFx0XHRcdGNvbnRyb2xsZXIgOiAnRGV0YWxoZVBlZGlkb0l0ZW5zQ29udHJvbGxlcicsXHJcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnbW9kdWxlcy9kZXRhbGhlUGVkaWRvSXRlbnMvdmlld3MvZGV0YWxoZVBlZGlkb0l0ZW5zLmh0bWwnXHJcblx0XHRcdH0pLndoZW4oJy9jYWRhc3Ryb1RhYmVsYScsIHtcclxuXHRcdFx0XHRjb250cm9sbGVyIDogJ1RhYmVsYUNvbnRyb2xsZXInLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvdGFiZWxhL3ZpZXdzL3RhYmVsYS5odG1sJ1xyXG5cdFx0XHR9KS53aGVuKCcvZGV0YWxoZVRhYmVsYS86aWRUYWJlbGEnLCB7XHJcblx0XHRcdFx0Y29udHJvbGxlciA6ICdUYWJlbGFDb250cm9sbGVyJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL3RhYmVsYS92aWV3cy9kZXRhbGhlVGFiZWxhLmh0bWwnXHJcblx0XHRcdH0pLndoZW4oJy9jYWRhc3Ryb0NvbXBsZXRvQ2xpZW50ZScsIHtcclxuXHRcdFx0XHRjb250cm9sbGVyIDogJ0NhZGFzdHJvQ2xpZW50ZXNDb250cm9sbGVyJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL2NhZGFzdHJvQ2xpZW50ZXMvdmlld3MvY2FkYXN0cm9Db21wbGV0b0NsaWVudGUuaHRtbCdcclxuXHRcdFx0fSkud2hlbignL2RldGFsaGVQZWRpZG9TYWx2bycsIHtcclxuXHRcdFx0XHRjb250cm9sbGVyIDogJ0RldGFsaGVQZWRpZG9TYWx2b0NvbnRyb2xsZXInLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvZGV0YWxoZVBlZGlkb1NhbHZvL3ZpZXdzL2RldGFsaGVQZWRpZG9TYWx2by5odG1sJ1xyXG5cdFx0XHR9KS53aGVuKCcvZGV0YWxoZVBlZGlkb1NhbHZvSXRlbnMnLCB7XHJcblx0XHRcdFx0Y29udHJvbGxlciA6ICdEZXRhbGhlUGVkaWRvU2Fsdm9JdGVuc0NvbnRyb2xsZXInLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvZGV0YWxoZVBlZGlkb1NhbHZvSXRlbnMvdmlld3MvZGV0YWxoZVBlZGlkb1NhbHZvSXRlbnMuaHRtbCdcclxuXHRcdFx0fSkud2hlbignL2xpc3RhQ2xpZW50ZXMnLCB7XHJcblx0XHRcdFx0Y29udHJvbGxlciA6ICdDbGllbnRlc0NhZGFzdHJhZG9zQ29udHJvbGxlcicsXHJcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnbW9kdWxlcy9jbGllbnRlc0NhZGFzdHJhZG9zL3ZpZXdzL2NsaWVudGVzQ2FkYXN0cmFkb3MuaHRtbCdcclxuXHRcdFx0fSkud2hlbignL2xpc3RhSW5kdXN0cmlhcycsIHtcclxuXHRcdFx0XHRjb250cm9sbGVyIDogJ0luZHVzdHJpYXNDb250cm9sbGVyJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL2luZHVzdHJpYXMvdmlld3MvaW5kdXN0cmlhcy5odG1sJ1xyXG5cdFx0XHR9KS53aGVuKCcvdXN1YXJpb1Blc3F1aXNhJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlIDogJzx1c3VhcmlvLW1vZHVsbyBpZD0yPjwvdXN1YXJpby1tb2R1bG8+J1xyXG5cdFx0XHR9KS53aGVuKCcvdXN1YXJpb0NhZGFzdHJvJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlIDogJzx1c3VhcmlvLW1vZHVsbyBpZD0xPjwvdXN1YXJpby1tb2R1bG8+J1xyXG5cdFx0XHR9KS53aGVuKCcvdXN1YXJpbycsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZSA6ICc8dXN1YXJpby1tb2R1bG8+PC91c3VhcmlvLW1vZHVsbz4nXHJcblx0XHRcdH0pLm90aGVyd2lzZSh7XHJcblx0XHRcdFx0cmVkaXJlY3RUbyA6ICcvbG9naW4nXHJcblx0XHRcdH0pXHJcblx0XHR9XSkucnVuKFsnJHJvb3RTY29wZScsICckbG9jYXRpb24nLCAnJGh0dHAnLCAnQXV0aGVudGljYXRpb25TZXJ2aWNlJywgJ05ldHdvcmtTZXJ2aWNlJyxcclxuXHRcdGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbiwgJGh0dHAsIEF1dGhlbnRpY2F0aW9uU2VydmljZSwgTmV0d29ya1NlcnZpY2UpIHtcclxuXHRcdFx0JHJvb3RTY29wZS5nbG9iYWxzID0ge307XHJcblx0XHRcdCRyb290U2NvcGUuZ2xvYmFscy5jdXJyZW50VXNlciA9IEF1dGhlbnRpY2F0aW9uU2VydmljZS5nZXRDcmVkZW50aWFsc1JlbWVtYmVyKCk7XHJcblx0XHRcdGlmICgkcm9vdFNjb3BlLmdsb2JhbHMuY3VycmVudFVzZXIpIHtcclxuXHRcdFx0XHQkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQXV0aG9yaXphdGlvbiddID0gJ0Jhc2ljICcgKyAkcm9vdFNjb3BlLmdsb2JhbHMuY3VycmVudFVzZXIuYXV0aGRhdGE7XHJcblx0XHRcdFx0QXV0aGVudGljYXRpb25TZXJ2aWNlLnNldFVzdWFyaW8oJHJvb3RTY29wZS5nbG9iYWxzLmN1cnJlbnRVc2VyLnVzZXIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGV2ZW50LCBuZXh0LCBjdXJyZW50KSB7XHJcblx0XHRcdFx0aWYgKCRsb2NhdGlvbi5wYXRoKCkgIT09ICcvbG9naW4nICYmICEkcm9vdFNjb3BlLmdsb2JhbHMuY3VycmVudFVzZXIpIHtcclxuXHRcdFx0XHRcdEF1dGhlbnRpY2F0aW9uU2VydmljZS5zZXRVc3VhcmlvKHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdH1cclxuXSk7XHJcblxyXG5hcHAuY29udHJvbGxlcignQXBwQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnQXV0aGVudGljYXRpb25TZXJ2aWNlJywgJ05ldHdvcmtTZXJ2aWNlJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCBBdXRoZW50aWNhdGlvblNlcnZpY2UsIE5ldHdvcmtTZXJ2aWNlKSB7XHJcblx0bW9tZW50LmxvY2FsZSgncHQnKVxyXG5cclxuXHQkc2NvcGUuJHdhdGNoKEF1dGhlbnRpY2F0aW9uU2VydmljZS5nZXRVc3VhcmlvLCBmdW5jdGlvbiAodXN1YXJpbykge1xyXG5cdFx0aWYoQXV0aGVudGljYXRpb25TZXJ2aWNlLnVzdWFyaW8pIHtcclxuXHRcdFx0JHNjb3BlLm5vbWVVc3VhcmlvID0gXCJGbGVjaGEgVmVuZGFzIC0gXCIgKyBBdXRoZW50aWNhdGlvblNlcnZpY2UudXN1YXJpby5ub21lXHJcblx0XHRcdCRzY29wZS5pc01hc3RlciA9IEF1dGhlbnRpY2F0aW9uU2VydmljZS5pc01hc3RlcigpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkc2NvcGUubm9tZVVzdWFyaW8gPSBcIkZsZWNoYSBWZW5kYXNcIlxyXG5cdFx0XHQkc2NvcGUuaXNNYXN0ZXIgPSBmYWxzZVxyXG5cdFx0fVxyXG5cdH0pXHJcblxyXG5cdE5ldHdvcmtTZXJ2aWNlLnN0YXJ0TmV0d29ya01vbml0b3IoKVxyXG5cclxuXHQkc2NvcGUuJHdhdGNoKE5ldHdvcmtTZXJ2aWNlLmdldE5ldHdvcmtTdGF0dXMsIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcclxuXHRcdGlmKG5ld1ZhbHVlID09PSBORVRXT1JLX1NUQVRVUy5PTkxJTkUpIHtcclxuXHRcdFx0XHQkc2NvcGUuaGFzQ29ubmVjdGlvbiA9IHRydWVcclxuXHRcdFx0XHQkcm9vdFNjb3BlLmdsb2JhbHMub25saW5lID0gdHJ1ZVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JHNjb3BlLmhhc0Nvbm5lY3Rpb24gPSBmYWxzZVxyXG5cdFx0XHQkcm9vdFNjb3BlLmdsb2JhbHMub25saW5lID0gZmFsc2VcclxuXHRcdH1cclxuXHR9KVxyXG5cclxuXHQkc2NvcGUuaXNNb2JpbGUgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oaVBob25lfGlQb2R8aVBhZHxBbmRyb2lkfEJsYWNrQmVycnl8SUVNb2JpbGUpLylcclxuXHJcblx0JHNjb3BlLmlzQWRtaW5pc3RyYWRvciA9IEF1dGhlbnRpY2F0aW9uU2VydmljZS5pc0FkbWluaXN0cmFkb3IoKVxyXG5cclxufV0pO1xyXG5cclxuYXBwLmNvbmZpZyhmdW5jdGlvbihibG9ja1VJQ29uZmlnKSB7XHJcblx0YmxvY2tVSUNvbmZpZy5hdXRvQmxvY2sgPSB0cnVlO1xyXG5cdGJsb2NrVUlDb25maWcucmVzZXRPbkV4Y2VwdGlvbiA9IGZhbHNlO1xyXG5cdGJsb2NrVUlDb25maWcubWVzc2FnZSA9ICdDYXJyZWdhbmRvLi4uJztcclxufSlcclxuXHJcblxyXG5cclxuXHQqL1xyXG4iLCIndXNlIHN0cmljdCdcclxuXHJcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnR2VyZW5jaWFkb3JGaW5hbmNlaXJvRmxlY2hhVmVuZGFzJylcclxuXHJcbmFwcC5mYWN0b3J5KCdIdHRwU2VydmljZScsIFtcclxuXHQnJGh0dHAnLFxyXG5cdCdibG9ja1VJJyxcclxuXHQnJGxvZycsXHJcblx0Y29uc3RydWN0b3IsXHJcbl0pXHJcblxyXG5mdW5jdGlvbiBjb25zdHJ1Y3RvcigkaHR0cCwgYmxvY2tVSSwgJGxvZykge1xyXG5cdHZhciBzZXJ2aWNlID0ge307XHJcblxyXG5cdHNlcnZpY2UuaHR0cFBvc3QgPSBmdW5jdGlvbiAocGF0aCwgcGFyYW0sIHRpbWVvdXQsIGhlYWRlciwgb3B0KSB7XHJcblx0XHRsZXQgX3RpbWVvdXQgPSB0aW1lb3V0ICE9PSBudWxsID8gdGltZW91dCA6IFRJTUVPVVRcclxuXHRcdGxldCBfaGVhZGVyID0ge1xyXG5cdFx0XHQnQXV0aG9yaXphdGlvbic6IGdldFVzdWFyaW9IYXNoKCksXHJcblx0XHR9XHJcblx0XHRpZiAoaGVhZGVyKSB7XHJcblx0XHRcdGZvciAobGV0IGkgaW4gaGVhZGVyKSB7XHJcblx0XHRcdFx0X2hlYWRlcltpXSA9IGhlYWRlcltpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dmFyIHJlcSA9IHtcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHVybDogYCR7TU9ET19IVFRQfS8ke1VSTH0vJHtwYXRofWAsXHJcblx0XHRcdGhlYWRlcnM6IF9oZWFkZXIsXHJcblx0XHRcdGRhdGE6IHBhcmFtLFxyXG5cdFx0XHR0aW1lb3V0OiBfdGltZW91dFxyXG5cdFx0fTtcclxuXHRcdGlmIChvcHQpIHtcclxuXHRcdFx0Zm9yIChsZXQgaSBpbiBvcHQpIHtcclxuXHRcdFx0XHRyZXFbaV0gPSBvcHRbaV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGJsb2NrVUkuc3RhcnQoKTtcclxuXHRcdHJldHVybiAkaHR0cChyZXEpLnRoZW4ocmVzdWx0ID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0LmRhdGE7XHJcblx0XHRcdH0sIGVycm9yID0+IHtcclxuXHRcdFx0XHQkbG9nLmxvZygnRXJybyBuYSBjaGFtYWRhIGFvIHNlcnZpZG9yOiAnLCBlcnJvcik7XHJcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGJsb2NrVUkuc3RvcCgpO1xyXG5cdFx0XHR9KVxyXG5cdH1cclxuXHJcblx0c2VydmljZS5odHRwR2V0ID0gZnVuY3Rpb24gKHBhdGgsIHBhcmFtLCB0aW1lb3V0KSB7XHJcblx0XHR2YXIgX3RpbWVvdXQgPSB0aW1lb3V0ICE9PSBudWxsID8gdGltZW91dCA6IFRJTUVPVVRcclxuXHRcdHZhciByZXEgPSB7XHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHVybDogYCR7TU9ET19IVFRQfS8ke1VSTH0vJHtwYXRofWAsXHJcblx0XHRcdGhlYWRlcnM6IHsgJ0F1dGhvcml6YXRpb24nOiBnZXRVc3VhcmlvSGFzaCgpIH0sXHJcblx0XHRcdHBhcmFtczogcGFyYW0sXHJcblx0XHRcdHRpbWVvdXQ6IF90aW1lb3V0XHJcblx0XHR9XHJcblx0XHRibG9ja1VJLnN0YXJ0KClcclxuXHRcdHJldHVybiAkaHR0cChyZXEpXHJcblx0XHRcdC50aGVuKHJlc3VsdCA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdC5kYXRhXHJcblx0XHRcdH0pXHJcblx0XHRcdC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRibG9ja1VJLnN0b3AoKVxyXG5cdFx0XHR9KVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VXN1YXJpb0hhc2goKSB7XHJcblx0XHRyZXR1cm4gYW5ndWxhci5mcm9tSnNvbihzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdsb2dpbicpKSA9PT0gbnVsbCA/IG51bGwgOiBhbmd1bGFyLmZyb21Kc29uKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2xvZ2luJykpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnQ2FkYXN0cm9DbGllbnRlcycpXHJcblx0LmNvbnRyb2xsZXIoJ0NhZGFzdHJvQ2xpZW50ZXNDb250cm9sbGVyJyxcclxuXHRcdFsnJHNjb3BlJyxcclxuXHRcdFx0JyRyb290U2NvcGUnLFxyXG5cdFx0XHQnJGxvY2F0aW9uJyxcclxuXHRcdFx0JyRzY2UnLFxyXG5cdFx0XHQnJHJvdXRlJyxcclxuXHRcdFx0JyRyb3V0ZVBhcmFtcycsXHJcblx0XHRcdCckd2luZG93JyxcclxuXHRcdFx0J0NhZGFzdHJvQ2xpZW50ZXNTZXJ2aWNlJyxcclxuXHRcdFx0J0NsaWVudGVzQ2FkYXN0cmFkb3NTZXJ2aWNlJyxcclxuXHRcdFx0J0luZHVzdHJpYXNTZXJ2aWNlJyxcclxuXHRcdFx0J0F1dGhlbnRpY2F0aW9uU2VydmljZScsXHJcblx0XHRcdCdibG9ja1VJJyxcclxuXHRcdFx0J01vZGFsU2VydmljZScsXHJcblx0XHRcdCdJbmR1c3RyaWFDbGllbnRlUHJhem9TZXJ2aWNlJyxcclxuXHRcdFx0J05vdGlmaWNhdGlvblNlcnZpY2UnLFxyXG5cdFx0XHRmdW5jdGlvbiAoJHNjb3BlLFxyXG5cdFx0XHRcdCRyb290U2NvcGUsXHJcblx0XHRcdFx0JGxvY2F0aW9uLFxyXG5cdFx0XHRcdCRzY2UsXHJcblx0XHRcdFx0JHJvdXRlLFxyXG5cdFx0XHRcdCR3aW5kb3csXHJcblx0XHRcdFx0c2VydmljZSxcclxuXHRcdFx0XHRDbGllbnRlc0NhZGFzdHJhZG9zU2VydmljZSxcclxuXHRcdFx0XHRJbmR1c3RyaWFzU2VydmljZSxcclxuXHRcdFx0XHRBdXRoZW50aWNhdGlvblNlcnZpY2UsXHJcblx0XHRcdFx0YmxvY2tVSSxcclxuXHRcdFx0XHRNb2RhbFNlcnZpY2UsXHJcblx0XHRcdFx0SW5kdXN0cmlhQ2xpZW50ZVByYXpvU2VydmljZSxcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlKSB7XHJcblxyXG5cdFx0XHRcdHZhciBjbGllbnRlID0gQ2xpZW50ZXNDYWRhc3RyYWRvc1NlcnZpY2UuY2xpZW50ZVBhcmFFZGl0YXI7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5saXN0YVJlcHJlc2VudGFjb2VzVmVuZGVkb3IgPSBbXTtcclxuXHRcdFx0XHQkc2NvcGUubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUgPSBbXTtcclxuXHRcdFx0XHQkc2NvcGUubGlzdGFJbmR1c3RyaWFDbGllbnRlID0gW107XHJcblx0XHRcdFx0JHNjb3BlLmluZHVzdHJpYVByYXpvID0ge1xyXG5cdFx0XHRcdFx0c2VsZWNpb25hZG86IHVuZGVmaW5lZCxcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChjbGllbnRlKSB7XHJcblx0XHRcdFx0XHQkc2NvcGUuY2xpZW50ZSA9IGNsaWVudGU7XHJcblx0XHRcdFx0XHQkc2NvcGUubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUgPSBjbGllbnRlLmxpc3RhUmVwcmVzZW50YWNvZXNDbGllbnRlO1xyXG5cdFx0XHRcdFx0Q2xpZW50ZXNDYWRhc3RyYWRvc1NlcnZpY2UuY2xpZW50ZVBhcmFFZGl0YXIgPSBudWxsO1xyXG5cdFx0XHRcdFx0c2VydmljZS5nZXRJbmR1c3RyaWFzQ2xpZW50ZShjbGllbnRlLmlkLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZSA9IHJlc3BvbnNlO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRpZiAoJHNjb3BlLmNsaWVudGUuZXhjbHVpZG8pIHtcclxuXHRcdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5hbGVydCgnRXN0ZSBjbGllbnRlIGVzdMOhIGV4Y2x1w61kby4gRWZldHVlIGFzIGFsdGVyYcOnw7VlcyBlIHNhbHZlIG8gY2FkYXN0cm8gcGFyYSByZWF0aXbDoS1sby4nKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQkc2NvcGUuY2xpZW50ZSA9IHtcclxuXHRcdFx0XHRcdFx0aWQ6IG51bGwsXHJcblx0XHRcdFx0XHRcdHJhemFvU29jaWFsOiBcIlwiLFxyXG5cdFx0XHRcdFx0XHRub21lRmFudGFzaWE6IFwiXCIsXHJcblx0XHRcdFx0XHRcdGNwZkNucGo6IG51bGwsXHJcblx0XHRcdFx0XHRcdHJnSWU6IFwiXCIsXHJcblx0XHRcdFx0XHRcdHJ1YTogXCJcIixcclxuXHRcdFx0XHRcdFx0bnVtZXJvOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRzYWxhOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRhbmRhcjogbnVsbCxcclxuXHRcdFx0XHRcdFx0Y29tcGxlbWVudG86IFwiXCIsXHJcblx0XHRcdFx0XHRcdGJhaXJybzogXCJcIixcclxuXHRcdFx0XHRcdFx0Y2VwOiBcIlwiLFxyXG5cdFx0XHRcdFx0XHRjaWRhZGU6IFwiXCIsXHJcblx0XHRcdFx0XHRcdGVzdGFkbzogbnVsbCxcclxuXHRcdFx0XHRcdFx0dGVsZWZvbmU6IG51bGwsXHJcblx0XHRcdFx0XHRcdGNlbHVsYXI6IG51bGwsXHJcblx0XHRcdFx0XHRcdGNvbnRhdG86IFwiXCIsXHJcblx0XHRcdFx0XHRcdGVtYWlsOiBcIlwiLFxyXG5cdFx0XHRcdFx0XHRkaWFzRW50cmVnYTogXCJcIixcclxuXHRcdFx0XHRcdFx0aG9yYXJpb0VudHJlZ2E6IFwiXCIsXHJcblx0XHRcdFx0XHRcdG5vbWVCYW5jbzogbnVsbCxcclxuXHRcdFx0XHRcdFx0bnVtZXJvQWdlbmNpYTogXCJcIixcclxuXHRcdFx0XHRcdFx0bm9tZUFnZW5jaWE6IFwiXCIsXHJcblx0XHRcdFx0XHRcdG51bWVyb0NvbnRhOiBcIlwiLFxyXG5cdFx0XHRcdFx0XHRpZFBlc3NvYTogbnVsbCxcclxuXHRcdFx0XHRcdFx0YXRpdm86IHRydWUsXHJcblx0XHRcdFx0XHRcdGJsb3F1ZWlvVmVuZGE6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRpbmZvcm1hY29lc0FkaWNpb25haXM6IFwiXCIsXHJcblx0XHRcdFx0XHRcdHBlbmRlbnRlUmVnaXN0cm86IG51bGwsXHJcblx0XHRcdFx0XHRcdHJlZmVyZW5jaWFzQ29tZXJjaWFpczogdW5kZWZpbmVkLFxyXG5cdFx0XHRcdFx0XHRleGNsdWlkbzogbnVsbFxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCRzY29wZS5iYW5jbyA9IHtcclxuXHRcdFx0XHRcdG5vbWU6IG51bGxcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuYXJxdWl2b0NsaWVudGUgPSB1bmRlZmluZWRcclxuXHJcblx0XHRcdFx0JHNjb3BlLnJlcHJlc2VudGFjYW9WZW5kZWRvciA9IHtcclxuXHRcdFx0XHRcdHNlbGVjaW9uYWRvOiBudWxsXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmluZHVzdHJpYSA9IHtcclxuXHRcdFx0XHRcdHNlbGVjaW9uYWRvOiBudWxsXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmVzdGFkbyA9IHtcclxuXHRcdFx0XHRcdHNlbGVjaW9uYWRvOiBudWxsXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZSA9IHtcclxuXHRcdFx0XHRcdGlkQ2xpZW50ZTogbnVsbCxcclxuXHRcdFx0XHRcdGlkSW5kdXN0cmlhOiBudWxsLFxyXG5cdFx0XHRcdFx0Y29kaWdvOiBudWxsLFxyXG5cdFx0XHRcdFx0bGltaXRlQ3JlZGl0bzogbnVsbCxcclxuXHRcdFx0XHRcdGF0aXZvOiB0cnVlLFxyXG5cdFx0XHRcdFx0YmxvcXVlaW9WZW5kYTogZmFsc2UsXHJcblx0XHRcdFx0XHRub21lSW5kdXN0cmlhOiBudWxsLFxyXG5cdFx0XHRcdFx0cmVtb3ZpZG86IGZhbHNlLFxyXG5cdFx0XHRcdFx0bGlzdGFJbmR1c3RyaWFDbGllbnRlUHJhem86IFtdLFxyXG5cdFx0XHRcdFx0bGlzdGFJbmR1c3RyaWFDbGllbnRlUHJhem9QYXJhUmVtb3ZlcjogW10sXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQkc2NvcGUucmVwcmVzZW50YWNhb0NsaWVudGUgPSB7XHJcblx0XHRcdFx0XHRpZDogbnVsbCxcclxuXHRcdFx0XHRcdGluZHVzdHJpYToge1xyXG5cdFx0XHRcdFx0XHRpZDogbnVsbCxcclxuXHRcdFx0XHRcdFx0bm9tZTogbnVsbFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHVzdWFyaW86IHtcclxuXHRcdFx0XHRcdFx0aWQ6IG51bGwsXHJcblx0XHRcdFx0XHRcdG5vbWU6IG51bGxcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCRzY29wZS5ibG9xdWVpYVNhbHZhciA9IChBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNWZW5kZWRvcigpICYmICRzY29wZS5saXN0YVJlcHJlc2VudGFjb2VzQ2xpZW50ZS5sZW5ndGggPCAxKVxyXG5cclxuXHRcdFx0XHQkc2NvcGUudGlwb1Blc3NvYSA9IHtcclxuXHRcdFx0XHRcdHNlbGVjaW9uYWRvOiBudWxsXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmluZHVzdHJpYUNsaWVudGVQcmF6b1BhZHJhbyA9IHtcclxuXHRcdFx0XHRcdHNlbGVjaW9uYWRvOiB1bmRlZmluZWQsXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgdXN1YXJpbyA9ICRyb290U2NvcGUuZ2xvYmFscy5jdXJyZW50VXNlci51c2VyO1xyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBfYmFzZTY0VG9BcnJheUJ1ZmZlcihiYXNlNjQpIHtcclxuXHRcdFx0XHRcdHZhciBiaW5hcnlfc3RyaW5nID0gICR3aW5kb3cuYXRvYihiYXNlNjQpO1xyXG5cdFx0XHRcdFx0dmFyIGxlbiA9IGJpbmFyeV9zdHJpbmcubGVuZ3RoO1xyXG5cdFx0XHRcdFx0dmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoIGxlbiApO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgICAgICAgIHtcclxuXHRcdFx0XHRcdFx0XHRieXRlc1tpXSA9IGJpbmFyeV9zdHJpbmcuY2hhckNvZGVBdChpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBieXRlcy5idWZmZXI7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBiNjR0b0Jsb2IoYjY0RGF0YSwgY29udGVudFR5cGUsIHNsaWNlU2l6ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIG5ldyBCbG9iKFtfYmFzZTY0VG9BcnJheUJ1ZmZlcihiNjREYXRhKV0sIHt0eXBlOiBjb250ZW50VHlwZX0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JHNjb3BlLmRvd25sb2FkQXJxdWl2byA9IChub21lQXJxdWl2bykgPT4ge1xyXG5cdFx0XHRcdFx0c2VydmljZS5kb3dubG9hZEFycXVpdm8oJHNjb3BlLmNsaWVudGUuY3BmQ25waiwgbm9tZUFycXVpdm8sIChkYXRhKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0LypsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdFx0XHRcdFx0XHRpbWFnZS5zcmMgPSBgZGF0YTppbWFnZS9qcGc7YmFzZTY0LCR7ZGF0YX1gXHJcblx0XHRcdFx0XHRcdFx0dmFyIHcgPSAkd2luZG93Lm9wZW4oXCJcIiwgJ19ibGFuaycpO1xyXG5cdFx0XHRcdFx0XHRcdHcuZG9jdW1lbnQud3JpdGUoaW1hZ2Uub3V0ZXJIVE1MKTsqL1xyXG5cdFx0XHRcdFx0XHRcdGxldCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICBcdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcclxuICAgIFx0XHRcdFx0XHRhLnN0eWxlID0gXCJkaXNwbGF5OiBub25lXCI7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGJsb2IgPSBiNjR0b0Jsb2IoZGF0YSwgJ2ltYWdlL2pwZycpO1xyXG5cdFx0XHRcdFx0XHRcdGxldCB1cmwgPSAkd2luZG93LndlYmtpdFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XHJcblx0XHRcdFx0XHRcdFx0YS5ocmVmID0gdXJsO1xyXG5cdFx0XHRcdFx0XHRcdGEuZG93bmxvYWQgPSBub21lQXJxdWl2bztcclxuXHRcdFx0XHRcdFx0XHRhLmNsaWNrKCk7XHJcblx0XHRcdFx0XHRcdFx0JHdpbmRvdy53ZWJraXRVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JHNjb3BlLmxpc3RhTm9tZUJhbmNvcyA9IHNlcnZpY2UuYnVzY2FOb21lc0JhbmNvcygpO1xyXG5cdFx0XHRcdGlmICgkc2NvcGUuY2xpZW50ZS5ub21lQmFuY28gIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLmJhbmNvLm5vbWUgPSAkc2NvcGUuY2xpZW50ZS5ub21lQmFuY287XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRzZXJ2aWNlLmdldFJlcHJlc2VudGFjb2VzVXN1YXJpbyh1c3VhcmlvLmlkLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5saXN0YVJlcHJlc2VudGFjb2VzID0gcmVzcG9uc2U7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHNlcnZpY2UuYnVzY2FWZW5kZWRvcmVzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLnZlbmRlZG9yZXMgPSByZXNwb25zZTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0c2VydmljZS5idXNjYUxpc3RhVGlwb1Blc3NvYShmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5saXN0YVRpcG9QZXNzb2EgPSByZXNwb25zZTtcclxuXHRcdFx0XHRcdGlmICgkc2NvcGUuY2xpZW50ZS5pZFBlc3NvYSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5saXN0YVRpcG9QZXNzb2EuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbS5pZCA9PSAkc2NvcGUuY2xpZW50ZS5pZFBlc3NvYSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnRpcG9QZXNzb2Euc2VsZWNpb25hZG8gPSBpdGVtO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudGlwb1Blc3NvYS5zZWxlY2lvbmFkbyA9ICRzY29wZS5saXN0YVRpcG9QZXNzb2FbMV07XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQkc2NvcGUudmVyaWZpY2FDbGllbnRlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgY3BmQ25waiA9ICRzY29wZS5jbGllbnRlLmNwZkNucGpcclxuXHRcdFx0XHRcdGlmICghY3BmQ25waikge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdENsaWVudGVzQ2FkYXN0cmFkb3NTZXJ2aWNlLmdldENsaWVudGVFeGlzdGVudGUoY3BmQ25waiwgKHJlc3BvbnNlKSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNWZW5kZWRvcigpICYmICEkc2NvcGUuY2xpZW50ZS5pZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5hbGVydCgnQ2xpZW50ZSBqw6EgY2FkYXN0cmFkbyEgRW50cmUgZW0gY29udGF0byBjb20gYSBhZG1pbmlzdHJhw6fDo28uJylcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5uYW9FZGl0YXZlbCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCEkc2NvcGUuY2xpZW50ZS5pZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRleGliZU1vZGFsQ29uZmlybWFjYW9DbGllbnRlKHJlc3BvbnNlKVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUubmFvRWRpdGF2ZWwgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JHNjb3BlLnNlbGVjaW9uYUluZHVzdHJpYSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHZhciBpbmR1c3RyaWEgPSAkc2NvcGUuaW5kdXN0cmlhLnNlbGVjaW9uYWRvLmluZHVzdHJpYTtcclxuXHRcdFx0XHRcdHZhciBsaXN0YUVuY29udHJhZG9zID0gJC5ncmVwKCRzY29wZS5saXN0YUluZHVzdHJpYUNsaWVudGUsIGZ1bmN0aW9uIChlLCBpKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBlLmlkSW5kdXN0cmlhID09IGluZHVzdHJpYS5pZDtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0JHNjb3BlLmluZHVzdHJpYVByYXpvID0ge1xyXG5cdFx0XHRcdFx0XHRzZWxlY2lvbmFkbzogdW5kZWZpbmVkXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZVByYXpvUGFkcmFvID0ge1xyXG5cdFx0XHRcdFx0XHRzZWxlY2lvbmFkbzogdW5kZWZpbmVkXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKGxpc3RhRW5jb250cmFkb3MubGVuZ3RoID09IDApIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmluZHVzdHJpYUNsaWVudGUgPSB7XHJcblx0XHRcdFx0XHRcdFx0aWRDbGllbnRlOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdGlkSW5kdXN0cmlhOiBpbmR1c3RyaWEuaWQsXHJcblx0XHRcdFx0XHRcdFx0Y29kaWdvOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdGxpbWl0ZUNyZWRpdG86IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0YXRpdm86IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0YmxvcXVlaW9WZW5kYTogZmFsc2UsXHJcblx0XHRcdFx0XHRcdFx0bm9tZUluZHVzdHJpYTogaW5kdXN0cmlhLm5vbWUsXHJcblx0XHRcdFx0XHRcdFx0cmVtb3ZpZG86IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRcdGxpc3RhSW5kdXN0cmlhQ2xpZW50ZVByYXpvOiBbXSxcclxuXHRcdFx0XHRcdFx0XHRsaXN0YUluZHVzdHJpYUNsaWVudGVQcmF6b1BhcmFSZW1vdmVyOiBbXSxcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaW5kdXN0cmlhUHJhem8gPSB7XHJcblx0XHRcdFx0XHRcdFx0c2VsZWNpb25hZG86IHVuZGVmaW5lZCxcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZVByYXpvUGFkcmFvID0ge1xyXG5cdFx0XHRcdFx0XHRcdHNlbGVjaW9uYWRvOiB1bmRlZmluZWQsXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5pbmR1c3RyaWFDbGllbnRlID0gbGlzdGFFbmNvbnRyYWRvc1swXTtcclxuXHRcdFx0XHRcdFx0SW5kdXN0cmlhQ2xpZW50ZVByYXpvU2VydmljZS5nZXRJbmR1c3RyaWFDbGllbnRlUHJhem9Qb3JJZEluZHVzdHJpYUNsaWVudGUoJHNjb3BlLmluZHVzdHJpYUNsaWVudGUuaWQsIChyZXN1bHQpID0+IHtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZVByYXpvID0gcmVzdWx0XHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0YnVzY2FSZXByZXNlbnRhY29lc0luZHVzdHJpYShpbmR1c3RyaWEpXHJcblxyXG5cdFx0XHRcdFx0Z2VyYUxpc3RhUHJhem9zRXhpc3RlbnRlcyhpbmR1c3RyaWEpXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBleGliZU1vZGFsQ29uZmlybWFjYW9DbGllbnRlKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0XHR2YXIgbW9kYWxPcHRpb25zID0ge1xyXG5cdFx0XHRcdFx0XHRjbG9zZUJ1dHRvblRleHQ6ICdOw6NvJyxcclxuXHRcdFx0XHRcdFx0YWN0aW9uQnV0dG9uVGV4dDogJ1NpbScsXHJcblx0XHRcdFx0XHRcdGhlYWRlclRleHQ6ICdDb25maXJtYXInLFxyXG5cdFx0XHRcdFx0XHRib2R5VGV4dDogJ08gY2xpZW50ZSBjb20gQ05QSiAnICsgcmVzcG9uc2UuY3BmQ25waiArICcgasOhIHBvc3N1aSBjYWRhc3RybyEgRGVzZWphIGNhcnJlZ2FyIHNldXMgZGFkb3M/J1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdE1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucykudGhlbigoKSA9PiB7XHJcblx0XHRcdFx0XHRcdENsaWVudGVzQ2FkYXN0cmFkb3NTZXJ2aWNlLmNsaWVudGVQYXJhRWRpdGFyID0gcmVzcG9uc2VcclxuXHRcdFx0XHRcdFx0JHJvdXRlLnJlbG9hZCgpO1xyXG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZnVuY3Rpb24gYnVzY2FSZXByZXNlbnRhY29lc0luZHVzdHJpYShpbmR1c3RyaWEpIHtcclxuXHRcdFx0XHRcdHNlcnZpY2UuZ2V0UmVwcmVzZW50YWNvZXNJbmR1c3RyaWEoaW5kdXN0cmlhLmlkLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmxpc3RhUmVwcmVzZW50YWNvZXNWZW5kZWRvciA9IHJlc3BvbnNlO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKEF1dGhlbnRpY2F0aW9uU2VydmljZS5pc1ZlbmRlZG9yKCkpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgcmVwcmVzZW50YWNvZXMgPSAkLmdyZXAoJHNjb3BlLmxpc3RhUmVwcmVzZW50YWNvZXNWZW5kZWRvciwgZnVuY3Rpb24gKGUsIGkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBlLnVzdWFyaW8uaWQgPT0gdXN1YXJpby5pZDtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVwcmVzZW50YWNvZXMgJiYgcmVwcmVzZW50YWNvZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnJlcHJlc2VudGFjYW9WZW5kZWRvci5zZWxlY2lvbmFkbyA9IHJlcHJlc2VudGFjb2VzWzBdO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZiAoJHNjb3BlLnJlcHJlc2VudGFjYW9WZW5kZWRvci5zZWxlY2lvbmFkbykge1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnNlbGVjaW9uYVJlcHJlc2VudGFjYW9WZW5kZWRvcigpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGZ1bmN0aW9uIGdlcmFMaXN0YVByYXpvc0V4aXN0ZW50ZXMoaW5kdXN0cmlhKSB7XHJcblx0XHRcdFx0XHRJbmR1c3RyaWFzU2VydmljZS5nZXRQcmF6b3NJbmR1c3RyaWEoaW5kdXN0cmlhLmlkLCAocmVzdWx0KSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmICgkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6byAhPT0gbnVsbCAmJiAkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6by5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly9HRVJBIExJU1RBIERFIFBSQVpPUyBKQSBBRElDSU9OQURPUyBOQSBJTkRVU1RSSUEgU0VMRUNJT05BREFcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuaW5kdXN0cmlhUHJhem8uc2VsZWNpb25hZG8gPSAkLmdyZXAocmVzdWx0LCAoZVByYXpvKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgZXhpc3RzID0gJC5ncmVwKCRzY29wZS5pbmR1c3RyaWFDbGllbnRlLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZVByYXpvLCAoZUluZHVzdHJpYUNsaWVudGVQcmF6bykgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZVByYXpvLmlkID09PSBlSW5kdXN0cmlhQ2xpZW50ZVByYXpvLmlkSW5kdXN0cmlhUHJhem9cclxuXHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZXhpc3RzLmxlbmd0aCAhPT0gMFxyXG5cdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0Ly9CVVNDQSBJVEVNIFBBRFJBTyBTRUxFQ0lPTkFET1xyXG5cdFx0XHRcdFx0XHRcdGlmICgkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6by5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgZXhpc3RzID0gJC5ncmVwKCRzY29wZS5pbmR1c3RyaWFDbGllbnRlLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZVByYXpvLCAoZUluZHVzdHJpYUNsaWVudGVQcmF6bykgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZUluZHVzdHJpYUNsaWVudGVQcmF6by5wYWRyYW8gPT09IHRydWVcclxuXHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZXhpc3RzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmluZHVzdHJpYUNsaWVudGVQcmF6b1BhZHJhby5zZWxlY2lvbmFkbyA9IGV4aXN0c1swXVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQkc2NvcGUucHJhem9zSW5kdXN0cmlhID0gcmVzdWx0XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JHNjb3BlLnNlbGVjaW9uYVJlcHJlc2VudGFjYW9WZW5kZWRvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGlmICghJHNjb3BlLmxpc3RhUmVwcmVzZW50YWNvZXNDbGllbnRlKSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5saXN0YVJlcHJlc2VudGFjb2VzQ2xpZW50ZSA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhciBsaXN0YUVuY29udHJhZG9zID0gJC5ncmVwKCRzY29wZS5saXN0YVJlcHJlc2VudGFjb2VzQ2xpZW50ZSwgZnVuY3Rpb24gKGUsIGkpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGUuaWRSZXByZXNlbnRhY2FvID09ICRzY29wZS5yZXByZXNlbnRhY2FvVmVuZGVkb3Iuc2VsZWNpb25hZG8uaWQ7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIWxpc3RhRW5jb250cmFkb3MgfHwgbGlzdGFFbmNvbnRyYWRvcy5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUucmVwcmVzZW50YWNhb0NsaWVudGUgPSB7XHJcblx0XHRcdFx0XHRcdFx0aWQ6ICRzY29wZS5yZXByZXNlbnRhY2FvVmVuZGVkb3Iuc2VsZWNpb25hZG8uaWQsXHJcblx0XHRcdFx0XHRcdFx0aW5kdXN0cmlhOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZDogJHNjb3BlLnJlcHJlc2VudGFjYW9WZW5kZWRvci5zZWxlY2lvbmFkby5pbmR1c3RyaWEuaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRub21lOiAkc2NvcGUucmVwcmVzZW50YWNhb1ZlbmRlZG9yLnNlbGVjaW9uYWRvLmluZHVzdHJpYS5ub21lXHJcblx0XHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0XHR1c3VhcmlvOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZDogJHNjb3BlLnJlcHJlc2VudGFjYW9WZW5kZWRvci5zZWxlY2lvbmFkby51c3VhcmlvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0bm9tZTogJHNjb3BlLnJlcHJlc2VudGFjYW9WZW5kZWRvci5zZWxlY2lvbmFkby51c3VhcmlvLm5vbWVcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5yZXByZXNlbnRhY2FvQ2xpZW50ZSA9IGxpc3RhRW5jb250cmFkb3NbMF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQkc2NvcGUuYWx0ZXJhU2VsZWNhb0luZHVzdHJpYSA9IGZ1bmN0aW9uIChpbmR1c3RyaWEpIHtcclxuXHRcdFx0XHRcdGlmIChpbmR1c3RyaWEuc2VsZWNpb25hZG8pIHtcclxuXHRcdFx0XHRcdFx0YWRpY2lvbmFJbmR1c3RyaWEoaW5kdXN0cmlhKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlbW92ZUluZHVzdHJpYShpbmR1c3RyaWEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0c2VydmljZS5idXNjYUVzdGFkb3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0XHQkc2NvcGUuZXN0YWRvcyA9IHJlc3BvbnNlO1xyXG5cdFx0XHRcdFx0aWYgKCRzY29wZS5jbGllbnRlLmVzdGFkbyA9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5lc3RhZG9zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uc2lnbGEgPT0gJ1JTJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmVzdGFkby5zZWxlY2lvbmFkbyA9IGl0ZW07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5lc3RhZG9zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uc2lnbGEgPT0gJHNjb3BlLmNsaWVudGUuZXN0YWRvLnNpZ2xhKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuZXN0YWRvLnNlbGVjaW9uYWRvID0gaXRlbTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuc2FsdmFyQ2xpZW50ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHZhciBiYW5jbyA9ICRzY29wZS5iYW5jby5ub21lO1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNsaWVudGUuaWRQZXNzb2EgPSAkc2NvcGUudGlwb1Blc3NvYS5zZWxlY2lvbmFkby5pZDtcclxuXHRcdFx0XHRcdCRzY29wZS5jbGllbnRlLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZSA9ICRzY29wZS5saXN0YUluZHVzdHJpYUNsaWVudGU7XHJcblx0XHRcdFx0XHQkc2NvcGUuY2xpZW50ZS5saXN0YVJlcHJlc2VudGFjb2VzQ2xpZW50ZSA9ICRzY29wZS5saXN0YVJlcHJlc2VudGFjb2VzQ2xpZW50ZTtcclxuXHRcdFx0XHRcdCRzY29wZS5jbGllbnRlLmVzdGFkbyA9ICRzY29wZS5lc3RhZG8uc2VsZWNpb25hZG87XHJcblx0XHRcdFx0XHQkc2NvcGUuY2xpZW50ZS5ub21lQmFuY28gPSAkc2NvcGUuYmFuY28ubm9tZTtcclxuXHJcblx0XHRcdFx0XHRpZiAoQXV0aGVudGljYXRpb25TZXJ2aWNlLmlzVmVuZGVkb3IoKSkge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuY2xpZW50ZS5wZW5kZW50ZVJlZ2lzdHJvID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRzYWx2YXIoKVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKCRzY29wZS5jbGllbnRlLnBlbmRlbnRlUmVnaXN0cm8gPT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjbG9zZUJ1dHRvblRleHQ6ICdOw6NvJyxcclxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbkJ1dHRvblRleHQ6ICdTaW0nLFxyXG5cdFx0XHRcdFx0XHRcdFx0aGVhZGVyVGV4dDogJ0NvbmZpcm1hcicsXHJcblx0XHRcdFx0XHRcdFx0XHRib2R5VGV4dDogJ08gY2xpZW50ZSAnICsgJHNjb3BlLmNsaWVudGUucmF6YW9Tb2NpYWwgKyAnIGVzdMOhIG1hcmRvIGNvbW8gcGVuZGVudGUgZGUgY2FkYXN0cm8uIERlc2VqYSByZW1vdmVyIGVzdGEgbWFyY2HDp8Ojbz8nXHJcblx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0TW9kYWxTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5jbGllbnRlLnBlbmRlbnRlUmVnaXN0cm8gPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0c2FsdmFyKClcclxuXHRcdFx0XHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRzYWx2YXIoKVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHNhbHZhcigpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCRzY29wZS5hZGljaW9uYUluZHVzdHJpYUNsaWVudGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRpZiAoISRzY29wZS5saXN0YUluZHVzdHJpYUNsaWVudGUpIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZSA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bGV0IGF0dWFsaXpvdSA9IGZhbHNlXHJcblx0XHRcdFx0XHQkc2NvcGUubGlzdGFJbmR1c3RyaWFDbGllbnRlLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcclxuXHRcdFx0XHRcdFx0aWYoaXRlbS5pZCA9PSAkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZS5pZCAmJiBpdGVtLnJlbW92aWRvKSB7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZVtpbmRleF0ucmVtb3ZpZG8gPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdGF0dWFsaXpvdSA9IHRydWVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdGlmKCFhdHVhbGl6b3UpIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZS5wdXNoKCRzY29wZS5pbmR1c3RyaWFDbGllbnRlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCRzY29wZS5hZGljaW9uYVJlcHJlc2VudGNhb1ZlbmRlZG9yID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0aWYgKCEkc2NvcGUubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUpIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmxpc3RhUmVwcmVzZW50YWNvZXNDbGllbnRlID0gW107XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkc2NvcGUubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUucHVzaCgkc2NvcGUucmVwcmVzZW50YWNhb0NsaWVudGUpXHJcblx0XHRcdFx0XHQkc2NvcGUuYmxvcXVlaWFTYWx2YXIgPSAoQXV0aGVudGljYXRpb25TZXJ2aWNlLmlzVmVuZGVkb3IoKSAmJiAkc2NvcGUubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUubGVuZ3RoIDwgMSlcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCRzY29wZS5hZGljaW9uYUluZHVzdHJpYUNsaWVudGVSZXByZXNlbnRhY2FvVmVuZGVkb3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHQkc2NvcGUuYWRpY2lvbmFJbmR1c3RyaWFDbGllbnRlKCk7XHJcblx0XHRcdFx0XHQkc2NvcGUuYWRpY2lvbmFSZXByZXNlbnRjYW9WZW5kZWRvcigpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JHNjb3BlLnZhbGlkYURvY3VtZW50byA9IGZ1bmN0aW9uIChjcGZDbnBqKSB7XHJcblx0XHRcdFx0XHRpZiAoY3BmQ25wai5sZW5ndGggPT0gMTQpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHNlcnZpY2UudmFsaWRhckNucGooY3BmQ25waik7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQkc2NvcGUucmVtb3ZlUmVwcmVzZW50YWNhbyA9IGZ1bmN0aW9uIChyZXByZXNlbnRhY2FvKSB7XHJcblx0XHRcdFx0XHQkLmVhY2goJHNjb3BlLmxpc3RhUmVwcmVzZW50YWNvZXNDbGllbnRlLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoJHNjb3BlLmxpc3RhUmVwcmVzZW50YWNvZXNDbGllbnRlW2ldLmlkID09PSByZXByZXNlbnRhY2FvLmlkKSB7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmxpc3RhUmVwcmVzZW50YWNvZXNDbGllbnRlLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuYmxvcXVlaWFTYWx2YXIgPSAoQXV0aGVudGljYXRpb25TZXJ2aWNlLmlzVmVuZGVkb3IoKSAmJiAkc2NvcGUubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUubGVuZ3RoIDwgMSlcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JHNjb3BlLnJlbW92ZXJJbmR1c3RyaWFDbGllbnRlID0gZnVuY3Rpb24gKGluZHVzdHJpYUNsaWVudGUpIHtcclxuXHRcdFx0XHRcdCQuZWFjaCgkc2NvcGUubGlzdGFJbmR1c3RyaWFDbGllbnRlLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoJHNjb3BlLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZVtpXS5pZCA9PT0gaW5kdXN0cmlhQ2xpZW50ZS5pZCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmKGluZHVzdHJpYUNsaWVudGUuaWQgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZS5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5saXN0YUluZHVzdHJpYUNsaWVudGVbaV0ucmVtb3ZpZG8gPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JHNjb3BlLnZvbHRhciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCRzY29wZS5wb2RlU2FsdmFyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0aWYgKEF1dGhlbnRpY2F0aW9uU2VydmljZS5pc1ZlbmRlZG9yKCkpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCRzY29wZS5saXN0YVJlcHJlc2VudGFjb2VzQ2xpZW50ZSAmJiAkc2NvcGUubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQkc2NvcGUuc2VsZWNpb25hSW5kdXN0cmlhUHJhem8gPSAoaXRlbSkgPT4ge1xyXG5cdFx0XHRcdFx0bGV0IGluZHVzdHJpYUNsaWVudGVQcmF6byA9IHtcclxuXHRcdFx0XHRcdFx0aWQ6IHVuZGVmaW5lZCxcclxuXHRcdFx0XHRcdFx0aWRJbmR1c3RyaWFDbGllbnRlOiB1bmRlZmluZWQsXHJcblx0XHRcdFx0XHRcdGlkSW5kdXN0cmlhUHJhem86IGl0ZW0uaWQsXHJcblx0XHRcdFx0XHRcdGRlc2NyaWNhb0luZHVzdHJpYVByYXpvOiBpdGVtLmRlc2NyaWNhbyxcclxuXHRcdFx0XHRcdFx0cGFkcmFvOiB1bmRlZmluZWQsXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6by5wdXNoKGluZHVzdHJpYUNsaWVudGVQcmF6bylcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCRzY29wZS5yZW1vdmVJbmR1c3RyaWFQcmF6byA9IChpdGVtKSA9PiB7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgaXRlbVJlbW92aWRvID0gJC5ncmVwKCRzY29wZS5pbmR1c3RyaWFDbGllbnRlLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZVByYXpvLCAoZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZS5pZEluZHVzdHJpYVByYXpvID09PSBpdGVtLmlkO1xyXG5cdFx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0XHQkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6byA9ICQuZ3JlcCgkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6bywgKGUpID0+IHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGUuaWRJbmR1c3RyaWFQcmF6byAhPT0gaXRlbS5pZDtcclxuXHRcdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdFx0aWYgKGl0ZW1SZW1vdmlkb1swXSAmJiBpdGVtUmVtb3ZpZG9bMF0ucGFkcmFvKSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5pbmR1c3RyaWFDbGllbnRlUHJhem9QYWRyYW8uc2VsZWNpb25hZG8gPSB1bmRlZmluZWRcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoaXRlbVJlbW92aWRvWzBdICYmIGl0ZW1SZW1vdmlkb1swXS5pZCkge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6b1BhcmFSZW1vdmVyLnB1c2goaXRlbVJlbW92aWRvWzBdKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JHNjb3BlLnJlbW92ZXJQYWRyYW8gPSAoKSA9PiB7XHJcblx0XHRcdFx0XHQkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6by5mb3JFYWNoKChlLCBpLCBhcnIpID0+IHtcclxuXHRcdFx0XHRcdFx0ZS5wYWRyYW8gPSB1bmRlZmluZWRcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmluZHVzdHJpYUNsaWVudGVQcmF6b1BhZHJhby5zZWxlY2lvbmFkbyA9IHVuZGVmaW5lZFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCRzY29wZS5idXNjYURlc2NyaWNhb1Jlc3VtaWRhUHJhem8gPSAoaW5kdXN0cmlhQ2xpZW50ZSkgPT4ge1xyXG5cdFx0XHRcdFx0bGV0IGRlc2NyID0gXCJcIlxyXG5cdFx0XHRcdFx0aW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6by5mb3JFYWNoKChlLCBpLCBhcnIpID0+IHtcclxuXHRcdFx0XHRcdFx0aWYgKGkgPT09IGFyci5sZW5ndGggLSAxKSB7XHJcblx0XHRcdFx0XHRcdFx0ZGVzY3IgKz0gKGUucGFkcmFvID8gYDxzdHJvbmc+JHtlLmRlc2NyaWNhb0luZHVzdHJpYVByYXpvfTwvc3Ryb25nPmAgOiBlLmRlc2NyaWNhb0luZHVzdHJpYVByYXpvKVxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGRlc2NyICs9IChlLnBhZHJhbyA/IGA8c3Ryb25nPiR7ZS5kZXNjcmljYW9JbmR1c3RyaWFQcmF6b308L3N0cm9uZz4sIGAgOiBlLmRlc2NyaWNhb0luZHVzdHJpYVByYXpvICsgXCIsIFwiKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoZGVzY3IpXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQkc2NvcGUuc2VsZWNpb25hSW5kdXN0cmlhUHJhem9QYWRyYW8gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHQkc2NvcGUuaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6by5mb3JFYWNoKChlLCBpLCBhcnIpID0+IHtcclxuXHRcdFx0XHRcdFx0aWYgKGUuaWQgPT0gJHNjb3BlLmluZHVzdHJpYUNsaWVudGVQcmF6b1BhZHJhby5zZWxlY2lvbmFkby5pZCAmJiBlLmlkSW5kdXN0cmlhUHJhem8gPT0gJHNjb3BlLmluZHVzdHJpYUNsaWVudGVQcmF6b1BhZHJhby5zZWxlY2lvbmFkby5pZEluZHVzdHJpYVByYXpvKSB7XHJcblx0XHRcdFx0XHRcdFx0ZS5wYWRyYW8gPSB0cnVlXHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0ZS5wYWRyYW8gPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JHNjb3BlLnVwbG9hZEFycXVpdm9DbGllbnRlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dmFyIGZpbGVzID0gJHNjb3BlLmFycXVpdm9DbGllbnRlO1xyXG5cdFx0XHRcdFx0aWYgKCFmaWxlcykge1xyXG5cdFx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmFsZXJ0KFwiTmVuaHVtIGFycXVpdm8gc2VsZWNpb25hZG9cIilcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJsb2NrVUkuc3RhcnQoJ0NhcnJlZ2FuZG8gQXJxdWl2bywgQWd1YXJkZS4uLicpO1xyXG5cdFx0XHRcdFx0c2VydmljZS51cGxvYWRBcnF1aXZvQ2xpZW50ZShmaWxlcywgJHNjb3BlLmNsaWVudGUuY3BmQ25waiwgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG5cdFx0XHRcdFx0XHRhZGljaW9uYUFycXVpdm9zQ2xpZW50ZShyZXN1bHQpXHJcblx0XHRcdFx0XHRcdCRzY29wZS5hcnF1aXZvQ2xpZW50ZSA9IG51bGxcclxuXHRcdFx0XHRcdFx0YmxvY2tVSS5zdG9wKCk7XHJcblx0XHRcdFx0XHR9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ0VSUicpXHJcblx0XHRcdFx0XHRcdGJsb2NrVUkuc3RvcCgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBhZGljaW9uYUFycXVpdm9zQ2xpZW50ZShhcnF1aXZvc0VudmlhZG9zKSB7XHJcblx0XHRcdFx0XHRpZiAoYXJxdWl2b3NFbnZpYWRvcykge1xyXG5cdFx0XHRcdFx0XHRpZiAoISRzY29wZS5jbGllbnRlLmFycXVpdm9zKSB7XHJcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmNsaWVudGUuYXJxdWl2b3MgPSBbXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGFycXVpdm9zRW52aWFkb3MuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBhcnF1aXZvQ2xpZW50ZUR0byA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRDbGllbnRlOiAkc2NvcGUuY2xpZW50ZS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdG5vbWVBcnF1aXZvOiBpdGVtLm5vbWVBcnF1aXZvXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5jbGllbnRlLmFycXVpdm9zLnB1c2goYXJxdWl2b0NsaWVudGVEdG8pXHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBzYWx2YXIoKSB7XHJcblx0XHRcdFx0XHRzZXJ2aWNlLnNhbHZhckNsaWVudGUoJHNjb3BlLmNsaWVudGUsIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHRcdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5zdWNjZXNzKGBDbGllbnRlICR7cmVzdWx0LnJhemFvU29jaWFsfSBjYWRhc3RyYWRvIGNvbSBzdWNlc3NvIWApO1xyXG5cdFx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3RhQ2xpZW50ZXMnKTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fV0pO1xyXG4iLCJ2YXIgY2FkYXN0cm9DbGllbnRlTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NhZGFzdHJvQ2xpZW50ZXMnKTtcclxuXHJcbmNhZGFzdHJvQ2xpZW50ZU1vZHVsZS5kaXJlY3RpdmUoJ2F1dG9Db21wbGV0ZScsIFsnJHRpbWVvdXQnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XHJcbiAgICBpRWxlbWVudC5hdXRvY29tcGxldGUoe1xyXG4gICAgICBzb3VyY2U6IHNjb3BlW2lBdHRycy51aUl0ZW1zXSxcclxuICAgICAgc2VsZWN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgaUVsZW1lbnQudHJpZ2dlcignaW5wdXQnKTtcclxuICAgICAgICB9LCAwKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxufV0pO1xyXG5cclxuY2FkYXN0cm9DbGllbnRlTW9kdWxlLmRpcmVjdGl2ZSgnY2FwaXRhbGl6ZScsIGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4ge1xyXG4gICAgcmVxdWlyZTogJ25nTW9kZWwnLFxyXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbW9kZWxDdHJsKSB7XHJcbiAgICAgIHZhciBjYXBpdGFsaXplID0gZnVuY3Rpb24gKGlucHV0VmFsdWUpIHtcclxuICAgICAgICBpZiAoaW5wdXRWYWx1ZSA9PSB1bmRlZmluZWQpIGlucHV0VmFsdWUgPSAnJztcclxuICAgICAgICB2YXIgY2FwaXRhbGl6ZWQgPSBpbnB1dFZhbHVlLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKGNhcGl0YWxpemVkICE9PSBpbnB1dFZhbHVlKSB7XHJcbiAgICAgICAgICBtb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShjYXBpdGFsaXplZCk7XHJcbiAgICAgICAgICBtb2RlbEN0cmwuJHJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2FwaXRhbGl6ZWQ7XHJcbiAgICAgIH1cclxuICAgICAgbW9kZWxDdHJsLiRwYXJzZXJzLnB1c2goY2FwaXRhbGl6ZSk7XHJcbiAgICAgIGNhcGl0YWxpemUoc2NvcGVbYXR0cnMubmdNb2RlbF0pOyAvLyBjYXBpdGFsaXplIGluaXRpYWwgdmFsdWVcclxuICAgIH1cclxuICB9O1xyXG59KTtcclxuXHJcbmNhZGFzdHJvQ2xpZW50ZU1vZHVsZS5kaXJlY3RpdmUoJ2NoZWNrQ3BmQ25waicsIGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4ge1xyXG4gICAgcmVxdWlyZTogJ25nTW9kZWwnLFxyXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBpRWxlbWVudCwgYXR0cnMsIG5nTW9kZWwpIHtcclxuICAgICAgaUVsZW1lbnQuYmluZCgnYmx1cicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKG5nTW9kZWwuJG1vZGVsVmFsdWUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBuZ01vZGVsLiRzZXRWYWxpZGl0eSgnY25mQ25waicsIHRydWUpO1xyXG4gICAgICAgICAgaWYgKHNjb3BlLnZhbGlkYURvY3VtZW50byhuZ01vZGVsLiRtb2RlbFZhbHVlKSkge1xyXG4gICAgICAgICAgICBuZ01vZGVsLiRzZXRWYWxpZGl0eSgnY25mQ25waicsIHRydWUpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmdNb2RlbC4kc2V0VmFsaWRpdHkoJ2NuZkNucGonLCBmYWxzZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcbn0pO1xyXG5cclxuY2FkYXN0cm9DbGllbnRlTW9kdWxlLmRpcmVjdGl2ZSgnbmdGaWxlTW9kZWwnLCBbJyRwYXJzZScsIGZ1bmN0aW9uICgkcGFyc2UpIHtcclxuICByZXR1cm4ge1xyXG4gICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgdmFyIG1vZGVsID0gJHBhcnNlKGF0dHJzLm5nRmlsZU1vZGVsKTtcclxuICAgICAgdmFyIGlzTXVsdGlwbGUgPSBhdHRycy5tdWx0aXBsZTtcclxuICAgICAgdmFyIG1vZGVsU2V0dGVyID0gbW9kZWwuYXNzaWduO1xyXG4gICAgICBlbGVtZW50LmJpbmQoJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdmFsdWVzID0gW107XHJcbiAgICAgICAgdmFyIHVybCA9IFxyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChlbGVtZW50WzBdLmZpbGVzLCBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgdmFsdWVzLnB1c2goaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmIChpc011bHRpcGxlKSB7XHJcbiAgICAgICAgICAgIG1vZGVsU2V0dGVyKHNjb3BlLCB2YWx1ZXMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbW9kZWxTZXR0ZXIoc2NvcGUsIHZhbHVlc1swXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcbn1dKTtcclxuXHJcbmNhZGFzdHJvQ2xpZW50ZU1vZHVsZS5maWx0ZXIoJ3NpbV9uYW8nLCBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICh0ZXh0LCBsZW5ndGgsIGVuZCkge1xyXG4gICAgaWYgKHRleHQpIHtcclxuICAgICAgcmV0dXJuICdTaW0nO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICdOw6NvJztcclxuICB9XHJcbn0pOyIsIid1c2Ugc3RyaWN0J1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ0NhZGFzdHJvQ2xpZW50ZXMnKS5mYWN0b3J5KCdDYWRhc3Ryb0NsaWVudGVzU2VydmljZScsIFsgJyRodHRwJywgJ05ldHdvcmtTZXJ2aWNlJywgJ05vdGlmaWNhdGlvblNlcnZpY2UnLCBmdW5jdGlvbigkaHR0cCwgTmV0d29ya1NlcnZpY2UsIE5vdGlmaWNhdGlvblNlcnZpY2UpIHtcclxuXHR2YXIgc2VydmljZSA9IHt9O1xyXG5cdFxyXG5cdHNlcnZpY2Uuc2FsdmFyQ2xpZW50ZSA9IChjbGllbnRlLCBjYWxsYmFjaykgPT4ge1xyXG5cdFx0TmV0d29ya1NlcnZpY2UuaHR0cFBvc3QoJy9zYWx2YXJDbGllbnRlJywgY2xpZW50ZSwgKHJlc3VsdCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBzYWx2YXIgbyBjbGllbnRlJywgZGF0YSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuYnVzY2FFc3RhZG9zID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBHZXQoJy9idXNjYUVzdGFkb3MnLCAocmVzdWx0LCBkYXRhKSA9PiB7XHJcblx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGRhdGEpXHJcblx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciBvcyBlc3RhZG9zJywgZGF0YSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuYnVzY2FWZW5kZWRvcmVzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBHZXQoJy9idXNjYVVzdWFyaW9zJywgKHJlc3VsdCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBidXNjYXIgdmVuZGVkb3JlcycsIGRhdGEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ07Do28gZm9pIHBvc3PDrXZlbCBzZSBjb211bmljYXIgY29tIG8gc2Vydmlkb3IuJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRzZXJ2aWNlLmJ1c2NhTGlzdGFUaXBvUGVzc29hID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBHZXQoJy9idXNjYUxpc3RhVGlwb1Blc3NvYScsIChyZXN1bHQsIGRhdGEpID0+IHtcclxuXHRcdFx0aWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULk9LKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soZGF0YSlcclxuXHRcdFx0fSBlbHNlIGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5FUlJPUikge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gYnVzY2FyIHRpcG9zIGRlIHBlc3NvYScsIGRhdGEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ07Do28gZm9pIHBvc3PDrXZlbCBzZSBjb211bmljYXIgY29tIG8gc2Vydmlkb3IuJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRzZXJ2aWNlLmdldEluZHVzdHJpYXNDbGllbnRlID0gZnVuY3Rpb24oaWRDbGllbnRlLCBjYWxsYmFjaykge1xyXG5cdFx0TmV0d29ya1NlcnZpY2UuaHR0cFBvc3QoYC9idXNjYUluZHVzdHJpYUNsaWVudGVgLCBpZENsaWVudGUsIChyZXN1bHQsIGRhdGEpID0+IHtcclxuXHRcdFx0aWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULk9LKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soZGF0YSlcclxuXHRcdFx0fSBlbHNlIGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5FUlJPUikge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gYnVzY2FyIGluZHVzdHJpYXMgZG8gY2xpZW50ZScsIGRhdGEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ07Do28gZm9pIHBvc3PDrXZlbCBzZSBjb211bmljYXIgY29tIG8gc2Vydmlkb3IuJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRzZXJ2aWNlLmdldFJlcHJlc2VudGFjb2VzSW5kdXN0cmlhID0gZnVuY3Rpb24oaWRJbmR1c3RyaWEsIGNhbGxiYWNrKSB7XHJcblx0XHROZXR3b3JrU2VydmljZS5odHRwUG9zdChgL2J1c2NhUmVwcmVzZW50YWNvZXNJbmR1c3RyaWFgLCBpZEluZHVzdHJpYSwgKHJlc3VsdCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBidXNjYXIgcmVwcmVzZW50YWNvZXMgaW5kdXN0cmlhcycsIGRhdGEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ07Do28gZm9pIHBvc3PDrXZlbCBzZSBjb211bmljYXIgY29tIG8gc2Vydmlkb3IuJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRzZXJ2aWNlLmdldFJlcHJlc2VudGFjb2VzVXN1YXJpbyA9IGZ1bmN0aW9uKGlkVXN1YXJpbywgY2FsbGJhY2spIHtcclxuXHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBQb3N0KGAvYnVzY2FSZXByZXNlbnRhY29lc1VzdWFyaW9gLCBpZFVzdWFyaW8sIChyZXN1bHQsIGRhdGEpID0+IHtcclxuXHRcdFx0aWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULk9LKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soZGF0YSlcclxuXHRcdFx0fSBlbHNlIGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5FUlJPUikge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gYnVzY2FyIHJlcHJlc2VudGFjb2VzIGluZHVzdHJpYXMnLCBkYXRhKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdOw6NvIGZvaSBwb3Nzw612ZWwgc2UgY29tdW5pY2FyIGNvbSBvIHNlcnZpZG9yLicpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0c2VydmljZS5kb3dubG9hZEFycXVpdm8gPSBmdW5jdGlvbihjcGZDbnBqLCBub21lQXJxdWl2bywgY2FsbGJhY2spIHtcclxuXHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBHZXQoYC9kb3dubG9hZEFycXVpdm9DbGllbnRlP25vbWVBcnF1aXZvPSR7bm9tZUFycXVpdm99JmNwZkNucGo9JHtjcGZDbnBqfWAsIChyZXN1bHQsIGRhdGEpID0+IHtcclxuXHRcdFx0aWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULk9LKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soZGF0YSlcclxuXHRcdFx0fSBlbHNlIGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5FUlJPUikge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gYnVzY2FyIGFycXVpdm8nLCBkYXRhKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdOw6NvIGZvaSBwb3Nzw612ZWwgc2UgY29tdW5pY2FyIGNvbSBvIHNlcnZpZG9yLicpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVx0XHRcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuY29tcGFjdGFyQXJxdWl2b3MgPSBmdW5jdGlvbiAoZmlsZXMsIGNhbGxiYWNrKSB7XHJcblx0XHR2YXIgZmQgPSBuZXcgRm9ybURhdGEoKVxyXG5cdFx0bGV0IGNvbnQgPSAwXHJcblx0XHRmb3IgKHZhciBpIGluIGZpbGVzKSB7XHJcblx0XHRcdGlmIChJTUFHRV9GSUxFX1RZUEUuaW5kZXhPZihmaWxlc1tpXS50eXBlKSA+IC0xKSB7XHJcblx0XHRcdFx0bmV3IEltYWdlQ29tcHJlc3NvcihmaWxlc1tpXSwge1xyXG5cdFx0XHRcdFx0cXVhbGl0eTogLjgsXHJcblx0XHRcdFx0XHRtaW5XaWR0aDogMTAyNCxcclxuXHRcdFx0XHRcdG1heFdpZHRoOiAxNDQwICxcclxuXHRcdFx0XHRcdG1pbkhlaWdodDogNzY4LFxyXG5cdFx0XHRcdFx0bWF4SGVpZ2h0OiA5MDAsXHJcblx0XHRcdFx0XHRzdWNjZXNzKHJlc3VsdCkge1xyXG5cdFx0XHRcdFx0XHRmZC5hcHBlbmQoXCJmaWxlc1wiLCByZXN1bHQsIHJlc3VsdC5uYW1lKTtcclxuXHRcdFx0XHRcdFx0Y29udCsrXHJcblx0XHRcdFx0XHRcdGlmIChjb250ID09IGZpbGVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrKGZkKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0ZXJyb3IoZSkge1xyXG5cdFx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKGVycm9yKTtcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2sobnVsbClcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZkLmFwcGVuZChcImZpbGVzXCIsIGZpbGVzW2ldKTtcclxuXHRcdFx0XHRjb250KytcclxuXHRcdFx0XHRpZiAoY29udCA9PSBmaWxlcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKGZkKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2VydmljZS51cGxvYWRBcnF1aXZvQ2xpZW50ZSA9IGZ1bmN0aW9uIChmaWxlcywgY3BmQ25waiwgY2FsbGJhY2ssIGNhbGxiYWNrRXJyb3IpIHtcclxuXHRcdHNlcnZpY2UuY29tcGFjdGFyQXJxdWl2b3MoZmlsZXMsIChtRmlsZURlc2NyaXB0b3IpID0+IHtcclxuXHRcdFx0aWYgKG1GaWxlRGVzY3JpcHRvcikge1xyXG5cdFx0XHRcdG1GaWxlRGVzY3JpcHRvci5hcHBlbmQoJ2NwZkNucGonLCBjcGZDbnBqKVxyXG5cdFx0XHRcdCRodHRwLnBvc3QoTU9ET19IVFRQICsgVVJMICsgJy91cGxvYWRBcnF1aXZvQ2xpZW50ZScsIG1GaWxlRGVzY3JpcHRvciwge1xyXG5cdFx0XHRcdFx0dHJhbnNmb3JtUmVxdWVzdDogYW5ndWxhci5pZGVudGl0eSxcclxuXHRcdFx0XHRcdGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6IHVuZGVmaW5lZCB9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHRcdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5zdWNjZXNzKCdBcnF1aXZvIGVudmlhZG8gY29tIHN1Y2Vzc28hJylcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2socmVzdWx0KTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHQuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XHJcblx0XHRcdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoZXJyb3IpO1xyXG5cdFx0XHRcdFx0XHRjYWxsYmFja0Vycm9yKGVycm9yKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoXCJOw6NvIGZvaSBwb3Nzw612ZWwgZW52aWFyIG9zIGFycXVpdm9zXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UudmFsaWRhckNwZiA9IGZ1bmN0aW9uKGNwZikge1xyXG5cdCAgICBjcGYgPSBjcGYucmVwbGFjZSgvW15cXGRdKy9nLCcnKTsgICAgXHJcblx0ICAgIGlmKGNwZiA9PSAnJykgcmV0dXJuIGZhbHNlOyBcclxuXHQgICAgLy8gRWxpbWluYSBDUEZzIGludmFsaWRvcyBjb25oZWNpZG9zICAgIFxyXG5cdCAgICBpZiAoY3BmLmxlbmd0aCAhPSAxMSB8fCBcclxuXHQgICAgICAgIGNwZiA9PSBcIjAwMDAwMDAwMDAwXCIgfHwgXHJcblx0ICAgICAgICBjcGYgPT0gXCIxMTExMTExMTExMVwiIHx8IFxyXG5cdCAgICAgICAgY3BmID09IFwiMjIyMjIyMjIyMjJcIiB8fCBcclxuXHQgICAgICAgIGNwZiA9PSBcIjMzMzMzMzMzMzMzXCIgfHwgXHJcblx0ICAgICAgICBjcGYgPT0gXCI0NDQ0NDQ0NDQ0NFwiIHx8IFxyXG5cdCAgICAgICAgY3BmID09IFwiNTU1NTU1NTU1NTVcIiB8fCBcclxuXHQgICAgICAgIGNwZiA9PSBcIjY2NjY2NjY2NjY2XCIgfHwgXHJcblx0ICAgICAgICBjcGYgPT0gXCI3Nzc3Nzc3Nzc3N1wiIHx8IFxyXG5cdCAgICAgICAgY3BmID09IFwiODg4ODg4ODg4ODhcIiB8fCBcclxuXHQgICAgICAgIGNwZiA9PSBcIjk5OTk5OTk5OTk5XCIpXHJcblx0ICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAgICBcclxuXHQgICAgLy8gVmFsaWRhIDFvIGRpZ2l0byBcclxuXHQgICAgdmFyIGFkZCA9IDA7ICAgIFxyXG5cdCAgICBmb3IgKHZhciBpPTA7IGkgPCA5OyBpICsrKSAgICAgICBcclxuXHQgICAgICAgIGFkZCArPSBwYXJzZUludChjcGYuY2hhckF0KGkpKSAqICgxMCAtIGkpOyAgXHJcblx0ICAgICB2YXIgcmV2ID0gMTEgLSAoYWRkICUgMTEpOyAgXHJcblx0ICAgICBpZiAocmV2ID09IDEwIHx8IHJldiA9PSAxMSkgICAgIFxyXG5cdCAgICBcdCByZXYgPSAwOyAgICBcclxuXHQgICAgIGlmIChyZXYgIT0gcGFyc2VJbnQoY3BmLmNoYXJBdCg5KSkpICAgICBcclxuXHQgICAgXHQgcmV0dXJuIGZhbHNlOyAgICAgICBcclxuXHQgICAgLy8gVmFsaWRhIDJvIGRpZ2l0byBcclxuXHQgICAgYWRkID0gMDtcclxuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSArKykgICAgICAgIFxyXG5cdCAgICAgICAgYWRkICs9IHBhcnNlSW50KGNwZi5jaGFyQXQoaSkpICogKDExIC0gaSk7ICBcclxuXHQgICAgcmV2ID0gMTEgLSAoYWRkICUgMTEpOyAgXHJcblx0ICAgIGlmIChyZXYgPT0gMTAgfHwgcmV2ID09IDExKSBcclxuXHQgICAgICAgIHJldiA9IDA7ICAgIFxyXG5cdCAgICBpZiAocmV2ICE9IHBhcnNlSW50KGNwZi5jaGFyQXQoMTApKSlcclxuXHQgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgXHJcblx0ICAgIHJldHVybiB0cnVlOyAgIFxyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLnZhbGlkYXJDbnBqID0gZnVuY3Rpb24gKGNucGopIHtcclxuXHQgICAgY25waiA9IGNucGoucmVwbGFjZSgvW15cXGRdKy9nLCcnKTtcclxuXHQgICAgXHJcblx0ICAgIGlmKGNucGogPT0gJycpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdCAgICAgXHJcblx0ICAgIGlmIChjbnBqLmxlbmd0aCAhPSAxNCkge1xyXG5cdCAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdCBcclxuXHQgICAgLy8gRWxpbWluYSBDTlBKcyBpbnZhbGlkb3MgY29uaGVjaWRvc1xyXG5cdCAgICBpZiAoY25waiA9PSBcIjAwMDAwMDAwMDAwMDAwXCIgfHwgXHJcblx0ICAgICAgICBjbnBqID09IFwiMTExMTExMTExMTExMTFcIiB8fCBcclxuXHQgICAgICAgIGNucGogPT0gXCIyMjIyMjIyMjIyMjIyMlwiIHx8IFxyXG5cdCAgICAgICAgY25waiA9PSBcIjMzMzMzMzMzMzMzMzMzXCIgfHwgXHJcblx0ICAgICAgICBjbnBqID09IFwiNDQ0NDQ0NDQ0NDQ0NDRcIiB8fCBcclxuXHQgICAgICAgIGNucGogPT0gXCI1NTU1NTU1NTU1NTU1NVwiIHx8IFxyXG5cdCAgICAgICAgY25waiA9PSBcIjY2NjY2NjY2NjY2NjY2XCIgfHwgXHJcblx0ICAgICAgICBjbnBqID09IFwiNzc3Nzc3Nzc3Nzc3NzdcIiB8fCBcclxuXHQgICAgICAgIGNucGogPT0gXCI4ODg4ODg4ODg4ODg4OFwiIHx8IFxyXG5cdCAgICAgICAgY25waiA9PSBcIjk5OTk5OTk5OTk5OTk5XCIpIHtcclxuXHQgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHQgICAgICAgICBcclxuXHQgICAgLy8gVmFsaWRhIERWc1xyXG5cdCAgICB2YXIgdGFtYW5obyA9IGNucGoubGVuZ3RoIC0gMlxyXG5cdCAgICB2YXIgbnVtZXJvcyA9IGNucGouc3Vic3RyaW5nKDAsdGFtYW5obyk7XHJcblx0ICAgIHZhciBkaWdpdG9zID0gY25wai5zdWJzdHJpbmcodGFtYW5obyk7XHJcblx0ICAgIHZhciBzb21hID0gMDtcclxuXHQgICAgdmFyIHBvcyA9IHRhbWFuaG8gLSA3O1xyXG5cdFx0XHJcblx0ICAgIGZvciAodmFyIGkgPSB0YW1hbmhvOyBpID49IDE7IGktLSkge1xyXG5cdCAgICAgIHNvbWEgKz0gbnVtZXJvcy5jaGFyQXQodGFtYW5obyAtIGkpICogcG9zLS07XHJcblx0ICAgICAgaWYgKHBvcyA8IDIpXHJcblx0ICAgICAgICAgICAgcG9zID0gOTtcclxuXHQgICAgfVxyXG5cdCAgICB2YXIgcmVzdWx0YWRvID0gc29tYSAlIDExIDwgMiA/IDAgOiAxMSAtIHNvbWEgJSAxMTtcclxuXHQgICAgaWYgKHJlc3VsdGFkbyAhPSBkaWdpdG9zLmNoYXJBdCgwKSkge1xyXG5cdCAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdCAgICAgICAgIFxyXG5cdCAgICB0YW1hbmhvID0gdGFtYW5obyArIDE7XHJcblx0ICAgIG51bWVyb3MgPSBjbnBqLnN1YnN0cmluZygwLHRhbWFuaG8pO1xyXG5cdCAgICBzb21hID0gMDtcclxuXHQgICAgcG9zID0gdGFtYW5obyAtIDc7XHJcblx0ICAgIGZvciAodmFyIGkgPSB0YW1hbmhvOyBpID49IDE7IGktLSkge1xyXG5cdCAgICAgIHNvbWEgKz0gbnVtZXJvcy5jaGFyQXQodGFtYW5obyAtIGkpICogcG9zLS07XHJcblx0ICAgICAgaWYgKHBvcyA8IDIpXHJcblx0ICAgICAgICAgICAgcG9zID0gOTtcclxuXHQgICAgfVxyXG5cdCAgICB2YXIgcmVzdWx0YWRvID0gc29tYSAlIDExIDwgMiA/IDAgOiAxMSAtIHNvbWEgJSAxMTtcclxuXHQgICAgaWYgKHJlc3VsdGFkbyAhPSBkaWdpdG9zLmNoYXJBdCgxKSkge1xyXG5cdCAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0ICAgIHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLmJ1c2NhTm9tZXNCYW5jb3MgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFx0dmFyIG5vbWVzID0gW1xyXG5cdFx0XHQnQWx2b3JhZGEgQmFuY28gZGUgSW52ZXN0aW1lbnRvJyxcclxuXHRcdFx0JzY1NCB8IEJhbmNvIEEuSi5SZW5uZXIgUy5BLicsXHJcblx0XHRcdCcyNDYgfCBCYW5jbyBBQkMgQnJhc2lsIFMuQS4nLFxyXG5cdFx0XHQnNzUgfCBCYW5jbyBBQk4gQU1STyBTLkEuJyxcclxuXHRcdFx0J0JhbmNvIEFsZmEgZGUgSW52ZXN0aW1lbnRvcyBTQScsXHJcblx0XHRcdCcyNSB8IEJhbmNvIEFsZmEgUy5BLicsXHJcblx0XHRcdCc2NDEgfCBCYW5jbyBBbHZvcmFkYSBTLkEuJyxcclxuXHRcdFx0JzY1IHwgQmFuY28gQW5kQmFuayAoQnJhc2lsKSBTLkEuJyxcclxuXHRcdFx0JzIxMyB8IEJhbmNvIEFyYmkgUy5BLicsXHJcblx0XHRcdCcxOSB8IEJhbmNvIEF6dGVjYSBkbyBCcmFzaWwgUy5BLicsXHJcblx0XHRcdCdCYW5jbyBCYW5kZWlyYW50ZXMgZGUgSW52ZXN0aW1lbnRvcyBTQScsXHJcblx0XHRcdCcyNCB8IEJhbmNvIEJBTkRFUEUgUy5BLicsXHJcblx0XHRcdCcyOSB8IEJhbmNvIEJhbmVyaiBTLkEuJyxcclxuXHRcdFx0JzAgfCBCYW5jbyBCYW5rcGFyIFMuQS4nLFxyXG5cdFx0XHQnNzQwIHwgQmFuY28gQmFyY2xheXMgUy5BLicsXHJcblx0XHRcdCcxMDcgfCBCYW5jbyBCQk0gUy5BLicsXHJcblx0XHRcdCczMSB8IEJhbmNvIEJlZyBTLkEuJyxcclxuXHRcdFx0JzEyMi04IHwgQmFuY28gQkVSSiBTLkEuJyxcclxuXHRcdFx0Jzk2IHwgQmFuY28gQk0mRkJPVkVTUEEgZGUgU2VydmnDp29zIGRlIExpcXVpZGHDp8OjbyBlIEN1c3TDs2RpYSBTLkEnLFxyXG5cdFx0XHQnMzE4IHwgQmFuY28gQk1HIFMuQS4nLFxyXG5cdFx0XHQnNzUyIHwgQmFuY28gQk5QIFBhcmliYXMgQnJhc2lsIFMuQS4nLFxyXG5cdFx0XHQnMjQ4IHwgQmFuY28gQm9hdmlzdGEgSW50ZXJhdGzDom50aWNvIFMuQS4nLFxyXG5cdFx0XHQnMjE4IHwgQmFuY28gQm9uc3VjZXNzbyBTLkEuJyxcclxuXHRcdFx0J0JhbmNvIEJQSSBJbnZlc3RpbWVudG9zIFNBJyxcclxuXHRcdFx0JzM2IHwgQmFuY28gQnJhZGVzY28gQkJJIFMuQS4nLFxyXG5cdFx0XHQnMjA0IHwgQmFuY28gQnJhZGVzY28gQ2FydMO1ZXMgUy5BLicsXHJcblx0XHRcdCczOTQgfCBCYW5jbyBCcmFkZXNjbyBGaW5hbmNpYW1lbnRvcyBTLkEuJyxcclxuXHRcdFx0JzIzNyB8IEJhbmNvIEJyYWRlc2NvIFMuQS4nLFxyXG5cdFx0XHQnMjI1IHwgQmFuY28gQnJhc2NhbiBTLkEuJyxcclxuXHRcdFx0J0JhbmNvIEJSSiBTLkEuJyxcclxuXHRcdFx0JzIwOCB8IEJhbmNvIEJURyBQYWN0dWFsIFMuQS4nLFxyXG5cdFx0XHQnNDQgfCBCYW5jbyBCVkEgUy5BLicsXHJcblx0XHRcdCcyNjMgfCBCYW5jbyBDYWNpcXVlIFMuQS4nLFxyXG5cdFx0XHQnNDczIHwgQmFuY28gQ2FpeGEgR2VyYWwgLSBCcmFzaWwgUy5BLicsXHJcblx0XHRcdCc0MTIgfCBCYW5jbyBDYXBpdGFsIFMuQS4nLFxyXG5cdFx0XHQnNDAgfCBCYW5jbyBDYXJnaWxsIFMuQS4nLFxyXG5cdFx0XHQnQmFuY28gQ2F0ZXJwaWxsYXIgUy5BLicsXHJcblx0XHRcdCcyNjYgfCBCYW5jbyBDw6lkdWxhIFMuQS4nLFxyXG5cdFx0XHQnNzM5IHwgQmFuY28gQ2V0ZWxlbSBTLkEuJyxcclxuXHRcdFx0JzIzMyB8IEJhbmNvIENpZnJhIFMuQS4nLFxyXG5cdFx0XHQnNzQ1IHwgQmFuY28gQ2l0aWJhbmsgUy5BLicsXHJcblx0XHRcdCcwIHwgQmFuY28gQ2l0aWNhcmQgUy5BLicsXHJcblx0XHRcdCcyNDEgfCBCYW5jbyBDbMOhc3NpY28gUy5BLicsXHJcblx0XHRcdCcwIHwgQmFuY28gQ05IIEluZHVzdHJpYWwgQ2FwaXRhbCBTLkEuJyxcclxuXHRcdFx0JzIxNSB8IEJhbmNvIENvbWVyY2lhbCBlIGRlIEludmVzdGltZW50byBTdWRhbWVyaXMgUy5BLicsXHJcblx0XHRcdCdCYW5jbyBDb21tZXJjaWFsIEludmVzdG1lbnQgVHJ1cyBkbyBCcmFzaWwgUy5BLicsXHJcblx0XHRcdCc5NSB8IEJhbmNvIENvbmZpZGVuY2UgZGUgQ8OibWJpbyBTLkEuJyxcclxuXHRcdFx0Jzc1NiB8IEJhbmNvIENvb3BlcmF0aXZvIGRvIEJyYXNpbCBTLkEuIC0gQkFOQ09PQicsXHJcblx0XHRcdCc3NDggfCBCYW5jbyBDb29wZXJhdGl2byBTaWNyZWRpIFMuQS4nLFxyXG5cdFx0XHQnNzIxIHwgQmFuY28gQ3JlZGliZWwgUy5BLicsXHJcblx0XHRcdCcyMjIgfCBCYW5jbyBDcmVkaXQgQWdyaWNvbGUgQnJhc2lsIFMuQS4nLFxyXG5cdFx0XHQnNTA1IHwgQmFuY28gQ3JlZGl0IFN1aXNzZSAoQnJhc2lsKSBTLkEuJyxcclxuXHRcdFx0JzIyOSB8IEJhbmNvIENydXplaXJvIGRvIFN1bCBTLkEuJyxcclxuXHRcdFx0J0JhbmNvIENTRiBTLkEuJyxcclxuXHRcdFx0JzMgfCBCYW5jbyBkYSBBbWF6w7RuaWEgUy5BLicsXHJcblx0XHRcdCcwODMtMyB8IEJhbmNvIGRhIENoaW5hIEJyYXNpbCBTLkEuJyxcclxuXHRcdFx0JzAgfCBCYW5jbyBEYWltbGVyY2hyeXNsZXIgUy5BLicsXHJcblx0XHRcdCc3MDcgfCBCYW5jbyBEYXljb3ZhbCBTLkEuJyxcclxuXHRcdFx0J0JBTkNPIERFIElOVkVTVCBURU5ERU5DSUEgUy5BLicsXHJcblx0XHRcdCdCQU5DTyBERSBJTlZFU1RJTUVOVE9TIENSRURJVCBTVUlTU0UgQlJBU0lMIFMgQSAtIENSRURJVCBTVUlTU0UnLFxyXG5cdFx0XHQnMzAwIHwgQmFuY28gZGUgTGEgTmFjaW9uIEFyZ2VudGluYScsXHJcblx0XHRcdCc0OTUgfCBCYW5jbyBkZSBMYSBQcm92aW5jaWEgZGUgQnVlbm9zIEFpcmVzJyxcclxuXHRcdFx0JzQ5NCB8IEJhbmNvIGRlIExhIFJlcHVibGljYSBPcmllbnRhbCBkZWwgVXJ1Z3VheScsXHJcblx0XHRcdCcwIHwgQmFuY28gZGUgTGFnZSBMYW5kZW4gQnJhc2lsIFMuQS4nLFxyXG5cdFx0XHQnNDU2IHwgQmFuY28gZGUgVG9reW8tTWl0c3ViaXNoaSBVRkogQnJhc2lsIFMuQS4nLFxyXG5cdFx0XHQnMjE0IHwgQmFuY28gRGliZW5zIFMuQS4nLFxyXG5cdFx0XHQnMSB8IEJhbmNvIGRvIEJyYXNpbCBTLkEuJyxcclxuXHRcdFx0JzQ3IHwgQmFuY28gZG8gRXN0YWRvIGRlIFNlcmdpcGUgUy5BLicsXHJcblx0XHRcdCczNyB8IEJhbmNvIGRvIEVzdGFkbyBkbyBQYXLDoSBTLkEuJyxcclxuXHRcdFx0JzM5IHwgQmFuY28gZG8gRXN0YWRvIGRvIFBpYXXDrSBTLkEuIC0gQkVQJyxcclxuXHRcdFx0JzQxIHwgQmFuY28gZG8gRXN0YWRvIGRvIFJpbyBHcmFuZGUgZG8gU3VsIFMuQS4nLFxyXG5cdFx0XHQnNCB8IEJhbmNvIGRvIE5vcmRlc3RlIGRvIEJyYXNpbCBTLkEuJyxcclxuXHRcdFx0JzI2NSB8IEJhbmNvIEZhdG9yIFMuQS4nLFxyXG5cdFx0XHQnMCB8IEJhbmNvIEZpYXQgUy5BLicsXHJcblx0XHRcdCcyMjQgfCBCYW5jbyBGaWJyYSBTLkEuJyxcclxuXHRcdFx0JzYyNiB8IEJhbmNvIEZpY3NhIFMuQS4nLFxyXG5cdFx0XHQnQmFuY28gRmlkaXMgUy5BLicsXHJcblx0XHRcdCdCYW5jbyBGaW5hc2EgZGUgSW52ZXN0aW1lbnRvcyBTQScsXHJcblx0XHRcdCcwIHwgQmFuY28gRm9yZCBTLkEuJyxcclxuXHRcdFx0J0JhbmNvIEdlcmHDp8OjbyBGdXR1cm8gZGUgSW52ZXN0aW1lbnRvcycsXHJcblx0XHRcdCdCYW5jbyBHZXJhZG9yIFMuQS4nLFxyXG5cdFx0XHQnNzM0IHwgQmFuY28gR2VyZGF1IFMuQS4nLFxyXG5cdFx0XHQnMCB8IEJhbmNvIEdNQUMgUy5BLicsXHJcblx0XHRcdCc2MTIgfCBCYW5jbyBHdWFuYWJhcmEgUy5BLicsXHJcblx0XHRcdCcwIHwgQmFuY28gSG9uZGEgUy5BLicsXHJcblx0XHRcdCc2MyB8IEJhbmNvIEliaSBTLkEuIEJhbmNvIE3Dumx0aXBsbycsXHJcblx0XHRcdCcwIHwgQmFuY28gSUJNIFMuQS4nLFxyXG5cdFx0XHQnNjA0IHwgQmFuY28gSW5kdXN0cmlhbCBkbyBCcmFzaWwgUy5BLicsXHJcblx0XHRcdCczMjAgfCBCYW5jbyBJbmR1c3RyaWFsIGUgQ29tZXJjaWFsIFMuQS4nLFxyXG5cdFx0XHQnNjUzIHwgQmFuY28gSW5kdXN2YWwgUy5BLicsXHJcblx0XHRcdCc2MzAgfCBCYW5jbyBJbnRlcmNhcCBTLkEuJyxcclxuXHRcdFx0Jzc3IHwgQmFuY28gSW50ZXJtZWRpdW0gUy5BLicsXHJcblx0XHRcdCcyNDkgfCBCYW5jbyBJbnZlc3RjcmVkIFVuaWJhbmNvIFMuQS4nLFxyXG5cdFx0XHQnQmFuY28gSW52ZXN0aW1lbnRvcyBCTUMgU0EnLFxyXG5cdFx0XHQnMTg0IHwgQmFuY28gSXRhw7ogQkJBIFMuQS4nLFxyXG5cdFx0XHQnNDc5IHwgQmFuY28gSXRhw7pCYW5rIFMuQScsXHJcblx0XHRcdCdCYW5jbyBJdGF1Y2FyZCBTLkEuJyxcclxuXHRcdFx0JzAgfCBCYW5jbyBJdGF1Y3JlZCBGaW5hbmNpYW1lbnRvcyBTLkEuJyxcclxuXHRcdFx0J0JhbmNvIElUQVVMRUFTSU5HIFMuQS4nLFxyXG5cdFx0XHQnMzc2IHwgQmFuY28gSi4gUC4gTW9yZ2FuIFMuQS4nLFxyXG5cdFx0XHQnNzQgfCBCYW5jbyBKLiBTYWZyYSBTLkEuJyxcclxuXHRcdFx0JzIxNyB8IEJhbmNvIEpvaG4gRGVlcmUgUy5BLicsXHJcblx0XHRcdCc3NiB8IEJhbmNvIEtEQiBTLkEuJyxcclxuXHRcdFx0Jzc1NyB8IEJhbmNvIEtFQiBkbyBCcmFzaWwgUy5BLicsXHJcblx0XHRcdCc2MDAgfCBCYW5jbyBMdXNvIEJyYXNpbGVpcm8gUy5BLicsXHJcblx0XHRcdCcyNDMgfCBCYW5jbyBNw6F4aW1hIFMuQS4nLFxyXG5cdFx0XHQnMCB8IEJhbmNvIE1heGludmVzdCBTLkEuJyxcclxuXHRcdFx0J0JBTkNPIE1FUkNBTlRJTCBERSBJTlZFU1RJTUVOVE9TIFNBJyxcclxuXHRcdFx0JzM4OSB8IEJhbmNvIE1lcmNhbnRpbCBkbyBCcmFzaWwgUy5BLicsXHJcblx0XHRcdCdCYW5jbyBNZXJjZWRlcy1CZW56IFMuQS4nLFxyXG5cdFx0XHQnMzcwIHwgQmFuY28gTWl6dWhvIGRvIEJyYXNpbCBTLkEuJyxcclxuXHRcdFx0Jzc0NiB8IEJhbmNvIE1vZGFsIFMuQS4nLFxyXG5cdFx0XHQnMCB8IEJhbmNvIE1vbmVvIFMuQS4nLFxyXG5cdFx0XHQnNzM4IHwgQmFuY28gTW9yYWRhIFMuQS4nLFxyXG5cdFx0XHQnQmFuY28gTW9yYWRhIFNBJyxcclxuXHRcdFx0JzY2IHwgQmFuY28gTW9yZ2FuIFN0YW5sZXkgUy5BLicsXHJcblx0XHRcdCc0NSB8IEJhbmNvIE9wcG9ydHVuaXR5IFMuQS4nLFxyXG5cdFx0XHQnNzkgfCBCYW5jbyBPcmlnaW5hbCBkbyBBZ3JvbmVnw7NjaW8gUy5BLicsXHJcblx0XHRcdCcyMTIgfCBCYW5jbyBPcmlnaW5hbCBTLkEuJyxcclxuXHRcdFx0J0JhbmNvIE91cmludmVzdCcsXHJcblx0XHRcdCc3MTItOSB8IEJhbmNvIE91cmludmVzdCBTLkEuJyxcclxuXHRcdFx0JzYyMyB8IEJhbmNvIFBBTiBTLkEuJyxcclxuXHRcdFx0JzYxMSB8IEJhbmNvIFBhdWxpc3RhIFMuQS4nLFxyXG5cdFx0XHQnNjEzIHwgQmFuY28gUGVjw7puaWEgUy5BLicsXHJcblx0XHRcdCcwOTQtMiB8IEJhbmNvIFBldHJhIFMuQS4nLFxyXG5cdFx0XHQnNjQzIHwgQmFuY28gUGluZSBTLkEuJyxcclxuXHRcdFx0J0JhbmNvIFBvcnRvIFJlYWwgZGUgSW52ZXN0aW1lbnRvcyBTLkEuJyxcclxuXHRcdFx0JzcyNCB8IEJhbmNvIFBvcnRvIFNlZ3VybyBTLkEuJyxcclxuXHRcdFx0JzczNSB8IEJhbmNvIFBvdHRlbmNpYWwgUy5BLicsXHJcblx0XHRcdCc2MzggfCBCYW5jbyBQcm9zcGVyIFMuQS4nLFxyXG5cdFx0XHQnMCB8IEJhbmNvIFBTQSBGaW5hbmNlIEJyYXNpbCBTLkEuJyxcclxuXHRcdFx0Jzc0NyB8IEJhbmNvIFJhYm9iYW5rIEludGVybmF0aW9uYWwgQnJhc2lsIFMuQS4nLFxyXG5cdFx0XHQnMDg4LTQgfCBCYW5jbyBSYW5kb24gUy5BLicsXHJcblx0XHRcdCczNTYgfCBCYW5jbyBSZWFsIFMuQS4nLFxyXG5cdFx0XHQnNjMzIHwgQmFuY28gUmVuZGltZW50byBTLkEuJyxcclxuXHRcdFx0Jzc0MSB8IEJhbmNvIFJpYmVpcsOjbyBQcmV0byBTLkEuJyxcclxuXHRcdFx0JzAgfCBCYW5jbyBSb2RvYmVucyBTLkEuJyxcclxuXHRcdFx0J0JhbmNvIFJ1cmFsIGRlIEludmVzdGltZW50b3MgU0EnLFxyXG5cdFx0XHQnNzIgfCBCYW5jbyBSdXJhbCBNYWlzIFMuQS4nLFxyXG5cdFx0XHQnNDUzIHwgQmFuY28gUnVyYWwgUy5BLicsXHJcblx0XHRcdCc0MjIgfCBCYW5jbyBTYWZyYSBTLkEuJyxcclxuXHRcdFx0JzMzIHwgQmFuY28gU2FudGFuZGVyIChCcmFzaWwpIFMuQS4nLFxyXG5cdFx0XHQnNzQzIHwgQmFuY28gU2VtZWFyIFMuQS4nLFxyXG5cdFx0XHQnNzQ5IHwgQmFuY28gU2ltcGxlcyBTLkEuJyxcclxuXHRcdFx0JzM2NiB8IEJhbmNvIFNvY2nDqXTDqSBHw6luw6lyYWxlIEJyYXNpbCBTLkEuJyxcclxuXHRcdFx0JzYzNyB8IEJhbmNvIFNvZmlzYSBTLkEuJyxcclxuXHRcdFx0JzEyIHwgQmFuY28gU3RhbmRhcmQgZGUgSW52ZXN0aW1lbnRvcyBTLkEuJyxcclxuXHRcdFx0J0JhbmNvIFN1ZGFtZXJpcyBJbnZlc3RpbWVudG8gU0EnLFxyXG5cdFx0XHQnNDY0IHwgQmFuY28gU3VtaXRvbW8gTWl0c3VpIEJyYXNpbGVpcm8gUy5BLicsXHJcblx0XHRcdCcwODItNSB8IEJhbmNvIFRvcMOhemlvIFMuQS4nLFxyXG5cdFx0XHQnMCB8IEJhbmNvIFRveW90YSBkbyBCcmFzaWwgUy5BLicsXHJcblx0XHRcdCc2MzQgfCBCYW5jbyBUcmnDom5ndWxvIFMuQS4nLFxyXG5cdFx0XHQnMTggfCBCYW5jbyBUcmljdXJ5IFMuQS4nLFxyXG5cdFx0XHQnMCB8IEJhbmNvIFZvbGtzd2FnZW4gUy5BLicsXHJcblx0XHRcdCcwIHwgQmFuY28gVm9sdm8gKEJyYXNpbCkgUy5BLicsXHJcblx0XHRcdCc2NTUgfCBCYW5jbyBWb3RvcmFudGltIFMuQS4nLFxyXG5cdFx0XHQnNjEwIHwgQmFuY28gVlIgUy5BLicsXHJcblx0XHRcdCcxMTkgfCBCYW5jbyBXZXN0ZXJuIFVuaW9uIGRvIEJyYXNpbCBTLkEuJyxcclxuXHRcdFx0J0JhbmNvIFdvb3JpIEJhbmsgZG8gQnJhc2lsIFMuQS4nLFxyXG5cdFx0XHQnQmFuY28gWWFtYWhhIE1vdG9yIFMuQS4nLFxyXG5cdFx0XHQnMjEgfCBCQU5FU1RFUyBTLkEuIEJhbmNvIGRvIEVzdGFkbyBkbyBFc3DDrXJpdG8gU2FudG8nLFxyXG5cdFx0XHQnQmFuaWYgQnJhc2lsIEJJIFNBJyxcclxuXHRcdFx0JzcxOSB8IEJhbmlmLUJhbmNvIEludGVybmFjaW9uYWwgZG8gRnVuY2hhbCAoQnJhc2lsKVMuQS4nLFxyXG5cdFx0XHQnNzU1IHwgQmFuayBvZiBBbWVyaWNhIE1lcnJpbGwgTHluY2ggQmFuY28gTcO6bHRpcGxvIFMuQS4nLFxyXG5cdFx0XHQnNzQ0IHwgQmFua0Jvc3RvbiBOLkEuJyxcclxuXHRcdFx0J0JCIEJBTkNPIERFIElOVkVTVElNRU5UTyBTIEEgLSBCQicsXHJcblx0XHRcdCc3MyB8IEJCIEJhbmNvIFBvcHVsYXIgZG8gQnJhc2lsIFMuQS4nLFxyXG5cdFx0XHQnMDgxLTcgfCBCQk4gQmFuY28gQnJhc2lsZWlybyBkZSBOZWfDs2Npb3MgUy5BLicsXHJcblx0XHRcdCcyNTAgfCBCQ1YgLSBCYW5jbyBkZSBDcsOpZGl0byBlIFZhcmVqbyBTLkEuJyxcclxuXHRcdFx0Jzc4IHwgQkVTIEludmVzdGltZW50byBkbyBCcmFzaWwgUy5BLi1CYW5jbyBkZSBJbnZlc3RpbWVudG8nLFxyXG5cdFx0XHQnQk1XIEZpbmFuY2VpcmEnLFxyXG5cdFx0XHQnQk5ZIE1lbGxvbiBCYW5jbyBTLkEuJyxcclxuXHRcdFx0JzY5IHwgQlBOIEJyYXNpbCBCYW5jbyBNw7psdGlwbG8gUy5BLicsXHJcblx0XHRcdCdCUiBQQVJUTkVSUyBCQU5DTyBERSBJTlZFU1RJTUVOVE8gUyBBJyxcclxuXHRcdFx0JzEyNSB8IEJyYXNpbCBQbHVyYWwgUy5BLiAtIEJhbmNvIE3Dumx0aXBsbycsXHJcblx0XHRcdCc3MCB8IEJSQiAtIEJhbmNvIGRlIEJyYXPDrWxpYSBTLkEuJyxcclxuXHRcdFx0J0JSQiAtIENyw6lkaXRvJyxcclxuXHRcdFx0JzA5Mi0yIHwgQnJpY2tlbGwgUy5BLiBDcsOpZGl0bycsXHJcblx0XHRcdCdCViBGaW5hbmNlaXJhIFMuQS4gLSBDRkknLFxyXG5cdFx0XHQnMTA0IHwgQ2FpeGEgRWNvbsO0bWljYSBGZWRlcmFsJyxcclxuXHRcdFx0JzExNC03IHwgQ2VudHJhbCBkYXMgQ29vcC4gZGUgRWNvbm9taWEgZSBDcsOpZGl0byBNdXR1byBkbyBFc3QuIGRvIEVTJyxcclxuXHRcdFx0JzQ3NyB8IENpdGliYW5rIFMuQS4nLFxyXG5cdFx0XHQnQ29tcGFuaGlhIGRlIENyw6lkaXRvJyxcclxuXHRcdFx0JzEzNiB8IENPTkZFREVSQUNBTyBOQUNJT05BTCBEQVMgQ09PUEVSQVRJVkFTIENFTlRSQUlTIFVOSUNSRURTJyxcclxuXHRcdFx0JzA5Ny0zIHwgQ29vcGVyYXRpdmEgQ2VudHJhbCBkZSBDcsOpZGl0byBOb3JvZXN0ZSBCcmFzaWxlaXJvIEx0ZGEuJyxcclxuXHRcdFx0JzA4NS14IHwgQ29vcGVyYXRpdmEgQ2VudHJhbCBkZSBDcsOpZGl0byBVcmJhbm8tQ0VDUkVEJyxcclxuXHRcdFx0JzA5OS14IHwgQ29vcGVyYXRpdmEgQ2VudHJhbCBkZSBFY29ub21pYSBlIENyZWRpdG8gTXV0dW8gZGFzIFVuaWNyZWRzJyxcclxuXHRcdFx0JzA5MC0yIHwgQ29vcGVyYXRpdmEgQ2VudHJhbCBkZSBFY29ub21pYSBlIENyw6lkaXRvIE11dHVvIGRhcyBVbmljcmVkcycsXHJcblx0XHRcdCcwODktMiB8IENvb3BlcmF0aXZhIGRlIENyw6lkaXRvIFJ1cmFsIGRhIFJlZ2nDo28gZGUgTW9naWFuYScsXHJcblx0XHRcdCcwODctNiB8IENvb3BlcmF0aXZhIFVuaWNyZWQgQ2VudHJhbCBTYW50YSBDYXRhcmluYScsXHJcblx0XHRcdCcwOTgtMSB8IENSRURJQUxJQU7Dh0EgQ09PUEVSQVRJVkEgREUgQ1LDiURJVE8gUlVSQUwnLFxyXG5cdFx0XHQnNDg3IHwgRGV1dHNjaGUgQmFuayBTLkEuIC0gQmFuY28gQWxlbcOjbycsXHJcblx0XHRcdCdGaW5hbWF4IFMvQSBDLiBGLiBJLicsXHJcblx0XHRcdCc2NCB8IEdvbGRtYW4gU2FjaHMgZG8gQnJhc2lsIEJhbmNvIE3Dumx0aXBsbyBTLkEuJyxcclxuXHRcdFx0JzYyIHwgSGlwZXJjYXJkIEJhbmNvIE3Dumx0aXBsbyBTLkEuJyxcclxuXHRcdFx0JzM5OSB8IEhTQkMgQmFuayBCcmFzaWwgUy5BLiAtIEJhbmNvIE3Dumx0aXBsbycsXHJcblx0XHRcdCcxNjggfCBIU0JDIEZpbmFuY2UgKEJyYXNpbCkgUy5BLiAtIEJhbmNvIE3Dumx0aXBsbycsXHJcblx0XHRcdCdJQ0JDIERPIEJSQVNJTCBCQU5DTyBNVUxUSVBMTyBTIEEgLSBJQ0JDIERPIEJSQVNJTCcsXHJcblx0XHRcdCc0OTIgfCBJTkcgQmFuayBOLlYuJyxcclxuXHRcdFx0JzY1MiB8IEl0YcO6IFVuaWJhbmNvIEhvbGRpbmcgUy5BLicsXHJcblx0XHRcdCczNDEgfCBJdGHDuiBVbmliYW5jbyBTLkEuJyxcclxuXHRcdFx0J0ouIE1hbHVjZWxsaScsXHJcblx0XHRcdCc0ODggfCBKUE1vcmdhbiBDaGFzZSBCYW5rJyxcclxuXHRcdFx0JzE0IHwgTmF0aXhpcyBCcmFzaWwgUy5BLiBCYW5jbyBNw7psdGlwbG8nLFxyXG5cdFx0XHQnNzUzIHwgTkJDIEJhbmsgQnJhc2lsIFMuQS4gLSBCYW5jbyBNw7psdGlwbG8nLFxyXG5cdFx0XHQnMDg2LTggfCBPQk9FIENyw6lkaXRvIEZpbmFuY2lhbWVudG8gZSBJbnZlc3RpbWVudG8gUy5BLicsXHJcblx0XHRcdCdPbW5pIFNBIENyw6lkaXRvIEZpbmFuY2lhbWVudG8gSW52ZXN0aW1lbnRvJyxcclxuXHRcdFx0JzI1NCB8IFBhcmFuw6EgQmFuY28gUy5BLicsXHJcblx0XHRcdCdTYW50YW5hIFMuQS4gQ3LDqWRpdG8nLFxyXG5cdFx0XHQnU2NhbmlhIEJhbmNvIFMuQS4nLFxyXG5cdFx0XHQnNzUxIHwgU2NvdGlhYmFuayBCcmFzaWwgUy5BLiBCYW5jbyBNw7psdGlwbG8nLFxyXG5cdFx0XHQnU3RhbmRhcmQgQ2hhcnRlcmVkIEJhbmsgKEJyYXNpbCkgUy9B4oCTQmNvIEludmVzdC4nLFxyXG5cdFx0XHQnU3VsIEZpbmFuY2VpcmEgUy9BIC0gQ3LDqWRpdG8nLFxyXG5cdFx0XHQnVUFNIC0gQXNzZXNzb3JpYSBlIEdlc3TDo28nLFxyXG5cdFx0XHQnVUJTIEJyYXNpbCBCYW5jbyBkZSBJbnZlc3RpbWVudG8gUy5BLicsXHJcblx0XHRcdCc0MDkgfCBVTklCQU5DTyAtIFVuacOjbyBkZSBCYW5jb3MgQnJhc2lsZWlyb3MgUy5BLicsXHJcblx0XHRcdCcyMzAgfCBVbmljYXJkIEJhbmNvIE3Dumx0aXBsbyBTLkEuJyxcclxuXHRcdFx0JzA5MS00IHwgVW5pY3JlZCBDZW50cmFsIGRvIFJpbyBHcmFuZGUgZG8gU3VsJ1xyXG5cdFx0XHRdO1xyXG5cdFx0cmV0dXJuIG5vbWVzO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gc2VydmljZTtcclxufV0pOyIsIid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIEF1dGhlbnRpY2F0aW9uQXBwID0gYW5ndWxhci5tb2R1bGUoJ0F1dGhlbnRpY2F0aW9uJykuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgW1xyXG5cdCckc2NvcGUnLFxyXG5cdCckcm9vdFNjb3BlJyxcclxuXHQnJGxvY2F0aW9uJyxcclxuXHQnJGh0dHAnLFxyXG5cdCdBdXRoZW50aWNhdGlvblNlcnZpY2UnLFxyXG5cdCdBdXRoZW50aWNhdGlvblJlcG9zaXRvcnknLFxyXG5cdCdTdG9yYWdlU2VydmljZScsXHJcblx0J05ldHdvcmtTZXJ2aWNlJyxcclxuXHQnU2luY3Jvbml6YWNhb1NlcnZpY2UnLFxyXG5cdCdibG9ja1VJJyxcclxuXHRjb25zdHJ1Y3RvclxyXG5dKVxyXG5cclxuZnVuY3Rpb24gY29uc3RydWN0b3IoJHNjb3BlLFxyXG5cdFx0JHJvb3RTY29wZSxcclxuXHRcdCRsb2NhdGlvbixcclxuXHRcdCRodHRwLFxyXG5cdFx0QXV0aGVudGljYXRpb25TZXJ2aWNlLFxyXG5cdFx0QXV0aGVudGljYXRpb25SZXBvc2l0b3J5LFxyXG5cdFx0U3RvcmFnZVNlcnZpY2UsXHJcblx0XHROZXR3b3JrU2VydmljZSxcclxuXHRcdFNpbmNyb25pemFjYW9TZXJ2aWNlLFxyXG5cdFx0YmxvY2tVSSkge1xyXG5cclxuXHRBdXRoZW50aWNhdGlvblNlcnZpY2UuQ2xlYXJDcmVkZW50aWFscygpO1xyXG5cclxuXHQkc2NvcGUucmVtZW1iZXJNb2RlbCA9IHtcclxuXHRcdHZhbHVlIDogQXV0aGVudGljYXRpb25TZXJ2aWNlLmdldFBhc3N3b3JkUmVtZW1iZXIoKVxyXG5cdH07XHJcblx0XHJcblx0dmFyIGNyZWRlbnRpYWxzID0gbnVsbDtcclxuXHJcblx0aWYoJHNjb3BlLnJlbWVtYmVyTW9kZWwudmFsdWUpIHtcclxuXHRcdGNyZWRlbnRpYWxzID0gQXV0aGVudGljYXRpb25TZXJ2aWNlLmdldENyZWRlbnRpYWxzUmVtZW1iZXIoKTtcclxuXHRcdGlmKGNyZWRlbnRpYWxzKSB7XHJcblx0XHRcdCRzY29wZS5sb2dpbiA9IGNyZWRlbnRpYWxzLnVzZXIubG9naW47XHJcblx0XHRcdCRzY29wZS5zZW5oYSA9IEF1dGhlbnRpY2F0aW9uU2VydmljZS5nZXRQYXNzd29yZChjcmVkZW50aWFscy5hdXRoZGF0YSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuZG9Mb2dpbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0bGV0IGxvZ2luID0gJHNjb3BlLmxvZ2luXHJcblx0XHRsZXQgc2VuaGEgPSAkc2NvcGUuc2VuaGFcclxuXHRcdC8vVmVyaWZpY2FyIHNlIGUgY2VsdWxhclxyXG5cdFx0aWYgKE5ldHdvcmtTZXJ2aWNlLmlzTW9iaWxlKCkpIHtcclxuXHRcdFx0aWYoTmV0d29ya1NlcnZpY2UuaXNPbmxpbmUoKSA9PSBORVRXT1JLX1NUQVRVUy5PTkxJTkUpIHtcclxuXHRcdFx0XHRibG9ja1VJLnN0YXJ0KCdTaW5jcm9uaXphbmRvIGRhZG9zLCBBZ3VhcmRlLi4uJylcclxuXHRcdFx0XHRTaW5jcm9uaXphY2FvU2VydmljZS5zaW5jcm9uaXphKGxvZ2luLCBBdXRoZW50aWNhdGlvblNlcnZpY2UuZ2V0UGFzc3dvcmRFbmNvZGVkKHNlbmhhKSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdGlmKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0XHRcdGxldCB1c3VhcmlvTG9jYWwgPSBTdG9yYWdlU2VydmljZS5nZXRMb2dpblVzdWFyaW8obG9naW4sIEF1dGhlbnRpY2F0aW9uU2VydmljZS5nZXRQYXNzd29yZEVuY29kZWQoc2VuaGEpKVxyXG5cdFx0XHRcdFx0XHRpZih1c3VhcmlvTG9jYWwpIHtcclxuXHRcdFx0XHRcdFx0XHRibG9ja1VJLnN0b3AoKVxyXG5cdFx0XHRcdFx0XHRcdEF1dGhlbnRpY2F0aW9uU2VydmljZS5TZXRDcmVkZW50aWFscygkc2NvcGUuc2VuaGEsICRzY29wZS5yZW1lbWJlck1vZGVsLnZhbHVlLCB1c3VhcmlvTG9jYWwpO1xyXG5cdFx0XHRcdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvZGFzaGJvYXJkJylcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRibG9ja1VJLnN0b3AoKVxyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5tZW5zYWdlbSA9IFwiQXV0ZW50aWNhw6fDo28gaW52w6FsaWRhXCI7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGJsb2NrVUkuc3RvcCgpXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdlcnJvIG5hIHNpbmNyb25pemHDp8OjbycpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgaWREYiA9IFN0b3JhZ2VTZXJ2aWNlLmdldElkZW50aWZpY2Fkb3JCYW5jb0RhZG9zKClcclxuXHRcdFx0XHRpZihpZERiICYmIGlkRGIgPT09IERBVEFCQVNFLklEKSB7XHJcblx0XHRcdFx0XHRsZXQgdXN1YXJpb0xvY2FsID0gU3RvcmFnZVNlcnZpY2UuZ2V0TG9naW5Vc3VhcmlvKGxvZ2luLCBBdXRoZW50aWNhdGlvblNlcnZpY2UuZ2V0UGFzc3dvcmRFbmNvZGVkKHNlbmhhKSlcclxuXHRcdFx0XHRcdGlmKHVzdWFyaW9Mb2NhbCkge1xyXG5cdFx0XHRcdFx0XHRBdXRoZW50aWNhdGlvblNlcnZpY2UuU2V0Q3JlZGVudGlhbHMoJHNjb3BlLnNlbmhhLCAkc2NvcGUucmVtZW1iZXJNb2RlbC52YWx1ZSwgdXN1YXJpb0xvY2FsKTtcclxuXHRcdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9kYXNoYm9hcmQnKVxyXG5cdFx0XHRcdFx0XHRsZXQgZHRBdHVhbGl6YWNhbyA9IFN0b3JhZ2VTZXJ2aWNlLmdldERhdGFTaW5jcm9uaXphY2FvKClcclxuXHRcdFx0XHRcdFx0YWxlcnQoJ1ZvY8OqIGVzdMOhIG9wZXJhbmRvIG9mZmxpbmUgbm8gbW9tZW50by4gRGF0YSDDumx0aW1hIHNpbmNyb25pemHDp8OjbzogJyArIG1vbWVudChkdEF0dWFsaXphY2FvKS5mb3JtYXQoJ2RkZGQsIEREL00vWVlZWScpKVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLm1lbnNhZ2VtID0gXCJBdXRlbnRpY2HDp8OjbyBpbnbDoWxpZGFcIjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0YWxlcnQoXCLDiSBuZWNlc3PDoXJpbyBlZmV0dWFyIGEgc2luY3Jvbml6YcOnw6NvIGNvbSBvIHNlcnZpZG9yIGFudGVzIGRlIHVzYXIgbyBhcGxpY2F0aXZvLlwiKVxyXG5cdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRBdXRoZW50aWNhdGlvblNlcnZpY2UuTG9naW4oJHNjb3BlLmxvZ2luLCBBdXRoZW50aWNhdGlvblNlcnZpY2UuZ2V0UGFzc3dvcmRFbmNvZGVkKCRzY29wZS5zZW5oYSksIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0aWYgKHJlc3BvbnNlICE9IFwiXCIpIHtcclxuXHRcdFx0XHRcdEF1dGhlbnRpY2F0aW9uU2VydmljZS5TZXRDcmVkZW50aWFscygkc2NvcGUuc2VuaGEsICRzY29wZS5yZW1lbWJlck1vZGVsLnZhbHVlLCByZXNwb25zZSk7XHJcblx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2Rhc2hib2FyZCcpXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdCRzY29wZS5tZW5zYWdlbSA9IFwiQXV0ZW50aWNhw6fDo28gaW52w6FsaWRhXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbkF1dGhlbnRpY2F0aW9uQXBwLmRpcmVjdGl2ZSgncmVzdHJpY3QnLCBmdW5jdGlvbihBdXRoZW50aWNhdGlvblNlcnZpY2Upe1xyXG5cdHJldHVybntcclxuXHRcdHJlc3RyaWN0OiAnQScsXHJcblx0XHRwcmlvcmlyeTogMTAwMDAwLFxyXG5cdFx0c2NvcGU6IGZhbHNlLFxyXG5cdFx0bGluazogZnVuY3Rpb24oKXtcclxuXHRcdH0sXHJcblx0XHRjb21waWxlOiAgZnVuY3Rpb24oZWxlbWVudCwgYXR0ciwgbGlua2VyKXtcclxuXHRcdFx0dmFyIGFjY2Vzc0RlbmllZCA9IHRydWU7XHJcblx0XHRcdHZhciB1c2VyID0gQXV0aGVudGljYXRpb25TZXJ2aWNlLmdldFVzdWFyaW8oKTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gYXR0ci5hY2Nlc3Muc3BsaXQoXCIgXCIpO1xyXG5cdFx0XHRmb3IodmFyIGkgaW4gYXR0cmlidXRlcyl7XHJcblx0XHRcdFx0aWYodXNlci5wZXJmaWwubm9tZSA9PT0gYXR0cmlidXRlc1tpXSl7XHJcblx0XHRcdFx0XHRhY2Nlc3NEZW5pZWQgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoYWNjZXNzRGVuaWVkKXtcclxuXHRcdFx0XHRlbGVtZW50LmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcblx0XHRcdFx0ZWxlbWVudC5yZW1vdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSk7XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ0F1dGhlbnRpY2F0aW9uJylcclxuXHJcbi5mYWN0b3J5KCdBdXRoZW50aWNhdGlvblJlcG9zaXRvcnknLCBbJ0Jhc2U2NCcsICckaHR0cCcsICckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgJ0RhdGFiYXNlU2VydmljZScsIGNvbnN0cnVjdG9yXSlcclxuXHJcbmZ1bmN0aW9uIGNvbnN0cnVjdG9yKEJhc2U2NCwgJGh0dHAsICRyb290U2NvcGUsICR0aW1lb3V0LCBEYXRhYmFzZVNlcnZpY2UpIHtcclxuXHR2YXIgc2VydmljZSA9IHt9O1xyXG5cclxuXHRzZXJ2aWNlLmRvTG9naW4gPSBmdW5jdGlvbihsb2dpbiwgcGFzc3dvcmRFbmNvZGVkLCBjYWxsYmFjaykge1xyXG5cdFx0RGF0YWJhc2VTZXJ2aWNlLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHVzdWFyaW9zIFdIRVJFIGxvZ2luID0gJyArIGxvZ2luICsgJyBhbmQgJyArICcgc2VuaGEgPSAnICsgcGFzc3dvcmRFbmNvZGVkICsgJzsnLCBcclxuXHRcdGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGNhbGxiYWNrKHJlc3BvbnNlKVxyXG5cdFx0fSlcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdBdXRoZW50aWNhdGlvbicpXHJcblxyXG4uZmFjdG9yeSgnQXV0aGVudGljYXRpb25TZXJ2aWNlJywgWydCYXNlNjQnLCAnJGh0dHAnLCAnJHJvb3RTY29wZScsICckdGltZW91dCcsICdTdG9yYWdlU2VydmljZScsICdOZXR3b3JrU2VydmljZScsICdOb3RpZmljYXRpb25TZXJ2aWNlJyxcclxuXHRmdW5jdGlvbihCYXNlNjQsICRodHRwLCAkcm9vdFNjb3BlLCAkdGltZW91dCwgU3RvcmFnZVNlcnZpY2UsIE5ldHdvcmtTZXJ2aWNlLCBOb3RpZmljYXRpb25TZXJ2aWNlKSB7XHJcblx0XHR2YXIgc2VydmljZSA9IHt9O1xyXG5cdFx0XHJcblx0XHRzZXJ2aWNlLkNsZWFyQ3JlZGVudGlhbHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0JHJvb3RTY29wZS5nbG9iYWxzID0ge307XHJcblx0XHRcdGlmKCFTdG9yYWdlU2VydmljZS5nZXRQYXNzd29yZFJlbWVtYmVyKCkpIHtcclxuXHRcdFx0XHRTdG9yYWdlU2VydmljZS5jbGVhclVzdWFyaW9Mb2dhZG8oKTtcdFxyXG5cdFx0XHR9XHJcblx0XHRcdCRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJztcclxuXHRcdFx0c2VydmljZS51c3VhcmlvID0gdW5kZWZpbmVkXHJcblx0XHR9O1xyXG5cclxuXHRcdHNlcnZpY2UuTG9naW4gPSAoX2xvZ2luLCBfc2VuaGEsIGNhbGxiYWNrKSA9PiB7XHJcblx0XHRcdGNvbnN0IF9sb2dpblBhcmFtID0ge1xyXG5cdFx0XHRcdGxvZ2luOiBfbG9naW4sXHJcblx0XHRcdFx0c2VuaGE6IF9zZW5oYVxyXG5cdFx0XHR9XHJcblx0XHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBQb3N0KCcvZG9Mb2dpbi8nLCBfbG9naW5QYXJhbSwgKHJlc3VsdCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soZGF0YSlcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGVmZXR1YXIgbyBsb2dpbicsIGRhdGEpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdGYWxoYSBkZSBjb211bmljYcOnw6NvIGNvbSBvIHNlcnZpZG9yJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdHNlcnZpY2UuU2V0Q3JlZGVudGlhbHMgPSBmdW5jdGlvbihzZW5oYSwgcmVtZW1iZXIsIHVzdWFyaW8pIHtcclxuXHRcdFx0dmFyIGF1dGhkYXRhID0gQmFzZTY0LmVuY29kZShzZW5oYSlcclxuXHRcdFx0U3RvcmFnZVNlcnZpY2UucmVzZXRGaWx0cm9BdGl2bygpXHJcblx0XHRcdFN0b3JhZ2VTZXJ2aWNlLnJlc2V0RmlsdHJvUGVkaWRvQXRpdm8oKVxyXG5cdFx0XHRzZXJ2aWNlLnVzdWFyaW8gPSB1c3VhcmlvO1xyXG5cclxuXHRcdFx0JHJvb3RTY29wZS5nbG9iYWxzID0ge1xyXG5cdFx0XHRcdGN1cnJlbnRVc2VyOiB7XHJcblx0XHRcdFx0XHRhdXRoZGF0YTogYXV0aGRhdGEsXHJcblx0XHRcdFx0XHR1c2VyIDogdXN1YXJpb1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdCRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBdXRob3JpemF0aW9uJ10gPSAnQmFzaWMgJyArIGF1dGhkYXRhOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcclxuXHRcdFx0dmFyIGRhdGFGaW5hbCA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdGRhdGFGaW5hbC5zZXREYXRlKGRhdGFGaW5hbC5nZXREYXRlKCkgKyAzMCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZihyZW1lbWJlcikge1xyXG5cdFx0XHRcdFN0b3JhZ2VTZXJ2aWNlLnNldFBhc3N3b3JkUmVtZW1iZXIodHJ1ZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0U3RvcmFnZVNlcnZpY2Uuc2V0UGFzc3dvcmRSZW1lbWJlcihmYWxzZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdFN0b3JhZ2VTZXJ2aWNlLnNldFVzdWFyaW9Mb2dhZG8oYXV0aGRhdGEsIHVzdWFyaW8pO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0c2VydmljZS5nZXRVc3VhcmlvID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBzZXJ2aWNlLnVzdWFyaW87XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHNlcnZpY2Uuc2V0VXN1YXJpbyA9IGZ1bmN0aW9uKHVzdWFyaW8pIHtcclxuXHRcdFx0cmV0dXJuIHNlcnZpY2UudXN1YXJpbyA9IHVzdWFyaW87XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHNlcnZpY2UuaXNBZG1pbmlzdHJhZG9yID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmKCFzZXJ2aWNlLnVzdWFyaW8pIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihzZXJ2aWNlLnVzdWFyaW8ucGVyZmlsLmlkID09PSAyKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzZXJ2aWNlLmlzTWFzdGVyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmKCFzZXJ2aWNlLnVzdWFyaW8pIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihzZXJ2aWNlLnVzdWFyaW8ucGVyZmlsLmlkID09PSAyKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzZXJ2aWNlLmlzVmVuZGVkb3IgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoIXNlcnZpY2UudXN1YXJpbykge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHNlcnZpY2UudXN1YXJpby5wZXJmaWwuaWQgPT09IDEpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHNlcnZpY2UuZ2V0UGFzc3dvcmRSZW1lbWJlciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gU3RvcmFnZVNlcnZpY2UuZ2V0UGFzc3dvcmRSZW1lbWJlcigpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzZXJ2aWNlLmdldENyZWRlbnRpYWxzUmVtZW1iZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIFN0b3JhZ2VTZXJ2aWNlLmdldFVzdWFyaW9Mb2dhZG8oKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c2VydmljZS5nZXRQYXNzd29yZCA9IGZ1bmN0aW9uKGF1dGhkYXRhKSB7XHJcblx0XHRcdHJldHVybiBCYXNlNjQuZGVjb2RlKGF1dGhkYXRhKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c2VydmljZS5nZXRQYXNzd29yZEVuY29kZWQgPSBmdW5jdGlvbihwYXNzd29yZCkge1xyXG5cdFx0XHRyZXR1cm4gQmFzZTY0LmVuY29kZShwYXNzd29yZCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHNlcnZpY2UuZ2V0Tm9tZVVzdWFyaW8gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoc2VydmljZS51c3VhcmlvKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlcnZpY2UudXN1YXJpby5ub21lXHRcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcIlwiXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gc2VydmljZTtcclxuXHR9XHJcblx0XSlcclxuXHJcblx0LmZhY3RvcnkoJ0Jhc2U2NCcsIGZ1bmN0aW9uKCkge1xyXG5cdC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cclxuXHJcblx0dmFyIGtleVN0ciA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRlbmNvZGU6IGZ1bmN0aW9uKGlucHV0KSB7XHJcblx0XHRcdHZhciBvdXRwdXQgPSBcIlwiO1xyXG5cdFx0XHR2YXIgY2hyMSwgY2hyMiwgY2hyMyA9IFwiXCI7XHJcblx0XHRcdHZhciBlbmMxLCBlbmMyLCBlbmMzLCBlbmM0ID0gXCJcIjtcclxuXHRcdFx0dmFyIGkgPSAwO1xyXG5cclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdGNocjEgPSBpbnB1dC5jaGFyQ29kZUF0KGkrKyk7XHJcblx0XHRcdFx0Y2hyMiA9IGlucHV0LmNoYXJDb2RlQXQoaSsrKTtcclxuXHRcdFx0XHRjaHIzID0gaW5wdXQuY2hhckNvZGVBdChpKyspO1xyXG5cclxuXHRcdFx0XHRlbmMxID0gY2hyMSA+PiAyO1xyXG5cdFx0XHRcdGVuYzIgPSAoKGNocjEgJiAzKSA8PCA0KSB8IChjaHIyID4+IDQpO1xyXG5cdFx0XHRcdGVuYzMgPSAoKGNocjIgJiAxNSkgPDwgMikgfCAoY2hyMyA+PiA2KTtcclxuXHRcdFx0XHRlbmM0ID0gY2hyMyAmIDYzO1xyXG5cclxuXHRcdFx0XHRpZiAoaXNOYU4oY2hyMikpIHtcclxuXHRcdFx0XHRcdGVuYzMgPSBlbmM0ID0gNjQ7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChpc05hTihjaHIzKSkge1xyXG5cdFx0XHRcdFx0ZW5jNCA9IDY0O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0b3V0cHV0ID0gb3V0cHV0ICtcclxuXHRcdFx0XHRcdGtleVN0ci5jaGFyQXQoZW5jMSkgK1xyXG5cdFx0XHRcdFx0a2V5U3RyLmNoYXJBdChlbmMyKSArXHJcblx0XHRcdFx0XHRrZXlTdHIuY2hhckF0KGVuYzMpICtcclxuXHRcdFx0XHRcdGtleVN0ci5jaGFyQXQoZW5jNCk7XHJcblx0XHRcdFx0Y2hyMSA9IGNocjIgPSBjaHIzID0gXCJcIjtcclxuXHRcdFx0XHRlbmMxID0gZW5jMiA9IGVuYzMgPSBlbmM0ID0gXCJcIjtcclxuXHRcdFx0fSB3aGlsZSAoaSA8IGlucHV0Lmxlbmd0aCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdFx0fSxcclxuXHJcblx0XHRkZWNvZGU6IGZ1bmN0aW9uKGlucHV0KSB7XHJcblx0XHRcdHZhciBvdXRwdXQgPSBcIlwiO1xyXG5cdFx0XHR2YXIgY2hyMSwgY2hyMiwgY2hyMyA9IFwiXCI7XHJcblx0XHRcdHZhciBlbmMxLCBlbmMyLCBlbmMzLCBlbmM0ID0gXCJcIjtcclxuXHRcdFx0dmFyIGkgPSAwO1xyXG5cclxuXHRcdFx0Ly8gcmVtb3ZlIGFsbCBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBBLVosIGEteiwgMC05LCArLCAvLCBvciA9XHJcblx0XHRcdHZhciBiYXNlNjR0ZXN0ID0gL1teQS1aYS16MC05XFwrXFwvXFw9XS9nO1xyXG5cdFx0XHRpZiAoYmFzZTY0dGVzdC5leGVjKGlucHV0KSkge1xyXG5cdFx0XHRcdHdpbmRvdy5hbGVydChcIlRoZXJlIHdlcmUgaW52YWxpZCBiYXNlNjQgY2hhcmFjdGVycyBpbiB0aGUgaW5wdXQgdGV4dC5cXG5cIiArXHJcblx0XHRcdFx0XHRcIlZhbGlkIGJhc2U2NCBjaGFyYWN0ZXJzIGFyZSBBLVosIGEteiwgMC05LCAnKycsICcvJyxhbmQgJz0nXFxuXCIgK1xyXG5cdFx0XHRcdFx0XCJFeHBlY3QgZXJyb3JzIGluIGRlY29kaW5nLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXFw9XS9nLCBcIlwiKTtcclxuXHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHRlbmMxID0ga2V5U3RyLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xyXG5cdFx0XHRcdGVuYzIgPSBrZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XHJcblx0XHRcdFx0ZW5jMyA9IGtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcclxuXHRcdFx0XHRlbmM0ID0ga2V5U3RyLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xyXG5cclxuXHRcdFx0XHRjaHIxID0gKGVuYzEgPDwgMikgfCAoZW5jMiA+PiA0KTtcclxuXHRcdFx0XHRjaHIyID0gKChlbmMyICYgMTUpIDw8IDQpIHwgKGVuYzMgPj4gMik7XHJcblx0XHRcdFx0Y2hyMyA9ICgoZW5jMyAmIDMpIDw8IDYpIHwgZW5jNDtcclxuXHJcblx0XHRcdFx0b3V0cHV0ID0gb3V0cHV0ICsgU3RyaW5nLmZyb21DaGFyQ29kZShjaHIxKTtcclxuXHJcblx0XHRcdFx0aWYgKGVuYzMgIT0gNjQpIHtcclxuXHRcdFx0XHRcdG91dHB1dCA9IG91dHB1dCArIFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyMik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChlbmM0ICE9IDY0KSB7XHJcblx0XHRcdFx0XHRvdXRwdXQgPSBvdXRwdXQgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y2hyMSA9IGNocjIgPSBjaHIzID0gXCJcIjtcclxuXHRcdFx0XHRlbmMxID0gZW5jMiA9IGVuYzMgPSBlbmM0ID0gXCJcIjtcclxuXHJcblx0XHRcdH0gd2hpbGUgKGkgPCBpbnB1dC5sZW5ndGgpO1xyXG5cclxuXHRcdFx0cmV0dXJuIG91dHB1dDtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xpZW50ZU1vZHVsbyA9IGFuZ3VsYXIubW9kdWxlKCdjbGllbnRlLm1vZHVsZScpO1xuXG5DbGllbnRlTW9kdWxvLmNvbmZpZygoJHN0YXRlUHJvdmlkZXIpID0+IHtcbiAgdmFyIGNsaWVudGUgPSB7XG4gICAgbmFtZTogJ21haW4uY2xpZW50ZScsXG4gICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgdXJsOiAnL2NsaWVudGUnLFxuICB9O1xuICB2YXIgcGVzcXVpc2FDbGllbnRlID0ge1xuICAgIG5hbWU6ICdtYWluLmNsaWVudGUucGVzcXVpc2EnLFxuICAgIHVybDogJy9wZXNxdWlzYScsXG4gICAgY29tcG9uZW50OiAncGVzcXVpc2FDbGllbnRlQ29tcG9uZW50J1xuICB9XG4gIHZhciBjYWRhc3Ryb0NsaWVudGUgPSB7XG4gICAgbmFtZTonbWFpbi5jbGllbnRlLmNhZGFzdHJvJyxcbiAgICB1cmw6ICdjYWRhc3RybycsXG4gICAgY29tcG9uZW50OiAnY2FkYXN0cm9DbGllbnRlQ29tcG9uZW50J1xuICB9O1xuICB2YXIgIGVkaWNhb0NsaWVudGUgPSB7XG4gICAgbmFtZTogJ21haW4uY2xpZW50ZS5lZGljYW8nLFxuICAgIHVybDogJ2VkaWNhby86aWQnLFxuICAgIGNvbXBvbmVudDogJ2NhZGFzdHJvQ2xpZW50ZUNvbXBvbmVudCcsXG4gICAgcmVzb2x2ZToge1xuICAgICAgY2xpZW50ZTogKCRxKSA9PiB7XG4gICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc3NlO1xuICAgICAgfSxcbiAgICAgIGxpc3RhSW5kdXN0cmlhQ2xpZW50ZTogKCRxKSA9PiB7XG4gICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc3NlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoY2xpZW50ZSk7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHBlc3F1aXNhQ2xpZW50ZSk7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGNhZGFzdHJvQ2xpZW50ZSk7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGVkaWNhb0NsaWVudGUpO1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2NsaWVudGUubW9kdWxlJywgWyd1aS5yb3V0ZXInXSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xpZW50ZU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd1c3VhcmlvLm1vZHVsZScpO1xuXG5DbGllbnRlTW9kdWxlLmZhY3RvcnkoJ0NsaWVudGVTZXJ2aWNlJywgWydIdHRwU2VydmljZScsXG4gIGZ1bmN0aW9uIChIdHRwU2VydmljZSkge1xuICAgIHZhciBzZXJ2aWNlID0ge307XG4gICAgY29uc3QgU1VCUEFUSCA9ICdzZXJ2aWNlL2NsaWVudGUnO1xuXG4gICAgY29uc3QgVVJMX0NMSUVOVEVfU0FMVkFSID0gYCR7U1VCUEFUSH0vc2FsdmFyQ2xpZW50ZWA7XG4gICAgY29uc3QgVVJMX0NMSUVOVEVfUE9SX0xPR0lOID0gYCR7U1VCUEFUSH0vZ2V0Q2xpZW50ZXNCeUxvZ2luYDtcbiAgICBjb25zdCBVUkxfQ0xJRU5URV9QT1JfRklMVFJPID0gYCR7U1VCUEFUSH0vZ2V0Q2xpZW50ZXNCeUZpbHRlcmA7XG4gICAgY29uc3QgVVJMX0NMSUVOVEVfRVhJU1RFTlRFID0gYCR7U1VCUEFUSH0vZ2V0Q2xpZW50ZUV4aXN0ZW50ZWA7XG4gICAgY29uc3QgVVJMX0NMSUVOVEVfUE9SX1JFUFJFU0VOVEFDQU8gPSBgJHtTVUJQQVRIfS9nZXRDbGllbnRlc1BvclJlcHJlc2VudGFjYW9gO1xuICAgIGNvbnN0IFVSTF9DTElFTlRFX0VYQ0xVSVIgPSBgJHtTVUJQQVRIfS9leGNsdWlyQ2xpZW50ZWA7XG4gICAgY29uc3QgVVJMX0lORFVTVFJJQV9DTElFTlRFX0JVU0NBUl9QT1JfQ0xJRU5URSA9IGAke1NVQlBBVEh9L2J1c2NhSW5kdXN0cmlhQ2xpZW50ZWA7XG4gICAgY29uc3QgVVJMX0NMSUVOVEVfVVBMT0FEX0FSUVVJVk8gPSBgJHtTVUJQQVRIfS91cGxvYWRBcnF1aXZvQ2xpZW50ZWA7XG4gICAgY29uc3QgVVJMX0NMSUVOVEVfRE9XTkxPQURfQVJRVUlWTyA9IGAke1NVQlBBVEh9L2Rvd25sb2FkQXJxdWl2b0NsaWVudGVgO1xuXG4gICAgc2VydmljZS5zYWx2YXJDbGllbnRlID0gKGNsaWVudGVEdG8pID0+IHtcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwUG9zdChVUkxfQ0xJRU5URV9TQUxWQVIsIGNsaWVudGVEdG8pO1xuICAgIH07XG5cbiAgICBzZXJ2aWNlLmdldENsaWVudGVzUG9yTG9naW4gPSAobG9naW4pID0+IHtcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwUG9zdChVUkxfQ0xJRU5URV9QT1JfTE9HSU4sIGxvZ2luKTtcbiAgICB9O1xuXG4gICAgc2VydmljZS5nZXRDbGllbnRlc1BvckZpbHRybyA9IChjbGllbnRlRHRvKSA9PiB7XG4gICAgICByZXR1cm4gSHR0cFNlcnZpY2UuaHR0cFBvc3QoVVJMX0NMSUVOVEVfUE9SX0ZJTFRSTywgY2xpZW50ZUR0byk7XG4gICAgfTtcblxuICAgIHNlcnZpY2UuZ2V0Q2xpZW50ZVBvckNucGogPSAoY25waikgPT4ge1xuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBQb3N0KFVSTF9DTElFTlRFX0VYSVNURU5URSwgY25waik7XG4gICAgfTtcblxuICAgIHNlcnZpY2UuZ2V0Q2xpZW50ZXNQb3JSZXByZXNlbnRhY2FvID0gKGJ1c2NhQ2xpZW50ZXNEdG8pID0+IHtcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwUG9zdChVUkxfQ0xJRU5URV9QT1JfUkVQUkVTRU5UQUNBTywgYnVzY2FDbGllbnRlc0R0byk7XG4gICAgfTtcblxuICAgIHNlcnZpY2UuZXhjbHVpckNsaWVudGUgPSAoaWRDbGllbnRlKSA9PiB7XG4gICAgICByZXR1cm4gSHR0cFNlcnZpY2UuaHR0cFBvc3QoVVJMX0NMSUVOVEVfRVhDTFVJUiwgaWRDbGllbnRlKTtcbiAgICB9O1xuXG4gICAgc2VydmljZS5idXNjYUluZHVzdHJpYUNsaWVudGUgPSAoaWRDbGllbnRlKSA9PiB7XG4gICAgICByZXR1cm4gSHR0cFNlcnZpY2UuaHR0cFBvc3QoVVJMX0lORFVTVFJJQV9DTElFTlRFX0JVU0NBUl9QT1JfQ0xJRU5URSwgaWRDbGllbnRlKTtcbiAgICB9O1xuXG4gICAgc2VydmljZS51cGxvYWRBcnF1aXZvQ2xpZW50ZSA9IGZ1bmN0aW9uIChmaWxlcywgY3BmQ25waiwgY2FsbGJhY2ssIGNhbGxiYWNrRXJyb3IpIHtcbiAgICAgIHNlcnZpY2UuY29tcGFjdGFyQXJxdWl2b3MoZmlsZXMsIChtRmlsZURlc2NyaXB0b3IpID0+IHtcbiAgICAgICAgaWYgKG1GaWxlRGVzY3JpcHRvcikge1xuICAgICAgICAgIG1GaWxlRGVzY3JpcHRvci5hcHBlbmQoJ2NwZkNucGonLCBjcGZDbnBqKVxuICAgICAgICAgICRodHRwLnBvc3QoTU9ET19IVFRQICsgVVJMICsgJy91cGxvYWRBcnF1aXZvQ2xpZW50ZScsIG1GaWxlRGVzY3JpcHRvciwge1xuICAgICAgICAgICAgdHJhbnNmb3JtUmVxdWVzdDogYW5ndWxhci5pZGVudGl0eSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6IHVuZGVmaW5lZCB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgTm90aWZpY2F0aW9uU2VydmljZS5zdWNjZXNzKCdBcnF1aXZvIGVudmlhZG8gY29tIHN1Y2Vzc28hJylcbiAgICAgICAgICAgICAgY2FsbGJhY2socmVzdWx0KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgIE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICBjYWxsYmFja0Vycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoXCJOw6NvIGZvaSBwb3Nzw612ZWwgZW52aWFyIG9zIGFycXVpdm9zXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXJ2aWNlLnVwbG9hZEFycXVpdm9DbGllbnRlID0gKGZpbGVzLCBjcGZDbnBqKSA9PiB7XG4gICAgICBzZXJ2aWNlLmNvbXBhY3RhckFycXVpdm9zKGZpbGVzLCAobUZpbGVEZXNjcmlwdG9yKSA9PiB7XG4gICAgICAgIGlmIChtRmlsZURlc2NyaXB0b3IpIHtcbiAgICAgICAgICBsZXQgaGVhZGVyID0geyAnQ29udGVudC1UeXBlJzogdW5kZWZpbmVkIH07XG4gICAgICAgICAgbGV0IG9wdCA9IHsgdHJhbnNmb3JtUmVxdWVzdDogYW5ndWxhci5pZGVudGl0eSB9O1xuICAgICAgICAgIG1GaWxlRGVzY3JpcHRvci5hcHBlbmQoJ2NwZkNucGonLCBjcGZDbnBqKTtcbiAgICAgICAgICByZXR1cm4gSHR0cFNlcnZpY2UuaHR0cFBvc3QoVVJMX0NMSUVOVEVfVVBMT0FEX0FSUVVJVk8sIG1GaWxlRGVzY3JpcHRvciwgbnVsbCwgaGVhZGVyLCBvcHQpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHNlcnZpY2UuZG93bmxvYWRBcnF1aXZvQ2xpZW50ZSA9IChjcGZDbnBqLCBub21lQXJxdWl2bykgPT4ge1xuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBHZXQoVVJMX0NMSUVOVEVfRE9XTkxPQURfQVJRVUlWTywge2NwZkNucGosIG5vbWVBcnF1aXZvfSk7XG4gICAgfTtcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVJFRkFUT1JBUi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgc2VydmljZS5jb21wYWN0YXJBcnF1aXZvcyA9IGZ1bmN0aW9uIChmaWxlcywgY2FsbGJhY2spIHtcbiAgICAgIHZhciBmZCA9IG5ldyBGb3JtRGF0YSgpXG4gICAgICBsZXQgY29udCA9IDBcbiAgICAgIGZvciAodmFyIGkgaW4gZmlsZXMpIHtcbiAgICAgICAgaWYgKElNQUdFX0ZJTEVfVFlQRS5pbmRleE9mKGZpbGVzW2ldLnR5cGUpID4gLTEpIHtcbiAgICAgICAgICBuZXcgSW1hZ2VDb21wcmVzc29yKGZpbGVzW2ldLCB7XG4gICAgICAgICAgICBxdWFsaXR5OiAuOCxcbiAgICAgICAgICAgIG1pbldpZHRoOiAxMDI0LFxuICAgICAgICAgICAgbWF4V2lkdGg6IDE0NDAgLFxuICAgICAgICAgICAgbWluSGVpZ2h0OiA3NjgsXG4gICAgICAgICAgICBtYXhIZWlnaHQ6IDkwMCxcbiAgICAgICAgICAgIHN1Y2Nlc3MocmVzdWx0KSB7XG4gICAgICAgICAgICAgIGZkLmFwcGVuZChcImZpbGVzXCIsIHJlc3VsdCwgcmVzdWx0Lm5hbWUpO1xuICAgICAgICAgICAgICBjb250KytcbiAgICAgICAgICAgICAgaWYgKGNvbnQgPT0gZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZmQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcihlKSB7XG4gICAgICAgICAgICAgIE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmQuYXBwZW5kKFwiZmlsZXNcIiwgZmlsZXNbaV0pO1xuICAgICAgICAgIGNvbnQrK1xuICAgICAgICAgIGlmIChjb250ID09IGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FsbGJhY2soZmQpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2VydmljZS5idXNjYU5vbWVzQmFuY29zID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbm9tZXMgPSBbXG4gICAgICAgICdBbHZvcmFkYSBCYW5jbyBkZSBJbnZlc3RpbWVudG8nLFxuICAgICAgICAnNjU0IHwgQmFuY28gQS5KLlJlbm5lciBTLkEuJyxcbiAgICAgICAgJzI0NiB8IEJhbmNvIEFCQyBCcmFzaWwgUy5BLicsXG4gICAgICAgICc3NSB8IEJhbmNvIEFCTiBBTVJPIFMuQS4nLFxuICAgICAgICAnQmFuY28gQWxmYSBkZSBJbnZlc3RpbWVudG9zIFNBJyxcbiAgICAgICAgJzI1IHwgQmFuY28gQWxmYSBTLkEuJyxcbiAgICAgICAgJzY0MSB8IEJhbmNvIEFsdm9yYWRhIFMuQS4nLFxuICAgICAgICAnNjUgfCBCYW5jbyBBbmRCYW5rIChCcmFzaWwpIFMuQS4nLFxuICAgICAgICAnMjEzIHwgQmFuY28gQXJiaSBTLkEuJyxcbiAgICAgICAgJzE5IHwgQmFuY28gQXp0ZWNhIGRvIEJyYXNpbCBTLkEuJyxcbiAgICAgICAgJ0JhbmNvIEJhbmRlaXJhbnRlcyBkZSBJbnZlc3RpbWVudG9zIFNBJyxcbiAgICAgICAgJzI0IHwgQmFuY28gQkFOREVQRSBTLkEuJyxcbiAgICAgICAgJzI5IHwgQmFuY28gQmFuZXJqIFMuQS4nLFxuICAgICAgICAnMCB8IEJhbmNvIEJhbmtwYXIgUy5BLicsXG4gICAgICAgICc3NDAgfCBCYW5jbyBCYXJjbGF5cyBTLkEuJyxcbiAgICAgICAgJzEwNyB8IEJhbmNvIEJCTSBTLkEuJyxcbiAgICAgICAgJzMxIHwgQmFuY28gQmVnIFMuQS4nLFxuICAgICAgICAnMTIyLTggfCBCYW5jbyBCRVJKIFMuQS4nLFxuICAgICAgICAnOTYgfCBCYW5jbyBCTSZGQk9WRVNQQSBkZSBTZXJ2acOnb3MgZGUgTGlxdWlkYcOnw6NvIGUgQ3VzdMOzZGlhIFMuQScsXG4gICAgICAgICczMTggfCBCYW5jbyBCTUcgUy5BLicsXG4gICAgICAgICc3NTIgfCBCYW5jbyBCTlAgUGFyaWJhcyBCcmFzaWwgUy5BLicsXG4gICAgICAgICcyNDggfCBCYW5jbyBCb2F2aXN0YSBJbnRlcmF0bMOibnRpY28gUy5BLicsXG4gICAgICAgICcyMTggfCBCYW5jbyBCb25zdWNlc3NvIFMuQS4nLFxuICAgICAgICAnQmFuY28gQlBJIEludmVzdGltZW50b3MgU0EnLFxuICAgICAgICAnMzYgfCBCYW5jbyBCcmFkZXNjbyBCQkkgUy5BLicsXG4gICAgICAgICcyMDQgfCBCYW5jbyBCcmFkZXNjbyBDYXJ0w7VlcyBTLkEuJyxcbiAgICAgICAgJzM5NCB8IEJhbmNvIEJyYWRlc2NvIEZpbmFuY2lhbWVudG9zIFMuQS4nLFxuICAgICAgICAnMjM3IHwgQmFuY28gQnJhZGVzY28gUy5BLicsXG4gICAgICAgICcyMjUgfCBCYW5jbyBCcmFzY2FuIFMuQS4nLFxuICAgICAgICAnQmFuY28gQlJKIFMuQS4nLFxuICAgICAgICAnMjA4IHwgQmFuY28gQlRHIFBhY3R1YWwgUy5BLicsXG4gICAgICAgICc0NCB8IEJhbmNvIEJWQSBTLkEuJyxcbiAgICAgICAgJzI2MyB8IEJhbmNvIENhY2lxdWUgUy5BLicsXG4gICAgICAgICc0NzMgfCBCYW5jbyBDYWl4YSBHZXJhbCAtIEJyYXNpbCBTLkEuJyxcbiAgICAgICAgJzQxMiB8IEJhbmNvIENhcGl0YWwgUy5BLicsXG4gICAgICAgICc0MCB8IEJhbmNvIENhcmdpbGwgUy5BLicsXG4gICAgICAgICdCYW5jbyBDYXRlcnBpbGxhciBTLkEuJyxcbiAgICAgICAgJzI2NiB8IEJhbmNvIEPDqWR1bGEgUy5BLicsXG4gICAgICAgICc3MzkgfCBCYW5jbyBDZXRlbGVtIFMuQS4nLFxuICAgICAgICAnMjMzIHwgQmFuY28gQ2lmcmEgUy5BLicsXG4gICAgICAgICc3NDUgfCBCYW5jbyBDaXRpYmFuayBTLkEuJyxcbiAgICAgICAgJzAgfCBCYW5jbyBDaXRpY2FyZCBTLkEuJyxcbiAgICAgICAgJzI0MSB8IEJhbmNvIENsw6Fzc2ljbyBTLkEuJyxcbiAgICAgICAgJzAgfCBCYW5jbyBDTkggSW5kdXN0cmlhbCBDYXBpdGFsIFMuQS4nLFxuICAgICAgICAnMjE1IHwgQmFuY28gQ29tZXJjaWFsIGUgZGUgSW52ZXN0aW1lbnRvIFN1ZGFtZXJpcyBTLkEuJyxcbiAgICAgICAgJ0JhbmNvIENvbW1lcmNpYWwgSW52ZXN0bWVudCBUcnVzIGRvIEJyYXNpbCBTLkEuJyxcbiAgICAgICAgJzk1IHwgQmFuY28gQ29uZmlkZW5jZSBkZSBDw6JtYmlvIFMuQS4nLFxuICAgICAgICAnNzU2IHwgQmFuY28gQ29vcGVyYXRpdm8gZG8gQnJhc2lsIFMuQS4gLSBCQU5DT09CJyxcbiAgICAgICAgJzc0OCB8IEJhbmNvIENvb3BlcmF0aXZvIFNpY3JlZGkgUy5BLicsXG4gICAgICAgICc3MjEgfCBCYW5jbyBDcmVkaWJlbCBTLkEuJyxcbiAgICAgICAgJzIyMiB8IEJhbmNvIENyZWRpdCBBZ3JpY29sZSBCcmFzaWwgUy5BLicsXG4gICAgICAgICc1MDUgfCBCYW5jbyBDcmVkaXQgU3Vpc3NlIChCcmFzaWwpIFMuQS4nLFxuICAgICAgICAnMjI5IHwgQmFuY28gQ3J1emVpcm8gZG8gU3VsIFMuQS4nLFxuICAgICAgICAnQmFuY28gQ1NGIFMuQS4nLFxuICAgICAgICAnMyB8IEJhbmNvIGRhIEFtYXrDtG5pYSBTLkEuJyxcbiAgICAgICAgJzA4My0zIHwgQmFuY28gZGEgQ2hpbmEgQnJhc2lsIFMuQS4nLFxuICAgICAgICAnMCB8IEJhbmNvIERhaW1sZXJjaHJ5c2xlciBTLkEuJyxcbiAgICAgICAgJzcwNyB8IEJhbmNvIERheWNvdmFsIFMuQS4nLFxuICAgICAgICAnQkFOQ08gREUgSU5WRVNUIFRFTkRFTkNJQSBTLkEuJyxcbiAgICAgICAgJ0JBTkNPIERFIElOVkVTVElNRU5UT1MgQ1JFRElUIFNVSVNTRSBCUkFTSUwgUyBBIC0gQ1JFRElUIFNVSVNTRScsXG4gICAgICAgICczMDAgfCBCYW5jbyBkZSBMYSBOYWNpb24gQXJnZW50aW5hJyxcbiAgICAgICAgJzQ5NSB8IEJhbmNvIGRlIExhIFByb3ZpbmNpYSBkZSBCdWVub3MgQWlyZXMnLFxuICAgICAgICAnNDk0IHwgQmFuY28gZGUgTGEgUmVwdWJsaWNhIE9yaWVudGFsIGRlbCBVcnVndWF5JyxcbiAgICAgICAgJzAgfCBCYW5jbyBkZSBMYWdlIExhbmRlbiBCcmFzaWwgUy5BLicsXG4gICAgICAgICc0NTYgfCBCYW5jbyBkZSBUb2t5by1NaXRzdWJpc2hpIFVGSiBCcmFzaWwgUy5BLicsXG4gICAgICAgICcyMTQgfCBCYW5jbyBEaWJlbnMgUy5BLicsXG4gICAgICAgICcxIHwgQmFuY28gZG8gQnJhc2lsIFMuQS4nLFxuICAgICAgICAnNDcgfCBCYW5jbyBkbyBFc3RhZG8gZGUgU2VyZ2lwZSBTLkEuJyxcbiAgICAgICAgJzM3IHwgQmFuY28gZG8gRXN0YWRvIGRvIFBhcsOhIFMuQS4nLFxuICAgICAgICAnMzkgfCBCYW5jbyBkbyBFc3RhZG8gZG8gUGlhdcOtIFMuQS4gLSBCRVAnLFxuICAgICAgICAnNDEgfCBCYW5jbyBkbyBFc3RhZG8gZG8gUmlvIEdyYW5kZSBkbyBTdWwgUy5BLicsXG4gICAgICAgICc0IHwgQmFuY28gZG8gTm9yZGVzdGUgZG8gQnJhc2lsIFMuQS4nLFxuICAgICAgICAnMjY1IHwgQmFuY28gRmF0b3IgUy5BLicsXG4gICAgICAgICcwIHwgQmFuY28gRmlhdCBTLkEuJyxcbiAgICAgICAgJzIyNCB8IEJhbmNvIEZpYnJhIFMuQS4nLFxuICAgICAgICAnNjI2IHwgQmFuY28gRmljc2EgUy5BLicsXG4gICAgICAgICdCYW5jbyBGaWRpcyBTLkEuJyxcbiAgICAgICAgJ0JhbmNvIEZpbmFzYSBkZSBJbnZlc3RpbWVudG9zIFNBJyxcbiAgICAgICAgJzAgfCBCYW5jbyBGb3JkIFMuQS4nLFxuICAgICAgICAnQmFuY28gR2VyYcOnw6NvIEZ1dHVybyBkZSBJbnZlc3RpbWVudG9zJyxcbiAgICAgICAgJ0JhbmNvIEdlcmFkb3IgUy5BLicsXG4gICAgICAgICc3MzQgfCBCYW5jbyBHZXJkYXUgUy5BLicsXG4gICAgICAgICcwIHwgQmFuY28gR01BQyBTLkEuJyxcbiAgICAgICAgJzYxMiB8IEJhbmNvIEd1YW5hYmFyYSBTLkEuJyxcbiAgICAgICAgJzAgfCBCYW5jbyBIb25kYSBTLkEuJyxcbiAgICAgICAgJzYzIHwgQmFuY28gSWJpIFMuQS4gQmFuY28gTcO6bHRpcGxvJyxcbiAgICAgICAgJzAgfCBCYW5jbyBJQk0gUy5BLicsXG4gICAgICAgICc2MDQgfCBCYW5jbyBJbmR1c3RyaWFsIGRvIEJyYXNpbCBTLkEuJyxcbiAgICAgICAgJzMyMCB8IEJhbmNvIEluZHVzdHJpYWwgZSBDb21lcmNpYWwgUy5BLicsXG4gICAgICAgICc2NTMgfCBCYW5jbyBJbmR1c3ZhbCBTLkEuJyxcbiAgICAgICAgJzYzMCB8IEJhbmNvIEludGVyY2FwIFMuQS4nLFxuICAgICAgICAnNzcgfCBCYW5jbyBJbnRlcm1lZGl1bSBTLkEuJyxcbiAgICAgICAgJzI0OSB8IEJhbmNvIEludmVzdGNyZWQgVW5pYmFuY28gUy5BLicsXG4gICAgICAgICdCYW5jbyBJbnZlc3RpbWVudG9zIEJNQyBTQScsXG4gICAgICAgICcxODQgfCBCYW5jbyBJdGHDuiBCQkEgUy5BLicsXG4gICAgICAgICc0NzkgfCBCYW5jbyBJdGHDukJhbmsgUy5BJyxcbiAgICAgICAgJ0JhbmNvIEl0YXVjYXJkIFMuQS4nLFxuICAgICAgICAnMCB8IEJhbmNvIEl0YXVjcmVkIEZpbmFuY2lhbWVudG9zIFMuQS4nLFxuICAgICAgICAnQmFuY28gSVRBVUxFQVNJTkcgUy5BLicsXG4gICAgICAgICczNzYgfCBCYW5jbyBKLiBQLiBNb3JnYW4gUy5BLicsXG4gICAgICAgICc3NCB8IEJhbmNvIEouIFNhZnJhIFMuQS4nLFxuICAgICAgICAnMjE3IHwgQmFuY28gSm9obiBEZWVyZSBTLkEuJyxcbiAgICAgICAgJzc2IHwgQmFuY28gS0RCIFMuQS4nLFxuICAgICAgICAnNzU3IHwgQmFuY28gS0VCIGRvIEJyYXNpbCBTLkEuJyxcbiAgICAgICAgJzYwMCB8IEJhbmNvIEx1c28gQnJhc2lsZWlybyBTLkEuJyxcbiAgICAgICAgJzI0MyB8IEJhbmNvIE3DoXhpbWEgUy5BLicsXG4gICAgICAgICcwIHwgQmFuY28gTWF4aW52ZXN0IFMuQS4nLFxuICAgICAgICAnQkFOQ08gTUVSQ0FOVElMIERFIElOVkVTVElNRU5UT1MgU0EnLFxuICAgICAgICAnMzg5IHwgQmFuY28gTWVyY2FudGlsIGRvIEJyYXNpbCBTLkEuJyxcbiAgICAgICAgJ0JhbmNvIE1lcmNlZGVzLUJlbnogUy5BLicsXG4gICAgICAgICczNzAgfCBCYW5jbyBNaXp1aG8gZG8gQnJhc2lsIFMuQS4nLFxuICAgICAgICAnNzQ2IHwgQmFuY28gTW9kYWwgUy5BLicsXG4gICAgICAgICcwIHwgQmFuY28gTW9uZW8gUy5BLicsXG4gICAgICAgICc3MzggfCBCYW5jbyBNb3JhZGEgUy5BLicsXG4gICAgICAgICdCYW5jbyBNb3JhZGEgU0EnLFxuICAgICAgICAnNjYgfCBCYW5jbyBNb3JnYW4gU3RhbmxleSBTLkEuJyxcbiAgICAgICAgJzQ1IHwgQmFuY28gT3Bwb3J0dW5pdHkgUy5BLicsXG4gICAgICAgICc3OSB8IEJhbmNvIE9yaWdpbmFsIGRvIEFncm9uZWfDs2NpbyBTLkEuJyxcbiAgICAgICAgJzIxMiB8IEJhbmNvIE9yaWdpbmFsIFMuQS4nLFxuICAgICAgICAnQmFuY28gT3VyaW52ZXN0JyxcbiAgICAgICAgJzcxMi05IHwgQmFuY28gT3VyaW52ZXN0IFMuQS4nLFxuICAgICAgICAnNjIzIHwgQmFuY28gUEFOIFMuQS4nLFxuICAgICAgICAnNjExIHwgQmFuY28gUGF1bGlzdGEgUy5BLicsXG4gICAgICAgICc2MTMgfCBCYW5jbyBQZWPDum5pYSBTLkEuJyxcbiAgICAgICAgJzA5NC0yIHwgQmFuY28gUGV0cmEgUy5BLicsXG4gICAgICAgICc2NDMgfCBCYW5jbyBQaW5lIFMuQS4nLFxuICAgICAgICAnQmFuY28gUG9ydG8gUmVhbCBkZSBJbnZlc3RpbWVudG9zIFMuQS4nLFxuICAgICAgICAnNzI0IHwgQmFuY28gUG9ydG8gU2VndXJvIFMuQS4nLFxuICAgICAgICAnNzM1IHwgQmFuY28gUG90dGVuY2lhbCBTLkEuJyxcbiAgICAgICAgJzYzOCB8IEJhbmNvIFByb3NwZXIgUy5BLicsXG4gICAgICAgICcwIHwgQmFuY28gUFNBIEZpbmFuY2UgQnJhc2lsIFMuQS4nLFxuICAgICAgICAnNzQ3IHwgQmFuY28gUmFib2JhbmsgSW50ZXJuYXRpb25hbCBCcmFzaWwgUy5BLicsXG4gICAgICAgICcwODgtNCB8IEJhbmNvIFJhbmRvbiBTLkEuJyxcbiAgICAgICAgJzM1NiB8IEJhbmNvIFJlYWwgUy5BLicsXG4gICAgICAgICc2MzMgfCBCYW5jbyBSZW5kaW1lbnRvIFMuQS4nLFxuICAgICAgICAnNzQxIHwgQmFuY28gUmliZWlyw6NvIFByZXRvIFMuQS4nLFxuICAgICAgICAnMCB8IEJhbmNvIFJvZG9iZW5zIFMuQS4nLFxuICAgICAgICAnQmFuY28gUnVyYWwgZGUgSW52ZXN0aW1lbnRvcyBTQScsXG4gICAgICAgICc3MiB8IEJhbmNvIFJ1cmFsIE1haXMgUy5BLicsXG4gICAgICAgICc0NTMgfCBCYW5jbyBSdXJhbCBTLkEuJyxcbiAgICAgICAgJzQyMiB8IEJhbmNvIFNhZnJhIFMuQS4nLFxuICAgICAgICAnMzMgfCBCYW5jbyBTYW50YW5kZXIgKEJyYXNpbCkgUy5BLicsXG4gICAgICAgICc3NDMgfCBCYW5jbyBTZW1lYXIgUy5BLicsXG4gICAgICAgICc3NDkgfCBCYW5jbyBTaW1wbGVzIFMuQS4nLFxuICAgICAgICAnMzY2IHwgQmFuY28gU29jacOpdMOpIEfDqW7DqXJhbGUgQnJhc2lsIFMuQS4nLFxuICAgICAgICAnNjM3IHwgQmFuY28gU29maXNhIFMuQS4nLFxuICAgICAgICAnMTIgfCBCYW5jbyBTdGFuZGFyZCBkZSBJbnZlc3RpbWVudG9zIFMuQS4nLFxuICAgICAgICAnQmFuY28gU3VkYW1lcmlzIEludmVzdGltZW50byBTQScsXG4gICAgICAgICc0NjQgfCBCYW5jbyBTdW1pdG9tbyBNaXRzdWkgQnJhc2lsZWlybyBTLkEuJyxcbiAgICAgICAgJzA4Mi01IHwgQmFuY28gVG9ww6F6aW8gUy5BLicsXG4gICAgICAgICcwIHwgQmFuY28gVG95b3RhIGRvIEJyYXNpbCBTLkEuJyxcbiAgICAgICAgJzYzNCB8IEJhbmNvIFRyacOibmd1bG8gUy5BLicsXG4gICAgICAgICcxOCB8IEJhbmNvIFRyaWN1cnkgUy5BLicsXG4gICAgICAgICcwIHwgQmFuY28gVm9sa3N3YWdlbiBTLkEuJyxcbiAgICAgICAgJzAgfCBCYW5jbyBWb2x2byAoQnJhc2lsKSBTLkEuJyxcbiAgICAgICAgJzY1NSB8IEJhbmNvIFZvdG9yYW50aW0gUy5BLicsXG4gICAgICAgICc2MTAgfCBCYW5jbyBWUiBTLkEuJyxcbiAgICAgICAgJzExOSB8IEJhbmNvIFdlc3Rlcm4gVW5pb24gZG8gQnJhc2lsIFMuQS4nLFxuICAgICAgICAnQmFuY28gV29vcmkgQmFuayBkbyBCcmFzaWwgUy5BLicsXG4gICAgICAgICdCYW5jbyBZYW1haGEgTW90b3IgUy5BLicsXG4gICAgICAgICcyMSB8IEJBTkVTVEVTIFMuQS4gQmFuY28gZG8gRXN0YWRvIGRvIEVzcMOtcml0byBTYW50bycsXG4gICAgICAgICdCYW5pZiBCcmFzaWwgQkkgU0EnLFxuICAgICAgICAnNzE5IHwgQmFuaWYtQmFuY28gSW50ZXJuYWNpb25hbCBkbyBGdW5jaGFsIChCcmFzaWwpUy5BLicsXG4gICAgICAgICc3NTUgfCBCYW5rIG9mIEFtZXJpY2EgTWVycmlsbCBMeW5jaCBCYW5jbyBNw7psdGlwbG8gUy5BLicsXG4gICAgICAgICc3NDQgfCBCYW5rQm9zdG9uIE4uQS4nLFxuICAgICAgICAnQkIgQkFOQ08gREUgSU5WRVNUSU1FTlRPIFMgQSAtIEJCJyxcbiAgICAgICAgJzczIHwgQkIgQmFuY28gUG9wdWxhciBkbyBCcmFzaWwgUy5BLicsXG4gICAgICAgICcwODEtNyB8IEJCTiBCYW5jbyBCcmFzaWxlaXJvIGRlIE5lZ8OzY2lvcyBTLkEuJyxcbiAgICAgICAgJzI1MCB8IEJDViAtIEJhbmNvIGRlIENyw6lkaXRvIGUgVmFyZWpvIFMuQS4nLFxuICAgICAgICAnNzggfCBCRVMgSW52ZXN0aW1lbnRvIGRvIEJyYXNpbCBTLkEuLUJhbmNvIGRlIEludmVzdGltZW50bycsXG4gICAgICAgICdCTVcgRmluYW5jZWlyYScsXG4gICAgICAgICdCTlkgTWVsbG9uIEJhbmNvIFMuQS4nLFxuICAgICAgICAnNjkgfCBCUE4gQnJhc2lsIEJhbmNvIE3Dumx0aXBsbyBTLkEuJyxcbiAgICAgICAgJ0JSIFBBUlRORVJTIEJBTkNPIERFIElOVkVTVElNRU5UTyBTIEEnLFxuICAgICAgICAnMTI1IHwgQnJhc2lsIFBsdXJhbCBTLkEuIC0gQmFuY28gTcO6bHRpcGxvJyxcbiAgICAgICAgJzcwIHwgQlJCIC0gQmFuY28gZGUgQnJhc8OtbGlhIFMuQS4nLFxuICAgICAgICAnQlJCIC0gQ3LDqWRpdG8nLFxuICAgICAgICAnMDkyLTIgfCBCcmlja2VsbCBTLkEuIENyw6lkaXRvJyxcbiAgICAgICAgJ0JWIEZpbmFuY2VpcmEgUy5BLiAtIENGSScsXG4gICAgICAgICcxMDQgfCBDYWl4YSBFY29uw7RtaWNhIEZlZGVyYWwnLFxuICAgICAgICAnMTE0LTcgfCBDZW50cmFsIGRhcyBDb29wLiBkZSBFY29ub21pYSBlIENyw6lkaXRvIE11dHVvIGRvIEVzdC4gZG8gRVMnLFxuICAgICAgICAnNDc3IHwgQ2l0aWJhbmsgUy5BLicsXG4gICAgICAgICdDb21wYW5oaWEgZGUgQ3LDqWRpdG8nLFxuICAgICAgICAnMTM2IHwgQ09ORkVERVJBQ0FPIE5BQ0lPTkFMIERBUyBDT09QRVJBVElWQVMgQ0VOVFJBSVMgVU5JQ1JFRFMnLFxuICAgICAgICAnMDk3LTMgfCBDb29wZXJhdGl2YSBDZW50cmFsIGRlIENyw6lkaXRvIE5vcm9lc3RlIEJyYXNpbGVpcm8gTHRkYS4nLFxuICAgICAgICAnMDg1LXggfCBDb29wZXJhdGl2YSBDZW50cmFsIGRlIENyw6lkaXRvIFVyYmFuby1DRUNSRUQnLFxuICAgICAgICAnMDk5LXggfCBDb29wZXJhdGl2YSBDZW50cmFsIGRlIEVjb25vbWlhIGUgQ3JlZGl0byBNdXR1byBkYXMgVW5pY3JlZHMnLFxuICAgICAgICAnMDkwLTIgfCBDb29wZXJhdGl2YSBDZW50cmFsIGRlIEVjb25vbWlhIGUgQ3LDqWRpdG8gTXV0dW8gZGFzIFVuaWNyZWRzJyxcbiAgICAgICAgJzA4OS0yIHwgQ29vcGVyYXRpdmEgZGUgQ3LDqWRpdG8gUnVyYWwgZGEgUmVnacOjbyBkZSBNb2dpYW5hJyxcbiAgICAgICAgJzA4Ny02IHwgQ29vcGVyYXRpdmEgVW5pY3JlZCBDZW50cmFsIFNhbnRhIENhdGFyaW5hJyxcbiAgICAgICAgJzA5OC0xIHwgQ1JFRElBTElBTsOHQSBDT09QRVJBVElWQSBERSBDUsOJRElUTyBSVVJBTCcsXG4gICAgICAgICc0ODcgfCBEZXV0c2NoZSBCYW5rIFMuQS4gLSBCYW5jbyBBbGVtw6NvJyxcbiAgICAgICAgJ0ZpbmFtYXggUy9BIEMuIEYuIEkuJyxcbiAgICAgICAgJzY0IHwgR29sZG1hbiBTYWNocyBkbyBCcmFzaWwgQmFuY28gTcO6bHRpcGxvIFMuQS4nLFxuICAgICAgICAnNjIgfCBIaXBlcmNhcmQgQmFuY28gTcO6bHRpcGxvIFMuQS4nLFxuICAgICAgICAnMzk5IHwgSFNCQyBCYW5rIEJyYXNpbCBTLkEuIC0gQmFuY28gTcO6bHRpcGxvJyxcbiAgICAgICAgJzE2OCB8IEhTQkMgRmluYW5jZSAoQnJhc2lsKSBTLkEuIC0gQmFuY28gTcO6bHRpcGxvJyxcbiAgICAgICAgJ0lDQkMgRE8gQlJBU0lMIEJBTkNPIE1VTFRJUExPIFMgQSAtIElDQkMgRE8gQlJBU0lMJyxcbiAgICAgICAgJzQ5MiB8IElORyBCYW5rIE4uVi4nLFxuICAgICAgICAnNjUyIHwgSXRhw7ogVW5pYmFuY28gSG9sZGluZyBTLkEuJyxcbiAgICAgICAgJzM0MSB8IEl0YcO6IFVuaWJhbmNvIFMuQS4nLFxuICAgICAgICAnSi4gTWFsdWNlbGxpJyxcbiAgICAgICAgJzQ4OCB8IEpQTW9yZ2FuIENoYXNlIEJhbmsnLFxuICAgICAgICAnMTQgfCBOYXRpeGlzIEJyYXNpbCBTLkEuIEJhbmNvIE3Dumx0aXBsbycsXG4gICAgICAgICc3NTMgfCBOQkMgQmFuayBCcmFzaWwgUy5BLiAtIEJhbmNvIE3Dumx0aXBsbycsXG4gICAgICAgICcwODYtOCB8IE9CT0UgQ3LDqWRpdG8gRmluYW5jaWFtZW50byBlIEludmVzdGltZW50byBTLkEuJyxcbiAgICAgICAgJ09tbmkgU0EgQ3LDqWRpdG8gRmluYW5jaWFtZW50byBJbnZlc3RpbWVudG8nLFxuICAgICAgICAnMjU0IHwgUGFyYW7DoSBCYW5jbyBTLkEuJyxcbiAgICAgICAgJ1NhbnRhbmEgUy5BLiBDcsOpZGl0bycsXG4gICAgICAgICdTY2FuaWEgQmFuY28gUy5BLicsXG4gICAgICAgICc3NTEgfCBTY290aWFiYW5rIEJyYXNpbCBTLkEuIEJhbmNvIE3Dumx0aXBsbycsXG4gICAgICAgICdTdGFuZGFyZCBDaGFydGVyZWQgQmFuayAoQnJhc2lsKSBTL0HigJNCY28gSW52ZXN0LicsXG4gICAgICAgICdTdWwgRmluYW5jZWlyYSBTL0EgLSBDcsOpZGl0bycsXG4gICAgICAgICdVQU0gLSBBc3Nlc3NvcmlhIGUgR2VzdMOjbycsXG4gICAgICAgICdVQlMgQnJhc2lsIEJhbmNvIGRlIEludmVzdGltZW50byBTLkEuJyxcbiAgICAgICAgJzQwOSB8IFVOSUJBTkNPIC0gVW5pw6NvIGRlIEJhbmNvcyBCcmFzaWxlaXJvcyBTLkEuJyxcbiAgICAgICAgJzIzMCB8IFVuaWNhcmQgQmFuY28gTcO6bHRpcGxvIFMuQS4nLFxuICAgICAgICAnMDkxLTQgfCBVbmljcmVkIENlbnRyYWwgZG8gUmlvIEdyYW5kZSBkbyBTdWwnXG4gICAgICAgIF07XG4gICAgICByZXR1cm4gbm9tZXM7XG4gICAgfTtcblxuICAgIHJldHVybiBzZXJ2aWNlO1xuICB9XG5dKTtcbiIsIid1c2Ugc3RyaWN0JztcclxudmFyIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdDbGllbnRlc0NhZGFzdHJhZG9zJylcclxuXHQuY29udHJvbGxlcignQ2xpZW50ZXNDYWRhc3RyYWRvc0NvbnRyb2xsZXInLFxyXG5cdFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJGxvY2F0aW9uJywgJyRodHRwJywgJ0NsaWVudGVzQ2FkYXN0cmFkb3NTZXJ2aWNlJywgJ1BlZGlkb1NlcnZpY2UnLCAnSW5kdXN0cmlhc1NlcnZpY2UnLCAnQXV0aGVudGljYXRpb25TZXJ2aWNlJywgJ01vZGFsU2VydmljZScsICdTdG9yYWdlU2VydmljZScsICdDYWRhc3Ryb0NsaWVudGVzU2VydmljZScsXHJcblx0XHRmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRodHRwLCBzZXJ2aWNlLCBQZWRpZG9TZXJ2aWNlLCBJbmR1c3RyaWFzU2VydmljZSwgQXV0aGVudGljYXRpb25TZXJ2aWNlLCBNb2RhbFNlcnZpY2UsIFN0b3JhZ2VTZXJ2aWNlLCBDYWRhc3Ryb0NsaWVudGVzU2VydmljZSkge1xyXG5cclxuXHRcdFx0bGV0IHVzdWFyaW8gPSBBdXRoZW50aWNhdGlvblNlcnZpY2UuZ2V0VXN1YXJpbygpO1xyXG5cclxuXHRcdFx0aWYgKFN0b3JhZ2VTZXJ2aWNlLmdldEZpbHRyb0F0aXZvKCkpIHtcclxuXHRcdFx0XHQkc2NvcGUuc2VhcmNoID0gU3RvcmFnZVNlcnZpY2UuZ2V0RmlsdHJvQXRpdm8oKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkc2NvcGUuc2VhcmNoID0ge1xyXG5cdFx0XHRcdFx0cmF6YW9Tb2NpYWw6IFwiXCIsXHJcblx0XHRcdFx0XHRub21lRmFudGFzaWE6IFwiXCIsXHJcblx0XHRcdFx0XHRjcGZDbnBqOiBcIlwiLFxyXG5cdFx0XHRcdFx0bmV3UGFnZTogMSxcclxuXHRcdFx0XHRcdHBhZ2VTaXplOiAxMCxcclxuXHRcdFx0XHRcdGlkVXN1YXJpbzogdXN1YXJpby5pZCxcclxuXHRcdFx0XHRcdHZlbmRlZG9yRmlsdHJvOiB1bmRlZmluZWQsXHJcblx0XHRcdFx0XHRwZW5kZW50ZVJlZ2lzdHJvOiB1bmRlZmluZWQsXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHBhZ2luYXRpb25PcHRpb25zID0ge1xyXG5cdFx0XHRcdHBhZ2VOdW1iZXI6IDEsXHJcblx0XHRcdFx0cGFnZVNpemU6IDEwLFxyXG5cdFx0XHRcdHNvcnQ6IG51bGxcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdCRzY29wZS5leGliZU9wY2lvbmFpcyA9IGlubmVyV2lkdGggPiA3MDAgPyB0cnVlIDogZmFsc2U7XHJcblxyXG5cdFx0XHRDYWRhc3Ryb0NsaWVudGVzU2VydmljZS5idXNjYVZlbmRlZG9yZXMoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG5cdFx0XHRcdCRzY29wZS5saXN0YVZlbmRlZG9yZXMgPSByZXN1bHQ7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JHNjb3BlLmdyaWRDbGllbnRlcyA9IHtcclxuXHRcdFx0XHRwYWdpbmF0aW9uUGFnZVNpemVzOiBbMTAsIDE1LCAyMF0sXHJcblx0XHRcdFx0cGFnaW5hdGlvblBhZ2VTaXplOiBwYWdpbmF0aW9uT3B0aW9ucy5wYWdlU2l6ZSxcclxuXHRcdFx0XHR1c2VFeHRlcm5hbFBhZ2luYXRpb246IHRydWUsXHJcblx0XHRcdFx0ZW5hYmxlUm93U2VsZWN0aW9uOiB0cnVlLFxyXG5cdFx0XHRcdG11bHRpU2VsZWN0OiBmYWxzZSxcclxuXHRcdFx0XHRyb3dIZWlnaHQ6IDM1LFxyXG5cdFx0XHRcdGVuYWJsZUNvbHVtblJlc2l6aW5nOiB0cnVlLFxyXG5cdFx0XHRcdGNvbHVtbkRlZnM6IFtcclxuXHRcdFx0XHRcdHsgbmFtZTogJ3JhemFvU29jaWFsJywgd2lkdGg6ICgkc2NvcGUuZXhpYmVPcGNpb25haXMgPyAnMzAlJyA6ICc0NCUnKSB9LFxyXG5cdFx0XHRcdFx0eyBuYW1lOiAnbm9tZUZhbnRhc2lhJywgd2lkdGg6ICgkc2NvcGUuZXhpYmVPcGNpb25haXMgPyAnMjQlJyA6ICczMiUnKSB9LFxyXG5cdFx0XHRcdFx0eyBuYW1lOiAnY3BmQ25waicsIHdpZHRoOiAoJHNjb3BlLmV4aWJlT3BjaW9uYWlzID8gJzEwJScgOiAnMTglJykgfSxcclxuXHRcdFx0XHRcdHsgbmFtZTogJ3RlbGVmb25lJywgd2lkdGg6ICc4JScsIHZpc2libGU6ICRzY29wZS5leGliZU9wY2lvbmFpcyB9LFxyXG5cdFx0XHRcdFx0eyBuYW1lOiAnY2VsdWxhcicsIHdpZHRoOiAnOCUnLCB2aXNpYmxlOiAkc2NvcGUuZXhpYmVPcGNpb25haXMgfSxcclxuXHRcdFx0XHRcdHsgbmFtZTogJ2luZm9ybWFjb2VzQWRpY2lvbmFpcycsIHdpZHRoOiAnMTQlJywgdmlzaWJsZTogJHNjb3BlLmV4aWJlT3BjaW9uYWlzIH0sXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRvblJlZ2lzdGVyQXBpOiBmdW5jdGlvbiAoZ3JpZEFwaSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLmdyaWRBcGkgPSBncmlkQXBpO1xyXG5cdFx0XHRcdFx0Z3JpZEFwaS5wYWdpbmF0aW9uLm9uLnBhZ2luYXRpb25DaGFuZ2VkKCRzY29wZSxcclxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gKG5ld1BhZ2UsIHBhZ2VTaXplKSB7XHJcblx0XHRcdFx0XHRcdFx0cGFnaW5hdGlvbk9wdGlvbnMucGFnZU51bWJlciA9IG5ld1BhZ2U7XHJcblx0XHRcdFx0XHRcdFx0cGFnaW5hdGlvbk9wdGlvbnMucGFnZVNpemUgPSBwYWdlU2l6ZTtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuc2VhcmNoLm5ld1BhZ2UgPSBuZXdQYWdlO1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5zZWFyY2gucGFnZVNpemUgPSBwYWdlU2l6ZTtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuc2VhcmNoLnZlbmRlZG9yID0gQXV0aGVudGljYXRpb25TZXJ2aWNlLmlzVmVuZGVkb3IoKTtcclxuXHRcdFx0XHRcdFx0XHRzZXJ2aWNlLmNhcnJlZ2FDbGllbnRlcygkc2NvcGUuc2VhcmNoLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5ncmlkQ2xpZW50ZXMuZGF0YSA9IHJlc3BvbnNlLmNvbnRlbnQ7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0Z3JpZEFwaS5zZWxlY3Rpb24ub24ucm93U2VsZWN0aW9uQ2hhbmdlZCgkc2NvcGUsXHJcblx0XHRcdFx0XHRcdGZ1bmN0aW9uIChyb3cpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIXJvdy5pc1NlbGVjdGVkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuY2FuRWRpdENsaWVudGUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5jbGllbnRlU2VsZWNpb25hZG8gPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuY2FuRWRpdENsaWVudGUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmNsaWVudGVTZWxlY2lvbmFkbyA9IHJvdy5lbnRpdHk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCRzY29wZS5zZWFyY2gudmVuZGVkb3IgPSBBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNWZW5kZWRvcigpXHJcblx0XHRcdHNlcnZpY2UuY2FycmVnYUNsaWVudGVzKCRzY29wZS5zZWFyY2gsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdCRzY29wZS5ncmlkQ2xpZW50ZXMuZGF0YSA9IHJlc3BvbnNlLmNvbnRlbnQ7XHJcblx0XHRcdFx0c2VydmljZS5nZXRUb3RhbENsaWVudGVzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLmdyaWRDbGllbnRlcy50b3RhbEl0ZW1zID0gcmVzcG9uc2U7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkc2NvcGUuY2xpZW50ZVNlbGVjaW9uYWRvID0gbnVsbDtcclxuXHRcdFx0JHNjb3BlLmNhbkVkaXRDbGllbnRlID0gZmFsc2U7XHJcblxyXG5cdFx0XHQkc2NvcGUuZWRpdGFyQ2xpZW50ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRzZXJ2aWNlLmNsaWVudGVQYXJhRWRpdGFyID0gJHNjb3BlLmNsaWVudGVTZWxlY2lvbmFkb1xyXG5cdFx0XHRcdFN0b3JhZ2VTZXJ2aWNlLnNldEZpbHRyb0F0aXZvKCRzY29wZS5zZWFyY2gpXHJcblx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9jYWRhc3Ryb0NvbXBsZXRvQ2xpZW50ZScpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCRzY29wZS5yZW1vdmVyQ2xpZW50ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgbW9kYWxPcHRpb25zID0ge1xyXG5cdFx0XHRcdFx0Y2xvc2VCdXR0b25UZXh0OiAnTsOjbycsXHJcblx0XHRcdFx0XHRhY3Rpb25CdXR0b25UZXh0OiAnU2ltJyxcclxuXHRcdFx0XHRcdGhlYWRlclRleHQ6ICdDb25maXJtYXInLFxyXG5cdFx0XHRcdFx0Ym9keVRleHQ6ICdDb25maXJtYSBleGNsdXPDo28gZG8gY2xpZW50ZSAnICsgJHNjb3BlLmNsaWVudGVTZWxlY2lvbmFkby5yYXphb1NvY2lhbCArICc/J1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdE1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdFx0XHRzZXJ2aWNlLnJlbW92ZXJDbGllbnRlKCRzY29wZS5jbGllbnRlU2VsZWNpb25hZG8uaWQsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0XHRhbGVydCgnQ2xpZW50ZSAnICsgcmVzcG9uc2UucmF6YW9Tb2NpYWwgKyAnIGV4Y2x1w61kbyBjb20gc3VjZXNzbyEnKTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmZpbHRlcigpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCRzY29wZS5maWx0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0JHNjb3BlLnNlYXJjaC52ZW5kZWRvciA9IEF1dGhlbnRpY2F0aW9uU2VydmljZS5pc1ZlbmRlZG9yKClcclxuXHRcdFx0XHRzZXJ2aWNlLmNhcnJlZ2FDbGllbnRlcygkc2NvcGUuc2VhcmNoLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5ncmlkQ2xpZW50ZXMuZGF0YSA9IHJlc3BvbnNlLmNvbnRlbnQ7XHJcblx0XHRcdFx0XHRpZiAoJHNjb3BlLnNlYXJjaC5yYXphb1NvY2lhbC5sZW5ndGggPT0gMCAmJiAkc2NvcGUuc2VhcmNoLm5vbWVGYW50YXNpYS5sZW5ndGggPT0gMCAmJiAkc2NvcGUuc2VhcmNoLmNwZkNucGoubGVuZ3RoID09IDApIHtcclxuXHRcdFx0XHRcdFx0c2VydmljZS5nZXRUb3RhbENsaWVudGVzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5ncmlkQ2xpZW50ZXMudG90YWxJdGVtcyA9IHJlc3BvbnNlO1xyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmdyaWRDbGllbnRlcy50b3RhbEl0ZW1zID0gcmVzcG9uc2UuY29udGVudC5sZW5ndGg7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCRzY29wZS5wb3NzdWlQZXJtaXNzYW9FZGl0YXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKEF1dGhlbnRpY2F0aW9uU2VydmljZS5pc1ZlbmRlZG9yKCkpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCRzY29wZS5zZWxlY2lvbmFWZW5kZWRvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRDYWRhc3Ryb0NsaWVudGVzU2VydmljZS5nZXRSZXByZXNlbnRhY29lc1VzdWFyaW8oJHNjb3BlLnNlYXJjaC52ZW5kZWRvckZpbHRyby5pZCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0XHQkc2NvcGUuc2VhcmNoLmxpc3RhUmVwcmVzZW50YWNvZXMgPSByZXNwb25zZTtcclxuXHRcdFx0XHRcdCRzY29wZS5maWx0ZXIoKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuZGlyZWN0aXZlKCdmb2N1cycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHJlc3RyaWN0OiAnQScsXHJcblx0XHRcdFx0bGluazogZnVuY3Rpb24oJHNjb3BlLGVsZW0sYXR0cnMpIHtcclxuXHRcdFx0XHRcdGVsZW0uYmluZCgna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRcdFx0dmFyIGNvZGUgPSBlLmtleUNvZGUgfHwgZS53aGljaDtcclxuXHRcdFx0XHRcdFx0aWYgKGNvZGUgPT09IDEzKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly9lLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdFx0Ly9lbGVtLm5leHQoKS5mb2N1cygpO1xyXG5cdFx0XHRcdFx0XHRcdGVsZW0uYmx1cigpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pOyIsIid1c2Ugc3RyaWN0J1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ0NsaWVudGVzQ2FkYXN0cmFkb3MnKVxyXG5cclxuLmZhY3RvcnkoJ0NsaWVudGVzQ2FkYXN0cmFkb3NTZXJ2aWNlJywgWyAnJGh0dHAnLCAnJHJvb3RTY29wZScsICdOZXR3b3JrU2VydmljZScsICdOb3RpZmljYXRpb25TZXJ2aWNlJyxcclxuXHRmdW5jdGlvbigkaHR0cCwgJHJvb3RTY29wZSwgTmV0d29ya1NlcnZpY2UsIE5vdGlmaWNhdGlvblNlcnZpY2UpIHtcclxuXHRcdHZhciBzZXJ2aWNlID0ge307XHJcblx0XHRcclxuXHRcdHNlcnZpY2UuY2xpZW50ZVBhcmFFZGl0YXIgPSBudWxsO1xyXG5cdFx0XHJcblx0XHRzZXJ2aWNlLmNhcnJlZ2FDbGllbnRlcyA9IGZ1bmN0aW9uKGNsaWVudGVEdG8sIGNhbGxiYWNrKSB7XHJcblx0XHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBQb3N0KCcvZ2V0Q2xpZW50ZXNCeUZpbHRlcicsIGNsaWVudGVEdG8sICAocmVzdWx0LCBkYXRhKSA9PiB7XHJcblx0XHRcdFx0aWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULk9LKSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gYnVzY2FyIGRhZG9zIGRvcyBjbGllbnRlcycsIGRhdGEpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdOw6NvIGZvaSBwb3Nzw612ZWwgc2UgY29tdW5pY2FyIGNvbSBvIHNlcnZpZG9yLicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRzZXJ2aWNlLmdldENsaWVudGVzID0gZnVuY3Rpb24oY2xpZW50ZUR0bywgY2FsbGJhY2spIHtcclxuXHRcdFx0TmV0d29ya1NlcnZpY2UuaHR0cFBvc3QoJy9nZXRDbGllbnRlc0J5RmlsdGVyJywgY2xpZW50ZUR0bywgKHJlc3VsdCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soZGF0YSlcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciBkYWRvcyBkb3MgY2xpZW50ZXMnLCBkYXRhKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblxyXG5cdFx0c2VydmljZS5nZXRDbGllbnRlRXhpc3RlbnRlID0gZnVuY3Rpb24oY2xpZW50ZUV4aXN0ZW50ZVNlYXJjaER0bywgY2FsbGJhY2spIHtcclxuXHRcdFx0TmV0d29ya1NlcnZpY2UuaHR0cFBvc3QoJy9nZXRDbGllbnRlRXhpc3RlbnRlJywgY2xpZW50ZUV4aXN0ZW50ZVNlYXJjaER0bywgKHJlc3VsdCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soZGF0YSlcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciBkYWRvcyBkb3MgY2xpZW50ZXMnLCBkYXRhKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblxyXG5cdFx0c2VydmljZS5nZXRUb3RhbENsaWVudGVzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdFx0TmV0d29ya1NlcnZpY2UuaHR0cEdldCgnL2dldFRvdGFsQ2xpZW50ZXMnLCAocmVzdWx0LCBkYXRhKSA9PiB7XHJcblx0XHRcdFx0aWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULk9LKSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gYnVzY2FyIGRhZG9zIGRvcyBjbGllbnRlcycsIGRhdGEpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdOw6NvIGZvaSBwb3Nzw612ZWwgc2UgY29tdW5pY2FyIGNvbSBvIHNlcnZpZG9yLicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRzZXJ2aWNlLnJlbW92ZXJDbGllbnRlID0gZnVuY3Rpb24oaWRDbGllbnRlLCBjYWxsYmFjaykge1xyXG5cdFx0XHROZXR3b3JrU2VydmljZS5odHRwUG9zdCgnL2V4Y2x1aXJDbGllbnRlJywgaWRDbGllbnRlLCAocmVzdWx0LCBkYXRhKSA9PiB7XHJcblx0XHRcdFx0aWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULk9LKSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gYnVzY2FyIGRhZG9zIGRvcyBjbGllbnRlcycsIGRhdGEpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdOw6NvIGZvaSBwb3Nzw612ZWwgc2UgY29tdW5pY2FyIGNvbSBvIHNlcnZpZG9yLicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c2VydmljZS5nZXROdW1lcm9DbGllbnRlc1BlbmRlbnRlcyA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBHZXQoJy9nZXROdW1lcm9DbGllbnRlc1BlbmRlbnRlcycsIChyZXN1bHQsIGRhdGEpID0+IHtcclxuXHRcdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKGRhdGEpXHJcblx0XHRcdFx0fSBlbHNlIGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5FUlJPUikge1xyXG5cdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBidXNjYXIgZGFkb3MgZG9zIGNsaWVudGVzJywgZGF0YSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ07Do28gZm9pIHBvc3PDrXZlbCBzZSBjb211bmljYXIgY29tIG8gc2Vydmlkb3IuJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vVkVSSUZJQ0FSIENPTU8gVFJBQkFMSEFSIFVTQU5ETyBORVRXT1JLU0VSVklDRVxyXG5cdFx0c2VydmljZS5nZXRDbGllbnRlcyA9IGZ1bmN0aW9uKGNsaWVudGVEdG8pIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoTU9ET19IVFRQICsgVVJMICsgJy9nZXRDbGllbnRlc0J5RmlsdGVyLycsIGNsaWVudGVEdG8pXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBzZXJ2aWNlO1xyXG59XSk7IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnR2VyZW5jaWFkb3JGaW5hbmNlaXJvRmxlY2hhVmVuZGFzJykuZmFjdG9yeSgnQ29uc29sZVNlcnZpY2UnLCBbXHJcblx0JyRodHRwJyxcclxuXHQnJHJvb3RTY29wZScsXHJcblx0Y29uc3RydWN0b3IsXHJcbl0pXHJcblxyXG5mdW5jdGlvbiBjb25zdHJ1Y3RvcigkaHR0cCwgJHJvb3RTY29wZSkge1xyXG5cdHZhciBzZXJ2aWNlID0ge307XHJcblxyXG5cdHNlcnZpY2Uuc3RhcnRMb2cgPSBmdW5jdGlvbigpIHtcclxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VyZWFkeVwiLCBvbkRldmljZVJlYWR5LCBmYWxzZSk7XHJcblx0XHRmdW5jdGlvbiBvbkRldmljZVJlYWR5KCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcImNvbnNvbGUubG9nIHdvcmtzIHdlbGxcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2VydmljZTtcclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ01lbnUnKVxyXG4uY29udHJvbGxlcignTWVudUNvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsICckaHR0cCcsJ01lbnVTZXJ2aWNlJywgJ0F1dGhlbnRpY2F0aW9uU2VydmljZScsICdQZWRpZG9TZXJ2aWNlJywgJ1N0b3JhZ2VTZXJ2aWNlJywgJ0NsaWVudGVzQ2FkYXN0cmFkb3NTZXJ2aWNlJywgJ05ldHdvcmtTZXJ2aWNlJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRsb2NhdGlvbiwgJGh0dHAsIE1lbnVTZXJ2aWNlLCBBdXRoZW50aWNhdGlvblNlcnZpY2UsIFBlZGlkb1NlcnZpY2UsIFN0b3JhZ2VTZXJ2aWNlLCBDbGllbnRlc0NhZGFzdHJhZG9zU2VydmljZSwgTmV0d29ya1NlcnZpY2UpIHtcclxuXHR2YXIgaWRVc3VhcmlvID0gJHJvb3RTY29wZS5nbG9iYWxzLmN1cnJlbnRVc2VyLmlkO1xyXG5cdFxyXG5cdCRzY29wZS5leGliaXJQZWRpZG9zRW52aWFkb3MgPSBBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNNYXN0ZXIoKVxyXG5cdCRzY29wZS5leGliaXJQZWRpZG9zTmVnYWRvcyA9IEF1dGhlbnRpY2F0aW9uU2VydmljZS5pc1ZlbmRlZG9yKClcclxuXHQkc2NvcGUuZXhpYmlyQ2xpZW50ZXNQZW5kZW50ZXMgPSBBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNNYXN0ZXIoKVxyXG5cdCRzY29wZS5pc01vYmlsZSA9IE5ldHdvcmtTZXJ2aWNlLmlzTW9iaWxlKClcclxuXHRcclxuXHRQZWRpZG9TZXJ2aWNlLmdldE51bWVyb1BlZGlkb3NFbnZpYWRvcyhmdW5jdGlvbihyZXN1bHQpIHtcclxuXHRcdCRzY29wZS5nZXROdW1lcm9QZWRpZG9zRW52aWFkb3MgPSByZXN1bHQ7XHJcblx0fSlcclxuXHRcclxuXHRQZWRpZG9TZXJ2aWNlLmdldE51bWVyb1BlZGlkb3NOZWdhZG9zKEF1dGhlbnRpY2F0aW9uU2VydmljZS5nZXRVc3VhcmlvKCkuaWQsIGZ1bmN0aW9uKHJlc3VsdCkge1xyXG5cdFx0JHNjb3BlLmdldE51bWVyb1BlZGlkb3NOZWdhZG9zID0gcmVzdWx0O1xyXG5cdH0pXHJcblx0XHJcblx0JHNjb3BlLmdldE51bWVyb1BlZGlkb3NTYWx2b3MgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmKFN0b3JhZ2VTZXJ2aWNlLmdldFBlZGlkb3NTYWx2bygpKSB7XHJcblx0XHRcdHJldHVybiBTdG9yYWdlU2VydmljZS5nZXRQZWRpZG9zU2Fsdm8oKS5sZW5ndGhcclxuXHRcdH1cclxuXHRcdHJldHVybiB1bmRlZmluZWRcclxuXHR9XHJcblx0XHJcblx0Q2xpZW50ZXNDYWRhc3RyYWRvc1NlcnZpY2UuZ2V0TnVtZXJvQ2xpZW50ZXNQZW5kZW50ZXMoZnVuY3Rpb24ocmVzdWx0KSB7XHJcblx0XHQkc2NvcGUuZ2V0TnVtZXJvQ2xpZW50ZXNQZW5kZW50ZXMgPSByZXN1bHRcclxuXHR9KVxyXG5cdFxyXG5cdCRzY29wZS5ub21lVXN1YXJpbyA9ICRyb290U2NvcGUuZ2xvYmFscy5jdXJyZW50VXNlci51c2VyLm5vbWU7XHJcblx0XHJcblx0JHNjb3BlLm5vdm9QZWRpZG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdE1lbnVTZXJ2aWNlLnNldE1vZG9DYWRhc3RybygpO1xyXG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9pbmR1c3RyaWFzJyk7XHJcblx0fVxyXG5cdFxyXG5cdCRzY29wZS5leGliZUNsaWVudGVzUGVuZGVudGVzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRjb25zdCBzZWFyY2ggPSB7XHJcblx0XHRcdHJhemFvU29jaWFsOiBcIlwiLFxyXG5cdFx0XHRub21lRmFudGFzaWE6IFwiXCIsXHJcblx0XHRcdGNwZkNucGo6IFwiXCIsXHJcblx0XHRcdG5ld1BhZ2U6IDEsXHJcblx0XHRcdHBhZ2VTaXplOiAxMCxcclxuXHRcdFx0aWRVc3VhcmlvOiBBdXRoZW50aWNhdGlvblNlcnZpY2UuZ2V0VXN1YXJpbygpLmlkLFxyXG5cdFx0XHR2ZW5kZWRvckZpbHRybzogdW5kZWZpbmVkLFxyXG5cdFx0XHRwZW5kZW50ZVJlZ2lzdHJvOiB0cnVlLFxyXG5cdFx0fTtcclxuXHRcdFN0b3JhZ2VTZXJ2aWNlLnNldEZpbHRyb0F0aXZvKHNlYXJjaClcclxuXHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdGFDbGllbnRlcycpO1xyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUuaXNQZXJtaXNzYW9BZG1pbmlzdHJhZG9yID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gQXV0aGVudGljYXRpb25TZXJ2aWNlLmlzQWRtaW5pc3RyYWRvcigpO1xyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUuaXNQZXJtaXNzYW9NYXN0ZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNNYXN0ZXIoKTtcclxuXHR9XHJcblx0XHJcblx0JHNjb3BlLmlzUGVybWlzc2FvVmVuZGVkb3IgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNWZW5kZWRvcigpO1xyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUuZXhpYmlyRGV0YWxoZVBlZGlkbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0TWVudVNlcnZpY2Uuc2V0TW9kb0RldGFsaGUoKTtcclxuXHRcdCRsb2NhdGlvbi5wYXRoKCcvaW5kdXN0cmlhcycpO1xyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUuZXhpYmlyQ2FkYXN0cm9UYWJlbGEgPSBmdW5jdGlvbigpIHtcclxuXHRcdE1lbnVTZXJ2aWNlLm1vZG9UYWJlbGEoKTtcclxuXHRcdCRsb2NhdGlvbi5wYXRoKCcvaW5kdXN0cmlhcycpO1xyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUubm92b0NhZGFzdHJvQ2xpZW50ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9jYWRhc3Ryb0NvbXBsZXRvQ2xpZW50ZScpO1xyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUubW9kdWxvRXh0ZXJubyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0TWVudVNlcnZpY2UubW9kbyA9IDI7XHJcblx0fVxyXG5cdFxyXG5cdCRzY29wZS5tb2R1bG9JbnRlcm5vID0gZnVuY3Rpb24oKSB7XHJcblx0XHRNZW51U2VydmljZS5tb2RvID0gMTtcclxuXHR9XHJcblx0XHJcblx0JHNjb3BlLmV4aWJlUGVkaWRvc0VudmlhZG9zID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgcGVkaWRvU2VhcmNoID0ge1xyXG5cdFx0XHRcdGlkSW5kdXN0cmlhIDogbnVsbCxcclxuXHRcdFx0XHRpZFVzdWFyaW8gOiBudWxsLFxyXG5cdFx0XHRcdGlkU3RhdHVzIDogU1RBVFVTX1BFRElETy5FTlZJQURPLFxyXG5cdFx0XHRcdG5ld1BhZ2U6IFBBR0lOQUNBTy5QRURJRE8uTkVXX1BBR0UsXHJcblx0XHRcdFx0cGFnZVNpemU6IFBBR0lOQUNBTy5QRURJRE8uUEFHRV9TSVpFXHJcblx0XHRcdH07XHJcblx0XHRTdG9yYWdlU2VydmljZS5zZXRGaWx0cm9QZWRpZG9BdGl2byhwZWRpZG9TZWFyY2gpXHJcblx0XHQkbG9jYXRpb24ucGF0aCgnL2RldGFsaGVQZWRpZG8nKTtcclxuXHR9XHJcblx0XHJcblx0JHNjb3BlLmV4aWJlUGVkaWRvc05lZ2Fkb3MgPSBmdW5jdGlvbigpIHtcclxuXHRcdGxldCBwZWRpZG9TZWFyY2ggPSB7XHJcblx0XHRcdFx0aWRJbmR1c3RyaWEgOiBudWxsLFxyXG5cdFx0XHRcdGlkVXN1YXJpbyA6IG51bGwsXHJcblx0XHRcdFx0aWRTdGF0dXMgOiBTVEFUVVNfUEVESURPLk5FR0FETyxcclxuXHRcdFx0XHRuZXdQYWdlOiBQQUdJTkFDQU8uUEVESURPLk5FV19QQUdFLFxyXG5cdFx0XHRcdHBhZ2VTaXplOiBQQUdJTkFDQU8uUEVESURPLlBBR0VfU0laRVxyXG5cdFx0XHR9O1xyXG5cdFx0U3RvcmFnZVNlcnZpY2Uuc2V0RmlsdHJvUGVkaWRvQXRpdm8ocGVkaWRvU2VhcmNoKVxyXG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9kZXRhbGhlUGVkaWRvJyk7XHJcblx0fVxyXG5cdFxyXG5cdCRzY29wZS5leGliZVBlZGlkb3NBdGl2byA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9wZWRpZG8nKTtcclxuXHR9XHJcblx0XHJcblx0JHNjb3BlLmV4aWJlUGVkaWRvc1NhbHZvcyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9kZXRhbGhlUGVkaWRvU2Fsdm8nKTtcclxuXHR9XHJcblx0XHJcblx0JHNjb3BlLmV4aWJpclBlZGlkb3NTYWx2b3MgPSBmdW5jdGlvbigpIHtcclxuXHRcdGxldCBwZWRpZG9zU2Fsdm9zID0gU3RvcmFnZVNlcnZpY2UuZ2V0UGVkaWRvc1NhbHZvKClcclxuXHRcdHJldHVybiBwZWRpZG9zU2Fsdm9zICE9PSBudWxsXHJcblx0fVxyXG5cdFxyXG5cdCRzY29wZS5wZWRpZG9BdGl2byA9IFBlZGlkb1NlcnZpY2UuZ2V0UGVkaWRvQXRpdm8oKTtcclxufV0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnTWVudScpXHJcblxyXG4uZmFjdG9yeSgnTWVudVNlcnZpY2UnLCBbJyRodHRwJywgJyRyb290U2NvcGUnLCBcclxuICAgIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlKXtcclxuXHRcdHZhciBzZXJ2aWNlID0ge307XHJcblx0XHQvKm1vZG8gPSAxIDogQ2FkYXN0cm8qL1xyXG5cdFx0Lyptb2RvID0gMiA6IERldGFsaGUqL1xyXG5cdFx0Lyptb2RvID0gMyA6IFRhYmVsYSAqL1xyXG5cdFx0c2VydmljZS5tb2RvID0gbnVsbDtcclxuXHRcdFxyXG5cdFx0c2VydmljZS5tb2RvQ2FkYXN0cm8gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHNlcnZpY2UubW9kbyA9PSAxO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzZXJ2aWNlLm1vZG9EZXRhbGhlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBzZXJ2aWNlLm1vZG8gPT0gMjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c2VydmljZS5tb2RvVGFiZWxhID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBzZXJ2aWNlLm1vZG8gPT0gMztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c2VydmljZS5zZXRNb2RvQ2FkYXN0cm8gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHNlcnZpY2UubW9kbyA9IDE7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHNlcnZpY2Uuc2V0TW9kb0RldGFsaGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHNlcnZpY2UubW9kbyA9IDI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHNlcnZpY2Uuc2V0TW9kb1RhYmVsYSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gc2VydmljZS5tb2RvID0gMztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHNlcnZpY2U7XHJcblx0fVxyXG5dKTsiLCIndXNlIHN0cmljdCdcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdHZXJlbmNpYWRvckZpbmFuY2Vpcm9GbGVjaGFWZW5kYXMnKS5mYWN0b3J5KCdEYXRhYmFzZVNlcnZpY2UnLCBbXHJcblx0JyRodHRwJyxcclxuXHQnJHJvb3RTY29wZScsXHJcblx0Y29uc3RydWN0b3IsXHJcbl0pXHJcblxyXG5mdW5jdGlvbiBjb25zdHJ1Y3RvcigkaHR0cCwgJHJvb3RTY29wZSkge1xyXG5cdHZhciBzZXJ2aWNlID0ge307XHJcblxyXG5cdHNlcnZpY2Uuc3RhcnREYXRhYmFzZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlcmVhZHknLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGRiID0gd2luZG93LnNxbGl0ZVBsdWdpbi5vcGVuRGF0YWJhc2Uoe25hbWU6ICd0ZXN0LmRiJywgbG9jYXRpb246ICdkZWZhdWx0J30pO1xyXG5cdFx0XHRhbGVydChkYilcclxuXHRcdFx0ZGIudHJhbnNhY3Rpb24oZnVuY3Rpb24odHIpIHtcclxuXHRcdFx0XHR0ci5leGVjdXRlU3FsKCdTRUxFQ1QgdXBwZXIoPykgQVMgdXBwZXJTdHJpbmcnLCBbJ1Rlc3Qgc3RyaW5nJ10sIGZ1bmN0aW9uKHRyLCBycykge1xyXG5cdFx0XHRcdFx0YWxlcnQoJ0dvdCB1cHBlclN0cmluZyByZXN1bHQ6ICcgKyBycy5yb3dzLml0ZW0oMCkudXBwZXJTdHJpbmcpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvKSB7XHJcblx0XHRcdFx0YWxlcnQoJ2Vycm9yIGFvIGFicmlyIGRhYmFhc2UnKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcbn0iLCIndXNlIHN0cmljdCdcclxuYW5ndWxhci5tb2R1bGUoJ0RldGFsaGVQZWRpZG8nKS5jb250cm9sbGVyKCdEZXRhbGhlUGVkaWRvQ29udHJvbGxlcicsIFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJHJvb3RTY29wZScsXHJcblx0JyRsb2NhdGlvbicsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlJyxcclxuXHQnRGV0YWxoZVBlZGlkb1NlcnZpY2UnLFxyXG5cdCdJbmR1c3RyaWFzU2VydmljZScsXHJcblx0J1BlZGlkb1NlcnZpY2UnLFxyXG5cdCdQZWRpZG9Qcm9kdXRvc1NlcnZpY2UnLFxyXG5cdCdNZW51U2VydmljZScsXHJcblx0J0F1dGhlbnRpY2F0aW9uU2VydmljZScsXHJcblx0J0NhZGFzdHJvQ2xpZW50ZXNTZXJ2aWNlJyxcclxuXHQnTWFwcGVyU2VydmljZScsXHJcblx0J1N0b3JhZ2VTZXJ2aWNlJyxcclxuXHQnTW9kYWxTZXJ2aWNlJyxcclxuXHQnQ2xpZW50ZXNDYWRhc3RyYWRvc1NlcnZpY2UnLFxyXG5cdCdPYnNlcnZhY2FvU2VydmljZScsXHJcblx0J05vdGlmaWNhdGlvblNlcnZpY2UnLFxyXG5cdGNvbnN0cnVjdG9yLFxyXG5dKVxyXG5cclxuZnVuY3Rpb24gY29uc3RydWN0b3IoJHNjb3BlLFxyXG5cdCRyb290U2NvcGUsXHJcblx0JGxvY2F0aW9uLFxyXG5cdCRodHRwLFxyXG5cdCRyb3V0ZSxcclxuXHRzZXJ2aWNlLFxyXG5cdEluZHVzdHJpYXNTZXJ2aWNlLFxyXG5cdFBlZGlkb1NlcnZpY2UsXHJcblx0UGVkaWRvUHJvZHV0b3NTZXJ2aWNlLFxyXG5cdE1lbnVTZXJ2aWNlLFxyXG5cdEF1dGhlbnRpY2F0aW9uU2VydmljZSxcclxuXHRDYWRhc3Ryb0NsaWVudGVzU2VydmljZSxcclxuXHRNYXBwZXJTZXJ2aWNlLFxyXG5cdFN0b3JhZ2VTZXJ2aWNlLFxyXG5cdE1vZGFsU2VydmljZSxcclxuXHRDbGllbnRlc0NhZGFzdHJhZG9zU2VydmljZSxcclxuXHRPYnNlcnZhY2FvU2VydmljZSxcclxuXHROb3RpZmljYXRpb25TZXJ2aWNlKSB7XHJcblxyXG5cclxuXHR2YXIgdXN1YXJpbyA9ICRyb290U2NvcGUuZ2xvYmFscy5jdXJyZW50VXNlci51c2VyO1xyXG5cclxuXHQkc2NvcGUuY2xpZW50ZSA9IHtcclxuXHRcdHNlbGVjaW9uYWRvOiB1bmRlZmluZWRcclxuXHR9XHJcblxyXG5cdGxldCBfcmVzdWx0YWRvQnVzY2EgPSB1bmRlZmluZWRcclxuXHQkc2NvcGUucGFnaW5hQXR1YWwgPSAwXHJcblx0JHNjb3BlLnRvdGFsUGFnaW5hcyA9IDBcclxuXHJcblx0JHNjb3BlLmNhbkVkaXRQZWRpZG8gPSBmYWxzZTtcclxuXHQkc2NvcGUucGVkaWRvU2VsZWNpb25hZG8gPSB1bmRlZmluZWQ7XHJcblxyXG5cdCRzY29wZS5leGliZU9wY2lvbmFpcyA9IGlubmVyV2lkdGggPiA3MDAgPyB0cnVlIDogZmFsc2U7XHJcblxyXG5cdEluZHVzdHJpYXNTZXJ2aWNlLmdldEluZHVzdHJpYXNVc3VhcmlvKHVzdWFyaW8uaWQsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0JHNjb3BlLmluZHVzdHJpYXMgPSByZXNwb25zZTtcclxuXHR9KVxyXG5cclxuXHQkc2NvcGUuYnVzY2FDbGllbnRlcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YXIgc2VhcmNoT2JqID0ge1xyXG5cdFx0XHRpZFVzdWFyaW8gOiB1c3VhcmlvLmlkLFxyXG5cdFx0XHRyYXphb1NvY2lhbDogdmFsdWUsXHJcblx0XHRcdG5ld1BhZ2U6IDEsXHJcblx0XHRcdHBhZ2VTaXplOiA2XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gQ2xpZW50ZXNDYWRhc3RyYWRvc1NlcnZpY2UuZ2V0Q2xpZW50ZXMoc2VhcmNoT2JqKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhLmNvbnRlbnRcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUuc2VsZWN0Q2xpZW50ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdCRzY29wZS5wZWRpZG9TZWFyY2guaWRDbGllbnRlID0gaXRlbS5pZFxyXG5cdFx0YnVzY2FQZWRpZG9zKClcclxuXHR9XHJcblxyXG5cdGxldCBmaWx0cm9QZWRpZG8gPSBTdG9yYWdlU2VydmljZS5nZXRGaWx0cm9QZWRpZG9BdGl2bygpXHJcblx0aWYgKGZpbHRyb1BlZGlkbykge1xyXG5cdFx0JHNjb3BlLnBlZGlkb1NlYXJjaCA9IGZpbHRyb1BlZGlkb1xyXG5cdH0gZWxzZSB7XHJcblx0XHQkc2NvcGUucGVkaWRvU2VhcmNoID0ge1xyXG5cdFx0XHRpZEluZHVzdHJpYTogbnVsbCxcclxuXHRcdFx0aWRVc3VhcmlvOiBudWxsLFxyXG5cdFx0XHRpZFN0YXR1czogbnVsbCxcclxuXHRcdFx0ZHRJbmljaW86IG51bGwsXHJcblx0XHRcdGR0RmltOiBudWxsLFxyXG5cdFx0XHRpZENsaWVudGU6IG51bGwsXHJcblx0XHRcdG5ld1BhZ2U6IFBBR0lOQUNBTy5QRURJRE8uTkVXX1BBR0UsXHJcblx0XHRcdHBhZ2VTaXplOiBQQUdJTkFDQU8uUEVESURPLlBBR0VfU0laRVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGlmIChBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNWZW5kZWRvcigpKSB7XHJcblx0XHQkc2NvcGUudmVuZGVkb3IgPSB1c3VhcmlvO1xyXG5cdFx0JHNjb3BlLnBlZGlkb1NlYXJjaC5pZFVzdWFyaW8gPSB1c3VhcmlvLmlkO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRDYWRhc3Ryb0NsaWVudGVzU2VydmljZS5idXNjYVZlbmRlZG9yZXMoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdCRzY29wZS52ZW5kZWRvcmVzID0gcmVzcG9uc2U7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdCRzY29wZS5zdGF0dXNQZWRpZG8gPSB1bmRlZmluZWQ7XHJcblx0c2VydmljZS5nZXRMaXN0YVN0YXR1c1BlZGlkbygocmVzcG9uc2UpID0+IHtcclxuXHRcdCRzY29wZS5saXN0YVN0YXR1c1BlZGlkbyA9IHJlc3BvbnNlO1xyXG5cdFx0aWYgKCRzY29wZS5wZWRpZG9TZWFyY2guaWRTdGF0dXMpIHtcclxuXHRcdFx0JHNjb3BlLmxpc3RhU3RhdHVzUGVkaWRvLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcblx0XHRcdFx0aWYgKGl0ZW0uaWQgPT09ICRzY29wZS5wZWRpZG9TZWFyY2guaWRTdGF0dXMpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5zdGF0dXNQZWRpZG8gPSBpdGVtXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0dmFyIHBhZ2luYXRpb25PcHRpb25zID0ge1xyXG5cdFx0cGFnZU51bWJlcjogUEFHSU5BQ0FPLlBFRElETy5ORVdfUEFHRSxcclxuXHRcdHBhZ2VTaXplOiBQQUdJTkFDQU8uUEVESURPLlBBR0VfU0laRSxcclxuXHRcdHNvcnQ6IG51bGxcclxuXHR9O1xyXG5cclxuXHQvKiBGSUxUUk9TIERFIFBFU1FVSVNBICovXHJcblx0JHNjb3BlLnNlbGVjaW9uYUluZHVzdHJpYSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGJ1c2NhUGVkaWRvcygpXHJcblx0fVxyXG5cclxuXHQkc2NvcGUuc2VsZWNpb25hVmVuZGVkb3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRidXNjYVBlZGlkb3MoKVxyXG5cdH1cclxuXHJcblx0JHNjb3BlLnNlbGVjaW9uYURhdGEgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRidXNjYVBlZGlkb3MoKTtcclxuXHR9XHJcblxyXG5cdCRzY29wZS5saW1wYUZpbHRybyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdCRzY29wZS5wZWRpZG9TZWFyY2ggPSB7XHJcblx0XHRcdGlkSW5kdXN0cmlhOiBudWxsLFxyXG5cdFx0XHRpZFVzdWFyaW86ICRzY29wZS5pc1ZlbmRlZG9yKCkgPyB1c3VhcmlvLmlkIDogbnVsbCxcclxuXHRcdFx0aWRTdGF0dXM6IG51bGwsXHJcblx0XHRcdGR0SW5pY2lvOiBudWxsLFxyXG5cdFx0XHRkdEZpbTogbnVsbCxcclxuXHRcdFx0aWRDbGllbnRlOiBudWxsLFxyXG5cdFx0XHRuZXdQYWdlOiBQQUdJTkFDQU8uUEVESURPLk5FV19QQUdFLFxyXG5cdFx0XHRwYWdlU2l6ZTogUEFHSU5BQ0FPLlBFRElETy5QQUdFX1NJWkVcclxuXHRcdH07XHJcblx0XHQkc2NvcGUuc3RhdHVzUGVkaWRvID0gdW5kZWZpbmVkXHJcblx0XHQkc2NvcGUuY2xpZW50ZS5zZWxlY2lvbmFkbyA9IHVuZGVmaW5lZFxyXG5cdFx0YnVzY2FQZWRpZG9zKClcclxuXHRcdFN0b3JhZ2VTZXJ2aWNlLnJlc2V0RmlsdHJvUGVkaWRvQXRpdm8oKVxyXG5cdH1cclxuXHJcblx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5cdCRzY29wZS5zZWxlY2lvbmFTdGF0dXMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoJHNjb3BlLnN0YXR1c1BlZGlkbykge1xyXG5cdFx0XHQkc2NvcGUucGVkaWRvU2VhcmNoLmlkU3RhdHVzID0gJHNjb3BlLnN0YXR1c1BlZGlkby5pZFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JHNjb3BlLnBlZGlkb1NlYXJjaC5pZFN0YXR1cyA9IG51bGxcclxuXHRcdH1cclxuXHRcdGlmIChTdG9yYWdlU2VydmljZS5nZXRGaWx0cm9QZWRpZG9BdGl2bygpKSB7XHJcblx0XHRcdFN0b3JhZ2VTZXJ2aWNlLnJlc2V0RmlsdHJvUGVkaWRvQXRpdm8oKVxyXG5cdFx0fVxyXG5cdFx0YnVzY2FQZWRpZG9zKCk7XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuc2VsZWNpb25hSWRQZWRpZG8gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRidXNjYVBlZGlkb3MoKVxyXG5cdH1cclxuXHJcblx0JHNjb3BlLmlzVmVuZGVkb3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gQXV0aGVudGljYXRpb25TZXJ2aWNlLmlzVmVuZGVkb3IoKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1c2NhUGVkaWRvcygpIHtcclxuXHRcdFN0b3JhZ2VTZXJ2aWNlLnNldEZpbHRyb1BlZGlkb0F0aXZvKCRzY29wZS5wZWRpZG9TZWFyY2gpXHJcblx0XHQkc2NvcGUucGVkaWRvU2VhcmNoLmlzVmVuZGVkb3IgPSAkc2NvcGUuaXNWZW5kZWRvcigpXHJcblx0XHRzZXJ2aWNlLmJ1c2NhUGVkaWRvcygkc2NvcGUucGVkaWRvU2VhcmNoLCAocmVzcG9uc2UpID0+IHtcclxuXHRcdFx0X3Jlc3VsdGFkb0J1c2NhID0gcmVzcG9uc2VcclxuXHRcdFx0JHNjb3BlLnRvdGFsUGFnaW5hcyA9IHJlc3BvbnNlLnRvdGFsUGFnZXNcclxuXHRcdFx0JHNjb3BlLnBhZ2luYUF0dWFsID0gcmVzcG9uc2UubnVtYmVyICsgMVxyXG5cdFx0XHQkc2NvcGUucGVkaWRvcyA9IHJlc3BvbnNlLmNvbnRlbnRcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0YnVzY2FQZWRpZG9zKCk7XHJcblxyXG5cdCRzY29wZS5nZXRTdGF0dXMgPSBmdW5jdGlvbiAoaSkge1xyXG5cdFx0c3dpdGNoIChpKSB7XHJcblx0XHRcdGNhc2UgMDpcclxuXHRcdFx0XHRyZXR1cm4gXCJJbmRlZmluaWRvXCI7XHJcblx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRyZXR1cm4gXCJDcmlhZG9cIjtcclxuXHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdHJldHVybiBcIlNhbHZvXCI7XHJcblx0XHRcdGNhc2UgMzpcclxuXHRcdFx0XHRyZXR1cm4gXCJFbnZpYWRvXCI7XHJcblx0XHRcdGNhc2UgNDpcclxuXHRcdFx0XHRyZXR1cm4gXCJOZWdhZG9cIjtcclxuXHRcdFx0Y2FzZSA1OlxyXG5cdFx0XHRcdHJldHVybiBcIkNvbG9jYWRvXCI7XHJcblx0XHRcdGNhc2UgNjpcclxuXHRcdFx0XHRyZXR1cm4gXCJDYW5jZWxhZG9cIjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdCRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuXHRcdHJldHVybiBuZXcgRGF0ZShkYXRlKS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1CUlwiKVxyXG5cdH1cclxuXHJcblx0LyogREVUQUxIQVIgUEVESURPICovXHJcblx0JHNjb3BlLmV4aWJlRGV0YWxoZXNQZWRpZG8gPSBmdW5jdGlvbiAoaWRQZWRpZG8pIHtcclxuXHRcdGlmICghaWRQZWRpZG8pIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblx0XHRQZWRpZG9TZXJ2aWNlLmdldFBlZGlkbyhpZFBlZGlkbywgKHJlc3VsdCkgPT4ge1xyXG5cdFx0XHRsZXQgcGVkaWRvQ29tcGxldG8gPSByZXN1bHRcclxuXHRcdFx0c2VydmljZS5zZXRQZWRpZG8ocGVkaWRvQ29tcGxldG8pO1xyXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2RldGFsaGVQZWRpZG9JdGVucycpXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0LyogRURJVEFSIFBFRElETyAqL1xyXG5cdCRzY29wZS5lZGl0YXJQZWRpZG8gPSBmdW5jdGlvbiAoaWRQZWRpZG8pIHtcclxuXHRcdGlmICghaWRQZWRpZG8pIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblx0XHRTdG9yYWdlU2VydmljZS5zZXRGaWx0cm9QZWRpZG9BdGl2bygkc2NvcGUucGVkaWRvU2VhcmNoKVxyXG5cdFx0UGVkaWRvU2VydmljZS5nZXRQZWRpZG8oaWRQZWRpZG8sIChyZXN1bHQpID0+IHtcclxuXHRcdFx0UGVkaWRvU2VydmljZS5wZWRpZG9QYXJhRWRpdGFyID0gcmVzdWx0O1xyXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL3BlZGlkbycpO1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdC8qIENBTkNFTEFSIFBFRElETyAqL1xyXG5cdCRzY29wZS5jYW5jZWxhclBlZGlkbyA9IGZ1bmN0aW9uIChsaXN0YWdlbVBlZGlkb0R0bykge1xyXG5cdFx0dmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuXHRcdFx0Y2xvc2VCdXR0b25UZXh0OiAnTsOjbycsXHJcblx0XHRcdGFjdGlvbkJ1dHRvblRleHQ6ICdTaW0nLFxyXG5cdFx0XHRoZWFkZXJUZXh0OiAnQ29uZmlybWFyJyxcclxuXHRcdFx0Ym9keVRleHQ6ICdDb25maXJtYSBDQU5DRUxBTUVOVE8gZG8gcGVkaWRvIHBhcmEgbyBjbGllbnRlICcgKyBsaXN0YWdlbVBlZGlkb0R0by5ub21lQ2xpZW50ZSArICcgPydcclxuXHRcdH07XHJcblx0XHRNb2RhbFNlcnZpY2Uuc2hvd01vZGFsKHt9LCBtb2RhbE9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG5cdFx0XHRQZWRpZG9TZXJ2aWNlLmdldFBlZGlkbyhsaXN0YWdlbVBlZGlkb0R0by5pZFBlZGlkbywgKHBlZGlkb0R0bykgPT4ge1xyXG5cdFx0XHRcdHBlZGlkb0R0by5zdGF0dXNQZWRpZG8gPSBTVEFUVVNfUEVESURPLkNBTkNFTEFET1xyXG5cdFx0XHRcdFBlZGlkb1NlcnZpY2Uuc2FsdmFQZWRpZG8ocGVkaWRvRHRvLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLnN1Y2Nlc3MoXCJQZWRpZG8gY2FuY2VsYWRvIGNvbSBzdWNlc3NvIVwiKVxyXG5cdFx0XHRcdFx0JHJvdXRlLnJlbG9hZCgpXHJcblx0XHRcdFx0fSksIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoXCJFcnJvIGFvIGNhbmNlbGFyIHBlZGlkbyFcIilcclxuXHRcdFx0XHRcdCRyb3V0ZS5yZWxvYWQoKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLnBvZGVFZGl0YXIgPSBmdW5jdGlvbiAobGlzdGFnZW1QZWRpZG9EdG8pIHtcclxuXHRcdGlmICghbGlzdGFnZW1QZWRpZG9EdG8pIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbGlzdGFnZW1QZWRpZG9EdG8uc3RhdHVzID09PSBTVEFUVVNfUEVESURPLk5FR0FETyAmJiBsaXN0YWdlbVBlZGlkb0R0by5pZFZlbmRlZG9yID09PSB1c3VhcmlvLmlkO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLm11ZGFQYWdpbmEgPSAocGFnaW5hKSA9PiB7XHJcblx0XHQkc2NvcGUucGVkaWRvU2VhcmNoLm5ld1BhZ2UgPSBwYWdpbmE7XHJcblx0XHRidXNjYVBlZGlkb3MoKTtcclxuXHR9XHJcblxyXG5cdCRzY29wZS5wcm94aW1hUGFnaW5hID0gKCkgPT4ge1xyXG5cdFx0aWYgKF9yZXN1bHRhZG9CdXNjYS5sYXN0ID09IHRydWUpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblx0XHQkc2NvcGUucGVkaWRvU2VhcmNoLm5ld1BhZ2UgKz0gMTtcclxuXHRcdGJ1c2NhUGVkaWRvcygpO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLmFudGVyaW9yUGFnaW5hID0gKCkgPT4ge1xyXG5cdFx0aWYgKF9yZXN1bHRhZG9CdXNjYS5maXJzdCA9PSB0cnVlKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cdFx0JHNjb3BlLnBlZGlkb1NlYXJjaC5uZXdQYWdlIC09IDE7XHJcblx0XHRidXNjYVBlZGlkb3MoKTtcclxuXHR9XHJcblxyXG5cdCRzY29wZS5nZXRUb3RhbFBlZGlkb1NlbVN0ID0gKHBlZGlkbykgPT4ge1xyXG5cdFx0cmV0dXJuIHNlcnZpY2UuZ2V0VG90YWxQZWRpZG9TZW1TdChwZWRpZG8pXHJcblx0fVxyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdEZXRhbGhlUGVkaWRvJylcclxuXHJcbi5mYWN0b3J5KCdEZXRhbGhlUGVkaWRvU2VydmljZScsIFsgJyRodHRwJywgJyRyb290U2NvcGUnLCAnUGVkaWRvUHJvZHV0b3NTZXJ2aWNlJywgJ05ldHdvcmtTZXJ2aWNlJywgJ05vdGlmaWNhdGlvblNlcnZpY2UnLFxyXG5cdGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlLCBQZWRpZG9Qcm9kdXRvc1NlcnZpY2UsIE5ldHdvcmtTZXJ2aWNlLCBOb3RpZmljYXRpb25TZXJ2aWNlKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7fTtcclxuXHRcclxuXHRzZXJ2aWNlLml0ZW5zID0gW107XHJcblx0XHJcblx0c2VydmljZS5zZXRJdGVucyA9IGZ1bmN0aW9uKGl0ZW5zKSB7XHJcblx0XHRzZXJ2aWNlLml0ZW5zID0gaXRlbnM7XHJcblx0fVxyXG5cclxuXHRzZXJ2aWNlLmJ1c2NhVmVuZGVkb3JlcyA9IGZ1bmN0aW9uKGluZHVzdHJpYSwgY2FsbGJhY2spIHtcclxuXHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBQb3N0KCcvZ2V0VmVuZGVkb3Jlc1BvckluZHVzdHJpYScsIGluZHVzdHJpYS5pZCwgKHJlc3VsdCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBidXNjYXIgZGFkb3MgZG9zIGNsaWVudGVzJywgZGF0YSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuYnVzY2FQZWRpZG9zID0gZnVuY3Rpb24ocGVkaWRvU2VhcmNoLCBjYWxsYmFjaykge1xyXG5cdFx0aWYoIXBlZGlkb1NlYXJjaC5pZFVzdWFyaW8gJiYgcGVkaWRvU2VhcmNoLmlzVmVuZGVkb3IpIHtcclxuXHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblx0XHROZXR3b3JrU2VydmljZS5odHRwUG9zdCgnL2dldFBlZGlkb3NQb3JDcml0ZXJpYScsIHBlZGlkb1NlYXJjaCwgZnVuY3Rpb24ocmVzdWx0LCBkYXRhKSB7XHJcblx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGRhdGEpXHJcblx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciBwZWRpZG9zJywgZGF0YSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuZ2V0TGlzdGFTdGF0dXNQZWRpZG8gPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFx0TmV0d29ya1NlcnZpY2UuaHR0cEdldCgnL2dldExpc3RhU3RhdHVzUGVkaWRvJywgKHJlc3VsdCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBidXNjYXIgcGVkaWRvcycsIGRhdGEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ07Do28gZm9pIHBvc3PDrXZlbCBzZSBjb211bmljYXIgY29tIG8gc2Vydmlkb3IuJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2Uuc2V0UGVkaWRvID0gZnVuY3Rpb24ocGVkaWRvKSB7XHJcblx0XHRzZXJ2aWNlLnBlZGlkbyA9IHBlZGlkbztcclxuXHR9XHJcblx0XHJcblx0c2VydmljZS5nZXRQZWRpZG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBzZXJ2aWNlLnBlZGlkbztcclxuXHR9XHJcblx0XHJcblx0c2VydmljZS5wdXNoVmVuZGVkb3IgPSBmdW5jdGlvbih2ZW5kZWRvcikge1xyXG5cdFx0c2VydmljZS52ZW5kZWRvciA9IHZlbmRlZG9yO1xyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLnBvcFZlbmRlZG9yID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdHZhciBhdXggPSBzZXJ2aWNlLnZlbmRlZG9yO1xyXG5cdFx0c2VydmljZS52ZW5kZWRvciA9IHVuZGVmaW5lZDtcclxuXHRcdGNhbGxiYWNrKGF1eCk7XHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2UuZ2V0VG90YWxJdGVuc1BlZGlkbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0bGV0IHRvdGFsID0gMFxyXG5cdFx0aWYoc2VydmljZS5wZWRpZG8uaXRlbnNQZWRpZG8pIHtcclxuXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IHNlcnZpY2UucGVkaWRvLml0ZW5zUGVkaWRvLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0dG90YWwgKz0gc2VydmljZS5wZWRpZG8uaXRlbnNQZWRpZG9baV0ucXVhbnRpZGFkZVNvbGljaXRhZGFcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRvdGFsXHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2UuZ2V0VG90YWxQZWRpZG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdGxldCB0b3RhbCA9IDBcclxuXHRcdGlmKHNlcnZpY2UucGVkaWRvLml0ZW5zUGVkaWRvKSB7XHJcblx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzZXJ2aWNlLnBlZGlkby5pdGVuc1BlZGlkby5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGxldCBwZWRpZG8gPSBzZXJ2aWNlLnBlZGlkby5pdGVuc1BlZGlkb1tpXVxyXG5cdFx0XHRcdHRvdGFsICs9IFBlZGlkb1Byb2R1dG9zU2VydmljZS5jYWxjdWxhUHJlY29JdGVtU2VtU3RMaXN0YVBlZGlkb3MocGVkaWRvKSAqIHBlZGlkby5xdWFudGlkYWRlU29saWNpdGFkYVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdG90YWxcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuZ2V0VG90YWxQZWRpZG9TZW1TdCA9IGZ1bmN0aW9uKHBlZGlkbykge1xyXG5cdFx0bGV0IHRvdGFsID0gMFxyXG5cdFx0aWYocGVkaWRvLml0ZW5zUGVkaWRvKSB7XHJcblx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBwZWRpZG8uaXRlbnNQZWRpZG8ubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRsZXQgaXRlbSA9IHBlZGlkby5pdGVuc1BlZGlkb1tpXVxyXG5cdFx0XHRcdHRvdGFsICs9IFBlZGlkb1Byb2R1dG9zU2VydmljZS5jYWxjdWxhUHJlY29JdGVtU2VtU3RMaXN0YVBlZGlkb3MoaXRlbSkgKiBpdGVtLnF1YW50aWRhZGVTb2xpY2l0YWRhXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB0b3RhbFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcbn1dKTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciBkZXRhbGhlUGVkaWRvSXRlbnNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnRGV0YWxoZVBlZGlkb0l0ZW5zJykuY29udHJvbGxlcignRGV0YWxoZVBlZGlkb0l0ZW5zQ29udHJvbGxlcicsIFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJHJvb3RTY29wZScsXHJcblx0JyRsb2NhdGlvbicsXHJcblx0JyRodHRwJyxcclxuXHQnRGV0YWxoZVBlZGlkb1NlcnZpY2UnLFxyXG5cdCdJbmR1c3RyaWFzU2VydmljZScsXHJcblx0J1BlZGlkb1Byb2R1dG9zU2VydmljZScsXHJcblx0J1BlZGlkb1NlcnZpY2UnLFxyXG5cdCdBdXRoZW50aWNhdGlvblNlcnZpY2UnLFxyXG5cdCdDYWRhc3Ryb0NsaWVudGVzU2VydmljZScsXHJcblx0J09ic2VydmFjYW9TZXJ2aWNlJyxcclxuXHQnTm90aWZpY2F0aW9uU2VydmljZScsXHJcblx0J01vZGFsU2VydmljZScsXHJcblx0Y29uc3RydWN0b3IsXHJcbl0pXHJcblx0XHJcbmZ1bmN0aW9uIGNvbnN0cnVjdG9yKFxyXG5cdFx0JHNjb3BlLFxyXG5cdFx0JHJvb3RTY29wZSxcclxuXHRcdCRsb2NhdGlvbixcclxuXHRcdCRodHRwLFxyXG5cdFx0RGV0YWxoZVBlZGlkb1NlcnZpY2UsXHJcblx0XHRJbmR1c3RyaWFzU2VydmljZSxcclxuXHRcdFBlZGlkb1Byb2R1dG9zU2VydmljZSxcclxuXHRcdFBlZGlkb1NlcnZpY2UsXHJcblx0XHRBdXRoZW50aWNhdGlvblNlcnZpY2UsXHJcblx0XHRDYWRhc3Ryb0NsaWVudGVzU2VydmljZSxcclxuXHRcdE9ic2VydmFjYW9TZXJ2aWNlLFxyXG5cdFx0Tm90aWZpY2F0aW9uU2VydmljZSxcclxuXHRcdE1vZGFsU2VydmljZVxyXG5cdCl7XHJcblxyXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1TQ09QRSBGVU5DVElPTlMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdGluaXQoKVxyXG5cclxuXHQkc2NvcGUuYWx0ZXJhUHJlY29Db2xvY2FkbyA9IGZ1bmN0aW9uKGl0ZW1QZWRpZG8pIHtcclxuXHRcdHZhciBwcmVjb0NvbG9jYWRvID0gaXRlbVBlZGlkby5wcmVjb0NvbG9jYWRvOyAvKm5vdm8gdmFsb3IgZG8gcHJlY28gaXRlbSBzZW0gc3QqL1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLnZhbG9yQ2FyZ2EgPSBmdW5jdGlvbigpIHtcclxuXHRcdGxldCByZXN1bHQgPSAkLmdyZXAoTElTVEFfQ0FSR0EsIGZ1bmN0aW9uKGl0ZW0peyByZXR1cm4gaXRlbS52YWx1ZSA9PSAkc2NvcGUucGVkaWRvLmNhcmdhOyB9KTtcclxuXHRcdHJldHVybiByZXN1bHRbMF0udGV4dDtcclxuXHR9XHJcblxyXG5cdCRzY29wZS5uZWdhclBlZGlkbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuXHRcdFx0Y2xvc2VCdXR0b25UZXh0OiAnTsOjbycsXHJcblx0XHRcdGFjdGlvbkJ1dHRvblRleHQ6ICdTaW0nLFxyXG5cdFx0XHRoZWFkZXJUZXh0OiAnQ29uZmlybWFyJyxcclxuXHRcdFx0Ym9keVRleHQ6IGBDb25maXJtYSBORUdBUiBvIHBlZGlkbyAkeyRzY29wZS5wZWRpZG8uaWR9ID9gXHJcblx0XHR9O1xyXG5cclxuXHRcdE1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdCRzY29wZS5wZWRpZG8uc3RhdHVzUGVkaWRvID0gU1RBVFVTX1BFRElETy5ORUdBRE9cclxuXHRcdFx0UGVkaWRvU2VydmljZS5zYWx2YVBlZGlkbygkc2NvcGUucGVkaWRvLCAocmVzcG9uc2UpID0+IHtcclxuXHRcdFx0XHQkc2NvcGUucGVkaWRvID0gcmVzcG9uc2U7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5zdWNjZXNzKCdQZWRpZG8gJyArICRzY29wZS5wZWRpZG8uaWQgKyAnIG5lZ2FkbyBjb20gc3VjZXNzbyEnKVxyXG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvZGV0YWxoZVBlZGlkbycpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuY29sb2NhclBlZGlkbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuXHRcdFx0Y2xvc2VCdXR0b25UZXh0OiAnTsOjbycsXHJcblx0XHRcdGFjdGlvbkJ1dHRvblRleHQ6ICdTaW0nLFxyXG5cdFx0XHRoZWFkZXJUZXh0OiAnQ29uZmlybWFyJyxcclxuXHRcdFx0Ym9keVRleHQ6IGBDb25maXJtYSBDT0xPQ0FSIG8gcGVkaWRvICR7JHNjb3BlLnBlZGlkby5pZH0gP2BcclxuXHRcdH07XHJcblxyXG5cdFx0TW9kYWxTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHRcdFx0JHNjb3BlLnBlZGlkby5zdGF0dXNQZWRpZG8gPSBTVEFUVVNfUEVESURPLkNPTE9DQURPXHJcblx0XHRcdFBlZGlkb1NlcnZpY2Uuc2FsdmFQZWRpZG8oJHNjb3BlLnBlZGlkbywgKHJlc3BvbnNlKSA9PiB7XHJcblx0XHRcdFx0JHNjb3BlLnBlZGlkbyA9IHJlc3BvbnNlO1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2Uuc3VjY2VzcygnUGVkaWRvICcgKyAkc2NvcGUucGVkaWRvLmlkICsgJyBjb2xvY2FkbyBjb20gc3VjZXNzbyEnKVxyXG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvZGV0YWxoZVBlZGlkbycpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuYWRpY2lvbmFPYnNlcnZhY2FvID0gZnVuY3Rpb24oKSB7XHJcblx0XHRjb25zdCBfaWRVc3VhcmlvID0gQXV0aGVudGljYXRpb25TZXJ2aWNlLmdldFVzdWFyaW8oKS5pZFxyXG5cdFx0Y29uc3QgX29ic2VydmFjYW8gPSAkc2NvcGUub2JzZXJ2YWNhby5tc2dcclxuXHRcdGNvbnN0IF9ub21lVXN1YXJpbyA9IEF1dGhlbnRpY2F0aW9uU2VydmljZS5nZXRVc3VhcmlvKCkubm9tZVxyXG5cdFx0Y29uc3QgX2RhdGFDcmlhY2FvID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xyXG5cdFx0Y29uc3QgX2lkUGVkaWRvID0gJHNjb3BlLnBlZGlkby5pZFxyXG5cdFx0bGV0IG1zZyA9IHtcclxuXHRcdFx0aWRPYnNlcnZhY2FvOiB1bmRlZmluZWQsXHJcblx0XHRcdGlkUGVkaWRvOiBfaWRQZWRpZG8sXHJcblx0XHRcdGRhdGFDcmlhY2FvOiBfZGF0YUNyaWFjYW8sXHJcblx0XHRcdGRhdGFMZWl0dXJhOiB1bmRlZmluZWQsXHJcblx0XHRcdGxpZG86IHVuZGVmaW5lZCxcclxuXHRcdFx0aWRVc3VhcmlvOiBfaWRVc3VhcmlvLFxyXG5cdFx0XHRvYnNlcnZhY2FvOiBfb2JzZXJ2YWNhbyxcclxuXHRcdFx0bm9tZVVzdWFyaW86IF9ub21lVXN1YXJpb1xyXG5cdFx0fVxyXG5cdFx0aWYoISRzY29wZS5wZWRpZG8ub2JzZXJ2YWNvZXNQZWRpZG9EdG8pIHtcclxuXHRcdFx0JHNjb3BlLnBlZGlkby5vYnNlcnZhY29lc1BlZGlkb0R0byA9IFtdXHJcblx0XHR9XHJcblx0XHQkc2NvcGUucGVkaWRvLm9ic2VydmFjb2VzUGVkaWRvRHRvLnB1c2gobXNnKVxyXG5cclxuXHRcdGlmKF9pZFBlZGlkbykge1xyXG5cdFx0XHRsZXQgb2JzZXJ2YWNhb1BlZGlkb1VwZGF0ZUR0byA9IHtcclxuXHRcdFx0XHRpZFBlZGlkbzogX2lkUGVkaWRvLFxyXG5cdFx0XHRcdGxpc3RhT2JzZXJ2YWNhb1BlZGlkb0R0bzogJHNjb3BlLnBlZGlkby5vYnNlcnZhY29lc1BlZGlkb0R0byxcclxuXHRcdFx0fVxyXG5cdFx0XHRPYnNlcnZhY2FvU2VydmljZS5hdHVhbGl6YU9ic2VydmFjb2VzKG9ic2VydmFjYW9QZWRpZG9VcGRhdGVEdG8sIChvYnNlcnZhY29lcykgPT4ge1xyXG5cdFx0XHRcdCRzY29wZS5wZWRpZG8ub2JzZXJ2YWNvZXNQZWRpZG9EdG8gPSBvYnNlcnZhY29lc1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2Uuc3VjY2VzcygnTWVuc2FnZW0gZW52aWFkYSBjb20gc3VjZXNzbyEnKVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIExpbXBhIGNhbXBvIGRhIHRlbGFcclxuXHRcdCRzY29wZS5vYnNlcnZhY2FvLm1zZyA9IHVuZGVmaW5lZFxyXG5cdH1cclxuXHJcblx0JHNjb3BlLmlzVmVuZGVkb3IgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNWZW5kZWRvcigpO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLnBvZGVDb2xvY2FyUGVkaWRvID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gJHNjb3BlLnBlZGlkby5zdGF0dXNQZWRpZG8gPT09IFNUQVRVU19QRURJRE8uRU5WSUFETztcclxuXHR9XHJcblxyXG5cdCRzY29wZS5wb2RlTmVnYXJQZWRpZG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAkc2NvcGUucGVkaWRvLnN0YXR1c1BlZGlkbyA9PT0gU1RBVFVTX1BFRElETy5DT0xPQ0FETyB8fCAkc2NvcGUucGVkaWRvLnN0YXR1c1BlZGlkbyA9PT0gU1RBVFVTX1BFRElETy5FTlZJQURPO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLnBvZGVFZGl0YXJDb2RpZ29QZWRpZG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNBZG1pbmlzdHJhZG9yKCkgfHwgQXV0aGVudGljYXRpb25TZXJ2aWNlLmlzTWFzdGVyKCk7XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuYnVzY2FQcmVjb1NlbVN0ID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0cmV0dXJuIFBlZGlkb1Byb2R1dG9zU2VydmljZS5jYWxjdWxhUHJlY29JdGVtU2VtU3RMaXN0YVBlZGlkb3MoaXRlbSk7XHJcblx0fVxyXG5cclxuXHQkc2NvcGUudmVyaWZpY2FQZWRpZG9BbHRlcmFkbyA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdHJldHVybiBpdGVtLmRlc2NvbnRvID4gMFxyXG5cdH1cclxuXHJcblx0JHNjb3BlLnZvbHRhciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpXHJcblx0fVxyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1MT0NBTCBGVU5DVElPTlMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFxyXG5cdGZ1bmN0aW9uIGluaXQoKSB7XHJcblx0XHQkc2NvcGUucGVkaWRvID0gRGV0YWxoZVBlZGlkb1NlcnZpY2UuZ2V0UGVkaWRvKCk7XHJcblxyXG5cdFx0aWYoISRzY29wZS5wZWRpZG8pIHtcclxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9kZXRhbGhlUGVkaWRvJylcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblx0XHQkc2NvcGUucGVkaWRvLml0ZW5zUGVkaWRvID0gJHNjb3BlLnBlZGlkby5pdGVuc1BlZGlkby5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdHJldHVybiAoYS5kZXNjcmljYW8gPiBiLmRlc2NyaWNhbykgPyAxIDogKChhLmRlc2NyaWNhbyA8IGIuZGVzY3JpY2FvID8gLTEgOiAwKSlcclxuXHRcdH0pXHJcblxyXG5cdFx0JHNjb3BlLnRvdGFsSXRlbnNQZWRpZG8gPSBEZXRhbGhlUGVkaWRvU2VydmljZS5nZXRUb3RhbEl0ZW5zUGVkaWRvKClcclxuXHRcdCRzY29wZS50b3RhbFBlZGlkbyA9IERldGFsaGVQZWRpZG9TZXJ2aWNlLmdldFRvdGFsUGVkaWRvKClcclxuXHJcblx0XHRDYWRhc3Ryb0NsaWVudGVzU2VydmljZS5nZXRJbmR1c3RyaWFzQ2xpZW50ZSgkc2NvcGUucGVkaWRvLmlkQ2xpZW50ZSwgKHJlc3BvbnNlKSA9PiB7XHJcblx0XHRcdGxldCBjbGllbnRlSW5kdXN0cmlhID0gJC5ncmVwKHJlc3BvbnNlLCBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdFx0cmV0dXJuIGl0ZW0uaWRJbmR1c3RyaWEgPT0gJHNjb3BlLnBlZGlkby5pbmR1c3RyaWEuaWQgXHJcblx0XHRcdH0pXHJcblx0XHRcdGlmKGNsaWVudGVJbmR1c3RyaWEgJiYgY2xpZW50ZUluZHVzdHJpYS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0JHNjb3BlLmlkSW5kdXN0cmlhQ2xpZW50ZSA9IGNsaWVudGVJbmR1c3RyaWFbMF0uY29kaWdvO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHRcdCRzY29wZS5vYnNlcnZhY2FvID0ge1xyXG5cdFx0XHRtc2c6IHVuZGVmaW5lZFxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZGV0YWxoZVBlZGlkb0l0ZW5zTW9kdWxlLmZpbHRlcigncGVyY2VudGFnZScsIFsnJGZpbHRlcicsICgkZmlsdGVyKSA9PiB7XHJcblx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XHJcblx0XHRyZXR1cm4gJGZpbHRlcignbnVtYmVyJykoaW5wdXQgKiAxMDApICsgJyUnO1xyXG5cdH07XHJcbn1dKVxyXG4iLCIndXNlIHN0cmljdCdcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdEZXRhbGhlUGVkaWRvU2Fsdm8nKS5jb250cm9sbGVyKCdEZXRhbGhlUGVkaWRvU2Fsdm9Db250cm9sbGVyJywgW1xyXG5cdCckc2NvcGUnLFxyXG5cdCckcm9vdFNjb3BlJyxcclxuXHQnJGxvY2F0aW9uJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckcm91dGUnLFxyXG5cdCdEZXRhbGhlUGVkaWRvU2Fsdm9TZXJ2aWNlJyxcclxuXHQnSW5kdXN0cmlhc1NlcnZpY2UnLFxyXG5cdCdQZWRpZG9TZXJ2aWNlJyxcclxuXHQnUGVkaWRvUHJvZHV0b3NTZXJ2aWNlJyxcclxuXHQnTWVudVNlcnZpY2UnLFxyXG5cdCdBdXRoZW50aWNhdGlvblNlcnZpY2UnLFxyXG5cdCdDYWRhc3Ryb0NsaWVudGVzU2VydmljZScsXHJcblx0J01hcHBlclNlcnZpY2UnLFxyXG5cdCdTdG9yYWdlU2VydmljZScsXHJcblx0J01vZGFsU2VydmljZScsXHJcblx0J05vdGlmaWNhdGlvblNlcnZpY2UnLFxyXG5cdGNvbnN0cnVjdG9yXHJcbl0pXHJcblxyXG5mdW5jdGlvbiBjb25zdHJ1Y3Rvcigkc2NvcGUsXHJcblx0JHJvb3RTY29wZSxcclxuXHQkbG9jYXRpb24sXHJcblx0JGh0dHAsXHJcblx0JHJvdXRlLFxyXG5cdHNlcnZpY2UsXHJcblx0SW5kdXN0cmlhc1NlcnZpY2UsXHJcblx0UGVkaWRvU2VydmljZSxcclxuXHRQZWRpZG9Qcm9kdXRvc1NlcnZpY2UsXHJcblx0TWVudVNlcnZpY2UsXHJcblx0QXV0aGVudGljYXRpb25TZXJ2aWNlLFxyXG5cdENhZGFzdHJvQ2xpZW50ZXNTZXJ2aWNlLFxyXG5cdE1hcHBlclNlcnZpY2UsXHJcblx0U3RvcmFnZVNlcnZpY2UsXHJcblx0TW9kYWxTZXJ2aWNlLFxyXG5cdE5vdGlmaWNhdGlvblNlcnZpY2UpIHtcclxuXHJcblx0dmFyIHVzdWFyaW8gPSAkcm9vdFNjb3BlLmdsb2JhbHMuY3VycmVudFVzZXIudXNlcjtcclxuXHJcblx0JHNjb3BlLnN0YXR1c1BlZGlkbyA9IHVuZGVmaW5lZDtcclxuXHJcblx0SW5kdXN0cmlhc1NlcnZpY2UuZ2V0SW5kdXN0cmlhc1VzdWFyaW8odXN1YXJpby5pZCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHQkc2NvcGUuaW5kdXN0cmlhcyA9IHJlc3BvbnNlO1xyXG5cdH0pO1xyXG5cclxuXHRsZXQgZmlsdHJvUGVkaWRvID0gU3RvcmFnZVNlcnZpY2UuZ2V0RmlsdHJvUGVkaWRvQXRpdm8oKVxyXG5cdGlmIChmaWx0cm9QZWRpZG8pIHtcclxuXHRcdCRzY29wZS5wZWRpZG9TZWFyY2ggPSBmaWx0cm9QZWRpZG9cclxuXHR9IGVsc2Uge1xyXG5cdFx0JHNjb3BlLnBlZGlkb1NlYXJjaCA9IHtcclxuXHRcdFx0aWRJbmR1c3RyaWE6IG51bGwsXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0aWYgKEF1dGhlbnRpY2F0aW9uU2VydmljZS5pc1ZlbmRlZG9yKCkpIHtcclxuXHRcdCRzY29wZS52ZW5kZWRvciA9IHVzdWFyaW87XHJcblx0XHQkc2NvcGUucGVkaWRvU2VhcmNoLmlkVXN1YXJpbyA9IHVzdWFyaW8uaWQ7XHJcblx0fSBlbHNlIHtcclxuXHRcdENhZGFzdHJvQ2xpZW50ZXNTZXJ2aWNlLmJ1c2NhVmVuZGVkb3JlcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0JHNjb3BlLnZlbmRlZG9yZXMgPSByZXNwb25zZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLnNlbGVjaW9uYUluZHVzdHJpYSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGZpbHRyYVBlZGlkb3MoKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZpbHRyYVBlZGlkb3MoKSB7XHJcblx0XHRzZXJ2aWNlLmJ1c2NhUGVkaWRvcygkc2NvcGUucGVkaWRvU2VhcmNoLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0aWYgKCFyZXNwb25zZSkge1xyXG5cdFx0XHRcdHJlc3BvbnNlID0gW11cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoJHNjb3BlLnBlZGlkb1NlYXJjaC5pZEluZHVzdHJpYSkge1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSAkLmdyZXAocmVzcG9uc2UsXHJcblx0XHRcdFx0XHRmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gaXRlbS5pZEluZHVzdHJpYSA9PSAkc2NvcGUucGVkaWRvU2VhcmNoLmlkSW5kdXN0cmlhXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkc2NvcGUucGVkaWRvcyA9IHJlc3VsdFxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCRzY29wZS5wZWRpZG9zID0gcmVzcG9uc2VcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmaWx0cmFQZWRpZG9zKCk7XHJcblxyXG5cdCRzY29wZS5leGliZURldGFsaGVzUGVkaWRvID0gZnVuY3Rpb24gKHBlZGlkbykge1xyXG5cdFx0c2VydmljZS5zZXRQZWRpZG8ocGVkaWRvKTtcclxuXHRcdCRsb2NhdGlvbi5wYXRoKCcvZGV0YWxoZVBlZGlkb1NhbHZvSXRlbnMnKTtcclxuXHR9XHJcblxyXG5cdCRzY29wZS5lZGl0YXJQZWRpZG8gPSBmdW5jdGlvbiAocGVkaWRvKSB7XHJcblx0XHRQZWRpZG9TZXJ2aWNlLnBlZGlkb1BhcmFFZGl0YXIgPSBwZWRpZG9cclxuXHRcdCRsb2NhdGlvbi5wYXRoKCcvcGVkaWRvJyk7XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuaXNWZW5kZWRvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiBBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNWZW5kZWRvcigpO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLmlzUGVkaWRvU2Fsdm8gPSBmdW5jdGlvbiAocGVkaWRvKSB7XHJcblx0XHRyZXR1cm4gcGVkaWRvLnN0YXR1c1BlZGlkbyA9PSBTVEFUVVNfUEVESURPLlNBTFZPO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLmdldFZhbG9yRmluYWxQZWRpZG8gPSBmdW5jdGlvbiAocGVkaWRvKSB7XHJcblx0XHRQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuaXRlbnNQZWRpZG8gPSBwZWRpZG8uaXRlbnNQZWRpZG87XHJcblx0XHRyZXR1cm4gUGVkaWRvUHJvZHV0b3NTZXJ2aWNlLnZhbG9yVG90YWxQZWRpZG9Db21TdCgpO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLnBvZGVFZGl0YXIgPSBmdW5jdGlvbiAocGVkaWRvKSB7XHJcblx0XHRyZXR1cm4gcGVkaWRvLnN0YXR1c1BlZGlkbyA9PT0gU1RBVFVTX1BFRElETy5ORUdBRE8gfHwgcGVkaWRvLnN0YXR1c1BlZGlkbyA9PT0gU1RBVFVTX1BFRElETy5TQUxWT1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLnBvZGVEZXRhbGhhciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLmVudmlhclBlZGlkbyA9IGZ1bmN0aW9uIChwZWRpZG8pIHtcclxuXHRcdHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcblx0XHRcdGNsb3NlQnV0dG9uVGV4dDogJ07Do28nLFxyXG5cdFx0XHRhY3Rpb25CdXR0b25UZXh0OiAnU2ltJyxcclxuXHRcdFx0aGVhZGVyVGV4dDogJ0NvbmZpcm1hcicsXHJcblx0XHRcdGJvZHlUZXh0OiAnQ29uZmlybWEgZW52aW8gZG8gcGVkaWRvIHBhcmEgbyBjbGllbnRlICcgKyBwZWRpZG8ubm9tZUNsaWVudGUgKyAnID8nXHJcblx0XHR9O1xyXG5cclxuXHRcdE1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdHBlZGlkby5zdGF0dXNQZWRpZG8gPSAzXHJcblx0XHRcdGxldCBpZFBlZGlkb1NhbHZvID0gcGVkaWRvLmlkUGVkaWRvU2Fsdm9cclxuXHRcdFx0UGVkaWRvU2VydmljZS5zYWx2YVBlZGlkbyhwZWRpZG8sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2Uuc3VjY2VzcygnUGVkaWRvIGVudmlhZG8gY29tIHN1Y2Vzc28hJyk7XHJcblx0XHRcdFx0aWYgKGlkUGVkaWRvU2Fsdm8pIHtcclxuXHRcdFx0XHRcdHBlZGlkby5pZFBlZGlkb1NhbHZvID0gaWRQZWRpZG9TYWx2b1xyXG5cdFx0XHRcdFx0U3RvcmFnZVNlcnZpY2UucmVtb3ZlUGVkaWRvU2Fsdm8ocGVkaWRvKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkcm91dGUucmVsb2FkKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuZXhjbHVpclBlZGlkbyA9IGZ1bmN0aW9uIChpKSB7XHJcblx0XHR2YXIgbW9kYWxPcHRpb25zID0ge1xyXG5cdFx0XHRjbG9zZUJ1dHRvblRleHQ6ICdOw6NvJyxcclxuXHRcdFx0YWN0aW9uQnV0dG9uVGV4dDogJ1NpbScsXHJcblx0XHRcdGhlYWRlclRleHQ6ICdDb25maXJtYXInLFxyXG5cdFx0XHRib2R5VGV4dDogJ0NvbmZpcm1hIHJlbW/Dp8OjbyBkbyBwZWRpZG8gcGFyYSBvIGNsaWVudGUgJyArIGkubm9tZUNsaWVudGUgKyAnID8nXHJcblx0XHR9O1xyXG5cclxuXHRcdE1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdFN0b3JhZ2VTZXJ2aWNlLnJlbW92ZVBlZGlkb1NhbHZvKGkpO1xyXG5cdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLnN1Y2Nlc3MoJ1BlZGlkbyByZW1vdmlkbyBjb20gc3VjZXNzbyEnKTtcclxuXHRcdFx0JHJvdXRlLnJlbG9hZCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuZGV0YWxoYXJQZWRpZG8gPSBmdW5jdGlvbiAocGVkaWRvKSB7XHJcblx0XHRzZXJ2aWNlLnBlZGlkbyA9IHBlZGlkb1xyXG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9kZXRhbGhlUGVkaWRvU2Fsdm9JdGVucycpO1xyXG5cdH1cclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnRGV0YWxoZVBlZGlkb1NhbHZvJylcclxuXHJcbi5mYWN0b3J5KCdEZXRhbGhlUGVkaWRvU2Fsdm9TZXJ2aWNlJywgWyAnJGh0dHAnLCAnJHJvb3RTY29wZScsICdTdG9yYWdlU2VydmljZScsICBmdW5jdGlvbigkaHR0cCwgJHJvb3RTY29wZSwgU3RvcmFnZVNlcnZpY2UpIHtcclxuXHR2YXIgc2VydmljZSA9IHt9O1xyXG5cdFxyXG5cdHNlcnZpY2UuaXRlbnMgPSBbXTtcclxuXHRcclxuXHRzZXJ2aWNlLnNldEl0ZW5zID0gZnVuY3Rpb24oaXRlbnMpIHtcclxuXHRcdHNlcnZpY2UuaXRlbnMgPSBpdGVucztcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuYnVzY2FWZW5kZWRvcmVzID0gZnVuY3Rpb24oaW5kdXN0cmlhLCBjYWxsYmFjaykge1xyXG5cdFx0TmV0d29ya1NlcnZpY2UuaHR0cFBvc3QoJy9nZXRWZW5kZWRvcmVzUG9ySW5kdXN0cmlhJywgaW5kdXN0cmlhLmlkLCAocmVzdWx0LCBkYXRhKSA9PiB7XHJcblx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGRhdGEpXHJcblx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciBkYWRvcyBkb3MgdmVuZGVkb3JlcycsIGRhdGEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ07Do28gZm9pIHBvc3PDrXZlbCBzZSBjb211bmljYXIgY29tIG8gc2Vydmlkb3IuJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRzZXJ2aWNlLmJ1c2NhUGVkaWRvcyA9IGZ1bmN0aW9uKHBlZGlkb1NlYXJjaCwgY2FsbGJhY2spIHtcclxuXHRcdGxldCBwZWRpZG9zID0gU3RvcmFnZVNlcnZpY2UuZ2V0UGVkaWRvc1NhbHZvKClcclxuXHRcdGNhbGxiYWNrKHBlZGlkb3MpXHJcblx0fVxyXG5cclxuXHRzZXJ2aWNlLmdldExpc3RhU3RhdHVzUGVkaWRvID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBQb3N0KCcvZ2V0TGlzdGFTdGF0dXNQZWRpZG8nLCAocmVzdWx0LCBkYXRhKSA9PiB7XHJcblx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGRhdGEpXHJcblx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciBsaXN0YSBzdGF0dXMgcGVkaWRvJywgZGF0YSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblx0XHJcblx0c2VydmljZS5zZXRQZWRpZG8gPSBmdW5jdGlvbihwZWRpZG8pIHtcclxuXHRcdHNlcnZpY2UucGVkaWRvID0gcGVkaWRvO1xyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLmdldFBlZGlkbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHNlcnZpY2UucGVkaWRvO1xyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLnB1c2hWZW5kZWRvciA9IGZ1bmN0aW9uKHZlbmRlZG9yKSB7XHJcblx0XHRzZXJ2aWNlLnZlbmRlZG9yID0gdmVuZGVkb3I7XHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2UucG9wVmVuZGVkb3IgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFx0dmFyIGF1eCA9IHNlcnZpY2UudmVuZGVkb3I7XHJcblx0XHRzZXJ2aWNlLnZlbmRlZG9yID0gdW5kZWZpbmVkO1xyXG5cdFx0Y2FsbGJhY2soYXV4KTtcclxuXHR9XHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcbn1dKTsiLCIndXNlIHN0cmljdCdcclxuXHJcbnZhciBkZXRhbGhlUGVkaWRvU2Fsdm9JdGVuc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdEZXRhbGhlUGVkaWRvU2Fsdm9JdGVucycpXHJcbi5jb250cm9sbGVyKCdEZXRhbGhlUGVkaWRvU2Fsdm9JdGVuc0NvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsICckaHR0cCcsICdEZXRhbGhlUGVkaWRvU2Fsdm9TZXJ2aWNlJywgJ0luZHVzdHJpYXNTZXJ2aWNlJywgJ1BlZGlkb1Byb2R1dG9zU2VydmljZScsICdQZWRpZG9TZXJ2aWNlJywgJ0F1dGhlbnRpY2F0aW9uU2VydmljZScsICdNb2RhbFNlcnZpY2UnLCAnU3RvcmFnZVNlcnZpY2UnLCAnTm90aWZpY2F0aW9uU2VydmljZScsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkaHR0cCwgRGV0YWxoZVBlZGlkb1NhbHZvU2VydmljZSwgSW5kdXN0cmlhc1NlcnZpY2UsIFBlZGlkb1Byb2R1dG9zU2VydmljZSwgUGVkaWRvU2VydmljZSwgQXV0aGVudGljYXRpb25TZXJ2aWNlLCBNb2RhbFNlcnZpY2UsIFN0b3JhZ2VTZXJ2aWNlLCBOb3RpZmljYXRpb25TZXJ2aWNlKSB7XHJcblxyXG5cdCRzY29wZS5wZWRpZG8gPSBEZXRhbGhlUGVkaWRvU2Fsdm9TZXJ2aWNlLmdldFBlZGlkbygpXHJcblxyXG5cdCRzY29wZS5vYnNlcnZhY2FvID0ge1xyXG5cdFx0bXNnOiB1bmRlZmluZWRcclxuXHR9XHJcblx0XHJcblx0aWYoISRzY29wZS5wZWRpZG8pIHtcclxuXHRcdCRsb2NhdGlvbi5wYXRoKCcvZGV0YWxoZVBlZGlkb1NhbHZvJyk7XHJcblx0fVxyXG5cclxuXHQkc2NvcGUudmFsb3JDYXJnYSA9IGZ1bmN0aW9uKHBlZGlkbykge1xyXG5cdFx0bGV0IHJlc3VsdCA9ICQuZ3JlcChMSVNUQV9DQVJHQSwgZnVuY3Rpb24oaXRlbSl7IHJldHVybiBpdGVtLnZhbHVlID09IHBlZGlkby5jYXJnYTsgfSk7XHJcblx0XHRyZXR1cm4gcmVzdWx0WzBdLnRleHQ7XHJcblx0fVxyXG5cdFxyXG5cdCRzY29wZS5wZWRpZG8uaXRlbnNQZWRpZG8gPSAkc2NvcGUucGVkaWRvLml0ZW5zUGVkaWRvLnNvcnQoZnVuY3Rpb24oYSwgYikge1xyXG5cdFx0cmV0dXJuIChhLmRlc2NyaWNhbyA+IGIuZGVzY3JpY2FvKSA/IDEgOiAoKGEuZGVzY3JpY2FvIDwgYi5kZXNjcmljYW8pID8gLTEgOiAwKVxyXG5cdH0pXHJcblx0XHJcblx0JHNjb3BlLmFsdGVyYVByZWNvQ29sb2NhZG8gPSBmdW5jdGlvbihpdGVtUGVkaWRvKSB7XHJcblx0XHR2YXIgcHJlY29Db2xvY2FkbyA9IGl0ZW1QZWRpZG8ucHJlY29Db2xvY2FkbzsgLypub3ZvIHZhbG9yIGRvIHByZWNvIGl0ZW0gc2VtIHN0Ki9cclxuXHR9XHJcblx0XHJcblx0JHNjb3BlLmVudmlhclBlZGlkbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0bGV0IHBlZGlkbyA9ICRzY29wZS5wZWRpZG9cclxuICAgICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnTsOjbycsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnU2ltJyxcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQ6ICdDb25maXJtYXInLFxyXG4gICAgICAgICAgICAgICAgYm9keVRleHQ6ICdDb25maXJtYSBlbnZpbyBkbyBwZWRpZG8gcGFyYSBvIGNsaWVudGUgJyArIHBlZGlkby5ub21lQ2xpZW50ZSArICcgPydcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgTW9kYWxTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgIFx0XHRwZWRpZG8uc3RhdHVzUGVkaWRvID0gU1RBVFVTX1BFRElETy5FTlZJQURPXHJcbiAgICBcdFx0bGV0IGlkUGVkaWRvU2Fsdm8gPSBwZWRpZG8uaWRQZWRpZG9TYWx2b1xyXG4gICAgXHRcdFBlZGlkb1NlcnZpY2Uuc2FsdmFQZWRpZG8ocGVkaWRvLCBmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICBcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLnN1Y2Nlc3MoJ1BlZGlkbyBlbnZpYWRvIGNvbSBzdWNlc3NvIScpO1xyXG4gICAgXHRcdFx0aWYoaWRQZWRpZG9TYWx2bykge1xyXG4gICAgXHRcdFx0XHRwZWRpZG8uaWRQZWRpZG9TYWx2byA9IGlkUGVkaWRvU2Fsdm9cclxuICAgIFx0XHRcdFx0U3RvcmFnZVNlcnZpY2UucmVtb3ZlUGVkaWRvU2Fsdm8ocGVkaWRvKVxyXG4gICAgXHRcdFx0fVxyXG4gICAgXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9kZXRhbGhlUGVkaWRvU2Fsdm8nKTtcclxuICAgIFx0XHR9KTtcclxuICAgICAgICB9KTtcdFx0XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuYWRpY2lvbmFPYnNlcnZhY2FvID0gKCkgPT4ge1xyXG5cdFx0Y29uc3QgX2lkVXN1YXJpbyA9IEF1dGhlbnRpY2F0aW9uU2VydmljZS5nZXRVc3VhcmlvKCkuaWRcclxuXHRcdGNvbnN0IF9vYnNlcnZhY2FvID0gJHNjb3BlLm9ic2VydmFjYW8ubXNnXHJcblx0XHRjb25zdCBfbm9tZVVzdWFyaW8gPSBBdXRoZW50aWNhdGlvblNlcnZpY2UuZ2V0VXN1YXJpbygpLm5vbWVcclxuXHRcdGNvbnN0IF9kYXRhQ3JpYWNhbyA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcclxuXHRcdGxldCBtc2cgPSB7XHJcblx0XHRcdGlkT2JzZXJ2YWNhbzogdW5kZWZpbmVkLFxyXG5cdFx0XHRkYXRhQ3JpYWNhbzogX2RhdGFDcmlhY2FvLFxyXG5cdFx0XHRkYXRhTGVpdHVyYTogdW5kZWZpbmVkLFxyXG5cdFx0XHRsaWRvOiB1bmRlZmluZWQsXHJcblx0XHRcdGlkVXN1YXJpbzogX2lkVXN1YXJpbyxcclxuXHRcdFx0b2JzZXJ2YWNhbzogX29ic2VydmFjYW8sXHJcblx0XHRcdG5vbWVVc3VhcmlvOiBfbm9tZVVzdWFyaW9cclxuXHRcdH1cclxuXHRcdCRzY29wZS5wZWRpZG8ub2JzZXJ2YWNvZXNQZWRpZG9EdG8ucHVzaChtc2cpXHJcblxyXG5cdFx0UGVkaWRvU2VydmljZS5zYWx2YVBlZGlkb0xvY2FsKCRzY29wZS5wZWRpZG8pXHJcblxyXG5cdFx0Ly8gTGltcGEgY2FtcG8gZGEgdGVsYVxyXG5cdFx0JHNjb3BlLm9ic2VydmFjYW8ubXNnID0gdW5kZWZpbmVkXHJcblx0fVxyXG5cdFxyXG5cdCRzY29wZS5leGNsdWlyUGVkaWRvID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgaSAgPSAkc2NvcGUucGVkaWRvXHJcbiAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dDogJ07Do28nLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uQnV0dG9uVGV4dDogJ1NpbScsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0OiAnQ29uZmlybWFyJyxcclxuICAgICAgICAgICAgICAgIGJvZHlUZXh0OiAnQ29uZmlybWEgcmVtb8Onw6NvIGRvIHBlZGlkbyBwYXJhIG8gY2xpZW50ZSAnICsgaS5ub21lQ2xpZW50ZSArICcgPydcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgTW9kYWxTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICBcdFN0b3JhZ2VTZXJ2aWNlLnJlbW92ZVBlZGlkb1NhbHZvKGkpO1xyXG4gICAgICAgIFx0Tm90aWZpY2F0aW9uU2VydmljZS5zdWNjZXNzKCdQZWRpZG8gcmVtb3ZpZG8gY29tIHN1Y2Vzc28hJyk7XHJcbiAgICAgICAgXHQkbG9jYXRpb24ucGF0aCgnL2RldGFsaGVQZWRpZG9TYWx2bycpO1xyXG4gICAgICAgIH0pO1x0XHRcclxuXHR9XHJcblx0XHJcblx0JHNjb3BlLmlzVmVuZGVkb3IgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNWZW5kZWRvcigpO1xyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUucG9kZUNvbG9jYXJQZWRpZG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAkc2NvcGUucGVkaWRvLnN0YXR1c1BlZGlkbyA9PT0gU1RBVFVTX1BFRElETy5FTlZJQURPO1xyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUucG9kZU5lZ2FyUGVkaWRvID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gJHNjb3BlLnBlZGlkby5zdGF0dXNQZWRpZG8gPT09IFNUQVRVU19QRURJRE8uQ09MT0NBRE8gfHwgJHNjb3BlLnBlZGlkby5zdGF0dXMgPT09IFNUQVRVU19QRURJRE8uRU5WSUFETztcclxuXHR9XHJcblx0XHJcblx0JHNjb3BlLnBvZGVFZGl0YXJDb2RpZ29QZWRpZG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNBZG1pbmlzdHJhZG9yKCkgfHwgQXV0aGVudGljYXRpb25TZXJ2aWNlLmlzTWFzdGVyKCk7XHJcblx0fVxyXG5cdFxyXG5cdCRzY29wZS5idXNjYVByZWNvU2VtU3QgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRyZXR1cm4gUGVkaWRvUHJvZHV0b3NTZXJ2aWNlLmNhbGN1bGFQcmVjb0l0ZW1TZW1TdExpc3RhUGVkaWRvcyhpdGVtKTtcclxuXHR9XHJcblx0XHJcblx0JHNjb3BlLnZlcmlmaWNhUGVkaWRvQWx0ZXJhZG8gPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRyZXR1cm4gaXRlbS5kZXNjb250byA+IDA7XHJcblx0fVxyXG5cdFxyXG5cdCRzY29wZS52b2x0YXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcclxuXHR9XHJcbn1dKTtcclxuXHJcbmRldGFsaGVQZWRpZG9TYWx2b0l0ZW5zTW9kdWxlLmZpbHRlcigncGVyY2VudGFnZScsIFsnJGZpbHRlcicsIGZ1bmN0aW9uKCRmaWx0ZXIpe1xyXG5cdHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xyXG5cdFx0cmV0dXJuICRmaWx0ZXIoJ251bWJlcicpKGlucHV0ICogMTAwKSArICclJztcclxuXHR9O1xyXG59XSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBJbmR1c3RyaWFNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnaW5kdXN0cmlhLm1vZHVsZScpO1xuXG5JbmR1c3RyaWFNb2R1bGUuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gIHZhciBpbmR1c3RyaWEgPSB7XG4gICAgbmFtZTogJ21haW4uaW5kdXN0cmlhJyxcbiAgICB1cmw6ICcvaW5kdXN0cmlhJyxcbiAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgfTtcbiAgdmFyIGNhZGFzdHJvUHJhem8gPSB7XG4gICAgbmFtZTogJ21haW4uaW5kdXN0cmlhLnByYXpvJyxcbiAgICB1cmw6ICcvY2FkYXN0cm8tcHJhem8nLFxuICAgIGNvbXBvbmVudDogJ2NhZGFzdHJvUHJhem9Db21wb25lbnQnLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGxpc3RhSW5kdXN0cmlhczogZnVuY3Rpb24gKEluZHVzdHJpYVNlcnZpY2UpIHtcbiAgICAgICAgcmV0dXJuIEluZHVzdHJpYVNlcnZpY2UuZ2V0SW5kdXN0cmlhcygpO1xuICAgICAgfSxcbiAgICB9XG4gIH07XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGluZHVzdHJpYSk7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGNhZGFzdHJvUHJhem8pO1xufSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcclxuYW5ndWxhci5tb2R1bGUoJ2luZHVzdHJpYS5tb2R1bGUnLCBbJ3VpLnJvdXRlciddKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgSW5kdXN0cmlhTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2luZHVzdHJpYS5tb2R1bGUnKTtcclxuXHJcbkluZHVzdHJpYU1vZHVsZS5mYWN0b3J5KCdJbmR1c3RyaWFTZXJ2aWNlJywgWydIdHRwU2VydmljZScsXHJcbiAgZnVuY3Rpb24gKEh0dHBTZXJ2aWNlKSB7XHJcbiAgICB2YXIgc2VydmljZSA9IHt9O1xyXG4gICAgY29uc3QgU1VCUEFUSCA9ICdzZXJ2aWNlL2luZHVzdHJpYSc7XHJcblxyXG4gICAgY29uc3QgVVJMX0lORFVTVFJJQV9CVVNDQVJfSU5EVVNUUklBX1BPUl9JRF9VU1VBUklPID0gYCR7U1VCUEFUSH0vZ2V0SW5kdXN0cmlhc1VzdWFyaW9gO1xyXG4gICAgY29uc3QgVVJMX0lORFVTVFJJQV9CVVNDQVJfSU5EVVNUUklBID0gYCR7U1VCUEFUSH0vZ2V0SW5kdXN0cmlhc2A7XHJcblxyXG4gICAgc2VydmljZS5nZXRJbmR1c3RyaWFzQnlJZFVzdWFyaW8gPSAoaWRVc3VhcmlvKSA9PiB7XHJcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwUG9zdChVUkxfSU5EVVNUUklBX0JVU0NBUl9JTkRVU1RSSUFfUE9SX0lEX1VTVUFSSU8sIGlkVXN1YXJpbyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlcnZpY2UuZ2V0SW5kdXN0cmlhcyA9ICgpID0+IHtcclxuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBHZXQoVVJMX0lORFVTVFJJQV9CVVNDQVJfSU5EVVNUUklBKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcbiAgfVxyXG5dKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2luZHVzdHJpYS5wcmF6by5tb2R1bGUnLCBbXSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFBlZGlkb01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdpbmR1c3RyaWEucHJhem8ubW9kdWxlJyk7XHJcblxyXG5QZWRpZG9Nb2R1bGUuZmFjdG9yeSgnSW5kdXN0cmlhUHJhem9TZXJ2aWNlJywgWydIdHRwU2VydmljZScsXHJcbiAgZnVuY3Rpb24gKEh0dHBTZXJ2aWNlKSB7XHJcbiAgICB2YXIgc2VydmljZSA9IHt9O1xyXG4gICAgY29uc3QgU1VCUEFUSCA9ICdzZXJ2aWNlL2luZHVzdHJpYXByYXpvJztcclxuXHJcbiAgICBjb25zdCBVUkxfSU5EVVNUUklBX1BSQVpPX1NBTFZBUiA9IGAke1NVQlBBVEh9L3NhbHZhSW5kdXN0cmlhUHJhem9gO1xyXG4gICAgY29uc3QgVVJMX0lORFVTVFJJQV9QUkFaT19CVVNDQVJfUE9SX0lORFVTVFJJQSA9IGAke1NVQlBBVEh9L2dldEluZHVzdHJpYVByYXpvYDtcclxuICAgIGNvbnN0IFVSTF9JTkRVU1RSSUFfUFJBWk9fQlVTQ0FSX1BPUl9JRCA9IGAke1NVQlBBVEh9L2dldEluZHVzdHJpYVByYXpvQnlJZGA7XHJcbiAgICBjb25zdCBVUkxfSU5EVVNUUklBX1BSQVpPX0NMSUVOVEUgPSBgJHtTVUJQQVRIfS9nZXRJbmR1c3RyaWFQcmF6b091SW5kdXN0cmlhQ2xpZW50ZVByYXpvYDtcclxuICAgIGNvbnN0IFVSTF9JTkRVU1RSSUFfUFJBWk9fUkVNT1ZFUiA9IGAke1NVQlBBVEh9L3JlbW92ZXJJbmR1c3RyaWFQcmF6b2A7XHJcbiAgICBjb25zdCBVUkxfSU5EVVNUUklBX1BSQVpPX1BPUl9JTkRVU1RSSUFfQ0xJRU5URSA9IGAke1NVQlBBVEh9L2dldEluZHVzdHJpYUNsaWVudGVQcmF6b1BvcklkSW5kdXN0cmlhQ2xpZW50ZWA7XHJcblxyXG4gICAgc2VydmljZS5zYWx2YUluZHVzdHJpYVByYXpvID0gKGluZHVzdHJpYVByYXpvRHRvKSA9PiB7XHJcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwUG9zdChVUkxfSU5EVVNUUklBX1BSQVpPX1NBTFZBUiwgaW5kdXN0cmlhUHJhem9EdG8pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXJ2aWNlLmdldEluZHVzdHJpYVByYXpvID0gKGlkSW5kdXN0cmlhKSA9PiB7XHJcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwR2V0KFVSTF9JTkRVU1RSSUFfUFJBWk9fQlVTQ0FSX1BPUl9JTkRVU1RSSUEsIHtpZEluZHVzdHJpYX0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXJ2aWNlLmdldEluZHVzdHJpYVByYXpvQnlJZCA9IChpZEluZHVzdHJpYVByYXpvKSA9PiB7XHJcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwR2V0KFVSTF9JTkRVU1RSSUFfUFJBWk9fQlVTQ0FSX1BPUl9JRCwgaWRJbmR1c3RyaWFQcmF6byk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlcnZpY2UuZ2V0SW5kdXN0cmlhUHJhem9DbGllbnRlUHJhem8gPSAoaW5kdXN0cmlhUHJhem9TZWFyY2hEdG8pID0+IHtcclxuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBQb3N0KFVSTF9JTkRVU1RSSUFfUFJBWk9fQ0xJRU5URSwgaW5kdXN0cmlhUHJhem9TZWFyY2hEdG8pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXJ2aWNlLnJlbW92ZXJJbmR1c3RyaWFQcmF6byA9IChpZEluZHVzdHJpYVByYXpvKSA9PiB7XHJcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwR2V0KFVSTF9JTkRVU1RSSUFfUFJBWk9fUkVNT1ZFUiwge2lkSW5kdXN0cmlhUHJhem99KTtcclxuICAgIH07XHJcblxyXG4gICAgc2VydmljZS5nZXRJbmR1c3RyaWFDbGllbnRlUHJhem9Qb3JJZEluZHVzdHJpYUNsaWVudGUgPSAoKSA9PiB7XHJcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwR2V0KFVSTF9JTkRVU1RSSUFfUFJBWk9fUE9SX0lORFVTVFJJQV9DTElFTlRFKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcbiAgfVxyXG5dKTsiLCIndXNlIHN0cmljdCdcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdDYWRhc3Ryb0NsaWVudGVzJykuZmFjdG9yeSgnSW5kdXN0cmlhQ2xpZW50ZVByYXpvU2VydmljZScsIFsnTmV0d29ya1NlcnZpY2UnLCAnTm90aWZpY2F0aW9uU2VydmljZScsIGNvbnN0cnVjdG9yXSlcclxuXHJcbmZ1bmN0aW9uIGNvbnN0cnVjdG9yKE5ldHdvcmtTZXJ2aWNlLCBOb3RpZmljYXRpb25TZXJ2aWNlKSB7XHJcbiAgbGV0IHNlcnZpY2UgPSB7fTtcclxuICBzZXJ2aWNlLmdldEluZHVzdHJpYUNsaWVudGVQcmF6b1BvcklkSW5kdXN0cmlhQ2xpZW50ZSA9IGZ1bmN0aW9uKGlkSW5kdXN0cmlhQ2xpZW50ZSwgY2FsbGJhY2spIHtcclxuICAgIE5ldHdvcmtTZXJ2aWNlLmh0dHBHZXQoJy9nZXRJbmR1c3RyaWFDbGllbnRlUHJhem9Qb3JJZEluZHVzdHJpYUNsaWVudGU/aWRJbmR1c3RyaWFDbGllbnRlPScgKyBpZEluZHVzdHJpYUNsaWVudGUsIChyZXN1bHQsIGRhdGEpID0+IHtcclxuICAgICAgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULk9LKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSlcclxuICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5FUlJPUikge1xyXG4gICAgICAgIE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gYnVzY2FyIHByYXpvcyBkbyBjbGllbnRlIG5hIGluZMO6c3RyaWEnLCBkYXRhKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBOb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdGYWxoYSEgRGV2ZS1zZSBpbXBsZW1lbnRhciBidXNjYSBkZSBkYWRvcyBsb2NhbCcpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgc2VydmljZS5nZXRJbmR1c3RyaWFQcmF6b091SW5kdXN0cmlhQ2xpZW50ZVByYXpvID0gZnVuY3Rpb24oaWRJbmR1c3RyaWEsIGlkQ2xpZW50ZSwgY2FsbGJhY2spIHtcclxuICAgIE5ldHdvcmtTZXJ2aWNlLmh0dHBQb3N0KCcvZ2V0SW5kdXN0cmlhUHJhem9PdUluZHVzdHJpYUNsaWVudGVQcmF6by8nLCB7aWRJbmR1c3RyaWE6IGlkSW5kdXN0cmlhLCBpZENsaWVudGU6IGlkQ2xpZW50ZX0sIChyZXN1bHQsIGRhdGEpID0+IHtcclxuICAgICAgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULk9LKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSlcclxuICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5FUlJPUikge1xyXG4gICAgICAgIE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gYnVzY2FyIHByYXpvcyBkbyBjbGllbnRlIG5hIGluZMO6c3RyaWEnLCBkYXRhKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBOb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdGYWxoYSEgRGV2ZS1zZSBpbXBsZW1lbnRhciBidXNjYSBkZSBkYWRvcyBsb2NhbCcpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuICByZXR1cm4gc2VydmljZTtcclxufSIsIid1c2Ugc3RyaWN0J1xyXG5hbmd1bGFyLm1vZHVsZSgnSW5kdXN0cmlhcycpLmNvbnRyb2xsZXIoJ0luZHVzdHJpYXNDb250cm9sbGVyJywgWyckc2NvcGUnLCAnSW5kdXN0cmlhc1NlcnZpY2UnLCAnTm90aWZpY2F0aW9uU2VydmljZScsICdNb2RhbFNlcnZpY2UnLCBjb25zdHJ1Y3Rvcl0pXHJcblxyXG5mdW5jdGlvbiBjb25zdHJ1Y3Rvcigkc2NvcGUsIHNlcnZpY2UsIE5vdGlmaWNhdGlvblNlcnZpY2UsIE1vZGFsU2VydmljZSkge1xyXG5cclxuICAkc2NvcGUuaW5kdXN0cmlhID0ge31cclxuICAkc2NvcGUubGlzdGFQcmF6b0RpYSA9IFtdXHJcbiAgJHNjb3BlLmxpc3RhUHJhem8gPSBbXVxyXG4gICRzY29wZS5kaWFTZWxlY2lvbmFkbyA9IHtcclxuICAgIGRpYTogdW5kZWZpbmVkXHJcbiAgfVxyXG5cclxuICAkc2NvcGUucHJhem9EaWEgPSB7XHJcbiAgICBwcmF6bzogdW5kZWZpbmVkLFxyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmluZHVzdHJpYVByYXpvRHRvID0ge1xyXG4gICAgZGlhczogW11cclxuICB9XHJcblxyXG4gIGluaWNpYWxpemFEYWRvcygpXHJcblxyXG4gIHNlcnZpY2UuZ2V0SW5kdXN0cmlhcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAkc2NvcGUubGlzdGFJbmR1c3RyaWFzID0gcmVzdWx0XHJcbiAgfSlcclxuXHJcbiAgJHNjb3BlLmFkaWNpb25hRGlhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGV4aXN0ZSA9ICQuZ3JlcCgkc2NvcGUubGlzdGFQcmF6b0RpYSwgZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcclxuICAgICAgcmV0dXJuIGl0ZW0gPT09ICRzY29wZS5wcmF6b0RpYS5wcmF6b1xyXG4gICAgfSlcclxuICAgIGlmKGV4aXN0ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJHNjb3BlLmxpc3RhUHJhem9EaWEucHVzaCgkc2NvcGUucHJhem9EaWEucHJhem8pXHJcbiAgICAgICRzY29wZS5wcmF6b0RpYS5wcmF6byA9IHVuZGVmaW5lZFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmJ1c2NhRGlhcyA9IGZ1bmN0aW9uIChwcmF6bykge1xyXG4gICAgbGV0IHN0ckRpYXMgPSBcIlwiXHJcbiAgICBpZiAocHJhem8gJiYgcHJhem8uZGlhcykge1xyXG4gICAgICBwcmF6by5kaWFzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgaWYgKHN0ckRpYXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgIHN0ckRpYXMgPSBlbGVtZW50LnByYXpvXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN0ckRpYXMgPSBgJHtzdHJEaWFzfSAtICR7ZWxlbWVudC5wcmF6b31gXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0ckRpYXNcclxuICB9XHJcblxyXG4gICRzY29wZS5jYXJyZWdhRGFkb3NJbmR1c3RyaWEgPSBmdW5jdGlvbiAoaW5kdXN0cmlhKSB7XHJcbiAgICAkc2NvcGUuaW5kdXN0cmlhUHJhem9EdG8uaWRJbmR1c3RyaWEgPSBpbmR1c3RyaWEuaWRcclxuXHJcbiAgICBzZXJ2aWNlLmdldFByYXpvc0luZHVzdHJpYShpbmR1c3RyaWEuaWQsIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgJHNjb3BlLmxpc3RhUHJhem8gPSByZXN1bHRcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICAkc2NvcGUuc2FsdmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYoISRzY29wZS5saXN0YVByYXpvRGlhIHx8ICRzY29wZS5saXN0YVByYXpvRGlhLmxlbmd0aCA8IDEpIHtcclxuICAgICAgTm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignw4kgbmVjZXNzw6FyaW8gZm9ybmVjZXIgYW8gbWVub3MgdW0gZGlhIScpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgJHNjb3BlLmxpc3RhUHJhem9EaWEuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgY29uc3QgaW5kdXN0cmlhUHJhem9EaWFEdG8gPSB7XHJcbiAgICAgICAgcHJhem86IGVsZW1lbnRcclxuICAgICAgfVxyXG4gICAgICAkc2NvcGUuaW5kdXN0cmlhUHJhem9EdG8uZGlhcy5wdXNoKGluZHVzdHJpYVByYXpvRGlhRHRvKVxyXG4gICAgfSlcclxuICAgIHNlcnZpY2Uuc2FsdmFJbmR1c3RyaWFQcmF6bygkc2NvcGUuaW5kdXN0cmlhUHJhem9EdG8sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgTm90aWZpY2F0aW9uU2VydmljZS5zdWNjZXNzKCdQcmF6b3MgZGEgaW5kw7pzdHJpYSBhdHVhbGl6YWRvIGNvbSBzdWNlc3NvIScpO1xyXG4gICAgICBhdHVhbGl6YUxpc3RhUHJhem9zKClcclxuICAgICAgaW5pY2lhbGl6YURhZG9zKClcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICAkc2NvcGUucmVtb3ZlckRpYSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICRzY29wZS5saXN0YVByYXpvRGlhID0gJC5ncmVwKCRzY29wZS5saXN0YVByYXpvRGlhLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgcmV0dXJuIHZhbHVlICE9PSAkc2NvcGUuZGlhU2VsZWNpb25hZG8uZGlhXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmV4Y2x1aXJQcmF6b3NJbmR1c3RyaWEgPSBmdW5jdGlvbiAoaWRQcmF6b0luZHVzdHJpYSkge1xyXG4gICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgY2xvc2VCdXR0b25UZXh0OiAnTsOjbycsXHJcbiAgICAgIGFjdGlvbkJ1dHRvblRleHQ6ICdTaW0nLFxyXG4gICAgICBoZWFkZXJUZXh0OiAnQ29uZmlybWFyJyxcclxuICAgICAgYm9keVRleHQ6ICdDb25maXJtYSBFWENMVVPDg08gZG8gcHJhem8gcGFyYSBhIGluZMO6c3RyaWE/J1xyXG4gICAgfVxyXG4gICAgTW9kYWxTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgc2VydmljZS5leGNsdWlyUHJhem9zSW5kdXN0cmlhKGlkUHJhem9JbmR1c3RyaWEsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBOb3RpZmljYXRpb25TZXJ2aWNlLnN1Y2Nlc3MoJ1ByYXpvIGV4Y2x1w61kbyBjb20gc3VjZXNzbyEnKTtcclxuICAgICAgICBhdHVhbGl6YUxpc3RhUHJhem9zKClcclxuICAgICAgfSksIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBOb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGV4Y2x1aXIgcHJhem8hIScpO1xyXG4gICAgICAgIGF0dWFsaXphTGlzdGFQcmF6b3MoKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXR1YWxpemFMaXN0YVByYXpvcygpIHtcclxuICAgICRzY29wZS5jYXJyZWdhRGFkb3NJbmR1c3RyaWEoJHNjb3BlLmluZHVzdHJpYS5zZWxlY2lvbmFkbylcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluaWNpYWxpemFEYWRvcygpIHtcclxuICAgICRzY29wZS5pbmR1c3RyaWFQcmF6b0R0by5kaWFzID0gW11cclxuICAgICRzY29wZS5pbmR1c3RyaWFQcmF6b0R0by5jb2RpZ28gPSB1bmRlZmluZWRcclxuICAgICRzY29wZS5pbmR1c3RyaWFQcmF6b0R0by5kZXNjcmljYW8gPSB1bmRlZmluZWRcclxuICAgICRzY29wZS5saXN0YVByYXpvRGlhID0gW11cclxuICB9XHJcblxyXG59XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ0luZHVzdHJpYXMnKVxyXG5cclxuXHQuZmFjdG9yeSgnSW5kdXN0cmlhc1NlcnZpY2UnLCBbJyRodHRwJywgJyRyb290U2NvcGUnLCAnTmV0d29ya1NlcnZpY2UnLCAnTm90aWZpY2F0aW9uU2VydmljZScsICdTdG9yYWdlU2VydmljZScsXHJcblx0XHRmdW5jdGlvbiAoJGh0dHAsICRyb290U2NvcGUsIE5ldHdvcmtTZXJ2aWNlLCBOb3RpZmljYXRpb25TZXJ2aWNlLCBTdG9yYWdlU2VydmljZSkge1xyXG5cdFx0XHR2YXIgc2VydmljZSA9IHt9O1xyXG5cdFx0XHR2YXIgaW5kdXN0cmlhU2VsZWNpb25hZGEgPSBudWxsO1xyXG5cclxuXHRcdFx0c2VydmljZS5zZXRJbmR1c3RyaWEgPSBmdW5jdGlvbiAoaW5kdXN0cmlhKSB7XHJcblx0XHRcdFx0aW5kdXN0cmlhU2VsZWNpb25hZGEgPSBpbmR1c3RyaWE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlcnZpY2UuZ2V0SW5kdXN0cmlhID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHJldHVybiBpbmR1c3RyaWFTZWxlY2lvbmFkYTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2VydmljZS5nZXRJbmR1c3RyaWFDbGllbnRlID0gZnVuY3Rpb24gKGlkSW5kdXN0cmlhLCBpZENsaWVudGUsIGNhbGxiYWNrKSB7XHJcblx0XHRcdFx0TmV0d29ya1NlcnZpY2UuaHR0cFBvc3QoJy9nZXRJbmR1c3RyaWFDbGllbnRlLycsIHsgaWRJbmR1c3RyaWE6IGlkSW5kdXN0cmlhLCBpZENsaWVudGU6IGlkQ2xpZW50ZSB9LCBmdW5jdGlvbiAocmVzdWx0LCBkYXRhKSB7XHJcblx0XHRcdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soZGF0YSlcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBidXNjYXIgaW5kw7pzdHJpYXMgZG8gY2xpZW50ZScsIGRhdGEpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRmFsaGEgZGUgY29tdW5pY2HDp8OjbyBjb20gbyBzZXJ2aWRvcicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlcnZpY2UuZ2V0VGFiZWxhc0luZHVzdHJpYSA9IGZ1bmN0aW9uIChpZEluZHVzdHJpYSwgY2FsbGJhY2spIHtcclxuXHRcdFx0XHROZXR3b3JrU2VydmljZS5odHRwUG9zdCgnL2dldFRhYmVsYXNQb3JJbmR1c3RyaWEvJywgaWRJbmR1c3RyaWEsIGZ1bmN0aW9uIChyZXN1bHQsIGRhdGEpIHtcclxuXHRcdFx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5FUlJPUikge1xyXG5cdFx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciB0YWJlbGFzIGRhIGluZMO6c3RyaWEnLCBkYXRhKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGNhbGxiYWNrKFN0b3JhZ2VTZXJ2aWNlLmdldFRhYmVsYXNJbmR1c3RyaWEoaWRVc3VhcmlvKSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZXJ2aWNlLmdldEluZHVzdHJpYXNVc3VhcmlvID0gZnVuY3Rpb24gKGlkVXN1YXJpbywgY2FsbGJhY2spIHtcclxuXHRcdFx0XHROZXR3b3JrU2VydmljZS5odHRwUG9zdCgnL2dldEluZHVzdHJpYXNVc3VhcmlvLycsIGlkVXN1YXJpbywgZnVuY3Rpb24gKHJlc3VsdCwgZGF0YSkge1xyXG5cdFx0XHRcdFx0aWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULk9LKSB7XHJcblx0XHRcdFx0XHRcdGNhbGxiYWNrKGRhdGEpXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gYnVzY2FyIGluZMO6c3RyaWFzJywgZGF0YSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRjYWxsYmFjayhTdG9yYWdlU2VydmljZS5nZXRJbmR1c3RyaWFzVXN1YXJpbyhpZFVzdWFyaW8pKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlcnZpY2UuZ2V0SW5kdXN0cmlhcyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG5cdFx0XHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBHZXQoJy9nZXRJbmR1c3RyaWFzLycsIGZ1bmN0aW9uIChyZXN1bHQsIGRhdGEpIHtcclxuXHRcdFx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5FUlJPUikge1xyXG5cdFx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciBpbmTDunN0cmlhcycsIGRhdGEpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZXJ2aWNlLnNhbHZhSW5kdXN0cmlhUHJhem8gPSBmdW5jdGlvbiAoaW5kdXN0cmlhUHJhem9EdG8sIGNhbGxiYWNrKSB7XHJcblx0XHRcdFx0TmV0d29ya1NlcnZpY2UuaHR0cFBvc3QoJy9zYWx2YUluZHVzdHJpYVByYXpvJywgaW5kdXN0cmlhUHJhem9EdG8sIGZ1bmN0aW9uIChyZXN1bHQsIGRhdGEpIHtcclxuXHRcdFx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5FUlJPUikge1xyXG5cdFx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciBwcmF6b3MgZGFzIGluZMO6c3RyaWFzJywgZGF0YSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdOw6NvIGZvaSBwb3Nzw612ZWwgc2UgY29tdW5pY2FyIGNvbSBvIHNlcnZpZG9yLicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlcnZpY2UuZ2V0UHJhem9zSW5kdXN0cmlhID0gZnVuY3Rpb24gKGlkSW5kdXN0cmlhLCBjYWxsYmFjaykge1xyXG5cdFx0XHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBHZXQoJy9nZXRJbmR1c3RyaWFQcmF6by8/aWRJbmR1c3RyaWE9JyArIGlkSW5kdXN0cmlhLCBmdW5jdGlvbiAocmVzdWx0LCBkYXRhKSB7XHJcblx0XHRcdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soZGF0YSlcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBidXNjYXIgcHJhem9zIGRhcyBpbmTDunN0cmlhcycsIGRhdGEpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZXJ2aWNlLmV4Y2x1aXJQcmF6b3NJbmR1c3RyaWEgPSBmdW5jdGlvbiAoaWRJbmR1c3RyaWFQcmF6bywgY2FsbGJhY2spIHtcclxuXHRcdFx0XHROZXR3b3JrU2VydmljZS5odHRwR2V0KCcvcmVtb3ZlckluZHVzdHJpYVByYXpvLz9pZEluZHVzdHJpYVByYXpvPScgKyBpZEluZHVzdHJpYVByYXpvLCBmdW5jdGlvbiAocmVzdWx0LCBkYXRhKSB7XHJcblx0XHRcdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soZGF0YSlcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBleGNsdWlyIHByYXpvcyBkYXMgaW5kw7pzdHJpYXMnLCBkYXRhKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ07Do28gZm9pIHBvc3PDrXZlbCBzZSBjb211bmljYXIgY29tIG8gc2Vydmlkb3IuJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHNlcnZpY2U7XHJcblx0XHR9XHJcblx0XSk7IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnRGV0YWxoZVBlZGlkb0l0ZW5zJykuZmFjdG9yeSgnSW5kdXN0cmlhUHJhem9TZXJ2aWNlJywgWydOZXR3b3JrU2VydmljZScsICdOb3RpZmljYXRpb25TZXJ2aWNlJywgY29uc3RydWN0b3JdKVxyXG5cclxuZnVuY3Rpb24gY29uc3RydWN0b3IoTmV0d29ya1NlcnZpY2UsIE5vdGlmaWNhdGlvblNlcnZpY2UpIHtcclxuICBsZXQgc2VydmljZSA9IHt9O1xyXG4gIHNlcnZpY2UuZ2V0SW5kdXN0cmlhUHJhem9Qb3JJZCA9IGZ1bmN0aW9uKGlkSW5kdXN0cmlhUHJhem8sIGNhbGxiYWNrKSB7XHJcbiAgICBOZXR3b3JrU2VydmljZS5odHRwR2V0KCcvZ2V0SW5kdXN0cmlhUHJhem9CeUlkP2lkSW5kdXN0cmlhUHJhem89JyArIGlkSW5kdXN0cmlhUHJhem8sIChyZXN1bHQsIGRhdGEpID0+IHtcclxuICAgICAgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULk9LKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSlcclxuICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5FUlJPUikge1xyXG4gICAgICAgIE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gYnVzY2FyIHByYXpvIGRhIGluZMO6c3RyaWEnLCBkYXRhKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBOb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdGYWxoYSEgRGV2ZS1zZSBpbXBsZW1lbnRhciBidXNjYSBkZSBkYWRvcyBsb2NhbCcpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuICByZXR1cm4gc2VydmljZTtcclxufSIsIid1c2Ugc3RyaWN0JztcclxuYW5ndWxhci5tb2R1bGUoJ0l0ZW0nKVxyXG4uY29udHJvbGxlcignSXRlbUNvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsICckaHR0cCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkaHR0cCkge1xyXG5cdFxyXG59XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ1BlZGlkb1Byb2R1dG9zJykiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnR2VyZW5jaWFkb3JGaW5hbmNlaXJvRmxlY2hhVmVuZGFzJylcclxuXHJcbi5mYWN0b3J5KCdNYXBwZXJTZXJ2aWNlJywgWyAnJGh0dHAnLCAnJHJvb3RTY29wZScsIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7fTtcclxuXHRcclxuXHRyZXR1cm4gc2VydmljZTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdNb2RhbEFwcCcsIFsndWkuYm9vdHN0cmFwJ10pLnNlcnZpY2UoJ01vZGFsU2VydmljZScsIFsnJHVpYk1vZGFsJyxcclxuICAgIGZ1bmN0aW9uICgkdWliTW9kYWwpIHtcclxuICAgICAgICB2YXIgbW9kYWxEZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgYmFja2Ryb3A6IHRydWUsXHJcbiAgICAgICAgICAgIGtleWJvYXJkOiB0cnVlLFxyXG4gICAgICAgICAgICBtb2RhbEZhZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbW9kdWxlcy9tb2RhbC9tb2RhbC5odG1sJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dDogJ0NhbmNlbGFyJyxcclxuICAgICAgICAgICAgYWN0aW9uQnV0dG9uVGV4dDogJ0NvbmZpcm1hcicsXHJcbiAgICAgICAgICAgIGhlYWRlclRleHQ6ICdDb250aW51YT8nLFxyXG4gICAgICAgICAgICBib2R5VGV4dDogJ0V4ZWN1dGFyIGVzdGEgYcOnw6NvPycsXHJcbiAgICAgICAgICAgIGJvZHlEYXRhTGlzdDogW10sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93TW9kYWwgPSBmdW5jdGlvbiAoY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmICghY3VzdG9tTW9kYWxEZWZhdWx0cykgY3VzdG9tTW9kYWxEZWZhdWx0cyA9IHt9O1xyXG4gICAgICAgICAgICBjdXN0b21Nb2RhbERlZmF1bHRzLmJhY2tkcm9wID0gJ3N0YXRpYyc7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3coY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNob3cgPSBmdW5jdGlvbiAoY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIC8vQ3JlYXRlIHRlbXAgb2JqZWN0cyB0byB3b3JrIHdpdGggc2luY2Ugd2UncmUgaW4gYSBzaW5nbGV0b24gc2VydmljZVxyXG4gICAgICAgICAgICB2YXIgdGVtcE1vZGFsRGVmYXVsdHMgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHRlbXBNb2RhbE9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIC8vTWFwIGFuZ3VsYXItdWkgbW9kYWwgY3VzdG9tIGRlZmF1bHRzIHRvIG1vZGFsIGRlZmF1bHRzIGRlZmluZWQgaW4gc2VydmljZVxyXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZCh0ZW1wTW9kYWxEZWZhdWx0cywgbW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxEZWZhdWx0cyk7XHJcblxyXG4gICAgICAgICAgICAvL01hcCBtb2RhbC5odG1sICRzY29wZSBjdXN0b20gcHJvcGVydGllcyB0byBkZWZhdWx0cyBkZWZpbmVkIGluIHNlcnZpY2VcclxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQodGVtcE1vZGFsT3B0aW9ucywgbW9kYWxPcHRpb25zLCBjdXN0b21Nb2RhbE9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0ZW1wTW9kYWxEZWZhdWx0cy5jb250cm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wTW9kYWxEZWZhdWx0cy5jb250cm9sbGVyID0gZnVuY3Rpb24gKCRzY29wZSwgJHVpYk1vZGFsSW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRPcHRpb24gPSBudWxsIC8vSXRlbSBhdHVhbG1lbnRlIHNlbGVjaW9uYWRvXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkRWxlbWVudCA9IG51bGwgLy9FbGVtZW50byBhdHVhbG1lbnRlIHNlbGVjaW9uYWRvXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucyA9IHRlbXBNb2RhbE9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucy5vayA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBcdCR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLmNsb3NlID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIFx0JHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWNpb25hVG9kb3MgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3RMaW5lID0gZnVuY3Rpb24gKCRldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9ICRldmVudC5jdXJyZW50VGFyZ2V0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighJHNjb3BlLnNlbGVjdGVkRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0TGluZShlbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoJHNjb3BlLnNlbGVjdGVkRWxlbWVudCA9PSBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzc2VsZWN0TGluZSgkc2NvcGUuc2VsZWN0ZWRFbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNzZWxlY3RMaW5lKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RMaW5lKGVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnBlc3F1aXNhID0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5maWx0cm9DbGllbnRlcyA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoJHNjb3BlLnBlc3F1aXNhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5ub21lLmluZGV4T2YoJHNjb3BlLnBlc3F1aXNhLnRvVXBwZXJDYXNlKCkpICE9PSAtMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZWxlY3RMaW5lKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkRWxlbWVudCA9IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkT3B0aW9uID0gZWxlbWVudC5kYXRhc2V0Lml0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYigyNTUsMjAwLDIwMCknO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZXNzZWxlY3RMaW5lKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkRWxlbWVudCA9IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkT3B0aW9uID0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1hcmNhclRvZG9zID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY2lvbmFUb2RvcyA9ICEkc2NvcGUuc2VsZWNpb25hVG9kb3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucy5ib2R5RGF0YUxpc3QuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubGlzdGFDbGllbnRlLmZvckVhY2goY2xpZW50ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50ZS5pbXBvcnRhciA9ICRzY29wZS5zZWxlY2lvbmFUb2Rvc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAkdWliTW9kYWwub3Blbih0ZW1wTW9kYWxEZWZhdWx0cykucmVzdWx0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfV0pOyIsIid1c2Ugc3RyaWN0J1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ0dlcmVuY2lhZG9yRmluYW5jZWlyb0ZsZWNoYVZlbmRhcycpXHJcblxyXG4uZmFjdG9yeSgnTG9jYWxTdG9yYWdlU2VydmljZScsIFsgJyRodHRwJywgJyRyb290U2NvcGUnLCBmdW5jdGlvbigkaHR0cCwgJHJvb3RTY29wZSkge1xyXG4gIGxldCBzZXJ2aWNlID0ge31cclxuXHJcbiAgc2VydmljZS5nZXREYXRhID0gZnVuY3Rpb24oaXRlbU5hbWUpIHtcclxuICBcdGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGl0ZW1OYW1lKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaXRlbU5hbWUpKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdFx0fVxyXG4gIH1cclxuXHJcbiAgc2VydmljZS5zZXREYXRhID0gZnVuY3Rpb24oaXRlbU5hbWUsIGRhdGEpIHtcclxuICAgIGlmKGRhdGEpIHtcclxuXHRcdCAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaXRlbU5hbWUsIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2VydmljZS5lcmFzZURhdGEgPSBmdW5jdGlvbihpdGVtTmFtZSkge1xyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oaXRlbU5hbWUpXHJcbiAgfVxyXG5cclxuICBzZXJ2aWNlLnJlc2V0RGF0YSA9IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICBpZihEQVRBQkFTRS5JRCA9PT0gaWQpIHtcclxuICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBzZXJ2aWNlXHJcbn1dKSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ0dlcmVuY2lhZG9yRmluYW5jZWlyb0ZsZWNoYVZlbmRhcycpLmZhY3RvcnkoJ05ldHdvcmtTZXJ2aWNlJywgW1xyXG5cdCckaHR0cCcsXHJcblx0JyRyb290U2NvcGUnLFxyXG5cdCckdGltZW91dCcsXHJcblx0J2Jsb2NrVUknLFxyXG5cdGNvbnN0cnVjdG9yLFxyXG5dKVxyXG5cclxuZnVuY3Rpb24gY29uc3RydWN0b3IoJGh0dHAsICRyb290U2NvcGUsICR0aW1lb3V0LCBibG9ja1VJKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7fTtcclxuXHJcblx0c2VydmljZS5zdGFydE5ldHdvcmtNb25pdG9yID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZihzZXJ2aWNlLmlzTW9iaWxlKCkpIHtcclxuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0TkVUV09SSy5TVEFUVVMgPSBORVRXT1JLX1NUQVRVUy5PTkxJTkVcclxuXHRcdFx0XHQkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG5cdFx0XHR9LCBmYWxzZSk7XHJcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRORVRXT1JLLlNUQVRVUyA9IE5FVFdPUktfU1RBVFVTLk9GRk5MSU5FXHJcblx0XHRcdFx0JHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHRcdFx0fSwgZmFsc2UpO1xyXG5cclxuXHRcdFx0TkVUV09SSy5TVEFUVVMgPSBzZXJ2aWNlLmlzT25saW5lKClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuZ2V0TmV0d29ya1N0YXR1cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIE5FVFdPUksuU1RBVFVTXHJcblx0fVxyXG5cclxuXHRzZXJ2aWNlLmlzT25saW5lID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZihuYXZpZ2F0b3IuY29ubmVjdGlvbi50eXBlICE9IENvbm5lY3Rpb24uVU5LTk9XTiAmJiBuYXZpZ2F0b3IuY29ubmVjdGlvbi50eXBlICE9IENvbm5lY3Rpb24uTk9ORSkge1xyXG5cdFx0XHQkcm9vdFNjb3BlLmdsb2JhbHMub25saW5lID0gdHJ1ZVxyXG5cdFx0XHRyZXR1cm4gTkVUV09SS19TVEFUVVMuT05MSU5FXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkcm9vdFNjb3BlLmdsb2JhbHMub25saW5lID0gZmFsc2VcclxuXHRcdFx0cmV0dXJuIE5FVFdPUktfU1RBVFVTLk9GRk5MSU5FXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzZXJ2aWNlLmlzTW9iaWxlID0gZnVuY3Rpb24oKSB7XHJcblx0XHQvLyByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKGlQaG9uZXxpUG9kfGlQYWR8QW5kcm9pZHxCbGFja0JlcnJ5fElFTW9iaWxlKS8pXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuaHR0cFBvc3QgPSBmdW5jdGlvbihwYXRoLCBwYXJhbSwgY2FsbGJhY2spIHtcclxuXHRcdGJsb2NrVUkuc3RhcnQoKVxyXG5cdFx0JHRpbWVvdXQoY2FsbEF0VGltZW91dCwgVElNRU9VVClcclxuXHRcdGNvbnN0IG9wdCA9IHsndGltZW91dCcgOiBUSU1FT1VUIH1cclxuXHRcdCRodHRwLnBvc3QoTU9ET19IVFRQICsgVVJMICsgcGF0aCwgcGFyYW0sIG9wdClcclxuXHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soQ0FMTFJFU1VMVC5PSywgcmVzcG9uc2UpXHJcblx0XHRcdH0pXHJcblx0XHRcdC5lcnJvcihmdW5jdGlvbihlcnJvcikge1xyXG5cdFx0XHRcdGlmKGVycm9yKSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjayhDQUxMUkVTVUxULkVSUk9SLCBlcnJvcilcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soQ0FMTFJFU1VMVC5VTktOT1dOLCBudWxsKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmZpbmFsbHkoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0YmxvY2tVSS5zdG9wKClcclxuXHRcdFx0fSlcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuaHR0cEdldCA9IGZ1bmN0aW9uKHBhdGgsIGNhbGxiYWNrKSB7XHJcblx0XHRibG9ja1VJLnN0YXJ0KClcclxuXHRcdC8vJHRpbWVvdXQoY2FsbEF0VGltZW91dCwgVElNRU9VVClcclxuXHRcdGNvbnN0IG9wdCA9IHsndGltZW91dCcgOiBUSU1FT1VUIH1cclxuXHRcdCRodHRwLmdldChNT0RPX0hUVFAgKyBVUkwgKyBwYXRoLCBvcHQpXHJcblx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGNhbGxiYWNrKENBTExSRVNVTFQuT0ssIHJlc3BvbnNlKVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcclxuXHRcdFx0XHRpZihlcnJvcikge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soQ0FMTFJFU1VMVC5FUlJPUiwgZXJyb3IpXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKENBTExSRVNVTFQuVU5LTk9XTiwgbnVsbClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC5maW5hbGx5KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGJsb2NrVUkuc3RvcCgpXHJcblx0XHRcdH0pXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjYWxsQXRUaW1lb3V0KCkge1xyXG5cdFx0YmxvY2tVSS5zdG9wKClcclxuXHR9XHJcblxyXG5cdHJldHVybiBzZXJ2aWNlO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ0dlcmVuY2lhZG9yRmluYW5jZWlyb0ZsZWNoYVZlbmRhcycpLmZhY3RvcnkoJ09ic2VydmFjYW9TZXJ2aWNlJywgW1xyXG4gICckaHR0cCcsXHJcbiAgJ05ldHdvcmtTZXJ2aWNlJyxcclxuICAnTm90aWZpY2F0aW9uU2VydmljZScsXHJcblx0Y29uc3RydWN0b3IsXHJcbl0pXHJcblxyXG5mdW5jdGlvbiBjb25zdHJ1Y3RvcigkaHR0cCwgTmV0d29ya1NlcnZpY2UsIE5vdGlmaWNhdGlvblNlcnZpY2UpIHtcclxuICB2YXIgc2VydmljZSA9IHt9O1xyXG5cclxuICBzZXJ2aWNlLmdldE9ic2VydmFjb2VzUGVkaWRvID0gZnVuY3Rpb24oaWRQZWRpZG8sIGNhbGxiYWNrKSB7XHJcbiAgICBOZXR3b3JrU2VydmljZS5odHRwR2V0KGAvZ2V0T2JzZXJ2YWNvZXNQZWRpZG8vP2lkUGVkaWRvPSR7aWRQZWRpZG99YCwgZnVuY3Rpb24gKHJlc3VsdCwgZGF0YSkge1xyXG4gICAgICBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuICAgICAgICBjYWxsYmFjayhkYXRhKVxyXG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcbiAgICAgICAgTm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBidXNjYXIgb2JzZXJ2YcOnw7VlcyBkbyBwZWRpZG8nLCBkYXRhKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBOb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdGYWxoYSBkZSBjb211bmljYcOnw6NvIGNvbSBvIHNlcnZpZG9yJyk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBzZXJ2aWNlLmF0dWFsaXphT2JzZXJ2YWNvZXMgPSBmdW5jdGlvbihvYnNlcnZhY2FvUGVkaWRvVXBkYXRlRHRvLCBjYWxsYmFjaykge1xyXG4gICAgTmV0d29ya1NlcnZpY2UuaHR0cFBvc3QoJy9zZXRPYnNlcnZhY29lc1BlZGlkbycsIG9ic2VydmFjYW9QZWRpZG9VcGRhdGVEdG8sZnVuY3Rpb24gKHJlc3VsdCwgZGF0YSkge1xyXG4gICAgICBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuICAgICAgICBjYWxsYmFjayhkYXRhKVxyXG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcbiAgICAgICAgTm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBzYWx2YXIgb2JzZXJ2YcOnw7VlcyBkbyBwZWRpZG8nLCBkYXRhKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBOb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdGYWxoYSBkZSBjb211bmljYcOnw6NvIGNvbSBvIHNlcnZpZG9yJyk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuXHRyZXR1cm4gc2VydmljZTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUGVkaWRvTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BlZGlkby5tb2R1bGUnKTtcclxuXHJcblBlZGlkb01vZHVsZS5mYWN0b3J5KCdQZWRpZG9DYWxjdWxvU2VydmljZScsIFsnJGZpbHRlcicsXHJcbiAgZnVuY3Rpb24gKCRmaWx0ZXIpIHtcclxuXHJcbiAgICB2YXIgc2VydmljZSA9IHt9O1xyXG5cclxuICAgIHNlcnZpY2UuZ2V0VmFsb3JUb3RhbFBlZGlkbyA9IGZ1bmN0aW9uIChwZWRpZG8pIHtcclxuICAgICAgbGV0IHRvdGFsID0gMDtcclxuICAgICAgJGZpbHRlcignaXRlbnNBZGljaW9uYWRvc0ZpbHRlcicsIG51bGwpKHBlZGlkby50YWJlbGEuaXRlbnMpLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgdG90YWwgKz0gaXRlbS5wcmVjb0NvbUltcG9zdG8gKiBpdGVtLnF1YW50aWRhZGVTb2xpY2l0YWRhO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHRvdGFsO1xyXG4gICAgfVxyXG5cclxuICAgIHNlcnZpY2UuZ2V0VmFsb3JUb3RhbFBlZGlkb1NlbUltcG9zdG8gPSBmdW5jdGlvbiAocGVkaWRvKSB7XHJcbiAgICAgIGxldCB0b3RhbCA9IDA7XHJcbiAgICAgICRmaWx0ZXIoJ2l0ZW5zQWRpY2lvbmFkb3NGaWx0ZXInLCBudWxsKShwZWRpZG8udGFiZWxhLml0ZW5zKS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIHRvdGFsICs9IGl0ZW0ucHJlY29TZW1JbXBvc3RvICogaXRlbS5xdWFudGlkYWRlU29saWNpdGFkYTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiB0b3RhbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXJ2aWNlLmdldFRvdGFsSXRlbnMgPSBmdW5jdGlvbiAocGVkaWRvKSB7XHJcbiAgICAgIGxldCB0b3RhbCA9IDA7XHJcbiAgICAgICRmaWx0ZXIoJ2l0ZW5zQWRpY2lvbmFkb3NGaWx0ZXInLCBudWxsKShwZWRpZG8udGFiZWxhLml0ZW5zKS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIHRvdGFsICs9IGl0ZW0ucXVhbnRpZGFkZVNvbGljaXRhZGE7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gdG90YWw7XHJcbiAgICB9XHJcblxyXG4gICAgc2VydmljZS5nZXRWYWxvckltcG9zdG8gPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICByZXR1cm4gaXRlbS5wcmVjbyAqIChpdGVtLnN0ICsgaXRlbS5pcGkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlcnZpY2UuZ2V0VmFsb3JEZXNjb250byA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgIHJldHVybiBpdGVtLnByZWNvICogaXRlbS5kZXNjb250bztcclxuICAgIH1cclxuXHJcbiAgICBzZXJ2aWNlLmFsdGVyYVByZWNvU2VtSW1wb3N0byA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgIGxldCBkaWZlcmVuY2EgPSBpdGVtLnByZWNvIC0gaXRlbS5wcmVjb1NlbUltcG9zdG87XHJcbiAgICAgIGxldCBkZXNjb250byA9IGRpZmVyZW5jYSAvIGl0ZW0ucHJlY287XHJcbiAgICAgIGl0ZW0uZGVzY29udG8gPSBkZXNjb250bztcclxuICAgICAgaXRlbS5wcmVjb0NvbUltcG9zdG8gPSBpdGVtLnByZWNvU2VtSW1wb3N0byArIGl0ZW0udmFsb3JJbXBvc3RvO1xyXG4gICAgICBpdGVtLnByZWNvVW5pdGFyaW9Db21JbXBvc3RvID0gaXRlbS5wcmVjb0NvbUltcG9zdG8gLyBpdGVtLnF1YW50aWRhZGU7XHJcbiAgICAgIGl0ZW0ucHJlY29Vbml0YXJpb1NlbUltcG9zdG8gPSBpdGVtLnByZWNvU2VtSW1wb3N0byAvIGl0ZW0ucXVhbnRpZGFkZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXJ2aWNlLmFsdGVyYVByZWNvQ29tSW1wb3N0byA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgIGxldCBkaWZlcmVuY2EgPSBpdGVtLnByZWNvICsgaXRlbS52YWxvckltcG9zdG8gLSBpdGVtLnByZWNvQ29tSW1wb3N0bztcclxuICAgICAgbGV0IGRlc2NvbnRvID0gZGlmZXJlbmNhIC8gKGl0ZW0ucHJlY28gKyBpdGVtLnZhbG9ySW1wb3N0byk7XHJcbiAgICAgIGl0ZW0uZGVzY29udG8gPSBkZXNjb250bztcclxuICAgICAgaXRlbS5wcmVjb1NlbUltcG9zdG8gPSBpdGVtLnByZWNvQ29tSW1wb3N0byAtIGl0ZW0udmFsb3JJbXBvc3RvO1xyXG4gICAgICBpdGVtLnByZWNvVW5pdGFyaW9Db21JbXBvc3RvID0gaXRlbS5wcmVjb0NvbUltcG9zdG8gLyBpdGVtLnF1YW50aWRhZGU7XHJcbiAgICAgIGl0ZW0ucHJlY29Vbml0YXJpb1NlbUltcG9zdG8gPSBpdGVtLnByZWNvU2VtSW1wb3N0byAvIGl0ZW0ucXVhbnRpZGFkZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXJ2aWNlLmFsdGVyYURlc2NvbnRvID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgaXRlbS5wcmVjb0NvbUltcG9zdG8gPSBpdGVtLnByZWNvIC0gc2VydmljZS5nZXRWYWxvckRlc2NvbnRvKGl0ZW0pICsgc2VydmljZS5nZXRWYWxvckltcG9zdG8oaXRlbSk7XHJcbiAgICAgIGl0ZW0ucHJlY29TZW1JbXBvc3RvID0gaXRlbS5wcmVjbyAtIHNlcnZpY2UuZ2V0VmFsb3JEZXNjb250byhpdGVtKTtcclxuICAgICAgaXRlbS5wcmVjb1VuaXRhcmlvQ29tSW1wb3N0byA9IGl0ZW0ucHJlY29Db21JbXBvc3RvIC8gaXRlbS5xdWFudGlkYWRlO1xyXG4gICAgICBpdGVtLnByZWNvVW5pdGFyaW9TZW1JbXBvc3RvID0gaXRlbS5wcmVjb1NlbUltcG9zdG8gLyBpdGVtLnF1YW50aWRhZGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2VydmljZS5pbmljaWFsaXphUHJlY28gPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICBpZiAoIWl0ZW0uZGVzY29udG8pIHtcclxuICAgICAgICBpdGVtLmRlc2NvbnRvID0gMDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIWl0ZW0ucXVhbnRpZGFkZVNvbGljaXRhZGEpIHtcclxuICAgICAgICBpdGVtLnF1YW50aWRhZGVTb2xpY2l0YWRhID0gMTtcclxuICAgICAgfVxyXG4gICAgICBpdGVtLnZhbG9ySW1wb3N0byA9IHNlcnZpY2UuZ2V0VmFsb3JJbXBvc3RvKGl0ZW0pO1xyXG4gICAgICBpdGVtLnByZWNvQ29tSW1wb3N0byA9IGl0ZW0ucHJlY28gKyBpdGVtLnZhbG9ySW1wb3N0byAtIHNlcnZpY2UuZ2V0VmFsb3JEZXNjb250byhpdGVtKTtcclxuICAgICAgaXRlbS5wcmVjb1NlbUltcG9zdG8gPSBpdGVtLnByZWNvIC0gc2VydmljZS5nZXRWYWxvckRlc2NvbnRvKGl0ZW0pO1xyXG4gICAgICBpdGVtLnByZWNvVW5pdGFyaW9Db21JbXBvc3RvID0gaXRlbS5wcmVjb0NvbUltcG9zdG8gLyBpdGVtLnF1YW50aWRhZGU7XHJcbiAgICAgIGl0ZW0ucHJlY29Vbml0YXJpb1NlbUltcG9zdG8gPSBpdGVtLnByZWNvU2VtSW1wb3N0byAvIGl0ZW0ucXVhbnRpZGFkZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuICB9XHJcbl0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBQZWRpZG9Nb2R1bG8gPSBhbmd1bGFyLm1vZHVsZSgncGVkaWRvLm1vZHVsZScpO1xyXG5cclxuUGVkaWRvTW9kdWxvLmNvbmZpZygoJHN0YXRlUHJvdmlkZXIpID0+IHtcclxuICB2YXIgcGVkaWRvID0ge1xyXG4gICAgbmFtZTogJ21haW4ucGVkaWRvJyxcclxuICAgIHVybDogJy9wZWRpZG8nLFxyXG4gICAgYWJzdHJhY3Q6IHRydWVcclxuICB9O1xyXG4gIHZhciBjYWRhc3Ryb1BlZGlkbyA9IHtcclxuICAgIG5hbWU6ICdtYWluLnBlZGlkby5jYWRhc3RybycsXHJcbiAgICB1cmw6ICcvY2FkYXN0cm8nLFxyXG4gICAgYWJzdHJhY3Q6IHRydWVcclxuICB9O1xyXG4gIHZhciBjYWRhc3Ryb1BlZGlkb0RhZG9zID0ge1xyXG4gICAgbmFtZTogJ21haW4ucGVkaWRvLmNhZGFzdHJvLmRhZG9zJyxcclxuICAgIHVybDogJy9kYWRvcy1wZWRpZG8nLFxyXG4gICAgY29tcG9uZW50OiAnZGFkb3NQZWRpZG9Db21wb25lbnQnLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBsaXN0YUluZHVzdHJpYXM6IGZ1bmN0aW9uIChJbmR1c3RyaWFTZXJ2aWNlLCBhdXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIEluZHVzdHJpYVNlcnZpY2UuZ2V0SW5kdXN0cmlhc0J5SWRVc3VhcmlvKGF1dGguaWQpO1xyXG4gICAgICB9LFxyXG4gICAgfVxyXG4gIH07XHJcbiAgdmFyIGVkaWNhb1BlZGlkb0RhZG9zID0ge1xyXG4gICAgbmFtZTogJ21haW4ucGVkaWRvLmNhZGFzdHJvLmVkaWNhbycsXHJcbiAgICB1cmw6ICcvZWRpY2FvJyxcclxuICAgIGNvbXBvbmVudDogJ2VkaWNhb1BlZGlkb0NvbXBvbmVudCcsXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIHBlZGlkbzogKFBlZGlkb1NlcnZpY2UpID0+IHtcclxuICAgICAgICByZXR1cm4gUGVkaWRvU2VydmljZS5nZXRQZWRpZG9BdGl2bygpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH07XHJcbiAgdmFyIHBlZGlkb0l0ZW5zID0ge1xyXG4gICAgbmFtZTogJ21haW4ucGVkaWRvLmNhZGFzdHJvLml0ZW5zJyxcclxuICAgIHVybDogJy9pdGVucy1wZWRpZG8nLFxyXG4gICAgY29tcG9uZW50OiAnaXRlbnNQZWRpZG9Db21wb25lbnQnLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBwZWRpZG86IChQZWRpZG9TZXJ2aWNlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIFBlZGlkb1NlcnZpY2UuZ2V0UGVkaWRvQXRpdm8oKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbiAgdmFyIHBlZGlkb1Jlc3VtbyA9IHtcclxuICAgIG5hbWU6ICdtYWluLnBlZGlkby5jYWRhc3Ryby5yZXN1bW8nLFxyXG4gICAgdXJsOiAnL3Jlc3Vtby1wZWRpZG8nLFxyXG4gICAgY29tcG9uZW50OiAncmVzdW1vUGVkaWRvQ29tcG9uZW50JyxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgcGVkaWRvOiAoUGVkaWRvU2VydmljZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBQZWRpZG9TZXJ2aWNlLmdldFBlZGlkb0F0aXZvKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG4gIHZhciBwZXNxdWlzYVBlZGlkbyA9IHtcclxuICAgIG5hbWU6ICdtYWluLnBlZGlkby5wZXNxdWlzYScsXHJcbiAgICB1cmw6ICcvcGVzcXVpc2EnLFxyXG4gICAgY29tcG9uZW50OiAncGVzcXVpc2FQZWRpZG9Db21wb25lbnQnLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBsaXN0YUluZHVzdHJpYXM6IGZ1bmN0aW9uIChJbmR1c3RyaWFTZXJ2aWNlLCBhdXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIEluZHVzdHJpYVNlcnZpY2UuZ2V0SW5kdXN0cmlhc0J5SWRVc3VhcmlvKGF1dGguaWQpO1xyXG4gICAgICB9LFxyXG4gICAgfVxyXG4gIH07XHJcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocGVkaWRvKTtcclxuICAkc3RhdGVQcm92aWRlci5zdGF0ZShjYWRhc3Ryb1BlZGlkbyk7XHJcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoY2FkYXN0cm9QZWRpZG9EYWRvcyk7XHJcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocGVkaWRvSXRlbnMpO1xyXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHBlZGlkb1Jlc3Vtbyk7XHJcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoZWRpY2FvUGVkaWRvRGFkb3MpO1xyXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHBlc3F1aXNhUGVkaWRvKTtcclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFBlZGlkb01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwZWRpZG8ubW9kdWxlJyk7XHJcblxyXG5QZWRpZG9Nb2R1bGUuZGlyZWN0aXZlKCdwZXJjZW50JywgZnVuY3Rpb24gKCRmaWx0ZXIpIHtcclxuICB2YXIgcCA9IGZ1bmN0aW9uICh2aWV3VmFsdWUpIHtcclxuICAgIGlmICghdmlld1ZhbHVlKSB7XHJcbiAgICAgIHZpZXdWYWx1ZSA9IFwiMFwiXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2aWV3VmFsdWUpIC8gMTAwXHJcbiAgfTtcclxuXHJcbiAgdmFyIGYgPSBmdW5jdGlvbiAobW9kZWxWYWx1ZSkge1xyXG4gICAgcmV0dXJuICRmaWx0ZXIoJ251bWJlcicpKHBhcnNlRmxvYXQobW9kZWxWYWx1ZSkgKiAxMDAsIDIpXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcclxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRyLCBjdHJsKSB7XHJcbiAgICAgIGN0cmwuJHBhcnNlcnMudW5zaGlmdChwKVxyXG4gICAgICBjdHJsLiRmb3JtYXR0ZXJzLnVuc2hpZnQoZilcclxuICAgIH1cclxuICB9O1xyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUGVkaWRvTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BlZGlkby5tb2R1bGUnKTtcclxuXHJcblBlZGlkb01vZHVsZS5maWx0ZXIoJ2l0ZW5zQWRpY2lvbmFkb3NGaWx0ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtcykge1xyXG4gICAgdmFyIG91dCA9IFtdO1xyXG5cclxuICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoaXRlbXMpKSB7XHJcblxyXG4gICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1NYXRjaGVzID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmIChpdGVtLmhhc093blByb3BlcnR5KCdpbnNlcmlkbycpKSB7XHJcbiAgICAgICAgICBpdGVtTWF0Y2hlcyA9IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGl0ZW1NYXRjaGVzKSB7XHJcbiAgICAgICAgICBvdXQucHVzaChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0ID0gaXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG91dDtcclxuICB9O1xyXG59KTtcclxuXHJcblBlZGlkb01vZHVsZS5maWx0ZXIoJ2l0ZW5zTmFvQWRpY2lvbmFkb3NGaWx0ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtcykge1xyXG4gICAgdmFyIG91dCA9IFtdO1xyXG5cclxuICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoaXRlbXMpKSB7XHJcblxyXG4gICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1NYXRjaGVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW0uaGFzT3duUHJvcGVydHkoJ2luc2VyaWRvJykpIHtcclxuICAgICAgICAgIGl0ZW1NYXRjaGVzID0gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGl0ZW1NYXRjaGVzKSB7XHJcbiAgICAgICAgICBvdXQucHVzaChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0ID0gaXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG91dDtcclxuICB9O1xyXG59KTtcclxuXHJcblBlZGlkb01vZHVsZS5maWx0ZXIoJ3BlcmNlbnRhZ2UnLCBbJyRmaWx0ZXInLCBmdW5jdGlvbigkZmlsdGVyKXtcclxuICByZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcclxuICAgIGlmKGlucHV0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuICRmaWx0ZXIoJ251bWJlcicpKGlucHV0ICogMTAwKSArICclJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH07XHJcbn1dKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5hbmd1bGFyLm1vZHVsZSgncGVkaWRvLm1vZHVsZScsIFsndWkucm91dGVyJywgJ25nQW5pbWF0ZScsICd1aS5ib290c3RyYXAnXSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBQZWRpZG9Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGVkaWRvLm1vZHVsZScpO1xyXG5cclxuUGVkaWRvTW9kdWxlLmZhY3RvcnkoJ1BlZGlkb1NlcnZpY2UnLCBbJ0h0dHBTZXJ2aWNlJyxcclxuICBmdW5jdGlvbiAoSHR0cFNlcnZpY2UpIHtcclxuICAgIHZhciBzZXJ2aWNlID0ge307XHJcbiAgICBjb25zdCBTVUJQQVRIID0gJ3NlcnZpY2UvcGVkaWRvJztcclxuXHJcbiAgICBjb25zdCBVUkxfUEVESURPX1NBTFZBUiA9IGAke1NVQlBBVEh9L3NhbHZhUGVkaWRvYDtcclxuICAgIGNvbnN0IFVSTF9QRURJRE9fQVRVQUxJWkFSX1NUQVRVUyA9IGAke1NVQlBBVEh9L2F0dWFsaXphclN0YXR1c1BlZGlkb2A7XHJcbiAgICBjb25zdCBVUkxfUEVESURPX0JVU0NBUl9QT1JfQ1JJVEVSSUEgPSBgJHtTVUJQQVRIfS9nZXRQZWRpZG9zUG9yQ3JpdGVyaWFgO1xyXG4gICAgY29uc3QgVVJMX1BFRElET19CVVNDQVJfSVRFTlMgPSBgJHtTVUJQQVRIfS9nZXRJdGVuc1BlZGlkb2A7XHJcbiAgICBjb25zdCBVUkxfUEVESURPX0JVU0NBUl9QRURJRE9fUE9SX0lEID0gYCR7U1VCUEFUSH0vZ2V0UGVkaWRvYDtcclxuICAgIGNvbnN0IFVSTF9QRURJRE9fQlVTQ0FSX0xJU1RBX1NUQVRVU19QRURJRE8gPSBgJHtTVUJQQVRIfS9nZXRMaXN0YVN0YXR1c1BlZGlkb2A7XHJcbiAgICBjb25zdCBVUkxfUEVESURPX0JVU0NBUl9PQlNFUlZBQ09FU19QRURJRE8gPSBgJHtTVUJQQVRIfS9nZXRPYnNlcnZhY29lc1BlZGlkb2A7XHJcbiAgICBjb25zdCBVUkxfUEVESURPX0FESUNJT05BUl9PQlNFUlZBQ09FU19QRURJRE8gPSBgJHtTVUJQQVRIfS9zZXRPYnNlcnZhY29lc1BlZGlkb2A7XHJcbiAgICBjb25zdCBVUkxfUEVESURPX0JVU0NBUl9VTFRJTUFSX1ZFTkRBU19JVEVNID0gYCR7U1VCUEFUSH0vZ2V0VWx0aW1hc1ZlbmRhc0l0ZW1gO1xyXG5cclxuICAgIHNlcnZpY2Uuc2FsdmFQZWRpZG8gPSAocGVkaWRvRHRvKSA9PiB7XHJcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwUG9zdChVUkxfUEVESURPX1NBTFZBUiwgcGVkaWRvRHRvKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VydmljZS5hdHVhbGl6YXJTdGF0dXNQZWRpZG8gPSAoYXR1YWxpemFTdGF0dXNQZWRpZG9EdG8pID0+IHtcclxuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBQb3N0KFVSTF9QRURJRE9fQVRVQUxJWkFSX1NUQVRVUywgYXR1YWxpemFTdGF0dXNQZWRpZG9EdG8pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXJ2aWNlLmdldFBlZGlkb3NQb3JDcml0ZXJpYSA9IChmaWx0cm9QZWRpZG9EdG8pID0+IHtcclxuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBQb3N0KFVSTF9QRURJRE9fQlVTQ0FSX1BPUl9DUklURVJJQSwgZmlsdHJvUGVkaWRvRHRvKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VydmljZS5nZXRJdGVuc1BlZGlkbyA9IChpZFBlZGlkbykgPT4ge1xyXG4gICAgICByZXR1cm4gSHR0cFNlcnZpY2UuaHR0cFBvc3QoVVJMX1BFRElET19CVVNDQVJfSVRFTlMsIGlkUGVkaWRvKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VydmljZS5nZXRQZWRpZG8gPSAoaWRQZWRpZG8pID0+IHtcclxuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBQb3N0KFVSTF9QRURJRE9fQlVTQ0FSX1BFRElET19QT1JfSUQsIGlkUGVkaWRvKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VydmljZS5nZXRMaXN0YVN0YXR1c1BlZGlkbyA9ICgpID0+IHtcclxuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBHZXQoVVJMX1BFRElET19CVVNDQVJfTElTVEFfU1RBVFVTX1BFRElETyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlcnZpY2UuZ2V0T2JzZXJ2YWNvZXNQZWRpZG8gPSAoaWRQZWRpZG8pID0+IHtcclxuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBHZXQoVVJMX1BFRElET19CVVNDQVJfT0JTRVJWQUNPRVNfUEVESURPLCBpZFBlZGlkbyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlcnZpY2Uuc2V0T2JzZXJ2YWNvZXNQZWRpZG8gPSAob2JzZXJ2YWNhb1BlZGlkb1VwZGF0ZUR0bykgPT4ge1xyXG4gICAgICByZXR1cm4gSHR0cFNlcnZpY2UuaHR0cEdldChVUkxfUEVESURPX0FESUNJT05BUl9PQlNFUlZBQ09FU19QRURJRE8sIG9ic2VydmFjYW9QZWRpZG9VcGRhdGVEdG8pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXJ2aWNlLmdldFVsdGltYXNWZW5kYXNJdGVtID0gKHVsdGltYXNWZW5kYXNJdGVtU2VhcmNoRHRvKSA9PiB7XHJcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwR2V0KFVSTF9QRURJRE9fQlVTQ0FSX1VMVElNQVJfVkVOREFTX0lURU0sIHVsdGltYXNWZW5kYXNJdGVtU2VhcmNoRHRvKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VydmljZS5zZXRQZWRpZG9BdGl2byA9IGZ1bmN0aW9uIChwZWRpZG9BdGl2bykge1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncGVkaWRvQXRpdm8nLCBhbmd1bGFyLnRvSnNvbihwZWRpZG9BdGl2bykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlcnZpY2UuZ2V0UGVkaWRvQXRpdm8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwZWRpZG9BdGl2bycpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXJ2aWNlLnJlbW92ZVBlZGlkb0F0aXZvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3BlZGlkb0F0aXZvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcbiAgfVxyXG5dKTsiLCIndXNlIHN0cmljdCdcclxuXHJcbnZhciBQZWRpZG9BcHAgPSBhbmd1bGFyLm1vZHVsZSgnUGVkaWRvJylcclxuLmNvbnRyb2xsZXIoJ1BlZGlkb0NvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsICckaHR0cCcsICckcm91dGUnLCAnSW5kdXN0cmlhc1NlcnZpY2UnLCAnUGVkaWRvU2VydmljZScsICdBdXRoZW50aWNhdGlvblNlcnZpY2UnLCAnTW9kYWxTZXJ2aWNlJywgJ0luZHVzdHJpYUNsaWVudGVQcmF6b1NlcnZpY2UnLCAnTm90aWZpY2F0aW9uU2VydmljZScsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRsb2NhdGlvbiwgJGh0dHAsICRyb3V0ZSwgSW5kdXN0cmlhc1NlcnZpY2UsIHNlcnZpY2UsIEF1dGhlbnRpY2F0aW9uU2VydmljZSwgTW9kYWxTZXJ2aWNlLCBJbmR1c3RyaWFDbGllbnRlUHJhem9TZXJ2aWNlLCBOb3RpZmljYXRpb25TZXJ2aWNlKSB7XHJcblxyXG5cdGxldCB1c3VhcmlvID0gJHJvb3RTY29wZS5nbG9iYWxzLmN1cnJlbnRVc2VyLnVzZXI7XHJcblxyXG5cdCRzY29wZS5wcm9wb3N0YSA9IHtcclxuXHRcdHNlbGVjaW9uYWRvOiB1bmRlZmluZWRcclxuXHR9XHJcblxyXG5cdCRzY29wZS5jYXJnYSA9IHtcclxuXHRcdHNlbGVjaW9uYWRvOiB1bmRlZmluZWRcclxuXHR9XHJcblxyXG5cdCRzY29wZS5MSVNUQV9TSU1OQU8gPSBMSVNUQV9TSU1OQU9cclxuXHQkc2NvcGUuTElTVEFfQ0FSR0EgPSBMSVNUQV9DQVJHQVxyXG5cclxuXHQkc2NvcGUucGVkaWRvID0gaW5pY2lhbGl6YVBlZGlkbyh1c3VhcmlvKTtcclxuXHJcblx0JHNjb3BlLmluZHVzdHJpYSA9IHtcclxuXHRcdFx0c2VsZWNpb25hZG8gOiBudWxsXHJcblx0fVxyXG5cclxuXHQkc2NvcGUubGlzdGFQcmF6byA9IFtdXHJcblxyXG5cdEluZHVzdHJpYXNTZXJ2aWNlLmdldEluZHVzdHJpYXNVc3VhcmlvKHVzdWFyaW8uaWQsIGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHRcdCRzY29wZS5pbmR1c3RyaWFzID0gcmVzcG9uc2U7XHJcblx0XHRpZigkc2NvcGUucGVkaWRvLmlkSW5kdXN0cmlhKSB7XHJcblx0XHRcdCRzY29wZS5pbmR1c3RyaWFzLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgpe1xyXG5cdFx0XHRcdC8vIFNlIGrDoSBwb3NzdWkgdW1hIGluZMO6c3RyaWEgc2VsZWNpb25hZGEgYXRyaWJ1aSBvYmpldG9cclxuXHRcdFx0XHRpZihpdGVtLmlkID09ICRzY29wZS5wZWRpZG8uaWRJbmR1c3RyaWEpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5pbmR1c3RyaWEuc2VsZWNpb25hZG8gPSBpdGVtO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0aWYoJHNjb3BlLmluZHVzdHJpYS5zZWxlY2lvbmFkbykge1xyXG5cdFx0XHRcdCRzY29wZS5jbGllbnRlID0ge1xyXG5cdFx0XHRcdFx0XHRzZWxlY2lvbmFkbyA6IG51bGxcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGNhcnJlZ2FDbGllbnRlcygkc2NvcGUuaW5kdXN0cmlhLnNlbGVjaW9uYWRvLmlkLCB1c3VhcmlvLmlkLCAkc2NvcGUucGVkaWRvLmlkQ2xpZW50ZSwgZnVuY3Rpb24obGlzdGFDbGllbnRlcywgY2xpZW50ZVNlbGVjaW9uYWRvKXtcclxuXHRcdFx0XHRcdCRzY29wZS5jbGllbnRlcyA9IGxpc3RhQ2xpZW50ZXM7XHJcblx0XHRcdFx0XHQkc2NvcGUuY2xpZW50ZS5zZWxlY2lvbmFkbyA9IGNsaWVudGVTZWxlY2lvbmFkbztcclxuXHRcdFx0XHRcdGNhcnJlZ2FQcmF6b3MoJHNjb3BlLmluZHVzdHJpYS5zZWxlY2lvbmFkby5pZCwgJHNjb3BlLmNsaWVudGUuc2VsZWNpb25hZG8uaWQsIChkYXRhKSA9PiB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5saXN0YVByYXpvID0gZGF0YVxyXG5cdFx0XHRcdFx0XHRsZXQgcHJhem9zQ2xpZW50ZSA9ICQuZ3JlcCgkc2NvcGUubGlzdGFQcmF6bywgKGUpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZS5pZEluZHVzdHJpYVByYXpvID09PSAkc2NvcGUucGVkaWRvLmlkSW5kdXN0cmlhUHJhem9cclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnByYXpvID0ge1xyXG5cdFx0XHRcdFx0XHRcdHNlbGVjaW9uYWRvIDogcHJhem9zQ2xpZW50ZVswXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKCRzY29wZS5wcmF6byAmJiAkc2NvcGUucHJhem8uc2VsZWNpb25hZG8gJiYgICRzY29wZS5wcmF6by5zZWxlY2lvbmFkby5wYWRyYW8gPT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5uYW9BbHRlcmFQcmF6byA9IHRydWVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkc2NvcGUudGFiZWxhID0ge1xyXG5cdFx0XHRcdFx0XHRzZWxlY2lvbmFkbyA6IG51bGxcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGNhcnJlZ2FUYWJlbGFzSW5kdXN0cmlhKCRzY29wZS5pbmR1c3RyaWEuc2VsZWNpb25hZG8uaWQsICRzY29wZS5wZWRpZG8uaWRUYWJlbGEsIGZ1bmN0aW9uKGxpc3RhVGFiZWxhcywgdGFiZWxhU2VsZWNpb25hZGEpe1xyXG5cdFx0XHRcdFx0JHNjb3BlLnRhYmVsYXMgPSBsaXN0YVRhYmVsYXM7XHJcblx0XHRcdFx0XHQkc2NvcGUudGFiZWxhLnNlbGVjaW9uYWRvID0gdGFiZWxhU2VsZWNpb25hZGE7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoJHNjb3BlLnBlZGlkby5jYXJnYSkge1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSAkLmdyZXAoTElTVEFfQ0FSR0EsIGZ1bmN0aW9uKGl0ZW0peyByZXR1cm4gaXRlbS52YWx1ZSA9PSAkc2NvcGUucGVkaWRvLmNhcmdhOyB9KTtcclxuXHRcdFx0XHQkc2NvcGUuY2FyZ2Euc2VsZWNpb25hZG8gPSByZXN1bHRbMF07XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCRzY29wZS5wcmF6byA9IHtcclxuXHRcdFx0XHRzZWxlY2lvbmFkbyA6IHVuZGVmaW5lZFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblx0XHJcblx0LypBbHRlcmEgYSBpbmTDunN0cmlhIHNlbGVjaW9uYWRhKi9cclxuXHQkc2NvcGUuc2VsZWNpb25hSW5kdXN0cmlhID0gZnVuY3Rpb24oKSB7XHJcblx0XHRjYXJyZWdhQ2xpZW50ZXMoJHNjb3BlLmluZHVzdHJpYS5zZWxlY2lvbmFkby5pZCwgdXN1YXJpby5pZCwgJHNjb3BlLnBlZGlkby5pZENsaWVudGUsIGZ1bmN0aW9uKGxpc3RhQ2xpZW50ZXMsIGNsaWVudGVTZWxlY2lvbmFkbyl7XHJcblx0XHRcdCRzY29wZS5jbGllbnRlcyA9IGxpc3RhQ2xpZW50ZXM7XHJcblx0XHRcdCRzY29wZS5jbGllbnRlLnNlbGVjaW9uYWRvID0gY2xpZW50ZVNlbGVjaW9uYWRvO1xyXG5cdFx0fSk7XHJcblx0XHRjYXJyZWdhVGFiZWxhc0luZHVzdHJpYSgkc2NvcGUuaW5kdXN0cmlhLnNlbGVjaW9uYWRvLmlkLCAkc2NvcGUucGVkaWRvLmlkVGFiZWxhLCBmdW5jdGlvbihsaXN0YVRhYmVsYXMsIHRhYmVsYVNlbGVjaW9uYWRhKXtcclxuXHRcdFx0JHNjb3BlLnRhYmVsYXMgPSBsaXN0YVRhYmVsYXM7XHJcblx0XHRcdCRzY29wZS50YWJlbGEuc2VsZWNpb25hZG8gPSB0YWJlbGFTZWxlY2lvbmFkYTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLmdlcmFQZWRpZG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdCRzY29wZS5wZWRpZG8uaWRDbGllbnRlICAgICAgICA9ICRzY29wZS5jbGllbnRlLnNlbGVjaW9uYWRvLmlkXHJcblx0XHQkc2NvcGUucGVkaWRvLmlkSW5kdXN0cmlhICAgICAgPSAkc2NvcGUuaW5kdXN0cmlhLnNlbGVjaW9uYWRvLmlkXHJcblx0XHQkc2NvcGUucGVkaWRvLmlkVGFiZWxhICAgICAgICAgPSAkc2NvcGUudGFiZWxhLnNlbGVjaW9uYWRvLmlkXHJcblx0XHQkc2NvcGUucGVkaWRvLm5vbWVDbGllbnRlICAgICAgPSAkc2NvcGUuY2xpZW50ZS5zZWxlY2lvbmFkby5yYXphb1NvY2lhbFxyXG5cdFx0JHNjb3BlLnBlZGlkby5pZEluZHVzdHJpYVByYXpvID0gJHNjb3BlLnByYXpvLnNlbGVjaW9uYWRvLmlkSW5kdXN0cmlhUHJhem9cclxuXHRcdCRzY29wZS5wZWRpZG8uaW5kdXN0cmlhUHJhem8gICA9ICRzY29wZS5wcmF6by5zZWxlY2lvbmFkb1xyXG5cdFx0JHNjb3BlLnBlZGlkby5wcm9wb3N0YSAgICAgICAgID0gJHNjb3BlLnByb3Bvc3RhLnNlbGVjaW9uYWRvLnZhbHVlXHJcblx0XHQkc2NvcGUucGVkaWRvLmNhcmdhICAgICAgICAgICAgPSAkc2NvcGUuY2FyZ2Euc2VsZWNpb25hZG8udmFsdWVcclxuXHRcdHNlcnZpY2UuY2xpZW50ZSAgICAgICAgICAgICAgICA9ICRzY29wZS5jbGllbnRlLnNlbGVjaW9uYWRvXHJcblx0XHRzZXJ2aWNlLmluZHVzdHJpYSAgICAgICAgICAgICAgPSAkc2NvcGUuaW5kdXN0cmlhLnNlbGVjaW9uYWRvXHJcblxyXG5cdFx0Ly9TZSBmb3IgcGVkaWRvIG5vdm9cclxuXHRcdGlmKCEkc2NvcGUuZW1FZGljYW8pIHtcclxuXHRcdFx0c2VydmljZS5jcmlhUGVkaWRvKCRzY29wZS5wZWRpZG8sIGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHRcdFx0XHRpZihyZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0c2VydmljZS5wZWRpZG8gPSByZXNwb25zZTtcclxuXHRcdFx0XHRcdHNlcnZpY2UudGFiZWxhID0gJHNjb3BlLnRhYmVsYS5zZWxlY2lvbmFkby5ub21lO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBlZGlkby5pZCA9IHJlc3BvbnNlLmlkO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBlZGlkby5kYXRhUGVkaWRvID0gcmVzcG9uc2UuZGF0YVBlZGlkbztcclxuXHRcdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvcGVkaWRvUHJvZHV0b3MnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly9TZW7Do29cclxuXHRcdFx0c2VydmljZS5wZWRpZG8gPSAkc2NvcGUucGVkaWRvO1xyXG5cdFx0XHRzZXJ2aWNlLnRhYmVsYSA9ICRzY29wZS50YWJlbGEuc2VsZWNpb25hZG8ubm9tZTtcclxuXHRcdFx0JHNjb3BlLnBlZGlkby5pZCA9ICRzY29wZS5wZWRpZG8uaWQ7XHJcblx0XHRcdCRzY29wZS5wZWRpZG8uZGF0YVBlZGlkbyA9ICRzY29wZS5wZWRpZG8uZGF0YVBlZGlkbztcclxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9wZWRpZG9Qcm9kdXRvcycpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUub3BlbiA9IGZ1bmN0aW9uKCRldmVudCkge1xyXG5cdFx0JGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHQkc2NvcGUub3BlbmVkID0gdHJ1ZTtcclxuXHR9O1xyXG5cdFxyXG5cdCRzY29wZS5wb3NzdWlQZWRpZG9BdGl2byA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYoc2VydmljZS5nZXRQZWRpZG9BdGl2bygpKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUuY2FuY2VsYXJQZWRpZG8gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnTsOjbycsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnU2ltJyxcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQ6ICdDb25maXJtYXInLFxyXG4gICAgICAgICAgICAgICAgYm9keVRleHQ6ICdDb25maXJtYSByZW1vw6fDo28gZG8gcGVkaWRvIGF0dWFsID8nXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIE1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgXHRzZXJ2aWNlLnJlbW92ZVBlZGlkbygpO1xyXG4gICAgICAgIFx0Tm90aWZpY2F0aW9uU2VydmljZS5zdWNjZXNzKCdQZWRpZG8gcmVtb3ZpZG8gY29tIHN1Y2Vzc28hJyk7XHJcbiAgICAgICAgXHQkcm91dGUucmVsb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cdFxyXG5cdCRzY29wZS5vbkNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JHNjb3BlLiRicm9hZGNhc3QoJ3NlbGVjdENoYW5nZWQnKTtcclxuXHR9O1xyXG5cdFxyXG5cdCRzY29wZS5zZWxlY2lvbmFUYWJlbGEgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmKCRzY29wZS5wZWRpZG8uaXRlbnNQZWRpZG8ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRzZXJ2aWNlLnRyb2NhVGFiZWxhID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdCRzY29wZS5zZWxlY2lvbmFDbGllbnRlID0gKCkgPT4ge1xyXG5cdFx0Y29uc3QgaWRJbmR1c3RyaWEgPSAkc2NvcGUuaW5kdXN0cmlhLnNlbGVjaW9uYWRvLmlkXHJcblx0XHRjb25zdCBpZENsaWVudGUgPSAkc2NvcGUuY2xpZW50ZS5zZWxlY2lvbmFkby5pZFxyXG5cdFx0JHNjb3BlLnBlZGlkby5pZFBlZGlkb1ByYXpvID0gdW5kZWZpbmVkXHJcblx0XHQkc2NvcGUubmFvQWx0ZXJhUHJhem8gPSBmYWxzZVxyXG5cdFx0Y2FycmVnYVByYXpvcyhpZEluZHVzdHJpYSwgaWRDbGllbnRlLCAoZGF0YSkgPT4ge1xyXG5cdFx0XHQkc2NvcGUubGlzdGFQcmF6byA9IGRhdGFcclxuXHRcdFx0dmVyaWZpY2FQcmF6b1BhZHJhbygpXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0JHNjb3BlLmlzQ2xpZW50ZURpc2FibGVkID0gKCkgPT4ge1xyXG5cdFx0cmV0dXJuICRzY29wZS5pbmR1c3RyaWEuc2VsZWNpb25hZG8gPT0gbnVsbCB8fCAkc2NvcGUuZW1FZGljYW9cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNhcnJlZ2FQcmF6b3MoaWRJbmR1c3RyaWEsIGlkQ2xpZW50ZSwgY2FsbGJhY2spIHtcclxuXHRcdEluZHVzdHJpYUNsaWVudGVQcmF6b1NlcnZpY2UuZ2V0SW5kdXN0cmlhUHJhem9PdUluZHVzdHJpYUNsaWVudGVQcmF6byhpZEluZHVzdHJpYSwgaWRDbGllbnRlLCAoZGF0YSkgPT4ge1xyXG5cdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHZlcmlmaWNhUHJhem9QYWRyYW8oKSB7XHJcblx0XHQkc2NvcGUubGlzdGFQcmF6by5mb3JFYWNoKChlKSA9PiB7XHJcblx0XHRcdGlmKGUucGFkcmFvKSB7XHJcblx0XHRcdFx0JHNjb3BlLnByYXpvID0ge1xyXG5cdFx0XHRcdFx0c2VsZWNpb25hZG8gOiBlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCRzY29wZS5wcmF6byAmJiAkc2NvcGUucHJhem8uc2VsZWNpb25hZG8gJiYgICRzY29wZS5wcmF6by5zZWxlY2lvbmFkby5wYWRyYW8gPT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLm5hb0FsdGVyYVByYXpvID0gdHJ1ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNhcnJlZ2FUYWJlbGFzSW5kdXN0cmlhKGlkSW5kdXN0cmlhLCBpZFRhYmVsYSwgY2FsbGJhY2spIHtcclxuXHRcdCRzY29wZS50YWJlbGEgPSB7XHJcblx0XHRcdFx0c2VsZWNpb25hZG8gOiBudWxsXHJcblx0XHR9O1xyXG5cdFx0SW5kdXN0cmlhc1NlcnZpY2UuZ2V0VGFiZWxhc0luZHVzdHJpYShpZEluZHVzdHJpYSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0bGV0IHRhYmVsYVNlbGVjaW9uYWRhID0gbnVsbDtcclxuXHRcdFx0aWYoaWRUYWJlbGEpIHtcclxuXHRcdFx0XHRyZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XHJcblx0XHRcdFx0XHRpZihpdGVtLmlkID09IGlkVGFiZWxhKSB7XHJcblx0XHRcdFx0XHRcdHRhYmVsYVNlbGVjaW9uYWRhID0gaXRlbTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxiYWNrKHJlc3BvbnNlLCB0YWJlbGFTZWxlY2lvbmFkYSlcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBjYXJyZWdhQ2xpZW50ZXMoaWRJbmR1c3RyaWEsIGlkVXN1YXJpbywgaWRDbGllbnRlLCBjYWxsYmFjaykge1xyXG5cdFx0JHNjb3BlLmNsaWVudGUgPSB7XHJcblx0XHRcdFx0c2VsZWNpb25hZG8gOiBudWxsXHJcblx0XHR9XHJcblx0XHRzZXJ2aWNlLmNhcnJlZ2FDbGllbnRlc1BvclJlcHJlc2VudGFjYW8oaWRJbmR1c3RyaWEsIGlkVXN1YXJpbywgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0bGV0IGNsaWVudGVTZWxlY2lvbmFkbyA9IG51bGw7XHJcblx0XHRcdGlmKGlkQ2xpZW50ZSkge1xyXG5cdFx0XHRcdHJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgpe1xyXG5cdFx0XHRcdFx0aWYoaXRlbS5pZCA9PSBpZENsaWVudGUpIHtcclxuXHRcdFx0XHRcdFx0Y2xpZW50ZVNlbGVjaW9uYWRvID0gaXRlbTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGxiYWNrKHJlc3BvbnNlLCBjbGllbnRlU2VsZWNpb25hZG8pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIGluaWNpYWxpemFQZWRpZG8odXN1YXJpbykge1xyXG5cdFx0bGV0IHBlZGlkbyA9IHNlcnZpY2UucGVkaWRvUGFyYUVkaXRhcjtcclxuXHRcdGlmKCFwZWRpZG8pIHtcclxuXHRcdFx0cGVkaWRvID0gc2VydmljZS5nZXRQZWRpZG9BdGl2bygpO1xyXG5cdFx0XHRpZighcGVkaWRvKSB7XHJcblx0XHRcdFx0bGV0IGRhdGUgPSBuZXcgRGF0ZSgpOyBcclxuXHRcdFx0XHQkc2NvcGUuZGF0YUVudHJlZ2EgPSBuZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXREYXRlKCkrMSkudG9Mb2NhbGVEYXRlU3RyaW5nKFwicHQtQlJcIik7XHJcblx0XHRcdFx0cGVkaWRvID0gbmV3IFBlZGlkb0R0byh1c3VhcmlvLmlkLCAkc2NvcGUuZGF0YUVudHJlZ2EpXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JHNjb3BlLmVtRWRpY2FvID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JHNjb3BlLmVtRWRpY2FvID0gdHJ1ZTtcclxuXHRcdFx0c2VydmljZS5lbUVkaWNhbyA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcGVkaWRvO1xyXG5cdH1cclxuXHJcbn1dKTtcclxuXHJcblBlZGlkb0FwcC5kaXJlY3RpdmUoJ2ZvY3VzJywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcclxuXHQgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW0sIGF0dHIpIHtcclxuXHQgICAgICBzY29wZS4kb24oYXR0ci5mb2N1cywgZnVuY3Rpb24oZSkge1xyXG5cdCAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0ICAgICAgICAgIGVsZW1bMF0uZm9jdXMoKTtcclxuXHQgICAgICAgIH0sIDUwKTtcclxuXHQgICAgICB9KTtcclxuXHQgICB9O1xyXG5cdH0pXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdQZWRpZG8nKVxyXG5cclxuLmZhY3RvcnkoJ1BlZGlkb1NlcnZpY2UnLCBbICckaHR0cCcsICckcm9vdFNjb3BlJywgJ1N0b3JhZ2VTZXJ2aWNlJywgJ05ldHdvcmtTZXJ2aWNlJywgJ05vdGlmaWNhdGlvblNlcnZpY2UnLCAnQXV0aGVudGljYXRpb25TZXJ2aWNlJywgXHJcblx0ZnVuY3Rpb24oJGh0dHAsICRyb290U2NvcGUsIFN0b3JhZ2VTZXJ2aWNlLCBOZXR3b3JrU2VydmljZSwgTm90aWZpY2F0aW9uU2VydmljZSwgQXV0aGVudGljYXRpb25TZXJ2aWNlKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7fTtcclxuXHRzZXJ2aWNlLmlkUGVkaWRvID0gbnVsbDtcclxuXHRzZXJ2aWNlLmlkVGFiZWxhID0gbnVsbDtcclxuXHRzZXJ2aWNlLmluZHVzdHJpYSA9IG51bGw7XHJcblx0c2VydmljZS5jbGllbnRlID0gbnVsbDtcclxuXHRzZXJ2aWNlLnByYXpvID0gbnVsbDtcclxuXHRzZXJ2aWNlLnRhYmVsYSA9IG51bGw7XHJcblx0c2VydmljZS5jYXJnYSA9IG51bGw7XHJcblx0c2VydmljZS5wZWRpZG8gPSBudWxsO1xyXG5cdHNlcnZpY2UudHJvY2FUYWJlbGEgPSBudWxsO1xyXG5cdFxyXG5cdHNlcnZpY2UuY2FycmVnYUNsaWVudGVzID0gZnVuY3Rpb24obG9naW4sIGNhbGxiYWNrKSB7XHJcblx0XHROZXR3b3JrU2VydmljZS5odHRwUG9zdCgnL2dldENsaWVudGVzQnlMb2dpbi8nLCBsb2dpbiwgZnVuY3Rpb24gKHJlc3VsdCwgZGF0YSkge1xyXG5cdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRzZXJ2aWNlLmlkUGVkaWRvID0gcmVzcG9uc2UuaWQ7XHJcblx0XHRcdFx0c2VydmljZS5wZWRpZG8gPSByZXNwb25zZTtcclxuXHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBzYWx2YXIgcGVkaWRvJywgZGF0YSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuY2FycmVnYUNsaWVudGVzUG9yUmVwcmVzZW50YWNhbyA9IGZ1bmN0aW9uIChpZEluZHVzdHJpYSwgaWRVc3VhcmlvLCBjYWxsYmFjaykge1xyXG5cdFx0TmV0d29ya1NlcnZpY2UuaHR0cFBvc3QoJy9nZXRDbGllbnRlc1BvclJlcHJlc2VudGFjYW8vJywge2lkSW5kdXN0cmlhOiBpZEluZHVzdHJpYSwgaWRVc3VhcmlvOiBpZFVzdWFyaW99LCBmdW5jdGlvbiAocmVzdWx0LCBkYXRhKSB7XHJcblx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGRhdGEpXHJcblx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciBjbGllbnRlcycsIGRhdGEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNhbGxiYWNrKFN0b3JhZ2VTZXJ2aWNlLmdldENsaWVudGVzVXN1YXJpbyhpZFVzdWFyaW8sIGlkSW5kdXN0cmlhKSlcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblx0XHJcblx0LypTYWx2YSB1bSBwZWRpZG8gbmEgbcOhcXVpbmEgbG9jYWwqL1xyXG5cdHNlcnZpY2UuY3JpYVBlZGlkbyA9IGZ1bmN0aW9uKHBlZGlkbywgY2FsbGJhY2spIHtcclxuXHRcdHZhciBkYXRhRmluYWwgPSBuZXcgRGF0ZSgpXHJcblx0XHRkYXRhRmluYWwuc2V0RGF0ZShkYXRhRmluYWwuZ2V0RGF0ZSgpICsgMzApXHJcblx0XHRTdG9yYWdlU2VydmljZS5zZXRQZWRpZG9BdGl2byhwZWRpZG8pXHJcblx0XHRsZXQgcGVkaWRvU2Fsdm8gPSBTdG9yYWdlU2VydmljZS5nZXRQZWRpZG9BdGl2bygpXHJcblx0XHRjYWxsYmFjayhwZWRpZG9TYWx2bylcclxuXHR9XHJcblx0XHJcblx0LypFbnZpYSB1bSBwZWRpZG8gcGFyYSBhcm1hemVuYW1lbnRvIGxvY2FsIGNyaWFkbyBuYSBtw6FxdWluYSBsb2NhbCovXHJcblx0c2VydmljZS5zYWx2YVBlZGlkb0xvY2FsID0gZnVuY3Rpb24ocGVkaWRvKSB7XHJcblx0XHRsZXQgZGF0ZSA9IG5ldyBEYXRlKClcclxuXHRcdHBlZGlkby5kYXRhUGVkaWRvID0gbmV3IERhdGUoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpLCBkYXRlLmdldEhvdXJzKCksIGRhdGUuZ2V0TWludXRlcygpLCBkYXRlLmdldFNlY29uZHMoKSwgMCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwicHQtQlJcIilcclxuXHRcdFN0b3JhZ2VTZXJ2aWNlLmFkZFBlZGlkb3NTYWx2byhwZWRpZG8pXHJcblx0fVxyXG5cdFxyXG5cdC8qRW52aWEgdW0gcGVkaWRvIHBhcmEgYSBiYXNlIGNyaWFkbyBuYSBtw6FxdWluYSBsb2NhbCovXHJcblx0c2VydmljZS5zYWx2YVBlZGlkbyA9IGZ1bmN0aW9uKHBlZGlkbywgY2FsbGJhY2spIHtcclxuXHRcdHBlZGlkby51c3VhcmlvQWx0ZXJhY2FvID0gQXV0aGVudGljYXRpb25TZXJ2aWNlLmdldFVzdWFyaW8oKVxyXG5cdFx0TmV0d29ya1NlcnZpY2UuaHR0cFBvc3QoJy9zYWx2YVBlZGlkby8nLCBwZWRpZG8sIGZ1bmN0aW9uIChyZXN1bHQsIGRhdGEpIHtcclxuXHRcdFx0aWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULk9LKSB7XHJcblx0XHRcdFx0c2VydmljZS5pZFBlZGlkbyA9IHJlc3VsdC5pZDtcclxuXHRcdFx0XHRzZXJ2aWNlLnBlZGlkbyA9IHJlc3VsdDtcclxuXHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBzYWx2YXIgcGVkaWRvJywgZGF0YSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblx0XHJcblx0c2VydmljZS5nZXRQZWRpZG9BdGl2byA9IGZ1bmN0aW9uKHVzdWFyaW8pIHtcclxuXHRcdGxldCBwZWRpZG8gPSBTdG9yYWdlU2VydmljZS5nZXRQZWRpZG9BdGl2bygpO1xyXG5cdFx0cmV0dXJuIHBlZGlkbztcclxuXHR9XHJcblx0XHJcblx0LypSZW1vdmUgcGVkaWRvIGRhIG3DoXF1aW5hIGxvY2FsKi9cclxuXHRzZXJ2aWNlLnJlbW92ZVBlZGlkbyA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHRTdG9yYWdlU2VydmljZS5yZXNldFBlZGlkb0F0aXZvKCk7XHJcblx0XHRzZXJ2aWNlLmVtRWRpY2FvID0gdW5kZWZpbmVkO1xyXG5cdFx0c2VydmljZS5wZWRpZG9QYXJhRWRpdGFyID0gdW5kZWZpbmVkO1xyXG5cdH1cclxuXHJcblx0c2VydmljZS5nZXRQZWRpZG8gPSBmdW5jdGlvbiAoaWRQZWRpZG8sIGNhbGxiYWNrKSB7XHJcblx0XHROZXR3b3JrU2VydmljZS5odHRwUG9zdCgnL2dldFBlZGlkbycsIGlkUGVkaWRvLCBmdW5jdGlvbiAocmVzdWx0LCBkYXRhKSB7XHJcblx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGRhdGEpXHJcblx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKGBFcnJvIGFvIGJ1c2NhciBwZWRpZG8gJHtpZFBlZGlkb31gKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdOw6NvIGZvaSBwb3Nzw612ZWwgc2UgY29tdW5pY2FyIGNvbSBvIHNlcnZpZG9yLicpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLmdldE51bWVyb1BlZGlkb3NFbnZpYWRvcyA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHROZXR3b3JrU2VydmljZS5odHRwR2V0KCcvZ2V0TnVtZXJvUGVkaWRvc0VudmlhZG9zJywgZnVuY3Rpb24gKHJlc3VsdCwgZGF0YSkge1xyXG5cdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBidXNjYXIgcGVkaWRvcyBlbnZpYWRvcycpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ07Do28gZm9pIHBvc3PDrXZlbCBzZSBjb211bmljYXIgY29tIG8gc2Vydmlkb3IuJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2UuZ2V0TnVtZXJvUGVkaWRvc05lZ2Fkb3MgPSBmdW5jdGlvbihpZFVzdWFyaW8sIGNhbGxiYWNrKSB7XHJcblx0XHROZXR3b3JrU2VydmljZS5odHRwR2V0KGAvZ2V0TnVtZXJvUGVkaWRvc05lZ2Fkb3MvP2lkVXN1YXJpbz0ke2lkVXN1YXJpb31gLCBmdW5jdGlvbiAocmVzdWx0LCBkYXRhKSB7XHJcblx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGRhdGEpXHJcblx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciBwZWRpZG9zIG5lZ2Fkb3MnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdOw6NvIGZvaSBwb3Nzw612ZWwgc2UgY29tdW5pY2FyIGNvbSBvIHNlcnZpZG9yLicpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLnNldElkUGVkaWRvID0gZnVuY3Rpb24oaWQpIHtcclxuXHRcdHNlcnZpY2UuaWRQZWRpZG8gPSBpZDtcclxuXHR9O1xyXG5cdFxyXG5cdHNlcnZpY2Uuc2V0SWRUYWJlbGEgPSBmdW5jdGlvbihpZCkge1xyXG5cdFx0c2VydmljZS5pZFRhYmVsYSA9IGlkO1xyXG5cdH07XHJcblx0XHJcblx0c2VydmljZS5zZXRJbmR1c3RyaWEgPSBmdW5jdGlvbihvYmopIHtcclxuXHRcdHNlcnZpY2UuaW5kdXN0cmlhID0gb2JqO1xyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLnNldENsaWVudGUgPSBmdW5jdGlvbihvYmopIHtcclxuXHRcdHNlcnZpY2UuY2xpZW50ZSA9IG9iajtcclxuXHR9XHJcblx0XHJcblx0c2VydmljZS5nZXRUb3RhbEl0ZW5zID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgdG90YWwgPSAwXHJcblx0XHRpZihzZXJ2aWNlLnBlZGlkby5pdGVuc1BlZGlkbykge1xyXG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc2VydmljZS5wZWRpZG8uaXRlbnNQZWRpZG8ubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHR0b3RhbCArPSBzZXJ2aWNlLnBlZGlkby5pdGVuc1BlZGlkb1tpXS5xdWFudGlkYWRlU29saWNpdGFkYVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdG90YWxcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcbn1dKTsiLCIndXNlIHN0cmljdCdcclxudmFyIE5vdGlmaWNhY2FvTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ05vdGlmaWNhY2FvJywgWyd1aS1ub3RpZmljYXRpb24nXSkuY29udHJvbGxlcignTm90aWZpY2FjYW9Db250cm9sbGVyJywgW1xyXG5cdCckc2NvcGUnLFxyXG5cdCdOb3RpZmljYWNhdGlvbicsXHJcblx0Y29uc3RydWN0b3IsXHJcbl0pXHJcblxyXG5mdW5jdGlvbiBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbn1cclxuXHJcbk5vdGlmaWNhY2FvTW9kdWxlLmNvbmZpZyhmdW5jdGlvbihOb3RpZmljYXRpb25Qcm92aWRlcikge1xyXG5cdE5vdGlmaWNhdGlvblByb3ZpZGVyLnNldE9wdGlvbnMoe1xyXG5cdFx0ZGVsYXk6IFRJTUVPVVQvNCxcclxuXHRcdHN0YXJ0VG9wOiAyMCxcclxuXHRcdHN0YXJ0UmlnaHQ6IDEwLFxyXG5cdFx0dmVydGljYWxTcGFjaW5nOiAyMCxcclxuXHRcdGhvcml6b250YWxTcGFjaW5nOiAyMCxcclxuXHRcdHBvc2l0aW9uWDogJ3JpZ2h0JyxcclxuXHRcdHBvc2l0aW9uWTogJ3RvcCdcclxuXHR9KTtcclxufSlcclxuXHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ05vdGlmaWNhY2FvJykuZmFjdG9yeSgnTm90aWZpY2F0aW9uU2VydmljZScsIFtcclxuXHQnTm90aWZpY2F0aW9uJyxcclxuXHRub3RpZmljYWNvQ29uc3RydWN0b3IsXHJcbl0pXHJcblxyXG5mdW5jdGlvbiBub3RpZmljYWNvQ29uc3RydWN0b3IoTm90aWZpY2F0aW9uKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7fTtcclxuXHJcblx0c2VydmljZS5zdWNjZXNzID0gZnVuY3Rpb24obXNnLCBkYXRhKSB7XHJcblx0XHRsZXQgbWVzc2FnZSA9IG1zZ1xyXG5cdFx0aWYoZGF0YSkge1xyXG5cdFx0XHRtZXNzYWdlID0gbXNnICsgJyAnICsgZGF0YVxyXG5cdFx0fVxyXG5cdFx0Tm90aWZpY2F0aW9uLnN1Y2Nlc3MobWVzc2FnZSlcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuYWxlcnQgPSBmdW5jdGlvbihtc2csIGRhdGEpIHtcclxuXHRcdGxldCBtZXNzYWdlID0gbXNnXHJcblx0XHRpZihkYXRhKSB7XHJcblx0XHRcdG1lc3NhZ2UgPSBtc2cgKyAnICcgKyBkYXRhXHJcblx0XHR9XHJcblx0XHROb3RpZmljYXRpb24ud2FybmluZyhtZXNzYWdlKVxyXG5cdH1cclxuXHJcblx0c2VydmljZS5lcnJvciA9IGZ1bmN0aW9uKG1zZywgZGF0YSkge1xyXG5cdFx0bGV0IG1lc3NhZ2UgPSBtc2dcclxuXHRcdGlmKGRhdGEpIHtcclxuXHRcdFx0bWVzc2FnZSA9IFwiRXJybyBubyBwcm9jZXNzYW1lbnRvOiBcIiArIGRhdGEuZXJyb3JDb2RlICsgXCIgLSBcIiArIGRhdGEubWVzc2FnZVxyXG5cdFx0fVxyXG5cdFx0Tm90aWZpY2F0aW9uLmVycm9yKG1lc3NhZ2UpXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2VydmljZTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgUGVkaWRvUHJvZHV0b3NNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnUGVkaWRvUHJvZHV0b3MnKS5jb250cm9sbGVyKCdQZWRpZG9Qcm9kdXRvc0NvbnRyb2xsZXInLCBbXHJcblx0JyRzY29wZScsXHJcblx0JyRyb290U2NvcGUnLFxyXG5cdCckbG9jYXRpb24nLFxyXG5cdCckaHR0cCcsXHJcblx0J0luZHVzdHJpYXNTZXJ2aWNlJyxcclxuXHQnUGVkaWRvU2VydmljZScsXHJcblx0J1BlZGlkb1Byb2R1dG9zU2VydmljZScsXHJcblx0J01vZGFsU2VydmljZScsXHJcblx0J05vdGlmaWNhdGlvblNlcnZpY2UnLFxyXG5cdGNvbnN0cnVjdG9yLFxyXG5dKTtcclxuXHJcbmZ1bmN0aW9uIGNvbnN0cnVjdG9yKCRzY29wZSwgXHJcblx0XHQkcm9vdFNjb3BlLCBcclxuXHRcdCRsb2NhdGlvbiwgXHJcblx0XHQkaHR0cCwgXHJcblx0XHRJbmR1c3RyaWFzU2VydmljZSwgXHJcblx0XHRQZWRpZG9TZXJ2aWNlLCBcclxuXHRcdFBlZGlkb1Byb2R1dG9zU2VydmljZSxcclxuXHRcdE1vZGFsU2VydmljZSxcclxuXHRcdE5vdGlmaWNhdGlvblNlcnZpY2Upe1xyXG5cclxuXHRpbml0KClcclxuXHJcblxyXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1TQ09QRSBGVU5DVElPTlMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHQkc2NvcGUuYXR1YWxpemFQcm9kdXRvID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYoaXRlbSkge1xyXG5cdFx0XHRpdGVtLnByZWNvRmluYWwgPSBQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuY2FsY3VsYVByZWNvRmluYWxJdGVtQ29tRGVzY29udG8oaXRlbSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKiBBZGljaW9uYSBwcm9kdXRvIHNlbGVjaW9uYWRvIGEgbGlzdGEgZGUgcHJvZHV0b3Mgc2VsZWNpb25hZG9zICovXHJcblx0JHNjb3BlLmFkaWNpb25hUHJvZHV0byA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYoJHNjb3BlLnByb2R1dG8uc2VsZWNpb25hZG8gIT0gbnVsbCkge1xyXG5cdFx0XHRQZWRpZG9TZXJ2aWNlLnBlZGlkby5pdGVuc1BlZGlkby5wdXNoKCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvKTtcclxuXHRcdFx0dmFyIGluZGV4ID0gJHNjb3BlLnByb2R1dG9zRGlzcG9uaXZlaXMuaW5kZXhPZigkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkbyk7XHJcblx0XHRcdGlmKGluZGV4ID4gLTEpIHtcclxuXHRcdFx0XHQkc2NvcGUucHJvZHV0b3NEaXNwb25pdmVpcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGluaWNpYWxpemFQcm9kdXRvU2VsZWNpb25hZG8oKTtcclxuXHRcdFx0aWYoJHNjb3BlLmVkaXRhbmRvSXRlbSkge1xyXG5cdFx0XHRcdCRzY29wZS5lZGl0YW5kb0l0ZW0gPSBmYWxzZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8qIENvbmZpZ3VyYSBwcmXDp28gZSBkZXNjb250byBhbyBzZWxlY2lvbmFyIG91dHJvIHByb2R1dG8gZGEgbGlzdGEgKi9cclxuXHQkc2NvcGUuc2VsZWNpb25hUHJvZHV0byA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYoJHNjb3BlLnByb2R1dG8uc2VsZWNpb25hZG8pIHtcclxuXHRcdFx0JHNjb3BlLnByb2R1dG8uc2VsZWNpb25hZG8ucHJlY29GaW5hbCA9IFBlZGlkb1Byb2R1dG9zU2VydmljZS5jYWxjdWxhUHJlY29GaW5hbEl0ZW0oJHNjb3BlLnByb2R1dG8uc2VsZWNpb25hZG8pO1xyXG5cdFx0XHQkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkby5kZXNjb250byA9IDA7XHJcblx0XHRcdCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLnF1YW50aWRhZGVTb2xpY2l0YWRhID0gMTtcclxuXHRcdFx0JHNjb3BlLnByZWNvRmluYWxJdGVtU2VtU3QgPSBQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuY2FsY3VsYVByZWNvSXRlbVNlbVN0KCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvKTtcclxuXHRcdFx0JHNjb3BlLnByZWNvVW5pdGFyaW9JdGVtQ29tU3QgPSBQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuY2FsY3VsYVByZWNvVW5pdGFyaW9Db21TdCgkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkbyk7XHJcblx0XHRcdCRzY29wZS5wcmVjb1VuaXRhcmlvSXRlbVNlbVN0ID0gUGVkaWRvUHJvZHV0b3NTZXJ2aWNlLmNhbGN1bGFQcmVjb1VuaXRhcmlvU2VtU3QoJHNjb3BlLnByb2R1dG8uc2VsZWNpb25hZG8pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvKiBDb25maWd1cmEgcHJlw6dvIGFvIHNlbGVjaW9uYXIgb3V0cm8gcHJvZHV0byBkYSBsaXN0YSAqL1xyXG5cdCRzY29wZS5zZWxlY2lvbmFQcm9kdXRvQ29tRGVzY29udG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmKCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvKSB7XHJcblx0XHRcdCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLnByZWNvRmluYWwgPSBQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuY2FsY3VsYVByZWNvRmluYWxJdGVtKCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvKVxyXG5cdFx0XHQvKiAkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkby5xdWFudGlkYWRlU29saWNpdGFkYSA9IDE7ICovXHJcblx0XHRcdCRzY29wZS5wcmVjb0ZpbmFsSXRlbVNlbVN0ID0gUGVkaWRvUHJvZHV0b3NTZXJ2aWNlLmNhbGN1bGFQcmVjb0l0ZW1TZW1TdCgkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkbylcclxuXHRcdFx0JHNjb3BlLnByZWNvVW5pdGFyaW9JdGVtQ29tU3QgPSBQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuY2FsY3VsYVByZWNvVW5pdGFyaW9Db21TdCgkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkbylcclxuXHRcdFx0JHNjb3BlLnByZWNvVW5pdGFyaW9JdGVtU2VtU3QgPSBQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuY2FsY3VsYVByZWNvVW5pdGFyaW9TZW1TdCgkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkbylcclxuXHRcdFx0JHNjb3BlLmFsdGVyYURlc2NvbnRvSXRlbSgpXHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8qIFJlY2FsY3VsYSBkZXNjb250byBhbyBhbHRlcmFyIG8gdmFsb3IgZG8gcHJvZHV0byAqL1xyXG5cdCRzY29wZS5hbHRlcmFQcmVjb0ZpbmFsSXRlbSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JHNjb3BlLnByb2R1dG8uc2VsZWNpb25hZG8uZGVzY29udG8gPSBQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuY2FsY3VsYURlc2NvbnRvSXRlbSgkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkbyk7XHJcblx0XHQkc2NvcGUucHJlY29GaW5hbEl0ZW1TZW1TdCA9IFBlZGlkb1Byb2R1dG9zU2VydmljZS5jYWxjdWxhUHJlY29JdGVtU2VtU3QoJHNjb3BlLnByb2R1dG8uc2VsZWNpb25hZG8pO1xyXG5cdFx0JHNjb3BlLnByZWNvVW5pdGFyaW9JdGVtQ29tU3QgPSBQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuY2FsY3VsYVByZWNvVW5pdGFyaW9Db21TdCgkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkbyk7XHJcblx0XHQkc2NvcGUucHJlY29Vbml0YXJpb0l0ZW1TZW1TdCA9IFBlZGlkb1Byb2R1dG9zU2VydmljZS5jYWxjdWxhUHJlY29Vbml0YXJpb1NlbVN0KCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvKTtcclxuXHR9XHJcblx0XHJcblx0LyogUmVjYWxjdWxhIHByZWNvIGRvIHByb2R1dG8gYW8gYWx0ZXJhciBvIHZhbG9yIGRvIGRlc2NvbnRvICovXHJcblx0JHNjb3BlLmFsdGVyYURlc2NvbnRvSXRlbSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JHNjb3BlLnByb2R1dG8uc2VsZWNpb25hZG8ucHJlY29GaW5hbCA9IFBlZGlkb1Byb2R1dG9zU2VydmljZS5jYWxjdWxhUHJlY29GaW5hbEl0ZW1Db21EZXNjb250bygkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkbyk7XHJcblx0XHQkc2NvcGUucHJlY29GaW5hbEl0ZW1TZW1TdCA9IFBlZGlkb1Byb2R1dG9zU2VydmljZS5jYWxjdWxhUHJlY29JdGVtU2VtU3QoJHNjb3BlLnByb2R1dG8uc2VsZWNpb25hZG8pO1xyXG5cdFx0JHNjb3BlLnByZWNvVW5pdGFyaW9JdGVtQ29tU3QgPSBQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuY2FsY3VsYVByZWNvVW5pdGFyaW9Db21TdCgkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkbyk7XHJcblx0XHQkc2NvcGUucHJlY29Vbml0YXJpb0l0ZW1TZW1TdCA9IFBlZGlkb1Byb2R1dG9zU2VydmljZS5jYWxjdWxhUHJlY29Vbml0YXJpb1NlbVN0KCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvKTtcclxuXHR9XHJcblx0XHJcblx0XHQvKiBSZWNhbGN1bGEgcHJlY28gZmluYWwgYW8gYWx0ZXJhciBvIHByZWNvIGRlIGNhZGEgaXRlbSAqL1xyXG5cdCRzY29wZS5hdHVhbGl6YVByZWNvVW5pdGFyaW8gPSBmdW5jdGlvbigpIHtcclxuXHRcdCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLnByZWNvRmluYWwgPSBQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuY2FsY3VsYVByZWNvRmluYWxDb21CYXNlUHJlY29JdGVtKCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLCAkc2NvcGUucHJlY29Vbml0YXJpb0l0ZW1Db21TdCk7XHJcblx0XHQkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkby5kZXNjb250byA9IFBlZGlkb1Byb2R1dG9zU2VydmljZS5jYWxjdWxhRGVzY29udG9JdGVtKCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvKTtcclxuXHRcdCRzY29wZS5wcmVjb0ZpbmFsSXRlbVNlbVN0ID0gUGVkaWRvUHJvZHV0b3NTZXJ2aWNlLmNhbGN1bGFQcmVjb0l0ZW1TZW1TdCgkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkbyk7XHJcblx0XHQkc2NvcGUucHJlY29Vbml0YXJpb0l0ZW1Db21TdCA9IFBlZGlkb1Byb2R1dG9zU2VydmljZS5jYWxjdWxhUHJlY29Vbml0YXJpb0NvbVN0KCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvKTtcclxuXHRcdCRzY29wZS5wcmVjb1VuaXRhcmlvSXRlbVNlbVN0ID0gUGVkaWRvUHJvZHV0b3NTZXJ2aWNlLmNhbGN1bGFQcmVjb1VuaXRhcmlvU2VtU3QoJHNjb3BlLnByb2R1dG8uc2VsZWNpb25hZG8pO1xyXG5cdH1cclxuXHJcblx0LyogRWRpdGEgUHJvZHV0byAqL1xyXG5cdCRzY29wZS5lZGl0YXJQcm9kdXRvID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0dmFyIGluZGV4ID0gUGVkaWRvU2VydmljZS5wZWRpZG8uaXRlbnNQZWRpZG8uaW5kZXhPZihpdGVtKTtcclxuXHRcdGlmKGluZGV4ID4gLTEpIHtcclxuXHRcdFx0UGVkaWRvU2VydmljZS5wZWRpZG8uaXRlbnNQZWRpZG8uc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdFx0JHNjb3BlLnByb2R1dG9zRGlzcG9uaXZlaXMucHVzaChpdGVtKTtcclxuXHRcdFx0JHNjb3BlLnByb2R1dG8uc2VsZWNpb25hZG8gPSBpdGVtO1xyXG5cdFx0XHQkc2NvcGUuc2VsZWNpb25hUHJvZHV0b0NvbURlc2NvbnRvKCk7XHJcblx0XHRcdCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLnByZWNvQ29sb2NhZG8gPSBpdGVtLnByZWNvQ29sb2NhZG87XHJcblx0XHRcdCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLnF1YW50aWRhZGVTb2xpY2l0YWRhID0gaXRlbS5xdWFudGlkYWRlU29saWNpdGFkYTtcclxuXHRcdFx0JHNjb3BlLmVkaXRhbmRvSXRlbSA9IHRydWVcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0LypSZW1vdmUgaXRlbSBkYSBsaXN0YSBkZSBhZGljaW9uYWRvcyovXHJcblx0JHNjb3BlLnJlbW92ZVByb2R1dG8gPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHR2YXIgaW5kZXggPSBQZWRpZG9TZXJ2aWNlLnBlZGlkby5pdGVuc1BlZGlkby5pbmRleE9mKGl0ZW0pO1xyXG5cdFx0aWYoaW5kZXggPiAtMSkge1xyXG5cdFx0XHRQZWRpZG9TZXJ2aWNlLnBlZGlkby5pdGVuc1BlZGlkby5zcGxpY2UoaW5kZXgsIDEpXHJcblx0XHRcdC8vQWRpY2lvbmFyIGl0ZW0gbmEgc3VhIHBvc2nDp8OjbyBvcmlnaW5hbFxyXG5cdFx0XHQkc2NvcGUucHJvZHV0b3NEaXNwb25pdmVpcy5wdXNoKGl0ZW0pXHJcblx0XHRcdCRzY29wZS5wcm9kdXRvc0Rpc3Bvbml2ZWlzID0gJHNjb3BlLnByb2R1dG9zRGlzcG9uaXZlaXMuc29ydChmdW5jdGlvbihhLGIpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGEuZGVzY3JpY2FvID4gYi5kZXNjcmljYW8pID8gMSA6ICgoYS5kZXNjcmljYW8gPCBiLmRlc2NyaWNhbykgPyAtMSA6IDApXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRpZihQZWRpZG9TZXJ2aWNlLnBlZGlkby5zdGF0dXNQZWRpZG8gPT0gU1RBVFVTX1BFRElETy5DUklBRE8pIHtcclxuXHRcdFx0XHRQZWRpZG9TZXJ2aWNlLnNhbHZhUGVkaWRvKFBlZGlkb1NlcnZpY2UucGVkaWRvLCBmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0XHRcdFx0XHRpZihyZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0XHRQZWRpZG9TZXJ2aWNlLnBlZGlkbyA9IHJlc3BvbnNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKkNhbGN1bGEgbyBwcmVjbyBmaW5hbCBkbyBwZWRpZG8qL1xyXG5cdCRzY29wZS5jYWxjdWxhVG90YWxQZWRpZG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b3RhbCA9IDA7XHJcblx0XHRQZWRpZG9TZXJ2aWNlLnBlZGlkby5pdGVuc1BlZGlkby5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZGV4LCBhcnJheSkge1xyXG5cdFx0XHR0b3RhbCA9IHRvdGFsICsgKGl0ZW0ucHJlY29GaW5hbCAqIGl0ZW0ucXVhbnRpZGFkZVNvbGljaXRhZGEpO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdG90YWw7XHJcblx0fVxyXG5cdFxyXG5cdC8qRmluYWxpemEgbyBwZWRpZG8qL1xyXG5cdCRzY29wZS5maW5hbGl6YXJQZWRpZG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmKCFQZWRpZG9TZXJ2aWNlLmVtRWRpY2FvKSB7XHJcblx0XHRcdFBlZGlkb1NlcnZpY2UuY3JpYVBlZGlkbyhQZWRpZG9TZXJ2aWNlLnBlZGlkbywgZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdFx0XHRcdGlmKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0XHRQZWRpZG9TZXJ2aWNlLnBlZGlkbyA9IHJlc3BvbnNlO1xyXG5cdFx0XHRcdFx0UGVkaWRvUHJvZHV0b3NTZXJ2aWNlLml0ZW5zUGVkaWRvID0gUGVkaWRvU2VydmljZS5wZWRpZG8uaXRlbnNQZWRpZG87XHJcblx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL3BlZGlkb1Jlc3VtbycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuaXRlbnNQZWRpZG8gPSBQZWRpZG9TZXJ2aWNlLnBlZGlkby5pdGVuc1BlZGlkbztcclxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9wZWRpZG9SZXN1bW8nKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdCRzY29wZS52ZXJpZmljYVByb3Bvc3RhUGVkaWRvID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gUGVkaWRvU2VydmljZS5wZWRpZG8ucHJvcG9zdGEgPT0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuZ2V0SXRlbnNTZWxlY2lvbmFkb3MgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBQZWRpZG9TZXJ2aWNlLnBlZGlkby5pdGVuc1BlZGlkbztcclxuXHR9XHJcblxyXG5cdCRzY29wZS51c2FyUHJlY29Db2xvY2FkbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JHNjb3BlLnByZWNvSW5pY2lhbCA9ICRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLnByZWNvRmluYWw7XHJcblx0XHQkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkby5wcmVjbyA9ICRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLnByZWNvQ29sb2NhZG87XHJcblx0XHRcclxuXHRcdCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLnByZWNvRmluYWwgPSBQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuY2FsY3VsYVByZWNvRmluYWxJdGVtKCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvKTtcclxuXHRcdCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLmRlc2NvbnRvID0gMDtcclxuXHRcdCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLnF1YW50aWRhZGVTb2xpY2l0YWRhID0gMTtcclxuXHRcdCRzY29wZS5wcmVjb0ZpbmFsSXRlbVNlbVN0ID0gUGVkaWRvUHJvZHV0b3NTZXJ2aWNlLmNhbGN1bGFQcmVjb0l0ZW1TZW1TdCgkc2NvcGUucHJvZHV0by5zZWxlY2lvbmFkbyk7XHJcblx0XHQkc2NvcGUucHJlY29Vbml0YXJpb0l0ZW1Db21TdCA9IFBlZGlkb1Byb2R1dG9zU2VydmljZS5jYWxjdWxhUHJlY29Vbml0YXJpb0NvbVN0KCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvKTtcclxuXHRcdCRzY29wZS5wcmVjb1VuaXRhcmlvSXRlbVNlbVN0ID0gUGVkaWRvUHJvZHV0b3NTZXJ2aWNlLmNhbGN1bGFQcmVjb1VuaXRhcmlvU2VtU3QoJHNjb3BlLnByb2R1dG8uc2VsZWNpb25hZG8pO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLnZvbHRhciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYoIVBlZGlkb1NlcnZpY2UuZW1FZGljYW8pIHtcclxuXHRcdFx0UGVkaWRvU2VydmljZS5jcmlhUGVkaWRvKFBlZGlkb1NlcnZpY2UucGVkaWRvLCBmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0XHRcdFx0aWYocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdFBlZGlkb1NlcnZpY2UucGVkaWRvID0gcmVzcG9uc2U7XHJcblx0XHRcdFx0XHRQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuaXRlbnNQZWRpZG8gPSBQZWRpZG9TZXJ2aWNlLnBlZGlkby5pdGVuc1BlZGlkbztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0UGVkaWRvUHJvZHV0b3NTZXJ2aWNlLml0ZW5zUGVkaWRvID0gUGVkaWRvU2VydmljZS5wZWRpZG8uaXRlbnNQZWRpZG87XHJcblx0XHR9XHJcblx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XHJcblx0fVxyXG5cclxuXHQkc2NvcGUuZXhpYmVNb2RhbFVsdGltb1BlZGlkb3NJdGVtID0gKCkgPT4ge1xyXG5cdFx0UGVkaWRvUHJvZHV0b3NTZXJ2aWNlLmdldFVsdGltYXNWZW5kYXNJdGVtKCRzY29wZS5jbGllbnRlLmlkLCBQZWRpZG9TZXJ2aWNlLnBlZGlkby5pZFVzdWFyaW8sICRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLmNvZGlnbywgKHJlc3BvbnNlKSA9PiB7XHJcblx0XHRcdHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcblx0XHRcdFx0Y2xvc2VCdXR0b25UZXh0OiAnQ2FuY2VsYXInLFxyXG5cdFx0XHRcdGFjdGlvbkJ1dHRvblRleHQ6ICdTZWxlY2lvbmFyJyxcclxuXHRcdFx0XHRoZWFkZXJUZXh0OiBgSGlzdMOzcmljbyAtICR7JHNjb3BlLnByb2R1dG8uc2VsZWNpb25hZG8uZGVzY3JpY2FvfWAsXHJcblx0XHRcdFx0Ym9keURhdGFMaXN0OiByZXNwb25zZVxyXG5cdFx0XHR9O1xyXG5cdFx0XHR2YXIgbW9kYWxEZWZhdWx0cyA9IHtcclxuXHRcdFx0XHRiYWNrZHJvcDogdHJ1ZSxcclxuXHRcdFx0XHRrZXlib2FyZDogdHJ1ZSxcclxuXHRcdFx0XHRtb2RhbEZhZGU6IHRydWUsXHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdtb2R1bGVzL3BhcnRpYWxzL21vZGFsVWx0aW1vc1BlZGlkb3NJdGVtLmh0bWwnLFxyXG5cdFx0fTtcclxuXHRcclxuXHRcdFx0TW9kYWxTZXJ2aWNlLnNob3dNb2RhbChtb2RhbERlZmF1bHRzLCBtb2RhbE9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG5cdFx0XHRcdGlmKCFyZXN1bHQpIHtcclxuXHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgaXRlbVNlbGVjaW9uYWRvID0gSlNPTi5wYXJzZShyZXN1bHQpXHJcblx0XHRcdFx0aWYoaXRlbVNlbGVjaW9uYWRvICYmIGl0ZW1TZWxlY2lvbmFkby5oYXNPd25Qcm9wZXJ0eShcInF1YW50aWRhZGVcIikgJiYgaXRlbVNlbGVjaW9uYWRvLmhhc093blByb3BlcnR5KFwicHJlY29cIikpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLnF1YW50aWRhZGVTb2xpY2l0YWRhID0gaXRlbVNlbGVjaW9uYWRvLnF1YW50aWRhZGVcclxuXHRcdFx0XHRcdCRzY29wZS5wcm9kdXRvLnNlbGVjaW9uYWRvLnByZWNvRmluYWwgPSBpdGVtU2VsZWNpb25hZG8ucHJlY29cclxuXHRcdFx0XHRcdCRzY29wZS5hbHRlcmFQcmVjb0ZpbmFsSXRlbSgpXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoXCJFcnJvIGFvIGJ1c2NhciBpbmZvcm1hw6fDtWVzIGRvIGl0ZW0uIENvbnRhdGUgbyBhZG1pbmlzdHJhZG9yXCIpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH0pO1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUxPQ0FMIEZVTkNUSU9OUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG5cdFx0aWYoUGVkaWRvU2VydmljZS5pbmR1c3RyaWEgPT0gbnVsbCkge1xyXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL3BlZGlkbycpO1xyXG5cdFx0fVxyXG5cdFx0JHNjb3BlLmluZHVzdHJpYSA9IFBlZGlkb1NlcnZpY2UuaW5kdXN0cmlhO1xyXG5cdFx0JHNjb3BlLmNsaWVudGUgPSBQZWRpZG9TZXJ2aWNlLmNsaWVudGU7XHJcblx0XHQkc2NvcGUuaWRUYWJlbGEgPSBQZWRpZG9TZXJ2aWNlLnBlZGlkby5pZFRhYmVsYTtcclxuXHRcdCRzY29wZS5wcm9kdXRvc0Rpc3Bvbml2ZWlzID0gbnVsbDtcclxuXHRcdCRzY29wZS50b3RhbFBlZGlkbyA9IDA7XHJcblx0XHRpbmljaWFsaXphUHJvZHV0b1NlbGVjaW9uYWRvKCk7XHJcblx0XHJcblx0XHRpZihQZWRpZG9TZXJ2aWNlLnRyb2NhVGFiZWxhKSB7XHJcblx0XHRcdFBlZGlkb1NlcnZpY2UudHJvY2FUYWJlbGEgPSBudWxsO1xyXG5cdFx0XHRQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuY2FycmVnYUl0ZW5zVGFiZWxhKCRzY29wZS5pZFRhYmVsYSwgZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdFx0XHRcdCRzY29wZS5wcm9kdXRvc0Rpc3Bvbml2ZWlzID0gcmVzcG9uc2U7XHJcblx0XHRcdFx0LypDb25zaXN0ZSBsaXN0YSBkZSBwZWRpZG9zIGRpc3BvbsOtdmVpcyovXHJcblx0XHRcdFx0aWYoUGVkaWRvU2VydmljZS5wZWRpZG8uaXRlbnNQZWRpZG8pIHtcclxuXHRcdFx0XHRcdGxldCBwb3NpY2FvSXRlbUFudGlnb05hTGlzdGEgPSAtMVxyXG5cdFx0XHRcdFx0UGVkaWRvU2VydmljZS5wZWRpZG8uaXRlbnNQZWRpZG8uZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCl7XHJcblx0XHRcdFx0XHRcdGxldCByZXN1bHQgPSAkLmdyZXAoJHNjb3BlLnByb2R1dG9zRGlzcG9uaXZlaXMsIFxyXG5cdFx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBlLmNvZGlnbyA9PT0gaXRlbS5jb2RpZ287XHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0aXRlbS5wcmVjbyA9IHJlc3VsdFswXS5wcmVjb1xyXG5cdFx0XHRcdFx0XHRpdGVtLnN0ID0gcmVzdWx0WzBdLnN0XHJcblx0XHRcdFx0XHRcdGl0ZW0udGFiZWxhID0gcmVzdWx0WzBdLnRhYmVsYVxyXG5cdFx0XHRcdFx0XHQkc2NvcGUuYXR1YWxpemFQcm9kdXRvKGl0ZW0pXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFxyXG5cdFx0LyogQ2FycmVnYSBsaXN0YSBkZSBwcm9kdXRvcyAqL1xyXG5cdFx0UGVkaWRvUHJvZHV0b3NTZXJ2aWNlLmNhcnJlZ2FJdGVuc1RhYmVsYSgkc2NvcGUuaWRUYWJlbGEsIGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHRcdFx0JHNjb3BlLnByb2R1dG9zRGlzcG9uaXZlaXMgPSByZXNwb25zZTtcclxuXHRcdFx0LypDb25zaXN0ZSBsaXN0YSBkZSBwZWRpZG9zIGRpc3BvbsOtdmVpcyovXHJcblx0XHRcdGlmKFBlZGlkb1NlcnZpY2UucGVkaWRvLml0ZW5zUGVkaWRvKSB7XHJcblx0XHRcdFx0UGVkaWRvU2VydmljZS5wZWRpZG8uaXRlbnNQZWRpZG8uZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCl7XHJcblx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gJC5ncmVwKCRzY29wZS5wcm9kdXRvc0Rpc3Bvbml2ZWlzLCBcclxuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBlLmNvZGlnbyA9PT0gaXRlbS5jb2RpZ287XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRpZihyZXN1bHQubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUucHJvZHV0b3NEaXNwb25pdmVpcyA9ICQuZ3JlcCgkc2NvcGUucHJvZHV0b3NEaXNwb25pdmVpcywgZnVuY3Rpb24oaXRlbSl7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW0uY29kaWdvICE9PSByZXN1bHRbMF0uY29kaWdvO1xyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdCRzY29wZS5lZGl0YW5kb0l0ZW0gPSBmYWxzZVxyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBpbmljaWFsaXphUHJvZHV0b1NlbGVjaW9uYWRvKCkge1xyXG5cdFx0JHNjb3BlLnByb2R1dG8gPSB7XHJcblx0XHRcdFx0c2VsZWNpb25hZG8gOiBudWxsXHJcblx0XHR9O1xyXG5cdFx0JHNjb3BlLnByZWNvRmluYWxJdGVtU2VtU3QgPSAwO1xyXG5cdFx0JHNjb3BlLnByZWNvVW5pdGFyaW9JdGVtQ29tU3QgPSAwO1xyXG5cdFx0JHNjb3BlLnByZWNvVW5pdGFyaW9JdGVtU2VtU3QgPSAwO1xyXG5cdH1cclxufVxyXG4iLCJ2YXIgcGVkaWRvUHJvZHV0b3NNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnUGVkaWRvUHJvZHV0b3MnKTtcclxuXHJcbnBlZGlkb1Byb2R1dG9zTW9kdWxlLmZpbHRlcigncGVyY2VudGFnZScsIFsnJGZpbHRlcicsIGZ1bmN0aW9uKCRmaWx0ZXIpe1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XHJcblx0XHRcdHJldHVybiAkZmlsdGVyKCdudW1iZXInKShpbnB1dCAqIDEwMCkgKyAnJSc7XHJcblx0XHR9O1xyXG5cdH1dKTtcclxuXHJcbnBlZGlkb1Byb2R1dG9zTW9kdWxlLmRpcmVjdGl2ZSgncGVyY2VudCcsIGZ1bmN0aW9uKCRmaWx0ZXIpe1xyXG5cdHZhciBwID0gZnVuY3Rpb24odmlld1ZhbHVlKSB7XHJcbiAgICAgICAgaWYoIXZpZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICB2aWV3VmFsdWUgPSBcIjBcIlxyXG4gICAgICAgIH1cclxuXHRcdHJldHVybiBwYXJzZUZsb2F0KHZpZXdWYWx1ZSkvMTAwXHJcblx0fTtcclxuXHRcclxuICAgIHZhciBmID0gZnVuY3Rpb24obW9kZWxWYWx1ZSl7XHJcbiAgICAgICAgcmV0dXJuICRmaWx0ZXIoJ251bWJlcicpKHBhcnNlRmxvYXQobW9kZWxWYWx1ZSkqMTAwLCAyKVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXHJcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZSwgYXR0ciwgY3RybCl7XHJcbiAgICAgICAgICAgIGN0cmwuJHBhcnNlcnMudW5zaGlmdChwKVxyXG4gICAgICAgICAgICBjdHJsLiRmb3JtYXR0ZXJzLnVuc2hpZnQoZilcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnUGVkaWRvUHJvZHV0b3MnKVxyXG5cclxuLmZhY3RvcnkoJ1BlZGlkb1Byb2R1dG9zU2VydmljZScsIFsgJyRodHRwJywgJyRyb290U2NvcGUnLCAnTmV0d29ya1NlcnZpY2UnLCAnTm90aWZpY2F0aW9uU2VydmljZScsIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlLCBOZXR3b3JrU2VydmljZSwgTm90aWZpY2F0aW9uU2VydmljZSkge1xyXG5cdHZhciBzZXJ2aWNlID0ge307XHJcblx0c2VydmljZS5wZWRpZG9BbmRhbWVudG8gPSBmYWxzZTtcclxuXHRzZXJ2aWNlLml0ZW5zUGVkaWRvID0gbnVsbDtcclxuXHJcblx0c2VydmljZS5jYXJyZWdhQ2xpZW50ZXMgPSBmdW5jdGlvbihsb2dpbiwgY2FsbGJhY2spIHtcclxuXHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBQb3N0KCcvZ2V0Q2xpZW50ZXNCeUxvZ2luJywgbG9naW4sIChyZXN1bHQsIGRhdGEpID0+IHtcclxuXHRcdFx0aWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULk9LKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soZGF0YSlcclxuXHRcdFx0fSBlbHNlIGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5FUlJPUikge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gY2FycmVnYXIgY2xpZW50ZXMnLCBkYXRhKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdOw6NvIGZvaSBwb3Nzw612ZWwgc2UgY29tdW5pY2FyIGNvbSBvIHNlcnZpZG9yLicpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0c2VydmljZS5jcmlhTm92b1BlZGlkbyA9IGZ1bmN0aW9uKHBlZGlkbywgY2FsbGJhY2spIHtcclxuXHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBQb3N0KCcvY2FkYXN0cmFOb3ZvUGVkaWRvJywgcGVkaWRvLCAocmVzdWx0LCBkYXRhKSA9PiB7XHJcblx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdHNlcnZpY2UucGVkaWRvQW5kYW1lbnRvID0gdHJ1ZTtcclxuXHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBzYWx2YXIgaXRlbnMgcGVkaWRvJywgZGF0YSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuY2FycmVnYUl0ZW5zVGFiZWxhID0gZnVuY3Rpb24oaWRUYWJlbGEsIGNhbGxiYWNrKSB7XHJcblx0XHROZXR3b3JrU2VydmljZS5odHRwUG9zdCgnL2dldEl0ZW5zUG9ySWRUYWJlbGEnLCBpZFRhYmVsYSwgKHJlc3VsdCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBzYWx2YXIgaXRlbnMgcGVkaWRvJywgZGF0YSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHNlcnZpY2Uuc2FsdmFySXRlbnNQZWRpZG8gPSBmdW5jdGlvbihfaWRQZWRpZG8sIF9pdGVucywgY2FsbGJhY2spIHtcclxuXHRcdGNvbnN0IGR0byA9IHtcclxuXHRcdFx0aWRQZWRpZG8gOiBfaWRQZWRpZG8sXHJcblx0XHRcdGl0ZW5zIDogX2l0ZW5zXHJcblx0XHR9XHJcblx0XHROZXR3b3JrU2VydmljZS5odHRwUG9zdCgnL3NhbHZhckl0ZW5zUGVkaWRvJywgZHRvLCAocmVzdWx0LCBkYXRhKSA9PiB7XHJcblx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdHNlcnZpY2UuaXRlbnNQZWRpZG8gPSBfaXRlbnM7XHJcblx0XHRcdFx0Y2FsbGJhY2soZGF0YSlcclxuXHRcdFx0fSBlbHNlIGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5FUlJPUikge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gc2FsdmFyIGl0ZW5zIHBlZGlkbycsIGRhdGEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ07Do28gZm9pIHBvc3PDrXZlbCBzZSBjb211bmljYXIgY29tIG8gc2Vydmlkb3IuJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRzZXJ2aWNlLmF0dWFsaXphclN0YXR1c1BlZGlkbyA9IGZ1bmN0aW9uKF9pZFBlZGlkbywgX3N0YXR1cywgY2FsbGJhY2spIHtcclxuXHRcdGNvbnN0IGR0byA9IHtcclxuXHRcdFx0aWRQZWRpZG8gOiBfaWRQZWRpZG8sXHJcblx0XHRcdHN0YXR1c1BlZGlkbyA6IF9zdGF0dXNcclxuXHRcdH1cclxuXHRcdE5ldHdvcmtTZXJ2aWNlLmh0dHBQb3N0KCcvYXR1YWxpemFyU3RhdHVzUGVkaWRvJywgZHRvLCAocmVzdWx0LCBkYXRhKSA9PiB7XHJcblx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGRhdGEpXHJcblx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciBkYWRvcyBkb3MgY2xpZW50ZXMnLCBkYXRhKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdOw6NvIGZvaSBwb3Nzw612ZWwgc2UgY29tdW5pY2FyIGNvbSBvIHNlcnZpZG9yLicpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0c2VydmljZS5nZXRVbHRpbWFzVmVuZGFzSXRlbSA9IGZ1bmN0aW9uKF9pZENsaWVudGUsIF9pZFVzdWFyaW8sIF9jb2RpZ29JdGVtLCBjYWxsYmFjaykge1xyXG5cdFx0Y29uc3QgdWx0aW1hc1ZlbmRhc0l0ZW1TZWFyY2hEdG8gPSB7XHJcblx0XHRcdGlkQ2xpZW50ZSA6IF9pZENsaWVudGUsXHJcblx0XHRcdGlkVXN1YXJpbyA6IF9pZFVzdWFyaW8sXHJcblx0XHRcdGNvZGlnb0l0ZW06IF9jb2RpZ29JdGVtLFxyXG5cdFx0fVxyXG5cdFx0TmV0d29ya1NlcnZpY2UuaHR0cFBvc3QoJy9nZXRVbHRpbWFzVmVuZGFzSXRlbScsIHVsdGltYXNWZW5kYXNJdGVtU2VhcmNoRHRvLCAocmVzdWx0LCBkYXRhKSA9PiB7XHJcblx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGRhdGEpXHJcblx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciBkYWRvcyBkb3MgY2xpZW50ZXMnLCBkYXRhKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdOw6NvIGZvaSBwb3Nzw612ZWwgc2UgY29tdW5pY2FyIGNvbSBvIHNlcnZpZG9yLicpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHRcclxuXHQvKiBDYWxjdWxhIG8gcHJlw6dvIENhaXhhIGNvbSBTVCAqL1xyXG5cdHNlcnZpY2UuY2FsY3VsYVByZWNvRmluYWxJdGVtID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0dmFyIHZhbG9yQ29tU1QgPSBpdGVtLnByZWNvICsgKGl0ZW0ucHJlY28gKiBpdGVtLnN0KTtcclxuXHRcdHZhciB2YWxvckNvbVNUZUlQSSA9IHZhbG9yQ29tU1QgKyAoaXRlbS5wcmVjbyAqIGl0ZW0uaXBpKTtcclxuXHRcdHJldHVybiBwYXJzZUZsb2F0KHZhbG9yQ29tU1RlSVBJLnRvRml4ZWQoMikpO1xyXG5cdH1cclxuXHRcclxuXHQvKiBDYWxjdWxhIG8gdmFsb3IgZG8gZGVzY29udG8gKi9cclxuXHRzZXJ2aWNlLmNhbGN1bGFEZXNjb250b0l0ZW0gPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHR2YXIgcHJlY29GaW5hbE9yaWdpbmFsID0gc2VydmljZS5jYWxjdWxhUHJlY29GaW5hbEl0ZW0oaXRlbSk7XHJcblx0XHR2YXIgZGlmZXJlbmNhID0gcHJlY29GaW5hbE9yaWdpbmFsIC0gaXRlbS5wcmVjb0ZpbmFsO1xyXG5cdFx0dmFyIGRlc2NvbnRvID0gZGlmZXJlbmNhIC8gcHJlY29GaW5hbE9yaWdpbmFsO1xyXG5cdFx0cmV0dXJuIGRlc2NvbnRvO1xyXG5cdH1cclxuXHRcclxuXHQvKkNhbGN1bGEgcHJlY28gZmluYWwgc2VtIHN0IChhIHBhcnRpciBkbyBwcmVjbyBmaW5hbCBhdHVhbCkgKi9cclxuXHRzZXJ2aWNlLmNhbGN1bGFQcmVjb0l0ZW1TZW1TdCA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdHJldHVybiBpdGVtLnByZWNvIC0gKGl0ZW0ucHJlY28gKiBpdGVtLmRlc2NvbnRvKVxyXG5cdH1cclxuXHRcclxuXHQvKkNhbGN1bGEgcHJlY28gZmluYWwgc2VtIHN0IChhIHBhcnRpciBkbyBwcmVjbyBmaW5hbCBhdHVhbCkgKi9cclxuXHRzZXJ2aWNlLmNhbGN1bGFQcmVjb0l0ZW1TZW1TdExpc3RhUGVkaWRvcyA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdHZhciBpbXBvc3RvcyA9IGl0ZW0uc3QgKyBpdGVtLmlwaTtcclxuXHRcdHJldHVybiBpdGVtLnByZWNvRmluYWwgLyAoaW1wb3N0b3MgKyAxKTtcclxuXHR9XHJcblx0XHJcblx0LypDYWxjdWxhIG8gcHJlY28gZmluYWwgZG8gaXRlbSBjb20gZGVzY29udG8qL1xyXG5cdHNlcnZpY2UuY2FsY3VsYVByZWNvRmluYWxJdGVtQ29tRGVzY29udG8gPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHR2YXIgcHJlY29GaW5hbCA9IDAuMDtcclxuXHRcdGlmKGl0ZW0uZGVzY29udG8gPT09IFwiMFwiKSB7XHJcblx0XHRcdHByZWNvRmluYWwgPSBzZXJ2aWNlLmNhbGN1bGFQcmVjb0ZpbmFsSXRlbShpdGVtKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBwcmVjb0ZpbmFsT3JpZ2luYWwgPSBzZXJ2aWNlLmNhbGN1bGFQcmVjb0ZpbmFsSXRlbShpdGVtKTtcclxuXHRcdFx0dmFyIHZhbG9yRGVzY29udG8gPSBwcmVjb0ZpbmFsT3JpZ2luYWwgKiBpdGVtLmRlc2NvbnRvO1xyXG5cdFx0XHRwcmVjb0ZpbmFsID0gcHJlY29GaW5hbE9yaWdpbmFsIC0gdmFsb3JEZXNjb250bztcclxuXHRcdH1cclxuXHRcdHJldHVybiBwYXJzZUZsb2F0KE1hdGgucm91bmQocHJlY29GaW5hbCAqIDEwMCkgLyAxMDApO1xyXG5cdH1cclxuXHRcclxuXHQvKkNhbGN1bGEgdmFsb3IgdG90YWwgZG8gcGVkaWRvIGNvbSBTVCovXHJcblx0c2VydmljZS52YWxvclRvdGFsUGVkaWRvQ29tU3QgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b3RhbCA9IDA7XHJcblx0XHRmb3IodmFyIGluZGV4IGluIHNlcnZpY2UuaXRlbnNQZWRpZG8pIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBzZXJ2aWNlLml0ZW5zUGVkaWRvW2luZGV4XTsgXHJcblx0XHRcdHRvdGFsICs9IHNlcnZpY2UuY2FsY3VsYVByZWNvRmluYWxJdGVtQ29tRGVzY29udG8oaXRlbSkgKiBpdGVtLnF1YW50aWRhZGVTb2xpY2l0YWRhO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRvdGFsO1xyXG5cdH1cclxuXHRcclxuXHQvKkNhbGN1bGEgdmFsb3IgdG90YWwgZG8gcGVkaWRvIHNlbSBTVCovXHJcblx0c2VydmljZS52YWxvclRvdGFsUGVkaWRvU2VtU3QgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b3RhbCA9IDA7XHJcblx0XHRmb3IodmFyIGluZGV4IGluIHNlcnZpY2UuaXRlbnNQZWRpZG8pIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBzZXJ2aWNlLml0ZW5zUGVkaWRvW2luZGV4XTtcclxuXHRcdFx0aWYoaXRlbS5wcmVjb0ZpbmFsKSB7XHJcblx0XHRcdFx0dG90YWwgKz0gc2VydmljZS5jYWxjdWxhUHJlY29JdGVtU2VtU3RMaXN0YVBlZGlkb3MgKGl0ZW0pICogaXRlbS5xdWFudGlkYWRlU29saWNpdGFkYTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0b3RhbCArPSBzZXJ2aWNlLmNhbGN1bGFQcmVjb0l0ZW1TZW1TdChpdGVtKSAqIGl0ZW0ucXVhbnRpZGFkZVNvbGljaXRhZGE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB0b3RhbDtcclxuXHR9XHJcblx0XHJcblx0c2VydmljZS5jYWxjdWxhUHJlY29Vbml0YXJpb0NvbVN0ID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0dmFyIHByZWNvID0gaXRlbS5wcmVjb0ZpbmFsIC8gaXRlbS5xdWFudGlkYWRlO1xyXG5cdFx0cmV0dXJuIHBhcnNlRmxvYXQoTWF0aC5yb3VuZChwcmVjbyAqIDEwMCkgLyAxMDApO1xyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLmNhbGN1bGFQcmVjb1VuaXRhcmlvU2VtU3QgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHR2YXIgcHJlY29GaW5hbEl0ZW1TZW1TdCA9IHNlcnZpY2UuY2FsY3VsYVByZWNvSXRlbVNlbVN0KGl0ZW0pO1xyXG5cdFx0dmFyIHByZWNvID0gcHJlY29GaW5hbEl0ZW1TZW1TdCAvIGl0ZW0ucXVhbnRpZGFkZTsgXHJcblx0XHRyZXR1cm4gcGFyc2VGbG9hdChNYXRoLnJvdW5kKHByZWNvICogMTAwKSAvIDEwMCk7XHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2UuY2FsY3VsYVByZWNvRmluYWxDb21CYXNlUHJlY29JdGVtID0gZnVuY3Rpb24oaXRlbSwgcHJlY29Vbml0YXJpb0NvbVN0KSB7XHJcblx0XHR2YXIgcHJlY28gPSBwcmVjb1VuaXRhcmlvQ29tU3QgKiBpdGVtLnF1YW50aWRhZGU7XHJcblx0XHRyZXR1cm4gcGFyc2VGbG9hdChNYXRoLnJvdW5kKHByZWNvICogMTAwKSAvIDEwMCk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBzZXJ2aWNlO1xyXG59XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgUGVkaWRvUmVzdW1vTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ1BlZGlkb1Jlc3VtbycpXHJcbi5jb250cm9sbGVyKCdQZWRpZG9SZXN1bW9Db250cm9sbGVyJyxcclxuXHRbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsICckaHR0cCcsICdQZWRpZG9SZXN1bW9TZXJ2aWNlJywgJ1BlZGlkb1NlcnZpY2UnLCAnUGVkaWRvUHJvZHV0b3NTZXJ2aWNlJywgJ1N0b3JhZ2VTZXJ2aWNlJywgJ0F1dGhlbnRpY2F0aW9uU2VydmljZScsICdOb3RpZmljYXRpb25TZXJ2aWNlJywnTW9kYWxTZXJ2aWNlJyxcclxuXHRmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRsb2NhdGlvbiwgJGh0dHAsIFBlZGlkb1Jlc3Vtb1NlcnZpY2UsIFBlZGlkb1NlcnZpY2UsIFBlZGlkb1Byb2R1dG9zU2VydmljZSwgU3RvcmFnZVNlcnZpY2UsIEF1dGhlbnRpY2F0aW9uU2VydmljZSwgTm90aWZpY2F0aW9uU2VydmljZSwgTW9kYWxTZXJ2aWNlKSB7XHJcblxyXG5cdGlmKCFQZWRpZG9TZXJ2aWNlLmluZHVzdHJpYSkge1xyXG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9wZWRpZG8nKTtcclxuXHR9XHJcblxyXG5cdCRzY29wZS5pbmR1c3RyaWEgPSBQZWRpZG9TZXJ2aWNlLmluZHVzdHJpYTtcclxuXHQkc2NvcGUuY2xpZW50ZSA9IFBlZGlkb1NlcnZpY2UuY2xpZW50ZTtcclxuXHQkc2NvcGUuaXRlbnNQZWRpZG8gPSBQZWRpZG9TZXJ2aWNlLnBlZGlkby5pdGVuc1BlZGlkbztcclxuXHQkc2NvcGUucGVkaWRvID0gUGVkaWRvU2VydmljZS5wZWRpZG87XHJcblx0aWYoJHNjb3BlLnBlZGlkby5vYnNlcnZhY29lc1BlZGlkb0R0byA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHQkc2NvcGUucGVkaWRvLm9ic2VydmFjb2VzUGVkaWRvRHRvID0gW11cclxuXHR9XHJcblxyXG5cdCRzY29wZS5zdGF0dXMgPSB7XHJcblx0XHRvcGVuOiBmYWxzZSxcclxuXHR9XHJcblxyXG5cdCRzY29wZS5vYnNlcnZhY2FvID0ge1xyXG5cdFx0bXNnOiB1bmRlZmluZWRcclxuXHR9XHJcblxyXG5cdCRzY29wZS52YWxvckNhaXhhU2VtU3QgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRpZihpdGVtLnByZWNvRmluYWwpIHtcclxuXHRcdFx0cmV0dXJuIFBlZGlkb1Byb2R1dG9zU2VydmljZS5jYWxjdWxhUHJlY29JdGVtU2VtU3RMaXN0YVBlZGlkb3MoaXRlbSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gUGVkaWRvUHJvZHV0b3NTZXJ2aWNlLmNhbGN1bGFQcmVjb0l0ZW1TZW1TdChpdGVtKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0JHNjb3BlLnZhbG9yQ2FpeGFDb21TdCA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdHJldHVybiBQZWRpZG9Qcm9kdXRvc1NlcnZpY2UuY2FsY3VsYVByZWNvRmluYWxJdGVtKGl0ZW0pO1xyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUudmFsb3JUb3RhbFBlZGlkb0NvbVN0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gUGVkaWRvUHJvZHV0b3NTZXJ2aWNlLnZhbG9yVG90YWxQZWRpZG9Db21TdCgpO1xyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUudmFsb3JUb3RhbFBlZGlkb1NlbVN0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gUGVkaWRvUHJvZHV0b3NTZXJ2aWNlLnZhbG9yVG90YWxQZWRpZG9TZW1TdCgpO1xyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUudmFsb3JQcmF6byA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYoUGVkaWRvU2VydmljZS5wZWRpZG8gJiYgUGVkaWRvU2VydmljZS5wZWRpZG8uaW5kdXN0cmlhUHJhem8pIHtcclxuXHRcdFx0cmV0dXJuIFBlZGlkb1NlcnZpY2UucGVkaWRvLmluZHVzdHJpYVByYXpvLmRlc2NyaWNhbztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0JHNjb3BlLnZhbG9yVGFiZWxhID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gUGVkaWRvU2VydmljZS50YWJlbGE7XHJcblx0fVxyXG5cdFxyXG5cdCRzY29wZS52YWxvckNhcmdhID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgcmVzdWx0ID0gJC5ncmVwKExJU1RBX0NBUkdBLCBmdW5jdGlvbihpdGVtKXsgcmV0dXJuIGl0ZW0udmFsdWUgPT0gUGVkaWRvU2VydmljZS5wZWRpZG8uY2FyZ2E7IH0pO1xyXG5cdFx0aWYocmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHJldHVybiByZXN1bHRbMF0udGV4dFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQkc2NvcGUudG90YWxJdGVucyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIFBlZGlkb1NlcnZpY2UuZ2V0VG90YWxJdGVucygpXHJcblx0fVxyXG5cdFxyXG5cdC8qU2FsdmEgcGVkaWRvIG5hIGJhc2UgY29tIHN0YXR1cyBTYWx2byovXHJcblx0JHNjb3BlLnNhbHZhclBlZGlkbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuXHRcdFx0Y2xvc2VCdXR0b25UZXh0OiAnTsOjbycsXHJcblx0XHRcdGFjdGlvbkJ1dHRvblRleHQ6ICdTaW0nLFxyXG5cdFx0XHRoZWFkZXJUZXh0OiAnQ29uZmlybWFyJyxcclxuXHRcdFx0Ym9keVRleHQ6IGBDb25maXJtYSBTQUxWQVIgbyBwZWRpZG8/YFxyXG5cdFx0fTtcclxuXHRcdE1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdFBlZGlkb1NlcnZpY2UucGVkaWRvLnN0YXR1c1BlZGlkbyA9IFNUQVRVU19QRURJRE8uU0FMVk9cclxuXHRcdFx0UGVkaWRvU2VydmljZS5wZWRpZG8uaW5kdXN0cmlhID0gUGVkaWRvU2VydmljZS5pbmR1c3RyaWFcclxuXHRcdFx0UGVkaWRvU2VydmljZS5wZWRpZG8uY2xpZW50ZSA9IFBlZGlkb1NlcnZpY2UuY2xpZW50ZVxyXG5cdFx0XHRQZWRpZG9TZXJ2aWNlLnBlZGlkby5ub21lVGFiZWxhID0gUGVkaWRvU2VydmljZS50YWJlbGFcclxuXHRcdFx0UGVkaWRvU2VydmljZS5wZWRpZG8udXN1YXJpbyA9IEF1dGhlbnRpY2F0aW9uU2VydmljZS5nZXRVc3VhcmlvKClcclxuXHRcdFx0UGVkaWRvU2VydmljZS5zYWx2YVBlZGlkb0xvY2FsKFBlZGlkb1NlcnZpY2UucGVkaWRvKVxyXG5cdFx0XHRQZWRpZG9TZXJ2aWNlLnJlbW92ZVBlZGlkbygpXHJcblx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2Uuc3VjY2VzcygnUGVkaWRvIHNhbHZvIGNvbSBzdWNlc3NvIScpXHJcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvcGVkaWRvJylcclxuXHRcdH0pXHJcblx0fVxyXG5cdFxyXG5cdC8qU2FsdmEgcGVkaWRvIG5hIGJhc2UgY29tIHN0YXR1cyBFbnZpYWRvKi9cclxuXHQkc2NvcGUuZW52aWFyUGVkaWRvID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbW9kYWxPcHRpb25zID0ge1xyXG5cdFx0XHRjbG9zZUJ1dHRvblRleHQ6ICdOw6NvJyxcclxuXHRcdFx0YWN0aW9uQnV0dG9uVGV4dDogJ1NpbScsXHJcblx0XHRcdGhlYWRlclRleHQ6ICdDb25maXJtYXInLFxyXG5cdFx0XHRib2R5VGV4dDogYENvbmZpcm1hIEVOVklBUiBvIHBlZGlkbz9gXHJcblx0XHR9O1xyXG5cclxuXHRcdE1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdFBlZGlkb1NlcnZpY2UucGVkaWRvLnN0YXR1c1BlZGlkbyA9IFNUQVRVU19QRURJRE8uRU5WSUFETztcclxuXHRcdFx0bGV0IGlkUGVkaWRvU2Fsdm8gPSBQZWRpZG9TZXJ2aWNlLnBlZGlkby5pZFBlZGlkb1NhbHZvXHJcblx0XHRcdFBlZGlkb1NlcnZpY2Uuc2FsdmFQZWRpZG8oUGVkaWRvU2VydmljZS5wZWRpZG8sIGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLnN1Y2Nlc3MoJ1BlZGlkbyBlbnZpYWRvIGNvbSBzdWNlc3NvIScpO1xyXG5cdFx0XHRcdFBlZGlkb1NlcnZpY2UucGVkaWRvID0gcmVzcG9uc2U7XHJcblx0XHRcdFx0UGVkaWRvU2VydmljZS5yZW1vdmVQZWRpZG8oKTtcclxuXHRcdFx0XHRpZihpZFBlZGlkb1NhbHZvKSB7XHJcblx0XHRcdFx0XHRQZWRpZG9TZXJ2aWNlLnBlZGlkby5pZFBlZGlkb1NhbHZvID0gaWRQZWRpZG9TYWx2b1xyXG5cdFx0XHRcdFx0U3RvcmFnZVNlcnZpY2UucmVtb3ZlUGVkaWRvU2Fsdm8oUGVkaWRvU2VydmljZS5wZWRpZG8pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvcGVkaWRvJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdCRzY29wZS5nZXRJdGVuc1BlZGlkbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIFBlZGlkb1NlcnZpY2UucGVkaWRvLml0ZW5zUGVkaWRvO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLnZvbHRhciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xyXG5cdH1cclxufV0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnUGVkaWRvUmVzdW1vJylcclxuXHJcbi5mYWN0b3J5KCdQZWRpZG9SZXN1bW9TZXJ2aWNlJywgWyAnJGh0dHAnLCAnJHJvb3RTY29wZScsIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7fTtcclxuXHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcbn1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnR2VyZW5jaWFkb3JGaW5hbmNlaXJvRmxlY2hhVmVuZGFzJylcclxuXHJcbi5mYWN0b3J5KCdTdG9yYWdlU2VydmljZScsIFsgJyRodHRwJywgJyRyb290U2NvcGUnLCAnTG9jYWxTdG9yYWdlU2VydmljZScsIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlLCBMb2NhbFN0b3JhZ2VTZXJ2aWNlKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7fTtcclxuXHRcclxuXHQvKi0tLS0tLS0tLS0tLS0tLVVTVUFSSU8gTE9HQURPLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cdHNlcnZpY2Uuc2V0VXN1YXJpb0xvZ2FkbyA9IGZ1bmN0aW9uKGF1dGhkYXRhLCB1c3VhcmlvKSB7XHJcblx0XHRsZXQgY3VycmVudFVzZXIgPSB7YXV0aGRhdGEgOiBhdXRoZGF0YSwgdXNlciA6IHVzdWFyaW99O1xyXG5cdFx0bG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyID0gYW5ndWxhci50b0pzb24oY3VycmVudFVzZXIpO1xyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLmdldFVzdWFyaW9Mb2dhZG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmKGxvY2FsU3RvcmFnZS5jdXJyZW50VXNlcikge1xyXG5cdFx0XHRsZXQgY3VycmVudFVzZXIgPSBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5jdXJyZW50VXNlcik7XHJcblx0XHRcdHJldHVybiBjdXJyZW50VXNlcjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRzZXJ2aWNlLmNsZWFyVXN1YXJpb0xvZ2FkbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYobG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyKSB7XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdjdXJyZW50VXNlcicpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvKi0tLS0tLS0tLS0tLS0tLUxFTUJSQVIgU0VOSEEtLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblx0c2VydmljZS5zZXRQYXNzd29yZFJlbWVtYmVyID0gZnVuY3Rpb24ocmVtZW1iZXIpIHtcclxuXHRcdGxvY2FsU3RvcmFnZS5yZW1lbWJlclBhc3N3b3JkID0gYW5ndWxhci50b0pzb24ocmVtZW1iZXIpO1xyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLmdldFBhc3N3b3JkUmVtZW1iZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5yZW1lbWJlclBhc3N3b3JkKTtcclxuXHR9XHJcblx0XHJcblx0LyotLS0tLS0tLS0tLS0tLS1QRURJRE8gQVRJVk8tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblx0c2VydmljZS5zZXRQZWRpZG9BdGl2byA9IGZ1bmN0aW9uKHBlZGlkb0F0aXZvKSB7XHJcblx0XHRsb2NhbFN0b3JhZ2UucGVkaWRvQXRpdm8gPSBhbmd1bGFyLnRvSnNvbihwZWRpZG9BdGl2byk7XHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2UuZ2V0UGVkaWRvQXRpdm8gPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5wZWRpZG9BdGl2byk7XHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2UucmVzZXRQZWRpZG9BdGl2byA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYobG9jYWxTdG9yYWdlLnBlZGlkb0F0aXZvKSB7XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdwZWRpZG9BdGl2bycpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvKi0tLS0tLS0tLS0tLS0tLUZJTFRSTyBERSBDTElFTlRFUy0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHRzZXJ2aWNlLnNldEZpbHRyb0F0aXZvID0gZnVuY3Rpb24oZmlsdHJvQXRpdm8pIHtcclxuXHRcdGxvY2FsU3RvcmFnZS5maWx0cm9BdGl2byA9IGFuZ3VsYXIudG9Kc29uKGZpbHRyb0F0aXZvKTtcclxuXHR9XHJcblx0XHJcblx0c2VydmljZS5nZXRGaWx0cm9BdGl2byA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmZpbHRyb0F0aXZvKTtcclxuXHR9XHJcblx0XHJcblx0c2VydmljZS5yZXNldEZpbHRyb0F0aXZvID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZihsb2NhbFN0b3JhZ2UuZmlsdHJvQXRpdm8pIHtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2ZpbHRyb0F0aXZvJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8qLS0tLS0tLS0tLS0tLS0tRklMVFJPIERFIFBFRElET1MtLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblx0c2VydmljZS5zZXRGaWx0cm9QZWRpZG9BdGl2byA9IGZ1bmN0aW9uKGZpbHRyb1BlZGlkb0F0aXZvKSB7XHJcblx0XHRsb2NhbFN0b3JhZ2UuZmlsdHJvUGVkaWRvQXRpdm8gPSBhbmd1bGFyLnRvSnNvbihmaWx0cm9QZWRpZG9BdGl2byk7XHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2UuZ2V0RmlsdHJvUGVkaWRvQXRpdm8gPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5maWx0cm9QZWRpZG9BdGl2byk7XHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2UucmVzZXRGaWx0cm9QZWRpZG9BdGl2byA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYobG9jYWxTdG9yYWdlLmZpbHRyb1BlZGlkb0F0aXZvKSB7XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdmaWx0cm9QZWRpZG9BdGl2bycpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyotLS0tLS0tLS0tLS0tLS1QRURJRE9TIFNBTFZPUy0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHRzZXJ2aWNlLnNldFBlZGlkb3NTYWx2byA9IGZ1bmN0aW9uKHBlZGlkbykge1xyXG5cdFx0bGV0IGxpc3RhUGVkaWRvc1NhbHZvcyA9IFtdXHJcblx0XHRsaXN0YVBlZGlkb3NTYWx2b3MucHVzaChwZWRpZG8pXHJcblx0XHRwZWRpZG8uaWRQZWRpZG9TYWx2byA9IDFcclxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwZWRpZG9zJywgSlNPTi5zdHJpbmdpZnkobGlzdGFQZWRpZG9zU2Fsdm9zKSlcclxuXHR9XHJcblx0XHJcblx0c2VydmljZS5hZGRQZWRpZG9zU2Fsdm8gPSBmdW5jdGlvbihwZWRpZG8pIHtcclxuXHRcdGxldCBsaXN0YVBlZGlkb3NTYWx2b3MgPSBzZXJ2aWNlLmdldFBlZGlkb3NTYWx2bygpXHJcblx0XHRpZighbGlzdGFQZWRpZG9zU2Fsdm9zKSB7XHJcblx0XHRcdHNlcnZpY2Uuc2V0UGVkaWRvc1NhbHZvKHBlZGlkbylcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCBpbmRpY2UgPSB1bmRlZmluZWRcclxuXHRcdFx0bGlzdGFQZWRpZG9zU2Fsdm9zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcclxuXHRcdFx0XHRpZihpdGVtLmlkUGVkaWRvU2Fsdm8gPT09IHBlZGlkby5pZFBlZGlkb1NhbHZvKSB7XHJcblx0XHRcdFx0XHRpbmRpY2UgPSBpbmRleFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0aWYoaW5kaWNlICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRsaXN0YVBlZGlkb3NTYWx2b3NbaW5kaWNlXSA9IHBlZGlkb1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBsaXN0YVBlZGlkb3NTYWx2b3MpIHtcclxuXHRcdFx0XHRcdGlmKGluZGljZSA9PT0gdW5kZWZpbmVkIHx8IGluZGljZSA8IGxpc3RhUGVkaWRvc1NhbHZvc1tpXS5pZFBlZGlkb1NhbHZvKSB7XHJcblx0XHRcdFx0XHRcdGluZGljZSA9IGxpc3RhUGVkaWRvc1NhbHZvc1tpXS5pZFBlZGlkb1NhbHZvXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCFpbmRpY2UpIHtcclxuXHRcdFx0XHRcdGluZGljZSA9IDBcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cGVkaWRvLmlkUGVkaWRvU2Fsdm8gPSBpbmRpY2UgKyAxXHJcblx0XHRcdFx0bGlzdGFQZWRpZG9zU2Fsdm9zLnB1c2gocGVkaWRvKVxyXG5cdFx0XHR9XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwZWRpZG9zJywgSlNPTi5zdHJpbmdpZnkobGlzdGFQZWRpZG9zU2Fsdm9zKSlcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0c2VydmljZS5nZXRQZWRpZG9zU2Fsdm8gPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwZWRpZG9zJykgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwZWRpZG9zJykpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2UucmVtb3ZlUGVkaWRvU2Fsdm8gPSBmdW5jdGlvbihwZWRpZG8pIHtcclxuXHRcdGxldCBsaXN0YVBlZGlkb3NTYWx2b3MgPSBzZXJ2aWNlLmdldFBlZGlkb3NTYWx2bygpXHJcblx0XHRpZihsaXN0YVBlZGlkb3NTYWx2b3MpIHtcclxuXHRcdFx0bGV0IGluZGljZSA9IHVuZGVmaW5lZFxyXG5cdFx0XHRsaXN0YVBlZGlkb3NTYWx2b3MuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xyXG5cdFx0XHRcdGlmKGl0ZW0uaWRQZWRpZG9TYWx2byA9PT0gcGVkaWRvLmlkUGVkaWRvU2Fsdm8pIHtcclxuXHRcdFx0XHRcdGluZGljZSA9IGluZGV4XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHRpZihpbmRpY2UgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGxpc3RhUGVkaWRvc1NhbHZvcy5zcGxpY2UoaW5kaWNlLCAxKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGxpc3RhUGVkaWRvc1NhbHZvcy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRzZXJ2aWNlLnJlc2V0UGVkaWRvc1NhbHZvKClcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncGVkaWRvcycsIEpTT04uc3RyaW5naWZ5KGxpc3RhUGVkaWRvc1NhbHZvcykpXHRcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLnJlc2V0UGVkaWRvc1NhbHZvID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncGVkaWRvcycpKSB7XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdwZWRpZG9zJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKi0tLS0tLS0tLS0tLS0tLURBVEFCQVNFIFVTVUFSSU8tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5cdHNlcnZpY2Uuc2V0RGF0YVVzdWFyaW8gPSBmdW5jdGlvbih1c3VhcmlvKSB7XHJcblx0XHRsZXQgdXN1YXJpb0RiID0gW11cclxuXHRcdHVzdWFyaW9EYi5wdXNoKHVzdWFyaW8pXHJcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXN1YXJpb0RiJywgSlNPTi5zdHJpbmdpZnkodXN1YXJpb0RiKSlcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuZ2V0RGF0YVVzdWFyaW8gPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c3VhcmlvRGInKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzdWFyaW9EYicpKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2VydmljZS5nZXRMb2dpblVzdWFyaW8gPSBmdW5jdGlvbihsb2dpbiwgc2VuaGEpIHtcclxuXHRcdGxldCBsaXN0YVVzdWFyaW9TYWx2byA9IHNlcnZpY2UuZ2V0RGF0YVVzdWFyaW8oKVxyXG5cdFx0aWYobGlzdGFVc3VhcmlvU2Fsdm8gJiYgbGlzdGFVc3VhcmlvU2Fsdm8ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRsZXQgaW5kaWNlID0gdW5kZWZpbmVkXHJcblx0XHRcdGxpc3RhVXN1YXJpb1NhbHZvLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcclxuXHRcdFx0XHRpZihpdGVtLmxvZ2luID09PSBsb2dpbiAmJiBpdGVtLnNlbmhhID09PSBzZW5oYSkge1xyXG5cdFx0XHRcdFx0aW5kaWNlID0gaW5kZXhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdGlmKGluZGljZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0cmV0dXJuIGxpc3RhVXN1YXJpb1NhbHZvW2luZGljZV1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuYWRkVXN1YXJpb1NhbHZvID0gZnVuY3Rpb24odXN1YXJpbykge1xyXG5cdFx0bGV0IGxpc3RhVXN1YXJpb1NhbHZvID0gc2VydmljZS5nZXREYXRhVXN1YXJpbygpXHJcblx0XHRpZighbGlzdGFVc3VhcmlvU2Fsdm8pIHtcclxuXHRcdFx0c2VydmljZS5zZXREYXRhVXN1YXJpbyh1c3VhcmlvKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IGluZGljZSA9IHVuZGVmaW5lZFxyXG5cdFx0XHRsaXN0YVVzdWFyaW9TYWx2by5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XHJcblx0XHRcdFx0aWYoaXRlbS5pZCA9PT0gdXN1YXJpby5pZCkge1xyXG5cdFx0XHRcdFx0aW5kaWNlID0gaW5kZXhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdGlmKGluZGljZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0bGlzdGFVc3VhcmlvU2Fsdm9baW5kaWNlXSA9IHVzdWFyaW9cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsaXN0YVVzdWFyaW9TYWx2by5wdXNoKHVzdWFyaW8pXHJcblx0XHRcdH1cclxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzdWFyaW9EYicsIEpTT04uc3RyaW5naWZ5KGxpc3RhVXN1YXJpb1NhbHZvKSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNlcnZpY2UucmVtb3ZlVXN1YXJpb1NhbHZvID0gZnVuY3Rpb24odXN1YXJpbykge1xyXG5cdFx0XHRsZXQgbGlzdGFVc3VhcmlvU2Fsdm8gPSBzZXJ2aWNlLmdldERhdGFVc3VhcmlvKClcclxuXHRcdFx0aWYobGlzdGFVc3VhcmlvU2Fsdm8pIHtcclxuXHRcdFx0XHRsZXQgaW5kaWNlID0gdW5kZWZpbmVkXHJcblx0XHRcdFx0bGlzdGFVc3VhcmlvU2Fsdm8uZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xyXG5cdFx0XHRcdFx0aWYoaXRlbS5sb2dpbiA9PT0gdXN1YXJpby5sb2dpbiAmJiBpdGVtLnBhc3N3b3JkID09IHVzdWFyaW8uc2VuaGEpIHtcclxuXHRcdFx0XHRcdFx0aW5kaWNlID0gaW5kZXhcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdGlmKGluZGljZSkge1xyXG5cdFx0XHRcdFx0bGlzdGFVc3VhcmlvU2Fsdm8uc3BsaWNlKGluZGljZSwgMSlcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c3VhcmlvRGInLCBKU09OLnN0cmluZ2lmeShsaXN0YVVzdWFyaW9TYWx2bykpXHJcblx0XHRcdFx0XHRyZXR1cm4gaW5kaWNlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcclxuXHR9XHJcblxyXG5cdC8qLS0tLS0tLS0tLS0tLS0tSURFTlRJRklDQURPUiBEQVRBQkFTRS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHRzZXJ2aWNlLnNldElkZW50aWZpY2Fkb3JCYW5jb0RhZG9zID0gZnVuY3Rpb24oaWRlbnRpZmljYWRvcikge1xyXG5cdFx0bG9jYWxTdG9yYWdlLmlkZW50aWZpY2Fkb3JCYW5jb0RhZG9zID0gYW5ndWxhci50b0pzb24oaWRlbnRpZmljYWRvcik7XHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2UuZ2V0SWRlbnRpZmljYWRvckJhbmNvRGFkb3MgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5pZGVudGlmaWNhZG9yQmFuY29EYWRvcyk7XHJcblx0fVxyXG5cclxuXHRzZXJ2aWNlLnJlc2V0SWRlbnRpZmljYWRvckJhbmNvRGFkb3MgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmKGxvY2FsU3RvcmFnZS5pZGVudGlmaWNhZG9yQmFuY29EYWRvcykge1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnaWRlbnRpZmljYWRvckJhbmNvRGFkb3MnKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qLS0tLS0tLS0tLS0tLS0tREFUQSBTSU5DUk9OSVpBQ0FPIERBVEFCQVNFLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cdHNlcnZpY2Uuc2V0RGF0YVNpbmNyb25pemFjYW8gPSBmdW5jdGlvbihkYXRhU2luY3Jvbml6YWNhbykge1xyXG5cdFx0bG9jYWxTdG9yYWdlLmRhdGFTaW5jcm9uaXphY2FvID0gYW5ndWxhci50b0pzb24oZGF0YVNpbmNyb25pemFjYW8pXHJcblx0fVxyXG5cdHNlcnZpY2UuZ2V0RGF0YVNpbmNyb25pemFjYW8gPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5kYXRhU2luY3Jvbml6YWNhbyk7XHJcblx0fVxyXG5cclxuXHQvKi0tLS0tLS0tLS0tLS0tLUlORFVTVFJJQSBEQVRBQkFTRS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHRzZXJ2aWNlLmdldEluZHVzdHJpYXNVc3VhcmlvID0gZnVuY3Rpb24oaWRVc3VhcmlvKSB7XHJcblx0XHRsZXQgaW5kdXN0cmlhc1VzdWFyaW8gPSBMb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldERhdGEoU1RPUkFHRV9JVEVNLklORFVTVFJJQVNfVVNVQVJJTylcclxuXHRcdFxyXG5cdFx0aWYoaW5kdXN0cmlhc1VzdWFyaW8pIHtcclxuXHRcdFx0dmFyIHJlc3VsdCA9ICQuZ3JlcChpbmR1c3RyaWFzVXN1YXJpbywgZnVuY3Rpb24obiwgaSkge1xyXG5cdFx0XHRcdHJldHVybiBuLmlkVXN1YXJpbyA9PT0gaWRVc3VhcmlvO1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0aWYocmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdFswXS5pbmR1c3RyaWFzXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB1bmRlZmluZWRcclxuXHR9XHJcblxyXG5cdHNlcnZpY2Uuc2V0SW5kdXN0cmlhc1VzdWFyaW8gPSBmdW5jdGlvbihpZFVzdWFyaW8sIGluZHVzdHJpYXMpIHtcclxuXHRcdGxldCBub2RvID0geyBpZFVzdWFyaW86IGlkVXN1YXJpbywgaW5kdXN0cmlhczogaW5kdXN0cmlhcyB9XHJcblx0XHRsZXQgdXN1YXJpb0luZHVzdHJpYXMgPSBMb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldERhdGEoU1RPUkFHRV9JVEVNLklORFVTVFJJQVNfVVNVQVJJTylcclxuXHRcdGlmKHVzdWFyaW9JbmR1c3RyaWFzKSB7XHJcblx0XHRcdHVzdWFyaW9JbmR1c3RyaWFzLnB1c2gobm9kbylcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHVzdWFyaW9JbmR1c3RyaWFzID0gW25vZG9dXHJcblx0XHR9XHJcblx0XHRMb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldERhdGEoU1RPUkFHRV9JVEVNLklORFVTVFJJQVNfVVNVQVJJTywgdXN1YXJpb0luZHVzdHJpYXMpXHJcblx0fVxyXG5cclxuXHQvKi0tLS0tLS0tLS0tLS0tLUNMSUVOVEUtSU5EVVNUUklBIERBVEFCQVNFLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cdHNlcnZpY2UuZ2V0Q2xpZW50ZXNVc3VhcmlvID0gZnVuY3Rpb24oaWRVc3VhcmlvLCBpZEluZHVzdHJpYSkge1xyXG5cdFx0bGV0IGNsaWVudGVzID0gTG9jYWxTdG9yYWdlU2VydmljZS5nZXREYXRhKFNUT1JBR0VfSVRFTS5DTElFTlRFU19VU1VBUklPKVxyXG5cclxuXHRcdGlmKGNsaWVudGVzKSB7XHJcblx0XHRcdHZhciByZXN1bHQgPSAkLmdyZXAoY2xpZW50ZXMsIGZ1bmN0aW9uKG4sIGkpIHtcclxuXHRcdFx0XHRyZXR1cm4gbi5pZFVzdWFyaW8gPT0gaWRVc3VhcmlvICYmIG4uaWRJbmR1c3RyaWEgPT0gaWRJbmR1c3RyaWFcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdGlmKHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHJldHVybiByZXN1bHRbMF0uY2xpZW50ZXNcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdH1cclxuXHJcblx0LypcclxuXHRzZXJ2aWNlLmdldFRhYmVsYXNJbmR1c3RyaWFVc3VhcmlvID0gZnVuY3Rpb24oaWRVc3VhcmlvLCBpZEluZHVzdHJpYSkge1xyXG5cdFx0bGV0IHRhYmVsYXMgPSBMb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldERhdGEoU1RPUkFHRV9JVEVNLlRBQkVMQVNfSU5EVVNUUklBKVxyXG5cclxuXHRcdGlmKHRhYmVsYXMpIHtcclxuXHRcdFx0dmFyIHJlc3VsdCA9ICQuZ3JlcCh0YWJlbGFzLCBmdW5jdGlvbihuLCBpKSB7XHJcblx0XHRcdFx0cmV0dXJuIG4uaWRUYWJlbGFcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNlcnZpY2Uuc2V0VGFiZWxhc0luZHVzdHJpYVVzdWFyaW8gPSBmdW5jdGlvbihpZFVzdWFyaW8sIGlkSW5kdXN0cmlhLCB0YWJlbGFzKSB7XHJcblxyXG5cdH1cclxuXHQqL1xyXG5cclxuXHRzZXJ2aWNlLnNldENsaWVudGVzVXN1YXJpbyA9IGZ1bmN0aW9uKGlkVXN1YXJpbywgaWRJbmR1c3RyaWEsIGNsaWVudGVzKSB7XHJcblx0XHRsZXQgbm9kbyA9IHsgaWRVc3VhcmlvOiBpZFVzdWFyaW8sIGlkSW5kdXN0cmlhOiBpZEluZHVzdHJpYSwgY2xpZW50ZXM6IGNsaWVudGVzIH1cclxuXHRcdGxldCB1c3VhcmlvQ2xpZW50ZXMgPSBMb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldERhdGEoU1RPUkFHRV9JVEVNLkNMSUVOVEVTX1VTVUFSSU8pXHJcblx0XHRpZih1c3VhcmlvQ2xpZW50ZXMpIHtcclxuXHRcdFx0dXN1YXJpb0NsaWVudGVzLnB1c2gobm9kbylcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHVzdWFyaW9DbGllbnRlcyA9IFtub2RvXVxyXG5cdFx0fVxyXG5cdFx0TG9jYWxTdG9yYWdlU2VydmljZS5zZXREYXRhKFNUT1JBR0VfSVRFTS5DTElFTlRFU19VU1VBUklPLCB1c3VhcmlvQ2xpZW50ZXMpXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2VydmljZTtcclxufV0pOyIsIid1c2Ugc3RyaWN0J1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ0dlcmVuY2lhZG9yRmluYW5jZWlyb0ZsZWNoYVZlbmRhcycpLmZhY3RvcnkoJ1NpbmNyb25pemFjYW9TZXJ2aWNlJywgW1xyXG5cdCckaHR0cCcsXHJcblx0JyRyb290U2NvcGUnLFxyXG5cdCdTdG9yYWdlU2VydmljZScsXHJcblx0J0luZHVzdHJpYXNTZXJ2aWNlJyxcclxuXHQnUGVkaWRvU2VydmljZScsXHJcblx0Y29uc3RydWN0b3IsXHJcbl0pXHJcblxyXG5mdW5jdGlvbiBjb25zdHJ1Y3RvcigkaHR0cCwgJHJvb3RTY29wZSwgU3RvcmFnZVNlcnZpY2UsIEluZHVzdHJpYXNTZXJ2aWNlLCBQZWRpZG9TZXJ2aWNlKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7fTtcclxuXHJcblx0c2VydmljZS5zaW5jcm9uaXphID0gZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkLCBjYWxsYmFjaykge1xyXG5cdFx0JGh0dHAucG9zdChNT0RPX0hUVFAgKyBVUkwgKyAnL2RvTG9naW4vJywgeyBsb2dpbjogdXNlcm5hbWUsIHNlbmhhOiBwYXNzd29yZCB9KVxyXG5cdFx0XHQuc3VjY2VzcyhmdW5jdGlvbiAodXN1YXJpbykge1xyXG5cdFx0XHRcdHNpbmNyb25pemFVc3Vhcmlvcyh1c3VhcmlvKVxyXG5cdFx0XHRcdHNpbmNyb25pemFJbmR1c3RyaWFzKHVzdWFyaW8pXHJcblx0XHRcdFx0c2luY3Jvbml6YUNsaWVudGVzKHVzdWFyaW8pXHJcblx0XHRcdFx0Ly8gc2luY3Jvbml6YVRhYmVsYXModXN1YXJpbylcclxuXHRcdFx0XHRhdHVhbGl6YUJhc2VMb2NhbChjYWxsYmFjaylcclxuXHRcdFx0XHR9XHJcblx0XHRcdClcclxuXHRcdFx0LmVycm9yKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0Y29ubHVpclNpbmNyb25pemFjYW8odW5kZWZpbmVkLCByZXNwb25zZSlcclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2luY3Jvbml6YVVzdWFyaW9zKHVzdWFyaW8pIHtcclxuXHRcdGxldCB1c3VhcmlvTG9jYWwgPSBTdG9yYWdlU2VydmljZS5nZXRMb2dpblVzdWFyaW8odXN1YXJpby5sb2dpbiwgdXN1YXJpby5zZW5oYSlcclxuXHRcdGlmKHVzdWFyaW9Mb2NhbCkge1xyXG5cdFx0XHRTdG9yYWdlU2VydmljZS5yZW1vdmVVc3VhcmlvU2Fsdm8odXN1YXJpb0xvY2FsKVxyXG5cdFx0XHRTdG9yYWdlU2VydmljZS5hZGRVc3VhcmlvU2Fsdm8odXN1YXJpbylcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdFN0b3JhZ2VTZXJ2aWNlLmFkZFVzdWFyaW9TYWx2byh1c3VhcmlvKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2luY3Jvbml6YUluZHVzdHJpYXModXN1YXJpbykge1xyXG5cdFx0SW5kdXN0cmlhc1NlcnZpY2UuZ2V0SW5kdXN0cmlhc1VzdWFyaW8odXN1YXJpby5pZCwgZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRTdG9yYWdlU2VydmljZS5zZXRJbmR1c3RyaWFzVXN1YXJpbyh1c3VhcmlvLmlkLCBkYXRhKVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNpbmNyb25pemFDbGllbnRlcyh1c3VhcmlvKSB7XHJcblx0XHRJbmR1c3RyaWFzU2VydmljZS5nZXRJbmR1c3RyaWFzVXN1YXJpbyh1c3VhcmlvLmlkLCBmdW5jdGlvbihpbmR1c3RyaWFzKSB7XHJcblx0XHRcdGluZHVzdHJpYXMuZm9yRWFjaChpbmR1c3RyaWEgPT4ge1xyXG5cdFx0XHRcdFBlZGlkb1NlcnZpY2UuY2FycmVnYUNsaWVudGVzUG9yUmVwcmVzZW50YWNhbyhpbmR1c3RyaWEuaWQsIHVzdWFyaW8uaWQsIGNsaWVudGVzID0+IHtcclxuXHRcdFx0XHRcdGlmKGNsaWVudGVzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0U3RvcmFnZVNlcnZpY2Uuc2V0Q2xpZW50ZXNVc3VhcmlvKHVzdWFyaW8uaWQsIGluZHVzdHJpYS5pZCwgY2xpZW50ZXMpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzaW5jcm9uaXphVGFiZWxhcyh1c3VhcmlvKSB7XHJcblx0XHRJbmR1c3RyaWFzU2VydmljZS5nZXRUYWJlbGFzSW5kdXN0cmlhKGlkSW5kdXN0cmlhLCB0YWJlbGFzID0+IHtcclxuXHRcdFx0aWYodGFiZWxhcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0U3RvcmFnZVNlcnZpY2Uuc2V0VGFiZWxhc0luZHVzdHJpYVVzdWFyaW8odXN1YXJpby5pZCwgaWRJbmR1c3RyaWEsIHRhYmVsYXMpXHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhdHVhbGl6YUJhc2VMb2NhbChjYWxsYmFjaykge1xyXG5cdFx0bGV0IGlkRGIgPSBTdG9yYWdlU2VydmljZS5nZXRJZGVudGlmaWNhZG9yQmFuY29EYWRvcygpXHJcblx0XHRpZighaWREYiB8fCBpZERiICE9PSBEQVRBQkFTRS5JRCkge1xyXG5cdFx0XHQkaHR0cC5nZXQoTU9ET19IVFRQICsgVVJMICsgJy9nZXRJZGVudGlmaWNhZG9yQXR1YWxpemFjYW9CYW5jb0RlRGFkb3MvJykuc3VjY2VzcyhmdW5jdGlvbihpZCkge1xyXG5cdFx0XHRcdFx0U3RvcmFnZVNlcnZpY2Uuc2V0SWRlbnRpZmljYWRvckJhbmNvRGFkb3MoaWQpXHJcblx0XHRcdFx0XHRjb25sdWlyU2luY3Jvbml6YWNhbyh0cnVlLCBjYWxsYmFjaylcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbmx1aXJTaW5jcm9uaXphY2FvKHRydWUsIGNhbGxiYWNrKVxyXG5cdFx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjb25sdWlyU2luY3Jvbml6YWNhbyhyZXN1bHRhZG8sIGNhbGxiYWNrKSB7XHJcblx0XHRpZihyZXN1bHRhZG8pIHtcclxuXHRcdFx0U3RvcmFnZVNlcnZpY2Uuc2V0RGF0YVNpbmNyb25pemFjYW8obW9tZW50KCkpXHJcblx0XHRcdGNhbGxiYWNrKHJlc3VsdGFkbylcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNhbGxiYWNrKHJlc3VsdGFkbylcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBzZXJ2aWNlO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBUYWJlbGFNb2R1bG8gPSBhbmd1bGFyLm1vZHVsZSgndGFiZWxhLm1vZHVsZScpO1xyXG5cclxuVGFiZWxhTW9kdWxvLmNvbmZpZygoJHN0YXRlUHJvdmlkZXIpID0+IHtcclxuICB2YXIgdGFiZWxhID0ge1xyXG4gICAgbmFtZTogJ21haW4udGFiZWxhJyxcclxuICAgIHVybDogJy90YWJlbGEnLFxyXG4gICAgYWJzdHJhY3Q6IHRydWVcclxuICB9O1xyXG4gIHZhciBjYXJnYVRhYmVsYSA9IHtcclxuICAgIG5hbWU6ICdtYWluLnRhYmVsYS5jYXJnYScsXHJcbiAgICB1cmw6ICcvY2FyZ2EnLFxyXG4gICAgY29tcG9uZW50OiAnY2FyZ2FUYWJlbGFDb21wb25lbnQnLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBsaXN0YUluZHVzdHJpYXM6IGZ1bmN0aW9uIChJbmR1c3RyaWFTZXJ2aWNlKSB7XHJcbiAgICAgICAgcmV0dXJuIEluZHVzdHJpYVNlcnZpY2UuZ2V0SW5kdXN0cmlhcygpO1xyXG4gICAgICB9LFxyXG4gICAgfVxyXG4gIH07XHJcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUodGFiZWxhKTtcclxuICAkc3RhdGVQcm92aWRlci5zdGF0ZShjYXJnYVRhYmVsYSk7XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCd0YWJlbGEubW9kdWxlJywgW10pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBQZWRpZG9Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgndGFiZWxhLm1vZHVsZScpO1xyXG5cclxuUGVkaWRvTW9kdWxlLmZhY3RvcnkoJ1RhYmVsYVNlcnZpY2UnLCBbJ0h0dHBTZXJ2aWNlJyxcclxuICBmdW5jdGlvbihIdHRwU2VydmljZSl7XHJcbiAgICB2YXIgc2VydmljZSA9IHt9O1xyXG4gICAgY29uc3QgU1VCUEFUSCA9ICdzZXJ2aWNlL3RhYmVsYSc7XHJcblxyXG4gICAgY29uc3QgVVJMX1RBQkVMQV9VUExPQUQgPSBgJHtTVUJQQVRIfS91cGxvYWRUYWJlbGFgO1xyXG4gICAgY29uc3QgVVJMX1RBQkVMQV9CVVNDQVJfUE9SX0lORFVTVFJJQVMgPSBgJHtTVUJQQVRIfS9nZXRUYWJlbGFzUG9ySW5kdXN0cmlhYDtcclxuICAgIGNvbnN0IFVSTF9UQUJFTEFfRVhDTFVJUiA9IGAke1NVQlBBVEh9L2V4Y2x1aXJUYWJlbGFgO1xyXG4gICAgY29uc3QgVVJMX1RBQkVMQV9ET1dOTE9BRF9BUlFVSVZPID0gYCR7U1VCUEFUSH0vZG93bmxvYWRBcnF1aXZvVGFiZWxhYDtcclxuICAgIGNvbnN0IFVSTF9UQUJFTEFfQlVTQ0FSX1BPUl9JRCA9IGAke1NVQlBBVEh9L2J1c2NhVGFiZWxhUG9ySWRgO1xyXG5cclxuICAgIHNlcnZpY2UudXBsb2FkVGFiZWxhID0gKGZpbGUpID0+IHtcclxuICAgICAgdmFyIGZkID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgIGZkLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xyXG4gICAgICByZXR1cm4gSHR0cFNlcnZpY2UuaHR0cFBvc3QoVVJMX1RBQkVMQV9VUExPQUQsIGZkKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VydmljZS5nZXRUYWJlbGFzUG9ySW5kdXN0cmlhID0gKGlkSW5kdXN0cmlhKSA9PiB7XHJcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwUG9zdChVUkxfVEFCRUxBX0JVU0NBUl9QT1JfSU5EVVNUUklBUywgaWRJbmR1c3RyaWEpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXJ2aWNlLmV4Y2x1aXJUYWJlbGEgPSAoaWRUYWJlbGEpID0+IHtcclxuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBQb3N0KFVSTF9UQUJFTEFfRVhDTFVJUiwgaWRUYWJlbGEpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXJ2aWNlLmV4Y2x1aXJUYWJlbGEgPSAoaWRUYWJlbGEpID0+IHtcclxuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBHZXQoVVJMX1RBQkVMQV9ET1dOTE9BRF9BUlFVSVZPLCBpZFRhYmVsYSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlcnZpY2UuYnVzY2FUYWJlbGFQb3JJZCA9IChpZFRhYmVsYSkgPT4ge1xyXG4gICAgICByZXR1cm4gSHR0cFNlcnZpY2UuaHR0cEdldChVUkxfVEFCRUxBX0JVU0NBUl9QT1JfSUQsIGlkVGFiZWxhKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcbiAgfVxyXG5dKTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciBUYWJlbGFNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnVGFiZWxhJylcclxuXHQuY29udHJvbGxlcignVGFiZWxhQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJGxvY2F0aW9uJywgJyRodHRwJywgJyRyb3V0ZVBhcmFtcycsICckd2luZG93JywgJ1RhYmVsYVNlcnZpY2UnLCAnSW5kdXN0cmlhc1NlcnZpY2UnLCAnQXV0aGVudGljYXRpb25TZXJ2aWNlJywgJ01vZGFsU2VydmljZScsICdibG9ja1VJJywgJ05vdGlmaWNhdGlvblNlcnZpY2UnLCBcclxuXHRcdGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsICRsb2NhdGlvbiwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHdpbmRvdywgVGFiZWxhU2VydmljZSwgSW5kdXN0cmlhc1NlcnZpY2UsIEF1dGhlbnRpY2F0aW9uU2VydmljZSwgTW9kYWxTZXJ2aWNlLCBibG9ja1VJLCBOb3RpZmljYXRpb25TZXJ2aWNlKSB7XHJcblxyXG5cdFx0JHNjb3BlLnRhYmVsYXMgPSBbXTtcclxuXHJcblx0XHQkc2NvcGUuZmlsZVRhYmVsYSA9IG51bGw7XHJcblxyXG5cdFx0JHNjb3BlLmluZHVzdHJpYSA9IHtcclxuXHRcdFx0c2VsZWNpb25hZG86IG51bGxcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnRhYmVsYSA9IHt9XHJcblxyXG5cdFx0SW5kdXN0cmlhc1NlcnZpY2UuZ2V0SW5kdXN0cmlhc1VzdWFyaW8oJHJvb3RTY29wZS5nbG9iYWxzLmN1cnJlbnRVc2VyLnVzZXIuaWQsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHQkc2NvcGUuaW5kdXN0cmlhcyA9IHJlc3BvbnNlO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JHNjb3BlLnNlbGVjaW9uYUluZHVzdHJpYSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0SW5kdXN0cmlhc1NlcnZpY2UuZ2V0VGFiZWxhc0luZHVzdHJpYSgkc2NvcGUuaW5kdXN0cmlhLnNlbGVjaW9uYWRvLmlkLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHQkc2NvcGUudGFiZWxhcyA9IHJlc3BvbnNlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaWRUYWJlbGEgPSAkcm91dGVQYXJhbXMuaWRUYWJlbGFcclxuXHRcdGlmKGlkVGFiZWxhKSB7XHJcblx0XHRcdC8vYnVzY2EgZGFkb3MgZGEgdGFiZWxhXHJcblx0XHRcdFRhYmVsYVNlcnZpY2UuYnVzY2FUYWJlbGFQb3JJZChpZFRhYmVsYSwgZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdFx0XHRcdCRzY29wZS50YWJlbGEgPSByZXNwb25zZTtcclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmKHNlc3Npb25TdG9yYWdlLmluZHVzdHJpYSkge1xyXG5cdFx0XHRcdCRzY29wZS5pbmR1c3RyaWEuc2VsZWNpb25hZG8gPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2luZHVzdHJpYScpKS5zZWxlY2lvbmFkb1xyXG5cdFx0XHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2luZHVzdHJpYScpXHJcblx0XHRcdFx0JHNjb3BlLnNlbGVjaW9uYUluZHVzdHJpYSgpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQkc2NvcGUuaXNWZW5kZWRvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIEF1dGhlbnRpY2F0aW9uU2VydmljZS5pc1ZlbmRlZG9yKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JHNjb3BlLnJlbW92ZXJUYWJlbGEgPSBmdW5jdGlvbiAodGFiZWxhQXR1YWwpIHtcclxuXHRcdFx0dmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuXHRcdFx0XHRjbG9zZUJ1dHRvblRleHQ6ICdOw6NvJyxcclxuXHRcdFx0XHRhY3Rpb25CdXR0b25UZXh0OiAnU2ltJyxcclxuXHRcdFx0XHRoZWFkZXJUZXh0OiAnQ29uZmlybWFyJyxcclxuXHRcdFx0XHRib2R5VGV4dDogJ0NvbmZpcm1hIHJlbW/Dp8OjbyBkYSAnICsgdGFiZWxhQXR1YWwubm9tZSArICc/J1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0TW9kYWxTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHRcdFx0XHRUYWJlbGFTZXJ2aWNlLmV4Y2x1aXJUYWJlbGEodGFiZWxhQXR1YWwsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0SW5kdXN0cmlhc1NlcnZpY2UuZ2V0VGFiZWxhc0luZHVzdHJpYSgkc2NvcGUuaW5kdXN0cmlhLnNlbGVjaW9uYWRvLmlkLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRhYmVsYXMgPSByZXNwb25zZTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5zdWNjZXNzKHJlc3BvbnNlLm5vbWUgKyAnIGV4Y2x1w61kYSBjb20gc3VjZXNzbyEnKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQkc2NvcGUudXBsb2FkVGFiZWxhID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgZmlsZSA9ICRzY29wZS5maWxlVGFiZWxhO1xyXG5cdFx0XHRibG9ja1VJLnN0YXJ0KCdDYXJyZWdhbmRvIFRhYmVsYSwgQWd1YXJkZS4uLicpO1xyXG5cdFx0XHRUYWJlbGFTZXJ2aWNlLnVwbG9hZFRhYmVsYVRvVXJsKGZpbGUsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRJbmR1c3RyaWFzU2VydmljZS5nZXRUYWJlbGFzSW5kdXN0cmlhKCRzY29wZS5pbmR1c3RyaWEuc2VsZWNpb25hZG8uaWQsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLnRhYmVsYXMgPSByZXNwb25zZTtcclxuXHRcdFx0XHRcdGJsb2NrVUkuc3RvcCgpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuXHRcdFx0XHRibG9ja1VJLnN0b3AoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2Jhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0KSB7XHJcblx0XHRcdHZhciBiaW5hcnlfc3RyaW5nID0gICR3aW5kb3cuYXRvYihiYXNlNjQpO1xyXG5cdFx0XHR2YXIgbGVuID0gYmluYXJ5X3N0cmluZy5sZW5ndGg7XHJcblx0XHRcdHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KCBsZW4gKTtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0Ynl0ZXNbaV0gPSBiaW5hcnlfc3RyaW5nLmNoYXJDb2RlQXQoaSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGJ5dGVzLmJ1ZmZlcjtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBiNjR0b0Jsb2IoYjY0RGF0YSwgY29udGVudFR5cGUsIHNsaWNlU2l6ZSkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IEJsb2IoW19iYXNlNjRUb0FycmF5QnVmZmVyKGI2NERhdGEpXSwge3R5cGU6IGNvbnRlbnRUeXBlfSk7XHJcblx0XHR9XHJcblxyXG5cdFx0JHNjb3BlLmRvd25sb2FkVGFiZWxhID0gKGlkVGFiZWxhKSA9PiB7XHJcblx0XHRcdFRhYmVsYVNlcnZpY2UuZG93bmxvYWRBcnF1aXZvKGlkVGFiZWxhLCAoZGF0YSkgPT4ge1xyXG5cdFx0XHRcdFx0bGV0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcblx0XHRcdFx0XHRhLnN0eWxlID0gXCJkaXNwbGF5OiBub25lXCI7XHJcblx0XHRcdFx0XHR2YXIgYmxvYiA9IGI2NHRvQmxvYihkYXRhLmFycXVpdm8sICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nKTtcclxuXHRcdFx0XHRcdGxldCB1cmwgPSAkd2luZG93LndlYmtpdFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XHJcblx0XHRcdFx0XHRhLmhyZWYgPSB1cmw7XHJcblx0XHRcdFx0XHRhLmRvd25sb2FkID0gZGF0YS5ub21lQXJxdWl2bztcclxuXHRcdFx0XHRcdGEuY2xpY2soKTtcclxuXHRcdFx0XHRcdCR3aW5kb3cud2Via2l0VVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdCRzY29wZS5kZXRhbGhlVGFiZWxhID0gZnVuY3Rpb24oaWRUYWJlbGEpIHtcclxuXHRcdFx0c2Vzc2lvblN0b3JhZ2UuaW5kdXN0cmlhID0gSlNPTi5zdHJpbmdpZnkoeyBzZWxlY2lvbmFkbzokc2NvcGUuaW5kdXN0cmlhLnNlbGVjaW9uYWRvIH0pXHJcblx0XHRcdCRsb2NhdGlvbi5wYXRoKGAvZGV0YWxoZVRhYmVsYS8ke2lkVGFiZWxhfWApXHJcblx0XHR9XHJcblxyXG5cdH1dKTtcclxuXHJcblRhYmVsYU1vZHVsZS5kaXJlY3RpdmUoJ2ZpbGVNb2RlbCcsIFsnJHBhcnNlJywgZnVuY3Rpb24gKCRwYXJzZSkge1xyXG5cdHJldHVybiB7XHJcblx0XHRyZXN0cmljdDogJ0EnLFxyXG5cdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG5cdFx0XHR2YXIgbW9kZWwgPSAkcGFyc2UoYXR0cnMuZmlsZU1vZGVsKTtcclxuXHRcdFx0dmFyIG1vZGVsU2V0dGVyID0gbW9kZWwuYXNzaWduO1xyXG5cclxuXHRcdFx0ZWxlbWVudC5iaW5kKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0c2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdG1vZGVsU2V0dGVyKHNjb3BlLCBlbGVtZW50WzBdLmZpbGVzWzBdKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fTtcclxufV0pO1xyXG4iLCIndXNlIHN0cmljdCdcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdUYWJlbGEnKVxyXG5cclxuLmZhY3RvcnkoJ1RhYmVsYVNlcnZpY2UnLCBbICckaHR0cCcsICckcm9vdFNjb3BlJywgJ05ldHdvcmtTZXJ2aWNlJywgJ05vdGlmaWNhdGlvblNlcnZpY2UnLCBmdW5jdGlvbigkaHR0cCwgJHJvb3RTY29wZSwgTmV0d29ya1NlcnZpY2UsIE5vdGlmaWNhdGlvblNlcnZpY2UpIHtcclxuXHR2YXIgc2VydmljZSA9IHt9O1xyXG5cclxuXHRzZXJ2aWNlLnVwbG9hZFRhYmVsYVRvVXJsID0gZnVuY3Rpb24oZmlsZSwgY2FsbGJhY2ssIGNhbGxiYWNrRXJyb3IpIHtcclxuICAgICAgICB2YXIgZmQgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICBmZC5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcclxuICAgICBcclxuICAgICAgICAkaHR0cC5wb3N0KE1PRE9fSFRUUCArIFVSTCArICcvdXBsb2FkVGFiZWxhJywgZmQsIHtcclxuICAgICAgICAgICB0cmFuc2Zvcm1SZXF1ZXN0OiBhbmd1bGFyLmlkZW50aXR5LFxyXG4gICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogdW5kZWZpbmVkfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2Uuc3VjY2VzcygnVGFiZWxhIGNhZGFzdHJhZGEgY29tIHN1Y2Vzc28hJylcclxuICAgICAgICBcdGNhbGxiYWNrKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyb3Ipe1xyXG5cdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgXHRjYWxsYmFja0Vycm9yKGVycm9yKTtcclxuICAgICAgICB9KTtcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuZXhjbHVpclRhYmVsYSA9IGZ1bmN0aW9uKHRhYmVsYSwgY2FsbGJhY2spIHtcclxuXHRcdGNvbnN0IF9pZCA9IHRhYmVsYS5pZFxyXG5cdFx0TmV0d29ya1NlcnZpY2UuaHR0cFBvc3QoJy9leGNsdWlyVGFiZWxhJywgX2lkLCAocmVzdWx0LCBkYXRhKSA9PiB7XHJcblx0XHRcdGlmIChyZXN1bHQgPT0gQ0FMTFJFU1VMVC5PSykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGRhdGEpXHJcblx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IENBTExSRVNVTFQuRVJST1IpIHtcclxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciBsaXN0YSBzdGF0dXMgcGVkaWRvJywgZGF0YSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuYnVzY2FUYWJlbGFQb3JJZCA9IGZ1bmN0aW9uKGlkVGFiZWxhLCBjYWxsYmFjaykge1xyXG5cdFx0TmV0d29ya1NlcnZpY2UuaHR0cEdldChgL2J1c2NhVGFiZWxhUG9ySWQvP2lkVGFiZWxhPSR7aWRUYWJlbGF9YCwgKHJlc3VsdCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBidXNjYXIgdGFiZWxhJywgZGF0YSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuZG93bmxvYWRBcnF1aXZvID0gZnVuY3Rpb24oaWRUYWJlbGEsIGNhbGxiYWNrKSB7XHJcblx0XHROZXR3b3JrU2VydmljZS5odHRwR2V0KGAvZG93bmxvYWRBcnF1aXZvVGFiZWxhP2lkVGFiZWxhPSR7aWRUYWJlbGF9YCwgKHJlc3VsdCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAocmVzdWx0ID09IENBTExSRVNVTFQuT0spIHtcclxuXHRcdFx0XHRjYWxsYmFjayhkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBDQUxMUkVTVUxULkVSUk9SKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignRXJybyBhbyBidXNjYXIgdGFiZWxhJywgZGF0YSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIHNlIGNvbXVuaWNhciBjb20gbyBzZXJ2aWRvci4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcdFx0XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2VydmljZTtcclxufV0pOyIsIid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIFVzdWFyaW9Nb2R1bG8gPSBhbmd1bGFyLm1vZHVsZSgndXN1YXJpby5tb2R1bGUnKVxyXG5cclxuVXN1YXJpb01vZHVsby5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xyXG4gIHZhciB1c3VhcmlvID0ge1xyXG4gICAgICBuYW1lOiAnbWFpbi51c3VhcmlvJyxcclxuICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgIHVybDonL3VzdWFyaW8nLFxyXG4gIH1cclxuICB2YXIgcGVzcXVpc2FVc3VhcmlvU3RhdGUgPSB7XHJcbiAgICBuYW1lOidtYWluLnVzdWFyaW8ucGVzcXVpc2EnLFxyXG4gICAgdXJsOiAnL3Blc3F1aXNhJyxcclxuICAgIGNvbXBvbmVudDogJ3Blc3F1aXNhVXN1YXJpb0NvbXBvbmVudCdcclxuICB9IFxyXG4gIHZhciBjYWRhc3Ryb1VzdWFyaW9TdGF0ZSA9IHtcclxuICAgIG5hbWU6J21haW4udXN1YXJpby5jYWRhc3RybycsXHJcbiAgICB1cmw6ICcvY2FkYXN0cm8nLFxyXG4gICAgY29tcG9uZW50OiAnY2FkYXN0cm9Vc3VhcmlvQ29tcG9uZW50J1xyXG4gIH1cclxuICB2YXIgZWRpY2FvVXN1YXJpb1N0YXRlID0ge1xyXG4gICAgbmFtZTonbWFpbi51c3VhcmlvLmVkaWNhbycsXHJcbiAgICB1cmw6ICcvZWRpY2FvLzppZCcsXHJcbiAgICBjb21wb25lbnQ6J2NhZGFzdHJvVXN1YXJpb0NvbXBvbmVudCcsXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIHVzdWFyaW9QYXJhRWRpdGFyOiAoVXN1YXJpb1NlcnZpY2UsICRzdGF0ZVBhcmFtcywgJHEpID0+IHtcclxuICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgLy9lZmV0dWFyIGJ1c2NhIHBlbG8gdXN1w6FyaW9cclxuICAgICAgICBpZigkc3RhdGVQYXJhbXMuaWQpIHtcclxuICAgICAgICAgIFVzdWFyaW9TZXJ2aWNlLmJ1c2NhVXN1YXJpb1BvcklkKCRzdGF0ZVBhcmFtcy5pZCkudGhlbih1c3VhcmlvRHRvID0+IHtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh1c3VhcmlvRHRvKTtcclxuICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRlZmVycmVkLnJlamVjdChudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgLy92ZXJpZmljYXIgc2UgaMOhIHBlcm1pc3PDo29cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSh1c3VhcmlvKVxyXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHBlc3F1aXNhVXN1YXJpb1N0YXRlKVxyXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGNhZGFzdHJvVXN1YXJpb1N0YXRlKVxyXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGVkaWNhb1VzdWFyaW9TdGF0ZSlcclxufSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuYW5ndWxhci5tb2R1bGUoJ3VzdWFyaW8ubW9kdWxlJywgWyd1aS5yb3V0ZXInLCAndWkuYm9vdHN0cmFwLnRhYnMnLCAndWkuc2VsZWN0JywgJ3VpLm1hc2snLCAndWkuYm9vdHN0cmFwLnBhZ2luYXRpb24nLCAnbmdTYW5pdGl6ZSddKTtcclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgVXN1YXJpb01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd1c3VhcmlvLm1vZHVsZScpXHJcblxyXG5Vc3VhcmlvTW9kdWxlLmZhY3RvcnkoJ1VzdWFyaW9TZXJ2aWNlJywgWydIdHRwU2VydmljZScsXHJcbiAgZnVuY3Rpb24gKEh0dHBTZXJ2aWNlKSB7XHJcbiAgICB2YXIgc2VydmljZSA9IHt9XHJcblxyXG4gICAgY29uc3QgU1VCUEFUSCA9ICdzZXJ2aWNlL3VzdWFyaW8nXHJcblxyXG4gICAgc2VydmljZS5wZXNxdWlzYSA9IChmaWx0ZXIpID0+IHtcclxuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBQb3N0KFNVQlBBVEggKyAnL2dldFVzdWFyaW9zQnlGaWx0ZXInLCBmaWx0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlcnZpY2UubGlzdGFQZXJmaWwgPSAoKSA9PiB7XHJcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwR2V0KFNVQlBBVEggKyAnL2dldExpc3RhUGVyZmlsJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VydmljZS5zYWx2YVVzdWFyaW8gPSAodXN1YXJpb0R0bykgPT4ge1xyXG4gICAgICByZXR1cm4gSHR0cFNlcnZpY2UuaHR0cFBvc3QoU1VCUEFUSCArICcvc2FsdmFVc3VhcmlvJywgdXN1YXJpb0R0byk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VydmljZS5idXNjYVVzdWFyaW9Qb3JJZCA9IChpZFVzdWFyaW8pID0+IHtcclxuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBHZXQoU1VCUEFUSCArICcvYnVzY2FVc3VhcmlvUG9ySWQnLCB7ICdpZFVzdWFyaW8nOiBpZFVzdWFyaW8gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VydmljZS5idXNjYVVzdWFyaW9Qb3JMb2dpbiA9IChsb2dpbikgPT4ge1xyXG4gICAgICByZXR1cm4gSHR0cFNlcnZpY2UuaHR0cFBvc3QoU1VCUEFUSCArICcvYnVzY2FVc3VhcmlvUG9yTG9naW4nLCBsb2dpbik7XHJcbiAgICB9XHJcblxyXG4gICAgc2VydmljZS52ZXJpZmljYXJJbXBvcnRhY2FvQmFzZVVzdWFyaW8gPSAoaW1wb3J0YWNhb1VzdWFyaW9EdG8pID0+IHtcclxuICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBQb3N0KFNVQlBBVEggKyAnL3ZlcmlmaWNhckltcG9ydGFjYW9CYXNlVXN1YXJpbycsIGltcG9ydGFjYW9Vc3VhcmlvRHRvKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXJ2aWNlLmJ1c2NhVXN1YXJpb0NhZGFzdHJvRHRvID0gKGlkVXN1YXJpbykgPT4ge1xyXG4gICAgICByZXR1cm4gSHR0cFNlcnZpY2UuaHR0cEdldChTVUJQQVRIICsgJy9idXNjYVJlcHJlc2VudGFjb2VzUG9ySWRVc3VhcmlvJywgeyAnaWRVc3VhcmlvJzogaWRVc3VhcmlvIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNlcnZpY2UuaW1wb3J0YXJCYXNlVXN1YXJpbyA9IChpbXBvcnRhY2FvVXN1YXJpb0R0bykgPT4ge1xyXG4gICAgICByZXR1cm4gSHR0cFNlcnZpY2UuaHR0cFBvc3QoU1VCUEFUSCArICcvaW1wb3J0YXJCYXNlVXN1YXJpbycsIGltcG9ydGFjYW9Vc3VhcmlvRHRvKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXJ2aWNlLmJ1c2NhVXN1YXJpb3MgPSAoKSA9PiB7XHJcbiAgICAgIHJldHVybiBIdHRwU2VydmljZS5odHRwR2V0KFNVQlBBVEggKyAnL2J1c2NhVXN1YXJpb3MnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuICB9XHJcbl0pIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ0dlcmVuY2lhZG9yRmluYW5jZWlyb0ZsZWNoYVZlbmRhcycpXHJcblxyXG5hcHAuY29tcG9uZW50KCdsb2dpbkNvbXBvbmVudCcsIHtcclxuXHRjb250cm9sbGVyOiBmdW5jdGlvbiBsb2dpbkNvbnRyb2xsZXIoJHN0YXRlLCBMb2dpblNlcnZpY2UpIHtcclxuICAgIGxldCB2bSA9IHRoaXM7XHJcbiAgICB2bS5kb0xvZ2luID0gKCkgPT4ge1xyXG4gICAgICBMb2dpblNlcnZpY2UuZG9Mb2dpbih2bS5sb2dpbiwgdm0uc2VuaGEpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAkc3RhdGUuZ28oJ21haW4uZGFzaGJvYXJkJylcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG4gIHRlbXBsYXRlVXJsOiAnbW9kdWxlcy9hcHAvY29tcG9uZW50cy9sb2dpbi9sb2dpbi5odG1sJyxcclxuXHRiaW5kaW5nczoge30sXHJcblx0Y29udHJvbGxlckFzOiAnY3RybCcsXHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCdcclxuXHJcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnR2VyZW5jaWFkb3JGaW5hbmNlaXJvRmxlY2hhVmVuZGFzJyk7XHJcblxyXG5hcHAuZmFjdG9yeSgnTG9naW5TZXJ2aWNlJywgWyckaHR0cCcsICdIdHRwU2VydmljZScsIGNvbnN0cnVjdG9yXSk7XHJcblxyXG5mdW5jdGlvbiBjb25zdHJ1Y3RvcigkaHR0cCwgSHR0cFNlcnZpY2UpIHtcclxuXHR2YXIgc2VydmljZSA9IHt9O1xyXG5cclxuXHRjb25zdCBTVUJQQVRIID0gJ3B1YmxpYy9hdXRoZW50aWNhdGlvbi8nXHJcblxyXG5cdHNlcnZpY2UuZG9Mb2dpbiA9IChfbG9naW4sIF9zZW5oYSkgPT4ge1xyXG5cdFx0Y29uc3QgcGFzc3dvcmQgPSBidG9hKF9zZW5oYSk7XHJcblx0XHRjb25zdCBfbG9naW5QYXJhbSA9IHtcclxuXHRcdFx0bG9naW46IF9sb2dpbixcclxuXHRcdFx0c2VuaGE6IHBhc3N3b3JkXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBQb3N0KFNVQlBBVEggKyAnZG9Mb2dpbicsIF9sb2dpblBhcmFtKVxyXG5cdFx0XHQudGhlbigodXN1YXJpb0R0bykgPT4ge1xyXG5cdFx0XHRcdHNldExvZ2luKHVzdWFyaW9EdG8pO1xyXG5cdFx0XHR9KVxyXG5cdH1cclxuXHJcblx0c2VydmljZS5kb0xvZ29mZiA9ICgpID0+IHtcclxuXHRcdGNsZWFyTG9naW4oKTtcclxuXHR9XHJcblxyXG5cdHNlcnZpY2UuZ2V0VXN1YXJpbyA9ICgpID0+IHtcclxuXHRcdHJldHVybiBnZXRMb2dpbigpO1xyXG5cdH1cclxuXHJcblx0c2VydmljZS5kZWNvZGVQYXNzd29yZCA9IGZ1bmN0aW9uKGF1dGhkYXRhKSB7XHJcblx0XHRyZXR1cm4gYnRvYShhdXRoZGF0YSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRMb2dpbih1c3VhcmlvRHRvKSB7XHJcblx0XHQkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vbi5zZXNzaW9udG9rZW4gPSB1c3VhcmlvRHRvLmhhc2g7XHJcblx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdsb2dpbicsIGFuZ3VsYXIudG9Kc29uKHVzdWFyaW9EdG8pKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExvZ2luKCkge1xyXG5cdFx0cmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24oc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnbG9naW4nKSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjbGVhckxvZ2luKCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ2NsZWFuJylcclxuXHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2xvZ2luJywgbnVsbCk7XHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdHNlcnZpY2UuQ2xlYXJDcmVkZW50aWFscyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JHJvb3RTY29wZS5nbG9iYWxzID0ge307XHJcblx0XHRpZighU3RvcmFnZVNlcnZpY2UuZ2V0UGFzc3dvcmRSZW1lbWJlcigpKSB7XHJcblx0XHRcdFN0b3JhZ2VTZXJ2aWNlLmNsZWFyVXN1YXJpb0xvZ2FkbygpO1x0XHJcblx0XHR9XHJcblx0XHQkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vbi5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICc7XHJcblx0XHRzZXJ2aWNlLnVzdWFyaW8gPSB1bmRlZmluZWRcclxuXHR9O1xyXG5cclxuXHJcblx0c2VydmljZS5TZXRDcmVkZW50aWFscyA9IGZ1bmN0aW9uKHNlbmhhLCByZW1lbWJlciwgdXN1YXJpbykge1xyXG5cdFx0dmFyIGF1dGhkYXRhID0gQmFzZTY0LmVuY29kZShzZW5oYSlcclxuXHRcdFN0b3JhZ2VTZXJ2aWNlLnJlc2V0RmlsdHJvQXRpdm8oKVxyXG5cdFx0U3RvcmFnZVNlcnZpY2UucmVzZXRGaWx0cm9QZWRpZG9BdGl2bygpXHJcblx0XHRzZXJ2aWNlLnVzdWFyaW8gPSB1c3VhcmlvO1xyXG5cclxuXHRcdCRyb290U2NvcGUuZ2xvYmFscyA9IHtcclxuXHRcdFx0Y3VycmVudFVzZXI6IHtcclxuXHRcdFx0XHRhdXRoZGF0YTogYXV0aGRhdGEsXHJcblx0XHRcdFx0dXNlciA6IHVzdWFyaW9cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQXV0aG9yaXphdGlvbiddID0gJ0Jhc2ljICcgKyBhdXRoZGF0YTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcblx0XHR2YXIgZGF0YUZpbmFsID0gbmV3IERhdGUoKTtcclxuXHRcdGRhdGFGaW5hbC5zZXREYXRlKGRhdGFGaW5hbC5nZXREYXRlKCkgKyAzMCk7XHJcblx0XHRcclxuXHRcdGlmKHJlbWVtYmVyKSB7XHJcblx0XHRcdFN0b3JhZ2VTZXJ2aWNlLnNldFBhc3N3b3JkUmVtZW1iZXIodHJ1ZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRTdG9yYWdlU2VydmljZS5zZXRQYXNzd29yZFJlbWVtYmVyKGZhbHNlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0U3RvcmFnZVNlcnZpY2Uuc2V0VXN1YXJpb0xvZ2FkbyhhdXRoZGF0YSwgdXN1YXJpbyk7XHJcblx0fTtcclxuXHRcclxuXHRzZXJ2aWNlLmdldFVzdWFyaW8gPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBzZXJ2aWNlLnVzdWFyaW87XHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2Uuc2V0VXN1YXJpbyA9IGZ1bmN0aW9uKHVzdWFyaW8pIHtcclxuXHRcdHJldHVybiBzZXJ2aWNlLnVzdWFyaW8gPSB1c3VhcmlvO1xyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLmlzQWRtaW5pc3RyYWRvciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYoIXNlcnZpY2UudXN1YXJpbykge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHRcdGlmKHNlcnZpY2UudXN1YXJpby5wZXJmaWwuaWQgPT09IDIpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2UuaXNNYXN0ZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmKCFzZXJ2aWNlLnVzdWFyaW8pIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblx0XHRpZihzZXJ2aWNlLnVzdWFyaW8ucGVyZmlsLmlkID09PSAyKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLmlzVmVuZGVkb3IgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmKCFzZXJ2aWNlLnVzdWFyaW8pIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblx0XHRpZihzZXJ2aWNlLnVzdWFyaW8ucGVyZmlsLmlkID09PSAxKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLmdldFBhc3N3b3JkUmVtZW1iZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBTdG9yYWdlU2VydmljZS5nZXRQYXNzd29yZFJlbWVtYmVyKCk7XHJcblx0fVxyXG5cdFxyXG5cdHNlcnZpY2UuZ2V0Q3JlZGVudGlhbHNSZW1lbWJlciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIFN0b3JhZ2VTZXJ2aWNlLmdldFVzdWFyaW9Mb2dhZG8oKTtcclxuXHR9XHJcblx0XHJcblx0c2VydmljZS5nZXRQYXNzd29yZEVuY29kZWQgPSBmdW5jdGlvbihwYXNzd29yZCkge1xyXG5cdFx0cmV0dXJuIEJhc2U2NC5lbmNvZGUocGFzc3dvcmQpO1xyXG5cdH1cclxuXHRcclxuXHRzZXJ2aWNlLmdldE5vbWVVc3VhcmlvID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZihzZXJ2aWNlLnVzdWFyaW8pIHtcclxuXHRcdFx0cmV0dXJuIHNlcnZpY2UudXN1YXJpby5ub21lXHRcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdFwiXCJcclxuXHRcdH1cclxuXHR9XHJcblx0Ki9cclxuXHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ0dlcmVuY2lhZG9yRmluYW5jZWlyb0ZsZWNoYVZlbmRhcycpXHJcblxyXG5hcHAuY29tcG9uZW50KCdkYXNoYm9hcmRDb21wb25lbnQnLCB7XHJcblx0Y29udHJvbGxlcjogZnVuY3Rpb24gZGFzaGJvYXJkQ29udHJvbGxlcigkbG9nKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gIH0sXHJcbiAgYmluZGluZ3M6IHtcclxuICAgIGluZm9ybWFjb2VzOiAnPCdcclxuICB9LFxyXG4gIHRlbXBsYXRlVXJsOiAnbW9kdWxlcy9hcHAvY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLmh0bWwnLFxyXG5cdGNvbnRyb2xsZXJBczogJ2N0cmwnLFxyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ0dlcmVuY2lhZG9yRmluYW5jZWlyb0ZsZWNoYVZlbmRhcycpO1xyXG5cclxuYXBwLmZhY3RvcnkoJ0Rhc2hib2FyZFNlcnZpY2UnLCBbJ0h0dHBTZXJ2aWNlJywgY29uc3RydWN0b3JdKTtcclxuXHJcbmZ1bmN0aW9uIGNvbnN0cnVjdG9yIChIdHRwU2VydmljZSkge1xyXG5cdFx0dmFyIHNlcnZpY2UgPSB7fTtcclxuXHJcblx0XHRjb25zdCBTVUJQQVRIID0gJ3NlcnZpY2UvZGFzaGJvYXJkLydcclxuXHJcblx0XHRzZXJ2aWNlLmdldEluZm9ybWFjb2VzRGFzaGJvYXJkRHRvID0gKGlkVXN1YXJpbykgPT4ge1xyXG5cdFx0XHRyZXR1cm4gSHR0cFNlcnZpY2UuaHR0cEdldChTVUJQQVRIICsgJ2luZm9ybWFjb2VzJywgeydpZFVzdWFyaW8nOiBpZFVzdWFyaW99KVxyXG5cdFx0XHRcdC50aGVuKChpbmZvcm1hY29lcykgPT4ge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGluZm9ybWFjb2VzLmRhdGE7XHJcblx0XHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gc2VydmljZTtcclxuXHR9XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdHZXJlbmNpYWRvckZpbmFuY2Vpcm9GbGVjaGFWZW5kYXMnKVxyXG5cclxuYXBwLmNvbXBvbmVudCgnbWFpbkNvbXBvbmVudCcsIHtcclxuICBjb250cm9sbGVyOiBmdW5jdGlvbiBtYWluQ29udHJvbGxlcihMb2dpblNlcnZpY2UpIHtcclxuICAgIHRoaXMuJG9uSW5pdCA9IGluaXQoKTtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5ub21lVXN1YXJpbyA9IHZtLmF1dGgubm9tZTtcclxuXHJcbiAgICB2bS5sb2dvZmYgPSAoKSA9PiB7XHJcbiAgICAgIExvZ2luU2VydmljZS5kb0xvZ29mZigpXHJcbiAgICB9XHJcblxyXG4gIH0sXHJcbiAgdGVtcGxhdGVVcmw6ICdtb2R1bGVzL2FwcC9jb21wb25lbnRzL21haW4vbWFpbi5odG1sJyxcclxuICBiaW5kaW5nczoge1xyXG4gICAgYXV0aDogJzwnXHJcbiAgfSxcclxuICBjb250cm9sbGVyQXM6ICdjdHJsJyxcclxufSk7XHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG4gICQoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGFjY29yZGlvbkFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgdmFyICR0b3BNZW51ID0gJCgnI3RvcC1tZW51Jyk7XHJcbiAgICAgIHZhciAkc2lkZU1lbnUgPSAkKCcjc2lkZS1tZW51Jyk7XHJcblxyXG4gICAgICBpZiAod2luZG93V2lkdGggPCA3NjgpIHtcclxuICAgICAgICBpZiAoJHRvcE1lbnUuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuICAgICAgICAgICR0b3BNZW51LnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgJHNpZGVNZW51LmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cclxuICAgICAgICAgIHZhciAkZGRsID0gJCgnI3RvcC1tZW51IC5tb3ZhYmxlLmRyb3Bkb3duJyk7XHJcbiAgICAgICAgICAkZGRsLmRldGFjaCgpO1xyXG4gICAgICAgICAgJGRkbC5yZW1vdmVDbGFzcygnZHJvcGRvd24nKTtcclxuICAgICAgICAgICRkZGwuYWRkQ2xhc3MoJ25hdi1oZWFkZXInKTtcclxuXHJcbiAgICAgICAgICAkZGRsLmZpbmQoJy5kcm9wZG93bi10b2dnbGUnKS5yZW1vdmVDbGFzcygnZHJvcGRvd24tdG9nZ2xlJykuYWRkQ2xhc3MoJ2xpbmsnKTtcclxuICAgICAgICAgICRkZGwuZmluZCgnLmRyb3Bkb3duLW1lbnUnKS5yZW1vdmVDbGFzcygnZHJvcGRvd24tbWVudScpLmFkZENsYXNzKCdzdWJtZW51Jyk7XHJcblxyXG4gICAgICAgICAgJGRkbC5wcmVwZW5kVG8oJHNpZGVNZW51LmZpbmQoJy5hY2NvcmRpb24nKSk7XHJcbiAgICAgICAgICAkKCcjdG9wLW1lbnUgI3Fmb3JtJykuZGV0YWNoKCkucmVtb3ZlQ2xhc3MoJ25hdmJhci1mb3JtJykucHJlcGVuZFRvKCRzaWRlTWVudSk7XHJcblxyXG4gICAgICAgICAgaWYgKCFhY2NvcmRpb25BY3RpdmUpIHtcclxuICAgICAgICAgICAgdmFyIEFjY29yZGlvbjIgPSBmdW5jdGlvbiAoZWwsIG11bHRpcGxlKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5lbCA9IGVsIHx8IHt9O1xyXG4gICAgICAgICAgICAgIHRoaXMubXVsdGlwbGUgPSBtdWx0aXBsZSB8fCBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gVmFyaWFibGVzIHByaXZhZGFzXHJcbiAgICAgICAgICAgICAgdmFyIGxpbmtzID0gdGhpcy5lbC5maW5kKCcubW92YWJsZSAubGluaycpO1xyXG4gICAgICAgICAgICAgIC8vIEV2ZW50b1xyXG4gICAgICAgICAgICAgIGxpbmtzLm9uKCdjbGljaycsIHsgZWw6IHRoaXMuZWwsIG11bHRpcGxlOiB0aGlzLm11bHRpcGxlIH0sIHRoaXMuZHJvcGRvd24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBBY2NvcmRpb24yLnByb3RvdHlwZS5kcm9wZG93biA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgdmFyICRlbCA9IGUuZGF0YS5lbDtcclxuICAgICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAkbmV4dCA9ICR0aGlzLm5leHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgJG5leHQuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgICAgICAgICAkdGhpcy5wYXJlbnQoKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoIWUuZGF0YS5tdWx0aXBsZSkge1xyXG4gICAgICAgICAgICAgICAgJGVsLmZpbmQoJy5tb3ZhYmxlIC5zdWJtZW51Jykubm90KCRuZXh0KS5zbGlkZVVwKCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgYWNjb3JkaW9uID0gbmV3IEFjY29yZGlvbjIoJCgndWwuYWNjb3JkaW9uJyksIGZhbHNlKTtcclxuICAgICAgICAgICAgYWNjb3JkaW9uQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKCRzaWRlTWVudS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG4gICAgICAgICAgJHNpZGVNZW51LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICR0b3BNZW51LmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICB2YXIgJGRkbCA9ICQoJyNzaWRlLW1lbnUgLm1vdmFibGUubmF2LWhlYWRlcicpO1xyXG4gICAgICAgICAgJGRkbC5kZXRhY2goKTtcclxuICAgICAgICAgICRkZGwucmVtb3ZlQ2xhc3MoJ25hdi1oZWFkZXInKTtcclxuICAgICAgICAgICRkZGwuYWRkQ2xhc3MoJ2Ryb3Bkb3duJyk7XHJcblxyXG4gICAgICAgICAgJGRkbC5maW5kKCcubGluaycpLnJlbW92ZUNsYXNzKCdsaW5rJykuYWRkQ2xhc3MoJ2Ryb3Bkb3duLXRvZ2dsZScpO1xyXG4gICAgICAgICAgJGRkbC5maW5kKCcuc3VibWVudScpLnJlbW92ZUNsYXNzKCdzdWJtZW51JykuYWRkQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKTtcclxuXHJcbiAgICAgICAgICAkKCcjc2lkZS1tZW51ICNxZm9ybScpLmRldGFjaCgpLmFkZENsYXNzKCduYXZiYXItZm9ybScpLmFwcGVuZFRvKCR0b3BNZW51LmZpbmQoJy5uYXYnKSk7XHJcbiAgICAgICAgICAkZGRsLmFwcGVuZFRvKCR0b3BNZW51LmZpbmQoJy5uYXYnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKiovXHJcbiAgICB2YXIgJG1lbnVsaW5rID0gJCgnLnNpZGUtbWVudS1saW5rJyksXHJcbiAgICAgICR3cmFwID0gJCgnLndyYXAnKTtcclxuXHJcbiAgICAkbWVudWxpbmsuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAkbWVudWxpbmsudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAkd3JhcC50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIuc3VibWVudVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRtZW51bGluay50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICR3cmFwLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKkFjY29yZGlvbiovXHJcbiAgICB2YXIgQWNjb3JkaW9uID0gZnVuY3Rpb24gKGVsLCBtdWx0aXBsZSkge1xyXG4gICAgICB0aGlzLmVsID0gZWwgfHwge307XHJcbiAgICAgIHRoaXMubXVsdGlwbGUgPSBtdWx0aXBsZSB8fCBmYWxzZTtcclxuXHJcbiAgICAgIC8vIFZhcmlhYmxlcyBwcml2YWRhc1xyXG4gICAgICB2YXIgbGlua3MgPSB0aGlzLmVsLmZpbmQoJy5saW5rJyk7XHJcbiAgICAgIC8vIEV2ZW50b1xyXG4gICAgICBsaW5rcy5vbignY2xpY2snLCB7IGVsOiB0aGlzLmVsLCBtdWx0aXBsZTogdGhpcy5tdWx0aXBsZSB9LCB0aGlzLmRyb3Bkb3duKTtcclxuICAgIH1cclxuXHJcbiAgICBBY2NvcmRpb24ucHJvdG90eXBlLmRyb3Bkb3duID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyICRlbCA9IGUuZGF0YS5lbDtcclxuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgdmFyICRuZXh0ID0gJHRoaXMubmV4dCgpO1xyXG5cclxuICAgICAgJG5leHQuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgJHRoaXMucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICAgIGlmICghZS5kYXRhLm11bHRpcGxlKSB7XHJcbiAgICAgICAgJGVsLmZpbmQoJy5zdWJtZW51Jykubm90KCRuZXh0KS5zbGlkZVVwKCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYWNjb3JkaW9uID0gbmV3IEFjY29yZGlvbigkKCd1bC5hY2NvcmRpb24nKSwgZmFsc2UpO1xyXG5cclxuXHJcbiAgfSk7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ0dlcmVuY2lhZG9yRmluYW5jZWlyb0ZsZWNoYVZlbmRhcycpXHJcblxyXG5hcHAuZGlyZWN0aXZlKCdyZXN0cmljdCcsIGZ1bmN0aW9uIChMb2dpblNlcnZpY2UpIHtcclxuICByZXR1cm4ge1xyXG4gICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgIHByaW9yaXJ5OiAxMDAwMDAsXHJcbiAgICBzY29wZTogZmFsc2UsXHJcbiAgICBsaW5rOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB9LFxyXG4gICAgY29tcGlsZTogZnVuY3Rpb24gKGVsZW1lbnQsIGF0dHIpIHtcclxuICAgICAgdmFyIGFjY2Vzc0RlbmllZCA9IHRydWU7XHJcbiAgICAgIHZhciB1c2VyID0gTG9naW5TZXJ2aWNlLmdldFVzdWFyaW8oKTtcclxuXHJcbiAgICAgIHZhciBhdHRyaWJ1dGVzID0gYXR0ci5hY2Nlc3Muc3BsaXQoXCIgXCIpO1xyXG4gICAgICBmb3IgKHZhciBpIGluIGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICBpZiAodXNlci5wZXJmaWwubm9tZSA9PT0gYXR0cmlidXRlc1tpXSkge1xyXG4gICAgICAgICAgYWNjZXNzRGVuaWVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChhY2Nlc3NEZW5pZWQpIHtcclxuICAgICAgICBlbGVtZW50LmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsaWVudGVNb2R1bG8gPSBhbmd1bGFyLm1vZHVsZSgnY2xpZW50ZS5tb2R1bGUnKTtcblxuQ2xpZW50ZU1vZHVsby5jb21wb25lbnQoJ2NhZGFzdHJvQ2xpZW50ZUNvbXBvbmVudCcsIHtcbiAgdGVtcGxhdGVVcmw6ICdtb2R1bGVzL2NsaWVudGUvY29tcG9uZW50cy9jYWRhc3Ryby92aWV3cy9jYWRhc3Ryb0NsaWVudGUuaHRtbCcsXG4gIGJpbmRpbmdzOiB7XG4gICAgY2xpZW50ZTogJzwnLFxuICAgIGxpc3RhSW5kdXN0cmlhQ2xpZW50ZTogJzwnXG4gIH0sXG4gIGNvbnRyb2xsZXJBczogJ2N0cmwnLFxuICAvKlxuICAkc2NvcGUsXG5cdFx0XHRcdCRyb290U2NvcGUsXG5cdFx0XHRcdCRsb2NhdGlvbixcblx0XHRcdFx0JHNjZSxcblx0XHRcdFx0JHJvdXRlLFxuXHRcdFx0XHQkd2luZG93LFxuXHRcdFx0XHRzZXJ2aWNlLFxuXHRcdFx0XHRDbGllbnRlc0NhZGFzdHJhZG9zU2VydmljZSxcblx0XHRcdFx0SW5kdXN0cmlhc1NlcnZpY2UsXG5cdFx0XHRcdEF1dGhlbnRpY2F0aW9uU2VydmljZSxcblx0XHRcdFx0YmxvY2tVSSxcblx0XHRcdFx0TW9kYWxTZXJ2aWNlLFxuXHRcdFx0XHRJbmR1c3RyaWFDbGllbnRlUHJhem9TZXJ2aWNlLFxuXHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlXG4gICovXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChOb3RpZmljYXRpb25TZXJ2aWNlLCBNb2RhbFNlcnZpY2UsIENsaWVudGVTZXJ2aWNlKSB7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gX2Jhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0KSB7XG4gICAgICB2YXIgYmluYXJ5X3N0cmluZyA9ICR3aW5kb3cuYXRvYihiYXNlNjQpO1xuICAgICAgdmFyIGxlbiA9IGJpbmFyeV9zdHJpbmcubGVuZ3RoO1xuICAgICAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkobGVuKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlfc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYnl0ZXMuYnVmZmVyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGI2NHRvQmxvYihiNjREYXRhLCBjb250ZW50VHlwZSkge1xuICAgICAgcmV0dXJuIG5ldyBCbG9iKFtfYmFzZTY0VG9BcnJheUJ1ZmZlcihiNjREYXRhKV0sIHsgdHlwZTogY29udGVudFR5cGUgfSk7XG4gICAgfVxuXG4gICAgY3RybC5kb3dubG9hZEFycXVpdm8gPSAobm9tZUFycXVpdm8pID0+IHtcbiAgICAgIHNlcnZpY2UuZG93bmxvYWRBcnF1aXZvKGN0cmwuY2xpZW50ZS5jcGZDbnBqLCBub21lQXJxdWl2bywgKGRhdGEpID0+IHtcbiAgICAgICAgbGV0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgYS5zdHlsZSA9IFwiZGlzcGxheTogbm9uZVwiO1xuICAgICAgICB2YXIgYmxvYiA9IGI2NHRvQmxvYihkYXRhLCAnaW1hZ2UvanBnJyk7XG4gICAgICAgIGxldCB1cmwgPSAkd2luZG93LndlYmtpdFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICAgIGEuaHJlZiA9IHVybDtcbiAgICAgICAgYS5kb3dubG9hZCA9IG5vbWVBcnF1aXZvO1xuICAgICAgICBhLmNsaWNrKCk7XG4gICAgICAgICR3aW5kb3cud2Via2l0VVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBjdHJsLmxpc3RhTm9tZUJhbmNvcyA9IHNlcnZpY2UuYnVzY2FOb21lc0JhbmNvcygpO1xuICAgIGlmIChjdHJsLmNsaWVudGUubm9tZUJhbmNvICE9IG51bGwpIHtcbiAgICAgIGN0cmwuYmFuY28ubm9tZSA9IGN0cmwuY2xpZW50ZS5ub21lQmFuY287XG4gICAgfVxuXG4gICAgc2VydmljZS5nZXRSZXByZXNlbnRhY29lc1VzdWFyaW8odXN1YXJpby5pZCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBjdHJsLmxpc3RhUmVwcmVzZW50YWNvZXMgPSByZXNwb25zZTtcbiAgICB9KTtcblxuICAgIHNlcnZpY2UuYnVzY2FWZW5kZWRvcmVzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgY3RybC52ZW5kZWRvcmVzID0gcmVzcG9uc2U7XG4gICAgfSk7XG5cbiAgICBzZXJ2aWNlLmJ1c2NhTGlzdGFUaXBvUGVzc29hKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgY3RybC5saXN0YVRpcG9QZXNzb2EgPSByZXNwb25zZTtcbiAgICAgIGlmIChjdHJsLmNsaWVudGUuaWRQZXNzb2EgIT0gbnVsbCkge1xuICAgICAgICBjdHJsLmxpc3RhVGlwb1Blc3NvYS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICAgIGlmIChpdGVtLmlkID09IGN0cmwuY2xpZW50ZS5pZFBlc3NvYSkge1xuICAgICAgICAgICAgY3RybC50aXBvUGVzc29hLnNlbGVjaW9uYWRvID0gaXRlbTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3RybC50aXBvUGVzc29hLnNlbGVjaW9uYWRvID0gY3RybC5saXN0YVRpcG9QZXNzb2FbMV07XG4gICAgICB9XG5cbiAgICB9KTtcblxuICAgIGN0cmwudmVyaWZpY2FDbGllbnRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgY3BmQ25waiA9IGN0cmwuY2xpZW50ZS5jcGZDbnBqXG4gICAgICBpZiAoIWNwZkNucGopIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBDbGllbnRlc0NhZGFzdHJhZG9zU2VydmljZS5nZXRDbGllbnRlRXhpc3RlbnRlKGNwZkNucGosIChyZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAoQXV0aGVudGljYXRpb25TZXJ2aWNlLmlzVmVuZGVkb3IoKSAmJiAhY3RybC5jbGllbnRlLmlkKSB7XG4gICAgICAgICAgICBOb3RpZmljYXRpb25TZXJ2aWNlLmFsZXJ0KCdDbGllbnRlIGrDoSBjYWRhc3RyYWRvISBFbnRyZSBlbSBjb250YXRvIGNvbSBhIGFkbWluaXN0cmHDp8Ojby4nKVxuICAgICAgICAgICAgY3RybC5uYW9FZGl0YXZlbCA9IHRydWVcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFjdHJsLmNsaWVudGUuaWQpIHtcbiAgICAgICAgICAgICAgZXhpYmVNb2RhbENvbmZpcm1hY2FvQ2xpZW50ZShyZXNwb25zZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3RybC5uYW9FZGl0YXZlbCA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY3RybC5zZWxlY2lvbmFJbmR1c3RyaWEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW5kdXN0cmlhID0gY3RybC5pbmR1c3RyaWEuc2VsZWNpb25hZG8uaW5kdXN0cmlhO1xuICAgICAgdmFyIGxpc3RhRW5jb250cmFkb3MgPSAkLmdyZXAoY3RybC5saXN0YUluZHVzdHJpYUNsaWVudGUsIGZ1bmN0aW9uIChlLCBpKSB7XG4gICAgICAgIHJldHVybiBlLmlkSW5kdXN0cmlhID09IGluZHVzdHJpYS5pZDtcbiAgICAgIH0pO1xuICAgICAgY3RybC5pbmR1c3RyaWFQcmF6byA9IHtcbiAgICAgICAgc2VsZWNpb25hZG86IHVuZGVmaW5lZFxuICAgICAgfVxuICAgICAgY3RybC5pbmR1c3RyaWFDbGllbnRlUHJhem9QYWRyYW8gPSB7XG4gICAgICAgIHNlbGVjaW9uYWRvOiB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgaWYgKGxpc3RhRW5jb250cmFkb3MubGVuZ3RoID09IDApIHtcbiAgICAgICAgY3RybC5pbmR1c3RyaWFDbGllbnRlID0ge1xuICAgICAgICAgIGlkQ2xpZW50ZTogbnVsbCxcbiAgICAgICAgICBpZEluZHVzdHJpYTogaW5kdXN0cmlhLmlkLFxuICAgICAgICAgIGNvZGlnbzogbnVsbCxcbiAgICAgICAgICBsaW1pdGVDcmVkaXRvOiBudWxsLFxuICAgICAgICAgIGF0aXZvOiB0cnVlLFxuICAgICAgICAgIGJsb3F1ZWlvVmVuZGE6IGZhbHNlLFxuICAgICAgICAgIG5vbWVJbmR1c3RyaWE6IGluZHVzdHJpYS5ub21lLFxuICAgICAgICAgIHJlbW92aWRvOiBmYWxzZSxcbiAgICAgICAgICBsaXN0YUluZHVzdHJpYUNsaWVudGVQcmF6bzogW10sXG4gICAgICAgICAgbGlzdGFJbmR1c3RyaWFDbGllbnRlUHJhem9QYXJhUmVtb3ZlcjogW10sXG4gICAgICAgIH1cbiAgICAgICAgY3RybC5pbmR1c3RyaWFQcmF6byA9IHtcbiAgICAgICAgICBzZWxlY2lvbmFkbzogdW5kZWZpbmVkLFxuICAgICAgICB9XG4gICAgICAgIGN0cmwuaW5kdXN0cmlhQ2xpZW50ZVByYXpvUGFkcmFvID0ge1xuICAgICAgICAgIHNlbGVjaW9uYWRvOiB1bmRlZmluZWQsXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN0cmwuaW5kdXN0cmlhQ2xpZW50ZSA9IGxpc3RhRW5jb250cmFkb3NbMF07XG4gICAgICAgIEluZHVzdHJpYUNsaWVudGVQcmF6b1NlcnZpY2UuZ2V0SW5kdXN0cmlhQ2xpZW50ZVByYXpvUG9ySWRJbmR1c3RyaWFDbGllbnRlKGN0cmwuaW5kdXN0cmlhQ2xpZW50ZS5pZCwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGN0cmwuaW5kdXN0cmlhQ2xpZW50ZVByYXpvID0gcmVzdWx0XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGJ1c2NhUmVwcmVzZW50YWNvZXNJbmR1c3RyaWEoaW5kdXN0cmlhKVxuXG4gICAgICBnZXJhTGlzdGFQcmF6b3NFeGlzdGVudGVzKGluZHVzdHJpYSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleGliZU1vZGFsQ29uZmlybWFjYW9DbGllbnRlKHJlc3BvbnNlKSB7XG4gICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xuICAgICAgICBjbG9zZUJ1dHRvblRleHQ6ICdOw6NvJyxcbiAgICAgICAgYWN0aW9uQnV0dG9uVGV4dDogJ1NpbScsXG4gICAgICAgIGhlYWRlclRleHQ6ICdDb25maXJtYXInLFxuICAgICAgICBib2R5VGV4dDogJ08gY2xpZW50ZSBjb20gQ05QSiAnICsgcmVzcG9uc2UuY3BmQ25waiArICcgasOhIHBvc3N1aSBjYWRhc3RybyEgRGVzZWphIGNhcnJlZ2FyIHNldXMgZGFkb3M/J1xuICAgICAgfTtcbiAgICAgIE1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucykudGhlbigoKSA9PiB7XG4gICAgICAgIENsaWVudGVzQ2FkYXN0cmFkb3NTZXJ2aWNlLmNsaWVudGVQYXJhRWRpdGFyID0gcmVzcG9uc2VcbiAgICAgICAgJHJvdXRlLnJlbG9hZCgpO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJ1c2NhUmVwcmVzZW50YWNvZXNJbmR1c3RyaWEoaW5kdXN0cmlhKSB7XG4gICAgICBzZXJ2aWNlLmdldFJlcHJlc2VudGFjb2VzSW5kdXN0cmlhKGluZHVzdHJpYS5pZCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGN0cmwubGlzdGFSZXByZXNlbnRhY29lc1ZlbmRlZG9yID0gcmVzcG9uc2U7XG5cbiAgICAgICAgaWYgKEF1dGhlbnRpY2F0aW9uU2VydmljZS5pc1ZlbmRlZG9yKCkpIHtcbiAgICAgICAgICB2YXIgcmVwcmVzZW50YWNvZXMgPSAkLmdyZXAoY3RybC5saXN0YVJlcHJlc2VudGFjb2VzVmVuZGVkb3IsIGZ1bmN0aW9uIChlLCBpKSB7XG4gICAgICAgICAgICByZXR1cm4gZS51c3VhcmlvLmlkID09IHVzdWFyaW8uaWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHJlcHJlc2VudGFjb2VzICYmIHJlcHJlc2VudGFjb2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGN0cmwucmVwcmVzZW50YWNhb1ZlbmRlZG9yLnNlbGVjaW9uYWRvID0gcmVwcmVzZW50YWNvZXNbMF07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdHJsLnJlcHJlc2VudGFjYW9WZW5kZWRvci5zZWxlY2lvbmFkbykge1xuICAgICAgICAgICAgY3RybC5zZWxlY2lvbmFSZXByZXNlbnRhY2FvVmVuZGVkb3IoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VyYUxpc3RhUHJhem9zRXhpc3RlbnRlcyhpbmR1c3RyaWEpIHtcbiAgICAgIEluZHVzdHJpYXNTZXJ2aWNlLmdldFByYXpvc0luZHVzdHJpYShpbmR1c3RyaWEuaWQsIChyZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKGN0cmwuaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6byAhPT0gbnVsbCAmJiBjdHJsLmluZHVzdHJpYUNsaWVudGUubGlzdGFJbmR1c3RyaWFDbGllbnRlUHJhem8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIC8vR0VSQSBMSVNUQSBERSBQUkFaT1MgSkEgQURJQ0lPTkFET1MgTkEgSU5EVVNUUklBIFNFTEVDSU9OQURBXG4gICAgICAgICAgY3RybC5pbmR1c3RyaWFQcmF6by5zZWxlY2lvbmFkbyA9ICQuZ3JlcChyZXN1bHQsIChlUHJhem8pID0+IHtcbiAgICAgICAgICAgIGxldCBleGlzdHMgPSAkLmdyZXAoY3RybC5pbmR1c3RyaWFDbGllbnRlLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZVByYXpvLCAoZUluZHVzdHJpYUNsaWVudGVQcmF6bykgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZVByYXpvLmlkID09PSBlSW5kdXN0cmlhQ2xpZW50ZVByYXpvLmlkSW5kdXN0cmlhUHJhem9cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gZXhpc3RzLmxlbmd0aCAhPT0gMFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLy9CVVNDQSBJVEVNIFBBRFJBTyBTRUxFQ0lPTkFET1xuICAgICAgICAgIGlmIChjdHJsLmluZHVzdHJpYUNsaWVudGUubGlzdGFJbmR1c3RyaWFDbGllbnRlUHJhem8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IGV4aXN0cyA9ICQuZ3JlcChjdHJsLmluZHVzdHJpYUNsaWVudGUubGlzdGFJbmR1c3RyaWFDbGllbnRlUHJhem8sIChlSW5kdXN0cmlhQ2xpZW50ZVByYXpvKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBlSW5kdXN0cmlhQ2xpZW50ZVByYXpvLnBhZHJhbyA9PT0gdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChleGlzdHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBjdHJsLmluZHVzdHJpYUNsaWVudGVQcmF6b1BhZHJhby5zZWxlY2lvbmFkbyA9IGV4aXN0c1swXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjdHJsLnByYXpvc0luZHVzdHJpYSA9IHJlc3VsdFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjdHJsLnNlbGVjaW9uYVJlcHJlc2VudGFjYW9WZW5kZWRvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghY3RybC5saXN0YVJlcHJlc2VudGFjb2VzQ2xpZW50ZSkge1xuICAgICAgICBjdHJsLmxpc3RhUmVwcmVzZW50YWNvZXNDbGllbnRlID0gW107XG4gICAgICB9XG5cbiAgICAgIHZhciBsaXN0YUVuY29udHJhZG9zID0gJC5ncmVwKGN0cmwubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUsIGZ1bmN0aW9uIChlLCBpKSB7XG4gICAgICAgIHJldHVybiBlLmlkUmVwcmVzZW50YWNhbyA9PSBjdHJsLnJlcHJlc2VudGFjYW9WZW5kZWRvci5zZWxlY2lvbmFkby5pZDtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWxpc3RhRW5jb250cmFkb3MgfHwgbGlzdGFFbmNvbnRyYWRvcy5sZW5ndGggPT0gMCkge1xuICAgICAgICBjdHJsLnJlcHJlc2VudGFjYW9DbGllbnRlID0ge1xuICAgICAgICAgIGlkOiBjdHJsLnJlcHJlc2VudGFjYW9WZW5kZWRvci5zZWxlY2lvbmFkby5pZCxcbiAgICAgICAgICBpbmR1c3RyaWE6IHtcbiAgICAgICAgICAgIGlkOiBjdHJsLnJlcHJlc2VudGFjYW9WZW5kZWRvci5zZWxlY2lvbmFkby5pbmR1c3RyaWEuaWQsXG4gICAgICAgICAgICBub21lOiBjdHJsLnJlcHJlc2VudGFjYW9WZW5kZWRvci5zZWxlY2lvbmFkby5pbmR1c3RyaWEubm9tZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgdXN1YXJpbzoge1xuICAgICAgICAgICAgaWQ6IGN0cmwucmVwcmVzZW50YWNhb1ZlbmRlZG9yLnNlbGVjaW9uYWRvLnVzdWFyaW8uaWQsXG4gICAgICAgICAgICBub21lOiBjdHJsLnJlcHJlc2VudGFjYW9WZW5kZWRvci5zZWxlY2lvbmFkby51c3VhcmlvLm5vbWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN0cmwucmVwcmVzZW50YWNhb0NsaWVudGUgPSBsaXN0YUVuY29udHJhZG9zWzBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGN0cmwuYWx0ZXJhU2VsZWNhb0luZHVzdHJpYSA9IGZ1bmN0aW9uIChpbmR1c3RyaWEpIHtcbiAgICAgIGlmIChpbmR1c3RyaWEuc2VsZWNpb25hZG8pIHtcbiAgICAgICAgYWRpY2lvbmFJbmR1c3RyaWEoaW5kdXN0cmlhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbW92ZUluZHVzdHJpYShpbmR1c3RyaWEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNlcnZpY2UuYnVzY2FFc3RhZG9zKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgY3RybC5lc3RhZG9zID0gcmVzcG9uc2U7XG4gICAgICBpZiAoY3RybC5jbGllbnRlLmVzdGFkbyA9PSBudWxsKSB7XG4gICAgICAgIGN0cmwuZXN0YWRvcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICAgIGlmIChpdGVtLnNpZ2xhID09ICdSUycpIHtcbiAgICAgICAgICAgIGN0cmwuZXN0YWRvLnNlbGVjaW9uYWRvID0gaXRlbTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3RybC5lc3RhZG9zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgaWYgKGl0ZW0uc2lnbGEgPT0gY3RybC5jbGllbnRlLmVzdGFkby5zaWdsYSkge1xuICAgICAgICAgICAgY3RybC5lc3RhZG8uc2VsZWNpb25hZG8gPSBpdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjdHJsLnNhbHZhckNsaWVudGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYmFuY28gPSBjdHJsLmJhbmNvLm5vbWU7XG4gICAgICBjdHJsLmNsaWVudGUuaWRQZXNzb2EgPSBjdHJsLnRpcG9QZXNzb2Euc2VsZWNpb25hZG8uaWQ7XG4gICAgICBjdHJsLmNsaWVudGUubGlzdGFJbmR1c3RyaWFDbGllbnRlID0gY3RybC5saXN0YUluZHVzdHJpYUNsaWVudGU7XG4gICAgICBjdHJsLmNsaWVudGUubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUgPSBjdHJsLmxpc3RhUmVwcmVzZW50YWNvZXNDbGllbnRlO1xuICAgICAgY3RybC5jbGllbnRlLmVzdGFkbyA9IGN0cmwuZXN0YWRvLnNlbGVjaW9uYWRvO1xuICAgICAgY3RybC5jbGllbnRlLm5vbWVCYW5jbyA9IGN0cmwuYmFuY28ubm9tZTtcblxuICAgICAgaWYgKEF1dGhlbnRpY2F0aW9uU2VydmljZS5pc1ZlbmRlZG9yKCkpIHtcbiAgICAgICAgY3RybC5jbGllbnRlLnBlbmRlbnRlUmVnaXN0cm8gPSB0cnVlXG4gICAgICAgIHNhbHZhcigpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY3RybC5jbGllbnRlLnBlbmRlbnRlUmVnaXN0cm8gPT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBtb2RhbE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBjbG9zZUJ1dHRvblRleHQ6ICdOw6NvJyxcbiAgICAgICAgICAgIGFjdGlvbkJ1dHRvblRleHQ6ICdTaW0nLFxuICAgICAgICAgICAgaGVhZGVyVGV4dDogJ0NvbmZpcm1hcicsXG4gICAgICAgICAgICBib2R5VGV4dDogJ08gY2xpZW50ZSAnICsgY3RybC5jbGllbnRlLnJhemFvU29jaWFsICsgJyBlc3TDoSBtYXJkbyBjb21vIHBlbmRlbnRlIGRlIGNhZGFzdHJvLiBEZXNlamEgcmVtb3ZlciBlc3RhIG1hcmNhw6fDo28/J1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBNb2RhbFNlcnZpY2Uuc2hvd01vZGFsKHt9LCBtb2RhbE9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgY3RybC5jbGllbnRlLnBlbmRlbnRlUmVnaXN0cm8gPSBmYWxzZVxuICAgICAgICAgICAgc2FsdmFyKClcbiAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBzYWx2YXIoKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNhbHZhcigpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjdHJsLmFkaWNpb25hSW5kdXN0cmlhQ2xpZW50ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghY3RybC5saXN0YUluZHVzdHJpYUNsaWVudGUpIHtcbiAgICAgICAgY3RybC5saXN0YUluZHVzdHJpYUNsaWVudGUgPSBbXTtcbiAgICAgIH1cbiAgICAgIGxldCBhdHVhbGl6b3UgPSBmYWxzZVxuICAgICAgY3RybC5saXN0YUluZHVzdHJpYUNsaWVudGUuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGl0ZW0uaWQgPT0gY3RybC5pbmR1c3RyaWFDbGllbnRlLmlkICYmIGl0ZW0ucmVtb3ZpZG8pIHtcbiAgICAgICAgICBjdHJsLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZVtpbmRleF0ucmVtb3ZpZG8gPSBmYWxzZVxuICAgICAgICAgIGF0dWFsaXpvdSA9IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGlmICghYXR1YWxpem91KSB7XG4gICAgICAgIGN0cmwubGlzdGFJbmR1c3RyaWFDbGllbnRlLnB1c2goY3RybC5pbmR1c3RyaWFDbGllbnRlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjdHJsLmFkaWNpb25hUmVwcmVzZW50Y2FvVmVuZGVkb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWN0cmwubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUpIHtcbiAgICAgICAgY3RybC5saXN0YVJlcHJlc2VudGFjb2VzQ2xpZW50ZSA9IFtdO1xuICAgICAgfVxuICAgICAgY3RybC5saXN0YVJlcHJlc2VudGFjb2VzQ2xpZW50ZS5wdXNoKGN0cmwucmVwcmVzZW50YWNhb0NsaWVudGUpXG4gICAgICBjdHJsLmJsb3F1ZWlhU2FsdmFyID0gKEF1dGhlbnRpY2F0aW9uU2VydmljZS5pc1ZlbmRlZG9yKCkgJiYgY3RybC5saXN0YVJlcHJlc2VudGFjb2VzQ2xpZW50ZS5sZW5ndGggPCAxKVxuICAgIH1cblxuICAgIGN0cmwuYWRpY2lvbmFJbmR1c3RyaWFDbGllbnRlUmVwcmVzZW50YWNhb1ZlbmRlZG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgY3RybC5hZGljaW9uYUluZHVzdHJpYUNsaWVudGUoKTtcbiAgICAgIGN0cmwuYWRpY2lvbmFSZXByZXNlbnRjYW9WZW5kZWRvcigpO1xuICAgIH1cblxuICAgIGN0cmwudmFsaWRhRG9jdW1lbnRvID0gZnVuY3Rpb24gKGNwZkNucGopIHtcbiAgICAgIGlmIChjcGZDbnBqLmxlbmd0aCA9PSAxNCkge1xuICAgICAgICByZXR1cm4gc2VydmljZS52YWxpZGFyQ25waihjcGZDbnBqKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjdHJsLnJlbW92ZVJlcHJlc2VudGFjYW8gPSBmdW5jdGlvbiAocmVwcmVzZW50YWNhbykge1xuICAgICAgJC5lYWNoKGN0cmwubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIGlmIChjdHJsLmxpc3RhUmVwcmVzZW50YWNvZXNDbGllbnRlW2ldLmlkID09PSByZXByZXNlbnRhY2FvLmlkKSB7XG4gICAgICAgICAgY3RybC5saXN0YVJlcHJlc2VudGFjb2VzQ2xpZW50ZS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgY3RybC5ibG9xdWVpYVNhbHZhciA9IChBdXRoZW50aWNhdGlvblNlcnZpY2UuaXNWZW5kZWRvcigpICYmIGN0cmwubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUubGVuZ3RoIDwgMSlcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGN0cmwucmVtb3ZlckluZHVzdHJpYUNsaWVudGUgPSBmdW5jdGlvbiAoaW5kdXN0cmlhQ2xpZW50ZSkge1xuICAgICAgJC5lYWNoKGN0cmwubGlzdGFJbmR1c3RyaWFDbGllbnRlLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICBpZiAoY3RybC5saXN0YUluZHVzdHJpYUNsaWVudGVbaV0uaWQgPT09IGluZHVzdHJpYUNsaWVudGUuaWQpIHtcbiAgICAgICAgICBpZiAoaW5kdXN0cmlhQ2xpZW50ZS5pZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjdHJsLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN0cmwubGlzdGFJbmR1c3RyaWFDbGllbnRlW2ldLnJlbW92aWRvID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjdHJsLnZvbHRhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcbiAgICB9XG5cbiAgICBjdHJsLnBvZGVTYWx2YXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoQXV0aGVudGljYXRpb25TZXJ2aWNlLmlzVmVuZGVkb3IoKSkge1xuICAgICAgICBpZiAoY3RybC5saXN0YVJlcHJlc2VudGFjb2VzQ2xpZW50ZSAmJiBjdHJsLmxpc3RhUmVwcmVzZW50YWNvZXNDbGllbnRlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIGN0cmwuc2VsZWNpb25hSW5kdXN0cmlhUHJhem8gPSAoaXRlbSkgPT4ge1xuICAgICAgbGV0IGluZHVzdHJpYUNsaWVudGVQcmF6byA9IHtcbiAgICAgICAgaWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgaWRJbmR1c3RyaWFDbGllbnRlOiB1bmRlZmluZWQsXG4gICAgICAgIGlkSW5kdXN0cmlhUHJhem86IGl0ZW0uaWQsXG4gICAgICAgIGRlc2NyaWNhb0luZHVzdHJpYVByYXpvOiBpdGVtLmRlc2NyaWNhbyxcbiAgICAgICAgcGFkcmFvOiB1bmRlZmluZWQsXG4gICAgICB9XG4gICAgICBjdHJsLmluZHVzdHJpYUNsaWVudGUubGlzdGFJbmR1c3RyaWFDbGllbnRlUHJhem8ucHVzaChpbmR1c3RyaWFDbGllbnRlUHJhem8pXG4gICAgfVxuXG4gICAgY3RybC5yZW1vdmVJbmR1c3RyaWFQcmF6byA9IChpdGVtKSA9PiB7XG5cbiAgICAgIGNvbnN0IGl0ZW1SZW1vdmlkbyA9ICQuZ3JlcChjdHJsLmluZHVzdHJpYUNsaWVudGUubGlzdGFJbmR1c3RyaWFDbGllbnRlUHJhem8sIChlKSA9PiB7XG4gICAgICAgIHJldHVybiBlLmlkSW5kdXN0cmlhUHJhem8gPT09IGl0ZW0uaWQ7XG4gICAgICB9KVxuXG4gICAgICBjdHJsLmluZHVzdHJpYUNsaWVudGUubGlzdGFJbmR1c3RyaWFDbGllbnRlUHJhem8gPSAkLmdyZXAoY3RybC5pbmR1c3RyaWFDbGllbnRlLmxpc3RhSW5kdXN0cmlhQ2xpZW50ZVByYXpvLCAoZSkgPT4ge1xuICAgICAgICByZXR1cm4gZS5pZEluZHVzdHJpYVByYXpvICE9PSBpdGVtLmlkO1xuICAgICAgfSlcblxuICAgICAgaWYgKGl0ZW1SZW1vdmlkb1swXSAmJiBpdGVtUmVtb3ZpZG9bMF0ucGFkcmFvKSB7XG4gICAgICAgIGN0cmwuaW5kdXN0cmlhQ2xpZW50ZVByYXpvUGFkcmFvLnNlbGVjaW9uYWRvID0gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtUmVtb3ZpZG9bMF0gJiYgaXRlbVJlbW92aWRvWzBdLmlkKSB7XG4gICAgICAgIGN0cmwuaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6b1BhcmFSZW1vdmVyLnB1c2goaXRlbVJlbW92aWRvWzBdKVxuICAgICAgfVxuICAgIH1cblxuICAgIGN0cmwucmVtb3ZlclBhZHJhbyA9ICgpID0+IHtcbiAgICAgIGN0cmwuaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6by5mb3JFYWNoKChlLCBpLCBhcnIpID0+IHtcbiAgICAgICAgZS5wYWRyYW8gPSB1bmRlZmluZWRcbiAgICAgICAgY3RybC5pbmR1c3RyaWFDbGllbnRlUHJhem9QYWRyYW8uc2VsZWNpb25hZG8gPSB1bmRlZmluZWRcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY3RybC5idXNjYURlc2NyaWNhb1Jlc3VtaWRhUHJhem8gPSAoaW5kdXN0cmlhQ2xpZW50ZSkgPT4ge1xuICAgICAgbGV0IGRlc2NyID0gXCJcIlxuICAgICAgaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6by5mb3JFYWNoKChlLCBpLCBhcnIpID0+IHtcbiAgICAgICAgaWYgKGkgPT09IGFyci5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgZGVzY3IgKz0gKGUucGFkcmFvID8gYDxzdHJvbmc+JHtlLmRlc2NyaWNhb0luZHVzdHJpYVByYXpvfTwvc3Ryb25nPmAgOiBlLmRlc2NyaWNhb0luZHVzdHJpYVByYXpvKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlc2NyICs9IChlLnBhZHJhbyA/IGA8c3Ryb25nPiR7ZS5kZXNjcmljYW9JbmR1c3RyaWFQcmF6b308L3N0cm9uZz4sIGAgOiBlLmRlc2NyaWNhb0luZHVzdHJpYVByYXpvICsgXCIsIFwiKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoZGVzY3IpXG4gICAgfVxuXG4gICAgY3RybC5zZWxlY2lvbmFJbmR1c3RyaWFQcmF6b1BhZHJhbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGN0cmwuaW5kdXN0cmlhQ2xpZW50ZS5saXN0YUluZHVzdHJpYUNsaWVudGVQcmF6by5mb3JFYWNoKChlLCBpLCBhcnIpID0+IHtcbiAgICAgICAgaWYgKGUuaWQgPT0gY3RybC5pbmR1c3RyaWFDbGllbnRlUHJhem9QYWRyYW8uc2VsZWNpb25hZG8uaWQgJiYgZS5pZEluZHVzdHJpYVByYXpvID09IGN0cmwuaW5kdXN0cmlhQ2xpZW50ZVByYXpvUGFkcmFvLnNlbGVjaW9uYWRvLmlkSW5kdXN0cmlhUHJhem8pIHtcbiAgICAgICAgICBlLnBhZHJhbyA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlLnBhZHJhbyA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY3RybC51cGxvYWRBcnF1aXZvQ2xpZW50ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBmaWxlcyA9IGN0cmwuYXJxdWl2b0NsaWVudGU7XG4gICAgICBpZiAoIWZpbGVzKSB7XG4gICAgICAgIE5vdGlmaWNhdGlvblNlcnZpY2UuYWxlcnQoXCJOZW5odW0gYXJxdWl2byBzZWxlY2lvbmFkb1wiKVxuICAgICAgfVxuICAgICAgYmxvY2tVSS5zdGFydCgnQ2FycmVnYW5kbyBBcnF1aXZvLCBBZ3VhcmRlLi4uJyk7XG4gICAgICBzZXJ2aWNlLnVwbG9hZEFycXVpdm9DbGllbnRlKGZpbGVzLCBjdHJsLmNsaWVudGUuY3BmQ25waiwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBhZGljaW9uYUFycXVpdm9zQ2xpZW50ZShyZXN1bHQpXG4gICAgICAgIGN0cmwuYXJxdWl2b0NsaWVudGUgPSBudWxsXG4gICAgICAgIGJsb2NrVUkuc3RvcCgpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdFUlInKVxuICAgICAgICBibG9ja1VJLnN0b3AoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkaWNpb25hQXJxdWl2b3NDbGllbnRlKGFycXVpdm9zRW52aWFkb3MpIHtcbiAgICAgIGlmIChhcnF1aXZvc0VudmlhZG9zKSB7XG4gICAgICAgIGlmICghY3RybC5jbGllbnRlLmFycXVpdm9zKSB7XG4gICAgICAgICAgY3RybC5jbGllbnRlLmFycXVpdm9zID0gW11cbiAgICAgICAgfVxuICAgICAgICBhcnF1aXZvc0VudmlhZG9zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgYXJxdWl2b0NsaWVudGVEdG8gPSB7XG4gICAgICAgICAgICBpZDogbnVsbCxcbiAgICAgICAgICAgIGlkQ2xpZW50ZTogY3RybC5jbGllbnRlLmlkLFxuICAgICAgICAgICAgbm9tZUFycXVpdm86IGl0ZW0ubm9tZUFycXVpdm9cbiAgICAgICAgICB9XG4gICAgICAgICAgY3RybC5jbGllbnRlLmFycXVpdm9zLnB1c2goYXJxdWl2b0NsaWVudGVEdG8pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2FsdmFyKCkge1xuICAgICAgc2VydmljZS5zYWx2YXJDbGllbnRlKGN0cmwuY2xpZW50ZSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBOb3RpZmljYXRpb25TZXJ2aWNlLnN1Y2Nlc3MoYENsaWVudGUgJHtyZXN1bHQucmF6YW9Tb2NpYWx9IGNhZGFzdHJhZG8gY29tIHN1Y2Vzc28hYCk7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbGlzdGFDbGllbnRlcycpO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLiRvbkluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjdHJsLmF1dGggPSAkc2NvcGUuJHBhcmVudC4kcmVzb2x2ZS5hdXRoO1xuICAgICAgY3RybC5saXN0YVJlcHJlc2VudGFjb2VzVmVuZGVkb3IgPSBbXTtcbiAgICAgIGN0cmwubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUgPSBbXTtcbiAgICAgIGN0cmwubGlzdGFJbmR1c3RyaWFDbGllbnRlID0gW107XG4gICAgICBjdHJsLmluZHVzdHJpYVByYXpvID0ge1xuICAgICAgICBzZWxlY2lvbmFkbzogdW5kZWZpbmVkLFxuICAgICAgfVxuXG4gICAgICBpZiAoY3RybC5jbGllbnRlKSB7XG4gICAgICAgIGN0cmwubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGUgPSBjdHJsLmNsaWVudGUubGlzdGFSZXByZXNlbnRhY29lc0NsaWVudGU7XG4gICAgICAgIENsaWVudGVTZXJ2aWNlLmJ1c2NhSW5kdXN0cmlhQ2xpZW50ZShjbGllbnRlLmlkKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGN0cmwubGlzdGFJbmR1c3RyaWFDbGllbnRlID0gcmVzcG9uc2U7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY3RybC5jbGllbnRlLmV4Y2x1aWRvKSB7XG4gICAgICAgICAgTm90aWZpY2F0aW9uU2VydmljZS5hbGVydCgnRXN0ZSBjbGllbnRlIGVzdMOhIGV4Y2x1w61kby4gRWZldHVlIGFzIGFsdGVyYcOnw7VlcyBlIHNhbHZlIG8gY2FkYXN0cm8gcGFyYSByZWF0aXbDoS1sby4nKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdHJsLmNsaWVudGUgPSB7XG4gICAgICAgICAgaWQ6IG51bGwsXG4gICAgICAgICAgcmF6YW9Tb2NpYWw6IFwiXCIsXG4gICAgICAgICAgbm9tZUZhbnRhc2lhOiBcIlwiLFxuICAgICAgICAgIGNwZkNucGo6IG51bGwsXG4gICAgICAgICAgcmdJZTogXCJcIixcbiAgICAgICAgICBydWE6IFwiXCIsXG4gICAgICAgICAgbnVtZXJvOiBudWxsLFxuICAgICAgICAgIHNhbGE6IG51bGwsXG4gICAgICAgICAgYW5kYXI6IG51bGwsXG4gICAgICAgICAgY29tcGxlbWVudG86IFwiXCIsXG4gICAgICAgICAgYmFpcnJvOiBcIlwiLFxuICAgICAgICAgIGNlcDogXCJcIixcbiAgICAgICAgICBjaWRhZGU6IFwiXCIsXG4gICAgICAgICAgZXN0YWRvOiBudWxsLFxuICAgICAgICAgIHRlbGVmb25lOiBudWxsLFxuICAgICAgICAgIGNlbHVsYXI6IG51bGwsXG4gICAgICAgICAgY29udGF0bzogXCJcIixcbiAgICAgICAgICBlbWFpbDogXCJcIixcbiAgICAgICAgICBkaWFzRW50cmVnYTogXCJcIixcbiAgICAgICAgICBob3JhcmlvRW50cmVnYTogXCJcIixcbiAgICAgICAgICBub21lQmFuY286IG51bGwsXG4gICAgICAgICAgbnVtZXJvQWdlbmNpYTogXCJcIixcbiAgICAgICAgICBub21lQWdlbmNpYTogXCJcIixcbiAgICAgICAgICBudW1lcm9Db250YTogXCJcIixcbiAgICAgICAgICBpZFBlc3NvYTogbnVsbCxcbiAgICAgICAgICBhdGl2bzogdHJ1ZSxcbiAgICAgICAgICBibG9xdWVpb1ZlbmRhOiBmYWxzZSxcbiAgICAgICAgICBpbmZvcm1hY29lc0FkaWNpb25haXM6IFwiXCIsXG4gICAgICAgICAgcGVuZGVudGVSZWdpc3RybzogbnVsbCxcbiAgICAgICAgICByZWZlcmVuY2lhc0NvbWVyY2lhaXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICBleGNsdWlkbzogbnVsbFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBjdHJsLmJhbmNvID0ge1xuICAgICAgICBub21lOiBudWxsXG4gICAgICB9O1xuXG4gICAgICBjdHJsLmFycXVpdm9DbGllbnRlID0gdW5kZWZpbmVkXG5cbiAgICAgIGN0cmwucmVwcmVzZW50YWNhb1ZlbmRlZG9yID0ge1xuICAgICAgICBzZWxlY2lvbmFkbzogbnVsbFxuICAgICAgfTtcblxuICAgICAgY3RybC5pbmR1c3RyaWEgPSB7XG4gICAgICAgIHNlbGVjaW9uYWRvOiBudWxsXG4gICAgICB9O1xuXG4gICAgICBjdHJsLmVzdGFkbyA9IHtcbiAgICAgICAgc2VsZWNpb25hZG86IG51bGxcbiAgICAgIH1cblxuICAgICAgY3RybC5pbmR1c3RyaWFDbGllbnRlID0ge1xuICAgICAgICBpZENsaWVudGU6IG51bGwsXG4gICAgICAgIGlkSW5kdXN0cmlhOiBudWxsLFxuICAgICAgICBjb2RpZ286IG51bGwsXG4gICAgICAgIGxpbWl0ZUNyZWRpdG86IG51bGwsXG4gICAgICAgIGF0aXZvOiB0cnVlLFxuICAgICAgICBibG9xdWVpb1ZlbmRhOiBmYWxzZSxcbiAgICAgICAgbm9tZUluZHVzdHJpYTogbnVsbCxcbiAgICAgICAgcmVtb3ZpZG86IGZhbHNlLFxuICAgICAgICBsaXN0YUluZHVzdHJpYUNsaWVudGVQcmF6bzogW10sXG4gICAgICAgIGxpc3RhSW5kdXN0cmlhQ2xpZW50ZVByYXpvUGFyYVJlbW92ZXI6IFtdLFxuICAgICAgfVxuXG4gICAgICBjdHJsLnJlcHJlc2VudGFjYW9DbGllbnRlID0ge1xuICAgICAgICBpZDogbnVsbCxcbiAgICAgICAgaW5kdXN0cmlhOiB7XG4gICAgICAgICAgaWQ6IG51bGwsXG4gICAgICAgICAgbm9tZTogbnVsbFxuICAgICAgICB9LFxuICAgICAgICB1c3VhcmlvOiB7XG4gICAgICAgICAgaWQ6IG51bGwsXG4gICAgICAgICAgbm9tZTogbnVsbFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN0cmwuYmxvcXVlaWFTYWx2YXIgPSAoQXV0aGVudGljYXRpb25TZXJ2aWNlLmlzVmVuZGVkb3IoKSAmJiBjdHJsLmxpc3RhUmVwcmVzZW50YWNvZXNDbGllbnRlLmxlbmd0aCA8IDEpXG5cbiAgICAgIGN0cmwudGlwb1Blc3NvYSA9IHtcbiAgICAgICAgc2VsZWNpb25hZG86IG51bGxcbiAgICAgIH07XG5cbiAgICAgIGN0cmwuaW5kdXN0cmlhQ2xpZW50ZVByYXpvUGFkcmFvID0ge1xuICAgICAgICBzZWxlY2lvbmFkbzogdW5kZWZpbmVkLFxuICAgICAgfVxuXG4gICAgICBjdHJsLnVzdWFyaW8gPSAkcm9vdFNjb3BlLmdsb2JhbHMuY3VycmVudFVzZXIudXNlcjtcbiAgICB9O1xuICB9XG59KTsiLCIndXNlIHN0cmljdCdcblxudmFyIENsaWVudGVNb2R1bG8gPSBhbmd1bGFyLm1vZHVsZSgnY2xpZW50ZS5tb2R1bGUnKTtcblxuQ2xpZW50ZU1vZHVsby5jb21wb25lbnQoJ3Blc3F1aXNhQ2xpZW50ZUNvbXBvbmVudCcsIHtcbiAgdGVtcGxhdGVVcmw6ICdtb2R1bGVzL2NsaWVudGUvY29tcG9uZW50cy9wZXNxdWlzYS92aWV3cy9wZXNxdWlzYUNsaWVudGUuaHRtbCcsXG4gIGNvbnRyb2xsZXIgOiAoKSA9PiB7XG4gICAgdGhpcy52bSA9IHRoaXM7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIEluZHVzdHJpYU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdpbmR1c3RyaWEubW9kdWxlJyk7XG5cbkluZHVzdHJpYU1vZHVsZS5jb21wb25lbnQoJ2NhZGFzdHJvUHJhem9Db21wb25lbnQnLCB7XG4gIHRlbXBsYXRlVXJsOiAnbW9kdWxlcy9pbmR1c3RyaWEvY29tcG9uZW50cy9jYWRhc3Ryb1ByYXpvL3ZpZXdzL2NhZGFzdHJvUHJhem8uaHRtbCcsXG4gIGJpbmRpbmdzOiB7XG4gICAgbGlzdGFJbmR1c3RyaWFzOiAnPCdcbiAgfSxcbiAgY29udHJvbGxlckFzOiAnY3RybCcsXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKEluZHVzdHJpYVByYXpvU2VydmljZSwgTm90aWZpY2F0aW9uU2VydmljZSwgTW9kYWxTZXJ2aWNlKSB7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuICAgIHRoaXMuJG9uSW5pdCA9IGluaXQoY3RybCk7XG5cbiAgICBjdHJsLmFkaWNpb25hRGlhID0gZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGV4aXN0ZSA9ICQuZ3JlcChjdHJsLmxpc3RhUHJhem9EaWEsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0gPT09IGN0cmwucHJhem9EaWEucHJhem9cbiAgICAgIH0pXG4gICAgICBpZihleGlzdGUubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN0cmwubGlzdGFQcmF6b0RpYS5wdXNoKGN0cmwucHJhem9EaWEucHJhem8pXG4gICAgICAgIGN0cmwucHJhem9EaWEucHJhem8gPSB1bmRlZmluZWRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjdHJsLmJ1c2NhRGlhcyA9IGZ1bmN0aW9uIChwcmF6bykge1xuICAgICAgbGV0IHN0ckRpYXMgPSBcIlwiXG4gICAgICBpZiAocHJhem8gJiYgcHJhem8uZGlhcykge1xuICAgICAgICBwcmF6by5kaWFzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgaWYgKHN0ckRpYXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHN0ckRpYXMgPSBlbGVtZW50LnByYXpvXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ckRpYXMgPSBgJHtzdHJEaWFzfSAtICR7ZWxlbWVudC5wcmF6b31gXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ckRpYXNcbiAgICB9XG4gIFxuICAgIGN0cmwuY2FycmVnYURhZG9zSW5kdXN0cmlhID0gZnVuY3Rpb24gKGluZHVzdHJpYSkge1xuICAgICAgY3RybC5pbmR1c3RyaWFQcmF6b0R0by5pZEluZHVzdHJpYSA9IGluZHVzdHJpYS5pZFxuICBcbiAgICAgIEluZHVzdHJpYVByYXpvU2VydmljZS5nZXRJbmR1c3RyaWFQcmF6byhpbmR1c3RyaWEuaWQpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICBjdHJsLmxpc3RhUHJhem8gPSByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9XG4gIFxuICAgIGN0cmwuc2FsdmFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYoIWN0cmwubGlzdGFQcmF6b0RpYSB8fCBjdHJsLmxpc3RhUHJhem9EaWEubGVuZ3RoIDwgMSkge1xuICAgICAgICBOb3RpZmljYXRpb25TZXJ2aWNlLmVycm9yKCfDiSBuZWNlc3PDoXJpbyBmb3JuZWNlciBhbyBtZW5vcyB1bSBkaWEhJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjdHJsLmxpc3RhUHJhem9EaWEuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgY29uc3QgaW5kdXN0cmlhUHJhem9EaWFEdG8gPSB7XG4gICAgICAgICAgcHJhem86IGVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgICBjdHJsLmluZHVzdHJpYVByYXpvRHRvLmRpYXMucHVzaChpbmR1c3RyaWFQcmF6b0RpYUR0bylcbiAgICAgIH0pXG4gICAgICBJbmR1c3RyaWFQcmF6b1NlcnZpY2Uuc2FsdmFJbmR1c3RyaWFQcmF6byhjdHJsLmluZHVzdHJpYVByYXpvRHRvKS50aGVuKCgpID0+IHtcbiAgICAgICAgTm90aWZpY2F0aW9uU2VydmljZS5zdWNjZXNzKCdQcmF6b3MgZGEgaW5kw7pzdHJpYSBhdHVhbGl6YWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICBhdHVhbGl6YUxpc3RhUHJhem9zKClcbiAgICAgICAgaW5pY2lhbGl6YURhZG9zKClcbiAgICAgIH0pXG4gICAgfVxuICBcbiAgICBjdHJsLnJlbW92ZXJEaWEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjdHJsLmxpc3RhUHJhem9EaWEgPSAkLmdyZXAoY3RybC5saXN0YVByYXpvRGlhLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBjdHJsLmRpYVNlbGVjaW9uYWRvLmRpYVxuICAgICAgfSlcbiAgICB9XG4gIFxuICAgIGN0cmwuZXhjbHVpclByYXpvc0luZHVzdHJpYSA9IGZ1bmN0aW9uIChpZFByYXpvSW5kdXN0cmlhKSB7XG4gICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xuICAgICAgICBjbG9zZUJ1dHRvblRleHQ6ICdOw6NvJyxcbiAgICAgICAgYWN0aW9uQnV0dG9uVGV4dDogJ1NpbScsXG4gICAgICAgIGhlYWRlclRleHQ6ICdDb25maXJtYXInLFxuICAgICAgICBib2R5VGV4dDogJ0NvbmZpcm1hIEVYQ0xVU8ODTyBkbyBwcmF6byBwYXJhIGEgaW5kw7pzdHJpYT8nXG4gICAgICB9XG4gICAgICBNb2RhbFNlcnZpY2Uuc2hvd01vZGFsKHt9LCBtb2RhbE9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBJbmR1c3RyaWFQcmF6b1NlcnZpY2UucmVtb3ZlckluZHVzdHJpYVByYXpvKGlkUHJhem9JbmR1c3RyaWEpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIE5vdGlmaWNhdGlvblNlcnZpY2Uuc3VjY2VzcygnUHJhem8gZXhjbHXDrWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgIGF0dWFsaXphTGlzdGFQcmF6b3MoKVxuICAgICAgICB9KSwgKCkgPT4ge1xuICAgICAgICAgIE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0Vycm8gYW8gZXhjbHVpciBwcmF6byEhJyk7XG4gICAgICAgICAgYXR1YWxpemFMaXN0YVByYXpvcygpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pY2lhbGl6YURhZG9zKCkge1xuICAgICAgY3RybC5pbmR1c3RyaWFQcmF6b0R0by5kaWFzID0gW11cbiAgICAgIGN0cmwuaW5kdXN0cmlhUHJhem9EdG8uY29kaWdvID0gdW5kZWZpbmVkXG4gICAgICBjdHJsLmluZHVzdHJpYVByYXpvRHRvLmRlc2NyaWNhbyA9IHVuZGVmaW5lZFxuICAgICAgY3RybC5saXN0YVByYXpvRGlhID0gW11cbiAgICB9XG4gIFxuICAgIGZ1bmN0aW9uIGF0dWFsaXphTGlzdGFQcmF6b3MoKSB7XG4gICAgICBjdHJsLmNhcnJlZ2FEYWRvc0luZHVzdHJpYShjdHJsLmluZHVzdHJpYS5zZWxlY2lvbmFkbylcbiAgICB9XG4gIFxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgIGN0cmwuaW5kdXN0cmlhID0ge31cbiAgICAgIGN0cmwubGlzdGFQcmF6b0RpYSA9IFtdXG4gICAgICBjdHJsLmxpc3RhUHJhem8gPSBbXVxuICAgICAgY3RybC5kaWFTZWxlY2lvbmFkbyA9IHtcbiAgICAgICAgZGlhOiB1bmRlZmluZWRcbiAgICAgIH1cbiAgICBcbiAgICAgIGN0cmwucHJhem9EaWEgPSB7XG4gICAgICAgIHByYXpvOiB1bmRlZmluZWQsXG4gICAgICB9XG4gICAgXG4gICAgICBjdHJsLmluZHVzdHJpYVByYXpvRHRvID0ge1xuICAgICAgICBkaWFzOiBbXVxuICAgICAgfVxuXG4gICAgICBpbmljaWFsaXphRGFkb3MoKTtcbiAgICB9XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBQZWRpZG9Nb2R1bG8gPSBhbmd1bGFyLm1vZHVsZSgncGVkaWRvLm1vZHVsZScpO1xyXG5cclxuUGVkaWRvTW9kdWxvLmNvbXBvbmVudCgncGVzcXVpc2FQZWRpZG9Db21wb25lbnQnLCB7XHJcbiAgdGVtcGxhdGVVcmw6ICdtb2R1bGVzL3BlZGlkby9jb21wb25lbnRzL3Blc3F1aXNhL3ZpZXdzL3Blc3F1aXNhUGVkaWRvLmh0bWwnLFxyXG4gIGJpbmRpbmdzOiB7XHJcbiAgICBsaXN0YUluZHVzdHJpYXM6ICc8J1xyXG4gIH0sXHJcbiAgY29udHJvbGxlckFzOiAnY3RybCcsXHJcbiAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRsb2csICRzY29wZSwgUGVkaWRvU2VydmljZSxcclxuICAgIE1vZGFsU2VydmljZSwgQ2xpZW50ZVNlcnZpY2UsIE5vdGlmaWNhdGlvblNlcnZpY2UsIFVzdWFyaW9TZXJ2aWNlLCB1aWJEYXRlUGFyc2VyKSB7XHJcbiAgICB2YXIgY3RybCA9IHRoaXM7XHJcbiAgICB0aGlzLiRvbkluaXQgPSBpbml0KCk7XHJcblxyXG4gICAgY3RybC5idXNjYUNsaWVudGVzID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgIGN0cmwuY2xpZW50ZVNlYXJjaC5yYXphb1NvY2lhbCA9IHZhbHVlO1xyXG4gICAgICByZXR1cm4gQ2xpZW50ZVNlcnZpY2UuZ2V0Q2xpZW50ZXNQb3JGaWx0cm8oY3RybC5jbGllbnRlU2VhcmNoKS50aGVuKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jb250ZW50O1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgVXN1YXJpb1NlcnZpY2UuYnVzY2FVc3VhcmlvcygpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICBjdHJsLmxpc3RhVmVuZGVkb3JlcyA9IHJlc3BvbnNlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgUGVkaWRvU2VydmljZS5nZXRMaXN0YVN0YXR1c1BlZGlkbygpLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgY3RybC5saXN0YVN0YXR1c1BlZGlkbyA9IHJlc3VsdFxyXG4gICAgfSlcclxuXHJcbiAgICBjdHJsLnNlbGVjdENsaWVudGUgPSBmdW5jdGlvbigkaXRlbSkge1xyXG4gICAgICBjdHJsLnBlZGlkb1NlYXJjaC5pZENsaWVudGUgPSAkaXRlbS5pZDtcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgICRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKCdjdHJsLnBlZGlkb1NlYXJjaCcsIGZ1bmN0aW9uIChub3ZhVGFiZWxhLCBhbnRpZ2FUYWJlbGEpIHtcclxuICAgICAgJGxvZy5sb2coJ2ZpbHRybzogJywgY3RybC5wZWRpZG9TZWFyY2gpO1xyXG4gICAgICBQZWRpZG9TZXJ2aWNlLmdldFBlZGlkb3NQb3JDcml0ZXJpYShjdHJsLnBlZGlkb1NlYXJjaCkudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgJGxvZy5sb2coJ3Jlc3VsdDogJywgcmVzdWx0KTtcclxuICAgICAgICBjdHJsLnNlYXJjaFJlc3VsdCA9IHJlc3VsdDtcclxuICAgICAgICBjdHJsLnBlZGlkb3MgPSByZXN1bHQuY29udGVudDtcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG5cclxuICAgIC8qXHJcbiAgICBjdHJsLnNlbGVjdENsaWVudGUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICBjdHJsLnBlZGlkb1NlYXJjaC5pZENsaWVudGUgPSBpdGVtLmlkXHJcbiAgICAgIGJ1c2NhUGVkaWRvcygpXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGZpbHRyb1BlZGlkbyA9IFN0b3JhZ2VTZXJ2aWNlLmdldEZpbHRyb1BlZGlkb0F0aXZvKClcclxuICAgIGlmIChmaWx0cm9QZWRpZG8pIHtcclxuICAgICAgY3RybC5wZWRpZG9TZWFyY2ggPSBmaWx0cm9QZWRpZG9cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGN0cmwucGVkaWRvU2VhcmNoID0ge1xyXG4gICAgICAgIGlkSW5kdXN0cmlhOiBudWxsLFxyXG4gICAgICAgIGlkVXN1YXJpbzogbnVsbCxcclxuICAgICAgICBpZFN0YXR1czogbnVsbCxcclxuICAgICAgICBkdEluaWNpbzogbnVsbCxcclxuICAgICAgICBkdEZpbTogbnVsbCxcclxuICAgICAgICBpZENsaWVudGU6IG51bGwsXHJcbiAgICAgICAgbmV3UGFnZTogUEFHSU5BQ0FPLlBFRElETy5ORVdfUEFHRSxcclxuICAgICAgICBwYWdlU2l6ZTogUEFHSU5BQ0FPLlBFRElETy5QQUdFX1NJWkVcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoQXV0aGVudGljYXRpb25TZXJ2aWNlLmlzVmVuZGVkb3IoKSkge1xyXG4gICAgICBjdHJsLnZlbmRlZG9yID0gdXN1YXJpbztcclxuICAgICAgY3RybC5wZWRpZG9TZWFyY2guaWRVc3VhcmlvID0gdXN1YXJpby5pZDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIENhZGFzdHJvQ2xpZW50ZXNTZXJ2aWNlLmJ1c2NhVmVuZGVkb3JlcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBjdHJsLnZlbmRlZG9yZXMgPSByZXNwb25zZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3RybC5zdGF0dXNQZWRpZG8gPSB1bmRlZmluZWQ7XHJcbiAgICAqL1xyXG4gICAgLypcclxuICAgICBzZXJ2aWNlLmdldExpc3RhU3RhdHVzUGVkaWRvKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgY3RybC5saXN0YVN0YXR1c1BlZGlkbyA9IHJlc3BvbnNlO1xyXG4gICAgICAgaWYgKGN0cmwucGVkaWRvU2VhcmNoLmlkU3RhdHVzKSB7XHJcbiAgICAgICAgIGN0cmwubGlzdGFTdGF0dXNQZWRpZG8uZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gY3RybC5wZWRpZG9TZWFyY2guaWRTdGF0dXMpIHtcclxuICAgICAgICAgICAgIGN0cmwuc3RhdHVzUGVkaWRvID0gaXRlbVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgfSk7XHJcbiAgICAgKi9cclxuXHJcbiAgICAvKlxyXG4gICAgdmFyIHBhZ2luYXRpb25PcHRpb25zID0ge1xyXG4gICAgICBwYWdlTnVtYmVyOiBQQUdJTkFDQU8uUEVESURPLk5FV19QQUdFLFxyXG4gICAgICBwYWdlU2l6ZTogUEFHSU5BQ0FPLlBFRElETy5QQUdFX1NJWkUsXHJcbiAgICAgIHNvcnQ6IG51bGxcclxuICAgIH07XHJcbiAgICAqL1xyXG5cclxuICAgIC8qIEZJTFRST1MgREUgUEVTUVVJU0FcclxuXHJcbiAgICBjdHJsLnNlbGVjaW9uYVZlbmRlZG9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBidXNjYVBlZGlkb3MoKVxyXG4gICAgfVxyXG5cclxuICAgIGN0cmwuc2VsZWNpb25hRGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgYnVzY2FQZWRpZG9zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3RybC5saW1wYUZpbHRybyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgY3RybC5wZWRpZG9TZWFyY2ggPSB7XHJcbiAgICAgICAgaWRJbmR1c3RyaWE6IG51bGwsXHJcbiAgICAgICAgaWRVc3VhcmlvOiBjdHJsLmlzVmVuZGVkb3IoKSA/IHVzdWFyaW8uaWQgOiBudWxsLFxyXG4gICAgICAgIGlkU3RhdHVzOiBudWxsLFxyXG4gICAgICAgIGR0SW5pY2lvOiBudWxsLFxyXG4gICAgICAgIGR0RmltOiBudWxsLFxyXG4gICAgICAgIGlkQ2xpZW50ZTogbnVsbCxcclxuICAgICAgICBuZXdQYWdlOiBQQUdJTkFDQU8uUEVESURPLk5FV19QQUdFLFxyXG4gICAgICAgIHBhZ2VTaXplOiBQQUdJTkFDQU8uUEVESURPLlBBR0VfU0laRVxyXG4gICAgICB9O1xyXG4gICAgICBjdHJsLnN0YXR1c1BlZGlkbyA9IHVuZGVmaW5lZFxyXG4gICAgICBjdHJsLmNsaWVudGUuc2VsZWNpb25hZG8gPSB1bmRlZmluZWRcclxuICAgICAgYnVzY2FQZWRpZG9zKClcclxuICAgICAgU3RvcmFnZVNlcnZpY2UucmVzZXRGaWx0cm9QZWRpZG9BdGl2bygpXHJcbiAgICB9XHJcbiAgICAqL1xyXG5cclxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuICAgIC8qXHJcbiAgICBjdHJsLnNlbGVjaW9uYVN0YXR1cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKGN0cmwuc3RhdHVzUGVkaWRvKSB7XHJcbiAgICAgICAgY3RybC5wZWRpZG9TZWFyY2guaWRTdGF0dXMgPSBjdHJsLnN0YXR1c1BlZGlkby5pZFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGN0cmwucGVkaWRvU2VhcmNoLmlkU3RhdHVzID0gbnVsbFxyXG4gICAgICB9XHJcbiAgICAgIGlmIChTdG9yYWdlU2VydmljZS5nZXRGaWx0cm9QZWRpZG9BdGl2bygpKSB7XHJcbiAgICAgICAgU3RvcmFnZVNlcnZpY2UucmVzZXRGaWx0cm9QZWRpZG9BdGl2bygpXHJcbiAgICAgIH1cclxuICAgICAgYnVzY2FQZWRpZG9zKCk7XHJcbiAgICB9XHJcbiAgICAqL1xyXG5cclxuICAgIC8qXHJcblxyXG4gICAgYnVzY2FQZWRpZG9zKCk7XHJcbiAgICAqL1xyXG5cclxuICAgIGN0cmwuYnVzY2FQZWRpZG9zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAvL1N0b3JhZ2VTZXJ2aWNlLnNldEZpbHRyb1BlZGlkb0F0aXZvKGN0cmwucGVkaWRvU2VhcmNoKVxyXG4gICAgICAvL2N0cmwucGVkaWRvU2VhcmNoLmlzVmVuZGVkb3IgPSBjdHJsLmlzVmVuZGVkb3IoKVxyXG4gICAgICBQZWRpZG9TZXJ2aWNlLmdldFBlZGlkb3NQb3JDcml0ZXJpYShjdHJsLnBlZGlkb1NlYXJjaCkudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgJGxvZy5sb2coJ3BlZGlkb3M6ICcsIHJlc3VsdCk7XHJcbiAgICAgICAgY3RybC5zZWFyY2hSZXN1bHQgPSByZXN1bHQ7XHJcbiAgICAgICAgY3RybC5wZWRpZG9zID0gcmVzdWx0LmNvbnRlbnQ7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjdHJsLmdldFN0YXR1cyA9IGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgIHN3aXRjaCAoaSkge1xyXG4gICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgIHJldHVybiBcIkluZGVmaW5pZG9cIjtcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICByZXR1cm4gXCJDcmlhZG9cIjtcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICByZXR1cm4gXCJTYWx2b1wiO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIHJldHVybiBcIkVudmlhZG9cIjtcclxuICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICByZXR1cm4gXCJOZWdhZG9cIjtcclxuICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICByZXR1cm4gXCJDb2xvY2Fkb1wiO1xyXG4gICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgIHJldHVybiBcIkNhbmNlbGFkb1wiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3RybC5mb3JtYXREYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIpXHJcbiAgICB9XHJcblxyXG4gICAgLyogREVUQUxIQVIgUEVESURPICovXHJcbiAgICBjdHJsLmV4aWJlRGV0YWxoZXNQZWRpZG8gPSBmdW5jdGlvbiAoaWRQZWRpZG8pIHtcclxuICAgICAgaWYgKCFpZFBlZGlkbykge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIFBlZGlkb1NlcnZpY2UuZ2V0UGVkaWRvKGlkUGVkaWRvLCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgbGV0IHBlZGlkb0NvbXBsZXRvID0gcmVzdWx0XHJcbiAgICAgICAgc2VydmljZS5zZXRQZWRpZG8ocGVkaWRvQ29tcGxldG8pO1xyXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZGV0YWxoZVBlZGlkb0l0ZW5zJylcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKiBFRElUQVIgUEVESURPICovXHJcbiAgICBjdHJsLmVkaXRhclBlZGlkbyA9IGZ1bmN0aW9uIChpZFBlZGlkbykge1xyXG4gICAgICBpZiAoIWlkUGVkaWRvKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgICAgU3RvcmFnZVNlcnZpY2Uuc2V0RmlsdHJvUGVkaWRvQXRpdm8oY3RybC5wZWRpZG9TZWFyY2gpXHJcbiAgICAgIFBlZGlkb1NlcnZpY2UuZ2V0UGVkaWRvKGlkUGVkaWRvLCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgUGVkaWRvU2VydmljZS5wZWRpZG9QYXJhRWRpdGFyID0gcmVzdWx0O1xyXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGVkaWRvJyk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLyogQ0FOQ0VMQVIgUEVESURPICovXHJcbiAgICBjdHJsLmNhbmNlbGFyUGVkaWRvID0gZnVuY3Rpb24gKGxpc3RhZ2VtUGVkaWRvRHRvKSB7XHJcbiAgICAgIHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnTsOjbycsXHJcbiAgICAgICAgYWN0aW9uQnV0dG9uVGV4dDogJ1NpbScsXHJcbiAgICAgICAgaGVhZGVyVGV4dDogJ0NvbmZpcm1hcicsXHJcbiAgICAgICAgYm9keVRleHQ6ICdDb25maXJtYSBDQU5DRUxBTUVOVE8gZG8gcGVkaWRvIHBhcmEgbyBjbGllbnRlICcgKyBsaXN0YWdlbVBlZGlkb0R0by5ub21lQ2xpZW50ZSArICcgPydcclxuICAgICAgfTtcclxuICAgICAgTW9kYWxTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICBQZWRpZG9TZXJ2aWNlLmdldFBlZGlkbyhsaXN0YWdlbVBlZGlkb0R0by5pZFBlZGlkbywgKHBlZGlkb0R0bykgPT4ge1xyXG4gICAgICAgICAgcGVkaWRvRHRvLnN0YXR1c1BlZGlkbyA9IFNUQVRVU19QRURJRE8uQ0FOQ0VMQURPXHJcbiAgICAgICAgICBQZWRpZG9TZXJ2aWNlLnNhbHZhUGVkaWRvKHBlZGlkb0R0bywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBOb3RpZmljYXRpb25TZXJ2aWNlLnN1Y2Nlc3MoXCJQZWRpZG8gY2FuY2VsYWRvIGNvbSBzdWNlc3NvIVwiKVxyXG4gICAgICAgICAgICAvLyRyb3V0ZS5yZWxvYWQoKVxyXG4gICAgICAgICAgfSksIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgTm90aWZpY2F0aW9uU2VydmljZS5lcnJvcihcIkVycm8gYW8gY2FuY2VsYXIgcGVkaWRvIVwiKVxyXG4gICAgICAgICAgICAvLyRyb3V0ZS5yZWxvYWQoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGN0cmwucG9kZUVkaXRhciA9IGZ1bmN0aW9uIChsaXN0YWdlbVBlZGlkb0R0bykge1xyXG4gICAgICBpZiAoIWxpc3RhZ2VtUGVkaWRvRHRvKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGxpc3RhZ2VtUGVkaWRvRHRvLnN0YXR1cyA9PT0gU1RBVFVTX1BFRElETy5ORUdBRE8gJiYgbGlzdGFnZW1QZWRpZG9EdG8uaWRWZW5kZWRvciA9PT0gY3RybC51c3VhcmlvLmlkO1xyXG4gICAgfVxyXG5cclxuICAgIGN0cmwubXVkYVBhZ2luYSA9ICgpID0+IHtcclxuICAgICAgY3RybC5idXNjYVBlZGlkb3MoKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHJsLmdldFRvdGFsUGVkaWRvU2VtU3QgPSAocGVkaWRvKSA9PiB7XHJcbiAgICAgIHJldHVybiBzZXJ2aWNlLmdldFRvdGFsUGVkaWRvU2VtU3QocGVkaWRvKVxyXG4gICAgfVxyXG5cclxuICAgIGN0cmwub3BlbkluaSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBjdHJsLnBvcHVwLm9wZW5lZGluaSA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIGN0cmwub3BlbkZpbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBjdHJsLnBvcHVwLm9wZW5lZGZpbSA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgICBjdHJsLmNsaWVudGUgPSB7XHJcbiAgICAgICAgc2VsZWNpb25hZG86IHVuZGVmaW5lZFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjdHJsLnJlc3VsdGFkb0J1c2NhID0gdW5kZWZpbmVkXHJcbiAgICAgIGN0cmwucGFnaW5hQXR1YWwgPSAwXHJcbiAgICAgIGN0cmwudG90YWxQYWdpbmFzID0gMFxyXG5cclxuICAgICAgY3RybC5jYW5FZGl0UGVkaWRvID0gZmFsc2U7XHJcbiAgICAgIGN0cmwucGVkaWRvU2VsZWNpb25hZG8gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICBjdHJsLmV4aWJlT3BjaW9uYWlzID0gaW5uZXJXaWR0aCA+IDcwMCA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgIGN0cmwudXN1YXJpbyA9IGN0cmwuYXV0aCA9ICRzY29wZS4kcGFyZW50LiRyZXNvbHZlLmF1dGg7XHJcblxyXG4gICAgICBjdHJsLmNsaWVudGVTZWFyY2ggPSB7XHJcbiAgICAgICAgaWRVc3VhcmlvOiBjdHJsLnVzdWFyaW8uaWQsXHJcbiAgICAgICAgcmF6YW9Tb2NpYWw6IG51bGwsXHJcbiAgICAgICAgbmV3UGFnZTogMSxcclxuICAgICAgICBwYWdlU2l6ZTogNlxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3RybC5wZWRpZG9TZWFyY2ggPSB7XHJcbiAgICAgICAgaWRJbmR1c3RyaWE6IG51bGwsXHJcbiAgICAgICAgaWRVc3VhcmlvOiBudWxsLFxyXG4gICAgICAgIGlkU3RhdHVzOiBudWxsLFxyXG4gICAgICAgIGR0SW5pY2lvOiBudWxsLFxyXG4gICAgICAgIGR0RmltOiBudWxsLFxyXG4gICAgICAgIGlkQ2xpZW50ZTogbnVsbCxcclxuICAgICAgICBuZXdQYWdlOiBQQUdJTkFDQU8uUEVESURPLk5FV19QQUdFLFxyXG4gICAgICAgIHBhZ2VTaXplOiBQQUdJTkFDQU8uUEVESURPLlBBR0VfU0laRVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3RybC5kYXRlT3B0aW9ucyA9IHtcclxuICAgICAgICBmb3JtYXRZZWFyOiAneXl5eScsXHJcbiAgICAgICAgc3RhcnRpbmdEYXk6IDFcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN0cmwucG9wdXAgPSB7XHJcbiAgICAgICAgb3BlbmVkOiBmYWxzZVxyXG4gICAgICB9O1xyXG4gICAgfTtcclxuICB9XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBUYWJlbGFNb2R1bG8gPSBhbmd1bGFyLm1vZHVsZSgndGFiZWxhLm1vZHVsZScpO1xyXG5cclxuUGVkaWRvTW9kdWxvLmNvbXBvbmVudCgnY2FyZ2FUYWJlbGFDb21wb25lbnQnLCB7XHJcbiAgdGVtcGxhdGVVcmw6ICdtb2R1bGVzL3RhYmVsYS9jb21wb25lbnRzL2NhcmdhL3ZpZXdzL2NhcmdhVGFiZWxhLmh0bWwnLFxyXG4gIGJpbmRpbmdzOiB7XHJcbiAgICBsaXN0YUluZHVzdHJpYXM6ICc8J1xyXG4gIH0sXHJcbiAgY29udHJvbGxlckFzOiAnY3RybCcsXHJcbiAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRsb2cpIHtcclxuICAgIHZhciBjdHJsID0gdGhpcztcclxuICAgIHRoaXMuJG9uSW5pdCA9IGluaXQoKTtcclxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICRsb2cubG9nKCdpbml0IGNhcmdhIGRlIHRhYmVsYXMnKTtcclxuICAgIH07XHJcbiAgfVxyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgVXN1YXJpb01vZHVsbyA9IGFuZ3VsYXIubW9kdWxlKCd1c3VhcmlvLm1vZHVsZScpXHJcblxyXG5Vc3VhcmlvTW9kdWxvLmNvbXBvbmVudCgnY2FkYXN0cm9Vc3VhcmlvQ29tcG9uZW50Jywge1xyXG5cdHRlbXBsYXRlVXJsOiAnbW9kdWxlcy91c3VhcmlvL2NvbXBvbmVudHMvY2FkYXN0cm8vdmlld3MvY2FkYXN0cm9Vc3VhcmlvLmh0bWwnLFxyXG5cdGNvbnRyb2xsZXJBczogJ2N0cmwnLFxyXG5cdGJpbmRpbmdzOiB7XHJcbiAgICB1c3VhcmlvUGFyYUVkaXRhcjogJzwnXHJcbiAgfSxcclxuXHRjb250cm9sbGVyOiBmdW5jdGlvbiB1c3VhcmlvTW9kdWxvQ29udHJvbGxlcihcclxuXHRcdCRzdGF0ZSxcclxuXHRcdFVzdWFyaW9TZXJ2aWNlLFxyXG5cdFx0SW5kdXN0cmlhU2VydmljZSxcclxuXHRcdE5vdGlmaWNhdGlvblNlcnZpY2UsXHJcblx0XHRMb2dpblNlcnZpY2UsXHJcblx0XHRNb2RhbFNlcnZpY2VcclxuXHQpIHtcclxuXHJcblx0XHR0aGlzLnZtID0gdGhpcztcclxuXHJcblx0XHRpZiAodGhpcy52bS51c3VhcmlvUGFyYUVkaXRhcikge1xyXG5cdFx0XHR0aGlzLnZtLmNhZGFzdHJvID0gdGhpcy52bS51c3VhcmlvUGFyYUVkaXRhclxyXG5cdFx0XHR0aGlzLnZtLnNlbmhhT3JpZ2luYWwgPSBMb2dpblNlcnZpY2UuZGVjb2RlUGFzc3dvcmQodGhpcy52bS5jYWRhc3Ryby5zZW5oYS5zZW5oYTEpXHJcblx0XHRcdHRoaXMudm0uY2FkYXN0cm8uc2VuaGEuc2VuaGExXHJcblx0XHRcdHRoaXMudm0ucmVwcmVzZW50YWNvZXMgPSB0aGlzLnZtLnVzdWFyaW9QYXJhRWRpdGFyLnJlcHJlc2VudGFjb2VzXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnZtLmNhZGFzdHJvID0ge1xyXG5cdFx0XHRcdGF0aXZvOiB0cnVlXHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy52bS5yZXByZXNlbnRhY29lcyA9IFtdXHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy52bS5yZXByZXNlbnRhY2FvID0ge1xyXG5cdFx0XHRpbmR1c3RyaWE6IG51bGxcclxuXHRcdH1cclxuXHRcdHRoaXMudm0ubGlzdGFJbmR1c3RyaWEgPSBbXVxyXG5cdFx0dGhpcy52bS5zZW5oYUFsdGVyYWRhID0gZmFsc2VcclxuXHRcdHRoaXMudm0uaW1wb3J0YWNhbyA9IHtcclxuXHRcdFx0dXN1YXJpbzogbnVsbFxyXG5cdFx0fVxyXG5cclxuXHRcdFVzdWFyaW9TZXJ2aWNlLmxpc3RhUGVyZmlsKCkudGhlbigocmVzdWx0KSA9PiB7XHJcblx0XHRcdHRoaXMudm0ubGlzdGFQZXJmaWwgPSByZXN1bHRcclxuXHRcdH0pXHJcblxyXG5cdFx0dGhpcy52bS5zZWxlY2lvbmFUYWJSZXByZXNlbnRhY2FvID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0SW5kdXN0cmlhU2VydmljZS5nZXRJbmR1c3RyaWFzKCkudGhlbigocmVzdWx0KSA9PiB7XHJcblx0XHRcdFx0dGhpcy52bS5saXN0YUluZHVzdHJpYSA9IHJlc3VsdFxyXG5cdFx0XHR9KVxyXG5cdFx0XHRpZiAodGhpcy52bS5jYWRhc3Ryby5pZCkge1xyXG5cdFx0XHRcdFVzdWFyaW9TZXJ2aWNlLmJ1c2NhVXN1YXJpb0NhZGFzdHJvRHRvKHRoaXMudm0uY2FkYXN0cm8uaWQpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy52bS5yZXByZXNlbnRhY29lcyA9IHJlc3VsdC5yZXByZXNlbnRhY29lc1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnZtLnNlbGVjaW9uYVRhYlJlcHJlc2VudGFjYW9DbGllbnRlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0VXN1YXJpb1NlcnZpY2UuYnVzY2FVc3VhcmlvcygpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMudm0udXN1YXJpb3MgPSByZXN1bHQ7XHJcblx0XHRcdFx0dGhpcy52bS5ub21lVXN1YXJpb0Zvcm1hdGFkbyA9IGAke3RoaXMudm0uY2FkYXN0cm8uaWR9IC0gJHt0aGlzLnZtLmNhZGFzdHJvLm5vbWV9YDtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy52bS5jcmlhUmVwcmVzZW50YWNhbyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGxpc3RhRW5jb250cmFkb3MgPSAkLmdyZXAodGhpcy52bS5yZXByZXNlbnRhY29lcywgZnVuY3Rpb24gKGUsIGkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZS5pZEluZHVzdHJpYSA9PSB0aGlzLnZtLnJlcHJlc2VudGFjYW8uaW5kdXN0cmlhLmlkO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0aWYgKGxpc3RhRW5jb250cmFkb3MgJiYgbGlzdGFFbmNvbnRyYWRvcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5hbGVydCgnSW5kw7pzdHJpYSBqw6EgY2FkYXN0cmFkYSBwYXJhIG8gdXN1w6FyaW8uJylcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgcmVwcmVzZW50YWNhb0R0byA9IG5ldyBSZXByZXNlbnRhY2FvRHRvKHRoaXMudm0uY2FkYXN0cm8sIHRoaXMudm0ucmVwcmVzZW50YWNhby5pbmR1c3RyaWEpO1xyXG5cdFx0XHRcdHRoaXMudm0ucmVwcmVzZW50YWNvZXMucHVzaChyZXByZXNlbnRhY2FvRHRvKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy52bS5zYWx2YVVzdWFyaW8gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGFqdXN0ZXNDcmlwdG9ncmFmaWFTZW5oYSgpXHJcblx0XHRcdHRoaXMudm0uY2FkYXN0cm8ucmVwcmVzZW50YWNvZXMgPSB0aGlzLnZtLnJlcHJlc2VudGFjb2VzXHJcblx0XHRcdGlmICh2YWxpZGFTZW5oYSgpKSB7XHJcblx0XHRcdFx0VXN1YXJpb1NlcnZpY2Uuc2FsdmFVc3VhcmlvKHRoaXMudm0uY2FkYXN0cm8pLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy52bS5jYWRhc3RybyA9IHJlc3VsdFxyXG5cdFx0XHRcdFx0dGhpcy52bS5zZW5oYU9yaWdpbmFsID0gTG9naW5TZXJ2aWNlLmdldFBhc3N3b3JkKHRoaXMudm0uY2FkYXN0cm8uc2VuaGEuc2VuaGExKVxyXG5cdFx0XHRcdFx0dGhpcy52bS5zZW5oYUFsdGVyYWRhID0gZmFsc2VcclxuXHRcdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2Uuc3VjY2VzcygnVXN1w6FyaW8gY2FkYXN0cmFkbyBjb20gc3VjZXNzbyEnKVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcignU2VuaGFzIGluZm9ybWFkYXMgbsOjbyBzw6NvIGlndWFpcycpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnZtLmV4Y2x1aVVzdWFyaW8gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcblx0XHRcdFx0Y2xvc2VCdXR0b25UZXh0OiAnTsOjbycsXHJcblx0XHRcdFx0YWN0aW9uQnV0dG9uVGV4dDogJ1NpbScsXHJcblx0XHRcdFx0aGVhZGVyVGV4dDogJ0NvbmZpcm1hcicsXHJcblx0XHRcdFx0Ym9keVRleHQ6IGBBbyBFWENMVUlSIG8gdXN1w6FyaW8gbyBuw6NvIHNlcsOhIG1haXMgcG9zc8OtdmVsIGFjZXNzYXIgb3MgZGFkb3MgZGVzdGUhIENvbmZpcm1hP2BcclxuXHRcdFx0fTtcclxuXHRcdFx0TW9kYWxTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHRcdFx0XHRVc3VhcmlvU2VydmljZS5idXNjYVVzdWFyaW9Qb3JJZCh0aGlzLnZtLmNhZGFzdHJvLmlkLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdFx0XHRyZXN1bHQuZXhjbHVpZG8gPSB0cnVlXHJcblx0XHRcdFx0XHRVc3VhcmlvU2VydmljZS5zYWx2YVVzdWFyaW8ocmVzdWx0LCBmdW5jdGlvbiAodXN1YXJpbykge1xyXG5cdFx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLnN1Y2Nlc3MoXCJVc3XDoXJpbyBFWENMVcONRE8gY29tIHN1Y2Vzc28hXCIpXHJcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygndXN1YXJpby5wZXNxdWlzYScpXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy52bS5zaW5hbGl6YVNlbmhhQWx0ZXJhZGEgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHRoaXMudm0uc2VuaGFBbHRlcmFkYSA9IHRydWVcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnZtLmlzVmVuZGVkb3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiBMb2dpblNlcnZpY2UuaXNWZW5kZWRvcigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudm0uaW1wb3J0YXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh0aGlzLnZtLmNhZGFzdHJvLmlkID09PSB0aGlzLnZtLmltcG9ydGFjYW8udXN1YXJpby5pZCkge1xyXG5cdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuYWxlcnQoJ07Do28gw6kgcG9zc8OtdmVsIGltcG9ydGFyIHBhcmEgbyBtZXNtbyB1c3XDoXJpbycpXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGltcG9ydGFjYW9Vc3VhcmlvRHRvID0ge1xyXG5cdFx0XHRcdGlkVXN1YXJpb09yaWdlbTogdGhpcy52bS5pbXBvcnRhY2FvLnVzdWFyaW8uaWQsXHJcblx0XHRcdFx0aWRVc3VhcmlvRGVzdGlubzogdGhpcy52bS5jYWRhc3Ryby5pZFxyXG5cdFx0XHR9XHJcblx0XHRcdFVzdWFyaW9TZXJ2aWNlLnZlcmlmaWNhckltcG9ydGFjYW9CYXNlVXN1YXJpbyhpbXBvcnRhY2FvVXN1YXJpb0R0bykudGhlbigocmVzdWx0KSA9PiB7XHJcblx0XHRcdFx0dmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuXHRcdFx0XHRcdGNsb3NlQnV0dG9uVGV4dDogJ0NhbmNlbGFyJyxcclxuXHRcdFx0XHRcdGFjdGlvbkJ1dHRvblRleHQ6ICdJbXBvcnRhcicsXHJcblx0XHRcdFx0XHRoZWFkZXJUZXh0OiBgRGFkb3MgYSBzZXJlbSBpbXBvcnRhZG9zYCxcclxuXHRcdFx0XHRcdGJvZHlEYXRhTGlzdDogcmVzdWx0XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHR2YXIgbW9kYWxEZWZhdWx0cyA9IHtcclxuXHRcdFx0XHRcdGJhY2tkcm9wOiB0cnVlLFxyXG5cdFx0XHRcdFx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0XHRcdFx0XHRtb2RhbEZhZGU6IHRydWUsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ21vZHVsZXMvbW9kYWwvbW9kYWxJbXBvcnRhY2FvQ2xpZW50ZXNVc3VhcmlvLmh0bWwnLFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0TW9kYWxTZXJ2aWNlLnNob3dNb2RhbChtb2RhbERlZmF1bHRzLCBtb2RhbE9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKG1vZGFsUmVzdWx0KSB7XHJcblx0XHRcdFx0XHRVc3VhcmlvU2VydmljZS5pbXBvcnRhckJhc2VVc3VhcmlvKHJlc3VsdCwgZnVuY3Rpb24gKGltcG9ydGFjYW9SZXN1bHQpIHtcclxuXHRcdFx0XHRcdFx0Tm90aWZpY2F0aW9uU2VydmljZS5zdWNjZXNzKGBJbXBvcnRhw6fDo28gcmVhbGl6YWRhIGNvbSBzdWNlc3NvISAke2ltcG9ydGFjYW9SZXN1bHR9IGNsaWVudGVzIGltcG9ydGFkb3MuYClcclxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCd1c3VhcmlvLmVkaWNhbycsIHsgJ2lkJzogdGhpcy52bS5jYWRhc3Ryby5pZCB9KVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnZtLnZlcmlmaWNhVXN1YXJpb0NhZGFzdHJhZG9Qb3JMb2dpbiA9ICgpID0+IHtcclxuXHRcdFx0VXN1YXJpb1NlcnZpY2UuYnVzY2FVc3VhcmlvUG9yTG9naW4odGhpcy52bS5jYWRhc3Ryby5sb2dpbikudGhlbihyZXN1bHQgPT4ge1xyXG5cdFx0XHRcdGlmIChyZXN1bHQpIHtcclxuXHRcdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2UuZXJyb3IoJ0xvZ2luIGRvIHVzdcOhcmlvIGrDoSBleGlzdGVudGUnKTtcclxuXHRcdFx0XHRcdHRoaXMudm0uY2FkYXN0cm8ubG9naW4gPSBudWxsXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBhanVzdGVzQ3JpcHRvZ3JhZmlhU2VuaGEoKSB7XHJcblx0XHRcdGlmICh0aGlzLnZtLmNhZGFzdHJvLmlkKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMudm0uc2VuaGFBbHRlcmFkYSAmJiB0aGlzLnZtLnNlbmhhT3JpZ2luYWwgIT0gdGhpcy52bS5jYWRhc3Ryby5zZW5oYS5zZW5oYTEpIHtcclxuXHRcdFx0XHRcdHRoaXMudm0uY2FkYXN0cm8uc2VuaGEuc2VuaGExID0gTG9naW5TZXJ2aWNlLmdldFBhc3N3b3JkRW5jb2RlZCh0aGlzLnZtLmNhZGFzdHJvLnNlbmhhLnNlbmhhMSlcclxuXHRcdFx0XHRcdHRoaXMudm0uY2FkYXN0cm8uc2VuaGEuc2VuaGEyID0gTG9naW5TZXJ2aWNlLmdldFBhc3N3b3JkRW5jb2RlZCh0aGlzLnZtLmNhZGFzdHJvLnNlbmhhLnNlbmhhMilcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy52bS5jYWRhc3Ryby5zZW5oYS5zZW5oYTEgPSBMb2dpblNlcnZpY2UuZ2V0UGFzc3dvcmRFbmNvZGVkKHRoaXMudm0uY2FkYXN0cm8uc2VuaGEuc2VuaGExKVxyXG5cdFx0XHRcdHRoaXMudm0uY2FkYXN0cm8uc2VuaGEuc2VuaGEyID0gTG9naW5TZXJ2aWNlLmdldFBhc3N3b3JkRW5jb2RlZCh0aGlzLnZtLmNhZGFzdHJvLnNlbmhhLnNlbmhhMilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHZhbGlkYVNlbmhhKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy52bS5jYWRhc3Ryby5zZW5oYS5zZW5oYTEgPT09IHRoaXMudm0uY2FkYXN0cm8uc2VuaGEuc2VuaGEyXHJcblx0XHR9XHJcblx0fVxyXG59KVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgVXN1YXJpb01vZHVsbyA9IGFuZ3VsYXIubW9kdWxlKCd1c3VhcmlvLm1vZHVsZScpO1xyXG5cclxuVXN1YXJpb01vZHVsby5jb21wb25lbnQoJ3Blc3F1aXNhVXN1YXJpb0NvbXBvbmVudCcsIHtcclxuXHR0ZW1wbGF0ZVVybDogJ21vZHVsZXMvdXN1YXJpby9jb21wb25lbnRzL3Blc3F1aXNhL3ZpZXdzL3Blc3F1aXNhLmh0bWwnLFxyXG5cdGNvbnRyb2xsZXJBczogJ2N0cmwnLFxyXG5cdGNvbnRyb2xsZXI6IGZ1bmN0aW9uIHVzdWFyaW9Nb2R1bG9Db250cm9sbGVyKCRzdGF0ZSwgVXN1YXJpb1NlcnZpY2UsIE5vdGlmaWNhdGlvblNlcnZpY2UsIE1vZGFsU2VydmljZSkge1xyXG5cdFx0dmFyIGNoYW5nZUZpbHRlciA9IHRydWVcclxuXHJcblx0XHR0aGlzLnZtID0gdGhpc1xyXG5cclxuXHRcdHRoaXMudm0udG90YWxJdGVucyA9IDBcclxuXHRcdHRoaXMudm0uZmlsdGVyID0ge1xyXG5cdFx0XHRwYWdlU2l6ZTogMTAsXHJcblx0XHRcdG5ld1BhZ2U6IDFcclxuXHRcdH1cclxuXHRcdC8vIFNFICRldmVudCBGT1IgUEFTU0FETyBPIENPTVBPTkVOVEUgTkFPIFBFUkRFIE8gRk9DT1xyXG5cdFx0dGhpcy52bS5wZXNxdWlzYSA9ICgkZXZlbnQpID0+IHtcclxuXHRcdFx0aWYgKCFjaGFuZ2VGaWx0ZXIpIHtcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cdFx0XHRVc3VhcmlvU2VydmljZS5wZXNxdWlzYSh0aGlzLnZtLmZpbHRlcikudGhlbigocmVzdWx0KSA9PiB7XHJcblx0XHRcdFx0dGhpcy52bS5yZXN1bHQgPSByZXN1bHRcclxuXHRcdFx0XHR0aGlzLnZtLmxpc3RhID0gdGhpcy52bS5yZXN1bHQuY29udGVudDtcclxuXHRcdFx0XHR0aGlzLnZtLnRvdGFsSXRlbnMgPSB0aGlzLnZtLnJlc3VsdC50b3RhbEVsZW1lbnRzXHJcblx0XHRcdFx0aWYgKHRoaXMudm0ubGlzdGEpIHtcclxuXHRcdFx0XHRcdGNoYW5nZUZpbHRlciA9IGZhbHNlXHJcblx0XHRcdFx0XHRpZiAoJGV2ZW50ICYmICRldmVudC50YXJnZXQpIHtcclxuXHRcdFx0XHRcdFx0JGV2ZW50LnRhcmdldC5mb2N1cygpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudm0udmVyaWZpY2FQZXNxdWlzYSA9ICgkZXZlbnQpID0+IHtcclxuXHRcdFx0aWYgKCRldmVudC5jaGFyQ29kZSA9PT0gRU5URVJfS0VZX0NPREUpIHtcclxuXHRcdFx0XHR0aGlzLnZtLnBlc3F1aXNhKCRldmVudClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vQVBFTkFTIEVGRVRVQSBBIFBFU1FVSVNBIFNFIE8gRklMVFJPIEZPSSBBTFRFUkFET1xyXG5cdFx0dGhpcy52bS5jaGFuZ2VGaWVsZCA9ICgpID0+IHtcclxuXHRcdFx0Y2hhbmdlRmlsdGVyID0gdHJ1ZVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudm0ubXVkYVBhZ2luYSA9ICgpID0+IHtcclxuXHRcdFx0Y2hhbmdlRmlsdGVyID0gdHJ1ZVxyXG5cdFx0XHR0aGlzLnZtLnBlc3F1aXNhKClcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnZtLmVkaXRhclJlZ2lzdHJvID0gKGlkKSA9PiB7XHJcblx0XHRcdCRzdGF0ZS5nbygnbWFpbi51c3VhcmlvLmVkaWNhbycsIHsgJ2lkJzogaWQgfSlcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnZtLm5vdm9Vc3VhcmlvID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkc3RhdGUuZ28oJ3VzdWFyaW8uY2FkYXN0cm8nKVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudm0uaW5hdGl2YXJVc3VhcmlvID0gZnVuY3Rpb24gKGlkKSB7XHJcblx0XHRcdHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcblx0XHRcdFx0Y2xvc2VCdXR0b25UZXh0OiAnTsOjbycsXHJcblx0XHRcdFx0YWN0aW9uQnV0dG9uVGV4dDogJ1NpbScsXHJcblx0XHRcdFx0aGVhZGVyVGV4dDogJ0NvbmZpcm1hcicsXHJcblx0XHRcdFx0Ym9keVRleHQ6IGBBbyBERVNBQklMSVRBUiBvIHVzdcOhcmlvIG8gbWVzbW8gbsOjbyBwb2RlcsOhIG1haXMgYWNlc3NhciBvIHNpc3RlbWEhIENvbmZpcm1hP2BcclxuXHRcdFx0fTtcclxuXHRcdFx0TW9kYWxTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHRcdFx0XHRVc3VhcmlvU2VydmljZS5idXNjYVVzdWFyaW9Qb3JJZChpZCkudGhlbigocmVzdWx0KSA9PiB7XHJcblx0XHRcdFx0XHRyZXN1bHQuYXRpdm8gPSBmYWxzZVxyXG5cdFx0XHRcdFx0VXN1YXJpb1NlcnZpY2Uuc2FsdmFVc3VhcmlvKHJlc3VsdCkudGhlbigodXN1YXJpbykgPT4ge1xyXG5cdFx0XHRcdFx0XHROb3RpZmljYXRpb25TZXJ2aWNlLnN1Y2Nlc3MoYFVzdcOhcmlvICR7dXN1YXJpby5ub21lfSBERVNBQklMSVRBRE8gY29tIHN1Y2Vzc28hYClcclxuXHRcdFx0XHRcdFx0Y2hhbmdlRmlsdGVyID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHR0aGlzLnZtLnBlc3F1aXNhKClcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnZtLmV4Y2x1aXJVc3VhcmlvID0gZnVuY3Rpb24gKGlkKSB7XHJcblx0XHRcdHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcblx0XHRcdFx0Y2xvc2VCdXR0b25UZXh0OiAnTsOjbycsXHJcblx0XHRcdFx0YWN0aW9uQnV0dG9uVGV4dDogJ1NpbScsXHJcblx0XHRcdFx0aGVhZGVyVGV4dDogJ0NvbmZpcm1hcicsXHJcblx0XHRcdFx0Ym9keVRleHQ6IGBBbyBFWENMVUlSIG8gdXN1w6FyaW8gbyBuw6NvIHNlcsOhIG1haXMgcG9zc8OtdmVsIGFjZXNzYXIgb3MgZGFkb3MgZGVzdGUhIENvbmZpcm1hP2BcclxuXHRcdFx0fTtcclxuXHRcdFx0TW9kYWxTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHRcdFx0XHRVc3VhcmlvU2VydmljZS5idXNjYVVzdWFyaW9Qb3JJZChpZCkudGhlbigocmVzdWx0KSA9PiB7XHJcblx0XHRcdFx0XHRyZXN1bHQuZXhjbHVpZG8gPSB0cnVlXHJcblx0XHRcdFx0XHRVc3VhcmlvU2VydmljZS5zYWx2YVVzdWFyaW8ocmVzdWx0KS50aGVuKCh1c3VhcmlvKSA9PiB7XHJcblx0XHRcdFx0XHRcdE5vdGlmaWNhdGlvblNlcnZpY2Uuc3VjY2VzcyhgVXN1w6FyaW8gJHt1c3VhcmlvLm5vbWV9IEVYQ0xVw41ETyBjb20gc3VjZXNzbyFgKVxyXG5cdFx0XHRcdFx0XHRjaGFuZ2VGaWx0ZXIgPSB0cnVlXHJcblx0XHRcdFx0XHRcdHRoaXMudm0ucGVzcXVpc2EoKVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudm0ucGVzcXVpc2EoKVxyXG5cclxuXHR9XHJcblxyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnR2VyZW5jaWFkb3JGaW5hbmNlaXJvRmxlY2hhVmVuZGFzJykuY29tcG9uZW50KCdjaGF0Jywge1xyXG5cdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL2NoYXQvY2hhdC10ZW1wbGF0ZS5odG1sJyxcclxuXHRiaW5kaW5nczoge1xyXG5cdFx0b2JzZXJ2YWNvZXM6ICc9JyxcclxuXHRcdGF1dGg6ICc8JyxcclxuXHRcdGlkUGVkaWRvOiAnPCdcclxuXHR9LFxyXG5cdGNvbnRyb2xsZXJBczogJ2N0cmwnLFxyXG5cdGNvbnRyb2xsZXI6IGZ1bmN0aW9uIGNoYXRDb250cm9sbGVyKCkge1xyXG5cdFx0dmFyIGN0cmwgPSB0aGlzXHJcblx0XHRjdHJsLmFkaWNpb25hT2JzZXJ2YWNhbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRjb25zdCBkYXRhQ3JpYWNhbyA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcclxuXHRcdFx0bGV0IG1zZyA9IHtcclxuXHRcdFx0XHRpZE9ic2VydmFjYW86IHVuZGVmaW5lZCxcclxuXHRcdFx0XHRpZFBlZGlkbzogY3RybC5pZFBlZGlkbyxcclxuXHRcdFx0XHRkYXRhQ3JpYWNhbzogZGF0YUNyaWFjYW8sXHJcblx0XHRcdFx0ZGF0YUxlaXR1cmE6IHVuZGVmaW5lZCxcclxuXHRcdFx0XHRsaWRvOiB1bmRlZmluZWQsXHJcblx0XHRcdFx0aWRVc3VhcmlvOiBjdHJsLmF1dGguaWQsXHJcblx0XHRcdFx0b2JzZXJ2YWNhbzogY3RybC5vYnNlcnZhY2FvLFxyXG5cdFx0XHRcdG5vbWVVc3VhcmlvOiBjdHJsLmF1dGgubm9tZVxyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnNvbGUubG9nKCdtc2c6ICcsIG1zZyk7XHJcblx0XHRcdGN0cmwub2JzZXJ2YWNvZXMucHVzaChtc2cpO1xyXG5cdFx0XHRjb25zb2xlLmxvZygnY3RybC5vYnNlcnZhY29lczogJywgY3RybC5vYnNlcnZhY29lcyk7XHJcblx0XHJcblx0XHRcdC8vIExpbXBhIGNhbXBvIGRhIHRlbGFcclxuXHRcdFx0Y3RybC5vYnNlcnZhY2FvID0gdW5kZWZpbmVkXHJcblx0XHR9XHJcblx0fVxyXG59KSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ0dlcmVuY2lhZG9yRmluYW5jZWlyb0ZsZWNoYVZlbmRhcycpLmNvbXBvbmVudCgnY2hhdE1lc3NhZ2UnLCB7XHJcblx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvY2hhdC1tZXNzYWdlL2NoYXQtbWVzc2FnZS10ZW1wbGF0ZS5odG1sJyxcclxuXHRjb250cm9sbGVyOiBmdW5jdGlvbiBjaGF0TWVzc2FnZUNvbnRyb2xsZXIoKSB7XHJcblx0XHR2YXIgY3RybCA9IHRoaXNcclxuXHJcblx0XHRjdHJsLmNhbGN1bGFUZW1wbyA9IGZ1bmN0aW9uIChtc2cpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBEYXRlKG1zZy5kYXRhQ3JpYWNhbykudG9Mb2NhbGVTdHJpbmcoKVxyXG5cdFx0fVxyXG5cclxuXHRcdGN0cmwudmVyaWZpY2FVc3VhcmlvTG9nYWRvID0gZnVuY3Rpb24gKG1zZykge1xyXG5cdFx0XHRpZiAoY3RybC5hdXRoLmlkID09IG1zZy5pZFVzdWFyaW8pIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fSxcclxuXHRiaW5kaW5nczoge1xyXG5cdFx0bWVuc2FnZW5zOiAnPScsXHJcblx0XHRhdXRoOiAnPCdcclxuXHR9LFxyXG5cdGNvbnRyb2xsZXJBczogJ2N0cmwnXHJcbn0pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFBlZGlkb01vZHVsbyA9IGFuZ3VsYXIubW9kdWxlKCdwZWRpZG8ubW9kdWxlJyk7XHJcblxyXG5QZWRpZG9Nb2R1bG8uY29tcG9uZW50KCdkYWRvc1BlZGlkb0NvbXBvbmVudCcsIHtcclxuICB0ZW1wbGF0ZVVybDogJ21vZHVsZXMvcGVkaWRvL2NvbXBvbmVudHMvY2FkYXN0cm8vZGFkb3NQZWRpZG8vdmlld3MvZGFkb3NQZWRpZG8uaHRtbCcsXHJcbiAgYmluZGluZ3M6IHtcclxuICAgIGxpc3RhSW5kdXN0cmlhczogJzwnXHJcbiAgfSxcclxuICBjb250cm9sbGVyQXM6ICdjdHJsJyxcclxuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJGxvZywgQ2xpZW50ZVNlcnZpY2UsICRzY29wZSwgVGFiZWxhU2VydmljZSwgSW5kdXN0cmlhUHJhem9TZXJ2aWNlLCAkc3RhdGUsIFBlZGlkb1NlcnZpY2UpIHtcclxuICAgIHZhciBjdHJsID0gdGhpcztcclxuICAgIHRoaXMuJG9uSW5pdCA9IGluaXQoY3RybCk7XHJcblxyXG4gICAgY3RybC5zZWxlY2lvbmFJbmR1c3RyaWEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNvbnN0IGJ1c2NhQ2xpZW50ZXNEdG8gPSB7XHJcbiAgICAgICAgaWRVc3VhcmlvOiBjdHJsLmlkVXN1YXJpbyxcclxuICAgICAgICBpZEluZHVzdHJpYTogY3RybC5wZWRpZG8uaW5kdXN0cmlhLmlkXHJcbiAgICAgIH1cclxuICAgICAgQ2xpZW50ZVNlcnZpY2UuZ2V0Q2xpZW50ZXNQb3JSZXByZXNlbnRhY2FvKGJ1c2NhQ2xpZW50ZXNEdG8pLnRoZW4oKGNsaWVudGVEdG9MaXN0KSA9PiB7XHJcbiAgICAgICAgY3RybC5saXN0YUNsaWVudGVzID0gY2xpZW50ZUR0b0xpc3Q7XHJcbiAgICAgIH0pO1xyXG4gICAgICBUYWJlbGFTZXJ2aWNlLmdldFRhYmVsYXNQb3JJbmR1c3RyaWEoY3RybC5wZWRpZG8uaW5kdXN0cmlhLmlkKS50aGVuKCh0YWJlbGFEdG9MaXN0KSA9PiB7XHJcbiAgICAgICAgY3RybC5saXN0YVRhYmVsYXMgPSB0YWJlbGFEdG9MaXN0XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjdHJsLnNlbGVjaW9uYUNsaWVudGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRsb2cubG9nKGN0cmwucGVkaWRvLmNsaWVudGUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjdHJsLnNlbGVjaW9uYVRhYmVsYSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgY29uc3QgaW5kdXN0cmlhUHJhem9TZWFyY2hEdG8gPSB7XHJcbiAgICAgICAgaWRJbmR1c3RyaWE6IGN0cmwucGVkaWRvLmluZHVzdHJpYS5pZCxcclxuICAgICAgICBpZENsaWVudGU6IGN0cmwucGVkaWRvLmNsaWVudGUuaWRcclxuICAgICAgfVxyXG4gICAgICBJbmR1c3RyaWFQcmF6b1NlcnZpY2UuZ2V0SW5kdXN0cmlhUHJhem9DbGllbnRlUHJhem8oaW5kdXN0cmlhUHJhem9TZWFyY2hEdG8pLnRoZW4oKGluZHVzdHJpYVByYXpvUGVkaWRvRHRvTGlzdCkgPT4ge1xyXG4gICAgICAgIGN0cmwubGlzdGFQcmF6b3MgPSBpbmR1c3RyaWFQcmF6b1BlZGlkb0R0b0xpc3Q7XHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG5cclxuICAgIGN0cmwub3BlbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBjdHJsLnBvcHVwLm9wZW5lZCA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIGN0cmwuZ2VyYVBlZGlkbyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBQZWRpZG9TZXJ2aWNlLnNldFBlZGlkb0F0aXZvKGN0cmwucGVkaWRvKTtcclxuICAgICAgJHN0YXRlLmdvKCdtYWluLnBlZGlkby5jYWRhc3Ryby5pdGVucycsIHsncGVkaWRvJzogY3RybC5wZWRpZG99KTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdChjdHJsKSB7XHJcbiAgICAgIGN0cmwucGVkaWRvID0ge31cclxuICAgICAgY3RybC5wZWRpZG8uZGF0YVBlZGlkbyA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICBjdHJsLnBvc3N1aVBlZGlkb0F0aXZvID0gZmFsc2U7XHJcbiAgICAgIGN0cmwuaWRVc3VhcmlvID0gJHNjb3BlLiRwYXJlbnQuJHJlc29sdmUuYXV0aC5pZDtcclxuICAgICAgY3RybC5wZWRpZG8uZGF0YUVudHJlZ2EgPSBnZXJhRGF0YUVudHJlZ2EoKTtcclxuXHJcbiAgICAgIGN0cmwuZGF0ZU9wdGlvbnMgPSB7XHJcbiAgICAgICAgZm9ybWF0WWVhcjogJ3l5eXknLFxyXG4gICAgICAgIG1pbkRhdGU6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgc3RhcnRpbmdEYXk6IDFcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN0cmwucG9wdXAgPSB7XHJcbiAgICAgICAgb3BlbmVkOiBmYWxzZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3RybC5wcm9wb3N0YU9wdGlvbnMgPSBbXHJcbiAgICAgICAge2lkOiAwLCB0ZXh0OiAnTsOjbyd9LFxyXG4gICAgICAgIHtpZDogMSwgdGV4dDogJ1NpbSd9XHJcbiAgICAgIF07XHJcblxyXG4gICAgICBjdHJsLmNhcmdhT3B0aW9ucyA9IFtcclxuICAgICAgICB7dmFsdWU6IDEsIHRleHQ6ICdCYXRpZGEnfSxcclxuICAgICAgICB7dmFsdWU6IDIsIHRleHQ6ICdQYWxldGl6YWRhJ31cclxuICAgICAgXTtcclxuXHJcbiAgICAgIGN0cmwucHJvcG9zdGEgPSB7XHJcbiAgICAgICAgc2VsZWNpb25hZG8gOiBudWxsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjdHJsLmNhcmdhID0ge1xyXG4gICAgICAgIHNlbGVjaW9uYWRvOiBudWxsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VyYURhdGFFbnRyZWdhKCkge1xyXG4gICAgICBsZXQgZGF0YUF0dWFsID0gbmV3IERhdGUoKTsgXHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRhQXR1YWwuZ2V0RnVsbFllYXIoKSwgZGF0YUF0dWFsLmdldE1vbnRoKCksIGRhdGFBdHVhbC5nZXREYXRlKCkgKyAxKTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUGVkaWRvTW9kdWxvID0gYW5ndWxhci5tb2R1bGUoJ3BlZGlkby5tb2R1bGUnKTtcclxuXHJcblBlZGlkb01vZHVsby5jb21wb25lbnQoJ2VkaWNhb1BlZGlkb0NvbXBvbmVudCcsIHtcclxuICB0ZW1wbGF0ZVVybDogJ21vZHVsZXMvcGVkaWRvL2NvbXBvbmVudHMvY2FkYXN0cm8vZWRpY2FvUGVkaWRvL3ZpZXdzL2VkaWNhb1BlZGlkby5odG1sJyxcclxuICBiaW5kaW5nczoge1xyXG4gICAgcGVkaWRvOiAnPCdcclxuICB9LFxyXG4gIGNvbnRyb2xsZXJBczogJ2N0cmwnLFxyXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkbG9nLCAkc2NvcGUsIEluZHVzdHJpYVByYXpvU2VydmljZSwgJHN0YXRlLCBQZWRpZG9TZXJ2aWNlLCBUYWJlbGFTZXJ2aWNlLCAkZmlsdGVyLCBQZWRpZG9DYWxjdWxvU2VydmljZSkge1xyXG4gICAgdmFyIGN0cmwgPSB0aGlzO1xyXG4gICAgdGhpcy4kb25Jbml0ID0gaW5pdChjdHJsKTtcclxuXHJcbiAgICBjdHJsLm9wZW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGN0cmwucG9wdXAub3BlbmVkID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgY3RybC5nZXJhUGVkaWRvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBQZWRpZG9TZXJ2aWNlLnNldFBlZGlkb0F0aXZvKGN0cmwucGVkaWRvKTtcclxuICAgICAgJHN0YXRlLmdvKCdtYWluLnBlZGlkby5jYWRhc3Ryby5pdGVucycsIHsgJ3BlZGlkbyc6IGN0cmwucGVkaWRvIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuJHdhdGNoKCdjdHJsLnBlZGlkby50YWJlbGEnLCBmdW5jdGlvbiAobm92YVRhYmVsYSwgYW50aWdhVGFiZWxhKSB7XHJcbiAgICAgIGlmIChub3ZhVGFiZWxhLmlkICE9PSBhbnRpZ2FUYWJlbGEuaWQpIHtcclxuICAgICAgICAkZmlsdGVyKCdpdGVuc0FkaWNpb25hZG9zRmlsdGVyJywgbnVsbCkoYW50aWdhVGFiZWxhLml0ZW5zKS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgJGZpbHRlcignZmlsdGVyJykobm92YVRhYmVsYS5pdGVucywgeyBjb2RpZ286IGl0ZW0uY29kaWdvIH0pLmZvckVhY2gobm92b0l0ZW0gPT4ge1xyXG4gICAgICAgICAgICBub3ZvSXRlbVsnaW5zZXJpZG8nXSA9IGl0ZW1bJ2luc2VyaWRvJ11cclxuICAgICAgICAgICAgbm92b0l0ZW1bJ3F1YW50aWRhZGVTb2xpY2l0YWRhJ10gPSBpdGVtWydxdWFudGlkYWRlU29saWNpdGFkYSddXHJcbiAgICAgICAgICAgIG5vdm9JdGVtWydkZXNjb250byddID0gaXRlbVsnZGVzY29udG8nXVxyXG4gICAgICAgICAgICBQZWRpZG9DYWxjdWxvU2VydmljZS5pbmljaWFsaXphUHJlY28obm92b0l0ZW0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdChjdHJsKSB7XHJcbiAgICAgIFRhYmVsYVNlcnZpY2UuZ2V0VGFiZWxhc1BvckluZHVzdHJpYShjdHJsLnBlZGlkby5pbmR1c3RyaWEuaWQpLnRoZW4oKHRhYmVsYUR0b0xpc3QpID0+IHtcclxuICAgICAgICBjdHJsLmxpc3RhVGFiZWxhcyA9IHRhYmVsYUR0b0xpc3RcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBpbmR1c3RyaWFQcmF6b1NlYXJjaER0byA9IHtcclxuICAgICAgICBpZEluZHVzdHJpYTogY3RybC5wZWRpZG8uaW5kdXN0cmlhLmlkLFxyXG4gICAgICAgIGlkQ2xpZW50ZTogY3RybC5wZWRpZG8uY2xpZW50ZS5pZFxyXG4gICAgICB9XHJcbiAgICAgIEluZHVzdHJpYVByYXpvU2VydmljZS5nZXRJbmR1c3RyaWFQcmF6b0NsaWVudGVQcmF6byhpbmR1c3RyaWFQcmF6b1NlYXJjaER0bykudGhlbigoaW5kdXN0cmlhUHJhem9QZWRpZG9EdG9MaXN0KSA9PiB7XHJcbiAgICAgICAgY3RybC5saXN0YVByYXpvcyA9IGluZHVzdHJpYVByYXpvUGVkaWRvRHRvTGlzdDtcclxuICAgICAgfSlcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdlcmFEYXRhRW50cmVnYShkYXRhRW50cmVnYSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRhRW50cmVnYSlcclxuICAgICAgfVxyXG5cclxuICAgICAgY3RybC5wZWRpZG8uZGF0YUVudHJlZ2EgPSBnZXJhRGF0YUVudHJlZ2EoY3RybC5wZWRpZG8uZGF0YUVudHJlZ2EpO1xyXG5cclxuICAgICAgY3RybC5kYXRlT3B0aW9ucyA9IHtcclxuICAgICAgICBmb3JtYXRZZWFyOiAneXl5eScsXHJcbiAgICAgICAgbWluRGF0ZTogbmV3IERhdGUoKSxcclxuICAgICAgICBzdGFydGluZ0RheTogMVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3RybC5wb3B1cCA9IHtcclxuICAgICAgICBvcGVuZWQ6IGZhbHNlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjdHJsLnByb3Bvc3RhT3B0aW9ucyA9IFtcclxuICAgICAgICB7IGlkOiAwLCB0ZXh0OiAnTsOjbycgfSxcclxuICAgICAgICB7IGlkOiAxLCB0ZXh0OiAnU2ltJyB9XHJcbiAgICAgIF07XHJcblxyXG4gICAgICBjdHJsLmNhcmdhT3B0aW9ucyA9IFtcclxuICAgICAgICB7IHZhbHVlOiAxLCB0ZXh0OiAnQmF0aWRhJyB9LFxyXG4gICAgICAgIHsgdmFsdWU6IDIsIHRleHQ6ICdQYWxldGl6YWRhJyB9XHJcbiAgICAgIF07XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFBlZGlkb01vZHVsbyA9IGFuZ3VsYXIubW9kdWxlKCdwZWRpZG8ubW9kdWxlJyk7XHJcblxyXG5QZWRpZG9Nb2R1bG8uY29tcG9uZW50KCdpdGVuc1BlZGlkb0NvbXBvbmVudCcsIHtcclxuICB0ZW1wbGF0ZVVybDogJ21vZHVsZXMvcGVkaWRvL2NvbXBvbmVudHMvY2FkYXN0cm8vaXRlbnNQZWRpZG8vdmlld3MvaXRlbnNQZWRpZG8uaHRtbCcsXHJcbiAgYmluZGluZ3M6IHtcclxuICAgIHBlZGlkbzogJz0nXHJcbiAgfSxcclxuICBjb250cm9sbGVyQXM6ICdjdHJsJyxcclxuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJGxvZywgJHN0YXRlLCBQZWRpZG9TZXJ2aWNlLCBQZWRpZG9DYWxjdWxvU2VydmljZSkge1xyXG4gICAgdmFyIGN0cmwgPSB0aGlzO1xyXG5cclxuICAgIGN0cmwuc2VsZWNpb25hUHJvZHV0byA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgY3RybC5wZWRpZG8udGFiZWxhLml0ZW5zLmZpbmRJbmRleCgoaXRlbSkgPT4ge1xyXG4gICAgICAgIGlmIChpdGVtLmlkID09PSBjdHJsLnByb2R1dG8uc2VsZWNpb25hZG8uaWQpIHtcclxuICAgICAgICAgIGN0cmwuaW5pY2lhbGl6YVByZWNvKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGN0cmwuaXNQZWRpZG9Qcm9wb3N0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIGN0cmwucGVkaWRvLnByb3Bvc3RhLmlkID09PSBQRURJRE9fUFJPUE9TVEE7XHJcbiAgICB9O1xyXG5cclxuICAgIGN0cmwuYWRpY2lvbmFQcm9kdXRvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBjdHJsLnByb2R1dG8uc2VsZWNpb25hZG8uaW5zZXJpZG8gPSB0cnVlO1xyXG4gICAgICBjdHJsLnByb2R1dG8uc2VsZWNpb25hZG8gPSBudWxsO1xyXG4gICAgICBQZWRpZG9TZXJ2aWNlLnNldFBlZGlkb0F0aXZvKGN0cmwucGVkaWRvKTtcclxuICAgICAgY3RybC52YWxvclRvdGFsUGVkaWRvID0gUGVkaWRvQ2FsY3Vsb1NlcnZpY2UuZ2V0VmFsb3JUb3RhbFBlZGlkbyhjdHJsLnBlZGlkbyk7XHJcbiAgICB9XHJcblxyXG4gICAgY3RybC5lZGl0YXJQcm9kdXRvID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgZGVsZXRlIGl0ZW0uaW5zZXJpZG87XHJcbiAgICAgIGN0cmwucHJvZHV0by5zZWxlY2lvbmFkbyA9IGl0ZW07XHJcbiAgICB9XHJcblxyXG4gICAgY3RybC5yZW1vdmVQcm9kdXRvID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgZGVsZXRlIGl0ZW0uaW5zZXJpZG87XHJcbiAgICAgIFBlZGlkb1NlcnZpY2Uuc2V0UGVkaWRvQXRpdm8oY3RybC5wZWRpZG8pO1xyXG4gICAgfVxyXG5cclxuICAgIGN0cmwudm9sdGFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAkc3RhdGUuZ28oJ21haW4ucGVkaWRvLmNhZGFzdHJvLmVkaWNhbycpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0cmwuZmluYWxpemFyUGVkaWRvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAkc3RhdGUuZ28oJ21haW4ucGVkaWRvLmNhZGFzdHJvLnJlc3VtbycpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0cmwuYWx0ZXJhUHJlY29TZW1JbXBvc3RvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBQZWRpZG9DYWxjdWxvU2VydmljZS5hbHRlcmFQcmVjb1NlbUltcG9zdG8oY3RybC5wcm9kdXRvLnNlbGVjaW9uYWRvKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHJsLmFsdGVyYVByZWNvQ29tSW1wb3N0byA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgUGVkaWRvQ2FsY3Vsb1NlcnZpY2UuYWx0ZXJhUHJlY29Db21JbXBvc3RvKGN0cmwucHJvZHV0by5zZWxlY2lvbmFkbyk7XHJcbiAgICB9XHJcblxyXG4gICAgY3RybC5hbHRlcmFEZXNjb250byA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgUGVkaWRvQ2FsY3Vsb1NlcnZpY2UuYWx0ZXJhRGVzY29udG8oY3RybC5wcm9kdXRvLnNlbGVjaW9uYWRvKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHJsLmluaWNpYWxpemFQcmVjbyA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgIFBlZGlkb0NhbGN1bG9TZXJ2aWNlLmluaWNpYWxpemFQcmVjbyhpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRvbkluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGN0cmwucHJvZHV0byA9IHtcclxuICAgICAgICBzZWxlY2lvbmFkbzogbnVsbFxyXG4gICAgICB9O1xyXG4gICAgICBjdHJsLnZhbG9yVG90YWxQZWRpZG8gPSBQZWRpZG9DYWxjdWxvU2VydmljZS5nZXRWYWxvclRvdGFsUGVkaWRvKGN0cmwucGVkaWRvKTtcclxuICAgICAgY3RybC5lZGl0YW5kb0l0ZW0gPSBudWxsXHJcbiAgICAgICRsb2cubG9nKCdwZWRpZG86ICcsIGN0cmwucGVkaWRvKTtcclxuICAgIH07XHJcbiAgfVxyXG59KTtcclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBQZWRpZG9Nb2R1bG8gPSBhbmd1bGFyLm1vZHVsZSgncGVkaWRvLm1vZHVsZScpO1xyXG5cclxuUGVkaWRvTW9kdWxvLmNvbXBvbmVudCgncmVzdW1vUGVkaWRvQ29tcG9uZW50Jywge1xyXG4gIHRlbXBsYXRlVXJsOiAnbW9kdWxlcy9wZWRpZG8vY29tcG9uZW50cy9jYWRhc3Ryby9yZXN1bW9QZWRpZG8vdmlld3MvcmVzdW1vUGVkaWRvLmh0bWwnLFxyXG4gIGJpbmRpbmdzOiB7XHJcbiAgICBwZWRpZG86ICc9J1xyXG4gIH0sXHJcbiAgY29udHJvbGxlckFzOiAnY3RybCcsXHJcbiAgY29udHJvbGxlciA6IGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgUGVkaWRvQ2FsY3Vsb1NlcnZpY2UsIFBlZGlkb1NlcnZpY2UpIHtcclxuICAgIHZhciBjdHJsID0gdGhpcztcclxuXHJcbiAgICBjdHJsLnZvbHRhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBQZWRpZG9TZXJ2aWNlLnNldFBlZGlkb0F0aXZvKGN0cmwucGVkaWRvKTtcclxuICAgICAgJHN0YXRlLmdvKCdtYWluLnBlZGlkby5jYWRhc3Ryby5pdGVucycpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJG9uSW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgY3RybC52YWxvclRvdGFsUGVkaWRvQ29tSW1wb3N0byA9IFBlZGlkb0NhbGN1bG9TZXJ2aWNlLmdldFZhbG9yVG90YWxQZWRpZG8oY3RybC5wZWRpZG8pXHJcbiAgICAgIGN0cmwudmFsb3JUb3RhbFBlZGlkb1NlbUltcG9zdG8gPSBQZWRpZG9DYWxjdWxvU2VydmljZS5nZXRWYWxvclRvdGFsUGVkaWRvU2VtSW1wb3N0byhjdHJsLnBlZGlkbylcclxuICAgICAgY3RybC50b3RhbEl0ZW5zID0gUGVkaWRvQ2FsY3Vsb1NlcnZpY2UuZ2V0VG90YWxJdGVucyhjdHJsLnBlZGlkbylcclxuICAgICAgY3RybC5hdXRoID0gJHNjb3BlLiRwYXJlbnQuJHJlc29sdmUuYXV0aFxyXG4gICAgICBpZighY3RybC5wZWRpZG8ub2JzZXJ2YWNvZXNQZWRpZG9EdG8pIHtcclxuICAgICAgICBjdHJsLnBlZGlkby5vYnNlcnZhY29lc1BlZGlkb0R0byA9IFtdO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufSk7XHJcblxyXG4iXX0=
