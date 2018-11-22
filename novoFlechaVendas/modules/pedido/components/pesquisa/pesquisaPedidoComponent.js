'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('pesquisaPedidoComponent', {
  templateUrl: 'modules/pedido/components/pesquisa/pesquisaPedido.html',
  bindings: {
    listaIndustrias: '<',
    pedidoSearch: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log, $scope, PedidoService, ModalService,
    ClienteService, NotificationService, UsuarioService, $state, PedidoCalculoService) {

    var ctrl = this;

    this.$onInit = init();

    ctrl.selectCliente = function ($item) {
      ctrl.pedidoSearch.idCliente = $item.id;
    }

    /* EDITAR PEDIDO */
    ctrl.editarPedido = function (idPedido) {
      PedidoService.getPedido(idPedido).then(pedido => {
        PedidoService.setPedidoAtivo(pedido);
        $state.go('main.pedido.cadastro.edicao');
      })
    }

    $scope.$watchCollection('ctrl.pedidoSearch', function () {
      PedidoService.getPedidosPorCriteria(ctrl.pedidoSearch).then((result) => {
        ctrl.searchResult = result;
        ctrl.pedidos = result.content;
        calculaPrecosPedidos();
        PedidoService.setFiltroPedido(ctrl.pedidoSearch);
        ctrl.page = ctrl.pedidoSearch.newPage;
      })
    });

    ctrl.buscaPedidos = function () {
      PedidoService.getPedidosPorCriteria(ctrl.pedidoSearch).then((result) => {
        ctrl.searchResult = result;
        ctrl.pedidos = result.content;
        calculaPrecosPedidos()
      })
    }

    ctrl.formatDate = function (date) {
      return new Date(date).toLocaleDateString("pt-BR");
    }

    /* DETALHAR PEDIDO */
    ctrl.exibeDetalhesPedido = function (idPedido) {
      $state.go('main.pedido.detalhe', { 'idPedido': idPedido });
    }

    /* CANCELAR PEDIDO */
    ctrl.cancelarPedido = function (listagemPedidoDto) {
      var modalOptions = {
        closeButtonText: 'Não',
        actionButtonText: 'Sim',
        headerText: 'Confirmar',
        bodyText: 'Confirma CANCELAMENTO do pedido para o cliente ' + listagemPedidoDto.nomeCliente + ' ?'
      };
      ModalService.showModal({}, modalOptions).then(function (result) {
        PedidoService.getPedido(listagemPedidoDto.idPedido, (pedidoDto) => {
          pedidoDto.statusPedido = STATUS_PEDIDO.CANCELADO
          PedidoService.salvaPedido(pedidoDto, function () {
            NotificationService.success("Pedido cancelado com sucesso!")
          }), function () {
            NotificationService.error("Erro ao cancelar pedido!")
          }
        })
      });
    }

    ctrl.podeEditar = function (listagemPedidoDto) {
      if (!listagemPedidoDto) {
        return
      }
      return listagemPedidoDto.status === STATUS_PEDIDO.NEGADO && listagemPedidoDto.idVendedor === ctrl.usuario.id;
    }

    ctrl.mudaPagina = () => {
      ctrl.pedidoSearch.newPage = ctrl.page;
    }

    ctrl.openIni = function () {
      ctrl.popup.openedini = true;
    };

    ctrl.openFim = function () {
      ctrl.popup.openedfim = true;
    };

    ctrl.buscaClientes = function (value) {
      ctrl.clienteSearch.razaoSocial = value;
      return ClienteService.getClientesPorFiltro(ctrl.clienteSearch).then(result => {
        return result.content;
      });
    };

    ctrl.limpaFiltro = function () {
      PedidoService.removeFiltroAtivo();
      $state.go($state.current, {}, { reload: true });
    };

    ctrl.getStatusPedido = function (i) {
      switch (i) {
        case 0:
          return "Indefinido";
        case 1:
          return "Criado";
        case 2:
          return "Salvo";
        case 3:
          return "Enviado";
        case 4:
          return "Negado";
        case 5:
          return "Colocado";
        case 6:
          return "Cancelado";
      }
    }

    function calculaPrecosPedidos() {
      ctrl.pedidos.forEach(pedido => {
        PedidoCalculoService.inicializaPrecosPedido(pedido);
      })
    }

    function init() {
      ctrl.cliente = {
        selecionado: undefined
      }

      ctrl.resultadoBusca = undefined

      ctrl.canEditPedido = false;
      ctrl.pedidoSelecionado = undefined;

      ctrl.exibeOpcionais = innerWidth > 700 ? true : false;

      ctrl.usuario = ctrl.auth = $scope.$parent.$resolve.auth;

      ctrl.clienteSearch = {
        idUsuario: ctrl.usuario.id,
        razaoSocial: null,
        newPage: 1,
        pageSize: 6
      };

      ctrl.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
      };

      ctrl.popup = {
        opened: false
      };

      if (ctrl.usuario.administrador) {
        UsuarioService.buscaUsuarios().then(response => {
          ctrl.listaVendedores = response;
        });
      }

      if (ctrl.pedidoSearch.dtInicio) {
        ctrl.pedidoSearch.dtInicio = new Date(ctrl.pedidoSearch.dtInicio);
      }

      if (ctrl.pedidoSearch.dtFim) {
        ctrl.pedidoSearch.dtFim = new Date(ctrl.pedidoSearch.dtFim);
      }

      PedidoService.getListaStatusPedido().then(result => {
        ctrl.listaStatusPedido = result
      });
      $log.log('pedidoSearch: ', ctrl.pedidoSearch)
    };
  }
});