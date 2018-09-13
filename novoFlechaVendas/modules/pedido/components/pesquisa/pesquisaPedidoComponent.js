'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('pesquisaPedidoComponent', {
  templateUrl: 'modules/pedido/components/pesquisa/views/pesquisaPedido.html',
  bindings: {
    listaIndustrias: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log, $scope, PedidoService,
    ModalService, ClienteService, NotificationService, UsuarioService, $state) {
    var ctrl = this;
    this.$onInit = init();

    ctrl.buscaClientes = function (value) {
      ctrl.clienteSearch.razaoSocial = value;
      return ClienteService.getClientesPorFiltro(ctrl.clienteSearch).then(result => {
        return result.content;
      });
    };

    UsuarioService.buscaUsuarios().then(response => {
      ctrl.listaVendedores = response;
    });

    PedidoService.getListaStatusPedido().then(result => {
      ctrl.listaStatusPedido = result
    })

    ctrl.selectCliente = function($item) {
      ctrl.pedidoSearch.idCliente = $item.id;
    }

    /* EDITAR PEDIDO */
    ctrl.editarPedido = function(idPedido) {
      PedidoService.getPedido(idPedido).then(pedido => {
        PedidoService.setPedidoAtivo(pedido);
        $state.go('main.pedido.cadastro.edicao');
      })
    }
    

    $scope.$watchCollection('ctrl.pedidoSearch', function (novaTabela, antigaTabela) {
      $log.log('filtro: ', ctrl.pedidoSearch);
      PedidoService.getPedidosPorCriteria(ctrl.pedidoSearch).then((result) => {
        $log.log('result: ', result);
        ctrl.searchResult = result;
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

    ctrl.buscaPedidos = function () {
      //StorageService.setFiltroPedidoAtivo(ctrl.pedidoSearch)
      //ctrl.pedidoSearch.isVendedor = ctrl.isVendedor()
      PedidoService.getPedidosPorCriteria(ctrl.pedidoSearch).then((result) => {
        $log.log('pedidos: ', result);
        ctrl.searchResult = result;
        ctrl.pedidos = result.content;
      })
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
      $state.go('main.pedido.detalhe', {'idPedido' : idPedido});
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
      return listagemPedidoDto.status === STATUS_PEDIDO.NEGADO && listagemPedidoDto.idVendedor === ctrl.usuario.id;
    }

    ctrl.mudaPagina = () => {
      ctrl.buscaPedidos();
    }

    ctrl.getTotalPedidoSemSt = (pedido) => {
      return service.getTotalPedidoSemSt(pedido)
    }

    ctrl.openIni = function() {
      ctrl.popup.openedini = true;
    };

    ctrl.openFim = function() {
      ctrl.popup.openedfim = true;
    };

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
      };

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

      ctrl.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
      };

      ctrl.popup = {
        opened: false
      };
    };
  }
});