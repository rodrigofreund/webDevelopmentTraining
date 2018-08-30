'use strict';

var ClienteModulo = angular.module('cliente.module');

ClienteModulo.component('cadastroClienteComponent', {
  templateUrl: 'modules/cliente/components/cadastro/views/cadastroCliente.html',
  bindings: {
    clienteParaEditar: '<',
  },
  controller : () => {
    this.vm = this;
  }
});