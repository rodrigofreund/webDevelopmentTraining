'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('dadosPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/dadosPedido/views/dadosPedido.html',
  bindings: {
    listaIndustrias: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log, ClienteService, $scope, TabelaService, IndustriaPrazoService, $state, PedidoService) {
    var ctrl = this;
    this.$onInit = init(ctrl);

    ctrl.selecionaIndustria = function () {
      const buscaClientesDto = {
        idUsuario: ctrl.idUsuario,
        idIndustria: ctrl.pedido.industria.id
      }
      ClienteService.getClientesPorRepresentacao(buscaClientesDto).then((clienteDtoList) => {
        ctrl.listaClientes = clienteDtoList;
      });
      TabelaService.getTabelasPorIndustria(ctrl.pedido.industria.id).then((tabelaDtoList) => {
        ctrl.listaTabelas = tabelaDtoList
      });
    };

    ctrl.selecionaCliente = function () {
      $log.log(ctrl.pedido.cliente);
    };

    ctrl.selecionaTabela = function () {
      const industriaPrazoSearchDto = {
        idIndustria: ctrl.pedido.industria.id,
        idCliente: ctrl.pedido.cliente.id
      }
      IndustriaPrazoService.getIndustriaPrazoClientePrazo(industriaPrazoSearchDto).then((industriaPrazoPedidoDtoList) => {
        ctrl.listaPrazos = industriaPrazoPedidoDtoList;
      })
    };

    ctrl.open = function() {
      ctrl.popup.opened = true;
    };

    ctrl.geraPedido = function() {
      PedidoService.setPedidoAtivo(ctrl.pedido);
      $state.go('main.pedido.cadastro.itens', {'pedido': ctrl.pedido});
    };

    function init(ctrl) {
      ctrl.pedido = {}
      ctrl.pedido.dataPedido = new Date();

      ctrl.possuiPedidoAtivo = false;
      ctrl.idUsuario = $scope.$parent.$resolve.auth.id;
      ctrl.pedido.dataEntrega = geraDataEntrega();

      ctrl.dateOptions = {
        formatYear: 'yyyy',
        minDate: new Date(),
        startingDay: 1
      };

      ctrl.popup = {
        opened: false
      };

      ctrl.propostaOptions = [
        {id: 0, text: 'Não'},
        {id: 1, text: 'Sim'}
      ];

      ctrl.cargaOptions = [
        {value: 1, text: 'Batida'},
        {value: 2, text: 'Paletizada'}
      ];

      ctrl.proposta = {
        selecionado : null
      };

      ctrl.carga = {
        selecionado: null
      };
    }

    function geraDataEntrega() {
      let dataAtual = new Date(); 
      return new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate() + 1);
    }
  }
});
