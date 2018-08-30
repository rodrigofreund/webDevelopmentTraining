'use strict';

var ClienteModule = angular.module('usuario.module');

ClienteModule.factory('ClienteService', ['HttpService',
  function (HttpService) {
    var service = {};
    const SUBPATH = 'service/cliente';

    const URL_CLIENTE_SALVAR = `${SUBPATH}/salvarCliente`;
    const URL_CLIENTE_POR_LOGIN = `${SUBPATH}/getClientesByLogin`;
    const URL_CLIENTE_POR_FILTRO = `${SUBPATH}/getClientesByFilter`;
    const URL_CLIENTE_EXISTENTE = `${SUBPATH}/getClienteExistente`;
    const URL_CLIENTE_POR_REPRESENTACAO = `${SUBPATH}/getClientesPorRepresentacao`;
    const URL_CLIENTE_EXCLUIR = `${SUBPATH}/excluirCliente`;


    service.salvarCliente = (clienteDto) => {
      return HttpService.httpPost(URL_CLIENTE_SALVAR, clienteDto);
    };

    service.getClientesPorLogin = (login) => {
      return HttpService.httpPost(URL_CLIENTE_POR_LOGIN, login);
    };

    service.getClientesPorFiltro = (clienteDto) => {
      return HttpService.httpPost(URL_CLIENTE_POR_FILTRO, clienteDto);
    };

    service.getClientePorCnpj = (cnpj) => {
      return HttpService.httpPost(URL_CLIENTE_EXISTENTE, cnpj);
    };

    service.getClientesPorRepresentacao = (buscaClientesDto) => {
      return HttpService.httpPost(URL_CLIENTE_POR_REPRESENTACAO, buscaClientesDto);
    };

    service.excluirCliente = (idCliente) => {
      return HttpService.httpPost(URL_CLIENTE_EXCLUIR, idCliente);
    };

    return service;
  }
]);
