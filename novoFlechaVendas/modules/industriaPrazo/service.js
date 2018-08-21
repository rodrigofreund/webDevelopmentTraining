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