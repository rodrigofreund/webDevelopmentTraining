'use strict';

var PedidoModule = angular.module('pedido.module');

PedidoModule.factory('PedidoService', ['HttpService', '$filter',
  function (HttpService, $filter) {
    var service = {};
    const SUBPATH = 'service/pedido';

    const URL_PEDIDO_SALVAR = `${SUBPATH}/salvaPedido`;
    const URL_PEDIDO_ATUALIZAR_STATUS = `${SUBPATH}/atualizarStatusPedido`;
    const URL_PEDIDO_BUSCAR_POR_CRITERIA = `${SUBPATH}/getPedidosPorCriteria`;
    const URL_PEDIDO_BUSCAR_ITENS = `${SUBPATH}/getItensPedido`;
    const URL_PEDIDO_BUSCAR_PEDIDO_POR_ID = `${SUBPATH}/getPedido`;
    const URL_PEDIDO_BUSCAR_LISTA_STATUS_PEDIDO = `${SUBPATH}/getListaStatusPedido`;
    const URL_PEDIDO_BUSCAR_OBSERVACOES_PEDIDO = `${SUBPATH}/getObservacoesPedido`;
    const URL_PEDIDO_ADICIONAR_OBSERVACOES_PEDIDO = `${SUBPATH}/setObservacoesPedido`;
    const URL_PEDIDO_BUSCAR_ULTIMAR_VENDAS_ITEM = `${SUBPATH}/getUltimasVendasItem`;

    service.salvaPedido = (pedidoDto) => {
      return HttpService.httpPost(URL_PEDIDO_SALVAR, pedidoDto);
    };

    service.atualizarStatusPedido = (atualizaStatusPedidoDto) => {
      return HttpService.httpPost(URL_PEDIDO_ATUALIZAR_STATUS, atualizaStatusPedidoDto);
    };

    service.getPedidosPorCriteria = (filtroPedidoDto) => {
      return HttpService.httpPost(URL_PEDIDO_BUSCAR_POR_CRITERIA, filtroPedidoDto);
    };

    service.getItensPedido = (idPedido) => {
      return HttpService.httpPost(URL_PEDIDO_BUSCAR_ITENS, idPedido);
    };

    service.getPedido = (idPedido) => {
      return HttpService.httpPost(URL_PEDIDO_BUSCAR_PEDIDO_POR_ID, idPedido);
    };

    service.getListaStatusPedido = () => {
      return HttpService.httpGet(URL_PEDIDO_BUSCAR_LISTA_STATUS_PEDIDO);
    };

    service.getObservacoesPedido = (idPedido) => {
      return HttpService.httpGet(URL_PEDIDO_BUSCAR_OBSERVACOES_PEDIDO, idPedido);
    };

    service.setObservacoesPedido = (observacaoPedidoUpdateDto) => {
      return HttpService.httpGet(URL_PEDIDO_ADICIONAR_OBSERVACOES_PEDIDO, observacaoPedidoUpdateDto);
    };

    service.getUltimasVendasItem = (ultimasVendasItemSearchDto) => {
      return HttpService.httpGet(URL_PEDIDO_BUSCAR_ULTIMAR_VENDAS_ITEM, ultimasVendasItemSearchDto);
    };

    service.setPedidoAtivo = function (pedidoAtivo) {
      localStorage.setItem('pedidoAtivo', angular.toJson(pedidoAtivo));
    }

    service.getPedidoAtivo = function () {
      return angular.fromJson(localStorage.getItem('pedidoAtivo'));
    }

    service.removePedidoAtivo = function () {
      return localStorage.removeItem('pedidoAtivo');
    }

    service.getValorImposto = function (item) {
      return item.preco * (item.st + item.ipi);
    }

    service.getValorDesconto = function (item) {
      return item.preco * item.desconto;
    }

    service.getValorTotalPedido = function (pedido) {
      let total = 0;
      $filter('itensAdicionadosFilter', null)(pedido.tabela.itens).forEach(item => {
        total += item.precoComImposto * item.quantidadeSolicitada;
      });
      return total;
    }

    service.getValorTotalPedidoSemImposto = function (pedido) {
      let total = 0;
      $filter('itensAdicionadosFilter', null)(pedido.tabela.itens).forEach(item => {
        total += item.precoSemImposto * item.quantidadeSolicitada;
      });
      return total;
    }

    service.getTotalItens = function (pedido) {
      let total = 0;
      $filter('itensAdicionadosFilter', null)(pedido.tabela.itens).forEach(item => {
        total += item.quantidadeSolicitada;
      });
      return total;
    }

    return service;
  }
]);