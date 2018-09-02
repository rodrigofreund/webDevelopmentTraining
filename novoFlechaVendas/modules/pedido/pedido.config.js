'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.config(($stateProvider) => {
  var pedido = {
    name: 'main.pedido',
    url: '/pedido',
    abstract: true
  };
  var cadastroPedido = {
    name:'main.pedido.cadastro',
    url: '/cadastro',
    abstract: true
  };
  var cadastroPedidoDados = {
    name:'main.pedido.cadastro.dados',
    url: '/dados-pedido',
    component: 'dadosPedidoComponent',
    resolve: {
      listaIndustrias: function (IndustriaService, auth) {
        return IndustriaService.getIndustriasByIdUsuario(auth.id);
      },
    }
  };
  var cadastroPedidoItens = {
    name:'main.pedido.cadastro.itens',
    url: '/itens-pedido',
    component: 'itensPedidoComponent'
  };
  var cadastroPedidoResumo = {
    name:'main.pedido.cadastro.resumo',
    url: '/resumo-pedido',
    component: 'resumoPedidoComponent'
  };
  var edicaoPedido = {
    name: 'main.pedido.edicao',
    url: '/edicao/:id',
    abstract: true,
    resolve: {
      pedidoParaEditar: ($q) => {
        const deferred = $q.defer();
        return deferred.promisse;
      }
    },
  };
  var pesquisaPedido = {
    name: 'main.pedido.pesquisa',
    url: '/pesquisa',
    component: 'pesquisaPedidoComponent'
  };
  $stateProvider.state(pedido);
  $stateProvider.state(cadastroPedido);
  $stateProvider.state(cadastroPedidoDados);
  $stateProvider.state(cadastroPedidoItens);
  $stateProvider.state(cadastroPedidoResumo);
  $stateProvider.state(edicaoPedido);
  $stateProvider.state(pesquisaPedido);
});