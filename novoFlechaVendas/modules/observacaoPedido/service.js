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
