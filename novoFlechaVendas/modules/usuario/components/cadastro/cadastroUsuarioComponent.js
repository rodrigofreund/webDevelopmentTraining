'use strict'

var UsuarioModulo = angular.module('usuario.module')

UsuarioModulo.component('cadastroUsuarioComponent', {
	templateUrl: 'modules/usuario/components/cadastro/views/cadastroUsuario.html',
	controllerAs: 'ctrl',
	bindings: {
    usuarioParaEditar: '<'
  },
	controller: function usuarioModuloController(
		$state,
		UsuarioService,
		IndustriaService,
		NotificationService,
		LoginService,
		ModalService
	) {

		this.vm = this;

		if (this.vm.usuarioParaEditar) {
			this.vm.cadastro = this.vm.usuarioParaEditar
			this.vm.senhaOriginal = LoginService.decodePassword(this.vm.cadastro.senha.senha1)
			this.vm.cadastro.senha.senha1
			this.vm.representacoes = this.vm.usuarioParaEditar.representacoes
		} else {
			this.vm.cadastro = {
				ativo: true
			}
			this.vm.representacoes = []
		}

		this.vm.representacao = {
			industria: null
		}
		this.vm.listaIndustria = []
		this.vm.senhaAlterada = false
		this.vm.importacao = {
			usuario: null
		}

		UsuarioService.listaPerfil().then((result) => {
			this.vm.listaPerfil = result
		})

		this.vm.selecionaTabRepresentacao = function () {

			IndustriaService.getIndustrias().then((result) => {
				this.vm.listaIndustria = result
			})
			if (this.vm.cadastro.id) {
				UsuarioService.buscaUsuarioCadastroDto(this.vm.cadastro.id).then((result) => {
					this.vm.representacoes = result.representacoes
				})
			}
		}

		this.vm.selecionaTabRepresentacaoCliente = function () {

			UsuarioService.buscaUsuarios().then((result) => {
				this.vm.usuarios = result;
				this.vm.nomeUsuarioFormatado = `${this.vm.cadastro.id} - ${this.vm.cadastro.nome}`;
			});
		}

		this.vm.criaRepresentacao = function () {
			var listaEncontrados = $.grep(this.vm.representacoes, function (e, i) {
				return e.idIndustria == this.vm.representacao.industria.id;
			});
			if (listaEncontrados && listaEncontrados.length > 0) {
				NotificationService.alert('Indústria já cadastrada para o usuário.')
			} else {
				var representacaoDto = new RepresentacaoDto(this.vm.cadastro, this.vm.representacao.industria);
				this.vm.representacoes.push(representacaoDto)
			}
		}

		this.vm.salvaUsuario = function () {
			ajustesCriptografiaSenha()
			this.vm.cadastro.representacoes = this.vm.representacoes
			if (validaSenha()) {
				UsuarioService.salvaUsuario(this.vm.cadastro).then((result) => {
					this.vm.cadastro = result
					this.vm.senhaOriginal = LoginService.getPassword(this.vm.cadastro.senha.senha1)
					this.vm.senhaAlterada = false
					NotificationService.success('Usuário cadastrado com sucesso!')
				})
			} else {
				NotificationService.error('Senhas informadas não são iguais')
			}
		}

		this.vm.excluiUsuario = function () {
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: `Ao EXCLUIR o usuário o não será mais possível acessar os dados deste! Confirma?`
			};
			ModalService.showModal({}, modalOptions).then(function (result) {
				UsuarioService.buscaUsuarioPorId(this.vm.cadastro.id, function (result) {
					result.excluido = true
					UsuarioService.salvaUsuario(result, function (usuario) {
						NotificationService.success("Usuário EXCLUÍDO com sucesso!")
						$state.go('usuario.pesquisa')
					})
				})
			})
		}

		this.vm.sinalizaSenhaAlterada = function () {
			this.vm.senhaAlterada = true
		}

		this.vm.isVendedor = function () {
			return LoginService.isVendedor();
		}

		this.vm.importar = function () {
			if (this.vm.cadastro.id === this.vm.importacao.usuario.id) {
				NotificationService.alert('Não é possível importar para o mesmo usuário')
				return
			}
			var importacaoUsuarioDto = {
				idUsuarioOrigem: this.vm.importacao.usuario.id,
				idUsuarioDestino: this.vm.cadastro.id
			}
			UsuarioService.verificarImportacaoBaseUsuario(importacaoUsuarioDto).then((result) => {
				var modalOptions = {
					closeButtonText: 'Cancelar',
					actionButtonText: 'Importar',
					headerText: `Dados a serem importados`,
					bodyDataList: result
				};
				var modalDefaults = {
					backdrop: true,
					keyboard: true,
					modalFade: true,
					templateUrl: 'modules/modal/modalImportacaoClientesUsuario.html',
				};
				ModalService.showModal(modalDefaults, modalOptions).then(function (modalResult) {
					UsuarioService.importarBaseUsuario(result, function (importacaoResult) {
						NotificationService.success(`Importação realizada com sucesso! ${importacaoResult} clientes importados.`)
						$state.go('usuario.edicao', { 'id': this.vm.cadastro.id })
					})
				});
			})
		}

		this.vm.verificaUsuarioCadastradoPorLogin = () => {
			UsuarioService.buscaUsuarioPorLogin(this.vm.cadastro.login).then(result => {
				if (result) {
					NotificationService.error('Login do usuário já existente');
					this.vm.cadastro.login = null
				}
			});
		}

		function ajustesCriptografiaSenha() {
			if (this.vm.cadastro.id) {
				if (this.vm.senhaAlterada && this.vm.senhaOriginal != this.vm.cadastro.senha.senha1) {
					this.vm.cadastro.senha.senha1 = LoginService.getPasswordEncoded(this.vm.cadastro.senha.senha1)
					this.vm.cadastro.senha.senha2 = LoginService.getPasswordEncoded(this.vm.cadastro.senha.senha2)
				}
			} else {
				this.vm.cadastro.senha.senha1 = LoginService.getPasswordEncoded(this.vm.cadastro.senha.senha1)
				this.vm.cadastro.senha.senha2 = LoginService.getPasswordEncoded(this.vm.cadastro.senha.senha2)
			}
		}

		function validaSenha() {
			return this.vm.cadastro.senha.senha1 === this.vm.cadastro.senha.senha2
		}
	}
})
