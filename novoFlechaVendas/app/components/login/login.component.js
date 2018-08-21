'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.component('loginComponent', {
	controller: function loginController() {
    console.log('aqui');
  },
  templateUrl: 'app/components/login/login.html',
	bindings: {},
	controllerAs: 'ctrl',
});
