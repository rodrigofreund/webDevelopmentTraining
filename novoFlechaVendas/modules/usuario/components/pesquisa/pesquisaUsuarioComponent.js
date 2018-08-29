'use strict';

var UsuarioModulo = angular.module('usuario.module');

UsuarioModulo.component('pesquisaUsuarioComponent', {
	templateUrl: 'modules/usuario/components/pesquisa/views/pesquisa.html',
	controllerAs: 'ctrl',
	controller: function usuarioModuloController($state, UsuarioService, NotificationService, ModalService) {
		var changeFilter = true

		this.vm = this

		this.vm.totalItens = 0
		this.vm.filter = {
			pageSize: 10,
			newPage: 1
		}
		// SE $event FOR PASSADO O COMPONENTE NAO PERDE O FOCO
		this.vm.pesquisa = ($event) => {
			if (!changeFilter) {
				return
			}
			UsuarioService.pesquisa(this.vm.filter).then((result) => {
				this.vm.result = result
				this.vm.lista = this.vm.result.content;
				this.vm.totalItens = this.vm.result.totalElements
				if (this.vm.lista) {
					changeFilter = false
					if ($event && $event.target) {
						$event.target.focus()
					}
				}
			})
		}

		this.vm.verificaPesquisa = ($event) => {
			if ($event.charCode === ENTER_KEY_CODE) {
				this.vm.pesquisa($event)
			}
		}

		//APENAS EFETUA A PESQUISA SE O FILTRO FOI ALTERADO
		this.vm.changeField = () => {
			changeFilter = true
		}

		this.vm.mudaPagina = () => {
			changeFilter = true
			this.vm.pesquisa()
		}

		this.vm.editarRegistro = (id) => {
			$state.go('main.usuario.edicao', { 'id': id })
		}

		this.vm.novoUsuario = function () {
			$state.go('usuario.cadastro')
		}

		this.vm.inativarUsuario = function (id) {
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
						this.vm.pesquisa()
					})
				})
			})
		}

		this.vm.excluirUsuario = function (id) {
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
						this.vm.pesquisa()
					})
				})
			})
		}

		this.vm.pesquisa()

	}

});
