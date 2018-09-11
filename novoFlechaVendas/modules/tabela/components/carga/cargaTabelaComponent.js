'use strict';

var TabelaModulo = angular.module('tabela.module');

PedidoModulo.component('cargaTabelaComponent', {
  templateUrl: 'modules/tabela/components/carga/views/cargaTabela.html',
  bindings: {
    listaIndustrias: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log) {
    var ctrl = this;
    this.$onInit = init();
    function init() {
      $log.log('init carga de tabelas');
    };
  }
});
