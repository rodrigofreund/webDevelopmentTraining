angular.module('app').component('usuarioList', {
  templateUrl: 'usuario-list/usuario-list.html',
  controller: usuarioListController,
  bindings: {
    listaUsuarios :'<'
  }
})

function usuarioListController() {
  var vm = this;

  vm.text = 'Listagem de Usuários!'
}