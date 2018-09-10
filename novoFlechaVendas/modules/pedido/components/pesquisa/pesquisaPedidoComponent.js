'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('pesquisaPedidoComponent', {
  templateUrl: 'modules/pedido/components/pesquisa/views/pesquisaPedido.html',
  bindings: {
    listaIndustrias: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log, $scope, PedidoService,
    ModalService, ClienteService, NotificationService) {
    var ctrl = this;
    this.$onInit = init();

    ctrl.buscaClientes = function (value) {
      ctrl.clienteSearch.razaoSocial = value;
      return ClienteService.getClientesPorFiltro(ctrl.clienteSearch).then((response) => {
        return response;
      });
    };

    $scope.$watchCollection('ctrl.pedidoSearch', function (novaTabela, antigaTabela) {
      $log.log('filtro: ', ctrl.pedidoSearch);
      PedidoService.getPedidosPorCriteria(ctrl.pedidoSearch).then((result) => {
        $log.log('pedidos: ', result);
        ctrl.pedidos = result.content;
      })
    });

    /*
    ctrl.selectCliente = function (item) {
      ctrl.pedidoSearch.idCliente = item.id
      buscaPedidos()
    }

    let filtroPedido = StorageService.getFiltroPedidoAtivo()
    if (filtroPedido) {
      ctrl.pedidoSearch = filtroPedido
    } else {
      ctrl.pedidoSearch = {
        idIndustria: null,
        idUsuario: null,
        idStatus: null,
        dtInicio: null,
        dtFim: null,
        idCliente: null,
        newPage: PAGINACAO.PEDIDO.NEW_PAGE,
        pageSize: PAGINACAO.PEDIDO.PAGE_SIZE
      };
    }

    if (AuthenticationService.isVendedor()) {
      ctrl.vendedor = usuario;
      ctrl.pedidoSearch.idUsuario = usuario.id;
    } else {
      CadastroClientesService.buscaVendedores(function (response) {
        ctrl.vendedores = response;
      });
    }

    ctrl.statusPedido = undefined;
    */
    /*
     service.getListaStatusPedido((response) => {
       ctrl.listaStatusPedido = response;
       if (ctrl.pedidoSearch.idStatus) {
         ctrl.listaStatusPedido.forEach(function (item, index) {
           if (item.id === ctrl.pedidoSearch.idStatus) {
             ctrl.statusPedido = item
           }
         });
       }
     });
     */

    /*
    var paginationOptions = {
      pageNumber: PAGINACAO.PEDIDO.NEW_PAGE,
      pageSize: PAGINACAO.PEDIDO.PAGE_SIZE,
      sort: null
    };
    */

    /* FILTROS DE PESQUISA

    ctrl.selecionaVendedor = function () {
      buscaPedidos()
    }

    ctrl.selecionaData = function () {
      buscaPedidos();
    }

    ctrl.limpaFiltro = function () {
      ctrl.pedidoSearch = {
        idIndustria: null,
        idUsuario: ctrl.isVendedor() ? usuario.id : null,
        idStatus: null,
        dtInicio: null,
        dtFim: null,
        idCliente: null,
        newPage: PAGINACAO.PEDIDO.NEW_PAGE,
        pageSize: PAGINACAO.PEDIDO.PAGE_SIZE
      };
      ctrl.statusPedido = undefined
      ctrl.cliente.selecionado = undefined
      buscaPedidos()
      StorageService.resetFiltroPedidoAtivo()
    }
    */

    /* ----------------------------------------------------*/

    /*
    ctrl.selecionaStatus = function () {
      if (ctrl.statusPedido) {
        ctrl.pedidoSearch.idStatus = ctrl.statusPedido.id
      } else {
        ctrl.pedidoSearch.idStatus = null
      }
      if (StorageService.getFiltroPedidoAtivo()) {
        StorageService.resetFiltroPedidoAtivo()
      }
      buscaPedidos();
    }
    */

    /*

    buscaPedidos();
    */

    ctrl.buscaPedidos = function() {
      //StorageService.setFiltroPedidoAtivo(ctrl.pedidoSearch)
      //ctrl.pedidoSearch.isVendedor = ctrl.isVendedor()
      PedidoService.getPedidosPorCriteria(ctrl.pedidoSearch, (response) => {
        $log('response: ', response);
      });
    }


    ctrl.getStatus = function (i) {
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

    ctrl.formatDate = function (date) {
      return new Date(date).toLocaleDateString("pt-BR")
    }

    /* DETALHAR PEDIDO */
    ctrl.exibeDetalhesPedido = function (idPedido) {
      if (!idPedido) {
        return
      }
      PedidoService.getPedido(idPedido, (result) => {
        let pedidoCompleto = result
        service.setPedido(pedidoCompleto);
        $location.path('/detalhePedidoItens')
      })
    }

    /* EDITAR PEDIDO */
    ctrl.editarPedido = function (idPedido) {
      if (!idPedido) {
        return
      }
      StorageService.setFiltroPedidoAtivo(ctrl.pedidoSearch)
      PedidoService.getPedido(idPedido, (result) => {
        PedidoService.pedidoParaEditar = result;
        $location.path('/pedido');
      })
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
            //$route.reload()
          }), function () {
            NotificationService.error("Erro ao cancelar pedido!")
            //$route.reload()
          }
        })
      });
    }

    ctrl.podeEditar = function (listagemPedidoDto) {
      if (!listagemPedidoDto) {
        return
      }
      return listagemPedidoDto.status === STATUS_PEDIDO.NEGADO && listagemPedidoDto.idVendedor === usuario.id;
    }

    ctrl.mudaPagina = (pagina) => {
      ctrl.pedidoSearch.newPage = pagina;
      buscaPedidos();
    }

    ctrl.proximaPagina = () => {
      if (_resultadoBusca.last == true) {
        return
      }
      ctrl.pedidoSearch.newPage += 1;
      buscaPedidos();
    }

    ctrl.anteriorPagina = () => {
      if (_resultadoBusca.first == true) {
        return
      }
      ctrl.pedidoSearch.newPage -= 1;
      buscaPedidos();
    }

    ctrl.getTotalPedidoSemSt = (pedido) => {
      return service.getTotalPedidoSemSt(pedido)
    }

    function init() {

      ctrl.cliente = {
        selecionado: undefined
      }

      ctrl.resultadoBusca = undefined
      ctrl.paginaAtual = 0
      ctrl.totalPaginas = 0

      ctrl.canEditPedido = false;
      ctrl.pedidoSelecionado = undefined;

      ctrl.exibeOpcionais = innerWidth > 700 ? true : false;

      ctrl.usuario = ctrl.auth = $scope.$parent.$resolve.auth;

      ctrl.clienteSearch = {
        idUsuario: ctrl.usuario.id,
        razaoSocial: null,
        newPage: 1,
        pageSize: 6
      }

      ctrl.pedidoSearch = {
        idIndustria: null,
        idUsuario: null,
        idStatus: null,
        dtInicio: null,
        dtFim: null,
        idCliente: null,
        newPage: PAGINACAO.PEDIDO.NEW_PAGE,
        pageSize: PAGINACAO.PEDIDO.PAGE_SIZE
      };
    };
  }
});