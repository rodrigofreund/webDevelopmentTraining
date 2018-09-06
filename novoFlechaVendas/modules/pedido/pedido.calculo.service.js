'use strict';

var PedidoModule = angular.module('pedido.module');

PedidoModule.factory('PedidoCalculoService', ['$filter',
  function ($filter) {

    var service = {};

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

    service.getValorImposto = function (item) {
      return item.preco * (item.st + item.ipi);
    }

    service.getValorDesconto = function (item) {
      return item.preco * item.desconto;
    }

    service.alteraPrecoSemImposto = function (item) {
      let diferenca = item.preco - item.precoSemImposto;
      let desconto = diferenca / item.preco;
      item.desconto = desconto;
      item.precoComImposto = item.precoSemImposto + item.valorImposto;
      item.precoUnitarioComImposto = item.precoComImposto / item.quantidade;
      item.precoUnitarioSemImposto = item.precoSemImposto / item.quantidade;
    }

    service.alteraPrecoComImposto = function (item) {
      let diferenca = item.preco + item.valorImposto - item.precoComImposto;
      let desconto = diferenca / (item.preco + item.valorImposto);
      item.desconto = desconto;
      item.precoSemImposto = item.precoComImposto - item.valorImposto;
      item.precoUnitarioComImposto = item.precoComImposto / item.quantidade;
      item.precoUnitarioSemImposto = item.precoSemImposto / item.quantidade;
    }

    service.alteraDesconto = function (item) {
      item.precoComImposto = item.preco - service.getValorDesconto(item) + service.getValorImposto(item);
      item.precoSemImposto = item.preco - service.getValorDesconto(item);
      item.precoUnitarioComImposto = item.precoComImposto / item.quantidade;
      item.precoUnitarioSemImposto = item.precoSemImposto / item.quantidade;
    }

    service.inicializaPreco = function (item) {
      if (!item.desconto) {
        item.desconto = 0;
      }
      if (!item.quantidadeSolicitada) {
        item.quantidadeSolicitada = 1;
      }
      item.valorImposto = service.getValorImposto(item);
      item.precoComImposto = item.preco + item.valorImposto - service.getValorDesconto(item);
      item.precoSemImposto = item.preco - service.getValorDesconto(item);
      item.precoUnitarioComImposto = item.precoComImposto / item.quantidade;
      item.precoUnitarioSemImposto = item.precoSemImposto / item.quantidade;
    }

    return service;
  }
]);