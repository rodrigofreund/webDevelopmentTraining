'use strict'

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

app.filter('propsFilter', function() {
		return function(items, props) {
			var out = [];

			if (angular.isArray(items)) {
				var keys = Object.keys(props);
				items.forEach(function(item) {
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
