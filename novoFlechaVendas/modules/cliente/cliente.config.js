'use strict'

var ClienteModulo = angular.module('cliente.module');

ClienteModulo.config(function($stateProvider){
  var cliente = {
    name: 'main.cliente',
    abstract: true,
    url: '/cliente',
  };
  var pesquisaCliente = {
    name: 'main.cliente.pesquisa',
    url: 'pesquisa',
    component: 'pesquisaClienteComponent'
  }
  var cadastroCliente = {
    name:'main.cliente.cadastro',
    url: 'cadastro',
    component: 'cadastroClienteComponent'
  };
  var  edicaoCliente = {
    name: 'main.cliente.edicao',
    url: 'edicao/:id',
    component: 'cadastroClienteComponent',
    resolve: {
      clienteParaEditar: ($q) => {
        const deferred = $q.defer();
        return deferred.promisse;
      }
    }
  };
  $stateProvider.state(cliente)
  $stateProvider.state(pesquisaCliente)
  $stateProvider.state(cadastroCliente)
  $stateProvider.state(edicaoCliente)
});