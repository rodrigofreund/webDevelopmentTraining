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