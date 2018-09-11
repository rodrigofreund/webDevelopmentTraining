'use strict';

var PedidoModule = angular.module('pedido.module');

PedidoModule.factory('PedidoStorageService', ['$filter',
  function ($filter) {

    var service = {};

    service.setPedidosSalvo = function (pedido) {
      let listaPedidosSalvos = []
      listaPedidosSalvos.push(pedido)
      pedido.idPedidoSalvo = 1
      localStorage.setItem('pedidos', JSON.stringify(listaPedidosSalvos))
    }

    service.addPedidosSalvo = function (pedido) {
      let listaPedidosSalvos = service.getPedidosSalvo()
      if (!listaPedidosSalvos) {
        service.setPedidosSalvo(pedido)
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
      }
    }

    service.getPedidosSalvo = function () {
      if (localStorage.getItem('pedidos') !== 'undefined') {
        return JSON.parse(localStorage.getItem('pedidos'))
      } else {
        return undefined
      }
    }

    service.removePedidoSalvo = function (pedido) {
      let listaPedidosSalvos = service.getPedidosSalvo()
      if (listaPedidosSalvos) {
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

    return service;
  }
]);