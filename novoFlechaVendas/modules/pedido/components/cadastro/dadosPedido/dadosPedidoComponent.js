'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('dadosPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/dadosPedido/views/dadosPedido.html',
  controller : () => {
    this.vm = this;
  }
});

