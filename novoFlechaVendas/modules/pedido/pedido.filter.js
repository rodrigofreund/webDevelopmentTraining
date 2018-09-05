'use strict';

var PedidoModule = angular.module('pedido.module');

PedidoModule.filter('itensAdicionadosFilter', function () {
  return function (items) {
    var out = [];

    if (angular.isArray(items)) {

      items.forEach(function (item) {
        var itemMatches = false;

        if (item.hasOwnProperty('inserido')) {
          itemMatches = true
        }
        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      out = items;
    }

    return out;
  };
});

PedidoModule.filter('itensNaoAdicionadosFilter', function () {
  return function (items) {
    var out = [];

    if (angular.isArray(items)) {

      items.forEach(function (item) {
        var itemMatches = true;

        if (item.hasOwnProperty('inserido')) {
          itemMatches = false
        }
        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      out = items;
    }

    return out;
  };
});

PedidoModule.filter('percentage', ['$filter', function($filter){
  return function(input) {
    return $filter('number')(input * 100) + '%';
  };
}]);
