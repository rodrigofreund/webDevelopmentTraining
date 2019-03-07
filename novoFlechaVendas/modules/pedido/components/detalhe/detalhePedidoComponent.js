'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('detalhePedidoComponent', {
  templateUrl: 'modules/pedido/components/detalhe/detalhePedido.html',
  bindings: {
    pedido: '<'
  },
  controllerAs: 'ctrl',
  controller: function (ModalService, $state, $scope, PedidoService, NotificationService, PedidoCalculoService, LoginService) {
    var ctrl = this;
    this.$onInit = init();

    ctrl.negarPedido = function () {
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

    ctrl.valorCarga = function () {
      if (ctrl.pedido.carga == 1) {
        return "Batida";
      } else {
        return "Paletizada";
      }
    }

    ctrl.valorTipoPedido = function() {
      switch (ctrl.pedido.tipoPedido) {
        case TIPO_PEDIDO.VENDA:
          return "Venda"
          break
        case TIPO_PEDIDO.BONIFICACAO:
          return "Bonificação"
          break
        case TIPO_PEDIDO.SALDO:
          return "Saldo"
          break
        default: 
          return "Venda";
      }
    }

    ctrl.valorPedidosRelacionados = function() {
      let result = '';
      if(ctrl.pedido.pedidosRelacionados && ctrl.pedido.pedidosRelacionados.length > 0) {
        ctrl.pedido.pedidosRelacionados.forEach(function(value, index, arr) {
          result = result.concat(value.id);
          if(index+1 < arr.length) {
            result = result.concat(', ');
          }
        })
      } else if (ctrl.pedido.pedidoPrincipal){
        result = result.concat(ctrl.pedido.pedidoPrincipal.id)
      }
      return result;
    }

    ctrl.colocarPedido = function () {
      var modalOptions = {
        closeButtonText: 'Não',
        actionButtonText: 'Sim',
        headerText: 'Confirmar',
        bodyText: `Confirma COLOCAR o pedido ${ctrl.pedido.id} ?`
      };

      ModalService.showModal({}, modalOptions).then(function (result) {
        ctrl.pedido.statusPedido = STATUS_PEDIDO.COLOCADO
        PedidoService.salvaPedido(ctrl.pedido).then(idPedido => {
          NotificationService.success(`Pedido ${idPedido} colocado com sucesso!`);
          $state.go('main.pedido.pesquisa');
        })
      });
    }

    ctrl.podeNegarPedido = function () {
      return ctrl.pedido.statusPedido === STATUS_PEDIDO.COLOCADO || ctrl.pedido.statusPedido === STATUS_PEDIDO.ENVIADO;
    }

    ctrl.podeColocarPedido = function () {
      return ctrl.pedido.statusPedido === STATUS_PEDIDO.ENVIADO;
    }

    ctrl.isVendedor = function() {
      return LoginService.getUsuario().vendedor
    }

    ctrl.podeEnviarPedido = function() {
      return (ctrl.pedido.statusPedido == STATUS_PEDIDO.SALVO ||
        ctrl.pedido.statusPedido == STATUS_PEDIDO.CRIADO ||
        ctrl.pedido.statusPedido == STATUS_PEDIDO.INDEFINIDO ||
        ctrl.pedido.statusPedido == STATUS_PEDIDO.NEGADO) && ctrl.pedido.usuario.id === ctrl.auth.id
    }

    ctrl.enviarPedido = function() {
      PedidoService.enviarPedido(ctrl.pedido).then(result => {
        NotificationService.success(result)
        ctrl.voltar()
      }, error => {
        NotificationService.error(error)
      })
    }

    ctrl.voltar = function() {
      window.history.back()
    }

    function init() {
      PedidoCalculoService.inicializaPrecosPedido(ctrl.pedido);
      ctrl.auth = $scope.$parent.$resolve.auth
    }
  }
});