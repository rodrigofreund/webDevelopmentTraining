'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.config(function($stateProvider, $locationProvider, $urlRouterProvider){
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  const loginState = {
    name: 'loginState',
    url: '/',
    component: 'loginComponent'
  };
  const dashboardState = {
    name: 'dashboardState',
    url: '/dashboard',
    component: 'dashboardComponent'
  }
  $stateProvider.state(loginState)
  $stateProvider.state(dashboardState)
})