'use strict'

var UsuarioModule = angular.module('UsuarioModulo')

UsuarioModule.factory('UsuarioService', ['$http', 'NetworkService', 'NotificationService',
  function($http, NetworkService, NotificationService) {
    var service = {}

    service.pesquisa = (filter, callback) => {
      NetworkService.httpPost('/getUsuariosByFilter', filter, (result, data) => {
        if (result == CALLRESULT.OK) {
          callback(data)
        } else if (result == CALLRESULT.ERROR) {
          NotificationService.error('Erro ao buscar lista usuários', data);
        } else {
          NotificationService.error('Não foi possível se comunicar com o servidor.');
        }
      })
    }

    service.listaPerfil = (callback) => {
      NetworkService.httpGet('/getListaPerfil', (result, data) => {
        if (result == CALLRESULT.OK) {
          callback(data)
        } else if (result == CALLRESULT.ERROR) {
          NotificationService.error('Erro ao buscar lista perfis', data);
        } else {
          NotificationService.error('Não foi possível se comunicar com o servidor.');
        }
      })
    }

    service.salvaUsuario = (usuarioDto, callback) => {
      NetworkService.httpPost('/salvaUsuario', usuarioDto, (result, data) => {
        if (result == CALLRESULT.OK) {
          callback(data)
        } else if (result == CALLRESULT.ERROR) {
          NotificationService.error('Erro ao salvar usuário', data);
        } else {
          NotificationService.error('Não foi possível se comunicar com o servidor.');
        }
      })
    }

    service.buscaUsuarioPorId = (idUsuario, callback) => {
      NetworkService.httpGet(`/buscaUsuarioPorId?idUsuario=${idUsuario}`, (result, data) => {
        if (result == CALLRESULT.OK) {
          callback(data)
        } else if (result == CALLRESULT.ERROR) {
          NotificationService.error('Erro ao buscar dados do usuário usuário', data);
        } else {
          NotificationService.error('Não foi possível se comunicar com o servidor.');
        }
      })
    }

    service.buscaUsuarioPorLogin = (login, callback) => {
      NetworkService.httpPost('/buscaUsuarioPorLogin', login, (result, data) => {
        if (result == CALLRESULT.OK) {
          callback(data)
        } else if (result == CALLRESULT.ERROR) {
          NotificationService.error('Erro ao buscar dados do usuário', login);
        } else {
          NotificationService.error('Não foi possível se comunicar com o servidor.');
        }
      })
    }

    service.verificarImportacaoBaseUsuario = (importacaoUsuarioDto, callback) => {
      NetworkService.httpPost('/verificarImportacaoBaseUsuario', importacaoUsuarioDto, (result, data) => {
        if (result == CALLRESULT.OK) {
          callback(data)
        } else if (result == CALLRESULT.ERROR) {
          NotificationService.error('Erro ao buscar resultado da importação', data);
        } else {
          NotificationService.error('Não foi possível se comunicar com o servidor.');
        }
      })
    }

    service.buscaUsuarioCadastroDto = (idUsuario, callback) => {
      NetworkService.httpGet(`/buscaRepresentacoesPorIdUsuario?idUsuario=${idUsuario}`, (result, data) => {
        if (result == CALLRESULT.OK) {
          callback(data)
        } else if (result == CALLRESULT.ERROR) {
          NotificationService.error('Erro ao buscar dados do usuário', idUsuario);
        } else {
          NotificationService.error('Não foi possível se comunicar com o servidor.');
        }
      })
    }

    service.importarBaseUsuario = (importacaoUsuarioDto, callback) => {
      NetworkService.httpPost('/importarBaseUsuario', importacaoUsuarioDto, (result, data) => {
        if (result == CALLRESULT.OK) {
          callback(data)
        } else if (result == CALLRESULT.ERROR) {
          NotificationService.error('Erro ao buscar resultado da importação', data);
        } else {
          NotificationService.error('Não foi possível se comunicar com o servidor.');
        }
      })
    }

    return service
  }
])