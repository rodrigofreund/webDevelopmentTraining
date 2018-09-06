'use strict';

var IndustriaModule = angular.module('industria.module');

IndustriaModule.factory('IndustriaService', ['HttpService',
  function (HttpService) {
    var service = {};
    const SUBPATH = 'service/industria';

    const URL_INDUSTRIA_BUSCAR_INDUSTRIA_POR_ID_USUARIO = `${SUBPATH}/getIndustriasUsuario`;
    const URL_INDUSTRIA_BUSCAR_INDUSTRIA = `${SUBPATH}/getIndustrias`;

    service.getIndustriasByIdUsuario = (idUsuario) => {
      return HttpService.httpPost(URL_INDUSTRIA_BUSCAR_INDUSTRIA_POR_ID_USUARIO, idUsuario);
    };

    service.getIndustrias = () => {
      return HttpService.httpGet(URL_INDUSTRIA_BUSCAR_INDUSTRIA);
    };

    return service;
  }
]);
