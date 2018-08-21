'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.component('dashboardComponent', {
	controller: function dashboardController() {
    console.log('aqui');
  },
  templateUrl: 'app/components/dashboard/dashboard.html',
	bindings: {},
	controllerAs: 'ctrl',
});
