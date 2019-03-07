'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.config(($stateProvider) => {
  let pedido = {
    name: 'main.pedido',
    url: '/pedido',
    abstract: true
  };
  let cadastroPedido = {
    name: 'main.pedido.cadastro',
    url: '/cadastro',
    abstract: true
  };
  let cadastroPedidoDados = {
    name: 'main.pedido.cadastro.dados',
    url: '/dados-pedido',
    component: 'dadosPedidoComponent',
    params: {
      idPedidoRelacionado: null,
      tipoPedido: null,
      idIndustria: null,
      idCliente: null,
    },
    resolve: {
      listaIndustrias: function (IndustriaService, auth) {
        return IndustriaService.getIndustriasByIdUsuario(auth.id);
      },
      pedidoRelacionado: function ($stateParams, PedidoStorageService) {
        if ($stateParams.idPedidoRelacionado && $stateParams.tipoPedido && $stateParams.idIndustria && $stateParams.idCliente) {
          let pedido = PedidoStorageService.getPedido($stateParams.idPedidoRelacionado)
          if (!pedido) {
            return undefined;
          }
          return {
            'pedidoPrincipal': pedido,
            'tipoPedido': $stateParams.tipoPedido,
            'idIndustria': $stateParams.idIndustria,
            'idCliente': $stateParams.idCliente
          };
        } else {
          return undefined;
        }

      }
    }
  };
  let edicaoPedidoDados = {
    name: 'main.pedido.cadastro.edicao',
    url: '/edicao',
    component: 'edicaoPedidoComponent',
    resolve: {
      pedido: (PedidoService) => {
        return PedidoService.getPedidoAtivo();
      }
    },
  };
  let pedidoItens = {
    name: 'main.pedido.cadastro.itens',
    url: '/itens-pedido',
    component: 'itensPedidoComponent',
    resolve: {
      pedido: (PedidoService) => {
        return PedidoService.getPedidoAtivo();
      }
    }
  };
  let pedidoResumo = {
    name: 'main.pedido.cadastro.resumo',
    url: '/resumo-pedido',
    component: 'resumoPedidoComponent',
    resolve: {
      pedido: (PedidoService) => {
        return PedidoService.getPedidoAtivo();
      }
    }
  };
  let pesquisaPedido = {
    name: 'main.pedido.pesquisa',
    url: '/pesquisa',
    params: {
      status: null
    },
    component: 'pesquisaPedidoComponent',
    resolve: {
      listaIndustrias: function (IndustriaService, auth) {
        return IndustriaService.getIndustriasByIdUsuario(auth.id);
      },
      pedidoSearch: function (PedidoService, auth, $stateParams) {
        if ($stateParams.status) {
          return new filtroPedidoDto(auth, $stateParams.status);
        } else {
          if (PedidoService.getFiltroPedido()) {
            return PedidoService.getFiltroPedido();
          } else {
            return new filtroPedidoDto(auth);
          }
        }
      },
      listaVendedores: function (auth, UsuarioService) {
        if (auth.administrador) {
          return UsuarioService.buscaUsuarios()
        } else {
          return null
        }
      }
    }
  };
  let detalhePedido = {
    name: 'main.pedido.detalhe',
    url: '/detalhe/:idPedido',
    component: 'detalhePedidoComponent',
    resolve: {
      pedido: function (PedidoService, $stateParams) {
        return PedidoService.getPedido($stateParams.idPedido);
      },
    }
  };
  let detalhePedidoSalvo = {
    name: 'main.pedido.detalhe-pedido-local',
    url: '/detalhe-pedido-salvo/:idPedidoSalvo',
    component: 'detalhePedidoComponent',
    resolve: {
      pedido: function (PedidoStorageService, $stateParams) {
        return PedidoStorageService.getPedido($stateParams.idPedidoSalvo);
      },
    }
  };
  let pedidoLocal = {
    name: 'main.pedido.local',
    url: '/local',
    component: 'pedidoLocalComponent',
    resolve: {
      listaIndustrias: function (IndustriaService, auth) {
        return IndustriaService.getIndustriasByIdUsuario(auth.id);
      },
    }
  };
  $stateProvider.state(pedido);
  $stateProvider.state(cadastroPedido);
  $stateProvider.state(cadastroPedidoDados);
  $stateProvider.state(pedidoItens);
  $stateProvider.state(pedidoResumo);
  $stateProvider.state(edicaoPedidoDados);
  $stateProvider.state(pesquisaPedido);
  $stateProvider.state(detalhePedido);
  $stateProvider.state(pedidoLocal);
  $stateProvider.state(detalhePedidoSalvo);
});