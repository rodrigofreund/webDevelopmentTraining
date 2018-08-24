'use strict'

var UsuarioModulo = angular.module('usuario.module')

UsuarioModulo.component('cadastroCompletoUsuarioComponent', {
	templateUrl: 'modules/usuario/components/cadastroCompleto/views/cadastroCompleto.html',
	bindings: {},
	controllerAs: 'ctrl',
	controller: function usuarioModuloController(
		$scope,
		$state,
		UsuarioService,
		IndustriaService,
		NotificationService,
		LoginService,
		ModalService,
		$log
	) {

		var vm = this;

		if ($state.params.id) {
			//Buscar dados do usuário
			UsuarioService.buscaUsuarioPorId($state.params.id).then((result) => {
				vm.cadastro = result
				vm.senhaOriginal = LoginService.getPassword(vm.cadastro.senha.senha1)
				vm.cadastro.senha.senha1
				vm.representacoes = result.representacoes
			})
		} else {
			vm.cadastro = {
				ativo: true
			}
			vm.representacoes = []
		}

		vm.representacao = {
			industria: null
		}
		vm.listaIndustria = []
		vm.senhaAlterada = false
		vm.importacao = {
			usuario: null
		}

		UsuarioService.listaPerfil().then((result) => {
			vm.listaPerfil = result.data
		})

		vm.selecionaTabRepresentacao = function () {

			IndustriaService.getIndustrias().then((result) => {
				vm.listaIndustria = result.data
			})
			if (vm.cadastro.id) {
				UsuarioService.buscaUsuarioCadastroDto(vm.cadastro.id).then((result) => {
					vm.representacoes = result.data.representacoes
				})
			}
		}

		vm.selecionaTabRepresentacaoCliente = function () {

			UsuarioService.buscaUsuarios().then((result) => {
				vm.usuarios = result;
				vm.nomeUsuarioFormatado = `${vm.cadastro.id} - ${vm.cadastro.nome}`;
			});
		}

		vm.criaRepresentacao = function () {
			var listaEncontrados = $.grep(vm.representacoes, function (e, i) {
				return e.idIndustria == vm.representacao.industria.id;
			});
			if (listaEncontrados && listaEncontrados.length > 0) {
				NotificationService.alert('Indústria já cadastrada para o usuário.')
			} else {
				var representacaoDto = new RepresentacaoDto(vm.cadastro, vm.representacao.industria);
				vm.representacoes.push(representacaoDto)
			}
		}

		vm.salvaUsuario = function () {
			ajustesCriptografiaSenha()
			vm.cadastro.representacoes = vm.representacoes
			if (validaSenha()) {
				UsuarioService.salvaUsuario(vm.cadastro).then((result) => {
					vm.cadastro = result
					vm.senhaOriginal = LoginService.getPassword(vm.cadastro.senha.senha1)
					vm.senhaAlterada = false
					NotificationService.success('Usuário cadastrado com sucesso!')
				})
			} else {
				NotificationService.error('Senhas informadas não são iguais')
			}
		}

		vm.excluiUsuario = function () {
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: `Ao EXCLUIR o usuário o não será mais possível acessar os dados deste! Confirma?`
			};
			ModalService.showModal({}, modalOptions).then(function (result) {
				UsuarioService.buscaUsuarioPorId(vm.cadastro.id, function (result) {
					result.excluido = true
					UsuarioService.salvaUsuario(result, function (usuario) {
						NotificationService.success("Usuário EXCLUÍDO com sucesso!")
						$state.go('usuario.pesquisa')
					})
				})
			})
		}

		vm.sinalizaSenhaAlterada = function () {
			vm.senhaAlterada = true
		}

		vm.isVendedor = function () {
			return LoginService.isVendedor();
		}

		vm.importar = function () {
			if (vm.cadastro.id === vm.importacao.usuario.id) {
				NotificationService.alert('Não é possível importar para o mesmo usuário')
				return
			}
			var importacaoUsuarioDto = {
				idUsuarioOrigem: vm.importacao.usuario.id,
				idUsuarioDestino: vm.cadastro.id
			}
			UsuarioService.verificarImportacaoBaseUsuario(importacaoUsuarioDto, function (result) {
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
					templateUrl: 'modules/partials/modalImportacaoClientesUsuario.html',
				};
				ModalService.showModal(modalDefaults, modalOptions).then(function (modalResult) {
					UsuarioService.importarBaseUsuario(result, function (importacaoResult) {
						NotificationService.success(`Importação realizada com sucesso! ${importacaoResult} clientes importados.`)
						$state.go('usuario.edicao', { 'id': vm.cadastro.id })
					})
				});
			})
		}

		vm.verificaUsuarioCadastradoPorLogin = () => {
			UsuarioService.buscaUsuarioPorLogin(vm.cadastro.login).then(result => {
				if (result) {
					NotificationService.error('Login do usuário já existente');
					vm.cadastro.login = null
				}
			});
		}

		function ajustesCriptografiaSenha() {
			if (vm.cadastro.id) {
				if (vm.senhaAlterada && vm.senhaOriginal != vm.cadastro.senha.senha1) {
					vm.cadastro.senha.senha1 = LoginService.getPasswordEncoded(vm.cadastro.senha.senha1)
					vm.cadastro.senha.senha2 = LoginService.getPasswordEncoded(vm.cadastro.senha.senha2)
				}
			} else {
				vm.cadastro.senha.senha1 = LoginService.getPasswordEncoded(vm.cadastro.senha.senha1)
				vm.cadastro.senha.senha2 = LoginService.getPasswordEncoded(vm.cadastro.senha.senha2)
			}
		}

		function validaSenha() {
			return vm.cadastro.senha.senha1 === vm.cadastro.senha.senha2
		}
	}
})
