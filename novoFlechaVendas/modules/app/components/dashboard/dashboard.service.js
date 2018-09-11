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
