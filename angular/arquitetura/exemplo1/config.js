var app = angular.module('app.module')

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider, UsuarioService) {

  var loginState = {
    name: 'login',
    url: '/',
    templateUrl: 'app/login.html',
    controller: function($scope, $state, UsuarioService) {
      $scope.doLogin = () => {
        //faz o login
        console.log('usuario: ', $scope.usuario)
        console.log('senha: ', $scope.senha)
        UsuarioService.login($scope.usuario)
        $state.go('app')
      }
    }
  }

  var appState = {
    name: 'app',
    url: '/app',
    templateUrl: 'app/dashboard.html',
    controller: function($scope) {

    },
    resolve : {
      auth : function(UsuarioService, $q, $timeout, $state) {
        var deferred = $q.defer();
        $timeout(function() {
          if (!UsuarioService.getLogged()) {
              $state.go('login')
              return deferred.reject('usuário não logado!');
          }
          else {
              return deferred.resolve(UsuarioService.getLogged());
          }
      });
      return deferred.promise;
      }
    }
  }
  $stateProvider.state(loginState)
  $stateProvider.state(appState)

  $urlRouterProvider.otherwise('/app')

}])
