angular.module('app').component('loginForm', {
  templateUrl: 'login-form/login-form.html',
  controller: loginFormController
})


function loginFormController(UsuarioService, $state) {
  var vm = this;

  vm.text = 'Login!'

  vm.doLogin = () => {
    UsuarioService.login(vm.usuario)
    $state.go('usuario-lista')
  }
}