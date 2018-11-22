'use strict';

var PedidoModulo = angular.module('pedido.module');

PedidoModulo.component('dadosPedidoComponent', {
  templateUrl: 'modules/pedido/components/cadastro/dadosPedido/dadosPedido.html',
  bindings: {
    listaIndustrias: '<',
    pedidoRelacionado: '<'
  },
  controllerAs: 'ctrl',
  controller: function (
    $log,
    ClienteService,
    $scope,
    TabelaService,
    IndustriaPrazoService,
    $state,
    PedidoService,
    NotificationService,
    ModalService,
    PedidoCalculoService,
    PedidoStorageService) {
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
      if (validate()) {
        PedidoService.setPedidoAtivo(ctrl.pedido);
        $state.go('main.pedido.cadastro.itens', { 'pedido': ctrl.pedido });
      } else {
        NotificationService.alert('Dados necessários não foram preenchidos');
        ctrl.trySubmit = true;
      }
    };

    ctrl.selecionaTipoPedido = function (oldValue) {
      if (ctrl.pedido.pedidoRelacionado) {
        confirmaRemoverPedidoRelacionado(oldValue);
      } else {
        exibePedidosParaRelacionar();
      }
    }

    function exibePedidosParaRelacionar() {
      let filtroPedidoDto = {
        idCliente: ctrl.pedido.cliente.id,
        idUsuario: ctrl.pedido.usuario.id,
        idIndustria: ctrl.pedido.industria.id,
        status: [STATUS_PEDIDO.ENVIADO, STATUS_PEDIDO.COLOCADO],
        newPage: 1,
        pageSize: 10
      };
      PedidoService.getPedidosPorCriteria(filtroPedidoDto).then(response => {
        let listaPedidoSalvo = PedidoStorageService.getPedidoPorFiltro(ctrl.pedido.cliente.id, ctrl.pedido.usuario.id, ctrl.pedido.industria.id);
        let pedidos = response.content.concat(listaPedidoSalvo);
        if (pedidos.length > 0) {
          pedidos.forEach((pedido) => {
            PedidoCalculoService.inicializaPrecosPedido(pedido);
          })
        }
        var modalOptions = {
          closeButtonText: 'Cancelar',
          actionButtonText: 'Selecionar',
          headerText: `Selecionar Pedido Relacionado`,
          bodyDataList: pedidos
        };
        var modalDefaults = {
          backdrop: true,
          keyboard: true,
          modalFade: true,
          templateUrl: 'modules/modal/modalSelecaoPedidoPrincipal.html',
        };

        ModalService.showModal(modalDefaults, modalOptions).then(function (result) {
          if (!result) {
            return;
          }
          var itemSelecionado = JSON.parse(result)
          if (itemSelecionado) {
            if (itemSelecionado.id) {
              PedidoService.getPedido(itemSelecionado.idPedido).then(pedido => {
                ctrl.pedido.pedidoPrincipal = pedido;
                NotificationService.success(`Pedido ${itemSelecionado.id} relacionado com sucesso!`);
              })
            } else if (itemSelecionado.idPedidoSalvo) {
              ctrl.pedido.pedidoPrincipal = PedidoStorageService.getPedido(itemSelecionado.idPedidoSalvo);
              NotificationService.success(`Pedido ${itemSelecionado.idPedidoSalvo} relacionado com sucesso!`);
            } else {
              NotificationService.success("Não foi possível relacionar os pedidos!");
            }

          } else {
            NotificationService.error("Erro ao buscar informações do item. Contate o administrador")
          }
        }, function () {
          ctrl.pedido.pedidoPrincipal = null
          ctrl.pedido.tipoPedido = TIPO_PEDIDO.VENDA;
          return;
        });
      });
    }

    function confirmaRemoverPedidoRelacionado(oldValue) {
      if (ctrl.pedido.pedidoRelacionado) {
        var modalOptions = {
          closeButtonText: 'Não',
          actionButtonText: 'Sim',
          headerText: `Pedido Relacionado Existente`,
          bodyText: `Este pedido possui o pedido ${ctrl.pedido.pedidoRelacionado.idPedido} relacionado atribuído. Deseja substituir?`
        };

        ModalService.showModal({}, modalOptions).then(
          function () {
            if (ctrl.pedido.tipoPedido === TIPO_PEDIDO.VENDA) {
              ctrl.pedido.pedidoRelacionado = null
            } else {
              exibePedidosParaRelacionar();
            }
          },
          function () {
            ctrl.pedido.tipoPedido = parseInt(oldValue);
            return;
          });
      }
    }

    function validate() {
      return !$scope.formDadosPedido.$invalid;
    }

    function geraDataEntrega() {
      let dataAtual = new Date();
      return new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate() + 1);
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
        { id: TIPO_PEDIDO.VENDA, descricao: 'Venda de Produtos' },
        { id: TIPO_PEDIDO.SALDO, descricao: 'Pedido em Saldo' },
        { id: TIPO_PEDIDO.BONIFICACAO, descricao: 'Bonificação de Produtos' }
      ];

      ctrl.pedido.usuario = $scope.$parent.$resolve.auth;

      if (ctrl.pedidoRelacionado) {
        ctrl.isPedidoRelacionado = true
        ctrl.pedido.tipoPedido = ctrl.pedidoRelacionado.tipoPedido;
        let indice = null;
        ctrl.pedido.pedidoPrincipal = ctrl.pedidoRelacionado.pedidoPrincipal;

        ctrl.listaIndustrias.forEach(function (item, index) {
          if (item.id === ctrl.pedidoRelacionado.idIndustria) {
            indice = index;
          }
          if (indice) {
            ctrl.pedido.industria = ctrl.listaIndustrias[indice];
            const buscaClientesDto = {
              idUsuario: ctrl.pedido.usuario.id,
              idIndustria: ctrl.pedido.industria.id
            }
            ClienteService.getClientesPorRepresentacao(buscaClientesDto).then((clienteDtoList) => {
              ctrl.listaClientes = clienteDtoList;
              let indice = undefined;
              clienteDtoList.forEach(function (item, index) {
                if (item.id === ctrl.pedidoRelacionado.idCliente) {
                  indice = index;
                }
              });
              if (indice) {
                ctrl.pedido.cliente = clienteDtoList[indice];
              }
            });
          }
        });

        TabelaService.getTabelasPorIndustria(ctrl.pedido.industria.id).then((tabelaDtoList) => {
          ctrl.listaTabelas = tabelaDtoList
        });
      } else {
        ctrl.pedido.tipoPedido = TIPO_PEDIDO.VENDA;
      }

      ctrl.pedido.statusPedido = STATUS_PEDIDO.ENVIADO;
      ctrl.pedido.proposta = 'true';
      ctrl.pedido.carga = "1";
    }
  }
});
