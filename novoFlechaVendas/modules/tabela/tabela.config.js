'use strict';

var TabelaModulo = angular.module('tabela.module');

TabelaModulo.config(($stateProvider) => {
  var tabela = {
    name: 'main.tabela',
    url: '/tabela',
    abstract: true
  };
  var cargaTabela = {
    name: 'main.tabela.carga',
    url: '/carga',
    component: 'cargaTabelaComponent',
    resolve: {
      listaIndustrias: function (IndustriaService) {
        return IndustriaService.getIndustrias();
      },
    }
  };
  $stateProvider.state(tabela);
  $stateProvider.state(cargaTabela);
});