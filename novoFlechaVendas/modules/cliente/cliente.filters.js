'use strict';

ClienteModulo.filter('sim_nao', function () {
  return function (text, length, end) {
    if (text) {
      return 'Sim';
    }
    return 'Não';
  }
});