'use strict'

var UsuarioModulo = angular.module('usuario.module')

UsuarioModulo.component('cadastroUsuarioComponent', {
	templateUrl: 'modules/usuario/components/cadastro/cadastroUsuario.html',
	controllerAs: 'ctrl',
	bindings: {
		cadastro: '<'
	},
	controller: function usuarioModuloController(
		$state,
		$q,
		UsuarioService,
		IndustriaService,
		NotificationService,
		LoginService,
		ModalService,
		ClienteService
	) {

		var ctrl = this;

		if (ctrl.cadastro) {
			ctrl.senhaOriginal = LoginService.decodePassword(ctrl.cadastro.senha.senha1);
			ctrl.representacoes = ctrl.cadastro.representacoes;
		} else {
			ctrl.cadastro = {
				ativo: true
			}
			ctrl.representacoes = []
		}

		ctrl.representacao = {
			industria: null
		}
		ctrl.listaIndustria = []
		ctrl.senhaAlterada = false
		ctrl.importacao = {
			usuario: null
		}

		UsuarioService.listaPerfil().then((result) => {
			ctrl.listaPerfil = result
		})

		ctrl.listaNomeBancos = ClienteService.buscaNomesBancos();

		ctrl.selecionaTabRepresentacao = function () {
			IndustriaService.getIndustrias().then((result) => {
				ctrl.listaIndustria = result
			})
			if (ctrl.cadastro.id) {
				UsuarioService.buscaUsuarioCadastroDto(ctrl.cadastro.id).then((result) => {
					ctrl.representacoes = result.representacoes;
				});
			}
		}

		ctrl.selecionaTabClientes = function () {
			const filtro = {
				idUsuario: ctrl.cadastro.id,
				newPage: 1,
				pageSize: 100000
			}
			ClienteService.getClientesPorFiltro(filtro).then(result => {
				ctrl.clientes = result.content;
			});
		}

		ctrl.selecionaTabImportacao = function () {
			UsuarioService.buscaUsuarios().then((result) => {
				ctrl.usuarios = result;
				ctrl.nomeUsuarioFormatado = `${ctrl.cadastro.id} - ${ctrl.cadastro.nome}`;
			});
		}

		ctrl.criaRepresentacao = function () {
			var listaEncontrados = $.grep(ctrl.representacoes, function (e) {
				return e.idIndustria == ctrl.representacao.industria.id;
			});
			if (listaEncontrados && listaEncontrados.length > 0) {
				NotificationService.alert('Indústria já cadastrada para o usuário.')
			} else {
				let representacaoDto = {
					id: null,
					idIndustria: ctrl.representacao.industria.id,
					nomeIndustria: ctrl.representacao.industria.nome,
					idUsuario: ctrl.cadastro.id,
					nomeUsuario: ctrl.cadastro.nome,
					ativo: true
				};
				ctrl.representacoes.push(representacaoDto);
			}
		}

		ctrl.removerIndustria = function (representacao) {
			let deveSalvar = false;
			ctrl.representacoes.forEach(function (item, i) {
				if (!item.id) {
					deveSalvar = true;
				}
			});
			if (deveSalvar) {
				modalAvisoNecessarioSalvar();
			} else {
				modalConfirmaRemoverRepresentacao(representacao).then(() => {
					if (representacao.id) {
						UsuarioService.removerRepresentacao(representacao.id).then(() => {
							ctrl.selecionaTabRepresentacao();
						});
					} else {
						let index = null;
						ctrl.representacoes.forEach(function (item, i) {
							if (item.idIndustria === representacao.idIndustria) {
								index = i;
							}
						});
						if (index) {
							ctrl.representacoes.splice(index);
						}
					}
					NotificationService.success('Representação excluída com sucesso!')
				}, () => {
					NotificationService.success('Operação cancelada.');
				});
			}
		}

		ctrl.salvaUsuario = function () {
			ajustesCriptografiaSenha()
			ctrl.cadastro.representacoes = ctrl.representacoes
			if (validaSenha()) {
				var usuarioAtivo = ctrl.cadastro.id != null ? true : false;
				UsuarioService.salvaUsuario(ctrl.cadastro).then((idUsuario) => {
					if (!usuarioAtivo) {
						NotificationService.success('Usuário cadastrado com sucesso!');
					} else {
						NotificationService.success('Cadastro atualizado!');
					}
					if ($state.current.name === 'main.usuario.edicao') {
						UsuarioService.buscaUsuarioCadastroDto(idUsuario).then(usuarioDto => {
							ctrl.cadastro = usuarioDto;
							ctrl.representacoes = ctrl.cadastro.representacoes;
						});
					} else {
						$state.go('main.usuario.edicao', { id: idUsuario });
					}
				})
			} else {
				NotificationService.error('Senhas informadas não são iguais')
			}
		}

		ctrl.excluiUsuario = function () {
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: `Ao EXCLUIR o usuário o não será mais possível acessar os dados deste! Confirma?`
			};
			ModalService.showModal({}, modalOptions).then(function (result) {
				UsuarioService.buscaUsuarioPorId(ctrl.cadastro.id).then(function (result) {
					result.excluido = true
					UsuarioService.salvaUsuario(result).then(function (usuario) {
						NotificationService.success("Usuário EXCLUÍDO com sucesso!")
						$state.go('main.usuario.pesquisa')
					})
				})
			})
		}

		ctrl.sinalizaSenhaAlterada = function () {
			ctrl.senhaAlterada = true
		}

		ctrl.isVendedor = function () {
			return LoginService.isVendedor();
		}

		ctrl.importar = function () {
			if (ctrl.cadastro.id === ctrl.importacao.usuario.id) {
				NotificationService.alert('Não é possível importar para o mesmo usuário')
				return
			}
			var importacaoUsuarioDto = {
				idUsuarioOrigem: ctrl.importacao.usuario.id,
				idUsuarioDestino: ctrl.cadastro.id
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
					UsuarioService.importarBaseUsuario(result).then(function (importacaoResult) {
						NotificationService.success(`Importação realizada com sucesso! ${importacaoResult} clientes importados.`)
						ctrl.importacao.usuario = null
						ctrl.selecionaTabRepresentacao()
					})
				});
			})
		}

		ctrl.verificaUsuarioCadastradoPorLogin = () => {
			UsuarioService.buscaUsuarioPorLogin(ctrl.cadastro.login).then(result => {
				if (result) {
					if (ctrl.cadastro.id && ctrl.cadastro.id == result.id) {
						return
					}
					NotificationService.error('Login do usuário já existente')
					ctrl.cadastro.login = null
				}
			});
		}

		ctrl.exibeSenha = () => {
			
			if(ctrl.cadastro.senha.senha1.localeCompare(ctrl.cadastro.senha.senha2) != 0) {
				NotificationService.error('Senhas digitadas não coincidem')
				return
			}
			if(ctrl.senhaAlterada) {
				NotificationService.alert(`Senhas digitadas: ${ctrl.cadastro.senha.senha1} - ${ctrl.cadastro.senha.senha2}`)
			} else {
				let senha1 = LoginService.getPassword(ctrl.cadastro.senha.senha1)
				let senha2 = LoginService.getPassword(ctrl.cadastro.senha.senha2)
				NotificationService.alert(`Senhas digitadas: ${senha1} - ${senha2}`)
			}
		}

		function modalConfirmaRemoverRepresentacao(representacao) {
			const deferred = $q.defer();
			var modalOptions = {
				closeButtonText: 'Não',
				actionButtonText: 'Sim',
				headerText: 'Confirmar',
				bodyText: `Confirma exclusão da representação de ${representacao.nomeUsuario} para ${representacao.nomeIndustria}?`
			};
			ModalService.showModal({}, modalOptions).then(function (result) {
				deferred.resolve(true);
			}, function () {
				deferred.reject(true);
			});
			return deferred.promise;
		}

		function modalAvisoNecessarioSalvar() {
			var modalOptions = {
				headerText: 'Remover representação',
				actionButtonText: 'Ok',
				bodyText: `Você deve salvar as alterações antes de efetuar esta exclusão.`,
				showCloseButton: false
			};
			ModalService.showModal({}, modalOptions).then(() => {
				return;
			});
		}

		function ajustesCriptografiaSenha() {
			if (ctrl.cadastro.id) {
				if (ctrl.senhaAlterada && ctrl.senhaOriginal != ctrl.cadastro.senha.senha1) {
					ctrl.cadastro.senha.senha1 = LoginService.encodePassword(ctrl.cadastro.senha.senha1)
					ctrl.cadastro.senha.senha2 = LoginService.encodePassword(ctrl.cadastro.senha.senha2)
				}
			} else {
				ctrl.cadastro.senha.senha1 = LoginService.encodePassword(ctrl.cadastro.senha.senha1)
				ctrl.cadastro.senha.senha2 = LoginService.encodePassword(ctrl.cadastro.senha.senha2)
			}
		}

		function validaSenha() {
			return ctrl.cadastro.senha.senha1 === ctrl.cadastro.senha.senha2
		}
	}
})
