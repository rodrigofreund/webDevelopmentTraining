'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('resumoPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/resumoPedido/views/resumoPedido.html',
  controller : () => {
    this.vm = this;
  }
});

