'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('resumoPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/resumoPedido/views/resumoPedido.html',
  bindings: {
    pedido: '='
  },
  controllerAs: 'ctrl',
  controller : function ($log, $scope, $state, PedidoService) {
    var ctrl = this;

    ctrl.voltar = function() {
      PedidoService.setPedidoAtivo(ctrl.pedido);
      $state.go('main.pedido.cadastro.itens');
    }

    this.$onInit = function () {
      ctrl.valorTotalPedidoComImposto = PedidoService.getValorTotalPedido(ctrl.pedido)
      ctrl.valorTotalPedidoSemImposto = PedidoService.getValorTotalPedidoSemImposto(ctrl.pedido)
      ctrl.totalItens = PedidoService.getTotalItens(ctrl.pedido)
      ctrl.auth = $scope.$parent.$resolve.auth
      if(!ctrl.pedido.observacoesPedidoDto) {
        ctrl.pedido.observacoesPedidoDto = [];
      }
    };
  }
});

