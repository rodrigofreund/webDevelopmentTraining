'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('pedidoLocalComponent', {
  templateUrl: 'modules/pedido/components/pedidoLocal/pedidoLocal.html',
  bindings: {
    listaIndustrias: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log, $scope, PedidoService, ModalService,
    NotificationService, $state, PedidoCalculoService, PedidoStorageService) {

    var ctrl = this;

    this.$onInit = init();

    /* EDITAR PEDIDO */
    ctrl.editarPedido = function (p) {
      debugger
      let pedido = PedidoStorageService.getPedido(p.idPedidoSalvo);
      PedidoService.setPedidoAtivo(pedido);
      $state.go('main.pedido.cadastro.edicao');
    }

    ctrl.buscaPedidos = function() {
      ctrl.pedidos = PedidoStorageService.getPedidosSalvo();
      if(ctrl.filter.idIndustria) {
        ctrl.listaPedidos = ctrl.pedidos.filter(function(item) {
          return item.industria.id == ctrl.filter.idIndustria;
        });
      } else {
        ctrl.listaPedidos = ctrl.pedidos;
      }
    };
    ctrl.buscaPedidos();

    ctrl.formatDate = function (date) {
      return new Date(date).toLocaleDateString("pt-BR")
    }

    /* DETALHAR PEDIDO */
    ctrl.exibeDetalhesPedido = function (idPedidoSalvo) {
      $state.go('main.pedido.detalhe-pedido-local', { 'idPedidoSalvo': idPedidoSalvo });
    }

    /* CANCELAR PEDIDO */
    ctrl.cancelarPedido = function (listagemPedidoDto) {
      var modalOptions = {
        closeButtonText: 'Não',
        actionButtonText: 'Sim',
        headerText: 'Confirmar',
        bodyText: 'Confirma CANCELAMENTO do pedido para o cliente ' + listagemPedidoDto.nomeCliente + ' ?'
      };
      ModalService.showModal({}, modalOptions).then(function (result) {
        PedidoStorageService.removePedidoSalvo(listagemPedidoDto);
        ctrl.buscaPedidos();
      });
    }

    ctrl.podeEditar = function (listagemPedidoDto) {
      if (!listagemPedidoDto) {
        return
      }
      return listagemPedidoDto.status === STATUS_PEDIDO.NEGADO && listagemPedidoDto.idVendedor === ctrl.usuario.id;
    }

    ctrl.mudaPagina = () => {
      ctrl.pedidoSearch.newPage = ctrl.page;
    }

    function calculaPrecosPedidos() {
      ctrl.pedidos.forEach(pedido => {
        PedidoCalculoService.inicializaPrecosPedido(pedido);
      })
    }

    function init() {
      ctrl.resultadoBusca = undefined
      ctrl.filter = {
        idIndustria: null
      };
      ctrl.canEditPedido = false;
      ctrl.pedidoSelecionado = undefined;
      ctrl.exibeOpcionais = innerWidth > 700 ? true : false;
      ctrl.usuario = ctrl.auth = $scope.$parent.$resolve.auth;
    };
  }
});
