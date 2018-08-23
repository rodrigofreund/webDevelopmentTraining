'use strict'

var UsuarioModule = angular.module('usuario.module')

UsuarioModule.factory('UsuarioService', ['HttpService',
  function(HttpService) {
    var service = {}

    service.pesquisa = (filter) => {
      return HttpService.httpPost('getUsuariosByFilter', filter);
    }

    service.listaPerfil = () => {
      return HttpService.httpGet('/getListaPerfil');
    }

    service.salvaUsuario = (usuarioDto) => {
      return HttpService.httpPost('/salvaUsuario', usuarioDto);
    }

    service.buscaUsuarioPorId = (idUsuario) => {
      return HttpService.httpGet('/buscaUsuarioPorId', {'idUsuario':idUsuario});
    }

    service.buscaUsuarioPorLogin = (login) => {
      HttpService.httpPost('/buscaUsuarioPorLogin', login);
    }

    service.verificarImportacaoBaseUsuario = (importacaoUsuarioDto) => {
      return HttpService.httpPost('/verificarImportacaoBaseUsuario', importacaoUsuarioDto);
    }

    service.buscaUsuarioCadastroDto = (idUsuario) => {
      return HttpService.httpGet('/buscaRepresentacoesPorIdUsuario', {'idUsuario':idUsuario});
    }

    service.importarBaseUsuario = (importacaoUsuarioDto, callback) => {
      return HttpService.httpPost('/importarBaseUsuario', importacaoUsuarioDto);
    }

    return service;
  }
])