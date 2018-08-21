'use strict'

var UsuarioModulo = angular.module('UsuarioModulo')

UsuarioModulo.component('usuarioModulo', {
  controllerAs: 'ctrl',
  bindings: {
    id : '='
  },
	controller: function usuarioModuloController($scope, $state, AuthenticationService) {

    if(AuthenticationService.isVendedor()) {
      $scope.isVendedor = true
      $state.go('usuario.edicao', {'id': AuthenticationService.getUsuario().id})
    } else {
      $scope.isAdministrador = true
      if(this.id == 1) {
        $state.go('usuario.cadastro')
      } else if(this.id == 2) {
        $state.go('usuario.pesquisa')
      } else if(this.id == 3){
        $state.go('usuario.edicao')
      }
    }
  },
  template: '<div ui-view></div>',
})
