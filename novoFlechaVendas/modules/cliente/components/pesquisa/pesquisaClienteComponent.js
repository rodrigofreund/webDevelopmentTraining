'use strict'

var ClienteModulo = angular.module('cliente.module');

ClienteModulo.component('pesquisaClienteComponent', {
  templateUrl: 'modules/cliente/components/pesquisa/pesquisaCliente.html',
  bindings: {
    listaVendedor: '<'
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
      ctrl.pesquisa();
    };

    ctrl.alteradaPesquisa = function () {
      ctrl.efetuaPesquisa = true
    }

    ctrl.editarCliente = function(cnpj) {
      $state.go('main.cliente.edicao', {'cnpj':cnpj} );
    }

    $scope.selecionaVendedor = function () {
      UsuarioService.buscaRepresentacoesUsuario(ctrl.filter.vendedorFiltro.id).then(function (response) {
        ctrl.filter.listaRepresentacoes = response;
        ctrl.efetuaPesquisa = true
        $scope.filter();
      })
    }

    function init() {
      let usuario = $scope.$parent.$resolve.auth;
      ctrl.filter = {
        newPage: 1,
        pageSize: 20,
        idUsuario: usuario.id
      };
      ctrl.efetuaPesquisa = true;
      ctrl.pesquisa();
    };

    this.$onInit = init();
  }
});