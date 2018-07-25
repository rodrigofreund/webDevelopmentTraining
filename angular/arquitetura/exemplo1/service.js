var app = angular.module('app.module')

app.factory('UsuarioService', function() {
  var service = {}
  service.login = (user) => {
    sessionStorage.setItem('login', JSON.stringify(user))
  }
  service.getLogged = () => {
    var data = sessionStorage.getItem('login')
    return data
  }
  return service;
})