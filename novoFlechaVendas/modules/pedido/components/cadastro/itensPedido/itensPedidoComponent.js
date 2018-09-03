'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('itensPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/itensPedido/views/itensPedido.html',
  bindings: {
    pedido: '='
  },
  controller : function () {
    debugger
    var ctrl = this;
    this.$onInit = function() {
      console.log('pedido itens: ', ctrl.pedido);
    }

  }
});

