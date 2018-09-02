'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('dadosPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/dadosPedido/views/dadosPedido.html',
  bindings: {
    listaIndustrias: '<'
  },
  controllerAs: 'ctrl',
  controller: function($log, ClienteService, $scope) {
    var ctrl = this;
    ctrl.idUsuario = $scope.$parent.$resolve.auth.id;
    this.$onInit = init(ctrl);

    debugger
    console.log('listaIndustrias: ', ctrl.listaIndustrias)
    console.log('auth: ', auth)
  
    ctrl.selecionaIndustria = function () {
      $log.log('seleciona industria');
      $log.log(ctrl.industria.selecionado);
      const buscaClientesDto = {
        idUsuario: ctrl.idUsuario
      }
      //ClienteService.getClientesPorRepresentacao()
    };

    ctrl.selecionaCliente = function() {
      $log.log('seleciona cliente');
      $log.log(ctrl.cliente.selecionado);
    }

    function init(ctrl) {
      ctrl.industria = {
        selecionado: null
      };
      ctrl.cliente = { 
        selecionado: null
      };
      ctrl.possuiPedidoAtivo = false;
    }
  }
});
