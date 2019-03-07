'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('edicaoPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/edicaoPedido/edicaoPedido.html',
  bindings: {
    pedido: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($scope, IndustriaPrazoService, $state, PedidoService, TabelaService, $filter, PedidoCalculoService, NotificationService) {
    var ctrl = this;
    this.$onInit = init(ctrl);

    ctrl.open = function () {
      ctrl.popup.opened = true;
    };

    ctrl.geraPedido = function () {
      if (validate()) {
        PedidoService.setPedidoAtivo(ctrl.pedido);
        $state.go('main.pedido.cadastro.itens', { 'pedido': ctrl.pedido });
      }

    };

    $scope.$watch('ctrl.pedido.tabela', function (novaTabela, antigaTabela) {
      if (novaTabela.id !== antigaTabela.id) {
        ctrl.tabelaInexistente = false
        $filter('itensAdicionadosFilter', null)(antigaTabela.itens).forEach(item => {
          $filter('filter')(novaTabela.itens, { codigo: item.codigo }).forEach(novoItem => {
            novoItem['inserido'] = item['inserido']
            novoItem['quantidadeSolicitada'] = item['quantidadeSolicitada']
            novoItem['desconto'] = item['desconto']
            novoItem['precoColocado'] = item['precoColocado']
            PedidoCalculoService.inicializaPreco(novoItem);
          })
        });
      }
    });

    function init(ctrl) {

      TabelaService.getTabelasPorIndustria(ctrl.pedido.industria.id).then((tabelaDtoList) => {
        ctrl.listaTabelas = tabelaDtoList;
        consisteTabelaAtual()
      });

      const industriaPrazoSearchDto = {
        idIndustria: ctrl.pedido.industria.id,
        idCliente: ctrl.pedido.cliente.id
      }
      IndustriaPrazoService.getIndustriaPrazoClientePrazo(industriaPrazoSearchDto).then((industriaPrazoPedidoDtoList) => {
        ctrl.listaPrazos = industriaPrazoPedidoDtoList;
      })

      ctrl.pedido.dataPedido = new Date();

      if(ctrl.pedido.dataEntrega) {
        ctrl.pedido.dataEntrega = new Date(ctrl.pedido.dataEntrega);
      } else {
        ctrl.pedido.dataEntrega = geraDataEntrega();
      }

      ctrl.dataEntregaOptions = {
        formatYear: 'yyyy',
        minDate: ctrl.pedido.dataPedido,
        startingDay: 1
      };
      ctrl.dataEntregaModelOptions = {
        allowInvalid: false
      }

      if (ctrl.pedido.itensPedido != null) {
        ctrl.pedido.itensPedido.forEach((itemInserido) => {
          ctrl.pedido.tabela.itens.forEach((itemTabela) => {
            if (itemInserido.codigo == itemTabela.codigo) {
              itemTabela['inserido'] = true;
              itemTabela['quantidadeSolicitada'] = itemInserido['quantidadeSolicitada']
              itemTabela['desconto'] = itemInserido['desconto']
              itemTabela['precoColocado'] = itemInserido['precoColocado']
              PedidoCalculoService.inicializaPreco(itemTabela);
            }
          });
        });
      }

      //ajuste para o legado
      if (!ctrl.pedido.tipoPedido) {
        ctrl.pedido.tipoPedido = TIPO_PEDIDO.VENDA;
      }
      ctrl.pedido.carga = parseInt(ctrl.pedido.carga);
      ctrl.pedido.proposta = (typeof ctrl.pedido.proposta === 'string') ? ctrl.pedido.proposta == 'true' : ctrl.pedido.proposta;

      ctrl.dateOptions = {
        formatYear: 'yyyy',
        minDate: new Date(),
        startingDay: 1
      };

      ctrl.popup = {
        opened: false
      };

      ctrl.propostaOptions = LISTA_SIMNAO;

      ctrl.cargaOptions = LISTA_CARGA;

      ctrl.tipoPedidoOptions = [
        { id: 1, descricao: 'Venda de Produtos' },
        { id: 2, descricao: 'Pedido em Saldo' },
        { id: 3, descricao: 'Bonificação de Produtos' }
      ];
    }

    function validate() {
      if (ctrl.tabelaInexistente || $scope.formDadosPedido.$invalid) {
        NotificationService.error('Existem erros no preenchimento do pedido.');
        return false;
      }
      return true;
    }

    function consisteTabelaAtual() {
      let existe = ctrl.listaTabelas.some(function (tabela) {
        return ctrl.pedido.tabela.id === tabela.id;
      })
      if (!existe) {
        NotificationService.alert('A tabela atual não está mais vigente. Selecione outra tabela')
        ctrl.tabelaInexistente = true
      }
    }

    function geraDataEntrega() {
      let dataAtual = new Date();
      return new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate() + 1);
    }

  }
});
