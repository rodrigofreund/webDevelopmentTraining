'use strict';

var PedidoModule = angular.module('pedido.module');

PedidoModule.factory('PedidoStorageService', ['$log',
  function ($log) {

    var service = {};

    service.addPedidosSalvo = function (pedido) {
      let listaPedidosSalvos = service.getPedidosSalvo()
      if (!listaPedidosSalvos) {
        return setPedidosSalvo(pedido)
      } else {
        let indice = undefined
        listaPedidosSalvos.forEach(function (item, index) {
          if (item.idPedidoSalvo === pedido.idPedidoSalvo) {
            indice = index
          }
        })
        if (indice !== undefined) {
          listaPedidosSalvos[indice] = pedido
        } else {
          for (var i in listaPedidosSalvos) {
            if (indice === undefined || indice < listaPedidosSalvos[i].idPedidoSalvo) {
              indice = listaPedidosSalvos[i].idPedidoSalvo
            }
          }
          if (!indice) {
            indice = 0
          }
          pedido.idPedidoSalvo = indice + 1
          listaPedidosSalvos.push(pedido)
        }
        localStorage.setItem('pedidos', JSON.stringify(listaPedidosSalvos))
        return pedido.idPedidoSalvo;
      }
    }

    service.getPedidosSalvo = function () {
      if (localStorage.getItem('pedidos') !== 'undefined') {
        return JSON.parse(localStorage.getItem('pedidos'))
      } else {
        return undefined
      }
    }

    service.getPedido = function (idPedido) {
      let listaPedidosSalvos = service.getPedidosSalvo();
      let pedidoEncontrado = listaPedidosSalvos.filter(function(pedido) {
        return pedido.idPedidoSalvo == idPedido;
      });
      return pedidoEncontrado[0];
    }

    service.getPedidoPorFiltro = function (idCliente, idUsuario, idIndustria) {
      let listaPedidosSalvos = service.getPedidosSalvo();
      let pedidoEncontrado = null
      if(listaPedidosSalvos) {
        pedidoEncontrado = listaPedidosSalvos.filter(function(pedido) {
          return (pedido.cliente.id == idCliente && pedido.usuario.id == idUsuario && pedido.industria.id == idIndustria);
        });
        let result = [];
        pedidoEncontrado.forEach(function(item) {
          let pedido = {
            numero: null,
            codigo: item.codigo,
            dataPedido: item.dataPedido,
            nomeIndustria: item.industria.nome,
            status: item.statusPedido,
            itensPedido: item.itensPedido,
            idPedidoSalvo: item.idPedidoSalvo
          }
          result.push(pedido);
        })
        return result;
      } else {
        return null
      }
    }

    service.removePedidoSalvo = function (pedido) {
      let listaPedidosSalvos = service.getPedidosSalvo()
      if (listaPedidosSalvos && pedido.idPedidoSalvo) {
        let indice = undefined
        listaPedidosSalvos.forEach(function (item, index) {
          if (item.idPedidoSalvo === pedido.idPedidoSalvo) {
            indice = index
          }
        })
        if (indice !== undefined) {
          listaPedidosSalvos.splice(indice, 1)
        }
        if (listaPedidosSalvos.length === 0) {
          service.resetPedidosSalvo()
        } else {
          localStorage.setItem('pedidos', JSON.stringify(listaPedidosSalvos))
        }
      }
    }

    service.resetPedidosSalvo = function () {
      if (localStorage.getItem('pedidos')) {
        localStorage.removeItem('pedidos');
      }
    }

    function setPedidosSalvo (pedido) {
      let listaPedidosSalvos = []
      listaPedidosSalvos.push(pedido)
      pedido.idPedidoSalvo = 1
      localStorage.setItem('pedidos', JSON.stringify(listaPedidosSalvos))
      return pedido.idPedidoSalvo;
    }

    return service;
  }
]);