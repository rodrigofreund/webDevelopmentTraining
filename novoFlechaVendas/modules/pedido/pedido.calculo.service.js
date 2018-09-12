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

    //RECALCULA VALORES APOS ALTERAÇÃO DO PREÇO SEM IMPOSTO
    service.alteraPrecoSemImposto = function (item) {
      let diferenca = item.preco - item.precoSemImposto;
      let desconto = diferenca / item.preco;
      item.desconto = desconto;
      item.precoComImposto = calculaPrecoComImposto(item);
      calculaPrecoUnitario(item);
    }

    //RECALCULA VALORES APOS ALTERAÇÃO DO PREÇO COM IMPOSTO
    service.alteraPrecoComImposto = function (item) {
      let diferenca = item.preco + item.valorImposto - item.precoComImposto;
      let desconto = diferenca / (item.preco + item.valorImposto);
      item.desconto = desconto;
      item.precoSemImposto = calculaPrecoSemImposto(item);
      calculaPrecoUnitario(item);
    }

    //RECALCULA VALORES APOS ALTERAÇÃO DO DESCONTO
    service.alteraDesconto = function (item) {
      item.precoComImposto = calculaPrecoComImposto(item);
      item.precoSemImposto = calculaPrecoSemImposto(item);
      calculaPrecoUnitario(item);
    }

    //RECALCULA VALORES APOS ALTERAÇÃO DO PRECO UNITÁRIO COM IMPOSTO
    service.alteraPrecoUnitarioComImposto = function(item) {
      item.precoComImposto = item.precoUnitarioComImposto * item.quantidade;
      service.alteraPrecoComImposto(item);
    }

    //RECALCULA VALORES APOS ALTERAÇÃO DO PRECO UNITÁRIO SEM IMPOSTO
    service.alteraPrecoUnitarioSemImposto = function(item) {
      item.precoComImposto = item.precoUnitarioSemImposto * item.quantidade;
      service.alteraPrecoSemImposto(item);
    }

    //INICIALIZA OS VALORES DO ITEM PARA OS CÁLCULOS
    service.inicializaPreco = function (item) {
      if (!item.quantidadeSolicitada) {
        item.quantidadeSolicitada = 1;
      }
      item.desconto = 0;
      item.valorImposto = getValorImposto(item);
      item.precoComImposto = calculaPrecoComImposto(item);
      item.precoSemImposto = calculaPrecoSemImposto(item);
      calculaPrecoUnitario(item);
    }

    function getValorImposto (item) {
      return item.preco * (item.st + item.ipi);
    }

    function getValorDesconto (item) {
      return item.preco * item.desconto;
    }

    function getValorDescontoComImposto (item) {
      return (item.preco + getValorImposto(item)) * item.desconto;
    }

    function calculaPrecoComImposto(item) {
      return round(item.preco - getValorDescontoComImposto(item) + getValorImposto(item));
    }

    function calculaPrecoSemImposto(item) {
      return round(item.preco - getValorDesconto(item));
    }

    function calculaPrecoUnitario(item) {
      item.precoUnitarioComImposto = round(item.precoComImposto / item.quantidade);
      item.precoUnitarioSemImposto = round(item.precoSemImposto / item.quantidade);
    }

    function round(value) {
      return Math.round(value * 100) / 100;
    }

    return service;
  }
]);