'use strict';

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
	.run(['$transitions', 'LoginService', ($transitions, LoginService) => {
		$transitions.onBefore({to:'main.cliente.cadastro'}, transition => {
			if (LoginService.getUsuario().vendedor) {
				return transition.router.stateService.target('main.cliente.cadastrobasico');
			  }
		});
		$transitions.onBefore({to:'main.cliente.edicao'}, transition => {
			if (LoginService.getUsuario().vendedor) {
				const paramsCopy = Object.assign({}, transition.params());
				return transition.router.stateService.target('main.cliente.edicaobasico', paramsCopy);
			  }
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

