'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('itensPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/itensPedido/itensPedido.html',
  bindings: {
    pedido: '='
  },
  controllerAs: 'ctrl',
  controller: function ($log, $state, PedidoService, PedidoCalculoService, ModalService) {
    var ctrl = this;

    ctrl.selecionaProduto = function () {
      ctrl.pedido.tabela.itens.findIndex((item) => {
        if (item.id === ctrl.produto.selecionado.id) {
          ctrl.inicializaPreco(item);
        }
      });
    };

    ctrl.isPedidoProposta = function () {
      return ctrl.pedido.proposta.id === PEDIDO_PROPOSTA;
    };

    ctrl.adicionaProduto = function () {
      ctrl.produto.selecionado.inserido = true;
      ctrl.produto.selecionado = null;
      PedidoService.setPedidoAtivo(ctrl.pedido);
      ctrl.valorTotalPedido = PedidoCalculoService.getValorTotalPedido(ctrl.pedido);
    }

    ctrl.editarProduto = function (item) {
      delete item.inserido;
      ctrl.produto.selecionado = item;
    }

    ctrl.removeProduto = function (item) {
      delete item.inserido;
      PedidoService.setPedidoAtivo(ctrl.pedido);
    }

    ctrl.voltar = function () {
      $state.go('main.pedido.cadastro.edicao');
    }

    ctrl.finalizarPedido = function () {
      $state.go('main.pedido.cadastro.resumo');
    }

    ctrl.alteraPrecoSemImposto = function () {
      PedidoCalculoService.alteraPrecoSemImposto(ctrl.produto.selecionado);
    }

    ctrl.alteraPrecoComImposto = function () {
      PedidoCalculoService.alteraPrecoComImposto(ctrl.produto.selecionado);
    }

    ctrl.alteraDesconto = function () {
      PedidoCalculoService.alteraDesconto(ctrl.produto.selecionado);
    }

    ctrl.inicializaPreco = function (item) {
      PedidoCalculoService.inicializaPreco(item);
    }

    ctrl.alteraPrecoUnitarioComImposto = function () {
      PedidoCalculoService.alteraPrecoUnitarioComImposto(ctrl.produto.selecionado);
    }

    ctrl.alteraPrecoUnitarioSemImposto = function () {
      PedidoCalculoService.alteraPrecoUnitarioSemImposto(ctrl.produto.selecionado);
    }

    ctrl.exibeModalUltimoPedidosItem = function () {
      let ultimasVendasItemSearchDto = {
        idCliente: ctrl.pedido.cliente.id,
        idUsuario: ctrl.pedido.usuario.id,
        codigoItem: ctrl.produto.selecionado.codigo
      }
      PedidoService.getUltimasVendasItem(ultimasVendasItemSearchDto).then(response => {
        var modalOptions = {
          closeButtonText: 'Cancelar',
          actionButtonText: 'Selecionar',
          headerText: `Histórico - ${ctrl.produto.selecionado.descricao}`,
          bodyDataList: response
        };
        var modalDefaults = {
          backdrop: true,
          keyboard: true,
          modalFade: true,
          templateUrl: 'modules/modal/modalUltimosPedidosItem.html',
        };

        ModalService.showModal(modalDefaults, modalOptions).then(function (result) {
          if (!result) {
            return
          }
          var itemSelecionado = JSON.parse(result)
          if (itemSelecionado && itemSelecionado.hasOwnProperty("quantidade") && itemSelecionado.hasOwnProperty("preco")) {
            ctrl.produto.selecionado.quantidadeSolicitada = itemSelecionado.quantidade
            ctrl.produto.selecionado.precoFinal = itemSelecionado.preco
            ctrl.alteraPrecoFinalItem()
          } else {
            NotificationService.error("Erro ao buscar informações do item. Contate o administrador")
          }
        }, function (result) {
          return
        });
      });
    }

    this.$onInit = function () {
      ctrl.produto = {
        selecionado: null
      };
      ctrl.valorTotalPedido = PedidoCalculoService.getValorTotalPedido(ctrl.pedido);
      ctrl.editandoItem = null
      $log.log('pedido: ', ctrl.pedido);
    };
  }
});

