'use strict'

angular.module('GerenciadorFinanceiroFlechaVendas')

	.factory('IndustriaService', ['HttpService',
		(HttpService) => {

			var service = {};

			const SUBPATH = 'service/industria'

			service.getIndustriaCliente = (idIndustria, idCliente) => {
				return HttpService.httpPost(SUBPATH + '/getIndustriaCliente', { 'idIndustria': idIndustria, 'idCliente': idCliente });
			}

			service.getTabelasIndustria = (idIndustria) => {
				return HttpService.httpPost(SUBPATH + '/getTabelasPorIndustria', idIndustria);
			}

			service.getIndustriasUsuario = (idUsuario) => {
				return HttpService.httpPost(SUBPATH + '/getIndustriasUsuario', idUsuario);
			}

			service.getIndustrias = () => {
				return HttpService.httpGet(SUBPATH + '/getIndustrias')
			}

			service.salvaIndustriaPrazo = (industriaPrazoDto) => {
				return HttpService.httpPost(SUBPATH + '/salvaIndustriaPrazo', industriaPrazoDto);
			}

			service.getPrazosIndustria = (idIndustria) => {
				return HttpService.httpGet(SUBPATH + '/getIndustriaPrazo', { 'idIndustria': idIndustria });
			}

			service.excluirPrazosIndustria = (idIndustriaPrazo) => {
				return HttpService.httpGet(SUBPATH + '/removerIndustriaPrazo', { ' idIndustriaPrazo ': idIndustriaPrazo });
			}

			return service;
		}
	]);