var app = angular.module('app')

app.config(['$stateProvider', function($stateProvider, $q, $timeout) {
  var helloState = {
      name: 'hello',
      url: '/hello',
      component: 'hello'
  }

  var aboutState = {
      name: 'about',
      url: '/about',
      component: 'about',
      resolve: {
        title : function($q, $timeout) {
          var deferred = $q.defer();
          $timeout(function(){
              deferred.resolve('About title');
          }, 500);
          return deferred.promise;
        }
      }
  }

  $stateProvider.state(helloState)
  $stateProvider.state(aboutState)
}])