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