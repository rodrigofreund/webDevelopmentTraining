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
    component: 'cadastroUsuarioComponent'
  }
  var edicaoUsuarioState = {
    name:'main.usuario.edicao',
    url: '/edicao/:id',
    component:'cadastroUsuarioComponent',
    resolve: {
      usuarioParaEditar: (UsuarioService, $stateParams, $q) => {
        const deferred = $q.defer();
        //efetuar busca pelo usuário
        if($stateParams.id) {
          UsuarioService.buscaUsuarioPorId($stateParams.id).then(usuarioDto => {
            deferred.resolve(usuarioDto);
          }, (error) => {
            deferred.reject(error);
          });
        } else {
          deferred.reject(null);
        }
        return deferred.promise;
        //verificar se há permissão
      }
    }
  }
  $stateProvider.state(usuario)
  $stateProvider.state(pesquisaUsuarioState)
  $stateProvider.state(cadastroUsuarioState)
  $stateProvider.state(edicaoUsuarioState)
});
