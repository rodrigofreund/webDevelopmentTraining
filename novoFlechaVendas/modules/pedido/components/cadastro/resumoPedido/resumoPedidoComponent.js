'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('resumoPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/resumoPedido/resumoPedido.html',
  bindings: {
    pedido: '='
  },
  controllerAs: 'ctrl',
  controller : function ($scope, $state, PedidoCalculoService, PedidoService, NotificationService, $filter, PedidoStorageService, $log) {
    var ctrl = this;

    ctrl.voltar = function() {
      PedidoService.setPedidoAtivo(ctrl.pedido);
      $state.go('main.pedido.cadastro.itens');
    }

    ctrl.enviarPedido = function() {
      let pedidoSalvo = ctrl.pedido;
      PedidoService.salvaPedido(ctrl.pedido).then(idPedido => {
        NotificationService.success(`Pedido ${idPedido} gerado com sucesso!`);
        PedidoService.removePedidoAtivo();
        PedidoStorageService.removePedidoSalvo(pedidoSalvo);
        $state.go('main.pedido.cadastro.dados');
      }, error => {
        NotificationService.error(`Erro ao cadastrar o pedido: ${error.data.message}`);
      })
    }

    ctrl.gerarBonificacao = function() {
      ctrl.pedido.statusPedido = STATUS_PEDIDO.SALVO;
      let id = PedidoStorageService.addPedidosSalvo(ctrl.pedido);
      PedidoService.removePedidoAtivo();
      let param = {
        idPedidoRelacionado:id,
        tipoPedido: TIPO_PEDIDO.BONIFICACAO,
        idIndustria: ctrl.pedido.industria.id,
        idCliente: ctrl.pedido.cliente.id
      };
      $state.go('main.pedido.cadastro.dados', param);
    }

    ctrl.getIdPedidoPrincipal = function() {
      if(ctrl.pedido.pedidoPrincipal != null) {
        return ctrl.pedido.pedidoPrincipal.id != null ? ctrl.pedido.pedidoPrincipal.id : ctrl.pedido.pedidoPrincipal.idPedidoSalvo;
      }
    }

    ctrl.getRotuloPedidoRelacionado = function(pr) {
      return pr.tipoPedido === TIPO_PEDIDO.SALDO ? "Pedido Saldo" : "Pedido Bonificação";
    }

    ctrl.possuiPedidoRelacionado = function() {
      return ctrl.pedido.pedidosRelacionados.length > 0;
    }

    ctrl.isPedidoBonificacao = function() {
      return ctrl.pedido.tipoPedido === TIPO_PEDIDO.BONIFICACAO;
    }

    ctrl.isPedidoVenda = function() {
      return ctrl.pedido.tipoPedido === TIPO_PEDIDO.VENDA;
    }

    ctrl.isPedidoSaldo = function() {
      return ctrl.pedido.tipoPedido === TIPO_PEDIDO.SALDO;
    }

    ctrl.salvarPedido = function() {
      ctrl.pedido.statusPedido = STATUS_PEDIDO.SALVO;
      PedidoStorageService.addPedidosSalvo(ctrl.pedido);
      NotificationService.success(`Pedido salvo com sucesso!`);
    }

    ctrl.desabilitaGerarBonificacao = function() {
      return ctrl.pedido.tipoPedido !== TIPO_PEDIDO.VENDA;
    }

    this.$onInit = function () {
      ctrl.valorTotalPedidoComImposto = PedidoCalculoService.getValorTotalPedido(ctrl.pedido)
      ctrl.valorTotalPedidoSemImposto = PedidoCalculoService.getValorTotalPedidoSemImposto(ctrl.pedido)
      ctrl.totalItens = PedidoCalculoService.getTotalItens(ctrl.pedido)
      ctrl.auth = $scope.$parent.$resolve.auth
      if(!ctrl.pedido.observacoesPedidoDto) {
        ctrl.pedido.observacoesPedidoDto = [];
      }
      ctrl.pedido.itensPedido = $filter('itensAdicionadosFilter', null)(ctrl.pedido.tabela.itens)
    };
  }
});

