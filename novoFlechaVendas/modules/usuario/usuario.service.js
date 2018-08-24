'use strict'

var UsuarioModule = angular.module('usuario.module')

UsuarioModule.factory('UsuarioService', ['HttpService',
  function (HttpService) {
    var service = {}

    const SUBPATH = 'service/usuario'

    service.pesquisa = (filter) => {
      return HttpService.httpPost(SUBPATH + '/getUsuariosByFilter', filter);
    }

    service.listaPerfil = () => {
      return HttpService.httpGet(SUBPATH + '/getListaPerfil');
    }

    service.salvaUsuario = (usuarioDto) => {
      return HttpService.httpPost(SUBPATH + '/salvaUsuario', usuarioDto);
    }

    service.buscaUsuarioPorId = (idUsuario) => {
      return HttpService.httpGet(SUBPATH + '/buscaUsuarioPorId', { 'idUsuario': idUsuario });
    }

    service.buscaUsuarioPorLogin = (login) => {
      return HttpService.httpPost(SUBPATH + '/buscaUsuarioPorLogin', login);
    }

    service.verificarImportacaoBaseUsuario = (importacaoUsuarioDto) => {
      return HttpService.httpPost(SUBPATH + '/verificarImportacaoBaseUsuario', importacaoUsuarioDto);
    }

    service.buscaUsuarioCadastroDto = (idUsuario) => {
      return HttpService.httpGet(SUBPATH + '/buscaRepresentacoesPorIdUsuario', { 'idUsuario': idUsuario });
    }

    service.importarBaseUsuario = (importacaoUsuarioDto, callback) => {
      return HttpService.httpPost(SUBPATH + '/importarBaseUsuario', importacaoUsuarioDto);
    }

    service.buscaUsuarios = () => {
      return HttpService.httpGet(SUBPATH + '/buscaUsuarios');
    }

    return service;
  }
])