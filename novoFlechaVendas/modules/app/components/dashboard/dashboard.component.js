'use strict'

var app = angular.module('GerenciadorFinanceiroFlechaVendas')

app.component('dashboardComponent', {
	controller: function dashboardController(PedidoService, PedidoStorageService, $state, LoginService) {
    var ctrl = this;
    this.$onInit = init();

    ctrl.exibePedidosEnviados = function() {
      $state.go('main.pedido.pesquisa', {status: STATUS_PEDIDO.ENVIADO.toString()});
    }
    ctrl.exibePedidosSalvos = function() {
      $state.go('main.pedido.local');
    }
    ctrl.exibePedidoAtivo = function() {
      $state.go('main.pedido.cadastro.edicao');
    }
    ctrl.exibeClientesPendentes = function() {
      $state.go('main.cliente.pesquisa', {pendenteRegistro : true});
    }
    ctrl.exibePedidosNegados = function() {
      $state.go('main.pedido.pesquisa', {status: STATUS_PEDIDO.NEGADO.toString()});
    }

    function init() {
      let possuiPedidoSalvo = !!PedidoStorageService.getPedidosSalvo();
      let numeroPedidoSalvo = possuiPedidoSalvo ? PedidoStorageService.getPedidosSalvo().length : 0;
      ctrl.info = {
        pedidoAtivo: PedidoService.getPedidoAtivo(),
        exibePedidoAtivo: PedidoService.getPedidoAtivo() !== null,
        exibePedidosEnviados: ctrl.informacoes.numeroPedidosEnviados > 0,
        numeroPedidosEnviados: ctrl.informacoes.numeroPedidosEnviados,
        exibePedidosSalvos:  possuiPedidoSalvo,
        numeroPedidosSalvos: numeroPedidoSalvo,
        exibePedidosNegados: ctrl.informacoes.numeroPedidosNegados > 0,
        numeroPedidosNegados: ctrl.informacoes.numeroPedidosNegados,
        exibeClientesPendente: ctrl.informacoes.numeroClientesPendentes > 0,
        numeroClientesPendente: ctrl.informacoes.numeroClientesPendentes
      };
      if(LoginService.getUsuario().vendedor) {
        ctrl.info.exibeNaoHaInformacoes = 
        !ctrl.info.exibePedidoAtivo &&
        !ctrl.info.exibePedidosSalvos;
      } else {
        ctrl.info.exibeNaoHaInformacoes = 
        !ctrl.info.exibePedidoAtivo &&
        !ctrl.info.exibePedidosEnviados &&
        !ctrl.info.exibePedidosSalvos;
      }
      ctrl.info.exibeNaoHaAlertas = 
        !ctrl.info.exibePedidosNegados &&
        !ctrl.info.exibeClientesPendente
    }
  },
  bindings: {
    informacoes: '<'
  },
  templateUrl: 'modules/app/components/dashboard/dashboard.html',
	controllerAs: 'ctrl',
});
