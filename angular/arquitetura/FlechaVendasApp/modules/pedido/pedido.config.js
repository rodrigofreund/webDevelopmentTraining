var pedidoModule = angular.module('pedido.module')

pedidoModule.config(['$stateProvider', function($stateProvider) {

  var pedidoState = {
    name: 'app.pedido',
    url: '/pedido',
    abstract: true,
    template: '<ui-view></ui-view>'
  }

  var pedidoNovoState = {
    name: 'app.pedido.pedido-novo',
    url: '/pedido-novo',
    component: 'pedidoNovo'
  }

  var pedidoItensState = {
    name: 'app.pedido.pedido-itens',
    url: '/pedido-itens',
    component: 'pedidoItens'
  }

  var pedidoFinalizaState = {
    name: 'app.pedido.pedido-finaliza',
    url: '/pedido-finaliza',
    component: 'pedidoFinaliza'
  }

  $stateProvider.state(pedidoState)
  $stateProvider.state(pedidoNovoState)
  $stateProvider.state(pedidoItensState)
  $stateProvider.state(pedidoFinalizaState)
}])