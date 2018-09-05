'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('itensPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/itensPedido/views/itensPedido.html',
  bindings: {
    pedido: '='
  },
  controllerAs: 'ctrl',
  controller: function ($log, $scope, PedidoService) {
    var ctrl = this;

    ctrl.selecionaProduto = function () {
      ctrl.pedido.tabela.itens.findIndex((element) => {
        element.precoFinal = element.preco + element.preco * (element.st + element.ipi);
        element.precoSemImposto = element.preco;
        element.desconto = 0;
        element.quantidadeSolicitada = 1;
        element.precoUnitarioComImposto = element.precoFinal / element.quantidade;
        element.precoUnitarioSemImposto = element.preco / element.quantidade;
      });
      $log.log('pedido itens modificados: ', ctrl.pedido.tabela.itens);
    };

    ctrl.isPedidoProposta = function () {
      return ctrl.pedido.proposta.id === PEDIDO_PROPOSTA;
    };

    ctrl.adicionaProduto = function () {
      ctrl.produto.selecionado.inserido = true;
      ctrl.produto.selecionado = null;
      PedidoService.setPedidoAtivo(ctrl.pedido);
    }

    ctrl.editarProduto = function (item) {
      delete item.inserido;
      ctrl.produto.selecionado = item;
    }

    ctrl.removeProduto = function (item) {
      delete item.inserido;
      PedidoService.setPedidoAtivo(ctrl.pedido);
    }

    this.$onInit = function () {
      ctrl.produto = {
        selecionado: null
      }
      $scope.$watch('ctrl.produto.selecionado', function(newValue, oldValue) {
        if(oldValue && !newValue) {
          $log.log('atualiza');
        }
      });
      ctrl.editandoItem = null
      $log.log('pedido: ', ctrl.pedido);
    };
  }
});

