'use strict'

var ClienteModulo = angular.module('cliente.module');

ClienteModulo.component('pesquisaClienteComponent', {
  templateUrl: 'modules/cliente/components/pesquisa/views/pesquisaCliente.html',
  controller : () => {
    this.vm = this;
  }
});