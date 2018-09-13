'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('detalhePedidoComponent', {
  templateUrl: 'modules/pedido/components/detalhe/detalhePedido.html',
  bindings: {
    pedido: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log, ModalService, $state, PedidoService, NotificationService) {
    var ctrl = this;
    this.$onInit = init();

    ctrl.podeNegarPedido = function() {
      return ctrl.pedido.statusPedido === STATUS_PEDIDO.COLOCADO || ctrl.pedido.statusPedido === STATUS_PEDIDO.ENVIADO;
    }

    ctrl.negarPedido = function() {
      var modalOptions = {
        closeButtonText: 'Não',
        actionButtonText: 'Sim',
        headerText: 'Confirmar',
        bodyText: `Confirma NEGAR o pedido ${ctrl.pedido.id} ?`
      };
  
      ModalService.showModal({}, modalOptions).then(function (result) {
        ctrl.pedido.statusPedido = STATUS_PEDIDO.NEGADO
        PedidoService.salvaPedido(ctrl.pedido).then(idPedido => {
          NotificationService.success(`Pedido ${idPedido} negado com sucesso!`);
          $state.go('main.pedido.pesquisa');
        })
      });
    }

    function init() {
      $log.log('Pedido: ', ctrl.pedido);
    }
  }
});