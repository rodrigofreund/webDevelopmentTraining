'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.component('dashboardComponent', {
	controller: function dashboardController($log) {
    var vm = this;
  },
  bindings: {
    informacoes: '<'
  },
  templateUrl: 'modules/app/components/dashboard/dashboard.html',
	controllerAs: 'ctrl',
});
