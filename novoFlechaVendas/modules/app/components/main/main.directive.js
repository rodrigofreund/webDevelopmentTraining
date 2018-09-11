'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.directive('restrict', function (LoginService) {
  return {
    restrict: 'A',
    prioriry: 100000,
    scope: false,
    link: function () {
    },
    compile: function (element, attr) {
      var accessDenied = true;
      var user = LoginService.getUsuario();

      var attributes = attr.access.split(" ");
      for (var i in attributes) {
        if (user.perfil.nome === attributes[i]) {
          accessDenied = false;
        }
      }
      if (accessDenied) {
        element.children().remove();
        element.remove();
      }
    }
  }
});
