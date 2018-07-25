angular.module('app').component('usuarioDetail', {
  templateUrl: 'usuario-detail/usuario-detail.html',
  controller: usuarioDetailController
})

function usuarioDetailController() {
  var vm = this;

  vm.text = 'Detalhe do Usuário!'
}