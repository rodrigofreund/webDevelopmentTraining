'use strict';

var PedidoModule = angular.module('industria.prazo.module');

PedidoModule.factory('IndustriaPrazoService', ['HttpService',
  function (HttpService) {
    var service = {};
    const SUBPATH = 'service/industriaprazo';

    const URL_INDUSTRIA_PRAZO_SALVAR = `${SUBPATH}/salvaIndustriaPrazo`;
    const URL_INDUSTRIA_PRAZO_BUSCAR_POR_INDUSTRIA = `${SUBPATH}/getIndustriaPrazo`;
    const URL_INDUSTRIA_PRAZO_BUSCAR_POR_ID = `${SUBPATH}/getIndustriaPrazoById`;
    const URL_INDUSTRIA_PRAZO_CLIENTE = `/getIndustriaPrazoOuIndustriaClientePrazo`;
    const URL_INDUSTRIA_PRAZO_REMOVER = `${SUBPATH}/removerIndustriaPrazo`;
    const URL_INDUSTRIA_PRAZO_POR_INDUSTRIA_CLIENTE = `/getIndustriaClientePrazoPorIdIndustriaCliente`;

    service.salvaIndustriaPrazo = (industriaPrazoDto) => {
      return HttpService.httpPost(URL_INDUSTRIA_PRAZO_SALVAR, industriaPrazoDto);
    };

    service.atualizarStatusPedido = (idIndustria) => {
      return HttpService.httpGet(URL_INDUSTRIA_PRAZO_BUSCAR_POR_INDUSTRIA, idIndustria);
    };

    service.getIndustriaPrazoById = (idIndustriaPrazo) => {
      return HttpService.httpGet(URL_INDUSTRIA_PRAZO_BUSCAR_POR_ID, idIndustriaPrazo);
    };

    service.getIndustriaPrazoClientePrazo = (industriaPrazoSearchDto) => {
      return HttpService.httpPost(URL_INDUSTRIA_PRAZO_CLIENTE, industriaPrazoSearchDto);
    };

    service.removerIndustriaPrazo = (idIndustriaPrazo) => {
      return HttpService.httpGet(URL_INDUSTRIA_PRAZO_REMOVER, idIndustriaPrazo);
    };

    service.getIndustriaClientePrazoPorIdIndustriaCliente = () => {
      return HttpService.httpGet(URL_INDUSTRIA_PRAZO_POR_INDUSTRIA_CLIENTE);
    };

    return service;
  }
]);