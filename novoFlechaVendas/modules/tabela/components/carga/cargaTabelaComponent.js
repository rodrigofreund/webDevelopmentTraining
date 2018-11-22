'use strict';

var TabelaModulo = angular.module('tabela.module');

PedidoModulo.component('cargaTabelaComponent', {
  templateUrl: 'modules/tabela/components/carga/cargaTabela.html',
  bindings: {
    listaIndustrias: '<'
  },
  controllerAs: 'ctrl',
  controller: function ($log, TabelaService, IndustriaService, $window, $state, FileService, NotificationService, ModalService) {
    var ctrl = this;

    ctrl.selecionaIndustria = function () {
      if(!ctrl.industria) {
        ctrl.tabelas = []
        sessionStorage.removeItem('tabelaIndustriaSelecionada');
        return;
      }
      TabelaService.getTabelasPorIndustria(ctrl.industria.id).then(function (response) {
        ctrl.tabelas = response;
        sessionStorage.setItem('tabelaIndustriaSelecionada', ctrl.industria.id);
      });
    }

    ctrl.uploadTabela = function () {
			var file = ctrl.fileTabela;
			TabelaService.uploadTabela(file).then(function () {
				IndustriaService.getTabelasIndustria(ctrl.industria.id).then(function (response) {
          ctrl.tabelas = response;
				});
			})
    }

    ctrl.detalheTabela = function(idTabela) {
      $state.go('main.tabela.detalhe', {idTabela});
    }

    ctrl.removerTabela = function(tabela) {
      var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: 'Confirma remoção da ' + tabela.nome + '?'
			};

			ModalService.showModal({}, modalOptions).then(function () {
        TabelaService.excluirTabela(tabela.id).then(tabelaDto => {
          NotificationService.success(`Tabela ${tabelaDto.id} excluída com sucesso!`);
          $state.go($state.current, {}, {reload: true});
        });
			});
    }
    
    ctrl.downloadTabela = (idTabela) => {
      TabelaService.downloadArquivo(idTabela).then(data => {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = FileService.b64toBlob(data.arquivo, 'application/octet-stream');
        let url = $window.webkitURL.createObjectURL(blob);
        a.href = url;
        a.download = data.nomeArquivo;
        a.click();
        $window.webkitURL.revokeObjectURL(url);
      })
		}

    function init() {
      $log.log('init carga de tabelas');
      ctrl.tabelas = [];
      let idIndustria = sessionStorage.getItem('tabelaIndustriaSelecionada');
      if(idIndustria) {
        ctrl.industria = {
          id : idIndustria
        }
        ctrl.selecionaIndustria();
      }
    };
    this.$onInit = init();
  }
});
