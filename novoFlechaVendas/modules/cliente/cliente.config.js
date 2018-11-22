'use strict';

var ClienteModulo = angular.module('cliente.module');

ClienteModulo.config(($stateProvider) => {
  var cliente = {
    name: 'main.cliente',
    abstract: true,
    url: '/cliente',
  };
  var pesquisaCliente = {
    name: 'main.cliente.pesquisa',
    url: '/pesquisa',
    component: 'pesquisaClienteComponent',
    resolve: {
      listaVendedor: (auth, UsuarioService)=>{
        let vendedores = []
        if(auth.vendedor) {
          vendedores.push(auth);
          return vendedores;
        } else {
          return UsuarioService.buscaUsuarios();
        }
      }
    }
  }
  var cadastroCliente = {
    name:'main.cliente.cadastro',
    url: 'cadastro',
    component: 'cadastroClienteComponent'
  };
  var edicaoCliente = {
    name: 'main.cliente.edicao',
    url: 'edicao/:cnpj',
    component: 'cadastroClienteComponent',
    resolve: {
      cliente: ($q, ClienteService, $stateParams) => {
        const deferred = $q.defer();
        ClienteService.getClientePorCnpj($stateParams.cnpj).then((clienteDto) => {
          deferred.resolve(clienteDto);
        })
        return deferred.promisse;
      },
      listaIndustriaCliente: ($q) => {
        const deferred = $q.defer();
        return deferred.promisse;
      }
    }
  };
  $stateProvider.state(cliente);
  $stateProvider.state(pesquisaCliente);
  $stateProvider.state(cadastroCliente);
  $stateProvider.state(edicaoCliente);
});