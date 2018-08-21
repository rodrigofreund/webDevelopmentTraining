'use strict'
angular.module('Industrias').controller('IndustriasController', ['$scope', 'IndustriasService', 'NotificationService', 'ModalService', constructor])

function constructor($scope, service, NotificationService, ModalService) {

  $scope.industria = {}
  $scope.listaPrazoDia = []
  $scope.listaPrazo = []
  $scope.diaSelecionado = {
    dia: undefined
  }

  $scope.prazoDia = {
    prazo: undefined,
  }

  $scope.industriaPrazoDto = {
    dias: []
  }

  inicializaDados()

  service.getIndustrias(function (result) {
    $scope.listaIndustrias = result
  })

  $scope.adicionaDia = function () {
    let existe = $.grep($scope.listaPrazoDia, function(item, index) {
      return item === $scope.prazoDia.prazo
    })
    if(existe.length > 0) {
      return
    } else {
      $scope.listaPrazoDia.push($scope.prazoDia.prazo)
      $scope.prazoDia.prazo = undefined
    }
  }

  $scope.buscaDias = function (prazo) {
    let strDias = ""
    if (prazo && prazo.dias) {
      prazo.dias.forEach(element => {
        if (strDias.length == 0) {
          strDias = element.prazo
        } else {
          strDias = `${strDias} - ${element.prazo}`
        }
      })
    }
    return strDias
  }

  $scope.carregaDadosIndustria = function (industria) {
    $scope.industriaPrazoDto.idIndustria = industria.id

    service.getPrazosIndustria(industria.id, function (result) {
      $scope.listaPrazo = result
    })
  }

  $scope.salvar = function () {
    if(!$scope.listaPrazoDia || $scope.listaPrazoDia.length < 1) {
      NotificationService.error('É necessário fornecer ao menos um dia!')
      return
    }
    $scope.listaPrazoDia.forEach(element => {
      const industriaPrazoDiaDto = {
        prazo: element
      }
      $scope.industriaPrazoDto.dias.push(industriaPrazoDiaDto)
    })
    service.salvaIndustriaPrazo($scope.industriaPrazoDto, function () {
      NotificationService.success('Prazos da indústria atualizado com sucesso!');
      atualizaListaPrazos()
      inicializaDados()
    })
  }

  $scope.removerDia = function () {
    $scope.listaPrazoDia = $.grep($scope.listaPrazoDia, function (value) {
      return value !== $scope.diaSelecionado.dia
    })
  }

  $scope.excluirPrazosIndustria = function (idPrazoIndustria) {
    var modalOptions = {
      closeButtonText: 'Não',
      actionButtonText: 'Sim',
      headerText: 'Confirmar',
      bodyText: 'Confirma EXCLUSÃO do prazo para a indústria?'
    }
    ModalService.showModal({}, modalOptions).then(function (result) {
      service.excluirPrazosIndustria(idPrazoIndustria, function () {
        NotificationService.success('Prazo excluído com sucesso!');
        atualizaListaPrazos()
      }), function () {
        NotificationService.error('Erro ao excluir prazo!!');
        atualizaListaPrazos()
      }
    })
  }

  function atualizaListaPrazos() {
    $scope.carregaDadosIndustria($scope.industria.selecionado)
  }

  function inicializaDados() {
    $scope.industriaPrazoDto.dias = []
    $scope.industriaPrazoDto.codigo = undefined
    $scope.industriaPrazoDto.descricao = undefined
    $scope.listaPrazoDia = []
  }

}
