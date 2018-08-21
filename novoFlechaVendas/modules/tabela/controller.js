'use strict';
var TabelaModule = angular.module('Tabela')
	.controller('TabelaController', ['$scope', '$rootScope', '$location', '$http', '$routeParams', '$window', 'TabelaService', 'IndustriasService', 'AuthenticationService', 'ModalService', 'blockUI', 'NotificationService', 
		function ($scope, $rootScope, $location, $http, $routeParams, $window, TabelaService, IndustriasService, AuthenticationService, ModalService, blockUI, NotificationService) {

		$scope.tabelas = [];

		$scope.fileTabela = null;

		$scope.industria = {
			selecionado: null
		};

		$scope.tabela = {}

		IndustriasService.getIndustriasUsuario($rootScope.globals.currentUser.user.id, function (response) {
			$scope.industrias = response;
		});

		$scope.selecionaIndustria = function () {
			IndustriasService.getTabelasIndustria($scope.industria.selecionado.id, function (response) {
				$scope.tabelas = response;
			});
		}

		var idTabela = $routeParams.idTabela
		if(idTabela) {
			//busca dados da tabela
			TabelaService.buscaTabelaPorId(idTabela, function(response){
				$scope.tabela = response;
			})
		} else {
			if(sessionStorage.industria) {
				$scope.industria.selecionado = JSON.parse(sessionStorage.getItem('industria')).selecionado
				sessionStorage.removeItem('industria')
				$scope.selecionaIndustria()
			}
		}

		$scope.isVendedor = function () {
			return AuthenticationService.isVendedor();
		}

		$scope.removerTabela = function (tabelaAtual) {
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: 'Confirma remoção da ' + tabelaAtual.nome + '?'
			};

			ModalService.showModal({}, modalOptions).then(function (result) {
				TabelaService.excluirTabela(tabelaAtual, function (response) {
					IndustriasService.getTabelasIndustria($scope.industria.selecionado.id, function (response) {
						$scope.tabelas = response;
					});
					NotificationService.success(response.nome + ' excluída com sucesso!')
				});
			});
		}

		$scope.uploadTabela = function () {
			var file = $scope.fileTabela;
			blockUI.start('Carregando Tabela, Aguarde...');
			TabelaService.uploadTabelaToUrl(file, function () {
				IndustriasService.getTabelasIndustria($scope.industria.selecionado.id, function (response) {
					$scope.tabelas = response;
					blockUI.stop();
				});
			}, function (error) {
				blockUI.stop();
			});
		}

		function _base64ToArrayBuffer(base64) {
			var binary_string =  $window.atob(base64);
			var len = binary_string.length;
			var bytes = new Uint8Array( len );
			for (var i = 0; i < len; i++) {
					bytes[i] = binary_string.charCodeAt(i);
			}
			return bytes.buffer;
		}

		function b64toBlob(b64Data, contentType, sliceSize) {
			return new Blob([_base64ToArrayBuffer(b64Data)], {type: contentType});
		}

		$scope.downloadTabela = (idTabela) => {
			TabelaService.downloadArquivo(idTabela, (data) => {
					let a = document.createElement("a");
					document.body.appendChild(a);
					a.style = "display: none";
					var blob = b64toBlob(data.arquivo, 'application/octet-stream');
					let url = $window.webkitURL.createObjectURL(blob);
					a.href = url;
					a.download = data.nomeArquivo;
					a.click();
					$window.webkitURL.revokeObjectURL(url);
			})
		}

		$scope.detalheTabela = function(idTabela) {
			sessionStorage.industria = JSON.stringify({ selecionado:$scope.industria.selecionado })
			$location.path(`/detalheTabela/${idTabela}`)
		}

	}]);

TabelaModule.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function () {
				scope.$apply(function () {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);
