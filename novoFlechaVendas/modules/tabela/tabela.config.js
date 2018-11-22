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
  var detalheTabela = {
    name: 'main.tabela.detalhe',
    url: '/detalhe/:idTabela',
    params: {
      idTabela : null
    },
    component: 'detalheTabelaComponent',
    resolve: {
      tabela: function (TabelaService, $stateParams) {
        return TabelaService.buscaTabelaPorId($stateParams.idTabela);
      },
    }
  };
  $stateProvider.state(tabela);
  $stateProvider.state(detalheTabela);
  $stateProvider.state(cargaTabela);
});