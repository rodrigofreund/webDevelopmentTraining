'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('edicaoPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/edicaoPedido/edicaoPedido.html',
  bindings: {
    pedido: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log, $scope, IndustriaPrazoService, $state, PedidoService, TabelaService, $filter, PedidoCalculoService, PedidoStorageService, ModalService) {
    var ctrl = this;
    this.$onInit = init(ctrl);

    ctrl.open = function () {
      ctrl.popup.opened = true;
    };

    ctrl.geraPedido = function () {
      debugger
      PedidoService.setPedidoAtivo(ctrl.pedido);
      $state.go('main.pedido.cadastro.itens', { 'pedido': ctrl.pedido });
    };

    $scope.$watch('ctrl.pedido.tabela', function (novaTabela, antigaTabela) {
      if (novaTabela.id !== antigaTabela.id) {
        $filter('itensAdicionadosFilter', null)(antigaTabela.itens).forEach(item => {
          $filter('filter')(novaTabela.itens, { codigo: item.codigo }).forEach(novoItem => {
            novoItem['inserido'] = item['inserido']
            novoItem['quantidadeSolicitada'] = item['quantidadeSolicitada']
            novoItem['desconto'] = item['desconto']
            PedidoCalculoService.inicializaPreco(novoItem);
          })
        });
      }
    });

    ctrl.alteraPrazo = function() {
      $log.log('altera prazo')
      $log.log(ctrl.pedido.industriaPrazo);
    }

    function init(ctrl) {

      TabelaService.getTabelasPorIndustria(ctrl.pedido.industria.id).then((tabelaDtoList) => {
        ctrl.listaTabelas = tabelaDtoList;
      });

      const industriaPrazoSearchDto = {
        idIndustria: ctrl.pedido.industria.id,
        idCliente: ctrl.pedido.cliente.id
      }
      IndustriaPrazoService.getIndustriaPrazoClientePrazo(industriaPrazoSearchDto).then((industriaPrazoPedidoDtoList) => {
        ctrl.listaPrazos = industriaPrazoPedidoDtoList;
      })

      ctrl.pedido.dataEntrega = geraDataEntrega(ctrl.pedido.dataEntrega);

      if (ctrl.pedido.itensPedido != null) {
        ctrl.pedido.itensPedido.forEach((itemInserido) => {
          ctrl.pedido.tabela.itens.forEach((itemTabela) => {
            if (itemInserido.codigo == itemTabela.codigo) {
              itemTabela['inserido'] = true;
              itemTabela['quantidadeSolicitada'] = itemInserido['quantidadeSolicitada']
              itemTabela['desconto'] = itemInserido['desconto']
              PedidoCalculoService.inicializaPreco(itemTabela);
            }
          });
        });
      }

      ctrl.dateOptions = {
        formatYear: 'yyyy',
        minDate: new Date(),
        startingDay: 1
      };

      ctrl.popup = {
        opened: false
      };

      ctrl.propostaOptions = [
        { id: "false", text: 'Não' },
        { id: "true", text: 'Sim' }
      ];

      ctrl.cargaOptions = [
        { value: "1", text: 'Batida' },
        { value: "2", text: 'Paletizada' }
      ];

      ctrl.tipoPedidoOptions = [
        { id: 1, descricao: 'Venda de Produtos' },
        { id: 2, descricao: 'Pedido em Saldo' },
        { id: 3, descricao: 'Bonificação de Produtos' }
      ];
    }

    function geraDataEntrega(dataEntrega) {
      return new Date(dataEntrega)
    }

  }
});
