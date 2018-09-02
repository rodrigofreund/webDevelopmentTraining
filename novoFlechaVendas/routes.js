'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.config(function ($stateProvider) {
  const login = {
    name: 'login',
    url: '/',
    component: 'loginComponent'
  }
  const main = {
    name: 'main',
    url: '/main',
    component: 'mainComponent',
    abstract: true,
    resolve: {
      auth: (LoginService, $q, $timeout, $state) => {
        const deferred = $q.defer();
        $timeout(() => {
          if (LoginService.getUsuario()) {
            return deferred.resolve(LoginService.getUsuario());
          }
          $state.go('login');
          return deferred.reject('usuário não logado!');
        });
        return deferred.promise;
      }
    }
  }
  const dashboard = {
    name: 'main.dashboard',
    url: '/dashboard',
    component: 'dashboardComponent',
    resolve: {
      informacoes: (DashboardService, auth) => {
        return DashboardService.getInformacoesDashboardDto(auth.id);
      }
    }
  }
  $stateProvider.state(login)
  $stateProvider.state(main)
  $stateProvider.state(dashboard)
})
