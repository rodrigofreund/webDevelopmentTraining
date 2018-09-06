'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('itensPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/itensPedido/views/itensPedido.html',
  bindings: {
    pedido: '='
  },
  controllerAs: 'ctrl',
  controller: function ($log, $state, PedidoService, PedidoCalculoService) {
    var ctrl = this;

    ctrl.selecionaProduto = function () {
      ctrl.pedido.tabela.itens.findIndex((item) => {
        if (item.id === ctrl.produto.selecionado.id) {
          ctrl.inicializaPreco(item);
        }
      });
    };

    ctrl.isPedidoProposta = function () {
      return ctrl.pedido.proposta.id === PEDIDO_PROPOSTA;
    };

    ctrl.adicionaProduto = function () {
      ctrl.produto.selecionado.inserido = true;
      ctrl.produto.selecionado = null;
      PedidoService.setPedidoAtivo(ctrl.pedido);
      ctrl.valorTotalPedido = PedidoCalculoService.getValorTotalPedido(ctrl.pedido);
    }

    ctrl.editarProduto = function (item) {
      delete item.inserido;
      ctrl.produto.selecionado = item;
    }

    ctrl.removeProduto = function (item) {
      delete item.inserido;
      PedidoService.setPedidoAtivo(ctrl.pedido);
    }

    ctrl.voltar = function () {
      $state.go('main.pedido.cadastro.edicao');
    }

    ctrl.finalizarPedido = function () {
      $state.go('main.pedido.cadastro.resumo');
    }

    ctrl.alteraPrecoSemImposto = function () {
      PedidoCalculoService.alteraPrecoSemImposto(ctrl.produto.selecionado);
    }

    ctrl.alteraPrecoComImposto = function () {
      PedidoCalculoService.alteraPrecoComImposto(ctrl.produto.selecionado);
    }

    ctrl.alteraDesconto = function () {
      PedidoCalculoService.alteraDesconto(ctrl.produto.selecionado);
    }

    ctrl.inicializaPreco = function (item) {
      PedidoCalculoService.inicializaPreco(item);
    }

    this.$onInit = function () {
      ctrl.produto = {
        selecionado: null
      };
      ctrl.valorTotalPedido = PedidoCalculoService.getValorTotalPedido(ctrl.pedido);
      ctrl.editandoItem = null
      $log.log('pedido: ', ctrl.pedido);
    };
  }
});

