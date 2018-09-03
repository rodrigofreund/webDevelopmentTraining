'use strict';

var PedidoModule = angular.module('tabela.module');

PedidoModule.factory('TabelaService', ['HttpService',
  function(HttpService){
    var service = {};
    const SUBPATH = 'service/tabela';

    const URL_TABELA_UPLOAD = `${SUBPATH}/uploadTabela`;
    const URL_TABELA_BUSCAR_POR_INDUSTRIAS = `${SUBPATH}/getTabelasPorIndustria`;
    const URL_TABELA_EXCLUIR = `${SUBPATH}/excluirTabela`;
    const URL_TABELA_DOWNLOAD_ARQUIVO = `${SUBPATH}/downloadArquivoTabela`;
    const URL_TABELA_BUSCAR_POR_ID = `${SUBPATH}/buscaTabelaPorId`;

    service.uploadTabela = (file) => {
      var fd = new FormData();
      fd.append('file', file);
      return HttpService.httpPost(URL_TABELA_UPLOAD, fd);
    };

    service.getTabelasPorIndustria = (idIndustria) => {
      return HttpService.httpPost(URL_TABELA_BUSCAR_POR_INDUSTRIAS, idIndustria);
    };

    service.excluirTabela = (idTabela) => {
      return HttpService.httpPost(URL_TABELA_EXCLUIR, idTabela);
    };

    service.excluirTabela = (idTabela) => {
      return HttpService.httpGet(URL_TABELA_DOWNLOAD_ARQUIVO, idTabela);
    };

    service.buscaTabelaPorId = (idTabela) => {
      return HttpService.httpGet(URL_TABELA_BUSCAR_POR_ID, idTabela);
    };

    return service;
  }
]);