var app = angular.module('app')

app.config(['$stateProvider', function($stateProvider) {

  var usuarioLoginState = {
    name: 'login',
    url: '/login',
    component: 'loginForm'
  }

  var usuarioListaState = {
      name: 'usuario-lista',
      url: '/',
      protected,
      component: 'usuarioList',
      resolve: {
        listaUsuarios : function($q, $timeout) {
          var deferred = $q.defer();
          $timeout(function(){
              deferred.resolve([{id:1, nome:'Carlos'}, {id:2, nome:'Pedro'}, {id:3, nome:'Ana'}, {id:4, nome:'João'}, {id:5, nome:'Maria'}]);
          }, 500);
          return deferred.promise;
        },
        auth : function(UsuarioService, $q, $timeout, $state) {
          var deferred = $q.defer();
          $timeout(function() {
            if (!UsuarioService.getLogged()) {
                return deferred.reject({redirectTo: 'login'});
            }
            else {
                return deferred.resolve(UsuarioService.getLogged());
            }
        });
        
        return deferred.promise;

        }
      }
  }

  $stateProvider.state(usuarioListaState)
  $stateProvider.state(usuarioLoginState)
}])