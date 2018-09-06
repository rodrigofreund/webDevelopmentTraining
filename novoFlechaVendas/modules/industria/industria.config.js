'use strict';
var IndustriaModule = angular.module('industria.module');

IndustriaModule.config(function($stateProvider) {
  var industria = {
    name: 'main.industria',
    url: '/industria',
    abstract: true,
  };
  var cadastroPrazo = {
    name: 'main.industria.prazo',
    url: '/cadastro-prazo',
    component: 'cadastroPrazoComponent',
    resolve: {
      listaIndustrias: function (IndustriaService) {
        return IndustriaService.getIndustrias();
      },
    }
  };
  $stateProvider.state(industria);
  $stateProvider.state(cadastroPrazo);
});

