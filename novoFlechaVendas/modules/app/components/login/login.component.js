'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.component('loginComponent', {
  bindings: {
    dadosAutenticacao: '<'
  },
	controller: function loginController($state, LoginService, NotificationService) {
    var ctrl = this;

    this.$onInit = init();

    ctrl.doLogin = () => {
      LoginService.doLogin(ctrl.login, ctrl.senha).then((data) => {
        if(ctrl.salvarDadosAutenticacao) {
          LoginService.salvaDadosAutenticacao(ctrl.login, ctrl.senha);
        } else {
          LoginService.limpaDadosAutenticacao();
        }
        $state.go('main.dashboard')
      }, (error) => {
        NotificationService.error(error);
      })
    }

    function init() {
      if(ctrl.dadosAutenticacao) {
        ctrl.login = ctrl.dadosAutenticacao.login;
        ctrl.senha = ctrl.dadosAutenticacao.senha;
        ctrl.salvarDadosAutenticacao = true;
      }
    }
  },
  templateUrl: 'modules/app/components/login/login.html',
	controllerAs: 'ctrl',
});
