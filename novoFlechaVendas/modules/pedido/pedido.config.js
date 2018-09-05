'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.config(($stateProvider) => {
  var pedido = {
    name: 'main.pedido',
    url: '/pedido',
    abstract: true
  };
  var cadastroPedido = {
    name: 'main.pedido.cadastro',
    url: '/cadastro',
    abstract: true
  };
  var cadastroPedidoDados = {
    name: 'main.pedido.cadastro.dados',
    url: '/dados-pedido',
    component: 'dadosPedidoComponent',
    resolve: {
      listaIndustrias: function (IndustriaService, auth) {
        return IndustriaService.getIndustriasByIdUsuario(auth.id);
      },
    }
  };
  var edicaoPedidoDados = {
    name: 'main.pedido.cadastro.edicao',
    url: '/edicao',
    component: 'edicaoPedidoComponent',
    resolve: {
      pedido: (PedidoService) => {
        return PedidoService.getPedidoAtivo();
      }
    },
  };
  var pedidoItens = {
    name: 'main.pedido.cadastro.itens',
    url: '/itens-pedido',
    component: 'itensPedidoComponent',
    resolve: {
      pedido: (PedidoService) => {
        return PedidoService.getPedidoAtivo();
      }
    }
  };
  var pedidoResumo = {
    name: 'main.pedido.cadastro.resumo',
    url: '/resumo-pedido',
    component: 'resumoPedidoComponent',
    resolve: {
      pedido: (PedidoService) => {
        return PedidoService.getPedidoAtivo();
      }
    }
  };
  var pesquisaPedido = {
    name: 'main.pedido.pesquisa',
    url: '/pesquisa',
    component: 'pesquisaPedidoComponent'
  };
  $stateProvider.state(pedido);
  $stateProvider.state(cadastroPedido);
  $stateProvider.state(cadastroPedidoDados);
  $stateProvider.state(pedidoItens);
  $stateProvider.state(pedidoResumo);
  $stateProvider.state(edicaoPedidoDados);
  $stateProvider.state(pesquisaPedido);
});