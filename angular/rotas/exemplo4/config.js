var app = angular.module('app')

app.config(['$stateProvider', function($stateProvider, $q, $timeout) {
  var usuarioState = {
    name: 'usuario',
    url: '/usuario',
    template:'<ui-view><ui-view/>',
    abstract: true
  }
  var usuarioCadastroState = {
      name: 'usuario.usuario-cadastro',
      url: '/cadastro',
      component: 'usuarioForm'
  }

  var usuarioListaState = {
      name: 'usuario.usuario-lista',
      url: '/lista',
      component: 'usuarioList',
      resolve: {
        listaUsuarios : function($q, $timeout) {
          var deferred = $q.defer();
          $timeout(function(){
              deferred.resolve([{id:1, nome:'Carlos'}, {id:2, nome:'Pedro'}, {id:3, nome:'Ana'}, {id:4, nome:'João'}, {id:5, nome:'Maria'}]);
          }, 500);
          return deferred.promise;
        }
      }
  }

  $stateProvider.state(usuarioState)
  $stateProvider.state(usuarioCadastroState)
  $stateProvider.state(usuarioListaState)
}])