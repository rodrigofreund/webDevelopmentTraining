'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('dadosPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/dadosPedido/views/dadosPedido.html',
  bindings: {
    listaIndustrias: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log, ClienteService, $scope, TabelaService, IndustriaPrazoService, $state, PedidoService, NotificationService) {
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

    ctrl.open = function () {
      ctrl.popup.opened = true;
    };

    ctrl.geraPedido = function () {
      debugger
      if(validate()) {
        PedidoService.setPedidoAtivo(ctrl.pedido);
        $state.go('main.pedido.cadastro.itens', { 'pedido': ctrl.pedido });
      } else {
        NotificationService.alert('Dados necessários não foram preenchidos');
        ctrl.trySubmit = true;
      }
    };

    ctrl.selecionaTipoPedido = function () {
      $log.log('seleciona tipo pedido');
    }

    function validate() {
      return !$scope.formDadosPedido.$invalid;
    }

    function init(ctrl) {
      ctrl.pedido = {}
      ctrl.pedido.dataPedido = new Date();
      ctrl.idUsuario = $scope.$parent.$resolve.auth.id;
      ctrl.pedido.dataEntrega = geraDataEntrega();

      ctrl.trySubmit;

      ctrl.dataEntregaOptions = {
        formatYear: 'yyyy',
        minDate: ctrl.pedido.dataPedido,
        startingDay: 1
      };
      ctrl.dataEntregaModelOptions = {
        allowInvalid: false
      }

      ctrl.popup = {
        opened: false
      };

      ctrl.cargaOptions = [
        { value: 1, text: 'Batida' },
        { value: 2, text: 'Paletizada' }
      ];

      ctrl.tipoPedidoOptions = [
        { id: 1, descricao: 'Venda de Produtos' },
        { id: 2, descricao: 'Pedido em Saldo' },
        { id: 3, descricao: 'Bonificação de Produtos' }
      ];

      ctrl.pedido.tipoPedido = ctrl.tipoPedidoOptions[0];

      ctrl.pedido.statusPedido = STATUS_PEDIDO.ENVIADO;

      ctrl.pedido.usuario = $scope.$parent.$resolve.auth;

      ctrl.pedido.proposta = 'true';

      ctrl.pedido.carga = "1";
    }

    function geraDataEntrega() {
      let dataAtual = new Date();
      return new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate() + 1);
    }
  }
});
