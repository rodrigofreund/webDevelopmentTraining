'use strict'

var ClienteModulo = angular.module('cliente.module');

ClienteModulo.component('pesquisaClienteComponent', {
  templateUrl: 'modules/cliente/components/pesquisa/pesquisaCliente.html',
  bindings: {
    listaVendedor: '<',
    filter: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($scope, ClienteService, $log, UsuarioService, $state) {
    var ctrl = this;

    ctrl.pesquisa = function () {
      if (ctrl.efetuaPesquisa) {
        ClienteService.getClientesPorFiltro(ctrl.filter).then(function (result) {
          ctrl.searchResult = result
          ctrl.clientes = result.content;
          ctrl.efetuaPesquisa = false;
        });
      }
    };

    ctrl.mudaPagina = function () {
      ctrl.alteradaPesquisa();
      ctrl.pesquisa();
    };

    ctrl.alteradaPesquisa = function () {
      ctrl.efetuaPesquisa = true
    }

    ctrl.editarCliente = function(cnpj) {
      $state.go('main.cliente.edicao', {'cnpj':cnpj, 'janela':ABA_CADASTRO_CLIENTE.DADOS_PESSOAIS} );
    }

    $scope.selecionaVendedor = function () {
      UsuarioService.buscaRepresentacoesUsuario(ctrl.filter.vendedorFiltro.id).then(function (response) {
        ctrl.filter.listaRepresentacoes = response;
        ctrl.efetuaPesquisa = true
        $scope.filter();
      })
    }

    function init() {
      ctrl.efetuaPesquisa = true;
      ctrl.pesquisa();
      console.log('filtro: ', ctrl.filter)
    };

    this.$onInit = init();
  }
});