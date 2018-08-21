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