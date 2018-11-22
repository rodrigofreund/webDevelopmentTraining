'use strict';

var UsuarioModulo = angular.module('usuario.module');

UsuarioModulo.component('pesquisaUsuarioComponent', {
	templateUrl: 'modules/usuario/components/pesquisa/pesquisa.html',
	controllerAs: 'ctrl',
	controller: function usuarioModuloController($state, UsuarioService, NotificationService, ModalService) {
		var changeFilter = true

		var vm = this

		vm.totalItens = 0
		vm.filter = {
			pageSize: 10,
			newPage: 1
		}
		// SE $event FOR PASSADO O COMPONENTE NAO PERDE O FOCO
		vm.pesquisa = ($event) => {
			if (!changeFilter) {
				return
			}
			UsuarioService.pesquisa(vm.filter).then((result) => {
				vm.result = result
				vm.lista = vm.result.content;
				vm.totalItens = vm.result.totalElements
				if (vm.lista) {
					changeFilter = false
					if ($event && $event.target) {
						$event.target.focus()
					}
				}
			})
		}

		vm.verificaPesquisa = ($event) => {
			if ($event.charCode === ENTER_KEY_CODE) {
				vm.pesquisa($event)
			}
		}

		//APENAS EFETUA A PESQUISA SE O FILTRO FOI ALTERADO
		vm.changeField = () => {
			changeFilter = true
		}

		vm.mudaPagina = () => {
			changeFilter = true
			vm.pesquisa()
		}

		vm.editarRegistro = (id) => {
			$state.go('main.usuario.edicao', { 'id': id })
		}

		vm.novoUsuario = function () {
			$state.go('usuario.cadastro')
		}

		vm.inativarUsuario = function (id) {
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
						NotificationService.success(`Usuário ${usuario} DESABILITADO com sucesso!`)
						changeFilter = true
						vm.pesquisa()
					})
				})
			})
		}

		vm.excluirUsuario = function (id) {
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
						NotificationService.success(`Usuário ${usuario} EXCLUÍDO com sucesso!`)
						changeFilter = true
						vm.pesquisa()
					})
				})
			})
		}

		vm.pesquisa()

	}

});
