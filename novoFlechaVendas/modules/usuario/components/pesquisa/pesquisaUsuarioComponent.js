'use strict';

var UsuarioModulo = angular.module('usuario.module');

UsuarioModulo.component('pesquisaUsuarioComponent', {
	templateUrl: 'modules/usuario/components/pesquisa/views/pesquisa.html',
	controllerAs: 'ctrl',
	controller: function usuarioModuloController($scope, $state, UsuarioService, NotificationService, ModalService) {
		var changeFilter = true

		$scope.totalItens = 0
		$scope.filter = {
			pageSize: 10,
			newPage: 1
		}
		// SE $event FOR PASSADO O COMPONENTE NAO PERDE O FOCO
		$scope.pesquisa = ($event) => {
			if (!changeFilter) {
				return
			}
			UsuarioService.pesquisa($scope.filter).then((result) => {
				$scope.result = result
				$scope.lista = $scope.result.content;
				$scope.totalItens = $scope.result.totalElements
				if ($scope.lista) {
					changeFilter = false
					if ($event && $event.target) {
						$event.target.focus()
					}
				}
			})
		}

		$scope.verificaPesquisa = ($event) => {
			if ($event.charCode === ENTER_KEY_CODE) {
				$scope.pesquisa($event)
			}
		}

		//APENAS EFETUA A PESQUISA SE O FILTRO FOI ALTERADO
		$scope.changeField = () => {
			changeFilter = true
		}

		$scope.mudaPagina = () => {
			changeFilter = true
			$scope.pesquisa()
		}

		$scope.editarRegistro = (id) => {
			$state.go('main.usuario.edicao', { 'id': id })
		}

		$scope.novoUsuario = function () {
			$state.go('usuario.cadastro')
		}

		$scope.inativarUsuario = function (id) {
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: `Ao DESABILITAR o usuário o mesmo não poderá mais acessar o sistema! Confirma?`
			};
			ModalService.showModal({}, modalOptions).then(function (result) {
				UsuarioService.buscaUsuarioPorId(id).then((result) => {
					result.ativo = false
					UsuarioService.salvaUsuario(result).then((usuario) => {
						NotificationService.success(`Usuário ${usuario.nome} DESABILITADO com sucesso!`)
						changeFilter = true
						$scope.pesquisa()
					})
				})
			})
		}

		$scope.excluirUsuario = function (id) {
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: `Ao EXCLUIR o usuário o não será mais possível acessar os dados deste! Confirma?`
			};
			ModalService.showModal({}, modalOptions).then(function (result) {
				UsuarioService.buscaUsuarioPorId(id).then((result) => {
					result.excluido = true
					UsuarioService.salvaUsuario(result).then((usuario) => {
						NotificationService.success(`Usuário ${usuario.nome} EXCLUÍDO com sucesso!`)
						changeFilter = true
						$scope.pesquisa()
					})
				})
			})
		}

		$scope.pesquisa()

	}

});
