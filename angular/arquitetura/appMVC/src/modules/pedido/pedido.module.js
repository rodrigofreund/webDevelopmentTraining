import angular from 'angular';
import {PedidoNovo} from './components/pedido.novo/pedido.novo.controller';

const MODULE_NAME = 'pedido.module';

export const PedidoModule = () => {
  angular.module(MODULE_NAME, ['ui.router'])
    .component('PedidoNovo', PedidoNovo);
};
