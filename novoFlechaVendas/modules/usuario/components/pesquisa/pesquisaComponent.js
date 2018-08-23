'use strict';

var UsuarioModulo = angular.module('usuario.module');

UsuarioModulo.component('pesquisaUsuarioComponent', {
	templateUrl: 'modules/usuario/components/pesquisa/views/pesquisa.html',
	controllerAs: 'ctrl',
	controller: function usuarioModuloController($scope, $state, UsuarioService, NotificationService, ModalService) {
		var changeFilter = true
		$scope.paginaAtual = 0
		$scope.totalPaginas = 0

		$scope.filter = {
			pageSize: 10,
			newPage: 1
		}
		$scope.pesquisa = () => {
			if(!changeFilter) {
				return
			}

			UsuarioService.pesquisa($scope.filter).then((result) => {
				$scope.lista = result.data.content;
				if($scope.lista) {
					$scope.totalPaginas = result.data.totalPages
					$scope.paginaAtual = result.data.number + 1
					changeFilter = false
				}
			})

		}

		//APENAS EFETUA A PESQUISA SE O FILTRO FOI ALTERADO
		$scope.changeField = () => {
			changeFilter = true
		}

		$scope.mudaPagina = (pagina) => {
			changeFilter = true
			$scope.filter.newPage = pagina;
			$scope.pesquisa()
		}
	
		$scope.proximaPagina = () => {
			if ($scope.result.last == true) {
				return
			}
			changeFilter = true
			$scope.filter.newPage += 1;
			$scope.pesquisa()
		}
	
		$scope.anteriorPagina = () => {
			if ($scope.result.first == true) {
				return
			}
			changeFilter = true
			$scope.filter.newPage -= 1;
			$scope.pesquisa()
		}

		$scope.editarRegistro = (id) => {
			$state.go('usuario.edicao', {'id': id})
		}

		$scope.novoUsuario = function() {
			$state.go('usuario.cadastro')
		}

		$scope.inativarUsuario = function(id) {
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: `Ao DESABILITAR o usuário o mesmo não poderá mais acessar o sistema! Confirma?`
			};
			ModalService.showModal({}, modalOptions).then(function (result) {
				UsuarioService.buscaUsuarioPorId(id, function(result){
					result.ativo = false
					UsuarioService.salvaUsuario(result, function(usuario) {
						NotificationService.success("Usuário DESABILITADO com sucesso!")
						changeFilter = true
					})
				})
			})
		}

		$scope.excluirUsuario = function(id) {
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: `Ao EXCLUIR o usuário o não será mais possível acessar os dados deste! Confirma?`
			};
			ModalService.showModal({}, modalOptions).then(function (result) {
				UsuarioService.buscaUsuarioPorId(id, function(result){
					result.excluido = true
					UsuarioService.salvaUsuario(result, function(usuario) {
						NotificationService.success("Usuário EXCLUÍDO com sucesso!")
						changeFilter = true
						$scope.pesquisa()
					})
				})
			})
		}

		$scope.pesquisa()

	}

});
