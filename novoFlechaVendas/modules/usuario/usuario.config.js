'use strict'

var UsuarioModulo = angular.module('usuario.module')

UsuarioModulo.config(function($stateProvider){
  var usuario = {
      name: 'main.usuario',
      abstract: true,
      url:'/usuario',
  }
  var pesquisaUsuarioState = {
    name:'main.usuario.pesquisa',
    url: '/pesquisa',
    component: 'pesquisaUsuarioComponent'
  } 
  var cadastroUsuarioState = {
    name:'main.usuario.cadastro',
    url: '/cadastro',
    component: 'cadastroCompletoUsuarioComponent'
  }
  var edicaoUsuarioState = {
    name:'main.usuario.edicao',
    url: '/edicao',
    component:'CadastroCompletoUsuario',
    params: {
      id: {id: null}
    }
  }
  $stateProvider.state(usuario)
  $stateProvider.state(pesquisaUsuarioState)
  $stateProvider.state(cadastroUsuarioState)
  $stateProvider.state(edicaoUsuarioState)
})
