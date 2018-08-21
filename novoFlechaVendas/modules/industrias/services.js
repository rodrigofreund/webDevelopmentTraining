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