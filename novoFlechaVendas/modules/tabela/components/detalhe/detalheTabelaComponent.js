'use strict';

var TabelaModulo = angular.module('tabela.module');

TabelaModulo.component('detalheTabelaComponent', {
  templateUrl: 'modules/tabela/components/detalhe/detalheTabela.html',
  bindings: {
    tabela: '<'
  },
  controllerAs: 'ctrl',
  controller:function() {
    var ctrl = this;
  }
})
