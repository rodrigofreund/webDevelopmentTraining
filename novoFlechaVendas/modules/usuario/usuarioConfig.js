'use strict'

var UsuarioModulo = angular.module('UsuarioModulo')

UsuarioModulo.config(function($stateProvider){
  var usuario = {
      name: 'usuario',
      abstract: true,
      url:'/usuario',
  }
  var pesquisaUsuarioState = {
    name:'usuario.pesquisa',
    template:'<pesquisa-usuario></pesquisa-usuario>'
  } 
  var cadastroUsuarioState = {
    name:'usuario.cadastro',
    template:'<cadastro-completo-usuario></cadastro-completo-usuario>'
  }
  var edicaoUsuarioState = {
    name:'usuario.edicao',
    template:'<cadastro-completo-usuario></cadastro-completo-usuario>',
    params: {
      id: {id: null}
    }
  }
  $stateProvider.state(usuario)
  $stateProvider.state(pesquisaUsuarioState)
  $stateProvider.state(cadastroUsuarioState)
  $stateProvider.state(edicaoUsuarioState)
})