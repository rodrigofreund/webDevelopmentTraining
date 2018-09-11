'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.component('loginComponent', {
	controller: function loginController($state, LoginService) {
    let vm = this;
    vm.doLogin = () => {
      LoginService.doLogin(vm.login, vm.senha).then((data) => {
        $state.go('main.dashboard')
      })
    }
  },
  templateUrl: 'modules/app/components/login/login.html',
	bindings: {},
	controllerAs: 'ctrl',
});
