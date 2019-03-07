'use strict';

var PedidoModule = angular.module('pedido.module');

PedidoModule.factory('PedidoService', ['HttpService', 'PedidoStorageService', '$q',
  function (HttpService, PedidoStorageService, $q) {
    var service = {};
    const SUBPATH = 'service/pedido';

    const URL_PEDIDO_SALVAR = `${SUBPATH}/salvaPedido`;
    const URL_PEDIDO_ATUALIZAR_STATUS = `${SUBPATH}/atualizarStatusPedido`;
    const URL_PEDIDO_BUSCAR_POR_CRITERIA = `${SUBPATH}/getPedidosPorCriteria`;
    const URL_PEDIDO_BUSCAR_ITENS = `${SUBPATH}/getItensPedido`;
    const URL_PEDIDO_BUSCAR_PEDIDO_POR_ID = `${SUBPATH}/getPedido`;
    const URL_PEDIDO_BUSCAR_LISTA_STATUS_PEDIDO = `${SUBPATH}/getListaStatusPedido`;
    const URL_PEDIDO_BUSCAR_OBSERVACOES_PEDIDO = `${SUBPATH}/getObservacoesPedido`;
    const URL_PEDIDO_ADICIONAR_OBSERVACOES_PEDIDO = `${SUBPATH}/setObservacoesPedido`;
    const URL_PEDIDO_BUSCAR_ULTIMAR_VENDAS_ITEM = `${SUBPATH}/getUltimasVendasItem`;

    service.enviarPedido = (pedidoDto) => {
      const deferred = $q.defer();

      let pedidoSalvo = pedidoDto;
      let pedidoPrincipalSalvo = pedidoDto.pedidoPrincipal;

      let pedidoPrincipalPromisse = enviarPedidoPrincipal(pedidoDto);

      if(pedidoPrincipalPromisse) {
        pedidoPrincipalPromisse.then(idPedidoPrincipal => {
          if(idPedidoPrincipal) {
            pedidoDto.pedidoPrincipal.id = idPedidoPrincipal
            PedidoStorageService.removePedidoSalvo(pedidoPrincipalSalvo)
          }
  
          pedidoDto.statusPedido = STATUS_PEDIDO.ENVIADO;
          service.salvaPedido(pedidoDto).then(idPedido => {
            service.removePedidoAtivo();
            PedidoStorageService.removePedidoSalvo(pedidoSalvo);
            deferred.resolve(`Pedidos ${idPedidoPrincipal} e ${idPedido} gerados com sucesso!`);
          }, error => {
            deferred.reject(`Erro ao cadastrar o pedido: ${error.data.message}`);
          })
        })
      } else {
        pedidoDto.statusPedido = STATUS_PEDIDO.ENVIADO;
        service.salvaPedido(pedidoDto).then(idPedido => {
          service.removePedidoAtivo();
          PedidoStorageService.removePedidoSalvo(pedidoSalvo);
          deferred.resolve(`Pedido ${idPedido} gerado com sucesso!`)
        }, error => {
          deferred.reject(`Erro ao cadastrar o pedido: ${error.data.message}`);
        })
      }
      return deferred.promise;
    }

    function enviarPedidoPrincipal(pedidoDto) {
      if(pedidoDto.pedidoPrincipal && !pedidoDto.pedidoPrincipal.id) {
        let pedidoPrincipal = pedidoDto.pedidoPrincipal;
        pedidoPrincipal.statusPedido = STATUS_PEDIDO.ENVIADO;
        return service.salvaPedido(pedidoPrincipal)
      }
      return null
    }

    service.salvaPedido = (pedidoDto) => {
      return HttpService.httpPost(URL_PEDIDO_SALVAR, pedidoDto);
    };

    service.atualizarStatusPedido = (atualizaStatusPedidoDto) => {
      return HttpService.httpPost(URL_PEDIDO_ATUALIZAR_STATUS, atualizaStatusPedidoDto);
    };

    service.getPedidosPorCriteria = (filtroPedidoDto) => {
      return HttpService.httpPost(URL_PEDIDO_BUSCAR_POR_CRITERIA, filtroPedidoDto);
    };

    service.getItensPedido = (idPedido) => {
      return HttpService.httpPost(URL_PEDIDO_BUSCAR_ITENS, idPedido);
    };

    service.getPedido = (idPedido) => {
      return HttpService.httpPost(URL_PEDIDO_BUSCAR_PEDIDO_POR_ID, idPedido);
    };

    service.getListaStatusPedido = () => {
      return HttpService.httpGet(URL_PEDIDO_BUSCAR_LISTA_STATUS_PEDIDO);
    };

    service.getObservacoesPedido = (idPedido) => {
      return HttpService.httpGet(URL_PEDIDO_BUSCAR_OBSERVACOES_PEDIDO, idPedido);
    };

    service.setObservacoesPedido = (observacaoPedidoUpdateDto) => {
      return HttpService.httpPost(URL_PEDIDO_ADICIONAR_OBSERVACOES_PEDIDO, observacaoPedidoUpdateDto);
    };

    service.getUltimasVendasItem = (ultimasVendasItemSearchDto) => {
      return HttpService.httpPost(URL_PEDIDO_BUSCAR_ULTIMAR_VENDAS_ITEM, ultimasVendasItemSearchDto);
    };

    service.setPedidoAtivo = function (pedidoAtivo) {
      localStorage.setItem('pedidoAtivo', angular.toJson(pedidoAtivo));
    }

    service.getPedidoAtivo = function () {
      return angular.fromJson(localStorage.getItem('pedidoAtivo'));
    }

    service.removePedidoAtivo = function () {
      return localStorage.removeItem('pedidoAtivo');
    }

    service.setFiltroPedido = function (filtroPedido) {
      sessionStorage.setItem('filtroPedido', angular.toJson(filtroPedido));
    }

    service.getFiltroPedido = function () {
      return angular.fromJson(sessionStorage.getItem('filtroPedido'));
    }

    service.removeFiltroAtivo = function () {
      return sessionStorage.removeItem('filtroPedido');
    }

    return service;
  }
]);