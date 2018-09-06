'use strict';

var IndustriaModule = angular.module('industria.module');

IndustriaModule.component('cadastroPrazoComponent', {
  templateUrl: 'modules/industria/components/cadastroPrazo/views/cadastroPrazo.html',
  bindings: {
    listaIndustrias: '<'
  },
  controllerAs: 'ctrl',
  controller: function(IndustriaPrazoService, NotificationService, ModalService) {
    var ctrl = this;
    this.$onInit = init(ctrl);

    ctrl.adicionaDia = function () {
      let existe = $.grep(ctrl.listaPrazoDia, function(item) {
        return item === ctrl.prazoDia.prazo
      })
      if(existe.length > 0) {
        return
      } else {
        ctrl.listaPrazoDia.push(ctrl.prazoDia.prazo)
        ctrl.prazoDia.prazo = undefined
      }
    }

    ctrl.buscaDias = function (prazo) {
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
  
    ctrl.carregaDadosIndustria = function (industria) {
      ctrl.industriaPrazoDto.idIndustria = industria.id
  
      IndustriaPrazoService.getIndustriaPrazo(industria.id).then((result) => {
        ctrl.listaPrazo = result;
      });
    }
  
    ctrl.salvar = function () {
      if(!ctrl.listaPrazoDia || ctrl.listaPrazoDia.length < 1) {
        NotificationService.error('É necessário fornecer ao menos um dia!')
        return
      }
      ctrl.listaPrazoDia.forEach(element => {
        const industriaPrazoDiaDto = {
          prazo: element
        }
        ctrl.industriaPrazoDto.dias.push(industriaPrazoDiaDto)
      })
      IndustriaPrazoService.salvaIndustriaPrazo(ctrl.industriaPrazoDto).then(() => {
        NotificationService.success('Prazos da indústria atualizado com sucesso!');
        atualizaListaPrazos()
        inicializaDados()
      })
    }
  
    ctrl.removerDia = function () {
      ctrl.listaPrazoDia = $.grep(ctrl.listaPrazoDia, function (value) {
        return value !== ctrl.diaSelecionado.dia
      })
    }
  
    ctrl.excluirPrazosIndustria = function (idPrazoIndustria) {
      var modalOptions = {
        closeButtonText: 'Não',
        actionButtonText: 'Sim',
        headerText: 'Confirmar',
        bodyText: 'Confirma EXCLUSÃO do prazo para a indústria?'
      }
      ModalService.showModal({}, modalOptions).then(function (result) {
        IndustriaPrazoService.removerIndustriaPrazo(idPrazoIndustria).then(() => {
          NotificationService.success('Prazo excluído com sucesso!');
          atualizaListaPrazos()
        }), () => {
          NotificationService.error('Erro ao excluir prazo!!');
          atualizaListaPrazos()
        }
      })
    }

    function inicializaDados() {
      ctrl.industriaPrazoDto.dias = []
      ctrl.industriaPrazoDto.codigo = undefined
      ctrl.industriaPrazoDto.descricao = undefined
      ctrl.listaPrazoDia = []
    }
  
    function atualizaListaPrazos() {
      ctrl.carregaDadosIndustria(ctrl.industria.selecionado)
    }
  

    //---------------------------


    function init() {
      ctrl.industria = {}
      ctrl.listaPrazoDia = []
      ctrl.listaPrazo = []
      ctrl.diaSelecionado = {
        dia: undefined
      }
    
      ctrl.prazoDia = {
        prazo: undefined,
      }
    
      ctrl.industriaPrazoDto = {
        dias: []
      }

      inicializaDados();
    }
  }
});