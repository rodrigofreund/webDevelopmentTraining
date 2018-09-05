'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('itensPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/itensPedido/views/itensPedido.html',
  bindings: {
    pedido: '='
  },
  controllerAs: 'ctrl',
  controller: function ($log, $state, PedidoService) {
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
      ctrl.valorTotalPedido = PedidoService.getValorTotalPedido(ctrl.pedido);
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
      let diferenca = ctrl.produto.selecionado.preco - ctrl.produto.selecionado.precoSemImposto;
      let desconto = diferenca / ctrl.produto.selecionado.preco;
      ctrl.produto.selecionado.desconto = desconto;
      ctrl.produto.selecionado.precoComImposto = ctrl.produto.selecionado.precoSemImposto + ctrl.produto.selecionado.valorImposto;
      ctrl.produto.selecionado.precoUnitarioComImposto = ctrl.produto.selecionado.precoComImposto / ctrl.produto.selecionado.quantidade;
      ctrl.produto.selecionado.precoUnitarioSemImposto = ctrl.produto.selecionado.precoSemImposto / ctrl.produto.selecionado.quantidade;
    }

    ctrl.alteraPrecoComImposto = function () {
      let diferenca = ctrl.produto.selecionado.preco + ctrl.produto.selecionado.valorImposto - ctrl.produto.selecionado.precoComImposto;
      let desconto = diferenca / (ctrl.produto.selecionado.preco + ctrl.produto.selecionado.valorImposto);
      ctrl.produto.selecionado.desconto = desconto;
      ctrl.produto.selecionado.precoSemImposto = ctrl.produto.selecionado.precoComImposto - ctrl.produto.selecionado.valorImposto;
      ctrl.produto.selecionado.precoUnitarioComImposto = ctrl.produto.selecionado.precoComImposto / ctrl.produto.selecionado.quantidade;
      ctrl.produto.selecionado.precoUnitarioSemImposto = ctrl.produto.selecionado.precoSemImposto / ctrl.produto.selecionado.quantidade;
    }

    ctrl.alteraDesconto = function () {
      ctrl.produto.selecionado.precoComImposto = ctrl.produto.selecionado.preco - PedidoService.getValorDesconto(ctrl.produto.selecionado) + ctrl.produto.selecionado.valorImposto;
      ctrl.produto.selecionado.precoSemImposto = ctrl.produto.selecionado.preco - PedidoService.getValorDesconto(ctrl.produto.selecionado);
      ctrl.produto.selecionado.precoUnitarioComImposto = ctrl.produto.selecionado.precoComImposto / ctrl.produto.selecionado.quantidade;
      ctrl.produto.selecionado.precoUnitarioSemImposto = ctrl.produto.selecionado.precoSemImposto / ctrl.produto.selecionado.quantidade;
    }

    ctrl.inicializaPreco = function (item) {
      item.desconto = 0;
      item.valorImposto = PedidoService.getValorImposto(item);
      item.precoComImposto = item.preco + item.valorImposto - item.desconto;
      item.precoSemImposto = item.preco - item.desconto;
      item.quantidadeSolicitada = 1;
      item.precoUnitarioComImposto = item.precoComImposto / item.quantidade;
      item.precoUnitarioSemImposto = item.precoSemImposto / item.quantidade;
    }

    this.$onInit = function () {
      ctrl.produto = {
        selecionado: null
      };
      ctrl.valorTotalPedido = PedidoService.getValorTotalPedido(ctrl.pedido);
      ctrl.editandoItem = null
      $log.log('pedido: ', ctrl.pedido);
    };
  }
});

