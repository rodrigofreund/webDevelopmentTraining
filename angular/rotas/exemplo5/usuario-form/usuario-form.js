angular.module('app').component('usuarioForm', {
  templateUrl: 'usuario-form/usuario-form.html',
  controller: usuarioFormController
})

function usuarioFormController() {
  var vm = this;

  vm.text = 'Formulário do Usuário!'
}